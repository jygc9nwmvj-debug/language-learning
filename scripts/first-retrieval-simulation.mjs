import {execFileSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {composeContinuous, DOSING} from '../src/languages/mandarin/continuous.ts';
import {taskMap} from '../src/languages/mandarin/content/index.ts';
import {objectFor, withSpacedRetry} from '../src/languages/mandarin/session.ts';
import {updateRelation, DAY} from '../src/core/progress/model.ts';

// Baseline is the last main revision before this rule. No simulated planner overlay.
const baselineRevision='40273a3';
const sourcePath='src/languages/mandarin/continuous.ts';
const temp=mkdtempSync(join(tmpdir(),'first-retrieval-'));
const baselineSource=execFileSync('git',['show',`${baselineRevision}:${sourcePath}`],{encoding:'utf8'}).replace(/from '(.*?)'/g,(_,path)=>`from '${new URL('../src/languages/mandarin/'+path,import.meta.url).href}'`);
writeFileSync(join(temp,'baseline.ts'),baselineSource);
const {composeContinuous:composeBaseline}=await import(pathToFileURL(join(temp,'baseline.ts')).href);
process.on('exit',()=>rmSync(temp,{recursive:true,force:true}));
const PROFILES={
  sicher:{success:.93,help:.02,failure:.05},
  gemischt:{success:.50,help:.25,failure:.25},
  unsicher:{success:.05,help:.20,failure:.75},
};
const HORIZONS=[30,60,120];
const RUNS=Number(process.env.SIM_RUNS??50);
const START=100*DAY;

function rng(seed){let x=seed|0;return ()=>{x|=0;x=x+0x6D2B79F5|0;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
const event=(serial,sessionId,taskId,type,at,detail={})=>({id:`e${serial}`,at,sessionId,taskId,type,detail,contentVersion:'simulation'});
const activeRetrieval=t=>!!t?.target&&!(t.kind==='writing'&&!t.recall);

function quantile(xs,q){if(!xs.length)return null;const ys=[...xs].sort((a,b)=>a-b),p=(ys.length-1)*q,lo=Math.floor(p),hi=Math.ceil(p);return ys[lo]+(ys[hi]-ys[lo])*(p-lo);}
function stats(xs){const mean=xs.reduce((a,b)=>a+b,0)/xs.length;const sd=Math.sqrt(xs.reduce((a,b)=>a+(b-mean)**2,0)/(xs.length-1));return {mean,sd,p10:quantile(xs,.1),p90:quantile(xs,.9)};}

function runOne(profileName,variant,seed){
  const random=rng(seed),p=PROFILES[profileName];let events=[],relations=[],serial=0,now=START,taskNo=0,batch=0;
  const introAt=new Map(),firstAt=new Map(),firstSuccess=new Map(),openSeries=[];
  const sameWithin2=[];let previousItems=[];const snapshots={};
  const batchDiversities=[];let batchItems=new Set();
  const counts={new:0,recall:0,success:0,failure:0,help:0};
  const distinct=new Set();
  while(taskNo<120){
    let plan=(variant.name==='baseline'?composeBaseline:composeContinuous)(relations,events,'hant',now);
    let index=0;const sessionId=`s${batch}`;
    while(index<plan.length&&taskNo<120){
      const id=plan[index],t=taskMap.get(id);if(!t||t.kind==='closure'){index++;continue;}
      taskNo++;now+=60_000;const item=t.itemId;if(item)distinct.add(item);
      if(item)batchItems.add(item);
      events.push(event(++serial,sessionId,id,'task_presented',now,{taskNo,item:item??''}));
      if(t.kind==='encounter'){
        counts.new++;if(item&&!introAt.has(item))introAt.set(item,taskNo);
      } else counts.recall++;
      let outcome=null;
      if(t.target){
        if(t.kind==='writing'&&!t.recall)outcome={result:'success',assisted:true};
        else {const r=random();outcome=r<p.success?{result:'success',assisted:false}:r<p.success+p.help?{result:'success',assisted:true}:{result:'failure',assisted:false};}
        const {result,assisted}=outcome;if(assisted)counts.help++;else if(result==='failure')counts.failure++;else counts.success++;
        if(item&&activeRetrieval(t)&&!firstAt.has(item)){firstAt.set(item,taskNo);firstSuccess.set(item,result==='success'&&!assisted);}
        events.push(event(++serial,sessionId,id,'attempt',now,{taskNo,item:item??'',result,assisted,objectId:objectFor(t,'hant'),target:t.target}));
        const a={objectId:objectFor(t,'hant'),target:t.target,result,assisted,sessionId,at:now};const old=relations.find(r=>r.objectId===a.objectId&&r.target===a.target);relations=relations.filter(r=>r!==old);relations.push(updateRelation(old,a));
        if(['listen','read','recall'].includes(t.kind)&&(result!=='success'||assisted))plan=withSpacedRetry(plan,index,id);
      }
      events.push(event(++serial,sessionId,id,'task_completed',now,{taskNo,item:item??''}));
      if(item){sameWithin2.push(previousItems.includes(item)?1:0);previousItems=[item,...previousItems].slice(0,2);}
      const open=[...introAt.keys()].filter(x=>![...events].some(e=>['attempt','screenless_recall'].includes(e.type)&&taskMap.get(e.taskId)?.itemId===x&&activeRetrieval(taskMap.get(e.taskId))&&e.detail.result==='success'&&e.detail.assisted===false));
      openSeries.push(open.length);
      if(HORIZONS.includes(taskNo)){
        const introduced=[...introAt.keys()].filter(x=>introAt.get(x)<=taskNo);
        const lags=introduced.filter(x=>firstAt.has(x)&&firstAt.get(x)<=taskNo).map(x=>firstAt.get(x)-introAt.get(x));
        const currentRelations=relations;
        const fragileItems=new Set(currentRelations.filter(r=>r.state==='FRAGILE').map(r=>r.objectId.replace(/:hant$/,''))).size;
        const notStable=introduced.filter(x=>!currentRelations.some(r=>(r.objectId===`cmn:${x}`||r.objectId===`cmn:${x}:hant`)&&['STABLE','DURABLE'].includes(r.state))).length;
        snapshots[taskNo]={
          new:counts.new,recall:counts.recall,openMean:openSeries.reduce((a,b)=>a+b,0)/openSeries.length,openMax:Math.max(...openSeries),openEnd:open.length,
          firstMedian:quantile(lags,.5),firstP90:quantile(lags,.9),firstP95:quantile(lags,.95),firstMax:lags.length?Math.max(...lags):null,
          within5:introduced.length?introduced.filter(x=>firstAt.has(x)&&firstAt.get(x)-introAt.get(x)<=5).length/introduced.length:0,
          within7:introduced.length?introduced.filter(x=>firstAt.has(x)&&firstAt.get(x)-introAt.get(x)<=7).length/introduced.length:0,
          within10:introduced.length?introduced.filter(x=>firstAt.has(x)&&firstAt.get(x)-introAt.get(x)<=10).length/introduced.length:0,
          firstSuccess:introduced.filter(x=>firstSuccess.get(x)===true&&firstAt.get(x)<=taskNo).length,
          firstAttempts:introduced.filter(x=>firstAt.has(x)&&firstAt.get(x)<=taskNo).length,
          failureDensity:counts.failure/taskNo,helpDensity:counts.help/taskNo,repeat2:sameWithin2.reduce((a,b)=>a+b,0)/sameWithin2.length,
          distinct:distinct.size,fragileItems,notStable,
          batchDistinctMean:[...batchDiversities,batchItems.size].reduce((a,b)=>a+b,0)/(batchDiversities.length+1),
          batchDistinctMin:Math.min(...batchDiversities,batchItems.size),
        };
      }
      index++;
    }
    batchDiversities.push(batchItems.size);batchItems=new Set();batch++;now+=batch%4===0?DAY:30*60_000;
    if(batch>1000)throw new Error('deadlock');
  }
  return snapshots;
}

const variants=[{name:'baseline'},{name:'implemented'}];
const output={meta:{baselineRevision,runs:RUNS,profiles:PROFILES,horizons:HORIZONS,cadence:'1 minute/task; 30 minutes between batches; every fourth boundary 24 hours',dosing:DOSING},results:{}};
for(const v of variants){output.results[v.name]={};for(const profile of Object.keys(PROFILES)){const runs=[];for(let i=0;i<RUNS;i++)runs.push(runOne(profile,v,1000003*i+97*profile.length));output.results[v.name][profile]={};for(const h of HORIZONS){const keys=Object.keys(runs[0][h]);output.results[v.name][profile][h]=Object.fromEntries(keys.map(k=>[k,stats(runs.map(r=>r[h][k]??0))]));}}}
console.log(JSON.stringify(output,null,2));
