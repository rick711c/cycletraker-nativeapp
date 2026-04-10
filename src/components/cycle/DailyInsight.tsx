import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { cyclePhaseColors } from '../../theme/muiTheme';
import Icon from '../ui/Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AppMode = 'trackCycle' | 'tryToConceive';

interface CycleDayInsight {
  dayRange: [number, number];
  phase: 'menstruation' | 'follicular' | 'ovulation' | 'luteal';
  biologicalState: string;
  symptoms: Record<string, string>;
  pregnancyProbability: string;
  careRoutine: {
    diet: string;
    remedy: string;
    activity: string;
  };
  modeInsights: {
    trackCycle: string;
    tryToConceive: string;
  };
}

interface DailyInsightProps {
  dayInCycle: number;
  appMode: AppMode;
}

// ---------------------------------------------------------------------------
// Data — 28-day cycle broken into specific day ranges
// ---------------------------------------------------------------------------

export const cycleDayInsights: CycleDayInsight[] = [
  // ==========================================
  // MENSTRUATION PHASE (Days 1 - 5)
  // ==========================================
  {
    dayRange: [1, 2],
    phase: 'menstruation',
    biologicalState:
      'Uterine lining is actively shedding. Prostaglandin levels are at their absolute highest.',
    symptoms: {
      cramps: 'Severe to Moderate',
      headache: 'High risk (due to estrogen drop)',
      mood: 'Fatigued, easily irritated, sensitive',
      libido: 'Usually low, but varies per individual',
    },
    pregnancyProbability: 'Extremely Low',
    careRoutine: {
      diet: 'Iron-rich foods (spinach, lentils), dark chocolate (magnesium), warm soups.',
      remedy:
        'Hot water bag on lower abdomen, warm baths, ginger tea for inflammation.',
      activity: 'Complete rest. Light stretching only if comfortable.',
    },
    modeInsights: {
      trackCycle:
        "Your body is working hard today. Prostaglandins are causing those cramps. Prioritize rest, use a hot water bag, and don't push yourself.",
      tryToConceive:
        'Take this time to rest and reset. Conception is extremely unlikely right now. Focus on nurturing your body for the upcoming cycle.',
    },
  },
  {
    dayRange: [3, 5],
    phase: 'menstruation',
    biologicalState:
      'Shedding slows down. Estrogen begins a very slow climb.',
    symptoms: {
      cramps: 'Mild to None',
      headache: 'Decreasing',
      mood: 'Energy slowly returning, brain fog lifting',
      libido: 'Slowly increasing',
    },
    pregnancyProbability: 'Low',
    careRoutine: {
      diet: 'Vitamin C to help absorb iron, hydrating fruits.',
      remedy: 'Hydration is key to flush out toxins.',
      activity: 'Light yoga or short walks.',
    },
    modeInsights: {
      trackCycle:
        'The worst is behind you! As bleeding lightens, you might feel your energy slowly creeping back. Stay hydrated.',
      tryToConceive:
        'Your period is wrapping up. Start preparing your body for the fertile window coming up next week.',
    },
  },

  // ==========================================
  // FOLLICULAR PHASE (Days 6 - 11)
  // ==========================================
  {
    dayRange: [6, 8],
    phase: 'follicular',
    biologicalState:
      'FSH (Follicle Stimulating Hormone) is urging your ovaries to prepare eggs. Estrogen is rising.',
    symptoms: {
      cramps: 'None',
      headache: 'Rare',
      mood: 'Optimistic, clear-headed, motivated',
      libido: 'Moderate',
    },
    pregnancyProbability:
      'Low to Medium (Sperm can live up to 5 days inside the body)',
    careRoutine: {
      diet: 'Lean proteins, fresh salads, fermented foods (kombucha, yogurt) for gut health.',
      remedy: 'None typically needed.',
      activity:
        'Cardio, strength training—your body recovers faster now.',
    },
    modeInsights: {
      trackCycle:
        'Estrogen is your best friend right now! Enjoy the clear skin and brain power. Tackle difficult tasks today.',
      tryToConceive:
        'Your fertile window is approaching. Having intercourse every other day starting now ensures sperm are waiting when the egg drops.',
    },
  },
  {
    dayRange: [9, 11],
    phase: 'follicular',
    biologicalState:
      'Estrogen is approaching its peak. Cervical mucus is becoming thinner and stretchier.',
    symptoms: {
      cramps: 'None',
      headache: 'None',
      mood: 'Highly social, confident, energetic',
      libido: 'High',
    },
    pregnancyProbability: 'Medium to High (Entering fertile window)',
    careRoutine: {
      diet: 'Cruciferous vegetables (broccoli, kale) to help process high estrogen.',
      remedy: 'None.',
      activity:
        'High-intensity interval training (HIIT), social activities.',
    },
    modeInsights: {
      trackCycle:
        'You are in your power phase. Your communication skills and confidence are naturally peaking due to hormones.',
      tryToConceive:
        "Notice your cervical mucus changing? It\u2019s becoming \u201Csperm-friendly.\u201D This is a highly recommended time for intercourse.",
    },
  },

  // ==========================================
  // OVULATION PHASE (Days 12 - 16)
  // ==========================================
  {
    dayRange: [12, 14],
    phase: 'ovulation',
    biologicalState:
      'Luteinizing Hormone (LH) surges, causing the dominant follicle to release an egg.',
    symptoms: {
      cramps: 'Mild one-sided pain (Mittelschmerz) possible',
      headache: 'Possible due to sudden hormone shifts',
      mood: 'Magnetic, slightly emotionally heightened',
      libido: 'Peak / Highest of the cycle',
    },
    pregnancyProbability: 'PEAK / Maximum',
    careRoutine: {
      diet: 'Zinc-rich foods (pumpkin seeds), antioxidants (berries) to support the egg.',
      remedy: 'If you feel ovulation pain, a warm bath helps.',
      activity: 'Whatever feels good—your stamina is high.',
    },
    modeInsights: {
      trackCycle:
        'You are ovulating! You might feel a slight twinge on one side of your abdomen. Your body temperature might slightly rise.',
      tryToConceive:
        '\uD83D\uDEA8 Prime Time! This is your peak fertility window. The egg only survives for 12-24 hours after release, so intercourse today or tomorrow is crucial.',
    },
  },
  {
    dayRange: [15, 16],
    phase: 'ovulation',
    biologicalState:
      'The egg is traveling down the fallopian tube. Estrogen drops sharply.',
    symptoms: {
      cramps: 'None',
      headache: 'Possible (Estrogen crash)',
      mood: 'Slight energy dip, becoming more introspective',
      libido: 'Decreasing',
    },
    pregnancyProbability: 'Medium (Dropping rapidly)',
    careRoutine: {
      diet: 'Complex carbs (sweet potatoes, oats) to stabilize blood sugar.',
      remedy: 'Rest if the estrogen drop gives you a headache.',
      activity:
        'Transitioning to lighter workouts (Pilates, moderate weights).',
    },
    modeInsights: {
      trackCycle:
        "The main event is over. As estrogen drops, don't be surprised if your energy dips today. It's perfectly normal.",
      tryToConceive:
        'The fertile window is closing. Now begins the \u201CTwo Week Wait.\u201D Stay relaxed and avoid excessive stress.',
    },
  },

  // ==========================================
  // LUTEAL PHASE (Days 17 - 28)
  // ==========================================
  {
    dayRange: [17, 22],
    phase: 'luteal',
    biologicalState:
      'The corpus luteum produces progesterone to thicken the uterine lining. Your body is resting.',
    symptoms: {
      cramps: 'None',
      headache: 'Low risk',
      mood: 'Calm, nested, slightly sleepy',
      libido: 'Low',
    },
    pregnancyProbability: 'Low',
    careRoutine: {
      diet: 'Magnesium-rich foods, B-vitamins to support progesterone.',
      remedy: 'Focus on good sleep hygiene.',
      activity: 'Walking, yoga, lifting lighter weights.',
    },
    modeInsights: {
      trackCycle:
        'Progesterone is your dominant hormone now. It acts like a natural sedative, which is why you might feel more relaxed or sleepier than usual.',
      tryToConceive:
        'Your body is increasing progesterone to prepare the uterus for a potential fertilized egg. Keep up the healthy habits.',
    },
  },
  {
    dayRange: [23, 28],
    phase: 'luteal',
    biologicalState:
      'If no pregnancy occurred, progesterone and estrogen crash dramatically.',
    symptoms: {
      cramps: 'Mild to Moderate building up',
      headache: 'High risk (hormone crash)',
      mood: 'Irritable, anxious, cravings, emotional',
      libido: 'Varies (can spike right before period)',
    },
    pregnancyProbability: 'Extremely Low',
    careRoutine: {
      diet: 'Avoid salty foods (reduces bloating). Eat small, frequent meals to stop blood sugar crashes. Drink chamomile tea.',
      remedy: 'Magnesium supplements, heating pad for early cramps.',
      activity:
        'Stretching, very light movement. Be gentle with yourself.',
    },
    modeInsights: {
      trackCycle:
        'Hormone levels are dropping sharply, which can cause PMS, irritability, and bloating. Treat yourself with grace and keep a hot water bag handy.',
      tryToConceive:
        'This is the hardest part of the wait. Try not to stress-test too early. If you feel PMS symptoms, remember they often mimic early pregnancy symptoms.',
    },
  },
];

