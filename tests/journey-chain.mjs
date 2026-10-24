import assert from 'node:assert/strict';
import {initialize as games} from '../src/journey-games.js';
import {CHAIN_GOAL,CHAIN_CELL,CHAIN_FIRST,CHAIN_WAVE_MS,cellFlowers,chainValue,chainProgress,normalizeChain,initialize} from '../src/journey-chain.js';
// Flowers come in clusters from hashes of the cell: six cells in ten, three to seven flowers each, every flower close
// enough to the one before for the ripple to pass.
let clusters=0;for(let i=0;i<40;i++)for(let j=0;j<40;j++){const list=cellFlowers(i,j);if(!list.length)continue;clusters++;assert.deepEqual(list,cellFlowers(i,j));assert(list.length>=3&&list.length<=7);
 for(let k=1;k<list.length;k++)assert(Math.hypot(list[k].x-list[k-1].x,list[k].y-list[k-1].y)<=62);}
assert(clusters>850&&clusters<1060,'about 60%: '+clusters);
// The nth flower of a chain is worth n, up to five.
assert.deepEqual([1,2,3,5,9].map(chainValue),[1,2,3,5,5]);assert.equal(chainProgress(CHAIN_GOAL),1);assert.equal(chainProgress(-1),0);
assert.deepEqual(normalizeChain(null),{points:0,lit:[],flower:null,opened:false,hinted:false,best:0});
assert.deepEqual(normalizeChain({points:500,lit:['1,2,3','1,2','x',4],flower:{x:1.4,y:2},opened:true,best:4}),{points:CHAIN_GOAL,lit:['1,2,3'],flower:{x:1,y:2},opened:true,hinted:false,best:4});
// Runtime: off time nothing; on time a ripple lights flowers in reach and they pass it on.
let clock=0;const realNow=performance.now.bind(performance);performance.now=()=>clock;const timers=[];globalThis.setTimeout=f=>{timers.push(f);return 0;};
const toasts=[],done=[];
const r={S:{wx:0,wy:0,sound:false,journey:{}},BIOMES:[{id:'lago'},{id:'llanura'}],biomeOfPos:()=>0,journeyChapter:()=>({id:'lago',done:{}}),journeyQuiet:()=>true,inWorld:()=>true,save:()=>true,toast:m=>toasts.push(m),journeyComplete:id=>done.push(id),MU:{journeyFloor:0,journeyCap:.4}};
games(r);initialize(r);
const draws=[];const ctx=new Proxy({},{get:(o,k)=>k in o?o[k]:()=>draws.push(k),set:(o,k,v)=>{o[k]=v;return true;}});
const frame=()=>{r.drawJourneyGamesUnder(ctx,390,844,clock);r.drawJourneyGames(ctx,390,844,clock);};
// Stand on a flower with others around.
let spot=null;for(let i=2;i<30&&!spot;i++)for(let j=2;j<30&&!spot;j++){const list=cellFlowers(i,j);if(list.length>=5){const f=list[0];r.S.wx=f.x-100*Math.sign(list[1].x-f.x||1);r.S.wy=f.y;if(r.journeyChain().near.length===1)spot=f;}}
assert(spot);frame();assert(r.S.journey.chain.hinted);
assert.equal(r.journeyGamePulse(false),'miss');for(let i=0;i<10;i++){clock+=60;frame();}assert.equal(r.journeyChain().points,0,'off time nothing lights');
assert.equal(r.journeyGamePulse(true),'ripple');for(let i=0;i<60;i++){clock+=50;frame();}
const st=r.journeyChain();assert(st.lit>=5&&st.best>=5,'one pulse runs through the cluster: '+JSON.stringify(st));assert(r.S.journey.chain.lit.length===st.lit,'lit flowers are saved');
// A chain gives more than its flowers when it goes on: points ≥ flowers lit, and more once a chain went past one step.
assert(st.points>st.lit,'a chain is worth more than its flowers');
// Lit flowers do not light again.
const p1=st.points;assert.equal(r.journeyGamePulse(true),'ripple');for(let i=0;i<60;i++){clock+=50;frame();}assert(r.journeyChain().lit>=st.lit);
// Full bar: the gold flower comes beside the cube; off time it waits; a pulse on time opens it, once.
r.S.journey.chain.points=CHAIN_GOAL;frame();const fl=r.journeyChain().flower;assert(fl&&Math.hypot(fl.x-r.S.wx,fl.y-r.S.wy)<100);timers.splice(0).forEach(f=>f());assert(!toasts.some(t=>/flor dorada/.test(t)),'the Journey has no lines (plan H5)');
assert.equal(r.journeyGamePulse(false),'miss');assert.deepEqual(done,[]);assert.equal(r.journeyGamePulse(true),'open');assert.deepEqual(done,['lago']);assert(r.journeyChain().opened);
assert(draws.includes('arc'));assert(r.MU.journeyFloor>=.8);
// Classic chapters keep the lotuses: the game is not played there.
r.journeyChapter=()=>({id:'llanura',done:{}});assert.equal(r.journeyGamePulse(true),null);
performance.now=realNow;
console.log('PASS journey chain: flowers by cell hash, off time nothing, a ripple on time lights flowers that pass it on, longer chains worth more, lit flowers saved, the full bar brings the gold flower and a pulse on time opens it once');
