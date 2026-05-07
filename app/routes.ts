import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  index("./routes/index.tsx"),
  route("login", "./routes/login.tsx"),
  route("project/:projectId", "./routes/layout.tsx", [
    index("./routes/mainMenu.tsx"),
    route("settings", "./routes/settings.tsx"),
    route("users", "./routes/users.tsx"),
    route("scheduled-passes", "./routes/scheduledPasses.tsx"),
    route("time-converter", "./routes/timeConverterPage.tsx"),
   ]),
] satisfies RouteConfig;
