# Mandarin App — Masterstand

**Version:** 0.1  
**Datum:** 26.09.2026  
**Status:** Arbeitsgrundlage / Single Source of Truth

## Statuslogik

- **SET** — bewusste Produktentscheidung; gilt bis wir sie ausdrücklich ändern.
- **EVIDENCE** — durch robuste Forschung bzw. etablierte Fachrahmen gestützt.
- **HYPOTHESIS** — plausible Designentscheidung, die wir mit dem Produkt testen müssen.
- **OPEN** — noch nicht entschieden.

---

## 1. Produktziel

**SET**

Die App soll eine belastbare, alltagstaugliche Grundlage in Mandarin vermitteln. Sie verspricht keine schnelle „Fluency“ und ist kein Sinologie-Studium.

Ziel der ersten Kursstufe („Foundation 1“) ist, dass Lernende:
- grundlegende Alltagssituationen auf einer China-Reise bewältigen können,
- einfache gesprochene Sprache verstehen und selbst produzieren können,
- funktional lesen können (z. B. Schilder, Speisekarte, kurze Nachrichten),
- kurze digitale Nachrichten verfassen können,
- chinesische Schrift als System verstehen,
- einen begrenzten Kernbestand an Zeichen selbst schreiben können.

**SET — Priorität der Fertigkeiten**

1. Hören und Aussprache
2. Sprechen / Interaktion
3. Funktionales Lesen / Zeichenerkennung
4. Handschrift als Lerninstrument und begrenzte aktive Schreibkompetenz

Die Fertigkeiten werden **nicht isoliert gelernt**, sondern in den Lektionen miteinander verknüpft. Sie werden im Lernstandsmodell dennoch getrennt erfasst.

---

## 2. Schriftsystem und Sprachvariante

**SET**

- App unterstützt von Anfang an **Traditional und Simplified Chinese**.
- Beim Start wählt der Lernende ein primäres Schriftsystem.
- Beide Schriftsysteme werden nicht gleichzeitig als Lernziel präsentiert.
- Wechsel bleibt technisch möglich; Hör-, Bedeutungs- und Sprechfortschritt bleibt erhalten, Schrift-Erkennen und Schrift-Produktion werden getrennt bewertet.
- Wolframs eigener Primärmodus: **Traditional**.
- Vorerst: **Standardmandarin + Hanyu Pinyin**.
- Traditional/Simplified ist technisch und didaktisch von regionalen Varianten (z. B. Taiwan/Mainland) getrennt.

---

## 3. Produktprinzipien

### 3.1 Foundation over acceleration
**SET — Produktentscheidung**

Lieber einen kleineren Sprachbereich stabil beherrschen als möglichst schnell große Mengen „abdecken“.

### 3.2 Komplexität im System, Einfachheit in der Bedienung
**SET — Produktentscheidung, gestützt durch Cognitive-Load-/Multimedia-Learning-Forschung**

Die App darf intern adaptiv und komplex sein. Nutzer sollen Spacing, Lernparameter, Deckverwaltung usw. nicht managen müssen.

**Konsequenz:** Das Interface zeigt nur Informationen und Optionen, die den aktuellen Lernschritt unterstützen.

### 3.3 Keine Gamification als primärer Motivationsmechanismus
**SET — Produktentscheidung**

Keine XP, Streak-Drohungen, virtuelle Währungen oder künstliche Belohnungsschleifen. Fortschritt wird sachlich sichtbar gemacht.

**Wichtig:** Dies ist keine Aussage, dass Gamification wissenschaftlich generell unwirksam sei; es ist eine bewusste Produktpositionierung.

### 3.4 Offline- und Privacy-first
**SET**

- vollständige Kernlektion ohne Internet
- kein Account für die Kernfunktion
- kein Tracking / keine Werbe-SDKs
- Lernstand lokal
- Audio lokal aufnehmen und analysieren
- iPhone + iPad
- Pencil auf iPad, Finger als vollständige Alternative

---

# 4. Evidence-Based Learning Framework v0.1

Ziel: wenige robuste Regeln. Forschungsergebnisse und unsere Designableitungen werden getrennt.

## Prinzip 1 — Verteiltes und kumulatives Lernen

**EVIDENCE: HOCH**

Eine L2-Meta-Analyse mit 48 Experimenten (N=3.411) fand einen mittelgroßen bis großen Vorteil von spaced gegenüber massed practice. Längere Abstände waren für verzögerte Tests günstiger; „expanding spacing“ war nicht eindeutig besser als gleichmäßige Abstände.

**Designableitung**
- Neues Material wird über spätere Sessions verteilt wieder aufgegriffen.
- Alte Inhalte bleiben Teil des aktiven Materialpools.
- Wir brauchen keinen komplizierten „magischen“ Intervallalgorithmus.
- Wiederholungszeitpunkte werden adaptiv, aber für den Nutzer weitgehend unsichtbar gesteuert.
- Neue Lektionen enthalten ausgewählte ältere Inhalte; nicht pauschal alles Alte.

**Nicht daraus ableiten**
- Mehr Abstand ist nicht immer automatisch besser.
- Expanding intervals sind nicht nachweislich grundsätzlich überlegen.

Quelle: Kim & Webb (2022), *The Effects of Spaced Practice on Second Language Learning: A Meta-Analysis*.  
https://doi.org/10.1111/lang.12479

---

## Prinzip 2 — Aktiver Abruf, aber mit Feedback

**EVIDENCE: HOCH für Abruf gegenüber Wiederlesen; differenziert gegenüber anderen guten Lernmethoden**

Retrieval Practice ist robust wirksamer als bloßes Wiederlesen. Eine Meta-Analyse von 2025 zeigt jedoch: Gegenüber anderen elaborativen Lernmethoden ist der Gesamtvorteil klein (g≈0,14); mit korrektivem Feedback steigt er deutlich (g≈0,50). Ohne Feedback können elaborative Methoden konkurrenzfähig oder besser sein.

L2-spezifische Forschung zu kumulativen Vokabeltests zeigt zusätzlich Vorteile, wenn neues und früheres Material gemeinsam wieder abgerufen wird.

**Designableitung**
- Möglichst früh vom Wiedererkennen zum aktiven Produzieren.
- Abruf wird fast immer mit informativem Feedback gekoppelt.
- Derselbe Inhalt wird aus unterschiedlichen Richtungen abgefragt:
  - Audio → Bedeutung
  - Bedeutung → Sprechen
  - Zeichen → Aussprache
  - Bedeutung/Audio → Zeichen schreiben
- „Test“ und „Lernen“ sind keine getrennten Welten; Abruf ist Teil des Lernens.

**Nicht daraus ableiten**
- Jede Aufgabe muss ein Test sein.
- Multiple Choice ist grundsätzlich wertlos.
- Abruf ohne Erklärung/Feedback ist automatisch optimal.

Quellen:  
Gonçalves et al. (2025), *Retrieval Practice Versus Elaborative Encoding: A Systematic and Meta-analytic Review*.  
https://doi.org/10.1007/s10648-025-10076-6

Maie et al. (2025), *Cumulative Testing for L2 Vocabulary Learning*.  
https://doi.org/10.1002/tesq.3391

---

## Prinzip 3 — Kurze explizite Erklärung + Anwendung

**EVIDENCE: HOCH**

Eine Meta-Analyse von 28 Studien / 67 Stichproben (N=3.754) fand moderate bis große Effekte expliziter Instruktion im Zweitsprachenlernen.

**Designableitung**
- Grammatik, Lautregeln oder Zeichenstruktur werden knapp erklärt, wenn eine Erklärung Lernen effizienter macht.
- Anfänger müssen Regeln nicht aus vielen Beispielen selbst erraten.
- Erklärung wird unmittelbar mit Anwendung, Wahrnehmung und Produktion verknüpft.
- Hilfen werden schrittweise reduziert.

**Nicht daraus ableiten**
- Sprache wird primär durch Regeltexte gelernt.
- Jede Struktur braucht eine ausführliche Grammatiklektion.

Quelle: Li & Sun (2024), *Effects of different forms of explicit instruction on L2 development: A meta-analysis*.  
https://doi.org/10.1111/flan.12726

---

## Prinzip 4 — Vier Arten von Lerngelegenheiten im Kurs

**EVIDENCE / FACHRAHMEN: STARKER, LANGJÄHRIGER SLA-CURRICULUMRAHMEN**

Paul Nations „Four Strands“ unterscheiden:
1. meaning-focused input,
2. meaning-focused output,
3. language-focused learning,
4. fluency development.

Nation empfiehlt einen ungefähr ausgewogenen Kurs und betont 2026 erneut, dass dieselben Sprachmerkmale über alle vier Stränge hinweg vorkommen sollten.

**Designableitung**
- Die App darf nicht nur Vokabel-/Formtraining sein.
- Sie muss verständlichen Input, echte Produktion und wiederholte Verwendung bereits bekannten Materials enthalten.
- „Fluency“ bedeutet hier: Bekanntes zunehmend leichter/schneller verarbeiten, nicht ständig Neues lernen.
- Wir verwenden Four Strands als **Audit-Rahmen**, nicht als starre 25%-Regel pro Lektion.

