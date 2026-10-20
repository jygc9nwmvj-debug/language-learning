# Freigabevorlage: erster neuer Lernabschnitt

2026-10-20 · **VORLÄUFIG / NICHT FREIGEGEBEN / IMPLEMENTIERUNG PAUSIERT**

**Nachtrag 2026-10-20:** Diese Vorlage dokumentiert den Bestand beim Inhaltsstopp. Anschließend wurde ausschließlich die technische v2-Umsetzung mit bestehendem Inhalt fortgesetzt, siehe [IMPLEMENTATION_RESULT.md](IMPLEMENTATION_RESULT.md). Der Getränkeentwurf liegt jetzt außerhalb des aktiven Contents unter `tools/mobile-v2/provisional/`; die folgenden damaligen Zwischenstandszahlen sind keine Beschreibung des aktuellen Laufzeitbestands. Keine neue Inhalts- oder Audiofreigabe.

## 1. Bestand und Stopp

Zweig `feature/mobile-learning-v2`, Ausgangspunkt `f7fbfdb` (main). Kein neuer Commit, Push, Merge oder Deployment. Der ausgelieferte Produktionsstand wurde nur gelesen und mit dem unveränderten Ausgangsbuild verglichen. Kein realer Lernerstand wurde geöffnet oder verändert.

Neu im lokalen Arbeitsstand:
- `content/drink-counter.json`: 11 neue kanonische Wort-/Funktionsbausteine, 12 ganze Lernobjekte; daraus lokal 48 reguläre Definitionen (Encounter/Reading/Listening/Text-Recall) abgeleitet. Insgesamt lokal 48 statt 36 Items und 179 statt 131 Definitionen. Das ist ein Autorenentwurf, keine Freischaltung in Produktion.
- `dialogue.ts` / `DialogueExercise.tsx`: ein siebenteiliger Dialogentwurf, deutsche Antwortlisten, geführte Interpretationsschritte und anschließende Antwortwahl; Ereignis-/Wiederaufnahme-Prototyp. Noch keine Verifikationsfreigabe.
- Matching: 12 zusätzliche Setvarianten in der bestehenden Engine (zwei frühe Zweiergruppen, Getränke, Temperaturen; je Form/Bedeutung, Audio/Form, Pinyin/Form). Noch nicht geprüft/freigegeben.
- Geteilte mobile Ansicht und lokale Inline-Korrektur erweitert, ausschließlich im Feature-Arbeitsstand. Browser-, Keyboard-, Zugänglichkeits- und Persistenzprüfung noch ausstehend. Typprüfung bestand am letzten Zwischenstand; das ist kein Fertigstellungsnachweis.
- **0 neue Audiodateien erzeugt, 0 Manifesteinträge ergänzt oder geändert.** Nur `generate-audio --dry-run`: 24 fehlende Referenzen für zwölf Entwürfe aufgelistet. Keine Syntheseanfrage. AWS-Anmeldung erneuert; lokale Prüfbibliotheken vorbereitet. Keine weitere Synthese oder Manifestintegration ohne redaktionelle Freigabe.

Bestehende Inhalte und Audios bleiben erhalten. Schedulerquelle, Mastery-/Intervallmodell und Datenbankschema wurden nicht verändert. Die neuen Integrationspfade sind noch nicht abschließend auf Semantikerhalt geprüft. Keine Behauptung bereits bestandener Regression.

Kein Roh-Lernerexport verfügbar. 38 Einführungsvorführungen können Wiederholungen und unterschiedliche Einführungsdimensionen enthalten. Daraus lässt sich weder individuelles Erschöpfen der 36 bisherigen Items noch ein Schedulerfehler beweisen. Die geplante synthetische Erreichbarkeitsprüfung wurde vor dem Stopp noch nicht ausgeführt.

## 2. Kommunikatives Ziel und vorgeschlagener Zuschnitt

**Am Getränkestand:** einen Tee bestellen, eine Temperaturfrage verstehen, heiß/gekühlt wählen, nach dem Preis fragen, einen einfachen Betrag verstehen und höflich abschließen.

Ein kurzer zweiter Durchlauf mit Wasser zeigt die Wiederverwendung des Bestellmusters. Das ist eine vorgeschlagene Ergänzung des Plans, bisher nicht implementiert. Damit wären es **13 ganze Lernobjekte**, nicht 13 neue Wörter: sechs einzelne Wörter, die sechs vorhandenen Phrasenentwürfe und als zusätzliche Kombination `我要一杯水`. Kein größerer Ausbau.

### Ablauf

