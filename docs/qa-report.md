# QA report

Date: 2026-11-19  
App: Roomline (`ai-tutoring-concierge`)  
Site under test: application code on `main` at `5c6c6e14`. This checkout’s `src/` matches that commit. Served with `next start` on `http://127.0.0.1:3000` (Next.js 16.3.5).  
Browser: Chrome headless at 1280×900 and 390×844.  
Mode: demo cookie session. `NEXT_PUBLIC_SUPABASE_URL`, the publishable key, and the secret are unset, so live auth and messaging could not be executed.

This pass used `riley.chen.qa191119t1400@example.com` (typed name Riley Chen), `tutor.qa191119t1400@example.com`, `chooser.qa191119t1400@example.com`, `narrow.qa191119t1400@example.com`, `short.qa191119t1400@example.com`, `offsite.qa191119t1400.0` through `offsite.qa191119t1400.9@example.com`, and `sarah@roomline.com`.

Pull request #1 is still open at `2b9de32` on `cursor/website-qa-audit-4c9f`. This pass did not boot that branch. Its forgot-password file is the same blob as `main` (`902f5789eeef65a4c7b7270fc633abb1e8bd1c55`). Message on a student is an anchor to `/tutor/messages` with no conversation id. `safeInternalPath` in that commit rejects a value that does not start with `/`, starts with `//`, contains `\`, or resolves to another origin. That was read from the helper, not run in the browser.

**Release decision: Hold.** See [release-decision.md](./release-decision.md).

## Checks run

| Check | Result on `5c6c6e14` |
| --- | --- |
| `npm run lint` | Pass |
| `npm test` | No test script (`Missing script: "test"`, exit 1). No test files in this tree. |
| Typecheck | Pass. `npx tsc --noEmit` after `next build` generated types. No `typecheck` script. |
| `npm run build` | Pass. Warning: `middleware` is deprecated in favor of `proxy`. |
| Browser, desktop 1280×900 and mobile 390×844 | Public pages, auth, both workspaces, messaging, empty states, and narrow layout |
| Supabase sign-in, email confirmation, password-reset delivery, live send/read | Not run. No project credentials. |

Pages checked for script errors (`/`, `/student/room`, `/tutor/payments`, `/tutor/messages`) logged none. `/tutor/students/does-not-exist` stayed on that URL, returned “404 / This page could not be found.”, and the console line was the 404 response itself.

## What works

- Public pages return 200: `/`, `/about`, `/pricing`, `/trust`, `/auth/login`, `/auth/register`, `/auth/forgot-password`.
- Desktop header links are About, Pricing, and Trust & FERPA. About has `mission`, `approach`, `careers`, and `contact`. Trust has `ferpa`, `coppa`, `privacy`, `terms`, `security`, `dpa`, `subprocessors`, and `status`. Home has `demo`.
- Pricing “Start free” and “Start 14-day trial” are `/tutor`. Signed out, `/tutor` is `307` to `/auth/login?next=%2Ftutor`. “Talk to us” is `/about#contact`.
- Every tutor and student route redirects a signed-out visitor to `/auth/login` and keeps the path in `next`. Curl recorded `307` for `/tutor`, `/student`, `/student/room`, and `/tutor/payments`.
- Login blocks an address without `@` in the browser (“Please include an '@' in the email address. 'not-an-email' is missing an '@'.”). With browser validation turned off, the server returns `/auth/login?error=email` (`x-action-redirect: /auth/login?error=email;push`) and “Enter a valid email address to continue.”
- Register rejects `short7` with `/auth/register?error=password` and “Use a password of at least 8 characters.” `eightchr` is accepted and opens the student room (`x-action-redirect: /student/room;push`).
- Choosing a workspace sets the role. A student who opens `/tutor/payments` returns to `/student/room`. A tutor who opens `/student/room` returns to `/tutor`. `/student` for a signed-in student ends at `/student/room`.
- Sign out from the desktop student room returns to `/`. The next visit to `/tutor` asks for sign-in again (`/auth/login?next=%2Ftutor`).
- `/tutor/students/does-not-exist` renders the 404 page for a signed-in tutor and the address stays on that path.
- Michael Tran’s detail shows “No assessments yet”, “Trial completed”, “Not scheduled”, and “Assignments 0/0”.
- `https://example.com` and `javascript:alert(1)` as `next` stay on `/auth/continue`. The action redirect for both is `/auth/continue;push`. No script dialog opened.
- A `next` value that is still the characters `%2f%2f` after one decode (`/auth/login?next=%252f%252fexample.com`) stays on `/auth/continue`. `/auth/login?next=/%252f%252fexample.com` stays on this host at `/%2f%2fexample.com` and the heading is “404”.
- At 390px the home page does not overflow (`scrollWidth` 390). The tutor week grid is the `min-w-[720px]` block, 720px wide, inside an `overflow-x-auto` region, and the page `scrollWidth` stays 390.
- Demo sending is disabled. The student page says “Sending is disabled until live messaging is connected.” The tutor thread says “Sending is disabled in demo mode.” Message tutor on the student room is a link, and clicking it opens `/student/messages`.

