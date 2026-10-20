# Lokale Design- und Bedienabnahme v2

2026-10-20 · Umsetzung auf `feature/mobile-learning-v2`, ausgehend von `b25d913`. Die Buttonform **Offene Aktion** und der lokale App-Stand wurden vom Nutzer bestätigt. Anschließend wurden Abgleich mit aktuellem `main`, Commit, Main-Push und Deployment ausdrücklich freigegeben. Frühere lokale Grenzen in diesem Bericht dokumentieren die jeweiligen Zwischenstände; der folgende Integrationsnachtrag hält den Release-Abgleich fest.

## Gezielte Korrekturen

| Befund im Bildschirmvergleich | Lokale Korrektur |
| --- | --- |
| Kopfzeile, Lernbereich und Aktionsbereich verwendeten am Desktop unterschiedliche Achsen; einzelne Weiter-Buttons standen mittig. | Gemeinsame linke Inhaltsachse und abgestimmte Maximalbreite für Kopfzeile, Inhalt und Aktionen. Bestehende Hauptaktionen und Beschriftungen bleiben. |
| Hanzi waren in kurzen Aufgaben trotz verfügbarem Raum klein. | Gemeinsame responsive Hanzi-Größe angehoben. Kein vom geöffneten Detail abhängiger Größenwechsel und keine dynamische Vertikalzentrierung. |
| Native Eingabefokusränder ragten über den engen Innenabstand hinaus. | Fokusrand liegt innerhalb des Eingabefeldes; Abstand zwischen Bezeichnung und Feld vereinheitlicht. |
| Zuordnung: unterschiedliche Kartenhöhen, kleine Hanzi, rechts blasse Bedeutungen und wiederholte Statuswörter. | Gleich hohe, vollflächig antippbare Kärtchen in zwei unabhängig angeordneten Spalten; 96 px Mindesthöhe, 40 px Hanzi, zurückhaltende 2-px-Ecken. Auswahl durch Fläche/Kontur und kurzen Status. Fehler lokal mit Farbe und Kreuz. Treffer mit grünlicher Fläche und Häkchen; „Zugeordnet“ bleibt ausschließlich für assistive Darstellung. Karten bleiben an ihrer Position. |
| Selbstbewertung bei lautem Abruf und Papierübung verwendete den gemeinsamen Aktionsbereich nicht. | Vorhandene Antwortmöglichkeiten als zusammengehörige Aktionsgruppe im sichtbaren unteren Bereich. Bezeichnungen, Ergebnisse und Skip-/Später-Funktionen bleiben erhalten. |
| Vierstellige Zahlenfolgen brachen im Vergleich in ein starres Dreierschema um. | Anzahl der Spalten aus der tatsächlichen Folge abgeleitet; eigene Folge und Referenz mit derselben vollen Breite unter ihren Labels. Die Auswahlzeichen bleiben bei der vierstelligen Folge ebenfalls in einer Reihe. |
| Transfer hatte einen großen leeren Wiedergabestatus und einen nicht gemeinsam angedockten Submitbereich. | Leerer Status belegt keinen Raum; vorhandene Submit-/Nichtwissen-Aktionen verwenden den gemeinsamen Aktionsbereich. Submit-Typ explizit, Callback unverändert. Lange Aufgabenfrage an die übliche Instruktionsgröße angepasst. |
| „Vorheriges“ verwendete nicht denselben Viewport und konkurrierte mit dem versteckten aktuellen Aktionsbereich. | Eigener gemeinsamer Viewport für die Inspektion; versteckter Bereich beansprucht den Dock nicht. Aktuelle Eingabe bleibt beim Zurückkehren erhalten. |

Die vorhandene Icon-Steuerung, progressive Offenlegung, kompakte Korrekturgrammatik und Lernlogik werden beibehalten. Die allgemeinen Buttons wurden noch nicht mit einer der vorgeschlagenen Gestaltungen neu eingekleidet.

## Zuordnung: Umfang und unveränderte Grenzen

Die vorhandenen **20 Setdefinitionen** verwenden denselben Renderer: Form/Bedeutung, Audio/Form und die bereits im v2-Zweig vorhandenen frühen Pinyin/Form-Varianten. Keine neuen Sets, Relationen, Eligibilityregeln oder Distraktoren. Tippen/Klicken bzw. native Tastaturaktivierung bleiben die Interaktion. Kein Swipe und kein Drag-and-drop.

