// TODO: should use React Query or something instead!
export async function getWeather() {
  const location = await getCurrentLocation();
  // corsproxy.io is used to bypass CORS issues
  // TODO: should use proper CORS handling on the server side
  const url = `https://corsproxy.io/?https://personal.komlosidev.net/api/weather?location=${location}`;
  const response = await fetch(url);
  const json = await response.json() as WeatherResponse;
  return json;
}

async function getCurrentLocation(): Promise<string> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve(`${coords.latitude},${coords.longitude}`);
      },
      (error) => {
        console.error('Error getting location:', error);
        reject(error);
      }
    );
  })
}

export interface WeatherResponse {
  location: WeatherLocation;
  current: WeatherData;
}

export interface WeatherLocation {
  country: string;
  lat: number;
  lon: number;
  name: string;
  region: string;
  tz_id: string;
  localtime: string; // "2025-06-04 23:34"
  localtime_epoch: number;
}

export interface WeatherData {
  last_updated: string; // "2025-06-04 23:30"
  last_updated_epoch: number;
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  condition: {
    text: string;
    icon: string; // `https:${icon}`
    code: number;
  };
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  is_day: number; // 1 = Yes, 0 = No
  uv: number;
  gust_mph: number;
  gust_kph: number;
}
