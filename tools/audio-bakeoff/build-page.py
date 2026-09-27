from common import *
import random,shutil
page=ROOT/'page';(page/'audio').mkdir(exist_ok=True)
names={'qwen':'Qwen3-TTS · Serena','melo':'MeloTTS · ZH','cosy':'CosyVoice 3 · Demo-Stimme'}
assets=[]
for f in (ROOT/'generated').glob('*/manifest.json'):assets+=json.loads(f.read_text())
result={'id':'a2-bakeoff-20260927-v1','targets':[],'humanApproved':False}
rng=random.Random(2718)
for target in TARGETS:
 order=list(names);rng.shuffle(order);choices=[]
 for label,engine in zip('ABC',order):
  samples={}
  for variant in target['variants']:
   a=next((a for a in assets if a['target']==target['id'] and a['engine']==engine and a['variant']==variant),None)
   if a:
    filename='audio/'+a['sha256'][:20]+'.wav';shutil.copyfile(ROOT/a['file'],page/filename);samples[variant]={'file':filename,'sha256':a['sha256']}
   else:samples[variant]={'error':'Für diesen Kandidaten wurde noch kein Clip erzeugt.'}
  choices.append({'label':label,'engineName':names[engine],'samples':samples})
 result['targets'].append({k:target[k] for k in ['id','hans','pinyin','variants'] }|{'teachingTone':target.get('teachingTone'),'choices':choices})
(page/'comparison.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
provenance={'modelSources':json.loads((ROOT/'model-sources.json').read_text()),'codeSources':json.loads((ROOT/'code-sources.json').read_text()),'asr':json.loads((ROOT/'asr-source.json').read_text()),'hardware':{'cpu':'Apple M1 Max','cores':10,'ramGiB':32},'assets':assets,'humanApproved':False}
(page/'provenance.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n')
if (ROOT/'screening.json').exists():
 screening=json.loads((ROOT/'screening.json').read_text());asr=json.loads((ROOT/'asr.json').read_text()) if (ROOT/'asr.json').exists() else []
 for a in screening['assets']:
  r=next((r for r in asr if r['sha256']==a['sha256']),None);a['asr']=r or {'status':'not_run'}
  if r:
   target=next(t for t in TARGETS if t['id']==a['target']);norm=lambda s:''.join(c for c in s.lower() if c.isalnum())
   if norm(r['text'])!=norm(target['hans']):a['warnings'].append('asr_text_difference_review')
 (page/'screening.json').write_text(json.dumps(screening,ensure_ascii=False,indent=2)+'\n')
shutil.copyfile(ROOT/'methodology.md',page/'report.md')
print('packaged',len(assets),'assets')
