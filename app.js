// The exam's six products stay in one clear, reusable data source.
const products = Object.freeze([
  { id: "pandesal", name: "Pandesal (pack of 5)", price: 25, category: "Bread" },
  { id: "ensaymada", name: "Ensaymada", price: 20, category: "Pastry" },
  { id: "spanish-bread", name: "Spanish Bread", price: 15, category: "Bread" },
  { id: "chocolate-cupcake", name: "Chocolate Cupcake", price: 30, category: "Baked Good" },
  { id: "loaf-bread", name: "Loaf Bread", price: 55, category: "Bread" },
  { id: "brewed-coffee", name: "Brewed Coffee (cup)", price: 25, category: "Beverage" },
]);

// Cart quantities are stored in memory, keyed by product ID.
const cart = new Map();
let completedTransaction = null;
let activeCategoryFilter = "all";

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function getCartItems() {
  return [...cart.entries()].map(([productId, quantity]) => {
    const product = getProduct(productId);
    return {
      ...product,
      quantity,
      subtotal: product.price * quantity,
    };
  });
}

function getCartTotal(items = getCartItems()) {
  return items.reduce((total, item) => total + item.subtotal, 0);
}

function getCartItemCount(items = getCartItems()) {
  return items.reduce((count, item) => count + item.quantity, 0);
}

function roundCurrency(amount) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

function validatePayment(rawValue, total) {
  const normalizedValue = String(rawValue).trim();

  if (!normalizedValue) {
    return { valid: false, message: "Please enter a valid non-negative payment amount." };
  }

  const amountPaid = Number(normalizedValue);
  if (!Number.isFinite(amountPaid) || amountPaid < 0) {
    return { valid: false, message: "Please enter a valid non-negative payment amount." };
  }

  if (amountPaid < total) {
    return {
      valid: false,
      message: `Insufficient payment. Please enter at least ${formatCurrency(total)}.`,
    };
  }

  return {
    valid: true,
    amountPaid: roundCurrency(amountPaid),
    change: roundCurrency(amountPaid - total),
  };
}

function updateStatus(message) {
  const statusEl = document.querySelector("#app-status");
  if (statusEl) {
    statusEl.textContent = message;
  }
}

function clearPaymentMessage() {
  const message = document.querySelector("#payment-message");
  const input = document.querySelector("#cash-amount");
  if (message) {
    message.hidden = true;
    message.textContent = "";
  }
  if (input) {
    input.removeAttribute("aria-invalid");
  }
}

function showPaymentError(messageText) {
  const message = document.querySelector("#payment-message");
  const input = document.querySelector("#cash-amount");
  if (message) {
    message.textContent = messageText;
    message.hidden = false;
  }
  if (input) {
    input.setAttribute("aria-invalid", "true");
    input.focus();
  }
}

function syncTransactionControls() {
  const hasItems = cart.size > 0;
  const transactionComplete = completedTransaction !== null;
  const paymentInput = document.querySelector("#cash-amount");
  const confirmButton = document.querySelector("#confirm-payment");
  const paymentHelp = document.querySelector("#payment-help");
  const openPaymentBtn = document.querySelector("#open-payment-btn");
  const openReviewBtn = document.querySelector("#open-review-btn");
  const paymentDueDisplay = document.querySelector("#payment-amount-due");
  const subtotalDisplay = document.querySelector("#order-subtotal");

  const total = getCartTotal();

  if (paymentInput) paymentInput.disabled = !hasItems || transactionComplete;
  if (confirmButton) confirmButton.disabled = !hasItems || transactionComplete;
  if (openPaymentBtn) openPaymentBtn.disabled = !hasItems || transactionComplete;
  if (openReviewBtn) openReviewBtn.disabled = !hasItems || transactionComplete;

  if (subtotalDisplay) subtotalDisplay.textContent = formatCurrency(total);
  if (paymentDueDisplay) paymentDueDisplay.textContent = formatCurrency(total);

  if (paymentHelp) {
    if (transactionComplete) {
      paymentHelp.textContent = "Payment completed. Start a new transaction to order again.";
    } else if (hasItems) {
      paymentHelp.textContent = `Amount due: ${formatCurrency(total)}.`;
    } else {
      paymentHelp.textContent = "Add at least one product before entering a cash payment.";
    }
  }

  document.querySelectorAll("#product-grid button, #cart-list button").forEach((button) => {
    if (transactionComplete) button.disabled = true;
  });
}

