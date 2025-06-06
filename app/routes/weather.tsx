import { useQuery } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowUpIcon, CalendarSearchIcon, CloudRainIcon, CloudSnowIcon, CloudSunIcon, SunIcon, ThermometerIcon, ThermometerSnowflakeIcon, ThermometerSunIcon, WindIcon } from "lucide-react";
import { getWeatherForecast, type WeatherForecastDay } from "~/api/weather";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

export function meta() {
  return [
    { title: "Homepage - Weather forecast" },
    { name: "description", content: "Some forecasts for you" },
  ];
}

export default function WeatherForecast() {
  const { data: forecastData, isPending } = useQuery({
    queryFn: getWeatherForecast,
    queryKey: ['weather-forecast'],
    refetchInterval: 60 * 1000 * 60, // 60 minutes
  });

  return (
    <Card className="w-full max-w-5xl flex flex-col items-center min-h-0">
      <CardHeader className="w-full text-center font-bold">
        <div className="text-4xl">Weather forecast{(!isPending && forecastData) ? ` in ${forecastData.location.name}, ${forecastData.location.country}` : ''}</div>
        <div className="text-2xl">{(!isPending && forecastData) ? ' for the next 2 days' : ' is loading ...'}</div>
        <p className="font-light text-sm text-center">
          Last updated {forecastData ? new Date(forecastData.current.last_updated).toLocaleString() : ' - not yet!'}
        </p>
      </CardHeader>
      <Separator />
      <CardContent>
        {forecastData ? (
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CalendarSearchIcon />
                <span className="truncate">Day</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudSunIcon />
                <span className="truncate">Weather condition</span>
              </div>
              <div className="flex items-center gap-2">
                <ThermometerIcon />
                <span className="truncate">Average temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudRainIcon />
                <span className="truncate">Chance of rain</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudSnowIcon />
                <span className="truncate">Chance of snow</span>
              </div>
              <div className="flex items-center gap-2">
                <ThermometerSunIcon /><span className="truncate">Max. temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <ThermometerSnowflakeIcon />
                <span className="truncate">Min. temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <SunIcon />
                <span className="truncate">UV index</span>
              </div>
              <div className="flex items-center gap-2">
                <WindIcon />
                <span className="truncate">Max. wind speed</span>
              </div>
            </div>
            <ScrollArea className="flex flex-col">
              <div className="flex gap-8">
                {forecastData.forecast.forecastday.map((day, i) => (
                  <ForecastDay key={day.date_epoch} day={day} prevDay={forecastData.forecast.forecastday[i - 1]} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ) : null}
      </CardContent>
      <Separator />
      <CardFooter>
        <small className="text-xs opacity-50">
          Forecast data from <a href="https://www.weatherapi.com/" target="_blank" rel="noreferrer">WeatherAPI</a>, updated every hour.
        </small>
      </CardFooter>
    </Card>
  );
}

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: undefined,
  weekday: undefined,
}

function ForecastDay({ day, prevDay }: { day: WeatherForecastDay, prevDay?: WeatherForecastDay }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center justify-center">
        <span className="text-xl font-extrabold">
          {new Date(day.date).toLocaleDateString(navigator.language, { weekday: 'long' })}
        </span>
        <span className="text-xs opacity-75">
          {new Date(day.date).toLocaleDateString(navigator.language, dateFormatOptions)}
        </span>
      </div>
      <div className="flex gap-1 items-center">
        <span>{day.day.condition.text}</span>
      </div>
      <div className="flex gap-1 items-center">
        <ValueDifferenceArrow valueKey="avgtemp_c" day={day} prevDay={prevDay} />
        <span>{day.day.avgtemp_c} °C</span>
      </div>
      <div className="flex gap-1 items-center">
        <ValueDifferenceArrow valueKey="daily_chance_of_rain" day={day} prevDay={prevDay} />
        <span>{day.day.daily_chance_of_rain}%</span>
      </div>
      <div className="flex gap-1 items-center">
        <ValueDifferenceArrow valueKey="daily_chance_of_snow" day={day} prevDay={prevDay} />
        <span>{day.day.daily_chance_of_snow}%</span>
      </div>
      <div className="flex gap-1 items-center">
        <ValueDifferenceArrow valueKey="maxtemp_c" day={day} prevDay={prevDay} />
        <span>{day.day.maxtemp_c} °C</span>
      </div>
      <div className="flex gap-1 items-center">
        <ValueDifferenceArrow valueKey="mintemp_c" day={day} prevDay={prevDay} />
        <span>{day.day.mintemp_c} °C</span>
      </div>
      <div className="flex gap-1 items-center">
        <ValueDifferenceArrow valueKey="uv" day={day} prevDay={prevDay} />
        <span>{day.day.uv}</span>
      </div>
      <div className="flex gap-1 items-center">
        <ValueDifferenceArrow valueKey="maxwind_kph" day={day} prevDay={prevDay} />
        <span>{day.day.maxwind_kph} km/h</span>
      </div>
    </div>
  )
}

function ValueDifferenceArrow({ valueKey, day, prevDay }: { valueKey: keyof WeatherForecastDay['day'], day: WeatherForecastDay, prevDay?: WeatherForecastDay }) {
  if (!prevDay) {
    return;
  }
  if (day.day[valueKey] < prevDay.day[valueKey]) {
    return <ArrowDownIcon className="text-red-500" />;
  }
  if (day.day[valueKey] > prevDay.day[valueKey]) {
    return <ArrowUpIcon className="text-green-500" />;
  }
  return null;
}
