import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { updatePlanPreferences } from '../../src/db/database';
import type { MissedWorkoutPreference, PlanVisibilityPreference } from '../../src/types/user';

const missedOptions: { label: string; value: MissedWorkoutPreference }[] = [
  { label: 'Ask me what I want to do', value: 'ask' },
  { label: 'Automatically make things easier', value: 'autoReduce' },
  { label: 'Ignore it and keep going', value: 'ignore' },
];

const visibilityOptions: { label: string; value: PlanVisibilityPreference }[] = [
  { label: 'Just today', value: 'today' },
  { label: 'The next 7 days', value: '7day' },
  { label: 'The full plan', value: 'full' },
];

export default function PreferencesScreen() {
  const [missedPref, setMissedPref] = React.useState<MissedWorkoutPreference>('ask');
  const [visibility, setVisibility] = React.useState<PlanVisibilityPreference>('today');

  async function onContinue() {
    await updatePlanPreferences({
      missedWorkoutPreference: missedPref,
      planVisibilityPreference: visibility,
    });
    router.push('/(onboarding)/review');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferences</Text>

      <Text style={styles.body}>If you miss a few workouts, what should the app do?</Text>
      <View style={{ height: 12 }} />
      {missedOptions.map((opt) => (
        <PrimaryButton
          key={opt.value}
          title={opt.label}
          onPress={() => setMissedPref(opt.value)}
          style={missedPref === opt.value ? styles.selected : styles.unselected}
        />
      ))}

      <View style={{ height: 16 }} />

      <Text style={styles.body}>How much of your plan do you want to see?</Text>
      <View style={{ height: 12 }} />
      {visibilityOptions.map((opt) => (
        <PrimaryButton
          key={opt.value}
          title={opt.label}
          onPress={() => setVisibility(opt.value)}
          style={visibility === opt.value ? styles.selected : styles.unselected}
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
    marginBottom: 6,
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
