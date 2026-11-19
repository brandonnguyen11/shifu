# Backlog

Order is the order to build. High QA findings come before new product ideas. Details and reproduction steps are in `docs/qa-report.md`. The 2026-11-19 retest of `main` at `5c6c6e14` (accounts `*.qa191119t1540`) did not change this order. Literal `next=//example.com`, `/%2f%2fexample.com`, and `/\example.com` still leave the site. The helper on pull request #1 rejects `//example.com`, `///example.com`, and `/\example.com`. The `/%2f%2fexample.com` query is decoded to `///example.com` before submit, and that decoded value is rejected. That check was a local function run, not a browser boot. The week grid shows one “Open block” row; the stat still says 5.

## Now

1. **Land the retested patch on pull request #1.** It keeps sign-in on this site (QA-11), keeps a workspace return path on the chooser (QA-12), keeps the auth callback on the loopback host the browser used (QA-13), draws score bars (QA-14), shows sign out on a narrow screen (QA-15), opens the demo inbox row that was clicked, and skips demo enrollment when the secret is missing. Do not write a second copy. The 2026-11-19 retest of `2b9de32` passed those checks.
2. **Message the student who was on screen.** QA-10. Medium, and it is already half-built on that pull request: Message is a link to `/tutor/messages` with no conversation id, so it still opens Emma Reyes. Point it at the student's conversation before live send is enabled.
3. **Password reset that tells the truth.** Spec: `docs/spec.md`. QA-1. High. Button and Enter both. Not started.
4. **Supabase messaging retest.** Let enrollment members read each other's display name, show a send failure in the composer, and prove a message sent by Sarah is visible to Emma. QA-4. High. Blocked on project credentials.
5. **Student room matches the signed-in student.** Or label the current pages as sample data until that data exists. QA-3. High.
6. **Unwired actions.** Join session, start assignment, grade, schedule, and charge either perform the action or render as unavailable. The roster Add student control is in this set. The dashboard control labeled Add student only opens the roster. QA-2. High.

## Next

7. **Demo sign-in copy.** Say that a missing Supabase configuration does not check the password. QA-5. Medium.
8. **Narrow public navigation.** About, Pricing, and Trust reachable from the header below the `md` breakpoint. QA-6. Medium.
9. **Roster search and filters.** Filter the list or remove the controls. QA-7. Medium.
10. **One set of sample numbers.** Session times, roster size, grading count, revenue, and calendar totals stop contradicting the rows on the page. QA-8. Medium.

## Later

11. Register password hint says 12 characters while the rule is 8. QA-9. Low.
12. Demo registration stores a name derived from the email and ignores the name that was typed. QA-9. Low.
13. Show an error on `/auth/continue` when the role update fails. QA-9. Low.
14. Move `src/middleware.ts` to the Next.js `proxy` convention. The current middleware works for the signed-out redirects. QA-9. Low.
15. Workspace nav on a 390px screen should show Messages without horizontal scrolling. QA-9. Low.
16. Mark the demo session cookies `httpOnly` so page script cannot read the signed-in email or role. QA-9. Low.

## Not scheduled

Parent accounts, live video sessions, AI grading, and card charging. The marketing pages mention them. They are not committed work until the items above are closed or explicitly accepted in `docs/release-decision.md`.
