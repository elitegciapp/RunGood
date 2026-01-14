import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { updatePlanPreferences } from '../../src/db/database';
import type { WorkoutStyle } from '../../src/types/user';

const styleOptions: { label: string; value: WorkoutStyle }[] = [
  { label: 'Walking with short run intervals', value: 'walkRun' },
  { label: 'Run/walk intervals', value: 'runWalk' },
  { label: 'Easy steady running', value: 'easyRun' },
  { label: 'Very short, low-pressure workouts', value: 'bareMinimum' },
];

export default function WorkoutStyleScreen() {
  const [selected, setSelected] = React.useState<WorkoutStyle>('walkRun');

  async function onContinue() {
    await updatePlanPreferences({
      preferredWorkoutStylesJson: JSON.stringify([selected]),
    });
    router.push('/(onboarding)/motivation');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Style</Text>
      <Text style={styles.body}>What type of workouts sound best right now?</Text>

      <View style={{ height: 12 }} />

      {styleOptions.map((opt) => (
        <PrimaryButton
          key={opt.value}
          title={opt.label}
          onPress={() => setSelected(opt.value)}
          style={selected === opt.value ? styles.selected : styles.unselected}
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
