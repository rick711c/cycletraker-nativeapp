export type AppMode = "trackCycle" | "tryToConceive" | "trackPregnancy";

export interface InsightBase {
  dayRange: [number, number];
  phase: string;
  summary: string;
  biologicalState: string;
  symptoms: Record<string, string>;
  careRoutine: {
    diet: string;
    remedy: string;
    activity: string;
  };
  checklist: string[];
  hygiene: string;
}

export interface TrackCycleInsight extends InsightBase {
  pregnancyProbability: string;
}

export interface TryToConceiveInsight extends InsightBase {
  pregnancyProbability: string;
  fertilityStatus: string;
  actionItem: string;
}

export interface PregnancyInsight extends InsightBase {
  babyDevelopment: string;
  milestone: string;
}

export type DailyInsightData =
  | TrackCycleInsight
  | TryToConceiveInsight
  | PregnancyInsight;
