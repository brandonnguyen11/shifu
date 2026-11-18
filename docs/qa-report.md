# QA report

Date: 2026-11-18  
App: Roomline (`ai-tutoring-concierge`)  
Build under test: local `next start` on `http://127.0.0.1:3000` after `next build` (Next.js 16.3.5)  
Mode: demo cookie session. Supabase URL, publishable key, and secret are unset, so live auth and messaging could not be executed.

This is a full retest of the baseline. The earlier fixes in this branch were exercised again. **Release decision: Hold.** See [release-decision.md](./release-decision.md).

## Checks run

| Check | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npm test` | Pass, 4 tests in `src/lib/safe-path.test.ts` |
| `npm run typecheck` | Pass (`next typegen` and `tsc --noEmit`) |
| `npm run build` | Pass. Warning: the `middleware` file convention is deprecated in favor of `proxy`. |
| Browser pass, desktop 1280×900 and mobile 390×844 | Done with headless Chrome. Public pages, auth, both workspaces, messaging, empty states, and narrow layout were exercised. No console errors on the pages visited, including the unknown-student 404. |
| Supabase sign-in, email confirmation, password-reset delivery, and live message send/read | Not run. This environment has no project credentials. |

## What works

- Public pages return 200 and render their headings: `/`, `/about`, `/pricing`, `/trust`, `/auth/login`, `/auth/register`, `/auth/forgot-password`.
- Desktop header links reach About, Pricing, and Trust & FERPA. In-page anchors on About, Trust, and the home demo section are present. Pricing "Talk to us" goes to `/about#contact`.
- Pricing "Start free" and "Start 14-day trial" send a signed-out visitor to `/auth/login?next=%2Ftutor`.
- Every tutor and student route, including `/student`, redirects a signed-out visitor to `/auth/login` and keeps the original path in `next`.
- Login rejects an address without `@`. Register rejects a password shorter than 8 characters and accepts 8.
- Registering as a student lands on `/student/room`, and the shell shows the name that was entered.
- Choosing a workspace sets the role. A tutor who opens `/student/room` is returned to `/tutor`. A student who opens `/tutor` or `/tutor/payments` is returned to `/student/room`. A return path for the other role is ignored.
- Sign out returns to `/` and the next visit to a workspace requires sign-in again.
- `/tutor/students/does-not-exist` renders the 404 page.
- Michael Tran's student detail shows "No assessments yet" and "Nothing assigned yet".
- Off-site `next` values stay on this site: `//example.com`, `https://example.com`, a backslash path, `///example.com`, `/%2f%2fexample.com`, and `javascript:alert(1)` all land on `/auth/continue`.
- `/tutor/payments` as `next` survives the chooser and opens payments after Tutor is chosen.
- `curl -sI http://127.0.0.1:3000/auth/callback` returns `location: http://127.0.0.1:3000/auth/login?error=auth`. A `Host: evil.example` request is not sent to that host. A successful email-code exchange was not available.
- Score-history bars on `/student/progress` measured 110, 90, 78, and 105px for scores 88, 72, 62, and 84.
- At 390px, Sign out and Switch workspace are on screen, and the home page does not overflow. The tutor calendar scrolls inside its grid (`overflow-x: auto`) instead of stretching the page.
- Opening Monica Keller in the demo inbox shows her reschedule message and not Emma's thread. Demo sending is disabled on both message pages, and the student composer is absent.

## Fixed in the previous pass, still fixed on this retest

| ID | Severity | Status | What was wrong | Retest |
| --- | --- | --- | --- | --- |
| QA-F1 | High | Fixed | `next=//example.com` on sign-in left the site. | Sign-in with that `next`, and the other off-site values above, stays on `/auth/continue`. |
| QA-F2 | High | Fixed | Sign-in with `next=/tutor/payments` left the chooser rendered at `/tutor/payments`. | The chooser URL is `/auth/continue?next=%2Ftutor%2Fpayments`. Choosing Tutor opens payments. |
| QA-F3 | High | Fixed | `/auth/callback` always redirected to `http://localhost:3000` when the browser used `http://127.0.0.1:3000`. | A direct request to `127.0.0.1` now stays on `127.0.0.1`. A foreign `Host` is not followed. The success path is still untested. |
| QA-F4 | Medium | Fixed | Student progress bars computed to 0px. | Bar heights were 110, 90, 78, and 105. |
| QA-F5 | High | Fixed | Below `lg`, Sign out and Switch workspace were hidden. | Both are visible at 390px on `/student/room`. Sign out still returns home. |
| QA-F6 | Medium | Fixed in part | Demo message rows were not links. | Clicking Monica Keller opens her thread. The student-detail Message link is a separate open finding (QA-10): it opens the inbox on Emma's thread. |
| QA-F7 | High | Fixed in code, not runtime-tested | `ensureDemoEnrollment()` built an admin client whenever the public keys were set, and a missing secret threw after a successful password check. | The function still returns before creating an admin client when the secret is absent. Needs a retest with a real project. |

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

