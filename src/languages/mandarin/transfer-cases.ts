import { itemMap, taskMap } from './content/index.ts';
import { introduced } from './introduction.ts';
import type { ResearchEvent } from '../../core/progress/db.ts';
export type MeaningComponent = { id:string; label:string; patterns:RegExp[]; reject?:RegExp[] };
export type TransferCase = { id:string; revision:number; turns:{speaker:string; itemId:string}[]; question:string; solution:string; components:MeaningComponent[]; reject:RegExp[] };
const nameQuestion:MeaningComponent={id:'name-question',label:'Es geht um die Frage nach Bs Namen.',patterns:[/frage.{0,55}(nam|heiß|heiss)/,/(namensfrage|namens?frage)/,/(wie|wer).{0,30}(heiß|heiss)/],reject:[/(eigenen|seinen eigenen|as) namen/,/name.{0,20}(von a|der person a)/]};
const reverseRequest=[/\ba (bittet|fordert|möchte|will)\b/,/\bb soll\b/,/\bb muss\b/,/\bb wiederholt\b/,/\bb spricht.{0,12}langsamer/];
export const transferCases:TransferCase[]=[
 {id:'name-repeat',revision:1,turns:[{speaker:'A',itemId:'askname'},{speaker:'B',itemId:'say-again'}],
  question:'Was erwartet Person B jetzt von Person A? Beschreibe die Handlung und worauf sie sich bezieht.',
  solution:'A soll die Frage nach dem Namen von B wiederholen. B bittet nicht darum, dass A den eigenen Namen nennt.',
  components:[{id:'repeat',label:'B möchte, dass A das Gesagte wiederholt.',patterns:[/wiederhol/,/noch\s*(einmal|mal|mals)/,/erneut/,/ein weiteres mal/],reject:[/(nicht|keinesfalls|niemals).{0,35}(wiederhol|noch|erneut)/]},nameQuestion],reject:[...reverseRequest,/\bb fragt\b/,/(eigenen|as) namen/]},
 {id:'origin-slower',revision:1,turns:[{speaker:'A',itemId:'nationality'},{speaker:'B',itemId:'speak-slowly'}],
  question:'Was soll Person A an der Äußerung ändern, und worum geht es dabei?',
  solution:'A soll langsamer sprechen. Gemeint ist die Frage danach, aus welchem Land B kommt.',
  components:[{id:'slower',label:'A soll langsamer sprechen.',patterns:[/langsam/,/weniger schnell/,/(tempo|geschwindigkeit).{0,25}(senken|reduzier|verringer|drossel)/],reject:[/(nicht|keinesfalls).{0,15}langsam/,/\bschneller\b/]},{id:'origin-question',label:'Es geht um Bs Herkunft beziehungsweise Land.',patterns:[/herkunft/,/nationalität/,/nationalitaet/,/woher/,/(welchem|welches|welchen|dem|das) land/],reject:[/herkunft.{0,20}(von a|der person a)/]}],reject:reverseRequest},
 {id:'name-unresolved',revision:1,turns:[{speaker:'A',itemId:'askname'},{speaker:'B',itemId:'dont-understand'}],
  question:'Was erfährt A über Bs Namen, und warum bleibt diese Information hier offen?',
  solution:'A erfährt Bs Namen noch nicht. B versteht die Frage beziehungsweise das Gesagte nicht und nennt deshalb keinen Namen.',
  components:[{id:'name-open',label:'Bs Name bleibt unbekannt.',patterns:[/(name|namen).{0,35}(unbekannt|offen|nicht genannt|nicht bekannt)/,/(kein|keinen).{0,18}namen/,/(erfährt|erfaehrt|weiß|weiss|wissen).{0,15}nicht.{0,35}(nam|heiß|heiss)/,/(nennt|sagt).{0,20}(namen).{0,10}nicht/,/nicht.{0,15}(wie b|bs name)/],reject:[/(a erfährt|a kennt).{0,10}(bs namen|den namen von b)/]},
  {id:'not-understood',label:'B versteht As Frage beziehungsweise Äußerung nicht.',patterns:[/(b|frage|gesagte).{0,40}(nicht verstanden|nicht versteht|nicht verstehen)/,/\bb versteht.{0,30}nicht/,/(versteht|verstehen).{0,15}(die frage|a).{0,12}nicht/,/verständnisproblem/,/verstaendnisproblem/],reject:[/\ba versteht.{0,30}nicht/,/\bb (verweigert|verschweigt)/]}],reject:[/\bb (will|möchte).{0,20}nicht.{0,20}(antwort|sag|nenn)/,/absichtlich/,/unhöflich/]},
 {id:'apology-response',revision:1,turns:[{speaker:'A',itemId:'duibuqi'},{speaker:'B',itemId:'meiguanxi'}],
  question:'Wie reagiert B auf A, und auf welche Äußerung bezieht sich diese Reaktion?',
  solution:'A entschuldigt sich. B reagiert beruhigend: Die Entschuldigung wird mit „macht nichts“ beziehungsweise „kein Problem“ beantwortet.',
  components:[{id:'apology',label:'A hat sich entschuldigt.',patterns:[/entschuldig/,/bittet.{0,20}verzeihung/],reject:[/\bb entschuldigt/,/entschuldigung von b/,/entschuldigt.{0,15}nicht/,/nicht.{0,15}entschuldigt/]},
   {id:'acceptance',label:'B signalisiert, dass es kein Problem ist.',patterns:[/macht nichts/,/kein problem/,/nicht schlimm/,/in ordnung/,/beruhig/,/(nimmt|akzeptiert).{0,30}entschuldigung/,/entschuldigung.{0,20}(an|akzeptiert)/],reject:[/nicht.{0,15}(akzeptiert|beruhigt|in ordnung)/,/\b(großes|grosses|ein) problem/,/\ba (sagt|antwortet).{0,15}(macht nichts|kein problem)/]}],reject:[/\ba (antwortet|reagiert).{0,30}(entschuldigung|macht nichts|kein problem)/,/(akzeptiert|nimmt).{0,40}entschuldigung.{0,12}nicht/,/\bb (ist|wird).{0,10}(böse|wütend|sauer)/,/\bb lehnt/]},
];
export const transferCase=(id:string)=>transferCases.find(c=>c.id===id);
export function readyForTransfer(c:TransferCase,events:ResearchEvent[]) {
 const real=events.filter(e=>e.detail.optionalPractice!==true&&!e.type.startsWith('inspection_')&&!e.type.startsWith('optional_'));
 return c.turns.every(({itemId})=>{
  const item=itemMap.get(itemId)!;
  return ['meaning','pronunciation'].every(d=>introduced(item,d as 'meaning'|'pronunciation','hant',real))
   && real.some(e=>e.type==='attempt'&&taskMap.get(e.taskId)?.itemId===itemId&&taskMap.get(e.taskId)?.kind==='listen'&&e.detail.result==='success'&&e.detail.assisted===false);
 });
}
export type TransferAssessment={outcome:'features-only';cueCoverage:'all'|'some'|'none';recognized:string[];missing:string[];uncertain:boolean};
export function assessTransfer(c:TransferCase,answer:string):TransferAssessment {
 const text=answer.toLocaleLowerCase('de').normalize('NFKC').replace(/[’']/g,'').replace(/person\s+([ab])\b/g,'$1').replace(/\s+/g,' ').trim();
 // These are bounded semantic cues, not an open-ended German language model.
 // Even all cue matches are not evidence that the answer is semantically correct.
 const uncertain=/\b(vielleicht|eventuell|möglicherweise|vermutlich|oder|keine ahnung)\b|weiß nicht|weiss nicht|nicht sicher/.test(text)||c.reject.some(r=>r.test(text));
 const recognized=uncertain?[]:c.components.filter(part=>part.patterns.some(r=>r.test(text))&&!part.reject?.some(r=>r.test(text))).map(p=>p.id);
 const missing=c.components.filter(p=>!recognized.includes(p.id)).map(p=>p.id);
 return {outcome:'features-only',cueCoverage:recognized.length===c.components.length?'all':recognized.length?'some':'none',recognized,missing,uncertain};
}
