import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { upsertDayLog } from "../../db/dayLogsApi";
import { DayLog } from "../../types/cycle";
import { addDayLog, addDayLogRequest, setError } from "../cycleSlice";

function* handleAddDayLog(action: PayloadAction<DayLog>) {
  try {
    const saved: DayLog = yield call(upsertDayLog, action.payload);
    yield put(addDayLog(saved));
  } catch (err: any) {
    yield put(setError(err?.message ?? "Failed to save day log"));
  }
}

export function* watchAddDayLog() {
  yield takeEvery(addDayLogRequest, handleAddDayLog);
}
