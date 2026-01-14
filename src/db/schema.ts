import type { SQLiteDatabase } from 'expo-sqlite';

function quoteIdent(name: string) {
  // Defensive quoting for SQLite identifiers (tables/columns).
  return `"${name.replace(/"/g, '""')}"`;
}

async function ensureColumn(db: SQLiteDatabase, table: string, columnName: string, columnDef: string) {
  const columns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(${quoteIdent(table)});`);
  const exists = columns.some((c) => c.name === columnName);
  if (exists) return;
  await db.execAsync(`ALTER TABLE ${quoteIdent(table)} ADD COLUMN ${columnDef};`);
}

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY NOT NULL,
      createdAt TEXT NOT NULL,
      subscriptionStatus TEXT NOT NULL,
      trialStartedAt TEXT,
      trialEndsAt TEXT,
      subscriptionProductId TEXT,
      subscriptionExpiresAt TEXT,
      onboardingCompleted INTEGER NOT NULL,
      lastActiveAt TEXT
    );

    CREATE TABLE IF NOT EXISTS UserProfile (
      userId TEXT PRIMARY KEY NOT NULL,
      runningExperience TEXT,
      lifestyleFactorsJson TEXT NOT NULL,
      stressIndicatorsJson TEXT NOT NULL,
      motivation TEXT,
      notes TEXT
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
      createdAt TEXT,
      completedAt TEXT,
      durationCompleted INTEGER,
      skippedReason TEXT
    );
  `);

  // Lightweight forward migrations (safe for existing local installs).
  await ensureColumn(db, 'UserProfile', 'motivation', 'motivation TEXT');
  await ensureColumn(db, 'UserProfile', 'notes', 'notes TEXT');

  // TrainingPlan columns evolved over time; older local DBs may be missing these.
  await ensureColumn(db, 'TrainingPlan', 'createdAt', 'createdAt TEXT');
  await ensureColumn(db, 'TrainingPlan', 'isActive', 'isActive INTEGER NOT NULL DEFAULT 0');
  await ensureColumn(db, 'TrainingPlan', 'planVersion', 'planVersion INTEGER NOT NULL DEFAULT 1');
  await ensureColumn(db, 'TrainingPlan', 'notes', 'notes TEXT');

  await ensureColumn(db, 'WorkoutHistory', 'createdAt', 'createdAt TEXT');

  // Older installs may have WorkoutHistory without `createdAt`.
  // Create index only after the column is confirmed present.
  const workoutHistoryColumns = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${quoteIdent('WorkoutHistory')});`
  );
  const hasWorkoutHistoryCol = (name: string) => workoutHistoryColumns.some((c) => c.name === name);
  if (hasWorkoutHistoryCol('userId') && hasWorkoutHistoryCol('createdAt')) {
    try {
      await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_workoutHistory_user_createdAt
          ON ${quoteIdent('WorkoutHistory')} (userId, createdAt);
      `);
    } catch {
      // Best-effort only: never crash app startup over an index.
    }
  }

  // Other indexes are best-effort to avoid crashing startup on older schemas.
  try {
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_workoutHistory_session
        ON ${quoteIdent('WorkoutHistory')} (workoutSessionId);
    `);
  } catch {
    // Best-effort only.
  }

  const trainingPlanColumns = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${quoteIdent('TrainingPlan')});`
  );
  const hasTrainingPlanCol = (name: string) => trainingPlanColumns.some((c) => c.name === name);
  if (hasTrainingPlanCol('userId') && hasTrainingPlanCol('isActive') && hasTrainingPlanCol('createdAt')) {
    try {
      await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_trainingPlan_user_active_createdAt
          ON ${quoteIdent('TrainingPlan')} (userId, isActive, createdAt);
      `);
    } catch {
      // Best-effort only.
    }
  }

  try {
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_weeklyPlan_trainingPlan_week
        ON ${quoteIdent('WeeklyPlan')} (trainingPlanId, weekNumber);
    `);
  } catch {
    // Best-effort only.
  }

  try {
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_workoutSession_weeklyPlan_completed_skipped
        ON ${quoteIdent('WorkoutSession')} (weeklyPlanId, completed, skipped);
    `);
  } catch {
    // Best-effort only.
  }

  // Subscription/trial columns were added after initial launch; existing installs may not have them.
  // Add `subscriptionStatus` first (index depends on it) with a safe default.
  await ensureColumn(db, 'User', 'subscriptionStatus', 'subscriptionStatus TEXT NOT NULL DEFAULT "free"');
  await ensureColumn(db, 'User', 'trialStartedAt', 'trialStartedAt TEXT');
  await ensureColumn(db, 'User', 'trialEndsAt', 'trialEndsAt TEXT');
  await ensureColumn(db, 'User', 'subscriptionProductId', 'subscriptionProductId TEXT');
  await ensureColumn(db, 'User', 'subscriptionExpiresAt', 'subscriptionExpiresAt TEXT');

  // Index relies on columns that may be added by ensureColumn above.
  const userColumns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(${quoteIdent('User')});`);
  const hasUserCol = (name: string) => userColumns.some((c) => c.name === name);
  if (hasUserCol('subscriptionStatus') && hasUserCol('trialEndsAt') && hasUserCol('subscriptionExpiresAt')) {
    try {
      await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_user_subscription
          ON ${quoteIdent('User')} (subscriptionStatus, trialEndsAt, subscriptionExpiresAt);
      `);
    } catch {
      // Best-effort only: never crash app startup over an index.
    }
  }
}
