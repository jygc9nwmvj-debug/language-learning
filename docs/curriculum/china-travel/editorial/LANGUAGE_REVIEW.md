# Gesammelte Sprachredaktion: Reise nach Taiwan

20. Oktober 2026 · vollständige redaktionelle Lesung des unten abgegrenzten Bestands · KI-gestützt, mit Quellenabgleich

Der nächste sinnvolle Schritt war die Sprachredaktion, weil dieselben Formulierungen zugleich Dialogmodelle, Worterklärungen und Antwortschlüssel tragen. Ein unpassendes Register oder ein falscher Bedeutungsbezug würde sich sonst in mehreren Lernaufgaben fortsetzen. Die Befunde wurden gesammelt im kanonischen Bestand und in seinen lesbaren Fassungen korrigiert.

## Abdeckung und Grenzen

**Exhaustive für den benannten Textbestand:** Ausgangspunkt ist die redaktionelle Fassung in Commit de7b608: 134 Objekte (93 Wörter, 41 Konstruktionen), 171 Worteinträge einschließlich 44 bestehender Referenzen, 167 verschiedene Äußerungen, sämtliche 28 Dialoge mit 242 Sprecherzügen/288 Satzvorkommen, 211 Übungen einschließlich aller Optionen und Lösungen, 38 Matching-Varianten in 19 Gruppen sowie zehn Schreibziele. Gelesen wurden Formen in beiden Schriften, lexikalisches Pinyin, deutsche Bedeutungen, Lernhinweise, situative Bezüge, Dialoganschlüsse und Prüfschlüssel. Die Sprachbeispiele und regionalen Festlegungen im [Plan](../PLAN.md) sind ebenfalls einbezogen. Die Markdown-Ausgaben sind Ansichten desselben Bestands, keine zusätzlichen unabhängigen Texte.

Der korrigierte Stand enthält weiterhin **134 Objekte, 28 Dialoge, 62 Erkennungsformen und zehn Schreibziele**. Hinzugekommen sind sieben bewusst eingeführte gebundene Einträge und neun kurze kontextuelle Äußerungen zur Reparatur tatsächlicher Gesprächslücken. Daraus ergeben sich 178 Worteinträge (44 unveränderte Bestandsreferenzen, 93 neue Wortziele, 41 gebundene/Kontexteinträge), 176 verschiedene Äußerungen, 244 Sprecherzüge/291 Satzvorkommen und 221 Übungen. Die Übungen bestehen aus 176 Satzprüfungen, 33 Produktionsaufträgen, acht Wertaufgaben, einer Wegaufgabe und drei Reaktionsaufgaben. Wiederholte Satzvorkommen zählen nicht als neue Lernobjekte.

[language-review.json](language-review.json) erfasst jede Ausgangs- und Endfassung pro ID mit Prüfsumme und Änderungsdisposition; der Ausgangscommit bleibt rekonstruierbar. [verification.json](verification.json) dokumentiert die ergänzenden vollständigen Struktur-/Referenzprüfungen. Diese technischen Prüfungen belegen keine sprachliche Richtigkeit. Die sprachlichen Entscheidungen stammen aus der redaktionellen Lesung; die Quellen stützen jeweils nur die ausdrücklich genannten Teilfragen.

Ausgeschlossen sind eine erneute Bearbeitung der 36 Lernobjekte auf main, das vorläufige Feature-Material, nicht vorhandene Audios, gesprochene Realisierung, Aussprachebewertung, App-Verhalten und Lernerwirkung. Dies ist eine abgeschlossene KI-gestützte Quellen- und Redaktionsprüfung innerhalb dieses Auftrags, keine Bescheinigung einer muttersprachlichen oder lehrkraftseitigen Prüfung. Alle Inhalte bleiben draft; weder Veröffentlichungsfreigabe noch Audiofreigabe werden daraus abgeleitet.

## Befunde und gesammelte Korrekturen