**Nicht daraus ableiten**
- Hören, Sprechen, Lesen und Schreiben müssen je 25 % bekommen.
- Jede 15-Minuten-Session muss alle vier Stränge exakt gleich verteilen.

Quelle: Paul Nation (2026), *Revisiting the Four Strands*.  
https://doi.org/10.58304/ijts.260715

---

## Prinzip 5 — Aussprache trainiert Wahrnehmung UND Produktion

**EVIDENCE: HOCH**

Eine Meta-Analyse von 65 Studien mit 2.793 L2-Lernenden fand einen großen positiven Gesamteffekt phonetischen Trainings (d≈0,76). Perzeptives Training zeigte besonders starke Effekte. Eine weitere Meta-Analyse von 79 HVPT-Studien fand mittelgroße bis große Effekte auf L2-Lautwahrnehmung und Hinweise auf Retention und Generalisierung.

Für Mandarin zeigt eine Meta-Analyse von 2025, dass Tonwahrnehmung systematisch von Tonhöhe/-kontur und L2-Erfahrung beeinflusst wird; Tonkontraste bleiben ein eigener Lerngegenstand.

**Designableitung**
- Töne ab Beginn als Kernbestandteil, nicht als spätes Zusatzkapitel.
- Hören/Unterscheiden mehrerer Sprecher und Varianten.
- Wahrnehmung und eigene Produktion beide trainieren.
- Tonanalyse soll konkrete Rückmeldung geben, nicht nur „richtig/falsch“.
- Produktion muss selbst geübt werden; Wahrnehmungstraining ersetzt sie nicht vollständig.

**Nicht daraus ableiten**
- Ein einzelnes akustisches Score-Modell kann „gute Aussprache“ vollständig messen.
- Nachsprechtraining allein genügt.

Quellen:  
Yao et al. (2025), *A Meta-Analysis of Second Language Phonetic Training*.  
https://doi.org/10.1044/2024_JSLHR-24-00432

Uchihara et al. (2025), *High variability phonetic training (HVPT): A meta-analysis of L2 perceptual training studies*.  
https://doi.org/10.1017/S0272263125100879

Cui & Zhao (2025), *A meta-analytic review of Mandarin tone perception*.  
https://doi.org/10.3389/fpsyg.2025.1670858

---

## Prinzip 6 — Fertigkeiten integrieren, Informationslast kontrollieren

**EVIDENCE: HOCH für Segmentierung/Cognitive Load; HYPOTHESIS für unsere konkrete UI-Umsetzung**

Multimedia-Learning-Forschung zeigt Vorteile sinnvoller Segmentierung: Eine Meta-Analyse von 56 Untersuchungen fand kleine bis mittlere Vorteile für Behalten und Transfer. Reviews stützen zudem, unnötige konkurrierende Informationen zu reduzieren.

**Designableitung**
Ein Lerngegenstand soll vernetzt werden:
Bedeutung ↔ Laut/Ton ↔ Schrift ↔ Verwendung ↔ motorisches Schreiben.

Aber nicht alle Informationen müssen gleichzeitig sichtbar sein.

- Eine Lernhandlung hat ein klares kognitives Ziel.
- Zusammengehörige Informationen werden gemeinsam gezeigt.
- Irrelevante oder vorwegnehmende Hilfen werden ausgeblendet.
- Pinyin, Übersetzung oder Lösung verschwinden, sobald sie den gewünschten Abruf verhindern würden.
- Nutzer steuert Wiederholung und Tempo.

**Nicht daraus ableiten**
- „Eine Aufgabe pro Screen“ ist ein wissenschaftliches Gesetz.
- Minimalismus ist unabhängig vom Lernziel immer besser.

Quellen:  
Rey et al. (2019), *A Meta-analysis of the Segmenting Effect*.  
https://doi.org/10.1007/s10648-018-9456-4

Systematic Review: *Multimedia learning principles in different learning environments* (2022).  
https://doi.org/10.1186/s40561-022-00200-2

---

## Prinzip 7 — Chinesische Schrift als strukturiertes System; Handschrift gezielt einsetzen

**EVIDENCE: MITTEL bis HOCH, aber differenziert**

Ein Review von 27 Studien zum Chinesischlernen zeigt unterschiedliche Vorteile von Tippen und Handschrift:
- Tippen kann phonologische Verarbeitung / Phonologie-Orthographie-Zuordnung unterstützen.
- Handschrift zeigt Vorteile für orthographische Erkennung und Orthographie-Bedeutungs-Zuordnung.
Die Effekte auf allgemeine Schreibperformance sind gemischt.

Eine Meta-Analyse zum Lesen von Chinesisch als L2 zeigt, dass phonologische, morphologische und orthographische Fähigkeiten mit Leseleistung zusammenhängen. Mehr als 80 % moderner chinesischer Zeichen sind phonosemantische Komposita; Zeichenkomponenten können daher lernrelevante Information tragen.

**Designableitung**
- Handschrift ist Lerninstrument, kein Kalligraphiekurs.
- Ein begrenzter wichtiger Zeichenbestand wird aktiv geschrieben.
- Lesen/Erkennen wird breiter aufgebaut als Handschriftproduktion.
- Phonetische und semantische Komponenten werden erklärt, wenn sie wirklich informativ sind.
- Digitale Texteingabe (z. B. Pinyin → Zeichenwahl) gehört später zur funktionalen Alltagskompetenz.

**Nicht daraus ableiten**
- Jedes gelernte Wort muss handschriftlich produziert werden.
- Strichreihenfolge ist wichtiger als Bedeutung, Erkennen oder Aussprache.
- Radikale werden als isolierte Liste auswendig gelernt.

Quellen:  
Lyu et al. (2021), *Comparison studies of typing and handwriting in Chinese language learning: A synthetic review*.  
https://doi.org/10.1016/j.ijer.2021.101740

Chen & Zhao (2022), *Reading-Related Skills Associated With Acquisition of Chinese as a Second/Foreign Language: A Meta-Analysis*.  
https://doi.org/10.3389/fpsyg.2022.783964

---

# 5. Kompetenzrahmen für Foundation 1

**EVIDENCE / FACHRAHMEN**

Wir erfinden keinen eigenen Sprachlevel. Wir nutzen:
- CEFR als „Can-do“- und action-oriented Referenz,
- ACTFL 2024 als Referenz für funktionale reale Sprachfähigkeit.

ACTFL beschreibt Kompetenz über:
- Functions / Tasks
- Accuracy
- Context / Content
- Text Type

CEFR definiert A1/A2 über konkrete kommunikative Handlungen und enthält inzwischen eigene Deskriptoren für Online-Interaktion.

**SET — unsere Nutzung**
Foundation 1 ist **kein CEFR-/ACTFL-Level und kein HSK-Level**, sondern ein kuratierter alltags- und reiserelevanter Ausschnitt.

**DRAFT — Kompetenzfelder**
1. Kontakt aufnehmen / sich vorstellen
2. Verständigung steuern und reparieren
3. Essen und Trinken
4. Zahlen, Preise, Mengen und Bezahlen
5. Orientierung und Verkehr
6. Unterkunft und einfache Probleme/Wünsche
7. einfacher Smalltalk / persönliche Informationen
8. funktionales Lesen
9. kurze digitale Kommunikation

**OPEN**
Die präzisen Exit-Kompetenzen werden als nächster Konzeptschritt festgelegt.

Quellen:  
ACTFL Proficiency Guidelines 2024  
https://www.actfl.org/proficiency-guidelines-overview

CEFR Companion Volume 2020  
https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions

---

# 6. Kursarchitektur

**SET**

- Curriculum ist kumulativ.
- Jede neue Lektion erweitert den verfügbaren Sprachraum.
- Frühere Inhalte werden in neuen Kontexten wiederverwendet.
- Lektionen sind keine abgeschlossenen Schubladen.
- Der Kurs priorisiert Transfer: bekannte Elemente werden neu kombiniert.

**HYPOTHESIS**
Eine „Lektion“ ist eher ein Stoff-/Kompetenzpaket als eine einzelne 15-Minuten-Session. Eine Lektion kann sich über mehrere Sessions entfalten.

---

# 7. Lernstandsmodell — erster Entwurf

**DRAFT**

Für einen Lerngegenstand können getrennte Zustände geführt werden:

- Bedeutung / Konzept
- Hören / Verstehen
- Aussprache / Ton
- aktive mündliche Produktion
- Schrift erkennen (Traditional)
- Schrift erkennen (Simplified)
- Schrift aus dem Gedächtnis schreiben (Traditional)
- Schrift aus dem Gedächtnis schreiben (Simplified)
- Verwendung in Satz/Struktur
- digitale Produktion

Dadurch kann z. B. ein Wort beim Hören sicher, beim Schreiben aber noch unsicher sein.

**OPEN**
Konkrete Scoring-/Spacing-Logik.

---

# 8. Dynamik und KI

**SET**

Curriculum und Lernziele bleiben kontrolliert. Variation darf innerhalb dieser Grenzen entstehen.

**V0.1**
Keine generative KI notwendig. Variabilität durch:
- Reihenfolge
- Aufgabentyp
- Abrufrichtung
- kuratierte Satzvarianten / Templates

