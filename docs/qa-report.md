# QA report

Date: 2026-11-18  
Commit under test: application commit `5c6c6e14` (Supabase auth and the static Roomline prototype). This pass built that same application from the docs branch at `58c66ea`. The docs commits do not change the app.  
App: Roomline (`ai-tutoring-concierge`)  
Build: `next build`, then `next start` on `http://127.0.0.1:3000` (Next.js 16.3.5).  
Mode: demo cookie session. `NEXT_PUBLIC_SUPABASE_URL`, the publishable key, and the secret key are unset, so live Supabase auth and messaging were not executed.

**Release decision: Hold.** See [release-decision.md](./release-decision.md).

This is a full retest of the default-branch application. Every finding below was reproduced again in this pass, or reconfirmed by reading the code that runs on that path. Pull request [#1](https://github.com/brandonnguyen11/shifu/pull/1) is still open and was not the build under test.

## Checks run

| Check | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npx tsc --noEmit` before `next typegen` | Fail. `PageProps` and `LayoutProps` are missing until Next generates them. Five errors, in the auth pages, the root layout, and the student detail page. |
| `npx next typegen && npx tsc --noEmit` | Pass |
| `npm run build` | Pass. TypeScript step inside the build passed. Warning: the `middleware` file convention is deprecated in favor of `proxy`. |
| `npm test` | Not configured. `package.json` has no test script, and the repo has no test files. |
| Browser pass, desktop 1280×900 and mobile 390×844 | Done with headless Chrome. Public pages, demo auth, both workspaces, messaging, empty states, and the narrow layout were exercised. |
| Supabase sign-in, email confirmation, password-reset delivery, and a message sent by one account and read by the other | Not run. This environment has no project credentials. |

## What works

- `/`, `/about`, `/pricing`, `/trust`, `/auth/login`, `/auth/register`, and `/auth/forgot-password` return 200 and render their headings.
- Desktop header links reach About, Pricing, and Trust & FERPA. About `#contact` and `#mission`, Trust `#ferpa` and the other policy ids, and the home `#demo` section are present.
- Pricing "Start free" follows `/tutor` and middleware sends a signed-out visitor to `/auth/login?next=%2Ftutor`. "Talk to us" opens `/about#contact`.
- Every tutor and student route, including `/student`, redirects a signed-out visitor to `/auth/login` with `307` and keeps the original path in `next`.
- Login rejects an address without `@` (`/auth/login?error=email`). Register rejects a 7-character password (`/auth/register?error=password`, copy says at least 8 characters) and accepts `12345678`.
- Registering as Riley Chen, student, lands on `/student/room`. The shell shows Riley Chen.
- Choosing a workspace sets the role. A student who opens `/tutor` or `/tutor/payments` returns to `/student/room`. A tutor who opens `/student/room` returns to `/tutor`.
- Sign out returns to `/`. The next visit to `/student/room` requires sign-in again, and the `roomline_` cookies are gone.
- A sign-in with no `next` opens the chooser at `/auth/continue`.
- `/tutor/students/does-not-exist` renders the 404 page.
- Michael Tran's detail shows "No assessments yet", "Nothing assigned yet", and "Not scheduled".
- Demo messaging says sending is disabled. The student page does not render a composer. The tutor page says sending is disabled in demo mode.
- At 390px the home page does not overflow (`scrollWidth` 390). The tutor calendar scrolls inside its grid (`scrollWidth` 544, `clientWidth` 390) and the page itself stays at 390.
- `https://example.com` and `javascript:alert(1)` as `next` stay on this site. `/%2f%2fexample.com` stays on this host and 404s. A value has to start with `/` before the redirect uses it.

## Open findings

### QA-1 — Password reset does not send anything

- Severity: **High**
- Status: Open. Reproduced this pass.
- Area: Authentication
- Files: `src/app/auth/forgot-password/page.tsx`

Reproduction:

1. Open `/auth/forgot-password`.
2. Enter `sarah@roomline.com`.
3. Submit "Send reset link".

Expected: The app requests a reset email, or it explains that reset email is unavailable. The address is not left in the URL, and the page does not claim a message was sent.

Actual: The form has no action and no server handler. The browser navigates to `/auth/forgot-password?email=sarah%40roomline.com`. No non-GET request is sent. The same form is shown again, still saying "We'll email a reset link that expires in 30 minutes."

Recommended fix: Call Supabase `resetPasswordForEmail` when Supabase is configured, and show one generic confirmation. When it is not configured, say that demo mode cannot send email and keep the address out of the query string.

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

Actual: These controls use button styles and are `<span>` elements. Clicking them does not navigate and does not change the page. The same pattern covers Request reschedule, Book a session, Edit availability, Generate with AI, Compose email, Export CSV, New note, Start session, and Message on a student. Binder rows say "Open" and graded rows say "Review" without a destination.

The dashboard control labeled "Add student" is a link to `/tutor/students`. It opens the roster. It does not add a student. The roster then shows another "Add student" control that does nothing.

Recommended fix: Wire the smallest real action, or render the control disabled with a short reason. A control that looks active and does nothing is the defect.

### QA-3 — The signed-in student sees Emma Reyes's room

- Severity: **High**
- Status: Open. Reproduced this pass.
- Area: Student room, sessions, assignments, and progress
- Files: `src/app/student/room/page.tsx`, `src/app/student/sessions/page.tsx`, `src/app/student/assignments/page.tsx`, `src/app/student/progress/page.tsx`, `src/lib/data.ts`

Reproduction:

1. Register a new student named Riley Chen and open `/student/room`.
2. Open Sessions, Assignments, and Progress.

Expected: The room, sessions, assignments, and progress belong to Riley, or the page says the content is sample data for Emma Reyes.

Actual: The shell shows Riley Chen. The room subtitle is "Algebra II with Sarah Wilson", mastery is 68%, and the work list is Emma's factoring set. Nothing on the page says it is sample data. Sessions are "with Sarah Wilson". Progress shows Emma's skills, including Factoring at 61%. Tutor roster, calendar, assignments, and payments are the same static records for every tutor account. `/student` redirects to `/student/room`. There is no separate student dashboard.

Recommended fix: Drive these pages from the signed-in profile, or label every block as sample data until that exists.

### QA-4 — Live Supabase auth and messaging are unproven, and a partial config can break sign-in

- Severity: **High**
- Status: Open. Runtime still untested. Code path reconfirmed this pass.
- Area: Authentication, messaging, Supabase
- Files: `supabase/migrations/001_profiles_and_messaging.sql`, `src/lib/messaging.ts`, `src/lib/personas.ts`, `src/lib/supabase/admin.ts`, `src/app/messages/actions.ts`, `src/app/auth/actions.ts`

What was not tested: password sign-in against Supabase, email confirmation, a successful `/auth/callback` code exchange, and sending a message that the other account can read.

Code review on this pass, confirmed by reading the migration and the callers:

- `profiles` allows each user to select only their own row (`auth.uid() = id`). `listConversationsForTutor` and `getStudentConversation` select the other person's `full_name` with the user client. Those reads fail closed, so the UI falls back to "Student" or "Your tutor".
- `listConversationsForTutor` always sets `unread` to 0.
- `sendMessage` logs an insert error and returns. The composer does not show a failure.
- `ensureDemoEnrollment()` calls `createAdminClient()` whenever the public URL and publishable key are set. `createAdminClient()` throws when `SUPABASE_SECRET_KEY` is missing. `signIn` and `signUp` call `ensureDemoEnrollment()` after a successful password check, so a missing secret fails the request after the password was accepted.

Recommended fix: Add a select policy so an enrollment member can read the other member's display name. Return before creating an admin client when the secret is missing. Surface send failures in the composer. Retest with `sarah@roomline.com` and `emma@roomline.com` after the SQL migration. Pull request #1 already skips the admin client when the secret is missing. Retest that part on its head. It does not cover the profile read policy or the composer error.

### QA-5 — Sign-in `next` can leave the site

- Severity: **High**
- Status: Open. Reproduced this pass.
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/app/auth/callback/route.ts`

Reproduction:

1. Open `/auth/login?next=//example.com`.
2. Submit the sign-in form with any password. Supabase is unset, so demo sign-in accepts it.

Expected: The person stays on this site.

Actual: The browser lands on `https://example.com/`. The same sign-in sends `///example.com` and `/\example.com` to `https://example.com/` as well. The hidden `next` field copies the query value through. `signIn` and `chooseWorkspace` treat any string that starts with `/` as safe, and `redirect()` follows a protocol-relative path. The callback uses the same `startsWith("/")` check after a successful code exchange. That success path was not executed. `/%2f%2fexample.com` stayed on this host and 404ed.

Recommended fix: Accept a `next` value only when it is a same-origin path. Reject a second slash, a backslash, and any URL whose parsed origin is not this site. Apply that helper in `signIn`, `signUp`, `chooseWorkspace`, and `/auth/callback`. Pull request #1 already contains a patch. Retest that head. Do not write a second copy while it is open.

### QA-6 — The auth callback changes 127.0.0.1 into localhost

- Severity: **High**
- Status: Open. Reproduced this pass.
- Area: Authentication callback
- Files: `src/app/auth/callback/route.ts`

Reproduction:

1. Request `http://127.0.0.1:3000/auth/callback`.
2. Read the `Location` header, or follow it in a browser.

Expected: The redirect stays on `http://127.0.0.1:3000`.

Actual: The response is `307` with `location: http://localhost:3000/auth/login?error=auth`. A request with `Host: evil.example` also redirects to `http://localhost:3000`, so an arbitrary Host is not followed. The success path, where the session cookies are set and then the browser changes host, was not executed. Cookies set for `127.0.0.1` are not sent to `localhost`.

Recommended fix: Build the redirect from the Host the browser used when that host is loopback (`localhost`, `127.0.0.1`, or `::1`). Keep every other host on the origin Next already reported. Pull request #1 already contains a patch. Retest that head.

### QA-7 — A narrow screen cannot sign out or switch workspace

- Severity: **High**
- Status: Open. Reproduced this pass.
- Area: Mobile workspace
- Files: `src/components/workspace-shell.tsx`

Reproduction:

1. Sign in and open `/student/room` at 390×844.
2. Look for Sign out and Switch workspace.

Expected: Both actions are on screen.

Actual: Both nodes are in the page, and an ancestor is `display: none` below the `lg` breakpoint. There is no other sign-out control in the workspace. The logo goes home and leaves the session cookie in place. At the same width, the student nav `scrollWidth` is 447 and `clientWidth` is 390. The Messages link runs from x=352 to x=435, past the viewport. On `/tutor` at the same width the nav `scrollWidth` is 544 and Messages runs to about x=448. The page `scrollWidth` stays 390.

Recommended fix: Show Sign out and Switch workspace below `lg`. Keep the section nav reachable without a hidden overflow, or make the overflow obvious. Pull request #1 already shows sign-out below `lg`. Retest that head. The nav overflow is still a separate low note if that patch does not scroll the links.

### QA-8 — The demo inbox does not open the thread that was clicked

- Severity: **Medium**
- Status: Open. Reproduced this pass.
- Area: Tutor messages, tutor student detail
- Files: `src/app/tutor/messages/page.tsx`, `src/app/tutor/students/[id]/page.tsx`

Reproduction:

1. Sign in as a tutor and open `/tutor/messages`.
2. Click Monica Keller.
3. Separately, open `/tutor/students/michael-tran` and click Message.

Expected: Monica's reschedule message is the open thread. Message on Michael opens Michael's thread.

Actual: Monica's row is a `<div>` with no link. After the click the URL is still `/tutor/messages` and the open thread is still Emma Reyes ("I got stuck on question 4 of the factoring set."). Message on Michael is a `<span>`. The URL stays `/tutor/students/michael-tran`. Sending is disabled on the demo inbox, and the page says so.

Recommended fix: Link each demo row to `?c=` and render that thread. Point Message on a student at that student's conversation id. Pull request #1 already does this for the demo inbox. Retest that head.

### QA-9 — Score history bars are drawn at zero height

- Severity: **Medium**
- Status: Open. Reproduced this pass.
- Area: Student progress
- Files: `src/app/student/progress/page.tsx`

Reproduction:

1. Sign in as a student and open `/student/progress`.
2. Look at Score history.

Expected: Bars for 88, 72, 62, and 84.

Actual: The four labels are visible. Each bar element has `style="height:88%"` (and 72%, 62%, 84%) and a measured height of 0. The percentage height is inside a flex column whose own height depends on that bar, so the percentage resolves to nothing. Skill mastery bars on the same page do render.

Recommended fix: Give the chart a fixed track height and set each bar's height in pixels from the score. Pull request #1 already contains a patch. Retest that head.

### QA-10 — Demo sign-in accepts any password, and the session cookie is readable by script

- Severity: **Medium**
- Status: Open. Reproduced this pass.
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/app/auth/login/page.tsx`

Reproduction:

1. With Supabase unset, open `/auth/login`.
2. Keep `sarah@roomline.com` and replace the password with any other non-empty value.
3. Submit, then read `document.cookie` on the chooser.

Expected: A password check, or copy that this local mode does not use the password. The session cookie is not readable from page script.

Actual: The password `not-the-demo-password` opens the workspace chooser for `sarah@roomline.com`. `signIn` does not read the password in the demo branch. `roomline_user` is not `httpOnly`, and `document.cookie` contains it. The form is prefilled with `demo-password`, which will also be wrong once Supabase is configured unless that is the account's password.

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

Actual: Emma Reyes, Ava Mitchell, James Keller, Noah Patel, and Michael Tran stay on screen. The filter labels are spans. The page subtitle says "5 students on your roster".

Recommended fix: Filter `students` from the query, or remove the controls until search exists.

### QA-13 — Sample records disagree about the same people

- Severity: **Medium**
- Status: Open. Reproduced this pass.
- Area: Tutor dashboard, student detail, calendar, assignments, payments
- Files: `src/lib/data.ts`, `src/app/tutor/page.tsx`, `src/app/tutor/assignments/page.tsx`, `src/app/tutor/calendar/page.tsx`, `src/app/tutor/payments/page.tsx`

Confirmed on screen this pass:

- The dashboard date is Sunday, September 13. Emma Reyes is at 9:00 AM on Today's schedule. Her student room says the next session is today at 4:00 PM. Her profile uses the sample "Today, 4:00 PM" string.
- Michael Tran is a "First session" today at 2:00 PM on the dashboard. His profile says "Trial completed" and "Not scheduled".
- The dashboard says 18 active students and "Awaiting review" is 9. The roster lists 5. The roster note on the dashboard repeats 18. Assignments says 2 need grading.
- Assignments says 4 active and 2 need grading. The grading queue shows Ava's submitted set and Noah's set. In the shared records only Ava's set is "Needs grading". Noah's set is "In progress".
- Payments says $3,240 this month, outstanding $190 for "2 unpaid invoices", and a next payout of $1,755. The paid rows on that page are $850, $40, $450, and $320, which total $1,660. The other two rows are a $95 refund and a $95 failure.
- Calendar says 7 booked this week and 5 open blocks. The week grid has seven slots, and one of them is labeled "Open block".

Expected: One schedule and one set of counts.

Actual: Headline numbers are hardcoded and do not match the lists under them.

Recommended fix: Derive the counts from the shared records, or stop showing a second conflicting number.

### QA-14 — The workspace chooser is shown at the protected URL

- Severity: **Medium**
- Status: Open. Reproduced this pass.
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/middleware.ts`

Reproduction:

1. Open `/auth/login?next=/tutor/payments`.
2. Sign in. Do not choose a workspace yet.

Expected: The chooser URL is `/auth/continue?next=%2Ftutor%2Fpayments`.

Actual: The address bar is `http://127.0.0.1:3000/tutor/payments` while the page heading is "Choose your workspace". The hidden `next` is still `/tutor/payments`. Choosing Tutor then opens Payments, so the return path is kept. A sign-in with no `next` does open `/auth/continue`. The mismatch is the protected return path.

Recommended fix: Send a signed-in person with no role to `/auth/continue` and carry `next` in that URL. Do that from `signIn` before redirecting at `next`, so the first response is not a workspace URL.

### QA-15 — Lower-severity notes

- Severity: **Low**
- Status: Open. Reproduced this pass.

- Register placeholder says "At least 12 characters" and the server accepts 8. The error for a shorter password says "Use a password of at least 8 characters." An 8-character password completed registration for Riley Chen. File: `src/app/auth/register/page.tsx`.
- `/auth/continue?error=role` does not render an error. The chooser only says who is signed in. File: `src/app/auth/continue/page.tsx`.
- `next build` warns that `src/middleware.ts` should move to the `proxy` convention. The role redirects under test were correct.
- Footer X, LinkedIn, and GitHub links point at `/`. File: `src/components/site-footer.tsx`.
- Workspace nav on a 390px screen lets Messages run past the viewport. See QA-7. The overflow itself is low once sign-out is visible.

## Suggested engineering order

1. QA-5 and QA-6, so sign-in and the callback cannot leave the host the person is using. Pull request #1 already contains a patch for these two, plus QA-7 sign-out, QA-8, QA-9, and the missing-secret guard in QA-4. Retest that patch before merging it. Do not build a second copy in parallel.
2. QA-1 password reset, including the unconfigured-state message. The reset link uses the callback from QA-6.
3. QA-4 profile read policy, visible send errors, and a two-account Supabase retest. The missing-secret guard is already in pull request #1.
4. QA-3 signed-in student data, or an honest sample-data label.
5. QA-2 unwired actions, either implemented or disabled.
6. Whatever of QA-7, QA-8, and QA-9 is still open after the pull request #1 retest.
7. QA-10 through QA-15 after the highs are closed.
