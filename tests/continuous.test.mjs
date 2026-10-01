import test from 'node:test';import assert from 'node:assert/strict';
import {composeContinuous,exposure,shouldResume,DOSING} from '../src/languages/mandarin/continuous.ts';
import {content,taskMap,itemMap} from '../src/languages/mandarin/content/index.ts';
import {objectFor} from '../src/languages/mandarin/session.ts';
import {updateRelation,DAY} from '../src/core/progress/model.ts';
import {writingTargets} from '../src/languages/mandarin/writing-targets.ts';
const event=(taskId,type,at,detail={})=>({id:crypto.randomUUID(),at,sessionId:'s'+at,taskId,type,detail,contentVersion:'test'});
function simulation(errors=false){let events=[],relations=[];const introduced=[];let now=DAY*100;
 for(let session=0;session<20;session++){
  const plan=composeContinuous(relations,events,'hant',now),known=new Set(exposure(events).keys());
  assert(plan.length<=DOSING.tasks+1);assert(plan.includes('closure'));
  assert(plan.filter(id=>taskMap.get(id).kind==='encounter').length<=3);
  for(const id of plan){const t=taskMap.get(id);if(t.kind==='closure')continue;
   const i=itemMap.get(t.itemId);
   if(t.kind==='encounter'){assert(i.learning?.prerequisites.every(id=>known.has(id))??true);known.add(i.id);introduced.push(i.id);}
   else if(t.itemId)assert(known.has(t.itemId),`unintroduced retrieval ${id}`);
   events.push(event(id,'task_presented',now),event(id,'task_completed',now));
   if(t.target){const result=errors&&session<3?'failure':'success';events.push(event(id,'attempt',now,{result,assisted:false}));const a={objectId:objectFor(t,'hant'),target:t.target,result,assisted:false,sessionId:'s'+session,at:now};const old=relations.find(r=>r.objectId===a.objectId&&r.target===a.target);relations=relations.filter(r=>r!==old);relations.push(updateRelation(old,a));}
   now+=60_000;
  }now+=session%4===3?DAY:30*60_000;
 }return {events,relations,introduced,now};}
test('strong multi-day learner advances through all 28 new objects with old recall and mixed modalities',()=>{
 const s=simulation();assert.equal(new Set(s.introduced).size,36);assert(s.events.some(e=>e.type==='attempt'&&e.taskId==='hear-nihao'));assert(new Set(s.events.filter(e=>e.type==='attempt').map(e=>taskMap.get(e.taskId).kind)).size>=3);
});
test('errors reduce new dosing, consolidate without immediate loops, and later allow advancement',()=>{
 const events=['hear-nihao','read-wo','read-ni'].flatMap(id=>[event(id,'attempt',100,{result:'failure',assisted:false})]);
 const plan=composeContinuous([],events,'hant',1000);assert(plan.filter(id=>taskMap.get(id).kind==='encounter').length<=1);assert.equal(new Set(plan).size,plan.length);
 assert(simulation(true).introduced.length>20);
});
test('short pause resumes cursor; a day or several days rebuilds from durable history',()=>{
 const s={id:'s',plannerVersion:'d1',plan:['meet-nihao','meet-wo','closure'],index:1,completed:false,startedAt:100,updatedAt:100,script:'hant'};
 assert(shouldResume(s,200));assert(!shouldResume({...s,plannerVersion:undefined},200));assert(!shouldResume(s,DAY));assert(!shouldResume(s,5*DAY));
 const events=[event('meet-nihao','task_completed',100)];for(const now of [DAY,5*DAY]){const plan=composeContinuous([],events,'hant',now);assert(plan.some(id=>taskMap.get(id).itemId==='nihao'&&taskMap.get(id).kind!=='encounter'));assert(!plan.includes('meet-nihao'));assert(plan.includes('meet-wo'));}
});
test('all new writing targets share configuration and only two immediate productions',()=>{
 for(const id of ['ren','yi','er','san','shi-number']){const m=writingTargets[id];assert(m);assert.equal(m.levels.length,2);assert.equal(m.data.strokes.length,m.data.medians.length);assert(itemMap.get(id).learning.writing);}
 assert.equal(writingTargets.hao.levels.length,4);
});

test('merely opening an unrevealed object never unlocks its assessment',()=>{
 const events=[event('d-meet-dont-understand','task_presented',100)];
 assert(!exposure(events).has('dont-understand'));
 const plan=composeContinuous([],events,'hant',DAY);assert(!plan.some(id=>id==='d-recall-dont-understand'||id==='d-hear-dont-understand'));
});

test('optional continuation cannot bypass the untaught-tone assessment gate',()=>{
 const events=[event('meet-wojiao','task_completed',1),event('tones','skip',2)];
 const plan=composeContinuous([],events,'hant',DAY);
 assert(plan.every(id=>!taskMap.get(id).assess?.toneNotation));
});
