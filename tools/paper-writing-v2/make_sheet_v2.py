"""Fixed A4 prototype iteration 2; v1 source and output are preserved. No app integration or learner-state access.

Run from any directory: python3 tools/paper-writing-v2/make_sheet_v2.py
Requires ReportLab; uses existing, unchanged Hanzi Writer vector data.
Override PAPER_FONT_REGULAR/PAPER_FONT_BOLD with embeddable TTF paths if needed.
"""
import json
import os
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/pdf/paper-writing-prototype-v2-a4.pdf'
DATA = ROOT / 'src/languages/mandarin/data'
FONT = '/System/Library/Fonts/Supplemental/'
pdfmetrics.registerFont(TTFont('Text', os.environ.get('PAPER_FONT_REGULAR', FONT + 'Arial.ttf')))
pdfmetrics.registerFont(TTFont('Strong', os.environ.get('PAPER_FONT_BOLD', FONT + 'Arial Bold.ttf')))
W, H = A4
INK, SECONDARY, EDGE, GUIDE = [colors.HexColor(x) for x in ('#252525', '#555555', '#888888', '#B8B8B8')]
OUT.parent.mkdir(parents=True, exist_ok=True)
c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1, invariant=1)
c.setTitle('Mandarin - Schreiben auf Papier | Paper Writing prototype v2')
c.setAuthor('Language Learning - isolated research prototype')
c.setSubject('Existing targets only; physical usability prototype, not validated instruction. Models: Hanzi Writer data 2.0.1 / Make Me a Hanzi / Arphic Public License.')
c.setViewerPreference('PrintScaling', 'None')

def text(x, top, value, size=10, bold=False, color=INK):
    c.setFillColor(color)
    c.setFont('Strong' if bold else 'Text', size)
    c.drawString(x * mm, H - top * mm, value)

def line(x1, y1, x2, y2, color=EDGE, width=.5, dash=None):
    c.saveState()
    c.setStrokeColor(color)
    c.setLineWidth(width)
    if dash:
        c.setDash(*dash)
    c.line(x1 * mm, H - y1 * mm, x2 * mm, H - y2 * mm)
    c.restoreState()

def grid(x, top, size=21, cross=True):
    c.setStrokeColor(EDGE)
    c.setLineWidth(.55)
    c.rect(x * mm, H - (top + size) * mm, size * mm, size * mm, fill=0)
    if cross:
        line(x + size / 2, top, x + size / 2, top + size, GUIDE, .4, (1.5, 2))
        line(x, top + size / 2, x + size, top + size / 2, GUIDE, .4, (1.5, 2))

def vector_path(d):
    """Render only the absolute M/L/Q/C/Z commands present in these fixed assets."""
    tokens = re.findall(r'[A-Za-z]|-?(?:\d*\.\d+|\d+)', d)
    p, i, current, start = c.beginPath(), 0, (0, 0), (0, 0)
    while i < len(tokens):
        cmd = tokens[i]
        i += 1
        assert cmd in {'M', 'L', 'Q', 'C', 'Z'}, f'Unsupported SVG command {cmd}'
        n = {'M': 2, 'L': 2, 'Q': 4, 'C': 6, 'Z': 0}[cmd]
        a = [float(v) for v in tokens[i:i+n]]
        i += n
        if cmd == 'M':
            p.moveTo(*a); current = start = tuple(a)
        elif cmd == 'L':
            p.lineTo(*a); current = tuple(a)
        elif cmd == 'Q':
            x0, y0 = current
            x1, y1, x2, y2 = a
            p.curveTo(x0 + 2*(x1-x0)/3, y0 + 2*(y1-y0)/3,
                      x2 + 2*(x1-x2)/3, y2 + 2*(y1-y2)/3, x2, y2)
            current = (x2, y2)
        elif cmd == 'C':
            p.curveTo(*a); current = tuple(a[-2:])
        else:
            p.close(); current = start
    return p

