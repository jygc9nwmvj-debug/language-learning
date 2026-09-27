# A2 Mandarin TTS Bake-off — Ergebnis

27.09.2026. **Keine Engine ist in diesem Versuch bereits als verlässliche Lernreferenz freigabefähig.** Das bedeutet nicht, dass keines dieser Modelle gutes Mandarin erzeugen kann. Es bedeutet: ein fester, nicht nachbearbeiteter Durchlauf unserer tatsächlichen elf Lernziele liefert bei allen Kandidaten offene Probleme. Keine Produktionsdatei ersetzt, kein Deployment, keine Writing-Arbeit.

## Kurzer Vergleich

| | Qwen3-TTS, offizielles 1.7B | MeloTTS, offizielles Mandarin | CosyVoice 3, offizielles 0.5B |
|---|---|---|---|
| Lizenz Code / Gewichte | Apache-2.0 / Apache-2.0 | MIT / MIT; BERT Apache-2.0 | Apache-2.0 / Apache-2.0 |
| Lokale Synthese pro Clip, Median | 2,93 s, MPS | 0,32 s, CPU | 5,31 s, CPU |
| Beobachteter Bereich | 1,59–9,07 s | 0,22–6,39 s | 4,58–7,14 s |
| Peak-Prozessspeicher | 4,08 GiB, MPS-Speicher nicht vollständig enthalten | 2,53 GiB | 5,88 GiB |
| Praktischer Aufwand | Mittel; offizieller Mac-GPU-Lauf möglich | Kleinstes Modell, schnell; ältere Abhängigkeiten/Mac-Frontend-Anpassung nötig | Höchster Installationsaufwand, mehrere Modelle und Referenzstimme |
| Aussprache-Steuerung hier | Hanzi + Instruktion, kein explizites Pinyin-Token-Override genutzt | Hanzi/G2P, kein Pinyin-Override in verwendeter API | Offizielle Pinyin-Inpainting-Tokens bei Einzelsilben, Instruktionen |
| Verständlichkeit / phonetische Zuverlässigkeit | ASR erkennt die Standardphrasen, einzelne ma-/Namensabweichungen bleiben | Sehr leise Einzelsilben, mehrere ASR-Abweichungen | ASR-Abweichungen u. a. bei 我 und natural 谢谢 |
| Tonzuverlässigkeit | 3 von 4 ma-Konturen im Review | 3 von 4 im Review; zusätzlich Pegelprobleme | 3 von 4 im Review; Ton-3-Verlauf lückenhaft |
| Natural / Slow | 2 von 4 Paaren außerhalb Verhältnis-Warnkorridor | 3 von 4 außerhalb; Dauerregler garantiert keine sorgfältigere Artikulation | Alle 4 außerhalb; 3 Slow-Versionen sogar kürzer |
| Natürlichkeit / Anfänger-Eignung | Menschliche Hörprüfung offen | Menschliche Hörprüfung offen | Menschliche Hörprüfung offen |
| Entscheidung jetzt | Keine Freigabe | Trotz Effizienz keine Empfehlung für diese Dateien | Trotz Pinyin-Steuerung keine Freigabe |

Zeiten enthalten die einzelne Synthese, nicht die komplette Installation; erste Clips enthalten zusätzliche Aufwärmeffekte. Teilweise parallele Hintergrundarbeit, kein Hardware-Benchmark. Keine Intelligibilitäts- oder Aussprachepunktzahl aus ASR abgeleitet. Die Namen bleiben auf der Hörseite zunächst verborgen.

## Automatisches Screening aller 45 Dateien

