# Portal Brixwave × Cristea AutoZone

Portal de prezentare prin care clientul (Cristea AutoZone, https://cristeaautozone.ro) alege unul dintre
cele 3 design-uri propuse de Brixwave pentru prima pagină a magazinului online de piese auto, apoi cere oferta.

```
index.html                  ← portal (alegere design, preview live, comparație, cerere ofertă)
assets/brixwave.{css,js}    ← stil + logică portal (configurarea e în capul lui brixwave.js)
designs/01-marketplace/     ← Marketplace (alb, meniu lateral, carusel, ofertele zilei)
designs/02-oferte/          ← Motorsport (negru, tipografie înclinată, selector de mașină în hero)
designs/03-megastore/       ← Catalog tehnic (header roșu, bară de mașină, ofertă după VIN, pachete)
shared/shop.{css,js}        ← motorul comun: catalog demo, coș, favorite, căutare, filtre, selector de mașină
shared/piese/               ← ilustrații de piese (generate cu scripts/gen-art.py)
shared/photos.js            ← aici se trec fotografiile reale, ex. { disc: "disc.jpg" } (fișierul stă în shared/piese/)
.github/workflows/pages.yml ← publicare automată pe GitHub Pages
```

Fiecare design are `index.html` + `style.css`; produsele, coșul și căutarea vin din `shared/shop.js`.
Prețurile, codurile, brandurile, evaluările și termenele sunt valori de exemplu.

Publicare: la fiecare push pe `main` → https://brixwave-technology.github.io/cristeaautozone/
