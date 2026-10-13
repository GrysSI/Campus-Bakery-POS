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

function updateStatus(message) {
  document.querySelector("#app-status").textContent = message;
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
}

function addToCart(productId) {
  const product = getProduct(productId);
  if (!product) return;

  cart.set(productId, (cart.get(productId) ?? 0) + 1);
  renderCart();
  updateStatus(`${product.name} added. Cart total: ${formatCurrency(getCartTotal())}.`);
}

function changeQuantity(productId, change) {
  const currentQuantity = cart.get(productId);
  if (!currentQuantity) return;

  const nextQuantity = currentQuantity + change;
  if (nextQuantity < 1) return;

  cart.set(productId, nextQuantity);
  renderCart();

  const product = getProduct(productId);
  updateStatus(`${product.name} quantity updated to ${nextQuantity}.`);
}

function removeFromCart(productId) {
  const product = getProduct(productId);
  if (!product || !cart.delete(productId)) return;

  renderCart();
  updateStatus(`${product.name} removed from the cart.`);
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

renderProducts();
renderCart();
