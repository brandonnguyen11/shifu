# Release decision

**Hold**

Date: 2026-11-19  
Scope: full site retest of Roomline on `main` (`5c6c6e14`), demo cookie mode, served with `next start` on `http://127.0.0.1:3000`. Evidence is in [qa-report.md](./qa-report.md). Accounts included `riley.chen.qa191119t1354@example.com` and `tutor.qa191119t1354@example.com`.

## Why this is Hold

High-severity issues are still open on the current site, and the Supabase auth and messaging paths could not be executed here.

- Sign-in with `next=//example.com`, `///example.com`, `/%2f%2fexample.com`, `%2f%2fexample.com`, `%2F%2Fexample.com`, or `/\example.com` leaves the site. The action redirect was `//example.com;push`, `///example.com;push`, or `/\example.com;push`. Chrome finished on `https://example.com/` (QA-11).
- Sign-in with `next=/tutor/payments` draws the workspace chooser at `/tutor/payments` until a reload (QA-12).
- `/auth/callback` on `127.0.0.1` redirects to `http://localhost:3000/auth/login?error=auth`, including when `Host` is `evil.example` (QA-13).
- Password reset submits and does nothing, including Enter (QA-1). The forgot-password file on pull request #1 is the same blob as `main`.
- Join session, start assignment, grading, scheduling, and payment actions do not run. The roster Add student control does nothing (QA-2).
- A newly registered student sees Emma Reyes’s algebra room, with no sample-data label (QA-3).
- Below the `lg` breakpoint, the account block uses `hidden ... lg:block` and the Sign out box is 0×0 (QA-15).
- Live sign-in, email confirmation, and message delivery were not tested. The profiles policy still lets a user read only their own row (QA-4).

Pull request #1 remains `2b9de32`. This pass did not boot it. Its diff still leaves password reset, unwired actions, the sample student room, and live messaging open, and Message on a student still points at `/tutor/messages` with no conversation id (QA-10). The safe-path helper on that branch already rejects `//`, `\`, and another origin, but that was read from the source, not run in the browser. That patch is not enough to clear this hold.

The decision stays Hold. The open highs are core flows, and product has not accepted them.

## Product call

Do not treat the prototype as ready. Land the fixes already on pull request #1 before writing them again. The next product slice is still password reset that either sends a Supabase recovery email or says that demo mode cannot send one. See [spec.md](./spec.md). Do not start a new product surface until QA-1 through QA-4, QA-11, QA-12, QA-13, and QA-15 are fixed or explicitly accepted in this file.
