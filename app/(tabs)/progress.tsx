import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ProgressScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>
      <Text style={styles.body}>
        Placeholder: weekly completion, minutes/week, and wins (no pace or distance charts).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  body: {
    color: '#374151',
  },
});
