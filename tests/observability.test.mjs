import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';import {execFileSync} from 'node:child_process';
import {ActiveTime,IDLE_MS} from '../src/core/observability/activeTime.ts';
import {attemptContext} from '../src/core/observability/evidence.ts';
import {learningReport,reportMarkdown} from '../src/core/observability/report.ts';
import {itemMap,taskMap} from '../src/languages/mandarin/content/index.ts';
const H=3_600_000;
const ev=(id,at,type,detail={},taskId='recall-nihao')=>({id,at,type,detail,taskId,sessionId:'session',contentVersion:'build-d-1'});
const intro=(id,item,at,dimensions)=>{const i=itemMap.get(item);return ev(id,at,'introduction_dimensions',{item,form:i.hant,script:'hant',toneNumbers:i.toneNumbers,introductionVersion:1,dimensions});};
test('active time caps inactivity, excludes hidden and overlapping waits, and resumes without adding the gap',()=>{
 const c=new ActiveTime(0);assert.equal(c.read(10_000),10_000);assert.equal(c.read(120_000),IDLE_MS);
 c.touch(130_000);assert.equal(c.read(140_000),70_000);
 c.block('hidden',true,140_000);c.block('saving',true,150_000);c.block('hidden',false,180_000);assert.equal(c.read(190_000),70_000);
 c.block('saving',false,200_000);assert.equal(c.read(210_000),80_000);
 assert.equal(c.read(210_000),80_000);
});
test('assessment provenance preserves writing mode, self report, and omits correction text',()=>{
 assert.equal(attemptContext(taskMap.get('read-nihao')).evidence,'app_checked');
 const p=attemptContext(taskMap.get('write-recall'),{mode:'paper',selfReport:true,writingRecall:true,correction:'private typed value'});
 assert.equal(p.evidence,'self_report');assert.equal(p.writingRecall,true);assert(!('correction' in p));
 assert.equal(attemptContext(taskMap.get('write-recall')).evidence,'unknown');
});
test('report separates lexical success from incorrect tone notation and computes actual elapsed times with sources',()=>{
 const events=[intro('intro','nihao',1000,'meaning,pronunciation,hanzi'),ev('tone',2000,'tone_attention_confirmed',{item:'nihao',toneNumbers:'ni3 hao3',attentionVersion:1}),ev('notation',3000,'tone_notation_introduced',{},'tones'),
 ev('a',24*H,'attempt',{item:'nihao',script:'hant',result:'success',assisted:false,evidence:'app_checked',assessToneNotation:true,toneNotation:'different'}),
 ev('b',49*H,'attempt',{item:'nihao',result:'success',assisted:true,evidence:'app_checked'})];
 const r=learningReport(events),lex=r.rows.find(x=>x.eventId==='a'&&x.dimension==='written_phrase_retrieval'),tone=r.rows.find(x=>x.dimension==='tone_notation'),later=r.rows.find(x=>x.eventId==='b');
 assert.equal(lex.outcome,'unaided_success');assert.equal(tone.outcome,'failed_or_unsure');assert.equal(tone.sinceIntroductionMs,24*H-3000);
 assert.deepEqual(tone.introductionEventIds,['tone','notation']);assert.equal(later.previousEventId,'a');assert.equal(later.sincePreviousRetrievalMs,25*H);assert.equal(later.outcome,'assisted_success');
 assert.equal(lex.band,'20–48h');assert.equal(r.rows.length,3);
});
test('self reports, guided/independent writing and unknown historical evidence never become pronunciation proof',()=>{
 const r=learningReport([intro('intro','nihao',1,'meaning,pronunciation'),
 ev('spoken',H,'screenless_recall',{item:'nihao',result:'success',assisted:false,evidence:'self_report',pronunciation:'unknown'}),
 ev('reveal',2*H,'screenless_recall',{item:'nihao',result:'unsure',assisted:true,revealedBeforeAttempt:true}),
 ev('paper',3*H,'paper_recall',{items:'hao,ni,wo',result:'success',assisted:false}),
 ev('guided',4*H,'attempt',{item:'hao',result:'success',assisted:true,evidence:'app_checked',writingRecall:false,mode:'screen'},'write-recall'),
 ev('free',5*H,'attempt',{item:'hao',result:'success',assisted:false,evidence:'app_checked',writingRecall:true,mode:'screen'},'write-recall'),
 ev('old',6*H,'attempt',{item:'hao',result:'success'},'write-recall'),ev('record',7*H,'recording_completed_uncertain',{activeMs:999999})]);
 assert.equal(r.rows[0].provenance,'self_report');assert.equal(r.rows[1].outcome,'revealed');assert.equal(r.rows[2].dimension,'paper_writing_group');
 assert.equal(r.rows[3].phase,'guided_production');assert.equal(r.rows[4].dimension,'independent_writing');assert.equal(r.rows[5].dimension,'writing_mode_unknown');assert.equal(r.rows[5].outcome,'unknown');assert.equal(r.rows[5].provenance,'unknown');
 assert.equal(r.rows.length,6);assert.equal(r.activeMs,0);
});
test('timing uses visit maxima, help counts do not classify replays as assistance, optional attempts are excluded',()=>{
 const timed={observabilityVersion:1,activeVisitId:'v',activeTaskMs:1000};
 const r=learningReport([ev('t1',1,'task_presented',timed),ev('t2',2,'active_time',{...timed,activeTaskMs:4000}),ev('t3',3,'session_pause',{...timed,activeTaskMs:4000}),ev('t4',4,'active_time',{...timed,activeVisitId:'v2',activeTaskMs:2000}),ev('legacy',5,'attempt',{activeMs:900000}),ev('help',6,'pinyin_reveal'),ev('audio',7,'audio_replay'),ev('optional',8,'inspection_practice_attempt',{result:'success',assisted:false})]);
 assert.equal(r.activeMs,6000);assert.equal(r.timedVisits,2);assert.deepEqual(r.activeVisitEvidence[0].eventIds,['t1','t2','t3']);assert.deepEqual(r.assistance,{pinyin_reveal:['help']});assert.equal(r.rows.length,1);
 assert.equal(r.rows[0].introductionAt,null);assert.equal(r.rows[0].outcome,'unknown');
 assert.throws(()=>learningReport([ev('duplicate',1,'x'),ev('duplicate',2,'y')]));
});
test('historical display is not introduction and script mismatches keep visual intervals unknown',()=>{
 const r=learningReport([ev('display',1,'task_presented',{item:'nihao'}),intro('intro','nihao',2,'meaning,hanzi'),ev('read',H,'attempt',{item:'nihao',script:'hans',result:'success',assisted:false},'read-nihao')]);
 assert.equal(r.rows[0].sinceIntroductionMs,null);assert.equal(r.rows[0].provenance,'app_checked');assert.equal(r.introductions.length,2);
});
test('local CLI creates traceable Markdown and JSON from a small backup fixture',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'learning-report-'));
 try {const backup=join(dir,'backup.json'),out=join(dir,'report');await writeFile(backup,JSON.stringify({events:[intro('i','nihao',1,'meaning,pronunciation'),ev('r',H,'attempt',{item:'nihao',result:'success',assisted:false})]}));
 execFileSync(process.execPath,['scripts/learning-report.mjs',backup,'--out',out]);
 const json=JSON.parse(await readFile(out+'.json','utf8')),md=await readFile(out+'.md','utf8');assert.equal(json.rows[0].eventId,'r');assert.equal(json.rows[0].sinceIntroductionMs,H-1);assert(md.includes('1/1'));assert(!md.includes('%'));assert.equal(reportMarkdown(json),md);
 } finally {await rm(dir,{recursive:true,force:true});}
});

test('reintroduction is visible and prevents overstating the latest retrieval delay',()=>{
 const r=learningReport([intro('i','nihao',1,'meaning,pronunciation'),ev('a',H,'attempt',{item:'nihao',result:'success',assisted:false}),intro('again','nihao',24*H,'meaning,pronunciation'),ev('b',25*H,'attempt',{item:'nihao',result:'success',assisted:false})]);
 const last=r.rows.at(-1);assert.equal(last.sincePreviousRetrievalMs,24*H);assert.equal(last.sinceIntroductionMs,H);assert.equal(last.delayMs,H);assert.deepEqual(last.introductionEventIds,['again','again']);assert.equal(r.introductions.length,4);
});
