import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Clock, getCurrentDate } from "~/components/ui/clock";
import { WeatherWidget } from "~/components/weatherWidget";
import { BookmarkList } from "~/components/bookmarkList";
import { FEATURES } from "~/components/header";
import { HotKey } from "~/components/ui/hotkey";
import { CalendarDays } from "lucide-react";

export function meta() {
  return [
    { title: "Homepage" },
    { name: "description", content: "Welcome to the internet" },
  ];
}

export default function Home() {
  return (
    <Card className="w-full max-w-5xl flex flex-col items-center min-h-0">
      <CardHeader className="w-full text-center font-bold text-4xl">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            <CalendarDays />
            <span className="inline text-4xl">Today is {getCurrentDate()}</span>
          </div>
          <Clock className="border rounded-md p-4 text-5xl" />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="grid grid-cols-1 md:grid-cols-[3fr_auto_7fr] gap-8 w-full space-y-6 px-4">
        <div className="flex flex-col justify-between gap-4">
          <WeatherWidget />
          <FeatureList />
        </div>
        <Separator orientation="vertical" />
        <BookmarkList />
      </CardContent>
    </Card>
  );
}

function FeatureList() {
  return (
    <ul>
      {FEATURES.map(({ href, name, description, Icon, hotkey }) => (
        <li key={href}>
          <Link viewTransition to={href} title={description} className="flex gap-2 items-center hover:bg-primary/10 rounded-sm px-2">
            <Icon className="inline" size={16} />
            <div className="grid grid-cols-[1fr_auto] w-full">
              <div className="leading-8">{name}</div>
              <HotKey className="leading-8">{hotkey}</HotKey>
            </div>
          </Link>
        </li>
      ))}
      <li className="mt-1 text-xs text-right opacity-50">(to come back <i>home</i>, press Shift + Space)</li>
    </ul>
  )
}
