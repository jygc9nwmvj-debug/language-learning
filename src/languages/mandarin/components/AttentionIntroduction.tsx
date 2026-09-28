import { useState } from 'react';
import { AudioButton, stopReferenceAudio } from '../../../core/exercises/AudioButton';
import { SpeakingPractice } from '../../../core/exercises/SpeakingPractice';
import type { Item } from '../schema/content';
import { numberedToPinyin } from '../pinyin';
import { attentionPilots } from '../attention';
type Detail = Record<string, string | number | boolean>;
export type Introduce = (type: string, detail: Detail) => Promise<void>;
export function FocusedPinyin({ value }: { value: string }) {
  return <>{[...value].map((letter, i) => /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(letter) ? <em key={i}>{letter}</em> : <span key={i}>{letter}</span>)}</>;
}
export function ToneFocus({ item }: { item: Item }) {
  return <div className="toneFocus"><p className="controlLabel">Achte auf die Tonzeichen</p><div className="focusedSyllables">{item.syllables.map((s, i) => <div key={i}><strong><FocusedPinyin value={numberedToPinyin(s + item.tones[i])} /></strong><span>{item.tones[i] === 5 ? 'Neutraler Ton' : `${item.tones[i]}. Ton`}</span></div>)}</div>
    {attentionPilots[item.id]?.toneNote && <p className="focusNote">{attentionPilots[item.id].toneNote}</p>}</div>;
}
export function AttentionIntroduction({ item, script, disabled, onIntroduce, onEvent, onNext }: {
  item: Item; script: 'hant' | 'hans'; disabled: boolean; onIntroduce: Introduce;
  onEvent: (type: string, detail?: Detail) => void; onNext: () => void | Promise<void>;
}) {
  const [phase, setPhase] = useState<'hear' | 'tone' | 'hanzi' | 'connect'>('hear');
  const [heard, setHeard] = useState(false);
  const [saving, setSaving] = useState(false);
  const config = attentionPilots[item.id];
  async function notice(type: string, next: typeof phase) {
    if (saving || disabled) return; stopReferenceAudio(); setSaving(true);
    try { await onIntroduce(type, { item: item.id, toneNumbers: item.toneNumbers, attentionVersion: 1, script, form: item[script], heard, role: config.role }); setPhase(next); if (next === 'connect') onEvent('pinyin_reveal'); }
    catch { /* Parent exposes storage error; retain this stage for retry. */ }
    finally { setSaving(false); }
  }
  // The same controls stay mounted across focus changes; automatic playback is never restarted.
  const audio = <><AudioButton src={item.audio} autoPlay onEnded={() => setPhase(p => p === 'hear' ? 'tone' : p)} onPlay={() => { setHeard(true); onEvent(phase === 'connect' ? 'audio_replay' : 'attention_audio_replay'); }} /><AudioButton src={item.slowAudio!} label="Langsam gesprochen" onEnded={() => setPhase(p => p === 'hear' ? 'tone' : p)} onPlay={() => { setHeard(true); onEvent(phase === 'connect' ? 'slow_audio' : 'attention_slow_audio'); }} /></>;
  return <div className="attentionIntroduction" data-focus={phase}>
    <SpeakingPractice allowPractice={phase === 'connect'} disabled={disabled} onEvent={onEvent} onNext={onNext} audio={audio} reference={<div className="attentionFocus" aria-live="polite">
      {phase === 'hear' && <><h3>Erst nur hören.</h3><p className="muted">Achte auf den Klang. Die Schrift kommt gleich dazu.</p></>}
      {phase === 'tone' && <ToneFocus item={item} />}
      {phase === 'hanzi' && <><p className="controlLabel">Jetzt nur das Schriftbild</p><p className="hanziHero" lang="zh">{item[script]}</p><p className="focusNote">Schau auf Form und Anordnung.{config.role === 'writing' ? ' Dieses Zeichen übst du später auch beim Schreiben.' : ' Hier geht es ums Wiedererkennen, nicht ums Schreiben.'}</p></>}
      {phase === 'connect' && <><p className="hanziHero" lang="zh">{item[script]}</p><div className="pronunciationMeaning"><p className="pinyin">{item.pinyin}</p><p className="meaning">{item.meaning.de}</p></div></>}
    </div>}>
    {phase === 'hear' && <button className="utilityButton" onClick={() => { stopReferenceAudio(); setPhase('tone'); }}>Schrift ohne Warten ansehen</button>}
    {phase === 'tone' && <button disabled={disabled || saving} onClick={() => void notice('tone_attention_confirmed', 'hanzi')}>Schriftbild ansehen</button>}
    {phase === 'hanzi' && <button disabled={disabled || saving} onClick={() => void notice('item_attention_completed', 'connect')}>Bedeutung dazunehmen</button>}
    </SpeakingPractice>
  </div>;
}
