import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, FAB, Text, useTheme, Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Assuming React Navigation
import { useNavigation, useRoute } from '@react-navigation/native'; 

const navItems = [
  { icon: 'home', label: 'Home', route: 'Home' },
  { icon: 'calendar-month', label: 'Calendar', route: 'Calendar' },
  { icon: 'plus', label: 'Log', route: 'Log', isCenter: true },
  { icon: 'chart-bar', label: 'Insights', route: 'Insights' },
  { icon: 'cog', label: 'Settings', route: 'Settings' },
];

export function BottomNav() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute(); // Or use a navigation state selector to determine active tab
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Surface style={styles.bar} elevation={4}>
        {navItems.map((item, index) => {
          const isActive = route.name === item.route;
          const color = isActive ? theme.colors.primary : theme.colors.onSurfaceVariant;

          if (item.isCenter) {
            return (
              <View key={item.label} style={styles.centerButtonContainer}>
                <FAB
                  icon={item.icon}
                  style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                  color={theme.colors.onPrimary}
                  onPress={() => navigation.navigate(item.route as never)}
                  mode="elevated"
                />
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={item.label}
              style={styles.tab}
              onPress={() => navigation.navigate(item.route as never)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Icon icon={item.icon} size={24} color={color} />
              <Text
                variant="labelSmall"
                style={[styles.label, { color }]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // Ensures the bar sits above other content
    zIndex: 1000, 
  },
  bar: {
    flexDirection: 'row',
    height: 80, // Taller to accommodate the FAB curve if needed, or standard ~56-64
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff', // Or theme.colors.surface
    borderTopLeftRadius: 16, // Optional: rounded top corners
    borderTopRightRadius: 16,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  label: {
    marginTop: 4,
    fontSize: 12,
  },
  centerButtonContainer: {
    width: 60,
    height: '100%',
    justifyContent: 'flex-start', // Aligns FAB to top of bar
    alignItems: 'center',
    zIndex: 10,
  },
  fab: {
    marginTop: -28, // Pulls the FAB up to float halfway out
    borderRadius: 28, // Circular
    elevation: 4,     // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});