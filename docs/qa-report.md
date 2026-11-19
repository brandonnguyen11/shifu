# QA report

Date: 2026-11-19  
App: Roomline (`ai-tutoring-concierge`)  
Site under test: `main` at `5c6c6e14`, `next start` on `http://127.0.0.1:3000` (Next.js 16.3.5)  
Also retested: pull request #1 at `2b9de32`, `next start` on `http://127.0.0.1:3001`  
Mode: demo cookie session. Supabase URL, publishable key, and secret are unset, so live auth and messaging could not be executed.

**Release decision: Hold.** See [release-decision.md](./release-decision.md).

## Checks run

| Check | `main` (`5c6c6e14`) | Pull request #1 (`2b9de32`) |
| --- | --- | --- |
| `npm run lint` | Pass | Pass |
| `npm test` | No test script | Pass, 4 tests in `src/lib/safe-path.test.ts` |
| Typecheck | Pass after `next build` generated types (`tsc --noEmit`). No `typecheck` script. `tsc` before typegen fails on `PageProps` and `LayoutProps`. | Pass (`npm run typecheck`) |
| `npm run build` | Pass. Warning: `middleware` is deprecated in favor of `proxy`. | Pass, same warning |
| Browser, desktop 1280×900 and mobile 390×844 | Public pages, auth, both workspaces, messaging, empty states, and narrow layout | Focused retest of the patch: redirects, callback, password reset, Message, inbox row, score bars, narrow sign-out |
| Supabase sign-in, email confirmation, password-reset delivery, live send/read | Not run. No project credentials. | Not run |

Console errors on the pages visited were the expected 404s for an unknown student and for the encoded off-site path. No other page errors.

## What works on main

- Public pages return 200: `/`, `/about`, `/pricing`, `/trust`, `/auth/login`, `/auth/register`, `/auth/forgot-password`.
- Desktop header links reach About, Pricing, and Trust & FERPA. About, Trust, and the home demo section have their anchors. Pricing "Talk to us" is `/about#contact`.
- Pricing "Start free" follows `/tutor` and, signed out, lands on `/auth/login?next=%2Ftutor`.
- Every tutor and student route redirects a signed-out visitor to `/auth/login` and keeps the path in `next`.
- Login rejects an address without `@`. Register rejects a 7-character password and accepts 8.
- Choosing a workspace sets the role. A tutor who opens `/student/room` returns to `/tutor`. A student who opens `/tutor` or `/tutor/payments` returns to `/student/room`.
- Sign out returns to `/`. The next visit to `/tutor` asks for sign-in again.
- `/tutor/students/does-not-exist` renders the 404 page.
- Michael Tran's detail shows "No assessments yet" and "Nothing assigned yet".
- `https://example.com`, a backslash path, and `javascript:alert(1)` as `next` stay on `/auth/continue`.
- At 390px the home page does not overflow, and the tutor week grid scrolls inside its own box (`scrollWidth` 720, page `scrollWidth` 390).
- Demo sending is disabled. The student page has no composer and says sending is disabled.

## Pull request #1 retest

Still fixed on `2b9de32`:

- `next` values `//example.com`, `https://example.com`, `///example.com`, `/%2f%2fexample.com`, and `javascript:alert(1)` stay on `/auth/continue`. The browser does not request `example.com`.
- Sign-in with `next=/tutor/payments` opens `/auth/continue?next=%2Ftutor%2Fpayments`. Choosing Tutor opens `/tutor/payments`.
- `curl -sI http://127.0.0.1:3001/auth/callback` returns `location: http://127.0.0.1:3001/auth/login?error=auth`. `Host: evil.example` stays on `127.0.0.1`.
- Score-history bars measured 110, 90, 78, and 105px.
- At 390px, Sign out is on screen in the student room.
- Monica Keller's inbox row opens `/tutor/messages?c=monica` and her reschedule note. Emma's factoring thread is not left open.

Still broken on that head: password reset (QA-1) and Message on a student (QA-10). QA-2, QA-3, QA-4, QA-5, QA-6, QA-7, and QA-8 are unchanged because that patch does not touch them.

## Open findings

### QA-1 — Password reset does not send anything

- Severity: **High**
- Status: Open on main and on pull request #1
- Area: Authentication
- Files: `src/app/auth/forgot-password/page.tsx`

Reproduction:

1. Open `/auth/forgot-password`.
2. Enter `sarah@roomline.com`.
3. Submit with the button, and again with Enter.

Expected: The app requests a reset email, or it says reset email is unavailable in this mode. The address is not left in the URL.

