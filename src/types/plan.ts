import type { WorkoutStyle } from './user';

export type SessionType = 'easy' | 'fallback' | 'lightChallenge';

export interface TrainingPlan {
  id: string;
  userId: string;
  createdAt: string;
  isActive: boolean;
  planVersion: number;
  notes?: string | null;
}

export interface WeeklyPlan {
  id: string;
  trainingPlanId: string;
  weekNumber: number;
  isDeload: boolean;
  targetRuns: number;
  createdAt: string;
}

export interface WorkoutSession {
  id: string;
  weeklyPlanId: string;
  scheduledDate: string | null; // YYYY-MM-DD or null
  sessionType: SessionType;
  durationMinutes: number;
  workoutStyle: Exclude<WorkoutStyle, 'bareMinimum'>;
  completed: boolean;
  skipped: boolean;
  completionSource: 'manual' | 'appleHealth' | 'appleWatch' | null;
}

export interface WorkoutHistoryEntry {
  id: string;
  userId: string;
  workoutSessionId: string;
  completedAt: string | null;
  durationCompleted: number | null;
  skippedReason?: string | null;
}
