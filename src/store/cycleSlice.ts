/**
 * cycleSlice — Redux state cache for cycle data.
 *
 * State here is a read-through cache of what is in SQLite.
 * Components NEVER write to SQLite directly — they dispatch
 * "request" actions which Redux Saga intercepts and handles.
 *
 * Action flow:
 *   dispatch(addDayLogRequest(log))
 *     → dayLogSaga calls dayLogsApi.upsertDayLog()
 *     → saga puts addDayLog(log) → reducer updates cache
 */

import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { addDays, differenceInDays, format, parseISO } from 'date-fns';
import {
  UserSettings,
  CycleData,
  DayLog,
  CycleStats,
  CyclePhase,
} from '../types/cycle';
import type { RootState } from './types';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface CycleState {
  isOnboarded: boolean;
  settings: UserSettings;
  cycles: CycleData[];
  dayLogs: DayLog[];
  loading: boolean;
  error: string | null;
}

const defaultSettings: UserSettings = {
  averageCycleLength: 28,
  averagePeriodLength: 5,
  lastPeriodDate: format(new Date(), 'yyyy-MM-dd'),
  goal: 'track',
  notificationsEnabled: true,
};

const initialState: CycleState = {
  isOnboarded: false,
  settings: defaultSettings,
  cycles: [],
  dayLogs: [],
  loading: false,
  error: null,
};

// ---------------------------------------------------------------------------
// Async "request" actions — watched by sagas (never handled by reducers)
// ---------------------------------------------------------------------------

/** Triggers saga to load all cycles + day logs from SQLite into the cache. */
export const fetchAllData = createAction('cycle/fetchAllData');

/** Triggers saga to upsert a day log in SQLite, then update the cache. */
export const addDayLogRequest = createAction<DayLog>('cycle/addDayLogRequest');

/** Triggers saga to insert a new cycle + upsert the period day log. */
export const startPeriodRequest = createAction<string | undefined>(
  'cycle/startPeriodRequest',
);

/** Triggers saga to close out the active cycle with an end date. */
export const endPeriodRequest = createAction<string | undefined>(
  'cycle/endPeriodRequest',
);

/** Triggers saga to change the period start date from the calendar. */
export const changePeriodDateRequest = createAction<{
  startDate: string;
  endDate: string;
}>('cycle/changePeriodDateRequest');

/** Triggers saga to upsert settings in SQLite, then update the cache. */
export const updateSettingsRequest = createAction<Partial<UserSettings>>(
  'cycle/updateSettingsRequest',
);

// ---------------------------------------------------------------------------
// Slice — reducers only process successful/local state changes
// ---------------------------------------------------------------------------

const cycleSlice = createSlice({
  name: 'cycle',
  initialState,
  reducers: {
    // ── Sync (UI state only) ──────────────────────────────────────────────

    setOnboarded(state, action: PayloadAction<boolean>) {
      state.isOnboarded = action.payload;
    },

    // ── Loading / error ───────────────────────────────────────────────────

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },

    // ── Cache setters — called by sagas after successful DB writes ────────

    /** Bulk-replace the cycles cache (used by fetchAllData success). */
    setCycles(state, action: PayloadAction<CycleData[]>) {
      state.cycles = action.payload;
    },

    /** Bulk-replace the day logs cache (used by fetchAllData success). */
    setDayLogs(state, action: PayloadAction<DayLog[]>) {
      state.dayLogs = action.payload;
    },

    /** Upsert a single day log into the cache atomically. */
    addDayLog(state, action: PayloadAction<DayLog>) {
      const log = action.payload;
      const idx = state.dayLogs.findIndex(l => l.date === log.date);
      if (idx >= 0) {
        state.dayLogs[idx] = log;
      } else {
        state.dayLogs.push(log);
      }
    },

    /** Append a new cycle to the cache. */
    addCycle(state, action: PayloadAction<CycleData>) {
      const existing = state.cycles.findIndex(
        c => c.startDate === action.payload.startDate,
      );
      if (existing < 0) state.cycles.push(action.payload);
    },

    /** Update the last cycle in the cache with end date + length. */
    updateLastCycle(
      state,
      action: PayloadAction<{
        startDate: string;
        endDate: string;
        length: number;
      }>,
    ) {
      const idx = state.cycles.findIndex(
        c => c.startDate === action.payload.startDate,
      );
      if (idx >= 0) {
        state.cycles[idx] = {
          ...state.cycles[idx],
          endDate: action.payload.endDate,
          length: action.payload.length,
        };
      }
    },

    /** Update settings cache (after SQLite write). */
    updateSettings(state, action: PayloadAction<UserSettings>) {
      state.settings = action.payload;
    },
  },
});

