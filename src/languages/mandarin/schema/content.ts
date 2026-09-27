import { z } from 'zod';
import { targetSchema } from '../../../core/progress/model.ts';
const text = z.object({ de: z.string().min(1), en: z.string().min(1) });
const asset = z.string().regex(/^\/audio\/mandarin\/[a-z0-9-]+\.wav$/);
export const contentSchema = z.object({
  version: z.string(), qaStatus: z.enum(['draft', 'source_checked', 'language_reviewed', 'audio_reviewed', 'published']),
  audioStatus: z.enum(['prototype', 'reviewed']),
  items: z.array(z.object({ id: z.string(), hant: z.string(), hans: z.string(), pinyin: z.string(), tones: z.array(z.number().int().min(1).max(5)).min(1),
    meaning: text, audio: asset, slowAudio: asset.optional() })),
  tasks: z.array(z.object({ id: z.string(), kind: z.enum(['encounter', 'listen', 'read', 'recall', 'writing', 'tones', 'closure']),
    itemId: z.string().optional(), target: targetSchema.optional(), prompt: z.object({ de: z.string().min(1), en: z.string().min(1).optional() }), answers: z.array(z.string()).optional(),
    recall: z.boolean().optional() })),
  initialPlan: z.array(z.string()), reviewPlan: z.array(z.string()),
}).superRefine((content, ctx) => {
  const ids = new Set(content.items.map(i => i.id));
  const taskIds = new Set(content.tasks.map(t => t.id));
  const issue = (message: string) => ctx.addIssue({ code: 'custom', message });
  if (ids.size !== content.items.length || taskIds.size !== content.tasks.length) issue('Duplicate ID');
  for (const t of content.tasks) {
    if (t.itemId && !ids.has(t.itemId)) issue(`Unknown item: ${t.itemId}`);
    if (!['tones', 'closure'].includes(t.kind) && !t.itemId) issue(`Missing item: ${t.id}`);
    if (['listen', 'read', 'recall', 'writing'].includes(t.kind) && !t.target) issue(`Missing target: ${t.id}`);
    if (['listen', 'read'].includes(t.kind) && !t.answers?.length) issue(`Missing answers: ${t.id}`);
  }
  for (const id of [...content.initialPlan, ...content.reviewPlan]) if (!taskIds.has(id)) issue(`Unknown task: ${id}`);
  if (content.qaStatus === 'published' && content.audioStatus !== 'reviewed') issue('Published audio needs review');
});
export type Content = z.infer<typeof contentSchema>;
export type Task = Content['tasks'][number];
export type Item = Content['items'][number];
