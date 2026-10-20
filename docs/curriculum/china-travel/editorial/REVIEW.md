# Quellen und Prüfstand der redaktionellen Ausarbeitung

20. Oktober 2026 · Historischer Erstprüfstand aus de7b608 · Status draft

Die nachfolgende Quellen-/Strukturbilanz beschreibt die ursprüngliche Ausarbeitung. Die späteren gesammelten Sprachkorrekturen und aktuellen Mengen stehen in [LANGUAGE_REVIEW.md](LANGUAGE_REVIEW.md). Die ursprüngliche Strukturprüfung bleibt in [verification-initial.json](verification-initial.json) erhalten.

## Umfang der Prüfung

Die strukturelle Prüfung erfasst die 134 neuen Objekte, 171 referenzierten Worteinträge einschließlich 44 bestehender Einträge, 167 verschiedene Äußerungen, 28 Dialoge, 211 Satz-/Anwendungsaufgaben, 38 Matching-Varianten und zehn Schreibziele. Das ist die abgegrenzte Population für vollständige Zähl- und Verweisabdeckung. Die lokale Prüfung erfasst IDs, Formen, Wort-/Silbenabdeckung, Einführungsetappen, Satzprüfungen, Dialogreferenzen, Antwortschlüssel und die ausgewählten Erkennungs-/Schreibformen. Ergebnisse und Bindung an die JSON-Fassung: [verification-initial.json](verification-initial.json). Reproduzierbar mit der damaligen Fassung des Offline-Prüfers in de7b608; der heutige Prüfer bilanziert die korrigierte Fassung.

Alle 134 Objekte, 167 Äußerungen und 28 Dialoge bleiben redaktionelle Entwürfe. Die strukturelle Prüfung ist keine qualifizierte Sprach-, Natürlichkeits-, Hör-, Geräte- oder Wirksamkeitsprüfung. Die App wird von dem Offline-Prüfer weder geladen noch verändert.

## Wortformen und Lesungen

