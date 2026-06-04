import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/shared/theme/ThemeContext';

interface StatCardProps {
  label: string;
  value: string;
  detail?: string;
}

export function StatCard({ label, value, detail }: StatCardProps) {
  const { palette } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.surface, borderColor: palette.border },
      ]}
    >
      <Text style={[styles.label, { color: palette.textMuted }]}>{label}</Text>
      <Text style={[styles.value, { color: palette.text }]}>{value}</Text>
      {detail ? (
        <Text style={[styles.detail, { color: palette.textMuted }]}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minWidth: '47%',
    padding: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },
  detail: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