**LATER / HYPOTHESIS**
On-device KI kann neue Satzvarianten erzeugen, sofern:
- nur freigegebener Wortschatz verwendet wird,
- nur bekannte Grammatik verwendet wird,
- Output automatisch validiert wird,
- kuratierter Fallback existiert.

KI entscheidet nicht, was gelernt werden soll.

---

# 9. Technischer Zielrahmen V0.1

**SET**

- native Universal App: iPhone + iPad
- SwiftUI
- Apple Pencil + Finger
- vollständig offline nutzbare Kernlektion
- lokale Speicherung
- keine Accounts
- keine Tracker / Analytics in der Kernversion
- Audioaufnahme lokal
- erste lokale Tonhöhen-/Konturanalyse
- Traditional/Simplified wählbar
- eine vollständige Lektion
- Lernfortschritt bleibt erhalten

**Akzeptanzkriterium**
Flugmodus → App öffnen → komplette Lektion inkl. Hören, Sprechen, Schreiben, Wiederholung und lokalem Lernstand absolvieren.

---

# 10. Was bewusst NICHT festgelegt ist

**OPEN**

- konkrete Inhalte von Lektion 1
- genaue Anzahl der Foundation-1-Lektionen
- konkrete Wort-/Zeichenzahl
- Spaced-Repetition-Algorithmus
- genaue Tonbewertungslogik
- endgültiger Lesson Flow
- UI-Design
- App-Name / Branding
- HSK-Anbindung
- regionale Mandarin-Varianten
- konkrete lokale KI-Modelle

---

# 11. Nächste Arbeitsschritte

1. Evidence Framework noch auf Schwachstellen / Gegenbefunde prüfen.
2. Foundation-1-Exit-Kompetenzen präzise definieren.
3. Mehrere freie seriöse Anfänger-Curricula vergleichen.
4. Eigenes Curriculum daraus ableiten.
5. Erst dann Lektion 1 vollständig entwerfen.
6. Danach Lesson Flow + V0.1-Spezifikation.
7. Dann GitHub / Codex / Xcode.

---

## Leitfrage für jede neue Idee

1. Verbessert sie wahrscheinlich das Lernen?
2. Ist die Evidenz dafür belastbar oder ist es eine Hypothese?
3. Macht sie die Bedienung unnötig komplizierter?
4. Dient sie Foundation 1 — oder gehört sie später?


---

# 12. Foundation 1 – sprachlicher Kern / High-Leverage-Bausteine

**Status: DRAFT**

Ziel dieser Ebene ist nicht, bereits eine Lektionenreihenfolge festzulegen. Sie identifiziert die kleinste Menge sprachlicher Systeme, die möglichst viele Foundation-1-Alltagssituationen trägt.

## 12.1 Generative Kernstrukturen

### A. Personen und Referenz
**Funktion:** über sich und andere sprechen, Besitz/Zuordnung ausdrücken.

- Personalpronomen
- Demonstrativa: dies/das
- einfache Possessiv-/Attributstruktur mit 的
- Singular/Plural nur dort explizit, wo funktional nötig

**Trägt:** Kontakt, Smalltalk, Unterkunft, Einkaufen, Chat.

### B. Identität, Beschreibung und Zustand
**Funktion:** sagen, was/wer etwas ist und wie etwas ist.

- 是 für Identität/Klassifikation
- einfache Eigenschaftssätze
- grundlegende Grad-/Zustandsausdrücke

**Trägt:** Vorstellen, Hotel, Essen, Probleme, Smalltalk.

### C. Haben, Vorhandensein und Fehlen
**Funktion:** haben / es gibt / es gibt nicht.

- 有 / 沒有
- Besitz und Existenz funktional unterscheiden

**Trägt:** Einkaufen, Restaurant, Unterkunft, Probleme, Verkehr.

### D. Wollen, brauchen, können, dürfen
**Funktion:** Wünsche, Bedürfnisse und Möglichkeiten ausdrücken.

- 要 / 想
- 可以 / 能 als frühe funktionale Modalität
- höfliche Request-Muster

**Trägt:** praktisch alle Transaktionssituationen.

### E. Negation
**Funktion:** nein sagen, ablehnen, korrigieren, Nicht-Vorhandensein ausdrücken.

- 不
- 沒 / 沒有
- Unterschied funktional, nicht als abstrakte Grammatiktheorie

**Trägt:** Essen, Einkaufen, Hotel, Smalltalk, Reparatur.

### F. Fragen
**Funktion:** selbst Informationen beschaffen statt nur Phrasen reproduzieren.

Früher Kern:
- Ja/Nein-Frage
- was
- wo
- wer
- welcher
- wie viele / wie viel
- wie
- wann

„Warum“ kann später folgen, wenn es für Foundation 1 keinen hohen Ertrag hat.

**Trägt:** alle zehn Kompetenzfelder.

### G. Zahlen, Mengen und Zähleinheiten
**Funktion:** Preise, Zeiten, Tickets, Bestellungen, Zimmer, Stückzahlen.

- Zahlen
- Mengen
- zentrale Zähleinheiten/Classifier nur im Gebrauch
- Preise
- Telefonnummern / Zimmernummern / Gleise etc.

**Trägt:** Essen, Einkaufen, Verkehr, Unterkunft.

### H. Zeit
**Funktion:** heute/morgen, Uhrzeit, Abfahrt, Öffnungszeiten, Verabredungen.

- grundlegende Zeitwörter
- Uhrzeit
- Position von Zeitangaben im Satz
- einfache Zukunft über Kontext/Zeitangaben

**Trägt:** Verkehr, Unterkunft, Chat, Smalltalk.

### I. Ort, Richtung und Bewegung
**Funktion:** finden, hinfahren, aussteigen, sagen wo man ist.

- 在 + Ort
- 去 / 來
- grundlegende Richtungs-/Ortswörter
- „wo?“
- elementare Bewegungs- und Zielkonstruktionen

**Trägt:** Orientierung, Verkehr, Unterkunft, Chat.

### J. Satzbau als wiederverwendbares Muster
**Funktion:** neue Sätze aus bekannten Elementen selbst bilden.

Frühes mentales Modell:
- Thema/Subjekt
- Zeit
- Ort
- Handlung
- Objekt

Nicht als starre Formel, sondern als hilfreiches Grundgerüst.

**Trägt:** produktive Kompetenz in allen Bereichen.

---

## 12.2 Kommunikationswerkzeuge mit besonders hohem Reise-Nutzen

**SET als Priorität, Wortlaut noch DRAFT**

Diese Funktionen sollen außergewöhnlich früh verfügbar werden:

- begrüßen / danken / entschuldigen
- nicht verstehen
- um Wiederholung bitten
- um langsameres Sprechen bitten
- Bedeutung erfragen
- bestätigen / korrigieren
- zeigen: dieses / jenes
- „ja / nein / richtig / nicht richtig“
- um Hilfe bitten
- Gespräch höflich beginnen/beenden

Diese Reparaturstrategien sind kein Zusatzkapitel, sondern werden über den gesamten Foundation-Kurs immer wieder benutzt.

---

## 12.3 Lexikalische Kernfelder

Wortschatz wird nicht primär nach Themenlisten gelernt, sondern danach ausgewählt, wie viele Funktionen ein Wort erfüllt.

**Priorität A – hoher Cross-Context-Nutzen**
- Personen / Pronomen
- zentrale Tätigkeitsverben
- Fragewörter
- Zahlen und Mengen
- Zeit
- Ort und Richtung
- wollen / haben / sein / gehen / kommen / machen / geben / nehmen / sehen / verstehen
- ja / nein / nicht / auch / noch
- Höflichkeits- und Reparaturwörter

**Priorität B – konkrete Reisesituationen**
- Essen und Trinken
- Verkehr
- Geld / Bezahlen
- Unterkunft
- Einkaufen
- einfache persönliche Angaben
- elementare Probleme / Gesundheit
- digitale Kommunikation

**Prinzip**
Ein neues Substantiv ist weniger wertvoll als ein sprachlicher Operator, wenn der Operator zehn bereits bekannte Wörter neu kombinierbar macht.

---

## 12.4 Aussprachekern

**EVIDENCE + DRAFT zur konkreten Progression**

Von Anfang an integriert:

- Pinyin als Aussprache- und Eingabewerkzeug
- vier lexikalische Töne + neutraler Ton
- Tonwahrnehmung vor und parallel zur Produktion
- besonders schwierige Kontraste gezielt diskriminieren
- mehrere Sprecher verwenden
- wichtige Tonveränderungen dort einführen, wo sie real auftreten (z. B. 3.-Ton-Kontext, 不 / 一), nicht als isoliertes Theoriepaket
- problematische Initials/Finals gezielt trainieren

**Prinzip**
Aussprache wird an echten Wörtern/Sätzen gelernt; phonetische Mikroübungen werden nur dort eingeschoben, wo sie einen konkreten Kontrast klären.

---

## 12.5 Schrift- und Lesekern

### Erkennen > vollständige Handschriftproduktion
Der aktiv lesbare Zeichenvorrat darf größer sein als der aus dem Gedächtnis handschriftlich reproduzierbare Bestand.

### Handschrift
Ausgewählte wichtige Zeichen werden:
1. strukturell verstanden,
2. geführt geschrieben,
3. später ohne Vorlage abgerufen.

