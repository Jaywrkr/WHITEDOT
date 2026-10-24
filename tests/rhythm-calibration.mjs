import assert from 'node:assert/strict';
import {CAL_SAMPLES,calibrate,normalizeLatency,initialize} from '../src/rhythm-calibration.js';
import {heardTime,latencyNudge,setLatencyNudge,ON_TIME} from '../src/journey-pulse.js';
// Twelve pulses that agree are a delay; fewer, or scattered ones, are not.
assert.equal(calibrate([.15,.15]).ok,false);
const late=Array.from({length:CAL_SAMPLES},(_,i)=>.15+((i*7)%5-2)*.008);const r=calibrate(late);assert(r.ok);assert(Math.abs(r.median-.15)<.01);
const scattered=Array.from({length:CAL_SAMPLES},(_,i)=>((i*37)%11-5)*.04);assert.equal(calibrate(scattered).ok,false,'a player who plays off time is not calibrated away');
// Saves: junk dropped, clamped.
assert.deepEqual(normalizeLatency({latencyNudge:'x'}),{nudge:0,done:false});assert.deepEqual(normalizeLatency({latencyNudge:2,latencyCal:true}),{nudge:.3,done:true});
// A bot 150 ms late: off time before, on time after its twelve first pulses.
setLatencyNudge(0);const rt={S:{sound:true},save:()=>true,$:()=>null};initialize(rt);
const ac={currentTime:10.15,outputLatency:0},beat=10;assert(Math.abs(heardTime(ac)-beat)>ON_TIME,'off time before');
for(const d of late)rt.calibrationSample(d);assert(rt.calibrationState().done);assert(Math.abs(latencyNudge()-.15)<.01);
assert(Math.abs(heardTime(ac)-beat)<=ON_TIME,'on time after');
// Once measured it stays; Ajustes can measure again.
rt.calibrationSample(.2);assert(Math.abs(latencyNudge()-.15)<.01);
setLatencyNudge(0);
console.log('PASS rhythm calibration: twelve pulses that agree measure the delay (a bot 150 ms late goes from off time to on time), scattered ones do not, kept in the save and clamped');