Actual: Both the button and Enter navigate to `/auth/forgot-password?email=sarah%40roomline.com`. The same form remains, still saying "We'll email a reset link that expires in 30 minutes." No email is requested.

Recommended fix: Call Supabase `resetPasswordForEmail` when Supabase is configured, and show one generic confirmation. When it is not configured, say demo mode cannot send email and do not put the address in the query string.

### QA-11 — Sign-in `next` can leave the site

- Severity: **High**
- Status: Open on main. Fixed on pull request #1.
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/app/auth/callback/route.ts`

Reproduction:

1. Open `/auth/login?next=//example.com`.
2. Sign in with any email and a non-empty password.
3. Repeat with `/auth/login?next=///example.com` and `/auth/login?next=/%2f%2fexample.com`.

Expected: The person stays on this site, on the workspace chooser.

Actual: On main, the browser requests `http://example.com/` and then `https://example.com/`. The same happens for `///example.com` and for the `%2f%2f` form, which decodes into a protocol-relative URL. `next.startsWith("/")` treats those values as internal.

Recommended fix: Use the path check already on pull request #1 (`src/lib/safe-path.ts`). Do not write a second copy.

### QA-12 — A workspace return path renders the chooser on the protected URL

- Severity: **High**
- Status: Open on main. Fixed on pull request #1.
- Area: Authentication
- Files: `src/app/auth/actions.ts`

Reproduction:

1. Open `/auth/login?next=/tutor/payments` with no session.
2. Sign in with a new email and any password.

Expected: The chooser URL is `/auth/continue?next=%2Ftutor%2Fpayments`. Choosing Tutor opens payments.

Actual: On main, the address bar stays `/tutor/payments` while the page heading is "Choose your workspace". A reload then moves to `/auth/continue?next=%2Ftutor%2Fpayments`. On pull request #1 the chooser URL is correct before the click, and choosing Tutor opens payments.

Recommended fix: Land the chooser with `continueTarget` from pull request #1.

### QA-13 — Auth callback on 127.0.0.1 sends the browser to localhost

- Severity: **High**
- Status: Open on main for the error path. Fixed on pull request #1 for that path. The success path is untested on both.
- Area: Authentication
- Files: `src/app/auth/callback/route.ts`

Reproduction:

1. `curl -sI http://127.0.0.1:3000/auth/callback`
2. Repeat with `Host: evil.example`.

Expected: The redirect stays on the host the browser used. A foreign Host is not followed.

Actual: On main both responses use `location: http://localhost:3000/auth/login?error=auth`. The foreign Host is not followed, so this is the wrong loopback host, not an open redirect. On pull request #1 both stay on `http://127.0.0.1:3001`. A real email-code exchange was not available.

Recommended fix: Keep the `publicOrigin` helper from pull request #1. Retest a real code exchange once credentials exist.

### QA-2 — Primary tutor and student actions do nothing

- Severity: **High**
- Status: Open on main and on pull request #1
- Area: Student sessions, assignments, and room. Tutor students, calendar, assignments, messages, and payments.
- Files: `src/app/student/room/page.tsx`, `src/app/student/sessions/page.tsx`, `src/app/student/assignments/page.tsx`, `src/app/tutor/page.tsx`, `src/app/tutor/students/page.tsx`, `src/app/tutor/students/[id]/page.tsx`, `src/app/tutor/calendar/page.tsx`, `src/app/tutor/assignments/page.tsx`, `src/app/tutor/messages/page.tsx`, `src/app/tutor/payments/page.tsx`

Reproduction:

1. Sign in and open the student workspace.
2. Choose "Join session" on `/student/sessions` and "Start assignment" on `/student/assignments`.
3. As a tutor, choose "Approve", "New session", "Approve grade", "New message", "New package", and the roster "Add student".

Expected: Each control starts that task, or it is clearly unavailable.

Actual: These controls are `<span>` elements styled as buttons. The URL does not change. The dashboard "Add student" control is different: it is a link to `/tutor/students` and does not add a student.

Recommended fix: Wire the smallest real action, or render the control disabled with a short reason.

### QA-3 — The signed-in student still sees Emma Reyes's room

- Severity: **High**
- Status: Open on main and on pull request #1
- Area: Student room, sessions, assignments, and progress
- Files: `src/app/student/room/page.tsx`, `src/app/student/sessions/page.tsx`, `src/app/student/assignments/page.tsx`, `src/app/student/progress/page.tsx`, `src/lib/data.ts`

