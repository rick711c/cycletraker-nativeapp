import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const NotFound = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
    <View style={styles.content}>
        <Text 
          variant="displayLarge" 
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          404
        </Text>
        <Text 
          variant="titleMedium" 
          style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
        >
          Oops! Page not found
        </Text>
        <Button
          mode="text"
          // navigating to 'Home' assumes you have a route named 'Home' defined in your navigator
          onPress={() => navigation.navigate('Home' as never)}
          labelStyle={{ textDecorationLine: 'underline', fontSize: 16 }}
        >
          Return to Home
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    marginBottom: 24,
  },
});

export default NotFound;