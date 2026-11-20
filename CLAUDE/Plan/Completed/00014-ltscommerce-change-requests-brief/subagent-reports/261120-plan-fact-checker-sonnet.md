# Plan fact check: 00014-ltscommerce-change-requests-brief

Scope: claims added or changed by the diff. Most of the diff is re-indentation of Phase 2 to 5 bullets; those lines carry old claims, and I checked only the ones the new text depends on. Owner rulings (the 2026-11-20 decisions) are not claims about the code and were skipped.

## REFUTED

1. Task 4.7 (re-indented line) says "no VAT number given so none is displayed". `src/components/layout/Footer.tsx:93` shows "VAT registered, VAT No. 452436402", and `src/pages/Privacy.tsx:25` shows it too. The same sentence says the phrase was added to Privacy.tsx's "Who this is" section. The plan should say the number is now displayed. This matches commit 360b3b0 "Show the VAT number in the footer and privacy notice".
2. Tasks 4.1 and 4.2 (new resolution text, re-indented bullets) put the offer cards and the Capacity bullet in `Contact.tsx`. The new resolution text says "Task 4.1, done" and "the Capacity bullet stands without figures". `grep` in `src/pages/Contact.tsx` finds no "Capacity" and no "for a quote". Both live in `src/pages/Services.tsx`: Capacity at lines 196-200, the offer cards at lines 226-253, with "Fixed price, get in touch for a quote" at lines 240 and 250. The claims about the wording are right, but the file is wrong.

## Table

| #   | Claim                                                                                | Verdict               | Evidence                                                                                                           |
| --- | ------------------------------------------------------------------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | Offer cards read "Fixed price, get in touch for a quote"                             | VERIFIED              | `Services.tsx:240`, `Services.tsx:250`                                                                             |
| 2   | Offer cards are in Contact.tsx (Task 4.1)                                            | REFUTED               | They are in `Services.tsx`; `Contact.tsx` has no such text                                                         |
| 3   | The Capacity bullet exists and gives no hour figures (Task 4.2)                      | VERIFIED              | `Services.tsx:196-200`: "an agreed monthly minimum and maximum, billed hourly", no numbers                         |
| 4   | Capacity bullet is in Contact's "How I Work"                                         | REFUTED               | It is in `Services.tsx`; no match in `Contact.tsx`                                                                 |
| 5   | `actions-hub` is kept off `/open-source`                                             | VERIFIED              | `grep -rn actions-hub src public` returns nothing                                                                  |
| 6   | The drafted LinkedIn headline is under the 220-character limit                       | PARTLY VERIFIED       | The draft is 174 characters (`wc -m`). The 220 limit is a LinkedIn product fact and cannot be checked in this repo |
| 7   | GitHub allows up to six pinned repos                                                 | UNVERIFIABLE-HERE     | External product fact. The plan's later text lists six pins, which is consistent with it                           |
| 8   | No VAT number is displayed (Task 4.7)                                                | REFUTED               | `Footer.tsx:93`, `Privacy.tsx:25`                                                                                  |
| 9   | `edmondscommerce` is the primary LinkedIn profile and the headline is ready to paste | Owner ruling, skipped |                                                                                                                    |
