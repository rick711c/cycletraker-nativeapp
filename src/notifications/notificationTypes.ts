export enum NotificationEvent {
  PERIOD_REMINDER_7D = "period_reminder_7d",
  PERIOD_REMINDER_2D = "period_reminder_2d",
  PERIOD_REMINDER_1D = "period_reminder_1d",
  OVULATION_DAY = "ovulation_day",
  FERTILE_WINDOW_START = "fertile_window_start",
  LUTEAL_PHASE_START = "luteal_phase_start",
}

export interface ScheduledNotification {
  id: string;
  event: NotificationEvent;
  title: string;
  body: string;
  scheduledAt: Date;
}

export interface NotificationProvider {
  requestPermission(): Promise<boolean>;
  scheduleNotification(notification: ScheduledNotification): Promise<void>;
  cancelAll(): Promise<void>;
  cancelById(id: string): Promise<void>;
}
