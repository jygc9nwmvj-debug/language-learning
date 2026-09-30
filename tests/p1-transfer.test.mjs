import 'fake-indexeddb/auto';
import test from 'node:test';
import assert from 'node:assert/strict';
import { db, exportLearningState, importLearningState } from '../src/core/progress/db.ts';
import { transferCases, assessTransfer } from '../src/languages/mandarin/transfer-cases.ts';
import { saveTransfer, finishTransfer, transferState, transferKey } from '../src/languages/mandarin/mini-transfer.ts';
const s={id:'p1-run',plan:['closure'],index:0,completed:false,startedAt:1,updatedAt:1,script:'hant'};
const draft={caseId:'origin-slower',revision:1,sessionId:s.id,index:0,phase:'answer',answer:'A soll langsam sprechen. Mit Bs Herkunft hat das nichts zu tun.',heard:true,plays:1,firstSeenAt:1};
const valid=new Set(['closure']);
async function setup(){await db.delete();await db.open();await db.sessions.put(s);await db.preferences.put({key:transferKey,value:JSON.stringify(draft)});}
const scores=async()=> (await db.events.toArray()).filter(e=>e.type==='transfer_assessed');
test('audit contradiction and ordinary answers only yield cue evidence, including persisted results',async()=>{
 await setup();
 for(const answer of [draft.answer,'A soll langsamer nach Bs Herkunft fragen.','Keine Ahnung.']) {
  const a=assessTransfer(transferCases.find(c=>c.id===draft.caseId),answer);
  assert.equal(a.outcome,'features-only');
 }
 assert.equal(assessTransfer(transferCases[1],draft.answer).cueCoverage,'all');
 await saveTransfer(s,{phase:'result'});
 assert.equal((await scores())[0].detail.outcome,'features-only');
 assert.equal((await scores())[0].detail.evidence,'bounded_cues_v2');
 assert.equal((await scores())[0].detail.cueCoverage,'all');
 await db.delete();
});
test('newer assessed backup wins over draft; reverse/repeated imports and submissions preserve one result',async()=>{
 await setup(); const older=await exportLearningState();
 await saveTransfer(s,{answer:'A soll langsamer nach Bs Herkunft fragen.',phase:'result'});
 const newer=await exportLearningState(), original=await scores();
 await db.delete();await db.open();await importLearningState(older,valid);await importLearningState(newer,valid);
 assert.equal((await transferState()).phase,'result');
 assert.equal((await transferState()).answer,'A soll langsamer nach Bs Herkunft fragen.');
 await saveTransfer(s,{phase:'result',answer:'changed'});
 await importLearningState(older,valid);await importLearningState(newer,valid);
 assert.deepEqual(await scores(),original);assert.equal((await scores()).filter(e=>e.detail.firstAppExposure).length,1);
 await finishTransfer(s);const finished=await exportLearningState();
 await db.delete();await db.open();await importLearningState(older,valid);await importLearningState(finished,valid);
 assert.equal((await transferState()).phase,'done');
 await assert.rejects(saveTransfer(s,{phase:'result'}));assert.deepEqual(await scores(),original);
 await db.delete();
});
test('reload and event-backed recovery block a second rating even when an old draft survived an earlier import',async()=>{
 await setup();await saveTransfer(s,{answer:'A soll langsamer nach Bs Herkunft fragen.'});db.close();await db.open();
 assert.equal((await transferState()).phase,'answer');assert.match((await transferState()).answer,/langsamer/);
 await saveTransfer(s,{phase:'result'});const original=await scores();
 await db.preferences.put({key:transferKey,value:JSON.stringify(draft)});
 assert.equal((await transferState()).phase,'result');await saveTransfer(s,{phase:'result'});assert.deepEqual(await scores(),original);
 // A different occurrence is not overwritten by an unrelated finalized backup.
 const unrelated={...draft,sessionId:'other',firstSeenAt:42};await db.preferences.put({key:transferKey,value:JSON.stringify(unrelated)});
 const backup=JSON.parse(await exportLearningState());backup.preferences=[{key:transferKey,value:JSON.stringify({...draft,phase:'done'})}];
 await importLearningState(JSON.stringify(backup),valid);assert.equal((await transferState()).sessionId,'other');assert.equal((await transferState()).phase,'answer');
 await db.delete();
});
test('legacy classifications are displayed conservatively without rewriting historic events',async()=>{
 await setup();const legacy={...draft,phase:'result',assessment:{outcome:'complete',recognized:['slower','origin-question'],missing:[],uncertain:false}};
 await db.preferences.put({key:transferKey,value:JSON.stringify(legacy)});
 assert.equal((await transferState()).assessment.outcome,'features-only');assert.equal((await transferState()).assessment.cueCoverage,'all');
 await db.delete();
});
test('ordinary merge retains local preferences and newer relations/sessions, and preserves event history',async()=>{
 await setup();
 await db.preferences.put({key:'name',value:'Local'});
 const relation={id:'cmn:hao|listening',objectId:'cmn:hao',target:'listening',state:'DEVELOPING',attempts:1,delayedSuccesses:0,lastAt:10,lastSession:'prior',dueAt:100};
 await db.relations.put(relation);
 const imported=JSON.parse(await exportLearningState());
 imported.preferences=[{key:'name',value:'Imported'},{key:'script',value:'hans'}];
 imported.sessions[0].updatedAt=20;
 imported.relations[0]={...relation,lastAt:20,dueAt:200,attempts:2};
 await importLearningState(JSON.stringify(imported),valid);
 assert.equal((await db.preferences.get('name')).value,'Local');assert.equal((await db.preferences.get('script')).value,'hans');
 assert.equal((await db.sessions.get(s.id)).updatedAt,20);assert.equal((await db.relations.get(relation.id)).dueAt,200);
 await db.delete();
});
