import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/root-layout.tsx", [
    // index
    index("routes/home.tsx"),
    // apps
    route('todos', 'routes/todos.tsx'),
    // misc
    route('ai', 'routes/ai.tsx'),
    route('calendar', 'routes/calendar.tsx'),
    route('weather', 'routes/weather.tsx'),
    route('stats', 'routes/stats.tsx'),
    route('settings', 'routes/settings.tsx'),
    route('*', 'routes/not-found.tsx')
  ]),
] satisfies RouteConfig;
