# Release decision

**Hold**

Date: 2026-11-18  
Scope: full site retest of the current Roomline app. The application commit is `5c6c6e14`, exercised from docs commit `dd2e6c6` in demo cookie mode. Evidence is in [qa-report.md](./qa-report.md).

## Why this is Hold

High-severity issues are open, and the Supabase auth and messaging paths could not be executed here. This pass reproduced the same highs as the earlier audits of this commit.

- Password reset submits and does nothing (QA-1). Submitting `sarah@roomline.com` only put the address in the query string. The form method is GET and no other request is sent.
- Join session, start assignment, grading, scheduling, and payment actions do not run. The roster Add student control does nothing. The dashboard control labeled Add student only opens the roster (QA-2). Message tutor does open the student messages page.
- The student room shows Emma Reyes's record for every signed-in student (QA-3). A new student's shell name and Emma's class record were on screen together.
- Live sign-in, email confirmation, and message delivery were not tested. The profiles policy lets a user read only their own row, and a missing service secret can throw after a successful password check (QA-4).
- Sign-in with `next=//example.com` left the site and opened `https://example.com/`. `///example.com` and `/\example.com` did the same (QA-5).
- `/auth/callback` on `127.0.0.1` redirects to `http://localhost:3000/auth/login?error=auth` (QA-6). A `Host: evil.example` request also lands on `localhost`.
- At 390px, Sign out and Switch workspace are hidden. On `/student/room` the Messages link runs past the viewport, from x=352 to x=435. On `/tutor` it runs from x=365 to x=448 (QA-7).

Medium issues are not the reason for Hold by themselves. That includes the demo inbox staying on Emma's thread, zero-height score bars, demo passwords, the hidden mobile header, search, conflicting sample numbers, and the chooser rendered at `/tutor/payments`.

QA-16, demo registration showing a name built from the email, is low and is not the reason for Hold.

This is not Conditional. The open highs are core flows, and product has not accepted them.

## What this pass did not retest

Pull request #1 is open and was not the tree under test. It still contains the redirect, callback host, score bar, narrow sign-out, demo thread, and missing-secret patches. Those bugs are still present on `5c6c6e14`. Merge that pull request only after those fixes are retested on its head.

## Product call

Do not treat the prototype as ready. Close QA-5 and QA-6 first, using the patch already in pull request #1 if that retest passes. The next unstarted slice is password reset that either sends a Supabase recovery email or says that demo mode cannot send one. See [spec.md](./spec.md). Do not start a new product surface until QA-1 through QA-7 are fixed or explicitly accepted in this file.
