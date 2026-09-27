# A2 – Vergleich bestehender Mandarin-Audio-Lösungen

Stand: 27. September 2026. Entscheidungsvorlage, keine Audiofreigabe.

## Empfehlung

Keine eigene Phonemerkennung und keine zusätzliche komplexe Bewertungsengine bauen. Für A2 reicht eine kleine lokale Vorprüfung aus Datei-/Metadatenprüfung, vorhandener Praat-F0-Messung und unvoreingenommener Qwen-ASR als Warnsignal. Sie kann grobe Fehler aussortieren, aber keine pädagogisch zuverlässige Mandarin-Referenz garantieren. Die bestehenden Audios sind weiterhin nicht freigegeben.

Azure TTS ist wegen expliziter Tempo- und Lautsteuerung der aussichtsreichste Kandidat für einen späteren begrenzten Vergleich. Seine Überlegenheit in Klang und didaktischer Brauchbarkeit ist **nicht getestet**. Azure Pronunciation Assessment ersetzt keine Mandarin-Ton-/Prosodieabnahme. MFA eignet sich für zeitliche Annotation, nicht als Aussprache-Freigabestelle. Deshalb MFA nicht als zusätzliche Pflichtabhängigkeit in die PWA aufnehmen.

Für den jetzigen Stand: Untersuchung dokumentieren, keine weiteren Qwen-Generationsserien, keine neuen Referenzen veröffentlichen. Über einen späteren Azure-Test oder eine fachlich aufgenommene Referenz entscheidet das Projekt. Es wurde keine Azure-Ressource angelegt und kein Audio an Azure geschickt.

## Was tatsächlich geprüft wurde

Alle 20 bestehenden Lesson-1-Referenzen wurden lokal decodiert und auf Dateiidentität, Pegel, Clipping, Pausen, Sprechspanne sowie mit Qwen3-ASR geprüft. Praat wurde für die isolierten Silben genutzt. Die folgende Tabelle zeigt die ausdrücklich angefragten 12 Dateien: vier Wörter/Phrasen in jeweils zwei Varianten plus vier ma-Töne. Azure ist ausschließlich Dokumentationsvergleich.

Sprechspanne bedeutet hier erste bis letzte aktive 10-ms-Energieperiode einschließlich innerer Pausen. Die Werte hängen von der Aktivitätsschwelle ab; sie sind keine exakten linguistischen Silbengrenzen.

| Referenz | Natural / careful slow Sprechspanne | Lokale ASR | Einordnung |
|---|---:|---|---|
| 你 / nǐ | 0,41 / 0,88 s | natural: 义; slow: 你 | Stützt den Hörverdacht bei natural; beide bleiben zur Prüfung zurückgestellt. |
| 我 / wǒ | 0,54 / 0,69 s | beide 我 | Text erkannt, isolierte Dritttonkontur im einfachen F0-Screening auffällig. Kein Beweis für falsche Aussprache. |
| 你好 / nǐ hǎo | 0,45 / 2,26 s | beide 你好 | 4,44 / 0,88 Silben/s; slow etwa 5,0× so lang. Klarer Tempo-Ausreißer. |
| 你叫什么名字 | 1,04 / 1,70 s | beide korrekt | 5,77 / 3,53 Silben/s; natural zu schnell, slow für die geplante Anfängerrolle ebenfalls schnell. |
| mā / má / mǎ / mà | jeweils 0,65–0,66 s | 妈 / 妈 / 马 / 妈 | F0 entspricht grob den vier bearbeiteten Lehrkonturen; ASR trennt die Töne hier nicht zuverlässig. |

Die ma-Dateien sind ausdrücklich gekennzeichnete Praat-Bearbeitungen derselben /ma/-Basis, keine vier unbehandelten natürlichen Aufnahmen. F0-Kompatibilität ist deshalb besonders wenig geeignet, Natürlichkeit oder Artefaktfreiheit zu beweisen. Auch ein plausibler F0-Verlauf bei 你 verhindert die abweichende ASR-Ausgabe nicht: Tonverlauf und Silbenidentität sind verschiedene Fragen.

