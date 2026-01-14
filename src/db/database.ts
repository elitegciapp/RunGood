import * as SQLite from 'expo-sqlite';

import { migrate } from './schema';
import { generateInitialPlan } from '../logic/planGenerator';
import type { PlanPreferencesRow, UserProfileRow, UserRow } from '../types/user';
import type { TrainingPlan, WeeklyPlan, WorkoutSession } from '../types/plan';

const DB_NAME = 'realistic-running-app.db';
const LOCAL_USER_ID = 'local-user';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function nowIso() {
  return new Date().toISOString();
}

export async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await migrate(db);
      await ensureLocalUser(db);
      return db;
    })();
  }
  return dbPromise;
}

async function ensureLocalUser(db: SQLite.SQLiteDatabase) {
  const row = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM User WHERE id = ? LIMIT 1',
    [LOCAL_USER_ID]
  );

  if (row?.id) return;

  await db.runAsync(
    'INSERT INTO User (id, createdAt, subscriptionStatus, onboardingCompleted, lastActiveAt) VALUES (?, ?, ?, ?, ?)',
    [LOCAL_USER_ID, nowIso(), 'trial', 0, null]
  );

  await db.runAsync(
    'INSERT INTO UserProfile (userId, runningExperience, lifestyleFactorsJson, stressIndicatorsJson) VALUES (?, ?, ?, ?)',
    [LOCAL_USER_ID, null, JSON.stringify([]), JSON.stringify([])]
  );

  await db.runAsync(
    'INSERT INTO PlanPreferences (userId, daysPerWeek, maxSessionDuration, preferredWorkoutStylesJson, pushTolerance, missedWorkoutPreference, planVisibilityPreference) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [LOCAL_USER_ID, null, null, JSON.stringify([]), null, null, null]
  );
}

export async function getLocalUser(): Promise<UserRow> {
  const db = await getDb();
  const row = await db.getFirstAsync<any>('SELECT * FROM User WHERE id = ? LIMIT 1', [
    LOCAL_USER_ID,
  ]);

  return {
    id: row.id,
    createdAt: row.createdAt,
    subscriptionStatus: row.subscriptionStatus,
    onboardingCompleted: !!row.onboardingCompleted,
    lastActiveAt: row.lastActiveAt ?? null,
  };
}

export async function setOnboardingCompleted(completed: boolean) {
  const db = await getDb();
  await db.runAsync('UPDATE User SET onboardingCompleted = ? WHERE id = ?', [
    completed ? 1 : 0,
    LOCAL_USER_ID,
  ]);
}

export async function updateUserProfile(patch: Partial<UserProfileRow>) {
  const db = await getDb();

  const current = await db.getFirstAsync<any>(
    'SELECT * FROM UserProfile WHERE userId = ? LIMIT 1',
    [LOCAL_USER_ID]
  );

  const next: UserProfileRow = {
    userId: LOCAL_USER_ID,
    runningExperience: patch.runningExperience ?? current?.runningExperience ?? null,
    lifestyleFactorsJson:
      patch.lifestyleFactorsJson ?? current?.lifestyleFactorsJson ?? JSON.stringify([]),
    stressIndicatorsJson:
      patch.stressIndicatorsJson ?? current?.stressIndicatorsJson ?? JSON.stringify([]),
  };

  await db.runAsync(
    'UPDATE UserProfile SET runningExperience = ?, lifestyleFactorsJson = ?, stressIndicatorsJson = ? WHERE userId = ?',
    [
      next.runningExperience,
      next.lifestyleFactorsJson,
      next.stressIndicatorsJson,
      LOCAL_USER_ID,
    ]
  );
}

export async function getUserProfile(): Promise<UserProfileRow> {
  const db = await getDb();
  const row = await db.getFirstAsync<any>(
    'SELECT * FROM UserProfile WHERE userId = ? LIMIT 1',
    [LOCAL_USER_ID]
  );

  return {
    userId: LOCAL_USER_ID,
    runningExperience: row?.runningExperience ?? null,
    lifestyleFactorsJson: row?.lifestyleFactorsJson ?? JSON.stringify([]),
    stressIndicatorsJson: row?.stressIndicatorsJson ?? JSON.stringify([]),
  };
}

export async function updatePlanPreferences(patch: Partial<PlanPreferencesRow>) {
  const db = await getDb();

  const current = await db.getFirstAsync<any>(
    'SELECT * FROM PlanPreferences WHERE userId = ? LIMIT 1',
    [LOCAL_USER_ID]
  );

  const next: PlanPreferencesRow = {
    userId: LOCAL_USER_ID,
    daysPerWeek: patch.daysPerWeek ?? current?.daysPerWeek ?? null,
    maxSessionDuration: patch.maxSessionDuration ?? current?.maxSessionDuration ?? null,
    preferredWorkoutStylesJson:
      patch.preferredWorkoutStylesJson ??
      current?.preferredWorkoutStylesJson ??
      JSON.stringify([]),
    pushTolerance: patch.pushTolerance ?? current?.pushTolerance ?? null,
    missedWorkoutPreference:
      patch.missedWorkoutPreference ?? current?.missedWorkoutPreference ?? null,
    planVisibilityPreference:
      patch.planVisibilityPreference ?? current?.planVisibilityPreference ?? null,
  };

  await db.runAsync(
    'UPDATE PlanPreferences SET daysPerWeek = ?, maxSessionDuration = ?, preferredWorkoutStylesJson = ?, pushTolerance = ?, missedWorkoutPreference = ?, planVisibilityPreference = ? WHERE userId = ?',
    [
      next.daysPerWeek,
      next.maxSessionDuration,
      next.preferredWorkoutStylesJson,
      next.pushTolerance,
      next.missedWorkoutPreference,
      next.planVisibilityPreference,
      LOCAL_USER_ID,
    ]
  );
}

