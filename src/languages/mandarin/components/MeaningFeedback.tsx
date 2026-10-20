import {CorrectionVersions} from '../../../core/exercises/CorrectionVersions';
import {meaningFinding} from '../meaning';
export function MeaningFeedback({answer,accepted,reference,itemId}:{answer:string;accepted:readonly string[];reference:string;itemId?:string}){
 const finding=meaningFinding(answer,accepted,itemId);
 return <div className="meaningFeedback" data-meaning-finding={finding} role="status"><CorrectionVersions original={answer} accepted={finding==='accepted'?answer:reference}/>{finding!=='accepted'&&<p>{finding==='uncertain'?'Diese Formulierung kann ich mit den hinterlegten Antworten nicht sicher beurteilen.':'Diese Bedeutung passt hier nicht.'}</p>}</div>;
}