1. **Situation und Gesamtklang:** vollständigen Hauptdialog hören, mit kurzer deutscher Situationsbeschreibung. Kein Verständnistest vor der Einführung. Ein vollständiges Anhören allein gilt nicht als Einführung aller Wörter/Zeichen.
2. **Getränk und Bestellung:** 茶 / 水, dann 杯 als Zählwort und 要 im Bestellkontext. Bekanntes 我 und 一 verbinden. Früh ganze Formen mit Bedeutung/Klang verknüpfen; nicht erst sämtliche isolierten Wörter abarbeiten.
3. **Ein Bestellmuster:** 我要一杯茶; anschließend kontrollierte Wiederverwendung 我要一杯水. Hörverstehen, Bedeutung und getippte Form sind getrennte Aufgaben.
4. **Rückfrage und Antwort:** 熱 / 冰, dann 要熱的還是冰的？, anschließend 冰的，謝謝 / 熱的，謝謝. 還是 und 的 im Satz erklären, nicht als isolierte Grammatikprüfung.
5. **Preis:** 多少錢？ und 三十塊. Bekanntes 三 / 十 wiederverwenden. Keine neue Zahlenlektion, keine Behauptung eines tatsächlichen Marktpreises.
6. **Zusammenführen:** Hauptdialog turnweise interpretieren, vollständig wiederhören und auf die Temperaturfrage eine passende Antwort auswählen. Beide Temperaturentscheidungen sind zulässig.
7. **Recycling:** kurzer Wasser-Dialog, später vorhandene reguläre Recall-/Hör-/Leseaufgaben mit unveränderter Spacinglogik. Die zweite Situation wird nicht als bereits nachgewiesener freier Transfer ausgegeben.

Dies sind inhaltliche Abschnitte, keine feste Zahl von Aufgaben und keine neue Sitzungsgrenze. Das Layout darf diese Reihenfolge nicht diktieren.

### Wortschatz, Hanzi und Grammatik

| Baustein | Pinyin | Lernfunktion |
|---|---|---|
| 茶 | chá | Tee |
| 水 | shuǐ | Wasser |
| 杯 | bēi | Tasse/Becher; Zählwort für die Getränkebestellung |
| 要 | yào | wollen/möchten im Bestellkontext |
| 熱 / 热 | rè | heiß |
| 冰 | bīng | Eis; in der Getränkewahl: gekühlt/mit Eis, genaue Glosse freigeben |
| 的 | de | in 熱的 / 冰的 auf das gemeinte Getränk bezogen |
| 還是 / 还是 | háishì | oder in der Auswahlfrage |
| 多少 | duōshǎo | wie viel |
| 錢 / 钱 | qián | Geld; in der Preisfrage |
| 塊 / 块 | kuài | umgangssprachliche Geldeinheit; hier Taiwan-Dollar |

Wiederverwendung: 我、一、三、十、謝謝、不客氣; bekannte 是-Form wird in 還是 nicht als selbständig zusammengesetzte Bedeutung erklärt.

**Hanzi:** 茶、水、杯、要、熱、冰 zunächst als ganze Einzelwortformen erkennen. 的、還是、多少、錢、塊 in den passenden Phrasen gezielt ansehen. Einzelzeichenwissen wird nur für tatsächlich einzeln eingeführte Zeichen angenommen. Pinyin–Hanzi-Matching weist keine Tonkenntnis nach.

**Writing Targets:** Vorschlag für diese erste Scheibe: keine neuen Pflicht-Schreibziele. Vorhandenes Writing einschließlich 我、一、三、十 bleibt unabhängig verfügbar; neue Wörter werden nicht bis zu erfolgreichem Handschreiben blockiert. Wasser/水 kann später als eigenes, ausdrücklich beschlossenes Schreibziel aufgenommen werden. Dafür wären Strichdaten und Scaffoldplanung notwendig; derzeit kein entsprechender Entwurf.

**Grammatik:** 我 + 要 + Zahl + 杯 + Getränk; alternative Frage A 還是 B; Antwort mit Adjektiv + 的; Preisfrage 多少錢; Zahl + 塊. Keine Prüfung von Fachbegriffen. Lexikalisches 一 yī und gesprochenes yì vor bēi ausdrücklich unterscheiden. Einheiten/Notation nicht mit gesprochener Tonbeherrschung gleichsetzen.

## 3. Vollständige vorgeschlagene Skripte

Die Interpunktion unten ist redaktionell vorgeschlagen. Der Codeentwurf setzt manche Phrasen noch ohne Komma zusammen. Keine Audiofassung ist final.

