import test from 'node:test';import assert from 'node:assert/strict';import 'fake-indexeddb/auto';
import {matchingSets,matchingEligible,shuffled,selectMatching,matchingState,reserveMatching,commitMatchingPair,matchingAudio,finishMatching} from '../src/languages/mandarin/matching.ts';
import {content,itemMap} from '../src/languages/mandarin/content/index.ts';
import {introductionDetail} from '../src/languages/mandarin/introduction.ts';
import {composeContinuous,firstRetrievalAges} from '../src/languages/mandarin/continuous.ts';
import {selectTransfer} from '../src/languages/mandarin/mini-transfer.ts';
import {db,exportLearningState,importLearningState} from '../src/core/progress/db.ts';
const now=1_000_000;
const session={id:'matching-boundary',plan:['read-wo','closure'],index:1,plannerVersion:'d1',script:'hant',startedAt:1,updatedAt:now,completed:false};
const ev=(id,type,detail={},taskId='fixture',at=100)=>({id,type,detail,taskId,at,sessionId:'prior',contentVersion:'test'});
const intro=(id,dimensions=['meaning','hanzi','pronunciation'],script='hant')=>ev('intro-'+id,'introduction_dimensions',introductionDetail(itemMap.get(id),script,dimensions,'test'));
const allIntro=()=>[...new Set(matchingSets.flatMap(s=>s.items))].map(id=>intro(id));
const baseline=()=>allIntro().concat(ev('complete','task_completed',{},'meet-wo',200));
test('exhaustive pool: 7 curated whole-object groups, 14 variants, 18 objects; existing assets only',()=>{
 assert.equal(matchingSets.length,14);assert.equal(new Set(matchingSets.map(s=>s.id)).size,14);
 const pool=[...new Set(matchingSets.flatMap(s=>s.items))];assert.equal(pool.length,18);
 assert.deepEqual(pool.map(id=>itemMap.get(id).hant).sort(),['我','你','人','好','請','你好','德國','中國','一','四','七','二','五','八','三','六','九','十'].sort());
 for(const s of matchingSets){assert.equal(s.items.length,s.id.startsWith('countries:')?2:3);assert.equal(new Set(s.items).size,s.items.length);for(const id of s.items)assert(content.items.some(i=>i.id===id&&i.audio));}
});
for(const set of matchingSets)test(`${set.id}: eligibility requires each whole item's exact introduced dimensions`,()=>{
 const history=set.items.map(id=>intro(id));assert(matchingEligible(set,'hant',history));assert(!matchingEligible(set,'hans',history));
 for(const id of set.items){for(const dimension of ['meaning','hanzi',...(set.relation==='audio-form'?['pronunciation']:[])]){
  const events=set.items.map(x=>intro(x,x===id?['meaning','hanzi','pronunciation'].filter(d=>d!==dimension):undefined));assert(!matchingEligible(set,'hant',events),`${id} missing ${dimension}`);
 }assert(!matchingEligible(set,'hant',history.filter(e=>e.detail.item!==id)));}
 assert(!matchingEligible(set,'hant',history.map(e=>({...e,detail:{...e.detail,optionalPractice:true}}))));
 assert(!matchingEligible(set,'hant',[intro('im-german'),intro('nihao'),intro('nationality')]));
 assert(matchingEligible(set,'hans',set.items.map(id=>intro(id,undefined,'hans'))));
});
test('independent Fisher-Yates draws, not shared positions or canonical sorting',()=>{
 let n=0;const draws=[0,0,.99,.99],items=['a','b','c'];
 const a=shuffled(items,()=>draws[n++]),b=shuffled(items,()=>draws[n++]);assert.notDeepEqual(a,b);assert.equal(n,4);assert.deepEqual(items,['a','b','c']);
 let seed=3;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);const arrangements=new Set(),positions=new Set();
 for(let run=0;run<100;run++){const left=shuffled(items,random),right=shuffled(items,random);arrangements.add(left.join('')+right.join(''));positions.add(left.indexOf('a')+':'+right.indexOf('a'));}
 assert.equal(positions.size,9);assert(arrangements.size>25);
});
test('boundary-only finite additional offers; transfer, paper and selected repairs retain precedence',()=>{
 const history=baseline();assert(selectMatching(session,history,['meet-nihao','closure']));
 assert.equal(selectMatching({...session,index:0},history,['meet-nihao']),null);
 for(const type of ['transfer_seen','paper_offered'])assert.equal(selectMatching(session,[...history,{...ev(type,type),sessionId:session.id}],['meet-nihao']),null);
 for(const detail of [{result:'failure',assisted:false},{result:'success',assisted:true}])assert.equal(selectMatching(session,[...history,ev('repair','attempt',detail,'read-wo')],['read-wo','closure']),null);
 const seen=matchingSets.map(s=>ev(s.id,'matching_started',{setId:s.id}));assert.equal(selectMatching(session,[...history,...seen],['meet-nihao']),null);
});
test('atomic run/pairs, supported retry, elimination, replay and reload preserve plans and all ordinary evidence',async()=>{
 await db.delete();await db.open();await db.sessions.put(session);await db.events.bulkPut(baseline());
 const relation={id:'cmn:nihao|listening',objectId:'cmn:nihao',target:'listening',state:'STABLE',attempts:4,delayedSuccesses:2,lastAt:1,lastSession:'earlier',dueAt:now+86400000};await db.relations.put(relation);
 const beforeEvents=await db.events.toArray(),beforePlan=composeContinuous([relation],beforeEvents,'hant',now),beforeAges=firstRetrievalAges(beforeEvents),beforeTransfer=selectTransfer(session,beforeEvents,now);
 const [a,b]=await Promise.all([reserveMatching(session,now),reserveMatching(session,now)]);assert.equal(a.runId,b.runId);
 const initial=matchingState(await db.events.toArray(),session);assert.deepEqual(initial,a);
 const [x,y,...rest]=a.left;
 if(matchingSets.find(s=>s.id===a.setId).relation==='audio-form'){
  assert.equal((await commitMatchingPair(session,a.runId,0,x,x)).attempts,0);
  await matchingAudio(session,a.runId,x);await matchingAudio(session,a.runId,x);
 }
 let state=await commitMatchingPair(session,a.runId,0,x,y);assert(state.hadError);
 if(matchingSets.find(s=>s.id===a.setId).relation==='audio-form')for(const id of a.left)await matchingAudio(session,a.runId,id);
 const first=await Promise.all([commitMatchingPair(session,a.runId,1,x,x),commitMatchingPair(session,a.runId,1,x,x)]);assert.equal(first[0].attempts,2);assert.equal(first[1].attempts,2);
 db.close();await db.open();state=matchingState(await db.events.toArray(),session);assert.equal(state.attempts,2);assert.deepEqual(state.left,initial.left);assert.deepEqual(state.right,initial.right);
 for(const id of [y,...rest])state=await commitMatchingPair(session,a.runId,state.attempts,id,id);
 const backup=await exportLearningState();await finishMatching(session,a.runId);await finishMatching(session,a.runId);
 await importLearningState(backup,new Set(content.tasks.map(t=>t.id)));
 assert(matchingState(await db.events.toArray(),session).done);
 const events=await db.events.toArray(),pairs=events.filter(e=>e.type==='matching_pair');
 assert.equal(events.filter(e=>e.type==='matching_completed').length,1);assert(pairs.slice(1).every(e=>e.detail.assisted===true&&e.detail.independent===false));assert.equal(pairs.at(-1).detail.elimination,true);
 assert.deepEqual(await db.relations.toArray(),[relation]);assert.deepEqual(await db.sessions.get(session.id),session);
 assert.deepEqual(composeContinuous([relation],events,'hant',initial.plannedAt),beforePlan);assert.deepEqual(firstRetrievalAges(events),beforeAges);assert.deepEqual(selectTransfer(session,events,now),beforeTransfer);
 assert.deepEqual(events.filter(e=>!e.type.startsWith('matching_')),beforeEvents);
 assert.deepEqual((await reserveMatching(session,now+100000)).runId,a.runId);await db.delete();
});
test('last pair never independent even without an error',async()=>{
 await db.open();await db.sessions.put(session);await db.events.bulkPut(baseline());
 let state=await reserveMatching(session,now);for(const id of state.left){await matchingAudio(session,state.runId,id);state=await commitMatchingPair(session,state.runId,state.attempts,id,id);}
 const pairs=(await db.events.toArray()).filter(e=>e.type==='matching_pair').sort((a,b)=>a.detail.sequence-b.detail.sequence);
 assert(pairs.slice(0,-1).every(e=>e.detail.independent===true));assert.equal(pairs.at(-1).detail.independent,false);assert.equal(pairs.at(-1).detail.elimination,true);await db.delete();
});
