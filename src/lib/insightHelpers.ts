import {
    pregnancyInsights,
    trackCycleInsights,
    tryToConceiveInsights,
} from "../data/insightData";
import { AppMode, DailyInsightData } from "../types/insight";

export function getInsightForDay(
  currentDay: number,
  mode: AppMode,
): DailyInsightData {
  let insightsData: DailyInsightData[] = [];

  switch (mode) {
    case "tryToConceive":
      insightsData = tryToConceiveInsights;
      break;
    case "trackPregnancy":
      insightsData = pregnancyInsights;
      break;
    case "trackCycle":
    default:
      insightsData = trackCycleInsights;
      break;
  }

  const maxDay = mode === "trackPregnancy" ? 280 : 28;
  const day = currentDay > maxDay ? maxDay : Math.max(1, currentDay);

  const match = insightsData.find(
    (entry) => day >= entry.dayRange[0] && day <= entry.dayRange[1],
  );

  return match ?? insightsData[insightsData.length - 1];
}
