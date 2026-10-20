# Taiwan-Lernstrecke: lokale Textintegration

20. Oktober 2026 · Branch implement/taiwan-text · keine Veröffentlichung, kein Merge

Die redigierte Strecke ist in den bestehenden Weiterlernen-Ablauf eingebunden. Der unveränderte redaktionelle Kanon aus 61862fd wird direkt in das lokale App-Bundle übernommen; es gibt keinen zweiten handkopierten Textbestand. Die zusätzliche Integration behauptet keine neue sprachliche oder muttersprachliche Freigabe.

## Nutzbarer Umfang

- 134 neue Objekt-Einführungen, an ihrem ersten Dialogeinsatz eingeordnet.
- 28 vollständige Dialoge in Traditional oder Simplified, mit optionalem Pinyin und optionalen deutschen Bedeutungen.
- Sämtliche 221 ausgearbeiteten Übungen sind erreichbar: Satzprüfungen innerhalb der Dialoge oder als eigener Fall, 33 schriftliche Produktionsaufträge, acht Wertaufgaben, eine Wegaufgabe und drei Reaktionsaufgaben. Die Dialoge enthalten 291 einzeln referenzierte Satzvorkommen aus insgesamt 176 verschiedenen Äußerungen.
- 19 Schrift–Bedeutung-Matching-Gruppen sind aktiv. Die 19 Audio–Schrift-Varianten bleiben bis zur Hörfassung ausdrücklich ausgesetzt.
- Die zehn neuen Schreibziele verwenden den bestehenden Hanzi-Writer-Ablauf mit lokalen Strichmodellen, weniger Hilfe und eigener Rekonstruktion. Späterer Abruf wird getrennt nach vorhandener geführter Bearbeitung angeboten. Quellen und Prüfsummen: [STROKE_DATA.json](STROKE_DATA.json); vorhandene Lizenz: public/licenses/ARPHICPL.txt.

Das ergibt 273 reguläre Aktivitäten sowie zehn gesondert reservierbare Schreibabrufe. Es sind weiterhin 134 neue Lernobjekte, keine 283 neuen Mastery-Knoten. [INTEGRATION_COUNTS.json](INTEGRATION_COUNTS.json) hält die automatisch erfassten Mengen und die Bindung an den redaktionellen JSON-Stand fest.

## Verlauf, Wiederverwendung und Evidenz

Die bestehende Einführung des Grundbestands bleibt bestehen. Sobald dessen Objekte gezeigt/eingeführt sind, folgt die Erweiterung; es wird kein vollständiges Beherrschen aller alten Fähigkeiten oder aller Schreibziele verlangt. Vorhandene Sessions werden fortgesetzt und bleiben gültig. An der nächsten Planungsgrenze können Taiwan-Aktivitäten folgen.

Bekannte ganze Wörter mit passender vorhandener Bedeutungs- und Schrift-Einführung werden wiederverwendet. Fehlende gebundene oder ältere Bestandteile werden innerhalb des neuen Anliegens gezielt eingeführt. Ganze Etappen sind keine Mastery-Gates. Echte fällige Bestandsabrufe bleiben erhalten; der frühere Rückgriff auf immer wieder dieselben zuletzt geübten Inhalte verdrängt die neue Strecke nicht.

Dialoge werden zunächst als Textmodell bearbeitet. Die folgenden Satzfragen verlangen Textverständnis; Bedeutungen sind dann verdeckt. Kürzlich erfolgreich bearbeitete Routinezüge erhalten in der nächsten Verwendung keine erneute obligatorische Satzprüfung. Die für einen begonnenen Dialog ausgewählte Prüffolge bleibt im gespeicherten Zustand stabil, auch nach Neuladen. Später können diese Texte zur Wiederaufnahme zurückkehren; die verwendeten Zeitabstände bleiben Produkthypothesen.

