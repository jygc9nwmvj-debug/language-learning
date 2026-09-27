from pathlib import Path
import json,time,hashlib,resource
ROOT=Path(__file__).resolve().parent
TARGETS=json.loads((ROOT/'targets.json').read_text())
def instruction(t,variant):
 if t.get('teachingTone'):
  return '用标准普通话清楚地示范这一个单音节，作为零基础学生的声调教学参考。'+{1:'第一声，高而平。',2:'第二声，从中低音明显上升。',3:'第三声，先降到低处再上升，示范孤立第三声的完整曲线。',4:'第四声，从高音明显下降。'}[t['teachingTone']]+'只说给定的一个字。'
 if variant=='careful_slow':
  return '用标准普通话，耐心地给零基础学生做跟读示范。语速比平时稍慢，吐字仔细清楚，但保持自然连贯，不要夸张拖长。只说给定的文字。'
 return '用标准普通话，温和清楚地自然说话，适合初学者听。保持自然声调，不夸张，只说给定的文字。'
def save(engine,t,variant,audio,sr,elapsed,extra):
 import numpy as np,soundfile as sf
 audio=np.asarray(audio).reshape(-1);folder=ROOT/'generated'/engine;folder.mkdir(parents=True,exist_ok=True)
 path=folder/(t['id']+'-'+variant+'.wav');sf.write(path,audio,sr,subtype='PCM_16')
 p=folder/'manifest.json';rows=json.loads(p.read_text()) if p.exists() else []
 row={'engine':engine,'target':t['id'],'variant':variant,'text':t['hans'],'pinyin':t['pinyin'],'file':str(path.relative_to(ROOT)),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'sampleRate':sr,'duration':len(audio)/sr,'generationSeconds':round(elapsed,3),'rawPeak':float(np.max(np.abs(audio))),'maxRssBytes':resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,'seed':42,'postProcessing':'none; PCM16 encoding only',**extra}
 rows=[r for r in rows if (r['target'],r['variant'])!=(row['target'],variant)]+[row]
 p.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n');print('SAVED',engine,t['id'],variant,row['duration'],elapsed,flush=True)
def exists(engine,t,v):return (ROOT/'generated'/engine/(t['id']+'-'+v+'.wav')).exists()
