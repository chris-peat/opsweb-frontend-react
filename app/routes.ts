import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    index("./routes/mainMenu.tsx"),
    route("settings", "./routes/settings.tsx"),
    route("users", "./routes/users.tsx"),
    route("scheduled-passes", "./routes/scheduledPasses.tsx"),
  ]),
] satisfies RouteConfig;
