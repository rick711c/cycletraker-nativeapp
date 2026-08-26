# Cycle Tracking

## Purpose

Core feature of Flora. Records period start/end dates, calculates cycle phase (menstruation, follicular, ovulation, luteal), and predicts next period, ovulation, and fertile window dates. Serves as the data foundation for Calendar, Insights, and Notifications.

## Entry Points

Primary:
- `app/(tabs)/index.tsx` — Dashboard with cycle ring, quick actions, daily insight
- `app/(tabs)/calendar.tsx` — Calendar view with phase coloring, period editing, day insights

Secondary:
- `app/(tabs)/insights/cycle-history.tsx` — Historical cycle list

## User Flow

### Start Period
```
Dashboard → QuickActions "Log Period Start" → Confirm dialog → Motivation modal
→ dispatch(startPeriodRequest())
→ cycleSagas.ts handleStartPeriod()
→ insertCycle(date) → cyclesApi.ts → DB
→ upsertDayLog(periodLog) → dayLogsApi.ts → DB
→ upsertSettings({ lastPeriodDate }) → settingsApi.ts → DB
→ Redux: addCycle, addDayLog, updateSettings
→ rescheduleNotifications()
```

### End Period
```
Dashboard → QuickActions "Tap to End" → Confirm dialog
→ dispatch(endPeriodRequest())
→ cycleSagas.ts handleEndPeriod()
→ updateCycle(startDate, endDate, length) → cyclesApi.ts → DB
→ Redux: updateLastCycle
→ rescheduleNotifications()
```

### Change Period (Calendar Edit)
```
Calendar → Pencil icon → Select start day → Select/adjust end day → Save
→ dispatch(changePeriodDateRequest({ startDate, endDate }))
→ cycleSagas.ts handleChangePeriodDate()
→ insertCycle → updateCycle → upsertDayLog for each day in range → DB
→ upsertSettings({ lastPeriodDate: startDate })
→ Redux: addCycle, addDayLog (for each day), updateSettings
→ rescheduleNotifications()
```

## Data Model

### CycleData (`src/types/cycle.ts`)
- `startDate: string` — Period start date (YYYY-MM-DD). Persisted. Primary key in DB.
- `endDate?: string` — Period end date. Persisted. Null while period is active.
- `length?: number` — Period duration in days. Persisted. Derived: `differenceInDays(endDate, startDate) + 1`.

### CycleStats (derived selector, NOT persisted)
- `averageCycleLength` — From settings or computed from ≥3 completed cycles
- `averagePeriodLength` — From settings or computed from completed cycles
- `nextPeriodDate` — Calculated
- `ovulationDate` — Calculated
- `fertileWindowStart` — Calculated
- `fertileWindowEnd` — Calculated
- `currentPhase` — Calculated
- `dayInCycle` — Calculated

### UserSettings (relevant fields)
- `averageCycleLength: number` — Default 28. Persisted.
- `averagePeriodLength: number` — Default 5. Persisted.
- `lastPeriodDate: string` — Most recent period start. Persisted. Updated on every period start/change.

## State

Slice: `src/store/cycleSlice.ts`

State fields:
- `cycles: CycleData[]`
- `settings: UserSettings`
- `loading: boolean`
- `error: string | null`

Saga-watched actions:
- `fetchAllData` — Load all from DB on bootstrap
- `startPeriodRequest` — Start new period
- `endPeriodRequest` — End current period
- `changePeriodDateRequest` — Edit period dates from calendar

Reducer actions:
- `setCycles`, `addCycle`, `updateLastCycle`
- `updateSettings`
- `setLoading`, `setError`

Selectors:
- `selectCycles` — Raw cycles array
- `selectSettings` — User settings
- `selectCycleStats` — Memoized computed stats (createSelector)

## Calculations

### Next Period Date
```
Source: src/store/cycleSlice.ts → selectCycleStats
Inputs: lastPeriodDate, avgCycleLength
Algorithm: addDays(parseISO(lastPeriodDate), avgCycleLength)
Output: nextPeriodDate (YYYY-MM-DD)
Consumers: Dashboard, Calendar, Notifications
```

### Ovulation Date
```
Source: src/store/cycleSlice.ts → selectCycleStats
Inputs: lastPeriodDate, avgCycleLength
Algorithm: ovulationDay = avgCycleLength - 14; addDays(lastPeriodDate, ovulationDay)
Output: ovulationDate (YYYY-MM-DD)
Consumers: Calendar, Notifications
```

### Fertile Window
```
Source: src/store/cycleSlice.ts → selectCycleStats
Inputs: ovulationDate
Algorithm: start = addDays(ovulationDate, -5); end = addDays(ovulationDate, 1)
Output: fertileWindowStart, fertileWindowEnd (YYYY-MM-DD)
Consumers: Calendar, Notifications
```

### Current Phase
```
Source: src/store/cycleSlice.ts → selectCycleStats
Inputs: adjustedDay (dayInCycle), avgPeriodLength, ovulationDay
Algorithm:
  if adjustedDay < avgPeriodLength → "menstruation"
  if adjustedDay < ovulationDay - 1 → "follicular"
  if adjustedDay < ovulationDay + 3 → "ovulation"
  else → "luteal"
Output: CyclePhase enum
Consumers: Dashboard, Calendar, SmartDailyInsight
```

### Day In Cycle
```
Source: src/store/cycleSlice.ts → selectCycleStats
Inputs: today, lastPeriodDate
Algorithm: differenceInDays(today, lastPeriodDate); adjusted = max(0, diff); return adjusted + 1
Output: 1-based day number
Consumers: Dashboard, SmartDailyInsight, Insights
```

