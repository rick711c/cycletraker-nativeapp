import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
  createMigrate,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSagaMiddleware from 'redux-saga';
import cycleReducer from './cycleSlice';
import rootSaga from './sagas/rootSaga';

// ---------------------------------------------------------------------------
// Persist config — only the lightweight UI slice keys
// cycles and dayLogs live in SQLite; loaded at startup via fetchAllData saga
// ---------------------------------------------------------------------------

const persistConfig = {
  key: 'flora-ui-state',
  storage: AsyncStorage,
  whitelist: ['isOnboarded', 'settings'], // cycles + dayLogs NOT persisted here
};

const persistedCycleReducer = persistReducer(persistConfig, cycleReducer);

// ---------------------------------------------------------------------------
// Saga middleware
// ---------------------------------------------------------------------------

const sagaMiddleware = createSagaMiddleware();

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const store = configureStore({
  reducer: {
    cycle: persistedCycleReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      thunk: false, // we use saga instead of thunk
    }).concat(sagaMiddleware),
});

// Run root saga after store is created
sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
