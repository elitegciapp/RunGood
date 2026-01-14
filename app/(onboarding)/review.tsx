import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { getPlanPreferences, setOnboardingCompleted } from '../../src/db/database';
import { generateInitialPlan } from '../../src/logic/planGenerator';

export default function ReviewScreen() {
  const [saving, setSaving] = React.useState(false);

  async function onFinish() {
    setSaving(true);

    const prefs = await getPlanPreferences();
    generateInitialPlan(prefs);

    // NOTE: Plan persistence is intentionally not implemented yet.
    // This is a stub to confirm routing + local persistence.

    await setOnboardingCompleted(true);
    router.replace('/(tabs)/today');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review</Text>
      <Text style={styles.body}>
        You can change these preferences later. When you’re ready, generate your plan.
      </Text>

      <View style={{ height: 16 }} />

      <PrimaryButton title={saving ? 'Generating…' : 'Generate Plan'} onPress={onFinish} />

      <View style={{ height: 16 }} />

      <Text style={styles.small}>
        Trial + subscription gating will be added later. No paywall in v1 scaffold.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  body: {
    color: '#374151',
    fontSize: 16,
    lineHeight: 22,
  },
  small: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 18,
  },
});
