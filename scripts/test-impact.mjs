import {spawnSync} from 'node:child_process';import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';import {affectedTests} from './test-impact-model.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),args=process.argv.slice(2),value=key=>args.includes(key)?args[args.indexOf(key)+1]:null,base=value('--base')||'HEAD';
if(base.startsWith('-')||!base.match(/^[\w./-]+$/))throw Error('Invalid base');
function git(...args){const r=spawnSync('git',args,{cwd:root,encoding:'utf8'});if(r.status!==0)throw Error(r.stderr||'Git failed');return r.stdout.trim();}
const reference=git('rev-parse','--verify',base+'^{commit}'),changes=[...new Set((git('diff','--name-only',reference,'--')+'\n'+git('ls-files','--others','--exclude-standard')).split('\n').filter(Boolean))],selected=affectedTests(root,changes);
console.log(`Impact: ${changes.length} changed files → ${selected.length} Node suites; base ${reference.slice(0,7)}`);
const report={base:reference,changes,selected,results:[],completeSuite:false};let failed=false;
if(args.includes('--list'))console.log(selected.join('\n'));
else for(const test of selected){const started=Date.now(),r=spawnSync(process.execPath,['tests/'+test],{cwd:root,stdio:'inherit'});report.results.push({test,exit:r.status??1,milliseconds:Date.now()-started});if(r.error)throw r.error;if(r.status!==0){failed=true;break;}}
if(value('--report'))writeFileSync(resolveReport(value('--report')),JSON.stringify(report,null,2)+'\n');
function resolveReport(path){return new URL(path.startsWith('/')?'file://'+path:path,new URL('../',import.meta.url));}
if(failed)process.exit(1);if(!args.includes('--list'))console.log(`PASS ${selected.length} affected Node suites; full suite reserved for release closure`);
