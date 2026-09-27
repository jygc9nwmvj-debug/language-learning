"""Offline reference-asset QA only; never analyzes learner recordings."""
import hashlib,json,math
from pathlib import Path
import numpy as np
import soundfile as sf
import parselmouth

def db(value):return round(20*math.log10(max(float(value),1e-8)),2)
def longest_false(values):
 best=run=0
 for v in values:
  run=0 if v else run+1;best=max(best,run)
 return best

def pitch_signal(samples,sr,tone,policy,citation=False):
 pitch=parselmouth.Sound(samples,sampling_frequency=sr).to_pitch_ac(time_step=.01,pitch_floor=policy['pitchFloorHz'],pitch_ceiling=policy['pitchCeilingHz'])
 hz=pitch.selected_array['frequency'];hz=hz[hz>0]
 if len(hz)<policy['minimumVoicedFrames']:return {'status':'uncertain','reason':'insufficient_voicing','frames':len(hz)}
 # Robust medians over thirds; pitch detection/octave errors remain possible.
 semitones=12*np.log2(hz/np.median(hz));parts=np.array_split(semitones,3);a,b,c=[float(np.median(p)) for p in parts]
 span=float(np.percentile(semitones,90)-np.percentile(semitones,10));dip=min(a,c)-b
 if tone==1:compatible=span<2.5
 elif tone==2:compatible=c-a>2
 elif tone==4:compatible=a-c>3
 elif tone==3:compatible=dip>(2 if citation else .7) or (not citation and a-b>.7 and c-a<1.5)
 else:return {'status':'not_applicable','reason':'neutral_or_connected_speech'}
 return {'status':'compatible' if compatible else 'review','expectedTone':tone,'medianHz':round(float(np.median(hz)),1),'thirdsSemitones':[round(v,2) for v in (a,b,c)],'spanSemitones':round(span,2),'frames':len(hz),'note':'Coarse contour signal only; not phoneme correctness or a pronunciation score.'}

def measure(path,expected,variant,policy):
 data,sr=sf.read(path,always_2d=True);issues=[]
 def check(ok,code):
  if not ok:issues.append(code)
 check(np.isfinite(data).all(),'nonfinite_samples')
 if not len(data):return {'issues':['empty_file']}
 mono=data.mean(axis=1);peak=float(np.max(np.abs(data)));step=max(1,round(sr*.01))
 rms=np.array([np.sqrt(np.mean(data[i:i+step]**2)) for i in range(0,len(data),step)])
 # Fixed absolute floor AND relative threshold; avoid mistaking low-level noise for speech.
 threshold=max(.003,float(np.max(rms))*.035);active=rms>threshold;indices=np.flatnonzero(active)
 duration=len(data)/sr;clipped=float(np.mean(np.abs(data)>=.999))
 check(policy['durationSeconds'][0]<=duration<=policy['durationSeconds'][1],'duration')
 check(peak>0,'silence');check(clipped<=policy['maxClippedFraction'],'clipping')
 if not len(indices):return {'durationSeconds':duration,'issues':issues+['no_active_audio']}
 start=int(indices[0]);end=int(indices[-1]);span=(end-start+1)*.01
 active_rms=float(np.sqrt(np.mean(rms[active]**2)));leading=start*.01;trailing=max(0,duration-(end+1)*.01);gap=longest_false(active[start:end+1])*.01
 check(policy['activeRmsDbfs'][0]<=db(active_rms)<=policy['activeRmsDbfs'][1],'active_level')
 check(policy['peakDbfs'][0]<=db(peak)<=policy['peakDbfs'][1],'peak_level')
 check(leading<=policy['maxLeadingSilenceSeconds'],'leading_silence');check(trailing<=policy['maxTrailingSilenceSeconds'],'trailing_silence');check(gap<=policy['maxInternalSilenceSeconds'],'internal_pause')
 count=len(expected['tones']);sps=count/span
 if variant in ['natural','careful_slow']:
  corridor=policy[('natural' if variant=='natural' else 'carefulSlow')+('SingleSpeechSeconds' if count==1 else 'SyllablesPerSecond')]
  value=span if count==1 else sps;check(corridor[0]<=value<=corridor[1],'pace')
 pitch={'status':'not_applicable','reason':'connected_speech_not_graded_as_citation_tones'}
 if count==1:
  pitch=pitch_signal(mono[start*step:min(len(mono),(end+1)*step)],sr,expected['tones'][0],policy,variant=='didactic_contour')
  if pitch['status'] in ['review','uncertain']:issues.append('pitch_review')
 return {'durationSeconds':round(duration,3),'speechSpanSeconds':round(span,3),'syllablesPerSecond':round(sps,2),'peakDbfs':db(peak),'activeRmsDbfs':db(active_rms),'clippedFraction':clipped,'leadingSeconds':round(leading,3),'trailingSeconds':round(trailing,3),'maximumInternalPauseSeconds':round(gap,3),'pitch':pitch,'issues':issues}
