#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Render the documentation-only authoring corpus. No app or audio imports."""
from pathlib import Path
import json
OUT=Path(__file__).resolve().parent
b=json.loads((OUT/'editorial.json').read_text())
W={w['id']:w for w in b['words']};U={u['id']:u for u in b['utterances']}
OBJ=b['objects'];D=b['dialogues'];X=b['exercises'];WRITE=b['writing']
MG=[(m['stage'],m['title'],[p['word'] for p in m['pairs']]) for m in b['matching'] if m['relation']=='hanzi-meaning']
R={k for _,_,ks in MG for k in ks}
WRITING={w['word']:w['steps'][0]['prompt'].split('. ',1)[1] for w in WRITE}
marks={'a':'āáǎà','e':'ēéěè','i':'īíǐì','o':'ōóǒò','u':'ūúǔù','ü':'ǖǘǚǜ'}
def py_syllable(t):
 b=t[:-1];n=int(t[-1]);b=b.replace('u:','ü').replace('v','ü')
 if n==5:return b
 pos=next((b.find(v) for v in ['a','e'] if v in b),None)
 if pos is None:
  if 'ou' in b:pos=b.index('o')
  else:pos=max(i for i,c in enumerate(b) if c in marks)
 return b[:pos]+marks[b[pos]][n-1]+b[pos+1:]
def pinyin(words):return ' '.join(format_word(W[k]['tones']) for k in words)
def format_word(tones):
 return ''.join(("'" if i and t[0] in 'aeo' else '')+py_syllable(t) for i,t in enumerate(tones))
