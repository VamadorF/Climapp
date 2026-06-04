import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { WeatherScreen } from '@/features/weather';
import { ThemeProvider, useTheme } from '@/shared/theme/ThemeContext';

function AppShell() {
  const { palette, mode } = useTheme();

  return (
    <>
      <StatusBar
        backgroundColor={palette.background}
        style={mode === 'dark' ? 'light' : 'dark'}
      />
      <WeatherScreen />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryProvider>
          <AppShell />
        </QueryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
