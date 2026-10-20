#!/usr/bin/env python3
"""Offline reference/coverage checks for this documentation-only editorial batch.
No imports of the app, no network, no audio calls, no learner state.
"""
import collections,json,re,sys,hashlib
from pathlib import Path
root=Path(__file__).resolve().parent
b=json.loads((root/'editorial.json').read_text())
def unique(name):
 rows=b[name];out={r['id']:r for r in rows}
 assert len(out)==len(rows),f'duplicate {name} IDs'
 return out
W=unique('words');O=unique('objects');U=unique('utterances');D=unique('dialogues');X=unique('exercises');M=unique('matching');T=unique('writing')
assert len(O)==134
assert collections.Counter(o['kind'] for o in O.values())=={'lexeme':93,'construction':41}
expected=[(5,4),(8,5),(10,5),(12,5),(11,4),(12,5),(11,4),(9,4),(9,2),(6,3)]
for stage,(l,c) in enumerate(expected,1):
 assert sum(o['stage']==stage and o['kind']=='lexeme' for o in O.values())==l
 assert sum(o['stage']==stage and o['kind']=='construction' for o in O.values())==c
assert len(W)==178 and sum(not w['baseline'] for w in W.values())==134
for w in W.values():
 assert len(w['hant'])==len(w['hans'])==len(w['tones']),w['id']
 assert all(re.fullmatch(r'[a-zü]+[1-5]',t) for t in w['tones']),w['id']
for o in O.values():
 examples=[o['example']] if o['kind']=='lexeme' else o['examples']
 assert examples and all(k in U for k in examples),o['id']
 assert o['learningText'] and o['status']=='draft'
 assert o['assessmentPrerequisites']['wholeStageMasteryRequired'] is False
 assert all(k in W for k in o['contextWords'])
 assert all(k in D for k in o['contextDialogs'])
 assert min(U[uk]['stage'] for uk in examples)<=o['stage'],o['id']
for u in U.values():
 assert all(k in W for k in u['words']),u['id']
 assert all(W[k]['firstStage']<=u['stage'] for k in u['words']),u['id']
 assert len(re.findall('[1-5]',u['toneNumbers']))==len(''.join(W[k]['hant'] for k in u['words'])),u['id']
 for script in ['hant','hans']:
  assert re.sub('[，。？]','',u[script])==''.join(W[k][script] for k in u['words']),u['id']
 assert u['senseCheck'] in X and X[u['senseCheck']]['utterance']==u['id']
 assert u['atoms'] and len(u['exploration'])==len(u['words'])
 assert [p['word'] for p in u['exploration']]==u['words']
 for p in u['exploration']:assert p['audioDecision']=='deferred_no_audio_authorization'
for d in D.values():
 assert len(d['turns'])>=4 and sum(d['turns'][i]['speaker']!=d['turns'][i-1]['speaker'] for i in range(1,len(d['turns'])))>=3,d['id']
 assert all(k in U for k in d['after'])
 flattened=[(i+1,k) for i,t in enumerate(d['turns']) for k in t['utterances']]
 assert all(k in U and U[k]['stage']<=d['stage'] for _,k in flattened),d['id']
 assert [(s['turn'],s['utterance']) for s in d['sentenceChecks']]==flattened,d['id']
 assert set(d['listeningPrerequisites'])=={k for _,uk in flattened for k in U[uk]['words']},d['id']
 assert d['audio']=='not_created' and d['status']=='draft'
 assert d['recap']['expected'] and d['recap']['assessment']=='guided_self_comparison'
 assert d['followup'] is None or d['followup'] in D
for x in X.values():
 assert x['status']=='draft'
 if x['type']=='sentence_meaning':
  assert x['utterance'] in U and x['correct'] and len(x['incorrect'])>=2
  assert not set(x['correct'])&set(x['incorrect']),x['id']
 if x['type']=='communicative_text_production':
  assert x['object'] in O and x['expected']
  for v in x['expected']:
   assert all(k in W and W[k]['firstStage']<=O[x['object']]['stage'] for k in v['words'])
   for script in ['hant','hans']:assert v[script]==''.join(W[k][script] for k in v['words'])
 if x['type']=='contextual_reply_selection':
  assert x['dialog'] in D and all(k in U for k in x['correct']+x['incorrect'])
  assert not set(x['correct'])&set(x['incorrect'])
 if 'utterance' in x:assert x['utterance'] in U
assert len(X)==221
recognition=set()
for m in M.values():
 ks=[p['word'] for p in m['pairs']];assert len(ks)==len(set(ks))>=2
 assert len({p['de'] for p in m['pairs']})==len(ks)
 assert all(p['object'] in O and p['word'] in W for p in m['pairs'])
 assert m['masteryEffect'] is False and m['status']=='draft'
 recognition.update(ks)
assert len(M)==38 and len(recognition)==62
assert len(T)==10 and {w['word'] for w in T.values()}=={'shui','bei','yuan','bai','zuo-dir','you-dir','qu','dao','da','xiao'}
assert all(w['object'] in O and w['hant']==w['hans'] for w in T.values())
assert len(b['sourceFacts'])==134 and all(x['disposition']['disposition'] for x in b['sourceFacts'])
assert sum(x['toneSequenceMatched'] for x in b['sourceFacts'])==128
assert b['title']=='Reise nach Taiwan' and b['currency']=='TWD'
assert not any(v for k,v in b['release'].items() if k!='nativeReview')
for p in root.glob('*.md'):
 for link in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if '://' not in link and link!='verification.json':assert (p.parent/link.split('#')[0]).exists(),(p,link)
# Bind the per-ID reading ledger to this exact corpus; it is not a language oracle.
ledger=json.loads((root/'language-review.json').read_text())
assert ledger['corpusSha256']==hashlib.sha256((root/'editorial.json').read_bytes()).hexdigest()
assert ledger['nativeCertification'] is False and ledger['audioReviewed'] is False
for kind,rows in ledger['members'].items():
 current={r['id']:r for r in b[kind]}
 assert {r['id'] for r in rows}==set(current),kind
 for r in rows:
  digest=hashlib.sha256(json.dumps(current[r['id']],ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
  assert digest==r['afterSha256'],(kind,r['id'])
assert all(o['contextDialogs'] for o in O.values())
assert sum(w['baseline'] for w in W.values())==44
assert U['goodnight']['pinyinLexical']=="wǎn'ān"
assert X['value:t1430']['utterance']=='two-thirty-okay' and 'xiawu' in U['two-thirty-okay']['words']
assert X['value:t1530']['utterance']=='three-thirty-okay' and 'xiawu' in U['three-thirty-okay']['words']
summary={'status':'pass','scope':'Exhaustive structural accounting of this editorial batch; not native, acoustic, app or learner QA.','objects':len(O),'words':len(W),'newWordEntries':134,'dialogues':len(D),'turnOccurrences':sum(len(d['turns']) for d in D.values()),'sentenceOccurrences':sum(len(t['utterances']) for d in D.values() for t in d['turns']),'distinctUtterances':len(U),'exercises':len(X),'exerciseTypes':dict(collections.Counter(x['type'] for x in X.values())),'matchingVariants':len(M),'recognitionForms':len(recognition),'writingTargets':len(T),'jsonSha256':hashlib.sha256((root/'editorial.json').read_bytes()).hexdigest()}
(root/'verification.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(summary,ensure_ascii=False,indent=2))
