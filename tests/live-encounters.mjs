import assert from 'node:assert/strict';
import {LIVE_ENCOUNTERS,LIVE_REWARD,LIVE_EVERY,LIVE_VERBS,LIVE_COLORS,LIVE_BEHAVIORS,LIVE_TOUCH,LIVE_PULSE_CATCH,LIVE_PULSE_HOLD,LIVE_FAREWELL,liveDefinition,liveFor,liveInterval,liveSpawnPoint,normalizeLive,createLive,stepLive,liveFinished,liveReward,liveForced} from '../src/live-encounters-model.js';
import {LIVE_SHAPES} from '../src/live-encounters-art.js';
// Jay (27 Oct 2026): living encounters. Batch 1: the common engine and the eleven «perseguir», one per biome.
const BIOMES=['llanura','bosque','lago','ruinas','jardin','dunas','cristales','faros','tormenta','cueva','vacio'];
assert.equal(LIVE_ENCOUNTERS.length,11);assert.deepEqual(LIVE_ENCOUNTERS.map(d=>d.biome),BIOMES);assert.deepEqual(Object.keys(LIVE_COLORS),BIOMES);
assert.equal(new Set(LIVE_ENCOUNTERS.map(d=>d.id)).size,11);assert.deepEqual(LIVE_VERBS,['perseguir','huir','hacer']);
for(const d of LIVE_ENCOUNTERS){assert.equal(d.verb,'perseguir');assert(LIVE_BEHAVIORS.includes(d.behavior),d.id);assert(LIVE_SHAPES.includes(d.id),d.id);
 // One short line, in Spanish, when it appears and when it leaves.
 for(const t of [d.line,d.bye,d.name])assert(typeof t==='string'&&t.length>2&&t.length<=40,d.id+': '+t);assert.equal(liveFor(d.biome),d);assert.equal(liveDefinition(d.id),d);}
assert.equal(liveFor('pradera'),null);assert.deepEqual(LIVE_REWARD,{base:10,onTime:15});
// 60–90 s of travel, from the hash, the same on every replay; the spot is near and ahead of the cube.
const gaps=Array.from({length:400},(_,n)=>liveInterval('w',n));assert(gaps.every(g=>g>=LIVE_EVERY.min&&g<=LIVE_EVERY.max));assert(Math.max(...gaps)-Math.min(...gaps)>25,'they vary');assert.deepEqual(gaps,Array.from({length:400},(_,n)=>liveInterval('w',n)));
for(let n=0;n<200;n++){const h=n*.37,p=liveSpawnPoint({x:100,y:-50},h,'w',n),dx=p.x-100,dy=p.y+50,ahead=dx*Math.cos(h)+dy*Math.sin(h),side=Math.abs(-dx*Math.sin(h)+dy*Math.cos(h));assert(ahead>=280&&ahead<=340&&side<=90,JSON.stringify(p));assert.deepEqual(p,liveSpawnPoint({x:100,y:-50},h,'w',n));}
// No old random sequence: the engine never asks Math.random.
const random=Math.random;Math.random=()=>{throw Error('Math.random used');};
function play(def,seed,{mode='still',pulseEvery=.5,beat=true,seconds=40}={}){const player={x:0,y:0},s=createLive(def,liveSpawnPoint(player,0,'t:'+seed,seed),player);let t=0,last=-9;
 while(s.stage==='run'&&t<seconds){const dt=.05;t+=dt;
  if(mode!=='still'){const lead=mode==='intercept'?Math.min(1,Math.hypot(s.x-player.x,s.y-player.y)/190):0,tx=s.x+s.vx*lead,ty=s.y+s.vy*lead,dx=tx-player.x,dy=ty-player.y,l=Math.hypot(dx,dy)||1;player.x+=dx/l*Math.min(l,190*dt);player.y+=dy/l*Math.min(l,190*dt);}
  const pulses=[];if(mode==='pulse'&&t-last>=pulseEvery){last=t;pulses.push({x:player.x,y:player.y,beat});}
  stepLive(s,player,dt,{pulses,beatPhase:(t/.5)%1});}
 return {s,t};}
