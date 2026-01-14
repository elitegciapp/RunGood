import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { updatePlanPreferences } from '../../src/db/database';
import type { DaysPerWeekPreference, MaxSessionDurationMinutes } from '../../src/types/user';

const daysOptions: { label: string; value: DaysPerWeekPreference }[] = [
  { label: '2 days', value: '2' },
  { label: '3 days', value: '3' },
  { label: 'It depends (flexible)', value: 'flexible' },
];

const durationOptions: MaxSessionDurationMinutes[] = [10, 15, 20, 30];

export default function AvailabilityScreen() {
  const [days, setDays] = React.useState<DaysPerWeekPreference>('2');
  const [duration, setDuration] = React.useState<MaxSessionDurationMinutes>(15);

  async function onContinue() {
    await updatePlanPreferences({ daysPerWeek: days, maxSessionDuration: duration });
    router.push('/(onboarding)/workout-style');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Availability</Text>
      <Text style={styles.body}>How many days per week can you realistically run?</Text>

      <View style={{ height: 12 }} />
      {daysOptions.map((opt) => (
        <PrimaryButton
          key={opt.value}
          title={opt.label}
          onPress={() => setDays(opt.value)}
          style={days === opt.value ? styles.selected : styles.unselected}
        />
      ))}

      <View style={{ height: 16 }} />
      <Text style={styles.body}>What’s the longest session you feel comfortable committing to?</Text>
      <View style={{ height: 12 }} />
      {durationOptions.map((d) => (
        <PrimaryButton
          key={d}
          title={`${d} minutes`}
          onPress={() => setDuration(d)}
          style={duration === d ? styles.selected : styles.unselected}
        />
      ))}

      <View style={{ height: 16 }} />
      <PrimaryButton title="Continue" onPress={onContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  body: {
    color: '#374151',
  },
  selected: {
    backgroundColor: '#111827',
  },
  unselected: {
    backgroundColor: '#374151',
  },
});
