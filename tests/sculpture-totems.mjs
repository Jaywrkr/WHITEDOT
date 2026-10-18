import assert from 'node:assert/strict';
import {TOTEMS,TOTEM_KINDS,TOTEM_CELL,totemCell,normalizeTotemClaims,TOTEM_DAILY_LIMIT} from '../src/sculpture-totems-model.js';
import {initialize,playTotemResponse} from '../src/sculpture-totems.js';
import {initialize as economy} from '../src/sparks.js';
import {normalizeSparkEconomy} from '../src/sparks-model.js';
import {makeRareCard,normalizeRareBook} from '../src/rare-card-model.js';
import {rarePortrait} from '../src/rare-card-art.js';
import {worldIdentity} from '../src/world-identity.js';
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const found=new Map();let cells=0,groups=0,alone=0;
for(const layer of ['superficie','bajo','cielo'])for(let x=-25;x<25;x++)for(let y=-25;y<25;y++){
 const items=totemCell(x,y,seedOf,layer);assert.deepEqual(items,totemCell(x,y,seedOf,layer));if(items.length){cells++;if(items.length===1)alone++;else groups++;}assert(items.length<=3);
 for(const o of items){found.set(o.kind,o);assert(Math.abs(o.x-(x+.5)*TOTEM_CELL)<TOTEM_CELL*.35);assert(Math.abs(o.y-(y+.5)*TOTEM_CELL)<TOTEM_CELL*.35);assert(o.id.includes(layer));}
}
assert.equal(found.size,6);assert(cells>75&&cells<155);assert(groups>15&&alone>45);assert.equal(normalizeTotemClaims(Object.fromEntries(Array.from({length:90},(_,i)=>['totem:v1:'+i,true]))).constructor,Object);assert.equal(Object.keys(normalizeTotemClaims(Object.fromEntries(Array.from({length:90},(_,i)=>['totem:v1:'+i,true])))).length,64);
const identity=worldIdentity('','classic',1);
for(const kind of TOTEM_KINDS){const card=makeRareCard({type:'totem:'+kind,sourceId:'totem:shape:'+kind,world:identity});assert(card);assert(rarePortrait(card).includes('linearGradient'));assert.equal(normalizeRareBook({version:1,items:[card]}).items.length,1);}
let modal=false,fail=false,cards=[],queued=[],notes=[],saved=null;globalThis.document={hidden:false,querySelector:()=>modal?{}:null};globalThis.Path2D=class{constructor(path){assert(path.includes('M'));}};
const gradient={addColorStop(){}};const ctx=new Proxy({globalAlpha:1},{get:(o,k)=>o[k]??(k==='createLinearGradient'?()=>gradient:(...args)=>{for(const v of args)if(typeof v==='number')assert(Number.isFinite(v));}),set:(o,k,v)=>(o[k]=v,true)});
function game(raw=null){const nodes={},r={S:raw||{mode:'world',todayKey:'2026-10-17',wx:0,wy:0,layer:'superficie',sparks:0,pathCrystals:[]},worldIdentity:identity,seedOf,W:390,H:844,camX:0,camY:0,cx:ctx,waves:[],SIX:.125,inWorld(){return this.S.mode==='world';},$:id=>nodes[id]||={classList:{toggle(){}},addEventListener(){}},save(){if(fail)return false;saved=structuredClone(this.S);return true;},toast(){},regionOfPos:()=>({key:'0,0'}),collectRareCard:(type,o)=>cards.push({type,id:o.id}),ac:{state:'running'},beatSoon:fn=>queued.push(fn),playVoice:(...args)=>{notes.push(args);return true;}};economy(r);initialize(r);return r;}
const step=(r,n)=>{for(let i=0;i<n;i++)r.totemTick(.05);};
const pulse=(r,o,origin='player')=>{r.waves=[{x:o.x-10,y:o.y,prev:9,r:11,origin}];r.totemTick(.05);r.waves=[];};
function place(r,action){for(let x=-20;x<20;x++)for(let y=-20;y<20;y++){r.S.wx=x*TOTEM_CELL+700;r.S.wy=y*TOTEM_CELL+700;const o=r.totemNear().find(o=>TOTEMS[o.kind].action===action);if(o){r.S.wx=o.x;r.S.wy=o.y-40;r.totemTick(.05);return o;}}throw Error('No real fixture');}
let r=game(),o=place(r,'stack');pulse(r,o,'ambient');assert(!o.progress);modal=true;pulse(r,o);assert(!o.progress);modal=false;
for(let i=0;i<3;i++){pulse(r,o);r.totemTick(.05);step(r,16);}assert(o.done>0);assert.equal(r.S.sparks,2);assert.equal(cards.at(-1).type,'totem:'+o.kind);r.drawTotems();
const id=o.id;assert(r.sparkEconomy.totems[id]);assert.equal(r.rewardTotem(id).amount,0);assert.equal(r.S.sparks,2);r=game(structuredClone(saved));assert.equal(r.rewardTotem(id).amount,0);r.S.todayKey='2026-10-18';assert.equal(r.rewardTotem(id).amount,2);
fail=true;const before=r.S.sparks;assert.equal(r.rewardTotem('totem:v1:fail'),false);assert.equal(r.S.sparks,before);assert(!r.sparkEconomy.totems['totem:v1:fail']);fail=false;
for(let i=0;i<100;i++)r.rewardTotem('totem:v1:limit:'+i);assert.equal(Object.keys(r.sparkEconomy.totems).length,TOTEM_DAILY_LIMIT);
const normalized=normalizeSparkEconomy(r.sparkEconomy,r.S.sparks,r.S.todayKey);assert.deepEqual(normalized.totems,r.sparkEconomy.totems);assert.equal(Object.keys(normalizeSparkEconomy(normalized,r.S.sparks,'another-day').totems).length,0);
r=game();o=place(r,'orb');pulse(r,o);assert(o.ball);step(r,20);assert.equal(r.S.sparks,0);r.S.wx=o.x+o.ball.direction*55;r.S.wy=o.y-10;step(r,35);assert.equal(r.S.sparks,2);assert.equal(o.ball,null);
r=game();o=place(r,'guide');pulse(r,o);assert(o.target);assert.equal(r.S.sparks,2);r.drawTotems();
r=game();o=place(r,'stack');r.S.sound=true;pulse(r,o);assert(queued.length);const pending=queued.splice(0);for(const fn of pending)fn(1);assert(notes.length>0&&notes.length<=3);notes=[];
step(r,16);pulse(r,o);const stale=queued.splice(0);r.S={...r.S};for(const fn of stale)fn(2);assert.equal(notes.length,0,'old saves cannot answer queued phrases');
assert.equal(playTotemResponse(r,[o],3),1);r.S.sound=false;assert.equal(playTotemResponse(r,[o],3),0);r.S.sound=true;modal=true;assert.equal(playTotemResponse(r,[o],3),0);modal=false;
for(let i=0;i<100;i++){r.S.wx=i*TOTEM_CELL;r.totemNear();}assert(r.totemState.cache<=48);
r=game();o=place(r,'stack');r.autopilotState={mode:'wander',paused:false};pulse(r,o);assert(!o.progress);r.S.reducedMotion=true;r.drawTotems();
r=game();r.S.previewSeed='demo';o=place(r,'stack');for(let i=0;i<3;i++){pulse(r,o);step(r,16);}assert.equal(r.S.sparks,0);assert(cards.at(-1).id.startsWith('totem:sample:'));r.realTravel=true;step(r,180);for(let i=0;i<3;i++){pulse(r,o);step(r,16);}assert.equal(r.S.sparks,2);assert(cards.at(-1).id.startsWith('totem:shape:'),'a demonstration never blocks the later earned card');
console.log('PASS sparse deterministic singles/groups in all layers, six gradient portraits, three real interactions, manual-only progress, bounded cache, muted/stale audio guards and daily atomic reward limits');