// ---------------------------------------------------------------------------
// Helper — look up the matching insight for a given cycle day
// ---------------------------------------------------------------------------

export function getInsightForDay(
  currentDayOfCycle: number,
  _userMode: AppMode,
): CycleDayInsight {
  // Clamp: if the cycle exceeds 28 days, fall back to the last entry (Days 23-28)
  const day = currentDayOfCycle > 28 ? 28 : Math.max(1, currentDayOfCycle);

  const match = cycleDayInsights.find(
    (entry) => day >= entry.dayRange[0] && day <= entry.dayRange[1],
  );

  // Should always match, but safe fallback to the final luteal entry
  return match ?? cycleDayInsights[cycleDayInsights.length - 1];
}

// ---------------------------------------------------------------------------
// Phase display helpers
// ---------------------------------------------------------------------------

const phaseIcons: Record<string, string> = {
  menstruation: 'water-outline',
  follicular: 'trending-up',
  ovulation: 'star-four-points-outline',
  luteal: 'moon-waning-crescent',
};

const phaseLabels: Record<string, string> = {
  menstruation: 'Menstruation',
  follicular: 'Follicular',
  ovulation: 'Ovulation',
  luteal: 'Luteal',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DailyInsight({ dayInCycle, appMode }: DailyInsightProps) {
  const theme = useTheme();
  const insight = getInsightForDay(dayInCycle, appMode);
  const phaseColor =
    cyclePhaseColors[insight.phase] ?? theme.colors.primary;

  const symptomEntries = Object.entries(insight.symptoms);

  return (
    <View style={styles.container}>
      <Card
        style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
      >
        <Card.Content style={styles.content}>
          {/* ── Header ─────────────────────────────────────── */}
          <View style={styles.headerRow}>
            <Icon
              name={phaseIcons[insight.phase] ?? 'creation'}
              size={18}
              color={phaseColor}
            />
            <Text
              variant="labelLarge"
              style={{
                color: phaseColor,
                fontWeight: '600',
                marginLeft: 8,
              }}
            >
              Daily Insight
            </Text>
            <View style={{ flex: 1 }} />
            <Text
              variant="labelSmall"
              style={{
                color: theme.colors.onSurfaceVariant,
                textTransform: 'capitalize',
              }}
            >
              {phaseLabels[insight.phase]} · Day {dayInCycle}
            </Text>
          </View>

          {/* ── Primary Mode Message ───────────────────────── */}
          <Text
            variant="titleMedium"
            style={[styles.primaryMessage, { color: theme.colors.onSurface }]}
          >
            {insight.modeInsights[appMode]}
          </Text>

          {/* ── Biological State ───────────────────────────── */}
          <View
            style={[
              styles.bioStateBox,
              { backgroundColor: `${phaseColor}15` },
            ]}
          >
            <Text
              variant="labelSmall"
              style={{
                color: phaseColor,
                fontWeight: '700',
                marginBottom: 4,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              What's happening in your body
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurface, lineHeight: 18 }}
            >
              {insight.biologicalState}
            </Text>
          </View>

          {/* ── Care Routine Tip ────────────────────────────── */}
          <View
            style={[
              styles.tipBox,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              variant="labelSmall"
              style={{
                color: theme.colors.primary,
                fontWeight: '700',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              💡 Care Routine
            </Text>
            {insight.careRoutine.remedy ? (
              <View style={styles.tipRow}>
                <Icon
                  name="hand-heart-outline"
                  size={14}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text
                  variant="bodySmall"
                  style={[styles.tipText, { color: theme.colors.onSurface }]}
                >
                  {insight.careRoutine.remedy}
                </Text>
              </View>
            ) : null}
            <View style={styles.tipRow}>
              <Icon
                name="food-apple-outline"
                size={14}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                variant="bodySmall"
                style={[styles.tipText, { color: theme.colors.onSurface }]}
              >
                {insight.careRoutine.diet}
              </Text>
            </View>
            <View style={styles.tipRow}>
              <Icon
                name="run"
                size={14}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                variant="bodySmall"
                style={[styles.tipText, { color: theme.colors.onSurface }]}
              >
                {insight.careRoutine.activity}
              </Text>
            </View>
          </View>

          {/* ── Symptom Expectations ────────────────────────── */}
          <Text
            variant="labelSmall"
            style={{
              color: theme.colors.onSurfaceVariant,
              fontWeight: '700',
              marginTop: 16,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            What to expect today
          </Text>
          <View style={styles.chipRow}>
            {symptomEntries.map(([key, value]) => (
              <Chip
                key={key}
                compact
                textStyle={{ fontSize: 11 }}
                style={[
                  styles.chip,
                  { backgroundColor: `${phaseColor}18` },
                ]}
              >
                {formatSymptomLabel(key)}: {value}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSymptomLabel(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryMessage: {
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 16,
  },
  bioStateBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  tipBox: {
    borderRadius: 12,
    padding: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    lineHeight: 18,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 20,
  },
});