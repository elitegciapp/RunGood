import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { WorkoutCard } from '../../src/components/WorkoutCard';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { copy } from '../../src/constants/copy';
import { getNextPlannedSession } from '../../src/db/database';
import type { WorkoutSession } from '../../src/types/plan';

function describeSteps(session: WorkoutSession) {
  // Time-based only. No pace/distance.
  switch (session.workoutStyle) {
    case 'walkRun':
      return 'Repeat: 1 min jog / 2 min walk.';
    case 'runWalk':
      return 'Repeat: 2 min run / 1 min walk.';
    case 'easyRun':
      return 'Easy continuous running. Keep it comfortable.';
    case 'bareMinimum':
      return 'Easy moving. Keep it simple.';
    default:
      return 'Simple time-based session.';
  }
}

export default function TodayScreen() {
  const [loading, setLoading] = React.useState(true);
  const [session, setSession] = React.useState<WorkoutSession | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = await getNextPlannedSession();
      if (cancelled) return;
      setSession(next);
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

  if (!session) {
    return (
      <View style={styles.container}>
        <WorkoutCard
          title={copy.today.title}
          durationLabel="No session scheduled"
          detail="Finish onboarding to generate your plan."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WorkoutCard
        title={copy.today.title}
        durationLabel={`${session.durationMinutes} minutes`}
        detail={describeSteps(session)}
      />

      <View style={{ height: 12 }} />

      <PrimaryButton title="Start Workout" onPress={() => {}} />

      <View style={{ height: 12 }} />

      <Text style={styles.secondaryText}>
        Bare minimum option is always available (10 minutes).
      </Text>
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: '#374151',
  },
});
