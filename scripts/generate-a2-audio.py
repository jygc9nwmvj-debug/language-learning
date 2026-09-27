"""Offline only. Run from repository root in an isolated Python environment.
Requires mlx-audio==0.4.4, praat-parselmouth==0.4.7, soundfile, numpy.
No generator or analysis code ships in the learning app.
"""
from pathlib import Path
import argparse,json
import numpy as np
import soundfile as sf
parser=argparse.ArgumentParser();parser.add_argument('kind',choices=['speech','tones']);parser.add_argument('--output',default='work/a2-regenerated');args=parser.parse_args()
manifest=json.loads(Path('docs/A2_AUDIO_MANIFEST.json').read_text());out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
if args.kind=='speech':
 import mlx.core as mx
 from mlx_audio.tts.utils import load_model
 from huggingface_hub import snapshot_download
 model=load_model(snapshot_download(manifest['model'],revision=manifest['revision']))
 for row in manifest['assets']:
  if row['variant'] not in ['natural','careful_slow']:continue
  mx.random.seed(row.get('seed',manifest['seed']))
  results=list(model.generate(text=row['text'],voice=manifest['voice'],lang_code='Chinese',instruct=row['instruct'],speed=1.0,temperature=manifest['temperature'],max_tokens=200,verbose=False))
  x=np.concatenate([np.array(r.audio).reshape(-1) for r in results])
  sf.write(out/Path(row['path']).name,(np.clip(x,-1,1)*32767).astype(np.int16),results[0].sample_rate,subtype='PCM_16')
else:
 import parselmouth
 from parselmouth.praat import call
 x,sr=sf.read('scripts/audio-source/FourMandarinTones.ogg')
 sound=parselmouth.Sound(x,sampling_frequency=sr).extract_part(from_time=.30,to_time=1.30,preserve_times=False)
 for row in manifest['assets']:
  if row['variant']!='didactic_contour':continue
  manipulation=call(sound,'To Manipulation',.01,65,400);tier=call('Create PitchTier',row['item'],0,1)
  for fraction,hz in row['targetPoints']:call(tier,'Add point',.15+fraction*.60,hz)
  call([tier,manipulation],'Replace pitch tier');result=call(manipulation,'Get resynthesis (overlap-add)');result.scale_peak(.75)
  result.save(str(out/Path(row['path']).name),'WAV')