## Open findings

### QA-1 — Password reset does not send anything

- Severity: **High**
- Status: Open on main. The pull request #1 file is the same blob as main.
- Area: Authentication
- Files: `src/app/auth/forgot-password/page.tsx`

Reproduction:

1. Open `/auth/forgot-password`.
2. Enter `sarah@roomline.com`.
3. Submit with the button, and again with Enter.

Expected: The app requests a reset email, or it says reset email is unavailable in this mode. The address is not left in the URL.

Actual: Both the button and Enter navigate to `/auth/forgot-password?email=sarah%40roomline.com`. The same form remains, still saying “We'll email a reset link that expires in 30 minutes.” No email is requested. An address without `@` fails browser validation (`checkValidity()` is false) and stays on the form.

Recommended fix: Call Supabase `resetPasswordForEmail` when Supabase is configured, and show one generic confirmation. When it is not configured, say demo mode cannot send email and do not put the address in the query string.

### QA-11 — Sign-in `next` can leave the site

- Severity: **High**
- Status: Open on main. The safe-path helper is only on pull request #1, and that branch was not booted this pass.
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/app/auth/callback/route.ts`

Reproduction:

1. Open `/auth/login?next=//example.com`.
2. Sign in with any email and a non-empty password.
3. Repeat with the other query strings in the table. Use the query string as written. Do not encode it a second time.

Expected: The person stays on this site, on the workspace chooser.

Actual: `next.startsWith("/")` treats these values as internal. Chrome finished on `https://example.com/`.

| `next` query, as opened | Hidden field | `x-action-redirect` | Browser |
| --- | --- | --- | --- |
| `//example.com` | `//example.com` | `//example.com;push` | `https://example.com/` |
| `///example.com` | `///example.com` | `///example.com;push` | `https://example.com/` |
| `/%2f%2fexample.com` | `///example.com` | `///example.com;push` | `https://example.com/` |
| `%2f%2fexample.com` and `%2F%2Fexample.com` | `//example.com` | `//example.com;push` | `https://example.com/` |
| `/\example.com` | `/\example.com` | `/\example.com;push` | `https://example.com/` |

`https://example.com` and `javascript:alert(1)` stay on `/auth/continue`.

Recommended fix: Use the path check already on pull request #1 (`src/lib/safe-path.ts`). Its source already rejects `//`, `\`, and another origin. Do not write a second copy.

### QA-12 — A workspace return path renders the chooser on the protected URL

- Severity: **High**
- Status: Open on main. The chooser redirect is only on pull request #1.
- Area: Authentication
- Files: `src/app/auth/actions.ts`

Reproduction:

1. Open `/auth/login?next=/tutor/payments` with no session.
2. Sign in with `chooser.qa191119t1400@example.com` and any password.

Expected: The chooser URL is `/auth/continue?next=%2Ftutor%2Fpayments`. Choosing Tutor opens payments.

Actual: The action redirect is `/tutor/payments;push`. The address bar stays `/tutor/payments` while the heading is “Choose your workspace”. Both hidden `next` fields say `/tutor/payments`. A reload moves to `/auth/continue?next=%2Ftutor%2Fpayments`. Choosing Tutor after that reload opens `/tutor/payments` with the heading “Payments”.

Recommended fix: Land the chooser with `continueTarget` from pull request #1.

