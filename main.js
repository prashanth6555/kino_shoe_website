const products = [
  {
    id: "apex",
    name: "Apex Runner",
    price: 189,
    tag: "Running",
    color: "#d6ff3f",
    colorName: "Volt",
    image: "assets/photos/apex.jpg",
    blurb: "Daily distance shoe with a volt aero-knit and a cloud sole that stays quiet on pavement.",
    specs: [["Weight", "248 g"], ["Drop", "8 mm"], ["Upper", "Aero-knit"], ["Sole", "Cloud foam"]]
  },
  {
    id: "noir",
    name: "Noir Court",
    price: 210,
    tag: "Court",
    color: "#f4f1ea",
    colorName: "Ivory",
    image: "assets/photos/noir.jpg",
    blurb: "Low court silhouette in ivory knit. Clean lines, a firmer plate, and a collar that sits close.",
    specs: [["Weight", "262 g"], ["Drop", "6 mm"], ["Upper", "Court knit"], ["Sole", "Firm plate"]]
  },
  {
    id: "dune",
    name: "Dune Form",
    price: 175,
    tag: "Studio",
    color: "#c4a574",
    colorName: "Sand",
    image: "assets/photos/dune.jpg",
    blurb: "Sand-toned studio shoe with a softer collar and a warm midsole made for long days on your feet.",
    specs: [["Weight", "255 g"], ["Drop", "8 mm"], ["Upper", "Soft knit"], ["Sole", "Cloud foam"]]
  },
  {
    id: "ember",
    name: "Ember Pulse",
    price: 198,
    tag: "Running",
    color: "#ff5a36",
    colorName: "Ember",
    image: "assets/photos/ember.jpg",
    blurb: "A heat-colored runner for night miles and city light, with the same sculpted cloud sole.",
    specs: [["Weight", "246 g"], ["Drop", "8 mm"], ["Upper", "Aero-knit"], ["Sole", "Cloud foam"]]
  },
  {
    id: "glacier",
    name: "Glacier Low",
    price: 220,
    tag: "Court",
    color: "#9fd7ff",
    colorName: "Ice",
    image: "assets/photos/glacier.jpg",
    blurb: "Ice blue court shoe with crisp edges and a low collar that keeps the profile sharp.",
    specs: [["Weight", "268 g"], ["Drop", "6 mm"], ["Upper", "Court knit"], ["Sole", "Firm plate"]]
  },
  {
    id: "rouge",
    name: "Rouge Atelier",
    price: 185,
    tag: "Studio",
    color: "#e23b4a",
    colorName: "Rouge",
    image: "assets/photos/rouge.jpg",
    blurb: "A dress-sneaker hybrid in crimson. Softer underfoot, sharper from across the room.",
    specs: [["Weight", "252 g"], ["Drop", "8 mm"], ["Upper", "Atelier knit"], ["Sole", "Cloud foam"]]
  }
];

const filters = ["All", "Running", "Court", "Studio"];
const sizes = [7, 8, 9, 10, 11, 12, 13];

const state = {
  selectedId: "apex",
  size: 9,
  qty: 1,
  filter: "All",
  cart: loadCart(),
  checkoutMode: "cart"
};

const $ = (sel) => document.querySelector(sel);
const money = (n) => `$${n}`;
const current = () => products.find((p) => p.id === state.selectedId) || products[0];

