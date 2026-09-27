# Mandarin App — Lesson 01 Interaction Flow v0.1

**Arbeitstitel:** 你好 — Erster Kontakt  
**Status:** BUILD SPEC / Vertical Slice  
**Ziel:** Eine einzige vollständige Lektion, mit der Didaktik, UX, Offline-Fähigkeit, Audio, Schreiben und Lernstandslogik real getestet werden.

---

# 0. Leitregeln für den Flow

1. **Ein klarer Lernfokus pro Schritt.** Nicht zwingend ein Screen = eine Aufgabe, aber jede Ansicht hat ein eindeutiges kognitives Ziel.
2. **Hören/Sprechen priorisiert.** Schrift wird früh integriert, dominiert die Lektion aber nicht.
3. **Hilfen werden zurückgenommen.** Pinyin/Übersetzung erscheinen gezielt und verschwinden später wieder.
4. **Abruf vor Wiedererkennen, wo sinnvoll.**
5. **Feedback erklärt, nicht bewertet nur.**
6. **Keine Gamification.**
7. **Leichtigkeit im Ton:** kleine trockene oder niedliche Momente, aber kein Gag-Zwang.
8. **Alles lokal/offline.**
9. **Traditional/Simplified ist eine Darstellungsoption, kein anderer Kurs.**

---

# 1. Startscreen

## Lernziel
Orientierung geben, ohne Menüstruktur aufzubauen.

## Anzeige
- Titel: `Lesson 1 — 你好`
- Unterzeile: `Say hello. Say your name. Hear what tone does.`
- kleine Zeile: ca. 15–20 min
- Button: `Start`

Optional klein:
- Script: Traditional / Simplified
- Audio: on
- Writing input detected: Pencil / Touch / Paper mode

## Nutzeraktion
Start tippen.

## Speichern
- lesson_started
- timestamp
- chosen_script

## Noch nicht anzeigen
- Wortliste
- Fortschrittsdiagramm
- Lernziele als Checkliste
- Prozentwerte

---

# 2. Erste Begegnung — nur hören

## Lernziel
Erster bedeutungsvoller Kontakt vor Analyse.

## Anzeige
Fast leerer Screen:
- Play-Button
- kein Hanzi
- kein Pinyin
- kein deutscher Text

Audio:
`你好`

## Nutzeraktion
Audio abspielen.

Nach erstem Hören:
- Frage: `What do you think is happening?`
- zwei sehr grobe Optionen:
  - greeting
  - goodbye

## Feedback
Bei richtig:
`Exactly. A greeting.`

Bei falsch:
`It’s a greeting. You’ll hear it again in a moment.`

## Speichern
- first_exposure_nihao
- recognition_attempt

---

# 3. Bedeutung + Klang

## Lernziel
Klang mit Bedeutung verknüpfen.

## Anzeige
`你好`
darunter klein:
`nǐ hǎo`
darunter:
`hello`

Play-Button.

Hinweis:
`Listen once before you speak.`

## Nutzeraktion
1. hören
2. `Speak` drücken
3. selbst `你好` sagen

## Feedback V0.1
- Aufnahme abspielen können
- Pitch-Kurve anzeigen
- noch **kein harter Score**
- knapper Hinweis:
  - `Good: the second syllable rose clearly.`
  - oder `Your second syllable stayed too flat.`

## Speichern
- nihao_heard
- nihao_spoken_attempt_count
- pitch_contour
- simple_tone_feedback

---

# 4. Mini-Tone-Lab — „ma kann vier Dinge sein“

## Lernziel
Verstehen, dass Ton lexikalische Bedeutung trägt.

## Anzeige
Zunächst nur:
`ma`

Audio nacheinander:
1. mā
2. má
3. mǎ
4. mà

Danach werden aufgedeckt:
- 媽/妈 — mother
- 麻 — hemp
- 馬/马 — horse
- 罵/骂 — scold

Tonkurven daneben.

