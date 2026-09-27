import { useState } from 'react';
import { AudioButton } from '../../../core/exercises/AudioButton';
import { Recorder } from '../../../core/audio/Recorder';
import { numberedToPinyin } from '../answer';
import type { Item, Task } from '../schema/content';
import { ui } from '../../../core/i18n/de';
const tones = [
  { pinyin: 'mā', hant: '媽', hans: '妈', meaning: 'Mutter' },
  { pinyin: 'má', hant: '麻', hans: '麻', meaning: 'Hanf' },
  { pinyin: 'mǎ', hant: '馬', hans: '马', meaning: 'Pferd' },
  { pinyin: 'mà', hant: '罵', hans: '骂', meaning: 'schimpfen' },
];
export function ToneLab({ script, onEvent, onResult, onNext, disabled }: {
  script: 'hant' | 'hans'; onEvent: (type: string) => void;
  onResult: (tone: number, correct: boolean) => Promise<void>; onNext: () => void; disabled: boolean;
}) {
  const [revealed, setRevealed] = useState(false); const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null); const [heard, setHeard] = useState(false);
  const [practice, setPractice] = useState(''), [practiced, setPracticed] = useState(false), [practiceFeedback, setPracticeFeedback] = useState('');
  const target = [2, 4, 3][question];
  return <div className="stepStack"><p>{ui.toneIntro}</p><p className="muted">1: hoch und eben · 2: steigend · 3: fallend, dann steigend · 4: fallend. Hier hörst du Ton 3 als vollständige Einzelkontur. In flüssiger Sprache bleibt er oft tief; nicht jedes Wort macht dieselbe volle Kurve.</p><div className="toneGrid">{tones.map((tone, i) => <div className="toneCard" key={tone.pinyin}>
    <AudioButton src={`/audio/mandarin/ma${i + 1}.wav`} label={`Ton ${i + 1}`} onPlay={() => onEvent('audio_replay')} />
    {revealed && <><strong>{tone.pinyin}</strong><span lang="zh">{tone[script]}</span><span>{tone.meaning}</span></>}
  </div>)}</div>
  {!revealed ? <button type="button" onClick={() => { setRevealed(true); onEvent('tone_reveal'); }}>{ui.toneReveal}</button>
    : <>{question < 3 ? <div className="quizBox"><h3>{ui.toneQuestion}</h3><AudioButton src={`/audio/mandarin/ma${target}.wav`} onPlay={() => { setHeard(true); onEvent('audio_replay'); }} />
      <div className="buttonRow">{[1, 2, 3, 4].map(n => <button key={n} type="button" disabled={!heard || answer !== null || disabled} onClick={() => void onResult(target, n === target).then(() => setAnswer(n)).catch(() => {})}>{n}</button>)}</div>
      {answer !== null && <><p role="status">{answer === target ? ui.toneCorrect : ui.toneWrong} {tones[target - 1].pinyin} · Ton {target}</p>
        <button type="button" disabled={disabled} onClick={() => { setQuestion(q => q + 1); setAnswer(null); setHeard(false); }}>{ui.continue}</button></>}
    </div> : <form className="quizBox stepStack" onSubmit={e => { e.preventDefault(); const ok = practice.trim().toLowerCase() === 'ma2'; setPracticed(ok); setPracticeFeedback(ok ? 'ma2 → má. Genau: Die 2 steht nach der Silbe.' : 'Tippe ma und direkt dahinter die Zahl 2.'); onEvent('tone_notation_practice'); }}>
      <h3>Töne mit der Tastatur</h3><p>Die Zahl kommt direkt nach der Silbe: ma1 → mā, ma2 → má, ma3 → mǎ, ma4 → mà. Neutral: ma5 oder ma0 → ma. In Wörtern zum Beispiel ni3 hao3 → nǐ hǎo.</p>
      <label className="fieldLabel">Tippe má mit einer Tonzahl<input value={practice} onChange={e => { setPractice(e.target.value); setPracticed(false); }} autoCapitalize="off" spellCheck={false} maxLength={20} /></label>
      {practice && <p>So liest sich das: <output>{numberedToPinyin(practice)}</output></p>}
      <button type="submit" disabled={!practice.trim() || disabled}>Prüfen</button>{practiceFeedback && <p role="status">{practiceFeedback}</p>}
      {practiced && <button type="button" disabled={disabled} onClick={onNext}>Weiter</button>}
    </form>}<Recorder onEvent={onEvent} /><p className="muted">{ui.toneUncertain}</p></>}
    <p className="privacyNote"><a href="/licenses/mandarin-tones.html" target="_blank" rel="noreferrer">Tonbeispiele: Wolfdog · CC BY-SA 4.0</a></p>
  </div>;
}

export function ToneRecall({ item, task, onResult, onEvent, onNext, disabled }: {
  item: Item; task: Task; onResult: (correct: boolean) => Promise<void>; onEvent: (type: string) => void; onNext: () => void; disabled: boolean;
}) {
  const [heard, setHeard] = useState(false), [answer, setAnswer] = useState<number | null>(null);
  return <div className="stepStack"><p>Höre den bekannten Ausdruck. Wähle den Ton {item.syllables.length > 1 ? `der ${task.toneIndex! + 1}. Silbe` : 'der Silbe'}.</p>
    <AudioButton src={item.audio} onPlay={() => { setHeard(true); onEvent('audio_replay'); }} />
    <div className="buttonRow">{[1,2,3,4].map(n => <button key={n} disabled={disabled || !heard || answer !== null} type="button" onClick={() => void onResult(n === task.tone).then(() => setAnswer(n)).catch(() => {})}>{n}</button>)}</div>
    {answer !== null && <><p role="status">{answer === task.tone ? ui.toneCorrect : ui.toneWrong} {item.pinyin} · Gesucht war Ton {task.tone}. Deine Aussprache wurde nicht bewertet.</p><button disabled={disabled} type="button" onClick={onNext}>Weiter</button></>}
  </div>;
}
