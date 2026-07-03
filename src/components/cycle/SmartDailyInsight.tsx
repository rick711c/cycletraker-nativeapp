import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import { Text, Checkbox, useTheme } from 'react-native-paper';
import { cyclePhaseColors } from '@/src/theme/muiTheme';
import Icon from '@/src/components/ui/Icon';
import Svg, { Path } from 'react-native-svg';
import { AppMode, DailyInsightData, TryToConceiveInsight, PregnancyInsight, TrackCycleInsight } from '@/src/types/insight';
import { getInsightForDay } from '@/src/lib/insightHelpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Design System Constants
// ---------------------------------------------------------------------------
const DESIGN_COLORS = {
  surfaceDark: '#0D0D11',
  surfaceCard: '#141419',
  borderGlass: 'rgba(255, 255, 255, 0.03)',
  textMuted: '#8E8E93',
};

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

interface SmartDailyInsightProps {
  dayInCycle: number;
  appMode: AppMode;
}

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
      {/* ─── Section Title & Header Row ─────────────────────────── */}
      <View style={styles.headerRow}>
        <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Daily Insight
        </Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: phaseColor }]}>History</Text>
          <Icon name="chevron-right" size={14} color={phaseColor} />
        </TouchableOpacity>
      </View>

      {/* ─── Premium Phase Banner Card ─────────────────────────── */}
      <View style={[styles.phaseBannerCard, { borderColor: DESIGN_COLORS.borderGlass }]}>
        <View style={styles.layoutFlexRow}>
          {/* Column 1: Custom Orb Graphic Node */}
          <View style={styles.orbGraphicBlock}>
            <View style={[styles.orbRing, { backgroundColor: `${phaseColor}10`, borderColor: `${phaseColor}25` }]}>
              <Icon
                name={phaseIcons[insight.phase] ?? 'creation'}
                size={22}
                color={phaseColor}
              />
            </View>
            <Svg width={36} height={10} viewBox="0 0 40 12" style={styles.waveVector}>
              <Path d="M0,6 Q10,0 20,6 T40,6" stroke={`${phaseColor}60`} strokeWidth={1.5} fill="none" />
            </Svg>
          </View>

          {/* Column 2: Typography Logic Stack */}
          <View style={styles.typographyStack}>
            <Text variant="titleMedium" style={{ color: '#FFFFFF', fontWeight: '800', letterSpacing: -0.2 }}>
              {phaseLabels[insight.phase] ?? 'Phase'} Phase
            </Text>
            <Text variant="bodySmall" style={{ color: DESIGN_COLORS.textMuted, marginTop: 2, fontWeight: '500' }}>
              Cycle Day {dayInCycle}
            </Text>
          </View>

          {/* Column 3: Fixed Aspect Context Badge Node */}
          {!isPregnancy(insight) && (
            <View style={styles.actionZoneBox}>
              <View style={[styles.gradientStatusPill, { backgroundColor: `${phaseColor}18`, borderColor: `${phaseColor}35` }]}>
                <Text style={[styles.statusPillText, { color: phaseColor }]}>
                  {(insight as TrackCycleInsight | TryToConceiveInsight).pregnancyProbability}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* ─── Summary Paragraph Layer ───────────────────────────── */}
      {insight.summary ? (
        <Text variant="bodyMedium" style={styles.summaryText}>
          {insight.summary}
        </Text>
      ) : null}

      {/* ─── Fertility Status Container (TryToConceive Mode Only) ─── */}
      {isTryToConceive(insight) && (
        <View style={[styles.premiumDataBlock, { borderColor: `${theme.colors.primary}25` }]}>
          <View style={styles.cardHeader}>
            <Icon name="heart-pulse" size={20} color={theme.colors.primary} />
            <Text variant="titleSmall" style={[styles.dataBlockTitle, { color: theme.colors.onBackground }]}>
              Fertility Status
            </Text>
          </View>
          <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '900', marginTop: 6, letterSpacing: -0.5 }}>
            {insight.fertilityStatus}
          </Text>
          <View style={styles.innerHorizontalLine} />
          <View style={styles.actionRow}>
            <Icon name="alert-circle-outline" size={16} color={DESIGN_COLORS.textMuted} />
            <Text variant="bodyMedium" style={{ color: DESIGN_COLORS.textMuted, marginLeft: 8, flex: 1, fontWeight: '500', lineHeight: 18 }}>
              {insight.actionItem}
            </Text>
          </View>
        </View>
      )}

      {/* ─── Baby Development Container (Pregnancy Mode Only) ─────── */}
      {isPregnancy(insight) && (
        <View style={[styles.premiumDataBlock, { borderColor: `${theme.colors.primary}25` }]}>
          <View style={styles.cardHeader}>
            <Icon name="baby-face-outline" size={20} color={theme.colors.primary} />
            <Text variant="titleSmall" style={[styles.dataBlockTitle, { color: theme.colors.onBackground }]}>
              Baby Development
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: '#FFFFFF', marginTop: 8, lineHeight: 22, fontWeight: '500' }}>
            {insight.babyDevelopment}
          </Text>
          <View style={styles.innerHorizontalLine} />
          <View style={styles.actionRow}>
            <Icon name="star-outline" size={16} color={theme.colors.primary} />
            <Text variant="bodyMedium" style={{ color: theme.colors.primary, marginLeft: 8, flex: 1, fontWeight: '700' }}>
              {insight.milestone}
            </Text>
          </View>
        </View>
      )}

      {/* ─── Dynamic Collapsible Section Matrix ─────────────────── */}
      <View style={styles.collapsibleGroup}>
        
        {/* Module A: Biological State */}
        <Pressable
          onPress={() => toggleSection('body')}
          style={[
            styles.collapsibleButton,
            {
              borderColor: expandedSections.body ? phaseColor : DESIGN_COLORS.borderGlass,
              backgroundColor: expandedSections.body ? `${phaseColor}0A` : DESIGN_COLORS.surfaceCard,
            },
          ]}
        >
          <View style={[styles.sectionIconCircle, { backgroundColor: expandedSections.body ? `${phaseColor}20` : 'rgba(255,255,255,0.02)' }]}>
            <Icon name="human" size={18} color={expandedSections.body ? phaseColor : '#FFFFFF'} />
          </View>
          <Text variant="titleSmall" style={styles.collapsibleButtonText}>
            What's Happening In Your Body
          </Text>
          <Icon name={expandedSections.body ? 'chevron-up' : 'chevron-down'} size={18} color={DESIGN_COLORS.textMuted} />
        </Pressable>
        {expandedSections.body && (
          <View style={styles.expandedContentBox}>
            <Text variant="bodyMedium" style={styles.expandedContentText}>
              {insight.biologicalState}
            </Text>
          </View>
        )}

        {/* Module B: Symptoms Expected */}
        <Pressable
          onPress={() => toggleSection('symptoms')}
          style={[
            styles.collapsibleButton,
            {
              borderColor: expandedSections.symptoms ? phaseColor : DESIGN_COLORS.borderGlass,
              backgroundColor: expandedSections.symptoms ? `${phaseColor}0A` : DESIGN_COLORS.surfaceCard,
            },
          ]}
        >
          <View style={[styles.sectionIconCircle, { backgroundColor: expandedSections.symptoms ? `${phaseColor}20` : 'rgba(255,255,255,0.02)' }]}>
            <Icon name="clipboard-pulse-outline" size={18} color={expandedSections.symptoms ? phaseColor : '#FFFFFF'} />
          </View>
          <Text variant="titleSmall" style={styles.collapsibleButtonText}>
            What to Expect Today
          </Text>
          <Icon name={expandedSections.symptoms ? 'chevron-up' : 'chevron-down'} size={18} color={DESIGN_COLORS.textMuted} />
        </Pressable>
        {expandedSections.symptoms && (
          <View style={styles.expandedContentBox}>
            <View style={styles.chipRow}>
              {symptomEntries.map(([key, value]) => (
                <View key={key} style={[styles.customPill, { backgroundColor: `${phaseColor}12`, borderColor: `${phaseColor}25` }]}>
                  <Text style={[styles.customPillText, { color: '#FFFFFF' }]}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:{' '}
                    <Text style={{ color: phaseColor, fontWeight: '800' }}>{value}</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Module C: Care Routines */}
        <Pressable
          onPress={() => toggleSection('care')}
          style={[
            styles.collapsibleButton,
            {
              borderColor: expandedSections.care ? theme.colors.primary : DESIGN_COLORS.borderGlass,
              backgroundColor: expandedSections.care ? `${theme.colors.primary}0A` : DESIGN_COLORS.surfaceCard,
            },
          ]}
        >
          <View style={[styles.sectionIconCircle, { backgroundColor: expandedSections.care ? `${theme.colors.primary}20` : 'rgba(255,255,255,0.02)' }]}>
            <Icon name="lightbulb-on-outline" size={18} color={expandedSections.care ? theme.colors.primary : '#FFFFFF'} />
          </View>
          <Text variant="titleSmall" style={styles.collapsibleButtonText}>
            Care Routine
          </Text>
          <Icon name={expandedSections.care ? 'chevron-up' : 'chevron-down'} size={18} color={DESIGN_COLORS.textMuted} />
        </Pressable>
        {expandedSections.care && (
          <View style={styles.expandedContentBox}>
            {/* Diet item sub-node */}
            <View style={styles.routineItem}>
              <View style={[styles.routineIconBox, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Icon name="food-apple-outline" size={20} color="#4CAF50" />
              </View>
              <View style={styles.routineContent}>
                <Text style={styles.routineItemTitle}>Diet</Text>
                <Text style={styles.routineItemDescription}>{insight.careRoutine.diet}</Text>
              </View>
            </View>

            {insight.careRoutine.remedy && (
              <>
                <View style={styles.subDivider} />
                <View style={styles.routineItem}>
                  <View style={[styles.routineIconBox, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                    <Icon name="hand-heart-outline" size={20} color="#FF9800" />
                  </View>
                  <View style={styles.routineContent}>
                    <Text style={styles.routineItemTitle}>Remedy</Text>
                    <Text style={styles.routineItemDescription}>{insight.careRoutine.remedy}</Text>
                  </View>
                </View>
              </>
            )}

            <View style={styles.subDivider} />
            <View style={styles.routineItem}>
              <View style={[styles.routineIconBox, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
                <Icon name="run" size={20} color="#2196F3" />
              </View>
              <View style={styles.routineContent}>
                <Text style={styles.routineItemTitle}>Activity</Text>
                <Text style={styles.routineItemDescription}>{insight.careRoutine.activity}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Module D: Hygiene Routine */}
        {insight.hygiene && (
          <>
            <Pressable
              onPress={() => toggleSection('hygiene')}
              style={[
                styles.collapsibleButton,
                {
                  borderColor: expandedSections.hygiene ? '#009688' : DESIGN_COLORS.borderGlass,
                  backgroundColor: expandedSections.hygiene ? 'rgba(0, 150, 136, 0.05)' : DESIGN_COLORS.surfaceCard,
                },
              ]}
            >
              <View style={[styles.sectionIconCircle, { backgroundColor: expandedSections.hygiene ? 'rgba(0, 150, 136, 0.2)' : 'rgba(255,255,255,0.02)' }]}>
                <Icon name="shield-check-outline" size={18} color={expandedSections.hygiene ? '#009688' : '#FFFFFF'} />
              </View>
              <Text variant="titleSmall" style={styles.collapsibleButtonText}>
                Hygiene Routine
              </Text>
              <Icon name={expandedSections.hygiene ? 'chevron-up' : 'chevron-down'} size={18} color={DESIGN_COLORS.textMuted} />
            </Pressable>
            {expandedSections.hygiene && (
              <View style={styles.expandedContentBox}>
                <View style={styles.routineItem}>
                  <View style={[styles.routineIconBox, { backgroundColor: 'rgba(0, 150, 136, 0.1)' }]}>
                    <Icon name="hand-wash-outline" size={20} color="#009688" />
                  </View>
                  <View style={styles.routineContent}>
                    <Text style={styles.routineItemTitle}>Hygiene Tips</Text>
                    <Text style={styles.routineItemDescription}>{insight.hygiene}</Text>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {/* ─── Interactive Interactive Checklist Module ────────────── */}
      {insight.checklist && insight.checklist.length > 0 && (
        <View style={[styles.checklistCard, { borderColor: DESIGN_COLORS.borderGlass }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.sectionIconCircle, { backgroundColor: 'rgba(255,255,255,0.04)' }]}>
              <Icon name="checkbox-marked-outline" size={18} color={theme.colors.primary} />
            </View>
            <Text variant="titleSmall" style={[styles.dataBlockTitle, { color: '#FFFFFF' }]}>
              Daily Checklist
            </Text>
            <View style={{ flex: 1 }} />
            <Text variant="labelSmall" style={{ color: DESIGN_COLORS.textMuted, fontWeight: '700' }}>
              {Object.values(checked).filter(Boolean).length}/{insight.checklist.length}
            </Text>
          </View>

          <View style={{ marginTop: 8 }}>
            {insight.checklist.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.checklistItem,
                  { backgroundColor: checked[index] ? 'rgba(255,255,255,0.01)' : 'transparent' },
                ]}
                activeOpacity={0.7}
                onPress={() => toggleCheck(index)}
              >
                <Checkbox
                  status={checked[index] ? 'checked' : 'unchecked'}
                  onPress={() => toggleCheck(index)}
                  color={phaseColor}
                  uncheckedColor="rgba(255,255,255,0.2)"
                />
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.checklistText,
                    {
                      color: checked[index] ? DESIGN_COLORS.textMuted : '#FFFFFF',
                      textDecorationLine: checked[index] ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ─── Premium AI Disclaimer Legal Bar ───────────────────── */}
      <View style={styles.disclaimerRow}>
        <Icon name="creation" size={13} color={DESIGN_COLORS.textMuted} />
        <Text variant="labelSmall" style={styles.disclaimerText}>
          AI-generated insight — not personalized medical advice. Consult a doctor before making medical choices.
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Upgraded Production Glassmorphism Stylesheet
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: { paddingHorizontal: 20, gap: 14, backgroundColor: '#000000', paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 2 },
  sectionTitle: { fontWeight: '900', letterSpacing: -0.5 },
  viewAllButton: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllText: { fontSize: 13, fontWeight: '700' },
  
  // Refactored Phase Banner Structural Layout Layer
  phaseBannerCard: { backgroundColor: DESIGN_COLORS.surfaceCard, borderRadius: 24, padding: 16, borderWidth: 1 },
  layoutFlexRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  orbGraphicBlock: { width: 44, height: 44, position: 'relative', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  orbRing: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  waveVector: { position: 'absolute', bottom: -2, zIndex: 4 },
  typographyStack: { flex: 1, justifyContent: 'center' },
  actionZoneBox: { width: 105, alignItems: 'flex-end', justifyContent: 'center' },
  gradientStatusPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, borderWidth: 1 },
  statusPillText: { fontSize: 11, fontWeight: '800', letterSpacing: -0.2, textTransform: 'uppercase' },

  summaryText: { color: '#E5E5EA', lineHeight: 22, fontWeight: '400', paddingHorizontal: 4, marginTop: 2 },
  
  // Complex Data Blocks
  premiumDataBlock: { backgroundColor: DESIGN_COLORS.surfaceCard, borderRadius: 24, padding: 18, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dataBlockTitle: { fontWeight: '800', fontSize: 15, letterSpacing: -0.1 },
  innerHorizontalLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.04)', marginVertical: 14 },
  actionRow: { flexDirection: 'row', alignItems: 'flex-start' },

  // Collapsible Core
  collapsibleGroup: { gap: 8 },
  collapsibleButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 12, gap: 10 },
  collapsibleButtonText: { color: '#FFFFFF', fontWeight: '700', flex: 1, letterSpacing: -0.1 },
  sectionIconCircle: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  expandedContentBox: { backgroundColor: '#111115', borderRadius: 18, marginTop: -4, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.02)', gap: 12 },
  expandedContentText: { color: '#D1D1D6', lineHeight: 22 },

  // Symptoms Custom Architecture
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  customPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 0.5 },
  customPillText: { fontSize: 12, fontWeight: '500' },

  // Care Routine Structure
  routineItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  routineIconBox: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  routineContent: { flex: 1 },
  routineItemTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  routineItemDescription: { color: DESIGN_COLORS.textMuted, fontSize: 13, marginTop: 3, lineHeight: 18 },
  subDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.03)', marginLeft: 50 },

  // Checklist Core
  checklistCard: { backgroundColor: DESIGN_COLORS.surfaceCard, borderRadius: 24, padding: 16, borderWidth: 1 },
  checklistItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingRight: 12, marginTop: 6, height: 44 },
  checklistText: { flex: 1, fontWeight: '500' },

  // Legal Row
  disclaimerRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 6, marginTop: 4, opacity: 0.6 },
  disclaimerText: { color: DESIGN_COLORS.textMuted, marginLeft: 8, flex: 1, lineHeight: 15, fontWeight: '400' },
});