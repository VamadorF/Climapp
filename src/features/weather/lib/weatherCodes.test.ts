import { describe, expect, it } from 'vitest';
import { getWeatherEmoji, getWeatherInfo, getWeatherTheme } from './weatherCodes';
import { degreesToCardinal } from './windDirection';

describe('weather code helpers', () => {
  it('maps known WMO codes to Spanish labels and emojis', () => {
    expect(getWeatherInfo(61).text).toBe('Lluvia ligera');
    expect(getWeatherEmoji(0, true)).toBe('☀️');
    expect(getWeatherEmoji(0, false)).toBe('🌙');
  });

  it('selects visual themes from current conditions', () => {
    expect(getWeatherTheme(0, true)).toBe('clear-day');
    expect(getWeatherTheme(3, true)).toBe('cloudy');
    expect(getWeatherTheme(61, true)).toBe('rain');
    expect(getWeatherTheme(0, false)).toBe('night');
  });
});

describe('wind direction helper', () => {
  it('normalizes degrees into cardinal directions', () => {
    expect(degreesToCardinal(0)).toBe('N');
    expect(degreesToCardinal(90)).toBe('E');
    expect(degreesToCardinal(225)).toBe('SW');
    expect(degreesToCardinal(-45)).toBe('NW');
  });
});
