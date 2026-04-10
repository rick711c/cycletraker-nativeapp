/**
 * Local Notification Provider — powered by @notifee/react-native
 *
 * This is the ONLY file that imports the native notification library.
 * Swapping to Firebase means creating a new provider file implementing
 * the same NotificationProvider interface — nothing else changes.
 */

import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
  AuthorizationStatus,
} from '@notifee/react-native';
import type { NotificationProvider, ScheduledNotification } from './notificationTypes';

const CHANNEL_ID = 'flora-cycle-reminders';
const CHANNEL_NAME = 'Cycle Reminders';

let channelCreated = false;

async function ensureChannel(): Promise<void> {
  if (channelCreated) return;
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: CHANNEL_NAME,
    importance: AndroidImportance.HIGH,
    description: 'Reminders for your menstrual cycle events',
  });
  channelCreated = true;
}

// ---------------------------------------------------------------------------
// Provider implementation
// ---------------------------------------------------------------------------

export const localNotificationProvider: NotificationProvider = {
  async requestPermission(): Promise<boolean> {
    const settings = await notifee.requestPermission();
    return (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    );
  },

  async scheduleNotification(n: ScheduledNotification): Promise<void> {
    await ensureChannel();

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: n.scheduledAt.getTime(),
    };

    await notifee.createTriggerNotification(
      {
        id: n.id,
        title: n.title,
        body: n.body,
        android: {
          channelId: CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          smallIcon: 'ic_launcher', // uses app icon
          pressAction: { id: 'default' },
        },
      },
      trigger,
    );
  },

  async cancelAll(): Promise<void> {
    await notifee.cancelAllNotifications();
  },

  async cancelById(id: string): Promise<void> {
    await notifee.cancelNotification(id);
  },
};
