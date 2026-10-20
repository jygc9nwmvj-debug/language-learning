import manifest from '../../../../docs/curriculum/china-travel/POLLY_AUDIO_MANIFEST.json' with { type: 'json' };
export type AudioKind='word'|'sentence'|'dialogue';
export type AudioVariant='natural'|'careful_slow';
const references=new Map([...manifest.assets,...manifest.dialogues].map(a=>[a.id,a]));
export const taiwanAudioReady=manifest.assets.length===516&&manifest.dialogues.length===56;
export function taiwanAudio(kind:AudioKind,reference:string,variant:AudioVariant='natural') {
 return references.get(`${kind}:${reference}:${variant}`)?.path;
}
export const taiwanAudioPaths=[...new Set([...references.values()].map(a=>a.path))];