### Komponenten
Semantische/phonetische Komponenten werden erklärt, wenn sie für das konkrete Zeichen tatsächlich lernrelevant sind. Keine isolierte Radikalliste.

### Digitale Produktion
Pinyin-Eingabe und Auswahl des richtigen Zeichens gehören zur Foundation-Alltagskompetenz.

### Traditional / Simplified
Das gewählte Primärsystem bestimmt Erkennen und Handschreiben. Die zugrunde liegende Wort-/Bedeutungs-/Aussprachekompetenz bleibt systemunabhängig gespeichert.

---

## 12.6 Kumulatives Prinzip

**SET**

Jede neue Struktur vergrößert den kombinierbaren Sprachraum.

Beispielprinzip:
- zuerst PERSON + HANDLUNG
- danach NEGATION → alle bekannten Handlungen können negiert werden
- danach FRAGE → bekannte Aussagen werden erfragbar
- danach ZEIT → dieselben Aussagen werden zeitlich variierbar
- danach ORT → dieselben Handlungen können lokalisiert werden
- danach WOLLEN/KÖNNEN → Absichten und Möglichkeiten entstehen

Dadurch soll der Kurs nicht linear „Phrasen anhäufen“, sondern mit wenigen neuen Elementen immer mehr bereits Bekanntes neu kombinierbar machen.

---

## 12.7 Konsequenz für die spätere Curriculum-Reihenfolge

**HYPOTHESIS**

Die ersten Lektionen sollten bevorzugt Bausteine mit hohem Multiplikatoreffekt einführen:

1. Laut-/Tonsystem in echter Sprache + Kontakt/Höflichkeit
2. Personen + zentrale Verben + einfache Aussagen
3. Fragen + Reparaturstrategien
4. Zahlen/Mengen
5. Zeit
6. Ort/Bewegung
7. Wollen/Haben/Nicht-Haben
8. erste größere Anwendung in Reise-/Transaktionssituationen

Das ist noch **keine finale Lektionenfolge**. Die endgültige Reihenfolge wird nach Vergleich mehrerer seriöser Anfänger-Curricula und anhand von Lernbarkeit, Ton-/Zeichenprogression und kommunikativem Nutzen festgelegt.

---

## 12.8 Referenzabgleich

Die vorläufige Auswahl wird durch etablierte Anfängerangebote gestützt:

- MIT „Learning Chinese: A Foundation Course in Mandarin“ führt bereits in Unit 1 Aussprache, Zahlen, Verben, Zeit, Pronomen, Begrüßungen und Töne zusammen.
- Open University „Getting started with Chinese 1“ kombiniert von Beginn an Begrüßung, Pinyin/Töne, Pronomen und Zahlen.
- „Getting started with Chinese 2“ erweitert um Aktivitäten, Zeitangaben, was/wo-Fragen, Ortsangaben, Wortbildung und chinesische Texteingabe.

Diese Kurse dienen als Referenz, nicht als zu kopierende Curriculumvorlage.


---

# 13. Curriculum-Abgleich und Foundation-1-Progression v0.1

**Status: DRAFT — noch keine finale Lektionenfolge**

## 13.1 Referenzkurse

### Open University — Getting started with Chinese 1–3
Frühe Progression:
- Begrüßung / Verabschiedung / Dank
- Pinyin, Töne und Tonveränderungen von Beginn an
- Pronomen
- Zahlen 0–99
- Alltagsaktivitäten
- Zeitangaben
- was-/wo-Fragen und Ortsangaben
- chinesische Texteingabe und Wortbildung
- später Beschreibungen, topic-comment, Zustandsänderung, Vergleiche, Zeichenkomponenten

**Was wir übernehmen:**
- Aussprache und Töne sofort mit echter Sprache verbinden
- Zahlen früh
- Zeit und Ort früh
- digitale Texteingabe nicht unnötig spät behandeln
- Zeichenstruktur / Wortbildung in den Sprachkurs integrieren
- regelmäßige Konsolidierung

**Was wir ändern:**
- Kommunikationsreparatur deutlich früher
- stärkerer Fokus auf spontane produktive Aufgaben statt hauptsächlich Kursinhalte nacheinander abzuarbeiten
- Travel-Foundation-Ziele stärker priorisieren

Referenzen:
https://www.open.edu/openlearn/languages/getting-started-chinese-1
https://www.open.edu/openlearn/languages/getting-started-chinese-2
https://www.open.edu/openlearn/languages/getting-started-chinese-3

### MIT OpenCourseWare — Learning Chinese: A Foundation Course in Mandarin
Frühe Progression:
- Pinyin / Tonsystem
- Zahlen und Ordnung
- stative Verben
- Zeit
- Pronomen
- Handlungsverben
- Begrüßung
- Nomen / Modifikation
- Identität
- Ort und Existenz
- Dialog am Flughafen
- Mengen, Nationalität, Richtungen, ja/nein, Geld, Getränke
- später Zeitphrasen, Vorstellen, Busfahrt und Essen

MIT trennt in seinem Grundkonzept den Aufbau mündlicher Fertigkeiten (zunächst Pinyin) bewusst vom Schriftunterricht.

**Was wir übernehmen:**
- sehr frühe Kombination hoch wiederverwendbarer Strukturen
- Ort/Existenz, Zeit und Handlungsverben früh
- reale Dialogkontexte als Integration
- systematisches Tontraining über mehrere Einheiten hinweg

**Was wir ändern:**
- Schrift nicht als parallelen, weitgehend getrennten Kurs führen
- Hören/Sprechen klar priorisieren, aber Schrift ab Beginn sinnvoll mitverknüpfen
- stärker auf Reise-/Alltagsrelevanz kuratieren

Referenz:
https://ocw.mit.edu/courses/res-21g-003-learning-chinese-a-foundation-course-in-mandarin-spring-2011/pages/online-textbook/part-i-introduction-units-1-4-character-lessons-1-3/

### Stanford — Beginning Conversational Chinese (aktuelles Kursangebot 2026/27)
Der Beginn der conversational sequence priorisiert:
- korrekte Aussprache
- sich vorstellen
- einfache Transaktionen
- über sich, Freunde/Familie sprechen
- tägliche Aktivitäten

Spätere Beginner-Stufe:
- Shopping
- Transportation

Der Conversational Track arbeitet bewusst mit Pinyin und verlangt zunächst keine chinesischen Zeichen.

**Was wir übernehmen:**
- klare Priorität auf mündliche Alltagstauglichkeit
- Transaktionen und echte kommunikative Aufgaben
- Aussprache als Fundament

**Was wir ändern:**
- funktionales Lesen und Schrift von Beginn an integrieren
- Schreibkompetenz geringer gewichten als mündliche Kompetenz, aber nicht vollständig auf später verschieben

Referenz:
https://explorecourses.stanford.edu/m_search?filter-catalognumber-CHINLANG=on&filter-coursestatus-Active=on&page=0&q=CHINLANG

### Harvard — Elementary Modern Chinese (2026)
Aktueller Anfangskurs beschreibt als Kern:
- Listening, Speaking, Reading, Writing
- Pronunciation and tones
- fundamental syntax / usage patterns
- common everyday vocabulary
- character recognition and typing

**Was wir übernehmen:**
- integriertes Vier-Fertigkeiten-Fundament
- Zeichen erkennen + digitale Texteingabe
- Alltagssprache und Grundsyntax als Kern

**Was wir anders gewichten:**
- unser Kurs priorisiert Hören/Sprechen stärker
- Handschrift ist gezieltes Lerninstrument statt akademisch gleichgewichtete Fertigkeit

Referenz:
https://beta.my.harvard.edu/course/CHNSEBA/2026-Fall/001

---

## 13.2 Gemeinsame Muster der Referenzen

**Relativ stabil über die Kurse hinweg:**
1. Aussprache/Pinyin/Töne sehr früh
2. Begrüßung und persönliche Referenz früh
3. Pronomen und hochfrequente Verben früh
4. Zahlen früh
5. Zeit relativ früh
6. Ort/Bewegung relativ früh
7. Alltagstransaktionen auf diesen Bausteinen aufbauen
8. wiederholte Aussprachearbeit statt einmaligem Aussprachekapitel

**Kein einheitlicher Konsens:**
- wann und wie stark Schrift integriert wird
- ob mündliche und schriftliche Fertigkeiten zunächst getrennt werden
- genaue Themenreihenfolge
- Stellenwert der Handschrift

**Unsere begründete Entscheidung:**
Hören/Sprechen werden priorisiert, Schrift wird aber von Beginn an als unterstützendes, funktionales System integriert. Damit kombinieren wir den Vorteil eines oral-first Ansatzes mit früher orthographischer Verankerung.

---

# 14. Foundation-1-Progression v0.1 — Spiralmodell

**Status: HYPOTHESIS / DRAFT**

Keine Lektion ist eine abgeschlossene Themenbox. Jede Einheit führt wenige neue generative Bausteine ein und verwendet vorheriges Material erneut. Die Alltagssituationen kehren mehrfach in zunehmender Komplexität zurück.

Eine „Lektion“ ist ein Kompetenz-/Stoffpaket und kann aus mehreren kurzen Sessions bestehen.

