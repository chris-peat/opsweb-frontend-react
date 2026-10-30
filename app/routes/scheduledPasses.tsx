import EventTable from "~/components/eventTable";
import type { Route } from "../+types/root";
import { type TypedDocumentNode, gql } from "@apollo/client";
import { getClient } from "~/apollo";
import { useLoaderData } from "react-router";
import { type IEvent } from "~/models/event";
import type { IDisplayStation } from "~/components/groundTrack/groundTrackProps";
import EventPlot from "~/components/timeline/eventPlot";
import TimelineRow from "~/components/timeline/timelineRow";
import TimelineDisplay from "~/components/timeline/timelineDisplay";
import GroundTrack from "~/components/groundTrack/groundTrack";
import ProfilePlot from "~/components/timeline/profilePlot/profilePlot";
import { Constants, Earth, GroundStation, Sgp4Orbit } from "@heavens-above/astrolib-ts";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  let apolloClient = getClient();
  let projectId = params.projectId?.replace(":", "");
  const { data } = await apolloClient.query({
    query: GET_GDS_EVENTS_FOR_PROJECT,
    variables: {
      projectId: projectId,
      input: {
        project: projectId,
        startTime: (new Date(Date.now() - 2 * 86400000)).toISOString(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Pass",
      }
    }
  });

  let stations = data?.project.groundStations.map((station: any) => ({
    id: station.id,
    name: station.name,
    color: station.color,
    zoneColor: station.color,
    zoneBorderColor: "gray",
    //zoneBorderColor: station.color,
    gdsNameMappings: station.gdsNameMappings,
    textColor: "black",
    iconColor: "black",
    showIcon: true,
    latitude: station.latitude,
    longitude: station.longitude,
  })) as IDisplayStation[] || [];

  let events = (data?.gdsSchedule.scheduledEvents || []).map((event: any) => ({
    id: event.id,
    startTime: new Date(event.startTime),
    properties: {
      Station: event.station,
      Description: event.description,
      MaxElev: event.maxElev,
      Duration: event.endTime ? (new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) : 0,
    }
  })) as IEvent[];

  return {
    events,
    project: data?.project,
    stations
  };
}

function lookupStation(gdsStationId: string, stations: IDisplayStation[]): IDisplayStation | null {
  for (let station of stations) {
    for (let regex of station.gdsNameMappings) {
      if (new RegExp(regex).test(gdsStationId)) {
        return station;
      }
    }
  }
  return null;
}

const GET_GDS_EVENTS_FOR_PROJECT: TypedDocumentNode<
  {
    gdsSchedule: { scheduledEvents: any },
    project: {
      id: string,
      groundStations: {
        id: string,
        name: string,
        color: string,
        gdsNameMappings: string[],
        latitude: number,
        longitude: number,
      }[],
      satellites: {
        id: string,
        gdsName: string,
        currentOrbit: {
          tle: string,
        }
      }[]
    }
  }
> = gql`
  query ($input: ScheduledEventSelectionInput!, $projectId: String!) {
    project(id: $projectId) {
      id
      groundStations {
        id
        name
        color
        latitude
        longitude
        gdsNameMappings
      },
      satellites {
        id
        gdsName
        currentOrbit {
          tle
        }
      }
    }
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

export const handle = {
  breadcrumbs: [{
    path: "/project/:projectId/scheduled-passes",
    text: "Scheduled Passes"
  }]
};

export default function ScheduledPasses() {
  const { events, project, stations } = useLoaderData() as { events: IEvent[], project: any, stations: IDisplayStation[] };

  let duration = 86400 * 1000;
  let primarySatellite = project?.satellites?.[0];
  let primaryOrbit = new Sgp4Orbit(primarySatellite?.currentOrbit.tle);

  let passPlots = stations.map((station: any) => (
    <TimelineRow height={10} key={station.id}>
      <div className="p-1">{station.name}</div>
      <EventPlot events={events} bgdColor="white" eventColor={station.zoneColor} eventFilter={(event) => {
        const gdsStationId = event.properties["Station"];
        const eventStation = lookupStation(gdsStationId, stations);
        return eventStation?.id === station.id;
      }} />
    </TimelineRow>
  ));

  let elevationPlots = stations.map((station: any) => (
    <TimelineRow height={20} key={station.id + "_profile"}>
      <div className="p-1">{station.name}</div>
      <ProfilePlot
        bgdColor="white"
        yMin={0}
        yMax={90}
        profiles={[
          {
            color: "black",
            fillColor: station.zoneColor,
            lineWidth: 2,
            profileFunction: (time: number) => {
              const satPosInertial = primaryOrbit.getPos(time);
              const satPosGeographic = satPosInertial.rotateAboutZAxis(-Earth.gha(time))
              const gs = new GroundStation(station.latitude, station.longitude, 0);
              const stationToSatVector = satPosGeographic.subtract(gs.position);
              const matrix = gs.geographicToTopocentricMatrix();
              const satPosTopocentric = matrix.multiplyVector(stationToSatVector);
              return satPosTopocentric.latitude * Constants.RADTODEG;
            }
          }
        ]}
      />
    </TimelineRow>
  ));

  //let allPlots = passPlots.concat(elevationPlots);

  return (
    <div>
      <div className="flex text-xl flex-wrap gap-10">
        <div className="flex-2">
          <p className="mb-3">Scheduled Passes</p>
          <EventTable rowCount={10} pastEventCount={2} imminentEventThreshhold={30} events={events} getRowColor={(event) => {
            const gdsStationId = event.properties["Station"];
            const station = lookupStation(gdsStationId, stations);
            return station ? station.zoneColor : "white";
          }} />
        </div>
        <div className="flex-1">
          <p className="mb-3">Ground track</p>
          <div className="border inline-block">
            <GroundTrack
              width={800}
              height={400}
              backgroundSrc="/client/coastline600.png"
              minElev={0}
              stations={stations}
              satellites={project?.satellites?.map((sat: any) => ({
                orbitColor: "red",
                textColor: "black",
                tle: sat.currentOrbit.tle,
                orbitsToShow: 1,
                text: sat.gdsName
              })) ?? []}
            />
          </div>
        </div>
        <div className="flex-1">
          <p className="mb-3">Ground Stations</p>
          <table className="table-auto border">
            <tbody className="border">
              {stations?.map((station: any) => (
                <tr style={{ backgroundColor: station.color }} key={station.id}>
                  <td className="border px-1">{station.id}</td>
                  <td className="border px-1">{station.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="my-10" />
      <p className="mb-3 text-xl">Scheduled Pass Timeline</p>
      <TimelineDisplay duration={duration}>
        {passPlots}
      </TimelineDisplay>
      <div className="my-10" />
      <p className="mb-3 text-xl">Station Elevation Timeline</p>
      <TimelineDisplay duration={duration}>
        {elevationPlots}
      </TimelineDisplay>
    </div>
  );
}

