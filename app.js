const fallbackCatalog = [
  { id: "rose", brand: "NOIR ATELIER", name: "Rosé Lace Set", price: 189, short: "蕾丝三件套 · 珊瑚粉", category: "其他系列", thumb: "other-series", glyph: "R" },
  { id: "glow", brand: "THE SENSORY LAB", name: "Warm Glow Body Oil", price: 109, short: "按摩身体油 · 琥珀香", category: "其他系列", thumb: "other-series", glyph: "G" },
  { id: "midnight", brand: "VELVET NOIR", name: "Midnight Ritual Box", price: 298, short: "双人探索礼盒", category: "其他系列", thumb: "other-series", glyph: "M" },
  { id: "ivory", brand: "NOIR ATELIER", name: "Ivory Whisper Slip", price: 169, short: "缎面睡裙 · 珍珠白", category: "其他系列", thumb: "other-series", glyph: "I" }
];

const catalogList = Array.isArray(window.fullLoveCatalog) && window.fullLoveCatalog.length ? window.fullLoveCatalog : fallbackCatalog;
const catalog = Object.fromEntries(catalogList.map((product) => [product.id, product]));
const state = { cart: [], activeFilter: "all", visibleProducts: 24, language: "zh" };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let toastTimer;

const copy = {
  zh: {
    languageLabel: "中文",
    languageAria: "选择语言",
    cart: "购物袋",
    cartAria: (count) => `打开购物袋，${count} 件商品`,
    cartTitle: "查看购物袋",
    shippingGap: (amount) => `距离满 RM180 免 Lalamove 运费还差 <b id="shippingGap">${amount}</b>`,
    shippingDone: "已获得 Lalamove 免运费",
    emptyCart: "你的购物袋还是空的。",
    continueShopping: "去逛逛",
    addToCart: "加入购物袋",
    added: (name) => `${name} 已加入购物袋`,
    removed: "商品已移出购物袋",
    catalogStatus: (visible, total) => `显示 ${visible} / ${total} 款可售产品 · 8 款待确认价格产品未上架`,
    loadMore: (count) => `加载更多款式（还有 ${count} 款） ↓`,
    searchHint: "输入产品编号、系列或分类开始搜索。",
    searchNone: "暂时没有符合的商品。",
    searchPlaceholder: "搜索：产品编号、系列或分类…",
    newsletter: "已订阅。下一封私享来信很快送达。 ✦",
    checkoutEmpty: "先挑一件让你心动的好物吧。",
    checkoutOpening: "正在打开 WhatsApp 下单…",
    whatsappGreeting: "你好 FullLove KL，我想通过 WhatsApp 下单并享受 9 折优惠。",
    order: "订单：",
    subtotal: "小计",
    discount: "通讯下单 9 折价",
    confirmation: "请帮我确认库存、KL 市区 Lalamove 配送与最终金额。",
    imageAlt: (name) => `${name} 商品图`,
    productShort: (category) => `${category} · 隐私发货 · KL Lalamove`,
    category: {
      "网袜内裤": "网袜内裤",
      "网衣": "网衣",
      "99系列": "99系列",
      "95系列": "95系列",
      "混合系列": "混合系列",
      "其他系列": "其他系列"
    },
    series: {
      "10网袜内裤": "10网袜内裤",
      "20网衣": "20网衣",
      "30网衣": "30网衣"
    },
    title: "Velvet Noir KL — 私密愉悦精品店"
  },
  en: {
    languageLabel: "English",
    languageAria: "Choose language",
    cart: "Bag",
    cartAria: (count) => `Open shopping bag, ${count} item${count === 1 ? "" : "s"}`,
    cartTitle: "View shopping bag",
    shippingGap: (amount) => `Spend ${amount} more for free Lalamove delivery`,
    shippingDone: "Free Lalamove delivery unlocked",
    emptyCart: "Your shopping bag is still empty.",
    continueShopping: "Keep browsing",
    addToCart: "Add to bag",
    added: (name) => `${name} added to your bag`,
    removed: "Item removed from your bag",
    catalogStatus: (visible, total) => `Showing ${visible} of ${total} available products · 8 products with unconfirmed prices are hidden`,
    loadMore: (count) => `Load more styles (${count} left) ↓`,
    searchHint: "Search by product code, series or category.",
    searchNone: "No matching products yet.",
    searchPlaceholder: "Search: product code, series or category…",
    newsletter: "You're subscribed. Your next private letter is on its way. ✦",
    checkoutEmpty: "Choose something that catches your eye first.",
    checkoutOpening: "Opening WhatsApp order…",
    whatsappGreeting: "Hello FullLove KL, I would like to order through WhatsApp and receive the 10% off offer.",
    order: "Order:",
    subtotal: "Subtotal",
    discount: "10% off contact-order price",
    confirmation: "Please confirm stock, KL city Lalamove delivery and the final total for me.",
    imageAlt: (name) => `${name} product image`,
    productShort: (category) => `${category} · Discreet dispatch · KL Lalamove`,
    category: {
      "网袜内裤": "Fishnet & lingerie",
      "网衣": "Fishnet wear",
      "99系列": "99 Series",
      "95系列": "95 Series",
      "混合系列": "Mixed Series",
      "其他系列": "Other Series"
    },
    series: {
      "10网袜内裤": "10 · Fishnet & lingerie",
      "20网衣": "20 · Fishnet wear",
      "30网衣": "30 · Fishnet wear"
    },
    title: "Velvet Noir KL — Private Pleasure Boutique"
  },
  ms: {
    languageLabel: "Bahasa Melayu",
    languageAria: "Pilih bahasa",
    cart: "Troli",
    cartAria: (count) => `Buka troli beli-belah, ${count} item`,
    cartTitle: "Lihat troli beli-belah",
    shippingGap: (amount) => `Tambah ${amount} lagi untuk penghantaran Lalamove percuma`,
    shippingDone: "Penghantaran Lalamove percuma telah diperoleh",
    emptyCart: "Troli beli-belah anda masih kosong.",
    continueShopping: "Teruskan melihat",
    addToCart: "Tambah ke troli",
    added: (name) => `${name} telah ditambah ke troli`,
    removed: "Item telah dikeluarkan daripada troli",
    catalogStatus: (visible, total) => `Memaparkan ${visible} daripada ${total} produk tersedia · 8 produk dengan harga belum disahkan disembunyikan`,
    loadMore: (count) => `Muatkan lebih banyak gaya (${count} lagi) ↓`,
    searchHint: "Cari mengikut kod produk, siri atau kategori.",
    searchNone: "Tiada produk yang sepadan buat masa ini.",
    searchPlaceholder: "Cari: kod produk, siri atau kategori…",
    newsletter: "Anda telah melanggan. Surat peribadi seterusnya akan tiba tidak lama lagi. ✦",
    checkoutEmpty: "Pilih sesuatu yang menarik hati anda dahulu.",
    checkoutOpening: "Membuka pesanan WhatsApp…",
    whatsappGreeting: "Hai FullLove KL, saya ingin membuat pesanan melalui WhatsApp dan menerima tawaran diskaun 10%.",
    order: "Pesanan:",
    subtotal: "Jumlah kecil",
    discount: "Harga pesanan komunikasi diskaun 10%",
    confirmation: "Sila sahkan stok, penghantaran Lalamove dalam bandar KL dan jumlah akhir untuk saya.",
    imageAlt: (name) => `Imej produk ${name}`,
    productShort: (category) => `${category} · Penghantaran sulit · Lalamove KL`,
    category: {
      "网袜内裤": "Jala & pakaian dalam",
      "网衣": "Pakaian jala",
      "99系列": "Siri 99",
      "95系列": "Siri 95",
      "混合系列": "Siri campuran",
      "其他系列": "Siri lain"
    },
    series: {
      "10网袜内裤": "10 · Jala & pakaian dalam",
      "20网衣": "20 · Pakaian jala",
      "30网衣": "30 · Pakaian jala"
    },
    title: "Velvet Noir KL — Butik Intim Peribadi"
  }
};

