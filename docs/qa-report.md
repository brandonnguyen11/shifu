# QA report

Date: 2026-11-18  
App: Roomline (`ai-tutoring-concierge`)  
Build under test: local `next start` on `http://127.0.0.1:3000` after `next build` (Next.js 16.3.5)  
Mode: demo cookie session. No `.env` file is present, so Supabase was not configured and live auth or messaging could not be executed.

**Release decision: Hold.** See [release-decision.md](./release-decision.md).

## Checks run

| Check | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npm test` | Pass, 4 tests in `src/lib/safe-path.test.ts` |
| `npm run build` | Pass. Warning: the `middleware` file convention is deprecated in favor of `proxy`. |
| `npx tsc --noEmit` after the build generated route types | Pass |
| Browser pass, desktop 1280×900 and mobile 390×844 | Done with headless Chrome. No page errors. The only console error was the expected 404 for an unknown student id. |
| Supabase sign-in, email confirmation, password-reset delivery, and live message send/read | Not run. There are no project credentials in this environment. |

There was no test script before this audit. The new tests cover redirect safety only.

## What works

- Public pages return 200 and render their headings: `/`, `/about`, `/pricing`, `/trust`, `/auth/login`, `/auth/register`, `/auth/forgot-password`.
- Desktop header links reach About, Pricing, and Trust & FERPA. In-page anchors `/about#careers` and `/trust#ferpa` render.
- Pricing "Start free" and "Start 14-day trial" send signed-out visitors to `/auth/login?next=%2Ftutor`. "Talk to us" goes to `/about#contact`.
- Every tutor and student route redirects a signed-out visitor to `/auth/login` and keeps the original path in `next`.
- Login rejects an address without `@`. Register rejects a password shorter than 8 characters.
- Registering as a student lands on `/student/room`, and the shell shows the name that was entered.
- Choosing a workspace sets the role. A tutor who opens `/student/room` is returned to `/tutor`. A student who opens `/tutor` is returned to `/student/room`.
- Sign out returns to `/` and the next visit to a workspace requires sign-in again.
- `/tutor/students/does-not-exist` renders the 404 page.
- Michael Tran's student detail shows the empty mastery state ("No assessments yet") and the empty assignment state.
- After the fixes below: protocol-relative `next` values stay on this site, a return path such as `/tutor/payments` survives the workspace chooser, the progress chart draws bars, narrow screens can sign out and switch workspace, and the demo inbox opens the thread that was clicked.

## Fixed in this audit

These were retested after the change.

| ID | Severity | Status | What was wrong | Retest |
| --- | --- | --- | --- | --- |
| QA-F1 | High | Fixed | `next=//example.com` on sign-in redirected the browser to `https://example.com/`. | Sign-in with that `next` now stays on `/auth/continue`. A real return path `/tutor/payments` opens the chooser and then the payments page. An off-site `Host` on `/auth/callback` is not followed. |
| QA-F2 | High | Fixed | Sign-in with `next=/tutor/payments` left the chooser rendered at `/tutor/payments`, so the address bar and the page disagreed. | The chooser URL is `/auth/continue?next=%2Ftutor%2Fpayments`. Choosing Tutor opens payments. |
| QA-F3 | High | Fixed | `/auth/callback` always redirected to `http://localhost:3000` even when the browser used `http://127.0.0.1:3000`. | `curl -sI http://127.0.0.1:3000/auth/callback` now returns `location: http://127.0.0.1:3000/auth/login?error=auth`. A successful email-code exchange was not available to retest. |
| QA-F4 | Medium | Fixed | Student progress "Score history" bars computed to 0px, so the chart was only labels. | Bar heights on the retest were 110, 90, 78, and 105 for scores 88, 72, 62, and 84. |
| QA-F5 | High | Fixed | Below the `lg` breakpoint the workspace hid Sign out and Switch workspace. | Both controls are visible at 390px on `/student/room` and sign-out still returns home. |
| QA-F6 | Medium | Fixed | Demo message rows were not links, so only Emma Reyes's thread could be read. Student detail "Message" did nothing. | Opening Monica Keller shows her reschedule message and not Emma's thread. "Message" on a student goes to `/tutor/messages`. |
| QA-F7 | High | Fixed in code, not runtime-tested | `ensureDemoEnrollment()` called the admin client whenever the public Supabase keys were set. A missing secret key throws, which would fail sign-in after a successful password check. | The function now returns before creating an admin client when the secret is absent. Needs a retest with a real project. |

