import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  durationLabel: string;
  detail?: string;
};

export function WorkoutCard({ title, durationLabel, detail }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{durationLabel}</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#374151',
  },
});
