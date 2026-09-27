import sys,time,torch
from common import *
sys.path.insert(0,str(ROOT/'MeloTTS'))
# Melo eagerly imports Japanese tooling even for Mandarin. Use the already bundled MeCab dictionary.
import unidic,unidic_lite
unidic.DICDIR=unidic_lite.DICDIR
from melo.api import TTS
torch.set_num_threads(4)
model=TTS(language='ZH',device='cpu',config_path=str(ROOT/'models/MeloTTS-Chinese/config.json'),ckpt_path=str(ROOT/'models/MeloTTS-Chinese/checkpoint.pth'))
# Official frontend otherwise switches CPU inputs to MPS after loading CPU weights.
model.device=torch.device('cpu')
print('SPEAKERS',model.hps.data.spk2id,flush=True)
for t in TARGETS:
 for v in t['variants']:
  if exists('melo',t,v):continue
  torch.manual_seed(42);start=time.perf_counter();speed=.75 if v=='careful_slow' else .9
  audio=model.tts_to_file(t['hans'],model.hps.data.spk2id['ZH'],speed=speed,quiet=True)
  save('melo',t,v,audio,model.hps.data.sampling_rate,time.perf_counter()-start,{'voice':'ZH speaker '+str(model.hps.data.spk2id['ZH']),'device':'cpu','synthesisSpeed':speed,'control':'VITS predicted duration length_scale=1/speed; no waveform stretching; no articulated-style instruction API'})
