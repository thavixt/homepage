import { LoaderPinwheel } from "lucide-react";
import { getCurrentWeather } from "~/api/weather";
import { useQuery } from "@tanstack/react-query";
import { cn } from "~/lib/utils";
import { Link } from "react-router";
import { useTypesafeTranslation } from "~/i18n";

export function WeatherWidget() {
  const t = useTypesafeTranslation();
  const { data: weatherData, isPending } = useQuery({
    queryFn: getCurrentWeather,
    queryKey: ['weather'],
    refetchInterval: 60 * 1000 * 60, // 60 minutes
  });

  return (
    <div className="relative border rounded-md p-4">
      {(weatherData && !isPending) ? (
        <div className="flex flex-col gap-2 items-center">
          <div title={t('common.yourLocation')} className="font-bold text-lg">
            {weatherData.location.country}, {weatherData.location.region}
          </div>
          <div className="flex items-center">
            <span title={t('weather.condition')}>{weatherData.current.temp_c}°C - {weatherData.current.condition.text}</span>
            <span>
              <Link viewTransition to="/weather" title={t('weather.link')}>
                <img
                  src={`https:${weatherData.current.condition.icon}`}
                  alt={t('weather.conditionIcon')}
                  className="scale-[1] hover:scale-[1.5] transition-transform cursor-pointer"
                />
              </Link>
            </span>
          </div>
          <div className="w-full flex justify-between">
            <small title={t('weather.wind.description')}>
              {t('weather.wind')}: {weatherData.current.wind_kph}km/h
            </small>
            <small title={t('weather.heat_index.description')}>
              {t('weather.heat_index')}: {weatherData.current.heatindex_c}°C
            </small>
          </div>
          <div className="w-full flex justify-between">
            <small title={t('weather.precip.description')}>
              {t('weather.precip')}: {weatherData.current.precip_mm}mm
            </small>
            <small title={t('weather.humidity.description')}>
              {t('weather.humidity')}: {weatherData.current.humidity}%
            </small>
          </div>
          <small className="text-[10px] opacity-50">
            {t('common.from')}
            {' '}<a href="https://www.weatherapi.com/" target="_blank" rel="noreferrer">WeatherAPI</a>
            {t('weather.attribution2')}
          </small>
        </div>
      ) : (
        <div className="animate-pulse flex items-center justify-center h-40 gap-2">
          <span>{t('weather.loadingText')}</span>
          <LoaderPinwheel className={cn('opacity-50', { 'animate-spin': isPending })} />
        </div>
      )}
    </div>
  )
}
