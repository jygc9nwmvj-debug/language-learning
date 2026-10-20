import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSync } from 'rolldown/utils';
import { content } from '../src/languages/mandarin/content/index.ts';
import { taiwan } from '../src/languages/mandarin/taiwan/course.ts';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const hash = value => createHash('sha256').update(value).digest('hex');
const normalized = value => value.replace(/\s+/g, ' ').trim();
const filesUnder = (base, dir) => readdirSync(resolve(base, dir), {withFileTypes:true}).flatMap(entry => entry.isDirectory() ? filesUnder(base, `${dir}/${entry.name}`) : [`${dir}/${entry.name}`]).sort();
export function enumerate(base = root) {
  const publicSources = filesUnder(base, 'public').filter(file => /\.(?:html|js|css|json|webmanifest|svg)$/.test(file));
  const files = [...filesUnder(base, 'src'), ...publicSources, 'index.html'].sort();
  const entries = new Map(), sources = {};
  function add(file, kind, text, locator, extra = {}) {
    if (!text.trim()) return;
    const id = `${file}:${kind}:${hash(text).slice(0,16)}`;
    if (!entries.has(id)) entries.set(id, {id,file,kind,text,locations:[],...extra});
    entries.get(id).locations.push(locator);
  }
  for (const file of files) {
    const source = readFileSync(resolve(base,file),'utf8');
    sources[file] = hash(source);
    if (/\.(?:tsx?|js)$/.test(file)) {
      const parsed = parseSync(file,source);
      if (parsed.errors.length) throw new Error(`Cannot inventory ${file}: ${JSON.stringify(parsed.errors)}`);
      const hasJsx = node => node && typeof node === 'object' && (['JSXElement','JSXFragment'].includes(node.type) || Object.values(node).some(value=>Array.isArray(value)?value.some(hasJsx):hasJsx(value)));
      function visit(node, ancestors = []) {
        if (!node || typeof node !== 'object') return;
        const line = source.slice(0,node.start).split('\n').length;
        const parent = ancestors.at(-1);
        if (node.type==='Literal' && typeof node.value==='string' || node.type==='JSXText') {
          add(file,node.type,normalized(node.value),line,{parent:parent?.type,attribute:parent?.type==='JSXAttribute'?parent.name.name:undefined});
        }
        if (node.type==='TemplateLiteral') add(file,'template',normalized(source.slice(node.start,node.end)),line,{parent:parent?.type});
        // Every JSX expression, including composed branches and attributes, is reviewed. No
        // language/word-list heuristic decides whether an expression is visible.
        if (node.type==='JSXExpressionContainer' && node.expression.type!=='JSXEmptyExpression') {
          add(file,hasJsx(node.expression)?'composition':'expression',normalized(source.slice(node.expression.start,node.expression.end)),line,{parent:parent?.type,attribute:parent?.type==='JSXAttribute'?parent.name.name:undefined});
        }
        for (const value of Object.values(node)) {
          if(Array.isArray(value)) value.forEach(child=>visit(child,[...ancestors,node]));
          else if(value && typeof value==='object')visit(value,[...ancestors,node]);
        }
      }
      visit(parsed.program);
    } else if(file.endsWith('.json') || file.endsWith('.webmanifest')) {
      // Drawing path strings are non-prose assets; their files are still hashed.
      if(file.startsWith('src/languages/mandarin/data/'))continue;
      function visit(value,path) {
        if(typeof value==='string')add(file,'data',value,path);
        else if(Array.isArray(value))value.forEach((v,i)=>visit(v,`${path}[${i}]`));
        else if(value && typeof value==='object')Object.entries(value).forEach(([k,v])=>visit(v,`${path}.${k}`));
      }
      visit(JSON.parse(source),'$');
    } else if(file.endsWith('.css')) {
      for(const match of source.matchAll(/(?<![-\w])content\s*:\s*([^;}]+)/g)) add(file,'css-content',normalized(match[1]),source.slice(0,match.index).split('\n').length);
    } else if((/\.(?:html|svg)$/.test(file))) {
      // Index has no templating. Capture all nonempty text nodes and attribute
      // values, not only currently known meta names.
      for(const match of source.matchAll(/>([^<]+)</g))if(match[1].trim())add(file,'html-text',normalized(match[1]),source.slice(0,match.index).split('\n').length);
      for(const match of source.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g))add(file,'html-attribute',match[2] ?? match[3] ?? match[4],source.slice(0,match.index).split('\n').length,{attribute:match[1]});
    } else throw new Error(`New source format needs an inventory adapter: ${file}`);
  }
  // Only the approved fields actually consumed by the Taiwan renderer. IDs and
  // editorial QA metadata are not learner copy. Source hashing binds the entire
  // canonical file; each displayed member has its own ledger decision.
  if(base===root) {
  const canon='docs/curriculum/china-travel/editorial/editorial.json';
  sources[canon]=hash(readFileSync(resolve(base,canon),'utf8'));
  const field=(id,key,value)=>{if(typeof value==='string'&&value.trim())add(canon,`taiwan:${id}:${key}`,value,id+'.'+key,{family:'taiwan-learning-content'});};
  for(const w of taiwan.words)for(const k of ['hant','hans','de','note'])field(w.id,k,w[k]);
  for(const o of taiwan.objects)for(const k of ['title','learningText'])field(o.id,k,o[k]);
  for(const u of taiwan.utterances){for(const k of ['hant','hans','pinyinLexical','de','context'])field(u.id,k,u[k]);u.exploration.forEach((p,n)=>field(u.id,`exploration.${n}.gloss`,p.gloss));}
  for(const d of taiwan.dialogues){for(const k of ['title','context'])field(d.id,k,d[k]);for(const [k,v]of Object.entries(d.roles))field(d.id,'role.'+k,v);field(d.id,'recap.question',d.recap.question);d.recap.expected.forEach((s,n)=>field(d.id,'recap.expected.'+n,s));}
  for(const x of taiwan.exercises){for(const k of ['prompt','feedback'])field(x.id,k,x[k]);if(x.type==='sentence_meaning')for(const k of ['correct','incorrect'])x[k]?.forEach((s,n)=>field(x.id,k+'.'+n,s));if(x.type==='communicative_text_production')x.expected?.forEach((v,n)=>{if(v&&typeof v==='object')for(const k of ['hant','hans','pinyinLexical'])field(x.id,`expected.${n}.${k}`,v[k]);});}
  for(const m of taiwan.matching.filter(m=>m.relation==='hanzi-meaning'))m.pairs.forEach((p,n)=>field(m.id,`pair.${n}.de`,p.de));
  for(const w of taiwan.writing)field(w.id,'meaning',w.meaning);
  }
  for(const task of content.tasks) add('src/languages/mandarin/content/index.ts', `task-prompt:${task.id}`, task.prompt.de, task.id, {taskKind:task.kind});
  return {sources,entries:[...entries.values()].sort((a,b)=>a.id.localeCompare(b.id))};
}
const functions = new Set(['orientation','action','learning-content','feedback','necessary-system-information','redundant']);
export function check(current, ledger) {
  const failures=[];
  for(const file of new Set([...Object.keys(current.sources),...Object.keys(ledger.sources)])) {
    if(current.sources[file]!==ledger.sources[file]?.sha256)failures.push(`Source contract changed/unreviewed: ${file}`);
    if(!ledger.sources[file]?.scope || !ledger.sources[file]?.reason)failures.push(`Source boundary missing: ${file}`);
  }
  const currentIds=new Set(current.entries.map(e=>e.id));
  for(const entry of current.entries) {
    const decision=ledger.decisions[entry.id];
    if(!decision) { failures.push(`Unclassified: ${entry.file}:${entry.locations[0]} ${entry.text.slice(0,100)}`);continue; }
    if(!['production','non-display','development','compatibility','unused','suppressed'].includes(decision.scope)||!decision.reason)failures.push(`Invalid decision: ${entry.id}`);
    if(['production','compatibility','suppressed'].includes(decision.scope) && (!decision.functions?.length || decision.functions.some(f=>!functions.has(f))))failures.push(`Functional classification missing: ${entry.id}`);
    if(decision.functions?.includes('redundant') && !['remove','condense','already-suppressed'].includes(decision.disposition))failures.push(`Redundancy without correction: ${entry.id}`);
    if(decision.text!==entry.text)failures.push(`Decision text differs: ${entry.id}`);
  }
  for(const id of Object.keys(ledger.decisions))if(!currentIds.has(id))failures.push(`Stale decision: ${id}`);
  return failures;
}
if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const inventory=enumerate();
  if(process.argv.includes('--list')) console.log(JSON.stringify(inventory,null,2));
  else {
    const ledger=JSON.parse(readFileSync(resolve(root,'qa/ui-text/inventory.json'),'utf8'));
    const failures=check(inventory,ledger);
    if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
    else {
      const scopes={};for(const d of Object.values(ledger.decisions))scopes[d.scope]=(scopes[d.scope]??0)+1;
      console.log(JSON.stringify({sourceFiles:Object.keys(inventory.sources).length,sourceEntries:inventory.entries.length,scopes,unclassified:0},null,2));
    }
  }
}
