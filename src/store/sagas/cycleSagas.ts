/**
 * Cycle Sagas — handle fetchAllData, startPeriod, endPeriod
 *
 * After any data change that affects cycle dates, we reschedule
 * all notifications via the NotificationService.
 */

import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { format, differenceInDays, parseISO } from 'date-fns';

import { getAllCycles, insertCycle, updateCycle } from '../../db/cyclesApi';
import { getAllDayLogs, upsertDayLog } from '../../db/dayLogsApi';
import {
  fetchAllData,
  startPeriodRequest,
  endPeriodRequest,
  setCycles,
  setDayLogs,
  addDayLog,
  addCycle,
  updateLastCycle,
  updateSettings,
  setLoading,
  setError,
  selectCycles,
  selectSettings,
  selectCycleStats,
} from '../cycleSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { CycleData, CycleStats, DayLog, UserSettings } from '../../types/cycle';
import { upsertSettings } from '../../db/settingsApi';

import { buildCycleNotifications } from '../../notifications/notificationScheduler';
import {
  cancelAllNotifications,
  scheduleNotification,
} from '../../notifications/notificationService';

// ── Notification rescheduling ────────────────────────────────────────────────

export function* rescheduleNotifications() {
  try {
    const settings: UserSettings = yield select(selectSettings);

    // If notifications are disabled, just cancel everything
    if (!settings.notificationsEnabled) {
      yield call(cancelAllNotifications);
      return;
    }

    // 1. Cancel all existing scheduled notifications
    yield call(cancelAllNotifications);

    // 2. Build the new notification list from current stats
    const stats: CycleStats = yield select(selectCycleStats);
    const notifications = buildCycleNotifications(stats);

    // 3. Schedule each one
    for (const n of notifications) {
      yield call(scheduleNotification, n);
    }

    console.log(`[Notifications] Scheduled ${notifications.length} notifications`);
  } catch (err: any) {
    // Notification failures should not break the app
    console.warn('[Notifications] Failed to reschedule:', err?.message);
  }
}

// ── fetchAllData ─────────────────────────────────────────────────────────────

function* handleFetchAllData() {
  try {
    yield put(setLoading(true));
    const cycles: CycleData[] = yield call(getAllCycles);
    const dayLogs: DayLog[]   = yield call(getAllDayLogs);
    yield put(setCycles(cycles));
    yield put(setDayLogs(dayLogs));
    yield put(setLoading(false));

    // Reschedule notifications after data load
    yield call(rescheduleNotifications);
  } catch (err: any) {
    yield put(setError(err?.message ?? 'Failed to load data'));
  }
}

export function* watchFetchAllData() {
  yield takeLatest(fetchAllData, handleFetchAllData);
}

// ── startPeriod ──────────────────────────────────────────────────────────────

function* handleStartPeriod(action: PayloadAction<string | undefined>) {
  try {
    const periodDate = action.payload ?? format(new Date(), 'yyyy-MM-dd');

    // 1. Insert cycle row in SQLite
    yield call(insertCycle, periodDate);
    yield put(addCycle({ startDate: periodDate }));

    // 2. Upsert the day log for that date
    const existingLogs: DayLog[] = yield select(selectCycles);
    // Build the day log
    const log: DayLog = {
      date: periodDate,
      isPeriod: true,
      flowIntensity: 'medium',
      moods: [],
      symptoms: [],
    };
    yield call(upsertDayLog, log);
    yield put(addDayLog(log));

    // 3. Update lastPeriodDate in settings
    const settings: ReturnType<typeof selectSettings> = yield select(selectSettings);
    const updatedSettings = { ...settings, lastPeriodDate: periodDate };
    yield call(upsertSettings, updatedSettings);
    yield put(updateSettings(updatedSettings));

    // 4. Reschedule notifications with new period date
    yield call(rescheduleNotifications);
  } catch (err: any) {
    yield put(setError(err?.message ?? 'Failed to start period'));
  }
}

export function* watchStartPeriod() {
  yield takeEvery(startPeriodRequest, handleStartPeriod);
}

// ── endPeriod ────────────────────────────────────────────────────────────────

function* handleEndPeriod(action: PayloadAction<string | undefined>) {
  try {
    const endDate = action.payload ?? format(new Date(), 'yyyy-MM-dd');
    const cycles: CycleData[] = yield select(selectCycles);
    const currentCycle = cycles[cycles.length - 1];

    if (currentCycle && !currentCycle.endDate) {
      const length =
        differenceInDays(parseISO(endDate), parseISO(currentCycle.startDate)) + 1;

      yield call(updateCycle, currentCycle.startDate, endDate, length);
      yield put(
        updateLastCycle({
          startDate: currentCycle.startDate,
          endDate,
          length,
        }),
      );

      // Reschedule notifications with updated cycle data
      yield call(rescheduleNotifications);
    }
  } catch (err: any) {
    yield put(setError(err?.message ?? 'Failed to end period'));
  }
}

export function* watchEndPeriod() {
  yield takeEvery(endPeriodRequest, handleEndPeriod);
}
