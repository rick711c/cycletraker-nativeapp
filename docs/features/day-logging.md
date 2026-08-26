# Day Logging

## Purpose

Allows users to log daily health data: menstrual flow intensity, moods, physical symptoms, and free-text notes. Logs are persisted per-date and consumed by Insights for pattern analysis and by Calendar for period day markers.

## Entry Points

Primary:
- `app/(tabs)/log.tsx` — Day logging form (today only)

Secondary:
- Cycle Tracking saga also creates day logs when starting/changing periods

## User Flow

```
Log tab → Select flow/moods/symptoms/notes → "Save Log"
→ dispatch(addDayLogRequest(log))
→ dayLogSagas.ts handleAddDayLog()
→ upsertDayLog(log) → dayLogsApi.ts → DB (INSERT OR REPLACE)
→ Redux: addDayLog (upserts into dayLogs array by date)
```

## Data Model

### DayLog (`src/types/cycle.ts`)
- `date: string` — YYYY-MM-DD. Persisted. Unique key.
- `isPeriod: boolean` — Whether this is a period day. Persisted.
- `flowIntensity?: FlowIntensity` — "spotting" | "light" | "medium" | "heavy". Persisted.
- `moods: Mood[]` — Multi-select. Persisted as JSON string in DB.
- `symptoms: PhysicalSymptom[]` — Multi-select. Persisted as JSON string in DB.
- `notes?: string` — Free text. Persisted.
- `sleepHours?: number` — Persisted. Not exposed in current UI.
- `waterIntake?: number` — Persisted. Not exposed in current UI.

### Available Values
FlowIntensity: spotting, light, medium, heavy
Mood: happy, sensitive, sad, anxious, energetic, irritable
PhysicalSymptom: cramps, headache, bloating, breast_tenderness, acne, fatigue, backache, nausea

## State

Slice: `src/store/cycleSlice.ts`

State field: `dayLogs: DayLog[]`

Saga-watched action: `addDayLogRequest`

Reducer action: `addDayLog` — Upserts by date (replaces existing log for same date, appends if new)

Selectors:
- `selectDayLogs` — Full array
- `selectDayLog(date)` — Single log by date

## Data Flow

```
log.tsx → local state (useState<DayLog>)
→ handleSave → dispatch(addDayLogRequest(log))
→ dayLogSagas.ts → upsertDayLog (dayLogsApi.ts) → DB
→ addDayLog reducer → Redux state
```

## Business Rules

- Only today's date can be logged from the Log screen (date is hardcoded to `format(new Date(), "yyyy-MM-dd")`)
- Selecting a flow intensity automatically sets `isPeriod: true`
- Deselecting all flow sets `isPeriod: false` (toggling same flow clears it)
- Moods and symptoms are multi-select (toggle on/off)
- Existing log for today pre-populates the form
- Log is an upsert: saving overwrites any existing log for the same date

## Data Classification

PERSISTED (SQLite):
- date, isPeriod, flowIntensity, moods (JSON), symptoms (JSON), notes, sleepHours, waterIntake

UI STATE (local useState, not persisted separately):
- Form selections before save

## Persistence

```
dayLogSagas.ts → dayLogsApi.ts → database.ts
```

Table: `day_logs`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `date` TEXT NOT NULL UNIQUE
- `is_period` INTEGER NOT NULL DEFAULT 0
- `flow_intensity` TEXT
- `moods` TEXT NOT NULL DEFAULT '[]' (JSON array)
- `symptoms` TEXT NOT NULL DEFAULT '[]' (JSON array)
- `notes` TEXT
- `sleep_hours` REAL
- `water_intake` REAL

Operations:
- `getAllDayLogs()` — SELECT ordered by date ASC
- `getDayLog(date)` — SELECT by date
- `upsertDayLog(log)` — INSERT OR REPLACE
- `deleteDayLog(date)` — DELETE by date

## Important Files

```
app/(tabs)/log.tsx              → Log screen UI
src/store/sagas/dayLogSagas.ts  → Async save workflow
src/db/dayLogsApi.ts            → DB operations + row mapping
src/types/cycle.ts              → DayLog, Mood, PhysicalSymptom, FlowIntensity types
```

## Consumers

```
dayLogs array:
  → Insights index.tsx (mood/symptom frequency counts)
  → Calendar (log.isPeriod for period day markers)
  → Home (loaded on bootstrap via fetchAllData)

selectDayLog(date):
  → log.tsx (pre-populate existing log)
```

## Dependencies

```
Day Logging
  ← Cycle Tracking (also creates dayLogs for period days via cycleSagas)
  → Insights (pattern analysis reads dayLogs)
```

## Change Impact

If changing DayLog schema:
```
Check: src/types/cycle.ts (DayLog interface)
Check: src/db/dayLogsApi.ts (rowToDayLog mapping, upsertDayLog SQL)
Check: src/db/database.ts (CREATE TABLE day_logs, migrations)
Check: app/(tabs)/log.tsx (form fields)
Check: app/(tabs)/insights/index.tsx (mood/symptom counting)
Check: app/(tabs)/calendar.tsx (isPeriod check)
Check: src/store/sagas/cycleSagas.ts (creates DayLog on period start/change)
```

If adding new mood/symptom values:
```
Check: src/types/cycle.ts (Mood / PhysicalSymptom types)
Check: app/(tabs)/log.tsx (moodOptions / symptomOptions arrays)
Check: app/(tabs)/insights/index.tsx (pattern display may need label mapping)
```