- 45/45 WAV-Dateien decodierbar; außerdem jeweils 45/45 in Chrome und WebKit decodiert.
- Keine Samples am gewählten Clipping-Schwellwert, keine Rohpeaks über Vollaussteuerung. Dies beweist keine Abwesenheit hörbarer Artefakte oder modellinterner Begrenzung.
- Melo: 12 Pegelwarnungen für aktive Lautstärke; 8 zu niedrige Peakwerte. `我` erreicht nur etwa **−63,46 dBFS Peak** und unterschreitet die Aktivitätsschwelle vollständig. Das ist keine echte digitale Stille, aber als unbearbeitete Lernreferenz praktisch problematisch.
- CosyVoice: vier Peakwarnungen wegen sehr geringer Aussteuerungsreserve; maximal −0,09 dBFS, kein gemessenes Clipping. Eine führende-Stille-Warnung.
- Qwen: keine Pegel-, Clipping- oder Stillewarnung in diesem Satz. Das bestätigt nur technische Eigenschaften, nicht korrekte Silben/Töne.
- ASR-Textabweichungen: Qwen 4/15, Melo 8/15, CosyVoice 6/15. **Keine Fehlerrate und keine Rangliste.** Homophone, Neutralton, fremdsprachige Namen und sehr kurze Silben sind für ASR schwierig. Rohtranskripte stehen in `screening.json`.
- Gesamte Audiodauer etwa 42,5 Sekunden. 45 einzeln vergleichbare Clips sind der vollständige Satz; ein erster Hörvergleich dauert mit Bedienung wenige Minuten.

### Tempo

Verhältnis des gemessenen aktiven Sprachabschnitts Slow / Natural; vorläufiger Warnkorridor **1,2–1,9**, kein wissenschaftlicher Grenzwert. Kurze Clips und Pegeländerungen beeinflussen die Energiedetektion. Zusätzlich bleiben volle WAV-Dauern dokumentiert.

| Ziel | Qwen | Melo | CosyVoice |
|---|---:|---:|---:|
| 你好 | 2,093 | 1,355 | 0,580 |
| 谢谢 | 1,261 | 1,054 | 1,143 |
| 我叫 Wolfram | 1,049 | 1,151 | 0,776 |
| 你叫什么名字？ | 1,349 | 1,194 | 0,715 |

### Isolierte ma-Lehrkonturen

Praat-F0 im vollständigen Clip, 65–550 Hz. Breite Formhinweise: Qwen nur Ton 4 kompatibel, Melo nur Ton 1 kompatibel, CosyVoice nur Ton 3 kompatibel. Alle übrigen erhalten `review`. **Kompatibel bedeutet nicht korrekt**: etwa CosyVoice Ton 3 enthält deutliche Tracking-Lücken und könnte durch Oktavfehler beeinflusst sein. Es gibt keinen Gesamt-Pitchscore. Ein gleichförmiger Verlauf allein beweist auch nicht die passende hohe Tonlage von Ton 1. Rohpunkte, stimmhafte Anteile und Heuristik sind einsehbar.

## Empfehlung und verbleibende Hörprüfung

**Jetzt keinen Anbieter übernehmen.** Melo wäre bei ausreichender Qualität technisch attraktiv, ist mit diesem unbearbeiteten Satz aber nicht zuverlässig genug. Qwen und CosyVoice lösen die geforderten Lehrkonturen und die Stilunterscheidung ebenfalls nicht bereits nachweislich. Kein weiteres Nachformen der Töne und kein Bau einer eigenen Erkennung.

Die kurze blinde Hörprobe soll noch klären: Sind `你/我/好` wirklich die erwarteten Silben, sind die vier ma-Töne für Anfänger eindeutig, klingt Natural ruhig genug und Slow sorgfältiger statt unnatürlich, bleibt „Wolfram“ verständlich, und stimmen Neutralton/Sandhi in den Phrasen? Besonders Silbenidentität, hörbare Artefakte, Natürlichkeit und didaktische Eignung kann diese Messung nicht entscheiden. Eine fachkundige Mandarin-Hörprüfung bleibt nötig; ich beanspruche keine solche menschliche Abnahme.

