import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from '../ui/Icon';
import { format, parseISO, differenceInDays } from 'date-fns';
import type { CycleStats } from '@/types/cycle';

// --- Types & Constants ---

// Assuming you might not have the theme file set up yet in RN, 
// I've included the colors here. You can move these to your theme config later.
const cyclePhaseColors = {
  menstruation: '#FF5252',
  follicular: '#448AFF',
  ovulation: '#69F0AE',
  luteal: '#FFAB40',
};

const chartColors = {
  chart2: '#E91E63', // Pink/Heart color
};

interface UpcomingEventsProps {
  stats: CycleStats;
}

export function UpcomingEvents({ stats }: UpcomingEventsProps) {
  const today = new Date();
  
  // Guard clause to prevent crashes if stats aren't loaded yet
  if (!stats) return null;

  const nextPeriod = parseISO(stats.nextPeriodDate);
  const ovulation = parseISO(stats.ovulationDate);
  const fertileStart = parseISO(stats.fertileWindowStart);
  const fertileEnd = parseISO(stats.fertileWindowEnd);

  const daysUntilPeriod = differenceInDays(nextPeriod, today);
  const daysUntilOvulation = differenceInDays(ovulation, today);
  const isInFertileWindow = today >= fertileStart && today <= fertileEnd;

  const isPeriodLate = daysUntilPeriod < 0;
  const isOvulationPast = daysUntilOvulation < 0;

  const events = [
    {
      icon: isPeriodLate ? 'alert-circle' : 'weather-night',
      label: isPeriodLate ? 'Period late by' : 'Next Period',
      date: format(nextPeriod, 'MMM d'),
      days: Math.abs(daysUntilPeriod),
      color: cyclePhaseColors.menstruation,
      isLate: isPeriodLate,
    },
    {
      icon: isInFertileWindow ? 'heart' : (isOvulationPast ? 'calendar-check' : 'heart'),
      label: isInFertileWindow
        ? 'Fertile Window'
        : isOvulationPast
          ? 'Ovulation was'
          : 'Ovulation in',
      date: isInFertileWindow ? 'Now' : format(ovulation, 'MMM d'),
      days: isInFertileWindow ? 0 : Math.abs(daysUntilOvulation),
      color: chartColors.chart2,
      isLate: isOvulationPast && !isInFertileWindow,
    },
  ];

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.headerTitle}>
        Upcoming
      </Text>
      
      <View style={styles.grid}>
        {events.map((event) => (
          <Card
            key={event.label}
            style={[
              styles.card,
              event.isLate && {
                borderWidth: 1.5,
                borderColor: event.color,
                elevation: 4,
              },
            ]}
          >
            <Card.Content style={styles.cardContent}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: event.isLate
                      ? `${event.color}30`   // stronger tint when late
                      : `${event.color}15`,
                  },
                ]}
              >
                <Icon icon={event.icon} size={20} color={event.color} />
              </View>
              
              <Text
                variant="bodyMedium"
                style={[
                  styles.label,
                  event.isLate && { color: event.color, fontWeight: '700' },
                ]}
              >
                {event.label}
              </Text>
              
              <Text 
                variant="headlineSmall" 
                style={[styles.daysText, { color: event.color }]}
              >
                {event.days === 0
                  ? 'Today!'
                  : `${event.days} day${event.days !== 1 ? 's' : ''}`}
              </Text>
              
              <Text
                variant="labelSmall"
                style={[
                  styles.dateText,
                  event.isLate && { color: event.color },
                ]}
              >
                {event.isLate ? `Since ${event.date}` : event.date}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16, // px: 2
  },
  headerTitle: {
    fontWeight: '600',
    marginBottom: 16, // mb: 2
  },
  grid: {
    flexDirection: 'row',
    gap: 16, // gap: 2 (MUI spacing 2 = 16px)
  },
  card: {
    flex: 1, // mimics grid 1fr
  },
  cardContent: {
    padding: 16, // p: 2
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20, // 50%
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12, // mb: 1.5
  },
  label: {
    fontWeight: '500',
    // color: text.primary is default
  },
  daysText: {
    fontWeight: '700',
    marginVertical: 2,
    fontSize: 24, // Explicitly setting size can help match h5 visuals
  },
  dateText: {
    color: '#666666', // text.secondary
  },
});