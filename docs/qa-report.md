# QA report

Date: 2026-11-18  
Commit under test: application commit `5c6c6e14`. This pass started from docs commit `8fffc1b`. The docs commits do not change the app.  
App: Roomline (`ai-tutoring-concierge`)  
Build: `next build`, then `next start` on `http://127.0.0.1:3000` (Next.js 16.3.5).  
Mode: demo cookie session. `NEXT_PUBLIC_SUPABASE_URL`, the publishable key, the anon key, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are unset, so live Supabase auth and messaging were not executed.

**Release decision: Hold.** See [release-decision.md](./release-decision.md).

This pass reproduced QA-1 through QA-16 on `5c6c6e14`. Sign-in with `next=//example.com` and `next=///example.com` finished on `https://example.com/`. `/\example.com` and `/%2f%2fexample.com` also sent the browser to `https://example.com/`. The workspace chooser follows `next=//example.com` off the site. Pull request [#1](https://github.com/brandonnguyen11/shifu/pull/1) at `2b9de32` was built and retested again. Its redirect, chooser submit, callback host, chooser URL, score bars, narrow sign-out, and demo inbox selection work. That patch is not in this tree.

## Checks run

| Check | Tree | Result |
| --- | --- | --- |
| `npm run lint` | `5c6c6e14` | Pass |
| `npx tsc --noEmit` before `next typegen` | `5c6c6e14` | Fail. `PageProps` and `LayoutProps` are missing until Next generates them. Five errors, in the auth pages, the root layout, and the student detail page. |
| `npx next typegen && npx tsc --noEmit` | `5c6c6e14` | Pass |
| `npm run build` | `5c6c6e14` | Pass. TypeScript step inside the build passed. Warning: the `middleware` file convention is deprecated in favor of `proxy`. |
| `npm test` | `5c6c6e14` | Not configured. `package.json` has no test script, and this tree has no test files. |
| Browser pass, desktop 1280×900 and mobile 390×844 | `5c6c6e14` | Done with headless Chrome. Public pages, demo auth, both workspaces, messaging, empty states, and the narrow layout were exercised. |
| Supabase sign-in, email confirmation, password-reset delivery, and a message sent by one account and read by the other | both | Not run. This environment has no project credentials. |
| `npm run lint`, `npm test`, `npm run build` | pull request #1 `2b9de32` | Pass. Four tests in `src/lib/safe-path.test.ts`. Build warns about the `middleware` convention. |
| Focused browser retest of the pull request #1 patch | `2b9de32` on `http://127.0.0.1:3001` | Redirects, chooser submit, chooser URL, score bars, narrow sign-out, and the Monica thread passed. The student-detail Message link and the typed registration name did not. |

## What works

- `/`, `/about`, `/pricing`, `/trust`, `/auth/login`, `/auth/register`, and `/auth/forgot-password` return 200 and render their headings.
- Desktop header links reach About, Pricing, and Trust & FERPA. About `#contact`, `#mission`, `#approach`, and `#careers`, Trust `#ferpa` and the other policy ids, and the home `#demo` section are present.
- Pricing "Start free" follows `/tutor` and middleware sends a signed-out visitor to `/auth/login?next=%2Ftutor`. "Talk to us" opens `/about#contact`.
- Every tutor and student route checked, including `/student`, redirects a signed-out visitor with `307` to `/auth/login` and keeps the original path in `next`. Confirmed from the `Location` header.
- Register rejects a 7-character password (`/auth/register?error=password`, copy says at least 8 characters) and accepts `12345678`.
- With the browser email check turned off, `not-an-email` reaches `/auth/login?error=email` and the copy "Enter a valid email address to continue."
- A new student account lands on `/student/room`. `/student` then redirects to `/student/room`. "Message tutor" opens `/student/messages`. "Switch workspace" opens `/auth/continue`.
- Choosing a workspace sets the role. A student who opens `/tutor` returns to `/student/room`. A tutor who opens `/student/room` returns to `/tutor`.
- Sign out on a desktop-width screen returns to `/`. The next visit to `/student/room` requires sign-in again, and the `roomline_` cookies are gone.
- A sign-in with no `next` opens the chooser at `/auth/continue`.
- `/tutor/students/does-not-exist` renders the 404 page.
- Michael Tran's detail shows "No assessments yet", "Nothing assigned yet", and "Not scheduled".
- Demo messaging says sending is disabled. The student page says "Sending is disabled until live messaging is connected." The tutor page says "Sending is disabled in demo mode."
- At 390px the home page, the tutor dashboard, the payments page, and the calendar page stay within the viewport (`scrollWidth` 390). The calendar week grid is 720px wide inside a horizontal scroller.
- `https://example.com` and `javascript:alert(1)` as `next` stay on this site and open the chooser. A value has to start with `/` before the redirect uses it.
- `/auth/callback` does not follow `Host: evil.example` or `X-Forwarded-Host: evil.example`. Both stay on localhost. See QA-6 for the loopback host bug and the forwarded scheme.

## Open findings

### QA-1 — Password reset does not send anything

- Severity: **High**
- Status: Open. Reproduced this pass. Still open on pull request #1. Submitting there also lands on `/auth/forgot-password?email=sarah%40roomline.com`.
- Area: Authentication
- Files: `src/app/auth/forgot-password/page.tsx`

Reproduction:

1. Open `/auth/forgot-password`.
2. Enter `sarah@roomline.com`.
3. Submit "Send reset link".

Expected: The app requests a reset email, or it explains that reset email is unavailable. The address is left out of the URL, and the page does not claim a message was sent.

Actual: The form has no method and no action. The browser navigates to `/auth/forgot-password?email=sarah%40roomline.com`. The new request was that GET, plus static assets. The same form is shown again, still saying "We'll email a reset link that expires in 30 minutes."

Recommended fix: Call Supabase `resetPasswordForEmail` when Supabase is configured, and show one generic confirmation. When it is not configured, say that demo mode cannot send email and keep the address out of the query string. Build that on the pull request #1 head after it merges. The recovery link uses the callback.

### QA-2 — Primary tutor and student actions do nothing

- Severity: **High**
- Status: Open. Reproduced this pass.
- Area: Student room, sessions, and assignments. Tutor dashboard, students, calendar, assignments, messages, and payments.
- Files: `src/app/student/room/page.tsx`, `src/app/student/sessions/page.tsx`, `src/app/student/assignments/page.tsx`, `src/app/tutor/page.tsx`, `src/app/tutor/students/page.tsx`, `src/app/tutor/students/[id]/page.tsx`, `src/app/tutor/calendar/page.tsx`, `src/app/tutor/assignments/page.tsx`, `src/app/tutor/messages/page.tsx`, `src/app/tutor/payments/page.tsx`

Reproduction:

1. Sign in as a student and open `/student/room`.
2. Choose "Join session". The control is a `<span>`. The URL stays `/student/room`.
3. Open `/student/assignments` and choose "Start assignment". The URL stays on that page.
4. Sign in as a tutor. Choose "Approve" on the dashboard, "Add student" on `/tutor/students`, "New session" on the calendar, "Approve grade" on assignments, "New message" on messages, or "New package" on payments.

Expected: Each control starts that task, or it is clearly unavailable.

Actual: These controls use button styles and are `<span>` elements. Clicking them leaves the URL unchanged. Approve on `/tutor` was clicked this pass and the URL stayed `/tutor`. The same pattern covers Request reschedule, Book a session, Edit availability, Generate with AI, Compose email, Export CSV, Import, and Start session. Message on a student is also a `<span>` and stays on `/tutor/students/michael-tran`.

"Message tutor" on the student room is a real link and opens `/student/messages`. The dashboard control labeled "Add student" is a link to `/tutor/students`. It opens the roster. It does not add a student. The roster then shows another "Add student" control that does nothing.

Recommended fix: Wire the smallest real action, or render the control disabled with a short reason. A control that looks active and does nothing is the defect.

### QA-3 — The signed-in student sees Emma Reyes's room

- Severity: **High**
- Status: Open. Reproduced this pass.
- Area: Student room, sessions, assignments, and progress
- Files: `src/app/student/room/page.tsx`, `src/app/student/sessions/page.tsx`, `src/app/student/assignments/page.tsx`, `src/app/student/progress/page.tsx`, `src/lib/data.ts`

Reproduction:

1. Register a new student. This pass used the name Riley Chen and the email `riley.chen.qa20@example.com`, then opened `/student/room`.
2. Open Sessions, Assignments, and Progress.

Expected: The room, sessions, assignments, and progress belong to that student, or the page says the content is sample data for Emma Reyes.

Actual: The shell shows "Riley Chen Qa20". The room subtitle is "Algebra II with Sarah Wilson", mastery is 68%, and the work list is the factoring set. Nothing on those pages says the academic record is sample data. Sessions are "with Sarah Wilson". Progress shows Factoring at 61%. The messages page is the one surface that says the thread is a demo ("Your conversation with Sarah Wilson (demo)"). Tutor roster, calendar, assignments, and payments are the same static records for every tutor account. There is no separate student dashboard. `/student` redirects to `/student/room`.

Recommended fix: Drive these pages from the signed-in profile, or label every block as sample data until that exists.

### QA-4 — Live Supabase auth and messaging are unproven, and a partial config can break sign-in

- Severity: **High**
- Status: Open on this tree. The missing-secret guard is present on pull request #1 and was not runtime-tested. The profile read and the composer error are still open on both trees.
- Area: Authentication, messaging, Supabase
- Files: `supabase/migrations/001_profiles_and_messaging.sql`, `src/lib/messaging.ts`, `src/lib/personas.ts`, `src/lib/supabase/admin.ts`, `src/lib/supabase/env.ts`, `src/app/messages/actions.ts`, `src/app/auth/actions.ts`

What was not tested: password sign-in against Supabase, email confirmation, a successful `/auth/callback` code exchange, and sending a message that the other account can read.

Code review on this pass:

- `profiles` allows each user to select only their own row (`auth.uid() = id`). `listConversationsForTutor` and `getStudentConversation` select the other person's `full_name` with the user client. Those reads fail closed, so the UI falls back to "Student" or "Your tutor".
- `listConversationsForTutor` always sets `unread` to 0.
- `sendMessage` logs an insert error and returns. The composer does not show a failure.
- On this tree, `ensureDemoEnrollment()` calls `createAdminClient()` whenever the public URL and publishable key are set. `createAdminClient()` calls `getSupabaseSecretKey()`, which throws when `SUPABASE_SECRET_KEY` is missing. `signIn` and `signUp` call `ensureDemoEnrollment()` after a successful password check, so a missing secret fails the request after the password was accepted.
- On pull request #1, `ensureDemoEnrollment()` returns before creating an admin client when `hasSupabaseSecret()` is false. That early return was read. It was not executed against a project.

Recommended fix: Add a select policy so an enrollment member can read the other member's display name. Keep the early return when the secret is missing. Surface send failures in the composer. Retest with `sarah@roomline.com` and `emma@roomline.com` after the SQL migration.

### QA-5 — Sign-in `next` can leave the site

- Severity: **High**
- Status: Open on this tree. Fixed on pull request #1 `2b9de32`, including the chooser submit. See the retest section.
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/app/auth/callback/route.ts`

Reproduction:

1. Open `/auth/login?next=//example.com`.
2. Submit the sign-in form with any password. Supabase is unset, so demo sign-in accepts it.
3. Separately, sign in with no `next`, open `/auth/continue?next=//example.com`, and choose Tutor workspace.

Expected: The person stays on this site.

Actual: Both paths land on `https://example.com/`. The same sign-in sends `///example.com` and `/\example.com` to `https://example.com/` as well. `/auth/login?next=/%2f%2fexample.com` decodes the hidden field to `///example.com` and also opens `https://example.com/`. The hidden `next` field copies the query value through. `signIn` and `chooseWorkspace` treat any string that starts with `/` as safe, and `redirect()` follows a protocol-relative path. The callback uses the same `startsWith("/")` check after a successful code exchange. That success path was not executed. A callback request with no code and `next=//example.com` stays on the login error page. `https://example.com` and `javascript:alert(1)` stay on `/auth/continue`.

Recommended fix: Use the helper already on pull request #1. This pass confirmed it keeps the cases above, and the chooser submit, on this host. Do not write a second copy.

### QA-6 — The auth callback changes 127.0.0.1 into localhost

- Severity: **High**
- Status: Open on this tree. Fixed on pull request #1 `2b9de32` for the failure path. The success path is still untested.
- Area: Authentication callback
- Files: `src/app/auth/callback/route.ts`

Reproduction:

1. Request `http://127.0.0.1:3000/auth/callback`.
2. Read the `Location` header.

Expected: The redirect stays on `http://127.0.0.1:3000`.

Actual: The response is `307` with `location: http://localhost:3000/auth/login?error=auth`. A request with `Host: evil.example` also redirects to `http://localhost:3000`, so an arbitrary Host is not followed. `X-Forwarded-Host: evil.example` with `X-Forwarded-Proto: https` redirects to `https://localhost:3000/auth/login?error=auth`. The foreign host is not used. The forwarded scheme is. The success path, where the session cookies are set and then the browser changes host, was not executed. Cookies set for `127.0.0.1` are not sent to `localhost`.

On pull request #1, the same request to port 3001 returns `location: http://127.0.0.1:3001/auth/login?error=auth`. `Host: evil.example` returns `http://localhost:3001/auth/login?error=auth`. The forwarded-host and forwarded-proto pair returns `https://127.0.0.1:3001/auth/login?error=auth`.

Recommended fix: Merge the pull request #1 helper. It builds the redirect from a loopback Host and keeps every other host on the origin Next already reported.

### QA-7 — A narrow screen cannot sign out or switch workspace

- Severity: **High**
- Status: Open on this tree. Sign out and Switch workspace are visible on pull request #1 at 390px. The nav overflow is still open on both trees.
- Area: Mobile workspace
- Files: `src/components/workspace-shell.tsx`

Reproduction:

1. Sign in and open `/student/room` at 390×844.
2. Look for Sign out and Switch workspace.

Expected: Both actions are on screen.

Actual: Both nodes are in the page, and an ancestor has `display: none` below the `lg` breakpoint (`hidden ... lg:block`). Measured boxes were 0×0 and hidden. There is no other sign-out control in the workspace. The logo goes home and leaves the session cookie in place. At the same width, the student nav `scrollWidth` is 447 and `clientWidth` is 390. The Messages link runs from x=352 with width 83, past the viewport. On `/tutor` at the same width the nav `scrollWidth` is 544, `clientWidth` is 390, and Messages runs from x=365 with width 83. The page `scrollWidth` stays 390. Desktop 1280×900 shows both actions, and Sign out works there.

On pull request #1, Sign out and Switch workspace at 390px are visible (Sign out from x=315, width 63, height 26, no hidden ancestor; Switch workspace from x=195, width 120, height 26). The page `scrollWidth` stays 390. The Messages link still runs from x=352 with width 83. The student nav `scrollWidth` is 447.

Recommended fix: Merge the pull request #1 sign-out change. Keep the section nav reachable without a hidden overflow, or make the overflow obvious. The nav overflow remains a low note after sign-out is visible.

### QA-8 — The demo inbox does not open the thread that was clicked

- Severity: **Medium**
- Status: Open on this tree. The inbox row is fixed on pull request #1. Message on a student is still open there.
- Area: Tutor messages, tutor student detail
- Files: `src/app/tutor/messages/page.tsx`, `src/app/tutor/students/[id]/page.tsx`

Reproduction:

1. Sign in as a tutor and open `/tutor/messages`.
2. Click Monica Keller.
3. Separately, open `/tutor/students/michael-tran` and click Message.

Expected: Monica's reschedule message is the open thread. Message on Michael opens Michael's thread.

Actual: On this tree, Monica's row is a `<div>` with no link. After the click the URL is still `/tutor/messages` and the open thread is still Emma Reyes ("I got stuck on question 4 of the factoring set."). Monica's preview stays in the list. Message on Michael is a `<span>`. The URL stays `/tutor/students/michael-tran`. Sending is disabled on the demo inbox, and the page says so.

On pull request #1, Monica's row opens `/tutor/messages?c=monica` and "Can we move Wednesday to 5:30 this week?" is the thread. Emma's factoring sentence is gone. Message on Michael is a link to `/tutor/messages` with no conversation id, and Emma's factoring sentence is the open thread.

Recommended fix: Merge the inbox links from pull request #1. Point Message on a student at that student's conversation id (`?c=michael` for Michael Tran).

### QA-9 — Score history bars are drawn at zero height

- Severity: **Medium**
- Status: Open on this tree. Fixed on pull request #1.
- Area: Student progress
- Files: `src/app/student/progress/page.tsx`

Reproduction:

1. Sign in as a student and open `/student/progress`.
2. Look at Score history.

Expected: Bars for 88, 72, 62, and 84.

Actual: On this tree the four labels are visible. Each bar element has `style="height:88%"` (and 72%, 62%, 84%) and a measured height of 0. The percentage height is inside a flex column whose own height depends on that bar, so the percentage resolves to nothing.

On pull request #1 the same bars measured 110, 90, 78, and 105 pixels.

Recommended fix: Merge the pull request #1 chart. It gives the column a real height and sets each bar as a percentage of that track.

### QA-10 — Demo sign-in accepts any password, and the session cookie is readable by script

- Severity: **Medium**
- Status: Open. Reproduced this pass. Still open on pull request #1 by code inspection. The demo cookie setter there still omits `httpOnly`.
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/app/auth/login/page.tsx`

Reproduction:

1. With Supabase unset, open `/auth/login`.
2. Keep `sarah@roomline.com` and replace the password with any other non-empty value.
3. Submit, choose Tutor, then read `document.cookie`.

Expected: A password check, or copy that this local mode does not use the password. The session cookies are not readable from page script.

Actual: The password `not-the-demo-password` opens the workspace chooser for `sarah@roomline.com`. `signIn` does not read the password in the demo branch. After Tutor is chosen, `document.cookie` contains both `roomline_user` and `roomline_role`. Neither cookie is `httpOnly` (`sameSite` Lax). The form is prefilled with `demo-password`, which will also be wrong once Supabase is configured unless that is the account's password.

Recommended fix: Keep the bypass only for local demo, and say that on the form. Set `httpOnly` on the demo cookies.

### QA-11 — Public navigation is not in the header on a narrow screen

- Severity: **Medium**
- Status: Open. Reproduced this pass.
- Area: Public pages, mobile
- Files: `src/components/site-header.tsx`

Reproduction:

1. Open `/` at 390px width.
2. Look for About, Pricing, and Trust & FERPA in the header.

Expected: Those pages are reachable from the header.

Actual: The header nav computes to `display: none` below the `md` breakpoint. The three links are in the DOM and are not shown. Sign in and Get started stay visible. About, Pricing, and Trust remain in the footer. The home page does not overflow (`scrollWidth` 390).

Recommended fix: Add a compact menu for the three header links below `md`.

### QA-12 — Student search and roster filters do not change the list

- Severity: **Medium**
- Status: Open. Reproduced this pass.
- Area: Tutor students
- Files: `src/app/tutor/students/page.tsx`

Reproduction:

1. Open `/tutor/students`.
2. Type `zzzz-no-match` into the search field.
3. Choose Archived.

Expected: The roster narrows, or the controls are marked as unavailable.

Actual: Emma Reyes and Michael Tran stay on screen. The filter labels are spans. The page subtitle says "5 students on your roster".

Recommended fix: Filter `students` from the query, or remove the controls until search exists.

### QA-13 — Sample records disagree about the same people

- Severity: **Medium**
- Status: Open. Reproduced this pass.
- Area: Tutor dashboard, student detail, calendar, assignments, payments
- Files: `src/lib/data.ts`, `src/app/tutor/page.tsx`, `src/app/tutor/assignments/page.tsx`, `src/app/tutor/calendar/page.tsx`, `src/app/tutor/payments/page.tsx`

Confirmed on screen this pass:

- The dashboard date is Sunday, September 13. Emma Reyes is at 9:00 AM on Today's schedule. Her student room says the next session is today at 4:00 PM.
- The dashboard schedule includes Michael Tran at 2:00 PM with state "First session". His profile says "Trial completed" and "Not scheduled".
- The dashboard says 18 active students and "Awaiting review" is 9. The roster subtitle says "5 students on your roster". Assignments says 2 need grading.
- Assignments says 4 active and 2 need grading. The grading queue shows Ava's submitted set and Noah's set. In the assignment list on the same page, Noah's "Circle theorems proof set" is "In progress" (8/10 submitted), while the queue says it was submitted yesterday.
- Payments says $3,240 this month, outstanding $190 for "2 unpaid invoices", and a next payout of $1,755. The paid rows on that page are $850, $40, $450, and $320, which total $1,660. The other two rows are a $95 refund and a $95 failure.
- Calendar says 7 booked this week and 5 open blocks. The week grid shows one slot labeled "Open block".

Expected: One schedule and one set of counts.

Actual: Headline numbers are hardcoded and do not match the lists under them.

Recommended fix: Derive the counts from the shared records, or stop showing a second conflicting number.

### QA-14 — The workspace chooser is shown at the protected URL

- Severity: **Medium**
- Status: Open on this tree. Fixed on pull request #1.
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/middleware.ts`

Reproduction:

1. Open `/auth/login?next=/tutor/payments`.
2. Sign in. Do not choose a workspace yet.
3. Separately, sign in with `next=/tutor`.

Expected: The chooser URL is `/auth/continue`, with the return path in that URL.

Actual: On this tree, `next=/tutor/payments` leaves the address bar at `http://127.0.0.1:3000/tutor/payments` while the page heading is "Choose your workspace". The hidden `next` is still `/tutor/payments`. Choosing Tutor then opens Payments, so the return path is kept. `next=/tutor` does the same: the heading is "Choose your workspace" at `/tutor`. A sign-in with no `next` does open `/auth/continue`. `signIn` redirects straight at `next` before a role exists, and the chooser is rendered on that URL.

On pull request #1 the address after sign-in with `next=/tutor/payments` is `http://127.0.0.1:3001/auth/continue?next=%2Ftutor%2Fpayments`. Choosing Tutor opens Payments.

Recommended fix: Merge the pull request #1 sign-in path. It sends a signed-in person with no role to `/auth/continue` and carries `next` in that URL.

### QA-15 — Lower-severity notes

- Severity: **Low**
- Status: Open. Reproduced this pass.

- Register placeholder says "At least 12 characters" and the server accepts 8. The error for a shorter password says "Use a password of at least 8 characters." An 8-character password completed registration. File: `src/app/auth/register/page.tsx`.
- `/auth/continue?error=role` does not render an error. The chooser only says who is signed in. File: `src/app/auth/continue/page.tsx`.
- `next build` warns that `src/middleware.ts` should move to the `proxy` convention. The role redirects under test were correct.
- Footer X, LinkedIn, and GitHub links point at `/`. File: `src/components/site-footer.tsx`.
- Workspace nav on a 390px screen lets Messages run past the viewport. See QA-7. The overflow itself is low once sign-out is visible.

### QA-16 — Demo registration ignores the typed name

- Severity: **Low**
- Status: Open. Reproduced this pass, including on pull request #1.
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/lib/session.ts`

Reproduction:

1. Open `/auth/register` with Supabase unset.
2. Choose student, enter the name Riley Chen, the email `riley.chen.qa20@example.com`, and a password of 8 characters.
3. Submit and read the workspace shell.

Expected: The shell shows Riley Chen.

Actual: On this tree the shell shows "Riley Chen Qa20". `signUp` reads the name field and, in demo mode, calls `writeDemoUser(email)` without it. `resolveUser` builds the display name from the email. On pull request #1, the name Riley Chen and the email `riley.pr1c@example.com` produced the shell name "Riley Pr1c". Known demo addresses still resolve to Sarah Wilson and Emma Reyes.

Recommended fix: Store the submitted name on the demo user cookie. Keep `resolveUser` as the fallback when the name is empty.

## Pull request #1 retest

Head: `2b9de32` on `cursor/website-qa-audit-4c9f`. Built with `next build` and served at `http://127.0.0.1:3001`. Lint passed. `npm test` passed, 4 tests. This head is not the tree under the Hold above.

| Finding | On `2b9de32` |
| --- | --- |
| QA-5 sign-in `next` | Fixed in the browser. `//example.com`, `///example.com`, `/\example.com`, `https://example.com`, `javascript:alert(1)`, and `/%2f%2fexample.com` all finish on `/auth/continue`. The chooser submit with `next=//example.com` finishes on `/tutor`. |
| QA-6 callback host | Fixed for the missing-code redirect. `127.0.0.1` stays on `127.0.0.1`. `Host: evil.example` stays on localhost. `X-Forwarded-Host: evil.example` is not followed. A successful code exchange was not available. |
| QA-14 chooser URL | Fixed. Sign-in with `next=/tutor/payments` opens `/auth/continue?next=%2Ftutor%2Fpayments`, and Tutor then opens Payments. |
| QA-9 score bars | Fixed. Heights were 110, 90, 78, and 105. |
| QA-7 sign-out | Fixed for the hidden actions. Both controls are on screen at 390px. The Messages link still runs from x=352 with width 83. |
| QA-8 inbox | Fixed for the row. Monica opens `?c=monica` and her reschedule text. Message on Michael still opens `/tutor/messages` and Emma's thread. |
| QA-4 missing secret | Fixed in code. `ensureDemoEnrollment()` returns when the secret is absent. Not run against a project. Profile reads and the composer error remain. |
| QA-1, QA-2, QA-3, QA-10 through QA-13, QA-15, QA-16 | Still open. QA-1 and QA-16 were reproduced in the browser on this head. |

## Suggested engineering order

1. Merge pull request #1. This pass retested that head. Do not write a second copy of the redirect helper, the callback host, the chooser URL, the score bars, the narrow sign-out, or the demo inbox links.
2. QA-1 password reset, on top of that merged callback. Include the unconfigured-state message.
3. Point Message on a student at that student's conversation id. That remainder of QA-8 is still open on pull request #1.
4. QA-4 profile read policy, visible send errors, and a two-account Supabase retest.
5. QA-3 signed-in student data, or an honest sample-data label.
6. QA-2 unwired actions, either implemented or disabled.
7. QA-10 through QA-16, and the narrow nav overflow, after the highs are closed.
