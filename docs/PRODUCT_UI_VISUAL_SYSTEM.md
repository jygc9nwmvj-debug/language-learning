# Product UI v1 — Visual System & App Feel

2026-09-28 · Baseline: C2.3+ mit Inhalten D. Reine Produktoberfläche, keine neue Lernarchitektur.

## Kleine Gestaltungsvereinbarung

Die Sprache ist groß, die Oberfläche klein. Bestehende Systemschrift und Songti bleiben. Warmer Papiergrund, dunkles Grün, offene Lernflächen. Flächen nur für echte Gruppierung: Startkarte und Schreibpapier. Werkzeuge brauchen keine Karten. Neue Ansichten verwenden diese Regeln statt zusätzlicher lokaler Stilvarianten.

| Bereich | Verbindliche Grundlage in `src/app/app.css` |
| --- | --- |
| Abstand | 4 / 8 / 12 / 16 / 24 / 32 / 48 px; viel Raum um Sprache, enger um Werkzeuge |
| Farbe | Papier #f3f1e9, Fläche #fffdf7, ruhige Fläche #e9ece3, Schrift #25332d, Nebeninformation #58675c, Grün #294b3c |
| Semantik | Erfolg #285c40, Korrektur #963e30, Aufmerksamkeit #79521c; immer zusätzlich Text |
| Konturen | Trennlinien #d5dacf, stärkere Linien #a8b5a5; keine Kartenschatten |
| Form | Kontrollradius 10 px, Startfläche 18 px; keine Kästen um Wortgruppen |
| Bedienung | Mindestens 44 px Touch-Fläche; primäre Aktion 50 px; sichtbares Symbol 20 px |
| Schrift | Hanzi 4–6.5 rem, gezielter Hanzi-Fokus 5.5–8 rem, Phrase 2.7–3.7 rem; Pinyin 1.2 rem, Bedeutung 1.125 rem, Hilfe .8125–.9 rem |
| Bewegung | 140 ms Kontrollwechsel, 180 ms Einblendung; reduced-motion schaltet beides aus |

Primär: dunkles Grün, eine klare nächste Handlung. Sekundär: ruhige Fläche. Utility: transparent, vertraute SVG-Symbole und zugängliche Namen. Die aufgeräumte gemeinsame CSS-Datei ersetzt die früher aufeinandergelegten C/C2/C2.3-Korrekturen. Kleine gemeinsame Bausteine: `IconButton`, `InfoDisclosure`, `AnswerSummary`; bestehende `AudioButton`, `Recorder` und `PhraseForm` bleiben fachlich zuständig. Kein Komponentenframework.

## Umsetzung / Abnahmebericht

