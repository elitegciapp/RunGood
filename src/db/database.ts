import * as SQLite from 'expo-sqlite';

import { migrate } from './schema';
import type { PlanPreferencesRow, UserProfileRow, UserRow } from '../types/user';

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
