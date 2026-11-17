#!/usr/bin/env python3
"""Generează ilustrațiile de piese (stil „poză de studio”) în shared/piese/.
Se înlocuiesc cu fotografii reale păstrând numele fișierelor.   python3 scripts/gen-art.py
"""
import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "shared" / "piese"
OUT.mkdir(parents=True, exist_ok=True)

DEFS = """<defs>
<linearGradient id="st" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbfcfd"/><stop offset=".32" stop-color="#bfc5cc"/><stop offset=".58" stop-color="#eef0f2"/><stop offset="1" stop-color="#858b95"/></linearGradient>
<linearGradient id="cs" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#737982"/><stop offset=".28" stop-color="#d6dadf"/><stop offset=".44" stop-color="#ffffff"/><stop offset=".66" stop-color="#b7bcc4"/><stop offset="1" stop-color="#666c75"/></linearGradient>
<linearGradient id="cw" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#c4c8ce"/><stop offset=".4" stop-color="#ffffff"/><stop offset=".7" stop-color="#eceef0"/><stop offset="1" stop-color="#aeb3ba"/></linearGradient>
<linearGradient id="cr" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#7c0116"/><stop offset=".26" stop-color="#e3122d"/><stop offset=".42" stop-color="#ff7482"/><stop offset=".62" stop-color="#d90429"/><stop offset="1" stop-color="#6e0113"/></linearGradient>
<linearGradient id="cd" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#090a0b"/><stop offset=".28" stop-color="#3d4147"/><stop offset=".42" stop-color="#6a7078"/><stop offset=".64" stop-color="#232528"/><stop offset="1" stop-color="#060607"/></linearGradient>
<linearGradient id="rd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff4a5e"/><stop offset=".5" stop-color="#d90429"/><stop offset="1" stop-color="#96021b"/></linearGradient>
<linearGradient id="dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4e55"/><stop offset="1" stop-color="#131416"/></linearGradient>
<linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#d8e6f0"/><stop offset="1" stop-color="#a9bccb"/></linearGradient>
<radialGradient id="rub"><stop offset=".55" stop-color="#34373c"/><stop offset=".85" stop-color="#1b1c1f"/><stop offset="1" stop-color="#050506"/></radialGradient>
<radialGradient id="hub"><stop offset="0" stop-color="#7b8089"/><stop offset="1" stop-color="#2a2c30"/></radialGradient>
<radialGradient id="sh"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>"""


def P(r, deg, cx=200, cy=195):
    a = math.radians(deg)
    return f"{cx + r * math.cos(a):.1f} {cy + r * math.sin(a):.1f}"


def sector(r0, r1, a0, a1, cx=200, cy=195):
    big = 1 if abs(a1 - a0) > 180 else 0
    return (f"M{P(r1, a0, cx, cy)} A{r1} {r1} 0 {big} 1 {P(r1, a1, cx, cy)} "
            f"L{P(r0, a1, cx, cy)} A{r0} {r0} 0 {big} 0 {P(r0, a0, cx, cy)}Z")


def shadow(rx=135, cy=372, cx=200):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="13" fill="url(#sh)"/>'


