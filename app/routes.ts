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
    index("./routes/projectHome.tsx"),
    route("users", "./routes/users.tsx"),
    route("scheduled-passes", "./routes/scheduledPasses.tsx"),
    route("time-converter", "./routes/timeConverterPage.tsx"),
    route("shift-handover-logs", "./routes/shiftHandoverLogs.tsx"),
    route("shift-handover-logs/:number", "./routes/shiftHandoverLog.tsx"),
    route("pass-logs", "./routes/passLogs.tsx"),
    route("pass-logs/:number", "./routes/passLog.tsx"),
  ]),
] satisfies RouteConfig;
