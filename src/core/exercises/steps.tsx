import { useState } from 'react';
import { AudioButton } from './AudioButton';
import { PitchRecorder } from '../audio/PitchRecorder';
import { WritingPad } from '../writing/WritingPad';
import { ToneLab } from '../../languages/mandarin/components/ToneLab';
import { markSkill } from '../progress/db';

export type RuntimeStep = {
  id: string;
  type: string;
  targets: string[];
  config?: Record<string, unknown>;
};

type Props = {
  step: RuntimeStep;
  script: 'traditional' | 'simplified';
  displayName: string;
  setDisplayName: (value: string) => void;
  onNext: () => void;
};

const form = (traditional: string, simplified: string, script: Props['script']) => script === 'traditional' ? traditional : simplified;

export function StepRenderer({ step, script, displayName, setDisplayName, onNext }: Props) {
  const [choiceFeedback, setChoiceFeedback] = useState('');

  if (step.type === 'listen_reveal') {
    return (
      <div className="stepStack">
        <p className="eyebrow">First contact</p>
        <h2>Just listen.</h2>
        <AudioButton src="/audio/mandarin/nihao.wav" label="Play" />
        <p>What is happening?</p>
        <div className="buttonRow">
          <button className="secondaryButton" type="button" onClick={() => setChoiceFeedback('Exactly. A greeting.')}>A greeting</button>
          <button className="secondaryButton" type="button" onClick={() => setChoiceFeedback('It is a greeting. You’ll hear it again in a moment.')}>A goodbye</button>
        </div>
        {choiceFeedback && <><p className="feedback">{choiceFeedback}</p><button type="button" onClick={onNext}>Continue</button></>}
      </div>
    );
  }

  if (step.type === 'greeting_reveal') {
    return (
      <div className="stepStack centerText">
        <p className="hanziHero">你好</p>
        <p className="pinyin">nǐ hǎo</p>
        <p>hello</p>
        <AudioButton src="/audio/mandarin/nihao.wav" />
        <PitchRecorder target="free" onRecorded={() => void markSkill('cmn:phrase:nihao', 'speaking', 'introduced')} />
        <button type="button" onClick={onNext}>Continue</button>
      </div>
    );
  }

  if (step.type === 'tone_discrimination') {
    return <ToneLab onComplete={() => { void markSkill('cmn:tone-set:ma', 'listening', 'introduced'); onNext(); }} />;
  }

  if (step.type === 'write_guided') {
    const data = step.config as { traditional: string; simplified: string; pinyin: string; meaning: string; audio: string; itemId: string };
    const char = form(data.traditional, data.simplified, script);
    return (
      <div className="stepStack">
        <div className="centerText">
          <p className="hanziLarge">{char}</p>
          <p className="pinyin">{data.pinyin}</p>
          <p>{data.meaning}</p>
          <AudioButton src={data.audio} />
        </div>
        <WritingPad character={char} onComplete={() => {
          void markSkill(data.itemId, 'writing', 'assisted_success');
          onNext();
        }} />
      </div>
    );
  }

  if (step.type === 'compose_nihao') {
    return (
      <div className="stepStack centerText">
        <p className="equation"><span>你</span><span>+</span><span>好</span><span>→</span><strong>你好</strong></p>
        <p className="pinyin">nǐ hǎo</p>
        <AudioButton src="/audio/mandarin/nihao.wav" />
        <p className="feedback">You already know both characters.</p>
        <button type="button" onClick={() => { void markSkill('cmn:phrase:nihao', 'reading', 'unassisted_success'); onNext(); }}>Continue</button>
      </div>
    );
  }

  if (step.type === 'name_intro') {
    return (
      <div className="stepStack">
        <p className="eyebrow">Make it yours</p>
        <h2>{form('我叫', '我叫', script)} …</h2>
        <p><strong>叫 jiào</strong> is used here for “to be called”.</p>
        <AudioButton src="/audio/mandarin/wojiao.wav" label="Hear 我叫" />
        <label className="fieldLabel">Your name
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
        </label>
        {displayName && <p className="personalSentence">我叫 {displayName}。</p>}
        <PitchRecorder target="free" />
        <button type="button" disabled={!displayName.trim()} onClick={() => {
          void markSkill('cmn:pattern:wo-jiao', 'usage', 'assisted_success');
          onNext();
        }}>Continue</button>
      </div>
    );
  }

  if (step.type === 'name_question') {
    const q = form('你叫什麼名字？', '你叫什么名字？', script);
    return (
      <div className="stepStack">
        <p className="eyebrow">A real question</p>
        <AudioButton src="/audio/mandarin/nijiaoshenmemingzi.wav" label="Listen first" />
        <h2 className="hanziSentence">{q}</h2>
        <p className="pinyin">nǐ jiào shénme míngzi?</p>
        <p>Chinese often leaves the question word where the answer would go.</p>
        <div className="answerCard">我叫 {displayName || '…'}。</div>
        <PitchRecorder target="free" />
        <button type="button" onClick={() => { void markSkill('cmn:dialogue:ask-name', 'usage', 'assisted_success'); onNext(); }}>Continue</button>
      </div>
    );
  }

  if (step.type === 'phrase') {
    const data = step.config as { traditional: string; simplified: string; pinyin: string; meaning: string; audio: string; itemId: string };
    return (
      <div className="stepStack centerText">
        <p className="hanziHero">{form(data.traditional, data.simplified, script)}</p>
        <p className="pinyin">{data.pinyin}</p>
        <p>{data.meaning}</p>
        <AudioButton src={data.audio} />
        <PitchRecorder target="free" />
        <button type="button" onClick={() => { void markSkill(data.itemId, 'speaking', 'assisted_success'); onNext(); }}>Continue</button>
      </div>
    );
  }

  if (step.type === 'dialogue') {
    return (
      <div className="stepStack">
        <p className="eyebrow">Mini interaction</p>
        <h2>No subtitles first.</h2>
        <div className="dialogueList">
          <AudioButton src="/audio/mandarin/nihao.wav" label="1 · Someone greets you" />
          <p>Your answer: <strong>你好。</strong></p>
          <AudioButton src="/audio/mandarin/nijiaoshenmemingzi.wav" label="2 · A question" />
          <p>Your answer: <strong>我叫 {displayName || '…'}。</strong></p>
          <AudioButton src="/audio/mandarin/xiexie.wav" label="3 · They thank you" />
          <AudioButton src="/audio/mandarin/zaijian.wav" label="4 · They leave" />
        </div>
        <button type="button" onClick={() => { void markSkill('cmn:dialogue:first-contact', 'usage', 'unassisted_success'); onNext(); }}>I did it</button>
      </div>
    );
  }

  if (step.type === 'recall_check') {
    return (
      <div className="stepStack">
        <p className="eyebrow">Honest recall</p>
        <h2>One last thing. No Pinyin.</h2>
        <p>Write <strong>好</strong> from memory — on screen or on paper.</p>
        <WritingPad character="好" onComplete={() => { void markSkill('cmn:word:hao', 'writing', 'unassisted_success'); onNext(); }} />
      </div>
    );
  }

  if (step.type === 'outro') {
    return (
      <div className="stepStack centerText">
        <p className="hanziQuote">千里之行，始於足下。</p>
        <p>A journey of a thousand miles begins with the first step.</p>
        <p className="muted">Laozi, chapter 64</p>
        <button type="button" onClick={onNext}>Finish</button>
      </div>
    );
  }

  return <div><p>Unknown exercise type: {step.type}</p><button type="button" onClick={onNext}>Skip</button></div>;
}
