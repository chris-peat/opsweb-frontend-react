import EventTable from "~/components/eventTable";
import type { Route } from "../+types/root";
import { type TypedDocumentNode, gql } from "@apollo/client";
import { getClient } from "~/apollo";
import type { IProject } from "~/models/project";
import type { IUser } from "~/models/user";
import { useLoaderData } from "react-router";
import { type IEvent } from "~/models/event";
import EventPlot from "~/components/timeline/eventPlot";
import TimeScale from "~/components/timeline/timeScale";
import PlotContainer from "~/components/timeline/plotContainer";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  let apolloClient = getClient();
  const { data } = await apolloClient.query({
    query: GET_GDS_EVENTS_FOR_PROJECT,
    variables: {
      input: {
        project: "TD1",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Pass",
      }
    }
  });
  return (data?.gdsSchedule.scheduledEvents || []).map((event: any) => ({
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

export default function ScheduledPasses() {
  const events = useLoaderData() as IEvent[];

  let width = 1200;
  let startTime = new Date(Date.now() - 1 * 3600 * 1000);
  let duration = 2 * 3600 * 1000;

  return (
    <div>Scheduled Passes
      <EventTable rowCount={10} events={events} />
      <div className="my-10" />
      <PlotContainer width={width} startTime={startTime} duration={duration}>
        <EventPlot events={events} width={width} height={40} bgdColor="#cfc" eventColor="#fff" startTime={startTime} duration={duration} />
        <p />
        <EventPlot events={events} width={width} height={40} bgdColor="#cff" eventColor="#000" startTime={startTime} duration={duration} />
      </PlotContainer>
      <p />
      <TimeScale width={width} height={20} bgdColor="#ccc" startTime={startTime} duration={duration} />
    </div>
  );
}

