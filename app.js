(function () {
  const C = window.KOFE_CONFIG;
  const { formatPrice, buildOrderText, telegramLink } = window.KofeOrder;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const price = (n) => formatPrice(n, C.currency);
  const byId = Object.fromEntries(C.items.map((i) => [i.id, i]));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- корзина: { "id|sizeIdx": qty } ----------
  const KEY = "kofe_cart";
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { cart = {}; }
  // выкидываем позиции, которых больше нет в каталоге
  cart = Object.fromEntries(Object.entries(cart).filter(([k, q]) => {
    const [id, s] = k.split("|");
    return byId[id] && byId[id].sizes[s] && Number.isInteger(q) && q > 0;
  }));
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* приватный режим — корзина живёт до перезагрузки */ } };
  const lines = () => Object.entries(cart).map(([k, qty]) => {
    const [id, s] = k.split("|");
    const [size, p] = byId[id].sizes[s];
    return { key: k, name: byId[id].name, size, price: p, qty };
  });
  const setQty = (key, qty) => {
    cart = { ...cart };
    if (qty > 0) cart[key] = Math.min(qty, 99); else delete cart[key];
    save(); renderCart();
  };

  // ---------- герой / контакты ----------
  $("#heroLead").textContent = `Кофейня на ${C.address}, ${C.city}. Соберите заказ онлайн — мы приготовим к вашему приходу.`;
  $("#heroRating").innerHTML = `<b>${esc(C.rating)}</b> рейтинг на Яндекс Картах`;
  $("#footerYear").textContent = `© ${new Date().getFullYear()} ${C.name}, ${C.city}`;
  const tel = C.phone.replace(/[^\d+]/g, "");
  $("#contactsList").innerHTML = [
    ["Адрес", `<a href="${esc(C.mapUrl)}" target="_blank" rel="noopener">${esc(C.city)}, ${esc(C.address)}</a>`],
    ["Часы работы", esc(C.hours)],
    ["Телефон", `<a href="tel:${esc(tel)}">${esc(C.phone)}</a>`],
    ["Заказы", `<a href="${esc(telegramLink(C.telegram, "Здравствуйте!"))}" target="_blank" rel="noopener">Telegram</a> · <a href="${esc(C.max)}" target="_blank" rel="noopener">MAX</a>`],
  ].map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join("");

  // ---------- каталог ----------
  $("#tabs").innerHTML = C.categories.map((c) => `<a href="#cat-${esc(c.id)}" data-cat="${esc(c.id)}">${esc(c.title)}</a>`).join("");
  $("#catalogBody").innerHTML = C.categories.map((c, ci) => {
    const items = C.items.filter((i) => i.cat === c.id);
    return `<section class="cat cat--${esc(c.id)}" id="cat-${esc(c.id)}">
      <div class="cat__head"><span class="idx">${String(ci + 1).padStart(2, "0")}</span><h3>${esc(c.title)}</h3><p>${esc(c.note || "")}</p></div>
      <div class="grid">${items.map(card).join("")}</div>
    </section>`;
  }).join("");

  function card(i) {
    const plate = i.img
      ? `<img src="${esc(i.img)}" alt="${esc(i.name)}" loading="lazy" width="400" height="300">`
      : `<span class="card__glyph" aria-hidden="true">${esc(i.name[0])}</span>`;
    const sizes = i.sizes.length > 1
      ? `<div class="sizes" role="group" aria-label="Объём">${i.sizes.map(([s], n) =>
          `<button type="button" data-size="${n}" aria-pressed="${n === 0}">${esc(s)}</button>`).join("")}</div>`
      : `<div class="sizes"><span class="line__meta">${esc(i.sizes[0][0])}</span></div>`;
    return `<article class="card" data-id="${esc(i.id)}" data-size="0">
      <div class="card__plate">${plate}${i.tag ? `<span class="card__tag">${esc(i.tag)}</span>` : ""}</div>
      <div class="card__body">
        <h4>${esc(i.name)}</h4><p>${esc(i.desc || "")}</p>
        ${sizes}
        <div class="card__foot"><span class="price">${price(i.sizes[0][1])}</span>
          <button class="add" type="button">В заказ</button></div>
      </div></article>`;
  }

  $("#catalogBody").addEventListener("click", (e) => {
    const el = e.target.closest(".card");
    if (!el) return;
    const item = byId[el.dataset.id];
    const sizeBtn = e.target.closest("button[data-size]");
    if (sizeBtn) {
      el.dataset.size = sizeBtn.dataset.size;
      el.querySelectorAll(".sizes button").forEach((b) => b.setAttribute("aria-pressed", b === sizeBtn));
      el.querySelector(".price").textContent = price(item.sizes[sizeBtn.dataset.size][1]);
      return;
    }
    const add = e.target.closest(".add");
    if (!add) return;
    const key = `${item.id}|${el.dataset.size}`;
    setQty(key, (cart[key] || 0) + 1);
    add.textContent = "Добавлено ✓"; add.classList.add("ok");
    setTimeout(() => { add.textContent = "В заказ"; add.classList.remove("ok"); }, 1200);
    const btn = $("#cartOpen"); btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
  });

  // активная вкладка категории при прокрутке
  const tabs = [...document.querySelectorAll("#tabs a")];
  const catIO = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) tabs.forEach((t) => t.classList.toggle("active", `cat-${t.dataset.cat}` === en.target.id));
  }), { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll(".cat").forEach((s) => catIO.observe(s));

  // ---------- корзина: отрисовка ----------
  function renderCart() {
    const ls = lines();
    $("#cartCount").textContent = ls.reduce((s, l) => s + l.qty, 0);
    $("#empty").hidden = ls.length > 0;
    $("#orderForm").hidden = ls.length === 0;
    $("#total").textContent = price(ls.reduce((s, l) => s + l.price * l.qty, 0));
    $("#lines").innerHTML = ls.map((l) => `<li class="line" data-key="${esc(l.key)}">
      <span class="line__name">${esc(l.name)}</span><span class="line__sum">${price(l.price * l.qty)}</span>
      <span class="line__meta">${esc(l.size)} · ${price(l.price)}</span>
      <span class="qty"><button type="button" data-d="-1" aria-label="Меньше">−</button><span>${l.qty}</span><button type="button" data-d="1" aria-label="Больше">+</button></span>
    </li>`).join("");
  }
  $("#lines").addEventListener("click", (e) => {
    const b = e.target.closest("[data-d]");
    if (!b) return;
    const key = b.closest(".line").dataset.key;
    setQty(key, cart[key] + Number(b.dataset.d));
  });

  const drawer = $("#drawer"), overlay = $("#overlay");
  const openCart = (open) => {
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    overlay.hidden = !open;
    document.body.classList.toggle("lock", open);
    if (open) $("#cartClose").focus();
  };
  $("#cartOpen").addEventListener("click", () => openCart(true));
  $("#cartClose").addEventListener("click", () => openCart(false));
  overlay.addEventListener("click", () => openCart(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") openCart(false); });

  // ---------- оформление ----------
  const form = $("#orderForm");
  const addr = form.querySelector(".addr");
  form.addEventListener("change", (e) => {
    if (e.target.name === "mode") addr.hidden = e.target.value !== "delivery";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const via = (e.submitter && e.submitter.dataset.via) || "telegram";
    const f = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, String(v).trim()]));
    const bad = [];
    if (!f.name) bad.push("name");
    if (f.phone.replace(/\D/g, "").length < 10) bad.push("phone");
    if (f.mode === "delivery" && !f.address) bad.push("address");
    form.querySelectorAll("input").forEach((i) => i.classList.toggle("invalid", bad.includes(i.name)));
    if (bad.length) {
      $("#formErr").textContent = "Заполните имя, телефон" + (f.mode === "delivery" ? " и адрес" : "") + ".";
      form.querySelector(".invalid").focus();
      return;
    }
    $("#formErr").textContent = "";
    const text = buildOrderText(C, lines(), f);
    copy(text);
    // окно открываем синхронно в обработчике отправки, иначе браузер его заблокирует
    if (via === "max") {
      window.open(C.max, "_blank", "noopener");
      toast("Текст заказа скопирован — вставьте его в чат MAX и отправьте");
    } else {
      window.open(telegramLink(C.telegram, text), "_blank", "noopener");
      toast("Открываем Telegram — нажмите «Отправить» в чате");
    }
  });

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
    } else legacyCopy(text);
  }
  function legacyCopy(text) {
    const t = document.createElement("textarea");
    t.value = text; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
    document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); } catch (e) { /* для Telegram текст всё равно уходит в ссылке */ }
    t.remove();
  }
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 4500);
  }

  // ---------- анимации ----------
  const header = $("#header");
  const onScroll = () => header.classList.toggle("solid", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // слова «проявляются» по мере прокрутки, как на ayocin
  document.querySelectorAll(".reveal-words").forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="rw">${esc(w)}</span>`).join(" ");
  });
  const words = [...document.querySelectorAll(".rw")];
  const revealWords = () => {
    const edge = innerHeight * 0.8;
    words.forEach((w) => w.classList.toggle("on", reduced || w.getBoundingClientRect().top < edge));
  };
  addEventListener("scroll", () => requestAnimationFrame(revealWords), { passive: true });
  revealWords();

  // загрузчик с процентами
  const pct = $("#loaderPct"), bar = $("#loaderBar");
  const start = performance.now(), dur = reduced ? 0 : 1100;
  (function tick(now) {
    const p = Math.min(1, dur ? Math.max(0, now - start) / dur : 1);
    pct.textContent = Math.round(p * 100) + "%"; bar.style.width = p * 100 + "%";
    if (p < 1) return requestAnimationFrame(tick);
    $("#loader").classList.add("done");
    document.querySelectorAll(".w").forEach((w, n) => { w.style.transitionDelay = 200 + n * 90 + "ms"; });
    document.body.classList.add("ready");
  })(start);

  renderCart();
})();