function loadCart() {
  try {
    const saved = JSON.parse(sessionStorage.getItem("kino-cart") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveCart() {
  sessionStorage.setItem("kino-cart", JSON.stringify(state.cart));
}

function swooshFor(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return l > 0.72 ? "#171717" : "#e6ff55";
}

function paint(el, product) {
  el.style.setProperty("--shoe", product.color);
  el.style.setProperty("--swoosh", swooshFor(product.color));
}

let setShoeColor = () => {};
let toastTimer = 0;

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

function renderSwatches() {
  const row = $("#swatches");
  row.innerHTML = "";
  products.forEach((product) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch";
    btn.style.background = product.color;
    btn.setAttribute("aria-label", product.colorName);
    btn.setAttribute("aria-pressed", String(product.id === state.selectedId));
    btn.addEventListener("click", () => setProduct(product.id));
    row.appendChild(btn);
  });
}

function renderFilters() {
  const row = $("#filters");
  row.innerHTML = "";
  filters.forEach((name) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = name;
    btn.setAttribute("aria-pressed", String(name === state.filter));
    btn.addEventListener("click", () => {
      state.filter = name;
      renderFilters();
      renderCatalog();
    });
    row.appendChild(btn);
  });
}

function renderCatalog() {
  const grid = $("#catalog-grid");
  grid.innerHTML = "";
  const list = state.filter === "All" ? products : products.filter((p) => p.tag === state.filter);
  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "card reveal";
    card.dataset.id = product.id;
    if (product.id === state.selectedId) card.classList.add("is-selected");
    paint(card, product);

    const open = document.createElement("button");
    open.type = "button";
    open.className = "card-open";
    open.dataset.action = "open";
    const visual = document.createElement("div");
    visual.className = "card-visual";
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = product.tag;
    const img = document.createElement("img");
    img.className = "card-photo";
    img.src = product.image;
    img.alt = `${product.name} in ${product.colorName}`;
    visual.append(tag, img);
    const copy = document.createElement("div");
    copy.className = "card-copy";
    copy.innerHTML = `<h3>${product.name}</h3><p>${product.colorName}</p>`;
    open.append(visual, copy);

    const foot = document.createElement("div");
    foot.className = "card-foot";
    const price = document.createElement("strong");
    price.className = "price";
    price.textContent = money(product.price);
    const add = document.createElement("button");
    add.type = "button";
    add.className = "text-add";
    add.dataset.action = "add";
    add.textContent = "Add · size 9";
    foot.append(price, add);
    card.append(open, foot);
    grid.appendChild(card);
  });
  observeReveals();
  enableTilt();
}

function renderDetail() {
  const product = current();
  const visual = $("#detail-visual");
  paint(visual, product);
  visual.classList.remove("swap");
  void visual.offsetWidth;
  visual.classList.add("swap");
  visual.innerHTML = "";
  const img = document.createElement("img");
  img.className = "detail-photo";
  img.src = product.image;
  img.alt = `${product.name} in ${product.colorName}`;
  visual.appendChild(img);
  const chip = document.createElement("div");
  chip.className = "visual-chip";
  chip.innerHTML = `<span>${product.colorName}</span><strong>${money(product.price)}</strong>`;
  visual.appendChild(chip);

  const info = $("#detail-info");
  info.innerHTML = `
    <p class="eyebrow">${product.tag} · ${product.colorName}</p>
    <h2>${product.name}</h2>
    <p class="detail-price">${money(product.price)}</p>
    <p class="blurb">${product.blurb}</p>
    <ul class="specs">
      ${product.specs.map(([k, v]) => `<li><span>${k}</span><strong>${v}</strong></li>`).join("")}
    </ul>
    <p class="label">Size</p>
    <div class="sizes">
      ${sizes.map((size) => `<button type="button" class="size-btn" data-size="${size}" aria-pressed="${size === state.size}">${size}</button>`).join("")}
    </div>
    <details class="guide">
      <summary>Size guide</summary>
      <p>Sizes run true to length. If you are between sizes, choose the larger one. The collar is knit, so a snug fit eases after a day.</p>
    </details>
    <p class="label">Quantity</p>
    <div class="stepper">
      <button type="button" data-qty="-1" aria-label="Decrease quantity">−</button>
      <strong id="qty-value">${state.qty}</strong>
      <button type="button" data-qty="1" aria-label="Increase quantity">+</button>
    </div>
    <div class="buy-row">
      <button class="btn" id="add-cart" type="button">Add to cart</button>
      <button class="btn ghost" id="buy-now" type="button">Buy now</button>
    </div>
    <div class="perks">
      <span>Shipping free over $150</span>
      <span>30-day returns</span>
      <span>Demo checkout only</span>
    </div>
  `;
}

