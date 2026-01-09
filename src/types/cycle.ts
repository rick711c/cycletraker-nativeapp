export type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

export type FlowIntensity = 'spotting' | 'light' | 'medium' | 'heavy';

export type Mood = 'happy' | 'sensitive' | 'sad' | 'anxious' | 'energetic' | 'irritable';

export type PhysicalSymptom = 
  | 'cramps' 
  | 'headache' 
  | 'bloating' 
  | 'breast_tenderness' 
  | 'acne' 
  | 'fatigue'
  | 'backache'
  | 'nausea';

export interface DayLog {
  date: string;
  isPeriod: boolean;
  flowIntensity?: FlowIntensity;
  moods: Mood[];
  symptoms: PhysicalSymptom[];
  notes?: string;
  sleepHours?: number;
  waterIntake?: number;
}

export interface CycleData {
  startDate: string;
  endDate?: string;
  length?: number;
}

export interface UserSettings {
  averageCycleLength: number;
  averagePeriodLength: number;
  lastPeriodDate: string;
  goal: 'track' | 'conceive' | 'pregnancy';
  notificationsEnabled: boolean;
}

export interface CycleStats {
  averageCycleLength: number;
  averagePeriodLength: number;
  nextPeriodDate: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  currentPhase: CyclePhase;
  dayInCycle: number;
}
