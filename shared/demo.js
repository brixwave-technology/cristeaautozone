/* Interacțiuni demo: coș, cronometru, formulare oprite, buton „înapoi la portal” */
(function () {
  var inFrame = window.self !== window.top;
  document.querySelectorAll("form").forEach(function (f) { f.addEventListener("submit", function (e) { e.preventDefault(); toast("Demo: căutarea și filtrele vor funcționa în magazinul real."); }); });
  document.querySelectorAll('a[href="#top"]').forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); }); });

  var count = 0, t;
  function toast(msg) {
    var el = document.querySelector(".demo-toast");
    if (!el) { el = document.createElement("div"); el.className = "demo-toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add("on"); clearTimeout(t); t = setTimeout(function () { el.classList.remove("on"); }, 2200);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cart]"); if (!b) return;
    count++; document.querySelectorAll(".cart-count").forEach(function (c) { c.textContent = count; });
    toast("Adăugat în coș (" + count + (count === 1 ? " produs" : " produse") + ")");
  });

  var h = document.querySelector('[data-timer="h"]');
  if (h) {
    var end = Date.now() + (5 * 3600 + 42 * 60 + 17) * 1000, m = document.querySelector('[data-timer="m"]'), s = document.querySelector('[data-timer="s"]');
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var tick = function () { var r = Math.max(0, Math.floor((end - Date.now()) / 1000)); h.textContent = pad(Math.floor(r / 3600)); m.textContent = pad(Math.floor(r / 60) % 60); s.textContent = pad(r % 60); };
    tick(); setInterval(tick, 1000);
  }

  if (!inFrame) { var a = document.createElement("a"); a.className = "demo-back"; a.href = "../../index.html#designs"; a.textContent = "← Înapoi la alegerea designului"; document.body.appendChild(a); }
})();
