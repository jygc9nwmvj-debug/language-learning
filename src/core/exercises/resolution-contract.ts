// A rendering contract, not task state or assessment. Inputs are existing phases.
export const resolutionContracts = {
 target: { required: ['reference','audio'], optional: [], states: ['reference'], reference: 'form/meaning and audio in their existing reference container' },
 encounter: { required: ['reference','next'], optional: ['enrichment','practice'], states: ['revealed'], reference: 'introduced form/meaning; existing Pinyin reveal policy' },
 listen: { required: ['response','reference','next'], optional: ['enrichment'], states: ['success','attention','error'], reference: 'target form and meaning; no dependency on exploration' },
 read: { required: ['response','reference','next'], optional: ['assistance'], states: ['success','attention','error'], reference: 'target form/meaning in optional speaking practice; parent response supplies the stable continuation action' },
 production: { required: ['response','reference','next'], optional: ['enrichment'], states: ['success','attention','error'], reference: 'target form/meaning; existing correction grammar and Pinyin policy' },
 writing: { required: ['reference','feedback','next'], optional: ['enrichment'], states: ['saved'], reference: 'own ink on screen, existing comparison model on paper; no new contour' },
 screenless: { required: ['reference','audio','comparison','next'], optional: [], states: ['revealed'], reference: 'expression with Pinyin; self-report, no automatic pronunciation judgment' },
 paper: { required: ['reference','comparison','next'], optional: [], states: ['revealed'], reference: 'existing characters/meanings to compare with own sheet; no new audio requirement' },
 tone: { required: ['feedback','next'], optional: [], states: ['answered'], reference: 'correct tone/Pinyin in feedback; selected response and audio remain in quiz' },
 notation: { required: ['feedback','next'], optional: [], states: ['checked'], reference: 'existing notation comparison; retry rather than next after error' },
 recording: { required: ['recording'], optional: ['notice'], states: ['recorded'], reference: 'own playback; enclosing task supplies Mandarin reference; no speech score' },
 sequence: { required: ['feedback','reference','next'], optional: [], states: ['answered'], reference: 'correct ordered characters/Pinyin; own sequence remains above; no new audio sequence' },
 transfer: { required: ['response','reference','next'], optional: ['enrichment'], states: ['result'], reference: 'authored solution; transcript optional, existing conversation replay remains above' },
} as const;
export type ResolutionOperation = keyof typeof resolutionContracts;
export type ResolutionPart = 'response'|'reference'|'audio'|'next'|'feedback'|'enrichment'|'practice'|'assistance'|'comparison'|'recording'|'notice';
export function validateResolution(operation:ResolutionOperation, parts:Record<string,unknown>, resolved=true, assisted=false) {
 const c=resolutionContracts[operation];
 const allowed:readonly string[]=[...c.required,...c.optional,'assistance'];
 for(const key of Object.keys(parts))if(!allowed.includes(key))throw Error(`Resolution ${operation}: forbidden part ${key}`);
 if(resolved)for(const key of [...c.required,...(assisted?['assistance']:[])])if(parts[key]===undefined||parts[key]===null||parts[key]===false)throw Error(`Resolution ${operation}: missing ${key}`);
}
export const operationForTask = (kind:string):ResolutionOperation|null => {
 switch(kind){case 'encounter':return 'encounter';case 'listen':return 'listen';case 'read':return 'read';case 'recall':return 'production';case 'writing':return 'writing';case 'tones':case 'tone-recall':return 'tone';case 'sequence':return 'sequence';case 'closure':return null;default:throw Error(`Unmapped task kind: ${kind}`);}
};
