import assert from 'node:assert/strict';
import {initialize} from '../src/universe-activities.js';
import {initialize as texts} from '../src/universe-texts.js';
import {activityCell,normalizeActivities} from '../src/universe-activities-model.js';
import {normalizeSparkEconomy} from '../src/sparks-model.js';
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
let modal=false,fail=false,writes=0,notes=0;const css=new Set();globalThis.document={hidden:false,querySelector:()=>modal?{}:null,body:{classList:{toggle(k,v){v?css.add(k):css.delete(k);}}}};
const c=new Proxy({globalAlpha:1,fillText(){}},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
function game(raw){const S=raw||{mode:'world',wx:0,wy:0,layer:'superficie',todayKey:'2026-10-17',sparks:0,sound:true};S.sparkEconomy=normalizeSparkEconomy(S.sparkEconomy,S.sparks,S.todayKey);const pending=[],r={S,worldIdentity:{seed:'test'},seedOf,cx:c,W:390,H:844,camX:0,camY:0,SPEED:250,MU:{near:[],singers:[]},waves:[],inWorld(){return this.S.mode==='world';},get sparkEconomy(){return this.S.sparkEconomy;},save(){writes++;return !fail;},beat:()=>0,beatSoon:fn=>pending.push(fn),chordTones:()=>[60,64,67],regionOfPos:()=>({}),vel:n=>n,hookInst(){notes++;},ac:{state:'running'},recordWalk(){},pending};initialize(r);return r;}
let site;for(let x=-80;x<80&&!site;x++)for(let y=-80;y<80&&!site;y++)site=activityCell(x,y,seedOf).find(o=>o.kind==='orchestra');assert(site);
const run=(r,n)=>{for(let i=0;i<n;i++)r.activityWorldTick(.05);};
function enter(r){r.S.wx=site.x+200;r.S.wy=site.y;run(r,1);r.S.wx=site.x;run(r,20);}
let r=game();r.autopilotState={mode:'wander',paused:false};enter(r);assert(!r.activityActive);r.autopilotState.paused=true;fail=true;enter(r);assert(!r.activityActive);assert(!Object.keys(r.activityState.book.progress).length);fail=false;run(r,50);assert(r.activityActive);
const original={x:r.S.wx,y:r.S.wy},paused=structuredClone(r.activityState.player);r.activityFrame(0,.05,1,0,true);assert.deepEqual(r.activityState.player,paused);
function solve(r){const {level:l,player:s}=r.activityState;for(const node of l.nodes){s.x=node.x;s.y=node.y;r.activityFrame(0,.05,0,0);s.x=l.spawn.x;s.y=l.spawn.y;r.activityFrame(0,.05,0,0);}}
fail=true;solve(r);assert.equal(r.S.sparks,0);assert(!r.activityState.book.done[site.id]);const attempts=writes;for(let i=0;i<10;i++)r.activityFrame(0,.05,0,0);assert.equal(writes,attempts,'failed reward writes have backoff');fail=false;for(let i=0;i<45;i++)r.activityFrame(0,.05,0,0);assert.equal(r.S.sparks,5);assert(r.activityState.book.done[site.id]);assert.equal(r.S.sparkEconomy.earned-r.S.sparkEconomy.spent,5);assert.deepEqual({x:r.S.wx,y:r.S.wy},original);
let p=r.activityState.player,l=r.activityState.level;p.x=l.exit.x;p.y=l.exit.y;r.activityFrame(0,.05,0,0);assert(!r.activityActive);for(const fn of r.pending)fn(0);assert.equal(notes,0,'callbacks from exited places cannot play');
r=game(structuredClone(r.S));enter(r);solve(r);assert.equal(r.S.sparks,5,'completed places never pay twice after reload');
const progress=structuredClone(r.S.activities);r=game({...r.S,activities:progress});assert(r.activityState.book.done[site.id]);
const future={version:8,secret:7};r=game({mode:'world',wx:0,wy:0,layer:'superficie',sparks:0,activities:future});enter(r);assert(!r.activityActive);assert.equal(r.S.activities,future);
const control={checked:true};r=game();r.$=()=>control;let displayed=0;c.fillText=()=>displayed++;texts(r);c.fillText('visible');assert.equal(displayed,1);control.checked=false;control.onchange();assert.equal(r.S.universeTexts,false);c.fillText('hidden');assert.equal(displayed,1);assert(css.has('universe-texts-off'));fail=true;control.checked=true;control.onchange();assert.equal(r.S.universeTexts,false);assert.equal(control.checked,false);fail=false;r.S.mode='camino';c.fillText('Camino');assert.equal(displayed,2);
assert.equal(Object.keys(normalizeActivities({progress:Object.fromEntries(Array.from({length:50},(_,i)=>['activity:v1:'+i,{}]))}).progress).length,32);
console.log('PASS real portal dwell, manual-only entry, paused local movement, atomic one-time reward, quota backoff, world coordinates preserved, reload/future saves, stale audio cancellation and persisted text-toggle rollback');
