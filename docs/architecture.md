# Architecture

## Application Structure

```
app/                    → Expo Router screens/routes
src/components/         → Reusable feature UI components
src/data/               → Static content data (insight text)
src/db/                 → SQLite persistence layer
src/store/              → Redux Toolkit state (single slice)
src/store/sagas/        → Redux Saga async workflows
src/types/              → Domain type definitions
src/lib/                → Shared utility functions
src/notifications/      → Local notification infrastructure
src/theme/              → React Native Paper theme config
src/constants.ts        → App-wide constants (privacy keys, URLs)
```

## State Architecture

**Redux Toolkit** with a single `cycle` slice holding all application state.

**Redux Saga** handles all async side effects (DB writes, notification scheduling).

**Redux Persist** persists `isOnboarded` and `settings` via `localStorage` adapter (expo-sqlite/localStorage polyfill). Key: `flora-ui-state`.

**React Query** is set up in the root layout but currently unused for data fetching.

Store shape:
```
{ cycle: CycleState }
```

CycleState:
```
isOnboarded: boolean
settings: UserSettings
cycles: CycleData[]
dayLogs: DayLog[]
loading: boolean
error: string | null
```

Typed hooks: `useAppDispatch`, `useAppSelector` from `src/store/hooks.ts`.

## Persistence Architecture

All data is local-only. No backend API.

```
UI → Redux Action → Saga → src/db/*Api.ts → src/db/database.ts (expo-sqlite) → Redux state update
```

Database: `flora.db` (SQLite via expo-sqlite)

Tables:
- `settings` — single row (id=1), user preferences
- `cycles` — period cycle records (start_date UNIQUE)
- `day_logs` — daily symptom/mood logs (date UNIQUE)

Settings also persisted in localStorage via redux-persist for fast rehydration on app launch.

## Navigation Architecture

```
app/_layout.tsx          → Root: Redux Provider, PersistGate, PaperProvider, biometric lock
├── app/privacy-consent  → First-run privacy consent (localStorage gated)
├── app/onboarding       → First-run setup wizard (isOnboarded gated)
└── app/(tabs)/_layout   → Bottom tab navigator (5 tabs)
    ├── index            → Home/Dashboard
    ├── calendar          → Calendar view
    ├── log              → Day logging
    ├── insights/_layout → Stack navigator
    │   ├── index        → Insights overview
    │   └── cycle-history → Cycle history list
    └── settings         → App settings
```

Guard flow in root layout:
1. Privacy consent not accepted → redirect to `/privacy-consent`
2. Not onboarded → redirect to `/onboarding`
3. App lock enabled → biometric authentication gate
4. Otherwise → `/(tabs)`

## Bootstrap Sequence

In `app/_layout.tsx` → `InnerLayout` → `bootstrap()`:
1. `initDatabase()` — create/migrate SQLite tables
2. `initializeNotifications()` — configure notification provider
3. `requestNotificationPermission()` — request OS permission
4. `store.dispatch(fetchAllData())` — load cycles + dayLogs from DB into Redux
5. Check privacy consent version in localStorage
6. Hide splash screen

## Global Dependencies

| Dependency | Purpose |
|---|---|
| expo-sqlite | Local SQLite database |
| @reduxjs/toolkit | State management |
| redux-saga | Async side effects |
| redux-persist | State persistence |
| react-native-paper | UI component library (MD3) |
| date-fns | Date calculations |
| expo-notifications | Local scheduled notifications |
| expo-local-authentication | Biometric app lock |
| react-native-reanimated | Animations |
| react-native-gesture-handler | Touch gestures |
| expo-haptics | Haptic feedback |
| react-native-calendars | Calendar picker (onboarding) |

## Theme

Dual-theme system via React Native Paper MD3:
- `floraLightTheme` / `floraDarkTheme` in `src/theme/muiTheme.ts`
- Toggle persisted in `settings.darkModeEnabled`
- Primary color: `#D92581` (pink)
- Cycle phase colors exported as `cyclePhaseColors`
