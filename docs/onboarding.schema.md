# Onboarding Questionnaire Schema (v1)

## Goal
Collect only the minimum information required to generate a realistic, burnout-safe running plan
for busy, inconsistent users.

The onboarding must:
- Take under 2 minutes
- Avoid fitness jargon
- Avoid medical claims
- Feel neutral and encouraging
- Be fully editable later

---

## SECTION 1 — Basics

### Q1: How would you describe your running background?
Type: Single Select

Options:
- Brand new to running
- I’ve run before but I’m out of shape
- I run occasionally
- I’m restarting after a long break

Used for:
- Initial intensity cap
- Default workout style suggestions

---

### Q2: Which best describes you right now?
Type: Multi Select

Options:
- I’m busy most weeks
- I get inconsistent sleep
- I feel low energy often
- I get stressed easily
- None of these

Used for:
- Default weekly volume
- Recovery weighting

---

## SECTION 2 — Availability & Time

### Q3: How many days per week can you realistically run?
Type: Single Select

Options:
- 2 days
- 3 days
- It depends (flexible)

Used for:
- Weekly plan structure

---

### Q4: What’s the longest session you feel comfortable committing to?
Type: Single Select

Options:
- 10 minutes
- 15 minutes
- 20 minutes
- 30 minutes

Used for:
- Max session duration cap

---

## SECTION 3 — Workout Style Preference

### Q5: What type of workouts sound best right now?
Type: Multi Select

Options:
- Walking with short run intervals
- Run/walk intervals
- Easy steady running
- Very short, low-pressure workouts

Used for:
- Default workout style
- “Bare minimum” day logic

---

### Q6: How do you feel about pushing yourself a little?
Type: Single Select

Options:
- I prefer staying comfortable
- I’m okay with a small challenge
- It depends on the day

Used for:
- Progression aggressiveness
- Push suggestion frequency

---

## SECTION 4 — Motivation & Intent

### Q7: What matters most to you right now?
Type: Single Select

Options:
- Being more consistent
- Reducing stress
- Improving fitness
- Just getting started

Used for:
- Copy tone
- Notification language
- Progress framing

---

## SECTION 5 — Missed Workout Preferences

### Q8: If you miss a few workouts, what should the app do?
Type: Single Select

Options:
- Ask me what I want to do
- Automatically make things easier
- Ignore it and keep going

Used for:
- Missed workout handling logic

---

## SECTION 6 — Visibility Preferences

### Q9: How much of your plan do you want to see?
Type: Single Select

Options:
- Just today
- The next 7 days
- The full plan

Used for:
- Default UI state

---

## SECTION 7 — Final Confirmation

### Q10: Anything else the app should know?
Type: Optional Free Text

Placeholder:
"Optional — you can leave this blank."

Used for:
- Future personalization (not required in v1)

---

## Onboarding Completion Output

On completion, generate:
- UserProfile
- PlanPreferences
- InitialTrainingPlan

No medical screening.
No injury questions.
No weight or body metrics.
