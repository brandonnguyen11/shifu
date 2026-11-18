# Release decision

**Hold**

Date: 2026-11-18  
Scope: full site audit of the current Roomline app. Evidence is in [qa-report.md](./qa-report.md).

## Why this is Hold

High-severity issues are still open, and the Supabase auth and messaging paths could not be executed here.

- Password reset submits and does nothing (QA-1).
- Join session, start assignment, add student, grading, scheduling, and payment actions do not run (QA-2).
- The student room shows Emma Reyes's record for every signed-in student (QA-3).
- Live sign-in, email confirmation, and message delivery were not tested. The profiles policy blocks each person from reading the other's name (QA-4).

Medium issues (demo passwords, hidden mobile header links, search, conflicting sample numbers) are not the reason for Hold by themselves.

This is not Conditional. The open highs are core flows, and product has not accepted them.

## Fixed and retested before this decision

Sign-in no longer follows a protocol-relative `next`. A workspace return path survives the chooser. The auth callback stays on the loopback host the browser used. Score-history bars render. Narrow screens can sign out and switch workspace. The demo inbox opens the selected thread.

## Product call

Do not treat the prototype as ready. The next build slice is password reset that either sends a Supabase recovery email or says that demo mode cannot send one. See [spec.md](./spec.md). Do not start a new product surface until QA-1 through QA-4 are fixed or explicitly accepted in this file.
