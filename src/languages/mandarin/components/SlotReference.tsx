import { AudioButton } from '../../../core/exercises/AudioButton';
import type { Item } from '../schema/content';
import { fixedReferenceParts } from '../reference-role';
export function SlotExampleNote({item}:{item:Item}) {
 return item.slot ? <p className="muted">Hörbeispiel mit einem Beispielnamen. Beim eigenen Sprechen setzt du deinen Namen ein.</p> : null;
}
export function FixedSlotAudio({item,script,onPlay}:{item:Item;script:'hant'|'hans';onPlay?:()=>void}) {
 const parts=fixedReferenceParts(item);
 return <div className="fixedSlotReference" data-reference-role="fixed-components"><p className="muted">Feste Bausteine anhören. Ergänze deinen eigenen Namen.</p><div className="buttonRow">{parts.map(p=><AudioButton key={p.id} src={p.audio} label={p[script]} onPlay={onPlay}/>)}</div></div>;
}
