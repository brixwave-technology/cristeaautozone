/* ============ Cristea AutoZone — motor comun demo ============
   Catalog de exemplu + coș, favorite, căutare, filtre, selector de mașină, vizualizare rapidă.
   Paginile folosesc doar atribute data-*; aspectul vine din CSS-ul fiecărui design. */
(function () {
  "use strict";
  var BASE = "../../shared/", IMG = BASE + "piese/";
  /* imagine → fișier; fotografiile reale se trec aici (ex. disc: "disc.jpg") */
  var FILES = window.CAZ_PHOTOS || {};
  var FREE_SHIP = 500, SHIP = 19.99;

  var I = {
    cart: '<path d="M3 4h2l2.4 11.5h10.8L20.5 8H6.6"/><circle cx="9.5" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.500 15.4 12 20 12 20z"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>', home: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>', chev: '<path d="M9 6l6 6-6 6"/>', back: '<path d="M15 6l-6 6 6 6"/>',
    franare: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 5.500v1.500M12 17v1.500M5.500 12H7M17 12h1.500"/>',
    motor: '<path d="M7 9h8l2 2h2.500v5H17l-1.500 2H8.500L7 16H4.500v-5H7z"/><path d="M9.500 9V6.500h4V9M8 6.500h7"/>',
    filtre: '<rect x="7" y="4" width="10" height="16" rx="2"/><path d="M7 8h10M7 16h10M10 10.500v3M12 10.500v3M14 10.500v3"/>',
    suspensie: '<path d="M12 3v3M12 18v3M8 6h8M8 18h8M8.500 8l7 2-7 2 7 2-7 2"/>',
    electrice: '<path d="M13 3L5.500 13.500H11L10 21l8-11h-5.500z"/>',
    uleiuri: '<path d="M12 3.500c-3.500 4.800-5.500 7.600-5.500 10.300a5.500 5.500 0 0 0 11 0c0-2.700-2-5.500-5.500-10.300z"/><path d="M9.500 14.500a2.500 2.500 0 0 0 2.500 2.500"/>',
    caroserie: '<path d="M3.500 15v-2.500l2-4.500A2 2 0 0 1 7.300 7h9.400a2 2 0 0 1 1.800 1l2 4.500V15a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z"/><path d="M5 12.500h14"/><circle cx="7.500" cy="16.500" r="1.800"/><circle cx="16.500" cy="16.500" r="1.800"/>',
    racire: '<path d="M12 3v18M4.200 7.500l15.600 9M19.800 7.500l-15.600 9M9.500 4.500L12 7l2.500-2.500M9.500 19.500L12 17l2.500 2.500"/>',
    anvelope: '<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="4.500"/><path d="M12 7.500V3.500M16 14.200l3.600 2M8 14.200l-3.600 2"/>',
    accesorii: '<path d="M14.500 6.500a4 4 0 0 0 5 5L11 20a2.100 2.100 0 0 1-3-3l8.500-8.500"/><path d="M14.500 6.500L17.500 3.500"/>'
  };
  function ic(n, c) { return '<svg class="ic' + (c ? " " + c : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + I[n] + "</svg>"; }

  var CATS = [
    { id: "franare", name: "Sistem de frânare", short: "Frânare", img: "disc", subs: ["Plăcuțe de frână", "Discuri de frână", "Etriere și kituri", "Furtunuri și conducte", "Lichid de frână"] },
    { id: "motor", name: "Motor și distribuție", short: "Motor", img: "distributie", subs: ["Kituri de distribuție", "Curele și întinzătoare", "Bujii și bobine", "Ambreiaje", "Garnituri"] },
    { id: "filtre", name: "Filtre", short: "Filtre", img: "filtru-ulei", subs: ["Filtre de ulei", "Filtre de aer", "Filtre de polen", "Filtre de combustibil"] },
    { id: "suspensie", name: "Suspensie și direcție", short: "Suspensie", img: "amortizor", subs: ["Amortizoare", "Arcuri", "Brațe și bucșe", "Bielete și capete de bară", "Rulmenți roată"] },
    { id: "electrice", name: "Electrice și iluminat", short: "Electrice", img: "baterie", subs: ["Baterii auto", "Becuri", "Alternatoare", "Electromotoare", "Senzori"] },
    { id: "uleiuri", name: "Uleiuri și lichide", short: "Uleiuri", img: "ulei", subs: ["Ulei de motor", "Ulei de transmisie", "Antigel", "Lichid de parbriz", "Aditivi"] },
    { id: "caroserie", name: "Caroserie", short: "Caroserie", img: "far", subs: ["Faruri și stopuri", "Oglinzi", "Bare și grile", "Aripi și capote"] },
    { id: "racire", name: "Răcire și climatizare", short: "Răcire", img: "radiator", subs: ["Radiatoare", "Pompe de apă", "Termostate", "Compresoare AC"] },
    { id: "anvelope", name: "Anvelope și jante", short: "Anvelope", img: "anvelopa", subs: ["Anvelope de iarnă", "Anvelope de vară", "All season", "Jante"] },
    { id: "accesorii", name: "Accesorii auto", short: "Accesorii", img: "stergatoare", subs: ["Ștergătoare", "Covorașe", "Cosmetice auto", "Scule și truse"] }
  ];

  /* Prețuri, coduri, evaluări și stocuri: valori de exemplu pentru demo. */
  var P = [
    ["p01", "Set plăcuțe de frână față", "Brembo", "franare", "placute", 189.99, 239.99, 4.8, 214, 0, "CAZ-1042", "deal top"],
    ["p02", "Disc de frână ventilat față Ø280 mm", "Brembo", "franare", "disc", 174.99, 0, 4.7, 96, 0, "CAZ-1077", "top"],
    ["p03", "Set discuri + plăcuțe de frână față", "TRW", "franare", "disc", 449.99, 569.99, 4.9, 131, 7, "CAZ-1080", "deal"],
    ["p04", "Set plăcuțe de frână spate", "TRW", "franare", "placute", 149.99, 189.99, 4.6, 88, 0, "CAZ-1050", "top"],
    ["p05", "Kit distribuție cu pompă de apă", "Continental", "motor", "distributie", 649.99, 799.99, 4.9, 176, 5, "CAZ-3105", "deal top"],
    ["p06", "Bujii iridium, set 4 buc.", "NGK", "motor", "bujii", 119.99, 0, 4.8, 302, 0, "CAZ-3410", "top new"],
    ["p07", "Kit ambreiaj complet cu rulment", "Sachs", "motor", "ambreiaj", 899.99, 1099.99, 4.7, 64, 3, "CAZ-3301", "deal"],
    ["p08", "Curea accesorii cu întinzător", "Continental", "motor", "distributie", 229.99, 0, 4.5, 41, 0, "CAZ-3120", "new"],
    ["p09", "Filtru de ulei", "Mann-Filter", "filtre", "filtru-ulei", 39.99, 0, 4.9, 512, 0, "CAZ-6001", "top"],
    ["p10", "Filtru de aer motor", "Mann-Filter", "filtre", "filtru-aer", 59.99, 0, 4.8, 287, 0, "CAZ-6014", "top"],
    ["p11", "Filtru de polen cu carbon activ", "Bosch", "filtre", "filtru-aer", 69.99, 89.99, 4.6, 143, 0, "CAZ-6020", "new"],
    ["p12", "Amortizor față pe gaz", "Sachs", "suspensie", "amortizor", 289.99, 0, 4.7, 119, 0, "CAZ-7032", "top"],
    ["p13", "Set amortizoare spate, 2 buc.", "Sachs", "suspensie", "amortizor", 479.99, 559.99, 4.8, 73, 6, "CAZ-7040", "deal"],
    ["p14", "Baterie auto 12V 70Ah 640A", "Varta", "electrice", "baterie", 429.99, 499.99, 4.9, 398, 9, "CAZ-4070", "deal top"],
    ["p15", "Set becuri H7 +130% lumină", "Osram", "electrice", "bec", 79.99, 0, 4.6, 205, 0, "CAZ-5507", "new"],
    ["p16", "Far stânga cu lupă", "Hella", "caroserie", "far", 589.99, 0, 4.5, 28, 0, "CAZ-9120", "new"],
    ["p17", "Ulei de motor 5W-30, 5 L", "Castrol", "uleiuri", "ulei", 179.99, 229.99, 4.9, 641, 12, "CAZ-2210", "deal top"],
    ["p18", "Ulei de motor 5W-40, 4 L", "Motul", "uleiuri", "ulei", 159.99, 0, 4.8, 233, 0, "CAZ-2240", "top"],
    ["p19", "Radiator apă motor", "Valeo", "racire", "radiator", 399.99, 0, 4.6, 37, 0, "CAZ-9003", "new"],
    ["p20", "Anvelopă de iarnă 205/55 R16 91H", "Continental", "anvelope", "anvelopa", 319.99, 369.99, 4.8, 156, 0, "CAZ-8055", "top"],
    ["p21", "Anvelopă de vară 195/65 R15 91V", "Michelin", "anvelope", "anvelopa", 279.99, 0, 4.7, 98, 0, "CAZ-8015", ""],
    ["p22", "Set ștergătoare parbriz 600/450 mm", "Bosch", "accesorii", "stergatoare", 79.99, 99.99, 4.7, 421, 0, "CAZ-5018", "deal top"],
    ["k01", "Kit revizie: ulei 5W-30 5 L + filtru ulei + filtru aer", "Castrol + Mann", "uleiuri", "ulei", 259.99, 299.99, 4.9, 187, 0, "CAZ-K101", "kit"],
    ["k02", "Kit frânare față: discuri + plăcuțe + lichid", "Brembo", "franare", "disc", 599.99, 729.99, 4.8, 92, 0, "CAZ-K102", "kit"],
    ["k03", "Pachet de iarnă: baterie + ștergătoare + becuri", "Varta + Bosch", "electrice", "baterie", 549.99, 609.99, 4.7, 58, 0, "CAZ-K103", "kit"]
  ].map(function (a) { return { id: a[0], t: a[1], brand: a[2], cat: a[3], img: a[4], price: a[5], old: a[6], rate: a[7], rev: a[8], left: a[9], code: a[10], tags: a[11].split(" ") }; });
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });

  var CARS = { Audi: ["A3", "A4", "A6", "Q5"], BMW: ["Seria 1", "Seria 3", "Seria 5", "X3"], Dacia: ["Logan", "Sandero", "Duster", "Spring"], Ford: ["Fiesta", "Focus", "Mondeo", "Kuga"], Opel: ["Corsa", "Astra", "Insignia"], Renault: ["Clio", "Megane", "Captur"], Skoda: ["Fabia", "Octavia", "Superb"], Volkswagen: ["Polo", "Golf", "Passat", "Tiguan"] };
  var ENGINES = ["1.0 benzină", "1.4 benzină", "1.6 benzină", "2.0 benzină", "1.5 diesel", "1.6 diesel", "2.0 diesel", "Hibrid"];

  /* ---------- utilitare ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var norm = function (s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
  var store = { get: function (k, d) { try { var v = localStorage.getItem("caz.demo." + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem("caz.demo." + k, JSON.stringify(v)); } catch (e) {} } };
  function src(name) { return IMG + (FILES[name] || name + ".svg"); }
  function photo(name) { return FILES[name] ? ' class="is-photo"' : ""; }
  function money(n) { return n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " lei"; }
  function priceHTML(n, sale) { var s = n.toFixed(2).split("."); return '<span class="price' + (sale ? " price--sale" : "") + '">' + s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "<sup>" + s[1] + "</sup><small>lei</small></span>"; }
  function pct(p) { return Math.round((1 - p.price / p.old) * 100); }

  var cart = store.get("cart", {}), fav = store.get("fav", []), car = store.get("car", null);
  Object.keys(cart).forEach(function (k) { if (!byId[k]) delete cart[k]; });
  fav = fav.filter(function (k) { return byId[k]; });

  /* ---------- card produs ---------- */
  function card(p, variant) {
    var badges = (p.old ? '<span class="badge">-' + pct(p) + "%</span>" : "") + (p.tags.indexOf("new") > -1 ? '<span class="badge badge--new">Nou</span>' : "") + (p.tags.indexOf("kit") > -1 ? '<span class="badge badge--new">Pachet</span>' : "");
    var stock = variant === "flash" && p.left
      ? '<div class="pc__left"><div class="pc__bar"><i style="width:' + Math.max(18, 100 - p.left * 7) + '%"></i></div>Au mai rămas ' + p.left + " buc.</div>"
      : p.left && p.left <= 5 ? '<div class="pc__stock pc__stock--low">Stoc limitat: ' + p.left + " buc.</div>" : '<div class="pc__stock">În stoc · livrare 24–48h</div>';
    return '<article class="pc" data-id="' + p.id + '">' +
      '<div class="pc__media"><div class="pc__badges">' + badges + "</div>" +
      '<button class="pc__fav" type="button" data-fav="' + p.id + '" aria-pressed="' + (fav.indexOf(p.id) > -1) + '" aria-label="Adaugă la favorite: ' + esc(p.t) + '"><span>' + ic("heart") + "</span></button>" +
      '<a class="pc__img" href="#" data-quick="' + p.id + '" tabindex="-1" aria-hidden="true"><img src="' + src(p.img) + '"' + photo(p.img) + ' alt="" loading="lazy"></a></div>' +
      '<div class="pc__body"><div class="pc__brand">' + esc(p.brand) + "</div>" +
      '<h3 class="pc__title"><a href="#" data-quick="' + p.id + '">' + esc(p.t) + "</a></h3>" +
      '<div class="pc__rate"><span class="stars" style="--r:' + p.rate + '" role="img" aria-label="Evaluare ' + String(p.rate).replace(".", ",") + ' din 5"></span><span>' + String(p.rate).replace(".", ",") + " (" + p.rev + ")</span></div>" +
      '<div class="pc__code">Cod: ' + p.code + "</div>" + stock +
      '<div class="pc__price"><span class="pc__old">' + (p.old ? money(p.old) : "") + "</span>" + priceHTML(p.price, !!p.old) + "</div>" +
      '<button class="pc__add" type="button" data-add="' + p.id + '" aria-label="Adaugă în coș: ' + esc(p.t) + '">' + ic("cart") + "<span>Adaugă în coș</span></button></div></article>";
  }
  function listFor(tag, cat) {
    var l = P.filter(function (p) { return p.tags.indexOf("kit") < 0 || tag === "kit"; });
    if (cat && cat !== "all") return l.filter(function (p) { return p.cat === cat; });
    if (tag && tag !== "all") l = l.filter(function (p) { return p.tags.indexOf(tag) > -1; });
    return l;
  }
  function fill(el, cat) {
    var l = listFor(el.dataset.products, cat), n = +el.dataset.limit || 99;
    el.innerHTML = l.slice(0, n).map(function (p) { return card(p, el.dataset.variant); }).join("") || '<p class="results__empty">Nu am găsit produse în această categorie.</p>';
  }
  $$("[data-products]").forEach(function (el) { fill(el); });

  /* benzi derulabile cu săgeți */
  $$(".rail").forEach(function (r) {
    var t = $(".rail__track", r); if (!t) return;
    ["prev", "next"].forEach(function (d) {
      var b = document.createElement("button"); b.type = "button"; b.className = "rail__btn rail__btn--" + d; b.setAttribute("aria-label", d === "prev" ? "Produsele anterioare" : "Produsele următoare");
      b.innerHTML = ic(d === "prev" ? "back" : "chev"); b.addEventListener("click", function () { t.scrollBy({ left: (d === "prev" ? -1 : 1) * t.clientWidth * 0.8, behavior: "smooth" }); }); r.appendChild(b);
    });
    var upd = function () { $(".rail__btn--prev", r).disabled = t.scrollLeft < 8; $(".rail__btn--next", r).disabled = t.scrollLeft + t.clientWidth > t.scrollWidth - 8; };
    t.addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); setTimeout(upd, 100);
  });

  /* ---------- categorii ---------- */
  $$("[data-cats]").forEach(function (el) {
    var mode = el.dataset.cats, n = +el.dataset.limit || 99;
    el.innerHTML = CATS.slice(0, n).map(function (c) {
      var a = '<a class="cat" href="#" data-cat-link="' + c.id + '">' + ic(c.id, "cat__ic") + '<img class="cat__img" src="' + src(c.img) + '"' + photo(c.img) + ' alt="" loading="lazy"><span class="cat__txt"><b class="cat__name">' + esc(mode === "short" ? c.short : c.name) + '</b><span class="cat__subs">' + esc(c.subs.slice(0, 3).join(", ")) + "</span></span>" + ic("chev", "cat__chev") + "</a>";
      if (mode === "menu") a += '<div class="fly"><b class="fly__t">' + esc(c.name) + '</b><div class="fly__l">' + c.subs.map(function (s) { return '<a href="#" data-cat-link="' + c.id + '">' + esc(s) + "</a>"; }).join("") + '</div><img src="' + src(c.img) + '" alt=""></div>';
      if (mode === "full") a = '<div class="catbox"><a class="catbox__h" href="#" data-cat-link="' + c.id + '">' + ic(c.id, "cat__ic") + "<b>" + esc(c.name) + '</b></a><img class="catbox__img" src="' + src(c.img) + '" alt="" loading="lazy"><ul>' + c.subs.slice(0, 4).map(function (s) { return '<li><a href="#" data-cat-link="' + c.id + '">' + esc(s) + "</a></li>"; }).join("") + '</ul><a class="catbox__all" href="#" data-cat-link="' + c.id + '">Vezi toate ' + ic("chev") + "</a></div>";
      return "<li>" + a + "</li>";
    }).join("");
  });

  /* ---------- injectare: rezultate, sertare, modal, toast, navigație mobilă ---------- */
  var here = $("[data-results-here]");
  if (here) here.outerHTML = '<section class="sec results" id="rezultate" hidden aria-live="polite"><div class="wrap"><div class="sec__head"><h2 class="sec__title" data-results-title></h2><button type="button" class="results__close" data-results-clear>Închide rezultatele ✕</button></div><div class="pgrid" data-results></div></div></section>';
  var shell = document.createElement("div");
  shell.innerHTML = '<div class="ov" data-close></div>' +
    '<aside class="drawer drawer--cart" id="cos" aria-label="Coșul de cumpărături" inert><div class="drawer__head"><h2>Coșul meu</h2><button class="x" type="button" data-close aria-label="Închide coșul">' + ic("x") + '</button></div><div class="ship" data-ship></div><div class="drawer__body" data-cart-items></div><div class="drawer__foot" data-cart-foot></div></aside>' +
    '<aside class="drawer drawer--menu" id="meniu" aria-label="Meniu categorii" inert><div class="drawer__head"><h2>Categorii piese</h2><button class="x" type="button" data-close aria-label="Închide meniul">' + ic("x") + '</button></div><nav class="drawer__body mm">' +
    CATS.map(function (c) { return "<details><summary>" + ic(c.id) + esc(c.name) + '</summary><div class="mm__subs">' + c.subs.map(function (s) { return '<a href="#" data-cat-link="' + c.id + '">' + esc(s) + "</a>"; }).join("") + "</div></details>"; }).join("") +
    '<div class="mm__sec">Contul meu</div><a class="mm__link" href="#" data-note="cont">Autentificare / cont nou</a><a class="mm__link" href="#" data-fav-open>Favorite</a><a class="mm__link" href="#" data-note="comenzi">Urmărește comanda</a><a class="mm__link" href="tel:0745586673">Sună: 0745 586 673</a></nav></aside>' +
    '<div class="modal" id="modal" role="dialog" aria-modal="true" aria-label="Detalii" inert><div class="modal__card" data-modal-card></div></div>' +
    '<div class="toast" role="status"></div>' +
    '<nav class="mnav" aria-label="Navigație rapidă"><button type="button" class="is-on" data-top>' + ic("home") + 'Acasă</button><button type="button" data-menu-open>' + ic("grid") + 'Categorii</button><button type="button" data-search-focus>' + ic("search") + 'Caută</button><button type="button" data-fav-open>' + ic("heart") + 'Favorite<i data-fav-count hidden></i></button><button type="button" data-cart-open>' + ic("cart") + "Coș<i data-cart-count hidden></i></button></nav>";
  while (shell.firstChild) document.body.appendChild(shell.firstChild);
  if (window.self === window.top) { var pb = document.createElement("a"); pb.className = "portal-back"; pb.href = "../../index.html#designs"; pb.innerHTML = ic("back") + "Înapoi la alegerea designului"; document.body.appendChild(pb); }

  var ov = $(".ov"), drawers = { cart: $("#cos"), menu: $("#meniu") }, modal = $("#modal"), lastFocus = null, tt;
  function toast(m) { var t = $(".toast"); t.textContent = m; t.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove("is-on"); }, 2600); }
  function closeAll() {
    [drawers.cart, drawers.menu, modal].forEach(function (d) { d.classList.remove("is-open"); d.setAttribute("inert", ""); });
    ov.classList.remove("is-open"); document.body.classList.remove("is-locked"); if (lastFocus && lastFocus.focus) lastFocus.focus(); lastFocus = null;
  }
  function open(el) { var lf = lastFocus || document.activeElement; closeAll(); lastFocus = lf; el.removeAttribute("inert"); el.classList.add("is-open"); ov.classList.add("is-open"); document.body.classList.add("is-locked"); var f = $(".x", el); if (f) f.focus(); }
  addEventListener("keydown", function (e) { if (e.key === "Escape") { closeAll(); hideSug(); } });

  /* ---------- coș ---------- */
  function totals() { var n = 0, s = 0; Object.keys(cart).forEach(function (k) { n += cart[k]; s += cart[k] * byId[k].price; }); return { n: n, s: s }; }
  function renderCart() {
    var t = totals(), ids = Object.keys(cart);
    $$("[data-cart-count]").forEach(function (e) { e.textContent = t.n; if (e.tagName === "I") e.hidden = !t.n; });
    $$("[data-cart-total]").forEach(function (e) { e.textContent = t.n ? money(t.s) : "Coșul meu"; });
    var rest = FREE_SHIP - t.s;
    $("[data-ship]").innerHTML = (t.n ? (rest > 0 ? "Mai adaugă produse de <b>" + money(rest) + "</b> pentru livrare gratuită." : "Ai <b>livrare gratuită</b> la această comandă.") : "Livrare gratuită la comenzi peste " + FREE_SHIP + " lei.") + '<div class="ship__bar"><i style="width:' + Math.min(100, t.s / FREE_SHIP * 100) + '%"></i></div>';
    $("[data-cart-items]").innerHTML = ids.length ? ids.map(function (k) {
      var p = byId[k];
      return '<div class="ci"><img src="' + src(p.img) + '"' + photo(p.img) + ' alt=""><div><div class="ci__t">' + esc(p.t) + '</div><div class="ci__c">' + esc(p.brand) + " · " + p.code + '</div><div class="qty"><button type="button" data-qty="' + k + '" data-d="-1" aria-label="Scade cantitatea">−</button><output aria-label="Cantitate">' + cart[k] + '</output><button type="button" data-qty="' + k + '" data-d="1" aria-label="Crește cantitatea">+</button></div><button type="button" class="ci__rm" data-rm="' + k + '">Șterge</button></div><div class="ci__p">' + money(p.price * cart[k]) + "</div></div>";
    }).join("") : '<div class="cart-empty">' + ic("cart") + "<p><b>Coșul tău este gol</b></p><p>Adaugă piese din catalog și le găsești aici.</p></div>";
    var ship = t.s >= FREE_SHIP || !t.n ? 0 : SHIP;
    $("[data-cart-foot]").innerHTML = t.n ? '<div class="sum"><span>Subtotal (' + t.n + (t.n === 1 ? " produs" : " produse") + ")</span><b>" + money(t.s) + '</b></div><div class="sum"><span>Livrare</span><b>' + (ship ? money(ship) : "Gratuită") + '</b></div><div class="sum sum--total"><span>Total</span><span>' + money(t.s + ship) + '</span></div><button type="button" class="btn" data-note="checkout">Finalizează comanda</button><button type="button" class="btn btn--ghost" data-close>Continuă cumpărăturile</button>' : '<button type="button" class="btn btn--dark" data-close>Înapoi la magazin</button>';
    store.set("cart", cart);
  }
  function add(id, q) { cart[id] = (cart[id] || 0) + (q || 1); renderCart(); toast("Adăugat în coș: " + byId[id].t); }
  function renderFav() { $$("[data-fav-count]").forEach(function (e) { e.textContent = fav.length; if (e.tagName === "I") e.hidden = !fav.length; }); $$("[data-fav]").forEach(function (b) { b.setAttribute("aria-pressed", fav.indexOf(b.dataset.fav) > -1); }); store.set("fav", fav); }

  /* ---------- rezultate (căutare, categorie, favorite, mașină) ---------- */
  var resBox = $("#rezultate");
  function showResults(title, list, empty) {
    if (!resBox) return;
    $("[data-results-title]", resBox).textContent = title;
    $("[data-results]", resBox).innerHTML = list.length ? list.map(function (p) { return card(p); }).join("") : '<p class="results__empty">' + (empty || "Nu am găsit niciun produs. Încearcă alt cuvânt sau sună-ne la 0745 586 673.") + "</p>";
    resBox.hidden = false; closeAll(); hideSug(); resBox.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function find(q) { var n = norm(q).trim(); if (!n) return []; var w = n.split(/\s+/); return P.filter(function (p) { var h = norm(p.t + " " + p.brand + " " + p.code + " " + p.cat); return w.every(function (x) { return h.indexOf(x) > -1; }); }); }
  function hideSug() { $$(".sug").forEach(function (s) { s.remove(); }); }
  $$("[data-search]").forEach(function (f) {
    var inp = $("input", f); f.setAttribute("role", "search"); inp.setAttribute("autocomplete", "off");
    inp.addEventListener("input", function () {
      hideSug(); var q = inp.value.trim(); if (q.length < 2) return;
      var r = find(q), cats = CATS.filter(function (c) { return norm(c.name).indexOf(norm(q)) > -1; }), d = document.createElement("div"); d.className = "sug";
      d.innerHTML = (cats.length ? '<div class="sug__h">Categorii</div>' + cats.slice(0, 2).map(function (c) { return '<button type="button" class="sug__i" data-cat-link="' + c.id + '">' + ic(c.id) + "<b>" + esc(c.name) + "</b></button>"; }).join("") : "") +
        (r.length ? '<div class="sug__h">Produse</div>' + r.slice(0, 5).map(function (p) { return '<button type="button" class="sug__i" data-quick="' + p.id + '"><img src="' + src(p.img) + '" alt=""><b>' + esc(p.t) + "</b><span>" + money(p.price) + "</span></button>"; }).join("") : '<div class="sug__h">Niciun produs găsit pentru „' + esc(q) + "”</div>") +
        (r.length ? '<button type="submit" class="sug__all">Vezi toate cele ' + r.length + " rezultate</button>" : "");
      f.appendChild(d);
    });
    f.addEventListener("submit", function (e) { e.preventDefault(); var q = inp.value.trim(); if (!q) { inp.focus(); return; } var r = find(q); showResults(r.length + (r.length === 1 ? " rezultat" : " rezultate") + " pentru „" + q + "”", r); });
  });
  document.addEventListener("click", function (e) { if (!e.target.closest("[data-search]")) hideSug(); });

  /* ---------- selector de mașină ---------- */
  function carLabel() { return car ? car.make + " " + car.model + " " + car.year + " · " + car.engine : ""; }
  function renderCar() { $$("[data-car-label]").forEach(function (e) { e.textContent = car ? carLabel() : e.dataset.carLabel || "Alege mașina"; }); $$("[data-car-clear]").forEach(function (e) { e.hidden = !car; }); }
  $$("[data-vehicle]").forEach(function (f) {
    var s = {}; ["make", "model", "year", "engine"].forEach(function (k) { s[k] = $('[data-v="' + k + '"]', f); });
    var opt = function (el, first, list) { el.innerHTML = '<option value="">' + first + "</option>" + list.map(function (x) { return "<option>" + x + "</option>"; }).join(""); };
    var years = []; for (var y = 2025; y >= 2005; y--) years.push(y);
    opt(s.make, "Marcă", Object.keys(CARS)); opt(s.model, "Model", []); opt(s.year, "An", years); opt(s.engine, "Motorizare", ENGINES);
    s.model.disabled = true;
    s.make.addEventListener("change", function () { opt(s.model, "Model", CARS[s.make.value] || []); s.model.disabled = !s.make.value; });
    if (car) { s.make.value = car.make; s.make.dispatchEvent(new Event("change")); s.model.value = car.model; s.year.value = car.year; s.engine.value = car.engine; }
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var miss = ["make", "model", "year", "engine"].filter(function (k) { return !s[k].value; });
      if (miss.length) { s[miss[0]].focus(); toast("Alege marca, modelul, anul și motorizarea."); return; }
      car = { make: s.make.value, model: s.model.value, year: s.year.value, engine: s.engine.value }; store.set("car", car); renderCar();
      var seed = (car.make + car.model).length; showResults("Piese compatibile cu " + carLabel(), P.filter(function (p, i) { return (i + seed) % 4 !== 0; }));
    });
  });
  $$("[data-countdown]").forEach(function (c) {
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var tick = function () { var now = new Date(), end = new Date(now); end.setHours(24, 0, 0, 0); var r = Math.floor((end - now) / 1000); $('[data-t="h"]', c).textContent = pad(Math.floor(r / 3600)); $('[data-t="m"]', c).textContent = pad(Math.floor(r / 60) % 60); $('[data-t="s"]', c).textContent = pad(r % 60); };
    tick(); setInterval(tick, 1000);
  });

  /* ---------- slider ---------- */
  $$("[data-slider]").forEach(function (sl) {
    var slides = $$(".slide", sl), dots = $("[data-slider-dots]", sl), i = 0, timer;
    var go = function (n) { i = (n + slides.length) % slides.length; slides.forEach(function (s, k) { s.classList.toggle("is-on", k === i); s.setAttribute("aria-hidden", k !== i); if (k !== i) s.setAttribute("inert", ""); else s.removeAttribute("inert"); }); $$("button", dots).forEach(function (d, k) { d.classList.toggle("is-on", k === i); d.setAttribute("aria-current", k === i); }); };
    dots.innerHTML = slides.map(function (_, k) { return '<button type="button" aria-label="Oferta ' + (k + 1) + '"></button>'; }).join("");
    $$("button", dots).forEach(function (d, k) { d.addEventListener("click", function () { go(k); play(); }); });
    var pv = $("[data-slider-prev]", sl), nx = $("[data-slider-next]", sl);
    if (pv) pv.addEventListener("click", function () { go(i - 1); play(); }); if (nx) nx.addEventListener("click", function () { go(i + 1); play(); });
    var still = matchMedia("(prefers-reduced-motion:reduce)").matches;
    function play() { clearInterval(timer); if (!still) timer = setInterval(function () { go(i + 1); }, 6000); }
    sl.addEventListener("mouseenter", function () { clearInterval(timer); }); sl.addEventListener("mouseleave", play); sl.addEventListener("focusin", function () { clearInterval(timer); });
    go(0); play();
  });

  /* ---------- vizualizare rapidă + mesaje demo ---------- */
  var NOTES = {
    checkout: ["Finalizarea comenzii", "Urmează pașii de comandă: date de livrare, metoda de plată (card sau ramburs) și confirmarea. Îi construim pe designul ales."],
    cont: ["Contul meu", "Aici vor fi autentificarea, comenzile, adresele, mașinile salvate și favoritele clientului."],
    comenzi: ["Urmărește comanda", "Clientul introduce numărul comenzii și vede statusul livrării în timp real."],
    pagina: ["Pagină în lucru", "Această pagină se construiește după alegerea designului. Prima pagină arată stilul întregului magazin."]
  };
  function note(k) { var n = NOTES[k] || NOTES.pagina; var c = $("[data-modal-card]"); c.className = "modal__card modal__card--sm"; c.innerHTML = '<button class="x" type="button" data-close aria-label="Închide">' + ic("x") + '</button><div class="qv__body"><h2 class="qv__title">' + n[0] + '</h2><p class="note">' + n[1] + '</p><button type="button" class="btn" data-close>Am înțeles</button></div>'; open(modal); }
  function quick(id) {
    var p = byId[id], c = $("[data-modal-card]"), cat = CATS.filter(function (x) { return x.id === p.cat; })[0]; c.className = "modal__card";
    c.innerHTML = '<button class="x" type="button" data-close aria-label="Închide">' + ic("x") + '</button><div class="qv__media"><img src="' + src(p.img) + '"' + photo(p.img) + ' alt="' + esc(p.t) + '"></div><div class="qv__body"><div class="pc__brand">' + esc(p.brand) + " · " + esc(cat.name) + '</div><h2 class="qv__title">' + esc(p.t) + '</h2><div class="pc__rate"><span class="stars" style="--r:' + p.rate + '"></span><span>' + String(p.rate).replace(".", ",") + " · " + p.rev + ' evaluări</span></div><div class="pc__code">Cod produs: ' + p.code + '</div><div class="pc__price"><span class="pc__old">' + (p.old ? "<s>" + money(p.old) + "</s> · economisești " + money(p.old - p.price) : "") + "</span>" + priceHTML(p.price, !!p.old) + '</div><ul class="qv__list"><li>' + (car ? "Compatibil cu " + esc(carLabel()) : "Verificăm compatibilitatea după seria de șasiu (VIN)") + "</li><li>În stoc, livrare în 24–48h sau ridicare din Satu Mare</li><li>Retur în 14 zile și garanție de la producător</li><li>Montaj la cerere în service-ul Cristea AutoZone</li></ul>" + '<div class="qv__buy"><div class="qty"><button type="button" data-qv="-1" aria-label="Scade cantitatea">−</button><output data-qv-n>1</output><button type="button" data-qv="1" aria-label="Crește cantitatea">+</button></div><button type="button" class="btn" data-qv-add="' + p.id + '">' + ic("cart") + "Adaugă în coș</button></div></div>";
    open(modal);
  }

  /* ---------- delegare evenimente ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target, el;
    if ((el = t.closest("[data-add]"))) { add(el.dataset.add); el.classList.add("is-added"); setTimeout(function () { el.classList.remove("is-added"); }, 900); return; }
    if ((el = t.closest("[data-fav]"))) { var id = el.dataset.fav, k = fav.indexOf(id); if (k > -1) fav.splice(k, 1); else { fav.push(id); toast("Adăugat la favorite"); } renderFav(); return; }
    if ((el = t.closest("[data-quick]"))) { e.preventDefault(); hideSug(); quick(el.dataset.quick); return; }
    if ((el = t.closest("[data-qty]"))) { var q = (cart[el.dataset.qty] || 0) + +el.dataset.d; if (q < 1) delete cart[el.dataset.qty]; else cart[el.dataset.qty] = q; renderCart(); return; }
    if ((el = t.closest("[data-rm]"))) { delete cart[el.dataset.rm]; renderCart(); return; }
    if ((el = t.closest("[data-qv]"))) { var o = $("[data-qv-n]"); o.textContent = Math.max(1, +o.textContent + +el.dataset.qv); return; }
    if ((el = t.closest("[data-qv-add]"))) { add(el.dataset.qvAdd, +$("[data-qv-n]").textContent); closeAll(); return; }
    if ((el = t.closest("[data-cart-open]"))) { e.preventDefault(); open(drawers.cart); return; }
    if ((el = t.closest("[data-menu-open]"))) { e.preventDefault(); open(drawers.menu); return; }
    if ((el = t.closest("[data-fav-open]"))) { e.preventDefault(); showResults("Favoritele tale (" + fav.length + ")", fav.map(function (k) { return byId[k]; }), "Nu ai încă produse favorite. Apasă pe inimă la orice produs."); return; }
    if ((el = t.closest("[data-cat-link]"))) { e.preventDefault(); var c = CATS.filter(function (x) { return x.id === el.dataset.catLink; })[0]; showResults(c.name, listFor("all", c.id), "Produsele din această categorie se încarcă din catalogul real."); return; }
    if ((el = t.closest("[data-tag-link]"))) { e.preventDefault(); showResults(el.dataset.title || el.textContent.trim(), listFor(el.dataset.tagLink)); return; }
    if ((el = t.closest("[data-results-clear]"))) { resBox.hidden = true; return; }
    if ((el = t.closest("[data-car-open]"))) { e.preventDefault(); closeAll(); var v = $("[data-vehicle]"); if (v) { v.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(function () { $("select", v).focus({ preventScroll: true }); }, 400); } return; }
    if ((el = t.closest("[data-car-clear]"))) { car = null; store.set("car", null); renderCar(); $$("[data-vehicle]").forEach(function (f) { f.reset(); $('[data-v="model"]', f).disabled = true; }); toast("Mașina a fost ștearsă."); return; }
    if ((el = t.closest("[data-search-focus]"))) { closeAll(); scrollTo({ top: 0, behavior: "smooth" }); var si = $("[data-search] input"); if (si) setTimeout(function () { si.focus(); }, 300); return; }
    if ((el = t.closest("[data-top]"))) { closeAll(); scrollTo({ top: 0, behavior: "smooth" }); return; }
    if ((el = t.closest("[data-note]"))) { e.preventDefault(); note(el.dataset.note); return; }
    if ((el = t.closest("[data-tabs] button"))) { var tabs = el.closest("[data-tabs]"); $$("button", tabs).forEach(function (b) { b.classList.toggle("is-on", b === el); b.setAttribute("aria-pressed", b === el); }); fill($(tabs.dataset.tabs), el.dataset.cat); renderFav(); return; }
    if (t.closest("[data-close]") || t === modal) { closeAll(); return; }
    if ((el = t.closest('a[href="#"]'))) { e.preventDefault(); note("pagina"); }
  });
  $$("[data-newsletter]").forEach(function (f) { f.addEventListener("submit", function (e) { e.preventDefault(); var i = $("input", f); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value)) { i.focus(); toast("Scrie o adresă de e‑mail validă."); return; } i.value = ""; toast("Mulțumim! Te-am abonat la oferte (demo)."); }); });
  $$("[data-vin]").forEach(function (f) { f.addEventListener("submit", function (e) { e.preventDefault(); var i = $("input", f), v = i.value.trim().toUpperCase(); if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) { i.focus(); toast("Seria de șasiu (VIN) are 17 caractere, fără I, O sau Q."); return; } i.value = ""; toast("Am primit seria " + v + ". Revenim cu oferta (demo)."); }); });

  renderCart(); renderFav(); renderCar();
})();
