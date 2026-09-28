import { InfoDisclosure, AnswerSummary } from '../../../core/exercises/Controls';
import { PhraseForm, ExplanationText } from './PhraseForm';
import { introductionForTask, introduced, introductionDetail } from '../introduction';
import type { ResearchEvent } from '../../../core/progress/db';
import { hasToneAttention, attentionAssessment } from '../attention';
import { AttentionIntroduction, ToneFocus, type Introduce } from './AttentionIntroduction';
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
export function Exercise({ task, script, name, setName, onEvent, onAttempt, onTone, onNext, disabled, attentionHistory, onIntroduce }: {
  attentionHistory?: ResearchEvent[]; onIntroduce?: Introduce;
  task: Task; script: 'hant' | 'hans'; name: string; setName: (v: string) => void;
  onEvent: (type: string, detail?: Record<string, string | number | boolean>) => void;
  onAttempt: (e: Evidence) => Promise<void>; onTone: (tone: number, correct: boolean) => Promise<void>;
  onNext: () => void | Promise<void>; disabled: boolean;
}) {
  const [pinyinVisible,setPinyinVisible] = useState(false);
  const [help, setHelp] = useState(false); const [input, setInput] = useState('');
  const [referencePlaying, setReferencePlaying] = useState(false);
  const [heard, setHeard] = useState(false); const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [feedbackKind, setFeedbackKind] = useState<'success' | 'attention' | 'error'>('success');
  const [retryEvidence, setRetryEvidence] = useState<Evidence | null>(null);
  const submitting = useRef(false), writingRecorded = useRef(false);
  const [introItem] = useState(() => attentionHistory && onIntroduce ? introductionForTask(task,script,attentionHistory) : undefined);
  const item = itemMap.get(task.itemId ?? '') as Item;
  // Freeze the writing mode for this occurrence: saving introduction evidence must not
  // replace a running guided sequence with its one-stage recall configuration.
  const [writingRecall] = useState(() => !!task.recall && (!attentionHistory || introduced(item,'writing',script,attentionHistory)));
  const known = !!item && !!attentionHistory && introduced(item,'meaning',script,attentionHistory);
  const effectiveAssessment = task.assess && (attentionHistory ? attentionAssessment(task.assess, item, attentionHistory) : task.assess);
  const audio = (slow = false) => <AudioButton src={(slow ? item.slowAudio : item.audio)!} label={slow ? ui.slow : ui.listen} autoPlay={task.kind === 'encounter' && !slow} onPlaybackChange={task.kind === 'encounter' ? setReferencePlaying : undefined} onPlay={() => { setHeard(true); if (task.kind === 'encounter' && !help) { setHelp(true); onEvent('pinyin_reveal'); } onEvent(slow ? 'slow_audio' : 'audio_replay'); }} />;
  const reveal = () => { setHelp(true); setPinyinVisible(true); onEvent('pinyin_reveal'); };
  async function check() {
    if (submitting.current || answered) return; submitting.current = true;
    try {
      let result: Evidence; let interpreted: Interpretation | undefined;
      if (retryEvidence) result = retryEvidence;
      else {
        if (task.kind === 'recall') {
          interpreted = evaluateAnswer(input, item, effectiveAssessment!, name);
          result = { result: interpreted.result, assisted: help, detail: { ...interpreted, assessToneNotation: effectiveAssessment!.toneNotation, assessNeutralTone: effectiveAssessment!.neutralTone } };
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
  if (introItem && onIntroduce) return <AttentionIntroduction item={introItem} script={script} history={attentionHistory} name={name} setName={setName} disabled={disabled} onIntroduce={onIntroduce} onEvent={onEvent} onNext={onNext} />;
  if (task.kind === 'tone-recall' && attentionHistory && !hasToneAttention(item, attentionHistory) && onIntroduce) return <div className="stepStack"><p>Diesen Ton schauen wir zuerst gemeinsam an.</p><ToneFocus item={item} />{audio()}<button disabled={disabled} onClick={() => void onIntroduce('tone_attention_confirmed', { item: item.id, toneNumbers: item.toneNumbers, attentionVersion: 1 }).then(onNext).catch(() => {})}>Weiter</button></div>;
  if(task.kind==='sequence')return <NumberSequence task={task} script={script} disabled={disabled} onAttempt={onAttempt} onNext={onNext}/>;
  if (task.kind === 'tone-recall') return <ToneRecall item={item} task={task} onResult={correct => onAttempt({ result: correct ? 'success' : 'failure', assisted: false })} onEvent={onEvent} onNext={onNext} disabled={disabled} />;
  if (task.kind === 'tones') return <ToneLab familiar={attentionHistory?.some(e => e.taskId === 'tones' && e.type === 'task_completed')} script={script} onEvent={onEvent} onResult={onTone} onNext={onNext} disabled={disabled} />;
  if (task.kind === 'writing') return <WritingExercise itemId={task.itemId!} recall={writingRecall} onNext={onNext} onEvent={onEvent} disabled={disabled} onComplete={async r => { if (!writingRecorded.current) { if(onIntroduce && !writingRecall) await onIntroduce('introduction_dimensions',introductionDetail(item,script,['writing'],'guided_writing_completed')); await onAttempt({ ...r, detail: { mode: r.mode, selfReport: r.selfReport, writingRecall } }); writingRecorded.current = true; } }} />;
  const form = (pinyin: boolean, interactive: boolean) => <PhraseForm item={item} script={script} showPinyin={pinyin} interactive={interactive} onExplore={onEvent} />;
  const pronunciation = <>{known && !pinyinVisible && <button className="utilityButton" type="button" onClick={()=>setPinyinVisible(true)}>Pinyin zeigen</button>}<div className="pronunciationMeaning"><p className="meaning">{item.meaning.de}</p></div></>;
  const reference = <div className="reference">{form(true,true)}<p>{item.meaning.de}</p></div>;
  if (task.kind === 'encounter') return <SpeakingPractice readyToRecord={help && !referencePlaying} disabled={disabled || !help || (item.slot === 'name' && !name.trim())} onEvent={onEvent} onStarted={() => { if (!help) reveal(); }} onNext={() => { if (!disabled && help && (item.slot !== 'name' || name.trim())) return onNext(); }}
    reference={<>{form(help && (!known || pinyinVisible),help)}
      {!help ? <button type="button" className="utilityButton" onClick={reveal}>{ui.reveal}</button> : pronunciation}</>}
    audio={<>{audio()}{item.slowAudio && audio(true)}</>}>
    {item.learning && <p className='muted'><ExplanationText value={item.learning.note} script={script} /></p>}
    {item.learning?.discovery && <details><summary>Eine kleine Entdeckung</summary><p><ExplanationText value={item.learning.discovery} script={script} /></p></details>}
    {item.slot === 'name' && <div className="namePractice"><label className="fieldLabel">{ui.name}<input maxLength={60} value={name} onChange={e => setName(e.target.value)} autoComplete="given-name" disabled={disabled} /></label><p className="personalSentence" lang="zh">{item[script]} {name || '…'}。</p><p className="muted">{ui.nameHint}</p></div>}
  </SpeakingPractice>;
  if (task.kind === 'read' && answered) return <div className="stepStack resolvedExercise">
    <AnswerSummary value={input}/>
    <p role="status" className={`feedback ${feedbackKind}`}>{feedback}</p>
    <SpeakingPractice compact disabled={disabled} onEvent={onEvent} onNext={onNext}
      reference={<>{form(!known || pinyinVisible,true)}{pronunciation}</>}
      audio={<>{audio()}{item.slowAudio && audio(true)}</>} />
  </div>;
  return <div className="stepStack">
    {task.kind === 'listen' && audio()}
    {task.kind === 'read' && form(false,false)}
    {answered ? <AnswerSummary value={input}/> : <form onSubmit={e => { e.preventDefault(); void check().catch(() => {}); }} className="stepStack">
      <label className="fieldLabel">{ui.answer}<input value={input} onChange={e => setInput(e.target.value)} autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={160} readOnly={answered} disabled={disabled || !!retryEvidence} /></label>
      {task.kind === 'recall' && <><InfoDisclosure label="Zur Texteingabe"><p>{ui.typeHint}</p></InfoDisclosure>{task.assess?.toneNotation && !effectiveAssessment?.toneNotation && <p className="assessmentNote">Hier zählt der Ausdruck. Seine Tonnotation wird noch nicht bewertet.</p>}</>}
      {!answered && <div className="buttonRow"><button type="submit" disabled={disabled || !input.trim() || (task.kind === 'listen' && !heard)}>{ui.check}</button><button type="button" className="textButton" disabled={disabled || !!retryEvidence} onClick={reveal}>{ui.help}</button></div>}
    </form>}
    {feedback && <p role="status" className={`feedback ${feedbackKind}`}>{feedback}</p>}
    {(help && !answered) && <>{reference}<div className="buttonRow">{audio()}{item.slowAudio && audio(true)}</div></>}
    {answered && item.exploration && form(false,true)}
    {answered && <button type="button" disabled={disabled} onClick={onNext}>{ui.continue}</button>}
  </div>;
}
