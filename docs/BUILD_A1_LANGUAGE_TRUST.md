# Build A1 — Language Trust

Stand: 2026-09-27. Enger Reparaturumfang, keine Fortsetzung in A2.

## Befund und Ursachen

Im Ausgangsstand 09cd2f1 steht überall in den autorisierten Mandarin-Daten korrekt `jiao4 / jiào`.
Eine Suche im aktuellen Quellcode, statischen Archiv und der erreichbaren Git-Historie findet kein
`joao`. Mit gespeichertem Namen `Wolfram` akzeptiert der alte Interpreter `wo3 jiao4 Wolfram`.
Die konkrete historische Fehlersituation lässt sich ohne den damaligen lokalen Speicherstand nicht beweisen.

**Reproduzierbarer gemeinsamer Fehlerpfad:** Der alte Interpreter verlangt zuerst, dass die Eingabe
mit dem gespeicherten Namensfeld endet. Ein leeres oder abweichendes Feld lehnt einen sprachlich
richtigen Satz ab, bevor Pinyin geprüft wird. Die anschließende große Modellkarte übernimmt dasselbe
Namensfeld ungeprüft. Reproduktion mit `name = "Wo3 joao4 Wolfram"`:

- Eingabe `wo3 jiao4 Wolfram` → altes Ergebnis `failure`.
- Alte Modellkarte → `我叫 Wo3 joao4 Wolfram`.

Damit können beide beobachteten Symptome gemeinsam entstehen, ohne dass `joao4` jemals im Lexikon
stand. Dies ist ein nachgewiesener Codepfad, keine Behauptung über die tatsächlich gespeicherten Nutzerdaten.
Zusätzliche Vertrauenslücke: Die bisherige Live-Konvertierung setzt auch ungültigem eingegebenem
`joao4` einen Tonakzent auf (`joào`) und präsentiert dies als „Mit Tonzeichen“. Sie prüft keine Silben.
Browser-Autokorrektur war zudem nicht explizit deaktiviert; ob sie bei diesem Vorfall eingriff, ist unbekannt.

**Reparatur:** Der Name ist ein offener Bestandteil des Satzes, kein Sprachtest gegen eine gespeicherte
Präferenz. Die Vollständigkeit wird getrennt geprüft. Die Hilfsvorlage verwendet den kanonischen Ausdruck
mit `…`, keine gespeicherten Freitexte. Ungeprüfte Live-Konvertierungen sind aus den Antwortfeldern entfernt;
Pinyin-Autokorrektur ist explizit aus. Die tatsächliche Eingabe bleibt unverändert sichtbar.

## Eine kleine kanonische Quelle

`src/languages/mandarin/content/lesson-001.json` enthält jetzt:

- `words`: ausschließlich bereits verwendete Wörter/Zeichen, einschließlich der vier vorhandenen ma-Beispiele.
  Je Wort: `id`, `hant`, `hans`, `toneNumbers`, `meaning.de/en` als kuratierte Antwortvarianten.
- `items`: Verweise auf diese Wörter; nur zusammengesetzte Ausdrücke erhalten eine eigene Bedeutung.
  `slot: "name"` kennzeichnet den offenen Namen. Keine neuen Lernaufgaben oder Inhalte.
- `tasks`: Verweise auf Items und ggf. Silbenindex. Keine handgeschriebenen Mandarin-Antwortkopien
  und keine separat duplizierte Tonzahl für die Tonfrage.

`schema/content.ts` validiert die Autorenquelle und leitet Zeichenfolgen, markiertes Pinyin,
Tonnummern, Silben, Tonfragen und akzeptierte Bedeutungsantworten ab. Beispiel: `jiao4` wird einmal
für 叫 gepflegt und sowohl in der Vorstellung als auch in der Namensfrage verwendet.
`pinyin.ts` enthält die reine Formatierung; sie behauptet keine Aussprachebewertung.
Optionale `review`-Metadaten (`reviewStatus`, `sources`, `reviewDate`, `notes`) sind möglich.
Kein Wörterbuchimport, keine KI-Review-Anbindung und kein neuer QA-Dienst.

## Audit aller aktuellen Lesson-1-Ausdrücke

