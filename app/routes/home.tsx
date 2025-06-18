import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Clock, getCurrentDate } from "~/components/clock";
import { WeatherWidget } from "~/components/weatherWidget";
import { BookmarkList } from "~/components/bookmarkList";
import { FEATURES } from "~/components/header";
import { HotKey } from "~/components/ui/hotkey";
import { CalendarDaysIcon } from "lucide-react";
import { useTypesafeTranslation } from "~/i18n";

export function meta() {
  return [
    { title: "Homepage" },
    { name: "description", content: "Welcome to the internet" },
  ];
}

export default function HomePage() {
  const t = useTypesafeTranslation();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            <CalendarDaysIcon />
            <span className="inline text-4xl">
              {t('home.currentDate', { date: getCurrentDate({ year: undefined }) })}
            </span>
          </div>
          <Clock className="border rounded-md p-4 text-5xl" />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-[3fr_auto_7fr] gap-8 space-y-6">
        <div className="flex flex-col h-full justify-between gap-8">
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
  const t = useTypesafeTranslation();

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
      <li className="mt-1 text-xs text-right opacity-50">{t('hotkey.header')}</li>
    </ul>
  )
}
