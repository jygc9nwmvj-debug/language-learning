import { ContinueButton } from './Controls';
import { useState, type ReactNode } from 'react';
import { Recorder } from '../audio/Recorder';
import { useInteraction } from './InteractionScope';
type Detail = Record<string, string | number | boolean>;
// Content-independent pattern: keep the reference, condense it when speaking,
// and leave replay/retake versus continuing as an explicit learner decision.
export function SpeakingPractice({ reference, audio, children, hasContext = !!children, compact = false, readyToRecord = true, allowPractice = true, disabled, onEvent, onStarted, onNext }: {
  reference: ReactNode; audio: ReactNode; children?: ReactNode; hasContext?: boolean; compact?: boolean; readyToRecord?: boolean; allowPractice?: boolean; disabled: boolean;
  onEvent: (type: string, detail?: Detail) => void; onStarted?: () => void; onNext: () => void | Promise<void>;
}) {
  const [practicing, setPracticing] = useState(false), [recorded, setRecorded] = useState(false);
  const interaction = useInteraction();
  const [contextOpen, setContextOpen] = useState(true);
  return <section className={`speakingPractice ${compact || practicing ? 'isCondensed' : ''}`} data-ready-to-record={readyToRecord} data-phase={recorded ? 'review' : practicing ? 'practice' : 'reference'}>
    <div className="practiceReference"><div className="referenceContent">{reference}</div>
      {audio && <div className="referenceAudio" role="group" aria-label="Referenz anhören">{audio}</div>}
    </div>
    {allowPractice ? hasContext && <details className="practiceContext" open={contextOpen} onToggle={e=>setContextOpen(e.currentTarget.open)}><summary>Hinweise zum Ausdruck</summary>{children}</details> : children}
    {allowPractice && <><Recorder onEvent={(type, detail) => {
      if (type === 'recording_started') { setPracticing(true); setContextOpen(false); onStarted?.(); }
      if (type === 'recording_completed_uncertain') setRecorded(true);
      onEvent(type, detail);
    }} />
    <div className="practiceNext"><ContinueButton type="button" className={recorded ? 'primaryButton' : 'secondaryButton'} disabled={disabled || interaction.busy} onClick={onNext}>Weiter</ContinueButton>
      {interaction.busy && <span className="muted">Beende zuerst die Aufnahme oder Wiedergabe.</span>}
    </div></>}
  </section>;
}
