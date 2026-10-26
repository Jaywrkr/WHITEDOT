import assert from 'node:assert/strict';
import {RHYTHMS,PLACE_RHYTHMS,JOURNEY_RHYTHMS,rhythmTarget,rhythmFor,onBeat,onAnd} from '../src/journey-rhythm.js';
// Jay's table (23 October): every place has its own rhythm; in the Journey only the Tormenta and the Vacío change.
assert.deepEqual({...PLACE_RHYTHMS},{llanura:'tiempo',lago:'contra',bosque:'tiempo',tormenta:'mezcla',vacio:'uno',jardin:'siembra',dunas:'contra',cristales:'acorde',faros:'faro',ruinas:'ruina',cueva:'eco'});
assert.deepEqual({...JOURNEY_RHYTHMS},{llanura:'tiempo',lago:'tiempo',bosque:'tiempo',tormenta:'mezcla',vacio:'uno'});
for(const [k,r] of Object.entries(RHYTHMS)){assert(r.steps.length&&r.steps.every(s=>Number.isInteger(s)&&s>=0&&s<16&&s%2===0),k);assert(r.name,k);}
assert.deepEqual(RHYTHMS.contra.steps,[2,6,10,14],'the «y» halfway between beats');assert.deepEqual(RHYTHMS.mezcla.steps,[0,4,6],'«1 · 2 · y»');assert.deepEqual(RHYTHMS.acorde.steps,[0,2,4],'«1 · y · 2»');
// The Vacío counts on every beat; its game waits for the «1» and draws its own dots.
assert.deepEqual(RHYTHMS.uno.steps,[0]);assert.deepEqual(RHYTHMS.uno.judge,[0,4,8,12]);assert.equal(RHYTHMS.uno.guide,false);
assert.equal(rhythmFor('lago',{place:true}).key,'contra');assert.equal(rhythmFor('lago').key,'tiempo');assert.equal(rhythmFor('refugio',{place:true}),null);
assert(onBeat(0)&&onBeat(12)&&!onBeat(2));assert(onAnd(2)&&onAnd(14)&&!onAnd(4)&&!onAnd(null));
// The nearest moment a rhythm counts, at 120 BPM (a beat .5 s, a sixteenth .125 s); beats at 10, 10.5, 11 are steps 0, 4, 8.
const beats=[10,10.5,11],stepOf=b=>((Math.round((b-10)/.5)*4)%16+16)%16,at=(t,steps)=>rhythmTarget(t,beats,.5,stepOf,steps);
assert.deepEqual(at(10.26,RHYTHMS.contra.steps),{time:10.25,step:2,dist:at(10.26,RHYTHMS.contra.steps).dist});assert(at(10.26,RHYTHMS.contra.steps).dist<.02);
assert(at(10.5,RHYTHMS.contra.steps).dist>.2,'on the beat is not on the «y»');
// «1 · 2 · y»: the 1 and the 2 and the «y» after it; the 3 is not.
assert.equal(at(10,RHYTHMS.mezcla.steps).step,0);assert.equal(at(10.5,RHYTHMS.mezcla.steps).step,4);assert.equal(at(10.75,RHYTHMS.mezcla.steps).step,6);assert(at(11,RHYTHMS.mezcla.steps).dist>.2);
// Past the last beat scheduled and before the first: the grid goes on (11.5 is step 12, 9.5 is step 12 of the bar before).
assert.equal(at(11.75,RHYTHMS.contra.steps).step,14);assert(at(11.75,RHYTHMS.contra.steps).dist<1e-9);assert.equal(at(9.75,RHYTHMS.contra.steps).step,14);
assert.equal(rhythmTarget(1,[],.5,stepOf,[0]),null);
console.log('PASS journey rhythm: Jay\'s table of rhythms by place and chapter, and the nearest step each counts on the music\'s grid');
// Plan H2: the cube's form follows the run of hits on time (Vibri): +1 every four, -1 for a miss, never all at once.
import {formStep,FORM_EVERY,FORM_MAX} from '../src/journey-pulse.js';
{let f={};for(let i=0;i<FORM_EVERY*FORM_MAX+5;i++)f=formStep(f,true);assert.equal(f.level,FORM_MAX);f=formStep(f,false);assert.equal(f.level,FORM_MAX-1,'a miss takes one form away');f=formStep(f,false);f=formStep(f,false);f=formStep(f,false);assert.equal(f.level,0);
 for(let i=0;i<FORM_EVERY-1;i++)f=formStep(f,true);assert.equal(f.level,0);f=formStep(f,true);assert.equal(f.level,1);}
// The place sings its pattern for two bars before asking for it.
import {SING_BARS} from '../src/journey-rhythm.js';
{const {initialize}=await import('../src/journey-rhythm.js');const hits=[];const r={S:{sound:true},SIX:.125,placeRun:()=>({id:'lago',startedAt:1}),journeyGamePlaying:()=>true,journeyChapter:()=>null,hatHit:(t,v)=>hits.push(t),pluck:()=>{},chordTones:()=>[60,64,67]};initialize(r);
 r.drawRhythmGuide();for(let k=-3;k<SING_BARS*16+8;k++)r.rhythmMusicStep(((k%16)+16)%16,10+k*.125);assert.equal(hits.length,4*SING_BARS,'the «y» of each beat, two bars');assert(Math.abs(hits[0]-(10+2*.125))<1e-9,'from the next «1»');}
console.log('PASS journey rhythm (H2): the cube gains a form every four hits and loses one per miss; a place sings its pattern for two bars from the next «1»');

// Lookahead plus output latency keeps current cues and the audible tail visible.
{const {initialize}=await import('../src/journey-rhythm.js');let id='jardin';const played=[],r={S:{sound:true},SIX:.125,ac:{currentTime:10.4,outputLatency:.4},placeRun:()=>({id,startedAt:1}),journeyGamePlaying:()=>true,hatHit:t=>played.push(t),pluck:()=>{}};initialize(r);r.drawRhythmGuide();
 for(let k=0;k<=6;k++)r.rhythmMusicStep(k,10+k*.125);
 assert.equal(r.rhythmSinging().step,0,'future cues cannot replace the currently audible first beat');
 r.ac.currentTime=10.65;assert.equal(r.rhythmSinging().step,2);
 for(let k=7;k<=32;k++)r.rhythmMusicStep(k%16,10+k*.125);
 r.ac.currentTime=14.15;assert.equal(r.rhythmSinging().step,30%16,'last sung note survives scheduling the end');
 r.ac.currentTime=14.4;assert.equal(r.rhythmSinging(),null,'audible tail ends normally');
 assert.equal(played.length,16,'the same two bars sound exactly once');id='lago';assert.equal(r.rhythmSinging(),null,'another round never inherits stale light');
}
