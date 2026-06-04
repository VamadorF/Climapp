export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country: string;
  country_code: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface ForecastCurrent {
  time: string;
  interval: number;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  weather_code: number;
  is_day: number;
  precipitation: number;
}

export interface ForecastCurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  apparent_temperature: string;
  relative_humidity_2m: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  weather_code: string;
  is_day: string;
  precipitation: string;
}

export interface ForecastHourly {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
  is_day: number[];
}

export interface ForecastHourlyUnits {
  time: string;
  temperature_2m: string;
  weather_code: string;
  precipitation_probability: string;
  is_day: string;
}

export interface ForecastDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  sunrise: string[];
  sunset: string[];
}

export interface ForecastDailyUnits {
  time: string;
  weather_code: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_probability_max: string;
  sunrise: string;
  sunset: string;
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: ForecastCurrentUnits;
  current: ForecastCurrent;
  hourly_units: ForecastHourlyUnits;
  hourly: ForecastHourly;
  daily_units: ForecastDailyUnits;
  daily: ForecastDaily;
  error?: boolean;
  reason?: string;
}

export interface SelectedLocation {
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country: string;
}

export type WeatherTheme = 'clear-day' | 'cloudy' | 'rain' | 'night';

export interface WeatherCodeInfo {
  text: string;
  emojiDay: string;
  emojiNight: string;
}
