# Vorbereitung der Taiwan-Hörfassung mit Azure Speech

20. Oktober 2026 · Vorbereitung beauftragt · Zugang noch nicht lokal konfiguriert · keine Synthese erfolgt

AWS Polly könnte die Taiwan-Texte weiterhin aussprechen. Die vorhandene Pipeline verwendet jedoch Zhiyu/cmn-CN. Azure wurde nach ausdrücklicher Nutzerwahl vorbereitet, weil es eigene Taiwan-Mandarin-Stimmen und unterschiedliche Rollenstimmen anbietet. Das ist eine Auswahl für das regionale Lautmodell und die Sprecherunterscheidung, keine technische Unmöglichkeit bei AWS.

Vorgesehene Stimmen: Anna/A mit zh-TW-HsiaoChenNeural; Gegenüber/B mit zh-TW-YunJheNeural. Beide gehören zum deklarierten Taiwan-Locale zh-TW. Es findet kein Voice Cloning statt. Die vorhandene AWS-Pipeline und ihre angenommenen Audios bleiben unangetastet.

## Konkreter vorbereiteter Umfang

[AUDIO_PLAN.json](AUDIO_PLAN.json) bindet jede Anfrage an den unveränderten Textkanon, Traditional-Sprachtext, Rolle, Stimme, Format, SSML und Fingerprint. Der Plan umfasst 164 im Textbestand tatsächlich verwendete Worteinträge und 240 Satz-/Stimmenkombinationen für sämtliche 176 Äußerungen: insgesamt **404 deduplizierte Syntheseanfragen**, dazu 28 lokal montierbare Dialogfassungen mit 291 Satzvorkommen. Nicht verwendete alte Aussprachebeispiele werden nicht mitproduziert. Der Plan zählt 1.604 Zeichen im Sprachtext; das ist keine verbindliche Abrechnungs- oder Preisangabe.

Als erste zusammenhängende Hörprobe ist **G07: Zwei Getränke und die Zahlungsart** vorgesehen. Zehn eindeutige Satz-/Stimmenanfragen decken das Gespräch mit seinen beiden Rollen ab. Nach vorhandenem Azure-Zugang wird zunächst diese Probe hergestellt. Sprecher, Natürlichkeit, Taiwan-Lautung sowie die Verständlichkeit von Auswahl, Negation und Beträgen können daran konkret beurteilt werden. Eine bloße erfolgreiche API-Antwort belegt diese Eigenschaften nicht.

Der Generator arbeitet mit lokal erzeugten 24-kHz-/16-bit-/Mono-WAV-Dateien. Aus denselben Satzmodellen montiert er die Dialogfassung; Start und Ende jedes Satzvorkommens werden samplegenau gespeichert. Die Übergänge sind somit eine Montage einzelner Modelle und müssen in der Hörprobe mitgehört werden. Es wird keine ungeprüfte automatische Segmentierung einer fertigen Aufnahme behauptet. Langsamvarianten sind in diesem ersten Plan nicht enthalten.

## Lokaler Zugang und Start

Benötigt werden eine Speech-Ressource im eigenen Azure-Konto sowie deren Schlüssel und Region. Diese werden ausschließlich lokal in den Umgebungsvariablen AZURE_SPEECH_KEY/AZURE_SPEECH_REGION oder SPEECH_KEY/SPEECH_REGION bereitgestellt. Es gibt keinen Schlüssel im Frontend, im Repo, im Plan oder im Manifest. Es wurde weder ein Konto noch eine kostenpflichtige Ressource automatisch angelegt.

Vorbereitung ohne Zugang und ohne Netzaufruf:

```sh
node scripts/generate-taiwan-audio.mjs --write-plan
node scripts/generate-taiwan-audio.mjs --sample G07
```

Erst mit lokal gesetztem Zugang: genau die Hörprobe herstellen:

```sh
node scripts/generate-taiwan-audio.mjs --generate --sample G07
```

Der Gesamtbestand benötigt die bewusste Auswahl --generate --all. Es gibt keinen impliziten Gesamtlauf. Fertige Dateien werden an Fingerprints und Prüfsummen erkannt und wiederverwendet. Als akzeptiert markierte Aufnahmen werden nicht stillschweigend ersetzt. Providerantworten mit Fehlern werden nur über ihren Status gemeldet; Antwortkörper und Schlüssel werden nicht protokolliert.

Ausgaben liegen zunächst isoliert unter work/taiwan-audio, einschließlich Provenienz, Prüfsummen und Satzgrenzen. Sie werden vom aktuellen Build weder ausgeliefert noch automatisch als App-Referenzen eingeschaltet. Die tatsächliche Audioeinbindung folgt mit dem vorhandenen und gehörten Audiosatz; der Textpfad bleibt bis dahin benutzbar. Ohne Zugang bricht ein Syntheseaufruf vor dem ersten Netzaufruf und vor dem Anlegen von Ausgabedateien ab.

## Technisch geprüft, nicht akustisch freigegeben

Vier automatische Tests erfassen Planabdeckung, Stimmen-/SSML-Bindung, fehlenden Zugang ohne Netzaufruf, geschützte Fehlerausgaben sowie PCM-Format und exakte Montagegrenzen. Dabei wurden ausschließlich In-Memory-Testsignale verwendet, keine Sprachaufnahmen erzeugt. Die technische Kontrolle erkennt unter anderem unbrauchbare WAV-Struktur, Stille und grobes Clipping. Sie bewertet weder Mandarin-Töne noch Aussprachequalität. Erzeugte Dateien bleiben ausdrücklich needs_human_listening; ein fehlerfreier technischer Screen wird nicht zur Native-Freigabe umbenannt.

Die 19 Audio–Schrift-Matching-Varianten und eigenständiges Hörlernen sind noch nicht aktiv. Vor Veröffentlichung wären tatsächliche Sprachdateien, ihre gehörte Abnahme und die ausdrücklich beauftragte Einbindung nötig. Veröffentlichung und Merge sind weiterhin nicht freigegeben.

## Offizielle Belege

- [AWS: verfügbare Polly-Stimmen](https://docs.aws.amazon.com/polly/latest/dg/available-voices.html): Mandarin Zhiyu/cmn-CN; kein eigener Taiwan-Eintrag in der eingesehenen Liste.
- [Microsoft: Sprache und Stimmen](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=text-to-speech): zh-TW und die beiden vorgesehenen Stimmen.
- [Microsoft: Text-to-Speech REST](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech): Ressource, Schlüssel/Region, SSML, Ausgabeformat und HTTP-Schnittstelle.

Eingesehen am 20. Oktober 2026. Diese Produktdokumentation belegt Schnittstellen und Verfügbarkeit, nicht die Qualität unserer noch nicht hergestellten Hörfassung.
