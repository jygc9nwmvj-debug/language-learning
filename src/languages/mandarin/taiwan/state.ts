import { z } from 'zod';
const writing = z.object({value:z.string(),message:z.string(),kind:z.enum(['success','attention','error']),help:z.boolean().optional(),result:z.enum(['success','failure','unsure']).optional(),ink:z.array(z.string()).optional(),inkSize:z.number().positive().optional(),stage:z.number().int().nonnegative().optional(),mode:z.string().optional(),selfReport:z.boolean().optional()});
export const textStateSchema=z.object({modality:z.enum(['audio','text']).default('text'),played:z.record(z.string(),z.number().int().nonnegative()).default({}),transcript:z.boolean().default(false),pendingWords:z.array(z.string()),sentenceChecks:z.array(z.string()),wordIndex:z.number().int().nonnegative(),phase:z.enum(['work','questions','recap','done']),position:z.number().int().nonnegative(),input:z.string(),selected:z.array(z.string()),matched:z.array(z.string()),left:z.string(),notice:z.string(),revealed:z.boolean(),feedback:z.boolean(),result:z.enum(['success','failure','unsure']),writing:writing.optional()});
export type TextState=z.infer<typeof textStateSchema>;
export function restoreTextState(value:string|undefined):TextState|undefined {
 if(!value)return undefined;
 try {const parsed=textStateSchema.safeParse(JSON.parse(value));return parsed.success&&parsed.data.wordIndex<=parsed.data.pendingWords.length?parsed.data:undefined;}catch{return undefined;}
}
