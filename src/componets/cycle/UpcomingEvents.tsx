import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, Icon } from 'react-native-paper';
import { format, parseISO, differenceInDays } from 'date-fns';

// --- Types ---
// Assuming CycleStats definition based on usage
export interface CycleStats {
  nextPeriodDate: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
}

interface UpcomingEventsProps {
  stats: CycleStats;
}

// --- Constants ---
const COLORS = {
  primary: '#e11d48', // hsl(var(--primary))
  chart2: '#22c55e',  // hsl(var(--chart-2))
};

export function UpcomingEvents({ stats }: UpcomingEventsProps) {
  const today = new Date();
  const nextPeriod = parseISO(stats.nextPeriodDate);
  const ovulation = parseISO(stats.ovulationDate);
  const fertileStart = parseISO(stats.fertileWindowStart);
  const fertileEnd = parseISO(stats.fertileWindowEnd);

  const daysUntilPeriod = differenceInDays(nextPeriod, today);
  const daysUntilOvulation = differenceInDays(ovulation, today);
  const isInFertileWindow = today >= fertileStart && today <= fertileEnd;

  // Map Lucide icons to MaterialCommunityIcons names used by Paper
  const events = [
    {
      icon: 'weather-night', // Represents Moon
      label: 'Next Period',
      date: format(nextPeriod, 'MMM d'),
      days: daysUntilPeriod,
      color: COLORS.primary,
      bgColor: `${COLORS.primary}1A`, // 10% opacity (hex 1A)
    },
    {
      icon: 'heart', // Represents Heart
      label: isInFertileWindow ? 'Fertile Window' : 'Ovulation',
      date: isInFertileWindow ? 'Now' : format(ovulation, 'MMM d'),
      days: isInFertileWindow ? 0 : daysUntilOvulation,
      color: COLORS.chart2,
      bgColor: `${COLORS.chart2}1A`, // 10% opacity
    },
  ];

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.header}>Upcoming</Text>
      
      <View style={styles.grid}>
        {events.map((event) => (
          <Card key={event.label} style={styles.card} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <View 
                style={[
                  styles.iconContainer, 
                  { backgroundColor: event.bgColor }
                ]}
              >
                <Icon source={event.icon} size={20} color={event.color} />
              </View>
              
              <Text variant="labelMedium" style={styles.label}>{event.label}</Text>
              
              <Text 
                variant="titleLarge" 
                style={[styles.daysText, { color: event.color }]}
              >
                {event.days === 0 ? 'Today!' : `${event.days} days`}
              </Text>
              
              <Text variant="bodySmall" style={styles.dateText}>{event.date}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16, // px-4
    width: '100%',
    marginBottom: 12, // space-y-3 approximation
  },
  header: {
    fontWeight: '600',
    marginBottom: 12, // space-y-3
    color: '#0f172a', // foreground
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12, // gap-3
  },
  card: {
    flex: 1, // grid-cols-2 equivalent (equal width)
    backgroundColor: 'white',
    elevation: 1, // shadow-sm
  },
  cardContent: {
    padding: 16, // p-4
  },
  iconContainer: {
    width: 40, // w-10
    height: 40, // h-10
    borderRadius: 20, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12, // mb-3
  },
  label: {
    fontWeight: '500',
    color: '#0f172a', // foreground
    marginBottom: 2,
  },
  daysText: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dateText: {
    color: '#64748b', // text-muted-foreground
  },
});