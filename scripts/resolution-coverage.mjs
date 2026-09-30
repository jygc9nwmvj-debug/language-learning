import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {content,itemMap} from '../src/languages/mandarin/content/index.ts';
import {operationForTask,resolutionContracts} from '../src/core/exercises/resolution-contract.ts';
import {referenceRole,fixedReferenceParts} from '../src/languages/mandarin/reference-role.ts';
export const renderers={
 'src/languages/mandarin/reference-role.ts':['target'],
 'src/languages/mandarin/components/SlotReference.tsx':['target'],
 'src/languages/mandarin/components/Exercise.tsx':['listen','read','production'],
 'src/core/exercises/SpeakingPractice.tsx':['encounter','target'],
 'src/languages/mandarin/components/AttentionIntroduction.tsx':['encounter'],
 'src/languages/mandarin/components/WritingExercise.tsx':['writing'],
 'src/languages/mandarin/components/HybridRecall.tsx':['paper','screenless'],
 'src/languages/mandarin/components/ToneLab.tsx':['tone','notation'],
 'src/core/audio/Recorder.tsx':['recording'],
 'src/languages/mandarin/components/NumberSequence.tsx':['sequence'],
 'src/languages/mandarin/components/MiniTransfer.tsx':['transfer'],
 'src/languages/mandarin/components/PhraseForm.tsx':['target'],
 'src/languages/mandarin/components/ProductionFeedback.tsx':['production'],
 'src/core/exercises/Resolution.tsx':Object.keys(resolutionContracts),
 'src/core/exercises/resolution-contract.ts':Object.keys(resolutionContracts),
 'src/app/LessonRunner.tsx':Object.keys(resolutionContracts),
 'src/languages/mandarin/schema/content.ts':Object.keys(resolutionContracts),
};
export function enumerateResolutions(){
 return {tasks:content.tasks.map(t=>{
  const operation=operationForTask(t.kind), c=operation&&resolutionContracts[operation],item=itemMap.get(t.itemId);
  const purpose=t.kind==='recall'?'production':t.kind==='encounter'?'introduction':'comprehension';
  return {slotReference:item?.slot?{slot:item.slot,role:referenceRole(item,purpose),fixedParts:fixedReferenceParts(item),introduction:'explicit example',screenless:'renderer-level fixed-components; eligibility unchanged',states:['prompt','help','resolved','reload']}:null,id:t.id,kind:t.kind,operation,states:c?c.states:[],base:c?c.required:[],reference:c?c.reference:'No graded resolution; continuous boundary routes paper/transfer or next batch.',
   reachability:t.kind==='closure'?'orchestration boundary':t.kind==='tone-recall'?'restorable compatibility; not newly planned':'continuous task or prerequisite introduction',
   optionalFields:item?['exploration','slowAudio','surfaceToneNumbers','punctuation','slot','learning','review','meaning'].filter(k=>item[k]!==undefined):[],
   taskOptionalFields:['notationPractice','sequence','assess','itemId','target','toneIndex','recall'].filter(k=>t[k]!==undefined),
   introductionReplacement:!['tones','closure'].includes(t.kind),
   additionalContracts:t.kind==='tones'?['notation','recording']:t.kind==='encounter'||t.kind==='read'?['target','recording']:t.kind==='closure'?['paper','transfer']:[],
  };
 }),sources:Object.fromEntries(Object.keys(renderers).map(f=>[f,createHash('sha256').update(readFileSync(f)).digest('hex')]))};
}
export function checkResolutionCoverage(current,ledger){
 const errors=[];
 if(JSON.stringify(current.tasks)!==JSON.stringify(ledger.tasks))errors.push('Task-to-resolution population changed: review assignments/states/options.');
 for(const f of new Set([...Object.keys(current.sources),...Object.keys(ledger.sources)]))if(current.sources[f]!==ledger.sources[f])errors.push('Resolution renderer routing changed/unreviewed: '+f);
 return errors;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const current=enumerateResolutions();
 if(process.argv.includes('--list'))console.log(JSON.stringify(current,null,2));
 else{const errors=checkResolutionCoverage(current,JSON.parse(readFileSync('qa/resolution/coverage.json','utf8')));if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`${current.tasks.length}/${current.tasks.length} definitions accounted for; 3 compatibility tone tasks, 1 orchestration boundary; 10 learning-operation families. Source/state coverage is not visual coverage.`);}
}
