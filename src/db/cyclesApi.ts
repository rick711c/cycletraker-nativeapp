/**
 * Cycles API — local backend for the `cycles` table
 */

import { getDB } from './database';
import { CycleData } from '../types/cycle';

function rowToCycle(row: Record<string, any>): CycleData {
  return {
    startDate: row.start_date as string,
    endDate:   (row.end_date as string)  ?? undefined,
    length:    (row.length   as number)  ?? undefined,
  };
}

/** Fetch all cycles ordered by start date ascending. */
export async function getAllCycles(): Promise<CycleData[]> {
  const result = await getDB().execute(
    'SELECT * FROM cycles ORDER BY start_date ASC',
  );
  return (result.rows ?? []).map(rowToCycle);
}

/**
 * Insert a new cycle.
 * INSERT OR IGNORE is safe to call multiple times with the same startDate.
 */
export async function insertCycle(startDate: string): Promise<CycleData> {
  await getDB().execute(
    'INSERT OR IGNORE INTO cycles (start_date) VALUES (?)',
    [startDate],
  );
  return { startDate };
}

/** Close out an active cycle by recording its end date and computed length. */
export async function updateCycle(
  startDate: string,
  endDate: string,
  length: number,
): Promise<void> {
  await getDB().execute(
    'UPDATE cycles SET end_date = ?, length = ? WHERE start_date = ?',
    [endDate, length, startDate],
  );
}

/** Delete a cycle by its start date. */
export async function deleteCycle(startDate: string): Promise<void> {
  await getDB().execute('DELETE FROM cycles WHERE start_date = ?', [startDate]);
}
