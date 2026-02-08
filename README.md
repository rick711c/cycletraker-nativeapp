# 🌸 Flora — Menstrual Cycle Tracker

A beautiful, privacy-focused menstrual cycle tracking app built with **React Native** and **React Native Paper (Material Design 3)**. Flora helps users understand their body through intelligent cycle predictions, daily logging, and personalized insights — all while keeping data stored locally on the device.

---

## 📱 Pages Overview

| Home | Calendar | Log | Insights | Settings |
|------|----------|-----|----------|----------|
| Cycle ring, quick actions, upcoming events, daily insight | Phase-colored monthly calendar | Flow, mood, symptom & notes logging | Stats, patterns & health tips | Notifications, privacy & data management |

---

## ✨ Features

### 🏠 Home Dashboard
- **Cycle Ring Visualization** — An interactive SVG-based circular ring displaying the current day in the cycle, segmented by four cycle phases (Menstruation, Follicular, Ovulation, Luteal) with distinct color coding and dynamic opacity highlighting for the active phase.
- **Current Date Display** — Shows today's date in a human-friendly format (e.g., "Mon, Jun 9").
- **Quick Actions** — A prominent button to toggle period start/end with a single tap. Dynamically changes label and icon based on whether a period is currently active.
- **Upcoming Events** — Two info cards showing:
  - **Next Period** — Predicted date and countdown in days.
  - **Ovulation / Fertile Window** — Predicted ovulation date or "Today!" indicator when inside the fertile window.
- **Daily Insight** — Phase-specific health insight card with:
  - A title describing the current phase energy (e.g., "Rest & Restore", "Rising Energy", "Peak Vitality", "Winding Down").
  - A hormonal description of what's happening in the body.
  - A practical health tip with emoji.

### 📅 Calendar View
- **Full Monthly Calendar** — Custom-built calendar grid with navigation to previous/next months.
- **Phase-Colored Days** — Each day is color-coded based on its predicted cycle phase (Menstruation, Follicular, Ovulation, Luteal).
- **Period Day Indicators** — Days with logged period data show a solid phase color and a dot indicator.
- **Today Highlight** — Current date is outlined with the primary brand color.
- **Greyed-out Days** — Days outside the current month are shown with reduced opacity.
- **Cycle Phase Legend** — A card at the bottom explaining each phase color.

### 📝 Daily Log Page
- **Flow Intensity Tracking** — Select from 4 levels: Spotting, Light, Medium, Heavy. Displayed with Material Design icons and toggle selection.
- **Mood Tracking** — Log multiple moods simultaneously with emoji-based selectors:
  - 😊 Happy, ⚡ Energetic, 🥺 Sensitive, 😰 Anxious, 😢 Sad, 😤 Irritable
- **Physical Symptom Tracking** — Select from 8 symptoms with toggle chips:
  - 🤕 Cramps, 🤯 Headache, 🎈 Bloating, 💗 Breast Tenderness, 😖 Acne, 😴 Fatigue, 🦴 Backache, 🤢 Nausea
- **Notes** — Free-text multiline input for recording additional observations.
- **Save Confirmation** — Snackbar feedback on successful save with "OK" dismiss action.
- **Edit Existing Logs** — Automatically loads existing log data for the current day if previously saved.

### 📊 Insights Page
- **Statistics Grid** — Four stat cards displayed in a 2×2 grid:
  - **Average Cycle Length** — Calculated from completed cycle history (falls back to user-set default).
  - **Cycles Tracked** — Total number of cycles recorded.
  - **Days Logged** — Total daily logs created.
  - **Current Day** — Current day number in the active cycle.
- **Pattern Recognition** — Analyzes logged data to surface:
  - **Most Common Mood** — The mood logged most frequently.
  - **Most Common Symptom** — The symptom logged most frequently.
  - **Next Period Countdown** — Days remaining until the predicted next period.
- **Empty State** — Friendly message encouraging users to start logging when no data exists.
- **Health Tips** — A static card with advice on consistent tracking benefits.

### ⚙️ Settings Page
- **Cycle Settings Display** — Shows current configuration:
  - Average cycle length (in days)
  - Average period length (in days)
  - Current tracking goal
- **Notification Settings**:
  - **Period Reminders** — Toggle to enable/disable period notifications.
- **Privacy Settings**:
  - **App Lock** — Passcode requirement toggle (coming soon).
  - **Discreet Mode** — Hide sensitive notification content (coming soon).
- **Data Management**:
  - **Export Data** — Download health data (coming soon).
  - **Clear All Data** — Permanently delete all data with a confirmation dialog (Alert with Cancel/Delete options). Clears AsyncStorage and resets to onboarding.
- **App Info Footer** — Displays Flora branding, version number (1.0.0), and privacy tagline.

### 🚀 Onboarding Flow
A guided 5-step setup wizard for first-time users:

