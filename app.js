const fallbackCatalog = [
  { id: "rose", brand: "NOIR ATELIER", name: "Rosé Lace Set", price: 189, short: "蕾丝三件套 · 珊瑚粉", category: "其他系列", thumb: "other-series", glyph: "R" },
  { id: "glow", brand: "THE SENSORY LAB", name: "Warm Glow Body Oil", price: 109, short: "按摩身体油 · 琥珀香", category: "其他系列", thumb: "other-series", glyph: "G" },
  { id: "midnight", brand: "VELVET NOIR", name: "Midnight Ritual Box", price: 298, short: "双人探索礼盒", category: "其他系列", thumb: "other-series", glyph: "M" },
  { id: "ivory", brand: "NOIR ATELIER", name: "Ivory Whisper Slip", price: 169, short: "缎面睡裙 · 珍珠白", category: "其他系列", thumb: "other-series", glyph: "I" }
];

const catalogList = Array.isArray(window.fullLoveCatalog) && window.fullLoveCatalog.length ? window.fullLoveCatalog : fallbackCatalog;
const catalog = Object.fromEntries(catalogList.map((product) => [product.id, product]));
const state = { cart: [], activeFilter: "all", priceFilter: "all", visibleProducts: 24, language: "zh" };
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
    productConsult: "咨询尺码与库存 ↗",
    productConsultAria: (name) => `通过 WhatsApp 咨询 ${name} 的尺码与库存`,
    productConsultMessage: (name, series, price) => `你好 FullLove KL，我想咨询这款商品。\n\n商品：${name}\n系列：${series}\n价格：${price}\n\n请告诉我可选尺码、材质、包含件数与现货情况。`,
    productConsultOpening: "正在打开 WhatsApp 咨询…",
    deliveryPlaceholder: "例如：50000",
    deliveryAria: "输入 5 位 KL 邮编以确认配送",
    deliveryInvalid: "请输入 5 位邮编，客服会确认是否属于 KL 配送范围。",
    deliveryMessage: (postcode) => `你好 FullLove KL，我想确认配送。\n\nKL 邮编：${postcode}\n\n请确认是否可配送、最快送达时间、运费与满 RM180 免运资格。`,
    deliveryOpening: "正在打开 WhatsApp 确认配送…",
    privateConsultMessage: "你好 FullLove KL，我想咨询商品、尺寸、现货与 KL 配送。请协助我挑选。",
    privateConsultOpening: "正在打开 24h 私密客服…",
    feedbackMessage: "你好 FullLove KL，我想提交私密体验反馈。\n\n如方便，我会只提供商品编号与想分享的体验；请不要在公开页面展示任何可识别我的资料。",
    feedbackOpening: "正在打开私密体验反馈…",
    whatsappSupportAria: "通过 WhatsApp 联系 24h 在线客服",
    whatsappSupportTitle: "WhatsApp 24h 在线客服",
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
    productConsult: "Ask about size & stock ↗",
    productConsultAria: (name) => `Ask about size and stock for ${name} on WhatsApp`,
    productConsultMessage: (name, series, price) => `Hello FullLove KL, I would like to ask about this item.\n\nItem: ${name}\nSeries: ${series}\nPrice: ${price}\n\nPlease confirm available sizes, material, included pieces and current stock.`,
    productConsultOpening: "Opening WhatsApp support…",
    deliveryPlaceholder: "For example: 50000",
    deliveryAria: "Enter a 5-digit KL postcode to check delivery",
    deliveryInvalid: "Enter a 5-digit postcode and support will confirm the KL delivery area.",
    deliveryMessage: (postcode) => `Hello FullLove KL, I would like to check delivery.\n\nKL postcode: ${postcode}\n\nPlease confirm delivery coverage, earliest arrival, fee and free-delivery eligibility from RM180.`,
    deliveryOpening: "Opening WhatsApp delivery check…",
    privateConsultMessage: "Hello FullLove KL, I would like private support with product choice, sizing, stock and KL delivery.",
    privateConsultOpening: "Opening 24h private support…",
    feedbackMessage: "Hello FullLove KL, I would like to share private experience feedback.\n\nIf helpful, I will share only the product code and my experience. Please do not display any information that identifies me publicly.",
    feedbackOpening: "Opening private feedback…",
    whatsappSupportAria: "Contact 24h live support on WhatsApp",
    whatsappSupportTitle: "WhatsApp 24h live support",
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
    productConsult: "Tanya saiz & stok ↗",
    productConsultAria: (name) => `Tanya saiz dan stok ${name} melalui WhatsApp`,
    productConsultMessage: (name, series, price) => `Hai FullLove KL, saya ingin bertanya tentang item ini.\n\nItem: ${name}\nSiri: ${series}\nHarga: ${price}\n\nSila sahkan saiz tersedia, bahan, item yang disertakan dan stok semasa.`,
    productConsultOpening: "Membuka sokongan WhatsApp…",
    deliveryPlaceholder: "Contoh: 50000",
    deliveryAria: "Masukkan poskod KL 5 digit untuk semak penghantaran",
    deliveryInvalid: "Masukkan poskod 5 digit dan sokongan akan mengesahkan kawasan penghantaran KL.",
    deliveryMessage: (postcode) => `Hai FullLove KL, saya ingin menyemak penghantaran.\n\nPoskod KL: ${postcode}\n\nSila sahkan liputan penghantaran, masa tiba paling awal, caj dan kelayakan penghantaran percuma dari RM180.`,
    deliveryOpening: "Membuka semakan penghantaran WhatsApp…",
    privateConsultMessage: "Hai FullLove KL, saya ingin bantuan peribadi untuk pilihan produk, saiz, stok dan penghantaran KL.",
    privateConsultOpening: "Membuka sokongan peribadi 24 jam…",
    feedbackMessage: "Hai FullLove KL, saya ingin berkongsi maklum balas pengalaman secara peribadi.\n\nJika membantu, saya hanya akan berkongsi kod produk dan pengalaman saya. Sila jangan paparkan maklumat yang boleh mengenal pasti saya secara terbuka.",
    feedbackOpening: "Membuka maklum balas peribadi…",
    whatsappSupportAria: "Hubungi khidmat pelanggan 24 jam melalui WhatsApp",
    whatsappSupportTitle: "Khidmat pelanggan WhatsApp 24 jam",
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
  "按预算快速选": { en: "Shop by budget", ms: "Pilih ikut bajet" },
  "全部价格": { en: "All prices", ms: "Semua harga" },
  "先确认配送，": { en: "Confirm delivery", ms: "Sahkan penghantaran" },
  "再安心下单。": { en: "then order with ease.", ms: "kemudian pesan dengan yakin." },
  "输入 KL 邮编，客服会在 WhatsApp 确认可配送范围、最快送达时间与最终运费。邮编不会保存在网站内。": { en: "Enter a KL postcode and support will confirm coverage, the earliest arrival and final delivery fee on WhatsApp. The postcode is not saved by this website.", ms: "Masukkan poskod KL dan sokongan akan mengesahkan liputan, masa tiba paling awal dan caj penghantaran akhir melalui WhatsApp. Poskod tidak disimpan oleh laman ini." },
  "KL 邮编": { en: "KL postcode", ms: "Poskod KL" },
  "确认配送": { en: "Check delivery", ms: "Semak penghantaran" },
  "客服会先确认库存与配送，再在私域完成付款与派送安排。": { en: "Support confirms stock and delivery before arranging payment and dispatch privately.", ms: "Sokongan mengesahkan stok dan penghantaran sebelum mengatur pembayaran dan penghantaran secara peribadi." },
  "挑选款式": { en: "Choose your style", ms: "Pilih gaya anda" },
  "加入购物袋，或直接咨询尺码与库存。": { en: "Add to your bag, or ask directly about size and stock.", ms: "Tambah ke troli, atau tanya terus tentang saiz dan stok." },
  "WhatsApp 确认": { en: "Confirm on WhatsApp", ms: "Sahkan di WhatsApp" },
  "客服确认现货、配送范围与最终金额。": { en: "Support confirms stock, delivery coverage and the final total.", ms: "Sokongan mengesahkan stok, liputan penghantaran dan jumlah akhir." },
  "私密安排送达": { en: "Arrange discreet delivery", ms: "Atur penghantaran sulit" },
  "确认后安排隐私包装与 Lalamove 配送。": { en: "After confirmation, discreet packaging and Lalamove delivery are arranged.", ms: "Selepas pengesahan, pembungkusan sulit dan penghantaran Lalamove diatur." },
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
  "从咨询到签收，": { en: "From consultation to receipt,", ms: "Dari konsultasi hingga penerimaan," },
  "都保持私密。": { en: "keep it private.", ms: "kekal peribadi." },
  "没有站内付款：先由 24h 客服确认商品、尺寸、配送与金额，再安排私域成交与派送。": { en: "There is no on-site payment: 24h support first confirms the item, sizing, delivery and price, then arranges the private order and dispatch.", ms: "Tiada pembayaran di laman: sokongan 24 jam mengesahkan item, saiz, penghantaran dan harga dahulu, kemudian mengatur pesanan dan penghantaran peribadi." },
  "24h 私密咨询": { en: "24h private support", ms: "Sokongan peribadi 24 jam" },
  "私密体验反馈": { en: "Private experience feedback", ms: "Maklum balas pengalaman peribadi" },
  "网站不会收集或保存你的手机号、地址或订单资料；请只在 WhatsApp 按订单需要提供资料。": { en: "This website does not collect or store your phone number, address or order details; share only what is needed for the order on WhatsApp.", ms: "Laman ini tidak mengumpul atau menyimpan nombor telefon, alamat atau butiran pesanan anda; kongsi hanya yang diperlukan untuk pesanan melalui WhatsApp." },
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
  "24h 在线客服": { en: "24h live support", ms: "Khidmat pelanggan 24 jam" },
  "微信下单请添加：": { en: "Add on WeChat to order:", ms: "Tambah WeChat untuk membuat pesanan:" },
  "隐私发货 · 不支持自取 · 满 RM180 包邮 Lalamove": { en: "Discreet dispatch · No self-collection · Free Lalamove delivery from RM180", ms: "Penghantaran sulit · Tiada ambil sendiri · Lalamove percuma untuk pesanan RM180 ke atas" },
  "到货即视为使用，不支持退换，请谨慎购买。": { en: "Delivery is treated as use. Returns and exchanges are not accepted; please purchase carefully.", ms: "Barang yang telah sampai dianggap telah digunakan. Pemulangan atau pertukaran tidak diterima; sila beli dengan teliti." },
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

