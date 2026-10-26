import assert from 'node:assert/strict';
import {hintPose,hintBeatAt,hintBeat,heardStep,HINT_DX,HINT_DY,HINT_RING,HINT_DRAG,HINT_CYCLE} from '../src/journey-hint.js';
import {cubeRing,approach,LINE_ALPHA,LINE_BACK} from '../src/journey-pulse.js';
import {initialize as rhythm} from '../src/journey-rhythm.js';
import {barTarget,forgetBarTarget,drawBarDrop,barDropState} from '../src/journey-games.js';
import {CHAPTER_MARK} from '../src/journey-chapters.js';
// Panel 10, P3: the beat beside the cube.

// 1. The ghost finger is born beside the cube, no bigger than its 14×14 box, its centre under 30 px from it.
for(const [W,H] of [[390,844],[844,390],[1280,800]]){const rest=hintPose(HINT_DRAG+900,W,H);assert(!rest.drag);
 assert(Math.hypot(rest.x-W/2,rest.y-H/2)<=30,'the finger taps beside the cube');assert((HINT_RING+.5)*2<=14,'its ring fits the cube box');
 assert.equal(hintPose(0,W,H).x,W/2+HINT_DX,'the drag starts at the cube');assert.equal(rest.y,H/2+HINT_DY);}
assert.equal(hintPose(HINT_CYCLE-1,390,844).x,hintPose(HINT_DRAG+10,390,844).x,'and taps in place');

// 2. It taps the place's steps, in audible time. A fake round in each place with the steps the music scheduled.
function place(id,latency=0){const r={S:{sound:true},SIX:.125,MU:{sq:[]},ac:{currentTime:0,outputLatency:latency},placeRun:()=>({id,startedAt:1}),journeyGamePlaying:()=>true,journeyChapter:()=>null};
 for(let k=0;k<64;k++)r.MU.sq.push({t:k*.125,s:k%16,tick:k});rhythm(r);return r;}
const peaks=r=>{const out=new Set();for(let k=0;k<32;k++){r.ac.currentTime=k*.125+.001+(r.ac.outputLatency||0);if(hintBeat(r)>.9)out.add(k%16);}return [...out].sort((a,b)=>a-b);};
assert.deepEqual(peaks(place('dunas')),[2,6,10,14],'Dunas: the finger taps on the «y»');
assert(peaks(place('dunas')).every(s=>s%4),'and on no step that is a multiple of four');
assert.deepEqual(peaks(place('lago')),[2,6,10,14],'Lago as a place: the «y» too');
assert.deepEqual(peaks(place('faros')),[0,8,10],'Faros: 1 · 3 · y');
assert.deepEqual(peaks(place('llanura')),[0,4,8,12],'a place on the beat keeps the beat');
// Off a counted step the finger is quiet.
const dunas=place('dunas');dunas.ac.currentTime=4*.125+.001;assert.equal(hintBeat(dunas),0,'nothing on the beat in Dunas');
// With 200 ms of output latency the peak falls 200 ms later on the audio clock.
const late=place('dunas',.2),early=place('dunas',0),at=t=>{late.ac.currentTime=t;return hintBeat(late);},at0=t=>{early.ac.currentTime=t;return hintBeat(early);};
const step2=2*.125+.001;assert(at0(step2)>.9);assert(at(step2)<.1,'not yet heard');assert(at(step2+.2)>.9,'the peak lands 200 ms later');
assert.equal(heardStep({ac:{currentTime:1}}),null,'no music, no step');assert.equal(hintBeatAt(null,[0]),0);

// 3. The ring around the cube closes over the four steps before each counted step, smallest on the step itself (as
// the Line's mark), gold on the «1», and never changes the cube's size.
const s=10,steps=[2,6,10,14];let prev=Infinity;
for(const now of [14.01,15,15.5,16-.01]){const ring=cubeRing(now%16,[0,4,8,12],s);assert(ring.r<=prev,'it closes');prev=ring.r;}
assert.equal(cubeRing(0,[0,4,8,12],s).r,s/2+5,'smallest on the step');assert.equal(cubeRing(0,[0,4,8,12],s).gold,true,'gold on the «1»');
assert.equal(cubeRing(2,steps,s).gold,false,'white on the «y»');assert.equal(cubeRing(2,steps,s).r,s/2+5);
for(let k=0;k<64;k++){const now=k/4,ring=cubeRing(now,steps,s),a=Math.max(...steps.map(st=>approach(st,now)));assert.equal(!!ring,a>0);if(ring)assert.equal(ring.come,a,'same anticipation as the Line');}
assert.equal(cubeRing(0,[0],s,true).r,cubeRing(14,[0],s,true).r,'with calm motion it does not move');assert(cubeRing(0,[0],s,true).alpha>cubeRing(14,[0],s,true).alpha,'it only brightens');
assert(cubeRing(0,[0],s).r>s/2,'the ring never touches the cube');assert.equal(cubeRing(null,[0],s),null);

// 4. The Line reads over a landscape: base ≥ (90,90,90) over its black band.
assert(Math.round(255*LINE_ALPHA)>=90&&LINE_BACK>=.5);
assert.equal(CHAPTER_MARK,4,'chapter marks of 4 px');

// 5. The gold drops fly to where the bar is, and the last frame lands on it.
forgetBarTarget();const doc={getElementById:id=>id==='bar'?{getBoundingClientRect:()=>({left:16,right:374,top:66,height:2,width:358})}:null};
const t=barTarget(390,doc);assert.deepEqual(t,{left:16,right:374,y:67});
const ctx={fillRect(){}};let last=null;for(let k=0;k<1;k+=1/27){const e=1-(1-k)*(1-k);drawBarDrop(ctx,195,422,200,t.y,e,4,1,'#f0d27a');last=barDropState();}
assert(Math.hypot(last.x-200,last.y-t.y)<=4,'the last frame of the flight lands on the bar');
forgetBarTarget();const hidden={getElementById:()=>({getBoundingClientRect:()=>({left:0,right:0,top:0,height:0,width:0})})};assert.equal(barTarget(844,hidden).y,67,'hidden bar: its place in the CSS');
console.log('PASS beat by the cube: the ghost finger is small and taps the place\'s steps when heard (Dunas, Lago, Faros); a ring closes on the cube with the Line; the Line reads; drops land on the bar');
