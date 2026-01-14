import type { WorkoutHistoryEntry } from '../types/plan';
import type { PlanPreferencesRow } from '../types/user';

export function adaptPlanOnMiss(
  preferences: PlanPreferencesRow,
  history: WorkoutHistoryEntry[]
) {
  // TODO: Implement missed-workout adaptation rules from docs/plan-generation.algorithm.md
  // Placeholder only.
  return {
    preferences,
    historyCount: history.length,
    action: 'none' as const,
  };
}
