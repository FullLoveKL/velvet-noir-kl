const fallbackCatalog = [
  { id: "rose", brand: "NOIR ATELIER", name: "Rosé Lace Set", price: 189, short: "蕾丝三件套 · 珊瑚粉", category: "其他系列", thumb: "other-series", glyph: "R" },
  { id: "glow", brand: "THE SENSORY LAB", name: "Warm Glow Body Oil", price: 109, short: "按摩身体油 · 琥珀香", category: "其他系列", thumb: "other-series", glyph: "G" },
  { id: "midnight", brand: "VELVET NOIR", name: "Midnight Ritual Box", price: 298, short: "双人探索礼盒", category: "其他系列", thumb: "other-series", glyph: "M" },
  { id: "ivory", brand: "NOIR ATELIER", name: "Ivory Whisper Slip", price: 169, short: "缎面睡裙 · 珍珠白", category: "其他系列", thumb: "other-series", glyph: "I" }
];

const catalogList = Array.isArray(window.fullLoveCatalog) && window.fullLoveCatalog.length ? window.fullLoveCatalog : fallbackCatalog;
const catalog = Object.fromEntries(catalogList.map((product) => [product.id, product]));
const state = { cart: [], activeFilter: "all", visibleProducts: 24 };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let toastTimer;

function currency(amount) {
  return `RM ${Number(amount).toLocaleString("en-MY")}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function renderCart() {
  const items = state.cart.filter((item) => item.quantity > 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  $("#cartCount").textContent = totalItems;
  $("#cartItemLabel").textContent = `(${totalItems})`;
  $("#cartTotal").textContent = currency(subtotal);
  $("#shippingGap").textContent = subtotal >= 180 ? "已获得" : currency(180 - subtotal);
  const cartItems = $("#cartItems");

  if (!items.length) {
    cartItems.innerHTML = '<div class="empty-cart"><span>✦</span><p>你的购物袋还是空的。</p><button id="continueShopping">去逛逛</button></div>';
    $("#continueShopping").addEventListener("click", closeCart);
    return;
  }

  cartItems.innerHTML = items.map((item) => `
    <article class="cart-line">
      <div class="cart-thumb ${escapeHtml(item.thumb)}">${escapeHtml(item.glyph)}</div>
      <div class="cart-line-info">
        <p>${escapeHtml(item.brand)}</p><h3>${escapeHtml(item.name)}</h3><b>${currency(item.price)}</b>
        <button class="remove-item" data-id="${escapeHtml(item.id)}" aria-label="移除 ${escapeHtml(item.name)}">×</button>
        <div class="quantity"><button data-change="-1" data-id="${escapeHtml(item.id)}" aria-label="减少数量">−</button><span>${item.quantity}</span><button data-change="1" data-id="${escapeHtml(item.id)}" aria-label="增加数量">＋</button></div>
      </div>
    </article>`).join("");
  $$("[data-change]").forEach((button) => button.addEventListener("click", () => changeQuantity(button.dataset.id, Number(button.dataset.change))));
  $$(".remove-item").forEach((button) => button.addEventListener("click", () => removeItem(button.dataset.id)));
}

function addToCart(id) {
  const product = catalog[id];
  if (!product) return;
  const item = state.cart.find((cartItem) => cartItem.id === id);
  if (item) item.quantity += 1;
  else state.cart.push({ ...product, quantity: 1 });
  renderCart();
  showToast(`${product.name} 已加入购物袋`);
}

function changeQuantity(id, amount) {
  const item = state.cart.find((cartItem) => cartItem.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) state.cart = state.cart.filter((cartItem) => cartItem.id !== id);
  renderCart();
}

function removeItem(id) {
  state.cart = state.cart.filter((item) => item.id !== id);
  renderCart();
  showToast("商品已移出购物袋");
}

function openCart() {
  $("#cartPanel").classList.add("open");
  $("#cartPanel").setAttribute("aria-hidden", "false");
  $("#overlay").classList.add("visible");
}

function closeCart() {
  $("#cartPanel").classList.remove("open");
  $("#cartPanel").setAttribute("aria-hidden", "true");
  $("#overlay").classList.remove("visible");
}

function matchedProducts() {
  return catalogList.filter((product) => state.activeFilter === "all" || product.category === state.activeFilter);
}

function productCard(product) {
  return `
    <article class="product-card" data-category="${escapeHtml(product.category)}">
      <div class="product-visual catalog-visual ${escapeHtml(product.thumb)}">
        <span class="product-badge">${escapeHtml(product.brand)}</span>
        <span class="product-code">${escapeHtml(product.glyph)}</span>
        <span class="product-serial">${escapeHtml(product.name)}</span>
        <button class="quick-add" data-id="${escapeHtml(product.id)}" aria-label="将 ${escapeHtml(product.name)} 加入购物袋">＋</button>
      </div>
      <div class="product-info">
        <p>${escapeHtml(product.category)}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <div><span>${escapeHtml(product.short)}</span><b>${currency(product.price)}</b></div>
      </div>
    </article>`;
}

function renderProducts() {
  const matches = matchedProducts();
  const visible = matches.slice(0, state.visibleProducts);
  $("#all-products").innerHTML = visible.map(productCard).join("");
  $("#catalogStatus").textContent = `显示 ${visible.length} / ${matches.length} 款可售产品 · 8 款待确认价格产品未上架`;
  const more = $("#catalogMore");
  more.hidden = visible.length >= matches.length;
  if (!more.hidden) $("#loadMoreButton").textContent = `加载更多款式（还有 ${matches.length - visible.length} 款） ↓`;
}

function filterProducts(filter) {
  state.activeFilter = filter;
  state.visibleProducts = 24;
  renderProducts();
}

function renderSearch(term = "") {
  const query = term.trim().toLowerCase();
  const results = query
    ? catalogList.filter((product) => [product.name, product.brand, product.category, product.short].join(" ").toLowerCase().includes(query)).slice(0, 10)
    : [];
  const container = $("#searchResults");
  if (!query) {
    container.innerHTML = '<p style="color:#83777e;font-size:12px">输入产品编号、系列或分类开始搜索。</p>';
    return;
  }
  container.innerHTML = results.length
    ? results.map((product) => `<div class="search-result"><span><b>${escapeHtml(product.name)}</b><small> · ${escapeHtml(product.brand)} · ${currency(product.price)}</small></span><button data-search-add="${escapeHtml(product.id)}">加入购物袋</button></div>`).join("")
    : '<p style="color:#83777e;font-size:12px">暂时没有符合的商品。</p>';
  $$("[data-search-add]").forEach((button) => button.addEventListener("click", () => {
    addToCart(button.dataset.searchAdd);
    $("#searchModal").classList.remove("open");
    openCart();
  }));
}

$("#enterSite").addEventListener("click", () => {
  $("#ageGate").classList.add("dismissed");
  sessionStorage.setItem("velvetNoirAgeConfirmed", "yes");
});
$("#leaveSite").addEventListener("click", () => {
  window.location.href = "https://www.google.com";
});
if (sessionStorage.getItem("velvetNoirAgeConfirmed") === "yes") $("#ageGate").classList.add("dismissed");

$("#cartButton").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#all-products").addEventListener("click", (event) => {
  const button = event.target.closest(".quick-add");
  if (button) addToCart(button.dataset.id);
});
$("#loadMoreButton").addEventListener("click", () => {
  state.visibleProducts += 24;
  renderProducts();
});

$$(".category-tabs button").forEach((button) => button.addEventListener("click", () => {
  $$(".category-tabs button").forEach((tab) => {
    tab.classList.remove("active");
    tab.setAttribute("aria-selected", "false");
  });
  button.classList.add("active");
  button.setAttribute("aria-selected", "true");
  filterProducts(button.dataset.filter);
}));

$("#searchButton").addEventListener("click", () => {
  $("#searchModal").classList.add("open");
  renderSearch();
  setTimeout(() => $("#searchInput").focus(), 100);
});
$("#closeSearch").addEventListener("click", () => $("#searchModal").classList.remove("open"));
$("#searchModal").addEventListener("click", (event) => {
  if (event.target === $("#searchModal")) $("#searchModal").classList.remove("open");
});
$("#searchInput").addEventListener("input", (event) => renderSearch(event.target.value));

$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("已订阅。下一封私享来信很快送达。 ✦");
});
$("#checkoutButton").addEventListener("click", () => {
  if (!state.cart.length) return showToast("先挑一件让你心动的好物吧。");
  showToast("结账与 WhatsApp 下单正在配置中。");
});
$("#storyButton").addEventListener("click", () => {
  document.querySelector("#promise").scrollIntoView({ behavior: "smooth" });
});
$("#viewCatalogButton").addEventListener("click", () => {
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    $("#searchModal").classList.remove("open");
  }
});

renderCart();
renderProducts();
