import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { Screen } from '@/shared/components/Screen';
import { CurrentWeather } from '@/features/weather/components/CurrentWeather';
import { DailyForecast } from '@/features/weather/components/DailyForecast';
import { HourlyForecast } from '@/features/weather/components/HourlyForecast';
import { SearchBar } from '@/features/weather/components/SearchBar';
import { useForecast } from '@/features/weather/hooks/useForecast';
import type { SelectedLocation, WeatherTheme } from '@/features/weather/lib/types';
import { getWeatherTheme } from '@/features/weather/lib/weatherCodes';
import { useTheme } from '@/shared/theme/ThemeContext';

const DEFAULT_LOCATION: SelectedLocation = {
  name: 'Santiago',
  latitude: -33.4489,
  longitude: -70.6693,
  admin1: 'Region Metropolitana',
  country: 'Chile',
};

const THEME_ACCENTS: Record<WeatherTheme, string> = {
  'clear-day': '#fde68a',
  cloudy: '#bfdbfe',
  rain: '#a7f3d0',
  night: '#c4b5fd',
};

function buildRegionLabel(location: SelectedLocation): string {
  return [location.admin1, location.country].filter(Boolean).join(', ');
}

export function WeatherScreen() {
  const { palette } = useTheme();
  const [location, setLocation] = useState<SelectedLocation>(DEFAULT_LOCATION);
  const { forecast, loading, fetching, error, reload } = useForecast(location);

  const theme = useMemo<WeatherTheme>(() => {
    if (!forecast) return 'clear-day';
    return getWeatherTheme(
      forecast.current.weather_code,
      forecast.current.is_day === 1,
    );
  }, [forecast]);

  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={fetching && !loading}
          onRefresh={() => void reload()}
          tintColor={palette.primary}
        />
      }
    >
      <View
        style={[
          styles.hero,
          { backgroundColor: THEME_ACCENTS[theme], borderColor: palette.border },
        ]}
      >
        <Text style={styles.kicker}>Open-Meteo</Text>
        <Text style={styles.heading}>Clima en vivo</Text>
        <Text style={styles.subtitle}>
          Pronostico actual, proximas horas y 7 dias por ciudad.
        </Text>
      </View>

      <SearchBar onSelect={setLocation} />

      {loading ? (
        <Card style={styles.stateCard}>
          <ActivityIndicator color={palette.primary} />
          <Text style={[styles.stateText, { color: palette.textMuted }]}>
            Cargando pronostico para {location.name}...
          </Text>
        </Card>
      ) : null}

      {error && !loading ? (
        <Card style={styles.stateCard}>
          <Text style={[styles.errorTitle, { color: palette.danger }]}>
            No se pudo cargar el clima
          </Text>
          <Text style={[styles.stateText, { color: palette.textMuted }]}>
            {error}
          </Text>
          <Button label="Reintentar" onPress={() => void reload()} />
        </Card>
      ) : null}

      {forecast && !loading && !error ? (
        <>
          <CurrentWeather
            cityName={location.name}
            forecast={forecast}
            regionLabel={buildRegionLabel(location)}
          />
          <HourlyForecast forecast={forecast} />
          <DailyForecast forecast={forecast} />
          <Text style={[styles.attribution, { color: palette.textMuted }]}>
            Datos meteorologicos por Open-Meteo bajo licencia CC BY 4.0.
          </Text>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 20,
    padding: 22,
  },
  kicker: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    opacity: 0.75,
    textTransform: 'uppercase',
  },
  heading: {
    color: '#0f172a',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginTop: 8,
  },
  subtitle: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    marginTop: 8,
  },
  stateCard: {
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  stateText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  attribution: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 24,
    textAlign: 'center',
  },
});
