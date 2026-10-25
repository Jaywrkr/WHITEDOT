// Audit-4 closure guard. This checks preserved files, not musical beauty or human acceptance.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const base=process.argv[2]||'04ae8bdd',git=(...args)=>execFileSync('git',args),old=p=>git('show',`${base}:${p}`).toString();
const reviewed=new Set(['controls','interactions','journal','journey-chain','journey-chapters','journey-dance','journey-echo','journey-games','journey-garden','journey-guide','journey-lasso','journey-mode','journey-pulse','journey-rebuild','journey-release','journey-resonance','journey-stick','journey-surf','journey-victory','places','refugio-lugares','release-info','song-stage','song','ui','voice-guide'].map(p=>'src/'+p+'.js'));
const changed=git('diff','--name-only',base,'--','src','styles','assets').toString().trim().split('\n').filter(Boolean);for(const p of changed)assert(reviewed.has(p),`Unreviewed runtime/art change: ${p}`);
const paths=git('ls-tree','-r','--name-only',base,'src','styles','assets').toString().trim().split('\n');let checked=0;const hash=createHash('sha256');
for(const p of paths){if(reviewed.has(p))continue;const bytes=readFileSync(p);assert(bytes.equals(git('show',`${base}:${p}`)),`Protected generation/art asset changed: ${p}`);hash.update(p+'\0').update(bytes);checked++;}
const svg=t=>t.match(/<svg\b[\s\S]*?<\/svg>/g)||[];assert.deepEqual(svg(readFileSync('index.html','utf8')),svg(old('index.html')),'UI artwork unchanged');
const section=(t,a,b)=>{const start=t.indexOf(a),end=t.indexOf(b,start);assert(start>=0&&end>start,`Missing preserved section: ${a}`);return t.slice(start,end);};
const games=['stick','chain','lasso','dance','release','garden','surf','resonance','guide','rebuild','echo'];
for(const name of games){const p='src/journey-'+name+'.js';assert.equal(section(readFileSync(p,'utf8'),'export const','export function initialize'),section(old(p),'export const','export function initialize'),`${name} generation/rule constants unchanged`);}
for(const [p,a,b] of [['src/song.js','export function initialize','\u0000'],['src/journey-pulse.js','export function playCello','export function initialize'],['src/song-stage.js','export function ringLayout','// The plan of a playing:'],['src/places.js','export const PLACES_VERSION','const object=']]){
 const current=readFileSync(p,'utf8'),previous=old(p);const part=t=>b==='\u0000'?t.slice(t.indexOf(a)):section(t,a,b);assert.equal(part(current),part(previous),`${p}: voices, art or progression rules unchanged`);
}
console.log(JSON.stringify({base,scope:'Byte checks for generators, radio, styles, assets, UI SVGs and unchanged rule/voice sections; reviewed integration files excluded. No listening claim.',protectedFiles:checked,protectedDigest:hash.digest('hex'),reviewedFiles:[...reviewed],gameRuleFamilies:games.length,status:'PASS'},null,2));
