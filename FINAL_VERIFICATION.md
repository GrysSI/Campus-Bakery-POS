# Final Verification and Submission Status

Audit date: October 13, 2026 (Asia/Manila)

This document records checks that were actually performed against the Campus Bakery POS. A checked item is backed by a browser observation, source check, or local Git evidence from this audit. Pending items are intentionally left unchecked.

## Verification environment

- Application opened from `http://127.0.0.1:8765/` in a desktop browser.
- Source state at the start of the audit: commit `f56a094` (`Stage 3 Validation and Improvement`).
- JavaScript syntax check: `node --check app.js` - passed.
- Whitespace/error check: `git diff --check` - passed.
- Browser console errors during the acceptance flow: none observed.

## Required application behavior

- [x] The application opened successfully using the documented local setup.
- [x] All six required bakery products appeared with the correct Philippine-peso prices.
- [x] Product buttons added items to the cart.
- [x] Quantity increase changed Pandesal from 1 to 2 and recalculated its subtotal from `₱25.00` to `₱50.00`.
- [x] Quantity decrease changed Pandesal from 2 to 1 and recalculated its subtotal to `₱25.00`.
- [x] Brewed Coffee was removed independently without removing Pandesal.
- [x] The order summary displayed product names, quantities, unit prices, subtotals, item count, and total.
- [x] Two Pandesal packs plus one Brewed Coffee produced 3 items and a `₱75.00` total.
- [x] The payment field was disabled for an empty cart and enabled after adding an item.
- [x] Blank payment displayed `Please enter a valid non-negative payment amount.`
- [x] Alphabetic input was rejected by the numeric field; submission retained the same valid-payment message.
- [x] Payment of `-1` was rejected with the valid non-negative payment message.
- [x] Payment of `70` against a `₱75.00` total displayed `Insufficient payment. Please enter at least ₱75.00.`
- [x] Payment of `₱75.00` against a `₱75.00` total succeeded with `₱0.00` change.
- [x] Payment of `₱100.00` against a `₱75.00` total succeeded with `₱25.00` change.
- [x] The confirmation and receipt used the same total, amount paid, change, and transaction reference.
- [x] The receipt listed Pandesal quantity 2 with `₱50.00` subtotal and Brewed Coffee quantity 1 with `₱25.00` subtotal.
- [x] Ordering and payment controls locked after successful payment.
- [x] Two completed test transactions generated distinct references: `CB-MV6B1WOM` and `CB-MV6B2BMZ`.
- [x] New Transaction cleared the cart, total, payment value, confirmation, receipt rows, and previous reference, then re-enabled product buttons.
- [x] Product selection, removal, and payment submission were successfully activated with the Enter key.
- [x] No horizontal page overflow was observed in the narrow browser preview used during the audit.

## Defect found and corrected during Stage 4

The visual audit found that the empty-cart message remained visible after products were added. The `.empty-state` grid display rule was overriding the element's HTML `hidden` attribute. A focused `.empty-state[hidden] { display: none; }` rule was added to `styles.css`. The populated-cart and reset states were then retested to confirm the message is hidden when items exist and visible only after the cart is cleared.

## Git and repository evidence

Configured remote: `https://github.com/GrysSI/Campus-Bakery-POS.git`

| Commit | Observed message | Evidence represented |
| --- | --- | --- |
| `70aa993` | Initial commit | Repository initialization |
| `20cb9cf` | Stage 1 Setup and Interface | Basic interface and product display |
| `7d7e7d9` | Stage 2 Ordering and Calculation | Cart controls, quantities, subtotals, and total |
| `f56a094` | Stage 3 Validation and Improvement | Payment validation, receipt, and reset |

At the start of Stage 4, local `main` and `origin/main` reported 0 commits ahead and 0 behind through `f56a094`.

## Submission items still pending

- [ ] Review and complete the student-evaluation fields in `AI_DEVELOPMENT_LOG.md` using your own words.
- [ ] Capture a screenshot showing the six-product catalog.
- [ ] Capture a screenshot showing a populated cart and `₱75.00` total.
- [ ] Capture a screenshot showing payment validation or successful confirmation.
- [ ] Capture a screenshot showing the complete digital receipt.
- [ ] Capture a screenshot of the GitHub commit history after the Stage 4 documentation commit is pushed.
- [ ] Commit these Stage 4 documentation files with a meaningful message.
- [ ] Push the Stage 4 commit and verify it appears on GitHub.
- [ ] Confirm the repository link is accessible to the instructor.

Do not mark a pending item complete until its evidence has been personally inspected.

