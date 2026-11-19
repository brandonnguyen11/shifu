# Spec: Password reset that tells the truth

Status: next slice. Start it after pull request #1 is merged.  
Source: QA-1 in `docs/qa-report.md`. The other high findings stay in `docs/backlog.md`.  
Retest: a pass on 2026-11-19, started from docs commit `f07b3a8`, reproduced the forgot-password form on application commit `5c6c6e14`. Clicking Send reset link, pressing Enter, and a native submit all put the address in the query string and show the same claim. That pass also reproduced the off-site `next` redirect, including `/%2f%2fexample.com` and the workspace chooser. Those values request `http://example.com/` and land on `https://example.com/`. Pull request #1 at `2b9de32` was rebuilt. Sign-in and the chooser stayed on this host. Curl kept that head's callback on `127.0.0.1`. `Host: evil.example` on that head still goes to `localhost`, and a forwarded host is not used. Clicking Send reset link, pressing Enter, and a native submit on that head still put the address in the query string. This slice stays unstarted on the current tree because that tree still sends `next=//example.com` off the site. The button click and the Enter key both have to reach the confirmation or the demo-mode message.

## User and goal

A person who already has a Roomline account and cannot sign in. They need a reset email when the service can send one, and a clear stop when it cannot.

## Primary flow

1. From sign-in, the person opens Forgot password.
2. They enter an email address and submit.
3. Configured Supabase: the app asks Supabase to send the recovery email and shows one confirmation. The confirmation does not say whether that address is registered.
4. Supabase is not configured: the app does not pretend to send mail. It says password reset email is unavailable in demo mode and points back to sign-in.
5. A bad email shows a validation error and does not claim a message was sent.

## Constraints

- Use Supabase Auth recovery. Do not add another email provider.
- Do not put the submitted email in the URL.
- Keep the confirmation generic so the form cannot be used to learn which addresses are registered.
- Merge pull request #1 first. A recovery link that comes back through `/auth/callback` has to stay on the host the person is using, and a `next` value cannot leave the site. That head passed the 2026-11-19 retest for those two bugs. Do not write a second copy of the helper.
- Do not build sessions, assignments, or payments in this slice.

## Acceptance criteria

- Submit on `/auth/forgot-password` with a valid email, by clicking the button or pressing Enter, never reloads the same silent form.
- With Supabase configured, a recovery email is requested and the page shows the generic confirmation.
- With Supabase unset, the page explains that demo mode cannot send email.
- An email without `@` shows an error and does not show the success confirmation.
- Sign-in still links to this page, and the page still links back to sign-in.
- The recovery redirect stays on the host the browser used.

## Out of scope

- Changing the password inside the app after the link is opened, beyond what Supabase's recovery redirect already does.
- Removing the demo-password bypass (QA-10).
- Replacing static student data (QA-3).

## Assumption

Unknown addresses get the same confirmation as known ones. That is safer than an account-exists error.