Falls dieser kleine Hörvergleich keinen durchgehend überzeugenden Kandidaten ergibt, ist der nächste sinnvolle Schritt ein **begrenzter professioneller Anbieter-Vergleich** anhand derselben elf Ziele, beispielsweise Azure. Dafür gilt weiterhin: keine Ressource ohne eure Entscheidung, keine Zugangsdaten voraussetzen. Keine komplizierte lokale Ersatztechnologie bauen.

## Prüfstand und Grenzen

Ein Seed und eine Stimme je Kandidat, keine wiederholten zufälligen Versuche oder Auswahl besonders gelungener Ergebnisse. Keine Aussage über langfristige Fehlerraten. Qwen verwendet hier wegen „nur offizielle Modelle“ Originalgewichte und offizielle Laufzeit statt der bisherigen MLX-Community-4bit-Konvertierung; der frühere A2-Stand ist separat dokumentiert. Damit ist es eine transparente Baseline derselben Modellfamilie, keine identische Reproduktion der alten Pipeline.

Zusätzlich: 34/34 bestehende App-Tests erfolgreich, Content-Validierung und Produktionsbuild erfolgreich. Diese Tests prüfen nicht die Mandarin-Hörqualität.

Chrome und WebKit: elf Ziele, 45 Audios, Dateidecodierung, Notizen nach Neuladen, Auflösen/Verbergen, Reset, Export, nur ein laufender Clip, Original-Wiedergabetempo und schmale Mobilansicht geprüft. Kein Zugriff auf echten Learner State oder Research Logs. Hörseite ausschließlich lokal, keine neue PWA-Route und kein Service-Worker-Eintrag.


---

# A2 Mandarin TTS Bake-off — Methode und Grenzen

Interner lokaler Versuch, keine Freigabe und kein Deployment. Festgelegt am 27.09.2026.

## Versuchsaufbau

11 kanonische Ziele: 你, 我, 好, 你好, 谢谢, 我叫 Wolfram, 你叫什么名字？ und mā/má/mǎ/mà. Für vier mehrsilbige Ziele zwei Varianten, insgesamt 15 WAV-Dateien je lauffähigem Kandidaten. Je Kombination ein fester Seed (42), kein nachträgliches Auswählen aus beliebig vielen Versuchen. Technische Startfehler dürfen behoben werden; inhaltliche Fehler bleiben als Ergebnis erhalten. Keine Tonkonturkorrektur, Normalisierung, Stilleentfernung, Waveform-Tempodehnung oder geänderte Wiedergaberate.

Qwen: gleiche Familie (1.7B CustomVoice), Stimme Serena, natural-Anweisung, Temperatur 0,6 wie im bisherigen A2. Wegen der Vorgabe „nur offizielle Modelle“ neue Ausgabe mit Qwens offizieller Laufzeit und Originalgewichten statt der früheren MLX-Community-4bit-Konvertierung. Dies ist **keine bitidentische Reproduktion der bisherigen Pipeline**. Der frühere Stand bleibt separat in A2_QA_REPORT.json dokumentiert. Insbesondere die früher mit Praat manipulierten ma-Konturen sind nicht Teil der neuen Qwen-Hörproben. `max_new_tokens=180` begrenzt Ausreißer; ein Erreichen dieser Grenze ist keine korrekte Finalisierungsgarantie.

Melo: offizielles chinesisch/englisch gemischtes Modell, Sprecher ZH (ID 1 aus der offiziellen Konfiguration). Natural speed 0,90, Slow 0,75. Der offizielle VITS-Pfad verwendet `length_scale=1/speed` beim Generieren der Lautdauern, nicht als Wiedergabe- oder fertige Waveform-Streckung. Kein eigener Stil-/Artikulationsprompt; deshalb nur teilweise Umsetzung von „careful_slow“. Ob die Ausgabe wie sorgfältigeres Sprechen klingt, muss gehört werden. Hanzi über den eingebauten G2P-/Sandhi-Pfad; kein dokumentiertes Pinyin-Override in der verwendeten öffentlichen TTS-API.