Die zweite Auswahl bleibt der Commit. Fehler und Restpaar behalten dieselbe Evidenzwirkung; keine zusätzliche Mastery-, Intervall- oder Recallwirkung. Audio-Karten bleiben über die vorhandene Steuerung erneut bedienbar. Die Arbeit betrifft deren Oberfläche, nicht Audioqualität oder Aufnahmeverarbeitung.

## Abdeckung und Ergebnisse

**Exhaustive strukturelle Abdeckung, klar begrenzt:** Die bestehenden 20 Setdefinitionen werden durch die vorhandenen Matchingtests erfasst. Der gemeinsame Renderer ist an diese Definitionen gebunden. Die bestehenden Verzeichnisse erfassen weiterhin 131/131 Aufgabendefinitionen und 78 UI-Quellen. Geänderte Ausgabewege, sichtbare/zugängliche Texte und Source-Fingerprints wurden ausdrücklich geprüft. Diese Zähler sind kein visueller Qualitätsnachweis für alle möglichen Zustände.

**Representative Bildschirmvergleich:** 51 benannte Zustände aus 16 Familien: Start, Einstellungen, Systemhinweis, Einführung, Textproduktion, Lesen, Hören, Schreiben, Töne, Matching, Dialog, lauter Abruf, Papier, Zahlenfolge, Transfer und Inspektion. Aufgenommen in Chrome bei 320×568, 390×844 und 1280×800 sowie WebKit bei 390×844. Vorher-/Nachher-Bilder und Messdaten liegen lokal unter `work/mobile-v2/design/{before,after}`. Die Kontaktbögen und ausgewählte Originalbilder wurden visuell geprüft; das ist keine Prüfung jeder Content-/Zustandskombination.

Die anfänglichen restaurierten Feedback-Fixtures enthielten keinen gespeicherten Bewertungskontext und zeigten dadurch den vorgesehenen alten, unmarkierten Fallback. Für den abschließenden Atlas wurde der Kontext ergänzt. Daraus wird keine vermeintliche Änderung der produktiven Bewertungs- oder Feedbacklogik abgeleitet. Die lokale Feedback-Prüfansicht führt eine echte Eingabe/Bewertung aus.

**Representative Funktionstests:**

- 56 unmittelbar relevante Unit-/Verzeichnistests aus Matching, Learning v2, Resolution und UI-Text bestanden.
- 40 bestehende Chrome-/WebKit-Bedienfälle bestanden, weil der gemeinsame Aktions-/Viewportbereich mehrere bestehende Familien betrifft: unter anderem echte Eingabe/Korrektur, Wiederaufnahme, Einführung, Schreiben, Tonanzeige, Dialog, Matching, große Schrift und modellierte Keyboardgröße. Keine allgemeine Regression außerhalb dieses UI-Blocks.
- 12 gezielte Kärtchenfälle: drei vorhandene Relationen × vier Browser-/Viewportkonfigurationen. Gleiche Kartenhöhe und unveränderte Positionen bei Auswahl, Fehler und Treffern; Fehlerzeichen, unterstützte Wiederholungen, Restpaar, native Tastaturaktivierung, Wiederaufnahme ohne doppelte Paarereignisse und unveränderte Relations-/Sessiondaten. Nach der finalen Umstellung des Trefferlabels auf Farbe/Häkchen erneut ausgeführt; aktuelle Bilder unter `work/mobile-v2/design/cards`.
- Vier gezielte Layoutfälle für gemeinsame Achsen, vierstellige Folgen, sichtbare Selbstbewertungsaktionen und Rückkehr aus „Vorheriges“ mit erhaltener Eingabe bestanden.
- Produktionsbuild sowie Text-/Resolutionverzeichnisse bestanden. Nach der letzten Darstellungsänderung die betroffenen Vertragsprüfungen erneut ausgeführt.

Die Kärtchentests simulieren Medienereignisse ausschließlich zur Prüfung von Auswahl, Wiederbedienung und unveränderter Paarwertung. Keine akustische QA, keine Recording-Reliability-Prüfung, kein Safari-Pegeltest, keine neuen Audioassets. Keine Steuerung des persönlichen Safari und keine reale Lernerdatenbank verwendet.

Auf 320×568 bleibt längerer Hilfe-/Detail-/Transferinhalt teilweise intern scrollbar. Der gemeinsame Aktionsbereich bleibt sichtbar. Physische Geräte, reale Bildschirmtastaturen, jede mögliche Spracheingabe und vollständige Screenreader-Abnahme sind durch diese Stichprobe nicht abgedeckt.

