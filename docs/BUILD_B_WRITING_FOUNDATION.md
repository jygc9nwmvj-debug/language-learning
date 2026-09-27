# Build B — Writing Foundation

Stand: 2026-09-27. Ersetzt für die Bildschirmübung den Ablauf aus WRITING_FADING_v0.1.3.md.
A1 (Text/Sprachvertrauen), A2 (Audio), Worksheet und Lesson 2 bleiben inhaltlich unverändert.

## Vor Umsetzung geprüfte Vorbilder und Entscheidungen

- [Skritter Writing Modes](https://docs.skritter.com/article/281-writing-modes): „Raw Squigs“ lässt eigene Linien stehen; standardmäßiges Snapping verschönert sie. Das ist der relevante Vergleich für ehrliche Handschrift, kein Beleg für unsere konkrete Wiederholungszahl.
- [Skritter Teaching Mode / Canvas](https://docs.skritter.com/article/267-mobile-writing-canvas-and-study-screen-buttons): vorführen, selbst schreiben, nächsten Strich zeigen; dieses bekannte Muster wird übernommen.
- [Skritters Erklärung zu Raw Squigs](https://blog.skritter.com/2014/07/improve-your-character-writing-by-enabling-raw-squigs/): schönes automatisches Nachzeichnen kann falsche Sicherheit vermitteln. Deshalb kein Ersetzen angenommener Striche durch die ideale Form, keine Noten oder Spielpunkte.
- [Hanzi Writer – offizielle Demos und API](https://hanziwriter.org/docs.html): Animation, Outline, Quiz und direkte Rückmeldung sind bereits gelöst. Diese bewährte Implementierung bleibt Erkennungs- und Animationsbasis. Kein neuer Matcher, keine OCR.
- Die feste kurze Fading-Sequenz und der automatische Wechsel nach 1,1 Sekunden sind unsere kleine Produktentscheidung; wir behaupten nicht, Skritter habe exakt diesen Ablauf oder er sei wissenschaftlich optimal.

## Ablauf in der normalen Lesson 1

| Ziel | Demonstration | Eigene Produktionen |
|---|---|---|
| 好 | ausführliche Methodeneinführung, langsamere Bewegung | volle Vorlage + nächster Strich + kleine Zahlen → Vorlage ohne Zahlen/automatische Strichhilfe → blasse Vorlage → 2,5 s ansehen, dann leeres Feld |
| 你 | kurze Erinnerung an die bekannte Methode | volle Hilfe → blasse Vorlage → kurzer Blick, dann leer |
| 我 | Hinweis auf Richtung, Kreuzungen und Haken | volle Hilfe → etwas deutlichere blasse Vorlage (0,18 statt 0,12) → kurzer Blick, dann leer |

Vier bzw. drei unmittelbare Produktionen sind eine veränderbare Testhypothese, keine optimale Zahl.
Nur diese drei bereits eingeführten Zeichen sind aktive Schreibziele. `write-ni` folgt auf `read-ni`,
`write-wo` auf `read-hao`; andere Lernaufgaben liegen dazwischen. 好 bleibt der erste Schreibkontakt.
`write-recall` bringt 好 am Ende nach anderem Material zurück; der vorhandene erste Folgesession-Abruf bleibt.
Das gleiche lokale Bauteil kann später einen freien Abruf für 你/我 darstellen; es gibt dafür noch keinen neuen Scheduler.

Bestehende gespeicherte Sessions werden nicht umgeschrieben. Eine neue vollständige Lesson-1-Runde
enthält den neuen Ablauf; vorhandene Historie bleibt erhalten. Einstieg über das bestehende
„Lesson 1 erneut durchgehen“ bzw. in Einstellungen „Lesson 1 vollständig erneut testen“.
Keine neue Einstiegsseite, kein Interaction/Flow- oder Continuous-Learning-Umbau.

## Hanzi Writer, Modell und Darstellung

Hanzi Writer 3.7.3 bleibt unverändert. Lokale JSON-Daten aus `hanzi-writer-data@2.0.1`, kein Laufzeit-CDN.
Die [Make-Me-a-Hanzi-Grafiken](https://github.com/skishore/makemeahanzi#sources) stammen von
Arphic PL KaitiM GB / PL UKai: Regular-Script/Kaiti als Schreibmodell, keine Songti-Darstellung aus dem UI-Font.
Die Referenz orientiert sich an der Strichfolge dieser Daten (PRC); keine Behauptung, jede regionale
oder handschriftliche Variante sei falsch. Lizenztext `public/licenses/ARPHICPL.txt` bleibt gebündelt.

- `animateCharacter`, `strokeAnimationSpeed: .7`, `delayBetweenStrokes: 1000`: langsamere Strichbewegung als vorher, unveränderte Zwischenpausen, kein eigenes Animationstiming pro Strich.
- `outlineColor` mit RGBA, `updateColor`, `highlightStroke`: gestufte Vorlage und wirkungsvolle Hilfe. „Vorlage zeigen“ verstärkt die Referenz **unter** den eigenen Strichen, ohne das Quiz zurückzusetzen.
- `quiz`, `onCorrectStroke`, `onMistake`, `onComplete`: sofortige Rückmeldung. Standardtoleranz; umgekehrte Striche und automatisches Durchwinken nach vielen Fehlern sind deaktiviert.
- `drawnPath.pathString`: tatsächlicher gezeichneter Pfad aus dem öffentlichen Callback. Er wird als SVG mit 7 px, runden Kappen/Verbindungen und konstanter Breite behalten. Ideale angenommene Hauptstriche sind transparent. Keine Pfadglättung, kein Snapping, keine künstliche Druckvariation.
- Strichnummern: kleine Labels am Beginn der vorhandenen Medians, ausschließlich in Demonstration/stärkster Lernstufe; weder Komponentenfarben noch Pinyin darüber.
- Ein nicht passender Strich erscheint kurz in ruhigem Braun und verschwindet, damit er erneut geschrieben werden kann. Bereits angenommene echte Striche bleiben stehen.

Die Erkennung prüft Nähe zur erwarteten Strichform, Lage, Richtung und Reihenfolge für **das bekannte Zielzeichen**.
Sie erkennt nicht frei, welches Zeichen gemeint war, und beurteilt weder Gesamtlesbarkeit noch Ästhetik.
Akzeptierte ungenaue Pfade bleiben sichtbar ungenau. Erfolg bedeutet nur: diese Strichfolge wurde angenommen.

## Hilfe, Fortschritt und Ereignisse

Jeder richtige Strich wird sofort bestätigt; nach vollständigem Zeichen bleibt die eigene Schrift
1,1 Sekunden mit „Geschafft“ sichtbar. Danach nächste Hilfestufe bzw. normales Lernmaterial, ohne Prüfen/Weiter-Schleife.
Nach je zwei Fehlversuchen am selben Strich wird dieser vorgemacht. „Nächster Strich“, sichtbare Vorlage,
„Neu ansetzen“ und „Noch einmal ansehen“ bleiben verfügbar. Replay kehrt mit voller Hilfe zur aktuellen
Stufe zurück; kein komplizierter Retry-Algorithmus. Speicherfehler bieten einen Wiederholungsbutton.

Bestehende Ereignisse enthalten Ziel, Stufe, `guided_trace` / `reduced_scaffold` / `free_recall`, Fehler,
Hinweise, Vorlagen-/Demo-Nutzung, Modus und `selfReport`. Keine Rohpfade werden gespeichert.
Zwischenstufen erzeugen keine zusätzlichen Mastery-Versuche. Die ganze Einführung gilt als unterstützt;
ein späterer Abruf ist nur ohne Hilfen unabhängig. Strichhinweise bleiben auch nach Pause/Fortsetzen derselben Aufgabe als Unterstützung erhalten. Papier bleibt ehrlich als Selbstbericht markiert,
Fehler dort `unknown`. Inhaltsversion ist `lesson1-b-writing`.

Das Feld misst bis 320 CSS-Pixel, passt sich schmalen Geräten an und bleibt innerhalb eines Versuchs stabil.
SVG bleibt auf Retina scharf. `touch-action: none` verhindert Scrollen im Feld. Abgebrochene/mehrfache
Berührung oder Größenwechsel verwerfen den begonnenen Versuch mit sichtbarer Erklärung, nie als Erfolg.
Maus/Trackpad nutzen denselben HW-Quizpfad. Kein Pencil-Sonderverhalten.

Papier: vorhandene A4-Vorlage unverändert, Selbstvergleich weiterhin möglich. 你/我 lassen sich in freie
Felder schreiben. Keine neue Papierbewertung, Raster-Engine oder Mehrzeichen-Arbeitsblattproduktion.

## Prüfprotokoll

- Produktionsbuild, Inhalts-/Asset-Validierung und TypeScript erfolgreich: 12 bestehende Wörter, 8 Items, 29 Aufgaben, 20 unveränderte Audioreferenzen.
- 37 Domain-/Speicher-/Audiotests bestanden; alle zwölf akzeptierten Polly-Dateien bytegenau unverändert.
- Isolierter Development-Harness: 13 Fälle in Chrome/WebKit bestanden. Ein zusätzlicher CDP-Touchfall ist bewusst nur in Chrome ausführbar und wird in WebKit übersprungen. Alle drei Zeichen: vollständige Folge, korrekte und wackelige Pfade, falsche Strichfolge/Form, echte Pfadgeometrie, Reset und kein Schreiben in den Learner-State.
- Normaler Produktionsbuild: Gesamtlauf zunächst 54 von 55 Fällen erfolgreich. Ein Chrome-Navigationstest übersprang den Recall durch zu schnelle Testklicks; dieser Test startet jetzt aus einer isolierten gespeicherten Recall-Session. Der Nutzer-Lernfluss wurde dafür nicht geändert.
- Abschließend alle sechs Schreibfälle (Chrome/WebKit) erfolgreich: Fading, leerer Recall mit Vorlage/Reset/Replay sowie zwei zusätzliche Fälle für Hilfe nach Pause/Fortsetzen. Damit sind alle 55 bisherigen App-Fälle plus zwei neue Resume-Fälle geprüft; unveränderte Audiofälle wurden nach der letzten eng begrenzten Schreibkorrektur nicht erneut ausgeführt.
- Vollständiger normaler Lesson-1-Durchlauf mit Papier für alle drei Ziele, Sicherung, kaltem Offline-Neustart und späterem Review bestanden. A1 und A2 bleiben grün; je Browser zehn Mandarin-Referenzaufnahmen und zehn technische Kontinuitätsaufnahmen erfolgreich.
- Eigene Sichtprüfung: leeres 田字格, echte SVG-Tinte über der Vorlage, Nummern für 你/我 ohne Überlagerung, Handybreite und Retina-Screenshots.

Echte Maus-/Touch-Ereignisse, keine vorgetäuschten Quiz-Erfolge: gute/wackelige Pfade wurden mit allen
6/7/7 Strichen angenommen, gezielt falsche Reihenfolge/Form zurückgewiesen. Dies ist eine begrenzte
Toleranzprobe, kein allgemeiner Nachweis der Lesbarkeit echter Handschrift.
Physisches iPhone-/Pencil-Gefühl, passende Fading-Geschwindigkeit und behaltenes Schreiben bleiben
Fragen der normalen Nutzung, nicht weitere technische Abnahmelisten.

Veröffentlichung: Der geprüfte lokale Build ist bereit. Die automatische Freigabeprüfung blockierte
am 2026-09-27 den Push auf main mit der Begründung, die frühere Push-Freigabe gelte nur für A2.
Eine ausdrückliche Build-B-Veröffentlichungsbestätigung ist noch erforderlich.

## Daten-Provenienz (SHA-256)

- 好: `c9f085fe6519e2b2c9653c7edf51bdbc78339fcc0b10f94c1f33c7f4f4d4a3a5` — https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/好.json
- 你: `21057a26cb5c1753ea710d503b759cc17948263501ffd76ef1737cb2b5d5f966` — https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/你.json
- 我: `08616462fc64b4c18c76a3f68a992305e98946f468bf42ec76ca9be1cd6c5ac8` — https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/我.json
