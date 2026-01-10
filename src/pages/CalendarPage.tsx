import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton, Card, useTheme } from 'react-native-paper';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { MobileLayout } from '../components/layout/MobileLayout';
import { useCycleStore } from '../hooks/useCycleStore';
import { CyclePhase } from '../types/cycle';


// Constants (Move to theme/constants file in production)
const cyclePhaseColors: Record<CyclePhase, string> = {
  menstruation: '#FF5252',
  follicular: '#448AFF',
  ovulation: '#69F0AE',
  luteal: '#FFAB40',
};

const phaseLabels: Record<CyclePhase, string> = {
  menstruation: 'Period',
  follicular: 'Follicular',
  ovulation: 'Ovulation',
  luteal: 'Luteal',
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { getPhaseForDate, dayLogs } = useCycleStore();
  const theme = useTheme();

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const isToday = (date: Date) => isSameDay(date, new Date());

  const getDayStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dayLogs.find((l) => l.date === dateStr);
    const phase = getPhaseForDate(dateStr);
    return { log, phase };
  };

  return (
    <MobileLayout>
      <View style={styles.container}>
        
        {/* Month Navigation */}
        <View style={styles.header}>
          <IconButton
            icon="chevron-left"
            size={24}
            onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
          />
          <Text variant="headlineSmall" style={styles.monthTitle}>
            {format(currentMonth, 'MMMM yyyy')}
          </Text>
          <IconButton
            icon="chevron-right"
            size={24}
            onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
          />
        </View>

        {/* Week Days Header */}
        <View style={styles.weekRow}>
          {weekDays.map((day) => (
            <Text
              key={day}
              variant="labelSmall"
              style={[styles.weekDayText, { color: theme.colors.onSurfaceVariant }]}
            >
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {days.map((day) => {
            const { log, phase } = getDayStatus(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isPeriodDay = log?.isPeriod;
            
            // Background logic: Solid color for period, transparent (hex alpha) for phases
            const backgroundColor = isPeriodDay
              ? cyclePhaseColors[phase]
              : `${cyclePhaseColors[phase]}20`; // ~12% opacity hex

            const textColor = isPeriodDay 
              ? '#ffffff' 
              : theme.colors.onSurface;

            return (
              <View key={day.toISOString()} style={styles.dayWrapper}>
                <TouchableOpacity
                  style={[
                    styles.dayCell,
                    {
                      backgroundColor,
                      opacity: isCurrentMonth ? 1 : 0.3,
                      borderColor: theme.colors.primary,
                      borderWidth: isToday(day) ? 2 : 0,
                    },
                  ]}
                  activeOpacity={0.7}
                  // Add navigation logic here if needed, e.g., onPress={() => navigate('Log', { date: day })}
                >
                  <Text
                    variant="bodyMedium"
                    style={{ color: textColor, fontWeight: '500' }}
                  >
                    {format(day, 'd')}
                  </Text>
                  
                  {isPeriodDay && (
                    <Text style={styles.dotIndicator}>•</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Legend */}
        <Card style={styles.legendCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.legendTitle}>
              Cycle Phases
            </Text>
            <View style={styles.legendGrid}>
              {(Object.keys(cyclePhaseColors) as CyclePhase[]).map((phase) => (
                <View key={phase} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: cyclePhaseColors[phase] },
                    ]}
                  />
                  <Text 
                    variant="bodyMedium" 
                    style={{ color: theme.colors.onSurfaceVariant, textTransform: 'capitalize' }}
                  >
                    {phaseLabels[phase]}
                  </Text>
                </View>
              ))}
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  monthTitle: {
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1, // Distribute space evenly (100% / 7)
    textAlign: 'center',
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayWrapper: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1, // Keeps cells square
    padding: 2, // Creates the gap effect between cells
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dotIndicator: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginTop: -4,
    position: 'absolute',
    bottom: 4,
  },
  legendCard: {
    marginTop: 24,
  },
  legendTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    width: '50%', // 2 columns
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});