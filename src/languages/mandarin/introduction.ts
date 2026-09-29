import { content, itemMap, taskMap } from './content/index.ts';
import type { Item, Task, IntroductionDimension as Dimension } from './schema/content.ts';
import type { ResearchEvent } from '../../core/progress/db.ts';
import { hasToneAttention } from './attention.ts';
export const INTRODUCTION_VERSION = 1;
export function introductionDetail(item: Item, script: 'hant'|'hans', dimensions: Dimension[], method: string) {
 return { item:item.id, script, form:item[script], toneNumbers:item.toneNumbers, dimensions:dimensions.join(','), introductionVersion:INTRODUCTION_VERSION, method };
}
const visual = (dimension: Dimension) => ['hanzi','writing','segmentation'].includes(dimension);
export function introduced(item: Item, dimension: Dimension, script: 'hant'|'hans', events: ResearchEvent[]): boolean {
 if(dimension==='tone')return hasToneAttention(item,events);
 if(events.some(e=>e.type==='introduction_dimensions' && e.detail.item===item.id && e.detail.introductionVersion===INTRODUCTION_VERSION && String(e.detail.dimensions).split(',').includes(dimension) && e.detail.toneNumbers===item.toneNumbers && (!visual(dimension)||(e.detail.script===script && e.detail.form===item[script]))))return true;
 // Existing completed guided writing is a real teaching sequence, not generic display evidence.
 if(dimension==='writing')return events.some(e=>e.type==='attempt' && taskMap.get(e.taskId)?.itemId===item.id && taskMap.get(e.taskId)?.kind==='writing' && !taskMap.get(e.taskId)?.recall && e.detail.objectId===`cmn:${item.id}:${script}`);
 // Preserve acknowledged C2.2 encoding only when the connected surface was subsequently completed.
 const pilot=events.find(e=>e.type==='item_attention_completed' && e.detail.item===item.id && e.detail.script===script && e.detail.form===item[script] && e.detail.attentionVersion===1);
 if(pilot && events.some(e=>e.type==='task_completed' && e.taskId===pilot.taskId && e.sessionId===pilot.sessionId && e.at>=pilot.at))return dimension==='meaning'||dimension==='hanzi'||(dimension==='pronunciation'&&pilot.detail.heard===true);
 return false;
}
export function knownHanziComponents(item:Item,script:'hant'|'hans',events:ResearchEvent[]) {
 // Reuse explicitly introduced WHOLE words, never infer character knowledge from a phrase.
 return item.words.every(id=>content.items.some(source=>source.id!==item.id && source.words.length===1 && source.words[0]===id && introduced(source,'hanzi',script,events)));
}
export function hasDimension(item:Item,dimension:Dimension,script:'hant'|'hans',events:ResearchEvent[]) {
 return introduced(item,dimension,script,events)||(dimension==='hanzi'&&knownHanziComponents(item,script,events));
}
export function missingIntroduction(item:Item,script:'hant'|'hans',events:ResearchEvent[],dimensions:Dimension[]=item.introduction.dimensions) {
 return dimensions.filter(d=>d!=='writing'&&!hasDimension(item,d,script,events));
}
export function requiredDimensions(task:Task):Dimension[] {
 if(task.kind==='read'||task.kind==='sequence'||task.kind==='writing')return ['meaning','hanzi'];
 if(task.kind==='listen'||task.kind==='recall')return ['meaning','pronunciation'];
 if(task.kind==='tone-recall')return ['meaning','pronunciation','tone'];
 return [];
}
export function introductionForTask(task:Task,script:'hant'|'hans',events:ResearchEvent[]) {
 if(task.kind==='tones'||task.kind==='closure')return undefined;
 const items=(task.sequence??[task.itemId!]).map(id=>itemMap.get(id)!);
 return items.find(item=>missingIntroduction(item,script,events,task.kind==='encounter'?item.introduction.dimensions:requiredDimensions(task)).length>0);
}

// Presentation provenance only: no scheduler or assessment changes. Missing
// prerequisites still replace a test with teaching through introductionForTask.
export function taskPresentationRole(task:Task,script:'hant'|'hans',events:ResearchEvent[]) {
 if(introductionForTask(task,script,events))return 'introduction';
 if(task.kind==='closure')return 'completion';
 if(task.kind==='tones'||task.kind==='encounter'||task.kind==='writing'&&(!task.recall||!introduced(itemMap.get(task.itemId!)!,'writing',script,events)))return 'practice';
 return 'recall';
}