| Ausdruck | Hant / Hans | Abgeleitetes Pinyin | Tonzahlen | Bedeutung im Lernkontext |
| --- | --- | --- | --- | --- |
| nihao | 你好 / 你好 | nǐ hǎo | ni3 hao3 | hallo |
| wo | 我 / 我 | wǒ | wo3 | ich / mich |
| ni | 你 / 你 | nǐ | ni3 | du / dich |
| hao | 好 / 好 | hǎo | hao3 | gut |
| wojiao | 我叫 / 我叫 | wǒ jiào | wo3 jiao4 | ich heiße + Name |
| askname | 你叫什麼名字？ / 你叫什么名字？ | nǐ jiào shénme míngzi | ni3 jiao4 shen2 me5 ming2 zi5 | Wie heißt du? |
| xiexie | 謝謝 / 谢谢 | xièxie | xie4 xie5 | danke |
| zaijian | 再見 / 再见 | zàijiàn | zai4 jian4 | auf Wiedersehen |

Vier vorhandene Tonbeispiele: 媽/妈 mā ma1 „Mutter“, 麻 má ma2 „Hanf“, 馬/马 mǎ ma3 „Pferd“,
罵/骂 mà ma4 „schimpfen“. Auch diese Angaben kommen jetzt aus derselben Quelle, ohne Tone-Lab-Redesign.
Alle 27 Aufgabenverweise und die zusätzlichen Mandarin-Anzeigen in Exercise, ToneLab, WritingExercise,
Worksheet und den UI-Texten wurden gesichtet. Schreibkomponenten/Worksheet bleiben unverändert.
Die Namensvorschau in der Begegnung verwendet das kanonische Item statt eines zweiten 我叫-Literals.

Es wurde kein weiterer falscher Mandarin-Ausdruck in der Autorenquelle gefunden. Duplizierte Pinyin-/Ton-
und Antwortlisten waren allerdings unabhängig änderbar und bisher nicht gegeneinander validiert.
Unterliegende lexikalische Töne bleiben kanonisch; Ton-Sandhi und regionale Realisierungen sind keine
abweichenden Schreibungen dieser Grundformen. Audio-QA bleibt davon getrennt und unverändert offen.

Quellen für den gezielten Abgleich (keine Integration in die App):