export async function getPlanPreferences(): Promise<PlanPreferencesRow> {
  const db = await getDb();
  const row = await db.getFirstAsync<any>(
    'SELECT * FROM PlanPreferences WHERE userId = ? LIMIT 1',
    [LOCAL_USER_ID]
  );

  return {
    userId: LOCAL_USER_ID,
    daysPerWeek: row?.daysPerWeek ?? null,
    maxSessionDuration: row?.maxSessionDuration ?? null,
    preferredWorkoutStylesJson: row?.preferredWorkoutStylesJson ?? JSON.stringify([]),
    pushTolerance: row?.pushTolerance ?? null,
    missedWorkoutPreference: row?.missedWorkoutPreference ?? null,
    planVisibilityPreference: row?.planVisibilityPreference ?? null,
  };
}

async function getNextPlanVersion(db: SQLite.SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ maxVersion: number | null }>(
    'SELECT MAX(planVersion) as maxVersion FROM TrainingPlan WHERE userId = ?',
    [LOCAL_USER_ID]
  );
  const current = row?.maxVersion ?? 0;
  return Number.isFinite(current) ? current + 1 : 1;
}

export async function createInitialTrainingPlan(): Promise<TrainingPlan> {
  const db = await getDb();
  const profile = await getUserProfile();
  const preferences = await getPlanPreferences();

  const planVersion = await getNextPlanVersion(db);
  const generated = generateInitialPlan({ ...preferences, userId: LOCAL_USER_ID }, profile);

  // Override planVersion if this isn't the first generation.
  const trainingPlan: TrainingPlan = {
    ...generated.trainingPlan,
    userId: LOCAL_USER_ID,
    planVersion,
    isActive: true,
  };

  const weeklyPlans: WeeklyPlan[] = generated.weeklyPlans.map((w) => ({
    ...w,
    trainingPlanId: trainingPlan.id,
  }));

  const sessions: WorkoutSession[] = generated.sessions.map((s) => ({
    ...s,
  }));

  await db.withTransactionAsync(async () => {
    // Only one active plan.
    await db.runAsync('UPDATE TrainingPlan SET isActive = 0 WHERE userId = ?', [LOCAL_USER_ID]);

    await db.runAsync(
      'INSERT INTO TrainingPlan (id, userId, createdAt, isActive, planVersion, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [
        trainingPlan.id,
        trainingPlan.userId,
        trainingPlan.createdAt,
        trainingPlan.isActive ? 1 : 0,
        trainingPlan.planVersion,
        trainingPlan.notes ?? null,
      ]
    );

    for (const week of weeklyPlans) {
      await db.runAsync(
        'INSERT INTO WeeklyPlan (id, trainingPlanId, weekNumber, isDeload, targetRuns, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        [
          week.id,
          week.trainingPlanId,
          week.weekNumber,
          week.isDeload ? 1 : 0,
          week.targetRuns,
          week.createdAt,
        ]
      );
    }

    for (const session of sessions) {
      await db.runAsync(
        'INSERT INTO WorkoutSession (id, weeklyPlanId, scheduledDate, sessionType, durationMinutes, workoutStyle, completed, skipped, completionSource) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          session.id,
          session.weeklyPlanId,
          session.scheduledDate,
          session.sessionType,
          session.durationMinutes,
          session.workoutStyle,
          session.completed ? 1 : 0,
          session.skipped ? 1 : 0,
          session.completionSource,
        ]
      );
    }
  });

  return trainingPlan;
}

export async function getActiveTrainingPlan(): Promise<TrainingPlan | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<any>(
    'SELECT * FROM TrainingPlan WHERE userId = ? AND isActive = 1 ORDER BY createdAt DESC LIMIT 1',
    [LOCAL_USER_ID]
  );

  if (!row) return null;
  return {
    id: row.id,
    userId: row.userId,
    createdAt: row.createdAt,
    isActive: !!row.isActive,
    planVersion: row.planVersion,
    notes: row.notes ?? null,
  };
}

export async function getWeeklyPlansForActivePlan(): Promise<WeeklyPlan[]> {
  const db = await getDb();
  const active = await getActiveTrainingPlan();
  if (!active) return [];

  const rows = await db.getAllAsync<any>(
    'SELECT * FROM WeeklyPlan WHERE trainingPlanId = ? ORDER BY weekNumber ASC',
    [active.id]
  );

  return rows.map((row) => ({
    id: row.id,
    trainingPlanId: row.trainingPlanId,
    weekNumber: row.weekNumber,
    isDeload: !!row.isDeload,
    targetRuns: row.targetRuns,
    createdAt: row.createdAt,
  }));
}

export async function getNextPlannedSession(): Promise<WorkoutSession | null> {
  const db = await getDb();
  const active = await getActiveTrainingPlan();
  if (!active) return null;

  const row = await db.getFirstAsync<any>(
    `
      SELECT ws.*
      FROM WorkoutSession ws
      JOIN WeeklyPlan wp ON wp.id = ws.weeklyPlanId
      WHERE wp.trainingPlanId = ?
        AND ws.completed = 0
        AND ws.skipped = 0
      ORDER BY wp.weekNumber ASC, ws.id ASC
      LIMIT 1
    `,
    [active.id]
  );

  if (!row) return null;

  return {
    id: row.id,
    weeklyPlanId: row.weeklyPlanId,
    scheduledDate: row.scheduledDate ?? null,
    sessionType: row.sessionType,
    durationMinutes: row.durationMinutes,
    workoutStyle: row.workoutStyle,
    completed: !!row.completed,
    skipped: !!row.skipped,
    completionSource: row.completionSource ?? null,
  };
}
