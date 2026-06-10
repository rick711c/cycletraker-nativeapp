import { DayLog, FlowIntensity, Mood, PhysicalSymptom } from "../types/cycle";
import { getDB } from "./database";

function rowToDayLog(row: Record<string, any>): DayLog {
  return {
    date: row.date as string,
    isPeriod: row.is_period === 1,
    flowIntensity: (row.flow_intensity as FlowIntensity) ?? undefined,
    moods: JSON.parse((row.moods as string) ?? "[]") as Mood[],
    symptoms: JSON.parse((row.symptoms as string) ?? "[]") as PhysicalSymptom[],
    notes: (row.notes as string) ?? undefined,
    sleepHours: (row.sleep_hours as number) ?? undefined,
    waterIntake: (row.water_intake as number) ?? undefined,
  };
}

export async function getAllDayLogs(): Promise<DayLog[]> {
  const db = getDB();
  const rows = await db.getAllAsync("SELECT * FROM day_logs ORDER BY date ASC");
  return (rows as Record<string, any>[]).map(rowToDayLog);
}

export async function getDayLog(date: string): Promise<DayLog | undefined> {
  const db = getDB();
  const row = await db.getFirstAsync("SELECT * FROM day_logs WHERE date = ?", [
    date,
  ]);
  if (!row) return undefined;
  return rowToDayLog(row);
}

export async function upsertDayLog(log: DayLog): Promise<DayLog> {
  const db = getDB();
  await db.runAsync(
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

export async function deleteDayLog(date: string): Promise<void> {
  const db = getDB();
  await db.runAsync("DELETE FROM day_logs WHERE date = ?", [date]);
}
