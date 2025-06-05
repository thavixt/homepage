import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { AppWindowIcon, BookOpenIcon, CalendarIcon, CheckCircleIcon, CloudSunIcon, NotebookPenIcon, WorkflowIcon } from "lucide-react";
import { Clock, getCurrentDate } from "~/components/clock";
import { WeatherWidget } from "~/components/weather";
import { Bookmarks } from "~/components/bookmarks";
import { Label } from "@radix-ui/react-context-menu";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to the internet" },
  ];
}

const APPS = [
  { href: "/todos", name: "Todos", Icon: CheckCircleIcon },
  { href: "/notes", name: "Notes", Icon: NotebookPenIcon },
  { href: "/calendar", name: "Calendar", Icon: CalendarIcon },
  { href: "/weather", name: "Weather forecast", Icon: CloudSunIcon },
].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

const RESOURCES = [
  { href: "https://reactrouter.com/docs", name: "React Router - multi-strategy routing" },
  { href: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts", name: "Redux - state management" },
  { href: 'https://tailwindcss.com/docs/installation/using-vite', name: 'Tailwind - installation & usage' },
  { href: 'https://ui.shadcn.com/', name: 'Shadcn - pre-made components' },
  { href: 'https://lucide.dev/icons', name: 'Lucide - search for icons' },
  { href: 'https://vite.dev/guide/#scaffolding-your-first-vite-project', name: 'Vite - scaffolding a project' },
].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

export default function Home() {
  return (
    <Card className="w-full max-w-5xl flex flex-col items-center gap-8 min-h-0">
      <CardHeader className="w-full text-center font-bold text-4xl">
        <div className="flex gap-4 items-center justify-between">
          <span className="inline">Today is {getCurrentDate()}.</span>
          <Clock />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_auto_2fr] gap-8 w-full space-y-6 px-4">
        <div className="grid grid-rows-[auto_1fr_auto] gap-4">
          <WeatherWidget />
          <div className="flex flex-col">
            <div className="flex gap-2 items-center pb-1">
              <WorkflowIcon />
              <Label className="ml-1">Applications</Label>
            </div>
            <ul>
              {APPS.map(({ href, name: text, Icon }) => (
                <li key={href}>
                  <Link className="flex gap-2 items-center" to={href}>
                    <Icon className="inline" size={16} />
                    <span>{text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Separator className="mb-4" />
            <div className="flex gap-2 items-center pb-1">
              <BookOpenIcon />
              <Label className="ml-1">Frequent resources:</Label>
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
          <Bookmarks />
        </div>
      </CardContent>
    </Card>
  );
}
