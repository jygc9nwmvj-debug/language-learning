# Internationalization / English v0 — Lab audit

2026-09-29. **Recommendation: GO for review of this architecture and isolated preview; NOT YET for an English release.** The existing canonical identity model is suitable. Separate presentation and answer-set policy before production work; no parallel English curriculum is needed.

**Current status: RESEARCH DONE; English production not approved.** One Mandarin canon, a localized presentation layer, language-independent learner state and separately reviewed locale-specific meaning-answer sets are the proposed boundary. Current production still uses its existing mixed DE/EN answer list; this proposal is not deployed.

Preserved from local `lab/english-v0` commit `e49b931`. Prototype, screenshots, inventory and validators remain in the separate `i18n-lab/tools/i18n-lab/` checkout (see [branch inventory](ROADMAP.md#branch-and-working-tree-inventory)). Counts and behavior below describe the original `acfa249` audit, not a fresh inventory of corrected production. No prototype code is copied to main.

## 1. Original audit baseline and scope (historical)

Fetched remote `main` and original local `main` are `acfa24938a4d516942f8deface61f8e29fd3c9c4`. The desktop checkout is dirty with unrelated production, pronunciation and personal-name work. The Lab uses a separate clone of committed main on `lab/english-v0`; none of those working changes is included or modified. The clone's `src/`, `public/`, production scripts, package files and architecture contract are unchanged.

Read: `LEARNING_ARCHITECTURE.md`, `PRODUCT_OBSERVATIONS.md` (empty at that original baseline; now populated on main), research index, executable content schema and its documentation, answer policy, Product UI v1, F-light, current Mandarin content/derivation, introduction, phrase exploration, exercises, answer interpreter, writing-target descriptions, session/continuous planning, backup/restore and event classification. Historical schema sketches are not treated as implemented code.

The [meta-learning note at 02b7922](https://github.com/jygc9nwmvj-debug/language-learning/blob/02b7922163dacd0f7bc9475829763b1d1bcd5374/docs/research/meta-learning.md) was consulted. Its knowledge is now preserved in [the canonical meta-learning note](research/meta-learning.md). Paper prototypes remain on `research/paper-writing-v2`; neither branch is merged here. This task performs a repository audit, not a new literature review or deployment audit.

## 2. German dependency inventory

The machine-readable inventory lists exact structured content paths and a syntax-aware source-string candidate list with file/line locations. Counts are reproducible from this baseline. UI candidates still require editorial classification; they include a few diagnostics and exclude some single-word/dynamic fragments. They are not a promise of exact final translation-key count.

| Layer | Baseline quantity / location | Work required |
| --- | --- | --- |
| A. Central UI catalogue | **92 keys**, `src/core/i18n/de.ts` | English catalogue; separate generic controls from Mandarin instructional/worksheet copy currently mixed into this file. |
| A/B. Hard-coded surface strings | **155 occurrences / 131 distinct candidates**, in app, exercise/audio/writing components, interpreter and writing-target definitions | Extract semantic keys; merge genuine duplicates, retain contextual differences and accessibility labels. Combined with the catalogue, budget roughly **200–225 messages** before editorial consolidation, not 223 guaranteed unique UI keys. |
| B. Meaning arrays | **44 word + 13 phrase-level sets per locale**; **99 DE / 64 EN alternatives** | English already exists for all 57 authored meaning locations. Review contextual accuracy and accepted-answer semantics; this is not a missing-English translation count. |
| B. Explanatory content | **28 learning notes, 2 discoveries, 2 tone notes, 17 unit glosses, 6 character notes** | **55 logical fields** needing localization, some containing several prose/reference-gloss fragments. Review metadata is not learner copy. |
| B. Task prompts | **29 authored prompts; 131 resolved tasks, all without EN prompts** | Localize authored prompts and generated templates, not 131 copied tasks. Generated copy is in `content/index.ts`. |
| D. Canon | **44 words, 36 items, 131 tasks** | Preserve IDs, forms, tones, segmentation, dimensions, eight Writing Targets and referenced audio. |
| E. Personal data | `preferences/name`, canonical `slot: name` | Translate labels and surrounding text, never the learner's name or its identity. |

**A — UI:** navigation, action verbs, loading/offline/storage errors, audio/recording states, accessible labels, backup/restore/reset wording. German lives both in `ui` imports and inline JSX/strings. `src/main.tsx` also has a German unavailable-test-page message outside the inventory's main surface scope. Diagnostics need triage rather than automatic translation.

**B — localized content:** meaning arrays, communicative cues, contextual phrase glosses, tokenized explanations, tone guidance, Writing stage titles/instructions and print copy. The current English meaning arrays are the beginning of localization, not a complete English interface. Meta-learning has research proposals only, no production copy library to translate.

**C — assessment coupling:** detailed below. **D — non-localizable:** Hanzi in both scripts, canonical/explicit surface tones, Pinyin and syllables, lexical references/segmentation, role/dimensions, stable item/task IDs, writing-stage IDs/geometry and audio references. **E — personal:** profile name, free reflections, user answers and recordings are user data, not catalogue entries.

## 3. Concrete coupling and assessment findings

| Source | Current behavior | Proposed boundary |
| --- | --- | --- |
| `schema/content.ts`, final transform | `item.meaning` selects first DE/EN display gloss; `item.answers` concatenates **all DE and EN** alternatives. | Display gloss and accepted meaning answers must be distinct, locale-scoped editorial fields. Do not translate a display label and silently treat it as an answer set. |
| `components/Exercise.tsx`, `check()` | Read/listen compare normalized typed input against the mixed answer list. A German UI can already accept English. A non-match becomes failure; feedback always gives German meaning. | Preserve current production behavior during this Lab. Future locale-specific meaning assessment needs explicit policy and answer-set version; a plausible unlisted paraphrase is not proof of missing Mandarin knowledge. |
| `answer.ts` | Mandarin/Pinyin interpretation is already mostly independent of German, including an open name slot. It returns German correction prose for missing names; `answerFeedback()` emits German sentences. | Return semantic diagnostic codes/parameters separately from localized feedback. Reuse Mandarin parsing, tone declarations and construction rules. Do not parse translated correction strings to make decisions. |
| `content/index.ts` | Derived task prompts interpolate `meaning.de` at module evaluation. | Store prompt key + canonical item reference, resolve the localized cue at render time. Keep task IDs, scheduling and assessment declaration identical. |
| `LessonRunner.tsx`, introduction/phrase/hybrid components | `.prompt.de`, `.meaning.de` and unlocalized notes are rendered directly. | Presentation accessor receives `uiLocale`; no locale input to curriculum/identity functions. |
| `writing-targets.ts` | German stage titles/instructions sit beside stage IDs, opacity and movement parameters. | Localize text by stable target/stage reference, leave all mechanics and eligibility untouched. |
| `LessonRunner.tsx`, reflection | Stores `rating: r` where `r` is a German button label such as “Passend”. | Future events should use stable codes plus localized labels. Historical strings stay intact; any reporting bridge must explicitly recognize legacy values. Not a scheduler reset or rewrite. |
| `normalizeText()` | Uses host-default `toLocaleLowerCase()` and limited punctuation normalization. | Specify normalization independently of UI locale; review English apostrophe variants, punctuation and paraphrases explicitly. Do not silently change historical scoring. |

For **Mandarin from a DE/EN cue**, assess the identical canonical target with the identical declared tone/construction rules. The preview directly calls the existing interpreter. An open name is checked as a supplied name after the Mandarin frame, not as memorized Mandarin vocabulary and not as equality with a profile name.

For **meaning in DE/EN**, author `meaningAnswers[locale]` separately. Example: 不客氣 is “you're welcome” in this context, not English “please” merely because German accepts “bitte”. The preview's reviewed-by-author draft sets accept named variants. Unknown wording yields **unlisted / unsure**, not a confident Mandarin failure. This is an isolated assessment-model proposal, not an authorized production grading change. Its task modes never write scheduling evidence.

Meaning-result context retains the language used when the answer was checked even after a UI switch; subsequent display glosses may change language. Do not regrade an old answer against the new language's list. For future ambiguous results, either use an explicitly unscored comparison or design a constrained canonical-ID selection task; replacing typed tasks is a later decision, not done here.

## 4. Smallest proposed architecture and schema

Keep the existing Mandarin canon and stable references. Extend its current localized meaning precedent into a small typed catalogue/locale overlay. The Lab overlay contains only presentation fields keyed by existing IDs; canonical references are consumed read-only from the real content module. There are no `*-en` items, duplicate sessions or language-specific audio.

```ts
// Conceptual production contract, not a new production schema.
type UiLocale = 'de' | 'en';
type LocalizedItem = {
  status: 'missing' | 'draft' | 'reviewed';
  meaning: string;                 // display gloss in this context
  meaningAnswers: string[];        // separately reviewed, when assessed
  toneNote?: string;
  note?: Explanation;             // localized prose + unchanged canonical word refs
  discovery?: Explanation;
  units?: {                       // aligned to existing canonical units
    gloss: string;
    characters?: { index: number; note: string }[];
  }[];
};
// canon.items[id] stays unique; localization.items[id].de / .en
// UI catalogue: semantic key -> locale text/template + typed parameters
// Task: same ID; promptKey + { itemId }, never baked-in German meaning
// Diagnostic: stable code + Mandarin/token parameters, localized at presentation
// Preference: uiLocale, separate from script and from relations/history
```

An overlay indexed by the unchanged unit order is sufficient for v0; validation must enforce exact coverage and character indices. Later canonical segmentation edits must invalidate/review those aligned translations. Adding persistent unit IDs is not needed for six static examples. Tokenized explanation references preserve their word sequence; prose can use natural target-language syntax around those references.

Do not include `hant`, `hans`, Pinyin, tones, audio or introduction dimensions in a translation record. Derive them from the canon. A small accessor and paired DE/EN message catalogues suffice; no translation service, locale framework, copied course tree or new tutorial state machine is introduced.

## 5. Learner state, scripts, backup and F-light

`objectFor()` is `cmn:item` for nonvisual relations and `cmn:item:script` for reading/writing. Relation IDs add the existing target. Introduction evidence includes canonical item, tone numbers, version, dimensions and (for visual evidence) script/form. Session plans contain task IDs. **UI locale belongs in none of these keys.** Switching it must not reconstruct a session, bump introduction/content versions, replay an introduction, reschedule a task or mark knowledge new.

The baseline defaults to **Traditional (`hant`)** and already has a Traditional/Simplified preference, disabled while a session is active. Explicit form pairs are validated. This Lab fixes `hant` for display and adds no script switcher. UI English does not imply Simplified, Traditional does not imply a Taiwan pronunciation policy, and canonical/surface-tone handling remains unchanged. A future script change may legitimately interact with script-specific evidence; that is distinct from switching learner language.

Backup version 2 already stores arbitrary string preferences, so a future `uiLocale` row fits structurally without a progress migration. The actual importer merges newer relations/sessions, deduplicates events by ID and retains an existing preference. Thus an existing local locale currently wins over an imported one; changing that behavior would require a separate explicit decision. Legacy backups with no locale remain valid; production default is **open**, with current German users' experience preserved during any later rollout.

The Lab has one in-memory synthetic state and a separate namespaced browser locale preference. It never imports production `db.ts` in the browser, opens production IndexedDB, reads user backups, registers a service worker or writes F-light events. The Node fixture test uses `fake-indexeddb` and the **actual** backup import/export functions; that process-local fake store cannot access the user's browser database.

Future F-light may add `answerLocale` / `answerSetVersion` to locale-dependent meaning attempts, and optionally `uiLocale` as minimal context. No second history, translated event type or new relation identity. Locale switching itself need not emit a learning event. Existing missing context stays unknown, not guessed from later preferences. Existing reflection text remains personal data. No names, answers or recordings should be added to routine locale logs.

## 6. Personal name status and preview limit

Committed main already supports `slot: name`, local `preferences/name` and an open-slot interpreter. A **separate uncommitted** desktop fix adds `PersonalNameGate`, stronger local name restoration and frame-only reference-audio paths. Its existence was inspected, not copied, committed or declared deployed here. The baseline name audio is therefore not assumed safe as a generic unnamed frame.

The preview uses the synthetic name **Alex**, permits local editing, escapes it as text and preserves it across DE/EN. It does not translate or send it to a speech service. Reference playback for the name-slot example is deliberately blocked and explained. Existing audio for the other examples is served unchanged. Production English release must resolve the separate name/audio work on its own merits; localization must not smuggle that fix into this branch.

## 7. Representative English drafting and Taiwan review

Six existing items: **你好, 好, 請說慢一點, 對不起, 不客氣, 我叫**. The preview includes start/continue, introduction, tone and Hanzi focus, phrase exploration, Mandarin recall, meaning recall, feedback, speaking/recording, free writing, a tokenized explanation, name expression and a stopping point. It is a navigable surface harness, **not the production lesson runner or a new learning sequence**.

The 70 paired Lab UI keys and English content are careful editorial drafts, not a bulk translation or a native-reviewed release. Mandarin context governs the drafts: please speak **more slowly** as a polite request; apology versus a generic “excuse me”; “you're welcome” versus invitation “welcome” or request “please”; a name frame with an open slot; lexical third-tone notation versus the spoken greeting; surface bú before kè in 不客氣. These are existing canonical content contexts, not curriculum changes. Current lexical versus surface Pinyin is retained, not silently rewritten.

An English-reading Mandarin reviewer in Taiwan can meaningfully review this subset's forms, glosses, notes, prompts, feedback and most existing reference audio through normal English surfaces. It is **not sufficient for a full-course review**: only six items are drafted, name audio is blocked, remaining explanations are untranslated, and complete production interaction/recording/writing parity has not been claimed. No Native Review Mode, annotations or remote reviewer access is built. The preview is loopback-only and cannot be shared by sending its localhost URL.

Future just-in-time explanations use stable concept IDs with DE/EN copy and one language-independent shown/help state if later implemented. Switching locale must not make a concept newly taught or create extra learning evidence. The [meta-learning research](https://github.com/jygc9nwmvj-debug/language-learning/blob/02b7922163dacd0f7bc9475829763b1d1bcd5374/docs/research/meta-learning.md) remains the prerequisite; linguistic facts, learning evidence, product rationale and hypothesis stay separate. **No meta-learning feature is implemented.**

## 8. Authoring, completeness and fallback policy

Required at canonical authoring: unique ID, Mandarin forms/tones/words/segmentation, dimensions, existing audio references and assessment target. Required for the current German release: complete reviewed DE presentation. English can be explicitly `missing` or `draft` while editorial work proceeds, rather than blocking every German content addition. To enable **production English**, every reachable required UI string, prompt, cue, feedback and explanation must be reviewed in EN, along with applicable answer sets. Optional explanations need explicit coverage/status too; do not silently lose useful teaching information.

Separate editorial locale status/revision from canonical learning identity and existing whole-content QA status. Correcting an English wording typo does not reset Mandarin introduction. Changing the meaning of an item or a tested distinction is a different content decision. New or changed source semantics should mark corresponding translations stale; a future validator can compare a recorded source revision. No second curriculum version should be used as a shortcut for locale revision.

**Preview policy:** six explicitly covered items, fail-fast on missing required EN text; no silent German fallback. An unsupported extra hint can be explicitly unavailable in the selected language. The subset's canonical notes are required by the prototype validator, so none disappears silently. Missing new items must not become selectable without localization. **Release policy:** fail validation for incomplete required reachable English; intentionally optional unavailable content can only be omitted by an explicit editorial decision and transparent UI. A hidden DE fallback is not an English release.

The prototype validator checks UI key parity, missing locale/items, editorial status, orphan/forbidden fields, localized note and tone-note coverage, meaning answer sets, exact exploration/character-note coverage and canonical word-reference preservation. Injection of canon fields or structural references into the locale overlay fails. A release check deliberately fails both draft status and full-course coverage. Existing production schema/audio integrity checks would remain authoritative later; this task does not rerun their broad QA.

## 9. Validation, layout and remaining work

**Completed:** five focused Node tests; 44 browser surface checks (11 states × DE/EN × 320/390 px), plus locale switching with a retained input/result context. Existing scheduler output and writing introduction survive preference changes in fixtures. Actual backup v2 import/export preserves fixture relations, sessions and events; existing-preference merge behavior is tested. Negative validator cases cover missing/orphan locale content, absent answer sets, missing explanations, altered reference structure and duplicated canonical fields. Browser checks find no horizontal overflow, clipped surface buttons or sub-44-pixel controls in these states, and confirm no IndexedDB database/service worker. Screenshots were visually inspected.

A real layout issue was the Lab's long example-selection labels at mobile width. Those controls now identify samples by number (plus canonical form outside answer-hidden views); full natural language stays in the learning surface. Recall/meaning selectors no longer leak an answer. Proper Product UI `unitHanzi` styling is reused. A contradictory tone-assessment hint was corrected to follow the preview toggle. Production CSS is served read-only; only Lab-container rules are added. No production UI redesign or general layout fix is claimed. A final targeted browser check also exercises a mocked recording lifecycle; no real microphone or acoustic QA is used.

**Remaining editorial/release work:** review 57 existing meaning sets and their EN alternatives; author/localize the 55 logical explanatory fields and embedded gloss tokens; cover all prompt templates and 29 authored prompts; extract/consolidate the UI candidate list including recording/error/accessibility/print text; review diagnostic parameters and English paraphrase policy; cover remaining 30 items beyond this six-item draft; native/context review; check the actual production components and rare error states after any future approved integration. Existing v1 paper/print copy is not silently replaced by the separate paper research prototype.

Privacy, About, How learning works, Research & sources, and Imprint/legal information where applicable require an explicit English editorial strategy before external testing. Legal meaning, jurisdiction and required disclosures need their own review; ordinary UI translation is not legal validation. No legal pages or legal advice are added.

**Open decisions:** production default locale; English editorial approval ownership; treatment of valid but unlisted paraphrases and cross-language answers; whether/when locale context belongs in F-light; safe timing of a switch during an active assessed response; optional explanation release policy; resolving separate name/audio work; English review of regional usage. This Lab preserves state but does not claim that language changes leave task difficulty psychometrically identical.

Proceed with architecture/preview review. Do not merge, deploy, switch the German pilot, translate the entire course or treat these drafts as a release.
