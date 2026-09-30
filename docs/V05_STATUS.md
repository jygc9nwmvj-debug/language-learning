# v0.5 — verbindlicher Projektstatus

Stand: 2026-09-30. Textinventar-/Coverage-Korrektur abgeschlossen und deployt (`023c6d7`). Bisherige UI-Konsolidierung bleibt historische Basis.
Produktionsbasis: `main` / `023c6d7` (Textökonomie und verbindliche Quellen-Coverage; fachliche P1-Korrekturen unverändert). Öffentlich ausgelieferter App-Code (`App-CmQsOYd3.js`) und Service Worker (`mandarin-v01-a8f4e9494f171775`) am 2026-09-30 bytegenau gegen den geprüften Produktionsbuild verifiziert. Separates Review-Site-Deployment unverändert: Version 5, Quellcommit `ef5f120c204dff98a55aad3a848afe3476698417`, veröffentlicht am 2026-09-30.

P1-Korrekturstand 2026-09-30: **deployed**; Commit `b482fa6`, Basis `f537a6f`. Ausschließlich die drei bestätigten Auditbefunde: Transfer als Wortmuster-Evidenz statt Verständnisnachweis; Papiervergleich vor erneuter Bildschirmeingabe dauerhaft als Hilfe; bewerteter/abgeschlossener Transferdurchlauf schlägt älteren Entwurf beim Restore und verhindert erneute Bewertung. QA bestanden: 154 Funktionstests, zwölf Browserfälle in Chrome/WebKit (Schreiben, Papiervergleich, Reload, Transfer auf 390/1280 Pixeln), Typprüfung und Produktionsbuild. Auf `main` gepusht, Cloudflare-Deployment durch öffentlichen Datei-Abgleich bestätigt. Die drei P2-Befunde (Antwortlisten, spätere Tonabrufe, Zahlenpositionen) bleiben ausdrücklich unverändert.

## Textinventar-/Coverage-Korrektur — 2026-09-30

Basis `b3663de` / Produktion `63e35c4`. **deployed**, Commit `023c6d7`: elf kontextuelle Copy-Entscheidungen (neun Entfernungen, zwei Verdichtungen), keine fachlichen Änderungen. Exhaustive Quelleninventarisierung: 3.418/3.418 Einträge in 63 Dateien, davon 891 aktive Text-/Ausgabeeinträge und 125 zusätzliche Rendering-Familien; 0 unklassifiziert. 131/131 aufgelöste Aufgabenprompts erfasst. Browser-/Sichtprüfung ausdrücklich repräsentativ. 159 Funktionstests bestanden; 134 ausgewählte Browserfälle nach Korrektur alter Hosting-Selektoren ohne offenen Fehler; Produktionsbuild bestanden.

Die frühere Aussage „Alle produktiven Textquellen geprüft“ war nicht durch ein vollständiges Inventar belegt. Historische Berichte bleiben unverändert. [Befund, Population, Zahlen und QA](UI_TEXT_COVERAGE.md). [Projektweiter Coverage Contract](COVERAGE_CONTRACT.md), verbindlich über `AGENTS.md`; automatischer Check in Tests und Produktionsbuild.

## Verbindlichkeit und Pflege

Diese Datei ist die zentrale Referenz für den aktuellen Umsetzungs-, Freigabe- und Zurückstellungsstatus. Ältere Roadmaps, Buildberichte und Auditberichte bleiben historische Belege und werden nicht rückwirkend umgeschrieben. Bei widersprüchlichen Statusangaben gilt diese Datei; fachliche Verträge gelten weiter, soweit keine spätere ausdrückliche Entscheidung sie ersetzt.

**Nach jeder implementierten, deployten oder bewusst zurückgestellten Änderung muss diese Datei mit Datum und Commit/Stand aktualisiert werden.** Implementierung und bestätigtes Deployment getrennt erfassen. Bei Änderungen im selben Commit den Ausgangscommit und den Änderungsumfang nennen; der Dokumentationscommit ist über `git log -- docs/V05_STATUS.md` nachvollziehbar. Keine Selbstreferenz auf einen noch nicht erzeugten Commit erfinden.

