import Dexie, { type Table } from 'dexie';

export type SkillState =
  | 'unseen'
  | 'introduced'
  | 'assisted_success'
  | 'unassisted_success'
  | 'shaky'
  | 'due_for_review';

export type SkillDimension =
  | 'meaning'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing'
  | 'usage';

export type SkillProgress = {
  state: SkillState;
  attempts: number;
  successes: number;
  updatedAt: string;
};

export type ItemProgressRow = {
  id: string;
  itemId: string;
  skill: SkillDimension;
  progress: SkillProgress;
};

export type LessonProgressRow = {
  lessonId: string;
  currentStep: number;
  completed: boolean;
  revisitCount: number;
  updatedAt: string;
};

export type PreferenceRow = {
  key: string;
  value: string;
};

class LearningDatabase extends Dexie {
  itemProgress!: Table<ItemProgressRow, string>;
  lessonProgress!: Table<LessonProgressRow, string>;
  preferences!: Table<PreferenceRow, string>;

  constructor() {
    super('language-learning-local');
    this.version(1).stores({
      itemProgress: 'id,itemId,skill',
      lessonProgress: 'lessonId',
      preferences: 'key',
    });
  }
}

export const db = new LearningDatabase();

export async function getPreference(key: string, fallback: string) {
  const row = await db.preferences.get(key);
  return row?.value ?? fallback;
}

export async function setPreference(key: string, value: string) {
  await db.preferences.put({ key, value });
}

export async function markSkill(
  itemId: string,
  skill: SkillDimension,
  state: SkillState,
  success = true,
) {
  const id = `${itemId}:${skill}`;
  const previous = await db.itemProgress.get(id);
  await db.itemProgress.put({
    id,
    itemId,
    skill,
    progress: {
      state,
      attempts: (previous?.progress.attempts ?? 0) + 1,
      successes: (previous?.progress.successes ?? 0) + (success ? 1 : 0),
      updatedAt: new Date().toISOString(),
    },
  });
}

export async function getLessonProgress(lessonId: string) {
  return db.lessonProgress.get(lessonId);
}

export async function saveLessonProgress(
  lessonId: string,
  currentStep: number,
  completed: boolean,
  revisitCount: number,
) {
  await db.lessonProgress.put({
    lessonId,
    currentStep,
    completed,
    revisitCount,
    updatedAt: new Date().toISOString(),
  });
}

export async function exportLearningState() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    itemProgress: await db.itemProgress.toArray(),
    lessonProgress: await db.lessonProgress.toArray(),
    preferences: await db.preferences.toArray(),
  };
  return JSON.stringify(payload, null, 2);
}
