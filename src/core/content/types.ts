export type LocalizedText = { de?: string; en: string };

export type SkillDimension =
  | 'meaning'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing'
  | 'usage';

export type LessonStep = {
  id: string;
  type: string;
  targets: string[];
  required?: boolean;
  config?: Record<string, unknown>;
};

export type Lesson = {
  id: string;
  languageId: string;
  title: LocalizedText;
  objectives: string[];
  prerequisites: string[];
  introduces: string[];
  reviews: string[];
  steps: LessonStep[];
  exitChecks: LessonStep[];
};
