import type { Task } from '../../languages/mandarin/schema/content.ts';
export const assistanceEvents = ['pinyin_reveal','writing_hint','writing_stroke_hint','writing_preview','stroke_animation','guided_start','answer_clarification','previous_object_help'];
export function attemptContext(task:Task,detail:Record<string,string|number|boolean>={}) {
 // Corrections can contain learner-entered text. Keep only assessment categories,
 // not that display string. Existing historical data is not rewritten.
 const {correction:_correction,...safe}=detail;
 return {...safe,observabilityVersion:1,evidence:detail.selfReport===true?'self_report':task.kind==='writing'&&detail.mode!=='screen'?'unknown':'app_checked'};
}