| Befund | Korrektur und betroffene Zusammenhänge |
| --- | --- |
| L01 Hilfebitte als unmarkierte Aufforderung | Das frühe Alltagsmodell lautet 可以幫忙嗎？. 請幫忙 bleibt eine mögliche unmittelbarere Variante im Produktionsschlüssel; es wird nicht pauschal als falsch bezeichnet. Einführung und Satzoptionen sind angepasst. |
| L02 Servicebitte um Speisekarte | 請給我菜單。 wird zu 可以給我菜單嗎？. Die Frage formuliert den Wunsch höflicher, ohne eine neue obligatorische Konstruktion zu schaffen. |
| L03 Register am Hotelempfang | Name/Anrede wird mit 請問，您怎麼稱呼？ erfragt; Vorlagebitte mit 可以給我看一下您的護照嗎？; Kartenübergabe mit 這是您的房卡。. 您, 稱呼 und 一下 werden als gebundene Teile erklärt. 你 wird nicht allgemein als unhöflich ausgesondert. |
| L04 Beobachtetes Internetproblem statt unbelegter Diagnose | 網路壞了。 wird zu 不能上網。. Der Satz meldet fehlende Nutzbarkeit und behauptet keinen bestimmten Defekt. Der Ausdruck gehört nicht mehr als Beispiel zum Bauplan Gegenstand + 壞了. |
| L05 Möglichkeit und Erlaubnis auseinanderhalten | Kartenzahlung: 不能刷卡。 als neutrale Nichtverfügbarkeit; gescheiterter Zeitvorschlag: 不行。. 不可以 ist weiterhin eine mögliche Verbots-/Erlaubnisform, aber hier kein notwendiger Modellfall. Die kurze Zustimmung 可以 wird kontextübergreifend als „Ja, das geht“ erläutert. |
| L06 Taiwan-Zahlungspragmatik | 現金還是行動支付？ fragt nach Bargeld oder mobilem Bezahlen. 掃碼 bleibt als Verfahren erhalten; es ist kein Synonym für sämtliche mobilen Zahlungen. Eine neue Antwortwahl lässt beide angebotenen Zahlungsarten zu; G22 führt die mobile Wahl mit der passenden Scanaufforderung tatsächlich aus. Die Kassenkontexte erklären ausdrücklich den dargestellten Händlercode und den scannenden Gast. |
| L07 Zahlung ist keine Schenkung | 給你一百塊。 erhält „Hier bitte: hundert Taiwan-Dollar“ statt einer deutschen Geschenkimplikation. Die Lernhinweise erklären die Geldübergabe im Zahlungskontext. |
| L08 Erlaubnis zum Aufladen | 我的手機可以充電嗎？ war als Modell auch als Frage nach Gerätefähigkeit lesbar. 我可以在這裡給手機充電嗎？ fragt ausdrücklich nach der Erlaubnis hier. Satzprüfung und Kontext folgen dieser Bedeutung. |
| L09 Unnatürliche Zeitverdopplung | 今天現在可以嗎？ wird zu 現在可以嗎？. Das Prüfziel verlangt nur „jetzt“, nicht zusätzlich eine im Satz nicht mehr ausgedrückte Tagesangabe. |
| L10 Uhrzeit ohne Tageshälfte | 兩點半 legt allein 02:30/14:30 nicht fest. Bedeutung, Antwortoptionen und G19-Rückblick nennen halb drei ohne behauptete Tageshälfte. Die gesonderten 下午-Aufgaben behalten ihre eindeutigen 14:30-/15:30-Lösungen. |
| L11 Bedeutungen im jeweiligen Satz | 叫 heißt beim Arzt-/Polizeiruf rufen; 要 beim Zeitbedarf brauchen/dauern; 再 in 先…再… dann; 對 in der Allergieformel gegen. Satzexploration und Konstruktionserklärungen verwenden diese Funktionen einschließlich der wiederverwendeten Bestandswörter. Die 44 kanonischen Bestandsdatensätze selbst bleiben unverändert. |
| L12 的, 了 und 給 nicht als starre Einzelübersetzung | 的 wird bei Besitz, ausgelassenem Nomen und Ticketattribut jeweils anders erläutert. 了 erhält kontextbezogene Hinweise für Zustandsänderung, aktuelle Frage und 太…了. 給我看 heißt hier mir zeigen, 給手機充電 versorgt das Gerät. Ein Wortgloss ersetzt nicht die ganze Konstruktion. |
| L13 Fehlendes Fahrtziel in G13 | Vor 在哪站下車？ nennt Anna nun 我要去機場。. Erst dann zeigt B den passenden Ausstieg auf der Karte. Satzprüfungen und Voraussetzungen enthalten diese neue Äußerung. |
| L14 Verwechslungsgefahr fiktiver Flughafenlinie | G12 verwendet nun einen Bahnhof auf einer ausdrücklich fiktiven Karte einer unbenannten Stadt. Vier kurze Bahnhofvarianten ersetzen dort die Flughafenfolge. Die getrennten Flughafenformulierungen bleiben als Sprachmodelle erhalten; eine reale rote Flughafenlinie wird nicht nahegelegt. |
| L15 Leerlauf nach Zeitfrage in G21 | 有 erhält einen eigenen Kontextschlüssel „Ja, ich habe Zeit“. Nach dem Reiseplan folgt eine ausdrückliche Bitte um die vorher besprochene Hilfe morgen um 14:30; Rückversicherung und Zusage haben dadurch einen konkreten Gegenstand. |
| L16 Unmotivierte Reparaturen in G22/G25 | G22 markiert Annas Nichtverstehen vor der Batterie-Rückfrage. In G25 fragt der Empfang nach der Verlustmeldung mit 護照嗎？ rück, statt selbst ohne Anlass 我聽不懂 zu sagen. Danach folgen Bestätigung und Polizeibitte. |
| L17 Hilfesituation und Antwortbezug | G26 spielt ausdrücklich an einer medizinischen Anlaufstelle mit erreichbarer Arztperson; der Text verspricht keinen universellen Hotelservice. 在那裡 erhält das neutrale „Dort“, damit kein unpassendes deutsches Genus in wiederverwendete Antworten gelangt. |
| L18 Pinyin und Lesungsvarianten | 晚安 wird als wǎn'ān geschrieben. Für 稱呼 bleibt die MOE-Lesung chēnghū gegenüber chēnghu dokumentiert; 行動支付 hat keinen Gesamtworteintrag im verwendeten CC-CEDICT und wird ehrlich durch institutionellen Gebrauch und die geprüften Teile 行動/支付 belegt. Die vier früher dokumentierten Varianten bleiben ausdrücklich eingeordnet. |

