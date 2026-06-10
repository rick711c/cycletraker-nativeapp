import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "expo-sqlite/localStorage/install";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  View,
} from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { PRIVACY_STORAGE_KEY } from "@/src/constants";
import { initDatabase } from "@/src/db/database";
import {
  initializeNotifications,
  requestNotificationPermission,
} from "@/src/notifications/notificationService";
import { persistor, store, useAppSelector } from "@/src/store";
import { fetchAllData, selectIsOnboarded } from "@/src/store/cycleSlice";
import { floraDarkTheme, floraLightTheme } from "@/src/theme/muiTheme";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

type PrivacyContextType = { markPrivacyAccepted: () => void };
const PrivacyContext = createContext<PrivacyContextType>({
  markPrivacyAccepted: () => {},
});
export const usePrivacy = () => useContext(PrivacyContext);

const REQUIRED_PRIVACY_VERSION = "1";
const queryClient = new QueryClient();

function InnerLayout() {
  const router = useRouter();
  const segments = useSegments();
  const isOnboarded = useAppSelector(selectIsOnboarded);
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? floraDarkTheme : floraLightTheme;

  const [dbReady, setDbReady] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        await initDatabase();
        initializeNotifications();
        await requestNotificationPermission();
        store.dispatch(fetchAllData());

        const acceptedVersion = localStorage.getItem(PRIVACY_STORAGE_KEY);
        setPrivacyAccepted(
          acceptedVersion != null &&
            parseInt(acceptedVersion, 10) >=
              parseInt(REQUIRED_PRIVACY_VERSION, 10),
        );
      } catch (err) {
        console.error("Bootstrap failed:", err);
        setPrivacyAccepted(false);
      } finally {
        setDbReady(true);
        SplashScreen.hideAsync();
      }
    }
    bootstrap();
  }, []);

  useEffect(() => {
    if (!dbReady || privacyAccepted === null) return;

    const inTabsGroup = segments[0] === "(tabs)";

    if (!privacyAccepted) {
      router.replace("/privacy-consent");
    } else if (!isOnboarded) {
      router.replace("/onboarding");
    } else if (!inTabsGroup) {
      router.replace("/(tabs)");
    }
  }, [dbReady, privacyAccepted, isOnboarded, segments]);

  if (!dbReady || privacyAccepted === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <PrivacyContext.Provider
      value={{ markPrivacyAccepted: () => setPrivacyAccepted(true) }}
    >
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={theme.dark ? "light-content" : "dark-content"}
          backgroundColor={theme.colors.background}
        />
        <Stack screenOptions={{ headerShown: false, animation: "none" }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="privacy-consent" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </PaperProvider>
    </PrivacyContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <InnerLayout />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