TITLES={1:'Kontakt und Verständigung',2:'Getränke bestellen',3:'Menge und Bezahlung',4:'Essen und Einschränkungen',5:'Orientierung',6:'Unterwegs in Taiwan',7:'Unterkunft',8:'Zeit und nächste Fahrt',9:'Einkaufen und Telefon',10:'Hilfe bei Problemen'}
COUNTS={}
for st in range(1,11):
 objs=sorted([o for o in OBJ if o['stage']==st],key=lambda o:(o['kind']!='lexeme',o['id']))
 ds=[d for d in D if d['stage']==st]
 COUNTS[st]=dict(objects=len(objs),lexemes=sum(o['kind']=='lexeme' for o in objs),patterns=sum(o['kind']=='construction' for o in objs),dialogues=len(ds))
 text=[f'# E{st} {TITLES[st]}','', 'Redaktioneller Textentwurf · Reise nach Taiwan · 20. Oktober 2026','', 'Sprachlich redigierter Textentwurf nach vollständiger KI-gestützter Quellen- und Redaktionsprüfung; keine muttersprachliche Zertifizierung. Alle Hörübungen verweisen auf Text; es gibt keine neuen Audios. [Überblick und Status](README.md) · [Lösungen und Übungen](EXERCISES.md)','', '## Wörter und Einführungstexte','', '| Objekt | Traditional | Simplified | Lexikalisches Pinyin | Bedeutung und Lernhinweis | Beispiel |','| --- | --- | --- | --- | --- | --- |']
 for o in objs:
  if o['kind']!='lexeme':continue
  w=W[o['word']];u=U[o['example']]
  text.append(f"| {o['id']} | {w['hant']} | {w['hans']} | {pinyin([w['id']])} | {w['de']}. {o['learningText']} | {u['hant']} {u['de']} |")
 text+=['','## Ausdrücke und Satzmuster','']
 for o in objs:
  if o['kind']!='construction':continue
  text+=[f"### {o['id']} {o['title']}",'',o['learningText'],'']
  for uk in o['examples']:
   u=U[uk];text+=[f"- {u['hant']} / {u['hans']} — {u['pinyinLexical']} — {u['de']}"]
  text+=['',('Eigene Anwendung: '+o['productionPrompt']) if o['practiceMode']=='productive' else 'Ziel: diese Äußerung im Gespräch verstehen; eigene Produktion ist dafür keine Pflicht.','', 'Sprachliche Teile im Kontext: '+ '; '.join(h+' — '+g for h,g in dict.fromkeys((p['hant'],p['gloss']) for uk in o['examples'] for p in U[uk]['exploration']))+'.','']
 text+=['## Zusammenhängende Dialoge','', 'Jede Tabellenzeile ist ein Sprecherzug. Mehrere Sätze im Zug bleiben über ihre Äußerungs-IDs einzeln prüfbar. Die Hörfassung und ihre prosodische Prüfung stehen aus.','']
 for d in ds:
  text+=[f"### {d['id']} {d['title']}",'',d['context'],'', '; '.join(k+': '+v for k,v in d['roles'].items())+'.','', 'Vor diesem Gespräch gezielt einführen: '+', '.join(d['after'])+'.', '', '| Zug | Rolle | Traditional | Simplified | Lexikalisches Pinyin | Bedeutung und Satzprüfungen |','| ---: | --- | --- | --- | --- | --- |']
  for i,t in enumerate(d['turns'],1):
   us=[U[k] for k in t['utterances']]
   text.append('| '+str(i)+' | '+t['speaker']+' | '+' '.join(u['hant'] for u in us)+' | '+' '.join(u['hans'] for u in us)+' | '+' / '.join(u['pinyinLexical'] for u in us)+' | '+' '.join(u['de'] for u in us)+' — '+', '.join(u['senseCheck'] for u in us)+' |')
  text+=['','Gesamtverständnis: '+d['recap']['question'],'','Lösung zum Selbstvergleich: '+' '.join(d['recap']['expected']),'']
  if 'contrast' in d['recap']:text+=[d['recap']['contrast'],'']
  if 'sceneTransition' in d['recap']:text+=[d['recap']['sceneTransition'],'']
  if 'independence' in d['recap']:text+=[d['recap']['independence'],'']
 text+=['## Erkennung und Schreiben','']
 rs=sorted(k for k in R if W[k].get('objectStage',W[k]['firstStage'])==st) if st!=1 else ['zhe','na-dem','kan','qingwen']
 text+=['Gezielte Erkennungsformen: '+', '.join(W[k]['hant']+' / '+W[k]['hans'] for k in rs)+'.','']
 for wr in WRITE:
  if wr['stage']==st:text+=[f"Schreibziel {wr['hant']}: {WRITING[wr['word']]} Geführtes Schreiben, reduzierte Hilfe und späterer Abruf bleiben getrennte Evidenz.",'']
 text+=['[Weiter zum Überblick](README.md)','']
 (OUT/f'E{st:02d}.md').write_text('\n'.join(text))
# Closed answer sets plus evidence boundaries; no user-visible self-marking fiction.
e=['# Übungen und Lösungen zur Reise nach Taiwan','', 'Redaktioneller Entwurf. Die Listen sind Antwortschlüssel für die spätere Umsetzung, keine laufenden App-Aufgaben. Hörreferenzen existieren noch nicht. Die Reihenfolge der richtigen und falschen Auswahloptionen ist kein Präsentationsvorschlag; sie muss später unabhängig vom Lösungsschlüssel angeordnet werden.','', 'Satzprüfungen stehen für jede Äußerung bereit. Bei bekannten Routinezügen werden sie nicht bei jedem Auftreten erneut verpflichtend gestellt. Ein Durchgang nach Modellhören ist geführt. Freie deutsche Paraphrasen werden nicht anhand von Schlüsselwörtern als vollständig verstanden bewertet.','', '## Satzweises Verständnis','']
for x in X:
 if x['type']!='sentence_meaning':continue
 u=U[x['utterance']]
 e += [f"### {x['id']}",'',f"Textreferenz: {u['hant']} / {u['hans']} — {u['pinyinLexical']}",'',f"Bedeutung: {u['de']}",'',f"Prüfziel: {'; '.join(u['atoms'])}.",'',f"Frage: {x['prompt']}",'', 'Richtig: '+' / '.join(x['correct']),'', 'Gezielt falsch: '+' / '.join(x['incorrect']),'',x['feedback'],'']
 if u['context']:e+=['Nötiger Kontext: '+u['context'],'']