const supportContent = {
  zh: {
    title: "购买前，请先看这里。",
    intro: "卫生、配送、订单与使用规则都写在这里；提交订单即表示你已阅读并同意适用条款。",
    updated: "最后更新：2026 年 8 月 27 日",
    sections: [
      {
        id: "support-returns",
        number: "01",
        title: "退换与卫生规则",
        lead: "到货即视为使用，不支持退换，请谨慎购买。",
        paragraphs: [
          "为保护贴身用品的卫生、安全与每一位顾客的权益，情趣内衣、网袜、网衣及其他个人使用类商品一经完成派送或交付，即按本规则视为已使用。除适用法律不得排除的权利外，不接受因个人偏好、颜色或尺寸选择、重复下单、临时改变主意、已拆封或已签收后提出的退换请求。",
          "如收到的商品与已确认订单明显不符、运输途中出现明显损坏，或在首次检查时发现可见瑕疵，请在签收后 24 小时内保留完整外包装、商品标签与未使用状态，并通过下单使用的联络渠道提交订单资料及清晰照片／视频，以便核查。提交资料并不代表自动获准退款、换货或补寄；每个个案会按实际情况与适用法律处理。",
          "下单前请仔细查看商品编号、颜色、尺码与价格；如对款式、材质、配送范围或使用方式有疑问，请先提出确认。"
        ],
        bullets: [
          "签收、骑手标记完成或由收件人／授权人员接收，均视为到货。",
          "请勿在提出商品异常核查前穿戴、清洗、试用或丢弃包装。",
          "本规则不意图限制任何不能依法排除的消费者权利。"
        ]
      },
      {
        id: "support-delivery",
        number: "02",
        title: "配送、签收与地址规则",
        lead: "下单即极速发货；KL 市区目标为 1.5 小时内 Lalamove 送达。",
        paragraphs: [
          "极速发货与 1.5 小时送达为 KL 市区的目标时效，须以库存、订单资料、收件地址、骑手接单、道路、天气、节假日与现场情况允许为前提，并非固定保证时限。订单确认前、缺货、地址不完整、联络不上收件人或出现不可控延误时，配送时间可能调整。",
          "本店只提供配送，不支持到店自取或安排私下取货。请在下单时提供可安全接收的详细地址与可联络方式；如需更改地址，请在骑手接单前尽快提出。骑手已接单、已到达或配送开始后，地址改动、等待、绕路或二次派送可能产生额外费用，并须先获确认。",
          "购物车商品小计满 RM180 可享一次 Lalamove 免运费资格；最终配送范围、可能的附加费用及可否适用优惠，以订单确认时的说明为准。"
        ],
        bullets: [
          "所有包裹采用无标识隐私包装，外箱不展示商品名称或品牌。",
          "请留意骑手来电／讯息并安排接收；无人接收、错误地址或超时等情形可能影响配送。",
          "配送完成后，请先检查外包装是否完整，再按卫生规则处理商品。"
        ]
      },
      {
        id: "support-orders",
        number: "03",
        title: "订单、库存与价格说明",
        lead: "商品以订单确认时的库存、价格与配送条件为准。",
        paragraphs: [
          "网站展示内容用于协助挑选；商品图片、色调、包装、蕾丝纹理与配件会因拍摄光线、屏幕显示、批次或供货调整出现合理差异。除非已在下单沟通中明确确认，商品展示不构成对即时库存、特定颜色、特定配件或到货时间的保证。",
          "所有价格以 RM 为单位。加入购物袋不代表锁定库存或保留价格；只有在库存、款号、数量、配送地址、适用优惠与最终金额获得确认后，订单才会进入处理。若出现明显标价错误、重复订单、库存不足、无法完成配送或存在合理的风险提示，订单可能需要更正、取消或重新确认。",
          "通过 WhatsApp 或微信完成的订单可按当时公布的 9 折通讯下单优惠处理；除非订单确认时另有明确说明，不同优惠、赠品、运费优惠和未来优惠券不可自动叠加。"
        ],
        bullets: [
          "请使用商品编号确认款式，避免仅以图片或昵称判断。",
          "下单后如需变更，请在订单进入配送前提出；能否处理取决于库存与配送状态。",
          "请仅为本人或获授权的成年人购买及使用商品。"
        ]
      },
      {
        id: "support-promotions",
        number: "04",
        title: "优惠券与促销规则",
        lead: "RM10 手机优惠券计划尚未启用；启用前不会在本网站收集手机号。",
        paragraphs: [
          "计划启用后，RM10 优惠券将设有最低 RM30 商品小计门槛，并在符合条件的购物袋中自动扣减。届时优惠券页面会在提交手机号之前显示独立的同意说明、发券方式、有效期、适用范围、是否可与其他优惠同时使用，以及删除或停止营销联络的方式。",
          "为了避免误导，在安全资料库、私密后台、发券通道和核销记录尚未配置完成前，网站不会显示一个看似已提交但实际没有被安全保存的手机号表单，也不会假称已发送短信或优惠券。",
          "任何已启用的优惠以页面显示的条件及订单确认结果为准。系统会拒绝明显重复、篡改、转售、批量取得或不符合门槛的使用方式；如出现异常，优惠可能被撤销或要求重新确认。"
        ],
        bullets: [
          "RM10 优惠券的门槛将按商品小计计算，运费与不可叠加折扣不计入门槛。",
          "优惠券仅供本人正常消费使用，不兑换现金、不找零。",
          "后续若启用手机号收集，收集目的、保存期限与数据权利会在表单旁再次说明。"
        ]
      },
      {
        id: "support-terms",
        number: "05",
        title: "使用条款与成人责任",
        lead: "本网站及商品仅面向年满 18 岁、且所在地法律允许的成年人。",
        paragraphs: [
          "继续浏览、加入购物袋、使用优惠或提交订单，即表示你确认自己符合年龄与所在地法律要求，并同意不为未成年人购买、不向未成年人转交商品，也不会将网站或商品用于任何违法、伤害、骚扰、胁迫或未经同意的用途。",
          "商品资讯仅为一般产品说明，并非医疗、健康、心理、法律或专业意见。请依照包装说明使用；如对材质敏感、处于特殊健康状况，或使用时出现不适，应立即停止并寻求合适的专业意见。",
          "网站可为维护安全、库存准确性、优惠公平性与服务稳定性而更新商品、价格、规则或页面内容。更新不会追溯改变已经确认的订单，除非为处理明显错误、法律义务或双方另行同意的事项。"
        ],
        bullets: [
          "不得复制、抓取、批量下载或以自动化方式滥用网站内容、价格或优惠。",
          "不得冒用他人资料、提交虚假地址，或干扰配送与订单确认流程。",
          "如条款的任何部分无效，其余部分在法律允许范围内继续适用。"
        ]
      },
      {
        id: "support-privacy",
        number: "06",
        title: "隐私政策与资料权利",
        lead: "本网站目前不设服务器端手机号收集；不会把访客号码写入公开代码库。",
        paragraphs: [
          "当前网站在你的装置内使用必要的本地状态来记住年龄确认和语言选择；这些状态用于页面体验，不会由网站直接上传为可识别的访客资料。邮箱订阅展示目前也未连接资料库。若你主动跳转至 WhatsApp、微信或其他联络渠道下单，后续讯息及联络资料会在对应平台与订单沟通流程中处理，并受该平台规则及订单所需用途约束。",
          "若日后启用手机号优惠券功能，表单会在收集前明确说明：收集的资料种类、用途（发券、核销、防止滥用及在你另行同意时的营销联络）、保存期限、可能接收资料的服务商、跨境处理情形、如何撤回同意，以及查询、更正或删除资料的联络方式。号码将只存放于受访问控制的私密资料库，绝不写入 GitHub、网页源代码或公开报表。",
          "你有权在适用法律允许范围内了解资料处理目的、选择是否提供、要求查阅、更正或删除资料，以及停止直接营销联络。与个人资料有关的请求应通过你下单或提交资料时显示的私密支援渠道提出；为保护安全，处理前可能需要合理的身份验证。"
        ],
        bullets: [
          "不会出售、公开展示或以公开下载方式分享个人联系方式。",
          "仅保留为已说明目的所必需的资料，并采取合理措施防止未授权访问、误用或遗失。",
          "政策更新会在本页面公布；收集前会提供当时版本的通知与选择。"
        ]
      }
    ]
  },
  en: {
    title: "Please read before you buy.",
    intro: "Hygiene, delivery, order and use rules are set out here. By placing an order, you confirm that you have read and accepted the applicable terms.",
    updated: "Last updated: 27 August 2026",
    sections: [
      {
        id: "support-returns", number: "01", title: "Returns & hygiene", lead: "Delivery is treated as use. Returns and exchanges are not accepted; please purchase carefully.",
        paragraphs: [
          "To protect hygiene, safety and every customer's interests, intimate apparel, hosiery, fishnet wear and other personal-use items are treated as used once delivery or handover is completed. Except for rights that cannot be excluded under applicable law, requests based on preference, colour or size choice, duplicate orders, a change of mind, opening or accepting a parcel are not eligible for return or exchange.",
          "If an item clearly differs from the confirmed order, is visibly damaged in transit, or has an apparent defect on first inspection, keep the outer packaging, labels and item unused. Send the order details and clear photos or video through the ordering channel within 24 hours of delivery so it can be reviewed. Sending information does not automatically approve a refund, replacement or reshipment; each case is assessed on its facts and applicable law.",
          "Please check the product code, colour, size and price carefully before ordering. Ask for clarification before purchase if you are unsure about a style, material, delivery area or use."
        ],
        bullets: ["A completed rider status or receipt by the recipient or an authorised person counts as delivery.", "Do not wear, wash, try or discard packaging before an item issue is reviewed.", "Nothing here is intended to remove consumer rights that cannot legally be excluded."]
      },
      {
        id: "support-delivery", number: "02", title: "Delivery, receipt & address", lead: "Orders are dispatched fast; central KL Lalamove delivery targets arrival within 1.5 hours.",
        paragraphs: [
          "Fast dispatch and the 1.5-hour target apply to central KL only and depend on stock, order details, address, rider availability, traffic, weather, public holidays and on-site conditions. They are targets, not fixed guarantees. Timing may change when stock needs confirmation, details are incomplete, the recipient cannot be reached or an event outside reasonable control occurs.",
          "Delivery is provided only; self-collection and informal pickup are not available. Provide a safe, detailed delivery address and a reachable contact method when ordering. Request an address change before a rider accepts the job. After acceptance, arrival or dispatch, address changes, waiting, detours or re-delivery may carry an additional charge and require confirmation first.",
          "One Lalamove delivery-fee waiver is available when the cart item subtotal reaches RM180. The final service area, any surcharge and eligibility are confirmed with the order."
        ],
        bullets: ["All parcels use unmarked discreet packaging; the outer box does not show a product name or brand.", "Please watch for rider calls or messages and arrange receipt; an unattended delivery, wrong address or delay may affect service.", "Check the outer package first after delivery, then follow the hygiene rules for the item."]
      },
      {
        id: "support-orders", number: "03", title: "Orders, stock & pricing", lead: "Stock, price and delivery terms are confirmed with the order.",
        paragraphs: [
          "Website content is provided to help with selection. Product photos, colour tone, packaging, lace texture and accessories can vary reasonably with lighting, screens, batches or supplier changes. Unless confirmed in the order conversation, a display does not guarantee live stock, a particular colour or accessory, or a delivery time.",
          "All prices are in RM. Adding an item to the bag does not reserve stock or lock a price. An order moves to processing only after stock, product code, quantity, delivery address, eligible promotions and final amount are confirmed. Obvious pricing errors, duplicate orders, unavailable stock, an unserviceable delivery or a reasonable risk signal may require correction, cancellation or reconfirmation.",
          "WhatsApp or WeChat orders may receive the advertised 10% contact-order offer. Unless the order confirmation clearly states otherwise, separate promotions, gifts, delivery offers and future coupons do not automatically stack."
        ],
        bullets: ["Use the product code to confirm a style rather than relying only on a photo or nickname.", "Request changes before delivery begins; whether a change can be made depends on stock and delivery status.", "Purchase and use products only for yourself or another authorised adult."]
      },
      {
        id: "support-promotions", number: "04", title: "Coupons & promotions", lead: "The RM10 mobile coupon programme is not active yet; this website will not collect phone numbers before it is safely launched.",
        paragraphs: [
          "When launched, the RM10 coupon will have a RM30 item-subtotal minimum and will deduct automatically from an eligible bag. Before a phone number is submitted, the campaign page will show separate consent, delivery method, validity, scope, stacking rules and a way to delete data or stop marketing contact.",
          "To avoid misleading visitors, no phone form that appears submitted without secure storage will be shown while the private database, access-controlled dashboard, delivery channel and redemption record are not configured. The site will not claim that a message or coupon was sent when it was not.",
          "Any active promotion is governed by the conditions displayed at the time and the order confirmation. Clearly duplicate, altered, resold, bulk-obtained or ineligible use may be rejected, withdrawn or require reconfirmation."
        ],
        bullets: ["The RM10 threshold will be based on item subtotal; delivery and non-stackable discounts do not count toward it.", "Coupons are for ordinary personal purchases only, are not cash and have no change value.", "If phone collection is activated later, the purpose, retention period and data rights will be stated beside the form again."]
      },
      {
        id: "support-terms", number: "05", title: "Terms & adult responsibility", lead: "This site and its products are for adults aged 18+ where permitted by local law.",
        paragraphs: [
          "By browsing, adding items, using a promotion or placing an order, you confirm that you meet the age and local-law requirements. You agree not to purchase for or transfer products to a minor, and not to use the site or products for unlawful, harmful, harassing, coercive or non-consensual purposes.",
          "Product information is general product information, not medical, health, psychological, legal or professional advice. Follow packaging instructions. If you have material sensitivities, a relevant health condition or discomfort during use, stop use and seek suitable professional advice.",
          "Content, products, prices, rules and pages may be updated to maintain safety, stock accuracy, promotion fairness and service reliability. An update will not retrospectively change a confirmed order except to correct an obvious error, meet a legal duty or where otherwise agreed."
        ],
        bullets: ["Do not copy, scrape, bulk-download or automate misuse of site content, prices or promotions.", "Do not use another person's details, submit a false address or interfere with delivery or confirmation.", "If one part of these terms is invalid, the remaining parts continue where legally allowed."]
      },
      {
        id: "support-privacy", number: "06", title: "Privacy notice & data rights", lead: "This site currently has no server-side phone collection and never writes visitor phone numbers to a public code repository.",
        paragraphs: [
          "The current site uses necessary local device state for age confirmation and language choice. It supports the page experience and is not uploaded by the site as identifiable visitor data. The newsletter display is not connected to a database. If you choose to open WhatsApp, WeChat or another ordering channel, later messages and contact information are handled in that platform and ordering flow, subject to its rules and the purposes required for the order.",
          "If a mobile coupon is enabled later, the form will explain before collection: the data types, purposes (coupon delivery, redemption, abuse prevention and marketing only with separate permission), retention period, possible service providers, any cross-border processing, consent withdrawal, and how to request access, correction or deletion. Numbers will be kept only in an access-controlled private database, never in GitHub, page source or a public report.",
          "Within applicable law, you may ask about the purpose of processing, choose whether to provide data, request access, correction or deletion, and stop direct marketing. Personal-data requests should use the private support route displayed when you place an order or submit data; reasonable identity checks may be needed to protect security."
        ],
        bullets: ["Personal contact details are not sold, publicly displayed or shared through public downloads.", "Data is retained only as long as needed for the stated purpose, with reasonable measures against unauthorised access, misuse or loss.", "Updates will be published here, and the current notice and choice will be shown before any collection."]
      }
    ]
  },
  ms: {
    title: "Sila baca sebelum membeli.",
    intro: "Peraturan kebersihan, penghantaran, pesanan dan penggunaan diterangkan di sini. Dengan membuat pesanan, anda mengesahkan bahawa anda telah membaca dan menerima terma yang terpakai.",
    updated: "Kemas kini terakhir: 27 Ogos 2026",
    sections: [
      {
        id: "support-returns", number: "01", title: "Pemulangan & kebersihan", lead: "Barang yang telah sampai dianggap telah digunakan. Pemulangan atau pertukaran tidak diterima; sila beli dengan teliti.",
        paragraphs: [
          "Bagi melindungi kebersihan, keselamatan dan kepentingan setiap pelanggan, pakaian intim, stoking, pakaian jala dan barangan kegunaan peribadi lain dianggap telah digunakan sebaik sahaja penghantaran atau serahan selesai. Kecuali hak yang tidak boleh dikecualikan di bawah undang-undang terpakai, permintaan kerana pilihan peribadi, pilihan warna atau saiz, pesanan berganda, berubah fikiran, pembukaan atau penerimaan bungkusan tidak layak untuk pemulangan atau pertukaran.",
          "Jika barang jelas berbeza daripada pesanan yang disahkan, rosak dengan ketara semasa penghantaran, atau mempunyai kecacatan nyata semasa pemeriksaan pertama, simpan pembungkusan luar, label dan barang dalam keadaan tidak digunakan. Hantar butiran pesanan serta foto atau video yang jelas melalui saluran pesanan dalam tempoh 24 jam selepas diterima untuk semakan. Penghantaran maklumat tidak bermaksud bayaran balik, gantian atau penghantaran semula diluluskan secara automatik; setiap kes dinilai mengikut fakta dan undang-undang terpakai.",
          "Sila semak kod produk, warna, saiz dan harga dengan teliti sebelum membuat pesanan. Minta penjelasan dahulu jika anda tidak pasti tentang gaya, bahan, kawasan penghantaran atau cara penggunaan."
        ],
        bullets: ["Status penghantaran selesai atau penerimaan oleh penerima atau orang yang diberi kuasa dikira sebagai sampai.", "Jangan pakai, cuci, cuba atau buang pembungkusan sebelum isu barang disemak.", "Tiada bahagian di sini bertujuan menghapuskan hak pengguna yang tidak boleh dikecualikan secara sah."]
      },
      {
        id: "support-delivery", number: "02", title: "Penghantaran, penerimaan & alamat", lead: "Pesanan dihantar segera; penghantaran Lalamove di pusat KL menyasarkan ketibaan dalam 1.5 jam.",
        paragraphs: [
          "Penghantaran segera dan sasaran 1.5 jam hanya untuk pusat KL dan bergantung pada stok, butiran pesanan, alamat, ketersediaan penghantar, trafik, cuaca, cuti umum dan keadaan di lokasi. Ia ialah sasaran, bukan jaminan masa tetap. Masa mungkin berubah apabila stok perlu disahkan, butiran tidak lengkap, penerima tidak dapat dihubungi atau berlaku kejadian di luar kawalan munasabah.",
          "Hanya penghantaran disediakan; ambil sendiri atau kutipan tidak rasmi tidak tersedia. Berikan alamat penghantaran yang selamat dan terperinci serta cara hubungan yang boleh dihubungi semasa membuat pesanan. Minta pertukaran alamat sebelum penghantar menerima tugasan. Selepas penerimaan tugasan, ketibaan atau penghantaran bermula, pertukaran alamat, menunggu, lencongan atau penghantaran semula mungkin dikenakan caj tambahan dan perlu disahkan dahulu.",
          "Satu pengecualian caj penghantaran Lalamove tersedia apabila jumlah kecil barang dalam troli mencapai RM180. Kawasan servis akhir, sebarang caj tambahan dan kelayakan disahkan bersama pesanan."
        ],
        bullets: ["Semua bungkusan menggunakan pembungkusan sulit tanpa label; kotak luar tidak memaparkan nama produk atau jenama.", "Sila perhatikan panggilan atau mesej penghantar dan aturkan penerimaan; penghantaran tanpa penerima, alamat salah atau kelewatan boleh menjejaskan servis.", "Periksa bungkusan luar dahulu selepas diterima, kemudian ikut peraturan kebersihan bagi barang tersebut."]
      },
      {
        id: "support-orders", number: "03", title: "Pesanan, stok & harga", lead: "Stok, harga dan syarat penghantaran disahkan bersama pesanan.",
        paragraphs: [
          "Kandungan laman membantu pemilihan. Foto produk, tona warna, pembungkusan, tekstur renda dan aksesori boleh berubah secara munasabah mengikut pencahayaan, skrin, kelompok atau perubahan pembekal. Melainkan telah disahkan dalam perbualan pesanan, paparan tidak menjamin stok langsung, warna atau aksesori tertentu, atau masa penghantaran.",
          "Semua harga dalam RM. Menambah barang ke troli tidak menempah stok atau mengunci harga. Pesanan diproses hanya selepas stok, kod produk, kuantiti, alamat penghantaran, promosi layak dan jumlah akhir disahkan. Kesilapan harga yang jelas, pesanan berganda, stok tiada, penghantaran tidak dapat disediakan atau isyarat risiko munasabah mungkin memerlukan pembetulan, pembatalan atau pengesahan semula.",
          "Pesanan melalui WhatsApp atau WeChat boleh menerima tawaran diskaun 10% pesanan komunikasi. Melainkan pengesahan pesanan menyatakan sebaliknya, promosi, hadiah, tawaran penghantaran dan kupon masa depan tidak digabungkan secara automatik."
        ],
        bullets: ["Gunakan kod produk untuk mengesahkan gaya dan bukan bergantung hanya pada foto atau nama ringkas.", "Minta perubahan sebelum penghantaran bermula; ia bergantung pada stok dan status penghantaran.", "Beli dan gunakan produk hanya untuk diri sendiri atau orang dewasa yang diberi kuasa."]
      },
      {
        id: "support-promotions", number: "04", title: "Kupon & promosi", lead: "Program kupon telefon RM10 belum aktif; laman ini tidak akan mengumpul nombor telefon sebelum ia dilancarkan dengan selamat.",
        paragraphs: [
          "Apabila dilancarkan, kupon RM10 akan mempunyai jumlah kecil barang minimum RM30 dan akan ditolak secara automatik daripada troli yang layak. Sebelum nombor telefon dihantar, halaman kempen akan memaparkan persetujuan berasingan, cara penghantaran, tempoh sah, skop, peraturan gabungan dan cara memadam data atau menghentikan pemasaran.",
          "Bagi mengelakkan pengunjung disesatkan, tiada borang telefon yang kelihatan seperti telah dihantar tanpa storan selamat akan dipaparkan selagi pangkalan data peribadi, papan pemuka kawalan akses, saluran penghantaran dan rekod penebusan belum disediakan. Laman tidak akan mendakwa mesej atau kupon telah dihantar jika ia belum dihantar.",
          "Promosi aktif tertakluk pada syarat yang dipaparkan ketika itu dan pengesahan pesanan. Penggunaan yang jelas berganda, diubah suai, dijual semula, diperoleh secara pukal atau tidak layak boleh ditolak, ditarik balik atau memerlukan pengesahan semula."
        ],
        bullets: ["Ambang RM10 dikira berdasarkan jumlah kecil barang; penghantaran dan diskaun yang tidak boleh digabungkan tidak dikira.", "Kupon untuk pembelian peribadi biasa sahaja, bukan tunai dan tiada baki wang.", "Jika pengumpulan telefon diaktifkan kemudian, tujuan, tempoh simpanan dan hak data akan dinyatakan di sebelah borang sekali lagi."]
      },
      {
        id: "support-terms", number: "05", title: "Terma & tanggungjawab dewasa", lead: "Laman dan produknya adalah untuk orang dewasa berumur 18 tahun ke atas apabila dibenarkan undang-undang tempatan.",
        paragraphs: [
          "Dengan melayari, menambah barang, menggunakan promosi atau membuat pesanan, anda mengesahkan bahawa anda memenuhi umur dan undang-undang tempatan. Anda bersetuju untuk tidak membeli untuk atau menyerahkan produk kepada kanak-kanak bawah umur, dan tidak menggunakan laman atau produk untuk tujuan yang menyalahi undang-undang, memudaratkan, mengganggu, memaksa atau tanpa persetujuan.",
          "Maklumat produk ialah maklumat umum dan bukan nasihat perubatan, kesihatan, psikologi, undang-undang atau profesional. Ikuti arahan pembungkusan. Jika anda sensitif kepada bahan, mempunyai keadaan kesihatan berkaitan atau berasa tidak selesa ketika penggunaan, hentikan penggunaan dan dapatkan nasihat profesional yang sesuai.",
          "Kandungan, produk, harga, peraturan dan halaman boleh dikemas kini untuk menjaga keselamatan, ketepatan stok, keadilan promosi dan kebolehpercayaan servis. Kemas kini tidak mengubah pesanan yang telah disahkan secara retrospektif kecuali untuk membetulkan kesilapan nyata, memenuhi kewajipan undang-undang atau jika dipersetujui sebaliknya."
        ],
        bullets: ["Jangan salin, mengikis, memuat turun secara pukal atau mengautomasikan penyalahgunaan kandungan, harga atau promosi laman.", "Jangan gunakan butiran orang lain, alamat palsu atau mengganggu proses penghantaran dan pengesahan.", "Jika satu bahagian terma tidak sah, bahagian lain terus terpakai setakat yang dibenarkan undang-undang."]
      },
      {
        id: "support-privacy", number: "06", title: "Notis privasi & hak data", lead: "Laman ini kini tidak mempunyai pengumpulan telefon di pelayan dan tidak pernah menulis nombor telefon pengunjung ke repositori kod awam.",
        paragraphs: [
          "Laman semasa menggunakan keadaan peranti tempatan yang perlu untuk pengesahan umur dan pilihan bahasa. Ia menyokong pengalaman laman dan tidak dimuat naik oleh laman sebagai data pengunjung yang boleh dikenal pasti. Paparan langganan e-mel tidak disambungkan kepada pangkalan data. Jika anda memilih untuk membuka WhatsApp, WeChat atau saluran pesanan lain, mesej dan maklumat hubungan seterusnya dikendalikan dalam platform dan aliran pesanan tersebut, tertakluk kepada peraturannya dan tujuan pesanan.",
          "Jika kupon telefon diaktifkan kemudian, borang akan menerangkan sebelum pengumpulan: jenis data, tujuan (penghantaran kupon, penebusan, pencegahan penyalahgunaan dan pemasaran hanya dengan kebenaran berasingan), tempoh simpanan, penyedia servis yang mungkin, pemprosesan rentas sempadan, penarikan balik persetujuan, serta cara meminta akses, pembetulan atau pemadaman. Nombor hanya disimpan dalam pangkalan data peribadi dengan kawalan akses, bukan dalam GitHub, sumber halaman atau laporan awam.",
          "Dalam lingkungan undang-undang terpakai, anda boleh bertanya tujuan pemprosesan, memilih sama ada untuk memberi data, meminta akses, pembetulan atau pemadaman, dan menghentikan pemasaran langsung. Permintaan data peribadi perlu menggunakan saluran sokongan peribadi yang dipaparkan semasa pesanan atau penghantaran data; pemeriksaan identiti munasabah mungkin diperlukan untuk keselamatan."
        ],
        bullets: ["Butiran hubungan peribadi tidak dijual, dipaparkan kepada umum atau dikongsi melalui muat turun awam.", "Data disimpan hanya selama perlu untuk tujuan yang dinyatakan, dengan langkah munasabah terhadap akses tanpa kebenaran, penyalahgunaan atau kehilangan.", "Kemas kini diterbitkan di sini, dan notis serta pilihan semasa akan dipaparkan sebelum sebarang pengumpulan."]
      }
    ]
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

function renderSupport() {
  const support = supportContent[state.language];
  if (!support || !$("#supportContent")) return;
  $("#supportTitle").textContent = support.title;
  $("#supportIntro").textContent = support.intro;
  const visibleSections = support.sections.filter((section) => !["support-promotions", "support-privacy"].includes(section.id));
  $("#supportContent").innerHTML = visibleSections.map((section, index) => `
    <details class="support-card" id="${escapeHtml(section.id)}"${section.id === "support-returns" ? " open" : ""}>
      <summary><span>${String(index + 1).padStart(2, "0")}</span><b>${escapeHtml(section.title)}</b><i aria-hidden="true">＋</i></summary>
      <div class="support-card-content">
        <p class="policy-lead">${escapeHtml(section.lead)}</p>
        ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        <ul>${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
        <p class="policy-update">${escapeHtml(support.updated)}</p>
      </div>
    </details>`).join("");
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

function openWhatsAppMessage(message) {
  window.open(`https://wa.me/601111146868?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

function priceMatches(product) {
  if (state.priceFilter === "under-20") return product.price < 20;
  if (state.priceFilter === "20-39") return product.price >= 20 && product.price < 40;
  if (state.priceFilter === "40-plus") return product.price >= 40;
  return true;
}

function matchedProducts() {
  return catalogList.filter((product) => (state.activeFilter === "all" || product.category === state.activeFilter) && priceMatches(product));
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
        <div class="product-actions"><button class="product-consult" data-consult-id="${escapeHtml(product.id)}" type="button" aria-label="${escapeHtml(language.productConsultAria(name))}">${escapeHtml(language.productConsult)}</button></div>
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

function filterByPrice(priceFilter) {
  state.priceFilter = priceFilter;
  state.visibleProducts = 24;
  renderProducts();
}

function consultProduct(id) {
  const product = catalog[id];
  if (!product) return;
  const language = currentCopy();
  openWhatsAppMessage(language.productConsultMessage(
    localizedProductName(product.name),
    localizedSeries(product.brand),
    currency(product.price)
  ));
  showToast(language.productConsultOpening);
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
  $("#whatsappSupportButton").setAttribute("aria-label", languageCopy.whatsappSupportAria);
  $("#whatsappSupportButton").setAttribute("title", languageCopy.whatsappSupportTitle);
  $("#deliveryPostcode").setAttribute("placeholder", languageCopy.deliveryPlaceholder);
  $("#deliveryPostcode").setAttribute("aria-label", languageCopy.deliveryAria);
  $$(".language-menu button").forEach((button) => button.classList.toggle("active", button.dataset.language === language));
  translateStaticText();
  renderSupport();
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
  const consult = event.target.closest(".product-consult");
  if (consult) return consultProduct(consult.dataset.consultId);
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

$$(".price-filters button").forEach((button) => button.addEventListener("click", () => {
  $$(".price-filters button").forEach((filter) => {
    const active = filter === button;
    filter.classList.toggle("active", active);
    filter.setAttribute("aria-pressed", String(active));
  });
  filterByPrice(button.dataset.priceFilter);
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

$("#deliveryCheckForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const language = currentCopy();
  const postcode = $("#deliveryPostcode").value.trim();
  if (!/^\d{5}$/.test(postcode)) return showToast(language.deliveryInvalid);
  openWhatsAppMessage(language.deliveryMessage(postcode));
  showToast(language.deliveryOpening);
});
$("#privateConsultButton").addEventListener("click", () => {
  const language = currentCopy();
  openWhatsAppMessage(language.privateConsultMessage);
  showToast(language.privateConsultOpening);
});
$("#feedbackButton").addEventListener("click", () => {
  const language = currentCopy();
  openWhatsAppMessage(language.feedbackMessage);
  showToast(language.feedbackOpening);
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
  openWhatsAppMessage(message);
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
