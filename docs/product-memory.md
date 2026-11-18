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
- 2026-11-18: Pull request #1 already patches the redirect, callback host, score bars, narrow sign-out, demo thread selection, and the missing-secret guard. That pull request is not merged. The default branch still has those bugs. Retest that head rather than starting a second implementation.
- 2026-11-18: A second full-site pass of application commit `5c6c6e14` reproduced QA-1 through QA-15. Release stays Hold. Password reset stays blocked until QA-5 and QA-6 are closed on the pull request #1 head.
- 2026-11-18: A later full-site pass, started from docs commit `dd2e6c6`, reproduced QA-1 through QA-15 on the same application commit and added QA-16 (demo registration ignores the typed name). Release stays Hold. Pull request #1 was still not the tree under test.
- 2026-11-18: Another full-site pass, started from docs commit `d5806e9`, reproduced QA-1 through QA-16 on application commit `5c6c6e14`. `next=/%2f%2fexample.com` also leaves the site. Release stays Hold.
- 2026-11-18: Pull request #1 head `2b9de32` was built and retested. Sign-in stays on this host, the callback on `127.0.0.1` stays on `127.0.0.1`, the chooser keeps a payments return path, score bars have height, sign-out is visible at 390px, and Monica's inbox row opens her thread. Password reset stays the next slice, and it starts after that pull request is merged. Message on a student still opens Emma's thread. The typed registration name is still dropped.
- 2026-11-18: A later full-site pass, started from docs commit `560c725`, reproduced QA-1 through QA-16 on application commit `5c6c6e14`. Choosing a workspace with `next=//example.com` also leaves the site. The same pass built pull request #1 at `2b9de32` again. That chooser submit stays on `/tutor`, and the other patch checks passed again. Release stays Hold.
- 2026-11-18: Another full-site pass, started from docs commit `8fffc1b`, reproduced QA-1 through QA-16 on application commit `5c6c6e14`. `next=//example.com`, `///example.com`, `/\example.com`, and `/%2f%2fexample.com` leave the site, including from the workspace chooser. `/auth/callback` on `127.0.0.1` still redirects to `localhost`. A foreign Host and `X-Forwarded-Host` are not followed. Pull request #1 at `2b9de32` was built and retested again. Redirects, the chooser submit, the callback host, the chooser URL, the score bars, narrow sign-out, and the Monica inbox row passed. Message on a student still opens Emma's thread. The typed registration name is still dropped. Release stays Hold.
- 2026-11-18: A later full-site pass, started from docs commit `a652a53`, reproduced QA-1 through QA-16 on application commit `5c6c6e14`. The same off-site `next` values leave the site, including from the workspace chooser, and `/auth/callback` on `127.0.0.1` still redirects to `localhost`. Pull request #1 is still `2b9de32` and was not rebuilt. The safe-path helper is still on that commit. Release stays Hold. Password reset stays behind that merge.
- 2026-11-18: A full-site pass, started from docs commit `42a30a7`, reproduced QA-1 through QA-16 on application commit `5c6c6e14`. The same off-site `next` values leave the site, including from the workspace chooser, and `/auth/callback` on `127.0.0.1` still redirects to `localhost`. This pass rebuilt pull request #1 at `2b9de32`. Sign-in stays on this host, the chooser submit stays on `/tutor`, the callback on `127.0.0.1` stays on `127.0.0.1`, the chooser keeps a payments return path, score bars have height, sign-out is visible at 390px, and Monica's inbox row opens her thread. `npm test` on that head passed 4 safe-path tests. Message on a student still opens Emma's thread. The typed registration name is still dropped. Release stays Hold. Password reset stays behind that merge.
- 2026-11-18: A full-site pass, started from docs commit `54cc6e33`, reproduced QA-1 through QA-16 on application commit `5c6c6e14`. The same off-site `next` values leave the site, including from the workspace chooser, and `/auth/callback` on `127.0.0.1` still redirects to `localhost`. This pass rebuilt pull request #1 at `2b9de32`. Sign-in stays on this host, the chooser submit stays on `/tutor`, the callback on `127.0.0.1` stays on `127.0.0.1`, the chooser keeps a payments return path, score bars have height, sign-out is visible at 390px, and Monica's inbox row opens her thread. `npm test` on that head passed 4 safe-path tests. Message on a student still opens Emma's thread. Registering Riley Chen as `riley.chen.qa41@example.com` showed "Riley Chen Qa41". Release stays Hold. Password reset stays behind that merge.
- Demo accounts named by the Supabase setup notes are `sarah@roomline.com` (tutor) and `emma@roomline.com` (student).

## Assumptions

- Local demo mode without Supabase keys is for development only. A deployed environment is expected to set Supabase and run `supabase/migrations/001_profiles_and_messaging.sql`.
- "Free for your first two students" and the FERPA, COPPA, and security pages are product copy. They are not evidence that those controls are implemented.
- Sample roster names, dates, and dollar amounts are fixtures. They must not be shown as if they were the signed-in person's records.

## Not decided

- Whether a parent gets a separate login.
- Whether session video, AI grading, and card payments are in the next build or stay as labeled prototypes.
- Who the production Supabase project belongs to. This audit had no project credentials.
