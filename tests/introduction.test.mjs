import test from 'node:test';import assert from 'node:assert/strict';
import {content,itemMap,taskMap} from '../src/languages/mandarin/content/index.ts';
import {introduced,hasDimension,knownHanziComponents,missingIntroduction,introductionDetail,introductionForTask} from '../src/languages/mandarin/introduction.ts';
import {attentionAssessment} from '../src/languages/mandarin/attention.ts';
import {composeContinuous} from '../src/languages/mandarin/continuous.ts';
const event=(id,dimensions,script='hant')=>({id:crypto.randomUUID(),at:1,sessionId:'prior',taskId:`d-meet-${id}`,type:'introduction_dimensions',detail:introductionDetail(itemMap.get(id),script,dimensions,'focused_test')});
test('first, partial and fully introduced items use dimension-specific evidence',()=>{
 const item=itemMap.get('qing');assert.deepEqual(missingIntroduction(item,'hant',[]),['meaning','pronunciation','hanzi']);
 const meaning=event('qing',['meaning']);assert.deepEqual(missingIntroduction(item,'hant',[meaning]),['pronunciation','hanzi']);
 const complete=event('qing',['meaning','pronunciation','hanzi']);assert.deepEqual(missingIntroduction(item,'hant',[complete]),[]);assert.deepEqual(missingIntroduction(item,'hans',[complete]),['hanzi']);
 for(const type of ['task_presented','task_completed','pinyin_reveal','audio_replay','phrase_explore'])assert.equal(introduced(item,'hanzi','hant',[{...complete,type}]),false);
});
test('known whole-word components avoid repeat Hanzi introduction, without implying phrase meaning or tone',()=>{
 const history=[event('ni',['hanzi']),event('hao',['hanzi'])],item=itemMap.get('nihao');
 assert(knownHanziComponents(item,'hant',history));assert(hasDimension(item,'hanzi','hant',history));assert(!introduced(item,'meaning','hant',history));assert(missingIntroduction(item,'hant',history).includes('tone'));
 assert(!knownHanziComponents(itemMap.get('ni'),'hant',[event('nihao',['hanzi'])]));
 assert(!knownHanziComponents(item,'hans',history));
});
test('reading, listening, recall and number transfer cannot assess untaught dimensions',()=>{
 for(const id of ['d-read-qing','d-hear-qing','d-recall-speak-slowly','d-sequence-123'])assert(introductionForTask(taskMap.get(id),'hant',[]));
 const meaning=event('qing',['meaning']);assert(introductionForTask(taskMap.get('d-read-qing'),'hant',[meaning]));assert(introductionForTask(taskMap.get('d-hear-qing'),'hant',[meaning]));
 assert.equal(introductionForTask(taskMap.get('d-read-qing'),'hant',[event('qing',['meaning','hanzi'])]),undefined);
 assert.equal(introductionForTask(taskMap.get('d-hear-qing'),'hant',[event('qing',['meaning','pronunciation'])]),undefined);
 const numbers=['yi','er','san'].map(id=>event(id,['meaning','hanzi']));assert.equal(introductionForTask(taskMap.get('d-sequence-123'),'hant',numbers),undefined);
});
test('recognition never implies writing or explicit tone teaching',()=>{
 const item=itemMap.get('hao'),history=[event('hao',['meaning','pronunciation','hanzi'])];assert(!introduced(item,'writing','hant',history));assert(!introduced(item,'tone','hant',history));
 assert.equal(attentionAssessment({toneNotation:true,neutralTone:false},item,[...history,{...history[0],type:'task_completed',taskId:'tones'}]).toneNotation,false);
 assert(introduced(item,'writing','hant',[...history,event('hao',['writing'])]));
 assert(!itemMap.get('qing').introduction.dimensions.includes('writing'));assert(itemMap.get('ren').introduction.dimensions.includes('writing'));
});
test('existing completed guided writing bridges honestly and inspection never introduces dimensions',()=>{
 const item=itemMap.get('hao'),e={...event('hao',[]),type:'attempt',taskId:'write-guided',detail:{objectId:'cmn:hao:hant'}};
 assert(introduced(item,'writing','hant',[e]));assert(!introduced(item,'writing','hans',[e]));assert(!introduced(item,'writing','hant',[{...e,taskId:'write-recall'}]));
 const i=event('qing',['meaning','hanzi']);assert(!introduced(itemMap.get('qing'),'hanzi','hant',[{...i,type:'inspection_introduction_dimensions'}]));
});
test('all current content declares relevant dimensions; existing scheduler can return Hanzi retrieval',()=>{
 assert.equal(content.items.length,36);for(const item of content.items){assert(item.introduction.dimensions.includes('meaning'));assert(item.introduction.dimensions.includes('pronunciation'));}
 const e=event('nihao',['meaning','pronunciation','hanzi']);const recall={...e,id:'recall',taskId:'recall-nihao',type:'attempt',detail:{result:'success',assisted:false}};
 assert(composeContinuous([], [e,recall], 'hant', 2_000_000).includes('read-nihao'));
});

test('canonical declarations reject untaught assessment targets and contradictory roles',async()=>{
 const {default:raw}=await import('../src/languages/mandarin/content/lesson-001.json',{with:{type:'json'}});
 const {default:buffer}=await import('../src/languages/mandarin/content/buffer-d.json',{with:{type:'json'}});
 const {contentSchema}=await import('../src/languages/mandarin/schema/content.ts');
 for(const mutate of [
  c=>c.items.find(i=>i.id==='nihao').introduction.dimensions=c.items.find(i=>i.id==='nihao').introduction.dimensions.filter(d=>d!=='tone'),
  c=>c.items.find(i=>i.id==='qing').introduction.role='writing',
  c=>c.items.find(i=>i.id==='qing').introduction.dimensions=['meaning','pronunciation'],
  c=>delete c.items.find(i=>i.id==='speak-slowly').exploration,
 ]){const c={...structuredClone(raw),words:[...structuredClone(raw.words),...structuredClone(buffer.words)],items:[...structuredClone(raw.items),...structuredClone(buffer.items)]};mutate(c);assert.equal(contentSchema.safeParse(c).success,false);}
});