CosyVoice 3: offizielles Basis-Modell, keine RL-Variante. CPU-FP32, keine CUDA-/TensorRT-/vLLM-Erweiterung, `speed=1`. Anweisungen im dokumentierten `inference_instruct2`-Format. Für isolierte Silben offizielle Pinyin-Inpainting-Tokens wie `[n][ǐ]` und `[m][ǎ]`, text_frontend=False. Für Phrasen unveränderte Hanzi einschließlich „Wolfram“. Der separate CosyVoice-Speed-Regler wird nicht verwendet, da dessen Code das Mel-Spektrogramm interpoliert. Sprecherreferenz: unveränderte `asset/zero_shot_prompt.wav` aus dem offiziellen Beispiel. Diese Beispielstimme ist für den internen Versuch verwendet; sie wird nicht als dauerhaft lizenzierte Produktstimme freigegeben.

Hardware: Apple M1 Max, 10 CPU-Kerne, 32 GiB RAM. Modellladezeiten, erste NLP-Downloads und kalte Imports von Synthesezeiten unterscheiden. Max-RSS enthält Modell und Python-Laufzeit, bei MPS nicht vollständig den GPU-Speicher. Keine pauschalen CUDA-Benchmarkaussagen auf diesen Mac übertragen.

## Lizenzprüfung vor Installation

| Kandidat | Code | relevante veröffentlichte Modellgewichte | Entscheidung |
|---|---|---|---|
| Qwen3-TTS 1.7B CustomVoice | Apache-2.0 | Apache-2.0 | Kommerzielle Option nicht durch eine NC-Klausel ausgeschlossen. |
| MeloTTS Mandarin | MIT | MIT; multilingualer BERT-Textencoder Apache-2.0 | Zugelassen. |
| Fun-CosyVoice3-0.5B-2512 | Apache-2.0 | Apache-2.0 | Zugelassen; spätere Produktstimme gesondert klären. |

