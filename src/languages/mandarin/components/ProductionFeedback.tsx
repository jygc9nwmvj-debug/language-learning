import { ResponseComparison } from '../../../core/exercises/Controls';
import { evaluateAnswer } from '../answer';
import { displayDiagnosis } from '../displayDiagnosis';
import type { Item, Assessment } from '../schema/content';

// Display only: the stored outcome, feedback and learning evidence are never changed.
export function ProductionFeedback({input,item,assessment,legacyMessage,success=false}:{input:string;item:Item;assessment?:Assessment;legacyMessage:string;success?:boolean}) {
  const finding=assessment?evaluateAnswer(input,item,assessment):undefined;
  const diagnosis=displayDiagnosis(input,item,assessment);
  const lexicalCorrect=finding?.content==='correct' && finding.construction==='complete';
  const omitted=lexicalCorrect && finding?.toneNotation==='omitted';
  const different=lexicalCorrect && finding?.toneNotation==='different';
  const state=success?'success':omitted?'addition':different?'tone':diagnosis.mode==='inline'?'form':'comparison';
  return <section className="productionFeedback" data-feedback-state={state} role="status" aria-label="Rückmeldung zu deiner Antwort">
    <ResponseComparison answer={!omitted && diagnosis.mode==='inline' ? <span className="inlineCorrection">{diagnosis.elements.map((part,i)=><span key={i}>{i>0?' ':''}{part.kind && !part.toneOmitted ? <del>{part.original}</del> : part.original}</span>)}</span> : input} reference={<span lang="zh-Latn">{item.pinyin}{item.slot==='name'?' + dein Name':''}</span>}/>
    {success ? <p className="feedback success">{legacyMessage}</p> : <>
      {lexicalCorrect && <p className="feedbackAcknowledgement">{omitted?'Richtig. Die Töne fehlen noch:':'Der Ausdruck stimmt. Hier weicht die Tonangabe ab:'}</p>}
      {finding?.content==='partial' && <p>Der Anfang stimmt. Noch nicht vollständig.</p>}
      {finding?.content==='correct' && finding.construction==='incomplete' && <p>Der Ausdruck stimmt. Ergänze deinen Namen.</p>}
      {!finding && <p className="muted">{legacyMessage}</p>}
    </>}
    {(omitted||different) && <p className="muted">Deine Aussprache wurde nicht bewertet.</p>}
  </section>;
}
