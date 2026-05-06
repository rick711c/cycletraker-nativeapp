import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import cycleReducer from './cycleSlice';
import rootSaga from './sagas/rootSaga';

// ---------------------------------------------------------------------------
// Persist config — uses expo-sqlite localStorage polyfill
// (imported in app/_layout.tsx via 'expo-sqlite/localStorage/install')
// ---------------------------------------------------------------------------

/**
 * Custom redux-persist storage adapter using expo-sqlite's localStorage polyfill.
 * This replaces AsyncStorage for a synchronous, faster storage backend.
 */
const localStorageAdapter = {
  getItem: (key: string): Promise<string | null> => {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, value: string): Promise<void> => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
  removeItem: (key: string): Promise<void> => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
};

const persistConfig = {
  key: 'flora-ui-state',
  storage: localStorageAdapter,
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