for(const def of LIVE_ENCOUNTERS){
 // Standing still it always gets away: failing costs nothing (no reward).
 for(let seed=0;seed<6;seed++){const {s}=play(def,seed);assert.equal(s.stage,'escaped',def.id);assert.equal(liveReward(s),0);}
 // Touching on time always helps: walking after it and pulsing on time catches it, quicker than walking alone.
 let pulsed=0,pulseTime=0,walked=0,walkTime=0,offBeat=0;
 for(let seed=0;seed<20;seed++){const p=play(def,seed,{mode:'pulse'});if(p.s.stage==='caught'){pulsed++;pulseTime+=p.t;assert(p.s.onTime||Math.hypot(p.s.x,p.s.y)>=0);}
  const w=play(def,seed,{mode:def.id==='estrella'?'intercept':'chase'});if(w.s.stage==='caught'){walked++;walkTime+=w.t;assert.equal(w.s.onTime,false);assert.equal(liveReward(w.s),LIVE_REWARD.base);}
  const o=play(def,seed,{mode:'pulse',beat:false});if(o.s.stage==='caught'&&o.s.onTime)offBeat++;}
 assert.equal(pulsed,20,def.id+' a pulse on time near it always catches it');assert.equal(offBeat,0,def.id+' a pulse off time never counts as on time');
 assert(walked>=5,def.id+': it can be caught by walking alone ('+walked+'/20)');assert(walkTime/walked>pulseTime/pulsed*1.15||walked<20,def.id+': walking alone is harder');
}
// The pulse's own rule: on time within reach catches (15 ✦), a little further holds it still, off time does nothing.
{const def=liveDefinition('polilla'),player={x:0,y:0},make=()=>createLive(def,{x:200,y:0,seed:7},player);
 let s=make();stepLive(s,player,.05,{pulses:[{x:200-LIVE_PULSE_CATCH+20,y:0,beat:true}]});assert.equal(s.stage,'caught');assert(s.onTime);assert.equal(liveReward(s),LIVE_REWARD.onTime);
 s=make();stepLive(s,player,.05,{pulses:[{x:200-LIVE_PULSE_HOLD+20,y:0,beat:true}]});assert.equal(s.stage,'run');assert(s.hold>1.9);const x=s.x;stepLive(s,player,.05,{});assert(Math.abs(s.x-x)<178*.05*.25,'held, it barely moves');
 s=make();stepLive(s,player,.05,{pulses:[{x:200,y:0,beat:false}]});assert.equal(s.stage,'run');assert.equal(s.hold,0);
 s=make();stepLive(s,{x:200-LIVE_TOUCH+16,y:0},.05,{});assert.equal(s.stage,'caught');assert.equal(s.onTime,false);assert.equal(liveReward(s),LIVE_REWARD.base);
 assert(!liveFinished(s));for(let i=0;i<Math.ceil(LIVE_FAREWELL/.05)+1;i++)stepLive(s,player,.05,{});assert(liveFinished(s));}
// Hidden moments cannot be caught: the fish under the wave, the pulsar while it is out.
{const fish=createLive(liveDefinition('pez'),{x:30,y:0,seed:1},{x:0,y:0});stepLive(fish,{x:30,y:0},.05,{beatPhase:.8});assert.equal(fish.stage,'run');assert(fish.hidden);stepLive(fish,{x:fish.x,y:fish.y},.05,{beatPhase:.1});assert.equal(fish.stage,'caught');}
// The kite reaching its mark and the echo the bottom get away.
for(const id of ['cometa','eco']){const s=createLive(liveDefinition(id),{x:300,y:0,seed:3},{x:0,y:0});for(let i=0;i<800&&s.stage==='run';i++)stepLive(s,{x:s.x-400,y:s.y},.05,{});assert.equal(s.stage,'escaped',id);assert(Math.hypot(s.x-s.goal.x,s.y-s.goal.y)<30||s.age>=liveDefinition(id).life,id);}
Math.random=random;
// Saves: unknown kinds (a later batch) and later versions are kept; counts are bounded.
const future={version:4,secret:true};assert.equal(normalizeLive(future),future);
const n=normalizeLive({kinds:{polilla:{caught:3,onTime:9,escaped:-2,first:'2026-10-27',x:1},manta:{caught:1},__proto__:{caught:1},bad:5},count:-4,extra:'kept'});
assert.deepEqual(n.kinds.polilla,{caught:3,onTime:3,escaped:0,first:'2026-10-27',x:1});assert(n.kinds.manta);assert.equal(n.count,0);assert.equal(n.extra,'kept');assert(!('bad' in n.kinds));assert.equal(n.version,1);
assert.deepEqual(normalizeLive(null),{version:1,kinds:{},count:0,caught:0,earned:0});
assert.equal(liveForced('?encuentro=polilla'),'polilla');assert.equal(liveForced('?encuentro=nada'),null);assert.equal(liveForced(''),null);
console.log('PASS living encounters model: eleven «perseguir», one per biome; 60–90 s from the hash, ahead of the cube; a pulse on time always catches (15 ✦) or holds; walking alone is possible but slower (10 ✦); standing still it gets away for nothing; no Math.random; future saves kept');
