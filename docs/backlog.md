# Backlog

Order is the order to build. High QA findings come before new product ideas. Details and reproduction steps are in `docs/qa-report.md`.

## Now

1. **Keep sign-in and the auth callback on this host.** QA-5 and QA-6. High. `next=//example.com` currently opens `https://example.com/`, and `/auth/callback` on `127.0.0.1` redirects to `localhost`. A patch is already on pull request #1. Retest that head and merge it, or redo the helper only if that patch fails the retest.
2. **Password reset that tells the truth.** Spec: `docs/spec.md`. QA-1. High. Starts after item 1, because the recovery link uses the callback.
3. **Supabase messaging retest.** Let enrollment members read each other's display name, skip admin enrollment when the secret key is missing, show a send failure in the composer, and prove a message sent by Sarah is visible to Emma. QA-4. High. The missing-secret guard is already in pull request #1. The profile read policy and the composer error are not. The runtime half is blocked on project credentials.
4. **Student room matches the signed-in student.** Or label the current pages as Emma Reyes's sample room until that data exists. QA-3. High.
5. **Unwired actions.** Join session, start assignment, grade, schedule, and charge either perform the action or render as unavailable. The roster Add student control is in this set. The dashboard button labeled Add student only opens the roster. QA-2. High.
6. **Sign out on a narrow screen.** Show Sign out and Switch workspace at 390px. QA-7. High.

## Next

7. **Open the demo thread that was clicked.** Inbox rows select a conversation. Message on a student opens that student. QA-8. Medium.
8. **Draw the score history.** The four bars on `/student/progress` are 0px tall. QA-9. Medium.
9. **Demo sign-in copy and cookie flags.** Say that a missing Supabase configuration does not check the password. Mark the demo cookies `httpOnly`. QA-10. Medium.
10. **Narrow public navigation.** About, Pricing, and Trust reachable from the header below the `md` breakpoint. QA-11. Medium.
11. **Roster search and filters.** Filter the list or remove the controls. QA-12. Medium.
12. **One set of sample numbers.** Session times, roster size, grading count, and revenue stop contradicting the rows on the page. QA-13. Medium. The retest also showed dashboard "Awaiting review" as 9 against assignments "Needs grading" of 2, and calendar "Booked this week" as 7 while one of those seven slots is an open block.
13. **Chooser URL.** A return path to `/tutor/payments` shows the chooser at `/tutor/payments`. Choosing Tutor still opens payments. QA-14. Medium.

## Later

14. Register password hint says 12 characters while the rule is 8. QA-15. Low.
15. Show an error on `/auth/continue` when the role update fails. QA-15. Low.
16. Move `src/middleware.ts` to the Next.js `proxy` convention. The current middleware's role redirects work. QA-15. Low.
17. Workspace nav on a 390px screen should show Messages without the link running past the viewport. QA-7 note. Low.
18. Footer X, LinkedIn, and GitHub links currently point at `/`. QA-15. Low.

## Not scheduled

Parent accounts, live video sessions, AI grading, and card charging. The marketing pages mention them. They are not committed work until the items above are closed or explicitly accepted in `docs/release-decision.md`.
