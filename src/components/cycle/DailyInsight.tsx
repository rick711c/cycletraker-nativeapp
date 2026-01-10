import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { cyclePhaseColors } from '../../theme/muiTheme';
import Icon from '../ui/Icon';

// --- Types & Data ---

export type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

interface DailyInsightProps {
  phase: CyclePhase;
  dayInCycle: number;
}

const insights: Record<CyclePhase, { title: string; description: string; tip: string }> = {
  menstruation: {
    title: 'Rest & Restore',
    description:
      'Estrogen and progesterone are at their lowest. Your body is shedding the uterine lining.',
    tip: 'Stay hydrated and prioritize rest. Iron-rich foods can help replenish what you lose.',
  },
  follicular: {
    title: 'Rising Energy',
    description:
      'Estrogen is climbing! You may notice improved mood, energy, and creativity.',
    tip: 'Great time for new projects and challenging workouts. Your brain is primed for learning.',
  },
  ovulation: {
    title: 'Peak Vitality',
    description:
      'Estrogen peaks and testosterone surges briefly. Many feel their most confident now.',
    tip: 'Highest fertility window. You may feel more social and communicative.',
  },
  luteal: {
    title: 'Winding Down',
    description:
      'Progesterone rises, preparing the body for potential pregnancy or the next cycle.',
    tip: 'Cravings may increase. Focus on balanced meals and be gentle with yourself.',
  },
};

// --- Component ---

export function DailyInsight({ phase, dayInCycle }: DailyInsightProps) {
  const insight = insights[phase];
  const theme = useTheme();
  const highlightColor = cyclePhaseColors[phase] ?? theme.colors.primary;
  const cardBackgroundColor = theme.colors.surfaceVariant;

  return (
    <View style={styles.container}>
      <Card style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        <Card.Content style={styles.content}>
          
          {/* Header */}
          <View style={styles.headerRow}>
            {/* Note: Ensure you have an icon set loaded or use a valid Paper icon name */}
            <Icon icon="creation" size={18} color={highlightColor} />
            <Text
              variant="labelLarge"
              style={{ color: highlightColor, fontWeight: '600', marginLeft: 8 }}
            >
              Daily Insight
            </Text>
          </View>

          {/* Title & Description */}
          <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onSurface }] }>
            {insight.title}
          </Text>
          <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }] }>
            {insight.description}
          </Text>

          {/* Tip Box */}
          <View style={[styles.tipBox, { backgroundColor: theme.colors.surface }]}> 
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              💡 {insight.tip}
            </Text>
          </View>

        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 12,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: '700',
    marginBottom: 4,
    // color set dynamically from theme
  },
  description: {
    marginBottom: 16,
    // color set dynamically from theme
  },
  tipBox: {
    borderRadius: 8,
    padding: 12,
  },
});