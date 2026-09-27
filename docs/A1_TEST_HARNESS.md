# A1 Test Harness

Route: `/__test/a1` (auch mit abschließendem Slash).

Nur Vite Development oder expliziter Test-Build aktiviert die Seite. Der normale Produktionsbuild
enthält keinen Harness-Chunk und zeigt auf dieser Route einen Hinweis. Kein Link in der Produkt-UI.
Cloudflare baut ausschließlich den Preview-Branch `a1-test-harness` im Modus `test`; alle anderen
Branches bleiben im Produktionsmodus. Dies ist Build-Trennung, keine Authentifizierung.

## Benutzung

Lernschritt auswählen, beliebige Eingabe prüfen, „Reset / erneut testen“ drücken. Reset remountet
die echte Exercise-Komponente und leert die lokalen Test-Ereignisse. „Weiter“ protokolliert nur
lokal das Schrittende und startet keinen Scheduler. Alle vorhandenen Schritte außer Abschluss
sind auswählbar, einschließlich aller fünf Text-Recall-Aufgaben, Vorstellung, 好 und 谢谢.
Bei 好 prüft `read-hao` die deutsche Bedeutung; für `hao3` unten den Interpreter verwenden.

Der direkte Interpreter verwendet dieselbe interpretAnswer-Funktion und dieselben kanonischen
Items wie die App. Er zeigt Feedback und strukturierte Ergebnisse, einschließlich der getrennten
Tonnotation und weiterhin unbekannten gesprochenen Töne. Testname und Schrift sind nur lokal.

Keine Imports von LessonRunner oder Datenbank im Harness. Alle Callbacks schreiben ausschließlich
in React-State. Kein LocalStorage, IndexedDB, Research Log oder Service-Worker-Registrierung.
Reload verwirft Testeingaben. Die separate Preview-Origin trennt zusätzlich von echten Lerndaten.
Die Test-Version enthält weiterhin die normale App auf `/`; für isolierte Tests immer die Harness-Route verwenden.

## Lokal und Abnahme

- `npm run dev`: Route direkt verfügbar.
- `npm run build:test` und `npm run preview`: gebauter Teststand.
- Nach `npm run build:test`: `npm run test:harness` (Chrome + WebKit, eigenes Preview auf 4181).
- `npm run build`: normale Version wiederherstellen.
- Preview aktualisieren: geprüften Commit auf `a1-test-harness` pushen.

Geprüft: 31 Node-Tests; 28 bestehende Chrome/WebKit-Tests (Trust, Continue, Hosting);
2 Harness-Browsertests für alle Recall-Auswahlen, wiederholte korrekte/fehlende/falsche Tonnotation,
好, 谢谢, Reset, Reload, Handybreite und gesperrte persistente Schreibzugriffe/DB-Öffnungen.
Produktionsroute und Ausschluss des Harness-Chunks separat geprüft.
Kein Test ersetzt eine Prüfung auf dem echten iPhone; Audio und Handschrifterkennung wurden hier nicht neu bewertet.

## A2 extension

`/__test/a1#audio` opens the isolated audio panel: microphone, immediate native playback, retake/reset, four teaching contours and all canonical natural/careful_slow pairs. See [A2 report](BUILD_A2_AUDIO_TRUST.md). No persistence added.
