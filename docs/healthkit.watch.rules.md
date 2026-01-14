# Apple Health + Apple Watch Rules (v1)

## HealthKit Permissions
Request only what is used.
Explain clearly in-app.

### Read (optional but useful)
- Workouts (running/walking)
- Steps (optional)
- Active energy (optional)

### Write
- Running workout sessions completed in-app
- Duration (minutes)

## Sync Strategy
- On app open: read latest workouts (last 7–14 days)
- After completing a session: write workout to HealthKit
- Store last sync timestamp per user

## De-duplication
If HealthKit contains a workout within:
- Same day
- Similar duration (±5 minutes)
Then mark session as completed via Apple Health instead of duplicating.

## Watch Support (v1)
- Optional companion experience
- Must not be required for iPhone plan functionality
- Watch shows:
  - current interval
  - time remaining
  - haptic cue on interval change

## Watch Session Types
- time-based intervals only
- no pace goals
- no distance-based triggers

## Privacy Guardrails
- No medical claims
- No sensitive health metrics stored in app DB beyond:
  - completed workout duration
  - completion timestamps
- Do not store heart rate in v1
