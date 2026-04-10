/**
 * Notification Types — provider-agnostic contracts.
 *
 * These types are the single shared interface between:
 *   - The scheduling logic (notificationScheduler)
 *   - The delivery layer  (LocalNotificationProvider / future FirebaseProvider)
 *
 * Neither the sagas nor the UI import any native notification library directly.
 */

// ---------------------------------------------------------------------------
// Event catalogue — add new events here as needed
// ---------------------------------------------------------------------------

export enum NotificationEvent {
  PERIOD_REMINDER_7D = 'period_reminder_7d',
  PERIOD_REMINDER_2D = 'period_reminder_2d',
  PERIOD_REMINDER_1D = 'period_reminder_1d',
  OVULATION_DAY = 'ovulation_day',
  FERTILE_WINDOW_START = 'fertile_window_start',
  LUTEAL_PHASE_START = 'luteal_phase_start',
}

// ---------------------------------------------------------------------------
// Data structures
// ---------------------------------------------------------------------------

export interface ScheduledNotification {
  /** Unique ID used to cancel/replace a specific notification. */
  id: string;
  /** Which event this notification belongs to. */
  event: NotificationEvent;
  /** User-facing title. */
  title: string;
  /** User-facing body text. */
  body: string;
  /** The exact Date/Time when the notification should fire. */
  scheduledAt: Date;
}

// ---------------------------------------------------------------------------
// Provider interface — implement this for each delivery mechanism
// ---------------------------------------------------------------------------

export interface NotificationProvider {
  /** Request OS-level notification permission. Returns true if granted. */
  requestPermission(): Promise<boolean>;

  /** Schedule a single notification for a future date. */
  scheduleNotification(notification: ScheduledNotification): Promise<void>;

  /** Cancel all previously scheduled notifications. */
  cancelAll(): Promise<void>;

  /** Cancel a specific notification by ID. */
  cancelById(id: string): Promise<void>;
}
