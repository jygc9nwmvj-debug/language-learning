import test from 'node:test';import assert from 'node:assert/strict';
import {screenlessFor,paperFor,meaningfulStop,screenlessEvidence,HYBRID} from '../src/languages/mandarin/hybrid.ts';
import {itemMap} from '../src/languages/mandarin/content/index.ts';
import {composeContinuous,shouldResume} from '../src/languages/mandarin/continuous.ts';
const now=100*86_400_000;
const session={id:'current',plannerVersion:'d1',plan:['meet-ni','meet-wo','d-recall-speak-slowly','closure'],index:2,script:'hant',startedAt:now,updatedAt:now,completed:false};
const event=(type,detail={},extra={})=>({id:crypto.randomUUID(),sessionId:'old',at:now-HYBRID.cooldownMs-1,taskId:'fixture',type,detail,contentVersion:'test',...extra});
const intro=id=>{const item=itemMap.get(id);return event('introduction_dimensions',{item:id,form:item.hant,script:'hant',toneNumbers:item.toneNumbers,introductionVersion:1,dimensions:item.introduction.dimensions.join(',')});};
const completed=['meet-ni','meet-wo','meet-hao','read-ni','read-wo'].map(taskId=>event('task_completed',{}, {sessionId:'current',at:now,taskId}));
test('screenless replaces only eligible delayed known recall, at most once per session/cooldown',()=>{
 const history=[intro('speak-slowly')];assert(screenlessFor(session,history,now));
 assert(!screenlessFor(session,[],now));assert(!screenlessFor({...session,index:0},history,now));
 assert(!screenlessFor(session,[{...history[0],at:now-100}],now));
 assert(!screenlessFor(session,[...history,event('screenless_offered',{}, {at:now-1})],now));
 const offered=event('screenless_offered',{index:2},{sessionId:'current',taskId:'d-recall-speak-slowly',at:now});
 assert(screenlessFor(session,[...history,offered],now));assert(!screenlessFor(session,[...history,offered,event('screenless_recall',{index:2},{sessionId:'current',taskId:offered.taskId})],now));
 assert(!screenlessFor(session,[{...history[0],type:'inspection_introduction_dimensions'}],now));
});
test('paper requires three delayed writing introductions, never recognition alone or repeated same session',()=>{
 const s={...session,index:3},known=['hao','ni','wo'].map(intro),history=[...known,...completed];
 assert.equal(paperFor(s,history,now).length,3);assert.deepEqual(paperFor(s,history.slice(1),now),[]);
 assert.deepEqual(paperFor(s,[...completed,...known.map(e=>({...e,detail:{...e.detail,dimensions:'meaning,hanzi'}}))],now),[]);
 assert.deepEqual(paperFor(s,[...history,event('paper_skipped',{}, {sessionId:'current',at:now})],now),[]);
 assert.deepEqual(paperFor(s,[...history,event('paper_offered',{items:'hao,ni,wo'}, {sessionId:'other',at:now-1})],now),[]);
 assert.deepEqual(paperFor(session,history,now),[]);
});
test('screenless self reports preserve unknown pronunciation and revealed assistance',()=>{
 for(const choice of ['known','unsure','revealed']){const e=screenlessEvidence(choice);assert.equal(e.pronunciation,'unknown');assert.equal(e.evidence,'self_report');assert.equal(e.assisted,choice!=='known');}
 assert.equal(screenlessEvidence('revealed').revealedBeforeAttempt,true);
});
test('meaningful stop uses activity plus successful retrieval and avoids unresolved weak objects',()=>{
 const s={...session,index:3},success=[0,1].map(n=>event('attempt',{result:'success',assisted:false,objectId:'cmn:'+n},{sessionId:'current',at:now+n}));
 const history=[...completed,...success,{...intro('hao'),sessionId:'current'}];
 assert(meaningfulStop(s,history));assert(!meaningfulStop(s,history.filter(e=>e.type!=='attempt')));
 assert(!meaningfulStop(s,[...history,event('attempt',{result:'unsure',assisted:false,objectId:'weak'},{sessionId:'current',at:now+5})]));
 assert(!meaningfulStop(s,[...history,event('paper_recall',{result:'unsure'},{sessionId:'current'})]));
 assert(!meaningfulStop(s,[...history,event('voluntary_continue_after_stop',{}, {sessionId:'current'})]));
});
test('paper skip is no scheduler penalty and accepted stop never prevents another plan',()=>{
 const history=[intro('speak-slowly'),event('task_completed',{}, {taskId:'d-meet-speak-slowly'})];
 assert.deepEqual(composeContinuous([],history,'hant',now),composeContinuous([],[...history,event('paper_skipped',{items:'hao,ni,wo'})],'hant',now));
 const stopped={...session,completed:true};assert(!shouldResume(stopped,now));
 assert(composeContinuous([],[...history,event('session_stop_accepted')],'hant',now).some(id=>id!=='closure'));
});
