# Flora — AI Context Documentation

This directory provides AI agents with compact architectural and feature context for the Flora cycle tracking application.

## Usage

1. Read `feature-index.md` to identify the relevant feature.
2. Open the corresponding `features/<feature>.md` document.
3. Inspect only the source files referenced in that document.
4. Make the change.
5. Update the feature documentation if business logic, calculations, data flow, persistence, state, navigation, notifications, or feature dependencies changed.

Do NOT update documentation for trivial implementation changes that do not alter feature behavior or architecture.

## Structure

```
docs/
├── README.md            ← You are here
├── architecture.md      ← Cross-feature architecture
├── feature-index.md     ← AI lookup index
└── features/
    ├── cycle-tracking.md
    ├── day-logging.md
    ├── insights.md
    ├── onboarding.md
    ├── settings.md
    └── notifications.md
```
