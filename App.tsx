import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import Home from './src/pages/Home';
import Onboarding from './src/pages/Onboarding';
import CalendarPage from './src/pages/CalendarPage';
import LogPage from './src/pages/LogPage';
import InsightsPage from './src/pages/InsightsPage';
import SettingsPage from './src/pages/SettingsPage';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { floraTheme } from './src/theme/muiTheme';

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient();

// Improve memory usage and ensure native screens are initialized
enableScreens();

// ErrorBoundary to surface runtime errors instead of a black screen
class ErrorBoundary extends React.Component<any, { error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <PaperProvider theme={floraTheme}>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor={floraTheme.colors.background} />
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Onboarding" component={Onboarding} />
              <Stack.Screen name="Calendar" component={CalendarPage} />
              <Stack.Screen name="Log" component={LogPage} />
              <Stack.Screen name="Insights" component={InsightsPage} />
              <Stack.Screen name="Settings" component={SettingsPage} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}