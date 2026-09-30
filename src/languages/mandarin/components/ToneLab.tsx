import { SlotExampleNote } from './SlotReference';
import { Resolution } from '../../../core/exercises/Resolution';
import { ContinueButton } from '../../../core/exercises/Controls';
import { InfoDisclosure } from '../../../core/exercises/Controls';
import { FocusedPinyin } from './AttentionIntroduction';
import type { SavedEvaluation, SavedFeedback, Checkpoint } from '../../../core/progress/db';
import { useRef, useState } from 'react';
import { AudioButton } from '../../../core/exercises/AudioButton';
import { Recorder } from '../../../core/audio/Recorder';
import type { Item, Task } from '../schema/content';
import { ui } from '../../../core/i18n/de';
import { content, itemMap } from '../content';
const tones = content.toneExamples.map(id => content.words.find(w => w.id === id)!);
export function ToneLab({ notationPractice, script, onEvent, onResult, onNext, disabled, familiar = false, saved, onCheckpoint }: {
  saved?: SavedEvaluation; onCheckpoint?: Checkpoint;
  notationPractice: NonNullable<Task['notationPractice']>; familiar?: boolean; script: 'hant' | 'hans'; onEvent: (type: string, detail?: Record<string, string | number | boolean>) => void;
  onResult: (tone: number, correct: boolean, part: string, feedback: SavedFeedback) => Promise<void>; onNext: () => void; disabled: boolean;
}) {
  const notationSource = content.words.find(word => word.id === notationPractice.sourceWord)!;
  const [initial] = useState(saved);
  const initialQuestion = initial?.step.startsWith('tone:') ? Number(initial.step.slice(5)) : initial?.step === 'notation' ? 3 : 0;
  const initialAnswer = initial?.results[`tone:${initialQuestion}`];
  const notation = initial?.step === 'notation' ? initial.results.notation : undefined;
  const saving = useRef(false);
  const [noticed, setNoticed] = useState<number[]>(familiar || initial ? [1, 2, 3, 4] : []);
  const [activeTone, setActiveTone] = useState<number | null>(null);
  const [examplesOpen, setExamplesOpen] = useState(!initial);
  const [revealed, setRevealed] = useState(!!initial); const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState<number | null>(initialAnswer ? Number(initialAnswer.value) : null); const [heard, setHeard] = useState(!!initialAnswer);
  const [practiceChecked, setPracticeChecked] = useState(!!notation);
  const [practice, setPractice] = useState(notation?.value ?? ''), [practiced, setPracticed] = useState(notation?.kind === 'success'), [practiceFeedback, setPracticeFeedback] = useState(notation?.message ?? '');
  const target = [2, 4, 3][question];
  return <div className="stepStack toneLab" data-focus={!revealed ? 'examples' : question < 3 ? 'quiz' : 'notation'} data-task-complete={practiced}><details className="toneExamples" open={examplesOpen} onToggle={e=>setExamplesOpen(e.currentTarget.open)}><summary>Vier Töne vergleichen</summary><p>{ui.toneIntro}</p><div className="toneComparison">{tones.map((tone, i) => <div className="toneRow" data-active={activeTone === i + 1} key={tone.pinyin}>
    <span className="toneNumber" aria-label={`Ton ${i + 1}`}>{i + 1}</span><div className="toneLanguage"><strong><FocusedPinyin value={tone.pinyin} /></strong><span>{revealed ? <><span lang="zh">{tone[script]}</span> · {tone.meaning.de[0]}</> : ['hoch und eben', 'steigend', 'fallend, dann steigend', 'fallend'][i]}</span></div>
    <AudioButton src={tone.audio!} label={`Ton ${i + 1}`} onPlay={() => { setActiveTone(i + 1); setNoticed(values => values.includes(i + 1) ? values : [...values, i + 1]); onEvent('audio_replay'); onEvent(`tone_example_${i + 1}_introduced`); }} onPlaybackChange={playing => { if (!playing) setActiveTone(current => current === i + 1 ? null : current); }} />
  </div>)}</div><InfoDisclosure className="toneExplanation" label="Zu den Tonverläufen"><p>1: hoch und eben · 2: steigend · 3: fallend, dann steigend · 4: fallend. Hier hörst du Ton 3 als vollständige Einzelkontur. In flüssiger Sprache bleibt er oft tief; nicht jedes Wort macht dieselbe volle Kurve.</p></InfoDisclosure></details>
  {!revealed ? <><p className="controlLabel" role="status">{noticed.length < 4 ? `Höre die vier Töne und achte auf ihre Zeichen (${noticed.length}/4).` : 'Alle vier Töne gehört. Jetzt kommen die Bedeutungen dazu.'}</p><button disabled={noticed.length < 4 || disabled} type="button" onClick={() => { setRevealed(true); onEvent('tone_reveal'); }}>{ui.toneReveal}</button></>
    : <>{question < 3 ? <div className="quizBox toneQuiz"><div className="questionAudio"><h3>{ui.toneQuestion}</h3><AudioButton emphasis="stimulus" src={tones[target - 1].audio!} onPlay={() => { setExamplesOpen(false); setHeard(true); onEvent('audio_replay'); }} /></div>
      <div className="toneChoices">{[1, 2, 3, 4].map(n => <button className={answer === n ? 'toneChoice isSelected' : 'toneChoice'} aria-pressed={answer === n} aria-label={`Ton ${n} wählen`} key={n} type="button" disabled={!heard || answer !== null || disabled} onClick={() => { if (saving.current || answer !== null) return; saving.current = true; void onResult(target, n === target, `tone:${question}`, { value: String(n), message: `${n === target ? ui.toneCorrect : ui.toneWrong} ${tones[target - 1].pinyin} · Ton ${target}`, kind: n === target ? 'success' : 'attention' }).then(() => setAnswer(n)).catch(() => {}).finally(() => { saving.current = false; }); }}>{n}</button>)}</div>
      {answer !== null && <Resolution operation="tone" parts={{feedback: <p className={`toneFeedback ${answer === target ? 'success' : 'attention'}`} role="status">{answer === target ? ui.toneCorrect : ui.toneWrong} {tones[target - 1].pinyin} · Ton {target}</p>,
        next: <ContinueButton type="button" disabled={disabled} onClick={() => { if (saving.current) return; saving.current = true; void (onCheckpoint?.(question === 2 ? 'notation' : `tone:${question + 1}`) ?? Promise.resolve()).then(() => { setQuestion(q => q + 1); setAnswer(null); setHeard(false); }).catch(() => {}).finally(() => { saving.current = false; }); }}>{ui.continue}</ContinueButton>,}}/>}
    </div> : <form className="quizBox stepStack notationPractice" data-checked={practiceChecked} data-correct={practiced} onSubmit={e => { e.preventDefault(); if (practiceChecked || saving.current) return; saving.current = true;
        const ok = practice.trim().toLowerCase() === notationSource.toneNumbers;
        const message = ok ? `Genau: Das Tonzeichen in „${notationSource.pinyin}“ wird als ${notationSource.toneNumbers} geschrieben.` : `Das Tonzeichen in „${notationSource.pinyin}“ steht für Ton ${notationSource.toneNumbers.at(-1)}. Schreibe ${notationSource.toneNumbers}.`;
        const detail = { assessmentIntent: notationPractice.intent, sourceWord: notationSource.id, phase: 'guided_practice', evidence: 'app_checked', result: ok ? 'success' : 'failure' };
        const events = [{type:'tone_notation_practice', detail}, ...(ok ? [{type:'tone_notation_introduced', detail}] : [])];
        void (onCheckpoint?.('notation', { value: practice, message, kind: ok ? 'success' : 'attention' }, events) ?? Promise.resolve()).then(() => {
          setPracticeChecked(true); setPracticed(ok); setPracticeFeedback(message);
          if (!onCheckpoint) for (const event of events) onEvent(event.type, event.detail);
        }).catch(() => {}).finally(() => { saving.current = false; });
      }}>
      <h3>Vom Tonzeichen zur Tonzahl</h3>
      {!practiceChecked && <p className="notationExample"><span>{tones[2].pinyin}</span><span aria-hidden="true">→</span><span>{tones[2].toneNumbers}</span></p>}
      <div className="notationEquation"><span>{notationSource.pinyin}</span><span aria-hidden="true">→</span>
        {practiceChecked ? <span className="notationResponse">{practice}{practiced && <span className="notationCorrect" aria-label="Richtig"> ✓</span>}</span> : <label className="fieldLabel"><span className="srOnly">Schreib denselben Ton jetzt als Zahl.</span><input placeholder={`${notationSource.toneNumbers.slice(0, -1)}_`} value={practice} onChange={e => { setPractice(e.target.value); setPracticed(false); }} readOnly={practiceChecked} autoCorrect="off" autoCapitalize="off" spellCheck={false} maxLength={20} /></label>}
      </div>
      {!practiceChecked && <button type="submit" disabled={!practice.trim() || disabled}>Prüfen</button>}
      {practiceChecked && <Resolution operation="notation" parts={{
        feedback: <p role="status" className={practiced?'srOnly':'feedback attention'}>{practiceFeedback}</p>,
        next: practiced ? <ContinueButton type="button" disabled={disabled} onClick={onNext}>Weiter</ContinueButton> : <button type="button" className="secondaryButton" onClick={() => { setPracticeChecked(false); setPracticeFeedback(''); }}>Noch einmal versuchen</button>,
      }}/>}
      <InfoDisclosure label="Zur Tonzahl-Schreibweise"><p>Die Zahl kommt direkt nach der Silbe: {tones.map(t => `${t.toneNumbers} → ${t.pinyin}`).join(', ')}. In Wörtern zum Beispiel {itemMap.get('nihao')!.toneNumbers} → {itemMap.get('nihao')!.pinyin}.</p></InfoDisclosure>
    </form>}<Recorder onEvent={onEvent} /></>}
  </div>;
}

