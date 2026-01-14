import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { PrimaryButton } from '../../src/components/PrimaryButton';

const options = [
  'Being more consistent',
  'Reducing stress',
  'Improving fitness',
  'Just getting started',
] as const;

export default function MotivationScreen() {
  const [selected, setSelected] = React.useState<(typeof options)[number]>(options[0]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Motivation</Text>
      <Text style={styles.body}>What matters most to you right now?</Text>

      <View style={{ height: 12 }} />

      {options.map((opt) => (
        <PrimaryButton
          key={opt}
          title={opt}
          onPress={() => setSelected(opt)}
          style={selected === opt ? styles.selected : styles.unselected}
        />
      ))}

      <View style={{ height: 16 }} />
      <PrimaryButton title="Continue" onPress={() => router.push('/(onboarding)/preferences')} />
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
