"""Reuse the existing A2 warning signals. No new speech recognition or scoring."""
import sys,json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools/audio-bakeoff'))
from measure import measure
policy=json.loads(Path('tools/audio-bakeoff/policy.json').read_text())
request=json.load(sys.stdin)
m=measure(request['file'],{'tones':[int(t[-1]) for t in request['tones'].split()]},request['variant'],policy)
hard={'empty_file','nonfinite_samples','silence','no_active_audio','clipping','duration'}
print(json.dumps({'status':'failed' if hard.intersection(m['issues']) else 'passed','measurements':m,'scope':'A2 decode/duration/clipping/silence; level, tempo and isolated F0 are warnings, not linguistic approval'}))
