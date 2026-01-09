import React, { ReactNode } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import { BottomNav } from './BottomNav';

interface MobileLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function MobileLayout({ children, showNav = true }: MobileLayoutProps) {
  const theme = useTheme();

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: theme.colors.background }
      ]}
    >
      <View style={styles.content}>
        {children}
      </View>
      
      {showNav && <BottomNav />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Ensures status bar style matches theme (basic handling)
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    // overflow-auto is handled by the children (ScrollView/FlatList) 
    // in React Native to avoid nested ScrollViews
  },
});