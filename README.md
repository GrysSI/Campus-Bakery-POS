# Campus Bakery POS

A dependency-free desktop web application for the individual IT 415 practical examination, Scenario 2. It uses the six sample bakery products and prices from the examination brief.

## Current implementation stage

Stage 2 - Ordering and calculations

- Project structure and responsive desktop layout
- Six hard-coded bakery products with Philippine-peso prices
- Add-to-cart buttons for every product
- In-memory cart with quantity increase, decrease, and removal controls
- Automatic item subtotals, item count, and order total
- Payment, confirmation, receipt, and reset controls intentionally disabled until Stage 3

## Run the application

No package installation or database is required.

1. Open this folder.
2. Double-click `index.html`, or open it in a current desktop browser.
3. For a local development server, run a server provided by a class-approved tool and open the displayed local URL.

## Project files

- `index.html` - semantic application layout
- `styles.css` - desktop-first interface styling
- `app.js` - hard-coded product data, currency formatting, and product rendering

## Stage 2 manual checks

1. Open `index.html` in a desktop browser.
2. Confirm that all six products appear with the exact required prices.
3. Add Pandesal twice and Brewed Coffee once. Confirm the cart shows three items and a total of `₱75.00`.
4. Decrease Pandesal to one. Confirm its subtotal is `₱25.00`, the cart shows two items, and the total is `₱50.00`.
5. Increase Brewed Coffee to two. Confirm its subtotal is `₱50.00`, the cart shows three items, and the total is `₱75.00`.
6. Remove Brewed Coffee. Confirm only Pandesal remains and the total is `₱25.00`.
7. Remove Pandesal. Confirm the empty-cart message, zero item count, and `₱0.00` total return.
8. Use the Tab key to reach Add, quantity, and Remove controls and confirm a visible focus outline.
9. Confirm cash payment, confirmation, receipt, and New Transaction controls remain disabled.

## Planned implementation stages

1. Setup and interface - completed
2. Ordering and calculations - current stage
3. Validation and final improvements - cash validation, change, confirmation, receipt, reset, and final testing