### QA-13 — Auth callback on 127.0.0.1 sends the browser to localhost

- Severity: **High**
- Status: Open on main for the error path. The success path is untested. Pull request #1 changes this route and was not booted this pass.
- Area: Authentication
- Files: `src/app/auth/callback/route.ts`

Reproduction:

1. Request `http://127.0.0.1:3000/auth/callback` and do not follow redirects.
2. Repeat with `Host: evil.example`.
3. Repeat both with `?code=not-a-real-code&next=//example.com`.

Expected: The redirect stays on the host the browser used. A foreign Host is not followed.

Actual: All four responses are `307` with `location: http://localhost:3000/auth/login?error=auth`. The foreign Host is not followed, and the off-site `next` is not used, because there is no Supabase config and no real code. This is the wrong loopback host, not an open redirect. A real email-code exchange was not available.

Recommended fix: Keep the `publicOrigin` helper from pull request #1. Retest a real code exchange once credentials exist.

### QA-2 — Primary tutor and student actions do nothing

- Severity: **High**
- Status: Open on main and in the pull request #1 diff.
- Area: Student sessions, assignments, and room. Tutor students, calendar, assignments, messages, and payments.
- Files: `src/app/student/room/page.tsx`, `src/app/student/sessions/page.tsx`, `src/app/student/assignments/page.tsx`, `src/app/tutor/page.tsx`, `src/app/tutor/students/page.tsx`, `src/app/tutor/students/[id]/page.tsx`, `src/app/tutor/calendar/page.tsx`, `src/app/tutor/assignments/page.tsx`, `src/app/tutor/messages/page.tsx`, `src/app/tutor/payments/page.tsx`

Reproduction:

1. Sign in and open the student workspace.
2. Choose “Join session” on `/student/sessions` and “Start assignment” on `/student/assignments`.
3. As a tutor, choose “Approve”, “New session”, “Approve grade”, “New message”, “New package”, and the roster “Add student”.

Expected: Each control starts that task, or it is clearly unavailable.

Actual: These controls are `<span>` elements. The URL does not change. Measured this pass: Join session stayed on `/student/room` and on `/student/sessions`, Start assignment stayed on `/student/assignments`, Book a session stayed on `/student/sessions`, Request reschedule is a span on `/student/sessions`, Approve stayed on `/tutor`, New session and Edit availability stayed on `/tutor/calendar`, Approve grade, New assignment, and Generate with AI stayed on `/tutor/assignments`, New message and Compose email stayed on `/tutor/messages`, New package and Export CSV stayed on `/tutor/payments`, and the roster Add student and Import stayed on `/tutor/students`. The dashboard “Add student” control is different: it is a link to `/tutor/students`, and clicking it opens the roster. It does not add a student. Message tutor on the student room does navigate to `/student/messages`. Start session on Michael Tran’s detail is also a span and stays on that page.

Recommended fix: Wire the smallest real action, or render the control disabled with a short reason.

### QA-3 — The signed-in student still sees Emma Reyes’s room

- Severity: **High**
- Status: Open on main and in the pull request #1 diff.
- Area: Student room, sessions, assignments, and progress
- Files: `src/app/student/room/page.tsx`, `src/app/student/sessions/page.tsx`, `src/app/student/assignments/page.tsx`, `src/app/student/progress/page.tsx`, `src/lib/data.ts`

Reproduction:

1. Register as a student named Riley Chen with a new email.
2. Open `/student/room`, `/student/sessions`, `/student/assignments`, and `/student/progress`.

Expected: Those pages belong to the signed-in student, or they say the content is sample data.

Actual: Registering `riley.chen.qa191119t1400@example.com` as Riley Chen opened `/student/room`. The shell shows “Riley Chen Qa191119t1400”. The room subtitle is “Algebra II with Sarah Wilson”, with mastery 68% and attendance 96%. Sessions lists “Today, 4:00 PM” for factoring. Progress says overall mastery 68% and focus area Factoring. The room, sessions, assignments, and progress pages do not say the content is sample data. Messages does say “(demo)”. Tutor roster, calendar, assignments, and payments are the same static records for `tutor.qa191119t1400@example.com`.

Recommended fix: Drive the pages from the signed-in profile, or label every block as sample data.

