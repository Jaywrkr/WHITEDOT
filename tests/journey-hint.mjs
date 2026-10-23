import assert from 'node:assert/strict';
import {hintPose,HINT_IDLE,HINT_DRAG,HINT_CYCLE,initialize} from '../src/journey-hint.js';
import {houseQuiet} from '../src/house-audio.js';
import {pathWaveCounts} from '../src/crystal-sparks.js';
// The ghost finger (decision 7A): it drags to the right, then stays and taps; its cycle repeats.
const a=hintPose(0,390,844),b=hintPose(HINT_DRAG-1,390,844),c=hintPose(HINT_DRAG+200,390,844);
assert(a.drag&&b.drag&&!c.drag);assert(b.x>a.x+80,'it drags');assert.equal(c.x,hintPose(HINT_CYCLE-1,390,844).x,'and taps in place');assert.deepEqual(hintPose(HINT_CYCLE+10,390,844),hintPose(10,390,844));
// Runtime: it shows after four seconds without input in the Journey, and goes away with the first touch.
let clock=0;const realNow=performance.now.bind(performance);performance.now=()=>clock;const listeners={};
globalThis.addEventListener=(k,f)=>{listeners[k]=f;};globalThis.document={hidden:false,querySelector:()=>null,querySelectorAll:()=>[]};
const r={S:{mode:'camino'},journeyQuiet:()=>true,inWorld:()=>false};initialize(r);const draws=[];const ctx=new Proxy({},{get:(o,k)=>k in o?o[k]:()=>draws.push(k),set:(o,k,v)=>{o[k]=v;return true;}});
r.drawJourneyHint(ctx,390,844);assert.equal(r.journeyHint().showing,false);assert.equal(draws.length,0);
clock=HINT_IDLE+10;assert.equal(r.journeyHint().showing,true);r.drawJourneyHint(ctx,390,844);assert(draws.includes('arc'),'a finger is drawn');
listeners.pointerdown();assert.equal(r.journeyHint().showing,false,'a touch hides it');
clock+=HINT_IDLE*2;r.ptr={x:1,y:1};assert.equal(r.journeyHint().showing,false,'never while a finger walks');r.ptr=null;assert.equal(r.journeyHint().showing,true);listeners.touchmove();assert.equal(r.journeyHint().showing,false,'moving counts as playing');
r.journeyPulseState=()=>({hits:3});clock+=HINT_IDLE*2;assert.equal(r.journeyHint().showing,false,'once you play on time it waits longer');clock+=20000;assert.equal(r.journeyHint().showing,true);r.journeyPulseState=undefined;listeners.pointerdown();assert(['touchstart','touchmove','pointermove','keydown'].every(k=>listeners[k]));
clock+=HINT_IDLE*2;r.journeyQuiet=()=>false;assert.equal(r.journeyHint().showing,false,'never in the free World');
r.journeyQuiet=()=>true;r.journeyFinaleState=()=>({running:true});assert.equal(r.journeyHint().showing,false,'never in the finale');
performance.now=realNow;
// The Refugio's objects keep quiet while the finale plays.
assert.equal(houseQuiet({journeyFinaleState:()=>({running:true})}),true);assert.equal(houseQuiet({journeyFinaleState:()=>({running:false})}),false);
// The Journey's Camino: only a pulse on time breaks a crystal, one per pulse; the free Camino breaks what the wave crosses.
assert.equal(pathWaveCounts({beat:false},true),false);assert.equal(pathWaveCounts({beat:true},true),true);assert.equal(pathWaveCounts({beat:true,spent:true},true),false);assert.equal(pathWaveCounts({beat:false,spent:true},false),true);assert.equal(pathWaveCounts({beat:false},true,false),true,'without music any pulse breaks one');assert.equal(pathWaveCounts({beat:false,spent:true},true,false),false);
console.log('PASS journey hint: a ghost finger drags and taps after four quiet seconds in the Journey and leaves at the first touch; the Refugio is quiet in the finale; the Camino breaks one crystal per pulse on time');
