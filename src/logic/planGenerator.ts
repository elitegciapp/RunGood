import type { TrainingPlan, WeeklyPlan, WorkoutSession } from '../types/plan';
import type { PlanPreferencesRow, UserProfileRow, WorkoutStyle } from '../types/user';

type IntensityLevel = 'VERY_LOW' | 'LOW' | 'MODERATE';

export type GeneratedInitialPlan = {
  trainingPlan: TrainingPlan;
  weeklyPlans: WeeklyPlan[];
  sessions: WorkoutSession[];
  fallbackWorkout: {
    durationMinutes: 10;
    workoutStyle: WorkoutStyle;
    sessionType: 'fallback';
  };
};

function clampMaxSessionDuration(value: number | null | undefined): 10 | 15 | 20 | 30 {
  if (value === 10 || value === 15 || value === 20 || value === 30) return value;
  return 15;
}

function parsePreferredStyles(json: string): WorkoutStyle[] {
  try {
    const raw = JSON.parse(json);
    if (!Array.isArray(raw)) return [];
    return raw.filter((v) => typeof v === 'string') as WorkoutStyle[];
  } catch {
    return [];
  }
}

function baselineDurationForIntensity(intensity: IntensityLevel): 10 | 15 | 20 {
  if (intensity === 'VERY_LOW') return 10;
  if (intensity === 'LOW') return 15;
  return 20;
}

function determineIntensityLevel(
  profile?: UserProfileRow,
  preferences?: PlanPreferencesRow
): IntensityLevel {
  const experience = profile?.runningExperience ?? null;
  let intensity: IntensityLevel = 'LOW';

  if (experience === 'Brand new to running') intensity = 'VERY_LOW';
  else if (experience === 'I’ve run before but I’m out of shape') intensity = 'LOW';
  else if (experience) intensity = 'MODERATE';

  const pushTolerance = preferences?.pushTolerance ?? null;
  if (pushTolerance === 'low') {
    intensity = intensity === 'MODERATE' ? 'LOW' : intensity;
  }

  return intensity;
}

function determineWeeklyRuns(daysPerWeek: PlanPreferencesRow['daysPerWeek']): 2 | 3 {
  if (daysPerWeek === '3') return 3;
  // For flexible, default to 2 (burnout-safe) in v1 generation.
  return 2;
}

function makePlanId(userId: string, planVersion: number) {
  return `plan_${userId}_v${planVersion}_${Date.now()}`;
}

function makeWeekId(planId: string, weekNumber: number) {
  return `week_${planId}_${weekNumber}`;
}

function makeSessionId(weekId: string, index: number) {
  // Keep lexicographic ordering stable for queries.
  return `session_${weekId}_${String(index).padStart(2, '0')}`;
}

function pickPrimaryStyle(preferences: PlanPreferencesRow): Exclude<WorkoutStyle, 'bareMinimum'> {
  const preferred = parsePreferredStyles(preferences.preferredWorkoutStylesJson);
  const first = preferred.find((s) => s !== 'bareMinimum');
  if (first === 'walkRun' || first === 'runWalk' || first === 'easyRun') return first;
  return 'walkRun';
}

export function generateInitialPlan(
  preferences: PlanPreferencesRow,
  profile?: UserProfileRow
): GeneratedInitialPlan {
  const createdAt = new Date().toISOString();
  const planVersion = 1;

  const weeklyRuns = determineWeeklyRuns(preferences.daysPerWeek);
  const intensity = determineIntensityLevel(profile, preferences);
  const maxSessionDuration = clampMaxSessionDuration(preferences.maxSessionDuration);
  const baseline = baselineDurationForIntensity(intensity);

  const primaryStyle = pickPrimaryStyle(preferences);
  const fallbackWorkout = {
    durationMinutes: 10 as const,
    workoutStyle: 'bareMinimum' as const,
    sessionType: 'fallback' as const,
  };

  const trainingPlan: TrainingPlan = {
    id: makePlanId(preferences.userId, planVersion),
    userId: preferences.userId,
    createdAt,
    isActive: true,
    planVersion,
    notes: null,
  };

  const weeks: WeeklyPlan[] = [];
  const sessions: WorkoutSession[] = [];

  // v1: generate 4 weeks, with week 4 as a deload.
  // Progression is conservative: +5 minutes to one session in week 3,
  // never exceeding maxSessionDuration.
  const baseSessionDuration = Math.min(maxSessionDuration, baseline);

  for (let weekNumber = 1; weekNumber <= 4; weekNumber += 1) {
    const isDeload = weekNumber === 4;

    const weekId = makeWeekId(trainingPlan.id, weekNumber);
    weeks.push({
      id: weekId,
      trainingPlanId: trainingPlan.id,
      weekNumber,
      isDeload,
      targetRuns: weeklyRuns,
      createdAt,
    });

    const canLightChallenge =
      !isDeload &&
      weeklyRuns === 3 &&
      (preferences.pushTolerance === 'medium' || preferences.pushTolerance === 'variable');

    const sessionTypes: Array<'easy' | 'lightChallenge'> =
      weeklyRuns === 3
        ? (['easy', 'easy', canLightChallenge ? 'lightChallenge' : 'easy'] as const)
        : (['easy', 'easy'] as const);

    const deloadMultiplier = isDeload ? 0.8 : 1;
    const weekProgressBonus = weekNumber === 3 && !isDeload ? 5 : 0;

    sessionTypes.forEach((sessionType, idx) => {
      const duration =
        idx === 0
          ? Math.min(
              maxSessionDuration,
              Math.round((baseSessionDuration + weekProgressBonus) * deloadMultiplier)
            )
          : Math.round(baseSessionDuration * deloadMultiplier);

      sessions.push({
        id: makeSessionId(weekId, idx + 1),
        weeklyPlanId: weekId,
        scheduledDate: null,
        sessionType,
        durationMinutes: Math.max(10, duration),
        workoutStyle: primaryStyle,
        completed: false,
        skipped: false,
        completionSource: null,
      });
    });
  }

  return {
    trainingPlan,
    weeklyPlans: weeks,
    sessions,
    fallbackWorkout,
  };
}
