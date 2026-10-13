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
  document.querySelector("#app-status").textContent = message;
}

function clearPaymentMessage() {
  const message = document.querySelector("#payment-message");
  const input = document.querySelector("#cash-amount");
  message.hidden = true;
  message.textContent = "";
  input.removeAttribute("aria-invalid");
}

function showPaymentError(messageText) {
  const message = document.querySelector("#payment-message");
  const input = document.querySelector("#cash-amount");
  message.textContent = messageText;
  message.hidden = false;
  input.setAttribute("aria-invalid", "true");
  input.focus();
}

function syncTransactionControls() {
  const hasItems = cart.size > 0;
  const transactionComplete = completedTransaction !== null;
  const paymentInput = document.querySelector("#cash-amount");
  const confirmButton = document.querySelector("#confirm-payment");
  const paymentHelp = document.querySelector("#payment-help");

  paymentInput.disabled = !hasItems || transactionComplete;
  confirmButton.disabled = !hasItems || transactionComplete;

  if (transactionComplete) {
    paymentHelp.textContent = "Payment completed. Start a new transaction to order again.";
  } else if (hasItems) {
    paymentHelp.textContent = `Amount due: ${formatCurrency(getCartTotal())}.`;
  } else {
    paymentHelp.textContent = "Add at least one product before entering a cash payment.";
  }

  document.querySelectorAll("#product-grid button, #cart-list button").forEach((button) => {
    if (transactionComplete) button.disabled = true;
  });
}

function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card";

  const category = document.createElement("p");
  category.className = "product-category";
  category.textContent = product.category;

  const name = document.createElement("h3");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = formatCurrency(product.price);

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.dataset.productId = product.id;
  addButton.textContent = "Add to Cart";
  addButton.setAttribute("aria-label", `Add ${product.name} to cart`);

  article.append(category, name, price, addButton);
  return article;
}

function renderProducts() {
  const productGrid = document.querySelector("#product-grid");
  const productCount = document.querySelector("#product-count");

  const cards = products.map(createProductCard);
  productGrid.replaceChildren(...cards);
  productCount.textContent = `${products.length} products`;
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
  document.querySelector("#receipt-placeholder").hidden = true;

  const confirmation = document.querySelector("#payment-confirmation");
  const receipt = document.querySelector("#digital-receipt");
  const receiptItems = document.querySelector("#receipt-items");

  confirmation.hidden = false;
  receipt.hidden = false;
  receiptItems.replaceChildren(...transaction.items.map(createReceiptRow));

  document.querySelector("#receipt-date").textContent = transaction.createdAt.toLocaleString(
    "en-PH",
    { dateStyle: "medium", timeStyle: "short" },
  );
  document.querySelector("#receipt-total").textContent = formatCurrency(transaction.total);
  document.querySelector("#receipt-paid").textContent = formatCurrency(transaction.amountPaid);
  document.querySelector("#receipt-change").textContent = formatCurrency(transaction.change);
  document.querySelector("#receipt-reference").textContent = transaction.reference;

  const newTransactionButton = document.querySelector("#new-transaction");
  newTransactionButton.disabled = false;
  confirmation.focus();
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

  paymentInput.value = "";
  clearPaymentMessage();
  confirmation.hidden = true;
  receipt.hidden = true;
  receiptItems.replaceChildren();
  document.querySelector("#receipt-placeholder").hidden = false;
  document.querySelector("#new-transaction").disabled = true;

  renderProducts();
  renderCart();
  updateStatus("New transaction started. Select a bakery product to begin an order.");
  document.querySelector("#product-grid button")?.focus();
}

function handleProductClick(event) {
  const addButton = event.target.closest("button[data-product-id]");
  if (!addButton) return;
  addToCart(addButton.dataset.productId);
}

function handleCartClick(event) {
  const actionButton = event.target.closest("button[data-action]");
  if (!actionButton) return;

  const { action, productId } = actionButton.dataset;
  if (action === "increase") changeQuantity(productId, 1);
  if (action === "decrease") changeQuantity(productId, -1);
  if (action === "remove") removeFromCart(productId);
}

document.querySelector("#product-grid").addEventListener("click", handleProductClick);
document.querySelector("#cart-list").addEventListener("click", handleCartClick);
document.querySelector("#payment-form").addEventListener("submit", handlePaymentSubmit);
document.querySelector("#new-transaction").addEventListener("click", startNewTransaction);

renderProducts();
renderCart();
