import EventTable from "~/components/eventTable";
import type { Route } from "../+types/root";
import { type TypedDocumentNode, gql } from "@apollo/client";
import { getClient } from "~/apollo";
import type { IProject } from "~/models/project";
import type { IUser } from "~/models/user";
import { useLoaderData, useParams } from "react-router";
import { type IEvent } from "~/models/event";
import EventPlot from "~/components/timeline/eventPlot";
import TimeScale from "~/components/timeline/timeScale";
import PlotContainer from "~/components/timeline/plotContainer";
import LegendContainer from "~/components/timeline/legendContainer";
import PlotOverlay from "~/components/timeline/plotOverlay";
import Timeline from "~/components/timeline/timelineDisplay";
import TimelineRow from "~/components/timeline/timelineRow";
import TimelineDisplay from "~/components/timeline/timelineDisplay";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  let apolloClient = getClient();
  const { data } = await apolloClient.query({
    query: GET_GDS_EVENTS_FOR_PROJECT,
    variables: {
      input: {
        project: params.projectId?.replace(":", ""),
        startTime: (new Date(Date.now() - 2 * 86400000)).toISOString(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Pass",
      }
    }
  });
  return (data?.gdsSchedule.scheduledEvents || []).map((event: any) => ({
    id: event.id,
    startTime: new Date(event.startTime),
    properties: {
      Station: event.station,
      Description: event.description,
      MaxElev: event.maxElev,
      Duration: event.endTime ? (new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) : 0,
    }
  })) as IEvent[];
}

const GET_GDS_EVENTS_FOR_PROJECT: TypedDocumentNode<
  { gdsSchedule: { scheduledEvents: any } }
> = gql`
  query ($input: ScheduledEventSelectionInput!) {
    gdsSchedule {
      scheduledEvents(input: $input) {
        id
        startTime
        endTime
        project
        description
        maxElev
        station
      }
    }
  }
`;

const groundStations = new Map();
groundStations.set("INU", { name: "Inuvik", lat: 64.8, lon: -147.9, color: "#cff" });
groundStations.set("WHM", { name: "Weilheim",lat: 19.8, lon: -155.5, color: "#ccf" });
groundStations.set("NSG", { name: "Neustrelitz",lat: 19.8, lon: -155.5, color: "#cfc" });
groundStations.set("SGS", { name: "Svalbard",lat: 19.8, lon: -155.5, color: "#ffc" });
groundStations.set("WGS", { name: "Wallops",lat: 19.8, lon: -155.5, color: "#fcf" });
groundStations.set("MGS", { name: "McMurdo",lat: 19.8, lon: -155.5, color: "#fcc" });
groundStations.set("ASF", { name: "Alaska Satellite Facility",lat: 19.8, lon: -155.5, color: "#cff" });
groundStations.set("NYA", { name: "Ny-Ålesund",lat: 19.8, lon: -155.5, color: "#ccc" });
groundStations.set("OHG", { name: "o'Higgins",lat: 19.8, lon: -155.5, color: "#fcc" });


export default function ScheduledPasses() {
  const events = useLoaderData() as IEvent[];

  let duration = 86400 * 1000 / 2;

  return (
    <div>Scheduled Passes
      <EventTable rowCount={10} pastEventCount={2} imminentEventThreshhold={30} events={events} />
      <div className="my-10" />
      
      <TimelineDisplay duration={duration}>
        <TimelineRow height={10}>
          <div className="p-1">Inuvik</div>
          <EventPlot events={events} bgdColor="#cfc" eventColor="#fff" eventFilter={(ev:IEvent) => ev.properties.Station === "INU"} />
        </TimelineRow>
        <TimelineRow height={10}>
          <div className="p-1">WHM</div>
          <EventPlot events={events} bgdColor="#ccf" eventColor="#fff" eventFilter={(ev:IEvent) => ev.properties.Station.startsWith("WHM")} />
        </TimelineRow>
        <TimelineRow height={10}>
          <div className="p-1">OHG</div>
          <EventPlot events={events} bgdColor="#cff" eventColor="#fff" eventFilter={(ev:IEvent) => ev.properties.Station === "DFD OHG"} />
        </TimelineRow>
        <TimelineRow height={10}>
          <div className="p-1">NSG</div>
          <EventPlot events={events} bgdColor="#fcf" eventColor="#fff" eventFilter={(ev:IEvent) => ev.properties.Station === "NSG"} />
        </TimelineRow>
      </TimelineDisplay>
    </div>
  );
}

