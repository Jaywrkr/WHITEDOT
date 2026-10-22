import assert from 'node:assert/strict';
import {RARE,RARE_CHANCE,RARE_SECONDS,rareStarts,initialize} from '../src/universe-rare.js';
import {STYLES} from '../src/universe-layers.js';
import {NEW_REGIONS} from '../src/universe-regions.js';
// One rare moment for every region but the Void, about once every 48 bars, fixed by region and bar.
for(const id of Object.keys(STYLES))if(id!=='vacio')assert(RARE[id],id+' has a rare moment');for(const r of NEW_REGIONS)assert(RARE[r.id],r.id);assert.equal(RARE.vacio,undefined,'the Void has none');
let n=0;for(let bar=0;bar<20000;bar++)if(rareStarts('4,7','lago',bar))n++;assert(Math.abs(n/20000-RARE_CHANCE)<.006,'chance '+n/20000);
assert.equal(rareStarts('4,7','lago',123),rareStarts('4,7','lago',123));assert.equal(rareStarts('4,7','vacio',123),false);
// Runtime: a bar that brings one starts it, it is drawn and counted in the save, it ends after a few seconds.
let clock=0;const realNow=performance.now.bind(performance);performance.now=()=>clock;
const calls=[];const c=new Proxy({},{get:(o,k)=>k in o?o[k]:(...a)=>calls.push(k),set:(o,k,v)=>{o[k]=v;return true;}});
let saves=0;const r={S:{},save:()=>{saves++;return true;}};initialize(r);
const bar=[...Array(5000).keys()].find(b=>rareStarts('2,2','dunas',b)&&b>0);
const ctx=b=>({here:'dunas',key:'2,2',bar:b,ink:'#f3e6b0',cubeX:195,cubeY:422,t:clock});
r.universeRareTick(c,390,844,ctx(bar-1));assert.equal(r.universeRareState().active,null);r.universeRareTick(c,390,844,ctx(bar));assert.equal(r.universeRareState().active,'dunas');
clock+=1000;calls.length=0;r.universeRareTick(c,390,844,ctx(bar));assert(calls.length>0,'drawn');assert.equal(r.S.universe.rare.dunas,1);assert.equal(saves,1);
clock+=RARE_SECONDS*1000;r.universeRareTick(c,390,844,ctx(bar));assert.equal(r.universeRareState().active,null,'it ends');
// Every moment draws seen from above.
for(const id of Object.keys(RARE)){r.universeRare(id);for(const p of [.1,.5,.9]){calls.length=0;clock+=p*1000;r.universeRareTick(c,390,844,{...ctx(bar),here:id});}clock+=RARE_SECONDS*1000;r.universeRareTick(c,390,844,{...ctx(bar),here:id});}
assert.equal(Object.keys(r.universeRareState().kept).length,Object.keys(RARE).length);
// Reduced motion: still counted, not drawn.
r.S.reducedMotion=true;r.universeRare('lago');clock+=500;calls.length=0;r.universeRareTick(c,390,844,{...ctx(bar),here:'lago'});assert.equal(calls.length,0);
performance.now=realNow;
console.log('PASS universe rare moments: one per region but the Void, about once every 48 bars by region and bar, drawn from above for a few seconds, counted in the save, not drawn with reduced motion');
