/* ================= BRIXWAVE PORTAL — configurare ================= */
const BRIXWAVE = {
  name: "Brixwave",
  email: "brixwavetechnology@gmail.com",   // unde ajunge alegerea clientului
  whatsapp: "",                            // ex: "407xxxxxxxx" (doar cifre). Gol → butonul WhatsApp e ascuns
  client: "Cristea AutoZone (cristeaautozone.ro)",
  storageKey: "brixwave.cristeaautozone.choice",
  includes: [
    "Magazin online complet pe designul ales: prima pagină, categorii, pagină de produs, coș și finalizare comandă",
    "Căutare după denumire, cod OEM și brand, plus filtre pe categorii",
    "Selectare piese după mașină (marcă, model, an, motorizare) și cerere de ofertă după VIN",
    "Cont client, favorite, istoric comenzi și urmărirea comenzii",
    "Plată la livrare și cu cardul, livrare prin curier sau ridicare din Satu Mare",
    "Panou de administrare pentru produse, stocuri, prețuri, promoții și comenzi",
    "Optimizare SEO și viteză, gândit întâi pentru telefon",
    "Publicare online pe cristeaautozone.ro și asistență după lansare",
  ],
  steps: [
    ["Alegeți designul", "din portal și ne trimiteți alegerea prin e‑mail sau WhatsApp."],
    ["Primiți oferta scrisă", "personalizată: preț, termen de livrare și pașii de plată."],
    ["Ne trimiteți catalogul", "lista de produse, fotografii, prețuri, condiții de livrare și retur."],
    ["Livrăm magazinul", "testat pe telefon și calculator, gata de vânzare."],
  ],
};

const DESIGNS = [
  {
    id: "marketplace",
    name: "Marketplace",
    vibe: "Alb · curat · structură de mare magazin online",
    path: "designs/01-marketplace/index.html",
    desc: "Structura pe care clienții o știu din marile magazine online: căutare mare, meniu lateral de categorii cu subcategorii la hover, carusel de campanii, ofertele zilei cu cronometru, categorii cu imagini și produse pe file. Aerisit, cu panouri albe bine delimitate.",
    tags: ["Manrope", "Alb, roșu, negru", "Meniu lateral cu subcategorii", "Carusel de campanii"],
    swatches: ["#ffffff", "#d90429", "#111214"],
    focus: 4, energy: 3, density: 4,
    audience: "Public larg, obișnuit cu marile magazine online",
  },
  {
    id: "motorsport",
    name: "Motorsport",
    vibe: "Negru · sportiv · inspirat din logo",
    path: "designs/02-oferte/index.html",
    desc: "Preia limbajul logo-ului: negru, roșu, litere condensate înclinate și steagul de curse. Titlu uriaș, selectorul de mașină chiar în prima imagine, bandă roșie de oferte fulger cu stoc rămas, categorii pe plăci întunecate și butoane tăiate oblic.",
    tags: ["Barlow Condensed", "Negru, roșu, alb", "Selector de mașină în prima imagine", "Oferte fulger cu stoc rămas"],
    swatches: ["#0b0b0c", "#d90429", "#ffffff"],
    focus: 4, energy: 5, density: 4,
    audience: "Pasionați auto, brand cu personalitate puternică",
  },
  {
    id: "tehnic",
    name: "Catalog tehnic",
    vibe: "Roșu · precis · ca o fișă tehnică",
    path: "designs/03-megastore/index.html",
    desc: "Arată ca un catalog profesional de piese: header roșu, bara „Piese pentru mașina ta” mereu vizibilă, cerere de ofertă după seria VIN, categorii cu subcategorii listate, coduri de produs în font tehnic și pachete gata făcute (revizie, frânare, iarnă).",
    tags: ["Archivo + JetBrains Mono", "Roșu, negru, alb", "Bară de mașină mereu vizibilă", "Ofertă după VIN și pachete"],
    swatches: ["#d90429", "#131416", "#f5f5f6"],
    focus: 5, energy: 3, density: 5,
    audience: "Clienți care caută exact piesa potrivită, mecanici și service-uri",
  },
];

