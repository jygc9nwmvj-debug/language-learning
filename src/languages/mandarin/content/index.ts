import raw from './lesson-001.json' with { type: 'json' };
import buffer from './buffer-d.json' with { type: 'json' };
import { contentSchema } from '../schema/content.ts';
const addedTasks = buffer.items.flatMap(i => [
 {id:`d-meet-${i.id}`,kind:'encounter',itemId:i.id,prompt:{de:({repair:'Wenn du Hilfe im Gespräch brauchst.',social:'Eine kleine Antwort für den Alltag.',personal:'Einander kennenlernen.',numbers:'Zahlen erkennen und benutzen.'})[i.learning.function]}},
 ...(['numbers'].includes(i.learning.function)||['qing','ren','deguo','zhongguo'].includes(i.id) ? [{id:`d-read-${i.id}`,kind:'read',itemId:i.id,target:'reading',prompt:{de:'Was bedeutet dieser Ausdruck?'}}] : []),
 {id:`d-hear-${i.id}`,kind:'listen',itemId:i.id,target:'listening',prompt:{de:'Was bedeutet das Gehörte?'}},
 ...(i.learning.function!=='numbers' ? [{id:`d-recall-${i.id}`,kind:'recall',itemId:i.id,target:'production',assess:{toneNotation:false,neutralTone:false},prompt:{de:`Sag es auf Mandarin: ${i.meaning?.de[0] ?? buffer.words.find(w=>w.id===i.words[0])?.meaning.de[0] ?? raw.words.find(w=>w.id===i.words[0])!.meaning.de[0]}`}}] : []),
 ...(i.learning.writing ? [
 {id:`d-write-${i.id}`,kind:'writing',itemId:i.id,target:'writing',prompt:{de:'Ein Zeichen selbst schreiben.'}},
 {id:`d-write-recall-${i.id}`,kind:'writing',itemId:i.id,target:'writing',recall:true,prompt:{de:`Schreibe aus dem Gedächtnis: ${buffer.words.find(w=>w.id===i.words[0])!.meaning.de[0]}`}},
 ] : []),
]);
export const content = contentSchema.parse({...raw,version:'build-d-1',words:[...raw.words,...buffer.words],items:[...raw.items,...buffer.items],tasks:[...raw.tasks,...addedTasks,
 {id:'read-nihao',kind:'read',itemId:'nihao',target:'reading',prompt:{de:'Was bedeutet dieser Ausdruck?'}},
 {id:'d-sequence-123',kind:'sequence',itemId:'san',target:'reading',sequence:['yi','er','san'],prompt:{de:'Setze die bekannten Zahlen in die Reihenfolge eins → zwei → drei.'}},
 {id:'d-sequence-456',kind:'sequence',itemId:'liu',target:'reading',sequence:['si','wu','liu'],prompt:{de:'Zähle weiter: vier → fünf → sechs.'}},
 {id:'d-sequence-78910',kind:'sequence',itemId:'shi-number',target:'reading',sequence:['qi','ba','jiu','shi-number'],prompt:{de:'Vervollständige die Folge: sieben → acht → neun → zehn.'}},
]});
export const taskMap = new Map(content.tasks.map(t => [t.id, t]));
export const itemMap = new Map(content.items.map(i => [i.id, i]));
