import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ForecastResponse } from '@/features/weather/lib/types';
import { getWeatherEmoji } from '@/features/weather/lib/weatherCodes';
import { useTheme } from '@/shared/theme/ThemeContext';

interface DailyForecastProps {
  forecast: ForecastResponse;
}

interface DayItem {
  date: string;
  label: string;
  weatherCode: number;
  min: number;
  max: number;
  precipProb: number;
  isDay: boolean;
}

export function DailyForecast({ forecast }: DailyForecastProps) {
  const { palette } = useTheme();
  const { daily, timezone } = forecast;
  const weekMin = Math.min(...daily.temperature_2m_min);
  const weekMax = Math.max(...daily.temperature_2m_max);
  const range = weekMax - weekMin || 1;

  const days = useMemo<DayItem[]>(() => {
    const weekdayFormatter = new Intl.DateTimeFormat('es', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: timezone,
    });

    return daily.time.map((date, index) => {
      const noonIndex = forecast.hourly.time.findIndex(
        (time) => time.startsWith(date) && time.endsWith('T12:00'),
      );
      const isDay =
        noonIndex >= 0 ? forecast.hourly.is_day[noonIndex] === 1 : true;

      return {
        date,
        label: weekdayFormatter.format(new Date(date)),
        weatherCode: daily.weather_code[index],
        min: daily.temperature_2m_min[index],
        max: daily.temperature_2m_max[index],
        precipProb: daily.precipitation_probability_max[index],
        isDay,
      };
    });
  }, [daily, forecast.hourly, timezone]);

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: palette.text }]}>7 dias</Text>
      <View
        style={[
          styles.list,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        {days.map((day, index) => {
          const barLeft = ((day.min - weekMin) / range) * 100;
          const barWidth = ((day.max - day.min) / range) * 100;

          return (
            <View
              key={day.date}
              style={[
                styles.row,
                index < days.length - 1 && {
                  borderBottomColor: palette.border,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              <Text style={[styles.dayLabel, { color: palette.text }]}>
                {day.label}
              </Text>
              <Text style={styles.icon}>
                {getWeatherEmoji(day.weatherCode, day.isDay)}
              </Text>
              <View
                style={[styles.barTrack, { backgroundColor: palette.border }]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      backgroundColor: palette.primary,
                      left: `${barLeft}%`,
                      width: `${Math.max(barWidth, 5)}%`,
                    },
                  ]}
                />
              </View>
              {day.precipProb >= 10 ? (
                <Text style={[styles.precip, { color: palette.primary }]}>
                  {day.precipProb}%
                </Text>
              ) : null}
              <View style={styles.temps}>
                <Text style={[styles.min, { color: palette.textMuted }]}>
                  {Math.round(day.min)}°
                </Text>
                <Text style={[styles.max, { color: palette.text }]}>
                  {Math.round(day.max)}°
                </Text>
              </View>
            </View>
          );
        })}
      </View>
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
  list: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 58,
    paddingHorizontal: 14,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'capitalize',
    width: 76,
  },
  icon: {
    fontSize: 24,
    lineHeight: 30,
    width: 30,
  },
  barTrack: {
    borderRadius: 999,
    flex: 1,
    height: 8,
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: 999,
    height: 8,
    position: 'absolute',
  },
  precip: {
    fontSize: 12,
    fontWeight: '800',
    width: 34,
  },
  temps: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    width: 52,
  },
  min: {
    fontSize: 13,
    fontWeight: '800',
  },
  max: {
    fontSize: 15,
    fontWeight: '900',
  },
});
