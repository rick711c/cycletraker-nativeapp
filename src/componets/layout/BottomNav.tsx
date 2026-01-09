import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon, useTheme, TouchableRipple } from 'react-native-paper';

// --- Configuration ---
// Mapping Lucide icons to MaterialCommunityIcons (used by Paper)
const navItems = [
  { icon: 'home', label: 'Home', path: '/' },
  { icon: 'calendar-month', label: 'Calendar', path: '/calendar' }, // Calendar
  { icon: 'plus', label: 'Log', path: '/log', isCenter: true },      // Plus
  { icon: 'chart-bar', label: 'Insights', path: '/insights' },       // BarChart3
  { icon: 'cog', label: 'Settings', path: '/settings' },             // Settings
];

export function BottomNav() {
  const theme = useTheme();
  // Replicating useLocation logic with local state for the UI
  const [currentPath, setCurrentPath] = useState('/');

  return (
    <View 
      style={[
        styles.navContainer, 
        { 
          backgroundColor: theme.colors.elevation.level2, // bg-card
          borderColor: theme.colors.outlineVariant,       // border-border
        }
      ]}
    >
      <View style={styles.navContent}>
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          
          if (item.isCenter) {
            return (
              <TouchableOpacity
                key={item.path}
                onPress={() => setCurrentPath(item.path)}
                style={[
                  styles.centerButton, 
                  { backgroundColor: theme.colors.primary }
                ]}
                activeOpacity={0.9}
              >
                <Icon 
                  source={item.icon} 
                  size={28} 
                  color={theme.colors.onPrimary} 
                />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableRipple
              key={item.path}
              onPress={() => setCurrentPath(item.path)}
              style={styles.tabItem}
              borderless
            >
              <View style={styles.tabInner}>
                <Icon 
                  source={item.icon} 
                  size={24} 
                  color={isActive ? theme.colors.primary : theme.colors.onSurfaceVariant} 
                />
                <Text 
                  variant="labelSmall" 
                  style={[
                    styles.label, 
                    { color: isActive ? theme.colors.primary : theme.colors.onSurfaceVariant }
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableRipple>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    width: '100%',
    borderTopWidth: 1, // border-t
    // shadow-lg equivalent
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: 8, // Adjust for safe area if needed
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center', // items-center
    justifyContent: 'space-around', // justify-around
    height: 60, // py-2 approximation + height
  },
  centerButton: {
    top: -24, // -mt-6 (6 * 4px = 24px)
    width: 56, // w-14
    height: 56, // h-14
    borderRadius: 28, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
    // shadow-lg
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    borderRadius: 12, // rounded-xl
  },
  tabInner: {
    alignItems: 'center', // flex-col items-center
    paddingVertical: 8, // py-2
    paddingHorizontal: 12, // px-3
  },
  label: {
    marginTop: 4, // mt-1
    fontSize: 10, // text-xs
    fontWeight: '500', // font-medium
  }
});