export const {
  setOnboarded,
  setLoading,
  setError,
  setCycles,
  setDayLogs,
  addDayLog,
  addCycle,
  updateLastCycle,
  updateSettings,
} = cycleSlice.actions;

export default cycleSlice.reducer;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export const selectIsOnboarded = (state: RootState) => state.cycle.isOnboarded;
export const selectSettings = (state: RootState) => state.cycle.settings;
export const selectCycles = (state: RootState) => state.cycle.cycles;
export const selectDayLogs = (state: RootState) => state.cycle.dayLogs;
export const selectLoading = (state: RootState) => state.cycle.loading;
export const selectError = (state: RootState) => state.cycle.error;

export const selectDayLog =
  (date: string) =>
  (state: RootState): DayLog | undefined =>
    state.cycle.dayLogs.find(l => l.date === date);

/** Pure helper: determine which cycle phase a date falls in. */
export function getPhaseForDate(
  settings: UserSettings,
  dateStr: string,
): CyclePhase {
  if (!settings?.lastPeriodDate) return 'follicular';
  const lastPeriod = parseISO(settings.lastPeriodDate);
  const date = parseISO(dateStr);
  const dayInCycle =
    differenceInDays(date, lastPeriod) % settings.averageCycleLength;
  const adjusted =
    dayInCycle < 0 ? dayInCycle + settings.averageCycleLength : dayInCycle;

  if (adjusted < settings.averagePeriodLength) return 'menstruation';
  if (adjusted < 13) return 'follicular';
  if (adjusted < 17) return 'ovulation';
  return 'luteal';
}

/** Derived selector: computes full cycle stats from the Redux cache. */
/** Derived selector: computes full cycle stats from the Redux cache. (Memoized) */
export const selectCycleStats = createSelector(
  [selectSettings, selectCycles],
  (settings, cycles): CycleStats => {
    // If settings somehow don't exist, return a safe default
    if (!settings) {
      const now = format(new Date(), 'yyyy-MM-dd');
      return {
        averageCycleLength: 28,
        averagePeriodLength: 5,
        nextPeriodDate: now,
        ovulationDate: now,
        fertileWindowStart: now,
        fertileWindowEnd: now,
        currentPhase: 'follicular',
        dayInCycle: 1,
      };
    }

    const lastPeriodDate = parseISO(settings.lastPeriodDate);
    const today = new Date();
    const dayInCycle = differenceInDays(today, lastPeriodDate);
    const adjustedDay = dayInCycle >= 0 ? dayInCycle : 0;

    let avgCycleLength = settings.averageCycleLength;
    let avgPeriodLength = settings.averagePeriodLength;

    if (cycles.length >= 3) {
      const completed = cycles.filter(c => c.length);
      if (completed.length > 0) {
        avgPeriodLength = Math.round(
          completed.reduce((sum, c) => sum + (c.length || 0), 0) /
            completed.length,
        );
      }
    }

    const nextPeriodDate = addDays(lastPeriodDate, avgCycleLength);
    const ovulationDay = avgCycleLength - 14;
    const ovulationDate = addDays(lastPeriodDate, ovulationDay);
    const fertileWindowStart = addDays(ovulationDate, -5);
    const fertileWindowEnd = addDays(ovulationDate, 1);

    let currentPhase: CyclePhase;
    if (adjustedDay < avgPeriodLength) currentPhase = 'menstruation';
    else if (adjustedDay < ovulationDay - 1) currentPhase = 'follicular';
    else if (adjustedDay < ovulationDay + 3) currentPhase = 'ovulation';
    else currentPhase = 'luteal';

    return {
      averageCycleLength: avgCycleLength,
      averagePeriodLength: avgPeriodLength,
      nextPeriodDate: format(nextPeriodDate, 'yyyy-MM-dd'),
      ovulationDate: format(ovulationDate, 'yyyy-MM-dd'),
      fertileWindowStart: format(fertileWindowStart, 'yyyy-MM-dd'),
      fertileWindowEnd: format(fertileWindowEnd, 'yyyy-MM-dd'),
      currentPhase,
      dayInCycle: adjustedDay + 1,
    };
  },
);
