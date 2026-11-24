# Fact check: plan 003 closure (2026-11-24)

Scope: claims added by `git diff` of PLAN.md (the supplied diff file held a different, earlier fact-check, so `git diff -- PLAN.md` was used).

## REFUTED

1. "`85b422e1` ... added ... a React Hook Form + Zod `src/pages/Contact.tsx` that posts to `VITE_CONTACT_FORM_URL` and falls back to mailto."
   The mailto fallback was NOT in `85b422e1`. `git show 85b422e1:src/pages/Contact.tsx` has RHF + zodResolver (lines 2-3, 39-40) and reads `VITE_CONTACT_FORM_URL` (line 61), but it contains no "mailto" at all. When the URL is unset it only shows an error text telling the user to email the address. The mailto fallback (`a.href = mailto`) was introduced by `d81002a2` (2026-02-20, "Plan 010: fix all ESLint violations for go-live"). It is true of the current file (src/pages/Contact.tsx:58-63). Change: drop "and falls back to mailto" from the commit's description, or attribute it to the current Contact.tsx / Plan 010.

## Claims

| #   | Claim                                                          | Verdict                                           | Evidence                                                                       |
| --- | -------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | Delivered the day the plan was written, in `85b422e1`          | VERIFIED                                          | `85b422e1` dated 2026-02-20; plan "Created: 2026-02-20".                       |
| 2   | Commit message "Plan 003: Contact form via Google Apps Script" | VERIFIED                                          | `git show -s 85b422e1`.                                                        |
| 3   | Commit added `google-apps-script/Code.gs` and `SETUP.md`       | VERIFIED                                          | `git show --stat`: Code.gs +633, SETUP.md +363.                                |
| 4   | Commit added RHF + Zod Contact.tsx                             | VERIFIED                                          | react-hook-form and zodResolver imports at lines 2-3 of that revision.         |
| 5   | Posts to `VITE_CONTACT_FORM_URL`                               | VERIFIED                                          | Line 61 of that revision; also in the current file (src/pages/Contact.tsx:58). |
| 6   | Falls back to mailto                                           | REFUTED for the commit; VERIFIED for current file | See above.                                                                     |
| 7   | Plan Status Complete                                           | VERIFIED                                          | Diff flips both status lines.                                                  |
