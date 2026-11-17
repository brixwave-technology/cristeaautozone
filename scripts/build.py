#!/usr/bin/env python3
"""Generează paginile statice din designs/ pornind de la șabloanele din src/.

Șabloanele folosesc <sc-for list="{{lista}}" as="x">…</sc-for> și {{x.camp}}.
Rulează:  python3 scripts/build.py
"""
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMG = "../../shared/piese/{}.svg"

PAGES = {
    "01-marketplace": {
        "title": "Cristea AutoZone · Marketplace clasic",
        "fonts": "family=Inter:wght@400;500;600;700;800",
        "hover": "#B8031F",
        "data": {
            "cats": ["Sistem de frânare", "Motor și distribuție", "Filtre", "Suspensie și direcție",
                     "Electrice și iluminat", "Uleiuri și lichide", "Caroserie", "Răcire și climatizare",
                     "Anvelope și jante", "Accesorii auto"],
            "deals": [
                {"t": "Set plăcuțe frână față", "img": "placute", "pr": "189", "old": "239", "d": "-21%", "c": "CAZ-1042"},
                {"t": "Ulei motor 5W-30, 5 L", "img": "ulei", "pr": "179", "old": "229", "d": "-22%", "c": "CAZ-2210"},
                {"t": "Kit distribuție cu pompă de apă", "img": "distributie", "pr": "649", "old": "799", "d": "-19%", "c": "CAZ-3105"},
                {"t": "Baterie auto 12V 70Ah", "img": "baterie", "pr": "429", "old": "499", "d": "-14%", "c": "CAZ-4070"},
                {"t": "Set ștergătoare parbriz", "img": "stergatoare", "pr": "79", "old": "99", "d": "-20%", "c": "CAZ-5018"},
            ],
            "tiles": [
                {"t": "Discuri de frână", "img": "disc"}, {"t": "Filtre ulei", "img": "filtru-ulei"},
                {"t": "Amortizoare", "img": "amortizor"}, {"t": "Becuri auto", "img": "bec"},
                {"t": "Ulei motor", "img": "ulei"}, {"t": "Baterii", "img": "baterie"},
            ],
            "top": [
                {"t": "Filtru ulei", "img": "filtru-ulei", "pr": "39", "c": "CAZ-6001"},
                {"t": "Filtru aer", "img": "filtru-aer", "pr": "59", "c": "CAZ-6014"},
                {"t": "Set discuri frână față", "img": "disc", "pr": "349", "c": "CAZ-1077"},
                {"t": "Amortizor față", "img": "amortizor", "pr": "289", "c": "CAZ-7032"},
                {"t": "Anvelopă iarnă 205/55 R16", "img": "anvelopa", "pr": "319", "c": "CAZ-8055"},
            ],
        },
    },
    "02-oferte": {
        "title": "Cristea AutoZone · Oferte în față",
        "fonts": "family=Barlow:wght@500;600;700;800&family=Barlow+Condensed:wght@700;800",
        "hover": "#FF4D5E",
        "data": {
            "nav": ["Toate piesele", "Frânare", "Motor", "Filtre", "Suspensie", "Electrice", "Uleiuri", "Anvelope", "Accesorii"],
            "flash": [
                {"t": "Set discuri + plăcuțe frână față", "img": "disc", "pr": "449", "old": "569", "n": "7", "w": "72%", "c": "CAZ-1080"},
                {"t": "Ulei motor 5W-40, 5 L", "img": "ulei", "pr": "169", "old": "219", "n": "12", "w": "55%", "c": "CAZ-2240"},
                {"t": "Baterie auto 12V 60Ah", "img": "baterie", "pr": "379", "old": "449", "n": "5", "w": "80%", "c": "CAZ-4060"},
                {"t": "Kit ambreiaj complet", "img": "ambreiaj", "pr": "899", "old": "1.099", "n": "3", "w": "88%", "c": "CAZ-3301"},
                {"t": "Set becuri H7", "img": "bec", "pr": "49", "old": "69", "n": "20", "w": "35%", "c": "CAZ-5507"},
            ],
            "round": [
                {"t": "Frânare", "img": "disc"}, {"t": "Motor", "img": "distributie"},
                {"t": "Filtre", "img": "filtru-ulei"}, {"t": "Suspensie", "img": "amortizor"},
                {"t": "Electrice", "img": "baterie"}, {"t": "Uleiuri", "img": "ulei"},
                {"t": "Caroserie", "img": "far"}, {"t": "Anvelope", "img": "anvelopa"},
            ],
            "grid": [
                {"t": "Filtru ulei", "img": "filtru-ulei", "pr": "39", "c": "CAZ-6001"},
                {"t": "Filtru aer", "img": "filtru-aer", "pr": "59", "c": "CAZ-6014"},
                {"t": "Amortizor spate", "img": "amortizor", "pr": "259", "c": "CAZ-7040"},
                {"t": "Bujii, set 4 buc.", "img": "bujii", "pr": "119", "c": "CAZ-3410"},
                {"t": "Curea accesorii", "img": "distributie", "pr": "89", "c": "CAZ-3120"},
                {"t": "Radiator apă", "img": "radiator", "pr": "399", "c": "CAZ-9003"},
                {"t": "Set plăcuțe frână spate", "img": "placute", "pr": "149", "c": "CAZ-1050"},
                {"t": "Set ștergătoare parbriz", "img": "stergatoare", "pr": "79", "c": "CAZ-5018"},
            ],
            "brands": ["[BRAND 1]", "[BRAND 2]", "[BRAND 3]", "[BRAND 4]", "[BRAND 5]", "[BRAND 6]"],
        },
    },
    "03-megastore": {
        "title": "Cristea AutoZone · Megastore piese",
        "fonts": "family=Archivo:wght@400;500;600;700;800;900",
        "hover": "#B8031F",
        "data": {
            "cats": [
                {"t": "Sistem de frânare", "a": "Plăcuțe și discuri", "b": "Etriere, furtunuri", "img": "placute"},
                {"t": "Motor", "a": "Distribuție, curele", "b": "Garnituri, bujii", "img": "distributie"},
                {"t": "Filtre", "a": "Ulei, aer, polen", "b": "Combustibil", "img": "filtru-aer"},
                {"t": "Suspensie și direcție", "a": "Amortizoare, arcuri", "b": "Brațe, bielete", "img": "amortizor"},
                {"t": "Electrice", "a": "Baterii, alternatoare", "b": "Becuri, senzori", "img": "baterie"},
                {"t": "Uleiuri și lichide", "a": "Ulei motor", "b": "Antigel, lichid frână", "img": "ulei"},
                {"t": "Caroserie", "a": "Oglinzi, faruri", "b": "Bare, aripi", "img": "far"},
                {"t": "Anvelope și jante", "a": "Vară, iarnă", "b": "All season", "img": "anvelopa"},
            ],
            "promo": [
                {"t": "Set plăcuțe frână spate", "img": "placute", "pr": "149", "old": "189", "d": "-21%", "c": "CAZ-1050"},
                {"t": "Ulei motor 5W-30, 4 L", "img": "ulei", "pr": "149", "old": "189", "d": "-21%", "c": "CAZ-2204"},
                {"t": "Filtru ulei", "img": "filtru-ulei", "pr": "29", "old": "39", "d": "-26%", "c": "CAZ-6001"},
                {"t": "Amortizor față", "img": "amortizor", "pr": "249", "old": "289", "d": "-14%", "c": "CAZ-7032"},
                {"t": "Kit distribuție", "img": "distributie", "pr": "549", "old": "649", "d": "-15%", "c": "CAZ-3100"},
            ],
            "fresh": [
                {"t": "Disc ambreiaj", "img": "ambreiaj", "pr": "329", "c": "CAZ-3310"},
                {"t": "Radiator apă", "img": "radiator", "pr": "399", "c": "CAZ-9003"},
                {"t": "Bujii, set 4 buc.", "img": "bujii", "pr": "119", "c": "CAZ-3410"},
                {"t": "Far stânga", "img": "far", "pr": "589", "c": "CAZ-9120"},
                {"t": "Anvelopă iarnă 205/55 R16", "img": "anvelopa", "pr": "319", "c": "CAZ-8055"},
            ],
        },
    },
}

