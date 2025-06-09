import { LoaderPinwheel } from "lucide-react";
import { getCurrentWeather } from "~/api/weather";
import { useQuery } from "@tanstack/react-query";
import { cn } from "~/lib/utils";
import { Link } from "react-router";

export function WeatherWidget() {
  const { data: weatherData, isPending } = useQuery({
    queryFn: getCurrentWeather,
    queryKey: ['weather'],
    refetchInterval: 60 * 1000 * 60, // 60 minutes
  });

  return (
    <div className="relative border rounded-md p-4">
      {(weatherData && !isPending) ? (
        <div className="flex flex-col gap-2 items-center">
          <div title="Your current location" className="font-bold text-lg">
            {weatherData.location.country}, {weatherData.location.region}
          </div>
          <div className="flex items-center">
            <span title="Weather condition and temperature">{weatherData.current.temp_c}°C - {weatherData.current.condition.text}</span>
            <span>
              <Link viewTransition to="/weather" title="View detailed weather information">
                <img
                  src={`https:${weatherData.current.condition.icon}`}
                  alt="Weather condition icon"
                  className="scale-[0.75] hover:scale-[1.1] transition-transform cursor-pointer"
                />
              </Link>
            </span>
          </div>
          <div className="w-full flex justify-between">
            <small title="Wind speed, or wind flow speed, is a fundamental atmospheric quantity caused by air moving from high to low pressure, usually due to changes in temperature">
              Wind: {weatherData.current.wind_kph}km/h
            </small>
            <small title="What the temperature feels like to the human body when relative humidity is combined with the air temperature">
              Heat index: {weatherData.current.heatindex_c}°C
            </small>
          </div>
          <div className="w-full flex justify-between">
            <small title="Rain, snow, sleet, or hail that falls to or condenses on the ground">
              Precipitation: {weatherData.current.precip_mm}mm
            </small>
            <small title="Concentration of water vapor present in the air">
              Humidity: {weatherData.current.humidity}%
            </small>
          </div>
          <small className="text-[10px] opacity-50">
            (from <a href="https://www.weatherapi.com/" target="_blank" rel="noreferrer">WeatherAPI</a>, updated every hour)
          </small>
        </div>
      ) : (
        <div className="animate-pulse flex items-center justify-center h-40 gap-2">
          <span>Loading weather data ...</span>
          <LoaderPinwheel className={cn('opacity-50', { 'animate-spin': isPending })} />
        </div>
      )}
    </div>
  )
}
