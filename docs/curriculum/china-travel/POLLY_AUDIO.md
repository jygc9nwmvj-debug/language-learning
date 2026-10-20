# Taiwan-Lernstrecke: AWS-Hörfassung lokal integriert

20. Oktober 2026 · Branch `implement/taiwan-text` · Nutzerauftrag: AWS-Audios erzeugen und integrieren, Taiwan-Wortwahl beibehalten, keine Veröffentlichung und kein Merge.

## Fertiger Umfang

Der freigegebene Textkanon ist unverändert: SHA-256 `a3a76c9943691bcdc59420da9a41b72cbf818134402341d26f25e1fc11cee7d7`. Die 134 Lernobjekte, 28 Dialoge, 176 eindeutigen Äußerungen, 221 Übungen und zehn Schreibziele bleiben erhalten. Traditional und Simplified verwenden dieselbe Aussprache und ihre jeweiligen kanonischen Schriftformen.

Erzeugt wurden **572 WAV-Dateien**: 164 Wortreferenzen, 352 Satzreferenzen (176 jeweils normal und langsamer) und 56 Dialogfassungen (28 jeweils normal und langsamer). Neue Dateien umfassen 47.084.118 Bytes und tragen den eigenen Präfix `tw-polly-`. Vorhandene Foundation-Audios und ihr Manifest wurden nicht ersetzt. Die vorläufige Arbeit im anderen Feature-Worktree blieb isoliert; keine erneute Inventur oder Synthese dieses Materials.

[POLLY_AUDIO_MANIFEST.json](POLLY_AUDIO_MANIFEST.json) enthält jeden Auftrag, Originaltext in beiden Schriften, nummerierte Aussprache, SSML, Provider, Stimme, Dateipfad, Fingerprint und Dateiprüfsumme. Dialoge werden aus genau den einzeln abrufbaren Satzaufnahmen zusammengesetzt. Sämtliche 291 Satzvorkommen pro Geschwindigkeit behalten Reihenfolge, Rolle und genaue Start-/Endgrenzen. 180 ms trennen Sätze innerhalb eines Sprecherzugs, 350 ms Sprecherwechsel. Es gibt keine nachträglich geschätzte Segmentierung.

## Stimme und sprachliche Grenze

Verwendet wird der vorhandene AWS-Zugang, Amazon Polly neural mit **Zhiyu / cmn-CN**, Region eu-central-1. Es ist eine Mandarin-Stimme für alle Rollen; Taiwan-Akzent und unterschiedliche Rollenstimmen werden nicht behauptet. Die kanonischen Taiwan-Wörter bleiben unverändert. Rollen sind sichtbar und durch Sprechpausen getrennt.

Normale Referenzen verwenden die bisherige 85-%-Sprechrate, langsamere 75 %. Die bestehende Polly-Pinyin-Phonemsteuerung bleibt erhalten. Wörter verwenden die lexikalischen Töne; Sätze die bereits redaktionell hinterlegte, begrenzte Oberflächenton-Fassung. Die Herstellung fügt keine neuen Sandhi-Regeln oder Formulierungen hinzu. Lexikalische Töne, natürlicher Redefluss und regionale Lautung sind damit nicht akustisch zertifiziert.

Die Audios sind 16-kHz-/16-bit-/Mono-PCM in WAV. Zugangsdaten bleiben außerhalb des Frontends und des Manifests. Der Generator ist standardmäßig eine Vorschau; echte Aufrufe benötigen ausdrücklich `--generate --all` oder `--generate --sample G07`. Passende, unveränderte Dateien werden wiederverwendet; abweichende bereits referenzierte Audios werden nicht automatisch überschrieben.

## In der App nutzbar

