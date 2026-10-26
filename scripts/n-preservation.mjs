// N closure: reviewed integration is explicit; generation and world art remain byte-identical.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const base='3a8148b5',gitBytes=(...a)=>execFileSync('git',a,{maxBuffer:20*1024*1024}),git=(...a)=>gitBytes(...a).toString(),old=p=>git('show',base+':'+p),read=p=>readFileSync(p,'utf8');
const reviewed=new Set(['audio','canvas','crystal-sparks','house','jam','journey-chapters','journey-finale','journey-games','journey-pulse','journey-release','journey-rhythm','places','playtest','rare-card-model','rare-cards','release-info','song-stage','voice-guide','wow-feel'].map(n=>'src/'+n+'.js'));reviewed.add('styles/estilo-j.css');
const paths=git('ls-tree','-r','--name-only',base,'src','styles','assets').trim().split('\n'),changed=git('diff','--name-only',base,'--','src','styles','assets').trim().split('\n').filter(Boolean);for(const p of changed)assert(reviewed.has(p),'Unreviewed source/art '+p);
let protectedFiles=0;const digest=createHash('sha256');for(const p of paths)if(!reviewed.has(p)){const bytes=readFileSync(p);assert(bytes.equals(gitBytes('show',base+':'+p)),'Protected file '+p);digest.update(p+'\0').update(bytes);protectedFiles++;}
const section=(s,a,b)=>s.slice(s.indexOf(a),s.indexOf(b,s.indexOf(a)));assert.equal(section(read('src/journey-pulse.js'),'export function playCello','export function initialize'),section(old('src/journey-pulse.js'),'export function playCello','export function initialize'),'Cello synthesis unchanged');
let audio=read('src/audio.js');audio=audio.replace('import {onTime,audibleTime}','import {onTime}').replace('  let stageGate=null;\n','');
audio=audio.replace(/  \/\/ A scene's deliberate pause[\s\S]*?(?=  function impulse)/,'');
audio=audio.replace('.connect(stageGate=ac.createGain())','').replace('MU.sq.push({t,s,tick:MU.step})','MU.sq.push({t,s})').replace('runtime.songStageStep?.(s,t,MU.step);','runtime.songStageStep?.(s,t);');
audio=audio.replace('const n=audibleTime(ac);const bt=MU.bq.findLast(t=>t<=n);','const n=ac.currentTime;while(MU.bq.length>1&&MU.bq[1]<=n)MU.bq.shift();const bt=MU.bq[0];');
audio=audio.replace('    silenceSongMix:{get:()=>silenceSongMix},restoreSongMix:{get:()=>restoreSongMix},\n','');assert.equal(audio,old('src/audio.js'),'Audio differs beyond reviewed output pause / transport metadata / visual clock');
const svg=s=>s.match(/<svg\b[\s\S]*?<\/svg>/g)||[];assert.deepEqual(svg(read('index.html')).sort(),svg(old('index.html')).sort(),'UI SVG inventory preserved');
console.log(JSON.stringify({base,status:'PASS',protectedFiles,protectedDigest:digest.digest('hex'),reviewed:[...reviewed],audio:'Only output scene gate, absolute transport metadata, stage step dispatch and audible visual clock differ. Voice/generation code is identical.',limits:'Byte preservation and integration scope, not human listening or device acceptance.'},null,2));
