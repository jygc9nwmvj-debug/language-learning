# A2 abgeschlossen – Polly in Lesson 1

App-Integration; Veröffentlichung der normalen Test-App durch den anschließenden Auftrag „A2 — FINALIZE AND SHIP“ freigegeben. 12 vollständig nutzerakzeptierte MP3-Dateien werden bytegenau unverändert verwendet. Akzeptanzquelle: A2_POLLY_USER_ACCEPTANCE.json. Originaler Prüfstand unter tools/polly-controlled. Keine Audio-Normalisierung, kein Trimmen, keine Tonkonturkorrektur und keine Waveform-Tempodehnung.

## Aktive Dateien und Zustände

A2_AUDIO_MANIFEST.json ist die kleine, beim Build geprüfte Zuordnung von App-Pfad, SHA-256, Parametern und Qualität. Keine neue Produktionsengine.

- generated: erzeugt, keine vollständige aktuelle technische Freigabe behauptet.
- technically_validated: Dateiintegrität und technische Messungen bestanden, keine Nutzerakzeptanz behauptet.
- user_accepted: technisch geprüft und genau diese Datei in Aussprache, Ton und Tempo vom Nutzer akzeptiert. Keine Behauptung unabhängiger fachlicher Zertifizierung.
- needs_human_review: technisch geprüft, aber offene/unsichere Bewertung oder nachträgliche Änderung. Durch ausdrückliche Nutzerentscheidung vorläufig im Lernfluss erlaubt. Technische Prüfung bleibt separat erhalten.

Drei Polly-Dateien sind needs_human_review: mā unverändert, 你好 careful_slow unverändert und 你叫什么名字 natural mit 80 % statt vorher 90 %. Die neue Namensfrage dauert 1,608 s statt 1,440 s; aktive Sprache 1,31 s, Peak −12,28 dBFS, keine Clipping-/Stille-/Pegelauffälligkeit. Tempoheuristik weiterhin Warnhinweis, keine weitere Hörschleife verlangt. Slow bleibt unverändert bei 75 %.

Fünf vorhandene Referenzen waren nicht Teil des akzeptierten Polly-Satzes: ni/wo/hao careful_slow und zaijian natural/careful_slow. Sie bleiben als Legacy-Dateien mit Zustand generated erhalten. Kein stillschweigender Wechsel ihrer Qualität und kein unerbetener zusätzlicher Syntheseauftrag. Das vorangehende Manifest ist unter A2_AUDIO_MANIFEST_PRE_POLLY.json archiviert. Unbenutzte alte WAVs bleiben vorerst für bestehende Testfixtures erhalten; aktive Zuordnung steht im Lesson-JSON. Die Lesson bleibt insgesamt draft/prototype, nicht pauschal audio_reviewed.

## Reproduktion eines gezielten Auftrags

AWS CLI mit temporärer Browseranmeldung im lokalen Profil mandarin-a2 verwenden. Keine Zugangsdaten in Repository, Befehlsargumente, Dokumentation, Logs, Testseite oder Cloudflare kopieren. Das Profil liegt außerhalb des Projekts in der Standard-AWS-Verwaltung. Keine Debug-Ausgabe einschalten.

Den ssml-Wert der gewünschten Datei aus dem aktiven Manifest unverändert in eine UTF-8-Datei übernehmen. Ein Syntheseauftrag pro Referenzäußerung; ganze Phrasen zusammenhängend, nicht aus Silben zusammensetzen. Beispiel (keine Geheimnisse):

```sh
aws polly synthesize-speech --profile mandarin-a2 --region eu-central-1 \
  --engine neural --voice-id Zhiyu --language-code cmn-CN \
  --output-format mp3 --sample-rate 24000 --text-type ssml \
  --text file://utterance.ssml output.mp3 --no-cli-pager
```

