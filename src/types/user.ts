export type SubscriptionStatus = 'trial' | 'active' | 'expired';

export type RunningExperience =
  | 'Brand new to running'
  | 'I’ve run before but I’m out of shape'
  | 'I run occasionally'
  | 'I’m restarting after a long break';

export type DaysPerWeekPreference = '2' | '3' | 'flexible';
export type MaxSessionDurationMinutes = 10 | 15 | 20 | 30;
export type PushTolerance = 'low' | 'medium' | 'variable';
export type MissedWorkoutPreference = 'ask' | 'autoReduce' | 'ignore';
export type PlanVisibilityPreference = 'today' | '7day' | 'full';

export type WorkoutStyle = 'walkRun' | 'runWalk' | 'easyRun' | 'bareMinimum';

export type LifestyleFactor =
  | 'I’m busy most weeks'
  | 'I get inconsistent sleep'
  | 'I feel low energy often'
  | 'I get stressed easily';

export interface UserRow {
  id: string;
  createdAt: string;
  subscriptionStatus: SubscriptionStatus;
  onboardingCompleted: boolean;
  lastActiveAt: string | null;
}

export interface UserProfileRow {
  userId: string;
  runningExperience: RunningExperience | null;
  lifestyleFactorsJson: string; // JSON stringified array
  stressIndicatorsJson: string; // JSON stringified array
}

export interface PlanPreferencesRow {
  userId: string;
  daysPerWeek: DaysPerWeekPreference | null;
  maxSessionDuration: MaxSessionDurationMinutes | null;
  preferredWorkoutStylesJson: string; // JSON stringified array
  pushTolerance: PushTolerance | null;
  missedWorkoutPreference: MissedWorkoutPreference | null;
  planVisibilityPreference: PlanVisibilityPreference | null;
}
