import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';

import { getLocalUser } from '../src/db/database';

export default function Index() {
  const [ready, setReady] = React.useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const user = await getLocalUser();
      if (cancelled) return;
      setOnboardingCompleted(user.onboardingCompleted);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!onboardingCompleted) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(tabs)/today" />;
}
