import { LoaderCircle, LoaderPinwheel } from "lucide-react";
import { cn } from "~/lib/utils";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useWeather } from "~/hooks/weather";

export function WeatherWidget({ className, slim = false }: { className?: string, slim?: boolean }) {
  const { t } = useTranslation();
  const { data: weatherData, isPending: isLoading } = useWeather();

  if (!weatherData || isLoading) {
    return <div className={cn("flex flex-col", className)}>
      <LoaderCircle className="animate-spin size-20 opacity-35" />
    </div>
  }

  return (
    <div className={cn("flex flex-col items-center justify-center relative rounded-md p-4", { "border": !slim }, className)}>
      {(weatherData && !isLoading) ? (
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
              {t('weather.wind.title')}: {weatherData.current.wind_kph}km/h
            </small>
            <small title={t('weather.heat_index.description')}>
              {t('weather.heat_index.title')}: {weatherData.current.heatindex_c}°C
            </small>
          </div>
          <div className="w-full flex justify-between">
            <small title={t('weather.precip.description')}>
              {t('weather.precip.title')}: {weatherData.current.precip_mm}mm
            </small>
            <small title={t('weather.humidity.description')}>
              {t('weather.humidity.title')}: {weatherData.current.humidity}%
            </small>
          </div>
          {slim ? null : (
            <small className="text-[10px] opacity-50">
              {t('common.from')}
              {" "}<a href="https://www.weatherapi.com/" target="_blank" rel="noreferrer">WeatherAPI</a>
              {" "}{t('weather.attribution2')}
            </small>
          )}
        </div>
      ) : (
        <div className="animate-pulse flex items-center justify-center h-40 gap-2">
          <span>{t('weather.loadingText')}</span>
          <LoaderPinwheel className={cn('opacity-50', { 'animate-spin': isLoading })} />
        </div>
      )}
    </div>
  )
}
