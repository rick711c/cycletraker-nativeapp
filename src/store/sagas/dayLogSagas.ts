/**
 * DayLog Sagas — handle addDayLogRequest
 */

import { call, put, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { upsertDayLog } from '../../db/dayLogsApi';
import { addDayLogRequest, addDayLog, setError } from '../cycleSlice';
import { DayLog } from '../../types/cycle';

function* handleAddDayLog(action: PayloadAction<DayLog>) {
  try {
    const saved: DayLog = yield call(upsertDayLog, action.payload);
    // Update the Redux cache with the result from SQLite
    yield put(addDayLog(saved));
  } catch (err: any) {
    yield put(setError(err?.message ?? 'Failed to save day log'));
  }
}

export function* watchAddDayLog() {
  yield takeEvery(addDayLogRequest, handleAddDayLog);
}
