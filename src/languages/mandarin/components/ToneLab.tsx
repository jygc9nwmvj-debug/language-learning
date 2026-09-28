import { AnswerSummary, InfoDisclosure } from '../../../core/exercises/Controls';
import { FocusedPinyin } from './AttentionIntroduction';
import { useState } from 'react';
import { AudioButton } from '../../../core/exercises/AudioButton';
import { Recorder } from '../../../core/audio/Recorder';
import type { Item, Task } from '../schema/content';
import { ui } from '../../../core/i18n/de';
import { content, itemMap } from '../content';
const tones = content.toneExamples.map(id => content.words.find(w => w.id === id)!);
export function ToneLab({ script, onEvent, onResult, onNext, disabled, familiar = false }: {
  familiar?: boolean; script: 'hant' | 'hans'; onEvent: (type: string) => void;
  onResult: (tone: number, correct: boolean) => Promise<void>; onNext: () => void; disabled: boolean;
}) {
  const [noticed, setNoticed] = useState<number[]>(familiar ? [1, 2, 3, 4] : []);
  const [activeTone, setActiveTone] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false); const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null); const [heard, setHeard] = useState(false);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [practice, setPractice] = useState(''), [practiced, setPracticed] = useState(false), [practiceFeedback, setPracticeFeedback] = useState('');
  const target = [2, 4, 3][question];
  return <div className="stepStack toneLab"><p>{ui.toneIntro}</p><div className="toneComparison">{tones.map((tone, i) => <div className="toneRow" data-active={activeTone === i + 1} key={tone.pinyin}>
    <span className="toneNumber" aria-label={`Ton ${i + 1}`}>{i + 1}</span><div className="toneLanguage"><strong><FocusedPinyin value={tone.pinyin} /></strong><span>{revealed ? <><span lang="zh">{tone[script]}</span> · {tone.meaning.de[0]}</> : ['hoch und eben', 'steigend', 'fallend, dann steigend', 'fallend'][i]}</span></div>
    <AudioButton src={tone.audio!} label={`Ton ${i + 1}`} onPlay={() => { setActiveTone(i + 1); setNoticed(values => values.includes(i + 1) ? values : [...values, i + 1]); onEvent('audio_replay'); onEvent(`tone_example_${i + 1}_introduced`); }} onPlaybackChange={playing => { if (!playing) setActiveTone(current => current === i + 1 ? null : current); }} />
  </div>)}</div><InfoDisclosure className="toneExplanation" label="Zu den Tonverläufen"><p>1: hoch und eben · 2: steigend · 3: fallend, dann steigend · 4: fallend. Hier hörst du Ton 3 als vollständige Einzelkontur. In flüssiger Sprache bleibt er oft tief; nicht jedes Wort macht dieselbe volle Kurve.</p></InfoDisclosure>
  {!revealed ? <><p className="controlLabel" role="status">{noticed.length < 4 ? `Höre die vier Töne und achte auf ihre Zeichen (${noticed.length}/4).` : 'Alle vier Töne gehört. Jetzt kommen die Bedeutungen dazu.'}</p><button disabled={noticed.length < 4 || disabled} type="button" onClick={() => { setRevealed(true); onEvent('tone_reveal'); }}>{ui.toneReveal}</button></>
    : <>{question < 3 ? <div className="quizBox toneQuiz"><h3>{ui.toneQuestion}</h3><AudioButton src={tones[target - 1].audio!} onPlay={() => { setHeard(true); onEvent('audio_replay'); }} />
      <div className="toneChoices">{[1, 2, 3, 4].map(n => <button className={answer === n ? 'toneChoice isSelected' : 'toneChoice'} aria-pressed={answer === n} aria-label={`Ton ${n} wählen`} key={n} type="button" disabled={!heard || answer !== null || disabled} onClick={() => void onResult(target, n === target).then(() => setAnswer(n)).catch(() => {})}>{n}</button>)}</div>
      {answer !== null && <><p className={`toneFeedback ${answer === target ? 'success' : 'attention'}`} role="status">{answer === target ? ui.toneCorrect : ui.toneWrong} {tones[target - 1].pinyin} · Ton {target}</p>
        <button type="button" disabled={disabled} onClick={() => { setQuestion(q => q + 1); setAnswer(null); setHeard(false); }}>{ui.continue}</button></>}
    </div> : <form className="quizBox stepStack" onSubmit={e => { e.preventDefault(); if (practiceChecked) return; setPracticeChecked(true); const ok = practice.trim().toLowerCase() === tones[1].toneNumbers; setPracticed(ok); setPracticeFeedback(ok ? `${tones[1].toneNumbers} → ${tones[1].pinyin}. Genau: Die 2 steht nach der Silbe.` : 'Tippe ma und direkt dahinter die Zahl 2.'); onEvent('tone_notation_practice'); if (ok) onEvent('tone_notation_introduced'); }}>
      <h3>Töne mit der Tastatur</h3><p>Die Zahl kommt direkt nach der Silbe: {tones.map(t => `${t.toneNumbers} → ${t.pinyin}`).join(', ')}. In Wörtern zum Beispiel {itemMap.get('nihao')!.toneNumbers} → {itemMap.get('nihao')!.pinyin}.</p>
      {practiceChecked ? <AnswerSummary value={practice} /> : <label className="fieldLabel">Tippe {tones[1].pinyin} mit einer Tonzahl<input value={practice} onChange={e => { setPractice(e.target.value); setPracticed(false); }} readOnly={practiceChecked} autoCorrect="off" autoCapitalize="off" spellCheck={false} maxLength={20} /></label>}
      {!practiceChecked && <button type="submit" disabled={!practice.trim() || disabled}>Prüfen</button>}{practiceChecked && !practiced && <button type="button" onClick={() => { setPracticeChecked(false); setPracticeFeedback(''); }}>Noch einmal versuchen</button>}{practiceFeedback && <p role="status">{practiceFeedback}</p>}
      {practiced && <button type="button" disabled={disabled} onClick={onNext}>Weiter</button>}
    </form>}<Recorder onEvent={onEvent} /></>}
  </div>;
}

export function ToneRecall({ item, task, onResult, onEvent, onNext, disabled }: {
  item: Item; task: Task; onResult: (correct: boolean) => Promise<void>; onEvent: (type: string) => void; onNext: () => void; disabled: boolean;
}) {
  const [heard, setHeard] = useState(false), [answer, setAnswer] = useState<number | null>(null);
  return <div className="stepStack"><p>Höre den bekannten Ausdruck. Wähle den Ton {item.syllables.length > 1 ? `der ${task.toneIndex! + 1}. Silbe` : 'der Silbe'}.</p>
    <AudioButton src={item.audio} onPlay={() => { setHeard(true); onEvent('audio_replay'); }} />
    <div className="toneChoices">{[1,2,3,4].map(n => <button className={answer === n ? 'toneChoice isSelected' : 'toneChoice'} aria-pressed={answer === n} aria-label={`Ton ${n} wählen`} key={n} disabled={disabled || !heard || answer !== null} type="button" onClick={() => void onResult(n === task.tone).then(() => setAnswer(n)).catch(() => {})}>{n}</button>)}</div>
    {answer !== null && <><p className={`toneFeedback ${answer === task.tone ? 'success' : 'attention'}`} role="status">{answer === task.tone ? ui.toneCorrect : ui.toneWrong} {item.pinyin} · Gesucht war Ton {task.tone}. Deine Aussprache wurde nicht bewertet.</p><button disabled={disabled} type="button" onClick={onNext}>Weiter</button></>}
  </div>;
}
