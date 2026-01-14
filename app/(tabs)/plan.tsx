import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PlanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan</Text>
      <Text style={styles.body}>Placeholder: timeline view (Today / 7-day / Full) goes here.</Text>
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