## Modul 1 — Kontakt + Klangsystem
**Kommunikatives Ziel**
Ersten Kontakt herstellen: begrüßen, danken, Name/Herkunft minimal ausdrücken.

**Neue Systeme**
- Grundidee der vier Töne + neutraler Ton
- Pinyin als Klangnotation
- erste Pronomen
- sehr einfache Aussage-/Identitätsmuster
- minimale Höflichkeit

**Schrift**
- erste wenige hochfrequente Zeichen
- Traditional/Simplified gemäß gewähltem Modus
- erstes Prinzip: Zeichen sind strukturiert, nicht bloße Bilder

**Wichtig**
Schon hier Hören → Sprechen → Erkennen → Schreiben → kleiner Satz.

## Modul 2 — Verstehen sichern + Fragen
**Kommunikatives Ziel**
Ein Gespräch nicht abbrechen müssen, wenn etwas unklar ist.

**Neue Systeme**
- „ich verstehe / verstehe nicht“
- Wiederholung / langsamer
- Ja/Nein-Frage
- erste Fragewörter
- Negation
- bestätigen / korrigieren

**Multiplikatoreffekt**
Bekannte Aussagen können jetzt negiert, bestätigt und erfragt werden.

## Modul 3 — Zahlen, Dinge, Mengen
**Kommunikatives Ziel**
Mengen und Preise verstehen, auf Dinge zeigen und etwas verlangen.

**Neue Systeme**
- Zahlen
- dies/das
- haben / nicht haben
- erste Zähleinheit(en) im Gebrauch
- wie viel / wie viele
- einfache Mengen

**Anwendung**
Mini-Einkauf, Bestellung, Zimmer-/Telefonnummern.

## Modul 4 — Zeit + Alltagshandlungen
**Kommunikatives Ziel**
Sagen und verstehen, wann etwas passiert.

**Neue Systeme**
- heute / morgen / Wochentage bzw. relevante Zeitwörter
- Uhrzeit
- Position der Zeitangabe
- zentrale Handlungsverben
- einfache Pläne

**Multiplikatoreffekt**
Bekannte Handlungen können zeitlich variiert werden.

## Modul 5 — Ort + Bewegung
**Kommunikatives Ziel**
Fragen, wo etwas ist und wohin man muss.

**Neue Systeme**
- wo
- sich befinden / an einem Ort sein
- gehen / kommen
- Ziel
- elementare Richtungs- und Ortswörter

**Anwendung**
Bahnhof, Toilette, Hotel, Restaurant, Treffpunkt.

## Modul 6 — Essen und Trinken
**Kommunikatives Ziel**
Eine einfache Bestellung selbstständig bewältigen.

**Neue Systeme**
- wollen / möchten
- mögen / nicht mögen (nur soweit sprachlich sinnvoll)
- Mengen in Bestellsituationen
- einfache Wahl-/Alternativstrukturen
- funktionales Lesen einer kleinen Speisekarte

**Recycling**
Zahlen, Fragen, Negation, Dinge, Höflichkeit.

## Modul 7 — Einkaufen + Bezahlen
**Kommunikatives Ziel**
Etwas finden, auswählen, Preis klären und bezahlen.

**Neue Systeme**
- welcher / Auswahl
- mehr / weniger bzw. relevante Größen-/Mengenunterschiede
- Geld / Bezahlen
- einfache Vergleichs- oder Auswahlfunktion nur soweit für die Aufgabe nötig

**Recycling**
Zahlen, Mengen, haben/nicht haben, dies/das, Fragen.

## Modul 8 — Verkehr
**Kommunikatives Ziel**
Eine einfache Fahrt mit Bahn/Bus/Taxi organisieren.

**Neue Systeme**
- Ticket / Station / Ziel
- Abfahrt/Ankunft
- ein-/aussteigen bzw. funktional notwendige Bewegungsverben
- Zeit + Ort + Ziel kombinieren

**Recycling**
Zahlen, Uhrzeit, Richtung, Fragen, Kommunikationsreparatur.

## Modul 9 — Unterkunft
**Kommunikatives Ziel**
Einchecken und ein einfaches Problem lösen.

**Neue Systeme**
- Reservierung / Name
- Zimmer / zentrale Hotelbegriffe
- brauchen / können
- etwas fehlt / funktioniert nicht
- Bitte um Hilfe

**Recycling**
Existenz, Ort, Zahlen, Zeit, Fragen, Negation.

## Modul 10 — Probleme + Gesundheit
**Kommunikatives Ziel**
Ein elementares Problem verständlich machen und Hilfe bekommen.

**Neue Systeme**
- verloren / kaputt / falsch
- einfache Beschwerden / Schmerz
- Hilfe / Arzt / Apotheke als funktionale Kernbegriffe
- Dringlichkeit auf elementarem Niveau

**Recycling**
Körper-/Ortssprache nur soweit benötigt; brauchen/können, Negation, Fragen.

## Modul 11 — Sozialer Kontakt
**Kommunikatives Ziel**
Über reine Transaktionen hinaus ein sehr einfaches Gespräch führen.

**Neue Systeme**
- Beruf / Familie / Interessen
- mögen / Vorlieben
- wenige produktive Beschreibungen
- Gegenfragen
- kurze Gesprächsketten statt Einzelaussagen

**Recycling**
Pronomen, Zeit, Aktivitäten, Fragen, Negation.

## Modul 12 — Integrierter „Travel Day“
**Kommunikatives Ziel**
Mehrere typische Situationen nacheinander mit wechselnden Abrufanforderungen bewältigen.

Beispielstruktur:
Ankunft → Verkehr → Unterkunft → kurze Nachricht → Essen → Einkauf → Weg zurück.

**Kein großer neuer Grammatikblock.**
Schwerpunkt:
- Transfer
- flüssigerer Abruf
- Hören verschiedener Sprecher
- unerwartete, aber lösbare Varianten
- Kommunikationsreparatur
- funktionales Lesen
- digitale Texteingabe

Dies ist kein „Endgegner“ und keine Gamification, sondern ein realistischer Kompetenzcheck.

---

# 15. Querschichten über alle Module

## Aussprache
Jedes Modul enthält:
- Wahrnehmung
- eigene Produktion
- bereits bekannte schwierige Kontraste
- zunehmend natürliche kurze Äußerungen

Aussprache ist kein abgeschlossenes Einstiegsmodul.

## Schrift
Jedes Modul enthält:
- Zeichenerkennung
- ausgewählte aktive Handschrift
- Komponenten nur dort, wo sie helfen
- Wiederabruf älterer Zeichen
- Traditional oder Simplified gemäß Nutzerwahl

Der passive Leseumfang darf schneller wachsen als der aktive Handschriftbestand.

## Digitale Texteingabe
Nicht bis Modul 12 warten:
- sobald genügend Pinyin/Zeichen bekannt sind, kurze Eingabeübungen
- später kurze echte Chat-Aufgaben
- Modul 12 integriert dies nur stärker

## Kommunikationsreparatur
Ab Modul 2 dauerhaft aktiv:
- nicht verstehen
- wiederholen
- langsamer
- bestätigen
- zeigen / nachfragen
- alternative Formulierung

## Humor / Leichtigkeit
**Tone-of-Voice-Prinzip, kein Lernmechanismus.**
- gelegentlich unerwartete Beispielsätze
- sprachlich echte kleine Überraschungen / Homophone / Tonkontraste, wenn passend
- leichte, trockene Mikrotexte
- niemals Lernziel oder Klarheit einem Gag opfern

---

# 16. Warum diese Progression und nicht ein Themen-Lehrbuch?

**Designhypothese**

Die Reihenfolge folgt primär dem Multiplikatoreffekt sprachlicher Systeme:

Aussage
→ Negation / Frage
→ Zahl / Menge
→ Zeit
→ Ort / Bewegung
→ Wunsch / Transaktion
→ kombinierte Alltagsaufgaben

Thematische Situationen werden daran angehängt und kehren wieder.

Dadurch soll jedes neue Element möglichst viel älteres Material neu nutzbar machen. Das reduziert Phrasebook-Lernen und erhöht Transfer.

**Noch zu prüfen**
- konkrete Reihenfolge einzelner Fragewörter
- wann 是, 有, 在, 要, 想, 可以/能 jeweils optimal eingeführt werden
- genaue Ton-/Lautprogression
- welche Zeichen als aktive Schreibziele gewählt werden
- Umfang pro Modul
- ob 12 Module tatsächlich die richtige Granularität sind

Diese Punkte werden erst beim Entwurf von Lektion 1–3 konkretisiert und empirisch im Selbsttest überprüft.


---

# 17. Lesson 1 – konzeptioneller Stand v0.1

**Status: HYPOTHESIS / DRAFT**

Nach Abgleich mit Open University, MIT OpenCourseWare, Stanford und taiwanischen Anfängerressourcen wird Lesson 1 als **„Erster Kontakt + Klangsystem“** konzipiert.

## Primäre Can-dos
Nach der Einheit soll ein absoluter Anfänger:
- jemanden mit 你好 begrüßen können,
- die Frage nach dem Namen verstehen,
- mit 我叫 + eigenem Namen antworten können,
- 謝謝/谢谢 verstehen und verwenden,
- 再見/再见 verstehen und verwenden,
- verstanden haben, dass Tonhöhe lexikalische Bedeutung unterscheidet,
- erste Zeichen erkennen und wenige davon aktiv schreiben.

