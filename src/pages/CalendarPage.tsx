import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton, Card, Divider, useTheme } from 'react-native-paper';
import Icon from '../components/ui/Icon';
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
  parseISO,
  differenceInDays,
} from 'date-fns';
import { MobileLayout } from '../components/layout/MobileLayout';
import { useAppSelector } from '../store';
import { selectDayLogs, selectSettings, getPhaseForDate } from '../store/cycleSlice';
import { CyclePhase } from '../types/cycle';
import { getInsightForDay } from '../lib/insightHelpers';
import { AppMode } from '../types/insight';


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
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const dayLogs = useAppSelector(selectDayLogs);
  const settings = useAppSelector(selectSettings);
  const theme = useTheme();
  
  const appMode: AppMode = settings.goal === 'conceive' ? 'tryToConceive' : (settings.goal === 'pregnancy' ? 'trackPregnancy' : 'trackCycle');

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
    const phase = getPhaseForDate(settings, dateStr);
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
              : `${cyclePhaseColors[phase]}40`; // ~25% opacity hex

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
                      borderColor: isToday(day) ? theme.colors.primary : (selectedDay && isSameDay(day, selectedDay) ? theme.colors.secondary : 'transparent'),
                      borderWidth: isToday(day) || (selectedDay && isSameDay(day, selectedDay)) ? 2 : 0,
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    const todayStr = format(new Date(), 'yyyy-MM-dd');
                    const dayStr = format(day, 'yyyy-MM-dd');
                    if (dayStr >= todayStr) {
                      setSelectedDay(prev => prev && isSameDay(prev, day) ? null : day);
                    }
                  }}
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

        {/* Selected Day Insight */}
        {selectedDay && (
          <Card style={[styles.insightCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.insightCardContent}>
               {(() => {
                 const getDayInCycleForDate = (date: Date) => {
                    if (!settings?.lastPeriodDate) return 1;
                    const lastPeriod = parseISO(settings.lastPeriodDate);
                    const dayDiff = differenceInDays(date, lastPeriod);
                    
                    if (appMode === 'trackPregnancy') {
                       return dayDiff >= 0 ? dayDiff + 1 : 1; 
                    }
                    
                    const dayInCycle = dayDiff % settings.averageCycleLength;
                    const adjusted = dayInCycle < 0 ? dayInCycle + settings.averageCycleLength : dayInCycle;
                    return adjusted + 1;
                 };
                 const dayInCycle = getDayInCycleForDate(selectedDay);
                 const insight = getInsightForDay(dayInCycle, appMode);
                 return (
                   <>
                     {/* Header row with AI icon */}
                     <View style={styles.insightHeader}>
                       <View style={[styles.insightIconCircle, { backgroundColor: `${theme.colors.primary}18` }]}>
                         <Icon name="creation" size={20} color={theme.colors.primary} />
                       </View>
                       <View style={{ flex: 1 }}>
                         <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                           Insight for {format(selectedDay, 'MMMM d')}
                         </Text>
                         <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                           Cycle Day {dayInCycle}
                         </Text>
                       </View>
                     </View>

                     <Divider style={{ marginVertical: 12, opacity: 0.3 }} />

                     {/* Summary text */}
                     <Text
                       variant="bodyMedium"
                       style={{ color: theme.colors.onSurface, lineHeight: 22 }}
                     >
                       {insight.summary}
                     </Text>

                     {/* AI Disclaimer */}
                     <View style={styles.insightDisclaimer}>
                       <Icon name="information-outline" size={12} color={theme.colors.onSurfaceVariant} />
                       <Text
                         variant="labelSmall"
                         style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4, flex: 1 }}
                       >
                         AI-generated · Not medical advice
                       </Text>
                     </View>
                   </>
                 );
               })()}
            </Card.Content>
          </Card>
        )}

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

  // Insight card
  insightCard: {
    marginTop: 20,
    borderRadius: 16,
    elevation: 0,
  },
  insightCardContent: {
    padding: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  insightIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightDisclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    opacity: 0.6,
  },
});