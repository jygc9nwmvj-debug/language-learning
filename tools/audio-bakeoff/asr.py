from common import *
from mlx_audio.stt.utils import load_model
import re
model=load_model(str(ROOT/'models/Qwen3-ASR-0.6B'))
p=ROOT/'asr.json';rows=json.loads(p.read_text()) if p.exists() else []
for f in sorted((ROOT/'generated').glob('*/manifest.json')):
 for a in json.loads(f.read_text()):
  if any(r['sha256']==a['sha256'] for r in rows):continue
  result=model.generate(str(ROOT/a['file']),language='Chinese',temperature=0,max_tokens=128)
  row={'file':a['file'],'sha256':a['sha256'],'text':result.text,'expectedTextProvided':False};rows.append(row)
  p.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n');print(a['engine'],a['target'],a['variant'],repr(result.text),flush=True)
