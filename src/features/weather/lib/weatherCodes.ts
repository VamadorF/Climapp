import type { WeatherCodeInfo, WeatherTheme } from './types';

export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { text: 'Despejado', emojiDay: '☀️', emojiNight: '🌙' },
  1: { text: 'Mayormente despejado', emojiDay: '🌤️', emojiNight: '🌙' },
  2: { text: 'Parcialmente nublado', emojiDay: '⛅', emojiNight: '☁️' },
  3: { text: 'Nublado', emojiDay: '☁️', emojiNight: '☁️' },
  45: { text: 'Niebla', emojiDay: '🌫️', emojiNight: '🌫️' },
  48: { text: 'Niebla con escarcha', emojiDay: '🌫️', emojiNight: '🌫️' },
  51: { text: 'Llovizna ligera', emojiDay: '🌦️', emojiNight: '🌧️' },
  53: { text: 'Llovizna moderada', emojiDay: '🌦️', emojiNight: '🌧️' },
  55: { text: 'Llovizna intensa', emojiDay: '🌦️', emojiNight: '🌧️' },
  56: { text: 'Llovizna helada ligera', emojiDay: '🌨️', emojiNight: '🌨️' },
  57: { text: 'Llovizna helada intensa', emojiDay: '🌨️', emojiNight: '🌨️' },
  61: { text: 'Lluvia ligera', emojiDay: '🌧️', emojiNight: '🌧️' },
  63: { text: 'Lluvia moderada', emojiDay: '🌧️', emojiNight: '🌧️' },
  65: { text: 'Lluvia intensa', emojiDay: '🌧️', emojiNight: '🌧️' },
  66: { text: 'Lluvia helada ligera', emojiDay: '🌨️', emojiNight: '🌨️' },
  67: { text: 'Lluvia helada intensa', emojiDay: '🌨️', emojiNight: '🌨️' },
  71: { text: 'Nevada ligera', emojiDay: '🌨️', emojiNight: '🌨️' },
  73: { text: 'Nevada moderada', emojiDay: '❄️', emojiNight: '❄️' },
  75: { text: 'Nevada intensa', emojiDay: '❄️', emojiNight: '❄️' },
  77: { text: 'Granizo', emojiDay: '🌨️', emojiNight: '🌨️' },
  80: { text: 'Chubascos ligeros', emojiDay: '🌦️', emojiNight: '🌧️' },
  81: { text: 'Chubascos moderados', emojiDay: '🌧️', emojiNight: '🌧️' },
  82: { text: 'Chubascos violentos', emojiDay: '⛈️', emojiNight: '⛈️' },
  85: { text: 'Chubascos de nieve ligeros', emojiDay: '🌨️', emojiNight: '🌨️' },
  86: { text: 'Chubascos de nieve intensos', emojiDay: '❄️', emojiNight: '❄️' },
  95: { text: 'Tormenta electrica', emojiDay: '⛈️', emojiNight: '⛈️' },
  96: { text: 'Tormenta con granizo ligero', emojiDay: '⛈️', emojiNight: '⛈️' },
  99: { text: 'Tormenta con granizo intenso', emojiDay: '⛈️', emojiNight: '⛈️' },
};

const UNKNOWN_WEATHER: WeatherCodeInfo = {
  text: 'Condicion desconocida',
  emojiDay: '🌡️',
  emojiNight: '🌡️',
};

const RAIN_STORM_CODES = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
]);

const CLOUDY_CODES = new Set([2, 3, 45, 48, 71, 73, 75, 77, 85, 86]);

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return WEATHER_CODES[code] ?? UNKNOWN_WEATHER;
}

export function getWeatherEmoji(code: number, isDay: boolean): string {
  const info = getWeatherInfo(code);
  return isDay ? info.emojiDay : info.emojiNight;
}

export function getWeatherTheme(code: number, isDay: boolean): WeatherTheme {
  if (!isDay) return 'night';
  if (RAIN_STORM_CODES.has(code)) return 'rain';
  if (CLOUDY_CODES.has(code) || code === 1) return 'cloudy';
  return 'clear-day';
}
