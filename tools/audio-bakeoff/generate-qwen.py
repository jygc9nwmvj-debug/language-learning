import time,torch
from qwen_tts import Qwen3TTSModel
from common import *
torch.set_num_threads(4)
device='mps' if torch.backends.mps.is_available() else 'cpu'
print('DEVICE',device,flush=True)
model=Qwen3TTSModel.from_pretrained(str(ROOT/'models/Qwen3-TTS-12Hz-1.7B-CustomVoice'),device_map=device,dtype=torch.float32,attn_implementation='sdpa')
for t in TARGETS:
 for v in t['variants']:
  if exists('qwen',t,v):continue
  torch.manual_seed(42);start=time.perf_counter();prompt=instruction(t,v)
  wavs,sr=model.generate_custom_voice(text=t['hans'],language='Chinese',speaker='Serena',instruct=prompt,max_new_tokens=180,temperature=0.6,do_sample=True)
  save('qwen',t,v,wavs[0],sr,time.perf_counter()-start,{'voice':'Serena','device':device,'instruction':prompt,'runtime':'official qwen-tts, unquantized official weights','maxNewTokens':180})