def model(key, x, top, size, gray=None, numbers=False):
    data = json.loads((DATA / (key + '.json')).read_text())
    pad = size * .10
    scale = (size - 2 * pad) * mm / 1024
    c.saveState()
    c.translate((x + pad) * mm, H - (top + pad) * mm - 900 * scale)
    c.scale(scale, scale)
    c.setFillColor(colors.Color(gray, gray, gray) if gray is not None else INK)
    for stroke in data['strokes']:
        c.drawPath(vector_path(stroke), stroke=0, fill=1)
    c.restoreState()
    if numbers:
        # Fixed manual label placement for the two selected models. The thin leader
        # ends at the canonical median start. Badges never replace a stroke.
        labels = {'ren': [(15, 1), (32, 13)],
                  'hao': [(7, 1), (-1, 8), (-1, 17), (25, 1), (34, 11), (34, 22)]}[key]
        for n, (dx, dy) in enumerate(labels):
            px, py = data['medians'][n][0]
            sx = x + pad + px * scale / mm
            sy = top + pad + (900 - py) * scale / mm
            bx, by = x + dx, top + dy
            line(bx, by, sx, sy, SECONDARY, .45)
            c.setFillColor(colors.white)
            c.setStrokeColor(SECONDARY)
            c.setLineWidth(.4)
            c.circle(bx * mm, H - by * mm, 2.15 * mm, fill=1, stroke=1)
            c.setFont('Strong', 9)
            c.setFillColor(SECONDARY)
            c.drawCentredString(bx * mm, H - by * mm - 3.05, str(n+1))

# Static current-practice targets only; no learner-state inference or delayed recall.
words = {}
for filename in ('lesson-001.json', 'buffer-d.json'):
    for word in json.loads((ROOT / 'src/languages/mandarin/content' / filename).read_text())['words']:
        words[word['id']] = word
for key, char, tone, meaning in [('ren', '人', 'ren2', 'Mensch'), ('hao', '好', 'hao3', 'gut')]:
    word = words[key]
    assert word['hans'] == word['hant'] == char
    assert word['toneNumbers'] == tone and meaning in word['meaning']['de']
    assert re.search(r"(?:'" + key + r"'|\b" + key + r"):\s*\{", (ROOT / 'src/languages/mandarin/writing-targets.ts').read_text())

text(16, 17, 'MANDARIN', 9, True, SECONDARY)
text(150, 17, 'PAPIERSTUDIE  /  02', 8.5, color=SECONDARY)
text(16, 31, 'Schreiben auf Papier', 25, True)
text(16, 41, 'Vier Schreibversuche pro Zeichen.', 10.5)
line(16, 49, 194, 49, INK, .8)

text(16, 62, 'Form aufbauen', 14, True)
text(167, 62, 'Jetzt erinnern', 10, True)
text(16, 71, 'Strichfolge vorher ansehen. Dann zeilenweise arbeiten.', 9.5, color=SECONDARY)
text(19, 83, 'Vorlage', 9, True)
text(63, 83, '1  Nachziehen', 8.5, True)
text(95, 83, '2  Abschreiben', 8.5, True)
text(127, 83, '3  Ohne Kreuz', 8.5, True)
text(171, 83, '4  Erinnern', 8.5, True)

for key, top, caption, cue in [('ren', 95, 'rén  ·  Mensch', 'Mensch'),
                                ('hao', 175, 'hǎo  ·  gut', 'gut')]:
    model(key, 19, top-2, 34, numbers=True)
    grid(65, top)
    model(key, 65, top, 21, gray=.74)
    grid(97, top)
    grid(129, top, cross=False)
    grid(173, top, cross=False)
    text(19, top + 37, caption, 11)
    text(173, top + 29, cue, 9, color=SECONDARY)

# Opaque cover goes over all content to the left, including the learner's ink.
# The meaning cue and final square remain visible; there is no answer strip.
line(161, 78, 161, 216, GUIDE, .5, (2, 3))
text(16, 235, 'Vor Feld 4: links der Linie alles abdecken, auch die eigenen Zeichen.', 9.5)
text(16, 242, 'Danach aufdecken und vergleichen.', 9.5)
line(16, 269, 194, 269, EDGE, .5)
text(16, 278, 'A4  ·  100 %  ·  einseitig', 8.5, color=SECONDARY)
text(135, 278, 'Prototyp v2  ·  21-mm-Felder', 8.5, color=SECONDARY)

c.showPage()
c.save()
print(OUT)
