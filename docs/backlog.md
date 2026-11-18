# Backlog

Order is the order to build. High QA findings come before new product ideas. Details and reproduction steps are in `docs/qa-report.md`.

## Now

1. **Password reset that tells the truth.** Spec: `docs/spec.md`. QA-1. High.
2. **Supabase messaging retest.** Let enrollment members read each other's display name, show a send failure in the composer, and prove a message sent by Sarah is visible to Emma. QA-4. High. Blocked on project credentials.
3. **Student room matches the signed-in student.** Or label the current pages as Emma Reyes's sample room until that data exists. QA-3. High.
4. **Unwired actions.** Join session, start assignment, grade, schedule, and charge either perform the action or render as unavailable. The roster Add student control is in this set. The dashboard button labeled Add student only opens the roster. QA-2. High.

## Next

5. **Message the student you clicked.** The Message action on a student opens that student's thread. Today it opens Emma Reyes's. QA-10. Medium. Do this before live send is enabled.
6. **Demo sign-in copy.** Say that a missing Supabase configuration does not check the password. QA-5. Medium.
7. **Narrow public navigation.** About, Pricing, and Trust reachable from the header below the `md` breakpoint. QA-6. Medium.
8. **Roster search and filters.** Filter the list or remove the controls. QA-7. Medium.
9. **One set of sample numbers.** Session times, roster size, grading count, revenue, and calendar totals stop contradicting the rows on the page. QA-8. Medium. The retest also saw the assignments "active" count and the payments payout disagree with the rows.

## Later

10. Register password hint says 12 characters while the rule is 8. QA-9. Low.
11. Show an error on `/auth/continue` when the role update fails. QA-9. Low.
12. Move `src/middleware.ts` to the Next.js `proxy` convention. The current middleware works. QA-9. Low.
13. Workspace nav on a 390px screen should show Messages without horizontal scrolling. QA-9. Low.
14. Mark the demo session cookies `httpOnly` so page script cannot read the signed-in email or role. QA-9. Low.

## Not scheduled

Parent accounts, live video sessions, AI grading, and card charging. The marketing pages mention them. They are not committed work until the items above are closed or explicitly accepted in `docs/release-decision.md`.