### A. Tee bestellen — im Arbeitsstand als sieben Turns angelegt

| Turn | Sprecher | Mandarin | Natürliche deutsche Bedeutung | Satzbezogene Prüfintention nach Einführung |
|---|---|---|---|---|
| 1 | Kunde | 我要一杯茶。 | Ich hätte gern einen Tee. | Getränk und Menge aus dem gehörten Satz verstehen; geführte deutsche Übersetzung. |
| 2 | Verkauf | 要熱的還是冰的？ | Möchtest du ihn heiß oder gekühlt? | Zwei angebotene Temperaturen als Auswahlfrage verstehen, nicht als Ja/Nein-Frage. |
| 3 | Kunde | 冰的，謝謝。 | Gekühlt, danke. | Auswahl der kalten Variante und Dank verstehen. |
| 4 | Kunde | 多少錢？ | Wie viel kostet das? | Preisfrage verstehen; keine Berechnung. |
| 5 | Verkauf | 三十塊。 | Dreißig Taiwan-Dollar. | Betrag 30 und Geldeinheit im Kontext verstehen. |
| 6 | Kunde | 謝謝。 | Danke. | Höflichen Abschluss verstehen. |
| 7 | Verkauf | 不客氣。 | Gern geschehen. | Passende Reaktion auf Dank verstehen; keine wortwörtliche Negationsanalyse. |

Alternative für Turn 3: **熱的，謝謝。 — Heiß, danke.** Alle folgenden Turns bleiben gleich. In der abschließenden Antwortwahl sind beide Varianten geeignet. Nicht eine persönliche Präferenz als einzig richtige Antwort bewerten.

### B. Bekanntes Bestellmuster mit Wasser — nur Plan, noch kein Code/Audio

| Turn | Sprecher | Mandarin | Natürliche deutsche Bedeutung | Prüfintention |
|---|---|---|---|---|
| 1 | Kunde | 你好。 | Hallo. | Bekannten Gruß wiedererkennen. |
| 2 | Verkauf | 你好。 | Hallo. | Gegenbegrüßung im Wechsel verstehen. |
| 3 | Kunde | 我要一杯水。 | Ich hätte gern ein Glas Wasser. | Bekannte Bestellstruktur mit anderem Getränk verstehen. |
| 4 | Verkauf | 好。 | In Ordnung. | Zustimmung im Bestellkontext erkennen; nicht wörtlich nur „gut“ verlangen. |
| 5 | Kunde | 謝謝。 | Danke. | Abschluss verstehen. |
| 6 | Verkauf | 不客氣。 | Gern geschehen. | Reaktion auf Dank verstehen. |

Keine Preise, Mengenänderungen, weitere Getränke oder verdeckt vorausgesetzte neue Grammatik. Falls der zweite Dialog nicht freigegeben wird, Wasser aus dieser ersten Scheibe streichen statt als unverbundenes Füllwort einzubauen.

## 4. Assessment und Antwortvarianten

Die vorhandenen Antwortlisten sind **Kandidaten**, kein freigegebener Goldstandard. Freies unbekanntes Deutsch wird nicht mit einem unsicheren semantischen Modell bewertet.

| Zielsatz | Vorgeschlagene akzeptierte Varianten (Auswahl) | Wichtige Grenze |
|---|---|---|
| 我要一杯茶 | Ich möchte einen Tee; Ich hätte gern eine Tasse Tee; Ich hätte gerne einen Becher Tee | Welche Auslassungen von Menge/Zählwort gelten als ausreichendes Bedeutungsverständnis? Vorab festlegen. |
| 要熱的還是冰的 | Heiß oder gekühlt; Heiß oder kalt; Möchtest du ihn heiß oder kalt | „Warm oder kalt“ und reine Ja/Nein-Antworten nicht ungeprüft übernehmen. |
| 冰的謝謝 | Gekühlt, danke; Kalt, danke; Den kalten, danke | „Mit Eis“ nur akzeptieren, wenn es der freigegebenen Bedeutungsfassung entspricht. |
| 熱的謝謝 | Heiß, danke; Den heißen, danke | „Warm“ ist breiter und redaktionell zu entscheiden. |
| 多少錢 | Was kostet das; Wie viel kostet das; Wie teuer ist das | Betragantwort ist keine Übersetzung der Frage. |
| 三十塊 | 30 Taiwan-Dollar; Dreißig Dollar; Das kostet dreißig Taiwan-Dollar | 3 oder 13 sind falsch; „Dollar“ im gegebenen Taiwan-Kontext zulässig. |
| 謝謝 | Danke; Vielen Dank; Dankeschön | Großschreibung/Interpunktion ohne Einfluss. |
| 不客氣 | Gern geschehen; Keine Ursache; Nichts zu danken | „Bitte“ ist mehrdeutig; erst nach bewusster Entscheidung aufnehmen. |
| 我要一杯水 | Ich hätte gern ein Glas Wasser; Ich möchte einen Becher Wasser | Neue Varianten müssen vor Implementierung vollständig ergänzt werden. |
| 好 im zweiten Dialog | In Ordnung; Alles klar; Okay | Kontextgerechte Bedeutung, nicht nur Wörterbuchglosse. |