e+=['## Eigene Mandarinformulierungen','', 'Der Auftrag erscheint ohne Mandarinmuster oder Pinyin. Die folgenden Varianten sind der interne Antwortschlüssel. Lexikalischer Inhalt, Konstruktion, Pinyin-/Tonnotation und gesprochene Aussprache werden getrennt beurteilt. Eine funktional passende Alternativstruktur belegt die kommunikative Funktion; sie belegt die Zielkonstruktion nur, wenn diese tatsächlich verwendet wurde. Nicht gelistete Antworten bleiben zum Modellvergleich offen.','']
for x in X:
 if x['type']!='communicative_text_production':continue
 e += [f"### {x['id']}",'',x['prompt'],'']
 for v in x['expected']:e+=['- '+v['hant']+' / '+v['hans']+' — '+v['pinyinLexical']]
 e+=['',x['feedback'],'']
e+=['## Beträge Zeiten Wege und Gesprächsreaktionen','']
for x in X:
 if x['type'] not in ['structured_value','structured_route','contextual_reply_selection']:continue
 e+=[f"### {x['id']}",'',x['prompt'],'']
 if x['type']=='structured_value':
  u=U[x['utterance']];e+=['Textreferenz: '+u['hant']+' / '+u['hans']+' — '+u['pinyinLexical'],'', 'Lösung: '+str(x['expected'])+(' '+x['unit'] if x['unit'] else '')+'.','']
 elif x['type']=='structured_route':e+=['Lageplan: Start [2,1], Blick nach oben; Zwischenpunkt geradeaus [1,1]; Ausgang rechts davon [1,2]. Lösung: zuerst geradeaus, dann rechts. Ein links gelegenes anderes Ziel liegt bei [1,0].','']
 else:
  e+=['Kontext: '+x['dialog']+', nach Zug '+str(x['afterTurn'])+'.','', 'Passende Optionen: '+' / '.join(U[k]['hant']+' — '+U[k]['de'] for k in x['correct']),'', 'Unpassende Optionen: '+' / '.join(U[k]['hant']+' — '+U[k]['de'] for k in x['incorrect']),'']
 e+=[x['feedback'],'']
e+=['## Frühes Hanzi Laut Bedeutung Matching','', 'Jede Gruppe besitzt getrennte Schrift–Bedeutung- und Audio–Schrift-Varianten. Die einzelnen ganzen Formen sind zuvor in der gewählten Schrift und mit ihrer Bedeutung beziehungsweise Aussprache eingeführt. Pinyin ist eine vorübergehende Hilfe, kein Nachweis gehörten Lauts. Beim Schrift–Bedeutung-Matching bleibt die Bedeutung vor der Antwort verdeckt; keine sichtbare Lösung als angeblich unabhängiger Abruf. Der letzte Ausschlusstreffer zählt nicht als unabhängig.','', '| Gruppe | Formen und Bedeutungen |','| --- | --- |']
for i,(st,title,ks) in enumerate(MG,1):e.append('| '+f'M{i:02d} E{st} {title}'+' | '+'; '.join(W[k]['hant']+' / '+W[k]['hans']+' — '+W[k]['de'] for k in ks)+' |')
e+=['','## Selektive Schreibübungen','', 'Die zehn Ziele verwenden den bestehenden Ablauf. Der spätere Gedächtnisabruf zeigt nur den Bedeutungsauftrag, kein Hanzi und kein Pinyin. Öffnen der Vorlage zählt als Hilfe. Passende Strichdaten werden vor Integration geprüft; es werden hier keine neuen Schreib-Assets erzeugt.','']
for w in WRITE:
 e+=[f"### {w['id']} {w['hant']} / {w['hans']}",'']
 for step in w['steps']:e+=['- '+step['mode']+': '+step['prompt']]
 e+=['',w['feedback'],'']
