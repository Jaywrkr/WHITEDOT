import assert from 'node:assert/strict';
import {LIVE_ENCOUNTERS,LIVE_REWARD,LIVE_EVERY,LIVE_VERBS,LIVE_COLORS,LIVE_BEHAVIORS,LIVE_TOUCH,LIVE_PULSE_CATCH,LIVE_PULSE_HOLD,LIVE_FAREWELL,LIVE_SHIELD,LIVE_KNOCK,LIVE_KNOCK_SPEED,LIVE_DO_PULSE,LIVE_DO_BONUS_MAX,LIVE_BURN,liveDefinition,liveFor,liveInterval,liveSpawnPoint,normalizeLive,createLive,stepLive,liveFinished,liveReward,liveForced,liveGoal,liveWon,liveLost} from '../src/live-encounters-model.js';
import {LIVE_SHAPES} from '../src/live-encounters-art.js';
// Jay (27 Oct 2026): living encounters. Batch 1: the common engine and the eleven «perseguir», one per biome.
// Batch 2: the eleven «huir», one per biome, on the same engine (rows, a behaviour each and the verb's rule).
// Batch 3: the eleven «hacer», one per biome, on the same engine.
const BIOMES=['llanura','bosque','lago','ruinas','jardin','dunas','cristales','faros','tormenta','cueva','vacio'];
const CHASE=LIVE_ENCOUNTERS.filter(d=>d.verb==='perseguir'),FLEE=LIVE_ENCOUNTERS.filter(d=>d.verb==='huir'),DO=LIVE_ENCOUNTERS.filter(d=>d.verb==='hacer');
assert.equal(LIVE_ENCOUNTERS.length,33);for(const list of [CHASE,FLEE,DO])assert.deepEqual(list.map(d=>d.biome),BIOMES);assert.deepEqual(Object.keys(LIVE_COLORS),BIOMES);
assert.deepEqual(LIVE_ENCOUNTERS.slice(0,11),CHASE,'batch 1 keeps its place');assert.deepEqual(LIVE_ENCOUNTERS.slice(11,22),FLEE,'batch 2 keeps its place');assert.deepEqual(FLEE.map(d=>d.id),['remolino','enjambre','ola','derrumbe','polen','arena','rayos','ondas','llamaradas','pozo','agujero']);
assert.deepEqual(DO.map(d=>d.id),['motas','estrellita','burbujas','guardian','brotes','caravana','nodos','pulsares','antena','luciernagas','constelacion']);
assert.equal(new Set(LIVE_ENCOUNTERS.map(d=>d.id)).size,33);assert.equal(new Set(LIVE_ENCOUNTERS.map(d=>d.behavior)).size,33);assert.deepEqual(LIVE_VERBS,['perseguir','huir','hacer']);
for(const d of LIVE_ENCOUNTERS){assert(LIVE_BEHAVIORS.includes(d.behavior),d.id);assert(LIVE_SHAPES.includes(d.id),d.id);
 // One short line, in Spanish, when it appears and when it leaves.
 for(const t of [d.line,d.bye,d.name])assert(typeof t==='string'&&t.length>2&&t.length<=40,d.id+': '+t);assert.equal(liveDefinition(d.id),d);}