Keine Wunschliste: Neue Ideen werden nur aufgenommen, wenn sie ausdrücklich beschlossen oder bewusst zurückgestellt wurden. Beobachtungen sind keine automatischen Bauaufträge. Ein offener Befund ist nicht automatisch ein Pilotblocker. Ein fehlendes Deployment lokaler Autorenwerkzeuge ist nicht automatisch unerledigte Arbeit.

Statuswerte:
- `deployed`: im jeweils genannten öffentlichen Produkt vorhanden.
- `implemented, not deployed`: lokal umgesetzt; nicht im produktiven Lernbestand.
- `in progress`: ausdrücklich laufender Arbeitsblock, nicht bloß alter Branch oder offener Befund.
- `decided, not implemented`: verbindliche Richtung/Anforderung ohne vollständige Umsetzung; Pilotpflicht separat nennen.
- `deferred`: bewusst später oder ausdrücklich außerhalb des aktuellen Umfangs.
- `blocked`: Freigabe an konkret fehlenden Voraussetzungen gesperrt.
- `needs decision`: Entscheidung oder Zuständigkeit offen.
- `superseded`: durch eine spätere bewusste Entscheidung ersetzt.

## Freeze und offene Entscheidungen

Der ausdrücklich beauftragte UI-/Interaction-/Feedback-Konsolidierungsblock samt Textökonomie vom 2026-09-30 ist abgeschlossen (`deployed`, `63e35c4`). Ausgangsbasis: `bebf0f8` / Code `b482fa6`. Anschließender ausdrücklich beauftragter Textökonomie-/Coverage-Block ebenfalls abgeschlossen und deployt (`023c6d7`). Kein weiterer Implementierungsblock aktiv. [Interaction-Regeln und Zustandsinventar](V05_INTERACTION_RULES.md). Danach zurück in den Pilot; keine automatische weitere Optimierungsrunde.

| Punkt | Status | Grenze / nächste Voraussetzung |
| --- | --- | --- |
| Safari-Aufnahmepegel | needs decision | Bekannter realer offener Befund: Aufnahmen teilweise sehr leise. Ursache nicht abschließend gemessen, keine Pegelkorrektur ausgeliefert. **Nicht automatisch Pilotblocker.** Umfang/Priorität einer weiteren Bearbeitung ausdrücklich entscheiden. |
| Reviewer-Besetzung / tatsächliche Abdeckung | needs decision | Die technische Kompetenztrennung ist umgesetzt. Geeignete DE/Mandarin-Reviewer und tatsächliche Antworten fehlen weiterhin; englische UI oder Mandarin-Muttersprachlichkeit belegen keine Deutschkompetenz. Keine menschlichen Freigaben vorhanden. |
| Zwei neue Content-Chargen | blocked | Echte Reviews, fehlende unabhängige Faktenbelege und gegebenenfalls Quellenwidersprüche auflösen. Keine Freigabe des neuen Contents aus dem Freeze des alten Bestands ableiten. |
| Hanzi Reconstruction / Zeichenauswahl | deferred | Didaktisch sinnvoll, aber erst bei größerem Bestand **explizit eingeführter Hanzi**. Kein v0.5-Bauauftrag. Diese ausdrückliche Folgeentscheidung ersetzt die Unklarheit des DoD-Abgleichs. |

## Lernlogik und Feedback

