import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>

      <Text style={styles.sectionTitle}>Subscription</Text>
      <Text style={styles.body}>Status: trial (placeholder)</Text>
      {/* TODO: StoreKit subscription logic goes here (Apple-compliant). */}

      <Text style={styles.sectionTitle}>Apple Health & Watch</Text>
      <Text style={styles.body}>Not connected (placeholder)</Text>
      {/* TODO: HealthKit permissions + sync configuration goes here. */}
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
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  body: {
    color: '#374151',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  label: {
    color: '#111827',
    fontSize: 16,
  },
});
