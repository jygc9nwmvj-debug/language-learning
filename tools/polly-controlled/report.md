# A2 – Kontrollierter Polly-Test

15 neue Syntheseaufträge, Zhiyu / neural / cmn-CN / eu-central-1. 24 kHz MP3. Kein Deployment, keine Produktionsänderung.

## Ergebnis

Vier ma-Wiederholungen sind SHA-256-identisch mit den vier vom Nutzer als besser bewerteten Einzelaufnahmen. Reproduzierbarkeit dieses Satzes bestätigt; keine Garantie für unveränderliche Anbieter-Ausgaben in Zukunft. Die gemeldeten Einstellungen der alten Dateien werden dadurch plausibel, sind aber keine extrahierten Metadaten.

Alle 15 Dateien decodierbar; keine Clipping-, Pegel- oder Stillewarnung der bestehenden Heuristik. ma1–ma4 im aktiven Abschnitt grob kompatibel. Im vollständigen Clip ist ma1 weiterhin ein Randfall der Ebenheitsheuristik. Keine automatische Freigabe.

Natural 90 %, Careful Slow 75 %; beide separat synthetisiert, keine Nachbearbeitung. Slow/Natural-Verhältnis der aktiven Sprachdauer: 你好 1,161; 谢谢 1,185; 我叫 Wolfram 1,192; 你叫什么名字 1,205. Die ersten drei liegen knapp unter dem vorläufigen 1,2-Warnwert. Keine Behauptung zusätzlicher Artikulationskontrolle.

Tempo-Warnungen: Slow bei 你好/谢谢 unter dem vorläufigen Silbenraten-Korridor; die Namensfrage in beiden Varianten darüber. Warnschwellen sind keine didaktischen Normen.

ASR ohne Referenztext erkennt ni/wo/hao und die Namensfrage passend, transkribiert aber 你好 als 您好 und Wolfram als 乌弗伦; ma-Homophone wechseln. Das verlangt Hören, beweist keine falsche Aussprache.

## Sprachsteuerung

Isolierte Silben mit lexical ni3/wo3/hao3/ma1–4. 你好 explizit ni2-hao3 (Oberflächenform des 3+3-Sandhi), kanonisches Pinyin bleibt nǐ hǎo. 谢谢 xie4-xie0; Frage ni3-jiao4-shen2-me0-ming2-zi0. Phrasen am Stück erzeugt, keine zusammengesetzten Silben. Wolfram unverändert als Text, keine behauptete deutsche Aussprachekontrolle. SSML je Datei vollständig im Manifest.

## Kosten / Quellen

AWS meldete insgesamt 51 RequestCharacters. Bei 16 USD/Million Neural-Zeichen rechnerisch 0,000816 USD vor Steuern/Free Tier; tatsächliche Rechnung wurde nicht abgerufen. Keine Schlüssel im Prüfstand.

[AWS Pinyin](https://docs.aws.amazon.com/polly/latest/dg/ph-table-mandarin.html) · [Prosody](https://docs.aws.amazon.com/polly/latest/dg/prosody-tag.html) · [Preise](https://aws.amazon.com/polly/pricing/) · [Output-Rechte/FAQ](https://aws.amazon.com/polly/faqs/)

## Entscheidung

Polly weiter als Kandidat, keine Freigabe vor Hörabnahme. Kernseite enthält ni/wo, vier ma-Töne und zwei Phrasen mit Natural/Slow. Hao, xiexie und Name optional. Bewertungen getrennt nach Aussprache, Ton und Tempo; im eigenen LocalStorage, ohne Learner State oder Research Logs. Danach stoppen.