1. **Welcome Screen** — Hero image with Flora branding and "Get Started" CTA.
2. **Last Period Date** — Text input to enter the start date of the most recent period (YYYY-MM-DD format with calendar icon).
3. **Average Cycle Length** — Counter selector with +/- buttons (range: 21–40 days) with helper text.
4. **Average Period Length** — Counter selector with +/- buttons (range: 2–10 days) with helper text.
5. **Goal Selection** — Choose from three tracking goals:
   - 📅 **Track my cycle** — Understand your body better
   - 👶 **Try to conceive** — Optimize fertility window
   - 🤰 **Track pregnancy** — Monitor your journey

**Onboarding UX Features:**
- Progress bar showing advancement through steps.
- Back/Next navigation with step-by-step validation.
- Navigation stack reset on completion (prevents going back to onboarding).
- Data persists immediately on completion.

---

## 🧠 Cycle Prediction Engine

The app uses a calculation-based prediction engine powered by `date-fns`:

| Prediction | Formula |
|---|---|
| **Current Phase** | Based on `dayInCycle` relative to period length and ovulation day |
| **Next Period** | `lastPeriodDate + averageCycleLength` |
| **Ovulation Day** | `averageCycleLength - 14` (luteal phase constant) |
| **Fertile Window** | `ovulationDay - 5` to `ovulationDay + 1` |
| **Day in Cycle** | `differenceInDays(today, lastPeriodDate)` |

**Phase Determination Logic:**
| Day Range | Phase |
|---|---|
| Day 1 → Period Length | Menstruation |
| Period Length → Ovulation - 1 | Follicular |
| Ovulation - 1 → Ovulation + 3 | Ovulation |
| Ovulation + 3 → Cycle End | Luteal |

**Adaptive Averages:** After 3+ completed cycles, the app recalculates average period length from historical data.

---

## 🏗️ Architecture & Tech Stack

### Core Technologies
| Technology | Purpose |
|---|---|
| **React Native 0.83** | Cross-platform mobile framework |
| **TypeScript** | Type-safe development |
| **React Native Paper 5** | Material Design 3 UI component library |
| **React Navigation 7** | Native stack navigation |
| **Zustand 5** | Lightweight state management |
| **AsyncStorage** | Persistent local data storage |
| **React Query (TanStack)** | Async state management (available for future API integration) |
| **date-fns** | Date manipulation and formatting |
| **react-native-svg** | SVG rendering for the Cycle Ring |
| **react-native-calendars** | Calendar utilities |
| **react-native-vector-icons** | MaterialDesignIcons icon set |
| **react-native-safe-area-context** | Safe area inset handling |
| **react-native-screens** | Native screen optimization |

### Project Structure
```
src/
├── assets/                    # Static assets (hero image, etc.)
├── components/
│   ├── cycle/
│   │   ├── CycleRing.tsx      # SVG-based circular cycle visualization
│   │   ├── DailyInsight.tsx   # Phase-specific health insight card
│   │   ├── QuickActions.tsx   # Period start/end toggle button
│   │   └── UpcomingEvents.tsx # Next period & ovulation countdown cards
│   ├── layout/
│   │   ├── BottomNav.tsx      # Bottom navigation bar with FAB center button
│   │   └── MobileLayout.tsx   # Main layout wrapper with scroll & safe area
│   └── ui/
│       └── Icon.tsx           # Unified icon component (MaterialDesignIcons)
├── hooks/
│   ├── useCycleStore.ts       # Zustand store — state, actions & predictions
│   └── use-toast.ts           # Toast notification hook
├── pages/
│   ├── Home.tsx               # Main dashboard screen
│   ├── Onboarding.tsx         # 5-step setup wizard
│   ├── CalendarPage.tsx       # Monthly calendar with phase coloring
│   ├── LogPage.tsx            # Daily flow/mood/symptom logging
│   ├── InsightsPage.tsx       # Statistics, patterns & health tips
│   ├── SettingsPage.tsx       # App configuration & data management
│   └── NotFound.tsx           # 404 fallback page
├── theme/
│   └── muiTheme.ts            # Light & Dark theme definitions (MD3)
└── types/
    └── cycle.ts               # TypeScript interfaces & type definitions
```

### State Management (Zustand)

The app uses a single Zustand store (`useCycleStore`) with persistence via AsyncStorage:

**State:**
| Field | Type | Description |
|---|---|---|
| `isOnboarded` | `boolean` | Whether the user has completed onboarding |
| `settings` | `UserSettings` | Cycle/period length, last period date, goal, notifications |
| `cycles` | `CycleData[]` | Array of cycle start/end dates and lengths |
| `dayLogs` | `DayLog[]` | Array of daily log entries |

**Actions:**
| Action | Description |
|---|---|
| `setOnboarded(value)` | Mark onboarding as complete |
| `updateSettings(partial)` | Update user settings (merge) |
| `addDayLog(log)` | Add or replace a daily log entry |
| `updateDayLog(date, updates)` | Partially update an existing log |
| `startPeriod(date?)` | Start a new period cycle, create day log |
| `endPeriod(date?)` | End the current period, calculate duration |
| `getDayLog(date)` | Retrieve log for a specific date |
| `getCycleStats()` | Calculate all cycle predictions and statistics |
| `getPhaseForDate(date)` | Determine the cycle phase for any date |

