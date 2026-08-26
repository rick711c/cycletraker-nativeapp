# Insights

## Purpose

Provides cycle analytics and daily phase-aware health content based on user's cycle day and app mode. Content is static/pre-written. Supports three modes: Track Cycle, Try to Conceive, Track Pregnancy.

## Entry Points

- `app/(tabs)/insights/index.tsx` — Analytics dashboard
- `app/(tabs)/insights/cycle-history.tsx` — Cycle history list
- `app/(tabs)/index.tsx` → SmartDailyInsight component (dashboard)
- `app/(tabs)/calendar.tsx` — Day insight card on date selection

## Data Model

InsightBase (`src/types/insight.ts`): dayRange, phase, summary, biologicalState, symptoms, careRoutine, checklist, hygiene.

Mode extensions:
- TrackCycleInsight: + pregnancyProbability
- TryToConceiveInsight: + pregnancyProbability, fertilityStatus, actionItem
- PregnancyInsight: + babyDevelopment, milestone

AppMode derived from settings.goal: "track"→"trackCycle", "conceive"→"tryToConceive", "pregnancy"→"trackPregnancy"

## Calculations

### Insight Lookup
```
Source: src/lib/insightHelpers.ts → getInsightForDay()
Inputs: currentDay (1-based), mode (AppMode)
Algorithm: Select array by mode → clamp day (max 28 or 280) → find matching dayRange → fallback to last entry
```

### Analytics (insights/index.tsx useMemo)
- avgCycleLength: avg of completed cycles or settings default
- topMood/topSymptom: most frequent across all dayLogs
- nextPeriodIn: stats.averageCycleLength - stats.dayInCycle

## Data Classification

STATIC: src/data/insightData.ts (all insight text content)
DERIVED: analytics computed in-memory from cycles + dayLogs

## Important Components

- SmartDailyInsight: Phase banner, collapsible sections (body, symptoms, care, hygiene), interactive checklist (local state only)
- CycleHistory: Reverse-chronological cycle list with active/completed badges

## Important Files

```
src/types/insight.ts, src/data/insightData.ts, src/lib/insightHelpers.ts
src/components/cycle/SmartDailyInsight.tsx, src/components/cycle/CycleHistory.tsx
app/(tabs)/insights/index.tsx, app/(tabs)/insights/cycle-history.tsx, app/(tabs)/insights/_layout.tsx
```

## Dependencies

← Cycle Tracking (CycleStats), ← Day Logging (dayLogs for patterns), ← Settings (goal → appMode)

## Change Impact

If changing insight content: Check src/data/insightData.ts, src/types/insight.ts, SmartDailyInsight.tsx
If adding new app mode: Check insight.ts types, insightData.ts, insightHelpers.ts, index.tsx + calendar.tsx appMode derivation, SmartDailyInsight, UserSettings.goal type
