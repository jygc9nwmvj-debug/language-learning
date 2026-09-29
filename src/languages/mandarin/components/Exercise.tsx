import { ContinueButton } from '../../../core/exercises/Controls';
import { InfoDisclosure, AnswerSummary } from '../../../core/exercises/Controls';
import { PhraseForm, ExplanationText } from './PhraseForm';
import { introductionForTask, introduced, introductionDetail } from '../introduction';
import type { ResearchEvent, SavedFeedback, SavedEvaluation, Checkpoint } from '../../../core/progress/db';
import { hasToneAttention, attentionAssessment } from '../attention';
import { AttentionIntroduction, ToneFocus, type Introduce } from './AttentionIntroduction';
import { useRef, useState } from 'react';
import type { Item, Task } from '../schema/content';
import { itemMap } from '../content';
import { normalizeText, evaluateAnswer, answerFeedback, type Interpretation } from '../answer';
import { AudioButton } from '../../../core/exercises/AudioButton';
import { SpeakingPractice } from '../../../core/exercises/SpeakingPractice';
import { displayDiagnosis } from '../displayDiagnosis';
import { ui } from '../../../core/i18n/de';
import { WritingExercise } from './WritingExercise';
import { NumberSequence } from './NumberSequence';
import { ToneLab, ToneRecall } from './ToneLab';
export type Evidence = { feedback?: SavedFeedback; part?: string; result: 'success' | 'failure' | 'unsure'; assisted: boolean; detail?: Record<string, string | number | boolean> };
export function Exercise({ task, script, name, setName, onEvent, onAttempt, onTone, onNext, disabled, attentionHistory, onIntroduce, savedEvaluation, onCheckpoint, savedAssessment }: {
  savedAssessment?: import('../schema/content').Assessment;
  savedEvaluation?: SavedEvaluation; onCheckpoint?: Checkpoint;
  attentionHistory?: ResearchEvent[]; onIntroduce?: Introduce;
  task: Task; script: 'hant' | 'hans'; name: string; setName: (v: string) => void;
  onEvent: (type: string, detail?: Record<string, string | number | boolean>) => void;
  onAttempt: (e: Evidence) => Promise<void>; onTone: (tone: number, correct: boolean, part: string, feedback: SavedFeedback) => Promise<void>;
  onNext: () => void | Promise<void>; disabled: boolean;
}) {
  const [restored] = useState(savedEvaluation?.results.main);
  const revealed = useRef(!!restored?.help);
  const [pinyinVisible,setPinyinVisible] = useState(!!restored?.help);
  const [help, setHelp] = useState(!!restored?.help); const [input, setInput] = useState(restored?.value ?? '');
  const [referencePlaying, setReferencePlaying] = useState(false);
  const [heard, setHeard] = useState(false); const [feedback, setFeedback] = useState(restored?.message ?? '');
  const [answered, setAnswered] = useState(!!restored);
  const [feedbackKind, setFeedbackKind] = useState<'success' | 'attention' | 'error'>(restored?.kind ?? 'success');
  const [retryEvidence, setRetryEvidence] = useState<Evidence | null>(null);
  const displayAssessment = useRef(restored ? savedAssessment : undefined);
  const submitting = useRef(false), writingRecorded = useRef(false);
  const [introItem] = useState(() => attentionHistory && onIntroduce ? introductionForTask(task,script,attentionHistory) : undefined);
  const item = itemMap.get(task.itemId ?? '') as Item;
  // Freeze the writing mode for this occurrence: saving introduction evidence must not
  // replace a running guided sequence with its one-stage recall configuration.
  const [writingRecall] = useState(() => restored?.stage !== undefined && restored.stage > 0 ? false : !!task.recall && (!attentionHistory || introduced(item,'writing',script,attentionHistory)));
  const known = !!item && !!attentionHistory && introduced(item,'meaning',script,attentionHistory);
  const effectiveAssessment = task.assess && (attentionHistory ? attentionAssessment(task.assess, item, attentionHistory) : task.assess);
  const audio = (slow = false, stimulus = false) => <AudioButton emphasis={stimulus ? 'stimulus' : 'reference'} src={(slow ? item.slowAudio : item.audio)!} label={slow ? ui.slow : ui.listen} autoPlay={task.kind === 'encounter' && !slow} onPlaybackChange={task.kind === 'encounter' ? setReferencePlaying : undefined} onPlay={() => { setHeard(true); if (task.kind === 'encounter' && !revealed.current) { revealed.current = true; setHelp(true); onEvent('pinyin_reveal'); } onEvent(slow ? 'slow_audio' : 'audio_replay'); }} />;
  const reveal = () => { setHelp(true); setPinyinVisible(true); if (!revealed.current) { revealed.current = true; onEvent('pinyin_reveal'); } };
  async function check() {
    if (submitting.current || answered) return; submitting.current = true;
    try {
      let result: Evidence; let interpreted: Interpretation | undefined;
      if (retryEvidence) result = retryEvidence;
      else {
        if (task.kind === 'recall') {
          displayAssessment.current = effectiveAssessment;
          interpreted = evaluateAnswer(input, item, effectiveAssessment!, name);
          result = { result: interpreted.result, assisted: help, detail: { ...interpreted, assessToneNotation: effectiveAssessment!.toneNotation, assessNeutralTone: effectiveAssessment!.neutralTone } };
        } else result = { result: item.answers.some(a => normalizeText(a) === normalizeText(input)) ? 'success' : 'failure', assisted: help };
        setRetryEvidence(result);
      }
      const interpretation = interpreted ?? result.detail as Interpretation | undefined;
      const feedback: SavedFeedback = result.feedback ?? {
        value: input, help,
        message: task.kind === 'recall' ? answerFeedback(interpretation!) : result.result === 'success' ? 'Richtig.' : `Die Bedeutung ist: ${item.meaning.de}.`,
        kind: result.result === 'failure' ? 'error' : interpretation && !interpretation.fullyCorrect ? 'attention' : 'success',
      };
      result = { ...result, feedback }; setRetryEvidence(result);
      await onAttempt(result); setRetryEvidence(null);
      setFeedback(feedback.message); setFeedbackKind(feedback.kind);
      setAnswered(true);
    } finally { submitting.current = false; }
  }
  if (!restored && introItem && onIntroduce) return <AttentionIntroduction item={introItem} script={script} history={attentionHistory} name={name} setName={setName} disabled={disabled} onIntroduce={onIntroduce} onEvent={onEvent} onNext={onNext} />;
  if (task.kind === 'tone-recall' && attentionHistory && !hasToneAttention(item, attentionHistory) && onIntroduce) return <div className="stepStack"><p>Diesen Ton schauen wir zuerst gemeinsam an.</p><ToneFocus item={item} />{audio()}<ContinueButton disabled={disabled} onClick={() => void onIntroduce('tone_attention_confirmed', { item: item.id, toneNumbers: item.toneNumbers, attentionVersion: 1 }).then(onNext).catch(() => {})}>Weiter</ContinueButton></div>;
  if(task.kind==='sequence')return <NumberSequence restored={restored} task={task} script={script} disabled={disabled} onAttempt={onAttempt} onNext={onNext}/>;
  if (task.kind === 'tone-recall') return <ToneRecall restored={restored} item={item} task={task} onResult={(correct, feedback) => onAttempt({ result: correct ? 'success' : 'failure', assisted: false, feedback })} onEvent={onEvent} onNext={onNext} disabled={disabled} />;
  if (task.kind === 'tones') return <ToneLab saved={savedEvaluation} onCheckpoint={onCheckpoint} notationPractice={task.notationPractice!} familiar={attentionHistory?.some(e => e.taskId === 'tones' && e.type === 'task_completed')} script={script} onEvent={onEvent} onResult={onTone} onNext={onNext} disabled={disabled} />;
  if (task.kind === 'writing') return <WritingExercise restored={restored} itemId={task.itemId!} recall={writingRecall} onNext={onNext} onEvent={onEvent} disabled={disabled} onComplete={async r => { if (!writingRecorded.current) { if(onIntroduce && !writingRecall) await onIntroduce('introduction_dimensions',introductionDetail(item,script,['writing'],'guided_writing_completed')); await onAttempt({ ...r, feedback: { value: '', message: r.result === 'success' ? 'Geschafft. Die Strichfolge ist vollständig.' : 'Danke für deine Einschätzung. Wir gehen weiter.', kind: r.result === 'success' ? 'success' : 'attention', result: r.result, help: r.assisted, mode: r.mode, selfReport: r.selfReport, ink: r.ink, inkSize: r.inkSize, stage: r.stage }, detail: { mode: r.mode, selfReport: r.selfReport, writingRecall } }); writingRecorded.current = true; } }} />;
  const form = (pinyin: boolean, interactive: boolean) => <PhraseForm item={item} script={script} showPinyin={pinyin} interactive={interactive} onExplore={onEvent} />;
  const pronunciation = <>{known && !pinyinVisible && <button className="utilityButton" type="button" onClick={()=>setPinyinVisible(true)}>Pinyin zeigen</button>}<div className="pronunciationMeaning"><p className="meaning">{item.meaning.de}</p></div></>;
  const needsCorrection = answered && task.kind === 'recall' && feedbackKind !== 'success';
  const diagnosis = needsCorrection ? displayDiagnosis(input,item,displayAssessment.current) : undefined;
  const reference = <div className="reference">{form(true,true)}<p>{item.meaning.de}</p></div>;
  if (task.kind === 'encounter') return <SpeakingPractice readyToRecord={help && !referencePlaying} disabled={disabled || !help || (item.slot === 'name' && !name.trim())} onEvent={onEvent} onStarted={() => { if (!help) reveal(); }} onNext={() => { if (!disabled && help && (item.slot !== 'name' || name.trim())) return onNext(); }}
    reference={<>{form(help && (!known || pinyinVisible),help)}
      {!help ? <button type="button" className="utilityButton" onClick={reveal}>{ui.reveal}</button> : pronunciation}</>}
    audio={<>{audio()}{item.slowAudio && audio(true)}</>}>
    {item.learning && <p className='muted'><ExplanationText value={item.learning.note} script={script} /></p>}
    {item.learning?.discovery && <details><summary>Eine kleine Entdeckung</summary><p><ExplanationText value={item.learning.discovery} script={script} /></p></details>}
    {item.slot === 'name' && <div className="namePractice"><label className="fieldLabel">{ui.name}<input maxLength={60} value={name} onChange={e => setName(e.target.value)} autoComplete="given-name" disabled={disabled} /></label><p className="personalSentence" lang="zh">{item[script]} {name || '…'}。</p><p className="muted">{ui.nameHint}</p></div>}
  </SpeakingPractice>;
  if (task.kind === 'read' && answered) return <div className="stepStack resolvedExercise" data-task-complete={answered} data-outcome={feedbackKind}>
    <AnswerSummary value={input}/>
    <p role="status" className={`feedback ${feedbackKind}`}>{feedback}</p>
    <SpeakingPractice disabled={disabled} onEvent={onEvent} onNext={onNext}
      reference={<>{form(!known || pinyinVisible,true)}{pronunciation}</>}
      audio={<>{audio()}{item.slowAudio && audio(true)}</>} />
  </div>;
  return <div className="stepStack responseExercise" data-task-complete={answered} data-outcome={answered ? feedbackKind : undefined}>
    {task.kind === 'listen' && audio(false, !answered)}
    {task.kind === 'read' && form(false,false)}
    {answered ? diagnosis?.mode === 'inline' ? <div className="inlineCorrection" role="status" aria-label="Deine Antwort mit Korrekturen"><span className="controlLabel">Deine Antwort</span><div className="correctionTokens">{diagnosis.elements.map((part,i)=><span className="correctionToken" data-kind={part.kind ?? 'correct'} key={i}>{part.kind ? <><del>{part.original}</del><span aria-hidden="true"> → </span><span className="srOnly"> wird korrigiert zu </span><ins>{part.correction}</ins>{part.kind==='tone' && <small>Ton</small>}</> : part.original}</span>)}</div>{diagnosis.hasTone && <p className="muted">Deine Aussprache wurde nicht bewertet.</p>}</div> : <AnswerSummary value={input}/> : <form onSubmit={e => { e.preventDefault(); void check().catch(() => {}); }} className="stepStack">
      <label className="fieldLabel">{ui.answer}<input value={input} onChange={e => setInput(e.target.value)} autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={160} readOnly={answered} disabled={disabled || !!retryEvidence} /></label>
      {task.kind === 'recall' && <><InfoDisclosure label="Zur Texteingabe"><p>{ui.typeHint}</p></InfoDisclosure>{task.assess?.toneNotation && !effectiveAssessment?.toneNotation && <p className="assessmentNote">Hier zählt der Ausdruck. Seine Tonnotation wird noch nicht bewertet.</p>}</>}
      {!answered && <div className="buttonRow"><button type="submit" disabled={disabled || !input.trim() || (task.kind === 'listen' && !heard)}>{ui.check}</button><button type="button" className="textButton" disabled={disabled || !!retryEvidence} onClick={reveal}>{ui.help}</button></div>}
    </form>}
    {feedback && diagnosis?.mode !== 'inline' && <p role="status" className={`feedback ${feedbackKind}`}>{feedback}</p>}
    {(help && !answered) && <>{reference}<div className="referenceAudio" role="group" aria-label="Referenz anhören">{audio()}{item.slowAudio && audio(true)}</div></>}
    {needsCorrection ? <div className="reference correctionReference">
      {form(true,true)}<p>{item.meaning.de}</p>
      <div className="referenceAudio" role="group" aria-label="Korrekte Zielphrase anhören">
        <AudioButton src={item.audio} onPlay={() => onEvent('optional_reference_audio', { optionalPractice: true, context: 'correction', variant: 'natural' })} />
        {item.slowAudio && <AudioButton src={item.slowAudio} label={ui.slow} onPlay={() => onEvent('optional_reference_audio', { optionalPractice: true, context: 'correction', variant: 'careful_slow' })} />}
      </div>
    </div> : answered && item.exploration && form(false,true)}
    {answered && <ContinueButton type="button" disabled={disabled} onClick={onNext}>{ui.continue}</ContinueButton>}
  </div>;
}