- Wortmodelle, Beispielsätze und vollständige Dialoge haben lokale Wiedergabe. Sätze und Dialoge bieten normale und langsame Fassung. Die vorhandene globale Audio-/Aufnahmesperre verhindert parallele Referenzwiedergabe.
- Benötigte Wortformen werden vor Hörfragen eingeführt. Erst das tatsächliche Ende der Wortwiedergabe zählt als gehörtes Modell; die explizite Textalternative bleibt verfügbar.
- Satzverständnis, Beträge/Uhrzeiten und Wege können als Hörfragen bearbeitet werden: zunächst ohne Hanzi oder Pinyin, auswertbar erst nach abgeschlossener Satzwiedergabe. Text-Hilfe und Wiederholung werden als Unterstützung erfasst. Die explizite Textalternative speichert Leseverständnis. Dialogarbeit bleibt angeleitet; sie behauptet keine unabhängige Hörbeherrschung.
- Alle 19 Laut–Hanzi-Gruppen sind zusätzlich zu den 19 Hanzi–Bedeutungs-Gruppen aktiv. Lautfelder zeigen nur nummerierte Höraktionen; die Schriftantwort erscheint auf der anderen Seite. Paarversuche bleiben lokale Übungsevidenz, keine pauschale Meisterschaft.
- Frühere Text-Checkpoints bleiben lesbar. Ein früher nur gelesener Dialog kann eine gesonderte Hörfassung erhalten; alte Leseergebnisse werden nicht zu Hörergebnissen umgeschrieben. Der Plan umfasst 292 reguläre Aktivitäten, zehn verzögerte Schreibdefinitionen und 28 reservierte Hörnachholdefinitionen: 330 wiederherstellbare Definitionen.
- Alle 572 neuen Audios sind im lokalen Build und dessen bestehendem Offline-Paket enthalten. Die größere Erstinstallation benötigt entsprechend mehr Speicher. Es gibt keine Browser-TTS- oder Cloud-Laufzeitanfrage zum Erzeugen neuer Inhalte.

## Prüfbare Nachweise und Grenzen

**Vollständige technische Population:** 516/516 Referenzen und 56/56 Dialogdateien stimmen mit Plan, freigegebenem Kanon, Prüfsummen, PCM-Format und exakter Montage samt Grenzen überein. Sämtliche benötigten Wortprärequisiten haben Audio. Aktivsignal, Dauer und Clippingprüfung sind bestanden; keine Pegel-/Randwarnungen. Das ist Dateiplausibilität, keine menschliche Beurteilung von Aussprache oder Natürlichkeit. Alle Dateien behalten `needs_human_review`; keine QA-Freigabe wird erfunden.

**Automatisierte Funktionstests:** 247 Node-Tests bestanden, einschließlich exakter AWS-Abbildung/Montage, vollständiger Curriculum-Erreichbarkeit und getrenntem Nachholen früherer Textdialoge. UI-Textinventar und Resolution-Vertrag haben keine unklassifizierten oder veralteten Quellen. Der Produktionsbuild ist lokal erfolgreich.

**Repräsentative Browserfälle:** 22 Fälle in Chrome und WebKit bestanden (20 im ersten Durchgang; zwei Dialogfälle nach Korrektur ihres erwarteten zugänglichen Buttonnamens). Abgedeckt sind Traditional/Simplified, Textalternative, Korrektur und Neuladen, Wortvorbereitung, Uhrzeit, freie schriftliche Antwort, mehrere passende Zahlungsantworten, Schrift–Bedeutungs-Matching, Schreiben, Wege/Pinyin-Hilfe sowie echte Satzwiedergabe mit Hörnachweis und Text-Hilfe, echte Laut–Hanzi-Zuordnung und normale/langsame Dialogwiedergabe mit eigenständigen Satzreferenzen. Repräsentative mobile Breite: 375 × 812 CSS-Pixel. Das beweist keine vollständige Kombination aller Inhalte, Geräte und Zustände und keine muttersprachliche Hörprüfung.

Befehle zur lokalen Reproduktion: `npm test`, `npm run build`, `npx playwright test --config playwright.taiwan.config.ts`; Dateiprüfung separat über `node scripts/validate-taiwan-audio.mjs`.

Keine Veröffentlichung, kein Push, kein Deployment und kein Merge erfolgt.


## Freigabe zur Veröffentlichung · 20. Oktober 2026

Der Nutzer hat ausdrücklich bestätigt, dass keine Person für eine fachliche Audioabnahme verfügbar ist, und Merge sowie Veröffentlichung freigegeben. Die technisch geprüfte Hörfassung wird deshalb im bestehenden persönlichen Testangebot veröffentlicht. Eine menschliche/muttersprachliche Abnahme wird nicht behauptet; der dokumentierte Status `needs_human_review` bleibt erhalten. Diese Freigabe ersetzt keine sprachliche Zertifizierung und löst keine weitere redaktionelle Prüfschleife aus.
