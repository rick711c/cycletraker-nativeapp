/**
 * Settings API — local backend for the `settings` table
 */

import { getDB } from './database';
import { UserSettings } from '../types/cycle';
import { format } from 'date-fns';

const DEFAULT_SETTINGS: UserSettings = {
  averageCycleLength: 28,
  averagePeriodLength: 5,
  lastPeriodDate: format(new Date(), 'yyyy-MM-dd'),
  goal: 'track',
  notificationsEnabled: true,
};

function rowToSettings(row: Record<string, any>): UserSettings {
  return {
    averageCycleLength: row.average_cycle_length as number,
    averagePeriodLength: row.average_period_length as number,
    lastPeriodDate: row.last_period_date as string,
    goal: row.goal as UserSettings['goal'],
    notificationsEnabled: row.notifications_enabled === 1,
  };
}

/** Fetch the settings row (id=1). Returns defaults if no row exists yet. */
export async function getSettings(): Promise<UserSettings> {
  const db = getDB();

  // expo-sqlite uses getFirstAsync() for single row queries
  const row = await db.getFirstAsync(
    'SELECT * FROM settings WHERE id = 1'
  );

  if (!row) return DEFAULT_SETTINGS;
  return rowToSettings(row);
}

/**
 * Insert or update the settings row.
 * Merges the partial update with the current stored values.
 */
export async function upsertSettings(
  partial: Partial<UserSettings>,
): Promise<UserSettings> {
  const db = getDB();

  const current = await getSettings();
  const merged: UserSettings = { ...current, ...partial };

  // expo-sqlite uses runAsync() for INSERT/UPDATE
  await db.runAsync(
    `INSERT OR REPLACE INTO settings
       (id, average_cycle_length, average_period_length, last_period_date, goal, notifications_enabled)
     VALUES (1, ?, ?, ?, ?, ?)`,
    [
      merged.averageCycleLength,
      merged.averagePeriodLength,
      merged.lastPeriodDate,
      merged.goal,
      merged.notificationsEnabled ? 1 : 0,
    ]
  );

  return merged;
}