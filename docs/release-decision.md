# Release decision

**Hold**

Date: 2026-11-18  
Scope: full site retest of the current Roomline app, plus a focused retest of the patch on pull request #1. The application commit on this branch is `5c6c6e14`, exercised from docs commit `d5806e9` in demo cookie mode. The patch retest used `2b9de32`. Evidence is in [qa-report.md](./qa-report.md).

## Why this is Hold

High-severity issues are open on this tree, and the Supabase auth and messaging paths could not be executed here.

- Password reset submits and does nothing (QA-1). Submitting `sarah@roomline.com` only put the address in the query string. The form method is GET and the only requests were GET.
- Join session, start assignment, grading, scheduling, and payment actions do not run. The roster Add student control does nothing. The dashboard control labeled Add student only opens the roster (QA-2). Message tutor does open the student messages page.
- The student room shows Emma Reyes's record for every signed-in student (QA-3). A new student's shell name and Emma's class record were on screen together.
- Live sign-in, email confirmation, and message delivery were not tested. On this tree the profiles policy lets a user read only their own row, and a missing service secret can throw after a successful password check (QA-4).
- Sign-in with `next=//example.com` left the site and opened `https://example.com/`. `///example.com`, `/\example.com`, and `/%2f%2fexample.com` did the same (QA-5).
- `/auth/callback` on `127.0.0.1` redirects to `http://localhost:3000/auth/login?error=auth` (QA-6). A `Host: evil.example` request also lands on `localhost`.
- At 390px, Sign out and Switch workspace are hidden. On `/student/room` the Messages link runs past the viewport, from x=352 to x=435. On `/tutor` it runs from x=365 to x=448 (QA-7).

Medium issues are not the reason for Hold by themselves. That includes the demo inbox staying on Emma's thread, zero-height score bars, demo passwords, the hidden mobile header, search, conflicting sample numbers, and the chooser rendered at `/tutor/payments`.

QA-16, demo registration showing a name built from the email, is low and is not the reason for Hold.

This is not Conditional. The open highs are core flows, and product has not accepted them.

## Pull request #1

That head was the patch to retest, and this pass did retest it. It is a different tree. Merging it does not by itself make this app ready.

Passed on `2b9de32`:

- Off-site `next` values stay on `/auth/continue`, including `//example.com` and `/%2f%2fexample.com`.
- `/auth/callback` on `127.0.0.1` stays on `127.0.0.1`. A foreign Host is not followed. The success path, after a real code exchange, is still untested.
- Sign-in with `next=/tutor/payments` opens the chooser at `/auth/continue?next=%2Ftutor%2Fpayments`, and choosing Tutor opens Payments.
- Score-history bars have height.
- Sign out and Switch workspace are on screen at 390px.
- Clicking Monica Keller opens her thread.
- The demo enrollment helper returns before it builds an admin client when the secret is missing. That was read in code, not run against a project.

Still open on that head: password reset, unwired actions, the sample student room, live messaging, the Message link on a student (it opens Emma's thread), demo passwords, mobile header navigation, roster search, conflicting counts, the typed registration name, and the narrow nav overflow.

## Product call

Do not treat the prototype as ready. Merge pull request #1. The retest passed for the patch it contains, so do not write a second copy on this branch. After that merge, the next slice is password reset that either sends a Supabase recovery email or says that demo mode cannot send one. See [spec.md](./spec.md). Do not start a new product surface until QA-1 through QA-7 are fixed on the merged tree or explicitly accepted in this file.
