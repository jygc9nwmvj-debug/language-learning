# Design System v0.1 — Buildable Specification

**Status:** BUILD SPEC  
**Direction:** modern digital product + editorial/book character

## Core visual rules
- Warm off-white base, near-black text, restrained accent; no default “China red”.
- Typography and Hanzi carry the visual identity; decoration is secondary.
- Focused learning content max-width around 720px; explanatory prose narrower.
- Spacing uses a small consistent scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Large Hanzi: responsive, roughly 72–160px.
- UI text: modern legible sans; Chinese uses a high-quality locale-correct CJK font.
- Optional serif only for editorial discoveries/quotations, never controls.
- No external font CDN in V0.1.

## Core components
- `PrimaryAction`: one dominant action when an explicit action is needed.
- `SecondaryAction`: quiet text/button.
- `HelpReveal`: progressive disclosure for Pinyin, translation, explanation, stroke order.
- `LearningStage`: stable central learning area that transforms between listen/read/write/speak states.
- `HanziDisplay`: large script-aware display.
- `AudioControl`: obvious, large enough to tap, no decorative waveform by default.
- `WritingCanvas`: generous area; pen/finger; paper switch secondary but visible.
- `FeedbackPanel`: calm diagnostic feedback, optional pitch/reference evidence.
- `DiscoveryCard`: editorial, optional, skippable.
- `SessionHeader`: quiet context/back/help; no gamified counters.

## Responsive
**Phone:** one column, nearly full-width writing area, no sidebars.  
**Tablet:** same hierarchy, more whitespace; two columns only when one task benefits.  
**Desktop:** focused learning column; paper mode naturally prominent for writing.

## Home A/B
Build the same Home information architecture twice:
- A: purely typographic.
- B: same screen plus one editorial/cultural image.

Judge focus, warmth, distinctiveness, travel-marketing feel, loading/offline cost and perceived quality.

## Session progress
Do not use fixed `3/12` if adaptive sessions change length. Test:
- approximate time remaining;
- subtle non-numeric progress line;
- or no progress indicator.

## Pinyin
Adaptive by default:
- introduction: show when useful;
- later: Hanzi first, Pinyin on help/tap;
- recall: hide if it reveals the answer.

## Motion
Only explanatory: stroke order, pitch contour, scaffold transitions. Respect reduced motion.

## Paper
A4 portrait; black/white fully usable; low ink; generous writing grids.
A worksheet is a writing session, not one page per character:
inspect → trace → reduced scaffold → free writing → recall → optional audio link/QR.
Group enough material to fill a page meaningfully.

## Prototype acceptance
- next action obvious;
- calm but not empty;
- Hanzi visually central;
- writing integrated;
- feedback non-judgmental;
- phone/tablet/desktop coherent;
- worksheet feels like same product;
- UI remains attractive without photography.
