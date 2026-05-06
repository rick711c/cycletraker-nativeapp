import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NotFound() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <MaterialCommunityIcons name="alert-circle-outline" size={64} color={theme.colors.onSurfaceVariant} />
      <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
        Page not found
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
        The page you're looking for doesn't exist.
      </Text>
      <Link href="/" asChild>
        <Button mode="contained" style={styles.button}>
          Go Home
        </Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontWeight: '700',
    marginTop: 8,
  },
  button: {
    marginTop: 16,
  },
});