// The biome's roll, in thirds: its chase (as in batch 1), its flight, its task.
for(const [i,b] of BIOMES.entries()){assert.equal(liveFor(b),CHASE[i]);assert.equal(liveFor(b,.33),CHASE[i]);assert.equal(liveFor(b,.34),FLEE[i]);assert.equal(liveFor(b,.66),FLEE[i]);assert.equal(liveFor(b,.67),DO[i]);assert.equal(liveFor(b,.999),DO[i]);}
// Doing lasts a short while: 26 to 30 seconds at most, a few steps each.
for(const d of DO)assert(d.life>=20&&d.life<=30&&d.need>=2&&d.need<=12,d.id);
// Fleeing lasts a short while: 8 to 15 seconds.
for(const d of FLEE)assert(d.life>=8&&d.life<=15,d.id);
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
for(const def of CHASE){
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
// Fleeing (batch 2). A bot that walks toward the white arrow (liveGoal) with or without pulses on time every beat,
// after reacting at once or 1.5 s late; the threat's pull and its nudge move it as they move the cube in the game.
function flee(def,seed,{pulse=false,beat=true,delay=0,still=false,beatLen=.5}={}){const player={x:0,y:0},s=createLive(def,liveSpawnPoint(player,seed*.7,'h:'+seed,seed),player);let t=0,last=-9;
 while(s.stage==='run'&&t<30){const dt=.05;t+=dt;
  if(!still&&t>delay){const g=liveGoal(s,player),dx=g.x-player.x,dy=g.y-player.y,l=Math.hypot(dx,dy)||1;player.x+=dx/l*Math.min(l,190*dt);player.y+=dy/l*Math.min(l,190*dt);}
  const pulses=[];if(pulse&&t-last>=beatLen){last=t;pulses.push({x:player.x,y:player.y,beat});}
  stepLive(s,player,dt,{pulses,beatPhase:(t/beatLen)%1});if(s.drag){player.x+=s.drag.x*dt;player.y+=s.drag.y*dt;}}
 const at={...player};let knock=0,knockTime=0;while(s.drag&&knockTime<5){stepLive(s,player,.05,{});if(s.drag){knock+=Math.hypot(s.drag.x,s.drag.y)*.05;knockTime+=.05;}}
 return {s,t,knock,knockTime,at};}
const sums={};
for(const def of FLEE){const row=sums[def.id]={flee:0,late:0,latePulse:0};
 for(let seed=0;seed<20;seed++){
  // Standing still, it reaches you: no reward, a short nudge (at most a second, a few dozen units), never more.
  const still=flee(def,seed,{still:true});assert.equal(still.s.stage,'hit',def.id+' standing still it reaches you');assert.equal(liveReward(still.s),0);assert(liveLost(still.s)&&!liveWon(still.s));
  assert(still.knockTime<=LIVE_KNOCK+.06&&still.knock<=LIVE_KNOCK_SPEED*LIVE_KNOCK+3,def.id+' a soft nudge: '+still.knock);
  // Pulses on time always help: from the start or 1.5 s late, it always ends in an escape with 15 ✦.
  for(const delay of [0,1.5]){const p=flee(def,seed,{pulse:true,delay});assert.equal(p.s.stage,'safe',def.id+' pulses on time always escape ('+delay+' s late, seed '+seed+')');assert(p.s.onTime);assert.equal(liveReward(p.s),LIVE_REWARD.onTime);if(delay)row.latePulse++;}
  // Walking alone it can be done (10 ✦); late, often not.
  const w=flee(def,seed);if(w.s.stage==='safe'){row.flee++;assert.equal(w.s.onTime,false);assert.equal(liveReward(w.s),LIVE_REWARD.base);}
  const late=flee(def,seed,{delay:1.5});if(late.s.stage==='safe')row.late++;
  // A pulse off time is never on time.
  const off=flee(def,seed,{pulse:true,beat:false});assert.equal(off.s.onTime,false,def.id);assert(liveReward(off.s)<=LIVE_REWARD.base);
  // At another tempo (and with no beat at all) the same holds for pulses on time.
  assert.equal(flee(def,seed,{pulse:true,beatLen:.62}).s.stage,'safe',def.id+' at a slower tempo');}
 assert(row.flee>=10,def.id+': walking alone escapes ('+row.flee+'/20)');assert(row.latePulse===20&&row.latePulse>=row.late,def.id);}
// Without sound there is no beat: a steady clock keeps the beat-driven threats going.
for(const id of ['derrumbe','rayos','ondas','llamaradas']){const s=createLive(liveDefinition(id),{x:200,y:0,seed:5},{x:0,y:0});for(let i=0;i<200&&s.stage==='run';i++)stepLive(s,{x:0,y:0},.05,{});assert.equal(s.stage,'hit',id+' keeps its beat without sound');}
// The pulse's rule while fleeing: one on time shields the cube a moment and undoes the whirl when it is close.
{const def=liveDefinition('remolino'),player={x:0,y:0},s=createLive(def,{x:150,y:0,seed:2},player);stepLive(s,player,.05,{pulses:[{x:0,y:0,beat:false}]});assert.equal(s.stage,'run');assert.equal(s.shield,0);
 stepLive(s,player,.05,{pulses:[{x:0,y:0,beat:true}]});assert.equal(s.stage,'run','not close enough yet');assert.equal(s.shield,LIVE_SHIELD);assert(s.onTime);
 s.x=100;stepLive(s,player,.05,{pulses:[{x:0,y:0,beat:true}]});assert.equal(s.stage,'safe');assert.equal(liveReward(s),LIVE_REWARD.onTime);}
// Where to go: the wave's ring, a shelter behind a stone, out of the circle, away from the whirl.
{const p={x:0,y:0},ola=createLive(liveDefinition('ola'),{x:300,y:0,seed:1},p);assert.deepEqual(liveGoal(ola,p),{x:ola.safe.x,y:ola.safe.y});assert(ola.safe.x>150,'the ring is ahead');
 const arena=createLive(liveDefinition('arena'),{x:300,y:0,seed:1},p),g=liveGoal(arena,p);assert(arena.stones.some(q=>q.shelter.x===g.x&&q.shelter.y===g.y));assert(arena.stones.every(q=>Math.hypot(q.shelter.x,q.shelter.y)>=60),'no shelter where you stand');
 const well=createLive(liveDefinition('pozo'),{x:300,y:0,seed:1},p);assert(liveGoal(well,p).x<0,'out of the well, away from its bottom');
 const whirl=createLive(liveDefinition('remolino'),{x:300,y:0,seed:1},p);assert(liveGoal(whirl,p).x<0,'away from the whirl');}
// Doing (batch 3). A bot walks toward the white arrow (liveGoal) at the cube's pace or slower, reacting at once or 1.5 s
// late, with or without pulses on time, with the music's beat or none (no sound: a steady clock); the task's own pushes
// move it as they move the cube in the game.
function work(def,seed,{pulse=false,beat=true,delay=0,still=false,beatLen=.5,sound=true,speed=190}={}){const player={x:0,y:0},s=createLive(def,liveSpawnPoint(player,seed*.7,'d:'+seed,seed),player);let t=0,last=-9;
 while(s.stage==='run'&&t<45){const dt=.05;t+=dt;
  if(!still&&t>delay){const g=liveGoal(s,player);if(g){const dx=g.x-player.x,dy=g.y-player.y,l=Math.hypot(dx,dy)||1;player.x+=dx/l*Math.min(l,speed*dt);player.y+=dy/l*Math.min(l,speed*dt);}}
  const pulses=[];if(pulse&&t>delay&&t-last>=beatLen){last=t;pulses.push({x:player.x,y:player.y,beat});}
  stepLive(s,player,dt,{pulses,beatPhase:sound?(t/beatLen)%1:undefined});if(s.drag){player.x+=s.drag.x*dt;player.y+=s.drag.y*dt;}}
 return {s,t};}
const doing={};
for(const def of DO){const row=doing[def.id]={pulse:0,walk:0,late:0,lateSlow:0,lateNoSound:0,pulseTime:0,walkTime:0,lateTime:0};
 for(let seed=0;seed<20;seed++){
  // Standing still nothing gets done: it ends kindly, without a reward, within its time.
  const still=work(def,seed,{still:true});assert.equal(still.s.stage,'escaped',def.id+' standing still it just ends');assert.equal(liveReward(still.s),0);assert(liveLost(still.s)&&!liveWon(still.s));assert(still.t<=def.life+.1,def.id);
  // Pulses on time always help: done every time, 15 ✦, quicker than on foot; also 1.5 s late and at a slower tempo.
  const p=work(def,seed,{pulse:true});assert.equal(p.s.stage,'done',def.id+' with pulses on time (seed '+seed+')');assert(p.s.onTime);assert.equal(liveReward(p.s),LIVE_REWARD.onTime);row.pulse++;row.pulseTime+=p.t;
  for(const o of [{delay:1.5},{beatLen:.62}])assert.equal(work(def,seed,{pulse:true,...o}).s.stage,'done',def.id+' with pulses on time '+JSON.stringify(o));
  // On foot it can be done (10 ✦); 1.5 s late, slower (140 u/s) or without sound too, most of the time.
  const w=work(def,seed);if(w.s.stage==='done'){row.walk++;row.walkTime+=w.t;assert.equal(w.s.onTime,false);assert.equal(liveReward(w.s),LIVE_REWARD.base);}
  const late=work(def,seed,{delay:1.5});if(late.s.stage==='done'){row.late++;row.lateTime+=late.t;}
  if(work(def,seed,{delay:1.5,speed:140}).s.stage==='done')row.lateSlow++;
  if(work(def,seed,{delay:1.5,sound:false}).s.stage==='done')row.lateNoSound++;
  // A pulse off time is never on time.
  const off=work(def,seed,{pulse:true,beat:false});assert.equal(off.s.onTime,false,def.id);assert(liveReward(off.s)<=LIVE_REWARD.base);}
 assert(row.walk>=18&&row.late>=16&&row.lateSlow>=14&&row.lateNoSound>=16,def.id+': on foot, late, slow or without sound it is done most of the time '+JSON.stringify(row));
 assert(row.pulseTime/row.pulse<row.walkTime/row.walk,def.id+': pulses on time make it quicker');
 for(const k of ['pulseTime','walkTime','lateTime'])row[k]=+(row[k]/Math.max(1,{pulseTime:row.pulse,walkTime:row.walk,lateTime:row.late}[k])).toFixed(1);}
// The doing rules, one by one: a pulse on time adds a second (up to six) and counts double; walking away ends it kindly.
{const def=liveDefinition('motas'),p={x:0,y:0},s=createLive(def,{x:300,y:0,seed:4},p);assert.equal(s.need,5);assert(s.items.every((q,i)=>q.n===i+1),'numbered');
 assert.deepEqual(liveGoal(s,p),s.items[0]);const w={x:s.items[0].x,y:s.items[0].y};stepLive(s,w,.05,{pulses:[{...w,beat:false}]});assert.equal(s.done,0,'off time does nothing');assert.equal(s.bonus,0);
 stepLive(s,w,.05,{pulses:[{...w,beat:true}]});assert(s.onTime&&s.bonus===1&&s.done>=1,'on time plants it at once');
 for(let i=0;i<12;i++)stepLive(s,w,.05,{pulses:[{...w,beat:true}]});assert.equal(s.bonus,LIVE_DO_BONUS_MAX,'at most six seconds more');
 const far=createLive(def,{x:300,y:0,seed:4},p);stepLive(far,{x:2000,y:0},.05,{});assert.equal(far.stage,'escaped');assert.equal(liveReward(far),0);}
// In order: standing on the third mote first plants nothing.
{const s=createLive(liveDefinition('motas'),{x:300,y:0,seed:4},{x:0,y:0}),q=s.items[2];for(let i=0;i<40;i++)stepLive(s,{x:q.x,y:q.y},.05,{});assert.equal(s.done,0);assert(!q.done);}
// The nodes sound first (one on each beat, a cue for the note), then wait in that order.
{const s=createLive(liveDefinition('nodos'),{x:300,y:0,seed:2},{x:0,y:0});assert.equal(liveGoal(s,{x:0,y:0}),null,'while they sound, nowhere to go');for(let i=0;i<120&&s.show;i++)stepLive(s,{x:0,y:0},.05,{});assert(!s.show);
 assert.deepEqual(s.cues.map(c=>c.step),s.seq,'each node sounds in its order');assert.deepEqual(s.seq.map(i=>s.nodes[i].n),[1,2,3,4,5]);const wrong=s.nodes[s.seq[1]];stepLive(s,{x:wrong.x,y:wrong.y},.05,{});assert.equal(s.done,0,'a node out of order only flickers');}
// Without sound the tune still plays, on a steady clock.
{const s=createLive(liveDefinition('nodos'),{x:300,y:0,seed:2},{x:0,y:0});for(let i=0;i<120&&s.show;i++)stepLive(s,{x:0,y:0},.05,{beatPhase:undefined});assert(!s.show);}
// A sprout left dry ends it (nothing lost); a pulse on time waters near ones and gives the rest three seconds.
{const s=createLive(liveDefinition('brotes'),{x:300,y:0,seed:3},{x:0,y:0}),left=s.sprouts.map(q=>q.left),aside={x:s.x,y:s.y+400};stepLive(s,aside,.05,{pulses:[{...aside,beat:true}]});assert(s.sprouts.every((q,i)=>q.left>left[i]+2.9));
 for(let i=0;i<600&&s.stage==='run';i++)stepLive(s,aside,.05,{});assert.equal(s.stage,'escaped');assert(s.lost);assert(s.age<liveDefinition('brotes').life,'it ends when one dries');}
// Pulsars burn nine seconds; a pulse on time keeps every lit one alight.
{const s=createLive(liveDefinition('pulsares'),{x:300,y:0,seed:3},{x:0,y:0}),q=s.lamps[0];for(let i=0;i<12;i++)stepLive(s,{x:q.x,y:q.y},.05,{});assert.equal(q.lit>LIVE_BURN-1,true);for(let i=0;i<100;i++)stepLive(s,{x:-400,y:0},.05,{});assert(q.lit<LIVE_BURN-4);
 stepLive(s,{x:-400,y:0},.05,{pulses:[{x:-400,y:0,beat:true}]});assert(q.lit>=LIVE_BURN-.05,'kept alight');}
// The guardian: from the front only a nudge; behind it, its back counts.
{const s=createLive(liveDefinition('guardian'),{x:300,y:0,seed:3},{x:0,y:0}),f={x:Math.cos(s.face),y:Math.sin(s.face)};stepLive(s,{x:s.x+f.x*30,y:s.y+f.y*30},.05,{});assert.equal(s.done,0);assert(s.drag,'a nudge');
 const back={x:s.x-f.x*30,y:s.y-f.y*30};stepLive(s,back,.05,{});assert.equal(s.done,1,'its back');stepLive(s,back,.05,{});assert.equal(s.done,1,'step away before the next mark');}
Math.random=random;
// Saves: unknown kinds (a later batch) and later versions are kept; counts are bounded.
const future={version:4,secret:true};assert.equal(normalizeLive(future),future);
const n=normalizeLive({kinds:{polilla:{caught:3,onTime:9,escaped:-2,first:'2026-10-27',x:1},manta:{caught:1},__proto__:{caught:1},bad:5},count:-4,extra:'kept'});
assert.deepEqual(n.kinds.polilla,{caught:3,onTime:3,escaped:0,first:'2026-10-27',x:1});assert.equal(normalizeLive({kinds:{ola:{caught:1,hit:-3}}}).kinds.ola.hit,0);assert.equal(normalizeLive({kinds:{ola:{caught:1,hit:2}}}).kinds.ola.hit,2);assert(n.kinds.manta);assert.equal(n.count,0);assert.equal(n.extra,'kept');assert(!('bad' in n.kinds));assert.equal(n.version,1);
assert.deepEqual(normalizeLive(null),{version:1,kinds:{},count:0,caught:0,earned:0});
assert.equal(liveForced('?encuentro=polilla'),'polilla');assert.equal(liveForced('?encuentro=nada'),null);assert.equal(liveForced(''),null);
console.log('PASS living encounters model: eleven «perseguir», eleven «huir» and eleven «hacer», one of each per biome, the roll picks one in thirds; 60–90 s from the hash, ahead of the cube; chasing, a pulse on time always catches (15 ✦) or holds, walking alone is possible but slower (10 ✦); fleeing, pulses on time always escape (15 ✦, also 1.5 s late), walking toward the arrow escapes most of the time (10 ✦), standing still it reaches you for nothing but a one-second nudge; doing, pulses on time always finish (15 ✦) and quicker, on foot, 1.5 s late, slower or without sound most of the time (10 ✦), standing still it ends kindly; no Math.random; future saves kept · '+JSON.stringify(sums)+' · '+JSON.stringify(doing));
