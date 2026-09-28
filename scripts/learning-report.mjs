import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {learningReport,reportMarkdown} from '../src/core/observability/report.ts';
const args=process.argv.slice(2),file=args[0];
if(!file||file==='--help'){
 console.log('Usage: npm run learning-report -- /path/to/mandarin-backup.json [--out /path/to/report]\nReads the existing local learning backup; writes Markdown + JSON with evidence IDs. No network.');
 process.exit(file?0:1);
}
const raw=JSON.parse(await readFile(file,'utf8'));
if(!Array.isArray(raw.events))throw new Error('Expected a learning backup with events');
const report=learningReport(raw.events),out=resolve(args.includes('--out')?args[args.indexOf('--out')+1]:'work/learning-report');
await mkdir(dirname(out),{recursive:true});
await writeFile(out+'.json',JSON.stringify(report,null,2),{mode:0o600});await writeFile(out+'.md',reportMarkdown(report),{mode:0o600});
console.log(reportMarkdown(report));console.log(`\nFiles: ${out}.md and ${out}.json`);
