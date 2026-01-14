import type { TrainingPlan } from '../types/plan';
import type { PlanPreferencesRow } from '../types/user';

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}`;
}

export function generateInitialPlan(preferences: PlanPreferencesRow): TrainingPlan {
  // TODO: Implement the v1 algorithm in docs/plan-generation.algorithm.md
  // Placeholder only.
  return {
    id: makeId('plan'),
    userId: preferences.userId,
    createdAt: new Date().toISOString(),
    isActive: true,
    planVersion: 1,
    notes: 'Placeholder plan. Algorithm not implemented yet.',
  };
}
