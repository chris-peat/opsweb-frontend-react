import { type TypedDocumentNode, gql } from "@apollo/client";
import { getClient } from "~/apollo";
import type { Route } from "../+types/root";
import { Link, useLoaderData } from "react-router";
import ShiftHandoverLogH2S from "~/components/shiftHandoverLogs/shiftHandOverLogH2S";
import type { IGenericReport } from "~/models/genericReport";
import { SELECT_GENERIC_REPORT_BY_PROJECT_TYPE_NUMBER } from "~/graphQLQueries";


export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {

  if (!params.number || params.number === ":0") {
    return undefined;
  }

  let apolloClient = getClient();
  const { data } = await apolloClient.query({
    query: SELECT_GENERIC_REPORT_BY_PROJECT_TYPE_NUMBER,
    variables: {
      projectId: params.projectId?.replace(":", ""),
      type: "SHL",
      number: parseInt(params.number?.replace(":", "") || "0"),
    }
  });

  if (!data?.project?.genericReport)
    return undefined;

  let report = { ...data.project.genericReport };
  try {
    report.detail = JSON.parse(report.detail);
  } catch (error) {
    report.detail = null;
  }

  return report;
}

export const handle = {
  breadcrumbs: [
    {
      path: "/project/:projectId/shift-handover-logs",
      text: "Shift Handover Logs"
    },
    {
      path: "/project/:projectId/shift-handover-log",
      text: "Shift Handover Log"
    }
  ]
};

export default function ShiftHandoverLog() {
  const report = useLoaderData() as IGenericReport | undefined;

  return (
    <div className="flex items-center justify-center py-4">
      <ShiftHandoverLogH2S report={report} />
    </div>
  );
}
