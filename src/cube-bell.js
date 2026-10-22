// The pulse's own voice (heard on phones): a short, clean bell in the scale of the place, high enough for a phone
// speaker. Before, the pulse took the instrument of the place's genre, often a bass or a sawtooth: on a phone almost
// all of it fell below what the speaker plays (under ~300 Hz) and only a rasp or a honk was left. The place still
// answers with its own instruments through the World's objects.
export const CUBE_BELL='cube:bell';
// Range of the bell: A4 to A5, where a phone speaker sounds full.
export const BELL_LOW=69,BELL_HIGH=81;
export function cubeBellVoice(raw){return Object.freeze({...raw,role:'lead',instrument:CUBE_BELL,low:BELL_LOW,high:BELL_HIGH,volume:.9});}
// A sine with its octave that fades fast, through a soft low-pass: no sawtooth, nothing rough.
export function playBell(ac,out,t,midi,vel){
 const hz=440*2**((midi-69)/12),o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(),g2=ac.createGain(),f=ac.createBiquadFilter(),peak=Math.max(.0002,Math.min(.24,vel*2.4));
 o.type='sine';o2.type='sine';o.frequency.setValueAtTime(hz,t);o2.frequency.setValueAtTime(hz*2.01,t);f.type='lowpass';f.frequency.setValueAtTime(4000,t);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+.45);g2.gain.setValueAtTime(.35,t);g2.gain.exponentialRampToValueAtTime(.01,t+.12);
 o.connect(g);o2.connect(g2);g2.connect(g);g.connect(f);f.connect(out);o.start(t);o2.start(t);o.stop(t+.5);o2.stop(t+.5);return hz;}
export function initialize(runtime){
 Object.defineProperties(runtime,{playCubeBell:{get:()=>(midi,t,vel)=>{if(!runtime.ac||!runtime.bus)return false;playBell(runtime.ac,runtime.bus,t,midi,vel);runtime.recordInstrument?.(CUBE_BELL);return true;}}});
}
