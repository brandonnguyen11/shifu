# Product memory

## What this product is

Roomline is a tutoring workspace for an independent tutor and that tutor's students. The marketing site describes one tutor workspace, one persistent room per student, and a record of sessions, assignments, progress, and payments.

The repo currently contains:

- Public pages: home, about, pricing, trust.
- A demo tutor workspace and a demo student room filled from `src/lib/data.ts`.
- Cookie sign-in used when Supabase is not configured. Any password is accepted in that mode.
- A Supabase schema for profiles, roles, enrollments, conversations, and messages. Live messaging is the only workspace feature written to talk to that database.

Parents are mentioned in copy and in one demo thread. There is no parent account.

## Decisions that should stick

- 2026-11-18: The current site is a prototype plus an auth and messaging foundation. It is not releasable. See `docs/release-decision.md`.
- 2026-11-18: Fix the open high-severity QA findings before adding a new product surface. Sign-in must not follow a protocol-relative `next`, and the auth callback must stay on the browser's host, before password reset is built. See `docs/spec.md` and `docs/backlog.md`.
- 2026-11-18: Pull request #1 already patches the redirect, callback host, score bars, narrow sign-out, and demo thread selection. That pull request is not merged. The default branch still has those bugs. Retest that head rather than starting a second implementation.
- Demo accounts named by the Supabase setup notes are `sarah@roomline.com` (tutor) and `emma@roomline.com` (student).

## Assumptions

- Local demo mode without Supabase keys is for development only. A deployed environment is expected to set Supabase and run `supabase/migrations/001_profiles_and_messaging.sql`.
- "Free for your first two students" and the FERPA, COPPA, and security pages are product copy. They are not evidence that those controls are implemented.
- Sample roster names, dates, and dollar amounts are fixtures. They must not be shown as if they were the signed-in person's records.

## Not decided

- Whether a parent gets a separate login.
- Whether session video, AI grading, and card payments are in the next build or stay as labeled prototypes.
- Who the production Supabase project belongs to. This audit had no project credentials.
