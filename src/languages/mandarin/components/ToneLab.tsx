import { useMemo, useState } from 'react';
import { AudioButton } from '../../../core/exercises/AudioButton';
import { PitchRecorder } from '../../../core/audio/PitchRecorder';

const tones = [
  { id: 1, pinyin: 'mā', hanzi: '媽 / 妈', meaning: 'mother', audio: '/audio/mandarin/ma1.wav', target: 'high' as const },
  { id: 2, pinyin: 'má', hanzi: '麻', meaning: 'hemp', audio: '/audio/mandarin/ma2.wav', target: 'rising' as const },
  { id: 3, pinyin: 'mǎ', hanzi: '馬 / 马', meaning: 'horse', audio: '/audio/mandarin/ma3.wav', target: 'low' as const },
  { id: 4, pinyin: 'mà', hanzi: '罵 / 骂', meaning: 'scold', audio: '/audio/mandarin/ma4.wav', target: 'falling' as const },
];

type Props = { onComplete: (success: boolean) => void };

export function ToneLab({ onComplete }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [question, setQuestion] = useState(0);
  const [answered, setAnswered] = useState(false);
  const target = useMemo(() => [2, 4, 3][question % 3], [question]);

  return (
    <div className="stepStack">
      <div>
        <p className="eyebrow">Tone lab</p>
        <h2>Same syllable. Different word.</h2>
        <p>Listen before you memorize any rules.</p>
      </div>
      <div className="toneGrid">
        {tones.map((tone) => (
          <article className="toneCard" key={tone.id}>
            <AudioButton src={tone.audio} label={`Tone ${tone.id}`} />
            {revealed && <><strong>{tone.pinyin}</strong><span>{tone.hanzi}</span><span>{tone.meaning}</span></>}
          </article>
        ))}
      </div>
      {!revealed ? (
        <button type="button" onClick={() => setRevealed(true)}>Reveal meanings</button>
      ) : (
        <>
          <div className="quizBox">
            <p>Which tone is this?</p>
            <AudioButton src={tones[target - 1].audio} label="Play mystery tone" />
            <div className="buttonRow">
              {[1, 2, 3, 4].map((n) => (
                <button className="secondaryButton" key={n} type="button" onClick={() => {
                  setAnswered(true);
                  if (n === target && question < 2) {
                    setTimeout(() => { setQuestion((q) => q + 1); setAnswered(false); }, 450);
                  }
                }}>{n}</button>
              ))}
            </div>
            {answered && <p className="feedback">Listen again and compare the contour. Tone is part of the word, not decoration.</p>}
          </div>
          <PitchRecorder target={tones[target - 1].target} />
          <button type="button" onClick={() => onComplete(true)}>Continue</button>
        </>
      )}
    </div>
  );
}
