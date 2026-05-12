import { type TypedDocumentNode, gql } from "@apollo/client";
import { getClient } from "~/apollo";
import TimeConverter from "~/components/timeConverter/timeConverter";
import type { Route } from "./+types";
import { Link, useLoaderData } from "react-router";
import ShiftHandoverLogH2S from "~/components/shiftHandoverLogs/shiftHandOverLogH2S";

export const handle = {
  breadcrumb: {
    path: "/project/:projectId/shift-handover-log",
    text: "Shift Handover Log"
  }
};

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

export default function ShiftHandoverLog() {
  const data = useLoaderData() as { leapSeconds: string[] };

  return (
    <div className="m-auto py-4">
      <ShiftHandoverLogH2S />
    </div>
  );
}

