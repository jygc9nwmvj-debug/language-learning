# Mobile Learning Experience V2 — isolated implementation

**Nachtrag 2026-10-20:** Der anschließende Implementierungsauftrag hat Oberfläche, Feedback, bestehendes Matching und einen Dialog aus bestehendem Inhalt wieder freigegeben. Ergebnis: [IMPLEMENTATION_RESULT.md](IMPLEMENTATION_RESULT.md). Der folgende ursprüngliche Plan bleibt als Historie erhalten; insbesondere seine Getränkeinhalte und Audiofreigabe gelten weiterhin nicht als genehmigt.

**PAUSIERT / VORLÄUFIG:** Kurskorrektur vom 2026-10-20. Keine weiteren Synthesen, Manifestintegration, Implementierung oder Veröffentlichung bis zur redaktionellen Freigabe. Tatsächlicher Bestand und vorgeschlagener Lehrplan: [CURRICULUM_REVIEW.md](CURRICULUM_REVIEW.md). Die folgenden Abschnitte dokumentieren den ursprünglichen Implementierungsplan, keine abgeschlossene Prüfung.

2026-10-20 · feature/mobile-learning-v2 · baseline main f7fbfdb (production install access 513fbe0).
No merge/deployment until explicit approval. Existing IDs, evidence and backup version 2 remain.

## Unit plan before authoring

**Outcome:** order a cup of tea at a Taiwan drink counter, understand hot/iced alternatives and a quoted price, respond politely. Existing coverage is introductions, repair, social responses, nationality and numbers, not purchasing.

**12 whole learning objects:** tea, water, cup/classifier, want (order), hot, iced; “I would like a cup of tea”, “Hot or iced?”, “Iced, thank you”, “Hot, thank you”, “How much?”, “Thirty dollars”. Reuse 我、一、是、三、十、謝謝、不客氣. New words introduced as whole objects before phrases; phrase component glosses do not introduce independent character knowledge. No new writing targets.

**Prerequisite graph:** existing 我/一 before drink objects; new whole vocabulary before order; hot/iced before alternatives; corresponding expressions before dialogue; existing 三/十 before price. New encounters remain ordinary candidates using existing quotas, IDs and scheduling. No arbitrary quota increase.

**Dialogue:** customer orders → clerk asks temperature → customer chooses iced → customer asks price → clerk quotes thirty Taiwan dollars → thanks → welcome. Hear all first without translation, interpret each turn using curated German answer variants, revisit all in context, then choose an appropriate reply to the temperature question. Both hot and iced accepted; price/thanks distractors deliberately unsuitable. Translation/meaning events are own guided dialogue evidence, never independent spoken production or mastery. No automatic speech grading. Each completed turn persists atomically, as do playback completion and phase transitions; reload reconstructs the same progression.

**Matching:** extend existing engine with curated early two-item sets and Pinyin↔Hanzi; require deliberate whole-item meaning/script/sound introduction. Pinyin recognition is notation/form association, not tone knowledge. Existing matching events retain recognition-only semantics. Boundary offers never consume regular seven-task budget or displace repairs/transfer/paper.

**Mobile:** shared viewport observes visualViewport height/offset and safe areas. Each normal state is composed into fitting consecutive panels when necessary; no page overflow clipping, no font shrinking to unreadability. Essential response/feedback and primary action stay together. Extra reference/help uses separate panels. Tone teaching split one tone at a time; writing canvas sized by available space. Extreme accessibility/keyboard combinations require additional meaningful panels rather than concealed content.

**Correction:** restrained accessible red only for known erroneous supplied form, adjacent model; neutral correct parts, explicit missing/extra markers if unique alignment. Sentence meaning answers use whole-answer comparison; no invented word-level German correction. Existing evaluator/mastery rules unchanged.

## Baseline and diagnostic boundary

Served production HTML SHA-256 6a4337646f57c93d44e82d5aa1c1684b6c0b455495ea800c60b8c4899135f88f; worker 1cb9e501166e17dd256bb1a79675a5c1c54368eb7dd8c5d16353b4d19cf1bad1. Baseline build matched both served files byte-for-byte before implementation.
No learner export supplied/found in the provided project attachments/download export search. 38 introduction presentations is not 38 distinct whole items or proof of complete dimension introduction. Baseline has 36 items. Individual exhaustion vs blocked progression remains unverified. Synthetic reachability tests can establish graph/selection behavior only. No scheduler defect assumed; scheduler source is preserved.

## Language/source boundary

Authored Taiwan-compatible context, not native-reviewed content. Cup classifier/ordering contextual reference: National Taiwan University Chinese teaching drink-bar example https://homepage.ntu.edu.tw/~ntutcsl/affair/%E6%96%90%E7%91%84%E7%9A%84%E7%B6%B2%E9%A0%81/drink.html . Ministry of Education dictionary entries 杯 https://dict.concised.moe.edu.tw/dictView.jsp?ID=459&la=0&powerMode=0 and 冰 https://dict.concised.moe.edu.tw/dictView.jsp?ID=1737&la=0&powerMode=0 . Standard canonical Pinyin retained separately from explicit 一 sandhi in speech. 塊 means colloquial currency unit in this context, not a new universal fixed price. Polly reference voice remains mainland Mandarin; Taiwan-compatible wording does not imply Taiwan accent/native review. Native language/audio sign-off remains a release limitation.

## Verification contract

Structural coverage exhaustive for new items, task assessment declarations, dialogue turns/answer sets, prerequisites and matching sets. Browser coverage representative across fresh/existing, 320/390 and desktop, reduced-height keyboard model and 150–200% text, Chrome/WebKit. Emulation is not physical Safari keyboard/PWA certification. Planned: export/import and preservation of ordinary evidence. Not yet tested at the pause; no live learner storage touched.