function renderStudio() {
  const visual = $("#studio-visual");
  const product = current();
  let img = visual.querySelector("img");
  if (!img) {
    visual.replaceChildren();
    img = document.createElement("img");
    visual.appendChild(img);
  }
  img.src = product.image;
  img.alt = `${product.name}, ${product.colorName}`;
}

function updateHero() {
  const product = current();
  $("#hero-name").textContent = product.name;
  $("#hero-price").textContent = money(product.price);
  $("#hero-blurb").textContent = product.blurb;
  $("#stage-name").textContent = product.name;
  $("#stage-price").textContent = money(product.price);
  paint($("#hero-stage"), product);
  document.querySelectorAll(".swatch").forEach((btn, index) => {
    btn.setAttribute("aria-pressed", String(products[index].id === product.id));
  });
}

function markSelected() {
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.id === state.selectedId);
  });
}

function setProduct(id, options = {}) {
  if (!products.some((p) => p.id === id)) return;
  state.selectedId = id;
  state.qty = 1;
  updateHero();
  renderDetail();
  renderStudio();
  markSelected();
  setShoeColor(current().color);
  if (options.scroll) {
    $("#detail").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function cartKey(id, size) {
  return `${id}-${size}`;
}

function addToCart(product, size, qty) {
  const key = cartKey(product.id, size);
  const existing = state.cart.find((item) => item.key === key);
  if (existing) existing.qty += qty;
  else {
    state.cart.push({
      key,
      id: product.id,
      name: product.name,
      color: product.color,
      colorName: product.colorName,
      price: product.price,
      size,
      qty
    });
  }
  saveCart();
  renderCart();
  pulseBadge();
  toast(`${product.name} added to cart`);
}

function shippingFor(subtotal) {
  if (subtotal === 0) return 0;
  return subtotal >= 150 ? 0 : 12;
}

function totals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = shippingFor(subtotal);
  return { subtotal, shipping, total: subtotal + shipping };
}

function renderCart() {
  const wrap = $("#cart-items");
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = $("#cart-count");
  badge.dataset.count = String(count);
  badge.textContent = count ? String(count) : "";
  $("#cart-btn").setAttribute("aria-label", `Open cart, ${count} ${count === 1 ? "item" : "items"}`);

  if (!state.cart.length) {
    wrap.innerHTML = `<p class="empty-cart">Your cart is empty. Spin a color and add a pair.</p>`;
  } else {
    wrap.innerHTML = "";
    state.cart.forEach((item) => {
      const row = document.createElement("article");
      row.className = "cart-row";
      const shot = products.find((product) => product.id === item.id);
      row.innerHTML = `
        <img class="cart-thumb" src="${shot ? shot.image : ""}" alt="">
        <div>
          <h3>${item.name}</h3>
          <p>${item.colorName} · Size ${item.size}</p>
          <button class="remove" type="button" data-remove="${item.key}">Remove</button>
        </div>
        <div class="row-actions">
          <button type="button" data-cart-qty="${item.key}" data-dir="-1" aria-label="Decrease">−</button>
          <strong>${item.qty}</strong>
          <button type="button" data-cart-qty="${item.key}" data-dir="1" aria-label="Increase">+</button>
          <strong>${money(item.price * item.qty)}</strong>
        </div>
      `;
      wrap.appendChild(row);
    });
  }

  const sums = totals(state.cart);
  $("#cart-subtotal").textContent = money(sums.subtotal);
  $("#cart-ship").textContent = sums.shipping === 0 ? "Free" : money(sums.shipping);
  $("#cart-total").textContent = money(sums.total);
}

function pulseBadge() {
  const badge = $("#cart-count");
  badge.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
    { duration: 280, easing: "ease" }
  );
}

