import { LoaderPinwheel, RefreshCwIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getWeather, type WeatherResponse } from "~/api/weather";
import { Button } from "./ui/button";

export function WeatherWidget() {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);

  // TODO: should use React Query
  const fetchWeather = useCallback(async () => {
    setLoading(true);
    const data = await getWeather();
    setWeatherData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWeather();
  }, []);

  const refreshData = () => {
    // TODO: should be throttled! (React Query would handle this)
    fetchWeather();
  }

  return (
    <div className="relative border rounded-md p-4">
      {(weatherData && !loading) ? (
        <div className="flex flex-col items-center">
          <div title="Your current location">{weatherData.location.country}, {weatherData.location.name}</div>
          <div className="flex items-center">
            <span title="Weather condition and temperature">{weatherData.current.condition.text} - {weatherData.current.temp_c}°C</span>
            <img
              title={`${weatherData.current.condition.text} icon`}
              src={`https:${weatherData.current.condition.icon}`}
              alt="Weather condition icon"
              className="h-12"
            />
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
          <small className="mt-2 text-[10px] opacity-50">
            (from <a href="https://www.weatherapi.com/" target="_blank" rel="noreferrer">WeatherAPI</a> at {new Date(weatherData.current.last_updated).toLocaleString()})
          </small>
        </div>
      ) : (
        <div className="animate-pulse flex items-center justify-center h-32 gap-2">
          <span>Loading weather data ...</span>
          <LoaderPinwheel className="animate-spin opacity-50" />
        </div>
      )}
      <div
        className="absolute top-2 right-2 cursor-pointer"
        onClick={refreshData}
        title="Refresh weather data"
      >
        <Button disabled={loading} variant="outline">
          <RefreshCwIcon />
        </Button>
      </div>
    </div>
  )
}