## Mikrotext
`Same syllable. Four tones. Four different words.`

Optionaler trockener Satz:
`Tone is not decoration.`

## Nutzeraktion
- alle vier hören
- 2–3 Hörpaare unterscheiden
- optional selbst nachsprechen

## Humor / Leichtigkeit
Bei einem falschen Versuch darf die Rückmeldung lauten:
`That sounded closer to “scold” than “horse”. Useful distinction.`

Nicht öfter als einmal.

## Speichern
- tone_discrimination_attempts
- tone_pair_accuracy
- pitch samples optional

---

# 5. Entdecken — 馬/马

## Lernziel
Schrift früh als System und Bildgeschichte erleben.

## Anzeige
`馬` bzw. `马`
- große Glyphe
- optional: historische Form als kleines Bild/Diagramm
- kurzer Satz:
  `This character began as a drawing of a horse.`

Button:
`Show me` / `Skip`

## Nutzeraktion
Optional ansehen.

## Wichtig
Nicht prüfungsrelevant.

## Speichern
- discovery_seen_ma = true/false

---

# 6. „Ich“ — 我

## Lernziel
Erstes produktives Personalwort + erstes aktives Zeichen.

## Anzeige
Audio zuerst:
`wǒ`

Dann:
`我`
`wǒ`
`I / me`

## Nutzeraktion
- hören
- sprechen
- danach `Write`

## Writing Step A
Strichfolge einmal animiert.

## Writing Step B
schwache Vorlage nachfahren.

## Writing Step C
Vorlage ausblenden → selbst schreiben.

## Desktop
`Write 我 on paper.`
Button: `Show stroke order`
Danach Selbstcheck:
- `Got it`
- `Not yet`

## Feedback
Kein Schönheitsrating.
Nur:
- Strichzahl grob korrekt?
- Reihenfolge grob korrekt?
- Form ausreichend erkennbar?

## Speichern
- wo_listening
- wo_speaking
- wo_recognition
- wo_writing_guided
- wo_writing_recall

---

# 7. „Du“ — 你

Gleiche Grundmechanik wie bei 我, aber kürzer, damit die Lektion nicht repetitiv wird.

## Ziel
`你` hören, erkennen, sprechen, schreiben.

## Variation
Erst Audio → Nutzer soll zwischen `我` und `你` wählen.

Dann Schreiben.

## Speichern
getrennt nach Hören / Erkennen / Schreiben.

---

# 8. „Gut“ — 好

## Lernziel
Bedeutung, Klang, Schriftstruktur und Schreiben verbinden.

## Anzeige
`好`
`hǎo`
`good`

Dann optional aufklappen:
`女 + 子`

## Erklärtext
`Two visible components. We’ll use components only when they actually help.`

## Mnemonik
Optional:
`Want a memory hook?`

Wenn ja:
Eine **klar als Merkhilfe** gekennzeichnete kleine Bildidee.
Keine pseudo-historische Erklärung.

## Nutzeraktion
- hören
- sprechen
- schreiben
- später Audio `hǎo` → 好 auswählen oder schreiben

## Leichter Mini-Satz / verspielter Moment
Noch keine neue Grammatik erzwingen.
Optional nur als Mikrotext:
`好. Good. Very useful word. Also a very useful thing.`

## Speichern
- hao_listening
- hao_speaking
- hao_recognition
- hao_writing

---

# 9. 你好 zusammensetzen

## Lernziel
Bekannte Elemente als Einheit erkennen und sprechen.

## Anzeige
Zunächst nur:
`你 + 好`

Dann zusammen:
`你好`

Pinyin zunächst sichtbar.

## Nutzeraktion
- hören
- sprechen
- danach Pinyin ausblenden
- noch einmal sprechen

## Feedback
Knapp:
`You already knew both characters.`

## Speichern
- nihao_composition_understood
- nihao_without_pinyin_attempt

---

# 10. „Ich heiße …“ — 我叫 …

