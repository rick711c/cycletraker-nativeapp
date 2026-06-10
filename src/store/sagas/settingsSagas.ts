import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { upsertSettings } from "../../db/settingsApi";
import { UserSettings } from "../../types/cycle";
import { setError, updateSettings, updateSettingsRequest } from "../cycleSlice";
import { rescheduleNotifications } from "./cycleSagas";

function* handleUpdateSettings(action: PayloadAction<Partial<UserSettings>>) {
  try {
    const saved: UserSettings = yield call(upsertSettings, action.payload);
    yield put(updateSettings(saved));
    if ("notificationsEnabled" in action.payload) {
      yield call(rescheduleNotifications);
    }
  } catch (err: any) {
    yield put(setError(err?.message ?? "Failed to save settings"));
  }
}

export function* watchUpdateSettings() {
  yield takeLatest(updateSettingsRequest, handleUpdateSettings);
}
