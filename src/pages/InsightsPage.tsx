import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import Icon from '../components/ui/Icon';
import { MobileLayout } from '../components/layout/MobileLayout';
import { useCycleStore } from '../hooks/useCycleStore';

// Constants
// You can move these to a central theme file later
const cyclePhaseColors = {
  menstruation: '#FF5252',
  follicular: '#448AFF',
  ovulation: '#69F0AE',
  luteal: '#FFAB40',
};

const chartColors = {
  chart2: '#E91E63',
  chart3: '#9C27B0',
  chart4: '#00BCD4',
};

export default function InsightsPage() {
  const theme = useTheme();
  const { getCycleStats, cycles, dayLogs } = useCycleStore();
  const stats = getCycleStats();

  const insights = useMemo(() => {
    const completedCycles = cycles.filter((c) => c.length);
    const avgCycleLength =
      completedCycles.length > 0
        ? Math.round(
            completedCycles.reduce((sum, c) => sum + (c.length || 0), 0) / completedCycles.length
          )
        : stats.averageCycleLength;

    const moodCounts: Record<string, number> = {};
    const symptomCounts: Record<string, number> = {};

    dayLogs.forEach((log) => {
      log.moods.forEach((mood) => {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      });
      log.symptoms.forEach((symptom) => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });

    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    const topSymptom = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      avgCycleLength,
      totalCycles: cycles.length,
      totalLogs: dayLogs.length,
      topMood: topMood ? topMood[0] : null,
      topSymptom: topSymptom ? topSymptom[0] : null,
    };
  }, [cycles, dayLogs, stats]);

  const statCards = [
    {
      icon: 'calendar-today', // MaterialCommunityIcons name for CalendarTodayIcon
      label: 'Avg Cycle',
      value: `${insights.avgCycleLength} days`,
      color: cyclePhaseColors.menstruation,
    },
    {
      icon: 'clock-outline', // MaterialCommunityIcons name for AccessTimeIcon
      label: 'Cycles Tracked',
      value: insights.totalCycles.toString(),
      color: chartColors.chart2,
    },
    {
      icon: 'chart-line', // MaterialCommunityIcons name for ShowChartIcon
      label: 'Days Logged',
      value: insights.totalLogs.toString(),
      color: chartColors.chart3,
    },
    {
      icon: 'trending-up', // MaterialCommunityIcons name for TrendingUpIcon
      label: 'Current Day',
      value: `Day ${stats.dayInCycle}`,
      color: chartColors.chart4,
    },
  ];

  return (
    <MobileLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Insights
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Understand your patterns
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statCards.map((stat) => (
            <Card key={stat.label} style={styles.statCard}>
              <Card.Content style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${stat.color}15` }, // Hex opacity (~8%)
                  ]}
                >
                  <Icon icon={stat.icon} size={20} color={stat.color} />
                </View>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stat.value}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {stat.label}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Patterns */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Your Patterns
            </Text>

            {insights.totalLogs > 0 ? (
              <View style={styles.patternsList}>
                {insights.topMood && (
                  <View style={[styles.patternRow, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      Most common mood
                    </Text>
                    <Text variant="bodyLarge" style={[styles.patternValue, { color: theme.colors.onSurface }]}>
                      {insights.topMood}
                    </Text>
                  </View>
                )}
                {insights.topSymptom && (
                  <View style={[styles.patternRow, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      Most common symptom
                    </Text>
                    <Text variant="bodyLarge" style={[styles.patternValue, { color: theme.colors.onSurface }]}>
                      {insights.topSymptom.replace('_', ' ')}
                    </Text>
                  </View>
                )}
                <View style={[styles.patternRow, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Next period in
                  </Text>
                  <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: '600' }}>
                    {Math.max(0, stats.averageCycleLength - stats.dayInCycle)} days
                  </Text>
                </View>
              </View>
            ) : (
              <Text 
                variant="bodyMedium" 
                style={[styles.emptyStateText, { color: theme.colors.onSurfaceVariant }]}
              >
                Start logging to see your patterns! 📊
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Health Tip */}
        <Card style={[styles.sectionCard, { backgroundColor: '#FFF0F1' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: '#000000' }]}>
              💡 Health Tip
            </Text>
            <Text variant="bodyMedium" style={{ color: '#666666' }}>
              Tracking your cycle consistently helps identify patterns and potential health issues early.
              Try to log at least your period dates and major symptoms for the most accurate insights.
            </Text>
          </Card.Content>
        </Card>
      </View>
    </MobileLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    width: '47%', 
    flexGrow: 1,
  },
  cardContent: {
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 4,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  patternsList: {
    gap: 12,
  },
  patternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  patternValue: {
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  emptyStateText: {
    textAlign: 'center',
    paddingVertical: 32,
  },
});