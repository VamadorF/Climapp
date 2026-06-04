import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatCard } from '@/features/weather/components/StatCard';
import type { ForecastResponse } from '@/features/weather/lib/types';
import { getWeatherEmoji, getWeatherInfo } from '@/features/weather/lib/weatherCodes';
import { degreesToCardinal } from '@/features/weather/lib/windDirection';
import { useTheme } from '@/shared/theme/ThemeContext';

interface CurrentWeatherProps {
  forecast: ForecastResponse;
  cityName: string;
  regionLabel: string;
}

export function CurrentWeather({
  forecast,
  cityName,
  regionLabel,
}: CurrentWeatherProps) {
  const { palette } = useTheme();
  const { current, current_units, daily } = forecast;
  const isDay = current.is_day === 1;
  const weatherInfo = getWeatherInfo(current.weather_code);
  const emoji = getWeatherEmoji(current.weather_code, isDay);
  const todayMin = daily.temperature_2m_min[0];
  const todayMax = daily.temperature_2m_max[0];

  const formattedTime = new Intl.DateTimeFormat('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: forecast.timezone,
  }).format(new Date(current.time));

  return (
    <View style={styles.section}>
      <View style={styles.location}>
        <View>
          <Text style={[styles.city, { color: palette.text }]}>{cityName}</Text>
          <Text style={[styles.region, { color: palette.textMuted }]}>
            {regionLabel}
          </Text>
        </View>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <Text style={[styles.updated, { color: palette.textMuted }]}>
        Actualizado · {formattedTime}
      </Text>

      <View style={styles.temperatureRow}>
        <Text style={[styles.temperature, { color: palette.text }]}>
          {Math.round(current.temperature_2m)}
        </Text>
        <Text style={[styles.unit, { color: palette.textMuted }]}>
          {current_units.temperature_2m}
        </Text>
      </View>
      <Text style={[styles.condition, { color: palette.primary }]}>
        {weatherInfo.text}
      </Text>
      <Text style={[styles.feelsLike, { color: palette.textMuted }]}>
        Sensacion {Math.round(current.apparent_temperature)}
        {current_units.apparent_temperature}
      </Text>

      <View style={styles.stats}>
        <StatCard
          label="Humedad"
          value={`${current.relative_humidity_2m}${current_units.relative_humidity_2m}`}
        />
        <StatCard
          label="Viento"
          value={`${Math.round(current.wind_speed_10m)} ${current_units.wind_speed_10m}`}
          detail={degreesToCardinal(current.wind_direction_10m)}
        />
        <StatCard
          label="Precipitacion"
          value={`${current.precipitation} ${current_units.precipitation}`}
        />
        <StatCard
          label="Hoy"
          value={`↑ ${Math.round(todayMax)}°  ↓ ${Math.round(todayMin)}°`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
    marginTop: 22,
  },
  location: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  city: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  region: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 3,
  },
  emoji: {
    fontSize: 54,
    lineHeight: 62,
  },
  updated: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  temperatureRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: 8,
  },
  temperature: {
    fontSize: 88,
    fontWeight: '900',
    letterSpacing: -5,
    lineHeight: 96,
  },
  unit: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
  },
  condition: {
    fontSize: 22,
    fontWeight: '800',
  },
  feelsLike: {
    fontSize: 15,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
});
