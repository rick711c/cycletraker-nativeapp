import React, { ReactNode } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from './BottomNav'; // Your converted BottomNav component

interface MobileLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function MobileLayout({ children, showNav = true }: MobileLayoutProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          {
            // Add padding at the bottom so content isn't hidden behind the absolute/fixed BottomNav
            // 80 is the height of the BottomNav bar we defined earlier + any safe area inset
            paddingBottom: showNav ? 80 + insets.bottom : insets.bottom + 16,
          }
        ]}
      >
        {children}
      </ScrollView>

      {showNav && <BottomNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // In React Native, we don't typically use 'mx: auto' or 'maxWidth' 
    // unless targeting tablets specifically. flex: 1 fills the device screen.
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});