| Beschlossener Punkt | Status | Beleg / aktueller Umfang |
| --- | --- | --- |
| Encounter und bewusste Einführung vor Bewertung | deployed | `AttentionIntroduction`, `introduction.ts`; relevante Einführungsevidenz statt bloßer Anzeige. [Lernarchitektur](LEARNING_ARCHITECTURE.md). |
| Hören, Lesen, Recall | deployed | `Exercise`, 131 reguläre Aufgabendefinitionen; echte Abrufziele verborgen. [Assessment-Audit](ASSESSMENT_INTENT_AUDIT.md). |
| Tonarbeit | deployed | Tonaufmerksamkeit, Hörunterscheidung und Notation getrennt; getippte Töne belegen keine Aussprache. `bc0e5c6`. |
| Spacing und Interleaving | deployed | `continuous.ts`, Fortschrittsmodell; spätere Wiederkehr, Priorität schwacher Kenntnisse, Modalitätswechsel. Intervalle bleiben Produkthypothesen. |
| Selektives Schreiben / Fading | deployed | Acht Schreibziele; echte Strichgeometrie, reduzierte Hilfen und verzögerter Abruf. `writing-targets.ts`, `WritingExercise`. |
| Hilfen / Progressive Disclosure | deployed | Einführungsschritte, Pinyin-Rücknahme bei bekanntem Material, Unterstützung getrennt von unabhängigem Erfolg. Keine allgemeine adaptive Fading-Engine. |
| Kleinster hilfreicher Fehlerhinweis vor voller Lösung | decided, not implemented | Allgemeine Richtung der Lernarchitektur, nicht durchgängig umgesetzt. Bestehende Vollkorrekturen ausdrücklich anerkannt; kein verpflichtender v0.5-Nachbau. Weitere Umsetzung deferred. |
| Mini-Transfer | deployed | `f58dddb`: vier feste neue Gesprächskombinationen aus vorhandenem Content, voraussetzungsgebunden und sparsam zusätzlich; getrennte Evidenz ohne Mastery- oder Fälligkeitswirkung. `b482fa6`: ausschließlich Wortmuster-Evidenz (`features-only`), kein automatischer Verständnisnachweis; abgeschlossene Durchläufe bleiben auch beim Restore vor erneuter Bewertung geschützt. [Vertrag und Grenzen](MINI_TRANSFER.md). |
| Alter Transfer-Prototyp | superseded | Ein unbewerteter Dialog als Ersatz einer Wiederholung wurde durch den finalen Auftrag ersetzt: mehrere bewertete Fälle sparsam zusätzlich. |
| Optionale Entdeckungen | deployed | Zwei Entdeckungen im D-Content; aufklappbar. Keine erzwungene Poesie oder neue Entdeckungspflicht. |
| Papier / bildschirmfreier Abruf | deployed | Bestehendes optionales Build E; getrennt vom Forschungsprototyp Paper Writing v2. |
| Kontinuierliches Weiterlernen | deployed | `b229877`: keine künstlichen Rundenabschlüsse/proaktiven Stopps, freiwilliges Beenden bleibt. |
| Frühere proaktive Stopplogik | superseded | Wiederholte reale Fragmentierungserfahrung führte zur Entfernung; keine Ersatzheuristik beschlossen. |
| Inline-Korrektur bei eigener Antwort | deployed | `c67fd3b`, `cb7dea9`, `ProductionFeedback`. |
| Fehlende versus falsche Tonnotation | deployed | `9a8e294`: Ergänzung versus gezielte Korrektur; keine Aussprachebewertung behauptet. |
| Vollständiges Ziel und Korrekturaudio | deployed | `db551bd`: bei korrekturbedürftiger Textproduktion Ziel mit Hanzi/Pinyin/Bedeutung und vorhandener natürlicher/langsamer Wiedergabe. |
| Räumliche Nähe von Antwort, Feedback und Referenz | deployed | `2e32e59`, [Layoutkorrektur](V05_LAYOUT_STABILITY.md). |

## UI-Prinzipien und tatsächliche Umsetzung

