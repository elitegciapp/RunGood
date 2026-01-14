import type { SQLiteDatabase } from 'expo-sqlite';

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY NOT NULL,
      createdAt TEXT NOT NULL,
      subscriptionStatus TEXT NOT NULL,
      onboardingCompleted INTEGER NOT NULL,
      lastActiveAt TEXT
    );

    CREATE TABLE IF NOT EXISTS UserProfile (
      userId TEXT PRIMARY KEY NOT NULL,
      runningExperience TEXT,
      lifestyleFactorsJson TEXT NOT NULL,
      stressIndicatorsJson TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS PlanPreferences (
      userId TEXT PRIMARY KEY NOT NULL,
      daysPerWeek TEXT,
      maxSessionDuration INTEGER,
      preferredWorkoutStylesJson TEXT NOT NULL,
      pushTolerance TEXT,
      missedWorkoutPreference TEXT,
      planVisibilityPreference TEXT
    );

    CREATE TABLE IF NOT EXISTS TrainingPlan (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      isActive INTEGER NOT NULL,
      planVersion INTEGER NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS WeeklyPlan (
      id TEXT PRIMARY KEY NOT NULL,
      trainingPlanId TEXT NOT NULL,
      weekNumber INTEGER NOT NULL,
      isDeload INTEGER NOT NULL,
      targetRuns INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS WorkoutSession (
      id TEXT PRIMARY KEY NOT NULL,
      weeklyPlanId TEXT NOT NULL,
      scheduledDate TEXT,
      sessionType TEXT NOT NULL,
      durationMinutes INTEGER NOT NULL,
      workoutStyle TEXT NOT NULL,
      completed INTEGER NOT NULL,
      skipped INTEGER NOT NULL,
      completionSource TEXT
    );

    CREATE TABLE IF NOT EXISTS WorkoutHistory (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      workoutSessionId TEXT NOT NULL,
      completedAt TEXT,
      durationCompleted INTEGER,
      skippedReason TEXT
    );
  `);
}