(OUT/'EXERCISES.md').write_text('\n'.join(e))
# Supplemental words are explicitly introduced inside phrases or as context names, not counted as independent objects.
a=['# Gebundene Teile und Kontextwörter','', 'Diese Einträge ergänzen den bestehenden Kanon und die 93 eigenständigen neuen Wortziele. Sie sind keine zusätzliche Sammlung von Pflichtkarten. Jeder Eintrag bekommt vor seiner Prüfung im Satz Aufmerksamkeit. Ein Eintrag aus einem ganzen Wort macht dessen Einzelzeichen nicht automatisch bekannt.','', '| Ab Etappe | Traditional | Simplified | Lexikalisches Pinyin | Bedeutung und Einführung |','| ---: | --- | --- | --- | --- |']
for w in W.values():
 if not w['baseline'] and w['role']!='lexeme':a.append(f"| {w['firstStage']} | {w['hant']} | {w['hans']} | {pinyin([w['id']])} | {w['de']}. {w['note']} |")
a+=['','## Zusammenhang mit bestehenden Wörtern','', 'Die 44 kanonischen Worteinträge aus main werden referenziert und nicht überschrieben. Wenn bei einer realen Person die passende Einführung fehlt, muss der bekannte Teil erst unbewertet eingeführt werden. Die Einträge ma1 bis ma4 bleiben Aussprachebeispiele; sie werden nicht als neue Reisevokabeln ausgegeben. Die Bedeutung von 再 als dann, 叫 als rufen sowie 的 als Zielattribut wird im neuen Zusammenhang bewusst erklärt.','', '## Lexikalische und gesprochene Form','', 'Die Haupttabellen zeigen lexikalisches Pinyin, einschließlich yī und bù. Die JSON-Fassung dokumentiert zusätzlich begrenzte 一/不-Oberflächenkandidaten; sie ändert weder den Kanon noch erzeugt sie Audio. 醫院 enthält kein Zahlwort 一 und erhält daher keine solche Änderung. Dritte Töne, Neutralton, Phrasierung und Sprechtempo sind gesondert zu prüfen. Beispielsweise heißt es bei 一杯 yì bēi, bei 一共 yígòng und bei 不客氣 bú kèqi.','']
(OUT/'CONTEXT_WORDS.md').write_text('\n'.join(a))
readme=['# Redaktionelle Ausarbeitung Reise nach Taiwan','', '20. Oktober 2026 · Curriculum freigegeben, Textbestand ausgearbeitet und gesammelt sprachlich redigiert','', 'Der Bestand umfasst 134 Lernobjekte mit Lernhinweisen und Beispielen, 28 zusammenhängende Dialoge, 176 verschiedene satzweise Prüftexte, 33 produktive Formulierungsaufträge und weitere Zahlen-, Zeit-, Weg- und Reaktionsaufgaben. 19 kuratierte Matching-Gruppen ergeben 38 getrennte Varianten für 62 Erkennungsformen. Zehn Schreibziele besitzen konkrete Aufträge für Einführung, eigene Produktion und späteren Abruf.','', 'Die zusätzlichen zehn neuen Schreibziele und die Erkennungsformen sind Relationen der 134 Objekte. Wiederholte Sätze und Dialogvarianten sind keine neuen Lernobjekte. Bekannte Grüße und Dank werden nicht als neue Inhalte gezählt oder bei jedem Auftreten erneut obligatorisch geprüft.','', '## Den Textbestand lesen','', '| Etappe | Datei | Neue Objekte | Dialoge |','| --- | --- | ---: | ---: |']
for st in range(1,11):readme.append(f"| E{st} {TITLES[st]} | [Text und Dialoge](E{st:02d}.md) | {COUNTS[st]['objects']} | {COUNTS[st]['dialogues']} |")
readme+=['','- [Übungen mit Antwortschlüsseln](EXERCISES.md)','- [Gebundene Teile, Kontextwörter und Aussprachekonventionen](CONTEXT_WORDS.md)','- [Gesammelte Sprachkorrekturen und Prüfumfang](LANGUAGE_REVIEW.md)','- [Frühere Quellen- und Strukturprüfung](REVIEW.md)','- [Strukturierter redaktioneller Bestand](editorial.json)','- [Freigegebener und auf Taiwan korrigierter Curriculumplan](../PLAN.md)','', '## Was ausgearbeitet ist','', 'Jedes der 134 Objekte hat einen konkreten Lernhinweis, mindestens einen ausgearbeiteten Zusammenhang und eine passende Einführung beziehungsweise Prüfung. Die 93 Wortziele und 41 Ausdrücke bleiben unterscheidbar. Die JSON-Fassung verbindet Form, Pinyin, Bedeutung, Satzteile, Voraussetzungen, spätere Verwendung und Übungen mit stabilen redaktionellen IDs. Das Format wird von der App nicht importiert.','', 'Dialoge beginnen mit den ersten sinnvollen Frage-Antwort-Folgen, beispielsweise Erlaubnis und einfache Bestellung. Temperatur, Preis, Zahlungsweg oder eine notwendige Rückfrage erweitern sie später. Die Folgen bei Restaurant, Hotel und Einkauf verwenden vorhandene Mittel in neuen Anliegen. Ein Wechsel der Situation hat einen erklärten Anlass. Jeder Satz im Sprecherzug ist einzeln referenzierbar und besitzt einen geschlossenen Verständnisschlüssel; Gesamtverständnis bleibt eine zusätzliche Aufgabe.','', '## Taiwan als verbindlicher Reisebezug','', 'Nach der ausdrücklichen Nutzerfestlegung heißt die Strecke Reise nach Taiwan. Es gibt keine stillschweigende Umstellung auf Festlandmandarin. Beide Schriftformen bleiben verfügbar; die Schriftwahl bestimmt nicht die regionale Wortwahl. 白飯, 捷運, 飯店, 計程車, 網路, 藥局 und 痛 setzen die entsprechenden geplanten Lernziele taiwanbezogen um, ohne zusätzliche Pflichtobjekte. 地鐵, 出租車, 酒店, 網絡, 藥店 oder 疼 werden höchstens als bewusst erklärte Rezeptionsvarianten behandelt. Die bestehenden 36 Lernobjekte und ihre Historie werden nicht umgedeutet.','', 'Taiwan-Dollar ist der durchgängige Währungskontext. Zeitangaben und Linienkarten sind fiktive Unterrichtsbeispiele. Die Metrofrage erfragt eine Linie, nicht eine vermeintlich überall übliche Liniennummer. Die 41 neuen gebundenen oder kontextuellen Worteinträge werden in ihren Äußerungen gezielt erklärt; sie begründen keine weitere Pflichtkartenzahl.','', '## Status und Arbeitsgrenze','', 'Die Ausarbeitung ist ein redaktioneller Entwurf mit Quellenabgleich. Der gesamte hier abgegrenzte Textbestand wurde anschließend KI-gestützt auf Sprachform, Natürlichkeit, Taiwan-Pragmatik und passende Antwortschlüssel gelesen und gesammelt korrigiert. Bericht und einzelnerfasste Prüfliste dokumentieren Umfang und Befunde. Das ist keine muttersprachliche oder lehrkraftseitige Zertifizierung; die endgültige Lautfassung existiert noch nicht. Die sechs ausdrücklich behandelten Wörterbuchabweichungen sind im Quellenbestand dokumentiert.','', 'Keine Audios erzeugt oder beauftragt, keine Audio-Manifeste angelegt, kein Audio-Dry-Run, keine App-/Scheduler-/UI-Änderung, kein Deployment, Merge oder Veröffentlichung. Der vorhandene Feature-Arbeitsstand bleibt isoliert. Dieser Textbestand wird ausschließlich im Dokumentationsbranch gehalten.','']
(OUT/'README.md').write_text('\n'.join(readme))
