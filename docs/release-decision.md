# Release decision

**Hold**

Date: 2026-11-19  
Scope: full site retest of Roomline on `main` (`5c6c6e14`), demo cookie mode, plus a focused retest of pull request #1 (`2b9de32`). Evidence is in [qa-report.md](./qa-report.md).

## Why this is Hold

High-severity issues are still open on the current site, and the Supabase auth and messaging paths could not be executed here.

- Sign-in with `next=//example.com`, `///example.com`, or `/%2f%2fexample.com` leaves the site (QA-11).
- Sign-in with `next=/tutor/payments` draws the workspace chooser at `/tutor/payments` until a reload (QA-12).
- `/auth/callback` on `127.0.0.1` redirects to `localhost` (QA-13).
- Password reset submits and does nothing, including Enter (QA-1).
- Join session, start assignment, grading, scheduling, and payment actions do not run. The roster Add student control does nothing (QA-2).
- A newly registered student sees Emma Reyes's algebra room, with no sample-data label (QA-3).
- Below the `lg` breakpoint, Sign out and Switch workspace are not on screen (QA-15).
- Live sign-in, email confirmation, and message delivery were not tested. The profiles policy still lets a user read only their own row (QA-4).

Pull request #1 fixes QA-11, QA-12, QA-13's error path, QA-14, QA-15, demo inbox row selection, and the missing-secret guard. Those checks passed again on `2b9de32`. That head does not clear the hold: password reset, unwired actions, the sample student room, and live messaging are still open, and Message on a student still opens Emma's thread (QA-10).

This is not Conditional. The open highs are core flows, and product has not accepted them.

## Product call

Do not treat the prototype as ready. Land the retested fixes in pull request #1 before writing them again. The next product slice is still password reset that either sends a Supabase recovery email or says that demo mode cannot send one. See [spec.md](./spec.md). Do not start a new product surface until QA-1 through QA-4, QA-11, QA-12, QA-13, and QA-15 are fixed or explicitly accepted in this file.