## Open findings

### QA-1 — Password reset does not send anything

- Severity: **High**
- Status: Open
- Area: Authentication
- Files: `src/app/auth/forgot-password/page.tsx`

Reproduction:

1. Open `/auth/forgot-password`.
2. Enter `sarah@roomline.com`.
3. Submit "Send reset link".

Expected: The app requests a reset email, or it explains that reset email is unavailable in this mode. The address is not left sitting in the URL with no confirmation.

Actual: The form has no action. The browser navigates to `/auth/forgot-password?email=sarah%40roomline.com`. The same form is shown again. No email is requested.

Recommended fix: Call Supabase `resetPasswordForEmail` when Supabase is configured, and show a generic confirmation. When it is not configured, tell the user that demo mode cannot send email and do not put the address in the query string.

### QA-2 — Primary tutor and student actions do nothing

- Severity: **High**
- Status: Open
- Area: Student sessions, assignments, and room. Tutor students, calendar, assignments, messages, and payments.
- Files: `src/app/student/room/page.tsx`, `src/app/student/sessions/page.tsx`, `src/app/student/assignments/page.tsx`, `src/app/tutor/page.tsx`, `src/app/tutor/students/page.tsx`, `src/app/tutor/students/[id]/page.tsx`, `src/app/tutor/calendar/page.tsx`, `src/app/tutor/assignments/page.tsx`, `src/app/tutor/messages/page.tsx`, `src/app/tutor/payments/page.tsx`

Reproduction:

1. Sign in and open the student workspace.
2. Choose "Join session" on `/student/room` or `/student/sessions`.
3. Choose "Start assignment" on `/student/assignments`.
4. Switch to the tutor workspace and choose "Add student", "New session", "Approve grade", "New message", or "New package".

Expected: Each control starts that task, or it is clearly unavailable.

Actual: These controls are styled as buttons but are not buttons or links. The click does not navigate, submit, or explain why nothing happened. The same pattern covers Import, search filters, New note, Start session, Edit availability, Generate with AI, Compose email, Export CSV, and the dashboard Approve / Edit / Dismiss controls. Binder rows say "Open" and graded rows say "Review" without a destination.

Recommended fix: Do not start new product behavior in this pass. Either wire the smallest real action or render the control disabled with a short reason. A control that looks active and does nothing is the defect.

### QA-3 — The signed-in student still sees Emma Reyes's room

- Severity: **High**
- Status: Open
- Area: Student dashboard, room, sessions, assignments, and progress
- Files: `src/app/student/room/page.tsx`, `src/app/student/sessions/page.tsx`, `src/app/student/assignments/page.tsx`, `src/app/student/progress/page.tsx`, `src/lib/data.ts`

Reproduction:

1. Sign in as `sarah@roomline.com` and choose Student room.
2. Read the shell name and the room content.
3. Separately, register any other student name and open the same pages.

Expected: The room, sessions, assignments, and progress belong to the signed-in student, or the page says it is sample data for Emma Reyes.

Actual: The shell shows the signed-in name (Sarah Wilson, initials SW). The room is "Algebra II with Sarah Wilson", mastery 68%, and Emma's factoring work. Tutor roster, calendar, assignments, and payments are the same static records for every tutor account. `/student` only redirects to `/student/room`; there is no separate student dashboard.

Recommended fix: Drive these pages from the signed-in profile, or label every block as sample data until that exists. Do not present Emma's record as the signed-in student's record.

### QA-4 — Live Supabase auth and messaging are unproven, and peer names are blocked by policy

- Severity: **High**
- Status: Open
- Area: Authentication, messaging, Supabase
- Files: `supabase/migrations/001_profiles_and_messaging.sql`, `src/lib/messaging.ts`, `src/app/messages/actions.ts`, `src/app/auth/actions.ts`

What was not tested: password sign-in against Supabase, email confirmation, a successful `/auth/callback` code exchange, and sending a message that the other account can read. Demo mode disables sending and says so on both message pages.

Code review, not a runtime result:

- `profiles` allows each user to select only their own row. `listConversationsForTutor` and `getStudentConversation` still select the other person's `full_name` with the user client. Those reads fail closed, so the UI falls back to "Student" or "Your tutor".
- `listConversationsForTutor` always sets `unread` to 0. There is no read receipt.
- `sendMessage` logs insert errors and returns without telling the user. The composer does not show a failure.
- A missing or failed `code` on `/auth/callback` correctly returns to `/auth/login?error=auth`. The success path is untested.

