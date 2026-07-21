import ShiftHandoverLogsH2S from "~/components/shiftHandoverLogs/shiftHandOverLogsH2S";

export const handle = {
  breadcrumbs: [{
    path: "/project/:projectId/shift-handover-logs",
    text: "Shift Handover Logs"
  }]
};

export default function ShiftHandoverLogs() {
  return (
    <div className="flex items-center justify-center py-4">
      <ShiftHandoverLogsH2S />
    </div>
  );
}