const staticText = {
  "下单即极速发货 · KL 市区 1.5 小时内 Lalamove 极速送达 · 满 RM180 包邮 Lalamove": { en: "Fast dispatch · Lalamove delivery within 1.5 hours in central KL · Free Lalamove delivery from RM180", ms: "Penghantaran segera · Lalamove dalam 1.5 jam di pusat KL · Lalamove percuma untuk pesanan RM180 ke atas" },
  "全站仅限 18 岁以上人士": { en: "18+ only", ms: "Untuk 18 tahun ke atas sahaja" },
  "精选系列": { en: "Collections", ms: "Koleksi" },
  "私密承诺": { en: "Our promise", ms: "Janji kami" },
  "灵感手记": { en: "Journal", ms: "Jurnal" },
  "为只属于你的": { en: "Curated for your", ms: "Dicipta untuk" },
  "夜晚": { en: "night", ms: "malam anda" },
  "，精心挑选。": { en: ", and yours alone.", ms: ", yang istimewa." },
  "不必张扬，也值得被认真对待。来自全球的亲密好物，以克制、优雅的方式送到你的门口。": { en: "You do not have to be loud to be considered. Intimate essentials, selected with restraint and elegance, delivered to your door.", ms: "Anda tidak perlu menonjol untuk diraikan. Pilihan intim dari seluruh dunia dihantar ke pintu anda dengan penuh elegan." },
  "探索精品": { en: "Explore the edit", ms: "Terokai pilihan" },
  "关于 Velvet Noir": { en: "About Velvet Noir", ms: "Tentang Velvet Noir" },
  "即刻发货": { en: "Fast dispatch", ms: "Penghantaran segera" },
  "KL 市区 1.5 小时内 Lalamove 送达": { en: "Lalamove delivery within 1.5 hours in central KL", ms: "Penghantaran Lalamove dalam 1.5 jam di pusat KL" },
  "隐私发货": { en: "Discreet dispatch", ms: "Penghantaran sulit" },
  "不支持自取 · 满 RM180 包邮 Lalamove": { en: "No self-collection · Free Lalamove delivery from RM180", ms: "Tiada ambil sendiri · Lalamove percuma untuk pesanan RM180 ke atas" },
  "慢一点，听见自己。": { en: "Slow down. Hear yourself.", ms: "Perlahankan langkah. Dengari diri sendiri." },
  "触感是最诚实的语言。": { en: "Touch is the most honest language.", ms: "Sentuhan ialah bahasa paling jujur." },
  "私密，也可以很美。": { en: "Private can be beautiful.", ms: "Peribadi juga boleh menjadi indah." },
  "今晚，想靠近": { en: "Tonight, which feeling", ms: "Malam ini, rasa yang mana" },
  "哪一种感受？": { en: "do you want to lean into?", ms: "ingin anda dekati?" },
  "300 款在售": { en: "300 styles available", ms: "300 gaya tersedia" },
  "全部款式": { en: "All styles", ms: "Semua gaya" },
  "网袜内裤": { en: "Fishnet & lingerie", ms: "Jala & pakaian dalam" },
  "网衣": { en: "Fishnet wear", ms: "Pakaian jala" },
  "99 系列": { en: "99 Series", ms: "Siri 99" },
  "95 系列": { en: "95 Series", ms: "Siri 95" },
  "混合系列": { en: "Mixed Series", ms: "Siri campuran" },
  "其他系列": { en: "Other Series", ms: "Siri lain" },
  "把平常的夜晚，": { en: "Turn an ordinary night", ms: "Jadikan malam biasa" },
  "变成一场仪式。": { en: "into a ritual.", ms: "sebuah ritual." },
  "从柔软的触感到恰到好处的香气，每一件都为共享的亲密时刻而选。": { en: "From a soft touch to a perfectly judged scent, every piece is chosen for shared moments of intimacy.", ms: "Daripada sentuhan lembut hingga haruman yang sempurna, setiap pilihan dipilih untuk momen intim bersama." },
  "探索可售款式": { en: "Explore available styles", ms: "Terokai gaya tersedia" },
  "你的自在，由我们守护。": { en: "Your ease, protected by us.", ms: "Keselesaan anda, kami lindungi." },
  "无标识包装": { en: "Unmarked packaging", ms: "Pembungkusan tanpa label" },
  "无标识私密包装；外箱不显示商品名称或品牌。": { en: "Unmarked, discreet packaging; no product name or brand appears on the outer box.", ms: "Pembungkusan sulit tanpa label; nama produk atau jenama tidak tertera pada kotak luar." },
  "安心精选": { en: "Thoughtfully selected", ms: "Dipilih dengan teliti" },
  "我们认真挑选材质、包装与使用体验，并提供清晰的护理说明。": { en: "We choose materials, packaging and experience with care, with clear care guidance included.", ms: "Kami memilih bahan, pembungkusan dan pengalaman dengan teliti, serta menyediakan panduan penjagaan yang jelas." },
  "Lalamove 极速配送": { en: "Lalamove express delivery", ms: "Penghantaran ekspres Lalamove" },
  "下单即极速发货；KL 市区 1.5 小时内送达。不支持自取，满 RM180 包邮 Lalamove。": { en: "Orders are dispatched fast and arrive within 1.5 hours in central KL. No self-collection; free Lalamove delivery from RM180.", ms: "Pesanan dihantar segera dan tiba dalam 1.5 jam di pusat KL. Tiada ambil sendiri; Lalamove percuma untuk pesanan RM180 ke atas." },
  "不只是产品，": { en: "Not just products,", ms: "Bukan sekadar produk," },
  "也是一份灵感。": { en: "but a little inspiration.", ms: "tetapi juga inspirasi." },
  "进入手记": { en: "Read the journal", ms: "Baca jurnal" },
  "给忙碌生活的一份亲密留白": { en: "A little room for intimacy in a busy life", ms: "Ruang kecil untuk keintiman dalam hidup yang sibuk" },
  "阅读手记 →": { en: "Read the note →", ms: "Baca nota →" },
  "如何挑选属于自己的身体护理": { en: "How to choose body care that feels like yours", ms: "Cara memilih penjagaan tubuh yang sesuai untuk anda" },
  "留一盏灯，给下一次心动。": { en: "Leave a light on for your next spark.", ms: "Biarkan cahaya menyala untuk debaran seterusnya." },
  "订阅不定期灵感、私享新品预览与 KL 专属礼遇。": { en: "Subscribe for occasional inspiration, private new-arrival previews and KL-only treats.", ms: "Langgan untuk inspirasi sekali-sekala, pratonton produk baharu peribadi dan keistimewaan KL." },
  "电邮地址": { en: "Email address", ms: "Alamat e-mel" },
  "你的电邮地址": { en: "Your email address", ms: "Alamat e-mel anda" },
  "订阅即代表你已年满 18 岁，并同意接收 Velvet Noir 的私享资讯。": { en: "By subscribing, you confirm you are 18+ and agree to receive private Velvet Noir updates.", ms: "Dengan melanggan, anda mengesahkan bahawa anda berumur 18 tahun ke atas dan setuju menerima kemas kini peribadi Velvet Noir." },
  "我们相信：值得被好好对待的，从来不只是一段关系，也包括你自己。": { en: "We believe what deserves care is never only a relationship. It is you, too.", ms: "Kami percaya yang layak dilayan dengan baik bukan hanya hubungan, tetapi juga diri anda." },
  "购物": { en: "Shop", ms: "Beli-belah" },
  "配送与包装": { en: "Delivery & packaging", ms: "Penghantaran & pembungkusan" },
  "常见问题": { en: "FAQ", ms: "Soalan lazim" },
  "联络": { en: "Contact", ms: "Hubungi" },
  "微信：": { en: "WeChat:", ms: "WeChat:" },
  "通讯下单享 9 折": { en: "10% off contact orders", ms: "Diskaun 10% pesanan komunikasi" },
  "支持": { en: "Support", ms: "Sokongan" },
  "隐私政策": { en: "Privacy policy", ms: "Dasar privasi" },
  "退换说明": { en: "Returns", ms: "Pemulangan" },
  "条款与条件": { en: "Terms & conditions", ms: "Terma & syarat" },
  "购物袋": { en: "Shopping bag", ms: "Troli beli-belah" },
  "距离满 RM180 免 Lalamove 运费还差": { en: "away from free Lalamove delivery", ms: "lagi untuk penghantaran Lalamove percuma" },
  "小计": { en: "Subtotal", ms: "Jumlah kecil" },
  "WhatsApp / 微信下单 9 折": { en: "WhatsApp / WeChat · 10% off", ms: "WhatsApp / WeChat · Diskaun 10%" },
  "WhatsApp 下单享 9 折": { en: "WhatsApp order · 10% off", ms: "Pesan WhatsApp · Diskaun 10%" },
  "微信下单请添加：": { en: "Add on WeChat to order:", ms: "Tambah WeChat untuk membuat pesanan:" },
  "隐私发货 · 不支持自取 · 满 RM180 包邮 Lalamove": { en: "Discreet dispatch · No self-collection · Free Lalamove delivery from RM180", ms: "Penghantaran sulit · Tiada ambil sendiri · Lalamove percuma untuk pesanan RM180 ke atas" },
  "这是一个只属于": { en: "This is a space", ms: "Ini ialah ruang" },
  "成年人的空间。": { en: "for adults only.", ms: "untuk dewasa sahaja." },
  "进入前，请确认你已年满 18 岁，并且同意遵守所在地的相关法律与规定。": { en: "Before entering, please confirm that you are 18 or over and agree to follow the laws and rules where you live.", ms: "Sebelum masuk, sila sahkan bahawa anda berumur 18 tahun ke atas dan bersetuju mematuhi undang-undang serta peraturan di tempat anda." },
  "我已满 18 岁": { en: "I am 18+", ms: "Saya berumur 18 tahun ke atas" },
  "离开此页面": { en: "Leave this page", ms: "Keluar halaman ini" },
  "我们重视你的隐私；不会在你的装置上存放可识别的浏览资料。": { en: "We respect your privacy and do not store identifiable browsing data on your device.", ms: "Kami menghormati privasi anda dan tidak menyimpan data pelayaran yang boleh dikenal pasti pada peranti anda." },
  "寻找你的心动。": { en: "Find your spark.", ms: "Cari debaran anda." }
};

