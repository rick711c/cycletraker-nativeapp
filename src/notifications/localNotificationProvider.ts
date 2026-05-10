/**
 * Local Notification Provider — powered by expo-notifications
 *
 * This is the ONLY file that imports the native notification library.
 * Swapping to Firebase means creating a new provider file implementing
 * the same NotificationProvider interface — nothing else changes.
 *
 * NOTE: expo-notifications push support was removed from Expo Go in SDK 53.
 * We lazy-load the module and fall back to a no-op provider when running
 * inside Expo Go so the app can still boot without crashing.
 */

import Constants from 'expo-constants';
import type { NotificationProvider, ScheduledNotification } from './notificationTypes';

// ---------------------------------------------------------------------------
// Detect whether we're running inside Expo Go
// ---------------------------------------------------------------------------

const isExpoGo = Constants.appOwnership === 'expo';

// ---------------------------------------------------------------------------
// Lazy-loaded expo-notifications reference (only resolved in dev builds)
// ---------------------------------------------------------------------------

let Notifications: typeof import('expo-notifications') | null = null;

if (!isExpoGo) {
  try {
    // Dynamic require so the module is never evaluated inside Expo Go
    Notifications = require('expo-notifications');

    // Configure how notifications behave when received
    Notifications!.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldShowSound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (err) {
    console.warn('[Notifications] Failed to load expo-notifications:', err);
  }
}

// ---------------------------------------------------------------------------
// Provider implementation
// ---------------------------------------------------------------------------

export const localNotificationProvider: NotificationProvider = {
  async requestPermission(): Promise<boolean> {
    if (!Notifications) {
      console.log('[Notifications] Skipped (Expo Go — not supported)');
      return false;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async scheduleNotification(n: ScheduledNotification): Promise<void> {
    if (!Notifications) return;
    await Notifications.scheduleNotificationAsync({
      identifier: n.id,
      content: {
        title: n.title,
        body: n.body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: n.scheduledAt,
      },
    });
  },

  async cancelAll(): Promise<void> {
    if (!Notifications) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  async cancelById(id: string): Promise<void> {
    if (!Notifications) return;
    await Notifications.cancelScheduledNotificationAsync(id);
  },
};