import 'fake-indexeddb/auto';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { db } from '../src/core/progress/db.ts';
import { content,itemMap } from '../src/languages/mandarin/content/index.ts';
import { introductionDetail } from '../src/languages/mandarin/introduction.ts';
import { transferCases,readyForTransfer,assessTransfer } from '../src/languages/mandarin/transfer-cases.ts';
import { reserveTransfer,saveTransfer,finishTransfer,transferState,atTransfer,selectTransfer,TRANSFER_SPACING } from '../src/languages/mandarin/mini-transfer.ts';
import {composeContinuous} from '../src/languages/mandarin/continuous.ts';
import {answers} from './fixtures/transfer-answers.mjs';
const now=Date.now();
const session={id:'transfer-test',plannerVersion:'d1',plan:['read-wo','hear-askname','closure'],index:2,completed:false,startedAt:now,updatedAt:now,script:'hant'};
const history=[...new Set(transferCases.flatMap(c=>c.turns.map(t=>t.itemId)))].flatMap(id=>[
 {id:crypto.randomUUID(),sessionId:'earlier',at:now-86400000,contentVersion:'build-d-1',taskId:content.tasks.find(t=>t.kind==='encounter'&&t.itemId===id).id,type:'introduction_dimensions',detail:introductionDetail(itemMap.get(id),'hant',['meaning','pronunciation'],'synthetic-test')},
 {id:crypto.randomUUID(),sessionId:'earlier',at:now-3600000,contentVersion:'build-d-1',taskId:content.tasks.find(t=>t.kind==='listen'&&t.itemId===id).id,type:'attempt',detail:{result:'success',assisted:false}},
]);
const completed=Array.from({length:8},(_,i)=>({id:'complete'+i,sessionId:'earlier',at:now-10000+i,contentVersion:'build-d-1',taskId:'hear-nihao',type:'task_completed',detail:{}}));
for(const c of transferCases)for(const [outcome,examples] of Object.entries(answers[c.id]))for(const answer of examples)test(`${c.id}: ${outcome}: ${answer}`,()=>assert.equal(assessTransfer(c,answer).outcome,outcome));
test('pool consists exclusively of current canonical audio/items and unique non-item sequences',()=>{
 const sequences=new Set();
 for(const c of transferCases){
  assert(c.turns.length>=2&&c.turns.length<=4);assert(c.components.length>=2);
  const sequence=c.turns.map(t=>t.itemId).join('|');assert(!sequences.has(sequence));sequences.add(sequence);
  assert(!content.tasks.some(t=>t.sequence?.join('|')===sequence));
  assert(!content.items.some(i=>i.hant===c.turns.map(t=>itemMap.get(t.itemId).hant).join('')));
  for(const t of c.turns)assert(readFileSync(new URL('../public'+itemMap.get(t.itemId).audio,import.meta.url)).length>1000);
 }
});
test('every case requires actual introduction and unaided listening, not optional practice',()=>{
 for(const c of transferCases){assert(readyForTransfer(c,history));assert(!readyForTransfer(c,[]));
 assert(!readyForTransfer(c,history.filter(e=>e.type==='attempt')));
 assert(!readyForTransfer(c,history.map(e=>({...e,detail:{...e.detail,assisted:true}}))));
 assert(!readyForTransfer(c,history.map(e=>({...e,detail:{...e.detail,optionalPractice:true}}))));}
});
test('additional boundary operation: minimum work, cooldown, no repeated dialogue even at newer revision',()=>{
 assert.equal(selectTransfer(session,history,now),null);
 assert.equal(selectTransfer({...session,index:1},[...history,...completed],now),null);
 assert.equal(selectTransfer(session,[...history,...completed],now).id,'name-repeat');
 const seen={id:'seen',type:'transfer_seen',taskId:'transfer:name-repeat',sessionId:'prior',at:now,detail:{caseId:'name-repeat',revision:0}};
 assert.equal(selectTransfer(session,[...history,...completed,seen],now),null);
 const later=[...history,seen,...completed.map(e=>({...e,at:now+TRANSFER_SPACING+1}))];
 assert.equal(selectTransfer(session,later,now+TRANSFER_SPACING+2).id,'origin-slower');
 assert.equal(selectTransfer(session,[...history,...completed],now,true).id,'origin-slower');
});
test('transactional seen, scored evidence, reload and continuation leave plan, scheduler input and relations intact',async()=>{
 await db.delete();await db.open();await db.sessions.put(session);await db.events.bulkAdd([...history,...completed]);
 const relation={id:'cmn:askname|listening',objectId:'cmn:askname',target:'listening',state:'DEVELOPING',attempts:1,delayedSuccesses:0,lastAt:2,lastSession:'earlier',dueAt:999999};await db.relations.put(relation);
 const before=composeContinuous([relation],[...history,...completed],'hant',now);
 const state=await reserveTransfer(session,now);assert(atTransfer(session,state));
 await Promise.all([reserveTransfer(session,now),reserveTransfer(session,now)]);
 assert.equal((await db.events.toArray()).filter(e=>e.type==='transfer_seen').length,1);
 await assert.rejects(saveTransfer(session,{phase:'result'}));
 await saveTransfer(session,{heard:true,plays:1,phase:'answer',answer:'A soll die Frage nach Bs Namen wiederholen.'});
 db.close();await db.open();assert.equal((await transferState()).phase,'answer');
 await saveTransfer(session,{knownBefore:true});
 await saveTransfer(session,{phase:'result'});await saveTransfer(session,{phase:'result'});
 assert.equal((await db.events.toArray()).filter(e=>e.type==='transfer_assessed').length,1);
 assert.equal((await transferState()).assessment.outcome,'complete');
 const assessed=(await db.events.toArray()).find(e=>e.type==='transfer_assessed');assert.equal(assessed.detail.firstAppExposure,false);assert.equal(assessed.detail.knownBefore,true);
 await saveTransfer(session,{answer:'stale draft',phase:'answer'});assert.equal((await transferState()).phase,'result');
 assert.deepEqual(await finishTransfer(session),session);assert.deepEqual(await db.sessions.get(session.id),session);
 assert.deepEqual(await db.relations.toArray(),[relation]);
 assert.deepEqual(composeContinuous([relation],await db.events.toArray(),'hant',now),before);
 assert.equal((await reserveTransfer(session,now)).phase,'done');
 await db.delete();
});
