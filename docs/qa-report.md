# QA report

Date: 2026-11-18  
Commit under test: application commit `5c6c6e14`. This pass started from docs commit `54cc6e33`. The docs commits do not change the app.  
App: Roomline (`ai-tutoring-concierge`)  
Build: `next build`, then `next start` on `http://127.0.0.1:3000` (Next.js 16.3.5).  
Mode: demo cookie session. `NEXT_PUBLIC_SUPABASE_URL`, the publishable key, the anon key, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are unset, so live Supabase auth and messaging were not executed.

**Release decision: Hold.** See [release-decision.md](./release-decision.md).

This pass reproduced QA-1 through QA-16 on `5c6c6e14`. Sign-in with `next=//example.com`, `next=///example.com`, and `next=/\example.com` finished on `https://example.com/`. `/auth/login?next=/%2f%2fexample.com` decoded the hidden field to `///example.com` and also opened `https://example.com/`. The workspace chooser follows `next=//example.com` off the site. Pull request [#1](https://github.com/brandonnguyen11/shifu/pull/1) is still open at `2b9de32`. This pass built that head, ran its `npm test` (4 passing), and repeated the browser checks. The patch still holds. Message on a student still opens Emma's thread, and demo registration still drops the typed name.

## Checks run

| Check | Tree | Result |
| --- | --- | --- |
| `npm run lint` | `5c6c6e14` | Pass |
| `npx tsc --noEmit` before `next typegen` | `5c6c6e14` | Fail. `PageProps` and `LayoutProps` are missing until Next generates them. Five errors, in the auth pages, the root layout, and the student detail page. |
| `npx next typegen && npx tsc --noEmit` | `5c6c6e14` | Pass |
| `npm run build` | `5c6c6e14` | Pass. TypeScript step inside the build passed. Warning: the `middleware` file convention is deprecated in favor of `proxy`. |
| `npm test` | `5c6c6e14` | Not configured. `npm test` exits with "Missing script: test". This tree has no test files. |
| Browser pass, desktop 1280×900 and mobile 390×844 | `5c6c6e14` | Done with headless Chrome against the production server. Public pages, demo auth, both workspaces, messaging, empty states, and the narrow layout were exercised. Isolated browser contexts were used for the redirect and chooser cases. |
| Supabase sign-in, email confirmation, password-reset delivery, and a message sent by one account and read by the other | `5c6c6e14` | Not run. This environment has no project credentials. |
| Pull request #1 head `2b9de32` | rebuilt | `npm test` passed 4 tests in `src/lib/safe-path.test.ts`. `npm run build` passed, with the same middleware warning. Browser retest on `http://127.0.0.1:3001` is below. Callback hosts were read with curl. |

## What works

- `/`, `/about`, `/pricing`, `/trust`, `/auth/login`, `/auth/register`, and `/auth/forgot-password` return 200 and render their headings.
- Desktop header links reach About, Pricing, and Trust & FERPA. About from the header opens `/about`. Pricing "Start free" follows `/tutor` and middleware sends a signed-out visitor to `/auth/login?next=%2Ftutor`. "Talk to us" points at `/about#contact`.
- About `#contact`, `#mission`, `#approach`, and `#careers`, Trust `#ferpa` and the other policy ids, and the home `#demo` section are present.
- Every tutor and student route checked, including `/student`, redirects a signed-out visitor with `307` to `/auth/login` and keeps the original path in `next`. Confirmed from the `Location` header.
- Register rejects a 7-character password (`/auth/register?error=password`, copy says at least 8 characters) and accepts `12345678`.
- With the browser email check turned off, `not-an-email` reaches `/auth/register?error=email` and the copy "Enter a valid email address to continue."
- A new student account lands on `/student/room`. `/student` then redirects to `/student/room`. "Message tutor" opens `/student/messages`. "Switch workspace" opens `/auth/continue`.
- Choosing a workspace sets the role. A student who opens `/tutor` returns to `/student/room`. A tutor who opens `/student/room` returns to `/tutor`.
- Sign out on a desktop-width screen returns to `/`. The next visit to `/student/room` requires sign-in again, and the `roomline_` cookies are gone. On `/tutor/payments` at 1280×900 the Sign out button is inside the viewport (63×26 at x=12, y=862).
- A sign-in with no `next` opens the chooser at `/auth/continue`.
- `/tutor/students/does-not-exist` renders the 404 page.
- Michael Tran's detail shows "No assessments yet", "Nothing assigned yet", and "Not scheduled".
- The roster subtitle says "5 students on your roster" and lists Emma Reyes, Ava Mitchell, James Keller, Noah Patel, and Michael Tran.
- Demo messaging says sending is disabled. The student page says "Sending is disabled until live messaging is connected." The tutor page says "Sending is disabled in demo mode." The student composer is not a textarea.
- At 390px the home page, the tutor dashboard, and the payments page stay within the viewport (`scrollWidth` 390). The calendar week grid is 720px wide inside a horizontal scroller whose client width is 340.
- `https://example.com` and `javascript:alert(1)` as `next` stay on this site and open the chooser. A value has to start with `/` before the redirect uses it.
- `/auth/callback` does not follow `Host: evil.example` or `X-Forwarded-Host: evil.example`. Both stay on localhost. See QA-6 for the loopback host bug and the forwarded scheme.

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

Expected: The app requests a reset email, or it explains that reset email is unavailable. The address is left out of the URL, and the page does not claim a message was sent.

Actual: The form has no method and no action. The browser navigates to `/auth/forgot-password?email=sarah%40roomline.com`. The document requests were the first GET and that second GET. The same form is shown again, still saying "We'll email a reset link that expires in 30 minutes."

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

Actual: These controls use button styles and are `<span>` elements. Clicking them leaves the URL unchanged. Approve on `/tutor` was clicked this pass and the URL stayed `/tutor`. The same click result held for New session, Approve grade, New package, and New message. Message on a student is also a `<span>` and stays on `/tutor/students/michael-tran`. The sessions page shows "Book a session". That control is the same span pattern.

"Message tutor" on the student room is a real link and opens `/student/messages`. The dashboard control labeled "Add student" is a link to `/tutor/students`. It opens the roster. It does not add a student. The roster then shows another "Add student" control that does nothing.

Recommended fix: Wire the smallest real action, or render the control disabled with a short reason. A control that looks active and does nothing is the defect.

### QA-3 — The signed-in student sees Emma Reyes's room

- Severity: **High**
- Status: Open. Reproduced this pass.
- Area: Student room, sessions, assignments, and progress
- Files: `src/app/student/room/page.tsx`, `src/app/student/sessions/page.tsx`, `src/app/student/assignments/page.tsx`, `src/app/student/progress/page.tsx`, `src/lib/data.ts`

Reproduction:

1. Register a new student. This pass used the name Riley Chen and the email `riley.chen.qa41@example.com`, then opened `/student/room`.
2. Open Sessions, Assignments, and Progress.

Expected: The room, sessions, assignments, and progress belong to that student, or the page says the content is sample data for Emma Reyes.

Actual: The shell shows "Riley Chen Qa41". The room subtitle is "Algebra II with Sarah Wilson", mastery is 68%, and the work list is the factoring set. Nothing on those pages says the academic record is sample data. Sessions are with Sarah Wilson. Progress shows Factoring at 61%. The messages page is the one surface that says the thread is a demo ("Your conversation with Sarah Wilson (demo)"). Tutor roster, calendar, assignments, and payments are the same static records for every tutor account. There is no separate student dashboard. `/student` redirects to `/student/room`.

Recommended fix: Drive these pages from the signed-in profile, or label every block as sample data until that exists.

### QA-4 — Live Supabase auth and messaging are unproven, and a partial config can break sign-in

- Severity: **High**
- Status: Open. Reproduced by code reading this pass. No project credentials were available, so the runtime path was not executed.
- Area: Authentication, messaging, Supabase
- Files: `supabase/migrations/001_profiles_and_messaging.sql`, `src/lib/messaging.ts`, `src/lib/personas.ts`, `src/lib/supabase/admin.ts`, `src/lib/supabase/env.ts`, `src/app/messages/actions.ts`, `src/app/auth/actions.ts`

What was not tested: password sign-in against Supabase, email confirmation, a successful `/auth/callback` code exchange, and sending a message that the other account can read.

Code review on this pass:

- `profiles` allows each user to select only their own row (`auth.uid() = id`). `listConversationsForTutor` selects the other person's `full_name` with the user client. Those reads fail closed, so the UI falls back to "Student".
- `listConversationsForTutor` always sets `unread` to 0.
- `sendMessage` logs an insert error and returns. The composer does not show a failure.
- `ensureDemoEnrollment()` calls `createAdminClient()` whenever the public URL and publishable key are set. `createAdminClient()` calls `getSupabaseSecretKey()`, which throws when `SUPABASE_SECRET_KEY` is missing. `signIn` and `signUp` call `ensureDemoEnrollment()` after a successful password check, so a missing secret fails the request after the password was accepted.

Recommended fix: Add a select policy so an enrollment member can read the other member's display name. Return before creating an admin client when the secret is missing. Surface send failures in the composer. Retest with `sarah@roomline.com` and `emma@roomline.com` after the SQL migration. The missing-secret return already exists on pull request #1. Keep that version.

### QA-5 — Sign-in `next` can leave the site

- Severity: **High**
- Status: Open on this tree. The helper that rejects these values is on pull request #1 at `2b9de32`, and this pass retested it there. See the pull request section.
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/app/auth/callback/route.ts`

Reproduction:

1. Open `/auth/login?next=//example.com` in a fresh session.
2. Submit the sign-in form with any password. Supabase is unset, so demo sign-in accepts it.
3. Separately, sign in with no `next`, open `/auth/continue?next=//example.com`, and choose Tutor workspace.

Expected: The person stays on this site.

Actual: Both paths land on `https://example.com/`. The same sign-in sends `///example.com` and `/\example.com` to `https://example.com/` as well. `/auth/login?next=/%2f%2fexample.com` decodes the hidden field to `///example.com` and also opens `https://example.com/`. The hidden `next` field copies the query value through. `signIn` and `chooseWorkspace` treat any string that starts with `/` as safe, and `redirect()` follows a protocol-relative path. The callback uses the same `startsWith("/")` check after a successful code exchange. That success path was not executed. A callback request with no code and `next=//example.com` stays on the login error page. `https://example.com` and `javascript:alert(1)` stay on `/auth/continue`.

Recommended fix: Use the helper already on pull request #1. Do not write a second copy.

### QA-6 — The auth callback changes 127.0.0.1 into localhost

- Severity: **High**
- Status: Open on this tree. The loopback helper is on pull request #1 and passed again this pass. The success path, after a real code exchange, remains untested on both trees.
- Area: Authentication callback
- Files: `src/app/auth/callback/route.ts`

Reproduction:

1. Request `http://127.0.0.1:3000/auth/callback`.
2. Read the `Location` header.

Expected: The redirect stays on `http://127.0.0.1:3000`.

Actual: The response is `307` with `location: http://localhost:3000/auth/login?error=auth`. A request with `Host: evil.example` also redirects to `http://localhost:3000`, so an arbitrary Host is not followed. `X-Forwarded-Host: evil.example` with `X-Forwarded-Proto: https` redirects to `https://localhost:3000/auth/login?error=auth`. The foreign host is not used. The forwarded scheme is. The success path, where the session cookies are set and then the browser changes host, was not executed. Cookies set for `127.0.0.1` are not sent to `localhost`.

Recommended fix: Merge the pull request #1 helper. It builds the redirect from a loopback Host and keeps every other host on the origin Next already reported.

### QA-7 — A narrow screen cannot sign out or switch workspace

- Severity: **High**
- Status: Open on this tree. The nav overflow remains after sign-out is made visible.
- Area: Mobile workspace
- Files: `src/components/workspace-shell.tsx`

Reproduction:

1. Sign in and open `/student/room` at 390×844.
2. Look for Sign out and Switch workspace.
3. Repeat on `/tutor` after choosing the tutor workspace.

Expected: Both actions are on screen.

Actual: Both nodes are in the page, and an ancestor has `display: none` below the `lg` breakpoint (`hidden ... lg:block`). Measured boxes were 0×0 and hidden. There is no other sign-out control in the workspace. The logo goes home and leaves the session cookie in place. At the same width, the student nav `scrollWidth` is 447 and `clientWidth` is 390. The Messages link runs from x=352 with width 83, past the viewport. On `/tutor` at the same width the nav `scrollWidth` is 544, `clientWidth` is 390, Messages runs from x=365 with width 83, and Payments runs from x=452 with width 80. The page `scrollWidth` stays 390. Desktop 1280×900 shows both actions. On `/tutor/payments` Sign out is inside the viewport, and Sign out clears the session.

Recommended fix: Merge the pull request #1 sign-out change. Keep the section nav reachable without a hidden overflow, or make the overflow obvious. The nav overflow remains a low note after sign-out is visible.

### QA-8 — The demo inbox does not open the thread that was clicked

- Severity: **Medium**
- Status: Open on this tree. The inbox row links passed again on pull request #1. Message on a student still opens Emma's thread on that head.
- Area: Tutor messages, tutor student detail
- Files: `src/app/tutor/messages/page.tsx`, `src/app/tutor/students/[id]/page.tsx`

Reproduction:

1. Sign in as a tutor and open `/tutor/messages`.
2. Click Monica Keller.
3. Separately, open `/tutor/students/michael-tran` and click Message.

Expected: Monica's reschedule message is the open thread. Message on Michael opens Michael's thread.

Actual: Monica's row is a `<p>` inside a `<div>` with no link. After the click the URL is still `/tutor/messages` and the open thread is still Emma Reyes ("I got stuck on question 4 of the factoring set."). Monica's preview, "Can we move Wednesday to 5:30 this week?", stays in the list. Message on Michael is a `<span>`. The URL stays `/tutor/students/michael-tran`. Sending is disabled on the demo inbox, and the page says so.

Recommended fix: Merge the inbox links from pull request #1. Point Message on a student at that student's conversation id (`?c=michael` for Michael Tran). On the retested head the link is `/tutor/messages` with no id, and the open thread is still Emma's.

### QA-9 — Score history bars are drawn at zero height

- Severity: **Medium**
- Status: Open on this tree. The chart fix passed again on pull request #1.
- Area: Student progress
- Files: `src/app/student/progress/page.tsx`

Reproduction:

1. Sign in as a student and open `/student/progress`.
2. Look at Score history.

Expected: Bars for 88, 72, 62, and 84.

Actual: The four labels are visible. Each bar element has `style="height:88%"` (and 72%, 62%, 84%) and a measured height of 0. The percentage height is inside a flex column whose own height depends on that bar, so the percentage resolves to nothing.

Recommended fix: Merge the pull request #1 chart. It gives the column a real height and sets each bar as a percentage of that track. This pass measured those bars at 110, 90, 78, and 105 pixels.

### QA-10 — Demo sign-in accepts any password, and the session cookie is readable by script

- Severity: **Medium**
- Status: Open. Reproduced this pass.
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

Actual: The header nav computes to `display: none` below the `md` breakpoint. The three links are in the DOM, measure 0×0, and sit under a hidden ancestor. Sign in and Get started stay visible. About, Pricing, and Trust remain in the footer. The home page does not overflow (`scrollWidth` 390).

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
- Payments says $3,240 this month, outstanding $190 for "2 unpaid invoices", and a next payout of $1,755. The rows on that page are $850 paid, $40 paid, $450 paid, $95 refunded, $320 paid, and $95 failed. The paid rows total $1,660. None of the rows is an unpaid invoice.
- Calendar says 7 booked this week and 5 open blocks. The week grid shows one slot labeled "Open block".

Expected: One schedule and one set of counts.

Actual: Headline numbers are hardcoded and do not match the lists under them.

Recommended fix: Derive the counts from the shared records, or stop showing a second conflicting number.

### QA-14 — The workspace chooser is shown at the protected URL

- Severity: **Medium**
- Status: Open on this tree. The chooser URL fix passed again on pull request #1.
- Area: Authentication
- Files: `src/app/auth/actions.ts`, `src/middleware.ts`

Reproduction:

1. In a fresh session, open `/auth/login?next=/tutor/payments`.
2. Sign in. Do not choose a workspace yet.
3. Separately, sign in with `next=/tutor`.

Expected: The chooser URL is `/auth/continue`, with the return path in that URL.

Actual: `next=/tutor/payments` leaves the address bar at `http://127.0.0.1:3000/tutor/payments` while the page heading is "Choose your workspace". The hidden `next` is still `/tutor/payments`. Choosing Tutor then opens Payments, so the return path is kept. `next=/tutor` does the same: the heading is "Choose your workspace" at `/tutor`. A sign-in with no `next` does open `/auth/continue`. `signIn` redirects straight at `next` before a role exists, and the chooser is rendered on that URL.

Recommended fix: Merge the pull request #1 sign-in path. It sends a signed-in person with no role to `/auth/continue` and carries `next` in that URL.

### QA-15 — Lower-severity notes

- Severity: **Low**
- Status: Open. Reproduced this pass.

- Register placeholder says "At least 12 characters" and the server accepts 8. The error for a shorter password says "Use a password of at least 8 characters." An 8-character password completed registration. File: `src/app/auth/register/page.tsx`.
- `/auth/continue?error=role` does not render an error. The chooser only says who is signed in. This pass opened that URL for `riley.chen.qa41@example.com` and the page still only said "Signed in as riley.chen.qa41@example.com." File: `src/app/auth/continue/page.tsx`.
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
2. Choose student, enter the name Riley Chen, the email `riley.chen.qa41@example.com`, and a password of 8 characters.
3. Submit and read the workspace shell.

Expected: The shell shows Riley Chen.

Actual: The shell shows "Riley Chen Qa41". `signUp` reads the name field and, in demo mode, calls `writeDemoUser(email)` without it. `resolveUser` builds the display name from the email. Known demo addresses still resolve to Sarah Wilson and Emma Reyes. The same registration on pull request #1, with `riley.chen.pr1b@example.com`, showed "Riley Chen Pr1b".

Recommended fix: Store the submitted name on the demo user cookie. Keep `resolveUser` as the fallback when the name is empty.

## Pull request #1

Head: `2b9de32` on `cursor/website-qa-audit-4c9f`. Still open. This pass built it and served it on `127.0.0.1:3001`.

`npm test` ran `src/lib/safe-path.test.ts` and passed 4 tests. `npm run build` passed.

Browser retest of that head:

- Sign-in with `next=//example.com`, `///example.com`, `/\example.com`, and `/%2f%2fexample.com` stayed on `/auth/continue`. The last of those decoded the hidden field to `///example.com` and still stayed on the chooser. `https://example.com` stayed there too.
- Choosing Tutor from `/auth/continue?next=//example.com` opened `/tutor`, not `https://example.com/`.
- `/auth/callback` on `127.0.0.1:3001` redirected to `http://127.0.0.1:3001/auth/login?error=auth`. `Host: evil.example` redirected to `http://localhost:3001`, so the foreign host was not followed. `X-Forwarded-Host: evil.example` with `X-Forwarded-Proto: https` redirected to `https://127.0.0.1:3001`. The foreign host was not used. The forwarded scheme was. The success path after a code exchange was not executed.
- Sign-in with `next=/tutor/payments` opened `/auth/continue?next=%2Ftutor%2Fpayments`. Choosing Tutor then opened Payments.
- Score history bars measured 110, 90, 78, and 105 pixels.
- At 390×844, Sign out and Switch workspace were visible on `/student/room` (63×26 at x=315 and 120×26 at x=195). The Messages link still ran from x=352 with width 83. Nav `scrollWidth` was 447 and `clientWidth` was 390.
- Monica Keller's row is a link to `/tutor/messages?c=monica`. After the click the open thread was the Wednesday 5:30 reschedule, and Emma's factoring message was not the open thread.
- Message on Michael Tran is a link to `/tutor/messages` with no conversation id. The open thread was still Emma's ("I got stuck on question 4 of the factoring set.").
- Registering Riley Chen as `riley.chen.pr1b@example.com` showed "Riley Chen Pr1b".

Do not write a second copy of the redirect helper, the callback host, the chooser URL, the score bars, the narrow sign-out, or the demo inbox links.

## Suggested engineering order

1. Merge pull request #1. This pass rebuilt `2b9de32` and the patch checks passed again. Do not write a second copy.
2. QA-1 password reset, on top of that merged callback. Include the unconfigured-state message.
3. Point Message on a student at that student's conversation id. That remainder of QA-8 is still open on pull request #1.
4. QA-4 profile read policy, visible send errors, and a two-account Supabase retest.
5. QA-3 signed-in student data, or an honest sample-data label.
6. QA-2 unwired actions, either implemented or disabled.
7. QA-10 through QA-16, and the narrow nav overflow, after the highs are closed.
