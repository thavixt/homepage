import { getCurrentLocation } from "~/lib/location";
import { getApiRequestUrl } from "./utils";
import type { WeatherCurrentResponse, WeatherForecastResponse } from "~/lib/weather";

/**
 * @deprecated
 */
export async function getCurrentWeather() {
  const location = await getCurrentLocation();
  const response = await fetch(getApiRequestUrl('weather', { location }));
  const json = await response.json() as WeatherCurrentResponse;
  return json;
}

/**
 * @deprecated
 */
export async function getWeatherForecast() {
  const location = await getCurrentLocation();
  const response = await fetch(getApiRequestUrl('weather_forecast', { location }));
  const json = await response.json() as WeatherForecastResponse;
  return json;
}
