# Überschriften und Beschriftungen im v2-Stand

2026-10-20 · Ausgangspunkt `02ae8b0` · isolierter Zweig `feature/mobile-learning-v2`. Keine Veröffentlichung.

## Befund zur früheren Prüfung

Die frühere Prüfliste enthielt die Moduslabels ausdrücklich. Für „Aus dem Gedächtnis“ und „Schreiben lernen“ stand dort als Begründung: „Identifies app, learning operation or scaffold/result state, rather than duplicating a specific next action.“ Für „Lesen“ und „Hören“ wurde Navigation/Orientierung genannt. Diese Entscheidung war im konkreten Bildschirm zu großzügig: Die eigentliche Anweisung erklärt die Handlung bereits. Vollständige Texterfassung hat die kontextuelle Redundanz nicht verhindert. Die frühere [Dokumentation](../UI_TEXT_COVERAGE.md) bleibt als historischer Bericht erhalten; diese Nachprüfung korrigiert die funktionale Einschätzung, nicht rückwirkend die damaligen Testergebnisse.

## Umgesetzte Entscheidungen

| Bereich | Entscheidung und konkreter Grund |
| --- | --- |
| Regulärer Aufgabenrahmen | Die Moduszeile mit „Aus dem Gedächtnis“, „Lesen“, „Hören“, „Zuordnen“, „Kennenlernen“, „Schreiben lernen“, „Im Gespräch“ und den übrigen Verzweigungen entfällt. Konkrete Frage/Anweisung und dargestellter Gegenstand bleiben. |
| Vorheriges ansehen | „Noch einmal ansehen“ entfällt als zusätzliche Überschrift. Der Hinweis auf freiwillige Übung, Rückkehr und gegebenenfalls unterstützten Abruf erklärt den besonderen Zustand bereits genauer. |
| Startseite | „Private Lernversion.“ entfällt. App-Name, Zweck, Startknopf, Kontofreiheit und lokale Speicherung sind die hilfreiche Erstorientierung. |
| Einführung | „Jetzt nur das Schriftbild“ und „Bekannte Wörter, neue Verbindung“ entfallen. Die konkrete Betrachtungsanweisung beziehungsweise Form/Klang/Bedeutung bleiben. „Erst nur hören“ und „Achte auf die Tonzeichen“ bleiben: Sie erklären in diesen Phasen die tatsächliche Handlung. |
| Sprachliche Zusatzinformation | „Eine kleine Entdeckung“ wird in beiden Renderpfaden zu „Sprachhinweis“. Das benennt den Inhalt des aufklappbaren Elements, ohne dekorative Ankündigung. Die sprachliche Erklärung bleibt unverändert. |
| Schreiben | Zusätzliche Scaffold-Titel wie „Mit voller Vorlage“ entfallen über der konkreten Schreibanweisung. Auch das sichtbare Etikett „Schreibziel“ entfällt neben Bedeutung/Pinyin; der zugängliche Name bleibt. „Erst zuschauen“, die Schreibanweisungen und die Unterscheidung eigene Schrift/Vorlage bleiben. |
| Dialog | Der wiederholte Titel „Ein vertrautes Gespräch“ entfällt. Sprecher, konkrete Frage und Turn-Fortschritt bleiben. Der Schluss wird von Titel plus erklärendem Absatz zu „Gespräch abgeschlossen.“ verdichtet; keine zusätzliche Kenntnisbehauptung. |
| Schreibblatt | „Mandarin · 01“ entfällt; „Erster Kontakt · Schreibzeit“ wird zu „Schreibblatt“. Konkrete Arbeitsanweisungen, Beispiele und Selbstcheck bleiben. |
| Audiohinweis | Die Aufforderung, auf „Play“ zu tippen, benennt jetzt das tatsächlich verwendete Lautsprechersymbol. Reine Copykorrektur, keine Änderung der Wiedergabe. |

## Bewusst beibehalten

Die Prüfung betrifft zusätzlichen Informationswert im tatsächlichen Zustand, keine pauschale Verkürzung:

