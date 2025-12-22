type ApiEndpoint =
  | 'gemini'
  | 'weather'
  | 'weather_forecast'
  | 'ping';

export function getApiRequestUrl(endpoint: ApiEndpoint, query: Record<string, string> = {}) {
  const queryString = new URLSearchParams(query).toString();
  return `api/${endpoint}${queryString ? `?${queryString}` : ''}`;
}