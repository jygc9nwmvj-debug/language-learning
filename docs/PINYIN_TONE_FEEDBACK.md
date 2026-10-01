# Explizite Tonabweichung in der Produktionsauflösung — 2026-10-01

Ausgangsbasis: `main` `f7bb57e`, produktiver App-Stand `1aa6020`; lokal bereits vorhandener, zur gemeinsamen Veröffentlichung freigegebener Writing-Commit `04d31bc`. Vorab öffentlicher Service Worker SHA-256 `42bac9445b8fd80be9114e4550e68ebcf0638b7bb36f0d2674a734b50c26ac2e`. Dieser Fix verändert keine Writing-Implementierung.

## Systemische Ursache

`d-recall-dont-understand` wird wie die übrigen 17 nichtnumerischen Buffer-Recall-Aufgaben mit `assess: {toneNotation:false,neutralTone:false}` erzeugt. Das ist eine bestehende Bewertungsgrenze, kein belegter Contentfehler. `evaluateAnswer('wo3 ting1 bu4 dong4', ...)` erkennt den richtigen Ausdruck, prüft bei diesem Vertrag aber keine Töne: `result:success`, `toneNotation:unknown`, `fullyCorrect:true`. Die kanonische Prüfung mit eingeschalteten Tondimensionen erkennt dagegen `different` und die Korrektur `dong3 (dǒng)`.

Es geht somit keine bereits vorhandene Tonabweichung zwischen Bewertung und Anzeige verloren: Der Bewertungsbefund enthält sie bei ausgeschalteter Dimension gar nicht. `ProductionFeedback` verwendete denselben eingeschränkten Vertrag und übernahm den gespeicherten Erfolgszustand für „Richtig.“. Auch explizit falsche neutrale Töne wurden bei `neutralTone:false` nicht sichtbar korrigiert. Die fünf älteren Tonaufgaben können über fehlende Einführungsnachweise ebenfalls einen effektiven Vertrag ohne Tonbewertung erhalten.

## Begrenzte Korrektur

`displayInterpretation` ergänzt ausschließlich zur Darstellung eine zweite Auswertung mit den bestehenden kanonischen Tondaten. Nur ein tatsächlich erkannter expliziter Unterschied überschreibt den Darstellungsbefund; reine Auslassungen bleiben beim effektiven Aufgabenvertrag. Derselbe Befund steuert die eindeutige silbenweise Diagnose und verhindert uneingeschränktes Erfolgsfeedback. Die bestehende Vergleichsgrammatik bleibt: fehlerhafte Eigenleistung markiert, unmittelbar folgende kanonische Referenz, Inhaltsbestätigung und Hinweis auf die Tonabweichung. Bei uneindeutiger Segmentierung oder offenem Namensslot bleibt die vollständige Gegenüberstellung erhalten.

Evaluator, akzeptierte Inhaltsantworten, gespeicherte Feedbackdaten, Ereignisse, Mastery, Scheduling, Planner, Content und Audio werden nicht geändert. Insbesondere darf intern weiterhin `success` und die bisherige Meldung gespeichert sein; die sichtbare Auflösung rekonstruiert den genaueren Darstellungsbefund auch nach Reload. Keine zweite Bewertung, keine Migration.

## Strukturelle Coverage — exhaustive innerhalb der definierten Population

Population: sämtliche 23/23 aufgelösten `recall`-Definitionen; maschinell gegen sämtliche Definitionen mit `target:production` abgeglichen. 18 deklarieren keine Tonbewertung, fünf deklarieren Tonbewertung ohne Neutraltonbewertung. Alle verwenden denselben Evaluator-/Rendererpfad. Ausgeschlossen: Bedeutungsantworten bei Lesen/Hören, separate Tonnotation/-wahrnehmung, Writing, Reihenfolge sowie Transfer, da diese keine freien Pinyin-Produktionsantworten über diesen Pfad bewerten.

