# v0.5 — Interaction-Regeln

Basis: produktives `main` / `bebf0f8`, App `b482fa6`, am 2026-09-30 über den öffentlichen Service Worker bestätigt. Dieser beauftragte Konsolidierungsblock betrifft bestehende Bedienung, nicht Lernlogik oder Designsprache.

## Verbindliche Regeln

1. Orientierung → Stimulus → Aufgabe → Handlung → unmittelbare Rückmeldung → kompakte Referenz mit Audio → Weiter. Unterschiedliche Lernoperationen behalten ihre eigenen Flächen.
2. Die konkrete Frage ist wichtiger als die Bedienanweisung. Antwort und Korrektur bleiben am Handlungsort, auch beim Gesamtvergleich. Ein relevanter Gesprächsauftrag bleibt nach Abgabe sichtbar.
3. Vollständig richtig, fehlende Information, konkrete Abweichung und unsicherer Gesamtvergleich bleiben unterscheidbar. Unterstützung wird benannt, nicht als unabhängiger Abruf ausgegeben. Es gelten ausschließlich vorhandene Befunde; keine neue Bewertung.
4. Gemeinsame Funktionen verwenden gemeinsame Controls: Weiter mit Text/Pfeil, Wiedergabe mit offenem Play-Symbol, Hilfen/Details nachgeordnet. Primäre Selbstbericht-Optionen dürfen keine richtige Antwort suggerieren.
5. Details verändern keine Größe/Position des Bezugsobjekts. Schließen per Tastatur führt zum auslösenden Control zurück; ein Außenklick stiehlt keinen Fokus.
6. Nach Abschluss treten nicht mehr nutzbare Werkzeuge zurück. Optionale Wiederholung bleibt sekundär. Keine neuen Pflichtaktionen, keine Antwort vor dem bestehenden Freigabepunkt.
7. Kurze, ruhige Einblendung von Rückmeldungen mit bestehenden 200 ms; Controls/Details 140 ms. Keine Animation zwischen Aufgaben, keine Höhenanimation oder Belohnung. Reduced Motion deaktiviert UI-Bewegung.
8. Systemschrift, Farben, Abstandsmaß und 44-px-Bedienziele bleiben. Referenzen sind kompakter als Lernstimuli. Lange Texte dürfen umbrechen; kein horizontaler Lern-Scrollbereich.

9. Text braucht eine gegenwärtige Funktion: Orientierung, Handlung, Lerninformation oder Feedback. Dopplungen mit Frage, Layout oder Control entfallen. Grenzen der Bewertung, Speicherfolgen, fachliche Erklärungen und zugängliche Controlnamen bleiben explizit.

## Produktiver Bestand und Prüfung

| Fläche / Zustände | Bestehendes gutes Muster / konkrete Abweichung |
| --- | --- |
| Einführung: Hören, Tonfokus, Hanzi, Verknüpfung; bekanntes Encounter; Entdeckung | Bestehende Einführungsgates und progressive Details erhalten. |
| Hören / Lesen: offen, Hilfe, Antwort richtig/falsch, Wiederaufnahme | Gemeinsame Antwortfläche vorhanden; Unterstützung bisher nach Auswertung nicht sichtbar benannt. |
| Produktion: richtig, Ton fehlt/falsch, Schreibfehler, Teilantwort, Gesamtfehler, Hanzi, Reload | Gemeinsame vierteilige Grammatik erhalten; neue Rückmeldung bisher ohne gemeinsame Einblendung. |
| Schreiben: Demo, Fading, Abruf, Hilfe, Fehler, Erfolg, Papiervergleich, Wiederholung | Schreibfläche/Ink erhalten; deaktivierte Werkzeuge liegen nach Abschluss zwischen Ergebnis und Weiter; Handlungsanweisung bleibt fälschlich stehen. |
| Bildschirmfreier Abruf / Papierabruf | Selbstbericht bleibt ausdrücklich Selbstbericht; positive Antwort bisher visuell gegenüber Unsicherheit bevorzugt. |
| Tonlabor: Beispiele, Hörfrage, Ergebnis, Notation, Wiederaufnahme | Aktive Beispielzeile verschiebt Sprache durch hinzugefügten Rand/Innenabstand. Rückmeldung ohne bestehendes Einblendungsmuster. |
| Aufnahme / Wiedergabe / Vergleich | Bereits gemeinsame Kontrollen, Sperren und Referenznähe. Capture, Codec, Pegel und Logik bleiben unverändert. |
| Zahlenfolge: Auswahl, Korrektur, Ergebnis, Reload | Eigene Auswahl bleibt sichtbar; vollständige Referenz bisher im selben farbigen Absatz wie Ergebnis; Änderungsanweisung bleibt nach Abschluss stehen. |
| Mini-Transfer: Hören, Antwort, Merkmale, Auflösung, Transkript, Reload | Eigene Audio-/Weiter-Buttons; Frage verschwindet nach Abgabe; lange technische Erläuterung trennt Antwort und Auflösung. |
| Einstellungen / Sicherung / seltene destruktive Aktion | Vorhandene Staffelung und Hinweise funktionieren; keine Änderung nötig. |

Die drei `tone-recall`-Definitionen werden vom aktuellen Continuous Planner nicht neu eingeplant; sie bleiben als gespeicherte Altaufgaben unverändert kompatibel. Das produktiv erreichbare Tonlabor einschließlich Hörfragen und Notation ist geprüft. Nicht erreichbare historische Abschluss-/Testansichten sind kein Designmaßstab. Visuelle Fixtures verwenden die echten Produktionskomponenten mit passenden lokalen Lernständen, keine neue produktive Navigation.

