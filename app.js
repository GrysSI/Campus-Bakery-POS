// Stage 1 keeps the exam's six products in one clear, reusable data source.
const products = Object.freeze([
  { id: "pandesal", name: "Pandesal (pack of 5)", price: 25, category: "Bread" },
  { id: "ensaymada", name: "Ensaymada", price: 20, category: "Pastry" },
  { id: "spanish-bread", name: "Spanish Bread", price: 15, category: "Bread" },
  { id: "chocolate-cupcake", name: "Chocolate Cupcake", price: 30, category: "Baked Good" },
  { id: "loaf-bread", name: "Loaf Bread", price: 55, category: "Bread" },
  { id: "brewed-coffee", name: "Brewed Coffee (cup)", price: 25, category: "Beverage" },
]);

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

function formatCurrency(amount) {
  return currencyFormatter.format(amount);
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
  addButton.disabled = true;
  addButton.title = "Ordering will be enabled in Stage 2";

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

renderProducts();