| Bestehendes Prinzip | Status | Umsetzung / belegte Grenze |
| --- | --- | --- |
| Eine Hauptaufgabe je Ansicht | deployed | Normaler Lernlauf und Transfer, keine zusätzliche parallele Hauptaufgabe festgestellt. |
| Sprache führt, Werkzeuge treten zurück | deployed | Große Sprachdarstellung, klare Hierarchie, nachgeordnete Hilfe-/Audiokontrollen. |
| Aufgabe und Handlung räumlich zusammen | deployed | Begrenzte Antwortbreite und kompakte Frage-/Eingabegruppe. |
| Feedback direkt bei eigener Antwort, vollständige Referenz danach | deployed | Produktionskorrektur mit Ziel und Audio. |
| Details ohne Umformatierung des Hauptausdrucks | deployed | `2e32e59`: stabile Schriftgröße, Abstände und Umbrüche. Frühere Verkleinerung beim Öffnen superseded. |
| Progressive Disclosure / technische Informationen zurückhalten | deployed | Aufklappbare Zusatzinformation, Transfertranskript erst nach Antwort, Teststeuerung nur im Entwicklungsbuild. |
| Eindeutige, gemeinsame Weiter-Aktion | deployed | Gemeinsamer `ContinueButton` in bisherigen Lernflächen. Mini-Transfer verwendet seit `63e35c4` ebenfalls `ContinueButton` und das gemeinsame visuelle Wiedergabe-Control. |
| Responsive Schrift / Mobile | deployed | Gezielte 320-/390-Pixel- und Desktopprüfungen dokumentiert. Kein Ersatz für reale Geräte-/Nutzungsabnahme. |
| Funktionale Microinteractions / Reduced Motion | deployed | CSS: 140-ms-Kontrollwechsel, 200-ms-Einblendung, Details-Pfeil; reduzierte Bewegung respektiert. Nicht jede Rückmeldung identisch animiert; keine solche allgemeine Pflicht belegt. |
| Weitergehende Motion Language / neue Aufgabenübergänge | deferred | Ungewählter Backlog; v0.5-Design schließt neue Übergänge zwischen Aufgaben ausdrücklich aus. Keine vergessene v0.5-Animation. |

Belege: [UI-Vertrag](PRODUCT_UI_VISUAL_SYSTEM.md), [v0.5-Design](design/V05_VISUAL_REDESIGN.md), [visuelle QA und Grenzen](design/V05_VISUAL_QA.md), [Layoutkorrektur](V05_LAYOUT_STABILITY.md), `src/app/app.css`. Ältere „lokal / kein Deployment“-Vermerke beschreiben damalige Arbeitsschritte; die oben genannten späteren Main-Commits bestimmen den aktuellen Status.

## Audio, Content und Review