HEAD = """<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{fonts}&display=swap">
<link rel="stylesheet" href="../../shared/demo.css">
<style>a:hover{{color:{hover}}}</style>
</head>
<body id="top">
"""
FOOT = """
<script src="../../shared/demo.js"></script>
</body>
</html>
"""

FOR_RE = re.compile(r'<sc-for list="\{\{(\w+)\}\}" as="(\w+)"[^>]*>(.*?)</sc-for>', re.S)


def fill(body, var, item):
    def sub(m):
        key = m.group(1)
        if key == var:
            return html.escape(str(item))
        if key.startswith(var + "."):
            field = key[len(var) + 1:]
            val = item[field]
            if field == "img":
                return IMG.format(val)
            return html.escape(str(val))
        return m.group(0)
    return re.sub(r"\{\{([\w.]+)\}\}", sub, body)


def render(tpl, data):
    return FOR_RE.sub(lambda m: "".join(fill(m.group(3), m.group(2), it) for it in data[m.group(1)]), tpl)


for slug, cfg in PAGES.items():
    tpl = (ROOT / "src" / f"{slug}.html").read_text(encoding="utf-8")
    out = render(tpl, cfg["data"])
    assert "{{" not in out and "sc-for" not in out, slug
    dest = ROOT / "designs" / slug / "index.html"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(HEAD.format(**cfg) + out + FOOT, encoding="utf-8")
    print("ok", dest.relative_to(ROOT))
