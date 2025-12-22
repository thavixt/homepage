import { useQuery } from "@tanstack/react-query";
import { getApiRequestUrl } from "~/api/utils";
import { getCurrentLocation, useLocation } from "~/lib/location";
import type { WeatherCurrentResponse, WeatherForecastResponse } from "~/lib/weather";

export function useWeather() {
  const location = useLocation();
  const { data, isPending } = useQuery({
    queryFn: async () => {
      const response = await fetch(getApiRequestUrl('weather', { location: location! }));
      const json = await response.json() as WeatherCurrentResponse;
      return json;
    },
    queryKey: ["weather"],
    staleTime: 10 * 60 * 1000,
    enabled: !!location,
  });
  return { data, isPending };
}

export function useWeatherForecast() {
  const { data, isPending } = useQuery({
    queryFn: async () => {
      const location = await getCurrentLocation();
      const response = await fetch(getApiRequestUrl('weather_forecast', { location }));
      const json = await response.json() as WeatherForecastResponse;
      return json;
    },
    queryKey: ["weather_forecast"],
    staleTime: 10 * 60 * 1000,
  });
  return { data, isPending };
}