Es gibt keine pauschale Umstellung aller knappen Antworten auf lange Höflichkeitsformeln. Bestellungen mit 我要, situative Kurzantworten, 你 sowie Bitteformen mit 請 bleiben dort stehen, wo sie im jeweiligen Alltagsszenario verständlich und angemessen sind. 冰的 wird weiterhin als angebotene eisgekühlte Variante behandelt, ohne daraus eine bestimmte Eismenge abzuleiten. Der Allergiedialog bestätigt keine unbelegt allergenfreie Alternative. Schmerz- und Verlustmeldungen bleiben unterschiedliche Anliegen. Traditionelle und vereinfachte Formen verwenden dieselben taiwanbezogenen Wörter.

## Quellen zu den Entscheidungen

- [MOE: 稱呼](https://pedia.cloud.edu.tw/Entry/Detail?title=%E7%A8%B1%E5%91%BC) belegt chēng hū und 怎麼稱呼 als Frage nach der Anrede. Das ist eine lexikalische Referenz, keine Freigabe unseres gesamten Hotelskripts.
- [MOE: 您](https://dict.revised.moe.edu.tw/dictView.jsp?ID=3112&la=1&powerMode=0) belegt die höfliche Zweitperson und nín. Daraus folgt kein Gebot, alle Taiwan-Alltagsdialoge mit 您 zu führen.
- [MOE: 一下](https://dict.revised.moe.edu.tw/dictView.jsp?ID=149508&la=1&powerMode=0) beschreibt unter anderem die kurze/abgeschwächte Handlung nach dem Verb, einschließlich 看一下. Die konkrete höfliche Vorlagefrage ist eigene redaktionelle Formulierung.
- [University of Taipei: chinesische Konversationsaktivität](https://international.utaipei.edu.tw/p/406-1006-109164,r769.php?Lang=zh-tw) dokumentiert 可以給我菜單嗎 als konkreten Gebrauch. Das ist ein studentischer Aktivitätsbericht, keine normative Sprachbegutachtung.
- [Chunghwa Post: QR-Zahlungsschritte](https://www.post.gov.tw/post/FileCenter/post_ww2/ad/ad_linkpage/114_digitalvouchercampaign_qrpay.html) unterscheidet selbst scannen und eigenen Zahlungscode vorzeigen. Deshalb macht das Material weder eine universelle Scanrichtung noch eine Akzeptanzzusage zum Lerninhalt.
- [MOE: Hanyu-Pinyin-Anwendungsleitfaden](https://language.moe.gov.tw/uploads/files/17581029061391.pdf), PDF-Seite 7, erläutert die Silbentrennung durch Apostroph vor a/o/e. Das stützt die Schreibweise wǎn'ān und bewertet keine Audioaussprache.
- [Frühere Quellenprüfung](REVIEW.md) dokumentiert MOE-/NTU-Belege zur Taiwan-Wortwahl und die vier ursprünglichen Lesungsentscheidungen. Der verwendete CC-CEDICT-Snapshot und seine Lizenz sind dort benannt; die sieben Ergänzungen sind in sourceFacts mit eingeschränkter Belegreichweite einzeln erfasst.

Alle Quellen wurden am 20. Oktober 2026 eingesehen. Die Dialoge, deutschen Bedeutungen und Lernhinweise sind eigenständig redigiert. Wörterbücher und institutionelle Beispiele begründen Teilentscheidungen; die Natürlichkeitsurteile über unsere vollständigen Dialoge bleiben ausdrücklich redaktionelle Urteile.

## Abgeschlossen innerhalb des Auftrags

Kanonische Texte, beide Schriftfassungen, Pinyin, Lernhinweise, Kontextglossen, Dialoganschlüsse, Satzoptionen, Produktionsmodelle und abgeleitete Referenzen sind gemeinsam aktualisiert. Die Offline-Prüfung bestätigt Zählbilanz, Referenzen und vorhandene Einführungsstufen; die lesbaren Dateien sind reproduzierbar daraus erzeugt. Es wurde keine neue unabhängige Hör- oder Lernwirksamkeitsevidenz erzeugt.

Keine Audios, App-/Scheduler-/UI-Änderungen, Veröffentlichung, Push oder Merge. Das vorhandene Feature-Material wurde in diesem Auftrag nicht bearbeitet oder übernommen. Der abschließende Vergleich zeigt zwischenzeitliche Änderungen im parallel genutzten Feature-Arbeitsverzeichnis; eine unveränderte Vorher-/Nachher-Gleichheit wird deshalb nicht behauptet. Diese Änderungen werden hier weder bereinigt noch zurückgesetzt. Der Auftrag endet mit diesem korrigierten Textstand und dem dokumentierten Review.
