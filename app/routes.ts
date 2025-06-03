import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/root-layout.tsx", [
    // index
    index("routes/home.tsx"),
    // apps
    route('todos', 'routes/todos.tsx'),
    // misc
    route('about', 'routes/about.tsx'),
    route('*', 'routes/not-found.tsx')
  ]),
] satisfies RouteConfig;
