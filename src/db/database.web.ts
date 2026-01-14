// Web shim: expo-sqlite's web backend can fail to bundle in some environments.
// This keeps the app runnable on web for basic navigation.
// iOS/Android use src/db/database.ts (SQLite).

import type { PlanPreferencesRow, UserProfileRow, UserRow } from '../types/user';
import type { TrainingPlan, WeeklyPlan, WorkoutSession } from '../types/plan';

const LOCAL_USER_ID = 'local-user';

let onboardingCompleted = false;

let userProfile: UserProfileRow = {
  userId: LOCAL_USER_ID,
  runningExperience: null,
  lifestyleFactorsJson: JSON.stringify([]),
  stressIndicatorsJson: JSON.stringify([]),
};

let planPreferences: PlanPreferencesRow = {
  userId: LOCAL_USER_ID,
  daysPerWeek: null,
  maxSessionDuration: null,
  preferredWorkoutStylesJson: JSON.stringify([]),
  pushTolerance: null,
  missedWorkoutPreference: null,
  planVisibilityPreference: null,
};

let activeTrainingPlan: TrainingPlan | null = null;
let weeklyPlans: WeeklyPlan[] = [];
let sessions: WorkoutSession[] = [];

function nowIso() {
  return new Date().toISOString();
}

export async function getDb() {
  // Not used on web.
  return null as any;
}

export async function getLocalUser(): Promise<UserRow> {
  return {
    id: LOCAL_USER_ID,
    createdAt: nowIso(),
    subscriptionStatus: 'trial',
    onboardingCompleted,
    lastActiveAt: null,
  };
}

export async function setOnboardingCompleted(completed: boolean) {
  onboardingCompleted = completed;
}

export async function updateUserProfile(patch: Partial<UserProfileRow>) {
  userProfile = {
    ...userProfile,
    ...patch,
  };
}

export async function getUserProfile(): Promise<UserProfileRow> {
  return userProfile;
}

export async function updatePlanPreferences(patch: Partial<PlanPreferencesRow>) {
  planPreferences = {
    ...planPreferences,
    ...patch,
  };
}

export async function getPlanPreferences(): Promise<PlanPreferencesRow> {
  return planPreferences;
}

export async function createInitialTrainingPlan(): Promise<TrainingPlan> {
  // Minimal placeholder on web. Native platforms persist a real plan.
  activeTrainingPlan = {
    id: `plan_${Date.now()}`,
    userId: LOCAL_USER_ID,
    createdAt: nowIso(),
    isActive: true,
    planVersion: 1,
    notes: 'Web placeholder plan.',
  };
  weeklyPlans = [];
  sessions = [];
  return activeTrainingPlan;
}

export async function getActiveTrainingPlan(): Promise<TrainingPlan | null> {
  return activeTrainingPlan;
}

export async function getWeeklyPlansForActivePlan(): Promise<WeeklyPlan[]> {
  return weeklyPlans;
}

export async function getNextPlannedSession(): Promise<WorkoutSession | null> {
  return sessions.find((s) => !s.completed && !s.skipped) ?? null;
}
