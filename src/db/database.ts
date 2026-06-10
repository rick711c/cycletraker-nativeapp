import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export function getDB(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error("Database not initialised — call initDatabase() first");
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  if (db) return;

  db = SQLite.openDatabaseSync("flora.db");

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

export async function clearAllData(): Promise<void> {
  const d = getDB();
  await d.runAsync("DELETE FROM day_logs");
  await d.runAsync("DELETE FROM cycles");
  await d.runAsync("DELETE FROM settings");
}

export function closeDatabase(): void {
  db = null;
}