1. **Befund:** uneinheitliche Abstände, konkurrierende Textbuttons, Formularreste nach Auswertung und zu viele eingerahmte Gruppen.
2. **Regeln:** Sprache als Anker; visuelle Gewichtung nach aktueller Aufgabe; Unterstützungsaktionen treten zurück.
3. **System:** obige Tokens und drei kleine gemeinsame UI-Bausteine; bestehende Komponenten weiterverwendet.
4. **Kontrollen:** Play/Pause, Aufnahme/Stopp, Replay, Retake, Zurück, Schließen, Info und Druck mit derselben SVG-Familie. Schreibwerkzeuge behalten kurze sichtbare Beschriftungen.
5. **Rechtecke:** Lernkarte und Werkzeugkästen entfernt; Trennlinien und Abstände gruppieren. Startkarte und Schreibfeld behalten sinnvolle Flächen. Eingabe als Linie statt Kasten.
6. **Typografie:** Hanzi größer; Pinyin/Bedeutung abgestuft; Aufgaben und Hilfe ruhiger. Keine neuen Fonts oder Tonfarben.
7. **Audio:** Play plus „langsam“; Aufnahme prominent, danach „Deine Aufnahme“ mit Replay/Retake. Aufnahme-, Finalisierungs- und Wiedergabestatus sichtbar. Datenschutz und Aussage zur fehlenden Aussprachebewertung über das Info-Symbol direkt an der Aufnahme erreichbar. Nativer Player bleibt verborgen. Keine Änderung an Capture oder Assets.
8. **Neu / Recall:** progressive bestehende Aufmerksamkeit bleibt auf einer offenen Fläche. Recall hebt die Frage hervor und zeigt keine Antwort vorzeitig. Nach Auswertung ersetzt eine Antwortzusammenfassung das Eingabefeld, auch bei der Tonzahlübung. Alle bisherigen Gates bleiben.
9. **Phrase:** Wortgruppen als große Schrift mit dezenter Unterstreichung; aktive Gruppe deutlicher, Erklärung lokal mit schmaler Linie und Schließen-Symbol. Bestehende Segmentierung und Pinyin-Regeln unverändert.
10. **Schreiben:** 320-px-Schreibfläche im Mittelpunkt, kompakte Werkzeuge darunter; tatsächliche Strichgeometrie, Fading, Wiederholung und Drucklayout unverändert.
11. **Tone Lab:** vier gemeinsame Zeilen mit aktiver Markierung, kleinen Play-Kontrollen, ruhigem optionalem Recorder und kompakten Antwortkreisen. Keine didaktischen Änderungen.
12. **Navigation / Start:** Startfläche bewahrt; Weiterlernen eindeutig primär. Einstellungen und Offline-Status leise. Zurück und Beenden als benannte Symbole erreichbar, keine neue Navigation.
13. **Zugänglichkeit:** 44-px-Ziele, zugängliche Symbolnamen, sichtbarer Tastaturfokus, native Disclosure-Semantik, safe-area-Abstände, reduzierte Bewegung. Kein vollständiger Accessibility-Audit behauptet.
14. **Bildprüfung:** Start, Hanzi-Einführung, Recall, Ergebnis, Phrase, Aufnahme/Wiedergabe, Schreibfläche und Tone Lab. 320/390 px mobil und 1024 px für die Phrase; kein horizontaler Überlauf in den geprüften Ansichten. Kein eigener verschachtelter Scrollbereich.
15. **Tests:** bestehende 66 automatisierte Tests einmal erfolgreich; Produktionsbuild inklusive Inhaltsvalidator erfolgreich (44 Wörter, 36 Objekte, 131 Aufgaben, 76 Audioreferenzen). Sechs fokussierte Browserfälle in Chrome und WebKit erfolgreich: Aufnahmeablauf/Weiter-Sperre, Tone-Lab-Kontrollen, Ergebnisanzeige, Schreibhilfe, Phrase, Touch-Größen, zugängliche Namen, Tastatur und reduced-motion. Initiale Testfehler waren eine vor C2.3+ geltende Erwartung an das nächste Wort und zu schnelle Play-Aufrufe vor bestätigtem Wiedergabestart; die fokussierten Tests wurden entsprechend synchronisiert und wiederholt. Capture wird dort simuliert, nicht akustisch bewertet.
16. **Nicht wiederholt:** A1-Sprachmatrix, A2-Hörabnahme, Schreib-Abnahmematrix, alle D-Inhalte, breite Browserregression. Quellvergleich bestätigt unveränderte Capture- und Writer-Logik; Inhalt, Schema, Scheduler und Audio unverändert.
17. **Normale App:** https://language-learning-abk.pages.dev/ — Kennzeichnung „Testversion UI1 · C2.3+ · Inhalte D“ nach Veröffentlichung.
18. **Normale Nutzung muss zeigen:** Sind reine Symbolkontrollen sofort verständlich? Sind Hilfe und Wortgruppen ausreichend auffindbar? Bleibt das Verhältnis zwischen Großzügigkeit und Scrollstrecke angenehm? Fühlt sich der Ablauf als zusammenhängende App an? Dies sind Produktfragen, keine aus automatischen Tests ableitbaren Erfolge.

## Kurze Referenzprüfung

- [Apple Design Tips](https://developer.apple.com/design/tips/): Aktionshierarchie, Ausrichtung, komfortable Touch-Flächen. Übernommen als Prinzip, keine visuelle Kopie.
- [Skritter – Writing Canvas / Buttons](https://docs.skritter.com/article/267-mobile-writing-canvas-and-study-screen-buttons): Schreibfläche als Hauptobjekt, Werkzeuge nachgeordnet. Keine Übernahme von Bewertungssystemen.
- [Du Chinese – Einführung](https://duchinese.net/blog/2021/04/14/welcome-to-du-chinese/) und [Pleco Reader](https://android.pleco.com/manual/240/reader.html): direkt erschließbarer Text und bedarfsabhängige Unterstützung. Kein Wörterbuch hinzugefügt.
- [Busuu – Speaking Practice](https://help.busuu.com/hc/en-us/articles/19367617005970-Mastering-language-skills-through-speaking-practice) und [Babbel – Speech Recognition](https://support.babbel.com/hc/en-us/articles/19211305815570-Speech-recognition): klare Sprechinteraktion als Referenz. Deren automatische Aussprachebewertung wurde ausdrücklich nicht übernommen.

Diese Quellen sind Produktmuster, keine Evidenz für die Lernwirksamkeit unserer konkreten Gestaltung. LEARNING_ARCHITECTURE.md bleibt fachlich maßgeblich.