Die 127 neuen kanonischen Worteinträge bestehen aus 93 eigenständigen Wortzielen und 34 gebundenen oder kontextuellen Einträgen. Der automatisierte Abgleich verwendet [CC-CEDICT von MDBG](https://www.mdbg.net/chinese/dictionary?page=cedict), abgerufen am 20. Oktober 2026, als im Projekt zugelassene lexikalische Referenz. 123 von 127 Einträgen stimmen im Schriftpaar und in der gewählten lexikalischen Tonfolge exakt überein. Die übrigen vier besitzen explizite Entscheidungen:

| Eintrag | Abweichung im Abgleich | Entscheidung und Quelle |
| --- | --- | --- |
| 那裡 | CC-CEDICT führt nàli mit Neutralton. | nàlǐ bleibt die sorgfältige Taiwan-Lernform. Das [MOE 簡編本 über 教育百科](https://pedia.cloud.edu.tw/Entry/Detail/?title=%E9%82%A3%E8%A3%A1) führt nà lǐ für dort. Die zusätzliche dort erfasste andere Lesart nǎlǐ wird nicht als neue Anfängerbedeutung dieses Eintrags gelehrt. |
| 便宜 | CC-CEDICT führt für günstig piányi. | piányí folgt dem [MOE 簡編本 über 教育百科](https://pedia.cloud.edu.tw/Entry/Detail/?title=%E4%BE%BF%E5%AE%9C). Derselbe Portalartikel dokumentiert im 重編本 die Neutraltonvariante. Die Variante ist kein Beweis eines Aussprachefehlers. |
| 還是 | CC-CEDICT führt háishi. | háishì wird im institutionellen Taiwan-Beispiel [NTU Drink Bar](https://homepage.ntu.edu.tw/~ntutcsl/affair/%E6%96%90%E7%91%84%E7%9A%84%E7%B6%B2%E9%A0%81/drink.html) in der Auswahlfrage modelliert. Die spätere Lautfassung braucht trotzdem Satzprüfung. |
| 直走 | Kein eigener Worteintrag im heruntergeladenen Datensatz. | 直 zhí und 走 zǒu stimmen einzeln überein. Die transparente Wegverbindung wird redaktionell erklärt; damit wird keine unabhängige Natürlichkeitsfreigabe behauptet. |

Damit sind 127 von 127 neuen Einträgen hinsichtlich des abgegrenzten Schrift-/Lesungsabgleichs bilanziert: 123 direkte Treffer und vier dokumentierte Einordnungen. Der Abgleich prüft keine Audiofassung und ersetzt keine vollständige Prüfung der Bedeutungen, Wortfunktionen und Satzpragmatik. Kein Learning-Feld wird automatisch als source_checked oder language_reviewed ausgegeben.

Prüfsumme des temporär geladenen entpackten CC-CEDICT-Datensatzes: fc7cca0211589863fa314dd6e42ce382076fcda555bd62c8e644d6429cf267b8. Die vollständige Wörterbuchdatei liegt nicht im Repo. CC-CEDICT ist ein gemeinschaftlich gepflegtes Projekt, veröffentlicht von MDBG, unter [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Es werden keine Wörterbuchdefinitionen oder Lehrbuchdialoge kopiert. Die deutschen Glossen, Erklärungen, Dialoge und Aufgaben sind eigenständige redaktionelle Texte; der Faktenabgleich und sein Herkunftsnachweis bleiben ausgewiesen.

## Taiwan und die bestehenden Sprachregeln

Der Nutzer hat den Reisebezug ausdrücklich als Reise nach Taiwan festgelegt. Die regionalen Anpassungen ersetzen im selben Lernziel 白飯 für den Bestellkontext, 捷運, 飯店, 計程車, 網路, 藥局 und 痛. Der Wortlaut in Simplified folgt derselben taiwanbezogenen Wortwahl. Beide Schriften bilden kein getrenntes regionales Curriculum.

Der Unterkunftssinn von 飯店 und die Lesung fàndiàn sind im [MOE 重編本](https://dict.revised.moe.edu.tw/dictView.jsp?ID=35274&la=0&powerMode=0) dokumentiert; der Unterschied zum Restaurantkontext wird im Lernhinweis erklärt. Für 捷運 ist das [MOE-Portal](https://pedia.cloud.edu.tw/Entry/Detail/?title=%E6%8D%B7%E9%81%8B) eine zusätzliche institutionelle Referenz. [藥局 im MOE-Portal](https://pedia.cloud.edu.tw/Entry/Detail/?search=%E8%97%A5%E5%B1%80&title=%E8%97%A5%E5%B1%80) belegt den Apothekenbegriff. Diese Quellen geben keine pauschale Freigabe der neu verfassten Gesprächsskripte.

Lexikalisches Pinyin und 一/不-Oberflächenkandidaten bleiben getrennt. Die automatische Oberflächenableitung betrifft nur tatsächlich geschriebene 一 und 不, nicht gleichlautende andere Zeichen wie 醫. Dritte-Ton-Gruppierung, mögliche Neutraltonrealisierungen und Satzrhythmus werden ausdrücklich nicht durch einen universellen Ersetzungsalgorithmus finalisiert. Bestehende Wörter und alte Einträge werden nicht umgeschrieben.

## Noch erforderliche qualifizierte Sprachprüfung

Der gesamte neue Satzbestand benötigt die im Projekt vorgesehene Prüfung durch eine qualifizierte Mandarin-Lehrkraft beziehungsweise einen geeigneten Native Reviewer. Das ist die nächste fachliche QA-Stufe, keine Aufforderung an den Nutzer, jedes Item einzeln zu genehmigen. Ein Reviewer bekommt in den Etappen und der Übungsfassung Text, Pinyin, Bedeutung, Kontext, Antworten und konkrete Prüfziele zusammen.

Besondere Aufmerksamkeit benötigen:

- Natürlichkeit und Register der Servicefragen, knappen Antworten und Bitten in Taiwan; insbesondere Erlaubnis, Vorlagebitte und Hilferuf.
- Der genaue Getränkekontext von 冰的 und der Unterschied zwischen Temperatur, Eis und Eismenge.
- Allergie und bloße Speiseverweigerung; die Dialoge dürfen keine unbestätigte allergenfreie Alternative oder sichere Versorgung suggerieren.
- Satzbedeutung nach Negation oder Korrektur: tatsächliche Auswahl, endgültige Fahrtzeit, korrigierte Richtung und verlorener beziehungsweise defekter Gegenstand.
- Die sorgfältigen und natürlichen Lautfassungen einschließlich Neutraltonvarianten, dritter Töne und 一/不. Die geschriebenen lexikalischen Töne allein sind keine vollständige Sprechanweisung.
- Formulierungen bei Verlust und Beschwerden; die Inhalte vermitteln begrenzte Kommunikationsmittel, keine Diagnose, Behandlung oder Rechts-/Reisezusage.

Für freie deutsche Paraphrasen und nicht gelistete Mandarinantworten ist der Modellvergleich vorgesehen. Die spätere App darf Unbekanntes nicht allein wegen fehlender Listenübereinstimmung als falsch abwerten. Die vorgegebenen Antwortoptionen und strukturierten Werte sind geschlossen prüfbar; Lautproduktion und eigenständiger Transfer werden daraus nicht abgeleitet.

## Isolation

Der Bestand liegt ausschließlich unter docs/curriculum/china-travel. App-Quellen, öffentliche Assets, Audio-Manifest, Scheduler, UI und historischer Lernerstand bleiben unverändert. Der bestehende Feature-Arbeitsstand wird nicht importiert oder bereinigt. Die JSON-Fassung enthält keine vorgetäuschten Audiodateipfade und wird von der App nicht geladen. Es gab keine neue Synthese, keinen Audio-Dry-Run, keinen Push, Merge oder Veröffentlichungsschritt.