const productTerms = {
  en: {
    "粉色蓝色": " Pink / Blue", "黑粉蓝": " Black / Pink / Blue", "黑白红": " Black / White / Red",
    "白+黑": " White / Black", "黑+白": " Black / White", "黑+红": " Black / Red", "白+蓝": " White / Blue",
    "黑红": " Black / Red", "黑白": " Black / White", "全黑": " All Black", "全白": " All White", "全红": " All Red",
    "黑爱心": " Black Heart", "红爱心": " Red Heart", "黑油光": " Black Gloss", "白油光": " White Gloss", "肤油光": " Nude Gloss",
    "黑色": " Black", "白色": " White", "红色": " Red", "蓝色": " Blue", "紫色": " Purple", "粉色": " Pink", "肤色": " Nude",
    "酒红": " Burgundy", "白边": " White Trim", "红边": " Red Trim", "爱心": " Heart", "肚兜": " Dudou", "旗袍": " Cheongsam",
    "吊带": " Suspender", "围巾": " Scarf", "开档": " Open-crotch", "连体": " Bodysuit", "加钻": " Rhinestone",
    "黑": " Black", "白": " White", "红": " Red", "蓝": " Blue", "紫": " Purple", "粉": " Pink", "灰": " Grey", "肤": " Nude"
  },
  ms: {
    "粉色蓝色": " Merah Jambu / Biru", "黑粉蓝": " Hitam / Merah Jambu / Biru", "黑白红": " Hitam / Putih / Merah",
    "白+黑": " Putih / Hitam", "黑+白": " Hitam / Putih", "黑+红": " Hitam / Merah", "白+蓝": " Putih / Biru",
    "黑红": " Hitam / Merah", "黑白": " Hitam / Putih", "全黑": " Hitam Penuh", "全白": " Putih Penuh", "全红": " Merah Penuh",
    "黑爱心": " Hati Hitam", "红爱心": " Hati Merah", "黑油光": " Hitam Berkilat", "白油光": " Putih Berkilat", "肤油光": " Warna Kulit Berkilat",
    "黑色": " Hitam", "白色": " Putih", "红色": " Merah", "蓝色": " Biru", "紫色": " Ungu", "粉色": " Merah Jambu", "肤色": " Warna Kulit",
    "酒红": " Merah Wain", "白边": " Tepi Putih", "红边": " Tepi Merah", "爱心": " Hati", "肚兜": " Dudou", "旗袍": " Cheongsam",
    "吊带": " Tali", "围巾": " Skaf", "开档": " Bukaan Selangkang", "连体": " Bodysuit", "加钻": " Batu Kristal",
    "黑": " Hitam", "白": " Putih", "红": " Merah", "蓝": " Biru", "紫": " Ungu", "粉": " Merah Jambu", "灰": " Kelabu", "肤": " Warna Kulit"
  }
};

