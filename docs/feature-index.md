# Feature Index

## Cycle Tracking
Purpose: Period start/end recording, cycle phase detection, and next-period/ovulation/fertility predictions.
Entry: app/(tabs)/index.tsx, app/(tabs)/calendar.tsx
State: src/store/cycleSlice.ts
Saga: src/store/sagas/cycleSagas.ts
Persistence: src/db/cyclesApi.ts, src/db/database.ts
Domain: src/types/cycle.ts → CycleData, CycleStats, CyclePhase
Consumers: Dashboard, Calendar, Cycle History, Insights, Notifications

## Day Logging
Purpose: Daily mood, symptom, flow, and notes tracking.
Entry: app/(tabs)/log.tsx
State: src/store/cycleSlice.ts → dayLogs
Saga: src/store/sagas/dayLogSagas.ts
Persistence: src/db/dayLogsApi.ts
Domain: src/types/cycle.ts → DayLog, Mood, PhysicalSymptom, FlowIntensity
Consumers: Insights (pattern analysis), Calendar (period day markers)

## Insights
Purpose: Cycle analytics, pattern detection, and daily phase-aware health content.
Entry: app/(tabs)/insights/index.tsx, app/(tabs)/insights/cycle-history.tsx
Data: src/data/insightData.ts, src/lib/insightHelpers.ts
Domain: src/types/insight.ts → AppMode, DailyInsightData
Consumers: Dashboard (SmartDailyInsight), Calendar (day insight cards)

## Onboarding
Purpose: First-run setup wizard collecting cycle parameters and user goal.
Entry: app/onboarding.tsx
State: src/store/cycleSlice.ts → isOnboarded, settings
Guard: app/_layout.tsx → selectIsOnboarded check
Consumers: All features (provides initial settings)

## Settings
Purpose: User preferences — dark mode, notifications, app lock, cycle parameters, data management.
Entry: app/(tabs)/settings.tsx
State: src/store/cycleSlice.ts → settings
Saga: src/store/sagas/settingsSagas.ts
Persistence: src/db/settingsApi.ts
Consumers: All features (theme, notification toggle, cycle lengths)

## Notifications
Purpose: Scheduled local reminders for period, ovulation, fertile window, and luteal phase.
Entry: src/notifications/notificationScheduler.ts
Service: src/notifications/notificationService.ts, src/notifications/localNotificationProvider.ts
Types: src/notifications/notificationTypes.ts
Trigger: src/store/sagas/cycleSagas.ts → rescheduleNotifications()
Consumers: Triggered by cycle tracking and settings changes
