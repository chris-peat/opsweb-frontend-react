import { useParams } from "react-router";
import PassLogSER from "~/components/passLogs/passLogSER";

export const handle = {
  breadcrumbs: [
    {
      path: "/project/:projectId/pass-logs",
      text: "Pass Logs"
    },
    {
      path: "/project/:projectId/pass-log",
      text: "Pass Log"
    }
  ]
};

export default function PassLog() {
  const params = useParams()
  return (
    <div className="flex items-center justify-center py-4">
      <PassLogSER number={params.number ? parseInt(params.number.replace(":", "")) : 0} />
    </div>
  );
}
