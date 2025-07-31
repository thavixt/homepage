import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/root-layout.tsx", [
    index("routes/home.tsx"),
    route('todos', 'routes/todos.tsx'),
    route('ai', 'routes/ai.tsx'),
    route('calendar', 'routes/calendar.tsx'),
    route('weather', 'routes/weather.tsx'),
    route('stats', 'routes/stats.tsx'),
    route('settings', 'routes/settings.tsx'),
    route('*', 'routes/not-found.tsx')
  ]),
] satisfies RouteConfig;
