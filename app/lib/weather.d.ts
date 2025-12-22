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

export interface WeatherCurrentResponse {
  location: WeatherLocation;
  current: WeatherCurrentData;
}

export interface WeatherCurrentData {
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

export interface WeatherForecastResponse {
  location: WeatherLocation;
  current: WeatherCurrentData;
  forecast: WeatherForecastData;
}

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface WeatherForecastData {
  forecastday: WeatherForecastDay[];
}

export interface WeatherForecastDay {
  date: string;
  date_epoch: number;
  day: WeatherDay;
  astro: WeatherAstro;
  hour: WeatherHour[];
}

export interface WeatherDay {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  totalsnow_cm: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  condition: WeatherCondition;
  uv: number;
}

export interface WeatherAstro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: number;
  is_moon_up: number;
  is_sun_up: number;
}

export interface WeatherHour {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  snow_cm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
}