Pro Definition werden kanonische Eingabe, fehlende Töne und pro Silbe eine explizit falsche Tonalternative als Zahl und Diakritikum geprüft, jeweils mit deklariertem und vollständig abgeschaltetem Tonvertrag. Das erfasst 69/69 Silbenpositionen in 23/23 Definitionen; keine Behauptung vollständiger Abdeckung aller möglichen Nutzereingaben. Jeder Versuch bleibt inhaltlich erfolgreich, und die Bewertungsdaten bleiben vor/nach Darstellungsdiagnose identisch. Namensslots und neutrale Silben sind enthalten.

Die folgende Spalte zeigt, wie viele der gezielt mutierten Silben bei der **bisherigen deklarierten** Bewertung als vollständig richtig gelten. Bei zusätzlich abgeschalteter effektiver Tonbewertung sind sämtliche 23 Definitionen betroffen. Dieses Verhalten der Lernbewertung bleibt erhalten; korrigiert wird die sichtbare Auflösung.

| Definition | Tonbewertung deklariert | Explizite Abweichung bisher uneingeschränkt erfolgreich / Silben |
|---|---|---:|
| recall-nihao | ja | 0/2 |
| recall-wojiao | ja | 0/2 |
| recall-askname | ja | 2/6 |
| recall-xiexie | ja | 1/2 |
| recall-zaijian | ja | 0/2 |
| d-recall-dont-understand | nein | 4/4 |
| d-recall-say-again | nein | 5/5 |
| d-recall-speak-slowly | nein | 5/5 |
| d-recall-what | nein | 2/2 |
| d-recall-dont-know | nein | 4/4 |
| d-recall-qing | nein | 1/1 |
| d-recall-welcome | nein | 3/3 |
| d-recall-duibuqi | nein | 3/3 |
| d-recall-meiguanxi | nein | 3/3 |
| d-recall-wanan | nein | 2/2 |
| d-recall-how-are-you | nein | 3/3 |
| d-recall-im-fine | nein | 3/3 |
| d-recall-and-you | nein | 2/2 |
| d-recall-ren | nein | 1/1 |
| d-recall-deguo | nein | 2/2 |
| d-recall-zhongguo | nein | 2/2 |
| d-recall-nationality | nein | 5/5 |
| d-recall-im-german | nein | 5/5 |

Damit betrifft der Problemtyp ohne zusätzliche Einführungssperre bereits 20/23 Definitionen: 18 vollständig tonunbewertete sowie `recall-askname` und `recall-xiexie` bei ihren neutralen Silben.

## QA-Grenzen

Gezielte Funktionsprüfung: 56 Tests über explizites Tonfeedback, Darstellungsdiagnose, bestehende Bewertung/Einführungsgrenzen und Resolution Contract bestanden. Produktionsbuild einschließlich Typprüfung, Contentvalidierung und Quell-/Text-/Resolution-Verträgen bestanden. Keine neuen UI-Texte; geänderte Ausgaberoute und interne Kennzeichnung explizit im Inventar geprüft.

Browserprüfung ist repräsentativ: explizit falsches `dong4`, korrektes `dong3`, fehlende Tonzahlen ohne Tonbewertung, falsche/fehlende Töne mit Tonbewertung und expliziter Neutraltonfehler; jeweils Vergleich, räumliche Zuordnung, 320/390/1280 Pixel, Reload und unveränderte gespeicherte Bewertung. Dazu unmittelbar betroffene Writing-Zustände des mitzuliefernden Commits. Keine allgemeine Audio-/Recording-QA oder neue Planner-Prüfung.

Abschluss: 44/44 ausgewählte Browserfälle in Chrome/WebKit bestanden (36 Feedbackfälle, acht Writing-Fälle). Screenshot des beobachteten Falls bei 390 Pixeln geprüft. Der erste Lauf erreichte wegen einer fremden Website auf dem üblichen Testport nicht die Mandarin-App und wurde beendet; vollständiger erfolgreicher Lauf auf isoliertem Port 4187. Kein Produktfehler daraus abgeleitet.