## Lernziel
Erste personalisierte produktive Struktur.

## Einführung
Audio:
`我叫 ...`

Dann:
`我` + `叫` + `[name]`

Kurzer Erklärtext:
`叫 is used here for “to be called”.`

## Nutzeraktion
Name eingeben.
App erzeugt:
`我叫 Wolfram。`
bzw. den eingegebenen Namen unverändert.

Dann:
- hören (nur chinesischer Teil, Name ggf. nicht synthetisieren, wenn unsicher)
- selbst sprechen

## Wichtige technische Regel
Kein erfundener chinesischer Name.
Kein Versuch, nichtchinesische Namen automatisch chinesisch auszusprechen.

## Speichern
- user_display_name_local
- wo_jiao_pattern_understood
- self_intro_spoken_attempt

---

# 11. „Wie heißt du?“ — 你叫什麼名字？

## Lernziel
Frage verstehen und beantworten.

## Ablauf
1. Audio-only.
2. Nutzer wählt: `name?` / `where from?`
3. Danach Hanzi + Pinyin anzeigen.
4. Phrase segmentieren:
   - 你
   - 叫
   - 什麼名字

## Mikro-Erklärung
`Chinese often leaves the question word where the answer would go.`

Keine Terminologie wie „interrogative substitution rule“ in V0.1.

## Nutzeraktion
Frage hören → selbst antworten:
`我叫 [Name]。`

Zweiter Versuch ohne sichtbare Antwortvorlage.

## Speichern
- name_question_listening
- response_with_help
- response_without_help

---

# 12. Danke — 謝謝 / 谢谢

## Lernziel
Ein zweites sofort nutzbares Alltagswort.

## Ablauf
Audio → Bedeutung → Hanzi → Pinyin → Nachsprechen.

Kein Handschriftziel in Lesson 1.

## Mini-Kontext
Audio:
Jemand gibt dir etwas.
Du antwortest:
`謝謝。`

## Nutzeraktion
Sprechen.

## Speichern
- xiexie_recognition
- xiexie_speaking

---

# 13. Auf Wiedersehen — 再見 / 再见

## Lernziel
Gespräch beenden.

Wie 謝謝, ohne Handschriftpflicht.

## Mini-Sequenz
Sprecher A:
`你好。`
Sprecher B:
`你好。`
...
Ende:
`再見。`

## Nutzeraktion
Abschiedsphrase sprechen.

---

# 14. Kleine erste Mini-Interaktion

## Lernziel
Einzelteile werden Kommunikation.

## Ablauf
Mit zweiter Sprecherstimme:

A: `你好。`
User: `你好。`

A: `你叫什麼名字？`
User: `我叫 [Name]。`

A: `謝謝。`
User hört/versteht.

A: `再見。`
User: `再見。`

## Wichtig
Keine Untertitel beim ersten Durchgang.
Bei Bedarf Button:
`Need help?`

Hilfen:
1. Hanzi
2. Pinyin
3. Bedeutung

in dieser Reihenfolge oder je nach Aufgabe.

## Speichern
- interaction_completion
- help_level_used_per_turn
- spontaneous_response_success

---

# 15. Ehrlicher Abruf

## Lernziel
Prüfen, was wirklich abrufbar ist.

5–7 kurze Aufgaben, dynamisch gewählt:

- Audio `你好` → Bedeutung
- `hello` → sprechen
- Audio `wǒ` → 我 auswählen
- `you` → 你 schreiben
- Audio `hǎo` → 好 schreiben/erkennen
- Frage nach Name hören → frei antworten
- `謝謝` vs `再見` auditiv unterscheiden
- zwei `ma`-Töne unterscheiden

## Keine Prozentzahl
Am Ende eher:
`Today you can already:`
- greet someone
- say your name
- recognize 你 / 我 / 好
- hear that tone changes meaning

Und:
`Needs another pass:`
- tone 3
- writing 我
o. ä.