---

## 🎨 Theming

Flora supports **automatic Light/Dark mode** based on the device system preference (`useColorScheme`).

### Color Palette

| Token | Light | Dark | Usage |
|---|---|---|---|
| Primary | `#D92581` | `#D92581` | Brand pink — buttons, accents, active states |
| Background | `#F2F2F3` | `#0B0B0C` | Screen backgrounds |
| Surface | `#FAFAFA` | `#121214` | Cards, elevated elements |
| Error | `#DB2424` | `#DB2424` | Destructive actions |

### Cycle Phase Colors
| Phase | Color | Hex |
|---|---|---|
| Menstruation | 🔴 Pink | `#D92581` |
| Follicular | 🌸 Light Pink | `#F7A5CE` |
| Ovulation | 🔶 Coral | `#FC6F83` |
| Luteal | 🌷 Soft Pink | `#FCA0AA` |

---

## 🔐 Privacy & Data

- **100% Local Storage** — All data is stored on-device using AsyncStorage. No cloud sync, no servers, no third-party analytics.
- **No Account Required** — The app works entirely offline with no sign-up.
- **Data Deletion** — Users can permanently clear all data from Settings with a single action.
- **Privacy-First Design** — Discreet mode and app lock features planned for future releases.

---

## 📱 Navigation

The app uses **React Navigation Native Stack** with 6 screens:

| Route | Screen | Description |
|---|---|---|
| `Home` | Home Dashboard | Default landing page |
| `Onboarding` | Setup Wizard | First-time user flow |
| `Calendar` | Calendar View | Monthly cycle calendar |
| `Log` | Daily Log | Flow, mood & symptom entry |
| `Insights` | Insights | Stats & pattern analysis |
| `Settings` | Settings | App configuration |

**Bottom Navigation Bar** features:
- 4 standard tabs: Home, Calendar, Insights, Settings
- 1 elevated **FAB (Floating Action Button)** center button for quick Log access
- Active tab highlighting with primary color
- Safe area aware positioning

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** >= 20
- **React Native CLI** environment set up ([guide](https://reactnative.dev/docs/set-up-your-environment))
- **Android Studio** (for Android) or **Xcode** (for iOS)

### Installation

```bash
# Clone the repository
git clone https://github.com/rick711c/cycletraker-nativeapp.git
cd cycletraker-nativeapp

# Install dependencies
npm install

# For iOS (first time only)
bundle install
cd ios && bundle exec pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm start` | `react-native start` | Start Metro dev server |
| `npm run android` | `react-native run-android` | Build & run on Android |
| `npm run ios` | `react-native run-ios` | Build & run on iOS |
| `npm run lint` | `eslint .` | Run ESLint |
| `npm test` | `jest` | Run test suite |

---

## 🧪 Testing

The project uses **Jest** with **React Test Renderer** for unit testing:

```bash
npm test
```

---

## 📦 Type System

### Core Types

```typescript
type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

type FlowIntensity = 'spotting' | 'light' | 'medium' | 'heavy';

type Mood = 'happy' | 'sensitive' | 'sad' | 'anxious' | 'energetic' | 'irritable';

type PhysicalSymptom = 
  | 'cramps' | 'headache' | 'bloating' | 'breast_tenderness' 
  | 'acne' | 'fatigue' | 'backache' | 'nausea';

interface DayLog {
  date: string;
  isPeriod: boolean;
  flowIntensity?: FlowIntensity;
  moods: Mood[];
  symptoms: PhysicalSymptom[];
  notes?: string;
  sleepHours?: number;
  waterIntake?: number;
}

interface UserSettings {
  averageCycleLength: number;
  averagePeriodLength: number;
  lastPeriodDate: string;
  goal: 'track' | 'conceive' | 'pregnancy';
  notificationsEnabled: boolean;
}

interface CycleStats {
  averageCycleLength: number;
  averagePeriodLength: number;
  nextPeriodDate: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  currentPhase: CyclePhase;
  dayInCycle: number;
}
```

---

## 🛡️ Error Handling

- **ErrorBoundary** — A class-based React error boundary wraps the entire app tree, catching uncaught runtime errors and displaying a user-friendly error message instead of a crash.
- **Guard Clauses** — The cycle stats engine includes fallback defaults when settings or data are missing.
- **Safe Navigation** — Navigation stack resets prevent users from navigating back to invalid states (e.g., returning to onboarding after completion).

---

## 🗺️ Roadmap

- [ ] App Lock (passcode/biometric)
- [ ] Discreet notification mode
- [ ] Data export (CSV/JSON)
- [ ] Date picker integration for log & onboarding
- [ ] Push notifications for period reminders
- [ ] Sleep & water intake tracking UI
- [ ] Cycle length trend charts
- [ ] Multi-language support

---

## 📄 License

This project is private and not currently published under an open-source license.

---

<p align="center">
  🌸 <strong>Flora</strong> — Your cycle, your data, your privacy.
</p>