function openCart() {
  closeMenu();
  $("#cart-drawer").classList.add("open");
  $("#cart-drawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
}

function closeCart() {
  $("#cart-drawer").classList.remove("open");
  $("#cart-drawer").setAttribute("aria-hidden", "true");
  if (!$("#checkout").classList.contains("open")) document.body.classList.remove("lock");
}

function checkoutItems() {
  if (state.checkoutMode === "express") {
    const product = current();
    return [{
      name: product.name,
      colorName: product.colorName,
      size: state.size,
      price: product.price,
      qty: state.qty
    }];
  }
  return state.cart;
}

function openCheckout(mode) {
  const items = mode === "express"
    ? [{ price: current().price, qty: state.qty }]
    : state.cart;
  if (mode === "cart" && !state.cart.length) {
    toast("Your cart is empty");
    return;
  }
  state.checkoutMode = mode;
  closeCart();
  const sums = totals(mode === "express" ? checkoutItems() : state.cart);
  const list = $("#checkout-items");
  list.innerHTML = "";
  checkoutItems().forEach((item) => {
    const line = document.createElement("div");
    line.className = "line";
    line.innerHTML = `<span>${item.name} · ${item.colorName} · Size ${item.size} × ${item.qty}</span><strong>${money(item.price * item.qty)}</strong>`;
    list.appendChild(line);
  });
  $("#checkout-total").textContent = money(sums.total);
  $("#check-title").textContent = mode === "express" ? "Buy now" : "Checkout";
  $("#form-error").textContent = "";
  $("#success").hidden = true;
  $("#checkout-form").hidden = false;
  $("#checkout").classList.remove("is-done");
  $("#checkout").classList.add("open");
  $("#checkout").setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
  $("#checkout-form").querySelector("input")?.focus();
}

function closeCheckout() {
  $("#checkout").classList.remove("open");
  $("#checkout").setAttribute("aria-hidden", "true");
  document.body.classList.remove("lock");
}

function openMenu() {
  $("#mobile-nav").classList.add("open");
  $("#menu-btn").setAttribute("aria-expanded", "true");
  $("#menu-btn").setAttribute("aria-label", "Close menu");
  document.body.classList.add("lock");
}

function closeMenu() {
  $("#mobile-nav").classList.remove("open");
  $("#menu-btn").setAttribute("aria-expanded", "false");
  $("#menu-btn").setAttribute("aria-label", "Open menu");
  if (!$("#cart-drawer").classList.contains("open") && !$("#checkout").classList.contains("open")) {
    document.body.classList.remove("lock");
  }
}

function observeReveals() {
  const nodes = document.querySelectorAll(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("in"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });
  nodes.forEach((node) => observer.observe(node));
}

function enableTilt() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

function bind() {
  $("#catalog-grid").addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    if (!card) return;
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "add") {
      const product = products.find((p) => p.id === card.dataset.id);
      setProduct(product.id);
      addToCart(product, 9, 1);
      return;
    }
    if (action === "open") setProduct(card.dataset.id, { scroll: true });
  });

  $("#detail-info").addEventListener("click", (event) => {
    const sizeBtn = event.target.closest("[data-size]");
    if (sizeBtn) {
      state.size = Number(sizeBtn.dataset.size);
      document.querySelectorAll("[data-size]").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(Number(btn.dataset.size) === state.size));
      });
    }
    const qtyBtn = event.target.closest("[data-qty]");
    if (qtyBtn) {
      state.qty = Math.min(9, Math.max(1, state.qty + Number(qtyBtn.dataset.qty)));
      $("#qty-value").textContent = String(state.qty);
    }
    if (event.target.closest("#add-cart")) addToCart(current(), state.size, state.qty);
    if (event.target.closest("#buy-now")) openCheckout("express");
  });

  $("#hero-add").addEventListener("click", () => addToCart(current(), state.size, state.qty));
  $("#hero-buy").addEventListener("click", () => openCheckout("express"));
  $("#cart-btn").addEventListener("click", openCart);
  $("#mobile-cart").addEventListener("click", openCart);
  $("#cart-checkout").addEventListener("click", () => openCheckout("cart"));

  document.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", () => {
      if (el.dataset.close === "cart") closeCart();
      if (el.dataset.close === "checkout") closeCheckout();
    });
  });

  $("#cart-items").addEventListener("click", (event) => {
    const remove = event.target.closest("[data-remove]");
    if (remove) {
      state.cart = state.cart.filter((item) => item.key !== remove.dataset.remove);
      saveCart();
      renderCart();
    }
    const qty = event.target.closest("[data-cart-qty]");
    if (qty) {
      const item = state.cart.find((entry) => entry.key === qty.dataset.cartQty);
      if (!item) return;
      item.qty += Number(qty.dataset.dir);
      if (item.qty <= 0) state.cart = state.cart.filter((entry) => entry.key !== item.key);
      saveCart();
      renderCart();
    }
  });

  $("#menu-btn").addEventListener("click", () => {
    if ($("#mobile-nav").classList.contains("open")) closeMenu();
    else openMenu();
  });
  $("#mobile-nav").querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  $("#checkout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    $("#form-error").textContent = "";
    const order = `KV-${Math.floor(1000 + Math.random() * 9000)}`;
    $("#order-no").textContent = order;
    if (state.checkoutMode === "cart") {
      state.cart = [];
      saveCart();
      renderCart();
    }
    form.hidden = true;
    $("#success").hidden = false;
    $("#checkout").classList.add("is-done");
  });

  $("#success-close").addEventListener("click", () => {
    $("#checkout-form").reset();
    $("#checkout-form").hidden = false;
    $("#success").hidden = true;
    $("#checkout").classList.remove("is-done");
    closeCheckout();
  });

  $("#news-form").addEventListener("submit", (event) => {
    event.preventDefault();
    $("#news-note").textContent = "You're on the list. This demo does not store the address.";
    event.currentTarget.reset();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if ($("#checkout").classList.contains("open")) closeCheckout();
    else if ($("#cart-drawer").classList.contains("open")) closeCart();
    else if ($("#mobile-nav").classList.contains("open")) closeMenu();
  });
}

