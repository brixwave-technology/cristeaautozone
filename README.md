# Portal Brixwave × Cristea AutoZone

Portal de prezentare prin care clientul (Cristea AutoZone, https://cristeaautozone.ro) alege unul dintre
cele 3 design-uri propuse de Brixwave pentru prima pagină a magazinului online de piese auto, apoi cere oferta.

```
index.html                  ← portal (alegere design, preview live, comparație, cerere ofertă)
assets/brixwave.{css,js}    ← stil + logică portal (configurarea e în capul lui brixwave.js)
designs/01-marketplace/     ← Marketplace clasic (alb, meniu categorii, ofertele zilei)
designs/02-oferte/          ← Oferte în față (negru, oferte fulger cu cronometru)
designs/03-megastore/       ← Megastore piese (roșu, selector după mașină, ofertă după VIN)
shared/piese/               ← ilustrații SVG pentru piese (se înlocuiesc cu fotografii reale)
shared/demo.{css,js}        ← adaptare pe telefon, coș demo, cronometru, buton „înapoi la portal”
src/ + scripts/build.py     ← șabloanele paginilor; designs/ se generează din ele
.github/workflows/pages.yml ← publicare automată pe GitHub Pages
```

Modificări în design-uri: editezi `src/<design>.html` sau datele din `scripts/build.py`, apoi rulezi

```bash
python3 scripts/build.py
```

Prețurile, codurile și reducerile sunt valori de exemplu; câmpurile între paranteze drepte (`[TERMEN LIVRARE]`,
`[BRAND 1]` etc.) se completează cu datele clientului.

Publicare: la fiecare push pe `main` → https://brixwave-technology.github.io/cristeaautozone/
