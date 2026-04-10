/**
 * SQLite Database Singleton — powered by @op-engineering/op-sqlite
 *
 * op-sqlite uses JSI for near-native performance and supports modern Gradle.
 * Call initDatabase() once at app startup before any API calls.
 */

import { OPSQLite, DB } from '@op-engineering/op-sqlite';

let db: DB | null = null;

/** Return the open DB instance, throwing if not yet initialised. */
export function getDB(): DB {
  if (!db) {
    throw new Error('Database not initialised — call initDatabase() first');
  }
  return db;
}

/** Open the database and create all tables if they don't exist. */
export async function initDatabase(): Promise<void> {
  if (db) return; // already open

  db = OPSQLite.open({ name: 'flora.db' });

  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      id                    INTEGER PRIMARY KEY DEFAULT 1,
      average_cycle_length  INTEGER NOT NULL DEFAULT 28,
      average_period_length INTEGER NOT NULL DEFAULT 5,
      last_period_date      TEXT    NOT NULL DEFAULT (date('now')),
      goal                  TEXT    NOT NULL DEFAULT 'track',
      notifications_enabled INTEGER NOT NULL DEFAULT 1
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS cycles (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      start_date TEXT    NOT NULL UNIQUE,
      end_date   TEXT,
      length     INTEGER
    )
  `);

  await db.execute(`
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
    )
  `);
}

/** Wipe all user data from every table (used by "Clear All Data" in Settings). */
export async function clearAllData(): Promise<void> {
  const d = getDB();
  await d.execute('DELETE FROM day_logs');
  await d.execute('DELETE FROM cycles');
  await d.execute('DELETE FROM settings');
}

/** Close the database (call on app teardown if needed). */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