## Kernmaterial

**Aktiv mündlich**
- 你好 nǐ hǎo
- 我 wǒ
- 你 nǐ
- 叫 jiào
- 什麼/什么 shénme
- 名字 míngzi
- 謝謝/谢谢 xièxie
- 再見/再见 zàijiàn

**Satzmuster**
- 我叫 + Name。
- 你叫什麼名字？ / 你叫什么名字？

**Aktive Handschrift in V0.1**
- 你
- 好
- 我

**Erkennen, noch nicht zwingend aus dem Gedächtnis schreiben**
- 叫
- 什麼/什么
- 名字
- 謝謝/谢谢
- 再見/再见

## Ton-Einstieg
Die vier lexikalischen Töne werden nicht als langes Theoriepaket eingeführt, sondern zunächst über ein kurzes Bedeutungs-Experiment:

- mā 媽/妈 — Mutter
- má 麻 — Hanf
- mǎ 馬/马 — Pferd
- mà 罵/骂 — schimpfen

Diese Wörter müssen in Lesson 1 **nicht** gelernt werden. Sie demonstrieren ausschließlich, dass Ton Bedeutungen verändert.

Bei Ton 3 soll die App nicht den Eindruck erwecken, jeder dritte Ton müsse in natürlicher Rede vollständig fallen und wieder steigen. Der volle Verlauf ist besonders in Isolation / am Phrasenende relevant; in verbundener Sprache ist Ton 3 häufig tief/verkürzt. Vor einem weiteren Ton 3 wird der erste Ton 3 als steigender Ton realisiert. Deshalb wird 你好 mit natürlichem Audio gelernt und die Diskrepanz zwischen zugrunde liegenden Tonmarken und tatsächlicher Aussprache knapp erklärt.

## Optionale Entdecken-Ebene
- 馬/马: ursprünglich bildhafte Schreibung; historische Formen stellen ein Pferd dar.
- 好: Struktur 女 + 子; eine mögliche Merkhilfe darf angeboten werden, aber nicht als gesicherte Etymologie ausgegeben werden.
- Optionaler kultureller Fund, nicht prüfungsrelevant: 千里之行，始於足下 („Eine Reise von tausend Meilen beginnt unter den Füßen / mit dem ersten Schritt.“), überliefert im Laozi 64.

## Didaktischer Kern
Lesson 1 soll bereits den vollständigen Lernkreislauf demonstrieren:
**hören → unterscheiden → verstehen → sprechen → Zeichen erkennen → schreiben → in einer Mini-Interaktion verwenden → später ohne Hilfe abrufen.**

Ausführlicher Flow und Quellen stehen in `LESSON_01_v0.1.md`.

---

# 18. Technische Richtung — Web/PWA-first

**Status: SET für V0.1**

Die erste produktive Version wird **nicht nativ für iOS**, sondern als responsive Progressive Web App gebaut.

## Ziel
Ein Codebestand für:
- iPad
- iPhone
- Android Phone
- Android Tablet
- Desktop/Laptop

## Kerntechnologien für V0.1
- responsive Web-UI
- Pointer Events / Canvas für Stift- und Fingereingabe
- Web Audio / AudioWorklet für lokale Audioanalyse
- IndexedDB für lokalen Lernstand
- Service Worker für Offline-Funktion
- statische Auslieferung ohne Nutzerkonto/Backend-Zwang

## Geräteprinzip
- Tablet: Stift/Finger als bevorzugte Schreibform
- Smartphone: Finger als vollständige Eingabe
- Desktop: Papiermodus als gleichwertige Alternative; Maus-/Trackpad-Schreiben optional

## Privacy
- kein Account
- kein Tracking
- keine Werbe-SDKs
- Lernstand lokal
- Audio lokal
- Kernlektion nach erstem Laden vollständig offline

## Technischer Proof-of-Concept
Lesson 1 ist zugleich der Architekturtest. V0.1 gilt als erfolgreich, wenn dieselbe veröffentlichte Web-App:
1. auf iPad/Tablet/Phone/Desktop sinnvoll nutzbar ist,
2. Audio offline abspielen kann,
3. Mikrofon lokal aufnehmen und analysieren kann,
4. Handschrift per Touch/Stift erfassen kann,
5. Lernstand lokal speichert,
6. nach Reload/erneutem Öffnen eine adaptive Wiederholung erzeugt,
7. im Offline-Modus vollständig funktioniert.

Native Apps bleiben später möglich, sind aber für Foundation 1 nicht Voraussetzung.

---

# 19. Fortschritt sichern ohne Account

**Status: DRAFT / Architekturentscheidung offen**

Die App speichert den vollständigen adaptiven Lernstand weiterhin lokal.

Ein kurzer menschlich merkbarer Code wie `A17` kann nur einen **groben Curriculum-Checkpoint** repräsentieren, z. B. welche Inhalte bereits eingeführt wurden. Er kann nicht den vollständigen skill-spezifischen Zustand aller Wörter und Zeichen abbilden, solange kein Server den Code einer gespeicherten Datenstruktur zuordnet.

Daher werden zwei Ebenen vorgesehen:

1. **Checkpoint-Code** — kurz, anonym, verständlich nur für die Engine; dient zur groben Wiederaufnahme auf einem neuen Gerät.
2. **Full Backup** — vollständiger lokaler Lernstand als exportierbare Datei und/oder QR-Code; enthält auch Hören/Sprechen/Lesen/Schreiben, Review-Zeitpunkte und Unsicherheiten.

**Privacy-Prinzip:** Kein Backend nur für Sync einführen, solange es nicht wirklich nötig ist.

---

# 20. Handschrift: Digital und analog gleichberechtigt

**Status: SET**

Touch-/Stifteingabe ist kein Zwang. Jede relevante Schreibübung bietet zwei gleichwertige Modi:

- **On-screen writing:** Finger oder Stift auf Smartphone/Tablet.
- **Paper writing:** auf Papier schreiben; anschließend selbst kontrollieren.

Papier ist kein Fallback, sondern ein First-Class-Lernmodus.

## Print-/Worksheet-System

Arbeitsblätter werden nicht manuell pro Lektion gestaltet, sondern aus denselben strukturierten Lerninhalten generiert wie die Web-App.

Ein druckbares A4-Arbeitsblatt kann enthalten:
- Zeichen groß mit Bedeutung/Pinyin
- Strichreihenfolge
- Nachfahrfelder
- Rasterfelder für freies Schreiben
- Abrufaufgaben ohne Vorlage
- kurze Satz-/Wortprompts
- optional QR/Link zur zugehörigen Audioübung

Die Druckansicht soll über ein einheitliches Worksheet-Template automatisch aus den Lesson-/Character-Daten erzeugt werden.

## Kontrolle

**V0.1:** Selbstkontrolle nach Aufdecken von Vorlage/Strichfolge; keine Fotoanalyse nötig.

**Later / Hypothesis:** Foto eines Arbeitsblatts hochladen und Handschrift analysieren. Dies wäre ein eigenes technisches Modul und ist nicht Voraussetzung für Foundation 1.

---

# 21. Adaptive Learning Engine

**Status: BUILD SPEC v0.1**

The curriculum remains controlled, but pace and practice are individualized.

Core rules:
- progress tracked separately for meaning, listening, speaking, reading, writing and usage;
- delayed independent retrieval counts more than immediate/copied success;
- one error does not reset mastery or block the course;
- weak skill relations are targeted specifically rather than re-teaching the whole item;
- sessions combine due review, current/new content and fluency/transfer;
- scaffolding decreases as stability increases;
- some new content remains available even during consolidation;
- lesson replay is dynamic rather than identical;
- no LLM is required for scheduling.

Detailed specification: `docs/ADAPTIVE_ENGINE_v0.1.md`.

Lessons 2–3 have been sketched only to verify cumulative connectivity; they are not final content.

---

# 22. Content QA & Source Policy

**Status: SET**

The project uses a fixed QA pipeline:

`draft → source_checked → language_reviewed → audio_reviewed → published`

Core distinctions:
- language fact
- usage/pragmatics
- historical/etymological claim
- mnemonic/teaching device

Mnemonics are never presented as etymology. Public learner-facing Mandarin should receive native/qualified-teacher review, especially for naturalness, pragmatics and final instructional audio.

Automated schema/build checks enforce consistency; humans review what automation cannot reliably judge.

Detailed policy: `docs/CONTENT_QA_SOURCE_POLICY_v0.1.md`.

---

# 23. Individualisierung ohne „Lerntypen“

**Status: SET**

Die App verwendet keine Typologien wie „visueller / auditiver / kinästhetischer Lerner“ als Grundlage für Unterrichtsentscheidungen. Für einen Matching-Vorteil solcher Learning-Styles-Modelle gibt es keine belastbare Evidenz.

Individualisierung erfolgt stattdessen auf drei Ebenen:

1. **Beobachtete Lernleistung**  
   Die Engine adaptiert getrennt nach Bedeutung, Hören, Sprechen, Lesen, Schreiben und Gebrauch.

