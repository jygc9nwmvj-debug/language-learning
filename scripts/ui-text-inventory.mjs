import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSync } from 'rolldown/utils';
import { content } from '../src/languages/mandarin/content/index.ts';

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