function showHeroShoe() {
  const fallback = $("#stage-fallback");
  fallback.textContent = current().colorName;
  paint($("#hero-stage"), current());
}

async function init3D() {
  let THREE;
  try {
    THREE = await import("three");
  } catch {
    return;
  }

  const stage = $("#hero-stage");
  if (!stage || stage.clientWidth === 0) return;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.classList.add("webgl");
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xfff4e4, 0x20222a, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xdff25a, 1.6);
  rim.position.set(-5, 2, -3);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0x9eb6ff, 0.55);
  fill.position.set(-2, 1.4, 4);
  scene.add(fill);

  try {
    const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  } catch {
    /* Studio lights still carry the form. */
  }

  let gltf;
  try {
    const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
    gltf = await new GLTFLoader().loadAsync("assets/shoe.gltf");
  } catch (error) {
    window.__shoeError = String(error && error.stack || error);
    renderer.dispose();
    renderer.domElement.remove();
    return;
  }

  let source = null;
  gltf.scene.traverse((obj) => {
    if (obj.isMesh && !source) source = obj;
  });
  if (!source) {
    renderer.dispose();
    renderer.domElement.remove();
    return;
  }
  const previous = source.material;
  const upperMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(current().color),
    normalMap: previous.normalMap || null,
    roughnessMap: previous.roughnessMap || null,
    roughness: 0.62,
    metalness: 0.06,
    clearcoat: 0.28,
    clearcoatRoughness: 0.45,
    sheen: 0.2,
    sheenColor: new THREE.Color("#fff6ea"),
    side: THREE.DoubleSide
  });
  if (previous.normalScale) upperMat.normalScale.copy(previous.normalScale);
  source.material = upperMat;

  const holder = new THREE.Group();
  holder.add(gltf.scene);
  const pivot = new THREE.Group();
  pivot.add(holder);
  scene.add(pivot);
  const initial = new THREE.Box3().setFromObject(holder);
  holder.position.sub(initial.getCenter(new THREE.Vector3()));
  const grounded = new THREE.Box3().setFromObject(holder);
  holder.position.y -= grounded.min.y;

  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const ctx = shadowCanvas.getContext("2d");
  const gradient = ctx.createRadialGradient(128, 128, 16, 128, 128, 120);
  gradient.addColorStop(0, "rgba(0,0,0,0.5)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.7, 48),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  scene.add(shadow);

  const box = new THREE.Box3().setFromObject(pivot);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const base = new THREE.Vector3();
  shadow.scale.setScalar(Math.max(size.x, size.z) * 0.55 / 1.7);
  function frameCamera() {
    const half = Math.tan((camera.fov * Math.PI) / 360);
    const distH = (size.y * 0.78) / half;
    const distW = (size.x * 0.58) / (half * Math.max(camera.aspect, 0.4));
    const dist = Math.max(distH, distW);
    base.set(dist * 0.34, center.y + size.y * 0.08, dist);
    camera.position.copy(base);
    camera.lookAt(center);
  }

  const targetUpper = new THREE.Color(current().color);
  setShoeColor = (hex) => targetUpper.set(hex);

  let rotY = -0.65;
  let dragging = false;
  let lastX = 0;
  let vel = 0;
  const parallax = { x: 0, y: 0 };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  renderer.domElement.addEventListener("pointerdown", (event) => {
    dragging = true;
    lastX = event.clientX;
  });
  window.addEventListener("pointerup", () => { dragging = false; });
  renderer.domElement.addEventListener("pointermove", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    parallax.x = ((event.clientX - rect.left) / rect.width - 0.5);
    parallax.y = ((event.clientY - rect.top) / rect.height - 0.5);
    if (!dragging) return;
    const dx = event.clientX - lastX;
    rotY += dx * 0.01;
    vel = dx * 0.01;
    lastX = event.clientX;
  });

  function resize() {
    const width = stage.clientWidth;
    const height = stage.clientHeight || 480;
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    frameCamera();
  }
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(stage);

  const clock = new THREE.Clock();
  let running = true;
  document.addEventListener("visibilitychange", () => { running = !document.hidden; });

  function frame() {
    requestAnimationFrame(frame);
    if (!running) return;
    const t = clock.getElapsedTime();
    if (!dragging && !reduced) rotY += 0.004;
    vel *= 0.92;
    if (!dragging) rotY += vel;
    pivot.rotation.y = rotY;
    pivot.rotation.x = reduced ? 0.08 : 0.08 + parallax.y * -0.12;
    pivot.position.y = reduced ? 0 : Math.sin(t * 1.3) * size.y * 0.05;
    shadow.material.opacity = 0.85 - Math.sin(t * 1.3) * 0.12;
    camera.position.x = base.x + parallax.x * 0.35;
    camera.position.y = base.y + parallax.y * 0.18;
    camera.lookAt(center);
    upperMat.color.lerp(targetUpper, 0.08);
    renderer.render(scene, camera);
  }
  frame();
  stage.classList.add("is-3d");
}

function dismissLoader() {
  const loader = $("#loader");
  if (!loader || loader.dataset.done) return;
  loader.dataset.done = "1";
  const started = Number(loader.dataset.started || performance.now());
  const wait = Math.max(0, 700 - (performance.now() - started));
  setTimeout(() => loader.classList.add("is-done"), wait);
}

function boot() {
  $("#loader").dataset.started = String(performance.now());
  renderSwatches();
  renderFilters();
  renderCatalog();
  renderDetail();
  renderStudio();
  updateHero();
  showHeroShoe();
  renderCart();
  bind();
  observeReveals();
  document.querySelectorAll(".section-head, .craft-grid article, .studio-copy, .closer").forEach((el) => {
    el.classList.add("reveal");
  });
  observeReveals();
  init3D().finally(dismissLoader);
  setTimeout(dismissLoader, 3200);
}

boot();
