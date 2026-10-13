# AI-Assisted Development Log

Project: Campus Bakery POS  
AI tool: Codex  
Student evaluation status: **Pending personal review before submission**

This log records real prompts and observed development work from this project. The technical verification notes are factual results from the development session. Sections labeled **Student evaluation** must be completed by the student in their own words after reviewing, testing, and understanding the code.

## Entry 1 - Setup and feature planning

Date: October 13, 2026

### Exact prompt used

```text
Scenario 2 — Campus Bakery POS 
This prompt uses the bakery’s six sample products and prices from page 2. IT415-Practical 
Exam - POS Syst… 
Context: I am developing a Campus Bakery Point-of-Sale System for my individual IT 415 
practical examination. The bakery sells bread, pastries, baked goods, and beverages. The 
application must work on a desktop or laptop with a mouse and keyboard within the 
examination’s 150-minute development period. 
Objective: Develop a functional application that allows users to browse bakery products, 
manage a cart, review an order, enter cash payment, validate payment, receive 
confirmation and a digital receipt, and start another transaction. 
Requirements: Display Pandesal (pack of 5) at ₱25.00, Ensaymada at ₱20.00, Spanish 
Bread at ₱15.00, Chocolate Cupcake at ₱30.00, Loaf Bread at ₱55.00, and Brewed Coffee 
(cup) at ₱25.00. 
Provide on-screen buttons for adding products, increasing and decreasing quantities, and 
removing items. Automatically recalculate item subtotals and the overall total whenever 
the cart changes. Show a clear order summary with the items, quantities, subtotals, and 
total. 
Accept cash through a numeric input field and reject blank, non-numeric, negative, and 
insufficient payments with clear messages. Calculate change as the amount paid minus 
the total after a valid, sufficient payment, then display payment confirmation. Generate a 
digital receipt containing the items, quantities, subtotals, total, amount paid, change, and 
transaction reference. Starting a new transaction must clear the cart, payment, and 
previous receipt. 
Constraints: Use [TOOLS COVERED IN CLASS]. Hard-code the products and prices and 
use memory or simple local structures for transaction data. Do not add a database, login, 
inventory management, payment gateway, QR payment, card payment, or deployment. 
Keep the interface simple and suitable for mouse and keyboard use. Modify only relevant 
sections when improving existing code. 
Expected Output: Provide readable code with filenames, useful comments, short 
explanations, setup instructions, and manual testing steps. Divide implementation into 
setup and interface, ordering and calculations, and validation and final improvements. 
Provide one stage at a time so I can review, test, and commit the actual changes before 
proceeding.
```

### Purpose of the prompt

Define the complete Campus Bakery POS scope, required products, constraints, staged development process, and expected evidence before implementation began.

### AI response summary

The AI inspected the nearly empty repository and selected plain HTML, CSS, and JavaScript as a dependency-free implementation. It created the Stage 1 layout, hard-coded and rendered the six required products, added setup instructions and manual checks, and intentionally left later transaction controls disabled for staged review.

### Observed evaluation and verification

- All six required names and prices rendered in the browser.
- JavaScript syntax passed `node --check app.js`.
- Browser inspection found no console errors.
- A narrow-window horizontal scrollbar was discovered during visual testing.

### Modifications made during the AI-assisted session

- The body minimum-width rule was removed after visual testing exposed horizontal overflow in a narrow viewport.
- Ordering, payment, and receipt behavior were deferred to later stages so the first commit represented only setup and interface work.

### Student evaluation - complete before submission

Status: **Pending**

In your own words, state whether the response was correct, partially correct, or incorrect; explain what you accepted or rejected; and confirm that you can explain the generated HTML, CSS, and product-rendering JavaScript.

Related evidence: commit `20cb9cf` (`Stage 1 Setup and Interface`).

## Entry 2 - Payment validation and final transaction flow

Date: October 13, 2026

### Exact prompt used

```text
Continue Stage 3
```

This prompt relied on the requirements and staged scope already established in Entry 1 and the completed Stage 2 cart implementation.

### Purpose of the prompt

Complete cash validation, change computation, payment confirmation, digital receipt generation, transaction locking, reset behavior, documentation, and final browser testing.

### AI response summary

The AI added reusable payment validation, cent-based currency rounding, transaction snapshots, unique references, receipt rendering, completed-transaction locking, and New Transaction reset behavior. It also expanded the README with final manual test steps.

### Observed evaluation and verification

- Blank, negative, and insufficient payments displayed clear messages.
- The numeric field rejected alphabetic characters.
- Exact payment of `₱75.00` produced `₱0.00` change.
- Payment of `₱100.00` produced `₱25.00` change.
- Receipt totals matched the cart and confirmation.
- New Transaction cleared prior state and restored ordering controls.
- No browser console errors were observed.

### Modifications made during the AI-assisted session

- The blank-payment message was changed to `Please enter a valid non-negative payment amount.` so blank and browser-rejected non-numeric input receive the same explicit guidance.
- A transaction snapshot was used for receipt data so later state changes cannot make receipt values disagree with the completed order.
- Product, cart, and payment controls were disabled after payment to prevent changes to a completed transaction.

### Student evaluation - complete before submission

Status: **Pending**

In your own words, state whether the implementation was correct, partially correct, or incorrect; record any changes you personally made after review; and confirm that you can explain validation, change calculation, receipt generation, transaction references, and reset behavior.

Related evidence: commit `f56a094` (`Stage 3 Validation and Improvement`) and `FINAL_VERIFICATION.md`.

## Entry 3 - Final visual audit and debugging

Date: October 13, 2026

### Exact prompt used

```text
Continue Stage 4
```

### Purpose of the prompt

Run the final acceptance checks, inspect Git evidence, document actual AI use, and identify any remaining issues before submission.

### AI response summary

The AI repeated the complete transaction flow in the browser, checked source syntax and Git history, prepared the final verification report, and visually inspected the populated order interface and completed receipt.

### Observed debugging result

The screenshot inspection showed the empty-cart message still visible above populated cart items. The cause was a CSS cascade conflict: `.empty-state { display: grid; }` overrode the browser's default rendering of the element's `hidden` attribute.

### Modification made

The following focused rule was added to `styles.css`:

```css
.empty-state[hidden] {
  display: none;
}
```

The cart was then retested to confirm the empty state disappears when items exist and returns after New Transaction clears the cart.

### Student evaluation - complete before submission

Status: **Pending**

Explain in your own words why the `hidden` attribute did not work with the existing CSS, why the new selector fixes it, and how you verified both populated-cart and empty-cart states.

Related evidence: `styles.css` and `FINAL_VERIFICATION.md`.

