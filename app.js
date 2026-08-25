const catalog = {
  rose: { id: "rose", brand: "NOIR ATELIER", name: "Rosé Lace Set", price: 189, short: "蕾丝三件套 · 珊瑚粉", thumb: "rose", glyph: "R" },
  glow: { id: "glow", brand: "THE SENSORY LAB", name: "Warm Glow Body Oil", price: 109, short: "按摩身体油 · 琥珀香", thumb: "glow", glyph: "G" },
  midnight: { id: "midnight", brand: "VELVET NOIR", name: "Midnight Ritual Box", price: 298, short: "双人探索礼盒", thumb: "midnight", glyph: "M" },
  ivory: { id: "ivory", brand: "NOIR ATELIER", name: "Ivory Whisper Slip", price: 169, short: "缎面睡裙 · 珍珠白", thumb: "ivory", glyph: "I" }
};

const state = { cart: [] };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let toastTimer;

function currency(amount) { return `RM ${amount.toLocaleString("en-MY")}`; }

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
      <div class="cart-thumb ${item.thumb}">${item.glyph}</div>
      <div class="cart-line-info">
        <p>${item.brand}</p><h3>${item.name}</h3><b>${currency(item.price)}</b>
        <button class="remove-item" data-id="${item.id}" aria-label="移除 ${item.name}">×</button>
        <div class="quantity"><button data-change="-1" data-id="${item.id}" aria-label="减少数量">−</button><span>${item.quantity}</span><button data-change="1" data-id="${item.id}" aria-label="增加数量">＋</button></div>
      </div>
    </article>`).join("");
  $$('[data-change]').forEach((button) => button.addEventListener("click", () => changeQuantity(button.dataset.id, Number(button.dataset.change))));
  $$(".remove-item").forEach((button) => button.addEventListener("click", () => removeItem(button.dataset.id)));
}

function addToCart(id) {
  const item = state.cart.find((cartItem) => cartItem.id === id);
  if (item) item.quantity += 1;
  else state.cart.push({ ...catalog[id], quantity: 1 });
  renderCart();
  showToast(`${catalog[id].name} 已加入购物袋`);
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

function filterProducts(filter) {
  $$(".product-card").forEach((card) => card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter));
}

function renderSearch(term = "") {
  const query = term.trim().toLowerCase();
  const matches = Object.values(catalog).filter((product) => [product.name, product.brand, product.short].join(" ").toLowerCase().includes(query));
  $("#searchResults").innerHTML = query && !matches.length ? '<p style="color:#83777e;font-size:12px">暂时没有符合的商品。</p>' : matches.map((product) => `<div class="search-result"><span><b>${product.name}</b><small> · ${currency(product.price)}</small></span><button data-search-add="${product.id}">加入购物袋</button></div>`).join("");
  $$('[data-search-add]').forEach((button) => button.addEventListener("click", () => { addToCart(button.dataset.searchAdd); $("#searchModal").classList.remove("open"); openCart(); }));
}

$("#enterSite").addEventListener("click", () => { $("#ageGate").classList.add("dismissed"); sessionStorage.setItem("velvetNoirAgeConfirmed", "yes"); });
$("#leaveSite").addEventListener("click", () => { window.location.href = "https://www.google.com"; });
if (sessionStorage.getItem("velvetNoirAgeConfirmed") === "yes") $("#ageGate").classList.add("dismissed");

$("#cartButton").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$$(".quick-add, [data-id].button").forEach((button) => button.addEventListener("click", () => addToCart(button.dataset.id)));

$$(".category-tabs button").forEach((button) => button.addEventListener("click", () => {
  $$(".category-tabs button").forEach((tab) => { tab.classList.remove("active"); tab.setAttribute("aria-selected", "false"); });
  button.classList.add("active"); button.setAttribute("aria-selected", "true"); filterProducts(button.dataset.filter);
}));

$("#searchButton").addEventListener("click", () => { $("#searchModal").classList.add("open"); renderSearch(); setTimeout(() => $("#searchInput").focus(), 100); });
$("#closeSearch").addEventListener("click", () => $("#searchModal").classList.remove("open"));
$("#searchModal").addEventListener("click", (event) => { if (event.target === $("#searchModal")) $("#searchModal").classList.remove("open"); });
$("#searchInput").addEventListener("input", (event) => renderSearch(event.target.value));

$("#newsletterForm").addEventListener("submit", (event) => { event.preventDefault(); event.currentTarget.reset(); showToast("已订阅。下一封私享来信很快送达。 ✦"); });
$("#checkoutButton").addEventListener("click", () => { if (!state.cart.length) return showToast("先挑一件让你心动的好物吧。"); showToast("结账流程将在正式上线后开启。") });
$("#storyButton").addEventListener("click", () => { document.querySelector("#promise").scrollIntoView({ behavior: "smooth" }); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeCart(); $("#searchModal").classList.remove("open"); } });

renderCart();
