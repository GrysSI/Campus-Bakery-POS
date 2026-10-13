# Campus Bakery POS

A dependency-free desktop web application for the individual IT 415 practical examination, Scenario 2. It uses the six sample bakery products and prices from the examination brief.

## Completed application

Stage 3 - Validation and final improvements

- Project structure and responsive desktop layout
- Six hard-coded bakery products with Philippine-peso prices
- Add-to-cart buttons for every product
- In-memory cart with quantity increase, decrease, and removal controls
- Automatic item subtotals, item count, and order total
- Cash payment with blank, non-numeric, negative, and insufficient-value validation
- Correct change calculation for sufficient payments
- Payment confirmation with a unique transaction reference
- Digital receipt with items, quantities, subtotals, total, amount paid, and change
- New Transaction reset for the cart, payment, confirmation, and receipt

## Run the application

No package installation or database is required.

1. Open this folder.
2. Double-click `index.html`, or open it in a current desktop browser.
3. For a local development server, run a server provided by a class-approved tool and open the displayed local URL.

## Project files

- `index.html` - semantic application layout
- `styles.css` - desktop-first interface styling
- `app.js` - product data, cart calculations, payment validation, receipt generation, and reset behavior

## Final manual checks

1. Open `index.html` in a desktop browser.
2. Confirm that all six products appear with the exact required prices.
3. Add Pandesal twice and Brewed Coffee once. Confirm the cart shows three items and a total of `₱75.00`.
4. Submit a blank payment. Confirm the valid-payment message appears.
5. Try entering letters. Confirm the numeric field rejects them and submission shows the valid-payment message.
6. Enter a negative amount. Confirm it is rejected as invalid.
7. Enter `70`. Confirm the insufficient-payment message requests at least `₱75.00`.
8. Enter `75`. Confirm payment succeeds with `₱0.00` change and a transaction reference.
9. Start a new transaction and rebuild the same `₱75.00` order.
10. Enter `100`. Confirm payment succeeds with `₱25.00` change.
11. Confirm the receipt items, quantities, subtotals, total, amount paid, change, and reference match the completed order.
12. Select New Transaction. Confirm the cart is empty, total is `₱0.00`, payment is blank and disabled, receipt is hidden, and product buttons work again.
13. Use the Tab and Enter keys to confirm all active controls work with a keyboard and show a visible focus outline.

## Implementation stages

1. Setup and interface - completed
2. Ordering and calculations - completed
3. Validation and final improvements - completed

