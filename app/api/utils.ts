type ApiEndpoint =
  | 'gemini'
  | 'weather'
  | 'weather_forecast'
  | 'ping';

const localApi = "http://localhost:8080/api";
const liveApi = "https://personal.komlosidev.net/api";

const getApi = () => {
  if (import.meta.env.MODE === "development") {
    return localApi;
  }
  return liveApi;
}

export function getApiRequestUrl(endpoint: ApiEndpoint, query: Record<string, string> = {}) {
  const queryString = new URLSearchParams(query).toString();
  return `${getApi()}/${endpoint}${queryString ? `?${queryString}` : ''}`;
}