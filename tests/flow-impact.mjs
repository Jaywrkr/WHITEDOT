// tests/flow_impact.py: a release bump selects no flow; a real change to the same files still selects the catalogue.
// The CI browser image matches the pinned Playwright, or the browsers in /ms-playwright would not launch.
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,copyFileSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url)),read=f=>readFileSync(join(root,f),'utf8');
const dir=mkdtempSync(join(tmpdir(),'whitedot-impact-'));
const python=code=>{const r=spawnSync('python3',['-c',code],{cwd:root,encoding:'utf8'});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout.trim().split('\n').pop());};
try{
 // Bump copies with the real script, so the patterns follow what bump-version.mjs writes.
 for(const folder of ['scripts','src','before','after','before/src','after/src'])mkdirSync(join(dir,folder));
 const files=['scripts/bump-version.mjs','src/release-info.js','package.json','index.html','sw.js','README.md'];
 for(const f of files)copyFileSync(join(root,f),join(dir,f));
 const versioned=['index.html','sw.js','package.json','src/release-info.js'];
 for(const f of versioned)copyFileSync(join(dir,f),join(dir,'before',f));
 const bump=spawnSync(process.execPath,[join(dir,'scripts/bump-version.mjs'),'9.9.9-alpha.999'],{encoding:'utf8'});
 assert.equal(bump.status,0,bump.stderr);
 for(const f of versioned)copyFileSync(join(dir,f),join(dir,'after',f));
 // A real change next to the bump: one more line in the page and in the offline list.
 writeFileSync(join(dir,'after/index.real'),read('index.html').replace('</body>','<p id="impactProbe"></p></body>'));
 writeFileSync(join(dir,'after/sw.real'),readFileSync(join(dir,'after/sw.js'),'utf8').replace('const SHELL=[','const SHELL=["./src/probe.js",'));
 const out=python(`
import json,sys;sys.path.insert(0,'tests');import flow_impact as f
d=${JSON.stringify(dir)};r=lambda p:open(d+'/'+p,encoding='utf-8').read()
v=${JSON.stringify(versioned)}
bumped={p:f.version_only(p,r('before/'+p),r('after/'+p)) for p in v}
kept=[p for p in v if not bumped[p]]
print(json.dumps({'bumped':bumped,'kept':kept,'mode':f.select(kept)['mode'],
 'flows':len(f.select(kept)['browser'])+len(f.select(kept)['audio']),
 'realHtml':f.version_only('index.html',r('before/index.html'),r('after/index.real')),
 'realSw':f.version_only('sw.js',r('before/sw.js'),r('after/sw.real')),
 'same':f.version_only('index.html',r('before/index.html'),r('before/index.html')),
 'other':f.version_only('src/main.js','a','b'),
 'htmlMode':f.select(['index.html'])['mode']}))`);
 for(const f of versioned)assert.equal(out.bumped[f],true,f+': a release bump is version-only');
 assert.deepEqual(out.kept,[]);assert.equal(out.mode,'none');assert.equal(out.flows,0,'a release bump selects no flow');
 assert.equal(out.realHtml,false,'a real index.html change is not version-only');
 assert.equal(out.realSw,false,'a bump plus a new shell entry is not version-only');
 assert.equal(out.same,false,'an unchanged file is not a bump');assert.equal(out.other,false,'only the bumped files qualify');
 assert.equal(out.htmlMode,'full','a real index.html change still runs the full catalogue');
 const none=spawnSync('python3',['tests/flow_impact.py','--none','validated by the merge queue'],{cwd:root,encoding:'utf8'});
 assert.equal(none.status,0,none.stderr);assert.match(none.stdout,/-> none \(validated by the merge queue\)/);assert.match(none.stdout,/Browser: 0 flows in 0 shards/);
 // The browser and audio jobs run in the Playwright image of the pinned version.
 const pin=read('requirements-dev.txt').match(/^playwright==(\S+)$/m)[1],workflow=read('.github/workflows/checks.yml');
 const images=[...workflow.matchAll(/mcr\.microsoft\.com\/playwright\/python:v([^\s'"-]+)-/g)].map(m=>m[1]);
 assert.equal(images.length,2,'browser and audio jobs use the Playwright image');
 for(const v of images)assert.equal(v,pin,'image matches requirements-dev.txt');
 assert.doesNotMatch(workflow,/playwright install/,'the image already has the browsers');
 // The required check: run its script as GitHub does (bash -e) for each outcome.
 const gate=workflow.slice(workflow.indexOf('  browser-audio:')).split('      - run: |\n')[1].split('\n').map(l=>l.slice(10)).join('\n');
 const verdict=(select,browser,bt,audio,at)=>spawnSync('bash',['-e','-c',gate],{encoding:'utf8',env:{...process.env,WHITEDOT_SELECT_RESULT:select,WHITEDOT_BROWSER_RESULT:browser,WHITEDOT_BROWSER_TOTAL:bt,WHITEDOT_AUDIO_RESULT:audio,WHITEDOT_AUDIO_TOTAL:at}}).status===0;
 assert.equal(verdict('success','success','10','success','8'),true,'all green passes');
 assert.equal(verdict('success','skipped','0','success','2'),true,'a kind with no selected flow is skipped and passes');
 assert.equal(verdict('success','skipped','0','skipped','0'),true,'nothing selected passes');
 for(const [args,why] of [[['success','failure','10','success','8'],'a red browser shard'],[['success','success','10','failure','8'],'a red audio shard'],
  [['success','cancelled','10','success','8'],'a cancelled shard'],[['success','skipped','3','success','8'],'a skip with selected flows'],[['failure','skipped','','skipped',''],'a failed selection']])
  assert.equal(verdict(...args),false,why+' fails browser-audio');
 console.log('PASS flow impact: a release bump (index.html, sw.js, package.json, release-info) selects no flow; a real page or shell change still runs everything; the CI image follows the pinned Playwright; browser-audio fails on any red, cancelled or unexpected skip');
}finally{rmSync(dir,{recursive:true,force:true});}
