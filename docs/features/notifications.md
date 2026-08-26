# Notifications

## Purpose

Schedules local push notifications for upcoming cycle events: period reminders (7d, 2d, 1d before), ovulation day, fertile window start, and luteal phase start. All notifications are local — no server involved. Notifications are rescheduled after every period start/end/change and when notification setting is toggled.

## Architecture

Provider pattern with pluggable backends:

```
notificationService.ts (facade)
  → localNotificationProvider.ts (expo-notifications implementation)
  → notificationTypes.ts (interfaces)

notificationScheduler.ts (business logic — builds notification list from CycleStats)

cycleSagas.ts → rescheduleNotifications() (orchestrator)
```

## Data Flow

```
Cycle change (start/end/change period) or settings change (notificationsEnabled)
→ cycleSagas.ts rescheduleNotifications()
→ Check settings.notificationsEnabled → if false, cancelAll() and return
→ cancelAllNotifications() (clear all existing)
→ selectCycleStats (get current predictions)
→ buildCycleNotifications(stats) → list of ScheduledNotification
→ For each: scheduleNotification(n) → localNotificationProvider → expo-notifications
```

## Business Rules

### Notification Events
```
PERIOD_REMINDER_7D  → 7 days before nextPeriodDate, at 9:00 AM
PERIOD_REMINDER_2D  → 2 days before nextPeriodDate, at 9:00 AM
PERIOD_REMINDER_1D  → 1 day before nextPeriodDate, at 9:00 AM
OVULATION_DAY       → On ovulationDate, at 9:00 AM
FERTILE_WINDOW_START → On fertileWindowStart, at 9:00 AM
LUTEAL_PHASE_START  → 3 days after ovulationDate, at 9:00 AM
```

### Scheduling Rules
- All notifications scheduled at 9:00 AM (`setHours(date, 9), setMinutes(0)`)
- Only future notifications are scheduled (past dates filtered out)
- All existing notifications are cancelled before rescheduling (full rebuild approach)
- Expo Go is detected; notifications are skipped in Expo Go environment
- Notification identifiers use the `NotificationEvent` enum values

### Reschedule Triggers
1. `handleStartPeriod` — after period start
2. `handleEndPeriod` — after period end
3. `handleChangePeriodDate` — after calendar period edit
4. `handleFetchAllData` — after bootstrap data load
5. `handleUpdateSettings` — when `notificationsEnabled` changes

## Calculations

### Notification Date Derivation
```
Source: src/notifications/notificationScheduler.ts → buildCycleNotifications()
Inputs: CycleStats (nextPeriodDate, ovulationDate, fertileWindowStart)
All dates parsed from CycleStats strings → date-fns addDays/parseISO → at9am()
```

## Data Classification

NOT PERSISTED — Notifications are OS-managed via expo-notifications. Rebuilt from CycleStats on every trigger.

DERIVED: All notification dates derived from CycleStats predictions.

## Important Files

```
src/notifications/notificationScheduler.ts  → buildCycleNotifications() — maps CycleStats to ScheduledNotification[]
src/notifications/notificationService.ts    → Facade: scheduleNotification, cancelAll, requestPermission
src/notifications/localNotificationProvider.ts → expo-notifications implementation
src/notifications/notificationTypes.ts      → NotificationEvent enum, ScheduledNotification, NotificationProvider interfaces
src/store/sagas/cycleSagas.ts              → rescheduleNotifications() orchestrator
```

## Dependencies

```
Notifications
  ← Cycle Tracking (CycleStats: nextPeriodDate, ovulationDate, fertileWindowStart)
  ← Settings (notificationsEnabled toggle)
```

## Change Impact

If adding a new notification event:
```
Check: src/notifications/notificationTypes.ts (NotificationEvent enum)
Check: src/notifications/notificationScheduler.ts (add pushIfFuture call in buildCycleNotifications)
Check: CycleStats may need new date fields if event is based on new data
```

If changing notification timing:
```
Check: src/notifications/notificationScheduler.ts (addDays offsets, at9am function)
```

If changing when notifications reschedule:
```
Check: src/store/sagas/cycleSagas.ts (rescheduleNotifications calls)
Check: src/store/sagas/settingsSagas.ts (notificationsEnabled check)
```

If changing notification provider:
```
Check: src/notifications/notificationService.ts (provider injection)
Check: src/notifications/notificationTypes.ts (NotificationProvider interface)
```
