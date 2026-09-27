import { useRef, useState } from 'react';
import type { Item, Task } from '../schema/content';
import { itemMap } from '../content';
import { normalizeText, interpretAnswer, answerFeedback, type Interpretation } from '../answer';
import { AudioButton } from '../../../core/exercises/AudioButton';
import { Recorder } from '../../../core/audio/Recorder';
import { ui } from '../../../core/i18n/de';
import { WritingExercise } from './WritingExercise';
import { ToneLab, ToneRecall } from './ToneLab';
export type Evidence = { result: 'success' | 'failure' | 'unsure'; assisted: boolean; detail?: Record<string, string | number | boolean> };
export function Exercise({ task, script, name, setName, onEvent, onAttempt, onTone, onNext, disabled }: {
  task: Task; script: 'hant' | 'hans'; name: string; setName: (v: string) => void;
  onEvent: (type: string, detail?: Record<string, string | number | boolean>) => void;
  onAttempt: (e: Evidence) => Promise<void>; onTone: (tone: number, correct: boolean) => Promise<void>;
  onNext: () => void; disabled: boolean;
}) {
  const [help, setHelp] = useState(false); const [input, setInput] = useState('');
  const [heard, setHeard] = useState(false); const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [retryEvidence, setRetryEvidence] = useState<Evidence | null>(null);
  const submitting = useRef(false);
  const item = itemMap.get(task.itemId ?? '') as Item;
  const audio = (slow = false) => <AudioButton src={(slow ? item.slowAudio : item.audio)!} label={slow ? ui.slow : ui.listen} onPlay={() => { setHeard(true); onEvent(slow ? 'slow_audio' : 'audio_replay'); }} />;
  const reveal = () => { setHelp(true); onEvent('pinyin_reveal'); };
  async function check() {
    if (submitting.current || answered) return; submitting.current = true;
    try {
      let result: Evidence; let interpreted: Interpretation | undefined;
      if (retryEvidence) result = retryEvidence;
      else {
        if (task.kind === 'recall') {
          interpreted = interpretAnswer(input, item, name);
          result = { result: interpreted.result, assisted: help, detail: { ...interpreted } };
        } else result = { result: item.answers.some(a => normalizeText(a) === normalizeText(input)) ? 'success' : 'failure', assisted: help };
        setRetryEvidence(result);
      }
      await onAttempt(result); setRetryEvidence(null);
      setFeedback(task.kind === 'recall' ? answerFeedback(interpreted ?? result.detail as Interpretation) : result.result === 'success' ? 'Richtig.' : `Die Bedeutung ist: ${item.meaning.de}.`);
      setAnswered(true);
    } finally { submitting.current = false; }
  }
  if (task.kind === 'tone-recall') return <ToneRecall item={item} task={task} onResult={correct => onAttempt({ result: correct ? 'success' : 'failure', assisted: false })} onEvent={onEvent} onNext={onNext} disabled={disabled} />;
  if (task.kind === 'tones') return <ToneLab script={script} onEvent={onEvent} onResult={onTone} onNext={onNext} disabled={disabled} />;
  if (task.kind === 'writing') return <WritingExercise recall={!!task.recall} onEvent={onEvent} disabled={disabled} onComplete={r => { void onAttempt({ ...r, detail: { mode: r.mode, selfReport: true } }).then(onNext).catch(() => {}); }} />;
  const reference = <div className="reference"><p lang={`zh-${script === 'hant' ? 'Hant' : 'Hans'}`} className="hanziSentence">{item[script]}{item.slot === 'name' ? ' …' : ''}</p><p className="pinyin">{item.pinyin}{item.slot === 'name' ? ' …' : ''}</p><p>{item.meaning.de}</p></div>;
  if (task.kind === 'encounter') return <div className="stepStack">
    <div className="buttonRow">{audio()}{item.slowAudio && audio(true)}</div>
    <p className="hanziHero" lang="zh">{item[script]}</p>
    {!help ? <button type="button" className="textButton" onClick={reveal}>{ui.reveal}</button> : <><p className="pinyin">{item.pinyin}</p><p>{item.meaning.de}</p></>}
    {item.slot === 'name' && <><label className="fieldLabel">{ui.name}<input maxLength={60} value={name} onChange={e => setName(e.target.value)} autoComplete="given-name" /></label><p className="personalSentence" lang="zh">{item[script]} {name || '…'}。</p><p>{ui.nameHint}</p></>}
    <Recorder onEvent={onEvent} />
    <button type="button" disabled={disabled || (item.slot === 'name' && !name.trim())} onClick={onNext}>{ui.continue}</button>
  </div>;
  return <div className="stepStack">
    {task.kind === 'listen' && audio()}
    {task.kind === 'read' && <p className="hanziHero" lang="zh">{item[script]}</p>}
    <form onSubmit={e => { e.preventDefault(); void check().catch(() => {}); }} className="stepStack">
      <label className="fieldLabel">{ui.answer}<input value={input} onChange={e => setInput(e.target.value)} autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={160} readOnly={answered} disabled={disabled || !!retryEvidence} /></label>
      {task.kind === 'recall' && <p className="muted">{ui.typeHint}</p>}
      {!answered && <div className="buttonRow"><button type="submit" disabled={disabled || !input.trim() || (task.kind === 'listen' && !heard)}>{ui.check}</button><button type="button" className="textButton" disabled={disabled || !!retryEvidence} onClick={reveal}>{ui.help}</button></div>}
    </form>
    {feedback && <p role="status" className="feedback">{feedback}</p>}
    {(help && !answered) && <>{reference}<div className="buttonRow">{audio()}{item.slowAudio && audio(true)}</div></>}
    {answered && <button type="button" disabled={disabled} onClick={onNext}>{ui.continue}</button>}
  </div>;
}
