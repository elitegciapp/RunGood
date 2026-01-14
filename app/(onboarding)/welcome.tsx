import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { copy } from '../../src/constants/copy';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{copy.onboarding.title}</Text>
      <Text style={styles.body}>{copy.onboarding.subtitle}</Text>

      <View style={{ height: 16 }} />

      <PrimaryButton title="Get started" onPress={() => router.push('/(onboarding)/basics')} />
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
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  body: {
    color: '#374151',
    fontSize: 16,
    lineHeight: 22,
  },
});
