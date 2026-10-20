import type {ReactNode} from 'react';
export type TextRange={start:number;end:number;kind:string};
function marked(text:string,ranges:TextRange[],correction:boolean):ReactNode{
 // Keep the exact input in the DOM/copy text, but leading whitespace must not
 // indent the visible answer away from the reference's shared left edge.
 const leading=text.match(/^\s+/u)?.[0]??'';
 let cursor=leading.length;const nodes:ReactNode[]=leading?[<span key="leading" className="correctionLeadingSpace">{leading}</span>]:[];
 for(const [i,r] of [...ranges].sort((a,b)=>a.start-b.start).entries()){
  if(r.start<cursor||r.end>text.length)continue;
  nodes.push(text.slice(cursor,r.start));nodes.push(<span key={i} className={correction?'correctionChange':'correctionError'} data-error-kind={r.kind} aria-label={`${text.slice(r.start,r.end)} (${correction?r.kind==='missing'?'Ergänzung':'Korrektur':'Abweichung'})`}>{text.slice(r.start,r.end)}</span>);cursor=r.end;
 }
 nodes.push(text.slice(cursor));return nodes;
}
export function CorrectionVersions({original,accepted,originalRanges=[],acceptedRanges=[]}:{original:string;accepted?:string;originalRanges?:TextRange[];acceptedRanges?:TextRange[]}){
 return <div className="correctionVersions"><p className="correctionOriginal"><span className="srOnly">Eingegebene Antwort: </span><span data-answer-text="original">{marked(original,originalRanges,false)}</span></p>{accepted!==undefined&&<p className="correctionAccepted"><span className="srOnly">Akzeptierte Form: </span><span data-answer-text="accepted">{marked(accepted,acceptedRanges,true)}</span></p>}</div>;
}
