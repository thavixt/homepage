import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { BookOpenIcon } from "lucide-react";
import { Clock, getCurrentDate } from "~/components/clock";
import { WeatherWidget } from "~/components/weather";
import { BookmarkList } from "~/components/bookmarkList";
import { Label } from "@radix-ui/react-context-menu";
import { FEATURES } from "~/components/header";
import { sortBy } from "~/lib/utils";

export function meta() {
  return [
    { title: "Homepage" },
    { name: "description", content: "Welcome to the internet" },
  ];
}

const RESOURCES = sortBy(
  'name',
  [
    { href: "https://reactrouter.com/docs", name: "React Router - multi-strategy routing" },
    { href: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts", name: "Redux - state management" },
    { href: 'https://tailwindcss.com/docs/installation/using-vite', name: 'tailwindcss - utility-first CSS framework' },
    { href: 'https://ui.shadcn.com/', name: 'shadcn - pre-made components' },
    { href: 'https://lucide.dev/icons', name: 'Lucide - search for icons' },
    { href: 'https://vite.dev/guide/#scaffolding-your-first-vite-project', name: 'Vite - scaffolding a project' },
    { href: 'https://tanstack.com/query/latest/docs/framework/react/installation', name: 'TanStack Query - data-fetching library' },
  ],
);

export default function Home() {
  return (
    <Card className="w-full max-w-5xl flex flex-col items-center min-h-0">
      <CardHeader className="w-full text-center font-bold text-4xl">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-4xl">
          <span className="inline">Today is {getCurrentDate()}.</span>
          <Clock />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_auto_2fr] gap-8 w-full space-y-6 px-4">
        <div className="grid grid-rows-[auto_1fr_auto_auto] gap-4">
          <WeatherWidget />
          <div className="flex flex-col">
            <ul>
              {FEATURES.map(({ href, name: text, Icon }) => (
                <li key={href}>
                  <Link viewTransition to={href} className="flex gap-2 items-center">
                    <Icon className="inline" size={16} />
                    <span>{text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div>
            <div className="flex gap-2 items-center pb-1">
              <BookOpenIcon />
              <Label className="ml-1">Frequently used resources:</Label>
            </div>
            <ul>
              {RESOURCES.map(({ href, name }) => (
                <li key={href}>
                  <a href={href} rel="noreferrer" target="_blank">{name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Separator orientation="vertical" />
        <div className="flex">
          <BookmarkList />
        </div>
      </CardContent>
    </Card>
  );
}
