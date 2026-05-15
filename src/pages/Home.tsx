import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from '../components/ui/Icon';
import { CycleRing } from '../components/cycle/CycleRing';
import { SmartDailyInsight } from '../components/cycle/SmartDailyInsight';
import { AppMode } from '../types/insight';
import { QuickActions } from '../components/cycle/QuickActions';
import { UpcomingEvents } from '../components/cycle/UpcomingEvents';
import { useAppSelector } from '../store';
import { selectCycleStats, selectSettings } from '../store/cycleSlice';

export default function Home() {
  const theme = useTheme();
  const stats: any = useAppSelector(selectCycleStats);
  const settings = useAppSelector(selectSettings);
  const appMode: AppMode = settings.goal === 'conceive' ? 'tryToConceive' : (settings.goal === 'pregnancy' ? 'trackPregnancy' : 'trackCycle');


  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Icon icon="flower" size={28} color={theme.colors.primary} />
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
        <SmartDailyInsight dayInCycle={stats.dayInCycle} appMode={appMode} />
      </View>
    </ScrollView>
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