# Subscription + Trial Gating (v1)

## Model
- Free trial → subscription
- Trial unlocks full experience
- Subscription required for ongoing adaptive value

## Trial Rules
- Trial starts after onboarding OR when first plan is generated (choose one in implementation; default = after plan generation)
- Trial length: configurable (e.g., 7 days)
- Trial status visible in Settings

## What’s Free (Post-trial)
- View existing plan (read-only)
- View workout history (read-only)
- Start/track workouts manually (optional; decide in implementation)
- Limited Plan view (Today + 7-day)

## What’s Paid (Subscription)
- Ongoing plan adaptation (weekly recalculation)
- Missed workout prompts + “reduce intensity” automation
- Plan regeneration beyond 1 per month (optional limiter, avoid dark patterns)
- Apple Watch advanced cues (optional; ensure base watch works if advertised)
- Advanced Progress insights (trend summaries)
- Full timeline editing tools

## Paywall Placement
Allowed:
- After onboarding + plan preview
- Before enabling adaptive features
- When user taps “Regenerate Plan” (if trial ended)

Avoid:
- Blocking onboarding completion without showing value
- Repeated modal spam

## Apple Compliance Notes
- Clear pricing and renewal terms
- Restore purchases supported
- Manage subscription link included
- No “trick” UI
