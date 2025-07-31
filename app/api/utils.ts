type ApiEndpoint =
  'gemini' |
  'weather' |
  'weather_forecast' |
  'ping'
  ;

export function getApiRequestUrl(endpoint: ApiEndpoint, query: Record<string, string> = {}) {
  const domain = import.meta.env.VITE_LOCAL_API
    ? 'http://localhost:8080/api'
    : 'https://personal.komlosidev.net/api';
  const queryString = new URLSearchParams(query).toString();
  return `${domain}/${endpoint}${queryString ? `?${queryString}` : ''}`;
}