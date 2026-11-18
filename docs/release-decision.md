# Release decision

**Hold**

Date: 2026-11-18  
Scope: full site retest of the current Roomline app, demo cookie mode. Evidence is in [qa-report.md](./qa-report.md).

## Why this is Hold

High-severity issues are still open, and the Supabase auth and messaging paths could not be executed here.

- Password reset submits and does nothing (QA-1).
- Join session, start assignment, grading, scheduling, and payment actions do not run. The roster's Add student control does nothing. The dashboard control labeled Add student only opens the roster (QA-2).
- The student room shows Emma Reyes's record for every signed-in student (QA-3).
- Live sign-in, email confirmation, and message delivery were not tested. The profiles policy still lets a user read only their own row (QA-4).

Medium issues are not the reason for Hold by themselves. That includes demo passwords, the hidden mobile header, search, conflicting sample numbers, and a new one from this retest: Message on a student opens Emma's thread (QA-10).

This is not Conditional. The open highs are core flows, and product has not accepted them.

## Retest of the earlier fixes

Still fixed: off-site `next` values stay on this site, a workspace return path survives the chooser, the auth callback on `127.0.0.1` stays on that host, score-history bars render, narrow screens can sign out, and the demo inbox opens the thread that was clicked.

The callback success path and the secret-key guard around demo enrollment were not runtime-tested. There are no Supabase credentials in this environment.

## Product call

Do not treat the prototype as ready. The next build slice is still password reset that either sends a Supabase recovery email or says that demo mode cannot send one. See [spec.md](./spec.md). Do not start a new product surface until QA-1 through QA-4 are fixed or explicitly accepted in this file.