Die acht übrigen Phrase-Dateien: 好 in beiden Varianten benötigt F0-Prüfung, slow ist lang; 我叫 slow liegt bei etwa 0,99 Silben/s; 谢谢 natural bei 3,92, slow bei 2,38; 再见 natural bei 3,45, slow bei 2,04. Alle Angaben sind Screening-Signale, keine phonetische Abnahme.

Vorläufige **Testkorridore**, keine wissenschaftlichen Normen: zusammenhängende Phrasen natural 2,0–3,8 Silben/s, careful slow 1,2–2,6; slow ungefähr 1,2–1,9× länger. Einzelne Silben separat betrachten: natural ungefähr 0,35–0,95 s, slow 0,50–1,25 s. Mit fachlich akzeptierten Referenzen kalibrieren, nicht auf einen akzeptablen Messwert hin schönrechnen. Die bekannte natürliche Dritttonrealisierung im Kontext darf nicht mit der isolierten Vollkontur gleichgesetzt werden.

## Funktionsvergleich

| Lösung | Generation / Steuerung | Was sie prüfen kann | Grenze für A2 |
|---|---|---|---|
| Qwen3-TTS + Praat + Qwen3-ASR, lokal | Stilanweisung und Seed; Praat misst oder bearbeitet F0 | Textabweichungen als ASR-Warnsignal, Pegel/Pausen/Tempo, grobe isolierte Tonkontur | Stilanweisung erzwingt weder Tempo noch saubere Silbe. ASR ist kein Ausspracheprüfer; F0 prüft keine Konsonanten. |
| Azure Speech TTS / SSML | Vortrainierte Mandarin-Stimme; explizite Rate, Stimme/Stil und SAPI-Lautvorgaben | Erzeugt gezielter gesteuerte Kandidaten | Erfolgreiche Synthese bleibt keine Qualitätsfreigabe. Eine langsamere Rate garantiert keine sorgfältigere Artikulation oder Lehrkontur. Nicht praktisch getestet. |
| Azure Pronunciation Assessment | Keine Generation | Referenzgebundene Mandarin-Phonemgenauigkeit, Vollständigkeit und Flüssigkeit | ProsodyScore nur en-US; auch erkannte alternative Phoneme und Silbengruppen sind dort englischspezifisch. Keine dokumentierte zuverlässige Freigabe der vier Mandarin-Lehrkonturen. Nicht praktisch getestet. |
| Montreal Forced Aligner mit Mandarin-Akustik/G2P | Keine Generation; G2P erzeugt Lautfolgen aus Text | Zeitliche Zuordnung der vorgegebenen Wörter/Laute | Alignment setzt Text voraus. Modell ist ausdrücklich nicht für Aussprachequalität oder Transkription vorgesehen. Erfolgreiche Zuordnung ist kein Nachweis, dass der Text gesprochen wurde. |