### QA-4 — Live Supabase auth and messaging are unproven

- Severity: **High**
- Status: Open. Code review only. Not a runtime result.
- Area: Authentication, messaging, Supabase
- Files: `supabase/migrations/001_profiles_and_messaging.sql`, `src/lib/messaging.ts`, `src/app/messages/actions.ts`, `src/lib/personas.ts`

What was not tested: password sign-in against Supabase, email confirmation, a successful `/auth/callback` code exchange, and a message the other account can read.

Code review on this tree:

- `profiles` allows each user to select only their own row (`auth.uid() = id`). Tutor and student conversation queries still select the other person’s `full_name` with the user client, so those reads fail closed and the UI falls back to “Student” or “Your tutor”.
- `listConversationsForTutor` always sets `unread` to 0.
- `sendMessage` logs an insert error and returns without telling the user.
- `ensureDemoEnrollment()` builds an admin client whenever the public keys are set. A missing secret throws from `getSupabaseSecretKey()` after a successful password check. Pull request #1 returns before creating that client when the secret is absent. That guard was not runtime-tested.

Recommended fix: Add a select policy so an enrollment member can read the other member’s display name. Surface send failures in the composer. Keep the secret-key guard. Retest with a real project.

### QA-15 — Narrow screens cannot sign out of a workspace

- Severity: **High**
- Status: Open on main. The shell change is only on pull request #1.
- Area: Student and tutor workspaces, mobile
- Files: `src/components/workspace-shell.tsx`

Reproduction:

1. Sign in, choose a workspace, and set the viewport to 390×844.
2. Look for Sign out and Switch workspace.

Expected: Both are on screen.

Actual: The account block’s class is `hidden ... lg:block`. The Sign out button’s box is 0×0 on the student room (`narrow.qa191119t1400@example.com`) and on the tutor dashboard. Switch workspace is in that same block and is also hidden. At 1280px, Sign out is 63×26 and returns home.

Recommended fix: Land the shell change from pull request #1.

### QA-10 — Message on a student does not open that student

- Severity: **Medium**
- Status: Open on main. Still incomplete on pull request #1.
- Area: Tutor student detail, messaging
- Files: `src/app/tutor/students/[id]/page.tsx`, `src/app/tutor/messages/page.tsx`

Reproduction:

1. Sign in as a tutor and open `/tutor/students/michael-tran`.
2. Choose Message.
3. On `/tutor/messages`, choose Monica Keller.

Expected: Message opens Michael’s thread. Choosing Monica opens her thread.

Actual: On main, Message is a `<span>`. The click stays on `/tutor/students/michael-tran`. Inbox rows are not links. Clicking Monica Keller leaves the URL at `/tutor/messages`. The open panel still shows Emma Reyes and “I got stuck on question 4 of the factoring set.” Monica’s name remains in the list. On pull request #1, the file makes Message a link to `/tutor/messages` with no conversation id.

Recommended fix: Point Message at that student’s conversation. Do not stop at `/tutor/messages`.

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

Actual: The different password opens “Choose your workspace” for `sarah@roomline.com`. The action redirect is `/auth/continue;push`. The server action does not read the password in demo mode. The form is prefilled with `demo-password`. The chooser does not say the password was skipped.

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

Actual: The header nav computes to `display: none` below `md`. Sign in and Get started stay visible. About remains in the footer. The home page does not overflow (`scrollWidth` 390, `clientWidth` 390).

Recommended fix: Add a compact menu for the three header links below `md`.

### QA-7 — Student search and roster filters do not change the list

- Severity: **Medium**
- Status: Open
- Area: Tutor students
- Files: `src/app/tutor/students/page.tsx`

Reproduction:

1. Open `/tutor/students`.
2. Type `zzzz-no-match` into “Search students, subjects, notes”.
3. Choose Needs focus.

Expected: The roster narrows, or the controls are marked unavailable.

Actual: The search field’s value is `zzzz-no-match`, and Emma Reyes, Ava Mitchell, James Keller, Noah Patel, and Michael Tran stay on screen. Needs focus is a `<span>`. The subtitle stays “5 students on your roster”.

Recommended fix: Filter `students` from the query, or remove the controls until search exists.

### QA-8 — Sample records disagree about the same student