Hören/Übersetzen nach vollständigem Modell und vorheriger Einführung ist **geführte Übung**. Antwortwahl ist kontextuelle Recognition. Form-Matching ist Recognition; Pinyin/Form ist Laut-/Schriftzuordnung, keine Tonprüfung. Normale später unassistierte Aufgaben bleiben eine eigene Evidenz. Ein Nachsprechen/Recording wird nicht objektiv auf Aussprache bewertet. Keine dieser neuen Dialog-/Matching-Aktivitäten wertet Schreib-/Sprechmastery oder ersten unabhängigen Recall auf.

## 5. QA-Stand und notwendige Freigaben

- **Bestehendes Material:** bisheriger Status bleibt bestehen, einschließlich seiner dokumentierten Audio-/Native-Review-Grenzen. Wiederverwendung ist keine neue Gesamtfreigabe.
- **Neue Wörter/Äußerungen/Skripte:** vorläufige Autorenentwürfe. Einzelne Kontext-/Lexikquellen wurden gesichtet, keine vollständige unabhängige linguistische oder native QA. Typ-/Schemasicherheit ist keine Sprachprüfung.
- **Wichtiger Metadatenbefund:** die Entwürfe verwenden bereits das vom bisherigen Learning-Schema verlangte `reviewStatus: source_checked`. Dieser mechanisch gesetzte Wert belegt keine abgeschlossene Sprach-QA und ist für die neuen Inhalte nicht als Freigabe zu lesen. Vor weiterer Integration muss ein ehrlicher Draft-/Reviewstatus vorgesehen werden. Der übergeordnete Status dieses Dokuments ist ausdrücklich provisorisch.
- **Neues Audio:** keines vorhanden oder geprüft. Die erneuerte AWS-Anmeldung ist keine redaktionelle Freigabe.

Vor jeder Synthese entscheiden/freigeben:
1. Situation, Lernziel und Umfang: Hauptdialog mit Temperaturalternative plus kurzer Wasser-Rekombination, 13 statt bisher 12 Entwurfsitems.
2. Natürliche Taiwan-kompatible Wortwahl, Dialogreihenfolge, pragmatische Passung von 要, Preis-/Währungskontext und sämtliche deutschen Glossen.
3. Sinnvolles Einführen von 還是 / 的 / 多少 / 錢 / 塊; nicht bloß ihre automatische Phrase-Segmentierung. Bestehende künstliche Voraussetzungskette cha→shui→bei→yao→re→bing ist ein Implementierungsentwurf, keine didaktisch freigegebene Reihenfolge. Nur echte sprachliche Voraussetzungen als Gates behalten.
4. Hanzi-Recognitionumfang und Entscheidung „keine neuen Writing Targets“; kein automatischer Zusammenhang mit Motor-/Produktionsmastery.
5. Vollständige zulässige deutsche Satzvarianten, Bewertungsgranularität und Grenzen bei unbekannten Paraphrasen. Keine erfundenen Wortkorrekturen.
6. Kanonische und gesprochene Pinyin-/Tonformen, Neutraltonkonventionen und Taiwan-Aussprache. Bestehende mainland Polly-Stimme versus gewünschtes Sprechmodell ausdrücklich entscheiden; Taiwan-kompatibler Text allein schafft keinen Taiwan-Akzent.
7. Finale Sprechskripte einschließlich Pausen/Interpunktion, Sprecherunterscheidung, Natural/Slow-Bedarf und verbindlicher QA-/Freigabeprozess für erzeugte Dateien.

**Nächster Schritt ausschließlich nach redaktioneller Zustimmung:** Textbestand und Voraussetzungen auf die freigegebene Fassung bringen; danach Sprach-/Assessment-QA; erst danach Audioauftrag. Mobile-/Matching-/Feedback-Entwürfe sind keine Vorgaben für den Lehrplan. Bis zur Freigabe bleibt die Weiterentwicklung pausiert.
