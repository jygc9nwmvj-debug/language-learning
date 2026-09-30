import { Fragment, type ReactNode } from 'react';
import { validateResolution, type ResolutionOperation, type ResolutionPart } from './resolution-contract';
// Named learner-facing slots only. No raw evidence/assessment prop or generic children.
// Ordering and layout stay with each operation; required slots cannot be omitted.
export function Resolution({operation,parts,resolved=true,assisted=false}:{operation:ResolutionOperation;parts:Partial<Record<ResolutionPart,ReactNode>>;resolved?:boolean;assisted?:boolean}) {
 validateResolution(operation,parts,resolved,assisted);
 return <>{Object.entries(parts).map(([role,node])=><Fragment key={role}>{node}</Fragment>)}</>;
}
