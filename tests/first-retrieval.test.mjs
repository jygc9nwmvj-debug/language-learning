import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import {composeContinuous,firstRetrievalAges,shouldResume,DOSING} from '../src/languages/mandarin/continuous.ts';
import {content,taskMap} from '../src/languages/mandarin/content/index.ts';
import {withSpacedRetry} from '../src/languages/mandarin/session.ts';
import {LearningDatabase} from '../src/core/progress/db.ts';
const event=(taskId,type,at,detail={})=>({id:`${taskId}-${type}-${at}`,sessionId:'s',taskId,type,at,detail,contentVersion:'test'});
const complete=(id,at)=>event(id,'task_completed',at);
const filler=Array.from({length:7},(_,i)=>complete('tones',100+i));
const intro=complete('meet-nihao',1);
const item=id=>taskMap.get(id)?.itemId;
const plan=events=>composeContinuous([],events,'hant',2_000_000);

test('aged first retrieval overtakes new encounters; older waiting objects rank first',()=>{
 const history=[intro,complete('meet-wo',50),...filler];
 const p=plan(history);
 assert.equal(item(p[0]),'nihao');
 assert(p.findIndex(id=>item(id)==='wo')<p.findIndex(id=>taskMap.get(id).kind==='encounter'));
 assert(firstRetrievalAges(history).get('nihao')>firstRetrievalAges(history).get('wo'));
});
test('waiting review outside the old three-review quota can displace new material',()=>{
 const ids=['nihao','wo','ni','hao','wojiao','askname'];
 const history=ids.map((id,i)=>complete(`meet-${id}`,i+1)).concat(filler);
 const p=plan(history);
 for(const id of ids)assert(p.some(t=>item(t)===id&&taskMap.get(t).kind!=='encounter'),id);
 assert(p.length<=DOSING.tasks+1);
});
test('selected failure and help repairs precede overdue first retrieval; retry spacing unchanged',()=>{
 for(const detail of [{result:'failure',assisted:false},{result:'success',assisted:true}]){
  const history=[intro,complete('meet-wo',2),event('read-wo','attempt',3,detail),...filler];
  const p=plan(history);assert.equal(item(p[0]),'wo');assert(p.findIndex(id=>item(id)==='nihao')>0);
  const retry=withSpacedRetry(['read-wo','meet-ni','meet-hao','closure'],0,'read-wo');
  assert.deepEqual(retry,['read-wo','meet-ni','meet-hao','read-wo','closure']);
 }
});
test('only successful unassisted active evidence closes priority; guided writing never does',()=>{
 const base=[complete('meet-hao',1),...filler];
 for(const [id,type,detail,closed] of [
  ['write-guided','attempt',{result:'success',assisted:false},false],
  ['write-guided','attempt',{result:'success',assisted:true},false],
  ['read-hao','attempt',{result:'failure',assisted:false},false],
  ['read-hao','attempt',{result:'success',assisted:true},false],
  ['read-hao','attempt',{result:'success',assisted:false},true],
  ['write-recall','attempt',{result:'success',assisted:false},true],
 ])assert.equal(firstRetrievalAges([...base,event(id,type,200,detail)]).has('hao'),!closed,`${id}: ${JSON.stringify(detail)}`);
 const spoken=[complete('d-meet-dont-understand',1),event('d-recall-dont-understand','screenless_recall',2,{result:'success',assisted:false})];
 assert(!firstRetrievalAges(spoken).has('dont-understand'));
 // Once closed, the recent review remains subject to the unchanged consolidation interval.
 assert(!composeContinuous([], [intro,...filler,event('hear-nihao','attempt',1000,{result:'success',assisted:false})], 'hant',1001).some(id=>item(id)==='nihao'));
});
test('guided assistance cannot suppress the pending active retrieval behind consolidation cooldown',()=>{
 const history=[complete('meet-hao',1),event('write-guided','attempt',2,{result:'success',assisted:true}),...filler];
 assert(composeContinuous([],history,'hant',200).some(id=>item(id)==='hao'&&['read','listen','recall'].includes(taskMap.get(id).kind)));
});
test('count regular completed/skipped tasks, not intro itself, optional actions or closure',()=>{
 const history=[event('meet-nihao','introduction_dimensions',1,{dimensions:'meaning'}),complete('meet-nihao',2),complete('tones',3),event('meet-wo','skip',4),complete('closure',5),complete('unknown-transfer',6),event('read-nihao','attempt',7,{result:'success',assisted:false,optionalPractice:true}),event('tones','task_completed',8,{optionalPractice:true})];
 assert.equal(firstRetrievalAges(history).get('nihao'),2);
 assert.equal(firstRetrievalAges([...history,event('hear-nihao','audio_replay',9)]).get('nihao'),2);
 assert(!firstRetrievalAges([event('meet-nihao','task_presented',1)]).has('nihao'));
});
test('new first-retrieval priority leaves two intervening tasks across batch boundaries',()=>{
 const p=plan([intro]);const position=p.findIndex(id=>item(id)==='nihao'&&taskMap.get(id).kind!=='encounter');
 assert(position<0||position>=2);
 assert.equal(new Set(p.filter(id=>item(id)).map(item)).size,p.filter(id=>item(id)).length);
 const known=new Set(['nihao']);
 for(const id of p){const t=taskMap.get(id);if(t.kind==='encounter'){
  assert(content.items.find(i=>i.id===t.itemId).learning?.prerequisites.every(x=>known.has(x))??true);known.add(t.itemId);
 }}
});
test('stored history reconstructs priority after database reload; active saved batch is retained',async()=>{
 const history=[intro,complete('meet-wo',2),...filler];
 const expected=plan(history);const name=`first-retrieval-${crypto.randomUUID()}`;
 const db=new LearningDatabase(name);await db.events.bulkPut(history);db.close();
 const reloaded=new LearningDatabase(name);
 try{
  assert.deepEqual(plan(await reloaded.events.toArray()),expected);
  const session={id:'s',plannerVersion:'d1',plan:['meet-nihao','meet-wo','closure'],index:1,completed:false,startedAt:1,updatedAt:100,script:'hant'};
  await reloaded.sessions.put(session);assert(shouldResume(await reloaded.sessions.get('s'),101));
  assert.deepEqual((await reloaded.sessions.get('s')).plan,session.plan);
 }finally{await reloaded.delete();}
});