### Average Period Length (auto-update)
```
Source: src/store/cycleSlice.ts → selectCycleStats
Condition: cycles.length >= 3
Algorithm: avg of completed cycle lengths (cycles with .length defined)
Fallback: settings.averagePeriodLength
```

### Phase For Arbitrary Date (used by Calendar)
```
Source: src/store/cycleSlice.ts → getPhaseForDate()
Inputs: settings, dateStr
Algorithm: dayInCycle = differenceInDays(date, lastPeriod) % avgCycleLength; adjusted for negatives
  if adjusted < periodLength → "menstruation"
  if adjusted < 13 → "follicular"
  if adjusted < 17 → "ovulation"
  else → "luteal"
Note: Uses different phase boundaries than selectCycleStats (13/17 vs ovulationDay-1/ovulationDay+3)
```

## Data Classification

PERSISTED (SQLite):
- cycles (start_date, end_date, length)
- settings (averageCycleLength, averagePeriodLength, lastPeriodDate, goal)

PERSISTED (localStorage via redux-persist):
- isOnboarded
- settings (mirrored)

DERIVED (in-memory selector):
- nextPeriodDate
- ovulationDate
- fertileWindowStart/End
- currentPhase
- dayInCycle
- averageCycleLength (auto-calculated when ≥3 cycles)

## Persistence

```
cycleSagas.ts → cyclesApi.ts → database.ts
```

Table: `cycles`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `start_date` TEXT NOT NULL UNIQUE
- `end_date` TEXT
- `length` INTEGER

Operations:
- `getAllCycles()` — SELECT ordered by start_date ASC
- `insertCycle(startDate)` — INSERT OR IGNORE
- `updateCycle(startDate, endDate, length)` — UPDATE by start_date
- `deleteCycle(startDate)` — DELETE by start_date

## Important Components

### QuickActions (`src/components/cycle/QuickActions.tsx`)
- Start/end period toggle button
- Reads `selectCycles` to determine if period is active (any cycle with startDate but no endDate)
- Dispatches `startPeriodRequest()` / `endPeriodRequest()`
- Shows motivation modal on period start

### AnimeGrasslandCanvas (`src/components/cycle/AnimeGrasslandCanvas.tsx`)
- Dashboard hero visualization with animated cycle ring
- Receives props: dayInCycle, cycleLength, currentPhase, periodLength, nextPeriodDate
- Contains draggable animated puppy mascot
- Note: Next period date display is currently hardcoded ("30 July", "5 days left") — NOT using props

### CycleHistory (`src/components/cycle/CycleHistory.tsx`)
- Displays all cycles in reverse chronological order
- Shows active/completed badge, period duration, cycle length
- Reads `selectCycles`

## Important Files

```
src/types/cycle.ts           → CycleData, CycleStats, CyclePhase, UserSettings
src/store/cycleSlice.ts      → Redux state, actions, selectors, calculations
src/store/sagas/cycleSagas.ts → Start/end/change period workflows, notification rescheduling
src/db/cyclesApi.ts           → Cycles CRUD operations
src/db/database.ts            → SQLite schema, migrations
src/components/cycle/QuickActions.tsx  → Period start/end UI
src/components/cycle/AnimeGrasslandCanvas.tsx → Dashboard hero visualization
src/components/cycle/CycleHistory.tsx → Cycle history list
app/(tabs)/index.tsx          → Dashboard screen
app/(tabs)/calendar.tsx       → Calendar with phase coloring and period editing
```

## Consumers

```
nextPeriodDate     → Dashboard (AnimeGrasslandCanvas), Notifications
ovulationDate      → Notifications
fertileWindow      → Notifications
currentPhase       → Dashboard (AnimeGrasslandCanvas, SmartDailyInsight), Calendar
dayInCycle         → Dashboard (SmartDailyInsight), Insights
cycles array       → QuickActions (active period check), CycleHistory, Insights (avgCycleLength)
lastPeriodDate     → Calendar (getPhaseForDate), all calculations
```

## Dependencies

```
Cycle Tracking
  ← Settings (averageCycleLength, averagePeriodLength, lastPeriodDate)
  → Notifications (rescheduleNotifications on every period start/end/change)
  → Day Logging (upsertDayLog on period start/change)
  → Insights (CycleStats consumed)
```

## Change Impact

If changing cycle calculation logic:
```
Check: selectCycleStats in cycleSlice.ts
Check: getPhaseForDate in cycleSlice.ts
Check: AnimeGrasslandCanvas (receives calculated stats)
Check: SmartDailyInsight (uses dayInCycle)
Check: Calendar (uses getPhaseForDate for phase dots + colors)
Check: Insights index (uses selectCycleStats, selectCycles)
Check: CycleHistory (uses selectCycles)
Check: notificationScheduler.ts (uses CycleStats for scheduling)
```

If changing period start/end flow:
```
Check: cycleSagas.ts handleStartPeriod / handleEndPeriod / handleChangePeriodDate
Check: QuickActions (active period detection logic)
Check: cyclesApi.ts (DB operations)
Check: dayLogsApi.ts (period day logs created)
Check: settingsApi.ts (lastPeriodDate updated)
Check: rescheduleNotifications (called after every change)
```

If changing cycles DB schema:
```
Check: database.ts (CREATE TABLE, migrations)
Check: cyclesApi.ts (rowToCycle mapping, SQL queries)
Check: cycleSagas.ts (all handlers)
```