Offizielle Quellen: [Qwen-Code](https://github.com/QwenLM/Qwen3-TTS), [Qwen-Modell](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice), [Melo-Code/Lizenz](https://github.com/myshell-ai/MeloTTS), [Melo-Mandarin-Modell](https://huggingface.co/myshell-ai/MeloTTS-Chinese), [BERT](https://huggingface.co/google-bert/bert-base-multilingual-uncased), [CosyVoice-Code](https://github.com/FunAudioLLM/CosyVoice), [CosyVoice-Modell](https://huggingface.co/FunAudioLLM/Fun-CosyVoice3-0.5B-2512).

Die geprüften relevanten Modellkarten enthalten kein nichtkommerzielles Verbot. Lizenz-/Attributionspflichten bleiben bestehen. Code-/Gewichtslizenzen sind keine pauschale Garantie für Rechte an jeder denkbaren Sprecherreferenz. Keine Fremdstimme wurde aus externen Medien beschafft; keine Nutzerstimme wurde hochgeladen. Modelle und Werkzeuge werden nicht in der PWA ausgeliefert.

## Screening

Vorhandene kleine Messfunktionen, nur offline für diesen Versuch: WAV-Decodierung/Finite-Werte, Peak, Clippinganteil, aktive RMS-Lautstärke, 10-ms-Energiegrenzen, führende/abschließende Stille, maximale innere leise Pause und Dauer. Hinweise auf Dropouts/Glitches sind unvollständig: eine Pause kann beabsichtigt sein, ein hörbarer Artefakt kann ohne solche Werte auftreten. Keine Messung wird „glitchfrei“ beweisen.

ASR ohne Referenztext, kein Prompt mit der erwarteten Antwort. Nur Transkript/Warnhinweis, keine automatische Sprach-/Tonfreigabe. „Wolfram“ kann als lateinischer Name oder chinesische Transkription erscheinen; unterschiedliche Schrift ist kein Beweis eines Aussprachefehlers. ma-Homophone unterscheiden nicht automatisch den Ton.

Nur die isolierten vier ma-Töne erhalten Praat-F0-Auswertung, mit 65–550 Hz Suchbereich. Gespeichert werden Verlauf und grobe Formhinweise. Creaky Voice, Halbtöne/Oktavsprünge und fehlende stimmhafte Frames können den Tracker täuschen. Ton 3 ist hier die isolierte Lehrkontur, nicht die Forderung nach einer Vollkontur in jeder Phrase. Keine universelle Punktzahl; MFA nicht als Zertifikat.

Vorläufige Tempo-Korridore sind Warnschwellen, keine wissenschaftlichen Normen. Für gemischtes „我叫 Wolfram“ wird keine erfundene Mandarin-Silbenrate berechnet. Natürliche Sandhi- und Neutraltonrealisierungen brauchen fachliches Hören.

## Hörprobe

A/B/C pro Ziel fest gemischt. Anbieter erst über „Auflösen“ sichtbar. Alle Clips zum Originaltempo, keine automatische Qualitätsrangfolge. Optional ein Urteil und kurzer Kommentar pro Ziel. Notizen nur in eigenem LocalStorage-Namensraum; kein Learner State, kein Research Log, kein Mikrofon und keine Cloudverarbeitung. Ein erster Durchlauf soll wenige Minuten dauern, keine große Bewertungsaktion.

Ohne Mandarin-Hörabnahme kann keine Engine als zuverlässig genug freigegeben werden. Technische Einfachheit bestimmt höchstens, welchen Kandidaten wir nach positivem Hören bevorzugen. Wenn keiner überzeugt, folgt ein begrenzter professioneller Anbieter-Vergleich, kein Bau eigener Sprachtechnologie.

## Praktische Installation

Drei getrennte Python-Umgebungen, keine Änderung der App-Abhängigkeiten. Melo und CosyVoice verwenden hier Python 3.10 / Torch 2.3.1, Qwen Python 3.12 / Torch 2.14.0. Die genauen installierten Pakete und offiziellen Modell-/Code-Revisionsstände liegen im Versuchsbundle.

Melo erforderte `setuptools<81`, einen Verweis auf das mitinstallierte unidic-lite-Wörterbuch wegen der pauschal importierten japanischen Sprachunterstützung und einen CPU-Gerätewert als Torch-Objekt: Der offizielle chinesische Frontend-Code wechselt sonst auf diesem Mac nur Eingaben, nicht BERT-Gewichte, auf MPS. Keine Änderung an Gewichten oder Lautgenerierung. CosyVoice benötigte ebenfalls die setuptools-Begrenzung für ältere Abhängigkeiten; der offizielle Wetext-Frontend lädt FST-Ressourcen automatisch. [Wetext](https://github.com/pengzhendong/wetext) und [WeTextProcessing](https://github.com/wenet-e2e/WeTextProcessing) sind Apache-2.0. Sprach-Frontend und Modelldownloads machen die Erstinstallation deutlich aufwendiger als die reine spätere Synthese.

Die Downloadmengen betragen ungefähr 0,2 GB Melo-Sprachmodell plus 0,7 GB BERT, 5,4 GB CosyVoice-Inferenzmodelle und 4,5 GB Qwen-Gewichte. Laufzeitpakete und Caches kommen hinzu. CosyVoice läuft hier CPU-only, Qwen mit MPS. Gemessene Zeiten sind Beobachtungen auf diesem Mac, kein kontrollierter Hardware-Benchmark; teilweise liefen Downloads bzw. ASR parallel.

ASR: offizielles Qwen3-ASR-0.6B, lokale Ausführung über MLX-Audio; Originalgewichte, keine fremde Modellkonvertierung, kein Referenztext. Das ASR-Modell stammt aus derselben Modellfamilie wie ein Kandidat: mögliche korrelierte Fehler sind ein weiterer Grund, Transkripte nicht als Rangliste zu verwenden.