export function ToneRecall({ item, task, onResult, onEvent, onNext, disabled, restored }: {
  restored?: SavedFeedback; item: Item; task: Task; onResult: (correct: boolean, feedback: SavedFeedback) => Promise<void>; onEvent: (type: string, detail?: Record<string, string | number | boolean>) => void; onNext: () => void; disabled: boolean;
}) {
  const [heard, setHeard] = useState(!!restored), [answer, setAnswer] = useState<number | null>(restored ? Number(restored.value) : null);
  return <div className="stepStack toneRecall" data-task-complete={answer !== null}><p>Höre den bekannten Ausdruck. Wähle den Ton {item.syllables.length > 1 ? `der ${task.toneIndex! + 1}. Silbe` : 'der Silbe'}.</p>
    <SlotExampleNote item={item}/><AudioButton emphasis="stimulus" src={item.audio} onPlay={() => { setHeard(true); onEvent('audio_replay'); }} />
    <div className="toneChoices">{[1,2,3,4].map(n => <button className={answer === n ? 'toneChoice isSelected' : 'toneChoice'} aria-pressed={answer === n} aria-label={`Ton ${n} wählen`} key={n} disabled={disabled || !heard || answer !== null} type="button" onClick={() => void onResult(n === task.tone, { value: String(n), message: '', kind: n === task.tone ? 'success' : 'attention' }).then(() => setAnswer(n)).catch(() => {})}>{n}</button>)}</div>
    {answer !== null && <Resolution operation="tone" parts={{feedback: <p className={`toneFeedback ${answer === task.tone ? 'success' : 'attention'}`} role="status">{answer === task.tone ? ui.toneCorrect : ui.toneWrong} {item.pinyin} · Gesucht war Ton {task.tone}. Deine Aussprache wurde nicht bewertet.</p>,next: <ContinueButton disabled={disabled} type="button" onClick={onNext}>Weiter</ContinueButton>,}}/>}
  </div>;
}
