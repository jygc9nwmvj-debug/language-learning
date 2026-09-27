# Session Orchestration v0.1

**Status:** BUILD SPEC / exact thresholds to test

## Core idea

A session is neither:
- a fixed slideshow,
- a random shuffle of exercise types,
- nor five separate modes.

It is a **directed learning flow** assembled from curriculum goals and current learner evidence.

The engine should feel like a good teacher changing activity for a reason.

---

## 1. Session layers

Each session draws from four pools:

### A. Re-entry / retrieval
A small amount of previously learned material, preferably without answer-bearing help.

Purpose:
- diagnose what survived;
- reactivate useful prerequisites.

### B. New learning
A deliberately limited amount of new language.

Purpose:
- advance curriculum;
- establish sound/meaning/use before unnecessary orthographic load.

### C. Integration / transfer
Mix new and old material in meaningful combinations.

Purpose:
- prevent isolated-card knowledge;
- build flexible use.

### D. Closure
A small unassisted check + recommendation for next useful learning opportunity.

Purpose:
- gather evidence;
- end before fatigue creates low-value practice.

---

## 2. Micro-arc for genuinely new material

Early in the course, a new high-value item may follow a denser arc:

`encounter → understand → attempt → feedback → reconnect later`

For a rich early item such as 好, this can expand to:

`hear → meaning → say → recognize in phrase → inspect form → guided write → later free recall`

This is not a permanent template for every item.

---

## 3. Focus before interleaving

Do not switch modality merely to create variety.

When a learner is acquiring a new motor or phonological pattern, allow a short coherent focus block.

Examples:
- two or three related tone contrasts;
- a short guided writing sequence;
- a dialogue exchange.

Then leave it and retrieve it later.

**Rule:** enough local repetition to understand the task, then spacing/interleaving before mindless repetition begins.

---

## 4. Reasons to change modality

A modality switch should normally serve at least one purpose:

1. test a different relation;
2. create spacing before retrieval;
3. connect representations;
4. reduce fatigue/interference;
5. move from scaffolded to independent use;
6. place known material into communication.

Bad reason:
`We have not done a writing exercise for three minutes.`

---

## 5. Retrieval spacing inside a session

Avoid immediate answer echo.

After introduction:
- first recall can occur after one or more intervening actions;
- repeated recall should increasingly be separated;
- a failed item receives correction, then leaves the foreground before retry;
- do not ask the identical question immediately unless motor correction requires it.

This prevents short-term visual memory from masquerading as learning.

---

## 6. Recognition → recall → production

Use increasing retrieval demand where appropriate.

Example:
1. recognize meaning among alternatives;
2. character → recall meaning without options;
3. meaning/audio → identify character;
4. meaning/intention → produce spoken phrase;
5. for selected writing targets: recall written form.

Do not require production before the learner has had enough meaningful exposure.

Multiple choice is mainly:
- early scaffold;
- diagnostic contrast;
- low-confidence re-entry.

It is not the default evidence of mastery.

---

## 7. Communicative arcs

Whenever possible, isolated exercises feed into a small communicative event.

Example Lesson 1:

- hear 你好
- learn 我 / 你 / 好
- learn 我叫 + Name
- later hear the name question
- answer
- use 謝謝 / 再見
- complete a tiny encounter with reduced support

The learner should periodically experience:
`I can actually do something with this.`

---

## 8. Explanation placement

Explain **just before or just after the learner has a reason to care**.

Avoid:
- long theory before any example;
- unexplained repeated failure.

Examples:
- tone is introduced after the learner has heard meaningful Mandarin;
- component structure appears when the learner is about to write/read the character;
- a grammar pattern is named/explained after a concrete sentence makes its function visible.

---

## 9. Discovery placement

Discovery items are optional and short.

Good placement:
- after a demanding focus block;
- when directly connected to an item just learned;
- near a transition.

They can provide cognitive/emotional breathing space.

They should not interrupt an unresolved retrieval attempt.

---

## 10. Difficulty regulation

A session should alternate challenge and consolidation rather than climb monotonically.

Possible rhythm:

`easy retrieval → new challenge → supported success → spacing → stronger retrieval → communicative success → closure`

If repeated failure occurs:
- increase scaffold;
- reduce simultaneous novelty;
- preserve some successful known material;
- do not punish with an endless drill loop.

If everything is easy:
- remove support;
- increase retrieval distance;
- introduce more new/transfer material;
- shorten redundant practice.

---

## 11. Writing placement

Writing should appear when:
- sound/meaning is already at least minimally established;
- the character is an intentional active-writing target;
- motor attention will deepen rather than derail language learning.

Do not place handwriting immediately after every new word.

Paper mode can collect several due writing targets into a coherent writing session rather than interrupt every digital language session.

---

## 12. Audio behavior

New Mandarin normally has natural audio.

Useful sequence:
- audio-first where inference is possible;
- reveal text/meaning;
- replay;
- learner production where appropriate.

Later:
- remove text;
- vary speaker;
- use natural speed;
- careful-slow audio on demand.

Do not mechanically slow natural audio as the primary slow model.

---

## 13. Help ladder

Help should be progressive, not binary.

Possible ladder:
1. no help;
2. replay / contextual cue;
3. Hanzi or structural cue;
4. Pinyin;
5. partial answer;
6. full reveal/model.

Exact ordering depends on task.

The engine records which rung was required.

---

## 14. Session closure

Do not end with a score screen.

Closure can contain:
- one or two unassisted retrievals;
- a concrete capability summary;
- one weak point;
- next recommended review time.

Example:
`You can greet someone and say your name. 好 still needs another writing recall. A short check tomorrow would be useful.`

Then:
`Finish`
and secondary:
`Learn a little more`

---

## 15. Session composer constraints

The composer should avoid:
- more than a small number of genuinely new concepts at once;
- long runs of identical low-effort recognition;
- immediate repeated testing after correction;
- writing every new character;
- showing Pinyin when it answers the task;
- introducing a discovery during active confusion;
- changing modality without a learning reason.

The composer should prefer:
- prerequisites reactivated before they are needed;
- weak relations embedded in new meaningful contexts;
- old material reused in new constructions;
- delayed retrieval;
- communication after component practice;
- stopping when marginal learning value drops.

---

## 16. V0.1 Lesson 1 example flow

1. audio-first 你好
2. meaning reveal + first spoken attempt
3. brief tone discovery (audio required)
4. introduce 我 in meaningful phrase
5. introduce 你 and later retrieve it after spacing
6. introduce 好 and connect back to 你好
7. first writing sequence for 好
8. introduce 我叫 + own name
9. spaced retrieval of 我 / 你 / 好 with less multiple choice
10. hear/understand name question
11. answer with own name
12. introduce light 謝謝 / 再見
13. tiny encounter with reduced help
14. one or two honest retrieval checks
15. stop/recommend next session

Exact order remains testable; this is a directed prototype, not permanent scripture.

---

## 17. Key metric for the prototype

Ask after the session:

> Did the sequence feel like learning one language, or like switching among unrelated mini-games?

If it feels fragmented, the composer has failed even if every exercise works technically.
