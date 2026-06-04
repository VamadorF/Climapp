import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ForecastResponse } from '@/features/weather/lib/types';
import { getWeatherEmoji } from '@/features/weather/lib/weatherCodes';
import { useTheme } from '@/shared/theme/ThemeContext';

interface HourlyForecastProps {
  forecast: ForecastResponse;
}

interface HourlyItem {
  time: string;
  temperature: number;
  weatherCode: number;
  precipProb: number;
  isDay: boolean;
}

export function HourlyForecast({ forecast }: HourlyForecastProps) {
  const { palette } = useTheme();
  const { hourly, hourly_units, timezone } = forecast;

  const hours = useMemo(() => {
    const now = new Date(forecast.current.time);
    const startIndex = hourly.time.findIndex((time) => new Date(time) >= now);
    const from = startIndex >= 0 ? startIndex : 0;
    const items: HourlyItem[] = [];

    for (let i = from; i < hourly.time.length && items.length < 24; i += 1) {
      items.push({
        time: hourly.time[i],
        temperature: hourly.temperature_2m[i],
        weatherCode: hourly.weather_code[i],
        precipProb: hourly.precipitation_probability[i],
        isDay: hourly.is_day[i] === 1,
      });
    }

    return items;
  }, [forecast.current.time, hourly]);

  const timeFormatter = new Intl.DateTimeFormat('es', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  });

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: palette.text }]}>
        Proximas 24 horas
      </Text>
      <ScrollView
        horizontal
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.row}>
          {hours.map((hour) => (
            <View
              key={hour.time}
              style={[
                styles.hourCard,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}
            >
              <Text style={[styles.hour, { color: palette.textMuted }]}>
                {timeFormatter.format(new Date(hour.time))}
              </Text>
              <Text style={styles.icon}>
                {getWeatherEmoji(hour.weatherCode, hour.isDay)}
              </Text>
              <Text style={[styles.temp, { color: palette.text }]}>
                {Math.round(hour.temperature)}
                {hourly_units.temperature_2m}
              </Text>
              {hour.precipProb >= 10 ? (
                <Text style={[styles.precip, { color: palette.primary }]}>
                  {hour.precipProb}%
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
    marginTop: 26,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 20,
  },
  hourCard: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 132,
    paddingHorizontal: 14,
    paddingVertical: 14,
    width: 86,
  },
  hour: {
    fontSize: 12,
    fontWeight: '800',
  },
  icon: {
    fontSize: 30,
    lineHeight: 38,
    marginVertical: 4,
  },
  temp: {
    fontSize: 18,
    fontWeight: '900',
  },
  precip: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
});
