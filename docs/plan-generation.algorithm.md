# Plan Generation Algorithm (v1)

## Purpose
Generate a realistic, time-based running plan that:
- Assumes inconsistency
- Protects against burnout
- Adapts when workouts are missed
- Never escalates aggressively
- Preserves user autonomy

This algorithm favors consistency over performance.

---

## Inputs

### UserProfile
- runningExperience
- lifestyleFactors
- stressIndicators

### PlanPreferences
- daysPerWeek
- maxSessionDuration
- preferredWorkoutStyles
- pushTolerance
- missedWorkoutPreference
- planVisibilityPreference

---

## Core Constraints (Non-Negotiable)

- Time-based workouts only
- No pace or distance targets
- No more than 10–15% weekly volume increase
- Never increase intensity and volume in the same week
- Minimum 1 rest day between runs
- Deload every 3–4 weeks OR after repeated skips

---

## Step 1 — Determine Weekly Structure



IF daysPerWeek == "2 days"
weeklyRuns = 2
ELSE IF daysPerWeek == "3 days"
weeklyRuns = 3
ELSE
weeklyRuns = 2–3 (flexible)


Assign default run days with buffer spacing.
Do not enforce fixed weekdays.

---

## Step 2 — Set Initial Intensity Level



IF runningExperience == "Brand new"
intensityLevel = VERY_LOW
ELSE IF runningExperience == "Out of shape"
intensityLevel = LOW
ELSE
intensityLevel = MODERATE


Apply downgrade if:
- Multiple lifestyle stress flags are present
- User selected low push tolerance

---

## Step 3 — Select Workout Style

From preferredWorkoutStyles:
- Choose 1 primary
- Choose 1 fallback ("bare minimum")

Fallback workouts must be:
- ≤ 10 minutes
- Low intensity
- Always available

---

## Step 4 — Build Weekly Sessions

For each run in the week:



sessionDuration = MIN(
maxSessionDuration,
baselineDurationForIntensity
)


Session types rotate:
- Easy
- Easy
- Optional light challenge (only if tolerated)

No hard workouts in v1.

---

## Step 5 — Progression Rules

Progress only if:
- At least 70% of planned workouts completed
- No reported excessive fatigue
- No consecutive skips in previous week

Progression options (choose ONE):
- +5 minutes to ONE session
- Slightly longer run interval
- Reduce walk time slightly

Never apply more than one change per week.

---

## Step 6 — Missed Workout Handling

When workouts are skipped:



IF missedWorkoutPreference == "Ask"
prompt user
ELSE IF missedWorkoutPreference == "Auto reduce"
downgrade intensity next week
ELSE
continue unchanged


Repeated skips trigger:
- Automatic deload
- Reduced expectations
- Re-offer onboarding preferences

---

## Step 7 — Burnout Protection Logic

Trigger protection when:
- 2+ consecutive skipped weeks
- User reports low energy repeatedly
- Plan completion <50% for 2 weeks

Protection actions:
- Reduce weekly volume by 20–30%
- Switch to easier workout style
- Insert recovery week

User is informed neutrally.

---

## Step 8 — Plan Visibility Output

Generate:
- Today view
- 7-day view
- Full timeline

Visibility preference controls default view only.

---

## Step 9 — Output Objects

Return:
- TrainingPlan
- WeeklySessions[]
- FallbackWorkout
- NextAdjustmentWindow

These objects must be editable without regenerating onboarding.

---

## Design Philosophy Summary

- Expect inconsistency
- Never punish missed workouts
- Protect confidence
- Progress slowly
- Always offer a win
