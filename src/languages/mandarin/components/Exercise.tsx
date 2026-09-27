import { useRef, useState } from 'react';
import type { Item, Task } from '../schema/content';
import { itemMap } from '../content';
import { normalizeText, evaluateAnswer, answerFeedback, type Interpretation } from '../answer';
import { AudioButton } from '../../../core/exercises/AudioButton';
import { SpeakingPractice } from '../../../core/exercises/SpeakingPractice';
import { ui } from '../../../core/i18n/de';
import { WritingExercise } from './WritingExercise';
import { NumberSequence } from './NumberSequence';
import { ToneLab, ToneRecall } from './ToneLab';
export type Evidence = { result: 'success' | 'failure' | 'unsure'; assisted: boolean; detail?: Record<string, string | number | boolean> };
export function Exercise({ task, script, name, setName, onEvent, onAttempt, onTone, onNext, disabled }: {
  task: Task; script: 'hant' | 'hans'; name: string; setName: (v: string) => void;
  onEvent: (type: string, detail?: Record<string, string | number | boolean>) => void;
  onAttempt: (e: Evidence) => Promise<void>; onTone: (tone: number, correct: boolean) => Promise<void>;
  onNext: () => void | Promise<void>; disabled: boolean;
}) {
  const [help, setHelp] = useState(false); const [input, setInput] = useState('');
  const [heard, setHeard] = useState(false); const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [feedbackKind, setFeedbackKind] = useState<'success' | 'attention' | 'error'>('success');
  const [retryEvidence, setRetryEvidence] = useState<Evidence | null>(null);
  const submitting = useRef(false), writingRecorded = useRef(false);
  const item = itemMap.get(task.itemId ?? '') as Item;
  const audio = (slow = false) => <AudioButton src={(slow ? item.slowAudio : item.audio)!} label={slow ? ui.slow : ui.listen} onPlay={() => { setHeard(true); if (task.kind === 'encounter' && !help) { setHelp(true); onEvent('pinyin_reveal'); } onEvent(slow ? 'slow_audio' : 'audio_replay'); }} />;
  const reveal = () => { setHelp(true); onEvent('pinyin_reveal'); };
  async function check() {
    if (submitting.current || answered) return; submitting.current = true;
    try {
      let result: Evidence; let interpreted: Interpretation | undefined;
      if (retryEvidence) result = retryEvidence;
      else {
        if (task.kind === 'recall') {
          interpreted = evaluateAnswer(input, item, task.assess!, name);
          result = { result: interpreted.result, assisted: help, detail: { ...interpreted, assessToneNotation: task.assess!.toneNotation, assessNeutralTone: task.assess!.neutralTone } };
        } else result = { result: item.answers.some(a => normalizeText(a) === normalizeText(input)) ? 'success' : 'failure', assisted: help };
        setRetryEvidence(result);
      }
      await onAttempt(result); setRetryEvidence(null);
      setFeedback(task.kind === 'recall' ? answerFeedback(interpreted ?? result.detail as Interpretation) : result.result === 'success' ? 'Richtig.' : `Die Bedeutung ist: ${item.meaning.de}.`);
      const interpretation = interpreted ?? result.detail as Interpretation | undefined;
      setFeedbackKind(result.result === 'failure' ? 'error' : interpretation && !interpretation.fullyCorrect ? 'attention' : 'success');
      setAnswered(true);
    } finally { submitting.current = false; }
  }
  if(task.kind==='sequence')return <NumberSequence task={task} script={script} disabled={disabled} onAttempt={onAttempt} onNext={onNext}/>;
  if (task.kind === 'tone-recall') return <ToneRecall item={item} task={task} onResult={correct => onAttempt({ result: correct ? 'success' : 'failure', assisted: false })} onEvent={onEvent} onNext={onNext} disabled={disabled} />;
  if (task.kind === 'tones') return <ToneLab script={script} onEvent={onEvent} onResult={onTone} onNext={onNext} disabled={disabled} />;
  if (task.kind === 'writing') return <WritingExercise itemId={task.itemId!} recall={!!task.recall} onEvent={onEvent} disabled={disabled} onComplete={async r => { if (!writingRecorded.current) { await onAttempt({ ...r, detail: { mode: r.mode, selfReport: r.selfReport } }); writingRecorded.current = true; } await onNext(); }} />;
  const reference = <div className="reference"><p lang={`zh-${script === 'hant' ? 'Hant' : 'Hans'}`} className="hanziSentence">{item[script]}{item.slot === 'name' ? ' …' : ''}</p><p className="pinyin">{item.pinyin}{item.slot === 'name' ? ' …' : ''}</p><p>{item.meaning.de}</p></div>;
  if (task.kind === 'encounter') return <SpeakingPractice disabled={disabled || !help || (item.slot === 'name' && !name.trim())} onEvent={onEvent} onStarted={() => { if (!help) reveal(); }} onNext={() => { if (!disabled && help && (item.slot !== 'name' || name.trim())) return onNext(); }}
    reference={<><p className="hanziHero" lang="zh">{item[script]}</p>
      {!help ? <button type="button" className="utilityButton" onClick={reveal}>{ui.reveal}</button> : <div className="pronunciationMeaning"><p className="pinyin">{item.pinyin}</p><p className="meaning">{item.meaning.de}</p></div>}</>}
    audio={<>{audio()}{item.slowAudio && audio(true)}</>}>
    {item.learning && <p className='muted'>{item.learning.note}</p>}
    {item.learning?.discovery && <details><summary>Eine kleine Entdeckung</summary><p>{item.learning.discovery}</p></details>}
    {item.slot === 'name' && <div className="namePractice"><label className="fieldLabel">{ui.name}<input maxLength={60} value={name} onChange={e => setName(e.target.value)} autoComplete="given-name" disabled={disabled} /></label><p className="personalSentence" lang="zh">{item[script]} {name || '…'}。</p><p className="muted">{ui.nameHint}</p></div>}
  </SpeakingPractice>;
  if (task.kind === 'read' && answered) return <div className="stepStack resolvedExercise">
    <div className="answerSummary"><span className="controlLabel">Deine Antwort</span><span>{input}</span></div>
    <p role="status" className={`feedback ${feedbackKind}`}>{feedback}</p>
    <SpeakingPractice compact disabled={disabled} onEvent={onEvent} onNext={onNext}
      reference={<><p className="hanziHero" lang="zh">{item[script]}</p><div className="pronunciationMeaning"><p className="pinyin">{item.pinyin}</p><p className="meaning">{item.meaning.de}</p></div></>}
      audio={<>{audio()}{item.slowAudio && audio(true)}</>} />
  </div>;
  return <div className="stepStack">
    {task.kind === 'listen' && audio()}
    {task.kind === 'read' && <p className="hanziHero" lang="zh">{item[script]}</p>}
    <form onSubmit={e => { e.preventDefault(); void check().catch(() => {}); }} className="stepStack">
      <label className="fieldLabel">{ui.answer}<input value={input} onChange={e => setInput(e.target.value)} autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={160} readOnly={answered} disabled={disabled || !!retryEvidence} /></label>
      {task.kind === 'recall' && <p className="muted">{ui.typeHint}</p>}
      {!answered && <div className="buttonRow"><button type="submit" disabled={disabled || !input.trim() || (task.kind === 'listen' && !heard)}>{ui.check}</button><button type="button" className="textButton" disabled={disabled || !!retryEvidence} onClick={reveal}>{ui.help}</button></div>}
    </form>
    {feedback && <p role="status" className={`feedback ${feedbackKind}`}>{feedback}</p>}
    {(help && !answered) && <>{reference}<div className="buttonRow">{audio()}{item.slowAudio && audio(true)}</div></>}
    {answered && <button type="button" disabled={disabled} onClick={onNext}>{ui.continue}</button>}
  </div>;
}
