# UI / Design Direction v0.1

**Status:** DESIGN SPEC / to be validated in prototype

## 1. Visual direction

**High-quality modern digital product with editorial/book character.**

The interface should feel:
- functional
- calm
- warm
- precise
- friendly
- self-explanatory
- typographically strong
- contemporary without trend-chasing

It should not feel:
- gamified
- childish
- sterile SaaS
- pseudo-Asian
- decorative for decoration's sake
- like a dense language textbook

Chinese itself is a primary visual element. Large Hanzi can provide character without illustration.

---

## 2. Eight UI principles

### 1. One clear learning intention at a time
Every state should make the next mental action obvious.

This is not a rule that only one element may appear on screen. Related information may coexist when it supports the same learning act.

### 2. Click-light, not control-light
The engine makes routine decisions.

Default path:
`Open → Continue learning → session`

Do not force users to choose listening/writing/vocabulary/review modes before every session.

### 3. Progressive disclosure
Show Pinyin, translation, explanations and controls when useful; remove them when they would prevent recall.

Help remains available without dominating the screen.

### 4. Content provides personality
Hanzi, language discoveries, elegant motion, dry microcopy and occasional humor provide delight.

No confetti, mascots, coins, streak pressure or decorative mini-games.

### 5. Typography before decoration
Hierarchy, whitespace and excellent Chinese typography do most of the visual work.

### 6. Digital and paper are peers
Paper mode is not a fallback. The visual system must extend naturally into printable worksheets.

### 7. Feedback is calm and diagnostic
No giant red failure state.

Prefer:
`Your second syllable stayed almost level. Try a clearer rise.`

### 8. Accessibility is structural
Large touch targets, scalable text, keyboard access where relevant, reduced-motion support, no color-only meaning, paper alternative for writing.

---

# 3. Navigation model

## Home
Primary action:
**Continue learning**

Secondary:
- Lessons
- Progress
- Settings

Do not present a dashboard of modes.

## During learning
Navigation largely disappears.

Persistent but quiet:
- back/close
- optional help
- subtle session orientation

## Lesson library
Allows deliberate browsing/repeating, but is not the normal daily workflow.

---

# 4. Screen/state wireframes

These are information-architecture wireframes, not final visual layouts.

## A. Home

```text
┌─────────────────────────────────────┐
│                                     │
│  Mandarin                           │
│                                     │
│  Continue learning                  │
│  Asking simple questions            │
│  about 14 min                       │
│                                     │
│  [ Continue ]                       │
│                                     │
│  3 things ready for a quick review  │
│                                     │
│                                     │
│  Lessons      Progress      Settings│
└─────────────────────────────────────┘
```

No XP. No streak. No global mastery percentage.

Possible later line:
`Last time: you learned to say your name.`

---

## B. Core learning state

Example: introducing 好.

```text
┌─────────────────────────────────────┐
│ Lesson 1                         ··· │
│                                     │
│                                     │
│                 好                  │
│                                     │
│                hǎo                  │
│                good                 │
│                                     │
│                 ◉                   │
│              listen                 │
│                                     │
│                                     │
│              [ Continue ]           │
└─────────────────────────────────────┘
```

Depending on learning state, Pinyin or meaning may initially be absent.

Tapping/explicit help can reveal support.

---

## C. Writing state

```text
┌─────────────────────────────────────┐
│ 好                              ?    │
│ hǎo · good                          │
│                                     │
│        ┌───────────────────┐        │
│        │                   │        │
│        │     writing       │        │
│        │       area        │        │
│        │                   │        │
│        └───────────────────┘        │
│                                     │
│  Show stroke order                  │
│  Write on paper instead             │
│                                     │
│              [ Done ]               │
└─────────────────────────────────────┘
```

The writing area should be generous.

On tablet, it can be much larger without adding more controls.

On phone, content stacks vertically.

---

## D. Feedback / pronunciation

