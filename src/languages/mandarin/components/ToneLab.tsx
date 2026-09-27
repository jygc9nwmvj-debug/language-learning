import { useState } from 'react';
import { AudioButton } from '../../../core/exercises/AudioButton';
import { Recorder } from '../../../core/audio/Recorder';
import { ui } from '../../../core/i18n/de';
const tones = [
  { pinyin: 'mā', hant: '媽', hans: '妈', meaning: 'Mutter' },
  { pinyin: 'má', hant: '麻', hans: '麻', meaning: 'Hanf' },
  { pinyin: 'mǎ', hant: '馬', hans: '马', meaning: 'Pferd' },
  { pinyin: 'mà', hant: '罵', hans: '骂', meaning: 'schimpfen' },
];
export function ToneLab({ script, onEvent, onResult, onNext, disabled }: {
  script: 'hant' | 'hans'; onEvent: (type: string) => void;
  onResult: (tone: number, correct: boolean) => Promise<void>; onNext: () => void; disabled: boolean;
}) {
  const [revealed, setRevealed] = useState(false); const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null); const [heard, setHeard] = useState(false);
  const target = [2, 4, 3][question];
  return <div className="stepStack"><p>{ui.toneIntro}</p><div className="toneGrid">{tones.map((tone, i) => <div className="toneCard" key={tone.pinyin}>
    <AudioButton src={`/audio/mandarin/ma${i + 1}.wav`} label={`Ton ${i + 1}`} onPlay={() => onEvent('audio_replay')} />
    {revealed && <><strong>{tone.pinyin}</strong><span lang="zh">{tone[script]}</span><span>{tone.meaning}</span></>}
  </div>)}</div>
  {!revealed ? <button type="button" onClick={() => { setRevealed(true); onEvent('tone_reveal'); }}>{ui.toneReveal}</button>
    : <><div className="quizBox"><h3>{ui.toneQuestion}</h3><AudioButton src={`/audio/mandarin/ma${target}.wav`} onPlay={() => { setHeard(true); onEvent('audio_replay'); }} />
      <div className="buttonRow">{[1, 2, 3, 4].map(n => <button key={n} type="button" disabled={!heard || answer !== null || disabled} onClick={() => void onResult(target, n === target).then(() => setAnswer(n)).catch(() => {})}>{n}</button>)}</div>
      {answer !== null && <><p role="status">{answer === target ? ui.toneCorrect : ui.toneWrong} {tones[target - 1].pinyin} · Ton {target}</p>
        <button type="button" disabled={disabled} onClick={() => { if (question === 2) onNext(); else { setQuestion(q => q + 1); setAnswer(null); setHeard(false); } }}>{ui.continue}</button></>}
    </div><Recorder onEvent={onEvent} /><p className="muted">{ui.toneUncertain}</p></>}
  </div>;
}
