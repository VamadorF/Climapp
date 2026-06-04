import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useDebounce } from '@/features/weather/hooks/useDebounce';
import { searchCity } from '@/features/weather/lib/openMeteo';
import type {
  GeocodingResult,
  SelectedLocation,
} from '@/features/weather/lib/types';
import { useTheme } from '@/shared/theme/ThemeContext';

interface SearchBarProps {
  onSelect: (location: SelectedLocation) => void;
}

function buildLocationLabel(location: Pick<GeocodingResult, 'admin1' | 'country'>) {
  return [location.admin1, location.country].filter(Boolean).join(', ');
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const { palette } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 280);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (!trimmed || trimmed === selectedLabel) {
      setResults([]);
      setSearchError(null);
      setSearching(false);
      return;
    }

    let cancelled = false;

    async function runSearch() {
      setSearching(true);
      setSearchError(null);

      try {
        const data = await searchCity(trimmed);
        if (!cancelled) {
          setResults(data.results ?? []);
          setOpen(true);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : 'Error al buscar ciudades.';
          setSearchError(message);
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setSearching(false);
        }
      }
    }

    void runSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, selectedLabel]);

  function handleSelect(result: GeocodingResult) {
    const label = buildLocationLabel(result);
    const nextQuery = `${result.name}${label ? `, ${label}` : ''}`;
    setSelectedLabel(nextQuery);
    setQuery(nextQuery);
    setOpen(false);
    setResults([]);
    onSelect({
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      admin1: result.admin1,
      country: result.country,
    });
  }

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: palette.textMuted }]}>
        Buscar ciudad
      </Text>
      <View
        style={[
          styles.inputRow,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        <TextInput
          accessibilityLabel="Buscar ciudad"
          autoCapitalize="words"
          autoCorrect={false}
          clearButtonMode="while-editing"
          onChangeText={(text) => {
            setQuery(text);
            setSelectedLabel('');
            setOpen(true);
          }}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          placeholder="Ej. Valparaiso, Madrid, Buenos Aires"
          placeholderTextColor={palette.textMuted}
          returnKeyType="search"
          style={[styles.input, { color: palette.text }]}
          value={query}
        />
        {searching ? <ActivityIndicator color={palette.primary} /> : null}
      </View>

      {searchError ? (
        <Text style={[styles.error, { color: palette.danger }]}>
          {searchError}
        </Text>
      ) : null}

      {open && debouncedQuery.trim() && !searching ? (
        <View
          style={[
            styles.dropdown,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}
        >
          {results.length === 0 ? (
            <Text style={[styles.noResults, { color: palette.textMuted }]}>
              Sin resultados para {debouncedQuery}
            </Text>
          ) : (
            results.map((result) => {
              const label = buildLocationLabel(result);
              return (
                <Pressable
                  accessibilityRole="button"
                  key={result.id}
                  onPress={() => handleSelect(result)}
                  style={({ pressed }) => [
                    styles.option,
                    {
                      borderBottomColor: palette.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.cityName, { color: palette.text }]}>
                    {result.name}
                  </Text>
                  <Text style={[styles.cityMeta, { color: palette.textMuted }]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputRow: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  dropdown: {
    borderRadius: 18,
    borderWidth: 1,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 84,
  },
  option: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '800',
  },
  cityMeta: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  noResults: {
    fontSize: 14,
    fontWeight: '600',
    padding: 16,
  },
});