def save(name, body):
    (OUT / f"{name}.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">{DEFS}{body}</svg>\n', encoding="utf-8")


# ---------- disc de frână cu etrier ----------
b = shadow(140)
b += '<circle cx="200" cy="195" r="152" fill="url(#st)" stroke="#6b7078" stroke-width="2"/>'
for r in (142, 131, 120, 109, 98):
    b += f'<circle cx="200" cy="195" r="{r}" fill="none" stroke="#000" stroke-opacity=".07" stroke-width="1.5"/>'
for i in range(30):
    b += f'<circle cx="{P(136 if i % 2 else 112, i * 12).split()[0]}" cy="{P(136 if i % 2 else 112, i * 12).split()[1]}" r="4.6" fill="#25272a"/>'
b += '<circle cx="200" cy="195" r="84" fill="#2b2d31"/><circle cx="200" cy="195" r="78" fill="url(#hub)"/>'
b += '<circle cx="200" cy="195" r="78" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>'
for i in range(5):
    x, y = P(50, i * 72 - 90).split()
    b += f'<circle cx="{x}" cy="{y}" r="9.5" fill="#0c0d0e" stroke="#9aa0a8" stroke-width="1.5"/>'
b += '<circle cx="200" cy="195" r="25" fill="#0c0d0e" stroke="#aab0b8" stroke-width="3"/>'
b += f'<path d="{sector(90, 170, -72, 8)}" fill="url(#rd)" stroke="#d90429" stroke-width="14" stroke-linejoin="round"/>'
b += f'<path d="{sector(158, 164, -66, 2)}" fill="#fff" fill-opacity=".35"/>'
b += f'<path d="{sector(112, 146, -50, -14)}" fill="#7c0116" fill-opacity=".55"/>'
for a in (-64, 0):
    x, y = P(130, a).split()
    b += f'<circle cx="{x}" cy="{y}" r="9" fill="url(#st)" stroke="#555" stroke-width="1.5"/>'
save("disc", b)

# ---------- plăcuțe de frână ----------
def pad(cy):
    s = f'<path d="{sector(118, 204, -127, -53, 200, cy + 9)}" fill="#7d838c"/>'
    s += f'<path d="{sector(118, 204, -127, -53, 200, cy)}" fill="url(#st)" stroke="#6b7078" stroke-width="1.5"/>'
    s += f'<path d="{sector(128, 194, -122, -58, 200, cy)}" fill="url(#dk)"/>'
    s += f'<path d="{sector(128, 136, -122, -58, 200, cy)}" fill="#000" fill-opacity=".35"/>'
    s += f'<path d="M200 {cy - 194} V{cy - 128}" stroke="#050506" stroke-width="5"/>'
    s += f'<path d="{sector(196, 204, -112, -68, 200, cy)}" fill="url(#rd)"/>'
    for a in (-124, -56):
        x, y = P(161, a, 200, cy).split()
        s += f'<circle cx="{x}" cy="{y}" r="6" fill="#d9dde2" stroke="#555"/>'
    return s
save("placute", shadow(125) + f'<g transform="rotate(-8 200 200)">{pad(292)}{pad(404)}</g>')

# ---------- filtru de ulei ----------
b = shadow(95)
b += '<rect x="128" y="84" width="144" height="262" rx="20" fill="url(#cr)"/>'
b += '<rect x="128" y="286" width="144" height="60" rx="20" fill="url(#cd)"/><rect x="128" y="286" width="144" height="26" fill="url(#cd)"/>'
for x in range(136, 268, 11):
    b += f'<rect x="{x}" y="292" width="4" height="46" rx="2" fill="#000" fill-opacity=".45"/>'
b += '<ellipse cx="200" cy="86" rx="72" ry="17" fill="url(#st)" stroke="#6b7078" stroke-width="1.5"/>'
b += '<ellipse cx="200" cy="86" rx="56" ry="12" fill="#17181a"/><ellipse cx="200" cy="86" rx="26" ry="6" fill="#55595f" stroke="#c9cdd3" stroke-width="2"/>'
for i in range(8):
    b += f'<ellipse cx="{200 + 42 * math.cos(i * math.pi / 4):.1f}" cy="{86 + 8.6 * math.sin(i * math.pi / 4):.1f}" rx="5" ry="2" fill="#6a7078"/>'
b += '<rect x="128" y="150" width="144" height="92" fill="#fff" fill-opacity=".95"/>'
b += '<path d="M168 168c-9 13-13 19-13 26a13 13 0 0 0 26 0c0-7-4-13-13-26z" fill="#d90429"/>'
b += '<rect x="192" y="174" width="62" height="9" rx="2" fill="#17181a"/><rect x="192" y="190" width="44" height="6" rx="2" fill="#8b919b"/><rect x="146" y="218" width="108" height="6" rx="2" fill="#c3c8cf"/>'
b += '<rect x="128" y="150" width="144" height="92" fill="url(#cd)" fill-opacity=".12"/>'
save("filtru-ulei", b)

# ---------- filtru de aer ----------
b = shadow(150, 350)
g = '<rect x="46" y="150" width="308" height="168" rx="16" fill="#7c0116"/>'
g += '<rect x="46" y="124" width="308" height="170" rx="16" fill="url(#rd)"/>'
g += '<rect x="66" y="142" width="268" height="134" rx="4" fill="#f5f1e6"/>'
for x in range(70, 330, 11):
    g += f'<rect x="{x}" y="142" width="5" height="134" fill="#000" fill-opacity=".14"/><rect x="{x + 5}" y="142" width="2" height="134" fill="#fff"/>'
g += '<rect x="66" y="142" width="268" height="40" fill="#fff" fill-opacity=".35"/><rect x="66" y="246" width="268" height="30" fill="#000" fill-opacity=".1"/>'
g += '<rect x="46" y="124" width="308" height="10" rx="5" fill="#fff" fill-opacity=".3"/>'
save("filtru-aer", b + f'<g transform="rotate(-7 200 210) skewX(-10) translate(36 0)">{g}</g>')

# ---------- ulei de motor ----------
b = shadow(105)
b += ('<path fill-rule="evenodd" fill="url(#cd)" d="M118 132h102l34-28h36v40h-14v196a18 18 0 0 1-18 18H136a18 18 0 0 1-18-18z'
      'M246 166a9 9 0 0 1 18 0v62a9 9 0 0 1-18 0z"/>')
b += '<rect x="134" y="94" width="58" height="38" rx="7" fill="url(#cr)"/>'
for x in range(140, 188, 8):
    b += f'<rect x="{x}" y="98" width="3" height="30" rx="1.5" fill="#000" fill-opacity=".3"/>'
b += '<rect x="134" y="170" width="98" height="150" rx="10" fill="url(#rd)"/>'
b += '<path d="M183 188c-12 17-17 25-17 34a17 17 0 0 0 34 0c0-9-5-17-17-34z" fill="#fff"/>'
b += '<text x="183" y="282" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="24" fill="#fff">5W-30</text>'
b += '<text x="183" y="304" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="13" fill="#fff" fill-opacity=".85">ULEI MOTOR · 5L</text>'
b += '<rect x="124" y="142" width="7" height="200" rx="3.5" fill="#fff" fill-opacity=".16"/>'
save("ulei", b)

# ---------- baterie ----------
b = shadow(150)
b += '<rect x="94" y="96" width="44" height="30" rx="6" fill="url(#cs)"/><rect x="262" y="96" width="44" height="30" rx="6" fill="url(#cs)"/>'
b += '<rect x="90" y="114" width="52" height="12" rx="3" fill="url(#rd)"/><rect x="258" y="114" width="52" height="12" rx="3" fill="#17181a"/>'
b += '<rect x="58" y="146" width="284" height="204" rx="14" fill="url(#dk)"/>'
b += '<rect x="50" y="122" width="300" height="44" rx="12" fill="#2c2f33"/><rect x="50" y="122" width="300" height="14" rx="7" fill="#fff" fill-opacity=".12"/>'
for i in range(6):
    b += f'<circle cx="{120 + i * 32}" cy="146" r="8" fill="#17181a" stroke="#4a4e55"/>'
b += '<rect x="58" y="206" width="284" height="92" fill="url(#rd)"/>'
b += '<text x="200" y="266" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="40" fill="#fff">12V · 70Ah</text>'
b += '<path d="M104 184h24M116 172v24M272 184h24" stroke="#fff" stroke-width="6" stroke-linecap="round"/>'
b += '<rect x="58" y="320" width="284" height="8" fill="#000" fill-opacity=".3"/>'
save("baterie", b)

# ---------- amortizor ----------
g = '<circle cx="200" cy="34" r="19" fill="none" stroke="url(#st)" stroke-width="11"/><circle cx="200" cy="34" r="19" fill="none" stroke="#6b7078" stroke-width="1"/>'
g += '<rect x="191" y="52" width="18" height="150" fill="url(#cs)"/>'
for i in range(7):
    y = 112 + i * 28
    g += f'<path d="M248 {y + 14}L152 {y + 28}" stroke="#7c0116" stroke-width="11" stroke-linecap="round"/>'
g += '<rect x="172" y="186" width="56" height="172" rx="10" fill="url(#cd)"/><rect x="172" y="196" width="56" height="8" fill="#000" fill-opacity=".4"/>'
for i in range(7):
    y = 112 + i * 28
    g += f'<path d="M152 {y}L248 {y + 14}" stroke="url(#rd)" stroke-width="13" stroke-linecap="round"/><path d="M160 {y - 2}L240 {y + 9.6}" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>'
g += '<rect x="146" y="98" width="108" height="14" rx="7" fill="url(#cd)"/><rect x="146" y="306" width="108" height="14" rx="7" fill="url(#cd)"/>'
g += '<circle cx="200" cy="372" r="18" fill="none" stroke="url(#st)" stroke-width="11"/>'
save("amortizor", shadow(120) + f'<g transform="rotate(24 200 200) translate(0 -4) scale(.95)">{g}</g>')

# ---------- bujie ----------
g = '<rect x="188" y="22" width="24" height="34" rx="7" fill="url(#cs)"/><rect x="184" y="52" width="32" height="10" rx="3" fill="url(#cs)"/>'
g += '<path d="M176 62h48l-6 112h-36z" fill="url(#cw)" stroke="#9aa0a8"/>'
for y in (78, 94, 110, 126):
    g += f'<rect x="174" y="{y}" width="52" height="7" rx="3.5" fill="url(#cw)" stroke="#9aa0a8" stroke-width=".8"/>'
g += '<rect x="180" y="150" width="40" height="9" fill="url(#rd)"/>'
g += '<rect x="160" y="174" width="80" height="46" rx="6" fill="url(#cs)" stroke="#666c75"/><path d="M186 174v46M214 174v46" stroke="#666c75" stroke-opacity=".6" stroke-width="1.5"/>'
g += '<rect x="166" y="220" width="68" height="11" rx="3" fill="url(#cd)"/><rect x="178" y="231" width="44" height="92" fill="url(#cs)"/>'
for y in range(238, 322, 9):
    g += f'<path d="M178 {y}l44 5" stroke="#4a4e55" stroke-width="2"/>'
g += '<rect x="195" y="323" width="10" height="20" fill="#9aa0a8"/><path d="M219 323v32h-24" fill="none" stroke="#7d838c" stroke-width="8"/>'
save("bujii", shadow(110) + f'<g transform="rotate(38 200 200) translate(0 8)">{g}</g>')

# ---------- ștergătoare ----------
def blade(x0, x1, y):
    c = (x0 + x1) / 2
    s = f'<rect x="{x0}" y="{y + 17}" width="{x1 - x0}" height="7" rx="2" fill="#070708"/>'
    s += f'<rect x="{x0 - 4}" y="{y}" width="{x1 - x0 + 8}" height="19" rx="9.5" fill="url(#dk)"/>'
    s += f'<rect x="{x0 + 12}" y="{y + 4}" width="{x1 - x0 - 24}" height="3" rx="1.5" fill="#fff" fill-opacity=".3"/>'
    s += f'<rect x="{c - 24}" y="{y - 14}" width="48" height="30" rx="6" fill="url(#cs)" stroke="#666c75"/><rect x="{c - 10}" y="{y - 6}" width="20" height="9" rx="2" fill="url(#rd)"/>'
    return s
save("stergatoare", shadow(150, 356) + f'<g transform="rotate(-22 200 200)">{blade(30, 370, 150)}{blade(70, 350, 236)}</g>')

# ---------- bec H7 ----------
b = shadow(80)
b += '<path d="M174 70a26 26 0 0 1 52 0v136h-52z" fill="url(#gl)" stroke="#8fa3b3" stroke-width="2"/>'
b += '<path d="M176 64a24 24 0 0 1 48 0v8h-48z" fill="#1b1c1f"/>'
b += '<path d="M190 206v-52l5-8 5 8 5-8 5 8v52" fill="none" stroke="#6b7078" stroke-width="2.5"/><path d="M190 146h20" stroke="#d90429" stroke-width="5" stroke-linecap="round"/>'
b += '<rect x="182" y="84" width="6" height="110" rx="3" fill="#fff" fill-opacity=".8"/>'
b += '<rect x="160" y="206" width="80" height="26" rx="5" fill="url(#cs)" stroke="#666c75"/>'
b += '<rect x="112" y="230" width="176" height="18" rx="9" fill="url(#cs)" stroke="#666c75"/><rect x="128" y="236" width="14" height="12" fill="#fff"/><rect x="258" y="236" width="14" height="12" fill="#fff"/>'
b += '<rect x="166" y="248" width="68" height="58" rx="6" fill="url(#cd)"/>'
b += '<rect x="176" y="304" width="14" height="52" rx="2" fill="url(#cs)"/><rect x="210" y="304" width="14" height="52" rx="2" fill="url(#cs)"/>'
save("bec", b)

# ---------- kit distribuție ----------
def pulley(cx, cy, r, teeth=True, hubred=True):
    s = ""
    if teeth:
        s += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#6b7078" stroke="#3d4147" stroke-width="6" stroke-dasharray="5 5"/>'
    s += f'<circle cx="{cx}" cy="{cy}" r="{r - 4}" fill="url(#st)" stroke="#6b7078"/>'
    for i in range(5):
        x, y = P(r * .56, i * 72 + 18, cx, cy).split()
        s += f'<circle cx="{x}" cy="{y}" r="{r * .17:.1f}" fill="#25272a"/>'
    s += f'<circle cx="{cx}" cy="{cy}" r="{r * .26:.1f}" fill="url({"#rd" if hubred else "#hub"})" stroke="#3d4147"/>'
    return s
b = shadow(150)
belt = "M118 62L296 84Q336 92 336 132L338 292Q336 340 290 340L140 344Q98 342 100 300L52 150Q50 62 118 62Z"
b += f'<path d="{belt}" fill="none" stroke="#131416" stroke-width="20" stroke-linejoin="round"/>'
b += f'<path d="{belt}" fill="none" stroke="#4a4e55" stroke-width="20" stroke-linejoin="round" stroke-dasharray="3 7" stroke-opacity=".7"/>'
b += f'<path d="{belt}" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="4"/>'
b += pulley(128, 150, 74) + pulley(290, 294, 42) + pulley(300, 130, 34, False, False) + pulley(146, 300, 38, False)
save("distributie", b)

# ---------- anvelopă cu jantă ----------
b = shadow(145)
b += '<circle cx="200" cy="195" r="162" fill="url(#rub)"/>'
b += '<circle cx="200" cy="195" r="154" fill="none" stroke="#000" stroke-width="15" stroke-dasharray="6 8"/>'
b += '<circle cx="200" cy="195" r="140" fill="none" stroke="#4a4e55" stroke-width="1.5"/><circle cx="200" cy="195" r="124" fill="none" stroke="#4a4e55" stroke-width="1"/>'
b += f'<path id="tw" d="M{P(131, 200)} A131 131 0 0 1 {P(131, 340)}" fill="none"/>'
b += '<text font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="13" fill="#8b919b" letter-spacing="3"><textPath href="#tw" startOffset="8%">205/55 R16 · 91H · M+S</textPath></text>'
b += '<circle cx="200" cy="195" r="114" fill="#0e0f10"/><circle cx="200" cy="195" r="110" fill="url(#st)"/><circle cx="200" cy="195" r="98" fill="#17181a"/>'
for i in range(5):
    a = i * 72 - 90
    for d in (-13, 13):
        b += (f'<path d="M{P(26, a + d * 1.6)}L{P(101, a + d - 4 * (1 if d > 0 else -1))}L{P(101, a + d + 4 * (1 if d > 0 else -1))}Z" '
              f'fill="url(#st)" stroke="#858b95" stroke-width="7" stroke-linejoin="round"/>')
b += '<circle cx="200" cy="195" r="103" fill="none" stroke="url(#st)" stroke-width="9"/><circle cx="200" cy="195" r="108" fill="none" stroke="#6b7078" stroke-width="1"/>'
b += '<circle cx="200" cy="195" r="34" fill="url(#st)" stroke="#858b95" stroke-width="2"/>'
for i in range(5):
    x, y = P(24, i * 72 - 54).split()
    b += f'<circle cx="{x}" cy="{y}" r="4.5" fill="#25272a"/>'
b += '<circle cx="200" cy="195" r="14" fill="url(#rd)" stroke="#7c0116"/>'
save("anvelopa", b)

# ---------- radiator ----------
b = shadow(150)
b += '<rect x="36" y="86" width="30" height="22" rx="5" fill="url(#st)" stroke="#6b7078"/><rect x="334" y="308" width="30" height="22" rx="5" fill="url(#st)" stroke="#6b7078"/>'
b += '<rect x="70" y="112" width="260" height="190" fill="#c7ccd2"/>'
for y in range(114, 302, 5):
    b += f'<path d="M70 {y}h260" stroke="#7d838c" stroke-width="1.6"/>'
for x in range(84, 330, 20):
    b += f'<rect x="{x}" y="112" width="4" height="190" fill="#5a5f66"/><rect x="{x + 4}" y="112" width="1.5" height="190" fill="#fff" fill-opacity=".6"/>'
b += '<path d="M70 112h120l-80 190H70z" fill="#fff" fill-opacity=".16"/>'
b += '<rect x="56" y="72" width="288" height="42" rx="12" fill="url(#dk)"/><rect x="56" y="300" width="288" height="42" rx="12" fill="url(#dk)"/>'
b += '<rect x="56" y="72" width="288" height="12" rx="6" fill="#fff" fill-opacity=".14"/>'
b += '<rect x="56" y="112" width="14" height="190" fill="#3d4147"/><rect x="330" y="112" width="14" height="190" fill="#3d4147"/>'
b += '<circle cx="124" cy="70" r="20" fill="url(#rd)" stroke="#7c0116" stroke-width="2"/><circle cx="124" cy="70" r="9" fill="#96021b"/>'
save("radiator", b)

# ---------- far ----------
b = shadow(150, 330)
b += '<path d="M40 166Q52 118 122 118H322Q372 118 360 186L338 262Q328 298 280 298H104Q50 298 42 232Z" fill="url(#dk)"/>'
b += '<path d="M62 172Q70 138 124 138H318Q348 140 340 184L320 256Q312 278 280 278H108Q70 278 64 232Z" fill="url(#gl)"/>'
b += '<path d="M62 172Q70 138 124 138H318Q348 140 340 184L336 198Q200 150 62 190Z" fill="#fff" fill-opacity=".55"/>'
for cx, r in ((140, 50), (248, 38)):
    b += f'<circle cx="{cx}" cy="208" r="{r}" fill="url(#st)" stroke="#3d4147" stroke-width="3"/><circle cx="{cx}" cy="208" r="{r - 9}" fill="#1b1c1f"/>'
    b += f'<circle cx="{cx}" cy="208" r="{r - 15}" fill="url(#gl)"/><circle cx="{cx - r * .22:.0f}" cy="{208 - r * .22:.0f}" r="{r * .16:.0f}" fill="#fff"/>'
b += '<path d="M82 262Q190 276 300 262" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M82 262Q190 276 300 262" fill="none" stroke="#8fa3b3" stroke-width="1"/>'
b += '<rect x="298" y="170" width="24" height="70" rx="9" fill="#f59e0b"/><rect x="302" y="174" width="6" height="62" rx="3" fill="#fff" fill-opacity=".5"/>'
save("far", b)

# ---------- disc de ambreiaj ----------
b = shadow(140)
b += '<circle cx="200" cy="195" r="158" fill="#2b2d31" stroke="#0c0d0e" stroke-width="3"/><circle cx="200" cy="195" r="150" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="3"/>'
for i in range(18):
    b += f'<path d="M{P(110, i * 20)}L{P(156, i * 20 + 6)}" stroke="#0c0d0e" stroke-width="5"/>'
    x, y = P(134, i * 20 + 12).split()
    b += f'<circle cx="{x}" cy="{y}" r="4" fill="#bfc5cc"/>'
b += '<circle cx="200" cy="195" r="108" fill="url(#st)" stroke="#6b7078" stroke-width="2"/>'
for i in range(6):
    a = i * 60
    x, y = P(64, a).split()
    b += f'<g transform="rotate({a + 90} {x} {y})"><rect x="{float(x) - 27}" y="{float(y) - 15}" width="54" height="30" rx="6" fill="#17181a"/>'
    b += f'<rect x="{float(x) - 23}" y="{float(y) - 11}" width="46" height="22" rx="11" fill="url(#rd)"/>'
    for k in range(-16, 20, 8):
        b += f'<path d="M{float(x) + k} {float(y) - 10}v20" stroke="#7c0116" stroke-width="2"/>'
    b += '</g>'
    x, y = P(94, a + 30).split()
    b += f'<circle cx="{x}" cy="{y}" r="5" fill="#55595f"/>'
b += '<circle cx="200" cy="195" r="36" fill="url(#hub)" stroke="#25272a" stroke-width="3"/>'
b += '<circle cx="200" cy="195" r="19" fill="#f6f7f8" stroke="#17181a" stroke-width="7" stroke-dasharray="4 3.5"/>'
save("ambreiaj", b)

print("ok", len(list(OUT.glob("*.svg"))), "ilustrații")
