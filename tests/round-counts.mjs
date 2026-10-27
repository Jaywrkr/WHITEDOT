import assert from 'node:assert/strict';
import {initialize as places} from '../src/places.js';
import {initialize as games} from '../src/journey-games.js';
import {initialize as echo,echoPattern} from '../src/journey-echo.js';
import {initialize as rhythm,SING_BARS} from '../src/journey-rhythm.js';
import {setLatencyNudge} from '../src/journey-pulse.js';
import {PLACE_IDS} from '../src/places.js';
// Panel 11 (Q2, Matsuura and Mizuguchi): what a round counts. The Cueva counts the echo, not the eighth; it judges on
// the one clock with the calibration; and pulses while a place sings its pattern are not counted.
globalThis.setTimeout=()=>0;
const SIX=.125,BAR=SIX*16;
function world(){const r={S:{wx:0,wy:0,sound:true,layer:'superficie',sparks:0,todayKey:'2026-10-26',journey:{finished:true,done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true}},
 lugares:{version:2,stars:Object.fromEntries(PLACE_IDS.map(id=>[id,id==='cueva'?[false,false,false]:[true,false,false]]))}},
 BIOMES:[{id:'llanura'}],biomeOfPos:()=>0,regionOfPos:()=>({}),MU:{},SIX,ac:{currentTime:10,outputLatency:0},save:()=>true,hud(){},$:()=>null,inWorld:()=>true};
 places(r);games(r);return r;}
// The Cueva: a call bar, then an answer bar, driven by the music's sixteenths.
{const r=world();echo(r);assert(r.startPlace('cueva'));assert(r.journeyGamePlaying('cueva'));
 const t0=10;r.echoMusicStep(0,t0);let e=r.journeyEcho();assert.equal(e.phase.kind,'call');const pattern=echoPattern(e.n,e.len),wrong=[2,4,6,8,10,12,14].find(s=>!pattern.includes(s));
 // While the cave calls, a pulse on time waits and the round does not count it; off time it does not count either.
 assert.equal(r.journeyGamePulse(true,{step:0,heard:t0+.05}),'wait');r.journeyGamePulse(false,{heard:t0+.3});assert.deepEqual([r.places().run.hits,r.places().run.total],[0,0],'the call does not count');
 r.echoMusicStep(0,t0+BAR);e=r.journeyEcho();assert.equal(e.phase.kind,'answer');
 // One right step and one wrong one: 50 % in the round, as the game hears them.
 assert.equal(r.journeyGamePulse(true,{step:pattern[0],heard:t0+BAR+.01}),'answer');assert.equal(r.journeyGamePulse(true,{step:wrong,heard:t0+BAR+wrong*SIX}),'wrong');
 let run=r.places().run;assert.deepEqual([run.hits,run.total],[1,2],'a right echo step and a wrong one are 50 %');
 // Off time inside the answer bar is a miss.
 r.journeyGamePulse(false,{heard:t0+BAR+.5});run=r.places().run;assert.deepEqual([run.hits,run.total],[1,3]);
 // One clock: with the calibration at 150 ms a pulse heard at the edge of the answer bar still answers; the old clock
 // (output latency only) put it 150 ms late, outside the bar.
 setLatencyNudge(.15);const end=r.journeyEcho().phase.end;r.ac.currentTime=end+.09+.15;assert.equal(r.journeyGamePulse(true,{step:pattern[0]}),'answer','heard at the edge, with the calibration');
 r.ac.currentTime=end+.2+.15;assert.equal(r.journeyGamePulse(true,{step:pattern[0]}),'wait','beyond the edge it waits');setLatencyNudge(0);
 // With the bar full the catch counts, and closes the round with the share it measured.
 r.S.journey.echo.points=r.journeyEcho().goal;r.journeyComplete=()=>{r.placeFinish('cueva');return true;};const before=r.places().run;assert.deepEqual([before.hits,before.total],[2,4],'the edge answer counted, the late one did not');r.journeyGamePulse(true,{step:0,heard:end+1});
 assert.equal(r.places().run,null,'the catch closes the round');assert.equal(r.places().last.onTime,3/5,'the catch counted as on time');}
// A place that sings its pattern: ten pulses while it sings (from the start of the round to the end of its two bars, as
// heard) leave the round at zero; after it, pulses count.
{const r=world();r.registerJourneyGame('llanura',{pulse:()=>'stick'});rhythm(r);assert(r.startPlace('llanura'));assert.equal(r.journeyRhythmState().rhythm,'tiempo');
 r.ac.currentTime=20;assert(r.rhythmDemo(),'before its first «1» the place is about to sing');
 r.ac.state='suspended';assert(!r.rhythmDemo(),'audio not running: nothing is sung, pulses count as judged');r.ac.state='running';
 for(let i=0;i<4;i++)r.journeyGamePulse(true,{step:0});
 const start=20.1;for(let k=0;k<SING_BARS*16;k++){r.rhythmMusicStep(k%16,start+k*SIX);if(k%5===0){r.ac.currentTime=start+k*SIX;r.journeyGamePulse(k%2===0,{step:k%16});}}
 r.rhythmMusicStep(0,start+SING_BARS*BAR);assert.equal(r.journeyRhythmState().singing,null,'the two bars are sung');
 r.ac.currentTime=start+SING_BARS*BAR-.05;assert(r.rhythmDemo(),'still heard');r.journeyGamePulse(true,{step:0});
 assert.equal(r.places().run.total,0,'ten pulses while it sings: nothing counted');
 r.ac.currentTime=start+SING_BARS*BAR+.05;assert(!r.rhythmDemo());r.journeyGamePulse(true,{step:0});r.journeyGamePulse(false,{});assert.deepEqual([r.places().run.hits,r.places().run.total],[1,2],'after it, pulses count');
 // With the sound off nothing is sung and every pulse counts, as before.
 r.abandonPlace();r.S.sound=false;assert(r.startPlace('llanura'));assert(!r.rhythmDemo());r.journeyGamePulse(true,{step:0,silent:true});assert.equal(r.places().run.total,1);}
console.log('PASS round counts: the Cueva counts the echo (a right step and a wrong one are 50 %, the call adds nothing), judges with the calibration at the edge of the answer bar, and ten pulses while a place sings its two bars leave the round at zero');
