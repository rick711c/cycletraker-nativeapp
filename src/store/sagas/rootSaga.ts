import { all } from "redux-saga/effects";
import {
    watchChangePeriodDate,
    watchEndPeriod,
    watchFetchAllData,
    watchStartPeriod,
} from "./cycleSagas";
import { watchAddDayLog } from "./dayLogSagas";
import { watchUpdateSettings } from "./settingsSagas";

export default function* rootSaga() {
  yield all([
    watchFetchAllData(),
    watchStartPeriod(),
    watchEndPeriod(),
    watchChangePeriodDate(),
    watchAddDayLog(),
    watchUpdateSettings(),
  ]);
}
