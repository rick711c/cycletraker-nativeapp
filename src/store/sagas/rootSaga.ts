import { all } from 'redux-saga/effects';
import { watchFetchAllData, watchStartPeriod, watchEndPeriod } from './cycleSagas';
import { watchAddDayLog } from './dayLogSagas';
import { watchUpdateSettings } from './settingsSagas';

export default function* rootSaga() {
  yield all([
    watchFetchAllData(),
    watchStartPeriod(),
    watchEndPeriod(),
    watchAddDayLog(),
    watchUpdateSettings(),
  ]);
}
