import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CycleRing } from '../components/cycle/CycleRing';
import { DailyInsight } from '../components/cycle/DailyInsight';
import { QuickActions } from '../components/cycle/QuickActions';
import { UpcomingEvents } from '../components/cycle/UpcomingEvents';
import { MobileLayout } from '../components/layout/MobileLayout';
import { useCycleStore } from '../hooks/useCycleStore';

// Import your converted components

export default function Home() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { isOnboarded, getCycleStats } = useCycleStore();

  // React Native navigation redirection pattern
  useEffect(() => {
    if (!isOnboarded) {
      // Ensure 'Onboarding' is defined in your navigation stack
      // Using 'reset' prevents going back to Home with the back button
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' as never }],
      });
    }
  }, [isOnboarded, navigation]);

  if (!isOnboarded) {
    return null; // Render nothing while redirecting
  }

  const stats = getCycleStats();

  return (
    <MobileLayout>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            {/* 'flower' is a common MaterialCommunityIcon equivalent to LocalFlorist */}
            <Icon source="flower" size={28} color={theme.colors.primary} />
            <Text variant="headlineSmall" style={styles.brandText}>
              Flora
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Today
            </Text>
            <Text variant="bodyMedium" style={[styles.dateText, { color: theme.colors.onSurface }]}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* Cycle Ring */}
        <View style={styles.sectionPadding}>
          <CycleRing
            dayInCycle={stats.dayInCycle}
            cycleLength={stats.averageCycleLength}
            currentPhase={stats.currentPhase}
            periodLength={stats.averagePeriodLength}
          />
        </View>

        {/* Quick Actions */}
        <QuickActions />

        {/* Upcoming Events */}
        <UpcomingEvents stats={stats} />

        {/* Daily Insight */}
        <View style={styles.insightContainer}>
          <DailyInsight phase={stats.currentPhase} dayInCycle={stats.dayInCycle} />
        </View>
      </View>
    </MobileLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24, // pb: 3
  },
  header: {
    paddingHorizontal: 16, // px: 2
    paddingTop: 24, // pt: 3
    paddingBottom: 16, // pb: 2
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap: 1
  },
  brandText: {
    fontWeight: '700',
  },
  dateContainer: {
    alignItems: 'flex-end', // textAlign: 'right'
  },
  dateText: {
    fontWeight: '500',
  },
  sectionPadding: {
    paddingVertical: 24, // py: 3
  },
  insightContainer: {
    marginTop: 24, // mt: 3
  },
});