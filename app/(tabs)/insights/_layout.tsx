import { Stack } from 'expo-router';

export default function InsightsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="cycle-history"
        options={{ animation: 'slide_from_right' }}
      />
    </Stack>
  );
}
