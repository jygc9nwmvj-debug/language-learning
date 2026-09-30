import { AnswerSummary } from '../../../core/exercises/Controls';
import { evaluateAnswer } from '../answer';
import { displayDiagnosis } from '../displayDiagnosis';
import type { Item, Assessment } from '../schema/content';

// Display only: the stored outcome, feedback and learning evidence are never changed.
export function ProductionFeedback({input,item,assessment,legacyMessage}:{input:string;item:Item;assessment?:Assessment;legacyMessage:string}) {
  const finding=assessment?evaluateAnswer(input,item,assessment):undefined;
  const diagnosis=displayDiagnosis(input,item,assessment);
  const lexicalCorrect=finding?.content==='correct' && finding.construction==='complete';
  const omitted=lexicalCorrect && finding?.toneNotation==='omitted';
  const different=lexicalCorrect && finding?.toneNotation==='different';
  const state=omitted?'addition':different?'tone':diagnosis.mode==='inline'?'form':'comparison';
  return <section className="productionFeedback" data-feedback-state={state} role="status" aria-label="Rückmeldung zu deiner Antwort">
    {lexicalCorrect && <p className="feedbackAcknowledgement">{omitted?'Richtig. Die Töne fehlen noch:':'Der Ausdruck stimmt. Korrigiere nur die Tonangaben:'}</p>}
    {omitted ? <><AnswerSummary value={input}/><div className="correctComparison"><span className="controlLabel">Mit Tönen</span><span>{item.pinyin}</span></div></> : diagnosis.mode==='inline' ? <div className="inlineCorrection"><span className="controlLabel">Deine Antwort</span><div className="correctionTokens">{diagnosis.elements.map((part,i)=><span className="correctionToken" data-kind={part.kind??'correct'} key={i}>{part.kind?<><span className="correctionPair">{part.toneOmitted?<span>{part.original}</span>:<del>{part.original}</del>}<span className="srOnly">{part.toneOmitted?' ergänzt zu ':' wird korrigiert zu '}</span><ins>{part.correction}</ins></span>{part.kind==='tone'&&<small>{part.toneOmitted?'Ton fehlt':'Ton'}</small>}</>:part.original}</span>)}</div></div> : <><AnswerSummary value={input}/>{finding?.content==='partial' && <p>Der Anfang stimmt. Noch nicht vollständig.</p>}<div className="correctComparison"><span className="controlLabel">Korrekt</span><span>{item.pinyin}{item.slot==='name'?' + dein Name':''}</span></div>{finding?.content==='correct' && finding.construction==='incomplete' && <p>Der Ausdruck stimmt. Ergänze deinen Namen.</p>}{!finding && <p className="muted">{legacyMessage}</p>}</>}
    {(omitted||different) && <p className="muted">Deine Aussprache wurde nicht bewertet.</p>}
  </section>;
}
