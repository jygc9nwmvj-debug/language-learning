import {CorrectionVersions} from '../../../core/exercises/CorrectionVersions';
import {correctionComparison} from '../correction';
import {displayInterpretation} from '../displayDiagnosis';
import type {Item,Assessment} from '../schema/content';
// Presentation only; the occurrence's saved assessment remains the source of evidence.
export function ProductionFeedback({input,item,assessment,legacyMessage,success=false}:{input:string;item:Item;assessment?:Assessment;legacyMessage:string;success?:boolean}){
 const finding=assessment?displayInterpretation(input,item,assessment):undefined;
 const comparison=correctionComparison(input,item,assessment),correct=success&&(!finding||finding.fullyCorrect)&&!comparison.originalRanges.length&&!comparison.acceptedRanges.length;
 const state=correct?'success':finding?.content==='correct'?finding.toneNotation==='omitted'?'addition':'tone':comparison.localized?'form':'comparison';
 return <section className="productionFeedback" data-feedback-state={state} role="status" aria-label="Rückmeldung zur Eingabe">
  <CorrectionVersions {...comparison} accepted={correct?input:comparison.accepted}/>
  {!correct&&<p className="feedbackAcknowledgement">{finding?.content==='correct'?finding.toneNotation==='omitted'?'Der Ausdruck stimmt; ergänze die Tonangaben.':'Der Ausdruck stimmt; die Tonangabe weicht ab.':finding?.construction==='incomplete'?'Ergänze den Ausdruck.':!assessment?legacyMessage:'Vergleiche mit der vollständigen Form.'}</p>}
 </section>;
}
