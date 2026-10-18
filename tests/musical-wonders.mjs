import assert from 'node:assert/strict';
import {WONDERS,WONDER_RATE,wonderCell,normalizeWonders,wonderScore} from '../src/musical-wonders-model.js';
import {initialize} from '../src/musical-wonders.js';
import {wonderPortrait} from '../src/musical-wonders-art.js';
import {playWonderPhrase} from '../src/musical-wonders-audio.js';
import {worldIdentity} from '../src/world-identity.js';
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const fixtures=new Map();let occupied=0;for(const layer of ['superficie','bajo','cielo'])for(let x=-50;x<50;x++)for(let y=-50;y<50;y++){const items=wonderCell(x,y,seedOf,layer);assert.deepEqual(items,wonderCell(x,y,seedOf,layer));assert(items.length<=1);if(items.length)occupied++;for(const o of items)fixtures.set(o.kind,{...o,layer});}
assert.equal(fixtures.size,20);assert(occupied>850&&occupied<1250);assert.equal(new Set(WONDERS.map(d=>d.path)).size,20);assert.equal(new Set(WONDERS.map(d=>JSON.stringify(wonderScore(d,[60,64,67])))).size,20);
for(const d of WONDERS){assert(wonderPortrait(d.id).includes(d.path));for(const n of wonderScore(d,[60,64,67])){assert(n.note>=48&&n.note<=84);assert(n.gain<=.024);assert(n.step<16);}}
const future={version:8,found:{future:true}};assert.equal(normalizeWonders(future),future);assert(normalizeWonders({extension:7,found:{unknown:true}}).found.unknown);
let fail=false,modal=false,saves=0,notes=[];globalThis.document={hidden:false,querySelector:()=>modal?{}:null};globalThis.Path2D=class{constructor(path){assert(path.startsWith('M'));}};
const c=new Proxy({globalAlpha:1},{get:(o,k)=>o[k]??((...args)=>{for(const a of args)if(typeof a==='number')assert(Number.isFinite(a),k);}),set:(o,k,v)=>(o[k]=v,true)});
function game(raw){const r={S:raw||{mode:'world',sound:true,wx:0,wy:0,layer:'superficie',todayKey:'2026-10-17',cube:{version:2}},worldIdentity:worldIdentity('','classic',1),seedOf,MU:{step:0},ac:{state:'running'},SIX:.125,cx:c,W:390,H:844,camX:0,camY:0,waves:[],inWorld(){return this.S.mode==='world';},save(){saves++;return !fail;},regionOfPos:()=>({name:'Origen',genre:'minimal'}),chordTones:()=>[60,64,67],vel:n=>n,hookInst:(...args)=>notes.push(args),toast(){}};initialize(r);return r;}
function place(r,o){r.S.layer=o.layer;r.S.wx=o.x;r.S.wy=o.y-100;r.waves=[];r.wonderTick(.05);}
function pulse(r,o){r.waves=[{x:o.x-10,y:o.y,prev:9,r:11,origin:'player'}];r.wonderTick(.05);r.waves=[];}
let r=game();for(const d of WONDERS){const o=fixtures.get(d.id);place(r,o);pulse(r,o);assert(r.S.musicalWonders.found[d.id]);assert(r.S.rareBook.items.some(c=>c.type==='wonder:'+d.id));notes=[];for(let step=0;step<20;step++){r.MU.step=step;r.wonderMusicStep(step%16,Math.floor(step/16),step*.125);}assert.equal(notes.length,6);const before=saves;pulse(r,o);assert.equal(saves,before,'repeat discoveries never grant again');r.drawWonders();const saved=structuredClone(r.S);r.drawWonderGift(c,195,422,14,100,d.id);assert.deepEqual(r.S,saved);}
assert.equal(r.wonderGifts.length,20);assert.equal(game(structuredClone(r.S)).wonderGifts.length,20);
r=game();const o=fixtures.values().next().value;place(r,o);fail=true;pulse(r,o);assert(!r.S.musicalWonders.found[o.kind]);assert(!r.S.rareBook);fail=false;for(let i=0;i<45;i++)r.wonderTick(.05);pulse(r,o);assert(r.S.musicalWonders.found[o.kind]);
notes=[];modal=true;r.wonderMusicStep(0,0,0);modal=false;assert.equal(notes.length,0);r.wonderTick(.05,true);assert(!r.wonderState.playing);
r=game();place(r,o);r.autopilotState={mode:'wander',paused:false};pulse(r,o);assert(!r.S.musicalWonders.found[o.kind]);r.autopilotState.paused=true;r.labMode=true;pulse(r,o);assert(!r.S.musicalWonders.found[o.kind]);r.labMode=false;document.hidden=true;pulse(r,o);assert(!r.S.musicalWonders.found[o.kind]);document.hidden=false;
r=game();place(r,o);pulse(r,o);notes=[];r.S.sound=false;r.wonderMusicStep(0,0,0);assert.equal(notes.length,0);r.S.sound=true;assert.equal(playWonderPhrase(r,WONDERS[0],0),6);
r=game();r.S.musicalWonders=future;r.S={...r.S};r.wonderTick(.05);assert.equal(r.wonderGifts.length,0);assert.equal(r.S.musicalWonders,future);
for(const kind of ['stack','hourglass','orb','diamond','bottle','spire']){r=game();const site={id:'totem:v1:test:'+kind,kind,x:0,y:0};assert(r.celebrateTotem(site));r.wonderTick(.05);assert(r.wonderState.show);assert(r.S.musicalWonders.totems[kind]);notes=[];for(let step=0;step<20;step++){r.MU.step=step;r.wonderMusicStep(step%16,0,step*.125);}assert.equal(notes.length,6);r.S.reducedMotion=true;r.drawWonders();assert(r.celebrateTotem(site));for(let i=0;i<100;i++)r.wonderTick(.05);notes=[];for(let step=0;step<20;step++){r.MU.step=step;r.wonderMusicStep(step%16,0,step*.125);}assert.equal(notes.length,2,'repeat sculpture gets a brief answer');}
console.log('PASS 20 natural rare finds/portraits/phrases/gifts, atomic grant/cards, reload/future saves, no demo/autopilot rewards, mute/pause/hidden guards and six first/repeat sculpture shows');
