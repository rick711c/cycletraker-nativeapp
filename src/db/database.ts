/**
 * SQLite Database Singleton — powered by expo-sqlite
 *
 * expo-sqlite works inside Expo Go (no custom native code required).
 * Note: Unlike @op-engineering/op-sqlite, this does NOT use JSI,
 * so performance is slightly lower but perfectly fine for most apps.
 *
 * Call initDatabase() once at app startup before any API calls.
 */

import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

/** Return the open DB instance, throwing if not yet initialised. */
export function getDB(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialised — call initDatabase() first');
  }
  return db;
}

/**
 * Open the database and create all tables if they don't exist.
 *
 * Important differences from op-sqlite:
 * - Uses openDatabaseSync() instead of OPSQLite.open()
 * - Uses execAsync() instead of execute()
 */
export async function initDatabase(): Promise<void> {
  if (db) return; // already open

  // Open database (Expo way)
  db = SQLite.openDatabaseSync('flora.db');

  // Create all tables in a single batch
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      id                    INTEGER PRIMARY KEY DEFAULT 1,
      average_cycle_length  INTEGER NOT NULL DEFAULT 28,
      average_period_length INTEGER NOT NULL DEFAULT 5,
      last_period_date      TEXT    NOT NULL DEFAULT (date('now')),
      goal                  TEXT    NOT NULL DEFAULT 'track',
      notifications_enabled INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS cycles (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      start_date TEXT    NOT NULL UNIQUE,
      end_date   TEXT,
      length     INTEGER
    );

    CREATE TABLE IF NOT EXISTS day_logs (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      date           TEXT    NOT NULL UNIQUE,
      is_period      INTEGER NOT NULL DEFAULT 0,
      flow_intensity TEXT,
      moods          TEXT    NOT NULL DEFAULT '[]',
      symptoms       TEXT    NOT NULL DEFAULT '[]',
      notes          TEXT,
      sleep_hours    REAL,
      water_intake   REAL
    );
  `);
}

/**
 * Wipe all user data from every table
 * (used by "Clear All Data" in Settings).
 *
 * Note:
 * - expo-sqlite uses runAsync() for mutations (INSERT, UPDATE, DELETE)
 */
export async function clearAllData(): Promise<void> {
  const d = getDB();

  await d.runAsync('DELETE FROM day_logs');
  await d.runAsync('DELETE FROM cycles');
  await d.runAsync('DELETE FROM settings');
}

/**
 * Close the database (call on app teardown if needed).
 *
 * Note:
 * - expo-sqlite does NOT require explicit close()
 * - We simply reset the reference
 */
export function closeDatabase(): void {
  db = null;
}