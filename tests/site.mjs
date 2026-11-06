// D10/D11: the static site (landing, privacy, press kit) is generated, local-only and kept out of the game.
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {join,dirname} from 'node:path';
import {GAME_PATHS} from '../scripts/itch-package.mjs';
const root=new URL('../',import.meta.url).pathname,site=join(root,'site'),read=f=>readFileSync(join(root,f),'utf8');
const check=spawnSync(process.execPath,[join(root,'scripts/site-build.mjs'),'--check'],{encoding:'utf8'});
assert.equal(check.status,0,'site pages match scripts/site-build.mjs and docs/PRIVACIDAD.md: '+check.stdout);
const pages=['index.html','en.html','privacidad.html','privacy.html','prensa.html','press.html'];
const walk=d=>readdirSync(d).flatMap(n=>{const p=join(d,n);return statSync(p).isDirectory()?walk(p):[p];});
let bytes=0;for(const f of walk(site))bytes+=statSync(f).size;
assert.ok(bytes<1.2e6,'the whole site stays small: '+bytes);
for(const f of walk(join(site,'img')))assert.ok(statSync(f).size<=150e3,'image ≤150 KB: '+f);
for(const name of [...pages,'site.css']){
 const text=readFileSync(join(site,name),'utf8');
 // No trackers, cookies or external requests: every reference is a local file.
 assert.doesNotMatch(text,/https?:\/\/|\/\/[a-z]|<script|document\.cookie|<iframe/i,name+' is local and script-free');
 for(const m of text.matchAll(/(?:\b(?:href|src)="|url\(['"]?)([^"')\s>]+)/g)){const ref=m[1].split('#')[0];if(!ref||ref.startsWith('data:'))continue;
  assert.ok(existsSync(join(site,ref)),name+' → '+ref);}
}
for(const name of pages){const html=readFileSync(join(site,name),'utf8');
 assert.match(html,/<meta charset="utf-8">/);assert.match(html,/name="viewport"/);
 assert.match(html,/privac(idad|y)\.html/);assert.match(html,/(prensa|press)\.html/);assert.match(html,/\[CORREO\]/,'contact placeholder visible');}
// Store buttons are placeholders until the pages exist: no dead links.
for(const name of ['index.html','en.html'])assert.doesNotMatch(readFileSync(join(site,name),'utf8'),/href="[^"]*(itch|play\.google)/);
for(const name of ['privacidad.html','privacy.html']){const html=readFileSync(join(site,name),'utf8');
 for(const p of ['[NOMBRE LEGAL]','[CORREO]','[FECHA]'])assert.ok(html.includes(`<mark class="todo">${p}</mark>`),name+' keeps '+p);
 assert.doesNotMatch(html,/Notas para Jay|no publicar|Supabase/i,'only the public part');}
// Out of the game: not cached by the worker, not in the itch.io zip or the Android copy.
assert.doesNotMatch(read('sw.js'),/site\//);
assert.ok(!GAME_PATHS.some(p=>p==='site'||p.startsWith('site/')));
assert.doesNotMatch(read('scripts/android-assets.mjs'),/'site'/);
console.log('PASS site: 6 pages, local only, '+Math.round(bytes/1024)+' KB, out of the game');