Expected: The app requests a reset email, or it explains that reset email is unavailable in this mode. The address is not left in the URL, and the page does not claim a message was sent.

Actual: The form has no action. The browser navigates to `/auth/forgot-password?email=sarah%40roomline.com`. The same form is shown again, still saying "We'll email a reset link that expires in 30 minutes." No email is requested.

Recommended fix: Call Supabase `resetPasswordForEmail` when Supabase is configured, and show a generic confirmation. When it is not configured, say that demo mode cannot send email and do not put the address in the query string.

### QA-2 — Primary tutor and student actions do nothing

- Severity: **High**
- Status: Open
- Area: Student sessions, assignments, and room. Tutor students, calendar, assignments, messages, and payments.
- Files: `src/app/student/room/page.tsx`, `src/app/student/sessions/page.tsx`, `src/app/student/assignments/page.tsx`, `src/app/tutor/page.tsx`, `src/app/tutor/students/page.tsx`, `src/app/tutor/students/[id]/page.tsx`, `src/app/tutor/calendar/page.tsx`, `src/app/tutor/assignments/page.tsx`, `src/app/tutor/messages/page.tsx`, `src/app/tutor/payments/page.tsx`

Reproduction:

1. Sign in and open the student workspace.
2. Choose "Join session" on `/student/room` or `/student/sessions`.
3. Choose "Start assignment" on `/student/assignments`.
4. Open the tutor workspace and choose "Approve", "New session", "Approve grade", "New message", or "New package". On `/tutor/students`, choose "Add student".

Expected: Each control starts that task, or it is clearly unavailable.

Actual: These controls are styled as buttons and are `<span>` elements. Clicking "Join session" stays on `/student/sessions`. Clicking "New package" stays on `/tutor/payments`. The same pattern covers Import, New note, Start session, Edit availability, Generate with AI, Compose email, Export CSV, and Edit / Dismiss. Binder rows say "Open" and graded rows say "Review" without a destination.

The "Add student" control on the tutor dashboard is different: it is a link to `/tutor/students`. It does not add a student. The roster page then shows another "Add student" control that does nothing.

Recommended fix: Do not start new product behavior in this pass. Either wire the smallest real action or render the control disabled with a short reason. A control that looks active and does nothing is the defect.

### QA-3 — The signed-in student still sees Emma Reyes's room

- Severity: **High**
- Status: Open
- Area: Student dashboard, room, sessions, assignments, and progress
- Files: `src/app/student/room/page.tsx`, `src/app/student/sessions/page.tsx`, `src/app/student/assignments/page.tsx`, `src/app/student/progress/page.tsx`, `src/lib/data.ts`

Reproduction:

1. Register a new student, for example Riley Chen, and open `/student/room`.
2. Separately, sign in as `sarah@roomline.com`, choose Student room, and open the same pages.

Expected: The room, sessions, assignments, and progress belong to the signed-in student, or the page says the content is sample data for Emma Reyes.

Actual: The shell shows the signed-in name (Riley Chen or Sarah Wilson). The room is "Algebra II with Sarah Wilson", mastery 68%, and Emma's factoring work. Nothing on the page says it is sample data. Tutor roster, calendar, assignments, and payments are the same static records for every tutor account. `/student` redirects to `/student/room`; there is no separate student dashboard.

Recommended fix: Drive these pages from the signed-in profile, or label every block as sample data until that exists. Do not present Emma's record as the signed-in student's record.

### QA-4 — Live Supabase auth and messaging are unproven, and peer names are blocked by policy

- Severity: **High**
- Status: Open
- Area: Authentication, messaging, Supabase
- Files: `supabase/migrations/001_profiles_and_messaging.sql`, `src/lib/messaging.ts`, `src/app/messages/actions.ts`, `src/app/auth/actions.ts`

What was not tested: password sign-in against Supabase, email confirmation, a successful `/auth/callback` code exchange, and sending a message that the other account can read. Demo mode disables sending and says so on both message pages. The student page does not render a composer.

Code review on this retest, not a runtime result:

- `profiles` allows each user to select only their own row. `listConversationsForTutor` and `getStudentConversation` still select the other person's `full_name` with the user client. Those reads fail closed, so the UI falls back to "Student" or "Your tutor".
- `listConversationsForTutor` always sets `unread` to 0. There is no read receipt.
- `sendMessage` logs insert errors and returns without telling the user. The composer does not show a failure.
- A missing or failed `code` on `/auth/callback` returns to `/auth/login?error=auth`. The success path is untested.

Recommended fix: Add a select policy so an enrollment member can read the other member's display name. Surface send failures in the composer. Retest with `sarah@roomline.com` and `emma@roomline.com` after the SQL migration, including a real callback code.

### QA-5 — Demo sign-in accepts any password

