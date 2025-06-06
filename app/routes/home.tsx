import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Clock, getCurrentDate } from "~/components/clock";
import { WeatherWidget } from "~/components/weather";
import { BookmarkList } from "~/components/bookmarkList";
import { FEATURES } from "~/components/header";

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
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-4xl">
          <span className="inline">Today is {getCurrentDate()}.</span>
          <Clock />
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
      {FEATURES.map(({ href, name: text, Icon }) => (
        <li key={href}>
          <Link viewTransition to={href} className="flex gap-2 items-center">
            <Icon className="inline" size={16} />
            <span>{text}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}