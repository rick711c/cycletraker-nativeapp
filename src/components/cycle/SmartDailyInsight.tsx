import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Card, Text, Chip, Checkbox, Divider, useTheme } from 'react-native-paper';
import { cyclePhaseColors } from '@/src/theme/muiTheme';
import Icon from '@/src/components/ui/Icon';
import { AppMode, DailyInsightData, TryToConceiveInsight, PregnancyInsight, TrackCycleInsight } from '@/src/types/insight';
import { getInsightForDay } from '@/src/lib/insightHelpers';

// ---------------------------------------------------------------------------
// Phase display helpers
// ---------------------------------------------------------------------------

const phaseIcons: Record<string, string> = {
  menstruation: 'water-outline',
  follicular: 'trending-up',
  ovulation: 'star-four-points-outline',
  luteal: 'moon-waning-crescent',
  trimester_1: 'baby-carriage',
  trimester_2: 'human-pregnant',
  trimester_3: 'baby-face-outline',
};

const phaseLabels: Record<string, string> = {
  menstruation: 'Menstruation',
  follicular: 'Follicular',
  ovulation: 'Ovulation',
  luteal: 'Luteal',
  trimester_1: '1st Trimester',
  trimester_2: '2nd Trimester',
  trimester_3: '3rd Trimester',
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SmartDailyInsightProps {
  dayInCycle: number;
  appMode: AppMode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SmartDailyInsight({ dayInCycle, appMode }: SmartDailyInsightProps) {
  const theme = useTheme();
  const insight = getInsightForDay(dayInCycle, appMode);

  const phaseColor =
    cyclePhaseColors[insight.phase as keyof typeof cyclePhaseColors] ??
    theme.colors.primary;

  const symptomEntries = Object.entries(insight.symptoms);

  // Checklist state — local toggle for each item
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const toggleCheck = (index: number) =>
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));

  // Collapsible section state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    body: false,
    symptoms: false,
    care: false,
    hygiene: false,
  });
  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // Type narrowers
  const isTryToConceive = (d: DailyInsightData): d is TryToConceiveInsight =>
    'fertilityStatus' in d;
  const isPregnancy = (d: DailyInsightData): d is PregnancyInsight =>
    'babyDevelopment' in d;

  return (
    <View style={styles.root}>
      {/* ─── Section Title ─────────────────────────────────────── */}
      <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
        Daily Insight
      </Text>

      {/* ─── Phase Banner ──────────────────────────────────────── */}
      <View style={[styles.phaseBanner]}>
        <View style={[styles.phaseIconCircle, { backgroundColor: `${phaseColor}30` }]}>
          <Icon
            name={phaseIcons[insight.phase] ?? 'creation'}
            size={24}
            color={phaseColor}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" style={{ color: phaseColor, fontWeight: '700' }}>
            {phaseLabels[insight.phase] ?? 'Phase'} Phase
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Cycle Day {dayInCycle}
          </Text>
        </View>

        {/* Pregnancy Probability badge for non-pregnancy modes */}
        {!isPregnancy(insight) && (
          <View
            style={[
              styles.probabilityBadge,
              { backgroundColor: phaseColor },
            ]}
          >
            <Text style={styles.probabilityText}>
              {(insight as TrackCycleInsight | TryToConceiveInsight).pregnancyProbability}
            </Text>
          </View>
        )}
      </View>

      {/* ─── Summary ───────────────────────────────────────────── */}
      {/* <Text
        variant="bodyLarge"
        style={[styles.summaryText, { color: theme.colors.onSurface }]}
      >
        {insight.summary}
      </Text> */}

      {/* ─── Fertility Status (TryToConceive only) ─────────────── */}
      {/* {isTryToConceive(insight) && (
        <Card style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content style={styles.cardInner}>
            <View style={styles.cardHeader}>
              <Icon name="heart-pulse" size={22} color={theme.colors.primary} />
              <Text
                variant="titleSmall"
                style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700', marginLeft: 10 }}
              >
                Fertility Status
              </Text>
            </View>
            <Text
              variant="headlineSmall"
              style={{
                color: theme.colors.primary,
                fontWeight: '700',
                marginTop: 4,
              }}
            >
              {insight.fertilityStatus}
            </Text>
            <Divider style={{ marginVertical: 12, backgroundColor: `${theme.colors.primary}30` }} />
            <View style={styles.actionRow}>
              <Icon name="alert-circle-outline" size={18} color={theme.colors.onPrimaryContainer} />
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onPrimaryContainer, marginLeft: 8, flex: 1 }}
              >
                {insight.actionItem}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )} */}

      {/* ─── Baby Development (Pregnancy only) ────────────────── */}
      {/* {isPregnancy(insight) && (
        <Card style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content style={styles.cardInner}>
            <View style={styles.cardHeader}>
              <Icon name="baby-face-outline" size={22} color={theme.colors.primary} />
              <Text
                variant="titleSmall"
                style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700', marginLeft: 10 }}
              >
                Baby Development
              </Text>
            </View>
            <Text
              variant="bodyLarge"
              style={{
                color: theme.colors.onPrimaryContainer,
                marginTop: 6,
                lineHeight: 24,
              }}
            >
              {insight.babyDevelopment}
            </Text>
            <Divider style={{ marginVertical: 12, backgroundColor: `${theme.colors.primary}30` }} />
            <View style={styles.actionRow}>
              <Icon name="star-outline" size={18} color={theme.colors.primary} />
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onPrimaryContainer, marginLeft: 8, flex: 1, fontWeight: '600' }}
              >
                {insight.milestone}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )} */}

      {/* ─── Collapsible Detail Sections ──────────────────────── */}
      <View style={styles.collapsibleGroup}>
        {/* What's Happening in Your Body */}
        <Pressable
          onPress={() => toggleSection('body')}
          style={[
            styles.collapsibleButton,
            {
              borderColor: phaseColor,
              backgroundColor: expandedSections.body ? `${phaseColor}12` : 'transparent',
            },
          ]}
        >
          <View style={[styles.sectionIconCircle, { backgroundColor: `${phaseColor}18` }]}>
            <Icon name="human" size={20} color={phaseColor} />
          </View>
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.onSurface, fontWeight: '700', flex: 1, marginLeft: 10 }}
          >
            What's Happening In Your Body
          </Text>
          <Icon
            name={expandedSections.body ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
        </Pressable>
        {expandedSections.body && (
          <Card style={[styles.expandedCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.expandedCardInner}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}
              >
                {insight.biologicalState}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* What to Expect Today (Symptoms) */}
        <Pressable
          onPress={() => toggleSection('symptoms')}
          style={[
            styles.collapsibleButton,
            {
              borderColor: phaseColor,
              backgroundColor: expandedSections.symptoms ? `${phaseColor}12` : 'transparent',
            },
          ]}
        >
          <View style={[styles.sectionIconCircle, { backgroundColor: `${phaseColor}18` }]}>
            <Icon name="clipboard-pulse-outline" size={20} color={phaseColor} />
          </View>
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.onSurface, fontWeight: '700', flex: 1, marginLeft: 10 }}
          >
            What to Expect Today
          </Text>
          <Icon
            name={expandedSections.symptoms ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
        </Pressable>
        {expandedSections.symptoms && (
          <Card style={[styles.expandedCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.expandedCardInner}>
              <View style={styles.chipRow}>
                {symptomEntries.map(([key, value]) => (
                  <Chip
                    key={key}
                    icon={() => (
                      <Icon name="circle-medium" size={14} color={phaseColor} />
                    )}
                    textStyle={styles.chipText}
                    style={[styles.chip, { backgroundColor: `${phaseColor}14` }]}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:{' '}
                    <Text style={{ fontWeight: '700' }}>{value}</Text>
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Care Routine */}
        <Pressable
          onPress={() => toggleSection('care')}
          style={[
            styles.collapsibleButton,
            {
              borderColor: theme.colors.primary,
              backgroundColor: expandedSections.care ? `${theme.colors.primary}12` : 'transparent',
            },
          ]}
        >
          <View style={[styles.sectionIconCircle, { backgroundColor: `${theme.colors.primary}18` }]}>
            <Icon name="lightbulb-on-outline" size={20} color={theme.colors.primary} />
          </View>
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.onSurface, fontWeight: '700', flex: 1, marginLeft: 10 }}
          >
            Care Routine
          </Text>
          <Icon
            name={expandedSections.care ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
        </Pressable>
        {expandedSections.care && (
          <Card style={[styles.expandedCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.expandedCardInner}>
              {/* Diet */}
              <View style={styles.routineItem}>
                <View style={[styles.routineIconBox, { backgroundColor: '#4CAF5018' }]}>
                  <Icon name="food-apple-outline" size={22} color="#4CAF50" />
                </View>
                <View style={styles.routineContent}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                    Diet
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant, marginTop: 2, lineHeight: 20 }}
                  >
                    {insight.careRoutine.diet}
                  </Text>
                </View>
              </View>

              <Divider style={styles.routineDivider} />

              {/* Remedy */}
              {insight.careRoutine.remedy && (
                <>
                  <View style={styles.routineItem}>
                    <View style={[styles.routineIconBox, { backgroundColor: '#FF980018' }]}>
                      <Icon name="hand-heart-outline" size={22} color="#FF9800" />
                    </View>
                    <View style={styles.routineContent}>
                      <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                        Remedy
                      </Text>
                      <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.onSurfaceVariant, marginTop: 2, lineHeight: 20 }}
                      >
                        {insight.careRoutine.remedy}
                      </Text>
                    </View>
                  </View>
                  <Divider style={styles.routineDivider} />
                </>
              )}

              {/* Activity */}
              <View style={styles.routineItem}>
                <View style={[styles.routineIconBox, { backgroundColor: '#2196F318' }]}>
                  <Icon name="run" size={22} color="#2196F3" />
                </View>
                <View style={styles.routineContent}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                    Activity
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant, marginTop: 2, lineHeight: 20 }}
                  >
                    {insight.careRoutine.activity}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* ─── Hygiene Routine ──────────────────────────────────── */}
        {insight.hygiene && (
          <>
            <Pressable
              onPress={() => toggleSection('hygiene')}
              style={[
                styles.collapsibleButton,
                {
                  borderColor: '#009688',
                  backgroundColor: expandedSections.hygiene ? '#00968812' : 'transparent',
                },
              ]}
            >
              <View style={[styles.sectionIconCircle, { backgroundColor: '#00968818' }]}>
                <Icon name="shield-check-outline" size={20} color="#009688" />
              </View>
              <Text
                variant="titleSmall"
                style={{ color: theme.colors.onSurface, fontWeight: '700', flex: 1, marginLeft: 10 }}
              >
                Hygiene Routine
              </Text>
              <Icon
                name={expandedSections.hygiene ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
            </Pressable>
            {expandedSections.hygiene && (
              <Card style={[styles.expandedCard, { backgroundColor: theme.colors.surface }]}>
                <Card.Content style={styles.expandedCardInner}>
                  <View style={styles.routineItem}>
                    <View style={[styles.routineIconBox, { backgroundColor: '#00968818' }]}>
                      <Icon name="hand-wash-outline" size={22} color="#009688" />
                    </View>
                    <View style={styles.routineContent}>
                      <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                        Hygiene Tips
                      </Text>
                      <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.onSurfaceVariant, marginTop: 2, lineHeight: 20 }}
                      >
                        {insight.hygiene}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            )}
          </>
        )}
      </View>

      {/* ─── Daily Checklist ───────────────────────────────────── */}
      {insight.checklist && insight.checklist.length > 0 && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardInner}>
            <View style={styles.cardHeader}>
              <View style={[styles.sectionIconCircle, { backgroundColor: `${theme.colors.primary}18` }]}>
                <Icon name="checkbox-marked-outline" size={20} color={theme.colors.primary} />
              </View>
              <Text
                variant="titleSmall"
                style={{ color: theme.colors.onSurface, fontWeight: '700', marginLeft: 10 }}
              >
                Daily Checklist
              </Text>
              <View style={{ flex: 1 }} />
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {Object.values(checked).filter(Boolean).length}/{insight.checklist.length}
              </Text>
            </View>

            {insight.checklist.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.checklistItem,
                  {
                    backgroundColor: checked[index]
                      ? `${theme.colors.primary}0A`
                      : 'transparent',
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => toggleCheck(index)}
              >
                <Checkbox
                  status={checked[index] ? 'checked' : 'unchecked'}
                  onPress={() => toggleCheck(index)}
                  color={theme.colors.primary}
                  uncheckedColor={theme.colors.onSurfaceVariant}
                />
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.checklistText,
                    {
                      color: checked[index]
                        ? theme.colors.onSurfaceVariant
                        : theme.colors.onSurface,
                      textDecorationLine: checked[index] ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* ─── AI Disclaimer ─────────────────────────────────────── */}
      <View style={styles.disclaimerRow}>
        <Icon name="creation" size={14} color={theme.colors.onSurfaceVariant} />
        <Text
          variant="labelSmall"
          style={{ color: theme.colors.onSurfaceVariant, marginLeft: 6, flex: 1, lineHeight: 16 }}
        >
          AI-generated insight — not personalised medical advice. Consult a doctor before taking any medication.
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    gap: 16,
  },

  // Section title
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 0,
  },

  // Phase banner
  phaseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  phaseIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  probabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  probabilityText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // Summary
  summaryText: {
    lineHeight: 24,
    fontWeight: '400',
  },

  // Cards (used for every section)
  card: {
    borderRadius: 16,
    elevation: 0,
  },
  cardInner: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  // Small round icon backgrounds
  sectionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Action row (fertility status, milestone)
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // Symptom Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    borderRadius: 24,
  },
  chipText: {
    fontSize: 13,
  },

  // Care Routine items
  routineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 14,
  },
  routineIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineContent: {
    flex: 1,
  },
  routineDivider: {
    marginLeft: 58, // align with text, past icon
    opacity: 0.3,
  },

  // Collapsible sections
  collapsibleGroup: {
    gap: 10,
  },
  collapsibleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 4,
  },
  expandedCard: {
    borderRadius: 14,
    elevation: 0,
    marginTop: -4,
  },
  expandedCardInner: {
    padding: 16,
  },

  // Checklist
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingRight: 12,
    marginTop: 4,
  },
  checklistText: {
    flex: 1,
    lineHeight: 20,
  },

  // Disclaimer
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
    paddingTop: 4,
    opacity: 0.7,
  },
});
