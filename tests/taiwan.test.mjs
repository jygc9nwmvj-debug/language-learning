import test from 'node:test';
import assert from 'node:assert/strict';
import {taiwan,activityMap,taiwanActivities,appTaskMap,checkTaiwanIntegration,composeLearning} from '../src/languages/mandarin/taiwan/course.ts';
import {content} from '../src/languages/mandarin/content/index.ts';
const foundationEvents=()=>content.tasks.filter(t=>t.kind==='encounter').map(t=>({id:t.id,taskId:t.id,type:'task_completed',at:Date.now(),sessionId:'foundation',contentVersion:'build-d-1',detail:{}}));
const event=(id,script='hant',at=0)=>({id,taskId:id,type:'taiwan_completed',at,sessionId:'test',contentVersion:'taiwan-text-1',detail:{script,listening:true}});
test('bounded Taiwan population: 134 objects, 28 dialogues, all 221 exercises and 38 matching groups reachable',()=>{
 assert.deepEqual(checkTaiwanIntegration(),{objects:134,dialogues:28,utterances:176,exercises:221,activities:292,matching:38,deferredAudioMatching:0,writing:10});
 for(const a of activityMap.values())assert.ok(appTaskMap.has(a.id));
 for(const d of taiwan.dialogues)for(const check of d.sentenceChecks){assert.equal(check.exercise,'sense:'+check.utterance);assert.ok(taiwan.exercises.some(x=>x.id===check.exercise));}
 assert.equal(content.items.length,36);assert.equal(content.words.length,44);
});
test('ordinary Weiterlernen reaches every Taiwan activity; no mastery or audio gate; no repeated completed activity',()=>{
 let events=foundationEvents(),seen=new Set();
 for(let n=0;n<300;n++){
  const plan=composeLearning([],events,'hant',Date.now());assert.equal(plan.at(-1),'closure');
  const selected=plan.filter(id=>activityMap.has(id));if(!selected.length)break;
  for(const id of selected){assert.equal(seen.has(id),false,id);seen.add(id);events.push(event(id,'hant',Date.now()));}
 }
 assert.equal(seen.size,taiwanActivities.length);
 assert.equal(new Set(taiwanActivities.filter(a=>a.kind==='object').map(a=>a.ref)).size,134);
 assert.equal(new Set(taiwanActivities.filter(a=>a.kind==='dialogue').map(a=>a.ref)).size,28);
});
test('script-specific completion and delayed writing stay separate from listening evidence',()=>{
 const first=taiwanActivities[0];assert.ok(composeLearning([],[...foundationEvents(),event(first.id)],'hans',1).includes(first.id));
 assert.equal(composeLearning([],[...foundationEvents(),event(first.id)],'hant',1).includes(first.id),false);
 const w=taiwan.writing[0],events=[...foundationEvents(),event(`tw:writing:${w.id}`,'hant',0)];
 assert.equal(composeLearning([],events,'hant',60_000).some(id=>id.startsWith('tw:writing-recall:')),false);
 assert.ok(composeLearning([],events,'hant',21*3_600_000).includes(`tw:writing-recall:${w.id}`));
 for(const a of activityMap.values())assert.equal(appTaskMap.get(a.id).target,undefined);
});
import {restoreTextState} from '../src/languages/mandarin/taiwan/state.ts';
test('malformed imported UI checkpoints restart teaching instead of crashing or granting completion',()=>{
 for(const value of ['{}','null','{"phase":"done"}','broken'])assert.equal(restoreTextState(value),undefined);
});

test('previous text-only dialogue completion gets one hearing follow-up without rewriting reading evidence',()=>{
 const id='tw:dialogue:G01',old={...event(id),detail:{script:'hant',listening:false}};
 const events=[...foundationEvents(),old];
 assert.ok(composeLearning([],events,'hant',1).includes('tw:listening-dialogue:G01'));
 assert.equal(composeLearning([],events,'hant',1).includes(id),false);
 assert.equal(composeLearning([],events.concat(event('tw:listening-dialogue:G01')),'hant',1).includes('tw:listening-dialogue:G01'),false);
 assert.equal(old.detail.listening,false);
});
