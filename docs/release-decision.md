# Release decision

**Hold**

Date: 2026-11-19  
Scope: full site retest of the current Roomline app, started from docs commit `dd06d97`. The application files match `5c6c6e14` and were exercised in demo cookie mode on `http://127.0.0.1:3000`. Pull request #1 at `2b9de32` was built and retested on `http://127.0.0.1:3001`. Evidence is in [qa-report.md](./qa-report.md).

## Why this is Hold

High-severity issues are open on this tree, and the Supabase auth and messaging paths could not be executed here.

- Password reset does not send email (QA-1). Clicking "Send reset link" for `sarah@roomline.com`, pressing Enter, and a native form submit all go to `/auth/forgot-password?email=sarah%40roomline.com` and still say a link will be emailed. The form has no method or action, so the browser submits GET. The same click path is still present on pull request #1.
- Join session, start assignment, grading, scheduling, and payment actions do not run. Join session on `/student/room` is a span and stays on that page. Approve on the dashboard is a span and stays on `/tutor`. The roster Add student control does nothing. The dashboard control labeled Add student only opens the roster (QA-2). Message tutor does open the student messages page.
- The student room shows Emma Reyes's record for every signed-in student (QA-3). A new student's shell name, Riley Chen Qa194801, and Emma's class record were on screen together. Mastery read 68%, and progress for that student showed Factoring with no sample-data label. A new tutor, Jordan Lee Qa194801, still saw Emma's roster, Michael Tran as First session, and the Sunday, September 13 dashboard. The cards on that dashboard read Sessions today 4, Active students 18, and Awaiting review 9. Registering `emma@roomline.com` with the typed name "Not Emma" showed Emma Reyes, and `sarah@roomline.com` with the typed name "Not Sarah" showed Sarah Wilson.
- Live sign-in, email confirmation, and message delivery were not tested. On this tree the profiles policy lets a user read only their own row, and a missing service secret can throw after a successful password check (QA-4).
- Sign-in with `next=//example.com` requested `http://example.com/` and landed on `https://example.com/`. `///example.com`, `/\example.com`, and `/%2f%2fexample.com` did the same. The last of those decodes the hidden field to `///example.com`. Submitting the workspace chooser with `next=//example.com` also left the site (QA-5).
- `/auth/callback` on `127.0.0.1` redirects to `http://localhost:3000/auth/login?error=auth` (QA-6). Curl with `Host: evil.example` also lands on `localhost`. `X-Forwarded-Host: evil.example` is not followed. With `X-Forwarded-Proto: https` the scheme becomes `https` and the host stays `localhost`.
- At 390px, Sign out and Switch workspace are hidden. On `/student/room` the Messages link runs past the viewport, from x=352, y=77, with width 83. On the tutor calendar it runs from x=365 with width 83, and Payments runs from x=452 with width 80 (QA-7).

Medium issues are recorded in the QA report. They include the demo inbox staying on Emma's thread, zero-height score bars, demo passwords, the hidden mobile header, search, conflicting sample numbers, and the chooser rendered at `/tutor/payments`. Those medium issues are not what sets Hold.

QA-16, demo registration showing a name built from the email, is low. The student messages page also labels Sarah Wilson "Online" on a demo thread. Neither is what sets Hold.

The open highs are core flows, and product has not accepted them. That keeps the decision at Hold.

## Pull request #1

That head is still `2b9de32`. This pass rebuilt it. `npm test` passed 4 safe-path tests, and the browser retest passed the off-site `next` values, the chooser submit, the callback host, the chooser URL, the score bars, narrow sign-out, and Monica's inbox row. Curl confirmed the callback: `127.0.0.1` stays on `127.0.0.1`, `Host: evil.example` goes to `localhost`, and a forwarded host is not used. The forwarded scheme becomes `https` and the host stays `127.0.0.1`. Message on a student still opened Emma's thread. Registering Riley Chen as `riley.chen.pr194801@example.com` showed "Riley Chen Pr194801". Jordan Lee as `jordan.lee.pr194801@example.com` showed "Jordan Lee Pr194801" and still saw Emma Reyes at 9:00 AM. Clicking Send reset link, pressing Enter, and a native submit still put the address in the query string. Merging it does not by itself make this app ready.

Still open after that merge: password reset, unwired actions, the sample student room, live messaging, the Message link on a student, demo passwords, mobile header navigation, roster search, conflicting counts, the typed registration name, and the narrow nav overflow.

## Product call

Do not treat the prototype as ready. Merge pull request #1. This pass retested that head, so do not write a second copy on this branch. After that merge, the next slice is password reset that either sends a Supabase recovery email or says that demo mode cannot send one. The button click and the Enter key both have to take that path. See [spec.md](./spec.md). Do not start a new product surface until QA-1 through QA-7 are fixed on the merged tree or explicitly accepted in this file.