2. **Vorwissen / benötigtes Scaffolding**  
   Hilfen werden abhängig vom tatsächlichen Kompetenzstand angeboten und zurückgenommen. Unterstützung, die für Anfänger nützlich ist, wird nicht dauerhaft beibehalten.

3. **Freiwillige Präferenzen und Interessen**  
   Beispiele: Traditional/Simplified, Papier/Touch, thematische Interessen, gewünschte zusätzliche Aussprachepraxis. Präferenzen werden als Präferenzen behandelt, nicht als wissenschaftlich diagnostizierte Lerntypen.

**Leitregel:** Nicht den Menschen typisieren; das konkrete Lernen beobachten und darauf reagieren.

---

# 24. Pre-Build Audit

**Status: PASSED for V0.1 prototype**

No conceptual blocker remains.

The largest unresolved questions are empirical:
- quality/reliability of browser-based pitch extraction and tone feedback;
- writing input behavior across real mobile devices;
- persistence/offline behavior in real browsers;
- appropriate Lesson-1 load and adaptive parameters.

Important scope decisions:
- no sophisticated SRS yet;
- no full handwriting recognition;
- no general speech recognition;
- no complex checkpoint-code system yet;
- no large generic plugin framework;
- final audio/native review are public-release requirements, not prototype blockers.

Detailed audit: `docs/PRE_BUILD_AUDIT_v0.1.md`.

**Decision:** Further pre-build theory is lower value than real-device testing. Build/test Lesson 1 before expanding content.

---

# 25. UI / Design Direction

**Status: DESIGN SPEC v0.1**

Visual direction:
**high-quality modern digital product with editorial/book character.**

Core qualities:
- functional
- minimal but not minimal for its own sake
- friendly
- click-light
- self-explanatory
- calm
- warm
- typographically strong

Chinese itself is treated as a primary visual element. No pseudo-Asian decoration and no gamified visual language.

Paper mode is a first-class design surface. Worksheets are grouped writing sessions (e.g. Lessons 1–3), generated from the same content model, and reproduce the same progression from scaffolded writing to recall.

Detailed wireframes and principles: `docs/UI_DESIGN_DIRECTION_v0.1.md`.

---

# 26. User Error Reports — bewusst später

**Status: LATER / nicht V0.1**

Eine öffentliche Funktion „Fehler melden“ ist sinnvoll, wird aber für V0.1 bewusst nicht gebaut.

Grund:
- würde erstmals einen Server-/Report-Endpunkt erfordern;
- erhöht Infrastruktur und Datenschutzkomplexität;
- löst vor dem öffentlichen Launch kein dringendes Problem.

V0.1-Qualitätssicherung erfolgt stattdessen vor Veröffentlichung:
`source_checked → language_reviewed → audio_reviewed → published`

Die Content-Architektur behält stabile `itemId` und `contentVersion`, sodass später anonyme Fehlermeldungen eindeutig einem Inhalt zugeordnet werden können.

Spätere Meldungen dürfen Inhalte niemals automatisch verändern. Sie erzeugen lediglich einen Review-Vorgang; Korrekturen werden erst nach fachlicher Prüfung veröffentlicht.

---

# 27. Bildsprache — offene Designentscheidung

**Status: HYPOTHESIS / im UI-Prototyp A/B testen**

Bilder und Illustrationen werden nicht als permanente dekorative Schicht vorausgesetzt.

Drei legitime Rollen:

1. **Funktionales Lernmaterial** — Bild trägt direkt zum Verstehen/Lernen bei.
2. **Redaktioneller/kultureller Kontext** — z. B. Gedicht, Sprachgeschichte, Ort, kulturelle Entdeckung.
3. **Atmosphäre** — zulässig, aber sparsam und nur wenn sie dem Produkt tatsächlich Wärme/Weltbezug gibt.

Vorläufige Leitregel:
**Bilder sollen etwas lehren oder erzählen. Reine Dekoration bleibt die Ausnahme.**

Illustrationen werden gezielt eingesetzt, z. B. für Zeichenherkunft, Mnemoniken oder visuell erklärbare Sprachphänomene. Keine verpflichtende Illustrationswelt.

Im ersten echten UI-Prototyp wird der Home-Screen in zwei Varianten getestet:
- A: rein typografisch / ohne Foto
- B: identischer Aufbau mit einem hochwertigen redaktionellen Foto

Bewertet werden Ruhe, Eigenständigkeit, Wärme, Fokus und wahrgenommene Produktqualität.
---

# 28. Ready-to-Build Consolidation

**Status: COMPLETE**

The project is now consolidated for the first real-device build.

New authoritative build documents:
- `docs/DESIGN_SYSTEM_v0.1.md`
- `docs/LESSON_01_PRODUCTION_MAP_v0.2.md`
- `docs/CORE_LANGUAGE_BOUNDARY_AUDIT_v0.1.md`
- `docs/NEXT_STEPS.md`

Key refinements:
- Home will be A/B tested typographic vs editorial-photo variant.
- Core uses generic orthography variants; Mandarin maps `hant`/`hans`.
- Core extracts generic acoustic/pitch evidence; Mandarin interprets tone/sandhi.
- Lesson 1 freezes only 好 as active recall-writing target; 我/你 begin guided.
- Final package/build versions must be resolved on the Mac with a real install and lockfile.
- No further curriculum expansion before Lesson 1 passes real-device/offline/adaptive tests.

**Decision:** stop adding conceptual scope; proceed to repository setup and implementation.

---

# 29. Competitive / Technical Benchmark — Konsequenzen

**Status: SET für V0.1, sofern Realtest keine Gegenargumente liefert**

Die Tiefenrecherche bestehender Mandarin-Produkte und Open-Source-Technik führt zu folgenden konkreten Änderungen:

## Sofort übernehmen / evaluieren

1. **Hanzi Writer statt eigener Stricherkennung in V0.1**
   - Mandarin-Adapter hinter generischem Writing-Interface.
   - Stroke-Order, Quiz, Mistake-/Correct-/Complete-Callbacks nutzen.
   - benötigte Zeichendaten lokal bündeln; kein Runtime-CDN-Zwang.
   - Lizenzhinweise für Library und Character Data im Source Register.

2. **Storage härten**
   - IndexedDB/Dexie als Primärspeicher.
   - `navigator.storage.persist()` anfragen, wo sinnvoll.
   - Export/Import des vollständigen Lernstands als Datei.
   - Backup wichtiger als früher kurzer Checkpoint-Code.

3. **Tone Training als Progression**
   - isolierter Ton
   - gezielte Kontrastpaare
   - zweisilbige Kombinationen
   - natürliche Phrase
   - eigene Produktion / Feedback
   Nicht alle Stufen in Lesson 1.

4. **Progressive Help**
   - Pinyin, Übersetzung, Erklärung verfügbar, aber nicht permanent.
   - Nutzung von Hilfen wird als Lernsignal gespeichert.

5. **Easy-item fast track**
   - wiederholt sicherer verzögerter Abruf vergrößert Review-Abstände schnell.
   - sichere Items sollen aus dem Weg gehen.

6. **FSRS später nur als Scheduling Layer prüfen**
   - möglicher Scheduler pro `(itemId, skillDimension)`.
   - Lesson Engine bleibt für Curriculum, Scaffolding, Transfer und Session-Komposition zuständig.
   - V0.1 behält einfache transparente Stability-Bands.

7. **Curriculum authored, Technik unterstützt**
   - Kerncurriculum bleibt kontrolliert/QA-geprüft.
   - KI darf später Feedback, constrained variation und Rollenspiel unterstützen, aber nicht autonom den Foundation-Lehrplan erzeugen.

## Methodische Referenzen

- HelloChinese / ChineseSkill: integrierter Komplettkurs als Machbarkeitsbeleg; Gamification nicht übernehmen.
- SuperChinese: reale Szenarien als Anwendung, Speaking ab Beginn, human-authored curriculum.
- Dong Chinese: Kontextauswahl, Tone-Trainer, Zeichenherkunft.
- Skritter: Stroke-Feedback und pragmatische SRS-Heuristiken.
- Zishu: Offline/No-account/No-tracking + Handschrift als realer Produktbeleg.
- Du Chinese: progressive Hilfen, Kontext beim Review, Teilwissen.
- Hack Chinese / Outlier: funktionale Zeichenkomponenten; proprietäre Inhalte nicht übernehmen.
- Manda: local-first Browser-Architektur.
- Princeton 中文-Learn: React/Vite/PWA/GitHub-Actions/Hanzi-Writer als technische Referenz.
- Jiyi: lokale Aussprache-/Handschriftbewertung als Machbarkeitshinweis, nicht als wissenschaftliche Validierung.

Detailed benchmark: `docs/COMPETITOR_BENCHMARK_v0.1.md`.

## Produktposition nach Benchmark

Der USP ist **kein einzelnes Feature**. Er ist die konsequente Integration:

- evidenzbasiertes, kontrolliertes Foundation-Curriculum;
- skill-spezifische Adaptation;
- Hören/Sprechen priorisiert, Literacy integriert;
- digitale Handschrift und Papier als gleichwertige Lernwege;
- seriöse Zeichenstruktur/Etymologie und frühe Kultur/Literatur als optionale Tiefe;
- ruhiges, hochwertiges, nichtgamifiziertes Editorial-UI;
- local-first PWA ohne Account;
- transparente statt pseudo-präziser Aussprachebewertung;
- sprachagnostischer Core für spätere weitere Sprachen.

