/**
 * Notification Service — singleton facade.
 *
 * Delegates every call to the active NotificationProvider.
 * Sagas and components import ONLY this module.
 *
 * To swap providers in the future:
 *   import { firebaseProvider } from './firebaseNotificationProvider';
 *   initializeNotifications(firebaseProvider);
 */

import type { NotificationProvider, ScheduledNotification } from './notificationTypes';
import { localNotificationProvider } from './localNotificationProvider';

let provider: NotificationProvider = localNotificationProvider;

/**
 * (Optional) Override the default local provider.
 * Call this once at app boot BEFORE any scheduling happens.
 */
export function initializeNotifications(customProvider?: NotificationProvider): void {
  if (customProvider) {
    provider = customProvider;
  }
}

/** Request OS notification permission via the active provider. */
export async function requestNotificationPermission(): Promise<boolean> {
  return provider.requestPermission();
}

/** Schedule a single notification. */
export async function scheduleNotification(n: ScheduledNotification): Promise<void> {
  return provider.scheduleNotification(n);
}

/** Cancel all scheduled notifications. */
export async function cancelAllNotifications(): Promise<void> {
  return provider.cancelAll();
}

/** Cancel a specific notification. */
export async function cancelNotificationById(id: string): Promise<void> {
  return provider.cancelById(id);
}
