# Product memory

## What this product is

Roomline is a tutoring workspace for an independent tutor and that tutor's students. The marketing site describes one tutor workspace, one persistent room per student, and a record of sessions, assignments, progress, and payments.

The repo currently contains:

- Public pages: home, about, pricing, trust.
- A demo tutor workspace and a demo student room filled from `src/lib/data.ts`.
- Cookie sign-in used when Supabase is not configured.
- A Supabase schema for profiles, roles, enrollments, conversations, and messages. Live messaging is the only workspace feature that is written to talk to that database.

Parents are mentioned in copy and in one demo thread. There is no parent account.

## Decisions that should stick

- 2026-11-19: A full-site retest of `main` (`5c6c6e14`), demo mode, on `http://127.0.0.1:3000`, found the same open highs. Literal `next=//example.com`, `///example.com`, `/%2f%2fexample.com`, `%2f%2fexample.com`, `%2F%2Fexample.com`, and `/\example.com` still leave the site. The chooser for `next=/tutor/payments` still renders on `/tutor/payments` until reload. The week grid shows one “Open block” row against a stat of 5. Accounts included `riley.chen.qa191119t1434@example.com` and `tutor.qa191119t1434@example.com`. Pull request #1 is still `2b9de32` and was not booted. The site is not releasable. See `docs/release-decision.md`.
- 2026-11-19: A full-site retest of `main` (`5c6c6e14`), demo mode, on `http://127.0.0.1:3000`, found the same open highs. Literal `next=//example.com`, `///example.com`, `/%2f%2fexample.com`, `%2f%2fexample.com`, `%2F%2Fexample.com`, and `/\example.com` still leave the site. The chooser for `next=/tutor/payments` still renders on `/tutor/payments` until reload. Accounts included `riley.chen.qa191119t1426@example.com` and `tutor.qa191119t1426@example.com`. Pull request #1 is still `2b9de32` and was not booted. The site is not releasable. See `docs/release-decision.md`.
- 2026-11-19: A full-site retest of `main` (`5c6c6e14`), demo mode, on `http://127.0.0.1:3000`, found the same open highs. Literal `next=//example.com`, `///example.com`, `/%2f%2fexample.com`, `%2f%2fexample.com`, `%2F%2Fexample.com`, and `/\example.com` still leave the site. The chooser for `next=/tutor/payments` still renders on `/tutor/payments` until reload. Accounts included `riley.chen.qa191119t1419@example.com` and `tutor.qa191119t1419@example.com`. Pull request #1 is still `2b9de32` and was not booted. The site is not releasable. See `docs/release-decision.md`.
- 2026-11-19: A full-site retest of `main` (`5c6c6e14`), demo mode, on `http://127.0.0.1:3000`, found the same open highs. Literal `next=//example.com`, `///example.com`, `/%2f%2fexample.com`, `%2f%2fexample.com`, `%2F%2Fexample.com`, and `/\example.com` still leave the site. Accounts included `riley.chen.qa191119t1409@example.com` and `tutor.qa191119t1409@example.com`. Pull request #1 is still `2b9de32` and was not booted. The site is not releasable. See `docs/release-decision.md`.
- 2026-11-19: A full-site retest of `main` (`5c6c6e14`), demo mode, on `http://127.0.0.1:3000`, found the same open highs. Literal `next=//example.com`, `///example.com`, `/%2f%2fexample.com`, `%2f%2fexample.com`, `%2F%2Fexample.com`, and `/\example.com` still leave the site. Accounts included `riley.chen.qa191119t1400@example.com` and `tutor.qa191119t1400@example.com`. Pull request #1 is still `2b9de32` and was not booted. The site is not releasable. See `docs/release-decision.md`.
- 2026-11-19: A full-site retest of `main` (`5c6c6e14`), demo mode, on `http://127.0.0.1:3000`, found the same open highs. Literal `next=//example.com`, `///example.com`, `/%2f%2fexample.com`, `%2f%2fexample.com`, `%2F%2Fexample.com`, and `/\example.com` still leave the site. Accounts included `riley.chen.qa191119t1354@example.com` and `tutor.qa191119t1354@example.com`. Pull request #1 is still `2b9de32` and was not booted. The site is not releasable. See `docs/release-decision.md`.
- 2026-11-19: A full-site retest of `main` (`5c6c6e14`), demo mode, on `http://127.0.0.1:3000`, found the same open highs. Literal `next=/%2f%2fexample.com`, `%2f%2fexample.com`, and `%2F%2Fexample.com` still leave the site. Accounts included `riley.chen.qa191119t1343@example.com` and `tutor.qa191119t1343@example.com`. Pull request #1 is still `2b9de32` and was not booted. The site is not releasable. See `docs/release-decision.md`.
- 2026-11-19: A full-site retest of `main` (`5c6c6e14`), demo mode, on `http://127.0.0.1:3000`, found the same open highs. `next=/%2f%2fexample.com` still decodes to `///example.com` and leaves the site. Accounts included `riley.chen.qa191119t1336@example.com` and `tutor.qa191119t1336@example.com`. Pull request #1 is still `2b9de32` and was not booted. The site is not releasable. See `docs/release-decision.md`.
- 2026-11-19: A further full-site retest of `main` (`5c6c6e14`), demo mode, on `http://127.0.0.1:3000`, found the same open highs. `next=/\example.com` also left the site. Accounts included `riley.chen.qa191119t1330@example.com` and `tutor.qa191119t1330@example.com`. Pull request #1 is still `2b9de32` and was not booted. The site is not releasable. See `docs/release-decision.md`.
- 2026-11-19: A later full-site retest of `main` (`5c6c6e14`), demo mode, on `http://127.0.0.1:3000`, found the same open highs. Accounts included `riley.chen.qa191119t1418@example.com` and `tutor.qa191119t1418@example.com`. Pull request #1 is still `2b9de32` and was not booted again. The site is not releasable. See `docs/release-decision.md`.
- 2026-11-19: The site on `main` (`5c6c6e14`) is a prototype plus an auth and messaging foundation. It is not releasable. See `docs/release-decision.md`.
- 2026-11-19: Pull request #1 (`2b9de32`) is the patch for off-site sign-in redirects, the chooser URL, the loopback callback host, score bars, narrow sign-out, demo inbox row selection, and the missing-secret guard. QA retested that head and those checks passed. Do not write a second copy. Password reset and "Message this student" are still open on that head.
- 2026-11-19: Fix the open high-severity QA findings before adding a new product surface. After that patch, the next slice is password reset. See `docs/spec.md` and `docs/backlog.md`.
- Demo accounts named by the Supabase setup notes are `sarah@roomline.com` (tutor) and `emma@roomline.com` (student).

## Assumptions

- Local demo mode without Supabase keys is for development only. A deployed environment is expected to set Supabase and run `supabase/migrations/001_profiles_and_messaging.sql`.
- "Free for your first two students" and the FERPA, COPPA, and security pages are product copy. They are not evidence that those controls are implemented.
- Sample roster names, dates, and dollar amounts are fixtures. They must not be shown as if they were the signed-in person's records.

## Not decided

- Whether a parent gets a separate login.
- Whether session video, AI grading, and card payments are in the next build or stay as labeled prototypes.
- Who the production Supabase project belongs to. This audit had no project credentials.
