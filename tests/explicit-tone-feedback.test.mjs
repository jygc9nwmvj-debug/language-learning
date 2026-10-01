import test from 'node:test';
import assert from 'node:assert/strict';
import {content,itemMap} from '../src/languages/mandarin/content/index.ts';
import {evaluateAnswer} from '../src/languages/mandarin/answer.ts';
import {numberedToPinyin} from '../src/languages/mandarin/pinyin.ts';
import {displayInterpretation,displayDiagnosis} from '../src/languages/mandarin/displayDiagnosis.ts';
const tasks=content.tasks.filter(t=>t.kind==='recall');
const unassessed={toneNotation:false,neutralTone:false};
test('production population explicitly accounted for',()=>{
 assert.equal(tasks.length,23);assert.equal(tasks.filter(t=>t.assess.toneNotation).length,5);
 assert.deepEqual(content.tasks.filter(t=>t.target==='production').map(t=>t.id),tasks.map(t=>t.id));
});
for(const task of tasks)test(`${task.id}: every syllable explicit tone, canonical, omitted, disabled assessment`,()=>{
 const item=itemMap.get(task.itemId),suffix=item.slot==='name'?' Alex':'';
 const canonical=item.syllables.map((s,i)=>s+item.tones[i]).join(' ')+suffix;
 const omitted=item.syllables.join(' ')+suffix;
 for(const assessment of [task.assess,unassessed]){
  assert.equal(displayInterpretation(canonical,item,assessment).fullyCorrect,true);
  assert.deepEqual(displayInterpretation(omitted,item,assessment),evaluateAnswer(omitted,item,assessment));
  for(let i=0;i<item.syllables.length;i++){
   const tokens=item.syllables.map((s,j)=>s+(j===i?item.tones[j]%4+1:item.tones[j]));
   for(const input of [tokens.join(' ')+suffix,tokens.map(numberedToPinyin).join(' ')+suffix]){
    const evidence=evaluateAnswer(input,item,assessment),snapshot=structuredClone(evidence);
    const shown=displayInterpretation(input,item,assessment);
    assert.equal(evidence.result,'success',input);assert.equal(shown.result,evidence.result);
    assert.equal(shown.content,'correct');assert.equal(shown.toneNotation,'different');assert.equal(shown.fullyCorrect,false);
    assert.deepEqual(evaluateAnswer(input,item,assessment),snapshot);
    if(!item.slot){const d=displayDiagnosis(input,item,assessment);assert.equal(d.mode,'inline');assert.equal(d.elements[i].kind,'tone');assert.equal(d.elements[i].correction,numberedToPinyin(item.syllables[i]+item.tones[i]));}
   }
  }
 }
});
test('reported dong4 case, mixed omissions and explicit tones do not promote content errors',()=>{
 const item=itemMap.get('dont-understand');
 assert.equal(evaluateAnswer('wo3 ting1 bu4 dong4',item,unassessed).fullyCorrect,true);
 const shown=displayInterpretation('wo3 ting1 bu4 dong4',item,unassessed);
 assert.equal(shown.fullyCorrect,false);assert.equal(shown.result,'success');
 const d=displayDiagnosis('wo ting bu dong4',item,unassessed);
 assert.equal(d.mode,'inline');assert.deepEqual(d.elements.map(p=>p.kind),[null,null,null,'tone']);
 assert.equal(displayInterpretation('我听不懂',item,unassessed).fullyCorrect,true);
});
