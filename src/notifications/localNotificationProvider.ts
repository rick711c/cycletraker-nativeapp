/**
 * Local Notification Provider — powered by @notifee/react-native
 *
 * This is the ONLY file that imports the native notification library.
 * Swapping to Firebase means creating a new provider file implementing
 * the same NotificationProvider interface — nothing else changes.
 */

import * as Notifications from 'expo-notifications';
import type { NotificationProvider, ScheduledNotification } from './notificationTypes';

// Configure how notifications behave when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound:true,
    shouldShowSound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ---------------------------------------------------------------------------
// Provider implementation (Expo version)
// ---------------------------------------------------------------------------

export const localNotificationProvider: NotificationProvider = {
  async requestPermission(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async scheduleNotification(n: ScheduledNotification): Promise<void> {
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
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  async cancelById(id: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(id);
  },
};