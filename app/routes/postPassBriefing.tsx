import { useParams } from "react-router";
import PostPassBriefingSER from "~/components/postPassBriefings/postPassBriefingSER";

export const handle = {
  breadcrumbs: [
    {
      path: "/project/:projectId/post-pass-briefings",
      text: "Post Pass Briefings"
    },
    {
      path: "/project/:projectId/post-pass-briefing",
      text: "Post Pass Briefing"
    }
  ]
};

export default function PostPassBriefing() {
  const params = useParams()
  return (
    <div className="flex items-center justify-center py-4">
      <PostPassBriefingSER number={params.number ? parseInt(params.number.replace(":", "")) : 0} />
    </div>
  );
}
