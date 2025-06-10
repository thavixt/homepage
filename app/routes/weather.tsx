import { useQuery } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowUpIcon, CalendarSearchIcon, CloudRainIcon, CloudSnowIcon, CloudSunIcon, SunIcon, ThermometerIcon, ThermometerSnowflakeIcon, ThermometerSunIcon, WindIcon } from "lucide-react";
import { Fragment } from "react";
import { getWeatherForecast, type WeatherForecastDay } from "~/api/weather";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { useTypesafeTranslation } from "~/i18n";

export function meta() {
  return [
    { title: "Homepage - Weather forecast" },
    { name: "description", content: "Some forecasts for you" },
  ];
}

export default function WeatherPage() {
  const t = useTypesafeTranslation();
  const { data: forecastData, isPending } = useQuery({
    queryFn: getWeatherForecast,
    queryKey: ['weather-forecast'],
    refetchInterval: 60 * 1000 * 60, // 60 minutes
  });

  return (
    <Card className="backdrop-blur-lg w-full max-w-5xl flex flex-col items-center min-h-0">
      <CardHeader className="w-full text-center font-bold">
        <div className="text-4xl">
          {t('weather.header', {
            location: (!isPending && forecastData)
              ? `${forecastData.location.name}, ${forecastData.location.country}`
              : '...'
          })}
        </div>
        <div className="text-2xl">{(!isPending && forecastData) ? ' for the next 2 days' : ' is loading ...'}</div>
        <p className="font-light text-sm text-center">
          {t('weather.subtitle', {
            date: forecastData
              ? new Date(forecastData.current.last_updated).toLocaleString()
              : ' - not yet!'
          })}
        </p>
      </CardHeader>
      <Separator />
      <CardContent className="min-h-[300px]">
        {forecastData ? (
          <div className="grid grid-cols-2 lg:grid-cols-[2fr_4fr] gap-4 py-4">
            <ForecastLabels />
            <ScrollArea className="flex flex-col pb-2">
              <div className="flex gap-8">
                {forecastData.forecast.forecastday.map((day, i) => (
                  <Fragment key={day.date_epoch}>
                    <ForecastDay day={day} prevDay={forecastData.forecast.forecastday[i - 1]} />
                  </Fragment>
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
          <span>{t('weather.attribution1')}</span>{" "}
          <a href="https://www.weatherapi.com/" target="_blank" rel="noreferrer">weatherapi.com</a>
          <span>{t('weather.attribution2')}</span>
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

function ForecastLabels() {
  const t = useTypesafeTranslation();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2" title={t('common.day')}>
        <CalendarSearchIcon />
        <span className="truncate">{t('common.day')}</span>
      </div>
      <div className="flex items-center gap-2" title={t('weather.condition')}>
        <CloudSunIcon />
        <span className="truncate">{t('weather.condition')}</span>
      </div>
      <div className="flex items-center gap-2" title={t('weather.temp_avg')}>
        <ThermometerIcon />
        <span className="truncate">{t('weather.temp_avg')}</span>
      </div>
      <div className="flex items-center gap-2" title={t('weather.rain_chance')}>
        <CloudRainIcon />
        <span className="truncate">{t('weather.rain_chance')}</span>
      </div>
      <div className="flex items-center gap-2" title={t('weather.snow_chance')}>
        <CloudSnowIcon />
        <span className="truncate">{t('weather.snow_chance')}</span>
      </div>
      <div className="flex items-center gap-2" title={t('weather.temp_max')}>
        <ThermometerSunIcon />
        <span className="truncate">{t('weather.temp_max')}</span>
      </div>
      <div className="flex items-center gap-2" title={t('weather.temp_min')}>
        <ThermometerSnowflakeIcon />
        <span className="truncate">{t('weather.temp_min')}</span>
      </div>
      <div className="flex items-center gap-2" title={t('weather.uv_index')}>
        <SunIcon />
        <span className="truncate">{t('weather.uv_index')}</span>
      </div>
      <div className="flex items-center gap-2" title={t('weather.wind_max')}>
        <WindIcon />
        <span className="truncate">{t('weather.wind_max')}</span>
      </div>
    </div>
  )
}

function ForecastDay({ day, prevDay }: { day: WeatherForecastDay, prevDay?: WeatherForecastDay }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center justify-center">
        <span className="font-bold">
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
