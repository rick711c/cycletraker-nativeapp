import { all } from 'redux-saga/effects';
import { watchFetchAllData, watchStartPeriod, watchEndPeriod, watchChangePeriodDate } from './cycleSagas';
import { watchAddDayLog } from './dayLogSagas';
import { watchUpdateSettings } from './settingsSagas';

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
