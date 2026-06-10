import { CycleData } from "../types/cycle";
import { getDB } from "./database";

function rowToCycle(row: Record<string, any>): CycleData {
  return {
    startDate: row.start_date as string,
    endDate: (row.end_date as string) ?? undefined,
    length: (row.length as number) ?? undefined,
  };
}

export async function getAllCycles(): Promise<CycleData[]> {
  const db = getDB();
  const rows = await db.getAllAsync(
    "SELECT * FROM cycles ORDER BY start_date ASC",
  );
  return (rows as Record<string, any>[]).map(rowToCycle);
}

export async function insertCycle(startDate: string): Promise<CycleData> {
  const db = getDB();
  await db.runAsync("INSERT OR IGNORE INTO cycles (start_date) VALUES (?)", [
    startDate,
  ]);
  return { startDate };
}

export async function updateCycle(
  startDate: string,
  endDate: string,
  length: number,
): Promise<void> {
  const db = getDB();
  await db.runAsync(
    "UPDATE cycles SET end_date = ?, length = ? WHERE start_date = ?",
    [endDate, length, startDate],
  );
}

export async function deleteCycle(startDate: string): Promise<void> {
  const db = getDB();
  await db.runAsync("DELETE FROM cycles WHERE start_date = ?", [startDate]);
}