- Konkrete Aufgabenfragen, Bedeutungs-/Schreibziele und Einschränkungen wie „Schreibe ohne Vorlage“ bleiben. „Aus dem Gedächtnis“ kann Bestandteil einer notwendigen Schreibanweisung sein, obwohl es als zusätzliche Modusüberschrift entfällt.
- Eingabebezeichnungen, „Prüfen“, „Weiter“, Hilfe, Auswahl- und Zuordnungsanweisungen bleiben. Sie erklären Eingabe, Reihenfolge oder nächste Handlung.
- Eigene Antwort versus Referenz, eigene Aufnahme versus Beispielaudio und eigenes Schriftbild versus Vorlage bleiben unterscheidbar. Zugeordnete Paare, Tonkorrekturen und unsichere Bedeutungsantworten bleiben verständlich.
- Aufklappbare Ausdrucks-/Zeichenhilfen behalten Namen. Sprecher und Turn-Fortschritt im Dialog sowie passende fachliche Ton-/Notationsüberschriften haben eine konkrete Funktion.
- Mikrofon-/Speicherfehler, Offlinezustände, Schriftwahl, Sicherung, Datenverlust, Installation und Rücksetzbestätigung bleiben. Sie erklären eine Handlung, Einschränkung oder Folge, die das Control allein nicht vermitteln kann.
- Zugängliche Namen/Tooltips bleiben auch bei visuell beschriftungslosen Icons erhalten.

## Abdeckung und Grenzen

**Exhaustive Quellenerfassung dieser Prüfung:** 27/27 TSX-Dateien der regulären App, einschließlich Komponenten ohne eigene sichtbare Texte; dazu der deutsche UI-Katalog, die Schreibstufen-/Dialogdefinitionen und 131/131 aufgelöste Aufgabenprompts. Die Promptfamilien wurden mit ihrem tatsächlichen Renderpfad abgeglichen; bereits unterdrückte generische Encounter-/Writing-Titel werden nicht als neue Entfernung gezählt. App-/Share-Metadaten bleiben als notwendige Benennung erhalten. Die bestehenden UI-Textentscheidungen und Quellkontexte wurden nachgezogen; nicht mehr gerenderte Katalog-/Stufentitel sind ausdrücklich als ungenutzt markiert.

Die 27 TSX-Quellen sind `main.tsx`, `app/{App,InstallAccess,LessonRunner}`, `core/audio/Recorder`, `core/exercises/{AudioButton,Controls,CorrectionVersions,Icon,InteractionScope,LearningViewport,Resolution,SpeakingPractice}` und `languages/mandarin/components/{AttentionIntroduction,DialogueExercise,Exercise,HybridRecall,MatchingExercise,MeaningFeedback,MiniTransfer,NumberSequence,PhraseForm,ProductionFeedback,SlotReference,ToneLab,Worksheet,WritingExercise}`. `WritingPad.tsx` ist ungenutzt; der Test-Harness und DEV-Werkzeuge sind keine reguläre Lernoberfläche. Lizenztexte, Browserdialoge und neue sprachliche Content-QA sind ausgeschlossen. Domain-Glossen/Erklärungen wurden nicht redigiert.

**Representative Renderingprüfung:** 18 Chrome-/WebKit-Fälle: Antwort/Korrektur bei 320/390/1280 px inklusive unverändertem Aktionsanker und Reload, kleine Einführung/Schreiben/Tonübungen, kompletter Dialog mit Wiederaufnahme sowie Start/Einstellungen/Schreibblatt und aufklappbarer Sprachhinweis. Funktionale statt dekorative Orientierung bleibt sichtbar. WebKit-Bilder von 320/390/1280-Feedback, Einstellungen und Sprachhinweis wurden zusätzlich visuell geprüft; kein Anspruch, jede mögliche Content-/State-/Browserkombination einzeln gesehen zu haben.

31 unmittelbar relevante Funktions-/Verzeichnistests und der Produktionsbuild bestanden. Geänderte alte Testselektoren wurden nur an die entfernten oder umbenannten Texte angepasst; diese alten Suites wurden nicht pauschal als erneut bestanden gemeldet. Kein Audio-/Recording-Qualitätstest und keine allgemeine Regression.

Content, Bewertung, Lernstände, Planner, Mastery, Scheduling, Audioassets und Recordingverhalten sind unverändert. Die Regeln für funktionale Begründungen im [Coverage Contract](../COVERAGE_CONTRACT.md) verlangen jetzt ausdrücklich den Abgleich mit der bereits vorhandenen konkreten Anweisung und den Controls. Eine automatische Klassifikation soll diese Beurteilung nicht ersetzen.