## Lokale Prüfung und verbleibende Auswahl

`http://127.0.0.1:4192/review.html` stellt den gebauten App-Code mit eigens abgegrenzten lokalen Prüfdaten bereit. Direkt auswählbar sind drei Matchingrelationen, Länderbezeichnungen, echte Textkorrektur und ein frischer Lernstart. Die Startseite der regulären lokalen Vorschau bleibt auf Port 4187. Prüfeinstieg und Fixtures liegen ausschließlich im ignorierten Arbeitsverzeichnis, nicht in `dist` des auslieferbaren Builds. `node work/mobile-v2/prepare-review.mjs` erneuert die lokale Buildkopie; ausschließlich ihr Worker nimmt die Prüfseite vom App-Navigationsfallback aus, damit ein Neuladen die Prüfauswahl nicht verdeckt. Der auslieferbare Worker bleibt unverändert.

Die allgemeine Button-Gestaltung ist als gemeinsame Entscheidung offen. Zur Auswahl stehen eine offene Textaktion mit deutlichem rundem Pfeil, eine klare Kontur sowie eine flache Aktionsleiste. Die Vorschläge werden im selben Lernkontext gezeigt und sind noch nicht in den App-Code übernommen. Referenzen sind die frei nutzbaren [Uiverse-Buttons](https://uiverse.io/buttons), insbesondere die zurückhaltenden [Pfeil-/Textansätze](https://uiverse.io/alexmaracinaru/empty-moose-12). Die separate Gestaltungsprobe ist keine zusätzliche Lernaufgabenfamilie.

Content, akzeptierte Antworten, Assessment, Mastery, Scheduling, Planner, Ereignissemantik, Audioassets und Recording bleiben unverändert. Ein Curriculum- oder Audio-Produktionsschritt gehört nicht zu dieser Abnahme.

## Freigegebene Ergänzung: zwei Fehlerstufen bei der Zuordnung

2026-10-20, nach Sichtprüfung des lokalen Kärtchenstands: Der erste Fehlversuch je Ausgangskärtchen markiert nur die gewählte Fehlpaarung und lädt zum erneuten Versuch ein. Er nennt und markiert das richtige Gegenstück noch nicht. Ab dem zweiten Fehlversuch derselben Ausgangskarte wird die richtige Zuordnung auf der Gegenseite hervorgehoben und knapp benannt. Beim erneuten Auswählen dieser Karte bleibt die Auflösung erkennbar; die erste Verwechslung einer anderen Karte erhält weiterhin nur Fehlerfeedback. Es gibt keine automatische Paarwertung und kein automatisches Weiterschalten.

`matchingState` rekonstruiert `errorsByLeft` ausschließlich aus den bereits vorhandenen `matching_pair`-Ereignissen des aktuellen Runs. Dies ist ein berechneter Darstellungswert, kein zusätzlich gespeicherter Lernstatus. Wiederaufnahme erhält die Stufe. Die bestehende unterstützte Evidenz nach einem Fehler, das Restpaar und die ausbleibende Mastery-/Schedulingwirkung bleiben unverändert.

Gezielte Nachprüfung: **26 Matching-Unitfälle**, darunter eine strukturelle Prüfung der Rekonstruktion pro Ausgangskarte/Run für **20/20 bestehende Sets**, sowie **23 UI-Text-/Resolution-Vertragsfälle** bestanden. **Representative UI-Abdeckung:** 12 aktualisierte Kärtchenfälle (drei Relationen × Chrome 320/390/Desktop und WebKit 390) plus sechs bestehende Chrome-/WebKit-Matchingfälle bestanden. Geprüft wurden insbesondere keine vorzeitige Auflösung nach einem Fehler, getrennte Zählung für verschiedene Karten, Auflösung nach dem zweiten Fehler, Wiederaufnahme beider Stufen ohne zusätzliche Paarereignisse, unveränderte Kartenpositionen sowie bestehende Evidenzgrenzen. Aktuelle Fehler-/Auflösungsbilder liegen unter `work/mobile-v2/design/cards`; der ältere 51-Zustands-Atlas wird dadurch nicht rückwirkend als mit der neuen Regel erneut geprüft bezeichnet. Build und Quellenverzeichnisse bestanden. Keine neue Audio-/Recording-QA.

Die separate Button-Gestaltungsprobe verwendete zunächst die Host-Einstellung für Hell/Dunkel. Sie ist jetzt ausdrücklich an die bestehende helle App-Palette gebunden. Die App hat dadurch keinen Dunkelmodus erhalten; keine der Buttonvarianten wurde mit diesem Auftrag in die App übernommen. Weiter ausschließlich lokal, kein Push oder Deployment.

## Wiederhergestellte Aktionshierarchie und verständliche Bezeichnungen

Die frühere visuelle Vereinbarung unterschied bereits primäre, sekundäre und transparente Utility-Aktionen. Die spätere pauschale v2-Regel für `.utilityButton`/`.textButton` gab jedoch Nebenaktionen eine 48-px-Box mit derselben ruhigen Fläche und Kontur wie der Audiosteuerung. Zusätzlich wurden normales und langsames Audio beide auf 52 px / 28-px-Symbole gesetzt. Dadurch wurde eine vorhandene Hierarchie durch die CSS-Gewichtung verdeckt. Diese gemeinsamen Regeln wurden gezielt korrigiert, ohne einen neuen Komponentenbaukasten einzuführen.

| Rolle | Beispiele | Lokale Darstellung |
| --- | --- | --- |
| Hauptaktion | Prüfen, Weiter, Aufdecken | 56 px Mindesthöhe, 18 px Schrift, kräftige grüne Fläche; gemeinsamer Primary-Marker auch für die Zahlenfolge. |
| Aktion am Lerngegenstand | Normales Audio, Hörstimulus | Normales Audio 52 px / 28-px-Symbol mit erkennbarer Fläche; Hörstimulus 56 px / 32-px-Symbol. |
| Unterstützung | Pinyin zeigen, Hilfe, langsames Audio | Textaktionen 14 px ohne umgebenden Kasten, unterstrichen; weiterhin mindestens 44 px Touch-Fläche. Langsames Audio 44 px / 22-px-Symbol, ohne gefüllte Fläche. |
| Navigation / Werkzeuge | Zurück, Schließen, Info, Überspringen | Ruhige, flächenlose Controls mit mindestens 44 px Touch-Fläche. |

Antwortoptionen und Kärtchen bleiben innerhalb ihrer jeweiligen Aufgabe gleich gewichtet. Auch die drei Selbsteinschätzungsantworten verwenden einheitliche Secondary-Controls; „gewusst“ wird nicht optisch zur gewünschten Antwort erklärt. Die Formwahl für das endgültige allgemeine Button-System bleibt davon getrennt. Bestehende Palette und Interaktionslogik bleiben.

Im regulären Lernfluss ersetzt **Lösung** das sichtbare technische Label **Referenz** im gemeinsamen Antwortvergleich. Vier zugängliche Gruppenbezeichnungen lauten jetzt **Beispiel anhören**. Vorhandenes **Vorlage** beim Schreiben bleibt. Technische Props, Klassen, Ereignisnamen und der interne A1-Harness wurden nicht umbenannt. Die Button-Gestaltungsprobe verwendet ebenfalls Lösung. Quellensuche erfasst damit die regulären deutschen Referenz-Vorkommen; daraus wird keine neue allgemeine Copy-Abnahme abgeleitet.

Gezielte Nachprüfung: Build, Text-/Resolutionverzeichnisse und 23 Vertragsfälle bestanden. **Representative UI-Abdeckung:** zwölf Chrome-/WebKit-Fälle prüfen bei 320/390/Desktop die sichtbare Hierarchie, Mindest-Touch-Flächen, normale versus langsame Symbolgröße, Pinyin-Offenlegung, den gemeinsamen Aktionsbereich sowie die unveränderte Audio-Kärtchengeometrie und Fehlerstufen. Kein echtes Audio wurde dabei abgespielt oder aufgenommen. Aktuelle Bilder: `work/mobile-v2/design/hierarchy`. Direkt zur lokalen Ansicht: `http://localhost:4192/review.html?case=hierarchy`. Weiter kein Push/Deployment.

## Zugeordnete Medienbedienung

Die alte Aufnahmeüberschrift verteilte Mikrofon und Info mit `space-between` über die ganze Zeile. Beispielaudio und Aufnahme lagen durch Komponentengrenzen in getrennten Reihen. Nach zunächst zu früh vorbereiteter Umsetzung und anschließender Abstimmung wurde die gemeinsame Leiste vorläufig freigegeben: normales/langsames Beispielaudio als Gruppe, 24 px Abstand, Mikrofon und Info als zweite Gruppe mit 8 px Abstand. Die Aufnahmeinformation bleibt unmittelbar ihrem Control zugeordnet. Nach einer Aufnahme stehen eigene Wiedergabe, Neuaufnahme und Info zusammen; bei Platzmangel bricht die ganze Gruppe um. Aufgeklappte Aufnahmeinformation nutzt eine eigene Inhaltszeile. Beispiel-/Aufnahmegruppen wurden ausschließlich in der gemeinsamen Darstellung zusammengeführt; Aufnahmeverarbeitung und Mediencallbacks bleiben unverändert.

**Representative Nachprüfung:** vier gezielte Layoutfälle (Chrome 320/390/Desktop, WebKit 390) prüfen Reihenfolge, Abstand Mikrofon/Info auch bei geöffneter Information, unveränderte Hanzi-Geometrie, horizontale Passung und die bestehende Buttonhierarchie. Build, Quellenverzeichnisse und 23 Vertragsfälle bestanden. Keine echte Mikrofonaufnahme, keine akustische QA. Die lokale Prüfansicht wurde erneuert; alternative Anordnungen werden separat zur gemeinsamen Gestaltungsauswahl gezeigt. Kein Push/Deployment.

## Ausgewählte offene Aktion in der App

Die anschließende gemeinsame Auswahl ersetzt die zuvor noch offene Formentscheidung: **Offene Aktion** für primäre Handlungen, die gemeinsame Medienleiste bleibt. `PrimaryAction` in `Controls.tsx` rendert Beschriftung und kräftigen grünen Pfeilkreis als einen nativen Button. `ContinueButton` verwendet dieselbe Darstellung. Die gesamte Text-/Pfeilfläche reagiert; Formulare behalten ihren Submit-Typ, ihre vorhandenen Eingabe-/Hörvoraussetzungen und Callback-Funktionen.

16 explizite Hauptaktionsstellen in neun Aufruferdateien wurden zugeordnet: Starten/Fortsetzen und Fehlerwiederaufnahme, Einführung, Prüfen in Lesen/Hören/Produktion/Dialog/Zahlenfolge/Tonnotation, Aufdecken, Transfer-Abgabe sowie Papier-Schreibvergleich/Speicherwiederholung. Die bereits gemeinsamen Weiter-Aktionen übernehmen die Form über `ContinueButton`. Die Schreibwerkzeugleiste bleibt ein Werkzeugbereich; ihr Dock-Marker wird nicht als Button gestaltet. Antwortoptionen, Matchingkärtchen, Tonwahl und Selbsteinschätzungen erhalten keine Hauptaktionspfeile und bleiben innerhalb ihrer Wahl gleich gewichtet. Interne Testfunktionen sind ausgeschlossen.

Die primäre Aktion hat mindestens 60 px Höhe, 20 px Schrift und einen 56-px-Pfeilkreis. Beispielaudio/Aufnahme sind ruhigere runde Symbolbuttons mit 52 px Fläche / 28-px-Symbol; langsames Audio bleibt 44 px / 22-px-Symbol, auf derselben Mittelachse zentriert. Ein hervorgehobener Hörstimulus behält seine stärkere 56-px-/32-px-Stufe. Hilfe/Pinyin/Info und Navigation behalten mindestens 44 px Bedienfläche. Lade-, Wiedergabe-, Aufnahme-, Disabled- und native Fokuszustände bleiben erhalten. Matching-Audiokärtchen behalten ihre Kartenform und ihre eigene größere Bedienfläche.

Der gezielte schmale Papier-Schreibvergleich zeigte einen horizontalen Überlauf der nun nicht mehr angedockten Werkzeugleiste. Die Werkzeugzeile darf jetzt umbrechen; der Schreibbereich bleibt auf die Inhaltsbreite begrenzt. Keine Änderung an Zeichenkoordinaten, Strichwertung oder Schreibablauf.

**Representative Rendering:** 23 benannte Zustände × Chrome 320×568, 390×844, 1280×800 und WebKit 390×844 = **92 Bildschirmansichten**. Stichprobe: Start, drei Einführungsphasen, Produktion vor/nach Eingabe, Lesen-Ergebnis, Hören-Eingabe, Schreibwerkzeuge/-Ergebnis/Papiervergleich, Tonnotation/Retry, lauter Abruf und Papier jeweils Aufdecken/Selbsteinschätzung, Zahlenfolge, abgeschlossenes Matching, Dialog-Eingabe/-Abschluss und Transfer-Eingabe/-Ergebnis. Alle 23 Zustände pro Konfiguration sind im jeweiligen `metrics.json` erfasst; das ist keine vollständige Prüfung sämtlicher Content-/Zustandskombinationen und keine physische Geräteabnahme. Bilder/Messungen: `work/mobile-v2/design/open-actions`. Ausgewählte Originalansichten für schmale Einführung, Leseergebnis, Fehlerkorrektur, Papiervergleich, Transfer, Selbsteinschätzung und Desktopstart wurden visuell geprüft.

**Gezielte Checks:** 16 Browserfälle bestanden: vier Zustandsdurchläufe, vier Hierarchie-/Mediengruppenfälle, vier gemeinsame Layout-/Inspektionsfälle und vier Audio-Matchingkärtchenfälle mit simulierten Medienereignissen. Geprüft wurden horizontale Passung, sichtbare Hauptaktionen, Text-/Pfeilklick, native Enter-Abgabe, Reload ohne zusätzliche Antwortwertung, Hilfe-/Infozuordnung, ruhige gleichgewichtete Alternativen und die bestehende Karten-/Evidenzgrenze. Build einschließlich Inhalts-/Typprüfung und Quellenverzeichnissen sowie 31 relevante Unit-/Vertragsfälle bestanden. Keine allgemeine Regression, keine reale Mikrofonaufnahme, keine akustische oder Recording-Reliability-QA.

Die lokale Prüfansicht wurde mit dem gebauten App-Code erneuert; ihr realer Weiter-Button wurde zusätzlich als offene Aktion mit 60 px Höhe / 56-px-Pfeil verifiziert. Einstieg: `http://localhost:4192/review.html?case=hierarchy`, dort neu laden. Kein Commit, Push oder Deployment dieses Designblocks. Content, Curriculum, Audioassets, akzeptierte Antworten, Assessment, Mastery, Scheduling, Planner und Logging bleiben durch diesen Button-Schritt unverändert. Ein größeres Redesign wurde diskutiert, gehört aber nicht zu dieser Umsetzung. Nächster Schritt ist die Sichtprüfung des lokalen App-Stands; Veröffentlichung erst nach ausdrücklicher Freigabe.

## Freigabe und Abgleich mit produktivem main

2026-10-20: Nutzer bestätigt den lokalen Stand und beauftragt Veröffentlichung ohne weitere Designänderungen. Gesicherter UI-Commit `d42c051`; drei vorausgehende v2-Commits `737c5d6`, `02ae8b0`, `b25d913`. Aktueller Remote-Main vor Integration: `0a486a5`, produktiver Release `321d2fd` einschließlich Taiwan-Kurs/Audiofixes. Der öffentliche Einstieg lieferte vor der UI-Veröffentlichung `index-Czsy5c30.js`, Worker-Cache `mandarin-v01-b19f9f6c1dda7d55`; der bestehende Cloudflare-Check für `321d2fd` war erfolgreich.

Fünf Konfliktdateien wurden fachlich vereinigt: LessonRunner, CSS, Resolution-Verzeichnis/-Generator und UI-Textledger. Main behält seine Kursauswahl, Taiwan-Wiederaufnahme, Inhalts-/Audio-/Schreibzielmodelle und Ereignisverarbeitung; v2 behält Viewport, zusätzliche Recognition/Dialogue-Praxis, Feedback und die freigegebenen Controls. Main-Kursdaten, öffentliche Assets, Datenmodell und Kurszustandsdateien sind gegenüber `0a486a5` bytegleich. Im Taiwan-Renderer wurden zehn vorhandene Hauptaktionsstellen ausschließlich auf dieselben freigegebenen gemeinsamen Controls umgestellt; nach Rücknormalisierung der Import-/Tag-Namen ist die Datei bytegleich zu main. Kein weiterer Gestaltungs-, Inhalts- oder Audioschritt.

Produktionsbuild einschließlich Content-/Typ-/Quellenverträgen bestanden. 77 vorhandene relevante Unit-/Vertragsfälle bestanden. Der nachfolgende Auslieferungsnachweis steht zentral in `docs/V05_STATUS.md`; keine Produktionsfreigabe allein aus einer Inventarzahl abgeleitet.