Recommended fix: Add a select policy so an enrollment member can read the other member's display name. Surface send failures in the composer. Retest with `sarah@roomline.com` and `emma@roomline.com` after the SQL migration, including a real callback code.

### QA-5 — Demo sign-in accepts any password

- Severity: **Medium**
- Status: Open
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/app/auth/login/page.tsx`

Reproduction:

1. With Supabase unset, open `/auth/login`.
2. Keep `sarah@roomline.com`.
3. Enter a password other than the prefilled value and submit.

Expected: A real password check, or copy that this local mode does not use the password.

Actual: Any non-empty password signs the person in and opens the workspace chooser. The form is prefilled with `demo-password`, which will also be wrong once Supabase is configured unless that is the account's password.

Recommended fix: Keep the bypass only for local demo, and say that on the form. Do not ship this path as production authentication.

### QA-6 — Public navigation is not in the header on a narrow screen

- Severity: **Medium**
- Status: Open
- Area: Public pages, mobile
- Files: `src/components/site-header.tsx`

Reproduction:

1. Open `/` at 390px width.
2. Look for About, Pricing, and Trust & FERPA in the header.

Expected: Those pages are reachable without hunting through the footer.

Actual: The header nav is hidden below the `md` breakpoint. Sign in and Get started stay visible. About is still in the footer, so the pages are not fully unreachable. The home page and student room do not overflow the viewport. The tutor calendar scrolls inside its own region instead of stretching the page.

Recommended fix: Add a compact menu for the three header links below `md`.

### QA-7 — Student search and roster filters do not change the list

- Severity: **Medium**
- Status: Open
- Area: Tutor students
- Files: `src/app/tutor/students/page.tsx`

Reproduction:

1. Open `/tutor/students`.
2. Type `zzzz-no-match` into "Search students, subjects, notes".
3. Choose Needs focus, Trials, or Archived.

Expected: The roster narrows, or the controls are marked as not available.

Actual: All five students stay on screen. The filter labels are not buttons.

Recommended fix: Filter `students` from the query, or remove the controls until search exists.

### QA-8 — Sample records disagree about the same student

- Severity: **Medium**
- Status: Open
- Area: Tutor dashboard, student detail, calendar, assignments, payments
- Files: `src/lib/data.ts`, `src/app/tutor/page.tsx`, `src/app/tutor/assignments/page.tsx`, `src/app/tutor/calendar/page.tsx`, `src/app/tutor/payments/page.tsx`

Examples a user can see without leaving the product:

- Emma Reyes is at 9:00 AM on Today's schedule and at 4:00 PM on her profile and in the student room.
- Michael Tran is a "First session" today at 2:00 PM on the dashboard, and "Trial completed" with "Not scheduled" on his profile.
- The dashboard says 18 active students. The roster has 5.
- Assignments says 2 need grading. The assignment table has one "Needs grading" row. The queue also lists Noah Patel's in-progress set.
- Payments says $3,240 this month. The paid rows on the same page total $1,660.
- Calendar says 7 booked and 5 open blocks. The week grid shows 6 student sessions and 1 open block.

Expected: One schedule and one set of counts.

Actual: Headline numbers are hardcoded and do not match the lists under them.

Recommended fix: Derive the counts from the shared records, or stop showing a second conflicting number.

### QA-9 — Lower-severity notes

- Severity: **Low**
- Status: Open

- Register says "At least 12 characters" and the server accepts 8. File: `src/app/auth/register/page.tsx`.
- `/auth/continue?error=role` does not render the error. File: `src/app/auth/continue/page.tsx`.
- `next build` warns that `src/middleware.ts` should move to the `proxy` convention. Behavior under test was correct.
- Workspace nav at 390px scrolls horizontally (`scrollWidth` 447, `clientWidth` 390). Messages is present, but it starts off-screen.
- Footer X, LinkedIn, and GitHub links point at `/`.

## Suggested engineering order

1. QA-1 password reset, including the unconfigured-state message.
2. QA-4 profile read policy, visible send errors, and a two-account Supabase retest.
3. QA-3 signed-in student data, or an honest sample-data label.
4. QA-2 unwired actions, either implemented or disabled.
5. QA-5, QA-6, QA-7, and QA-8 after the highs are closed.
