import test from 'node:test';
import assert from 'node:assert/strict';
import raw from '../src/languages/mandarin/content/lesson-001.json' with { type: 'json' };
import { contentSchema } from '../src/languages/mandarin/schema/content.ts';
import { itemMap, content } from '../src/languages/mandarin/content/index.ts';
import { interpretAnswer, answerFeedback } from '../src/languages/mandarin/answer.ts';

const cases = [
 ['wo','wo3','correct'],['wo','wǒ','correct'],['wo','wo','omitted'],
 ['hao','hao3','correct'],['hao','hǎo','correct'],['hao','hao','omitted'],
 ['wojiao','wo3 jiao4 Wolfram','correct'],['wojiao','wǒ jiào Wolfram','correct'],['wojiao','wo jiao Wolfram','omitted'],
 ['xiexie','xie4 xie5','correct'],['xiexie','xie4xie0','correct'],['xiexie','xie4xie','correct'],['xiexie','xièxie','correct'],['xiexie','xiè xie','correct'],['xiexie','xie xie','omitted'],
 ['xiexie','謝謝','unknown'],['xiexie','谢谢','unknown'],['wojiao','我叫 Wolfram','unknown'],
];
for (const [id,input,tone] of cases) test(`A1 ${id}: ${input}`, () => {
 const r=interpretAnswer(input,itemMap.get(id));
 assert.equal(r.content,'correct'); assert.equal(r.construction,'complete'); assert.equal(r.result,'success');
 assert.equal(r.toneNotation,tone); assert.equal(r.spokenTones,'unknown'); assert.equal(r.fullyCorrect,tone!=='omitted');
});
test('names are open slots, missing names are construction errors, typos are not model answers', () => {
 const item=itemMap.get('wojiao');
 for(const saved of ['', 'Paul','Wolfram','Wo3 joao4 Wolfram']) assert.equal(interpretAnswer('wo3 jiao4 Wolfram',item,saved).fullyCorrect,true);
 for(const input of ['wo3 jiao4','wǒ jiào','我叫']) { const r=interpretAnswer(input,item);assert.equal(r.content,'correct');assert.equal(r.construction,'incomplete');assert.match(r.correction,/Namen/);assert.equal(r.fullyCorrect,false); }
 for(const input of ['wo3 joao4 Wolfram','wo3 jio4 Wolfram']) { const r=interpretAnswer(input,item);assert.equal(r.content,'incorrect');assert.match(answerFeedback(r),/jiao4 \(jiào\)/);assert.doesNotMatch(answerFeedback(r),/joào/); }
 assert.equal(interpretAnswer('wo3',item).construction,'incomplete');
 assert.match(interpretAnswer('wo2 joao4 Wolfram',item).correction,/wo3/);
 assert.match(interpretAnswer('wo2 joao4 Wolfram',item).correction,/jiao4/);
});
test('tone corrections stay separate and targeted; invalid placement is not correct notation', () => {
 for(const input of ['wo2','wo6','wo33']) {const r=interpretAnswer(input,itemMap.get('wo'));assert.equal(r.content,'correct');assert.equal(r.toneNotation,'different');assert.equal(r.fullyCorrect,false);}
 const partial=interpretAnswer('wo3 jiao Wolfram',itemMap.get('wojiao'));
 assert.equal(partial.correction,'jiao4 (jiào)');assert.doesNotMatch(answerFeedback(partial),/wo3/);
 assert.equal(interpretAnswer('wo3 jìao Wolfram',itemMap.get('wojiao')).toneNotation,'different');
 assert.equal(interpretAnswer('hao',itemMap.get('hao')).toneNotation,'omitted');
});
test('every existing item round-trips its derived numbers, Pinyin and both scripts', () => {
 for(const item of content.items) for(const input of [item.toneNumbers,item.pinyin,item.hant,item.hans]) {
   assert.equal(interpretAnswer(input+(item.slot?' Wolfram':''),item).fullyCorrect,true,input);
 }
});
test('canonical validator rejects malformed words, contradictory copies and broken references', () => {
 const mutations=[
  d=>{d.words.find(w=>w.id==='jiao').toneNumbers='joao4';},
  d=>{d.words.find(w=>w.id==='jiao').toneNumbers='jiao6';},
  d=>{delete d.words[0].hans;},
  d=>{d.words[0].hant='';},
  d=>{d.words[0].toneNumbers='wo3 ni3';},
  d=>{d.words[0].pinyin='wó';},
  d=>{d.items[0].pinyin='ní hǎo';},
  d=>{d.items[0].words=['absent'];},
  d=>{d.items[1].meaning={de:['falsch'],en:['wrong']};},
  d=>{d.words.push({...d.words[0],id:'duplicate-word',toneNumbers:'wo2'});},
  d=>{d.tasks.find(t=>t.id==='recall-wojiao').answers=['wo3 joao4 Wolfram'];},
  d=>{d.tasks.find(t=>t.id==='tone-jiao').tone=2;},
  d=>{d.tasks.find(t=>t.id==='tone-jiao').toneIndex=9;},
  d=>{d.tasks[0].itemId='absent';},
  d=>{d.initialPlan.push('absent');},
 ];
 for(const mutate of mutations) { const d=structuredClone(raw);mutate(d);assert.equal(contentSchema.safeParse(d).success,false,String(mutate)); }
});
