# Schreibprogression 好 — Teststand 0.1.3

Stand: 2026-09-27. Ergänzt [RETEST_v0.1.2](RETEST_v0.1.2.md); sämtliche Aufnahme-, Audio-,
Tonzahl- und Hosting-Reparaturen bleiben enthalten. Lesson 2 bleibt unverändert.

## Ablauf und Testhypothese

| Stufe | Sichtbare Hilfe | Produktion / Rückmeldung |
| --- | --- | --- |
| observe | Eine vollständige Strichanimation, separat vom Schreiben | Nur beobachten; keine motorische Produktion |
| full_guided | Ganze Vorlage, Outline-Alpha 0,55; jeder nächste Strich animiert | Einmal nachziehen; nach jedem Fehler Strichhinweis |
| full_reduced | Gleiche ganze Vorlage; kein automatischer nächster Strich | Einmal schreiben; erst ab drei Fehlversuchen am gleichen Strich Hinweis |
| faint_outline | Ganze Outline mit Alpha 0,13 | Einmal schreiben; Hinweise nur auf Wunsch |
| brief_recall | Drei Sekunden Anzeige, danach ausschließlich leeres 田字格 | Einmal aus dem Gedächtnis; erst anschließend Selbstvergleich |
| delayed_recall | Von Beginn an leeres 田字格 | Später in Lesson 1 und in der nächsten Session Selbstvergleich |

Vier unmittelbare motorische Produktionen sind eine **Testhypothese**, keine wissenschaftlich
optimale Anzahl. Auch die Alpha-Werte, Fehlerschwellen und drei Sekunden sind praktische Startwerte.
Nach dem vierten Versuch geht es unabhängig von der Selbsteinschätzung im Lernfluss weiter; keine
zusätzliche Serie identischer Kopien. Freiwilliges Löschen oder ein erneuter Einstieg kann weitere
Versuche erzeugen. Nach Unterbrechung wird derzeit die Schreibaufgabe als Ganzes fortgesetzt bzw.
neu gestartet, nicht ein einzelner halb geschriebener Strich wiederhergestellt; Unterbrechungen stehen im Log.

Zwischen Einführung und späterem Abruf liegen 16 andere Aufgaben. Die erste Folgesession nach dem
Einführungsplan reserviert einen der maximal sechs Review-Plätze für 好, auch wenn der Tagesabstand
noch nicht erreicht ist. Spätere Reviews folgen wieder den Fälligkeiten. Ein kurzer zeitlicher Abstand
erzeugt weiterhin keine Evidenz für langfristige Stabilität. Die drei geführten Erfolge aktualisieren
keine Mastery-Werte; nur der abschließende Selbstbericht der Schreibaufgabe ist ein Lernversuch.
Der unmittelbare Abruf gilt als unterstützt, da die Vorlage gerade zuvor sichtbar war.

Papier bleibt verfügbar: gleiche sichtbare Hilfen, danach „Ich habe geschrieben“ und Selbstvergleich.
Das Programm kann auf Papier weder Strichfolge noch Abdecken einer gedruckten Vorlage prüfen.
Keine Änderung an der Worksheet-Architektur; mehrere fällige Zeichen und kleinere Raster bleiben
spätere Darstellungsvarianten, siehe Reparaturbericht 0.1.2.

## Vorhandene Hanzi-Writer-Funktionen

