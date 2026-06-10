import { localNotificationProvider } from "./localNotificationProvider";
import type {
    NotificationProvider,
    ScheduledNotification,
} from "./notificationTypes";

let provider: NotificationProvider = localNotificationProvider;

export function initializeNotifications(
  customProvider?: NotificationProvider,
): void {
  if (customProvider) {
    provider = customProvider;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  return provider.requestPermission();
}

export async function scheduleNotification(
  n: ScheduledNotification,
): Promise<void> {
  return provider.scheduleNotification(n);
}

export async function cancelAllNotifications(): Promise<void> {
  return provider.cancelAll();
}

export async function cancelNotificationById(id: string): Promise<void> {
  return provider.cancelById(id);
}