**Kurzform:** Die stärksten Mechaniken spezialisierter Mandarin-Tools werden in einen einzigen ruhigen, wissenschaftlich fundierten Lernweg integriert, ohne Gamification, Account-Zwang und Feature-Bloat.

---

# 30. V0.1 Build Plan — FROZEN

**Status: READY FOR MAC BUILD**

The benchmark findings have been integrated into the final V0.1 build plan.

Most important implementation changes:
- evaluate Hanzi Writer before custom stroke recognition;
- IndexedDB/Dexie + persistent-storage request + export/import;
- progressive Pinyin/help;
- easy-item fast track;
- tone-training progression from isolated contrasts toward phrases/production;
- FSRS only as a possible later scheduling layer;
- no additional curriculum scope before Lesson 1 passes real-device tests.

Authoritative implementation document:
`docs/V0_1_FINAL_BUILD_PLAN.md`

**Next action:** continue at the Mac with GitHub clone, real dependency install/build, deployment, and real-device testing.

---

# 31. Freude am Lernen ohne Gamification

**Status: SET — Experience Principle**

Spaß und Freude sind bewusste Produktziele. Sie werden nicht primär über externe Belohnungsmechaniken erzeugt, sondern aus dem Lernen selbst.

## Quellen von Freude

1. **Echtes Können**
   Regelmäßige Momente, in denen Lernende merken: „Das habe ich gerade wirklich verstanden / gesagt / gelesen / geschrieben.“

2. **Humor und Überraschung**
   Gelegentlich trockene, niedliche, absurde oder unerwartete Beispiele mit ohnehin relevantem Lernmaterial.

3. **Entdeckungen**
   Zeichenherkunft, Sprachbesonderheiten, Homophone, Chengyu, Sprichwörter, Gedichte und kulturelle Zusammenhänge als optionale Neugier-Momente.

4. **Variation**
   Wiederholungen variieren Sprecher, Kontext, Abrufrichtung und Kombinationen, ohne das kontrollierte Curriculum aufzugeben.

5. **Persönliche Relevanz**
   Freiwillige Interessen können später Beispielkontexte beeinflussen. Das Curriculum selbst bleibt stabil.

6. **Craft / angenehme Interaktion**
   Schreiben, Typografie, Tonkurven, Audio, Papier und Bewegung sollen sich hochwertig und befriedigend anfühlen.

7. **Kleine echte Herausforderungen**
   Gelegentliche integrierte Aufgaben ohne Punkte, z. B. ein kurzer Dialog ohne Pinyin oder eine kleine Reisesituation mit bereits bekanntem Material.

## Leitregel

**Playfulness, not gamification.**

Lernen soll Freude machen, weil Sprache interessant ist, Neugier belohnt wird und zunehmendes Können befriedigend ist — nicht weil ein Metagame aus XP, Coins, Streaks oder künstlichen Belohnungen darübergelegt wird.

Humor und Playfulness dürfen nie Klarheit, Natürlichkeit oder Lernziel verschlechtern.

---

# 32. Lernrhythmus und Session-Ende

**Status: SET — Experience + Learning Principle**

Die App darf aktiv Empfehlungen geben, **wann weiteres Lernen sinnvoll ist und wann für den Moment genug gelernt wurde**. Ziel ist Lernwirksamkeit, nicht maximale Nutzungszeit.

## Grundprinzip

**Lieber regelmäßig und verteilt als selten und sehr lang.**

Die App behauptet keine universelle optimale Dauer wie „15 Minuten täglich“. Konkrete Empfehlungen entstehen aus dem individuellen Lernzustand, der Menge neuen Materials und fälligen verzögerten Abrufen.

## Session-Ende

Wenn eine sinnvolle Lernschleife abgeschlossen ist, darf die App ausdrücklich sagen:

> **Für heute reicht's.**

Dazu knapp:
- was bereits gut sitzt;
- was noch unsicher ist;
- wann ein nächster kurzer Abruf sinnvoll wäre.

Beispiel:

> **Gut für heute.**  
> 你好 und deine Namensvorstellung sitzen schon ziemlich gut.  
> Bei 好 braucht das Schreiben noch einen weiteren Abruf.  
> **Empfehlung: morgen etwa 5 Minuten.**

`Weiterlernen` bleibt möglich, aber sekundär.

## Adaptive Empfehlungen

Mögliche Hinweise:
- „Morgen 5 Minuten wären sinnvoll — drei neue Dinge sind dann zum ersten verzögerten Abruf bereit.“
- „Du hast gerade viel Neues aufgenommen. Etwas Abstand ist jetzt wahrscheinlich sinnvoller als noch mehr neuer Stoff.“
- „Nach der Pause reicht heute zunächst ein kurzer Review.“

Empfehlungen sollen nach Möglichkeit einen **lernbezogenen Grund** nennen, statt nur Verhalten vorzugeben.

## Nach Pausen

Keine Streak-Strafe, kein Verlust-Framing.

Nicht:
`Deine Serie ist verloren.`

Sondern:
`Willkommen zurück. Wir schauen kurz, was noch sitzt.`

Die Engine passt Review und Scaffolding an die tatsächliche Erinnerung an.

## Produktregel

Die App darf gelegentlich ausdrücklich zum Aufhören raten.

**Wir optimieren nicht darauf, dass der Nutzer möglichst lange in der App bleibt, sondern darauf, dass möglichst viel Sprache dauerhaft bei ihm bleibt.**

---

# 33. Build while learning

**Status: SET — Development Principle**

Der erste Mandarin-Kurs wächst zunächst knapp vor dem realen Lernfortschritt seines ersten Testnutzers.

Entwicklungsschleife:

`bauen → real lernen → Abstand → verzögert abrufen → beobachten → verbessern → nächsten Stoff bauen`

Ziel:
- Curriculum nicht monatelang theoretisch vorausproduzieren;
- kumulativen Aufbau an tatsächlich erzeugtem Vorwissen testen;
- technische und didaktische Probleme früh erkennen;
- Content erst skalieren, wenn die zugrunde liegende Lernmechanik trägt.

Der erste Lernverlauf ist ein longitudinaler Produkttest, **keine wissenschaftliche Wirksamkeitsevidenz**. Später müssen weitere Anfänger mit unterschiedlichen Voraussetzungen testen. Die Engine darf nicht ausschließlich auf den ersten Testnutzer optimiert werden.

---

# 34. Progressive Chinese Interface / UI as Input

**Status: SET als Prinzip, konkrete Schwellen HYPOTHESIS**

Die Benutzeroberfläche wird schrittweise selbst Teil des Sprachinputs.

Sobald ein UI-Begriff oder eine kurze Anweisung aus bereits ausreichend gelerntem Material besteht, kann die App die bekannte deutsche/englische Bezeichnung zunehmend durch Chinesisch ersetzen.

Beispiele später:
- Zahlen / Mengen
- zurück / weiter
- noch einmal
- hören
- sprechen
- schreiben
- richtig / noch einmal versuchen
- heute / morgen
- kurze Session-Hinweise

## Regeln

1. **Kompetenzbasiert, nicht lektionenbasiert.**
   Ein UI-Element wird erst chinesischer, wenn die dafür nötigen Wörter/Strukturen im relevanten Verständnis ausreichend stabil sind.

2. **Rezeption vor kritischer Bedienung.**
   Die App darf bekannte chinesische Begriffe früh zeigen, aber essentielle Navigation darf nicht unverständlich werden.

3. **Progressive Fading.**
   Beispiel:
   `再聽一次 · noch einmal hören`
   → später `再聽一次`
   → bei Bedarf Tap/Help für Übersetzung.

4. **UI-Sprache ist echter Wiederholungsraum.**
   Wiederkehrende Bedienbegriffe erzeugen natürliche, verteilte Exposition ohne zusätzliche Drill-Aufgabe.

5. **Keine künstliche Chinesifizierung.**
   Nur natürlich formulierbare, lernrelevante UI-Texte werden umgestellt. Technische/seltene Begriffe dürfen lange in der Basissprache bleiben.

6. **Adaptiv und reversibel.**
   Wenn Verständnis unsicher ist, kann die Übersetzung wieder erscheinen. Nutzer kann Hilfe jederzeit aufdecken.

7. **Nicht als Testfalle.**
   Der Nutzer soll nicht an der App-Bedienung scheitern, nur weil ein UI-Wort vergessen wurde.

## Architektur

UI-Texte benötigen daher semantische IDs statt fest eingebauter deutscher Strings, z. B.:

`action.listen_again`
`action.continue`
`action.write`
`feedback.correct`

Das Mandarin Language Pack kann dafür chinesische Lernvarianten und Voraussetzungen definieren.

Die Engine entscheidet anhand des Lernstands, welche Darstellungsstufe verwendet wird:
- Basissprache
- Chinesisch + Basissprache
- Chinesisch allein
- Chinesisch allein + Hilfe auf Abruf

**Ziel:** Mit wachsender Kompetenz wird nicht nur der Kurs chinesischer, sondern unaufdringlich auch die Lernumgebung selbst.