Geprüft: installierte Version 3.7.3, Typen und Implementierung sowie
[offizielle Dokumentation](https://hanziwriter.org/docs.html).
`showCharacter`/`hideCharacter` und `showOutline`/`hideOutline` schalten die Ebenen um.
Es gibt keinen nötigen eigenen Opacity-Regler: `outlineColor` akzeptiert RGBA einschließlich Alpha.
`updateColor` verändert die Vorlage im laufenden Quiz, ohne dessen Strichfortschritt zurückzusetzen.
`highlightStroke`, `showHintAfterMisses`, `onCorrectStroke`, `onMistake`, `onComplete` liefern die
benötigten Hilfen und Ereignisse. `highlightOnComplete` ist aus; Leniency bleibt beim Standard.
Keine privaten Renderzustände, keine eigene Stroke Engine und keine Handschrift-OCR.

Die Ganzzeichen-Vorlage wird über die Outline-Ebene gezeichnet, damit Hanzi Writer angenommene
Striche darüber darstellen kann. „Vorlage zeigen“ verstärkt diese Ebene sichtbar; Ausblenden stellt
die Hilfe der aktuellen Stufe wieder her. Auf dem freien Feld wird eine separate Vorlage eingeblendet
und als Hilfe erfasst. Komponentenfarben, Strichnummern und Pinyin werden nicht überlagert.
Auch die Aufgabenüberschrift verrät im freien Versuch das Zeichen nicht.

## Evidenz und Grenzen

- Renkl & Atkinson (2003), [Structuring the Transition From Example Study to Problem Solving](https://www.tandfonline.com/doi/abs/10.1207/S15326985EP3801_3),
  begründen einen schrittweisen Übergang von Beispielen zu eigener Bearbeitung. Die Übertragung auf
  diese konkrete Hanzi-Folge ist eine Designhypothese, kein direkter Wirksamkeitsnachweis.
- Karpicke & Roediger (2008), [The critical importance of retrieval for learning](https://pubmed.ncbi.nlm.nih.gov/18276894/),
  untersuchten fremdsprachlichen Wortschatz. Die Arbeit stützt den Einsatz späterer Abrufe;
  sie bestimmt weder Zahl noch Abstand motorischer Zeichenproduktionen.
- Hou & Jiang (2022), [Interference effects of radical markings and stroke order animations on Chinese character learning among L2 learners](https://pmc.ncbi.nlm.nih.gov/articles/PMC9403612/),
  fanden unter ihren Bedingungen Nachteile visueller Zusatzinformation für Zeichenwiedererkennung.
  Das begründet Vorsicht bei gleichzeitigen Hilfen; es belegt nicht, dass eine einzelne, separat
  betrachtete Strichanimation für das Erlernen der Schreibmethode grundsätzlich ungeeignet wäre.

Die vorhandenen Hanzi-Writer-Proben für kanonisches, absichtlich ungenaues und falsches 好 sind im
Reparaturbericht dokumentiert. Sie prüfen vorgegebene Strichfolgen mit simulierten Zeigergesten;
sie sind keine Validierung ganzheitlicher Lesbarkeit realer Handschrift. Freie Formen bleiben unbewertet.

Später soll die ausführliche Methodeneinführung entfallen, wenn chinesische Schreibprinzipien bereits
bekannt sind. Die Stufen sind dafür lokal getrennt; V0.1 führt noch keinen vermeintlichen Kompetenzscore
oder automatischen Schwellwert ein. Erst die Logs späterer Abrufe sollen schnellere/langsamere
Ausblendung begründen. Mehrfach erfolgreiche Tracings allein reichen dafür nicht.

## Research Log

`writing_stage_start`, `writing_stage_result`, `writing_stage_interrupted` enthalten `scaffold`,
`stage`, `mode`; Ergebnisse zusätzlich `errors`, `hints`, `correctStrokes`, `result`, `selfReport`,
`assisted`. Fehler sind bei Papier und freiem Schreiben **unknown**, nicht null Fehler.
Separate Ereignisse: `writing_stroke_correct`, `writing_stroke_error`, `writing_stroke_hint`
(mit `automatic`), `writing_hint`, `writing_preview`, `writing_preview_hidden`, `writing_clear`.
Jeder Datensatz hat Zeit, Session, Aufgabe, Aufgabenindex und Inhaltsversion; Auswertung nach Zeit
sortieren, nicht nach zufälliger UUID. Abgebrochene Stufen nicht als Erfolg werten. Keine Rohstrichpfade
und keine Audioaufnahmen im Log. Export wie bisher über Einstellungen & Sicherung.

## Prüfen

Die Browserprüfungen verwenden die tatsächliche Oberfläche: Animation abwarten, drei vollständige
Strichfolgen mit je einem absichtlichen Fehler, abnehmende Hinweiszahl, Drei-Sekunden-Ausblendung,
leeres Feld ohne verratendes 好, Löschen mit erneut gesperrtem Vergleich, abschließender Selbstbericht,
danach anderes Lernmaterial. Außerdem späterer freier Abruf mit angeforderter Hilfe, sichtbarer
Vorlagenwechsel, Papierdurchlauf, Handybreite, Research Log und reservierter Folgesession-Platz.
Build und 9 Domain-/Speicher-/Asset-Tests erfolgreich. Die 11 betroffenen Browserfälle sind erfolgreich
geprüft: vollständiger Lernfluss/Papier, Handy/Audio-Berechtigung, Aufnahme-Aufräumen (Chrome),
Hosting/Offline, sichtbare Vorlage, Fading samt Log und unterstützter späterer Abruf (je Chrome und WebKit).
Die neuen Fading-Prüfungen laufen bei 390 px Breite. Screenshots von blasser Vorlage und leerem
田字格 wurden visuell geprüft. Vorherige Zehn-Aufnahmen-Serien je Browser und die drei Hanzi-Writer-
Erkennungsproben bleiben dokumentierte Prüfungen des unveränderten Aufnahme-/Erkennungscodes.

Für den zweiten Nutzertest: alle alten App-Fenster schließen, online öffnen, **Testversion 0.1.3**
prüfen. Unter Einstellungen & Sicherung → **Lesson 1 vollständig erneut testen** beginnen.
Vorhandene Lernhistorie bleibt erhalten. Beobachten, ob die Hilfe zu früh oder zu spät verschwindet;
nach den vier Produktionen normal weiterlernen und den späteren freien Abruf ohne zusätzliche Kopien
versuchen. Die Aufnahmeprüfung aus 0.1.2 bleibt erforderlich, besonders mit dem eingebauten MacBook-Mikrofon.
