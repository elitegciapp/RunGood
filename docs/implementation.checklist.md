# Implementation Checklist (v1)

## Phase 1: App Skeleton
- Create React Native app (Expo recommended)
- Set up navigation:
  - Onboarding stack
  - Bottom tabs
- Add local storage model for User + onboarding state

## Phase 2: Data Layer
- Implement database (local first; cloud later)
  - SQLite / WatermelonDB / Realm (choose)
- Add models:
  - User, UserProfile, PlanPreferences, TrainingPlan, WeeklyPlan, WorkoutSession, WorkoutHistory

## Phase 3: Plan Engine
- Implement v1 plan generator (pure functions)
- Generate:
  - 4-week plan by default
  - sessions per week per preferences
  - fallback workout always
- Add progression + deload rules

## Phase 4: Workout Flow
- Today screen renders next session
- Start workout timer
- Interval timer for run/walk sessions
- Complete/Skip session updates history

## Phase 5: Adaptation
- Missed workout prompt workflow
- Apply user choice:
  - reduce intensity OR skip OR reset week
- Log AdaptationEvent

## Phase 6: Health Integrations
- HealthKit permissions + sync logs
- Write completed workouts to HealthKit
- Read and reconcile completions

## Phase 7: Subscription
- Trial + subscription via StoreKit
- Paywall placement per gating doc
- Restore purchases
- Settings subscription management

## Phase 8: QA + App Store Readiness
- Privacy policy + terms
- In-app permission explanations
- Crash-free onboarding
- No broken flows without Watch
- Clear subscription disclosure
