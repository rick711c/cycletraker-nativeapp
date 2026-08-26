# Onboarding

## Purpose

First-run setup wizard that collects the user's last period date, average cycle length, average period length, and tracking goal. These values seed the settings that drive all cycle calculations, predictions, and insight content.

## Entry Points

- `app/onboarding.tsx` — 5-step wizard (welcome → lastPeriod → cycleLength → periodLength → goal)

Guard: `app/_layout.tsx` checks `selectIsOnboarded`. If false, redirects to `/onboarding`.

## User Flow

```
Privacy consent accepted → onboarding screen
Step 1: Welcome → Get Started
Step 2: Select last period start date (calendar picker, max today)
Step 3: Set average cycle length (21–40, default 28)
Step 4: Set average period length (2–10, default 5)
Step 5: Select goal (track | conceive | pregnancy)
→ handleComplete()
→ dispatch(updateSettingsRequest(data)) → settingsSagas → DB
→ dispatch(setOnboarded(true)) → persisted via redux-persist
→ router.replace("/(tabs)")
```

## Data Model

Local state (`OnboardingData`):
- lastPeriodDate: string (default: 14 days ago)
- averageCycleLength: number (default: 28)
- averagePeriodLength: number (default: 5)
- goal: "track" | "conceive" | "pregnancy"

On completion, this is dispatched as `updateSettingsRequest(data)` which merges into `UserSettings`.

## Business Rules

- Last period date cannot be in the future (calendar maxDate = today)
- Cycle length constrained: 21–40 days
- Period length constrained: 2–10 days
- Default last period date is 14 days before today
- Onboarding state (`isOnboarded`) is persisted via redux-persist localStorage; survives app restart
- Completing onboarding immediately navigates to tabs

## State

- `isOnboarded: boolean` in cycleSlice (persisted via redux-persist whitelist)
- `settings: UserSettings` updated via `updateSettingsRequest` action

## Important Files

```
app/onboarding.tsx           → Onboarding wizard UI
app/_layout.tsx              → Onboarding guard (selectIsOnboarded)
src/store/cycleSlice.ts      → setOnboarded action, isOnboarded state
src/store/sagas/settingsSagas.ts → Persists settings to DB
```

## Dependencies

```
Onboarding → Settings (writes initial UserSettings)
Onboarding → All features (provides seed data for calculations)
```

## Change Impact

If adding onboarding steps:
```
Check: app/onboarding.tsx (steps array, Step type, step rendering)
Check: OnboardingData interface (local to onboarding.tsx)
Check: UserSettings type if new fields needed
Check: settingsApi.ts if new DB columns needed
Check: database.ts for schema migrations
```

If changing default values:
```
Check: app/onboarding.tsx (OnboardingData defaults)
Check: src/store/cycleSlice.ts (defaultSettings)
Check: src/db/settingsApi.ts (DEFAULT_SETTINGS)
```