/* ================================================================== */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const KEY = BRIXWAVE.storageKey;
  let chosen = null;
  try { chosen = localStorage.getItem(KEY); } catch (e) {}

  $("#year").textContent = new Date().getFullYear();
  const fm = $("#footer-mail"); fm.textContent = BRIXWAVE.email; fm.href = "mailto:" + BRIXWAVE.email;

  /* ---- cards ---- */
  $("#cards").innerHTML = DESIGNS.map((d, i) => `
    <article class="card reveal" data-id="${d.id}" style="transition-delay:${i * 90}ms">
      <div class="card__preview" data-open="${d.id}" role="button" tabindex="0" aria-label="Previzualizează ${esc(d.name)}">
        <span class="card__badge">${chosen === d.id ? "Alegerea ta" : "Varianta " + (i + 1)}</span>
        <iframe src="${d.path}" title="Preview ${esc(d.name)}" loading="lazy" tabindex="-1" aria-hidden="true"></iframe>
      </div>
      <div class="card__body">
        <div class="card__head">
          <div><h3 class="card__name">${esc(d.name)}</h3><p class="card__vibe">${esc(d.vibe)}</p></div>
          <div class="card__swatches" aria-hidden="true">${d.swatches.map((c) => `<i style="background:${c}"></i>`).join("")}</div>
        </div>
        <p class="card__desc">${esc(d.desc)}</p>
        <ul class="card__tags">${d.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        <div class="card__actions">
          <button class="btn" data-open="${d.id}">Preview</button>
          <button class="btn btn--primary" data-choose="${d.id}">Aleg acest design</button>
        </div>
        <div class="card__price"><span>Ofertă personalizată</span><b>la cerere</b></div>
      </div>
    </article>`).join("");

  /* scale iframes to card width */
  const fit = () => $$(".card__preview").forEach((p) => { const f = $("iframe", p); if (f) f.style.transform = `scale(${p.clientWidth / 1440})`; });
  new ResizeObserver(fit).observe($("#cards")); fit();

  /* ---- compare table ---- */
  const meter = (n) => `<span class="meter" aria-hidden="true">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
  const rows = [
    ["Atmosferă", (d) => esc(d.vibe)],
    ["Paletă", (d) => `<span class="card__swatches" aria-hidden="true" style="display:inline-flex;vertical-align:middle;margin-right:8px">${d.swatches.map((c) => `<i style="background:${c}"></i>`).join("")}</span>${esc(d.tags[1])}`],
    ["Tipografie", (d) => esc(d.tags[0])],
    ["Ghidare spre piesa potrivită", (d) => meter(d.focus) + ["", "minimă", "de bază", "bună", "foarte bună", "maximă"][d.focus]],
    ["Accent pe promoții", (d) => meter(d.energy) + ["", "discret", "moderat", "echilibrat", "puternic", "maxim"][d.energy]],
    ["Produse pe ecran", (d) => meter(d.density) + ["", "puține", "aerisit", "echilibrat", "multe", "foarte multe"][d.density]],
    ["Element distinctiv", (d) => esc(d.tags[2]) + " · " + esc(d.tags[3])],
    ["Potrivit pentru", (d) => esc(d.audience)],
  ];
  $("#compare-table").innerHTML = `<thead><tr><th scope="col"></th>${DESIGNS.map((d) => `<th scope="col">${esc(d.name)}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(([label, fn]) => `<tr><th scope="row">${label}</th>${DESIGNS.map((d) => `<td>${fn(d)}</td>`).join("")}</tr>`).join("")}</tbody>`;

  /* ---- offer ---- */
  $("#includes").innerHTML = BRIXWAVE.includes.map((x) => `<li>${esc(x)}</li>`).join("");
  $("#steps").innerHTML = BRIXWAVE.steps.map(([b, t]) => `<li><span><b>${esc(b)}</b> ${esc(t)}</span></li>`).join("");

  /* ---- viewer ---- */
  const viewer = $("#viewer"), frame = $("#viewer-frame"), stage = $("#viewer-stage");
  let current = null, lastFocus = null;
  const openViewer = (id) => {
    const d = DESIGNS.find((x) => x.id === id); if (!d) return;
    current = d; lastFocus = document.activeElement;
    $("#viewer-title").innerHTML = `${esc(d.name)}<small>${esc(d.vibe)}</small>`;
    $("#viewer-open").href = d.path; frame.src = d.path;
    viewer.hidden = false; document.body.style.overflow = "hidden"; $("#viewer-close").focus();
  };
  const closeViewer = () => { viewer.hidden = true; frame.src = "about:blank"; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); };
  $("#viewer-close").addEventListener("click", closeViewer);
  $("#viewer-choose").addEventListener("click", () => { closeViewer(); openModal(current.id); });
  $$(".seg").forEach((b) => b.addEventListener("click", () => {
    $$(".seg").forEach((x) => x.classList.toggle("is-on", x === b));
    stage.classList.toggle("is-mobile", b.dataset.device === "mobile");
  }));

  /* ---- choice modal ---- */
  const modal = $("#modal");
  const openModal = (id) => {
    const d = DESIGNS.find((x) => x.id === id); if (!d) return;
    chosen = d.id; try { localStorage.setItem(KEY, d.id); } catch (e) {}
    markChoice();
    $("#modal-title").textContent = d.name;
    $("#modal-desc").textContent = d.desc;
    $("#modal-includes").innerHTML = BRIXWAVE.includes.slice(0, 5).map((x) => `<li>${esc(x)}</li>`).join("");
    const msg = `Bună! Sunt de la ${BRIXWAVE.client}. Am ales designul „${d.name}” din portalul Brixwave și aș dori o ofertă pentru realizarea magazinului online. Mulțumesc!`;
    $("#modal-mail").href = `mailto:${BRIXWAVE.email}?subject=${encodeURIComponent(`[${BRIXWAVE.client}] Design ales: ${d.name}`)}&body=${encodeURIComponent(msg)}`;
    const wa = $("#modal-wa");
    if (BRIXWAVE.whatsapp) { wa.hidden = false; wa.href = `https://wa.me/${BRIXWAVE.whatsapp}?text=${encodeURIComponent(msg)}`; } else wa.hidden = true;
    lastFocus = document.activeElement; modal.hidden = false; document.body.style.overflow = "hidden"; $("#modal-close").focus();
  };
  const closeModal = () => { modal.hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); };
  $("#modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") { if (!modal.hidden) closeModal(); else if (!viewer.hidden) closeViewer(); } });

  function markChoice() {
    $$(".card").forEach((c, i) => {
      const on = c.dataset.id === chosen; c.classList.toggle("is-chosen", on);
      $(".card__badge", c).textContent = on ? "Alegerea ta" : "Varianta " + (i + 1);
      $("[data-choose]", c).textContent = on ? "Ales · cere oferta" : "Aleg acest design";
    });
    const hint = $("#offer-hint"), d = DESIGNS.find((x) => x.id === chosen);
    hint.classList.toggle("is-chosen", !!d);
    hint.textContent = d ? `Ai ales „${d.name}”. Trimite cererea din card pentru a primi oferta.` : "Alege un design mai sus, apoi trimite cererea.";
  }
  markChoice();

  /* ---- delegated actions ---- */
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]"), c = e.target.closest("[data-choose]");
    if (o) openViewer(o.dataset.open); else if (c) openModal(c.dataset.choose);
  });
  document.addEventListener("keydown", (e) => {
    const o = e.target.closest && e.target.closest(".card__preview[data-open]");
    if (o && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openViewer(o.dataset.open); }
  });

  /* ---- reveals ---- */
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { threshold: 0.1 });
  $$(".reveal").forEach((el) => io.observe(el));
  requestAnimationFrame(() => setTimeout(() => $(".hero").classList.add("is-in"), 60));
})();