| Punkt | Status | Beleg / Grenze |
| --- | --- | --- |
| Natürliches, langsames und Detailaudio | deployed | 84 Audioreferenzen einschließlich acht neuer Details. [Audiobericht](V05_AUDIO_AVAILABILITY.md); `db551bd`. |
| Freiwillige Aufnahme / Vergleich | deployed | `SpeakingPractice`, `Recorder`; keine automatische Aussprachebewertung. |
| Safari: Wiedergabe bleibt aktiv | deployed | Reparatur `183c342`, aktuelle Prüfung des tatsächlichen Medienendes; [Recording-Bericht](RECORDING_RELIABILITY.md). Nicht mit leisem Aufnahmepegel verwechseln. |
| Technische Audio-QA / ehrliche Prüfstatus | deployed | Manifest und Validator; technische Annahme bedeutet keine muttersprachliche Freigabe. |
| Native Audio-Abnahme / Nutzenvergleich natürlich–langsam | deferred | Bekannte WATCH-/Review-Punkte, keine neue Heuristikkalibrierung oder Regeneration beauftragt. |
| Produktiver Lernbestand | deployed | 44 kanonische Wörter, 36 Lernobjekte, 131 reguläre Aufgaben; Mini-Transfer separat. Keine der neuen Chargen integriert. |
| Content-/QA-Pipeline | implemented, not deployed | Lokale Autorenwerkzeuge im separaten Checkout `audio-availability`: Plan, Assembler, strukturelle/sprachliche QA, Audiozuordnung, Review, Freigabe. Nicht Teil dieses Main-Builds. |
| Unabhängige Quellenprüfung | implemented, not deployed | Lokaler `linguistic-sources.mjs`: historische Autorenprovenienz getrennt von heutiger Verifikation; Quellen des konkreten aktuellen Generierungsprozesses dürfen sich nicht selbst bestätigen. |
| Revisions-/Fingerprint-Release-Gate | implemented, not deployed | Lokaler `batch-release.mjs`, `docs/BATCH_RELEASE.md`: `mandarin-release-v2-competence`; Evidenz, Review, Assets, Revision und tatsächliche Claim-/Kompetenzzuordnung gebunden. Ergänzende Exporte derselben Paketrevision möglich; kein automatischer Freigabeersatz. |
| origin-confirmation-v1 | blocked | Zehn neue Objekte, 36 Aufgaben; 30 bestätigte Claims, 22 fehlende Faktenbelege, 24 Reviewfragen. Echte Reviewfreigabe fehlt. |
| language-ability-v1 | blocked | Zehn neue Objekte, 39 Aufgaben; 38 bestätigte Claims, 39 offene Faktenbelege, ein Quellenwiderspruch, 26 Reviewfragen; zusätzlicher Schriftmapping-Hinweis. |
| Explizite Review-Kompetenzprofile | deployed (Eva-Seiten); implemented, not deployed (lokales Gate) | `review-competence-v1`: Mandarin + English und Mandarin + German. Öffentliche Seiten verwenden ausschließlich Mandarin + English mit ausdrücklicher Kompetenzbestätigung; deutsches Profil technisch für ergänzende Reviews unterstützt, keine neue deutsche Reviewoberfläche. Keine implizite Freigabe fremdsprachiger Claims. |
| Öffentliche englische Review-Oberflächen | deployed | Separates Review-Site-Deployment: [Herkunft](https://mandarin-gemeinsam-pruefen.wolfram376883.chatgpt.site/herkunft/) und [Sprachkenntnisse](https://mandarin-gemeinsam-pruefen.wolfram376883.chatgpt.site/sprachkenntnisse/). Deutscher Lerncontent bleibt prüfbar; lokales Speichern/Fortsetzen/JSON-Export, kein Backend. |
| Größere Contentskalierung vor erstem echtem Review | deferred | Erst tatsächliche Reviewergebnisse und Freigaben; keine weitere Charge aus offenen Infrastrukturfragen ableiten. |
| Auto-Release ohne Human Review | deferred | Ausdrücklich außerhalb des geltenden Umfangs und vom Gate ausgeschlossen; kein später automatisch nachzulieferndes Pflichtfeature. |

Die lokalen Pipeline-/Chargenbelege liegen in `audio-availability/content-reviews/{origin-confirmation-v1,language-ability-v1}/REPORT.md` und den zugehörigen QA-/Release-Artefakten. Der Checkout liegt neben diesem Repository; diese Dateien sind nicht als auf Main versioniert auszugeben. Öffentliche Reviewpakete sind keine produktive Contentfreigabe.

## Pilot, Lokalisierung und bewusst spätere Themen

| Punkt | Status | Beleg / Grenze |
| --- | --- | --- |
| Einstieg, freiwillige Aufnahme, erklärte Schriftwahl | deployed | `5980cc2`, `LessonRunner`. |
| Lokale Speicherung und Backup | deployed | Export/Import und Browserbindung erklärt; kein Konto-/Syncsystem erforderlich. |
| Titel, Beschreibung, Favicon, Share-Vorschau | deployed | `5980cc2`, `index.html`, öffentliche Assets. |
| PWA / Offline | deployed | Manifest, vollständiger Assetcache und sichtbare Offlinevorbereitung. |
| Lokales Logging / F-light | deployed | [Pilotprotokoll](PILOT_EVALUATION_PROTOCOL.md): keine kritische Instrumentierungslücke für die begrenzte Auswertung. Keine zusätzlichen Messaufgaben beauftragt. |
| Deutsche Lern-App | deployed | Aktuelle produktive Oberfläche und Aufgaben. |
| Englisch-Architektur / begrenzter Prototyp | implemented, not deployed | Isoliertes `i18n-lab`; [Architekturbericht](I18N_ENGLISH_V0_ARCHITECTURE.md). |
| Vollständige DE/EN-Lern-App | deferred | Redaktion, Antwortmengen, vollständige Abdeckung und Releasefreigabe später. Englische Review-UI ist davon unabhängig. |
| Transfer-Mastery, adaptive Fading-/Schwierigkeitsarchitektur | deferred | Finaler Transferauftrag schließt dies aus; erst reale Nutzung auswerten. |
| Learning Engine v2 / größere Curricula | deferred | Nach Pilotevidenz; keine ungewählte Backlogidee als Verpflichtung behandeln. |
| Paper Writing v2 / JIT-Meta-Learning | deferred | Forschung/isolierte Prototypen, keine Produktionsintegration beauftragt. |
| Automatische Aussprachebewertung | deferred | Getesteter F0-Ansatz NO-GO; keine produktive automatische Bewertung. |
| Weitere bisher ungewählte P2/P3-/WATCH-Themen | deferred | Insbesondere verbleibende Segmentierung, redaktionelle Klarheit, Schreibfeldlesbarkeit und neue Stop Empfehlungen. Bestehende Beobachtungen bewahren, nicht automatisch implementieren. |
| Breitere externe Nutzung / weitere Infrastruktur | deferred | Bisherige Roadmap: Datenschutz-/Impressumsfragen vor breiterer Nutzung; Identität/Sync, Research Mode und Naming später. Keine neue rechtliche Bewertung oder Umsetzung durch diese Statusdatei. |

## Änderungsnachweis

- **2026-09-30 · Produktionsstand `f58dddb`:** Abgeschlossenen DoD-Abgleich zentral übernommen, ohne neuen Audit. Ausdrückliche Folgeentscheidung: Hanzi Reconstruction deferred bis größerer explizit eingeführter Hanzi-Bestand. Reviewer-Kompetenz offen; Safari-Pegelbefund nicht automatisch Pilotblocker. Pflegepflicht für zukünftige Änderungen festgehalten. Reine Dokumentation, kein Deployment.

- **2026-09-30 · Reviewer-Kompetenz:** Öffentliches Review-Site-Deployment Version 5, Quellcommit `ef5f120c204dff98a55aad3a848afe3476698417`; Lern-App weiterhin `f58dddb`, Dokumentationsbasis `c8cd45e`. Pakete/Exporte Version 2 binden Modus, Kompetenzen, ausdrückliche Bestätigung sowie eligible/assessed/excluded-Claims. Alte ungebundene Exporte werden ohne Migration abgewiesen. Package-Fingerprints bewusst erneuert; zugrunde liegende Claims, Stichprobe, Content-/QA-Revisionen, Mandarin, Aufgaben und Audio unverändert. Noch keine menschlichen Antworten.
  - `origin-confirmation-v1`: Paket `sha256:034db7f0afb0b223f2d8eb310b7b8af3e4b88ef663d7b64429f2505fbeff0f36`; Eva-Modus 120 prüfbare und 85 explizit ausgeschlossene deutsche Claims; weiterhin 24 Fragen / 29 Audios / blocked.
  - `language-ability-v1`: Paket `sha256:173b6f55b3f7fd16aab520a95bbea13c7f4898bd56e15844cdab0dd318113ce0`; Eva-Modus 161 prüfbare und 108 ausgeschlossene deutsche Claims; weiterhin 26 Fragen / 40 Audios / blocked.
  - Deutsche Erklärungen/Glossen und deutsch formulierte Strukturdeklarationen bleiben dem deutschen Profil zugeordnet. Englische Orientierung ermöglicht Mandarin-Kontexturteile, ersetzt aber keine Prüfung des deutschen Textes.
  - Gate: Keine passende Kompetenz → Claim offen (`REVIEW_COMPETENCE_PENDING`), nicht automatisch unsure. Antworten beeinflussen nur ihre explizit zugeordneten Claims. Positive parallele Reviews verdecken keine negativen/unsicheren Urteile. Quellenbelege und Konfliktauflösung bleiben zusätzlich erforderlich.
  - QA: 120 fachliche Tests bestanden; drei lokale Browserfälle einschließlich Speichern/Fortsetzen/Export/Import, 320/390 px und Desktop, alle 69 Audioassets byteidentisch und dekodierbar. 154 geschützte App-/Content-/QA-/Audiodateien per Prüfsumme unverändert. Öffentliche Prüfung beider URLs ohne Login ebenfalls erfolgreich; ausschließlich leere Exporte, keine menschlichen Bewertungen simuliert. Details lokal unter `audio-availability/work/reviewer-competence/` und chargenweise `competence-verification.json`.

- **2026-09-30 · UI-/Interaction-Konsolidierung, Basis `bebf0f8`:** `implemented, not deployed`. Gemeinsame Wiedergabe-/Weiter-Controls im Transfer; konkrete Frage bleibt bei Antwort/Auflösung; Wortmustergrenzen sichtbar, ausführliche Erklärung aufklappbar. Vorhandene Hilfe nach Textantwort benannt. Schreibabschluss und Zahlenfolge zeigen keine überholte Handlungsanweisung; deaktivierte Schreibwerkzeuge treten zurück. Selbstbericht-Optionen gleichgewichtet. Stabile Tonbeispiele und Tastatur-Fokusrückgabe bei Phrasendetails. Unsegmentierte Phrasen passen in ihre Referenzbreite. Bestehende 140/200-ms-Bewegung konsolidiert, Reduced Motion erhalten. Lernlogik, Antworten, Evidenz, Speicherung, Mandarin, Audio und Schriftwahl unverändert. Regeln/Inventar: [V05_INTERACTION_RULES.md](V05_INTERACTION_RULES.md).

  - Im selben Block ergänzte Textökonomie: Einstieg und Anweisungen verdichtet, dekorative Füllzeile ausschließlich in der Anzeige unterdrückt, doppelte Überschriften entfernt, aktueller Zustand statt überholter Handlungsaufforderung. Fachliche Lernnotizen, Bewertungsgrenzen, Fehlerhilfen und Speicher-/Löschhinweise erhalten.

  - Abschluss-QA bestanden: Produktionsbuild/Typprüfung, 154 Funktionstests, 122 Browserfälle in Chrome/WebKit plus zwölf gezielte Transfer-Nachprüfungen nach der letzten Textkürzung. 320/390/1280 Pixel, Bildprüfung, Details/Tastatur/Reduced Motion, Fading, Papier, Aufnahmebedienung und Reload. [QA-Bericht](V05_INTERACTION_QA.md). Deployment wird separat nach öffentlichem Datei-Abgleich bestätigt.

- **2026-09-30 · Deploymentbestätigung `63e35c4`:** `deployed`. Auf `main` gepusht; öffentliche Dateien bytegleich zum geprüften Produktionsbuild: `assets/App-Bwd4uSP1.js` SHA-256 `56ff7b25727e2563cf51e54ab1cc5f0664f4216fb08efcc0e93c58a595d88494`, `sw.js` SHA-256 `8f564bc2246b756bea9563d94c7c4de96a32a212e9a2aced256688fd8d90a446`, Cache `mandarin-v01-e2a61bde915d0d3d`. Alle oben als lokal beschriebenen Änderungen dieses Blocks sind damit veröffentlicht. Keine weitere automatische UI-/Copy-Optimierungsrunde; zurück zur normalen Pilotnutzung.

## Resolution Contract — 2026-09-30

**implemented, not deployed**, Basis `ca959d5`: [gemeinsamer Auflösungsvertrag](RESOLUTION_CONTRACT.md), 131/131 Definitionen strukturell zugeordnet einschließlich drei Kompatibilitätsaufgaben und einer Orchestrierungsgrenze. Pflichtreferenz unabhängig von Exploration; Transferdiagnostik bleibt intern; vorhandene Zustände bleiben maßgeblich. Ergänzender Slot-Befund: 1 Slot-Lernobjekt in 3 Definitionen; vollständiges Namensbeispiel bleibt ausdrücklich Beispiel, Produktionshilfe/-auflösung verwendet vorhandene feste Mandarin-Bausteine. Keine Audiodatei ersetzt. QA: 176 Funktionstests und Produktionsbuild bestanden; 116 ausgewählte Browserfälle in Chrome/WebKit über Hauptlauf und gezielte Nachprüfungen, keine Behauptung visueller Vollabdeckung. Source/Text: 67 Dateien, 3.537 Einträge, 0 unklassifiziert. Deployment wird nach öffentlichem Datei-Abgleich separat bestätigt.

**needs decision:** Referenzkontur nach erfolgreichem Bildschirmschreiben erneut einblenden. Separate didaktische Hypothese; ausdrücklich nicht umgesetzt. Die bestehenden P2-Befunde bleiben unangetastet.
