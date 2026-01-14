import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { getActiveTrainingPlan, getWeeklyPlansForActivePlan } from '../../src/db/database';

export default function PlanScreen() {
  const [loading, setLoading] = React.useState(true);
  const [weeksCount, setWeeksCount] = React.useState(0);
  const [planVersion, setPlanVersion] = React.useState<number | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const active = await getActiveTrainingPlan();
      const weeks = await getWeeklyPlansForActivePlan();
      if (cancelled) return;
      setPlanVersion(active?.planVersion ?? null);
      setWeeksCount(weeks.length);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan</Text>
      {planVersion ? (
        <Text style={styles.body}>Active plan v{planVersion} • {weeksCount} weeks</Text>
      ) : (
        <Text style={styles.body}>No active plan yet.</Text>
      )}
      <Text style={[styles.body, { marginTop: 8 }]}>
        Placeholder: timeline view (Today / 7-day / Full) goes here.
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
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
