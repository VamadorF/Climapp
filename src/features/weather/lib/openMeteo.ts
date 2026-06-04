import type { ForecastResponse, GeocodingResponse } from './types';

const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';
const NETWORK_RETRIES = 3;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt < NETWORK_RETRIES; attempt += 1) {
    try {
      return await fetch(url);
    } catch (error) {
      lastError = error;

      if (attempt < NETWORK_RETRIES - 1) {
        await wait(300 * (attempt + 1));
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('No se pudo conectar con Open-Meteo.');
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(
      `Error del servidor (${response.status}). Intenta de nuevo mas tarde.`,
    );
  }

  const data = (await response.json()) as T & {
    error?: boolean;
    reason?: string;
  };

  if (data.error) {
    throw new Error(data.reason ?? 'La API devolvio un error desconocido.');
  }

  return data;
}

export async function searchCity(query: string): Promise<GeocodingResponse> {
  const trimmed = query.trim();

  if (!trimmed) {
    return { results: [] };
  }

  const params = new URLSearchParams({
    name: trimmed,
    count: '6',
    language: 'es',
    format: 'json',
  });

  const response = await fetchWithRetry(`${GEOCODING_BASE}?${params.toString()}`);

  return parseJsonResponse<GeocodingResponse>(response);
}

export async function getForecast(
  latitude: number,
  longitude: number,
): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone: 'auto',
    forecast_days: '7',
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'wind_speed_10m',
      'wind_direction_10m',
      'weather_code',
      'is_day',
      'precipitation',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
    ].join(','),
  });

  const response = await fetchWithRetry(`${FORECAST_BASE}?${params.toString()}`);

  return parseJsonResponse<ForecastResponse>(response);
}