## Speichern
Skill-spezifisch, nicht als globale Punktzahl.

---

# 16. Optionaler ruhiger Abschluss

## Anzeige
`千里之行，始於足下。`

darunter sinngemäß:
`A journey of a thousand miles begins with the first step.`

Klein:
`Laozi, chapter 64`

Button:
`Finish`

Keine Aufgabe. Kein Badge.

---

# 17. Zweiter Durchlauf / Wiederöffnung

Die Lektion soll **nicht identisch** starten.

## Wenn vieles sicher
- weniger Erklärungen
- weniger Pinyin
- neue Sprecherreihenfolge
- schneller zu Retrieval
- mehr Audio-first

## Wenn etwas unsicher
- betreffendes Element früh wiederholen
- Writing Scaffold zurückbringen
- Tonpaar gezielt erneut hören

## Beispiel
Wenn `你` gelesen, aber nicht geschrieben werden konnte:
- Erkennen wird nicht erneut ausführlich erklärt
- Schreiben kommt früh wieder

Wenn `你好` gesprochen sicher, Ton 3 aber schwach:
- keine komplette Begrüßungseinführung
- kurzes Tone-Lab-Review

---

# 18. Zustandsmodell für Lesson 1

Pro Item / Skill:

- unseen
- introduced
- assisted_success
- unassisted_success
- shaky
- due_for_review

Getrennt pro Modalität:
- meaning
- listening
- speaking
- reading
- writing
- sentence_use

Beispiel:
`好`
- meaning: unassisted_success
- listening: unassisted_success
- speaking: shaky
- reading: unassisted_success
- writing: assisted_success

---

# 19. V0.1-Technik, die dieser Flow wirklich benötigt

## Muss
- Audio-Dateien lokal
- Mikrofonaufnahme
- lokale Pitch-Schätzung
- Canvas/Pointer-Eingabe
- Stroke capture
- lokale Speicherung
- Script-Switch
- responsive Layout
- Service Worker / Offline Cache
- deterministische Variation

## Noch nicht
- LLM
- Server
- Login
- Cloud-Sync
- perfekte Handschrift-KI
- automatische freie Satzbewertung
- HSK
- Analytics

---

# 20. Was wir im ersten echten Test beobachten

Nach dem ersten Durchlauf nicht primär fragen:
`War es schön?`

Sondern:

1. War jederzeit klar, was zu tun ist?
2. Gab es zu viel oder zu wenig Information?
3. War Pinyin zu präsent?
4. Hat das Tone Lab wirklich geholfen?
5. War die Tonrückmeldung glaubwürdig?
6. War Schreiben flüssig genug?
7. Fühlte sich die Lektion wie **eine Sprache** an oder wie fünf getrennte Übungstypen?
8. War die Menge realistisch für 15–20 Minuten?
9. Gab es mindestens einen Moment von Leichtigkeit/Neugier?
10. Kann der Nutzer nach 24 Stunden noch etwas ohne Hilfe abrufen?

Der 24-Stunden-Abruf ist wichtiger als ein perfektes unmittelbares Ergebnis.

---

# 21. Paper Mode in Lesson 1

Bei jeder aktiven Schreibaufgabe (`我`, `你`, `好`) stehen zwei gleichwertige Wege zur Verfügung:

**Write on screen**  
Canvas mit Finger/Stift.

**Write on paper**  
Die App zeigt nur die Aufgabe und bietet:
- `Open worksheet`
- `Show stroke order`
- `Check myself`

Das Lesson-1-Arbeitsblatt wird automatisch aus denselben Zeichendaten erzeugt und ist druckoptimiert (A4).

Der Lernstand speichert beim Paper Mode keine automatische Formbewertung, sondern:
- paper_attempted
- self_check: secure / unsure / retry
- optional späterer Recall-Test ohne Vorlage

Foto-/Upload-Auswertung gehört nicht zu V0.1.
