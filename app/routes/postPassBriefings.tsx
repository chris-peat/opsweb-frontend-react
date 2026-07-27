import PostPassBriefingsSER from "~/components/postPassBriefings/postPassBriefingsSER";

export const handle = {
  breadcrumbs: [{
    path: "/project/:projectId/post-pass-briefings",
    text: "Post Pass Briefings"
  }]
};

export default function PostPassBriefings() {
  return (
    <div className="flex items-center justify-center py-4">
      <PostPassBriefingsSER />
    </div>
  );
}