Werte, geordnete Wege und geschlossene Auswahlfragen haben kuratierte Schlüssel. Kontextuelle Antwortwahl lässt alle vorgesehenen passenden Antworten zu. Schriftliche Mandarinproduktion akzeptiert die hinterlegten Hanzi-/Pinyinvarianten ohne Ton- oder Aussprachewertung. Andere freie Antworten bekommen Modellvergleich/unsure statt eines automatischen Fehlurteils. Freie deutsche Zusammenfassungen bleiben Selbstvergleich.

Textbearbeitung erzeugt **keine Hör-, Ton- oder Ausspracheerfolge**. Varianten und Dialogsätze erzeugen Ereignisevidenz; sie werden nicht zu neuen unabhängigen Mastery-Objekten. Schriftliche Produktion und Schreiben können die jeweilige ausdrücklich zugeordnete Objekt-/Fähigkeitsrelation aktualisieren. Hilfe bleibt als solche erfasst. Satzmodelle, Checkpoints und Abschlussereignisse liegen in der vorhandenen lokalen Datenbank. Sicherung, Import und Zurücksetzen verwenden deren bestehende Mechanismen; bestehende IDs und Historie werden nicht migriert oder gelöscht.

## Technische Abnahme

**Exhaustive innerhalb der definierten Datenpopulation:** 134/134 Objekt-Einführungen, 28/28 Dialoge, 176/176 Äußerungen, 221/221 Aufgaben und die 19 aktiven Matching-Gruppen sind anhand ihrer Referenzen bilanziert. Ein Durchlauf der Planungsfunktion erreicht sämtliche 273 regulären Taiwan-Aktivitäten. Die zusätzliche Textfamilie und ihre Zustände sind im Resolution-Vertrag und im UI-Textbestand erfasst. Das ist technische Erreichbarkeits-/Referenzabdeckung, kein Nachweis individuellen Lernerfolgs oder sämtlicher Browserzustände.

**Repräsentative Browserprüfung:** acht Funktionsfälle jeweils in Chrome und WebKit: Hotelgespräch in beiden Schriften einschließlich Satzantwort und Wiederaufnahme nach Neuladen; normaler Übergang aus dem eingeführten Grundbestand; strukturierte Uhrzeit; nicht gelistete schriftliche Antwort; mehrere passende Zahlungsantworten und Matching; neues Schreibmodell; Lageplan und gespeicherte Pinyin-Hilfe. Hotelgespräche und Wegaufgabe wurden zusätzlich bei 375 × 812 Pixeln geprüft, einschließlich horizontalem Überlauf. Mobile Hotelansichten in beiden Schriften wurden visuell betrachtet. Keine Aussage über sämtliche Geräte, Handschriften oder beliebige Eingaben.

Ergebnis: 244/244 Node-Tests bestanden; alle 16 genannten Browserfälle bestanden. Zwei Testläufe benötigten Korrekturen an Test-Selektoren beziehungsweise dem Warten auf die Datenbankinitialisierung; die betroffenen Fälle wurden gezielt erfolgreich wiederholt. Produktionsbuild, Inhaltsvalidierung, UI-Text- und Resolution-Abgleich bestanden. Die bestehende Bündelgrößenwarnung betrifft die neue lokale Inhalts-/Schreibdatenmenge; sie ist kein Buildfehler.

## Audio und Arbeitsgrenze

Die Textfassung lädt keine erfundenen Taiwan-Audiopfade und wartet nicht auf fehlende Synthese. Bestehende Audioassets und das AWS-Manifest wurden nicht verändert. Die separat beauftragte Azure-Vorbereitung steht in [AZURE_AUDIO.md](AZURE_AUDIO.md). Es wurde keine Taiwan-Sprachdatei erzeugt.

Das vorläufige Material auf feature/mobile-learning-v2 wurde weder übernommen noch bearbeitet. Die Integration liegt ausschließlich im isolierten Implementierungsbranch. Kein Push, Merge, Deployment oder Veröffentlichungsschritt.
