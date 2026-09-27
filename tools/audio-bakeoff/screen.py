"""Offline screening for the fixed bake-off only. No learner input or approval score."""
from common import *
import sys,numpy as np,soundfile as sf,parselmouth
from measure import measure,pitch_signal,db
policy=json.loads((ROOT/'policy.json').read_text())
rows=[]
for f in sorted((ROOT/'generated').glob('*/manifest.json')):
 for a in json.loads(f.read_text()):
  target=next(t for t in TARGETS if t['id']==a['target']);path=ROOT/a['file'];tones=[int(x[-1]) for x in target['toneNumbers'].split() if x[-1].isdigit()]
  expected={'toneNumbers':target['toneNumbers'],'tones':tones}
  m=measure(path,expected,'didactic_contour' if target.get('teachingTone') else a['variant'],policy)
  flags=m.pop('issues')
  pcm,sr=sf.read(path,always_2d=True)
  m.update(decodeValid=True,peakDbfs=db(np.max(np.abs(pcm))),clippedFraction=float(np.mean(np.abs(pcm)>=.999)))
  pitch=m.get('pitch',{})
  if a.get('rawPeak',0)>1:flags.append('raw_peak_over_full_scale')
  # No generic pitch judgement for words or phrases. This study compares ma teaching contours only.
  if not target.get('teachingTone'):
   flags=[x for x in flags if x!='pitch_review'];m['pitch']={'status':'not_evaluated','reason':'Only isolated ma contours screened in this bake-off'}
  else:
   pitch=pitch_signal(pcm.mean(axis=1),sr,target['teachingTone'],policy,True);m['pitch']=pitch
   flags=[f for f in flags if f!='pitch_review']
   if pitch['status']!='compatible':flags.append('pitch_review')
   snd=parselmouth.Sound(str(path));p=snd.to_pitch_ac(time_step=.01,pitch_floor=65,pitch_ceiling=550);freq=p.selected_array['frequency'];ts=p.xs();voiced=freq>0
   pitch['samples']=[{'seconds':round(float(t),3),'hz':round(float(h),2)} for t,h in zip(ts[voiced],freq[voiced])]
   pitch['voicedFraction']=round(float(np.mean(voiced)),3)
   pitch['caveat']='Broad shape only. Creaky voice, octave errors and tracking gaps require human review. Not a pronunciation score.'
  if a['target']=='wojiao_name':
   m['syllablesPerSecond']=None;flags=[x for x in flags if x!='pace'];m['paceNote']='Mixed German name: no fabricated Mandarin syllable count.'
  rows.append({**a,'measurements':m,'warnings':flags,'humanApproval':False})
for a in rows:
 if a['variant']!='natural':continue
 b=next((x for x in rows if x['engine']==a['engine'] and x['target']==a['target'] and x['variant']=='careful_slow'),None)
 if b:
  ratio=(b['measurements'].get('speechSpanSeconds') or 0)/max(a['measurements'].get('speechSpanSeconds') or 0,.01)
  a['slowNaturalRatio']=b['slowNaturalRatio']=round(ratio,3)
  if ratio<1.2 or ratio>1.9:
   a['warnings'].append('style_ratio_review');b['warnings'].append('style_ratio_review')
(ROOT/'screening.json').write_text(json.dumps({'purpose':'warning signals only; no automatic winner or approval','policy':policy,'assets':rows},ensure_ascii=False,indent=2)+'\n')
print('screened',len(rows),'assets')
