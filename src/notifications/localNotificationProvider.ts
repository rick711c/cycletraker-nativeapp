import Constants from "expo-constants";
import type {
    NotificationProvider,
    ScheduledNotification,
} from "./notificationTypes";

const isExpoGo = Constants.appOwnership === "expo";

let Notifications: typeof import("expo-notifications") | null = null;

if (!isExpoGo) {
  try {
    Notifications = require("expo-notifications");
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
    console.warn("[Notifications] Failed to load expo-notifications:", err);
  }
}

export const localNotificationProvider: NotificationProvider = {
  async requestPermission(): Promise<boolean> {
    if (!Notifications) {
      console.log("[Notifications] Skipped (Expo Go — not supported)");
      return false;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
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