Reproduction:

1. Register as a student named Riley Chen with a new email.
2. Open `/student/room`, `/student/sessions`, `/student/assignments`, and `/student/progress`.

Expected: Those pages belong to the signed-in student, or they say the content is sample data.

Actual: The shell shows the signed-in account. The room is "Algebra II with Sarah Wilson", mastery 68%, attendance 96%, 12/14 assignments, and factoring work. Nothing says it is sample data. `/student` redirects to `/student/room`. Tutor roster, calendar, assignments, and payments are the same static records for every tutor.

Recommended fix: Drive the pages from the signed-in profile, or label every block as sample data.

### QA-4 — Live Supabase auth and messaging are unproven

- Severity: **High**
- Status: Open. Code review only. Not a runtime result.
- Area: Authentication, messaging, Supabase
- Files: `supabase/migrations/001_profiles_and_messaging.sql`, `src/lib/messaging.ts`, `src/app/messages/actions.ts`, `src/lib/personas.ts`

What was not tested: password sign-in against Supabase, email confirmation, a successful `/auth/callback` code exchange, and a message the other account can read.

Code review:

- `profiles` allows each user to select only their own row. Tutor and student conversation queries still select the other person's `full_name` with the user client, so those reads fail closed and the UI falls back to "Student" or "Your tutor".
- `listConversationsForTutor` always sets `unread` to 0.
- `sendMessage` logs an insert error and returns without telling the user.
- On main, `ensureDemoEnrollment()` builds an admin client whenever the public keys are set. A missing secret throws from `getSupabaseSecretKey()` after a successful password check. Pull request #1 returns before creating that client when the secret is absent. That guard was not runtime-tested.

Recommended fix: Add a select policy so an enrollment member can read the other member's display name. Surface send failures in the composer. Keep the secret-key guard. Retest with a real project.

### QA-15 — Narrow screens cannot sign out of a workspace

- Severity: **High**
- Status: Open on main. Fixed on pull request #1.
- Area: Student and tutor workspaces, mobile
- Files: `src/components/workspace-shell.tsx`

Reproduction:

1. Sign in, choose Student room, and set the viewport to 390×844.
2. Look for Sign out and Switch workspace.

Expected: Both are on screen.

Actual: On main the account block is `display: none` below `lg`. Sign out has no box. At 1280px, Sign out returns home. On pull request #1, Sign out is visible at 390px.

Recommended fix: Land the shell change from pull request #1.

### QA-10 — Message on a student does not open that student

- Severity: **Medium**
- Status: Open on main and on pull request #1
- Area: Tutor student detail, messaging
- Files: `src/app/tutor/students/[id]/page.tsx`, `src/app/tutor/messages/page.tsx`

Reproduction:

1. Sign in as a tutor and open `/tutor/students/michael-tran`.
2. Choose Message.
3. On `/tutor/messages`, choose Monica Keller.

Expected: Message opens Michael's thread. Choosing Monica opens her thread.

Actual: On main, Message is a `<span>`. The click stays on Michael's page. Inbox rows are not links, so the open thread stays Emma Reyes ("I got stuck on question 4 of the factoring set.") even after choosing Monica. On pull request #1, Message is a link to `/tutor/messages` with no conversation id, and the open thread is still Emma's. Monica's row on that head does open her thread.

Recommended fix: Point Message at that student's conversation. In demo data Michael's id is `michael`.

### QA-5 — Demo sign-in accepts any password

