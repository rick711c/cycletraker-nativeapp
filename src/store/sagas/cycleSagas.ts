import {
    differenceInDays,
    eachDayOfInterval,
    format,
    parseISO,
} from "date-fns";
import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects";

import { PayloadAction } from "@reduxjs/toolkit";
import { getAllCycles, insertCycle, updateCycle } from "../../db/cyclesApi";
import { getAllDayLogs, upsertDayLog } from "../../db/dayLogsApi";
import { upsertSettings } from "../../db/settingsApi";
import { buildCycleNotifications } from "../../notifications/notificationScheduler";
import {
    cancelAllNotifications,
    scheduleNotification,
} from "../../notifications/notificationService";
import { CycleData, CycleStats, DayLog, UserSettings } from "../../types/cycle";
import {
    addCycle,
    addDayLog,
    changePeriodDateRequest,
    endPeriodRequest,
    fetchAllData,
    selectCycles,
    selectCycleStats,
    selectSettings,
    setCycles,
    setDayLogs,
    setError,
    setLoading,
    startPeriodRequest,
    updateLastCycle,
    updateSettings,
} from "../cycleSlice";

export function* rescheduleNotifications() {
  try {
    const settings: UserSettings = yield select(selectSettings);
    if (!settings.notificationsEnabled) {
      yield call(cancelAllNotifications);
      return;
    }
    yield call(cancelAllNotifications);
    const stats: CycleStats = yield select(selectCycleStats);
    const notifications = buildCycleNotifications(stats);
    for (const n of notifications) {
      yield call(scheduleNotification, n);
    }
    console.log(
      `[Notifications] Scheduled ${notifications.length} notifications`,
    );
  } catch (err: any) {
    console.warn("[Notifications] Failed to reschedule:", err?.message);
  }
}

function* handleFetchAllData() {
  try {
    yield put(setLoading(true));
    const cycles: CycleData[] = yield call(getAllCycles);
    const dayLogs: DayLog[] = yield call(getAllDayLogs);
    yield put(setCycles(cycles));
    yield put(setDayLogs(dayLogs));
    yield put(setLoading(false));
    yield call(rescheduleNotifications);
  } catch (err: any) {
    yield put(setError(err?.message ?? "Failed to load data"));
  }
}

export function* watchFetchAllData() {
  yield takeLatest(fetchAllData, handleFetchAllData);
}

function* handleStartPeriod(action: PayloadAction<string | undefined>) {
  try {
    const periodDate = action.payload ?? format(new Date(), "yyyy-MM-dd");
    yield call(insertCycle, periodDate);
    yield put(addCycle({ startDate: periodDate }));

    const log: DayLog = {
      date: periodDate,
      isPeriod: true,
      flowIntensity: "medium",
      moods: [],
      symptoms: [],
    };
    yield call(upsertDayLog, log);
    yield put(addDayLog(log));

    const settings: UserSettings = yield select(selectSettings);
    const updatedSettings = { ...settings, lastPeriodDate: periodDate };
    yield call(upsertSettings, updatedSettings);
    yield put(updateSettings(updatedSettings));
    yield call(rescheduleNotifications);
  } catch (err: any) {
    yield put(setError(err?.message ?? "Failed to start period"));
  }
}

export function* watchStartPeriod() {
  yield takeEvery(startPeriodRequest, handleStartPeriod);
}

function* handleEndPeriod(action: PayloadAction<string | undefined>) {
  try {
    const endDate = action.payload ?? format(new Date(), "yyyy-MM-dd");
    const cycles: CycleData[] = yield select(selectCycles);
    const currentCycle = cycles[cycles.length - 1];

    if (currentCycle && !currentCycle.endDate) {
      const length =
        differenceInDays(parseISO(endDate), parseISO(currentCycle.startDate)) +
        1;
      yield call(updateCycle, currentCycle.startDate, endDate, length);
      yield put(
        updateLastCycle({ startDate: currentCycle.startDate, endDate, length }),
      );
      yield call(rescheduleNotifications);
    }
  } catch (err: any) {
    yield put(setError(err?.message ?? "Failed to end period"));
  }
}

export function* watchEndPeriod() {
  yield takeEvery(endPeriodRequest, handleEndPeriod);
}

function* handleChangePeriodDate(
  action: PayloadAction<{ startDate: string; endDate: string }>,
) {
  try {
    const { startDate, endDate } = action.payload;
    yield call(insertCycle, startDate);
    const length = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
    yield call(updateCycle, startDate, endDate, length);

    const days = eachDayOfInterval({
      start: parseISO(startDate),
      end: parseISO(endDate),
    });
    for (const day of days) {
      const dateStr = format(day, "yyyy-MM-dd");
      const log: DayLog = {
        date: dateStr,
        isPeriod: true,
        flowIntensity: "medium",
        moods: [],
        symptoms: [],
      };
      yield call(upsertDayLog, log);
      yield put(addDayLog(log));
    }

    yield put(addCycle({ startDate, endDate, length }));

    const settings: UserSettings = yield select(selectSettings);
    const updatedSettings = { ...settings, lastPeriodDate: startDate };
    yield call(upsertSettings, updatedSettings);
    yield put(updateSettings(updatedSettings));
    yield call(rescheduleNotifications);
  } catch (err: any) {
    yield put(setError(err?.message ?? "Failed to update period"));
  }
}

export function* watchChangePeriodDate() {
  yield takeEvery(changePeriodDateRequest, handleChangePeriodDate);
}
