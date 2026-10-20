import {normalizeText} from './answer.ts';
export type MeaningFinding='accepted'|'incorrect'|'uncertain';
// Explicit contrasts only. A meaning belonging to another item can still be a
// valid contextual paraphrase (e.g. "gut" for "mir geht es gut"). No similarity grading.
const rejected:Record<string,readonly string[]>={nihao:['auf Wiedersehen','tschüss'],wo:['du'],ni:['ich'],hao:['schlecht']};
export function meaningFinding(answer:string,accepted:readonly string[],targetId?:string):MeaningFinding{
 const text=normalizeText(answer);if(accepted.some(a=>normalizeText(a)===text))return 'accepted';
 if(targetId&&rejected[targetId]?.some(a=>normalizeText(a)===text))return 'incorrect';
 return 'uncertain';
}
