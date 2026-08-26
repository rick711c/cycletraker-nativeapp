# Settings

## Purpose

User preference management: dark mode, notification toggle, biometric app lock, cycle parameter display, data export (placeholder), data clearing, and privacy policy link. Settings changes are optimistically applied to Redux state and then persisted to SQLite via saga.

## Entry Points

- `app/(tabs)/settings.tsx` — Settings screen

## User Flow

### Toggle Setting (dark mode, notifications, app lock)
```
Toggle switch → dispatch(updateSettingsRequest({ key: newValue }))
→ Extra reducer: immediate optimistic merge into state.settings (no UI flicker)
→ settingsSagas.ts handleUpdateSettings()
→ upsertSettings(partial) → settingsApi.ts → DB (read-merge-write)
→ Redux: updateSettings(mergedSettings)
→ If notificationsEnabled changed: rescheduleNotifications()
```

### App Lock Toggle
```
Toggle ON: biometric verification required first (LocalAuthentication.authenticateAsync)
  → Success: dispatch updateSettingsRequest
  → Failure: snackbar error, no state change
Toggle OFF: direct dispatch, no verification
```

### Clear All Data
```
Alert confirmation → clearAllData() → DB (DELETE FROM all tables)
→ localStorage.clear()
→ cancelAllNotifications()
→ dispatch(setOnboarded(false))
→ router.replace("/privacy-consent") (full reset to first-run)
```

## Data Model

### UserSettings (`src/types/cycle.ts`)
- averageCycleLength: number — Display only (set in onboarding)
- averagePeriodLength: number — Display only (set in onboarding)
- lastPeriodDate: string — Not shown in settings
- goal: "track" | "conceive" | "pregnancy" — Display only
- notificationsEnabled: boolean — Toggle
- appLockEnabled: boolean — Toggle (requires biometric hardware)
- darkModeEnabled: boolean — Toggle

## State

Slice: `src/store/cycleSlice.ts` → `settings: UserSettings`

Action: `updateSettingsRequest` (saga-watched, also has extraReducer for optimistic update)

Selector: `selectSettings`

## Business Rules

- App lock requires biometric hardware AND enrollment. If unavailable, toggle is disabled.
- App lock toggle ON requires successful biometric verification before enabling.
- Clearing data is irreversible — confirmation dialog with destructive action.
- Clear data resets to privacy consent screen (complete app reset).
- Export Data is a placeholder ("Coming soon!" snackbar).

## Persistence

```
settingsSagas.ts → settingsApi.ts → database.ts
```

Table: `settings` (single row, id=1)
- `average_cycle_length` INTEGER DEFAULT 28
- `average_period_length` INTEGER DEFAULT 5
- `last_period_date` TEXT DEFAULT date('now')
- `goal` TEXT DEFAULT 'track'
- `notifications_enabled` INTEGER DEFAULT 1
- `app_lock_enabled` INTEGER DEFAULT 0
- `dark_mode_enabled` INTEGER DEFAULT 0

`upsertSettings()` does read-merge-write: reads current row, merges partial, writes full row.

## Important Files

```
app/(tabs)/settings.tsx            → Settings UI
src/store/cycleSlice.ts            → updateSettingsRequest, optimistic reducer
src/store/sagas/settingsSagas.ts   → Settings persistence saga
src/db/settingsApi.ts              → Settings CRUD (read-merge-write pattern)
src/db/database.ts                 → Schema + clearAllData()
```

## Consumers

```
settings.darkModeEnabled    → app/_layout.tsx (theme selection)
settings.notificationsEnabled → cycleSagas.ts rescheduleNotifications()
settings.appLockEnabled     → app/_layout.tsx (biometric lock gate)
settings.averageCycleLength → selectCycleStats (calculations)
settings.averagePeriodLength → selectCycleStats (calculations)
settings.lastPeriodDate     → selectCycleStats (all calculations)
settings.goal               → index.tsx, calendar.tsx (appMode for insights)
```

## Dependencies

```
Settings
  → Notifications (rescheduleNotifications on notificationsEnabled change)
  → Cycle Tracking (averageCycleLength, averagePeriodLength, lastPeriodDate)
  → Theme (darkModeEnabled)
  → App Lock (appLockEnabled)
  ← Onboarding (initial settings values)
```

## Change Impact

If adding a new setting:
```
Check: src/types/cycle.ts (UserSettings interface)
Check: src/store/cycleSlice.ts (defaultSettings)
Check: src/db/settingsApi.ts (DEFAULT_SETTINGS, rowToSettings mapping, upsertSettings SQL)
Check: src/db/database.ts (CREATE TABLE or ALTER TABLE migration)
Check: app/(tabs)/settings.tsx (UI rendering)
```

If changing settings persistence:
```
Check: settingsApi.ts (read-merge-write pattern)
Check: settingsSagas.ts (handleUpdateSettings)
Check: cycleSlice.ts extraReducers (optimistic update)
```
