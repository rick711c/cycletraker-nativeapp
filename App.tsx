import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, useColorScheme, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store, persistor } from './src/store';
import { initDatabase } from './src/db/database';
import { fetchAllData } from './src/store/cycleSlice';
import { floraLightTheme, floraDarkTheme } from './src/theme/muiTheme';
import { initializeNotifications, requestNotificationPermission } from './src/notifications/notificationService';

import Home from './src/pages/Home';
import Onboarding from './src/pages/Onboarding';
import CalendarPage from './src/pages/CalendarPage';
import LogPage from './src/pages/LogPage';
import InsightsPage from './src/pages/InsightsPage';
import SettingsPage from './src/pages/SettingsPage';
import CycleHistoryPage from './src/pages/CycleHistoryPage';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

enableScreens();

// ── Error boundary ────────────────────────────────────────────────────────────

class ErrorBoundary extends React.Component<any, { error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  componentDidCatch(error: Error) {
    console.error('Uncaught error in tree:', error);
    this.setState({ error });
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text style={{ color: '#c00', fontWeight: '700', marginBottom: 8 }}>An error occurred</Text>
          <Text>{this.state.error?.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// ── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const scheme = useColorScheme();
  const theme  = scheme === 'dark' ? floraDarkTheme : floraLightTheme;
  const [dbReady, setDbReady] = useState(false);

  // 1. Initialise SQLite schema + notifications on mount
  useEffect(() => {
    async function bootstrap() {
      try {
        // Init database
        await initDatabase();

        // Init notifications (uses local provider by default)
        initializeNotifications();
        await requestNotificationPermission();

        // Load all SQLite data into Redux cache
        // (the saga will also reschedule notifications)
        store.dispatch(fetchAllData());
      } catch (err) {
        console.error('Bootstrap failed:', err);
      } finally {
        setDbReady(true);
      }
    }
    bootstrap();
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <PaperProvider theme={theme}>
                <NavigationContainer>
                  <StatusBar
                    barStyle={theme.dark ? 'light-content' : 'dark-content'}
                    backgroundColor={theme.colors.background}
                  />
                  <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{ headerShown: false, animation: 'none' }}
                  >
                    <Stack.Screen name="Home"       component={Home} />
                    <Stack.Screen name="Onboarding" component={Onboarding} />
                    <Stack.Screen name="Calendar"   component={CalendarPage} />
                    <Stack.Screen name="Log"        component={LogPage} />
                    <Stack.Screen name="Insights"   component={InsightsPage} />
                    <Stack.Screen name="Settings"   component={SettingsPage} />
                    <Stack.Screen
                      name="CycleHistory"
                      component={CycleHistoryPage}
                      options={{ animation: 'slide_from_right' }}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </PaperProvider>
            </SafeAreaProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}