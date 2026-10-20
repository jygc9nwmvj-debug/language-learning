import { AudioButton } from '../../../core/exercises/AudioButton';
import { ui } from '../../../core/i18n/de';
import { taiwanAudio, type AudioKind, type AudioVariant } from './audio';
export function TaiwanAudio({kind,reference,label,disabled=false,autoPlay=false,onFinished}:{kind:AudioKind;reference:string;label?:string;disabled?:boolean;autoPlay?:boolean;onFinished?:(variant:AudioVariant)=>void}){
 const natural=taiwanAudio(kind,reference),slow=taiwanAudio(kind,reference,'careful_slow');
 if(!natural)return null;
 return <fieldset disabled={disabled} className="twAudioControls"><AudioButton src={natural} label={label??ui.listen} autoPlay={autoPlay} onEnded={()=>onFinished?.('natural')}/>{slow&&<AudioButton src={slow} label={ui.slow} onEnded={()=>onFinished?.('careful_slow')}/>}</fieldset>;
}
