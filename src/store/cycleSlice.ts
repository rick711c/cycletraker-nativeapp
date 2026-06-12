import {
    createAction,
    createSelector,
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";
import { addDays, differenceInDays, format, parseISO } from "date-fns";
import {
    CycleData,
    CyclePhase,
    CycleStats,
    DayLog,
    UserSettings,
} from "../types/cycle";
import type { RootState } from "./types";

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
  lastPeriodDate: format(new Date(), "yyyy-MM-dd"),
  goal: "track",
  notificationsEnabled: true,
  appLockEnabled: false,
};

const initialState: CycleState = {
  isOnboarded: false,
  settings: defaultSettings,
  cycles: [],
  dayLogs: [],
  loading: false,
  error: null,
};

// Async "request" actions — watched by sagas
export const fetchAllData = createAction("cycle/fetchAllData");
export const addDayLogRequest = createAction<DayLog>("cycle/addDayLogRequest");
export const startPeriodRequest = createAction<string | undefined>(
  "cycle/startPeriodRequest",
);
export const endPeriodRequest = createAction<string | undefined>(
  "cycle/endPeriodRequest",
);
export const changePeriodDateRequest = createAction<{
  startDate: string;
  endDate: string;
}>("cycle/changePeriodDateRequest");
export const updateSettingsRequest = createAction<Partial<UserSettings>>(
  "cycle/updateSettingsRequest",
);

const cycleSlice = createSlice({
  name: "cycle",
  initialState,
  reducers: {
    setOnboarded(state, action: PayloadAction<boolean>) {
      state.isOnboarded = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setCycles(state, action: PayloadAction<CycleData[]>) {
      state.cycles = action.payload;
    },
    setDayLogs(state, action: PayloadAction<DayLog[]>) {
      state.dayLogs = action.payload;
    },
    addDayLog(state, action: PayloadAction<DayLog>) {
      const log = action.payload;
      const idx = state.dayLogs.findIndex((l) => l.date === log.date);
      if (idx >= 0) {
        state.dayLogs[idx] = log;
      } else {
        state.dayLogs.push(log);
      }
    },
    addCycle(state, action: PayloadAction<CycleData>) {
      const existing = state.cycles.findIndex(
        (c) => c.startDate === action.payload.startDate,
      );
      if (existing < 0) state.cycles.push(action.payload);
    },
    updateLastCycle(
      state,
      action: PayloadAction<{
        startDate: string;
        endDate: string;
        length: number;
      }>,
    ) {
      const idx = state.cycles.findIndex(
        (c) => c.startDate === action.payload.startDate,
      );
      if (idx >= 0) {
        state.cycles[idx] = {
          ...state.cycles[idx],
          endDate: action.payload.endDate,
          length: action.payload.length,
        };
      }
    },
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

// Selectors
export const selectIsOnboarded = (state: RootState) => state.cycle.isOnboarded;
export const selectSettings = (state: RootState) => state.cycle.settings;
export const selectCycles = (state: RootState) => state.cycle.cycles;
export const selectDayLogs = (state: RootState) => state.cycle.dayLogs;
export const selectLoading = (state: RootState) => state.cycle.loading;
export const selectError = (state: RootState) => state.cycle.error;

export const selectDayLog =
  (date: string) =>
  (state: RootState): DayLog | undefined =>
    state.cycle.dayLogs.find((l) => l.date === date);

export function getPhaseForDate(
  settings: UserSettings,
  dateStr: string,
): CyclePhase {
  if (!settings?.lastPeriodDate) return "follicular";
  const lastPeriod = parseISO(settings.lastPeriodDate);
  const date = parseISO(dateStr);
  const dayInCycle =
    differenceInDays(date, lastPeriod) % settings.averageCycleLength;
  const adjusted =
    dayInCycle < 0 ? dayInCycle + settings.averageCycleLength : dayInCycle;

  if (adjusted < settings.averagePeriodLength) return "menstruation";
  if (adjusted < 13) return "follicular";
  if (adjusted < 17) return "ovulation";
  return "luteal";
}

export const selectCycleStats = createSelector(
  [selectSettings, selectCycles],
  (settings, cycles): CycleStats => {
    if (!settings) {
      const now = format(new Date(), "yyyy-MM-dd");
      return {
        averageCycleLength: 28,
        averagePeriodLength: 5,
        nextPeriodDate: now,
        ovulationDate: now,
        fertileWindowStart: now,
        fertileWindowEnd: now,
        currentPhase: "follicular",
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
      const completed = cycles.filter((c) => c.length);
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
    if (adjustedDay < avgPeriodLength) currentPhase = "menstruation";
    else if (adjustedDay < ovulationDay - 1) currentPhase = "follicular";
    else if (adjustedDay < ovulationDay + 3) currentPhase = "ovulation";
    else currentPhase = "luteal";

    return {
      averageCycleLength: avgCycleLength,
      averagePeriodLength: avgPeriodLength,
      nextPeriodDate: format(nextPeriodDate, "yyyy-MM-dd"),
      ovulationDate: format(ovulationDate, "yyyy-MM-dd"),
      fertileWindowStart: format(fertileWindowStart, "yyyy-MM-dd"),
      fertileWindowEnd: format(fertileWindowEnd, "yyyy-MM-dd"),
      currentPhase,
      dayInCycle: adjustedDay + 1,
    };
  },
);