- Severity: **Medium**
- Status: Open
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/app/auth/login/page.tsx`

Reproduction:

1. With Supabase unset, open `/auth/login`.
2. Keep `sarah@roomline.com`.
3. Replace the prefilled password with a different non-empty password and submit.

Expected: A real password check, or copy that this local mode does not use the password.

Actual: The different password signs the person in and opens the workspace chooser. The server action does not read the password in demo mode. The form is prefilled with `demo-password`, which will also be wrong once Supabase is configured unless that is the account's password.

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

Actual: The header nav computes to `display: none` below the `md` breakpoint. Sign in and Get started stay visible. About remains in the footer, so the pages are not fully unreachable. The home page does not overflow (`scrollWidth` 390).

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

Actual: Emma Reyes, Ava Mitchell, James Keller, Noah Patel, and Michael Tran all stay on screen. The filter labels are spans, not buttons.

Recommended fix: Filter `students` from the query, or remove the controls until search exists.

### QA-8 — Sample records disagree about the same student

- Severity: **Medium**
- Status: Open
- Area: Tutor dashboard, student detail, calendar, assignments, payments
- Files: `src/lib/data.ts`, `src/app/tutor/page.tsx`, `src/app/tutor/assignments/page.tsx`, `src/app/tutor/calendar/page.tsx`, `src/app/tutor/payments/page.tsx`

Examples confirmed on screen this retest:

- The dashboard date is Sunday, September 13. Emma Reyes is at 9:00 AM on Today's schedule, at 4:00 PM on her profile and in the student room, and at 16:00 on Tuesday and Thursday in the week grid.
- Michael Tran is a "First session" today at 2:00 PM on the dashboard, and "Trial completed" with "Not scheduled" on his profile.
- The dashboard says 18 active students. The roster has 5. The roster note on the dashboard repeats 18.
- Awaiting review is 9. The assignment table has one "Needs grading" row. The assignments page says 2 need grading, and its queue also lists Noah Patel's in-progress set.
- Assignments says 4 active, "assigned and in progress". The table has one Assigned row and one In progress row.
- Payments says $3,240 this month and a next payout of $1,755. The paid rows on the same page are $850, $40, $450, and $320, which total $1,660. Outstanding $190 matches the failed and refunded $95 rows, not the headline.
- Calendar says 7 booked and 5 open blocks. The week grid shows 6 student sessions and 1 open block.

Expected: One schedule and one set of counts.

Actual: Headline numbers are hardcoded and do not match the lists under them.

Recommended fix: Derive the counts from the shared records, or stop showing a second conflicting number.

### QA-10 — Message on a student opens Emma's thread

- Severity: **Medium**
- Status: Open
- Area: Tutor student detail, messaging
- Files: `src/app/tutor/students/[id]/page.tsx`, `src/app/tutor/messages/page.tsx`

Reproduction:

1. Sign in as a tutor and open `/tutor/students/michael-tran`.
2. Choose Message.

Expected: The open thread is Michael Tran's.

Actual: The browser goes to `/tutor/messages` with no conversation id. The open thread is Emma Reyes ("I got stuck on question 4 of the factoring set."). Michael's line is only a preview in the list. Clicking Monica Keller in that list does open her thread, so row selection works. Sending is disabled, so the wrong thread cannot be replied to yet.

Recommended fix: Point Message at that student's conversation. In demo data the id is `michael`, not the student id. Do not leave the default on Emma once live send is enabled.

### QA-9 — Lower-severity notes

- Severity: **Low**
- Status: Open

- Register says "At least 12 characters" and the server accepts 8. An 8-character password completed registration. File: `src/app/auth/register/page.tsx`.
- `/auth/continue?error=role` does not render an error. The chooser only says who is signed in. File: `src/app/auth/continue/page.tsx`.
- `next build` warns that `src/middleware.ts` should move to the `proxy` convention. The redirects under test were correct.
- Workspace nav at 390px scrolls horizontally. Student nav `scrollWidth` 447 and `clientWidth` 390; the Messages link runs from x=352 to x=435, past the viewport. Tutor nav `scrollWidth` is 544. Messages is present only after scrolling.
- Demo cookies `roomline_user` and `roomline_role` are not `httpOnly`. `document.cookie` can read the signed-in email and the role. File: `src/app/auth/actions.ts`. This is the demo session only.
- Footer X, LinkedIn, and GitHub links point at `/`.

## Suggested engineering order

1. QA-1 password reset, including the unconfigured-state message.
2. QA-4 profile read policy, visible send errors, and a two-account Supabase retest.
3. QA-3 signed-in student data, or an honest sample-data label.
4. QA-2 unwired actions, either implemented or disabled. The dashboard "Add student" link should not be described as an add action.
5. QA-10, so Message opens the student who was clicked before live send is turned on.
6. QA-5, QA-6, QA-7, and QA-8 after the highs are closed.
