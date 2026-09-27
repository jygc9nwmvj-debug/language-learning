import raw from './lesson-001.json' with { type: 'json' };
import { contentSchema } from '../schema/content.ts';
export const content = contentSchema.parse(raw);
export const taskMap = new Map(content.tasks.map(t => [t.id, t]));
export const itemMap = new Map(content.items.map(i => [i.id, i]));