function currentCopy() {
  return copy[state.language];
}

function currency(amount) {
  return `RM ${Number(amount).toLocaleString("en-MY")}`;
}

function discountCurrency(amount) {
  return `RM ${Number(amount).toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

function localizedCategory(category) {
  return currentCopy().category[category] || category;
}

function localizedSeries(series) {
  if (currentCopy().series[series]) return currentCopy().series[series];
  if (currentCopy().category[series]) return currentCopy().category[series];
  const match = String(series).match(/^(\d+)系列$/);
  if (!match || state.language === "zh") return series;
  return state.language === "en" ? `${match[1]} Series` : `Siri ${match[1]}`;
}

function localizedProductName(name) {
  const terms = productTerms[state.language];
  if (!terms) return String(name);
  return Object.keys(terms)
    .sort((left, right) => right.length - left.length)
    .reduce((translated, term) => translated.replaceAll(term, terms[term]), String(name))
    .replace(/\s{2,}/g, " ")
    .trim();
}

function spriteStyle(sprite) {
  const x = sprite.cols > 1 ? (sprite.x / (sprite.cols - 1)) * 100 : 0;
  const y = sprite.rows > 1 ? (sprite.y / (sprite.rows - 1)) * 100 : 0;
  return `background-image:url('${escapeHtml(sprite.image)}');background-size:${sprite.cols * 100}% ${sprite.rows * 100}%;background-position:${x}% ${y}%;`;
}

function cartMedia(item) {
  if (item.sprite) return `<span class="cart-sprite" style="${spriteStyle(item.sprite)}"></span>`;
  if (item.image) return `<img src="${escapeHtml(item.image)}" alt="" loading="lazy">`;
  return escapeHtml(item.glyph);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function renderCart() {
  const language = currentCopy();
  const items = state.cart.filter((item) => item.quantity > 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  $("#cartCount").textContent = totalItems;
  $("#cartButton").setAttribute("aria-label", language.cartAria(totalItems));
  $("#cartButton").setAttribute("title", language.cartTitle);
  $("#cartButton").dataset.label = language.cart;
  $("#cartButton").classList.toggle("has-items", totalItems > 0);
  $("#cartItemLabel").textContent = `(${totalItems})`;
  $("#cartTotal").textContent = currency(subtotal);
  $("#discountedTotal").textContent = discountCurrency(subtotal * 0.9);
  $("#shippingMessage").innerHTML = subtotal >= 180
    ? language.shippingDone
    : language.shippingGap(currency(180 - subtotal));
  const cartItems = $("#cartItems");

  if (!items.length) {
    cartItems.innerHTML = `<div class="empty-cart"><span>✦</span><p>${language.emptyCart}</p><button id="continueShopping">${language.continueShopping}</button></div>`;
    $("#continueShopping").addEventListener("click", closeCart);
    return;
  }

  cartItems.innerHTML = items.map((item) => {
    const name = localizedProductName(item.name);
    const brand = localizedSeries(item.brand);
    return `
      <article class="cart-line">
        <div class="cart-thumb ${escapeHtml(item.thumb)}">${cartMedia(item)}</div>
        <div class="cart-line-info">
          <p>${escapeHtml(brand)}</p><h3>${escapeHtml(name)}</h3><b>${currency(item.price)}</b>
          <button class="remove-item" data-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(currentCopy().removed)}">×</button>
          <div class="quantity"><button data-change="-1" data-id="${escapeHtml(item.id)}" aria-label="−">−</button><span>${item.quantity}</span><button data-change="1" data-id="${escapeHtml(item.id)}" aria-label="+">＋</button></div>
        </div>
      </article>`;
  }).join("");
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
  showToast(currentCopy().added(localizedProductName(product.name)));
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
  showToast(currentCopy().removed);
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
  const language = currentCopy();
  const name = localizedProductName(product.name);
  const category = localizedCategory(product.category);
  const productMedia = product.sprite
    ? `<span class="catalog-image catalog-sprite" style="${spriteStyle(product.sprite)}" role="img" aria-label="${escapeHtml(language.imageAlt(name))}"></span>`
    : product.image
    ? `<img class="catalog-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(language.imageAlt(name))}" loading="lazy" decoding="async">`
    : `<span class="product-code">${escapeHtml(product.glyph)}</span>`;
  return `
    <article class="product-card" data-category="${escapeHtml(product.category)}">
      <div class="product-visual catalog-visual ${escapeHtml(product.thumb)}">
        <span class="product-badge">${escapeHtml(localizedSeries(product.brand))}</span>
        ${productMedia}
        <span class="product-serial">${escapeHtml(name)}</span>
        <button class="quick-add" data-id="${escapeHtml(product.id)}" aria-label="${escapeHtml(language.addToCart)}">＋</button>
      </div>
      <div class="product-info">
        <p>${escapeHtml(category)}</p>
        <h3>${escapeHtml(name)}</h3>
        <div><span>${escapeHtml(language.productShort(category))}</span><b>${currency(product.price)}</b></div>
      </div>
    </article>`;
}

function renderProducts() {
  const language = currentCopy();
  const matches = matchedProducts();
  const visible = matches.slice(0, state.visibleProducts);
  $("#all-products").innerHTML = visible.map(productCard).join("");
  $("#catalogStatus").textContent = language.catalogStatus(visible.length, matches.length);
  const more = $("#catalogMore");
  more.hidden = visible.length >= matches.length;
  if (!more.hidden) $("#loadMoreButton").textContent = language.loadMore(matches.length - visible.length);
}

function filterProducts(filter) {
  state.activeFilter = filter;
  state.visibleProducts = 24;
  renderProducts();
}

function renderSearch(term = "") {
  const language = currentCopy();
  const query = term.trim().toLowerCase();
  const results = query
    ? catalogList.filter((product) => [product.name, localizedProductName(product.name), product.brand, localizedSeries(product.brand), product.category, localizedCategory(product.category), product.short].join(" ").toLowerCase().includes(query)).slice(0, 10)
    : [];
  const container = $("#searchResults");
  if (!query) {
    container.innerHTML = `<p style="color:#83777e;font-size:12px">${language.searchHint}</p>`;
    return;
  }
  container.innerHTML = results.length
    ? results.map((product) => `<div class="search-result"><span><b>${escapeHtml(localizedProductName(product.name))}</b><small> · ${escapeHtml(localizedSeries(product.brand))} · ${currency(product.price)}</small></span><button data-search-add="${escapeHtml(product.id)}">${language.addToCart}</button></div>`).join("")
    : `<p style="color:#83777e;font-size:12px">${language.searchNone}</p>`;
  $$("[data-search-add]").forEach((button) => button.addEventListener("click", () => {
    addToCart(button.dataset.searchAdd);
    $("#searchModal").classList.remove("open");
    openCart();
  }));
}

function translateStaticText() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return ["SCRIPT", "STYLE"].includes(node.parentElement?.tagName)
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const original = node.__velvetOriginalText ?? node.nodeValue;
    node.__velvetOriginalText = original;
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    const source = original.trim();
    const translated = state.language === "zh" ? source : staticText[source]?.[state.language];
    if (translated) node.nodeValue = `${leading}${translated}${trailing}`;
  });
}

function applyLanguage(language) {
  if (!copy[language]) return;
  state.language = language;
  try {
    localStorage.setItem("velvetNoirLanguage", language);
  } catch {
    // Language selection still works when browser storage is unavailable.
  }
  const languageCopy = currentCopy();
  document.documentElement.lang = language === "zh" ? "zh-Hans" : language;
  document.title = languageCopy.title;
  $("#languageCurrent").textContent = languageCopy.languageLabel;
  $("#languageToggle").setAttribute("aria-label", languageCopy.languageAria);
  $("#languageMenu").setAttribute("aria-label", languageCopy.languageAria);
  $("#searchButton").setAttribute("aria-label", languageCopy.searchPlaceholder);
  $("#searchButton").setAttribute("title", languageCopy.searchPlaceholder);
  $("#searchInput").setAttribute("placeholder", languageCopy.searchPlaceholder);
  $("#cartPanel").setAttribute("aria-label", languageCopy.cart);
  $$(".language-menu button").forEach((button) => button.classList.toggle("active", button.dataset.language === language));
  translateStaticText();
  renderCart();
  renderProducts();
  if ($("#searchModal").classList.contains("open")) renderSearch($("#searchInput").value);
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

$("#languageToggle").addEventListener("click", () => {
  const switcher = $("#languageSwitcher");
  const isOpen = switcher.classList.toggle("open");
  $("#languageToggle").setAttribute("aria-expanded", String(isOpen));
});
$$(".language-menu button").forEach((button) => button.addEventListener("click", () => {
  applyLanguage(button.dataset.language);
  $("#languageSwitcher").classList.remove("open");
  $("#languageToggle").setAttribute("aria-expanded", "false");
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
  showToast(currentCopy().newsletter);
});
$("#checkoutButton").addEventListener("click", () => {
  const language = currentCopy();
  if (!state.cart.length) return showToast(language.checkoutEmpty);
  const items = state.cart.filter((item) => item.quantity > 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderLines = items.map((item) => `• ${localizedProductName(item.name)} × ${item.quantity} — ${currency(item.price * item.quantity)}`).join("\n");
  const message = [
    language.whatsappGreeting,
    "",
    language.order,
    orderLines,
    "",
    `${language.subtotal}: ${currency(subtotal)}`,
    `${language.discount}: ${discountCurrency(subtotal * 0.9)}`,
    "",
    language.confirmation
  ].join("\n");
  window.open(`https://wa.me/601111146868?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  showToast(language.checkoutOpening);
});
$("#storyButton").addEventListener("click", () => {
  document.querySelector("#promise").scrollIntoView({ behavior: "smooth" });
});
$("#viewCatalogButton").addEventListener("click", () => {
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
});
document.addEventListener("click", (event) => {
  if (!$("#languageSwitcher").contains(event.target)) {
    $("#languageSwitcher").classList.remove("open");
    $("#languageToggle").setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    $("#searchModal").classList.remove("open");
    $("#languageSwitcher").classList.remove("open");
    $("#languageToggle").setAttribute("aria-expanded", "false");
  }
});

try {
  const savedLanguage = localStorage.getItem("velvetNoirLanguage");
  if (copy[savedLanguage]) state.language = savedLanguage;
} catch {
  // Chinese remains the default when browser storage is unavailable.
}
applyLanguage(state.language);
