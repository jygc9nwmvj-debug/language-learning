import sys,time,torch,random,numpy as np
from common import *
sys.path.insert(0,str(ROOT/'CosyVoice'));sys.path.insert(0,str(ROOT/'CosyVoice/third_party/Matcha-TTS'))
from cosyvoice.cli.cosyvoice import AutoModel
import logging
logging.getLogger().setLevel(logging.WARNING)
torch.set_num_threads(4)
model=AutoModel(model_dir=str(ROOT/'models/Fun-CosyVoice3-0.5B-2512'),fp16=False,load_trt=False,load_vllm=False)
reference=ROOT/'CosyVoice/asset/zero_shot_prompt.wav'
for t in TARGETS:
 for v in t['variants']:
  if exists('cosy',t,v):continue
  torch.manual_seed(42);random.seed(42);np.random.seed(42);start=time.perf_counter()
  prompt='You are a helpful assistant. '+instruction(t,v)+'<|endofprompt|>'
  text=t.get('cosy',t['hans'])
  chunks=list(model.inference_instruct2(text,prompt,str(reference),stream=False,speed=1.0,text_frontend=False))
  audio=torch.cat([c['tts_speech'] for c in chunks],dim=1).squeeze().cpu().numpy()
  save('cosy',t,v,audio,model.sample_rate,time.perf_counter()-start,{'voice':'official zero_shot_prompt.wav demo reference; not approved production voice','referenceSha256':hashlib.sha256(reference.read_bytes()).hexdigest(),'instruction':prompt,'synthesisText':text,'speed':1.0,'device':'cpu'})
