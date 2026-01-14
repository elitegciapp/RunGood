import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { WorkoutCard } from '../../src/components/WorkoutCard';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { copy } from '../../src/constants/copy';

export default function TodayScreen() {
  return (
    <View style={styles.container}>
      <WorkoutCard
        title={copy.today.title}
        durationLabel="15 minutes"
        detail="Placeholder: easy run/walk session."
      />

      <View style={{ height: 12 }} />

      <PrimaryButton title="Start Workout" onPress={() => {}} />

      <View style={{ height: 12 }} />

      <Text style={styles.secondaryText}>Bare minimum option is always available.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 8,
    backgroundColor: '#ffffff',
  },
  secondaryText: {
    color: '#374151',
  },
});
