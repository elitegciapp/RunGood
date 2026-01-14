# Database Schema (v1)

## Design Goals
- Simple
- Flexible
- Audit-friendly
- Supports adaptation without re-onboarding
- Apple Health–safe (no medical data)

---

## Core Entities

---

## User

Represents a single app user.



User

id (UUID)

createdAt (timestamp)

subscriptionStatus (trial | active | expired)

onboardingCompleted (boolean)

lastActiveAt (timestamp)


---

## UserProfile

Captured during onboarding. Editable later.



UserProfile

userId (FK)

runningExperience (enum)

lifestyleFactors (array)

stressIndicators (array)


---

## PlanPreferences

Controls plan generation behavior.



PlanPreferences

userId (FK)

daysPerWeek (2 | 3 | flexible)

maxSessionDuration (10 | 15 | 20 | 30)

preferredWorkoutStyles (array)

pushTolerance (low | medium | variable)

missedWorkoutPreference (ask | autoReduce | ignore)

planVisibilityPreference (today | 7day | full)


---

## TrainingPlan

High-level container for a plan version.



TrainingPlan

id (UUID)

userId (FK)

createdAt (timestamp)

isActive (boolean)

planVersion (integer)

notes (text)


---

## WeeklyPlan

Represents a single week inside a training plan.



WeeklyPlan

id (UUID)

trainingPlanId (FK)

weekNumber (integer)

isDeload (boolean)

targetRuns (integer)

createdAt (timestamp)


---

## WorkoutSession

Individual scheduled sessions.



WorkoutSession

id (UUID)

weeklyPlanId (FK)

scheduledDate (date | null)

sessionType (easy | fallback | lightChallenge)

durationMinutes (integer)

workoutStyle (walkRun | runWalk | easyRun)

completed (boolean)

skipped (boolean)

completionSource (manual | appleHealth | appleWatch)


---

## WorkoutHistory

Immutable record of completed or skipped workouts.



WorkoutHistory

id (UUID)

userId (FK)

workoutSessionId (FK)

completedAt (timestamp | null)

durationCompleted (integer | null)

skippedReason (optional text)


---

## AdaptationEvent

Tracks plan changes for transparency.



AdaptationEvent

id (UUID)

userId (FK)

trainingPlanId (FK)

eventType (progress | deload | downgrade | reset)

reason (text)

createdAt (timestamp)


---

## NotificationLog

Prevents spam and supports opt-out compliance.



NotificationLog

id (UUID)

userId (FK)

notificationType (nudge | reminder)

sentAt (timestamp)


---

## HealthSyncLog

Tracks Apple Health interactions.



HealthSyncLog

id (UUID)

userId (FK)

syncType (read | write)

source (health | watch)

syncedAt (timestamp)


---

## SubscriptionEvent

Tracks trial and billing state.



SubscriptionEvent

id (UUID)

userId (FK)

eventType (trialStart | trialEnd | renewal | cancel)

occurredAt (timestamp)


---

## Data Rules

- No weight, BMI, or medical data stored
- History records are immutable
- Plan versions increment on regeneration
- Only one active TrainingPlan at a time
- WorkoutHistory is the source of truth

---

## Future-Proofing Notes

- Coaching notes can attach to TrainingPlan later
- Social features can reference User only
- AI logic operates on WorkoutHistory + AdaptationEvent
