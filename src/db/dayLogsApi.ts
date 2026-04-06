/**
 * DayLogs API — local backend for the `day_logs` table
 */

import { getDB } from './database';
import { DayLog, FlowIntensity, Mood, PhysicalSymptom } from '../types/cycle';

function rowToDayLog(row: Record<string, any>): DayLog {
  return {
    date:          row.date as string,
    isPeriod:      row.is_period === 1,
    flowIntensity: (row.flow_intensity as FlowIntensity) ?? undefined,
    moods:         JSON.parse((row.moods as string) ?? '[]') as Mood[],
    symptoms:      JSON.parse((row.symptoms as string) ?? '[]') as PhysicalSymptom[],
    notes:         (row.notes as string) ?? undefined,
    sleepHours:    (row.sleep_hours as number) ?? undefined,
    waterIntake:   (row.water_intake as number) ?? undefined,
  };
}

/** Fetch all day logs ordered by date ascending. */
export async function getAllDayLogs(): Promise<DayLog[]> {
  const result = await getDB().execute(
    'SELECT * FROM day_logs ORDER BY date ASC',
  );
  return (result.rows ?? []).map(rowToDayLog);
}

/** Fetch the log for a specific date, or undefined. */
export async function getDayLog(date: string): Promise<DayLog | undefined> {
  const result = await getDB().execute(
    'SELECT * FROM day_logs WHERE date = ?',
    [date],
  );
  if (!result.rows || result.rows.length === 0) return undefined;
  return rowToDayLog(result.rows[0]);
}

/** Insert or replace a day log (handles both create and update). */
export async function upsertDayLog(log: DayLog): Promise<DayLog> {
  await getDB().execute(
    `INSERT OR REPLACE INTO day_logs
       (date, is_period, flow_intensity, moods, symptoms, notes, sleep_hours, water_intake)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      log.date,
      log.isPeriod ? 1 : 0,
      log.flowIntensity ?? null,
      JSON.stringify(log.moods),
      JSON.stringify(log.symptoms),
      log.notes ?? null,
      log.sleepHours ?? null,
      log.waterIntake ?? null,
    ],
  );
  return log;
}

/** Delete a day log by date. */
export async function deleteDayLog(date: string): Promise<void> {
  await getDB().execute('DELETE FROM day_logs WHERE date = ?', [date]);
}