```text
┌─────────────────────────────────────┐
│  hǎo                                │
│                                     │
│      reference   ───╮___            │
│      yours       ─────╮__           │
│                                     │
│  Your tone stayed low for too long. │
│  Let the rise begin a little sooner.│
│                                     │
│  [ Try again ]        Continue      │
└─────────────────────────────────────┘
```

No pseudo-precise `72% pronunciation score`.

If analysis confidence is low:
`I’m not confident enough to judge that one. Listen and compare.`

---

## E. Discovery state

Example: 馬.

```text
┌─────────────────────────────────────┐
│  A small discovery                  │
│                                     │
│                 馬                  │
│                                     │
│       [historical form]             │
│                                     │
│  Early forms of 馬 were pictorial:  │
│  they represented a horse.          │
│                                     │
│  This is optional. Nothing to       │
│  memorize here.                     │
│                                     │
│              [ Continue ]           │
└─────────────────────────────────────┘
```

Discovery cards should feel editorial, almost like a beautiful marginal note in a book.

They remain skippable.

---

# 5. Paper / worksheet design

## Principle
A worksheet is a **writing session**, not one page per character and not a screenshot of the app.

The engine groups enough appropriate material to fill an A4 page meaningfully.

Example:
`Writing Sheet 01 — Lessons 1–3`

## A4 structure

```text
┌────────────────────────────────────────────┐
│ MANDARIN · WRITING 01                      │
│                                            │
│ 好  hǎo  good                              │
│ stroke order →                             │
│                                            │
│ [trace] [light trace] [   ] [   ] [   ]    │
│                                            │
│ 我  wǒ  I                                  │
│ ...                                        │
│                                            │
│ ─────────────────────────────────────────  │
│ RECALL                                     │
│                                            │
│ hǎo → [        ]                           │
│ “I” → [        ]                           │
│                                            │
│ Listen → write                             │
│ [QR/link to audio session]                 │
└────────────────────────────────────────────┘
```

Progression on paper:
1. inspect
2. trace
3. weaker scaffold
4. free writing
5. delayed/sectioned recall
6. optional audio-to-writing

Older characters can return on later worksheets without a model, implementing spacing on paper.

## Print rules
- A4 first
- black/white must remain fully usable
- no ink-heavy backgrounds
- generous writing grids
- excellent Hanzi print rendering
- QR optional, never required for the worksheet itself
- same typography/hierarchy as web app

---

# 6. Typography

Two roles:

## UI / explanatory text
A highly legible modern sans serif with a warm, editorial character.

## Chinese
A high-quality CJK typeface selected for:
- correct glyph forms for the chosen locale/script
- clarity at learning sizes
- beauty at display sizes
- distinction of relevant stroke forms

Do not select final fonts before real-device rendering tests.

Avoid pseudo-calligraphic UI fonts.

---

# 7. Color

Do not choose final palette yet.

Direction:
- warm off-white / paper-like neutral base
- near-black text
- one restrained primary accent
- secondary functional colors only where meaning requires them
- tone visualizations may use distinguishable colors, but color cannot be the only encoding

Avoid default “China red” branding unless later justified by the identity.

---

# 8. Motion

Use motion only when it communicates:
- stroke order
- reveal/scaffold removal
- pitch contour
- state transition

No decorative bouncing or reward animation.

Respect `prefers-reduced-motion`.

---

# 9. Microcopy / tone

Short, adult, lightly human.

Good:
`Listen once before you speak.`
`That sounded closer to “scold” than “horse”. Useful distinction.`

Avoid:
`Amazing!!! You crushed it! +20 XP`

Humor is occasional, dry and content-driven.

---

# 10. What to test in the first UI prototype

1. Is the next action always obvious?
2. Is the interface calm without feeling empty?
3. Are Hanzi large enough to become visually memorable?
4. Does Pinyin support rather than dominate?
5. Does writing feel native to the page rather than like a bolted-on tool?
6. Is paper mode easy to discover without distracting screen writers?
7. Does feedback feel informative rather than judgmental?
8. Does the design work equally well on phone, tablet and desktop?
9. Does the worksheet feel like the same product?
10. Does at least one moment feel delightful without gamification?
