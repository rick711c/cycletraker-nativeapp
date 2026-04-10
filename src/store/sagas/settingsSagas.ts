/**
 * Settings Sagas — handle updateSettingsRequest
 *
 * When the notificationsEnabled toggle changes, we reschedule
 * (or cancel) all notifications accordingly.
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { upsertSettings } from '../../db/settingsApi';
import { updateSettingsRequest, updateSettings, setError } from '../cycleSlice';
import { UserSettings } from '../../types/cycle';
import { rescheduleNotifications } from './cycleSagas';

function* handleUpdateSettings(action: PayloadAction<Partial<UserSettings>>) {
  try {
    const saved: UserSettings = yield call(upsertSettings, action.payload);
    // Update Redux cache with merged result from SQLite
    yield put(updateSettings(saved));

    // If the notification toggle was part of this update, reschedule
    if ('notificationsEnabled' in action.payload) {
      yield call(rescheduleNotifications);
    }
  } catch (err: any) {
    yield put(setError(err?.message ?? 'Failed to save settings'));
  }
}

export function* watchUpdateSettings() {
  yield takeLatest(updateSettingsRequest, handleUpdateSettings);
}