- Severity: **Medium**
- Status: Open
- Area: Tutor dashboard, student detail, calendar, assignments, payments
- Files: `src/lib/data.ts`, `src/app/tutor/page.tsx`, `src/app/tutor/assignments/page.tsx`, `src/app/tutor/calendar/page.tsx`, `src/app/tutor/payments/page.tsx`

Confirmed on screen this pass:

- The dashboard date is Sunday, September 13. Emma Reyes is at 9:00 AM on Today’s schedule. The signed-in student’s sessions page says “Today, 4:00 PM”, and the week grid shows Emma at 16:00 on two days.
- Michael Tran is a “First session” today at 2:00 PM on the dashboard. His profile says “Trial completed” and “Not scheduled”.
- The dashboard says 18 active students. The roster says 5.
- Awaiting review is 9. The assignments page says 2 need grading. The visible table includes one “Needs grading” row (Ava Mitchell) and the page says “5 items”. The queue also lists Noah Patel. The other captured table statuses include Assigned (Emma Reyes) and Overdue (James Keller).
- Assignments says 4 active, “assigned and in progress”.
- Payments says $3,240 this month and a next payout of $1,755. The visible paid rows are $850, $40, $450, and $320, which total $1,660. Outstanding $190 matches the failed and refunded $95 rows.
- Calendar says 7 booked and 5 open blocks. The week grid shows Emma twice, Ava, James, Noah twice, and one Open block.

Expected: One schedule and one set of counts.

Actual: Headline numbers are hardcoded and do not match the lists under them.

Recommended fix: Derive the counts from the shared records, or stop showing a second conflicting number.

### QA-14 — Score history bars render at 0px

- Severity: **Medium**
- Status: Open on main. The progress layout change is only on pull request #1.
- Area: Student progress
- Files: `src/app/student/progress/page.tsx`

Reproduction:

1. Open `/student/progress` as a student.
2. Measure the four score bars.

Expected: The bars for 88, 72, 62, and 84 are visible.

Actual: Each bar has `height: 88%`, `72%`, `62%`, and `84%`, and a used height of 0px.

Recommended fix: Land the progress layout from pull request #1.

### QA-9 — Lower-severity notes

- Severity: **Low**
- Status: Open

- Register placeholder says “At least 12 characters” and the server accepts 8. File: `src/app/auth/register/page.tsx`.
- The name typed at registration is not the name in the shell. Registering “Riley Chen” as `riley.chen.qa191119t1400@example.com` showed “Riley Chen Qa191119t1400”. Demo sign-up stores `resolveUser(email)` and ignores the name field. File: `src/app/auth/actions.ts`.
- `/auth/continue?error=role` does not render an error. The page for `tutor.qa191119t1400@example.com` showed the chooser and no error sentence. File: `src/app/auth/continue/page.tsx`.
- `next build` warns that `src/middleware.ts` should move to the `proxy` convention. The signed-out redirects under test were correct.
- Workspace nav at 390px scrolls horizontally. Student nav `scrollWidth` 447 and `clientWidth` 390. The Messages link runs from x=352 to x=435. Tutor nav `scrollWidth` is 544 and `clientWidth` is 390. The Messages link runs from x=365 to x=448.
- Demo cookies `roomline_user` and `roomline_role` are not `httpOnly`. After choosing Tutor, `document.cookie` could read both. File: `src/app/auth/actions.ts`.
- Footer X, LinkedIn, and GitHub links point at `/`.

## Suggested engineering order

1. Land the pull request #1 fixes. Do not write a second copy. That diff covers the off-site `next` check (including the backslash form and the `/%2f%2f` form measured this pass), the chooser URL, the callback host, score bars, narrow sign-out, demo inbox row selection, and the missing-secret guard. This pass did not boot `2b9de32`.
2. QA-10, so Message opens the student who was clicked. On that diff the link still omits the conversation id.
3. QA-1 password reset, including the unconfigured-state message. Button and Enter both.
4. QA-4 profile read policy, visible send errors, and a two-account Supabase retest.
5. QA-3 signed-in student data, or an honest sample-data label.
6. QA-2 unwired actions, either implemented or disabled.
7. QA-5, QA-6, QA-7, QA-8, and QA-9 after the highs are closed.
