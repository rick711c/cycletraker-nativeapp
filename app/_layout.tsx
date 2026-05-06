import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, useColorScheme, StatusBar } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';
import 'expo-sqlite/localStorage/install';

import { store, persistor } from '@/store';
import { initDatabase } from '@/db/database';
import { fetchAllData } from '@/store/cycleSlice';
import { floraLightTheme, floraDarkTheme } from '@/theme/muiTheme';
import { initializeNotifications, requestNotificationPermission } from '@/notifications/notificationService';
import { PRIVACY_STORAGE_KEY } from '@/pages/PrivacyConsentScreen';
import { useAppSelector } from '@/store';
import { selectIsOnboarded } from '@/store/cycleSlice';

const REQUIRED_PRIVACY_VERSION = '1';
const queryClient = new QueryClient();

/**
 * Inner layout that reads Redux state to determine initial route.
 * Must be rendered inside <Provider> so hooks can access the store.
 */
function InnerLayout() {
  const router = useRouter();
  const segments = useSegments();
  const isOnboarded = useAppSelector(selectIsOnboarded);
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? floraDarkTheme : floraLightTheme;

  const [dbReady, setDbReady] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean | null>(null);

  // Bootstrap: DB + notifications + privacy check
  useEffect(() => {
    async function bootstrap() {
      try {
        await initDatabase();
        initializeNotifications();
        await requestNotificationPermission();
        store.dispatch(fetchAllData());

        // Check privacy consent using localStorage (expo-sqlite backed)
        const acceptedVersion = localStorage.getItem(PRIVACY_STORAGE_KEY);
        setPrivacyAccepted(
          acceptedVersion != null &&
          parseInt(acceptedVersion, 10) >= parseInt(REQUIRED_PRIVACY_VERSION, 10),
        );
      } catch (err) {
        console.error('Bootstrap failed:', err);
        setPrivacyAccepted(false);
      } finally {
        setDbReady(true);
      }
    }
    bootstrap();
  }, []);

  // Redirect based on state
  useEffect(() => {
    if (!dbReady || privacyAccepted === null) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (!privacyAccepted) {
      router.replace('/privacy-consent');
    } else if (!isOnboarded) {
      router.replace('/onboarding');
    } else if (!inTabsGroup) {
      router.replace('/(tabs)');
    }
  }, [dbReady, privacyAccepted, isOnboarded, segments]);

  if (!dbReady || privacyAccepted === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="privacy-consent" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}

/**
 * Root layout — wraps the entire app with providers.
 */
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <InnerLayout />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
