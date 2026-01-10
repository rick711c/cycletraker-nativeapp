import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDays, differenceInDays, format, parseISO } from 'date-fns';
import { UserSettings, CycleData, DayLog, CycleStats, CyclePhase } from '../types/cycle';

interface CycleStore {
  isOnboarded: boolean;
  settings: UserSettings;
  cycles: CycleData[];
  dayLogs: DayLog[];
  setOnboarded: (value: boolean) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addDayLog: (log: DayLog) => void;
  updateDayLog: (date: string, updates: Partial<DayLog>) => void;
  startPeriod: (date?: string) => void;
  endPeriod: (date?: string) => void;
  getDayLog: (date: string) => DayLog | undefined;
  getCycleStats: () => CycleStats;
  getPhaseForDate: (date: string) => CyclePhase;
}

const defaultSettings: UserSettings = {
  averageCycleLength: 28,
  averagePeriodLength: 5,
  lastPeriodDate: format(new Date(), 'yyyy-MM-dd'),
  goal: 'track',
  notificationsEnabled: true,
};

export const useCycleStore = create<CycleStore>()(
  persist(
    (set, get) => ({
      isOnboarded: false,
      settings: defaultSettings,
      cycles: [],
      dayLogs: [],

      setOnboarded: value => set({ isOnboarded: value }),

      updateSettings: newSettings =>
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        })),

      addDayLog: log =>
        set(state => ({
          dayLogs: [...state.dayLogs.filter(l => l.date !== log.date), log],
        })),

      updateDayLog: (date, updates) =>
        set(state => ({
          dayLogs: state.dayLogs.map(log =>
            log.date === date ? { ...log, ...updates } : log,
          ),
        })),

      startPeriod: date => {
        const periodDate = date || format(new Date(), 'yyyy-MM-dd');
        set(state => {
          const existingLog = state.dayLogs.find(l => l.date === periodDate);
          const newLog: DayLog = existingLog
            ? { ...existingLog, isPeriod: true, flowIntensity: 'medium' }
            : {
                date: periodDate,
                isPeriod: true,
                flowIntensity: 'medium',
                moods: [],
                symptoms: [],
              };

          return {
            dayLogs: [
              ...state.dayLogs.filter(l => l.date !== periodDate),
              newLog,
            ],
            cycles: [...state.cycles, { startDate: periodDate }],
            settings: { ...state.settings, lastPeriodDate: periodDate },
          };
        });
      },

      endPeriod: date => {
        const endDate = date || format(new Date(), 'yyyy-MM-dd');
        set(state => {
          const currentCycle = state.cycles[state.cycles.length - 1];
          if (currentCycle && !currentCycle.endDate) {
            const length =
              differenceInDays(
                parseISO(endDate),
                parseISO(currentCycle.startDate),
              ) + 1;
            return {
              cycles: [
                ...state.cycles.slice(0, -1),
                { ...currentCycle, endDate, length },
              ],
            };
          }
          return state;
        });
      },

      getDayLog: date => get().dayLogs.find(l => l.date === date),

      getPhaseForDate: dateStr => {
        const { settings } = get();
        // Handle case where settings or lastPeriodDate might be missing initially
        if (!settings?.lastPeriodDate) return 'follicular';

        const lastPeriod = parseISO(settings.lastPeriodDate);
        const date = parseISO(dateStr);
        const dayInCycle =
          differenceInDays(date, lastPeriod) % settings.averageCycleLength;
        const adjustedDay =
          dayInCycle < 0
            ? dayInCycle + settings.averageCycleLength
            : dayInCycle;

        if (adjustedDay < settings.averagePeriodLength) return 'menstruation';
        if (adjustedDay < 13) return 'follicular';
        if (adjustedDay < 17) return 'ovulation';
        return 'luteal';
      },

      getCycleStats: () => {
        const { settings, cycles } = get();
        // Guard against missing settings
        if (!settings) {
          return {
            averageCycleLength: 28,
            averagePeriodLength: 5,
            nextPeriodDate: format(new Date(), 'yyyy-MM-dd'),
            ovulationDate: format(new Date(), 'yyyy-MM-dd'),
            fertileWindowStart: format(new Date(), 'yyyy-MM-dd'),
            fertileWindowEnd: format(new Date(), 'yyyy-MM-dd'),
            currentPhase: 'follicular',
            dayInCycle: 1,
          };
        }

        const lastPeriodDate = parseISO(settings.lastPeriodDate);
        const today = new Date();
        const dayInCycle = differenceInDays(today, lastPeriodDate);
        const adjustedDay = dayInCycle >= 0 ? dayInCycle : 0;

        // Calculate averages from history or use defaults
        let avgCycleLength = settings.averageCycleLength;
        let avgPeriodLength = settings.averagePeriodLength;

        if (cycles.length >= 3) {
          const completedCycles = cycles.filter(c => c.length);
          if (completedCycles.length > 0) {
            avgPeriodLength = Math.round(
              completedCycles.reduce((sum, c) => sum + (c.length || 0), 0) /
                completedCycles.length,
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
    }),
    {
      name: 'flora-cycle-storage',
      // REQUIRED for React Native: Use AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
