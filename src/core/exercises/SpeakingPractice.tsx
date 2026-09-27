import { useState, type ReactNode } from 'react';
import { Recorder } from '../audio/Recorder';
import { useInteraction } from './InteractionScope';
type Detail = Record<string, string | number | boolean>;
// Content-independent pattern: keep the reference, condense it when speaking,
// and leave replay/retake versus continuing as an explicit learner decision.
export function SpeakingPractice({ reference, audio, children, compact = false, readyToRecord = true, disabled, onEvent, onStarted, onNext }: {
  reference: ReactNode; audio: ReactNode; children?: ReactNode; compact?: boolean; readyToRecord?: boolean; disabled: boolean;
  onEvent: (type: string, detail?: Detail) => void; onStarted?: () => void; onNext: () => void | Promise<void>;
}) {
  const [practicing, setPracticing] = useState(false), [recorded, setRecorded] = useState(false);
  const interaction = useInteraction();
  return <section className={`speakingPractice ${compact || practicing ? 'isCondensed' : ''}`} data-ready-to-record={readyToRecord} data-phase={recorded ? 'review' : practicing ? 'practice' : 'reference'}>
    <div className="practiceReference">{reference}</div>
    <div className="referenceAudio"><span className="controlLabel">Vorlage</span><div className="buttonRow">{audio}</div></div>
    {children}
    <Recorder onEvent={(type, detail) => {
      if (type === 'recording_started') { setPracticing(true); onStarted?.(); }
      if (type === 'recording_completed_uncertain') setRecorded(true);
      onEvent(type, detail);
    }} />
    <div className="practiceNext"><button type="button" className={recorded ? 'primaryButton' : 'secondaryButton'} disabled={disabled || interaction.busy} onClick={onNext}>Weiter</button>
      {interaction.busy && <span className="muted">Beende zuerst die Aufnahme oder Wiedergabe.</span>}
    </div>
  </section>;
}
