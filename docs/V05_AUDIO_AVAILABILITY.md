# v0.5 — Audio-Verfügbarkeit

Lokal umgesetzt auf Main `ea0fdfb4895f02c20e501ea2265f03e5585b19a5`, Branch `implement/audio-availability`. Kein Deployment.

## Änderungen

- Nach falscher oder korrekturbedürftiger Textproduktion: vollständige Zielreferenz mit Hanzi, Pinyin, Bedeutung und vorhandener normaler/langsamer Wiedergabe. Kein Autoplay, auch nicht nach Reload. Gilt auch bei inhaltlichem Erfolg mit Tonnotationskorrektur.
- Vollständig richtige Produktion: kein zusätzlicher Phrase-Player.
- Detailaudio nur im geöffneten Detail; 什麼 nutzt `what`.
- Jede erklärte Einheit trifft explizit eine Entscheidung: vorhandenes Item-Audio, unabhängiges Referenzaudio oder bewusst nur die ganze Phrase (mit Begründung). Letztere wird im Detail eindeutig als ganzer Ausdruck angeboten.
- Neue Wiedergaben loggen `optional_reference_audio` plus `optionalPractice: true`, nicht `audio_replay`. Kein Reveal-/Bewertungspfad; bestehende Filter halten die Ereignisse aus Scheduling und Mastery heraus.

## Acht neue normale Referenzen

Dateien liegen unter `public/audio/mandarin/`. Alle Aussprachewerte stammen unverändert aus `exploration.units[].syllables`; lexikalische Wortdaten bleiben separat erhalten.

| Einheit | Gesprochene Silben | Kontext | Datei |
|---|---|---|---|
| 叫 | jiao4 | 我叫 / 你叫什麼名字 | polly-detail-jiao.mp3 |
| 名字 | ming2 zi5 | 你叫什麼名字 | polly-detail-mingzi.mp3 |
| 聽不懂 | ting1 bu5 dong3 | 我聽不懂 | polly-detail-tingbudong.mp3 |
| 再 | zai4 | 請再說一遍 | polly-detail-zai.mp3 |
| 說 | shuo1 | 請再說一遍 / 請說慢一點 | polly-detail-shuo.mp3 |
| 一遍 | yi2 bian4 | 請再說一遍 | polly-detail-yibian.mp3 |
| 慢 | man4 | 請說慢一點 | polly-detail-man.mp3 |
| 一點 | yi4 dian3 | 請說慢一點 | polly-detail-yidian.mp3 |

Polly, bestehende Stimme/Engine und Normalgeschwindigkeit. Keine langsamen Detailvarianten. Mehrfach vorkommende Einheiten teilen dieselbe Datei. 什麼 verwendet unverändert `polly-what.mp3`.

Die acht neuen Dateien bestehen die bestehenden technischen Generierungsprüfungen. Ihr Status bleibt korrekt `needs_human_review`; keine muttersprachliche Abnahme wird behauptet. Die vorhandene Tempoheuristik markiert 聽不懂, 再, 慢 und 一點 mit `pace`; das sind Reviewhinweise, keine automatische Aussage über sprachliche Richtigkeit. Keine Anpassung der Prüfschwellen und keine zusätzliche Hör-/Recording-Regression.

## Schema und Pipeline

`audioItem` wurde durch die verpflichtende `audio`-Entscheidung ersetzt. `content.detailAudio` wird aus den Einheiten abgeleitet und nach Medien-ID dedupliziert, ohne neue Items oder Aufgaben. Wörter, Hanzi, Kontextsilben und Asset bleiben überprüfbar verbunden. Konfligierende Referenzen, fehlende Entscheidungen, fehlende Manifest-/Dateieinträge und abweichende Kontextaussprache werden abgewiesen.

Der bestehende Generator unterstützt Detailreferenzen und `--details-only`; unveränderte Dateien bleiben durch Fingerprinting erhalten. Produktionsinventar, Buildfilter und Offline-Bundle enthalten alle acht Dateien. Details: [Contentvertrag](CONTENT_SCHEMA.md#v05-audio-availability).

## Gezielte Prüfung

- 49 bestandene Node-Tests: Segmentierung, Content-/Assessment-Verträge, Referenzen, Generator, Manifest und fehlende Dateien; einschließlich eines gezielt ausgewählten bestehenden Contenttests.
- 8 bestandene Chrome-UI-Tests: Fehler und Tonnotationskorrektur, Erfolg ohne zusätzliches Audio, Reload, alle acht Detailreferenzen plus 什麼, Sichtbarkeit nur im Detail, Stimulus-Replay ohne Antwort und unveränderte Lernstände/Planung nach Wiedergabe.
- Content-/Audio-Validierung, Typprüfung und Produktionsbuild bestanden: 44 Wörter, 36 Lernobjekte, 131 Aufgaben, 84 Audios.
- Generierungs-Dry-Run nach Erzeugung: 0 Änderungen geplant.
- Gegen Main verglichen: alle 131 Aufgaben, 44 Wörter, Segmentierungen/Pinyin und 76 bestehenden Manifesteinträge unverändert. Bestehende Dateien durch ihre Prüfsummen bestätigt.

Keine fachliche Abweichung vom Audit. Keine langsamen Chunk-Audios, zusätzlichen Zeichenobjekte, Schreib-/Recording-/Safari-Arbeiten oder neuen Lernbewertungen.