## Gebündelte Umsetzung

- `PlaybackControl` übernimmt ausschließlich die gemeinsame Darstellung. Einzelclip und Gespräch behalten ihre unterschiedlichen bestehenden Medienabläufe (Pause vs. Gespräch anhalten/neu beginnen).
- Transfer: Frage statt Instruktion dominant, nach Abgabe erhalten; Antwort → Auflösung direkt benachbart; ehrliche Evidenzgrenze sichtbar, Zählung/Erklärung unter Antwortmerkmalen. Transkript optional; gemeinsames Weiter.
- Textantworten mit tatsächlich angezeigter Hilfe tragen einen ruhigen Hilfshinweis. Die vorhandenen Erfolg-/Ton-/Fehlerzustände bleiben erhalten.
- Schreibabschluss: fertiges Zeichen, Ergebnis, Weiter/optionale Wiederholung; deaktivierte Werkzeuge verborgen, Druck weiter erreichbar. Zahlenfolge: eigene Reihenfolge, Ergebnis, separate Referenz.
- Selbstbericht-Sicher/Unsicher gleichgewichtet, ohne Änderung von Auswahl oder Wirkung. Tonmarkierung belegt ihren Platz bereits vor Wiedergabe. Detail-Schließen stellt Tastaturfokus wieder her.
- Gemeinsame unsegmentierte Hanzi-Darstellung passt die Schrift an die wirkliche Referenzbreite an. Keine neue Segmentierung. Bestehende Wortgruppen und Korrekturgrößen bleiben stabil.
- 200-ms-Einblendung auch für Produktions-/Ton-/Transferfeedback und Weiter; keine doppelte Animation der darin enthaltenen Antwort. Keine neue Aufgabenübergangsanimation.

Bewusst erhalten: Einführungsschritte, Aufnahme/Replay/Retake und deren Sperren, Fading samt tatsächlicher Handschrift, Papier-/bildschirmfreie Operationen, Entdeckungsinhalt, Einstellungen, vier Produktionsfeedbackzustände und alle fachlichen Verträge. Änderungen hier wären ohne weiteren Befund keine Konsolidierung.

## Textökonomie im selben Block

Alle produktiven Textquellen geprüft: `de.ts`, `LessonRunner`, Einführung/Encounter/Details, Produktionsfeedback, Tonlabor/Notation, Zahlenfolge, Schreibzustände/Level-Instruktionen, Papier-/bildschirmfreier Abruf, Aufnahme/Playback und Transfer. Nicht erreichbare historische Rundenabschluss-Texte bleiben unberührt.

| Quelle / Moment | Entscheidung und Funktion |
| --- | --- |
| Einstieg | Konkretes Hören/Verstehen/Üben statt allgemeiner Dreierformel; „Ohne Konto.“ erhalten. Keine Erklärung fehlender Punkte/Streaks, keine technische Versionsnummer. Pilotkennzeichnung und lokale Speicherung bleiben. |
| Einführung | „Erst nur hören“ genügt ohne doppelte Nacherzählung. Verknüpfungscaption nur bei neuer Verbindung bekannter Wörter. Tipphinweis für Wortgruppen bleibt kurz und konkret. |
| Lernnotizen | Nur die exakt bekannte generische Füllzeile „Ein kurzer Ausdruck für dein nächstes Gespräch.“ in beiden Darstellungen ausgeblendet. Kein heuristisches Kürzen fachlicher Notizen, keine Veränderung von Contentdaten. Zähl-, Höflichkeits-, Ton- und Bedeutungsinformationen bleiben. |
| Produktionsfeedback | Fehlende/falsche Tonangabe weiterhin ausdrücklich unterschieden; doppelte Zwischenüberschrift „Mit Tönen“ entfällt. Antwort-/Korrekt-Labels sind für den Vergleich nötig. Keine Behauptung über Aussprache. |
| Transfer | Konkrete Frage statt allgemeiner Frageüberschrift; eine deutsche Instruktion, neutrales Eingabelabel. Keine zusätzliche „Vergleiche deine Antwort“-Überschrift über bereits bezeichnetem Vergleich. Rollenhinweis und Evidenzgrenze bleiben. |
| Zahlen / Schreiben | Nur aktuelle Handlung erklären; abgeschlossene Zustände enthalten keine Aufforderung zum Ändern/Schreiben mehr. Papier zeigt „Vorlage zum Vergleich“, Bildschirm die tatsächlich geschriebene Form. |
| Papier / bildschirmfrei | Doppelte Überschrift entfällt; Material, Abrufhandlung, Vergleich und ehrliche Selbsteinschätzung bleiben. |
| Tonlabor | Bedeutungsunterschied erhalten, Höranweisung nicht zweimal. Notationshilfe und Hinweis auf ungeprüfte Aussprache bleiben. |
| Aufnahme / Audio | Statuswechsel, Startsignal, Fehler und Wiederholungsanweisung sind funktional: erhalten. Kein Eingriff in Aufnahmelogik. |
| Einstellungen | Browserbindung/Sicherung verdichtet; gesperrte Schriftwahl, Importergebnis und Löschwarnung erhalten. Destruktive Bestätigung ist bewusst keine zu entfernende Dopplung. |

„Verstehen. Sprechen. Erklären.“ ist im geprüften produktiven Bestand nicht vorhanden; es wurde keine neue Ersatz-Unterzeile dafür eingeführt.
