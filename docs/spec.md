# Spec: Password reset that tells the truth

Status: next product slice. Not started. The 2026-11-19 retest of `main` (accounts `*.qa191119t1434`) still shows QA-1 open. Button and Enter both leave the address in the query string. The forgot-password file on pull request #1 matches `main`.  
Source: QA-1 in `docs/qa-report.md`. The redirect and callback fixes already on pull request #1 are a separate patch and are not part of this slice.

## User and goal

A person who already has a Roomline account and cannot sign in. They need a reset email when the service can send one, and a clear stop when it cannot.

## Primary flow

1. From sign-in, the person opens Forgot password.
2. They enter an email address and submit. The button and the Enter key take the same path.
3. Configured Supabase: the app asks Supabase to send the recovery email and shows one confirmation: if an account exists, a reset link is on the way. The page does not say whether that address is registered.
4. Supabase is not configured: the app does not pretend to send mail. It says password reset email is unavailable in demo mode and points back to sign-in.
5. A bad email shows the existing validation error and does not claim a message was sent.

## Constraints

- Use Supabase Auth recovery. Do not add another email provider.
- Do not put the submitted email in the URL.
- Keep the confirmation generic so the form cannot be used to learn which addresses are registered.
- The reset link's return host must stay the host the person is using. The loopback handling in pull request #1 is the pattern.
- Do not build sessions, assignments, or payments in this slice.
- Do not reimplement the open-redirect, chooser, score-bar, or narrow sign-out fixes. Those already exist on pull request #1.

## Acceptance criteria

- Submit on `/auth/forgot-password` with a valid email, by button or Enter, never reloads the same silent form.
- With Supabase configured, a recovery email is requested and the page shows the generic confirmation.
- With Supabase unset, the page explains that demo mode cannot send email.
- An email without `@` shows an error and does not show the success confirmation.
- Sign-in still links to this page, and the page still links back to sign-in.

## Out of scope

- Changing the password inside the app after the link is opened, beyond what Supabase's recovery redirect already does.
- Removing the demo-password bypass (QA-5).
- Replacing static student data (QA-3).
- Pointing a student's Message action at that student's thread (QA-10). That is backlog work, not this slice.

## Assumption

Unknown addresses get the same confirmation as known ones. That is safer than an account-exists error.
