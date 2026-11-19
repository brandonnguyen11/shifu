# Backlog

Order is the order to build. High QA findings come before new product ideas. Details and reproduction steps are in `docs/qa-report.md`.

## Now

1. **Merge the retested host patch.** QA-5 and QA-6. High. On this tree, `next=//example.com`, `///example.com`, `/\example.com`, and `next=/%2f%2fexample.com` land on `https://example.com/`. The last of those decodes the hidden field to `///example.com`. Submitting the workspace chooser with `next=//example.com` does the same. `/auth/callback` on `127.0.0.1` redirects to `localhost`. A foreign Host is not followed. A full-site pass on 2026-11-19, started from docs commit `55c6941`, reproduced those cases again on application commit `5c6c6e14`. Sign-in with `next=//example.com` requested `http://example.com/` before landing on `https://example.com/`. Curl confirmed the callback `Location` headers. Pull request #1 is still `2b9de32`. This pass rebuilt that head. `npm test` passed 4 safe-path tests. The browser retest passed again, including the chooser submit, the chooser URL, the score bars, narrow sign-out, and the Monica inbox row. Merge that pull request. Do not write a second copy.
2. **Password reset that tells the truth.** Spec: `docs/spec.md`. QA-1. High. Starts after item 1 is merged, because the recovery link uses the callback. The pull request #1 retest passed again on 2026-11-19, started from docs commit `55c6941`, so this slice is no longer waiting on an untested patch. On this tree, and on that head, clicking Send reset link, pressing Enter, and a native submit put the address in the query string and show the same claim. Both paths have to tell the truth.
3. **Supabase messaging retest.** Let enrollment members read each other's display name, skip admin enrollment when the secret key is missing, show a send failure in the composer, and prove a message sent by Sarah is visible to Emma. QA-4. High. The missing-secret guard is already in pull request #1. The profile read policy and the composer error are not. The runtime half is blocked on project credentials.
4. **Student room matches the signed-in student.** Or label the current pages as Emma Reyes's sample room until that data exists. QA-3. High.
5. **Unwired actions.** Join session, start assignment, grade, schedule, and charge either perform the action or render as unavailable. The roster Add student control is in this set. The dashboard button labeled Add student only opens the roster. QA-2. High.
6. **Sign out on a narrow screen.** Show Sign out and Switch workspace at 390px. QA-7. High. The pull request #1 retest showed both controls at 390px. Merge it with item 1. The Messages link still runs past the viewport. That overflow is the later low note.

## Next

7. **Open the demo thread that was clicked.** Inbox rows select a conversation. That part passed on pull request #1. Message on a student still opens Emma's thread, including on that head. Point it at the student's conversation id. QA-8. Medium.
8. **Draw the score history.** The four bars on `/student/progress` are 0px tall on this tree. QA-9. Medium. Pull request #1 draws them at 110, 90, 78, and 105 pixels. Merge that change with item 1.
9. **Demo sign-in copy and cookie flags.** Say that a missing Supabase configuration does not check the password. Mark the demo cookies `httpOnly`. QA-10. Medium.
10. **Narrow public navigation.** About, Pricing, and Trust reachable from the header below the `md` breakpoint. QA-11. Medium.
11. **Roster search and filters.** Filter the list or remove the controls. QA-12. Medium.
12. **One set of sample numbers.** Session times, roster size, grading count, and revenue stop contradicting the rows on the page. QA-13. Medium.
13. **Chooser URL.** On this tree, a hydrated sign-in with a return path to `/tutor/payments` shows the chooser at that protected URL. Choosing Tutor still opens Payments. A request that sends only the user cookie is sent to `/auth/continue`. QA-14. Medium. Pull request #1 opens `/auth/continue?next=%2Ftutor%2Fpayments` and then Payments. Merge that change with item 1.

## Later

14. Demo registration stores a name built from the email and drops the name the person typed. QA-16. Low.
15. Register password hint says 12 characters while the rule is 8. QA-15. Low.
16. Show an error on `/auth/continue` when the role update fails. QA-15. Low.
17. Move `src/middleware.ts` to the Next.js `proxy` convention. The current middleware's role redirects work. QA-15. Low.
18. Workspace nav on a 390px screen should show Messages without the link running past the viewport. QA-7 note. Low.
19. Footer X, LinkedIn, and GitHub links currently point at `/`. QA-15. Low.

## Not scheduled

Parent accounts, live video sessions, AI grading, and card charging. The marketing pages mention them. They are not committed work until the items above are closed or explicitly accepted in `docs/release-decision.md`.