- [Integrated Chinese, Verlag Cheng & Tsui, Level 1 Part 1, Grammatik 叫](https://www.cheng-tsui.com/sites/default/files/previews/IC2E_lv1pt1_TxtSimp_4609_0_3.pdf):
  `我叫 + Name`, `你叫什么名字？`, jiào/shénme/míngzi; 叫 benötigt in dieser Konstruktion ein Objekt.
- [MDBG / CC-CEDICT, 谢谢](https://www.mdbg.net/chinese/dictionary?page=worddict&wdqb=%E8%B0%A2%E8%B0%A2&wdrst=0):
  謝謝/谢谢, xièxie, danke.
- [University of Oxford, CTCFL: Greeting](https://www.ctcfl.ox.ac.uk/materials_spoken-chinese_greetinga/):
  Bedeutungsabgleich von 你、你好、好、再见、谢谢、我.

Diese punktuellen Quellenprüfungen sind keine unabhängige Gesamtfreigabe. Die kuratierte lokale Quelle
bleibt operativ maßgeblich; spätere Quellen-/KI-Reviews und getrennte Audiofreigabe bleiben spätere Builds.

## Interpretation und Rückmeldung

`answer.ts` trennt `content`, `syllables`, `toneNotation`, `construction`, `fullyCorrect` und
`spokenTones: unknown`. Fehlende Tonnotation ist keine falsche Aussprache. Der bestehende
Fortschrittswert `result: success` bedeutet bei fehlenden/falschen Tönen weiterhin lexikalisch richtigen
Inhalt; das UI behauptet nur bei `fullyCorrect` vollständige Richtigkeit. Hanzi-Eingaben liefern keine
Tonnotation, sind aber als erlaubte schriftliche Antworten korrekt.

- `wo3` / `wǒ`, `hao3` / `hǎo`: vollständig korrekt.
- `wo`, `hao`: Inhalt korrekt, Ton fehlt.
- `wo3 jiao4 Wolfram` / `wǒ jiào Wolfram`: korrekt, auch bei leerem oder abweichendem gespeicherten Namen.
- `wo jiao Wolfram`: Inhalt und Konstruktion korrekt, Tonangaben fehlen.
- `wo3 jiao4`: Ausdruck korrekt, Name fehlt.
- `wo3 jiao Wolfram`: nur `jiao4 (jiào)` ergänzen.
- `wo3 joao4 Wolfram`: nur falsche Silbe zu `jiao4 (jiào)` korrigieren.
- 謝謝/谢谢, xièxie, xie4 xie5, xie4xie0 sind akzeptierte Varianten; xie xie hat fehlende Toninformation.

Kein Fuzzy-NLP: bekannte Schreibweisen werden deterministisch verglichen. Der Name wird nicht auf
Identität geprüft. Nicht unterstützte freie Umformulierungen bleiben außerhalb des kleinen Zielsets.

In `Exercise.tsx` bleibt das ausgefüllte Feld nach Prüfung lesbar und schreibgeschützt. Richtige Antworten
bekommen eine kurze Bestätigung statt einer großen Modellkarte; Teilfehler eine gezielte Korrektur.
Prüfen verschwindet, Weiter erscheint. Erneutes Enter wertet dieselbe Antwort nicht nochmals aus.
Die vorhandene Tonzahl-Tastaturübung hat ebenfalls diesen Zustand; nur nach einem Fehler gibt es
„Noch einmal versuchen“. Keine neue Bildschirmabfolge oder Änderung der Gestaltung.

## Validator und Tests

`npm run validate-content` ist im Produktionsbuild vorgeschaltet (`npm run validate` bleibt Alias).
Deterministische Fehler werfen einen Fehler und stoppen den Build:

- fehlende/leere kanonische Felder und Hanzi-Formen;
- ungültige Tonnummern und ungültige Silben im ausdrücklich begrenzten Lesson-1-Inventar (`joao4` fällt durch);
- Zeichen-/Silbenanzahl, doppelte IDs und doppelte Wortformen;
- unbekannte Wort-, Item-, Aufgaben- und Tonbeispielreferenzen sowie unzulässiger Silbenindex;
- widersprüchliche Zusatzkopien wie `pinyin` am Wort/Item, `answers` an Aufgaben oder separat autorisierte Task-Töne;
- fehlende Bedeutungen zusammengesetzter Ausdrücke und duplizierte Einzelwortbedeutungen;
- bisherige Audio-Dateiprüfungen und Publikationssperre für nicht freigegebenes Audio.

Pinyin und Tonzahlen können nicht auseinanderlaufen: markiertes Pinyin wird ausschließlich abgeleitet.
Der Validator kann keine beliebige semantisch falsche, aber formal gültige Wortzuordnung erkennen.
Dafür ist später die unabhängige Inhaltsprüfung vorgesehen; keine überzogenen Validator-Versprechen.

Prüfungen: 31 Node-Tests erfolgreich; Produktionsbuild und Inhaltsvalidierung erfolgreich.
23 Browserfälle zunächst erfolgreich (Chrome/WebKit): A1-Abnahmeeingaben, sichtbare Eingabe, gezielte
Korrekturen, Prüfen/Weiter, expliziter Retry, kompletter Lesson-1-Durchlauf, bestehender Papiermodus,
Handyformat, Mikrofon-Aufräumen, Backup/Offline und Hosting. Zusätzlich zwei Regressionen für ein
kontaminiertes gespeichertes Namensfeld; finaler A1-Testlauf umfasst 20 bestandene Browserfälle.
Damit 25 unterschiedliche betroffene Browserfälle geprüft. Keine Audioassets verändert.

## Gezielter Nutzertest

Bestehende App-Adresse: https://language-learning-abk.pages.dev/ . Alte App-Fenster schließen,
online neu öffnen und **Testversion A1** prüfen. Vollständiger Testlauf ist über Einstellungen &
Sicherung möglich; Verlauf bleibt erhalten. Bei der Vorstellung `wo3 jiao4 Wolfram` verwenden,
bei „danke“ `xie4 xie5`. Erwartet: Eingabe bleibt sichtbar, „Richtig.“, kein Prüfen und keine große
Musterkarte mehr. A1 endet hier; A2 wird nicht begonnen.

## Safari-Update-Reparatur nach A1

Der alte Cache-first-Service-Worker wartete mit Aktivierung auf das Schließen alter Clients.
Ein Reload konnte deshalb dieselbe Version liefern. Der neue Worker aktiviert sich erst nach
vollständigem Precache, dann mit `skipWaiting` und `clients.claim`, ohne selbst eine Seite neu zu laden.
Ein vorheriges Asset-Bundle bleibt für offene Seiten verfügbar. Die App prüft Updates bei jedem Start
ohne HTTP-Worker-Cache. Keine Änderung an IndexedDB oder Lerninhalten.

Migrationstest in Chrome und WebKit: alte 0.1.2-Testseite mit bisherigem Worker-Verhalten, zwei offene
Tabs, ungespeicherte Texteingabe, gespeicherter IndexedDB-Marker; Update per normalem Reload, weiterer
Reload zeigt A1, Text im anderen Tab und Datenbank bleiben erhalten, vorheriges Bundle bleibt abrufbar,
A1 startet anschließend offline. Testversion bleibt A1 (reine Auslieferungsreparatur).

Technischer Bezug: [ServiceWorker skipWaiting](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting).

## Weiterüben nach einer Runde

Der bisherige Einstieg plant nur fällige Wiederholungen. Ein leerer Review-Plan bestand lediglich aus
`closure`; dessen Tagesabschluss-Text wirkte wie eine Lernzeit-Sperre. Die Fälligkeiten bleiben gleich,
aber leere Runden werden nun als „Im Moment ist nichts fällig“ bezeichnet. Sowohl dort als auch nach
einer abgeschlossenen Runde ist „Lesson 1 erneut durchgehen“ direkt sichtbar. Das verwendet den bereits
vorhandenen vollständigen Lesson-1-Neustart und erklärt ausdrücklich, dass die Lektion von vorn beginnt
und der Verlauf erhalten bleibt. Keine neue Lektion, kein neuer Scheduler und keine tägliche Lernbegrenzung.
Chrome-/WebKit-Regressionsprüfungen decken beide Einstiege und den Erhalt alter Sessions/Events ab.

## A1 final follow-up: curriculum-aware evaluation

Invariant: **Never grade knowledge before it has been introduced.** Canonical linguistic truth and
current assessment targets are distinct. This also governs future sandhi, Hanzi production,
spelling, grammar, stroke order and pronunciation expectations; no new competency engine or A2
is implemented here.

Root cause: text recall used the strict canonical interpreter directly, so canonical `xie4 xie5`
produced a neutral-tone correction before neutral tone was taught. Canonical words remain unchanged.
The lesson now declares `introducedAssessment`; every text-recall task explicitly declares `assess`.
The two supported flags are `toneNotation` and `neutralTone`. Lexical content and the existing name
construction remain the fixed targets of these text tasks. Current A1: toneNotation=true,
neutralTone=false. `evaluateAnswer` requires a policy; Exercise and the direct harness pass it.
The canonical `interpretAnswer` remains strict by default for internal inspection. `fullyCorrect`
from learner evaluation means correct for active targets, not proof of canonical or spoken tones.
Assessment flags are included in attempt detail; content version is `lesson1-a1-curriculum`.

Neutral-target syllables are skipped during tone grading, including in other phrases such as the
name question. Lexical errors still count. Corrections and fallback models do not leak unexplained
neutral-tone numbers. Already-taught tone distinctions remain strict. The premature ma5/ma0 aside
was removed from the four-tone keyboard introduction. Future teaching must explain 5 as an input
convention for neutral/unstressed tone, **not a fifth lexical tone**; only then activate neutralTone.

Validator: recall tasks must declare their policy; active dimensions must be introduced; neutralTone
requires toneNotation; unknown flags and policies on unsupported task kinds are rejected. No graph,
learner migration or automatic competency inference. Introduced targets are currently an authored
lesson-level declaration, not an individualized model of what a learner has mastered.

Validation: required validate-content and production build; 33 Node tests including all requested
谢谢 variants, wo3/wo2/wo, other neutral-containing items, no leaked xie5 correction, future strict
policy and negative validator cases. Four Chrome/WebKit harness tests cover the actual Exercise and
direct Interpreter, repeated attempts, reset and state isolation. Existing trust regressions rerun.
Spoken pronunciation remains unknown for every text answer. Real iPhone acceptance remains with the
user; no audio or new curriculum work is included.