function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card";
  article.dataset.category = product.category;

  const category = document.createElement("span");
  category.className = "product-category";
  category.textContent = product.category;

  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = formatCurrency(product.price);

  const cardActions = document.createElement("div");
  cardActions.className = "product-card-actions";

  const detailsButton = document.createElement("button");
  detailsButton.type = "button";
  detailsButton.className = "secondary-button product-details-btn";
  detailsButton.dataset.detailsId = product.id;
  detailsButton.textContent = "Details";
  detailsButton.setAttribute("aria-label", `View details for ${product.name}`);

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "primary-button product-add-btn";
  addButton.dataset.productId = product.id;
  addButton.textContent = "Add to Cart";
  addButton.setAttribute("aria-label", `Add ${product.name} to cart`);

  cardActions.append(detailsButton, addButton);
  article.append(category, name, price, cardActions);
  return article;
}

function renderProducts() {
  const productGrid = document.querySelector("#product-grid");
  const productCount = document.querySelector("#product-count");

  const filteredProducts = activeCategoryFilter === "all"
    ? products
    : products.filter((p) => p.category === activeCategoryFilter);

  const cards = filteredProducts.map(createProductCard);
  productGrid.replaceChildren(...cards);
  productCount.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}`;
}

function createQuantityButton(label, action, item, disabled = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "quantity-button";
  button.dataset.action = action;
  button.dataset.productId = item.id;
  button.textContent = label;
  button.disabled = disabled;

  const actionName = action === "increase" ? "Increase" : "Decrease";
  button.setAttribute("aria-label", `${actionName} ${item.name} quantity`);
  return button;
}

function createCartItem(item) {
  const article = document.createElement("article");
  article.className = "cart-item";

  const details = document.createElement("div");
  details.className = "cart-item-details";

  const name = document.createElement("h3");
  name.textContent = item.name;

  const unitPrice = document.createElement("p");
  unitPrice.textContent = `${formatCurrency(item.price)} each`;
  details.append(name, unitPrice);

  const subtotal = document.createElement("strong");
  subtotal.className = "cart-item-subtotal";
  subtotal.textContent = formatCurrency(item.subtotal);

  const controls = document.createElement("div");
  controls.className = "cart-item-controls";

  const quantityControls = document.createElement("div");
  quantityControls.className = "quantity-controls";

  const decreaseButton = createQuantityButton("−", "decrease", item, item.quantity === 1);
  const quantity = document.createElement("span");
  quantity.className = "quantity-value";
  quantity.textContent = item.quantity;
  quantity.setAttribute("aria-label", `${item.name} quantity: ${item.quantity}`);
  const increaseButton = createQuantityButton("+", "increase", item);

  quantityControls.append(decreaseButton, quantity, increaseButton);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove-button";
  removeButton.dataset.action = "remove";
  removeButton.dataset.productId = item.id;
  removeButton.textContent = "Remove";
  removeButton.setAttribute("aria-label", `Remove ${item.name} from cart`);

  controls.append(quantityControls, removeButton);
  article.append(details, subtotal, controls);
  return article;
}

function renderCart() {
  const items = getCartItems();
  const itemCount = getCartItemCount(items);
  const total = getCartTotal(items);

  const emptyMessage = document.querySelector("#empty-cart-message");
  const cartList = document.querySelector("#cart-list");
  const cartCount = document.querySelector("#cart-count");
  const orderTotal = document.querySelector("#order-total");

  emptyMessage.hidden = items.length > 0;
  cartList.hidden = items.length === 0;
  cartList.replaceChildren(...items.map(createCartItem));
  cartCount.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
  orderTotal.textContent = formatCurrency(total);
  syncTransactionControls();
}

function addToCart(productId) {
  if (completedTransaction) return;
  const product = getProduct(productId);
  if (!product) return;

  cart.set(productId, (cart.get(productId) ?? 0) + 1);
  clearPaymentMessage();
  renderCart();
  updateStatus(`${product.name} added. Cart total: ${formatCurrency(getCartTotal())}.`);
}

function changeQuantity(productId, change) {
  if (completedTransaction) return;
  const currentQuantity = cart.get(productId);
  if (!currentQuantity) return;

  const nextQuantity = currentQuantity + change;
  if (nextQuantity < 1) return;

  cart.set(productId, nextQuantity);
  clearPaymentMessage();
  renderCart();

  const product = getProduct(productId);
  updateStatus(`${product.name} quantity updated to ${nextQuantity}.`);
}

function removeFromCart(productId) {
  if (completedTransaction) return;
  const product = getProduct(productId);
  if (!product || !cart.delete(productId)) return;

  clearPaymentMessage();
  renderCart();
  updateStatus(`${product.name} removed from the cart.`);
}

function generateTransactionReference() {
  return `CB-${Date.now().toString(36).toUpperCase()}`;
}

function createReceiptRow(item) {
  const row = document.createElement("tr");

  const itemCell = document.createElement("td");
  const itemName = document.createElement("strong");
  itemName.textContent = item.name;
  const unitPrice = document.createElement("small");
  unitPrice.textContent = `${formatCurrency(item.price)} each`;
  itemCell.append(itemName, unitPrice);

  const quantityCell = document.createElement("td");
  quantityCell.textContent = item.quantity;

  const subtotalCell = document.createElement("td");
  subtotalCell.textContent = formatCurrency(item.subtotal);

  row.append(itemCell, quantityCell, subtotalCell);
  return row;
}

function renderReceipt(transaction) {
  const placeholder = document.querySelector("#receipt-placeholder");
  if (placeholder) placeholder.hidden = true;

  const confirmation = document.querySelector("#payment-confirmation");
  const receipt = document.querySelector("#digital-receipt");
  const receiptItems = document.querySelector("#receipt-items");

  if (confirmation) confirmation.hidden = false;
  if (receipt) receipt.hidden = false;
  if (receiptItems) receiptItems.replaceChildren(...transaction.items.map(createReceiptRow));

  document.querySelector("#receipt-date").textContent = transaction.createdAt.toLocaleString(
    "en-PH",
    { dateStyle: "medium", timeStyle: "short" },
  );
  document.querySelector("#receipt-total").textContent = formatCurrency(transaction.total);
  document.querySelector("#receipt-paid").textContent = formatCurrency(transaction.amountPaid);
  document.querySelector("#receipt-change").textContent = formatCurrency(transaction.change);
  document.querySelector("#receipt-reference").textContent = transaction.reference;

  const newTransactionButton = document.querySelector("#new-transaction");
  if (newTransactionButton) newTransactionButton.disabled = false;

  // Open the receipt dialog
  const receiptDialog = document.querySelector("#receipt-dialog");
  if (receiptDialog && typeof receiptDialog.showModal === "function") {
    receiptDialog.showModal();
  }
}

function handlePaymentSubmit(event) {
  event.preventDefault();

  if (completedTransaction) return;

  const items = getCartItems();
  if (items.length === 0) {
    showPaymentError("Add at least one product before payment.");
    return;
  }

  const total = getCartTotal(items);
  const paymentInput = document.querySelector("#cash-amount");
  const result = validatePayment(paymentInput.value, total);

  if (!result.valid) {
    showPaymentError(result.message);
    updateStatus(result.message);
    return;
  }

  completedTransaction = {
    items,
    total,
    amountPaid: result.amountPaid,
    change: result.change,
    reference: generateTransactionReference(),
    createdAt: new Date(),
  };

  clearPaymentMessage();

  // Close payment dialog if open
  const paymentDialog = document.querySelector("#payment-dialog");
  if (paymentDialog && paymentDialog.open) {
    paymentDialog.close();
  }

  renderReceipt(completedTransaction);
  syncTransactionControls();
  updateStatus(
    `Payment successful. Change: ${formatCurrency(completedTransaction.change)}. ` +
      `Reference: ${completedTransaction.reference}.`,
  );
}

function startNewTransaction() {
  cart.clear();
  completedTransaction = null;

  const paymentInput = document.querySelector("#cash-amount");
  const confirmation = document.querySelector("#payment-confirmation");
  const receipt = document.querySelector("#digital-receipt");
  const receiptItems = document.querySelector("#receipt-items");
  const receiptDialog = document.querySelector("#receipt-dialog");

  if (receiptDialog && receiptDialog.open) {
    receiptDialog.close();
  }

  if (paymentInput) paymentInput.value = "";
  clearPaymentMessage();
  if (confirmation) confirmation.hidden = true;
  if (receipt) receipt.hidden = true;
  if (receiptItems) receiptItems.replaceChildren();

  const placeholder = document.querySelector("#receipt-placeholder");
  if (placeholder) placeholder.hidden = false;

  const newTransactionBtn = document.querySelector("#new-transaction");
  if (newTransactionBtn) newTransactionBtn.disabled = true;

  renderProducts();
  renderCart();
  updateStatus("New transaction started. Select a bakery product to begin an order.");
  document.querySelector("#product-grid button")?.focus();
}

function handleProductClick(event) {
  const addButton = event.target.closest("button[data-product-id]");
  if (addButton) {
    addToCart(addButton.dataset.productId);
    return;
  }
}

function handleCartClick(event) {
  const actionButton = event.target.closest("button[data-action]");
  if (!actionButton) return;

  const { action, productId } = actionButton.dataset;
  if (action === "increase") changeQuantity(productId, 1);
  if (action === "decrease") changeQuantity(productId, -1);
  if (action === "remove") removeFromCart(productId);
}

// Category filter button handler
function handleCategoryFilterClick(event) {
  const chip = event.target.closest(".category-chip");
  if (!chip) return;

  document.querySelectorAll(".category-chip").forEach((btn) => btn.classList.remove("is-active"));
  chip.classList.add("is-active");

  activeCategoryFilter = chip.dataset.category;
  renderProducts();
}

// Quick cash preset button handler
function handleQuickCashClick(event) {
  const btn = event.target.closest(".quick-cash-btn");
  if (!btn) return;

  const input = document.querySelector("#cash-amount");
  if (!input) return;

  const preset = btn.dataset.quickCash;
  if (preset === "exact") {
    input.value = getCartTotal().toFixed(2);
  } else {
    input.value = Number(preset).toFixed(2);
  }
  clearPaymentMessage();
  input.focus();
}

// Dialog close buttons handler
function handleDialogCloseClick(event) {
  const closeBtn = event.target.closest("[data-dialog-close]");
  if (!closeBtn) return;

  const dialog = closeBtn.closest("dialog");
  if (dialog && dialog.open) {
    dialog.close();
  }
}

// Setup Event Listeners
document.querySelector("#product-grid").addEventListener("click", handleProductClick);
document.querySelector("#cart-list").addEventListener("click", handleCartClick);
document.querySelector("#payment-form").addEventListener("submit", handlePaymentSubmit);
document.querySelector("#new-transaction").addEventListener("click", startNewTransaction);

// Category navigation
const categoryFilters = document.querySelector(".category-filters");
if (categoryFilters) {
  categoryFilters.addEventListener("click", handleCategoryFilterClick);
}

// Quick cash buttons
const quickCashRow = document.querySelector(".quick-cash-row");
if (quickCashRow) {
  quickCashRow.addEventListener("click", handleQuickCashClick);
}

// Dialog openers and closers
const openPaymentBtn = document.querySelector("#open-payment-btn");
if (openPaymentBtn) {
  openPaymentBtn.addEventListener("click", () => {
    const paymentDialog = document.querySelector("#payment-dialog");
    if (paymentDialog && typeof paymentDialog.showModal === "function") {
      paymentDialog.showModal();
      const input = document.querySelector("#cash-amount");
      if (input && !input.disabled) input.focus();
    }
  });
}

// Global modal close handler for [data-dialog-close]
document.addEventListener("click", handleDialogCloseClick);

// Initial Render
renderProducts();
renderCart();
