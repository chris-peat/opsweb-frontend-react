import { type TypedDocumentNode, gql } from "@apollo/client";
import { getClient } from "~/apollo";
import TimeConverter from "~/components/timeConverter/timeConverter";
import type { IProject } from "~/models/project";
import type { Route } from "./+types";
import { useLoaderData } from "react-router";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  let apolloClient = getClient();
  const { data } = await apolloClient.query({
    query: GET_LEAP_SECONDS,
  });
  return data;
}

// TypedDocumentNode definition with types
const GET_LEAP_SECONDS: TypedDocumentNode<{ leapSeconds: string[] }> =
  gql`
    query LeapSeconds {
      leapSeconds
  }
  `;

export default function TimeConverterPage() {
  const data = useLoaderData() as { leapSeconds: string[] };
  
  return (
    <div className="m-auto">
      <div className="text-2xl mb-4">Time Converter</div>
      <TimeConverter missionStart={undefined} leapSeconds={data.leapSeconds.map((date) => new Date(Date.parse(date)))} />
    </div>
  );
}