Stimme Zhiyu, Engine neural, Mandarin cmn-CN, Frankfurt. Natural-Phrasen regulär 90 %, Slow 75 %, korrigierte Natural-Namensfrage 80 %. Isolierte Silben ohne prosody-rate. Pinyin mit x-amazon-pinyin; Neutralton 0. 你好 verwendet ni2-hao3 als gesprochene 3+3-Sandhi-Form, kanonische Schrift/Pinyin bleiben nǐ hǎo. Wolfram bleibt Text innerhalb derselben Phrase. Kein universeller Pinyin-Umschreiber.

Neue Dateien zuerst generated; anschließend decodieren und bestehende A2-Pegel/Stille/Clipping-Prüfung anwenden. Tempo, ASR und F0 sind Warnungen, keine automatische Aussprachefreigabe. Akzeptanz ist an Dateihash gebunden und darf nach Neugenerierung nicht übernommen werden. Diese Phase ist bewusst manuell und klein. Die vier ma-Wiederholungen waren in diesem Versuch byteidentisch; AWS garantiert damit keine dauerhaft identischen Modellversionen.

## Kosten und Rechte

Neural laut geprüfter AWS-Preisseite 16 USD/Million Zeichen außerhalb Free Tier; der 15er-Test meldete 51 Zeichen, rechnerisch 0,000816 USD vor Steuer/Free Tier, plus die einzelne Korrektur. Keine Rechnung geprüft. AWS erlaubt Speichern und Wiederverwenden des Outputs; grundsätzlich auch in kommerziellen Apps nach AWS-Vertragsbedingungen. Keine zusätzlichen Lizenz-/Attributionsanforderungen in den geprüften Polly-FAQ festgestellt. Nur festgelegte Lerntexte wurden gesendet, keine Lerneraufnahmen.

Quellen: https://docs.aws.amazon.com/polly/latest/dg/ph-table-mandarin.html · https://docs.aws.amazon.com/polly/latest/dg/prosody-tag.html · https://aws.amazon.com/polly/pricing/ · https://aws.amazon.com/polly/faqs/

## Abschluss

A2-Umsetzung abgeschlossen mit drei ausdrücklich vorläufigen Polly-Referenzen und fünf unveränderten Legacy-Referenzen außerhalb dieser Abnahme. Keine weitere Nutzer-Testschleife. Keine Änderungen an Writing, Lesson 2 oder Learner State.

Validierung: 37/37 Tests, Content-Validierung und Produktionsbuild erfolgreich. Chrome und WebKit: normale App gestartet, Referenzbutton betätigt, alle 20 aktiven Audios decodiert und bei tatsächlich gestopptem Testserver offline abgerufen. Kein Browserfehler. Die WebKit-Netzwerkemulation wurde durch den echten Serverstopp ersetzt (bekannte Testwerkzeug-Einschränkung).

## Freigabe zum normalen Testbetrieb

Amazon Polly ist der vorläufig akzeptierte Generator dieses Prototyps. Der Lerninhalt verweist ausschließlich auf Asset-Pfade; Provider, Stimme und SSML gehören zum separaten Herkunftsmanifest. Andere TTS-Quellen oder genehmigte menschliche Aufnahmen können später dieselbe Schnittstelle verwenden. Zusätzliche Statuswerte wie human_expert_approved sind später erweiterbar, aktuell nicht implementiert.

Der veröffentlichte Build enthält nur aktuell referenzierte Audio-Dateien. Archivierte/abgelehnte Qwen-, Melo-, CosyVoice- oder alte Tonexperimente werden nicht mitkopiert. Fünf bereits vorhandene Legacy-Referenzen bleiben ausdrücklich generated und sind keine akzeptierten Polly-Dateien. Kein pauschales Audio-Qualitätssiegel für den gesamten Inhalt.

Aufnahme: Browser-onstart plus lebende, nicht stummgeschaltete Tracks steuern die Bereitschaft. Keine feste 500-ms-Verzögerung und kein Warten auf den ersten Datenblock. Alle nichtleeren Chunks inklusive Finalchunk werden gesammelt; Streamfreigabe nach onstop; 200-ms-Auslauf beim normalen Beenden bleibt bestehen. Unterbrechungen und leere/zu leise Aufnahmen werden erkannt. Kein Redesign des Players.
