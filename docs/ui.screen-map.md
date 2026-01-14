# UI Screen Map (v1)

## Navigation Model
Bottom Tab Navigation (4 tabs):
1. Today
2. Plan
3. Progress
4. Settings

Initial entry flow:
- If onboarding not complete → Onboarding Stack
- If onboarding complete → Main Tabs (Today default)

---

## Onboarding Stack
Screens:
1. Welcome
2. Basics (Q1–Q2)
3. Availability (Q3–Q4)
4. Workout Style (Q5–Q6)
5. Motivation (Q7)
6. Missed Workouts + Visibility (Q8–Q9)
7. Review + Generate Plan
8. Trial Offer (if required) OR Continue

Key UX rules:
- Under 2 minutes
- Back button available
- “Skip optional” only for free text
- No guilt language

---

## Tab 1: Today (Default)
Purpose:
Deliver the next actionable workout with minimal friction.

Components:
- “Today’s Workout” card
  - Duration
  - Style (run/walk, etc.)
  - Simple steps (e.g., 1 min run / 2 min walk)
- Start Workout button
- “Swap Workout” (choose easier / fallback / reschedule)
- “Bare Minimum Option” (always visible, not hidden)

If user missed workouts:
- Banner: “Want to adjust your plan?”
  - Reduce intensity
  - Skip and continue
  - Reset week

---

## Tab 2: Plan
Purpose:
Show plan timeline with toggles.

Default view based on preference:
- Today / 7-day / Full timeline toggle (segmented control)

Views:
1. Today
2. 7-day
3. Full timeline

Full timeline:
- Weeks list (Week 1, Week 2…)
- Each week expandable to show sessions
- Deload weeks clearly labeled

Actions:
- Tap session → Session detail
- “Regenerate Plan” (requires confirmation, creates new planVersion)

---

## Session Detail Screen
Shows:
- Planned workout steps
- Duration
- Style
- “Complete” / “Skip” buttons
- Skip reason (optional)
- “Mark as done via Apple Health sync” indicator when applicable

---

## Tab 3: Progress
Purpose:
Simple, confidence-building metrics.

Primary metrics:
- Weekly completion rate (soft)
- Total time moving (minutes/week)
- Consistency score (non-punitive)
- “Wins” (number of workouts completed, not streak resets)

No pace charts by default.

Optional:
- “View Details” expands history list.

---

## Tab 4: Settings
Sections:
- Profile & Preferences
  - days/week
  - max session duration
  - workout styles
  - push tolerance
  - missed workout preference
  - plan visibility default
- Notifications
  - on/off
  - frequency
  - tone (dry/encouraging)
- Apple Health & Watch
  - connect/disconnect
  - permissions status
  - last sync time
- Subscription
  - trial status
  - manage subscription
- Legal
  - privacy policy
  - terms

---

## System Screens
- Paywall (trial → subscription)
- Manage Subscription (App Store deep link)
- Error / Offline states
- Data export (future)

---

## UX Copy Rules
Allowed tone:
- Dry realism + encouraging
Never:
- Shame language
- “You failed”
- “You missed again”
