import PassLogsSER from "~/components/passLogs/passLogsSER";
import ShiftHandoverLogsH2S from "~/components/shiftHandoverLogs/shiftHandOverLogsH2S";

export const handle = {
  breadcrumbs: [{
    path: "/project/:projectId/pass-logs",
    text: "Pass Logs"
  }]
};

export default function PassLogs() {
  return (
    <div className="flex items-center justify-center py-4">
      <PassLogsSER />
    </div>
  );
}
