export type MandarinLexemeData = {
  traditional: string;
  simplified: string;
  pinyin: string;
  syllables: {
    pinyinBase: string;
    tone: 1 | 2 | 3 | 4 | 5;
    surfaceToneHint?: 1 | 2 | 3 | 4 | 5;
  }[];
};
