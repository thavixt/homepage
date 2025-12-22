import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/root-layout.tsx", [
    index("routes/home.tsx"),
    route('ai', 'routes/ai.tsx'),
    route('calendar', 'routes/calendar.tsx'),
    route('privacy-policy', 'routes/privacy-policy.tsx'),
    route('settings', 'routes/settings.tsx'),
    route('stats', 'routes/stats.tsx'),
    route('todos', 'routes/todos.tsx'),
    route('weather', 'routes/weather.tsx'),
    route('dashboard', 'routes/dashboard.tsx'),
    route('*', 'routes/not-found.tsx')
  ]),
] satisfies RouteConfig;
