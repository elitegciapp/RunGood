import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { updateUserProfile } from '../../src/db/database';
import type { RunningExperience } from '../../src/types/user';

const experienceOptions: RunningExperience[] = [
  'Brand new to running',
  'I’ve run before but I’m out of shape',
  'I run occasionally',
  'I’m restarting after a long break',
];

export default function BasicsScreen() {
  const [experience, setExperience] = React.useState<RunningExperience>(experienceOptions[0]);

  async function onContinue() {
    await updateUserProfile({ runningExperience: experience });
    router.push('/(onboarding)/availability');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Basics</Text>
      <Text style={styles.body}>How would you describe your running background?</Text>

      <View style={{ height: 12 }} />

      {experienceOptions.map((opt) => (
        <PrimaryButton
          key={opt}
          title={opt}
          onPress={() => setExperience(opt)}
          style={experience === opt ? styles.selected : styles.unselected}
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
