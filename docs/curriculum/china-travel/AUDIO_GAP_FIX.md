# Vier Audio-Lücken geschlossen

20. Oktober 2026 · Nutzerauftrag: gemeinsam beheben, vorhandene Audios nutzen, nur fehlende Vollmodelle über AWS erzeugen, anschließend testen, mergen und veröffentlichen.

## Änderungen

1. **Produktionsauflösung:** 33/33 Aufgaben haben genau ein vollständiges hörbares Modell neben der entsprechenden kanonischen Textvariante, ausschließlich nach der Antwort. 32 Aufgaben verwenden vorhandene Satz-/Wortaufnahmen. Wiederverwendung verlangt gleiche Formen in Traditional und Simplified (abgesehen von Interpunktion/Leerraum) und gleiche lexikalische Tonfolge. Nur `produce:E08.C02` benötigte eine neue normale Aufnahme: `下午兩點半` / `下午两点半`, `xia4 wu3 liang3 dian3 ban4`. Keine Synthese aller 58 Varianten und keine neue langsame Aufnahme angefordert. Bestehende 572 Dateien bleiben bytegleich.
2. **Ausdrucksdetails:** 614/614 Vorkommen haben eine konkrete hörbare Referenz. Wort-ID, beide Schriftformen und Silbenzuordnung werden gegen den Satz gebunden. 501 verwenden das vorhandene lexikalische Wortmodell, ausdrücklich als „Wort einzeln anhören“. Bei 113 Vorkommen mit hinterlegten Oberflächentonabweichungen oder benachbarten dritten Tönen wird die vorhandene vollständige Satzaufnahme über „Im Satz anhören“ angeboten. Es werden keine ausgeschnittenen Satzteile oder neu geschätzten Kontextlautungen erzeugt. Die ausführbare Zuordnung in `audio-bindings.ts` ersetzt für die App die historischen `deferred_no_audio_authorization`-Metadaten des unveränderten Textkanons.
3. **Wiederholung und Hilfe:** Normale Wiederholung zählt als optionale Übung und setzt kein Hilfskennzeichen. Langsame Wiedergabe setzt das Hilfskennzeichen bereits beim erfolgreichen Start und speichert es im wiederherstellbaren Zustand. Abgeschlossene Wiedergabe wird getrennt protokolliert; reine Wiedergabe erzeugt weiterhin keine Mastery-Wertung. Dialogmodelle, neu eingeführte Voraussetzungen und Text/Pinyin-Hilfe behalten ihre eigenen bestehenden Hilfskriterien.
4. **Eine Referenz nach der Antwort:** Der ursprüngliche Hörstimulus und seine Hilfsaktionen verschwinden nach Abgabe. Die Auflösung enthält einmal die vollständige Referenz mit normaler/langsamer Wiedergabe, sofern verfügbar.

## Prüfumfang

Vollständige technische Dateiabdeckung: 517/517 kurze Referenzen und 56/56 Dialogdateien, insgesamt 573. Planbindung, Prüfsummen, PCM und Dialogmontage sind geprüft. Der Validator sperrt nun auch fehlende didaktische Referenzen für sämtliche 33 Produktionsaufgaben und 614 Ausdrucksdetails. Die neue 1,447-Sekunden-Aufnahme besteht Format-, Aktivsignal-, Clipping- und Pegel/Randprüfung ohne Warnung. Das ist keine menschliche Hörabnahme.

`npm test`: 249 Tests bestanden, einschließlich genauer Wiederverwendung, genau eines neuen Vollmodells und kontextbezogener Referenzzuordnung. UI-Text- und Resolution-Verträge aktualisiert und bestanden. `npm run build`: bestanden; alle 573 Taiwan-Dateien sind im Build/Offline-Paket.

Repräsentative Browserfälle: 32/32 Fälle in Chrome und WebKit bestanden. Gegenüber dem bestehenden 22er-Satz zusätzlich pro Browser: zweimal echte Wiedergabe mit normaler Wiederholung bzw. langsamer Hilfe samt gespeicherten Ereignissen und nur einer Auflösungsreferenz; neue und wiederverwendete Produktionsmodelle ohne vorzeitige Antwortanzeige; Ausdrucksdetails mit Einzelwort und Satzkontext. Ein Testzugriff auf das „letzte Ereignis“ wurde auf Zeitstempel sortiert, da IndexedDB nach zufälliger Ereignis-ID liefert. Nach dieser Testkorrektur sind die vier Replay-Fälle gezielt erneut ausgeführt und bestanden; die übrigen 28 Fälle waren bereits bestanden. Keine weitere allgemeine oder redaktionelle Prüfrunde.

Grenzen unverändert: AWS Zhiyu/cmn-CN ist eine Stimme; kein behaupteter Taiwan-Akzent und keine muttersprachliche Audiofreigabe. Taiwan-Wortwahl und Textkanon bleiben unverändert. Die Nutzerfreigabe zur Veröffentlichung ohne verfügbare menschliche Audioabnahme besteht fort. Der separate Feature-Worktree bleibt unberührt.

Manifest und aktuelle Zahlen: [POLLY_AUDIO_MANIFEST.json](POLLY_AUDIO_MANIFEST.json), [POLLY_AUDIO_COUNTS.json](POLLY_AUDIO_COUNTS.json). Auslieferungsnachweis wird nach erfolgreicher Veröffentlichung angehängt.
