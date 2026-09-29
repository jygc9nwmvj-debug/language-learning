import test from 'node:test';
import assert from 'node:assert/strict';
import lesson from '../src/languages/mandarin/content/lesson-001.json' with {type:'json'};
import buffer from '../src/languages/mandarin/content/buffer-d.json' with {type:'json'};
const raw={...lesson,words:[...lesson.words,...buffer.words],items:[...lesson.items,...buffer.items]};
import {contentSchema} from '../src/languages/mandarin/schema/content.ts';
import {content,itemMap,taskMap} from '../src/languages/mandarin/content/index.ts';
import {taskPresentationRole,introductionDetail} from '../src/languages/mandarin/introduction.ts';
import {attentionAssessment} from '../src/languages/mandarin/attention.ts';
import {learningReport} from '../src/core/observability/report.ts';
const fixture=()=>structuredClone(raw);
const event=(id,type,detail={},taskId='tones')=>({id,type,detail,taskId,at:1,sessionId:'test',contentVersion:'build-d-1'});
const intro=id=>event('intro-'+id,'introduction_dimensions',introductionDetail(itemMap.get(id),'hant',['meaning','pronunciation','hanzi'],'test'));

test('conversion source is explicit and remains valid teaching, not a recall assessment',()=>{
 const c=contentSchema.parse(fixture());
 assert.deepEqual(c.tasks.find(t=>t.id==='tones').notationPractice,{intent:'tone_notation_conversion',sourceWord:'ma2'});
 assert.equal(c.words.find(w=>w.id==='ma2').pinyin,'má');
 assert.equal(taskMap.get('tones').target,undefined);
 for(const sourceWord of raw.toneExamples){const c=fixture();c.tasks.find(t=>t.id==='tones').notationPractice.sourceWord=sourceWord;assert.doesNotThrow(()=>contentSchema.parse(c));}
});
test('validator rejects transformation sources on retrieval and incompatible evidence targets',()=>{
 for(const id of ['tone-wo','recall-nihao','read-hao','write-recall']){
  const c=fixture();c.tasks.find(t=>t.id===id).notationPractice={intent:'tone_notation_conversion',sourceWord:'ma2'};
  assert.throws(()=>contentSchema.parse(c),/Notation conversion source is not a retrieval cue/);
 }
 for(const [id,target] of [['tones','perception'],['read-hao','writing'],['recall-nihao','perception'],['tone-wo','production'],['write-recall','reading']]){
  const c=fixture();c.tasks.find(t=>t.id===id).target=target;
  assert.throws(()=>contentSchema.parse(c),/Task kind\/assessment target mismatch/);
 }
 for(const mutate of [t=>delete t.notationPractice,t=>t.notationPractice.sourceWord='wo',t=>t.notationPractice.intent='lexical_tone_recall']){
  const c=fixture();mutate(c.tasks.find(t=>t.id==='tones'));assert.throws(()=>contentSchema.parse(c));
 }
});
test('all 131 existing definitions retain the renderer-compatible target and recognition sources',()=>{
 assert.equal(content.tasks.length,131);
 const targets={listen:'listening',read:'reading',recall:'production',writing:'writing','tone-recall':'perception',sequence:'reading'};
 for(const t of content.tasks){assert.equal(t.target,targets[t.kind],t.id);if(t.kind!=='tones')assert.equal(t.notationPractice,undefined,t.id);}
 assert.equal(content.tasks.filter(t=>t.kind==='read').length,18);
 assert.equal(content.tasks.filter(t=>t.kind==='tone-recall').length,3);
});
test('presentation marks teaching and guided practice honestly, including existing writing fallback',()=>{
 assert.equal(taskPresentationRole(taskMap.get('tones'),'hant',[]),'practice');
 assert.equal(taskPresentationRole(taskMap.get('closure'),'hant',[]),'completion');
 assert.equal(taskPresentationRole(taskMap.get('recall-nihao'),'hant',[]),'introduction');
 assert.equal(taskPresentationRole(taskMap.get('recall-nihao'),'hant',[intro('nihao')]),'recall');
 const history=[intro('hao')];
 assert.equal(taskPresentationRole(taskMap.get('write-guided'),'hant',history),'practice');
 assert.equal(taskPresentationRole(taskMap.get('write-recall'),'hant',history),'practice');
 history.push(event('write-intro','introduction_dimensions',introductionDetail(itemMap.get('hao'),'hant',['writing'],'guided_writing_completed')));
 assert.equal(taskPresentationRole(taskMap.get('write-recall'),'hant',history),'recall');
});
test('notation practice never becomes tone retrieval in F-light or bypasses item-specific introduction',()=>{
 const detail={assessmentIntent:'tone_notation_conversion',sourceWord:'ma2',phase:'guided_practice',evidence:'app_checked',result:'success'};
 const history=[event('legacy','tone_notation_practice'),event('practice','tone_notation_practice',detail),event('notation','tone_notation_introduced',detail)];
 const before=structuredClone(history),report=learningReport(history);
 assert.deepEqual(history,before);assert.equal(report.rows.length,0);
 assert.deepEqual(report.introductions.map(i=>i.dimension),['notation_convention']);
 assert.equal(attentionAssessment({toneNotation:true,neutralTone:false},itemMap.get('wo'),history).toneNotation,false);
 history.push(event('item-tone','tone_attention_confirmed',{item:'wo',toneNumbers:'wo3',attentionVersion:1},'meet-wo'));
 assert.equal(attentionAssessment({toneNotation:true,neutralTone:false},itemMap.get('wo'),history).toneNotation,true);
});
