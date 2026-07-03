import { format } from "date-fns";
import { UserSettings } from "../types/cycle";
import { getDB } from "./database";

const DEFAULT_SETTINGS: UserSettings = {
  averageCycleLength: 28,
  averagePeriodLength: 5,
  lastPeriodDate: format(new Date(), "yyyy-MM-dd"),
  goal: "track",
  notificationsEnabled: true,
  appLockEnabled: false,
  darkModeEnabled: false,
};

function rowToSettings(row: Record<string, any>): UserSettings {
  return {
    averageCycleLength: row.average_cycle_length as number,
    averagePeriodLength: row.average_period_length as number,
    lastPeriodDate: row.last_period_date as string,
    goal: row.goal as UserSettings["goal"],
    notificationsEnabled: row.notifications_enabled === 1,
    appLockEnabled: row.app_lock_enabled === 1,
    darkModeEnabled: row.dark_mode_enabled === 1,
  };
}

export async function getSettings(): Promise<UserSettings> {
  const db = getDB();
  const row = await db.getFirstAsync("SELECT * FROM settings WHERE id = 1");
  if (!row) return DEFAULT_SETTINGS;
  return rowToSettings(row);
}

export async function upsertSettings(
  partial: Partial<UserSettings>,
): Promise<UserSettings> {
  const db = getDB();
  const current = await getSettings();
  const merged: UserSettings = { ...current, ...partial };

  await db.runAsync(
    `INSERT OR REPLACE INTO settings
       (id, average_cycle_length, average_period_length, last_period_date, goal, notifications_enabled, app_lock_enabled, dark_mode_enabled)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
    [
      merged.averageCycleLength,
      merged.averagePeriodLength,
      merged.lastPeriodDate,
      merged.goal,
      merged.notificationsEnabled ? 1 : 0,
      merged.appLockEnabled ? 1 : 0,
      merged.darkModeEnabled ? 1 : 0,
    ],
  );

  return merged;
}
