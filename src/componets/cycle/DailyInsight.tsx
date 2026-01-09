import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon, MD3Colors } from 'react-native-paper';

// --- Types ---
export type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

interface DailyInsightProps {
  phase: CyclePhase;
  dayInCycle: number;
}

// --- Data ---
const insights: Record<CyclePhase, { title: string; description: string; tip: string }> = {
  menstruation: {
    title: 'Rest & Restore',
    description: 'Estrogen and progesterone are at their lowest. Your body is shedding the uterine lining.',
    tip: 'Stay hydrated and prioritize rest. Iron-rich foods can help replenish what you lose.',
  },
  follicular: {
    title: 'Rising Energy',
    description: 'Estrogen is climbing! You may notice improved mood, energy, and creativity.',
    tip: 'Great time for new projects and challenging workouts. Your brain is primed for learning.',
  },
  ovulation: {
    title: 'Peak Vitality',
    description: 'Estrogen peaks and testosterone surges briefly. Many feel their most confident now.',
    tip: 'Highest fertility window. You may feel more social and communicative.',
  },
  luteal: {
    title: 'Winding Down',
    description: 'Progesterone rises, preparing the body for potential pregnancy or the next cycle.',
    tip: 'Cravings may increase. Focus on balanced meals and be gentle with yourself.',
  },
};

export function DailyInsight({ phase, dayInCycle }: DailyInsightProps) {
  const insight = insights[phase];

  return (
    <View style={styles.container}>
      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <View style={styles.headerRow}>
            {/* "Sparkles" icon from MaterialCommunityIcons (default in Paper) */}
            <Icon source="sparkles" size={16} color={MD3Colors.secondary20} />
            <Text variant="labelLarge" style={styles.headerText}>Daily Insight</Text>
          </View>
          
          <Text variant="titleMedium" style={styles.title}>{insight.title}</Text>
          <Text variant="bodyMedium" style={styles.description}>{insight.description}</Text>
          
          <View style={styles.tipContainer}>
            <Text variant="bodySmall" style={styles.tipText}>
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
    paddingHorizontal: 16, // px-4
    width: '100%',
  },
  card: {
    // bg-gradient-to-br from-accent to-card approximation
    // Using a subtle off-white/gray to mimic the gradient base
    backgroundColor: '#f8fafc', 
    borderWidth: 0,
    elevation: 1, // shadow-sm
  },
  cardContent: {
    padding: 16, // p-4
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
    marginBottom: 8, // mb-2
  },
  headerText: {
    fontWeight: '600',
    color: '#334155', // accent-foreground (slate-700 approx)
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4, // mb-1
    color: '#0f172a', // foreground (slate-900 approx)
  },
  description: {
    color: '#64748b', // muted-foreground (slate-500 approx)
    marginBottom: 12, // mb-3
  },
  tipContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // bg-card/50
    borderRadius: 8, // rounded-lg
    padding: 12, // p-3
  },
  tipText: {
    color: '#0f172a', // foreground
  },
});