Azure-Funktionen: [SSML-Stimme/Tempo](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice), [Mandarin-SAPI](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-ssml-phonetic-sets), [Pronunciation Assessment](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment). MFA-Grenze: [offizielle Mandarin-Modellkarte](https://huggingface.co/MontrealCorpusTools/mandarin_mfa). Qwen: [TTS-Modellkarte](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice), [ASR-Modellkarte](https://huggingface.co/Qwen/Qwen3-ASR-0.6B).

## MFA-Praxistest auf unseren Dateien

MFA 3.4.2 / Kalpy 0.10.5 wurde isoliert lokal installiert. Vortrainiertes Modell `MontrealCorpusTools/mandarin_mfa`, Revision `85f9e701a29d9d80f582725c6c94bf8796520b9a`, China-Dictionary/G2P, keine Anpassung oder neues Training. Zwölf Originaldateien plus zwei Negativkontrollen, mit unveränderten WAV-Bytes; Modell-Download ohne Zugangsdaten, Audioverarbeitung lokal.

Alle zwölf Dateien liefern Wort-/Lautintervalle. Ebenso entstehen Ausgaben für beide Negativkontrollen:

| Kontrolle | Ergebnis | Bedeutung |
|---|---|---|
| ma1-Audio mit richtigem Text mā | m: 0,15–0,30 s; a˥: 0,30–0,84 s | Erwartung wird zeitlich zugeordnet. |
| Genau dasselbe ma1-Audio mit falschem Text mà | m: 0,15–0,30 s; a˥˩: 0,30–0,84 s | Gleiche Grenzen trotz falschem Zielton; exportiertes Tonlabel kommt aus dem vorgegebenen Text. |
| 你-natural mit richtigem Text nǐ | ɲ: 0,13–0,16 s; i˨˩˦: 0,16–0,47 s | Auch die von ASR beanstandete Datei lässt sich ausrichten. |
| Genau dasselbe 你-Audio mit falschem Text wǒ | w: 0,54–0,56 s; o˨˩˦: 0,55–0,56 s | Degenerierte Randsegmente können einen Fehler anzeigen. Kein allgemeiner Freigabescore. |

G2P erwartet in diesem Modell Pinyin mit Diakritika. Ein erster Versuch mit Tonzahlen lieferte nur `spn` (unbekannter Laut) und wurde als ungültiger Test verworfen. Mit diakritischem Pinyin erzeugte G2P echte Lautfolgen, aber für `míngzi` eine Drittton-Endung, obwohl unser kanonisches `zi5` neutral ist. Auch G2P-Ausgaben müssen deshalb am vorgesehenen Lerninhalt geprüft werden. Das ist keine neue Handschrift-/Pinyin-Regel der App, sondern eine Eingabebesonderheit des externen Offline-Werkzeugs.

Für Reproduktion: `mfa align_hf CORPUS MontrealCorpusTools/mandarin_mfa@85f9e701a29d9d80f582725c6c94bf8796520b9a OUTPUT --dialect mandarin_china_mfa --use_g2p --language unknown --single_speaker --num_jobs 1 --no_use_mp --output_format json`. Pro WAV eine `.lab`-Datei mit dem im Ergebnisprotokoll festgehaltenen Pinyin. Laufzeit nach Installation/Download etwa 23 Sekunden. Dies ist eine kleine Fallstudie, keine Schätzung von Sensitivität oder Fehlerrate.

## Minimaler späterer Azure-Vergleich – erst nach Entscheidung

Eine vortrainierte Standard-Neural-Stimme, zunächst `zh-CN-XiaoxiaoNeural`; keine Custom Voice, kein Training, kein Echtzeitdienst in der PWA. Lokal ausgeführtes Skript erzeugt statische WAV-Dateien. [Stimmen und unterstützte Stile](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support).

- Dieselben acht Testinhalte: 你, 我, 你好, 你叫什么名字, ma1–ma4. Wörter/Phrasen in zwei Varianten, ma als einzelne Lehrbeispiele.
- Moderate Startwerte für SSML: natural `rate="-10%"`, careful slow `rate="-25%"`; ungetestete Ausgangshypothese, anschließend reale Sprechspanne und Hörprobe prüfen. Kein nachträgliches Herunterpitchen.
- Für isolierte Silben kann die dokumentierte SAPI-Vorgabe z. B. `ph="ni 3"` bzw. `ph="ma 1"` die Zielaussprache explizit machen. In Phrasen natürliche Tonverbindungen/Sandhi erhalten; keine isolierten Volltöne aneinanderkleben.
- Bestehende und Azure-Dateien durch denselben lokalen Basischeck. Azure Assessment mit `zh-CN`, Referenztext, Phonemgranularität und Miscue-Prüfung; keine nicht unterstützte Mandarin-Prosody-Option einschalten.
- Negativkontrollen: falsche Silbe, falscher ma-Ton und vertauschtes Asset. Hoher Gesamtscore allein darf nicht freigeben. Blindes fachliches Hören von Klarheit, Ton, Tempo und Natürlichkeit entscheidet.

Minimaler Zugang: Azure-Konto/Subscription, eine Speech-Ressource in einer Region mit den benötigten Funktionen, Region plus lokal geschützter Schlüssel oder geeignete Entra-Berechtigung. Kein Schlüssel im Frontend, Repository oder Chat. Für spätere veröffentlichte TTS-Dateien bezahlten Tarif mit passenden Ausgaberechten vorsehen. Keine Storage-, VM-, Datenbank- oder Backend-Infrastruktur erforderlich.

## Erwartete Kosten, Datenschutz und Rechte

Öffentliche Azure Retail Prices API am 27.09.2026, West Europe, USD, Verbrauchstarif S1: Standard Neural TTS **15 USD / 1 Mio. Zeichen**; Speech to Text **1 USD / Stunde**. Basis-Pronunciation-Assessment wird laut Microsoft wie Standard-STT berechnet. Ein bewusst großzügiger Vergleich mit 10.000 abrechenbaren Zeichen und 10 Minuten Assessment läge rechnerisch bei ungefähr **0,32 USD** vor Steuern, Rundung und Wechselkurs. Dies ist eine Mengenabschätzung, kein eingerichtetes Budget und kein verbindliches Angebot. Keine HD-/Custom-Voice-/Prosodie-Zuschläge eingeplant. [Preis-API](https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices), [Speech-Preise](https://azure.microsoft.com/en-us/pricing/details/speech/).

Nur Referenztexte und Referenzdateien müssten an Azure übertragen werden; Lernermikrofon-Aufnahmen bleiben außerhalb dieses Vorhabens. Laut Microsoft werden Eingaben bei Echtzeit-TTS und Pronunciation Assessment nicht gespeichert; Verarbeitung findet dennoch auf Azure statt, also passende Region und Vertragsbedingungen prüfen. [TTS-Datenschutz](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/text-to-speech/data-privacy-security), [STT/Assessment-Datenschutz](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/speech-to-text/data-privacy-security).

Die aktuellen Microsoft-Produktbedingungen nennen die Ausgaberechte vortrainierter TTS-Stimmen ausdrücklich für Kunden des **bezahlten Tarifs**. Freie Testausgabe daher nicht ungeprüft als veröffentlichbares App-Asset behandeln. Kein Voice Cloning erforderlich. [Microsoft-Produktbedingungen, TTS](https://www.microsoft.com/licensing/terms/en-US/productoffering/MicrosoftAzure/MOSA).

Qwen-Modelle sind Apache-2.0-lizenziert; MFA-Mandarin-Modell CC BY 4.0; die vorhandenen Wolfdog-Tonbearbeitungen bleiben CC BY-SA 4.0 mit Attribution. Modelle und Werkzeuge werden nicht in die PWA eingebettet. Die konkrete Lizenz gilt jeweils für Modell, Software und Quellaudio getrennt.

## Freigabestatus und verbleibende Unsicherheit

`generated` → `validated` → `human-approved` bleibt die gewünschte Trennung. `validated` bedeutet nur, dass die festgelegten technischen Prüfungen erfolgreich waren, niemals native Qualität. Eine menschliche Freigabe muss sich auf den konkreten Dateihash beziehen. Geänderter Inhalt verliert die Freigabe. Während dieser Lösungsbewertung werden keine Dateien neu freigegeben.

Zuverlässig automatisierbar sind Existenz/Zuordnung/Hash, Decodierung, digitale Übersteuerung und grobe Pegel-/Dauerausreißer. ASR und F0 sind zusätzliche, fehleranfällige Warnsignale. Native Silbenqualität, natürliches sorgfältiges Sprechen, hörbare Syntheseartefakte, Sandhi und Eignung der Ton-3-Lehrkontur brauchen weiterhin Mandarin-fachliche Hörabnahme. Ein zweites Tool beseitigt diese Verantwortung nicht.

## Projektstand nach der Untersuchung

Build, Inhaltsprüfung und alle 34 vorhandenen Node-Tests erfolgreich. Kein Anwendungscode, kein Audio-Asset und keine Laufzeitabhängigkeit geändert. Die unverbindlichen eigenen QA-Probes sind im lokalen Arbeitsbereich zurückgestellt und nicht als Produktpipeline integriert. Dokumentation und Manifest halten die offene Abnahme fest. Keine Browser-Interaktion wurde in diesem Dokumentationsschritt geändert; daher keine erneute vollständige UI-Testserie. Kein Push und kein Deployment.
