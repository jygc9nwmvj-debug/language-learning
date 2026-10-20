import { AudioButton } from '../../../core/exercises/AudioButton';
import { ui } from '../../../core/i18n/de';
import { taiwanAudio, type AudioKind, type AudioVariant } from './audio';
export function TaiwanAudio({kind,reference,label,disabled=false,autoPlay=false,onStarted,onFinished}:{kind:AudioKind;reference:string;label?:string;disabled?:boolean;autoPlay?:boolean;onStarted?:(variant:AudioVariant)=>void;onFinished?:(variant:AudioVariant)=>void}){
 const natural=taiwanAudio(kind,reference),slow=taiwanAudio(kind,reference,'careful_slow');
 if(!natural)return null;
 return <fieldset disabled={disabled} className="twAudioControls"><AudioButton src={natural} label={label??ui.listen} autoPlay={autoPlay} onPlay={()=>onStarted?.('natural')} onEnded={()=>onFinished?.('natural')}/>{slow&&<AudioButton src={slow} label={ui.slow} onPlay={()=>onStarted?.('careful_slow')} onEnded={()=>onFinished?.('careful_slow')}/>}</fieldset>;
}