- Severity: **Medium**
- Status: Open
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/app/auth/login/page.tsx`

Reproduction:

1. With Supabase unset, open `/auth/login`.
2. Use `sarah@roomline.com` and replace the prefilled password with `wrong-password-xyz`.
3. Submit.

Expected: A real password check, or copy that this local mode does not use the password.

Actual: The different password opens the workspace chooser. The server action does not read the password in demo mode. The form is prefilled with `demo-password`.

Recommended fix: Keep the bypass only for local demo, and say that on the form.

### QA-6 — Public navigation is not in the header on a narrow screen

- Severity: **Medium**
- Status: Open
- Area: Public pages, mobile
- Files: `src/components/site-header.tsx`

Reproduction:

1. Open `/` at 390px width.
2. Look for About, Pricing, and Trust & FERPA in the header.

Expected: Those pages are reachable from the header.

Actual: The header nav computes to `display: none` below `md`. Sign in and Get started stay visible. About remains in the footer. The home page does not overflow (`scrollWidth` 390).

Recommended fix: Add a compact menu for the three header links below `md`.

### QA-7 — Student search and roster filters do not change the list

- Severity: **Medium**
- Status: Open
- Area: Tutor students
- Files: `src/app/tutor/students/page.tsx`

Reproduction:

1. Open `/tutor/students`.
2. Type `zzzz-no-match` into "Search students, subjects, notes".
3. Choose Needs focus.

Expected: The roster narrows, or the controls are marked unavailable.

Actual: Emma Reyes, Ava Mitchell, James Keller, Noah Patel, and Michael Tran stay on screen. The filter labels are spans.

Recommended fix: Filter `students` from the query, or remove the controls until search exists.

### QA-8 — Sample records disagree about the same student

- Severity: **Medium**
- Status: Open
- Area: Tutor dashboard, student detail, calendar, assignments, payments
- Files: `src/lib/data.ts`, `src/app/tutor/page.tsx`, `src/app/tutor/assignments/page.tsx`, `src/app/tutor/calendar/page.tsx`, `src/app/tutor/payments/page.tsx`

Confirmed on screen:

- The dashboard date is Sunday, September 13. Emma Reyes is at 9:00 AM on Today's schedule, at 4:00 PM on her profile and in the student room, and at 16:00 on Tuesday and Thursday in the week grid.
- Michael Tran is a "First session" today at 2:00 PM on the dashboard, and "Trial completed" with "Not scheduled" on his profile.
- The dashboard says 18 active students. The roster says 5.
- Awaiting review is 9. The assignments page says 2 need grading. The table has one "Needs grading" row. The queue also lists Noah Patel, whose table row is "In progress".
- Assignments says 4 active, "assigned and in progress". The table has one Assigned row and one In progress row.
- Payments says $3,240 this month and a next payout of $1,755. The paid rows are $850, $40, $450, and $320, which total $1,660. Outstanding $190 matches the failed and refunded $95 rows.
- Calendar says 7 booked and 5 open blocks. The week grid shows 6 student sessions and 1 open block.

Expected: One schedule and one set of counts.

Actual: Headline numbers are hardcoded and do not match the lists under them.

Recommended fix: Derive the counts from the shared records, or stop showing a second conflicting number.

### QA-14 — Score history bars render at 0px

- Severity: **Medium**
- Status: Open on main. Fixed on pull request #1.
- Area: Student progress
- Files: `src/app/student/progress/page.tsx`

Reproduction:

1. Open `/student/progress` as a student.
2. Measure the four score bars.

Expected: The bars for 88, 72, 62, and 84 are visible.

Actual: On main each bar has `height: 88%` (and 72, 62, 84) and a used height of 0px, because the percentage has no sized parent. On pull request #1 the same scores measure 110, 90, 78, and 105px.

Recommended fix: Land the progress layout from pull request #1.

### QA-9 — Lower-severity notes

- Severity: **Low**
- Status: Open

- Register placeholder says "At least 12 characters" and the server accepts 8. File: `src/app/auth/register/page.tsx`.
- The name typed at registration is not the name in the shell. Registering "Riley Chen" as `riley.follow.qa191119t1315@example.com` showed "Riley Follow Qa191119t1315". Demo sign-up stores `resolveUser(email)` and ignores the name field. File: `src/app/auth/actions.ts`.
- `/auth/continue?error=role` does not render an error. File: `src/app/auth/continue/page.tsx`.
- `next build` warns that `src/middleware.ts` should move to the `proxy` convention. The signed-out redirects under test were correct.
- Workspace nav at 390px scrolls horizontally. Student nav `scrollWidth` 447 and `clientWidth` 390. The Messages link runs from x=352 to x=435. Tutor nav `scrollWidth` is 544.
- Demo cookies `roomline_user` and `roomline_role` are not `httpOnly`. `document.cookie` can read them. File: `src/app/auth/actions.ts`.
- Footer X, LinkedIn, and GitHub links point at `/`.

## Suggested engineering order

1. Land the pull request #1 fixes that retested clean: QA-11, QA-12, QA-13, QA-14, QA-15, inbox row selection, and the missing-secret guard. Do not write a second copy.
2. QA-10, so Message opens the student who was clicked.
3. QA-1 password reset, including the unconfigured-state message. Button and Enter both.
4. QA-4 profile read policy, visible send errors, and a two-account Supabase retest.
5. QA-3 signed-in student data, or an honest sample-data label.
6. QA-2 unwired actions, either implemented or disabled.
7. QA-5, QA-6, QA-7, QA-8, and QA-9 after the highs are closed.
