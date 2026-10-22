// The World's ambience (region air, rain, wind, night insects) is a background for the music, never a sound on its
// own. Every bed goes through one shared gain that sits under the music (AMBIENCE_LEVEL) and breathes with the beat:
// it dips on each beat and comes back before the next one, so the ambience moves in time instead of hissing flat.
// Pitched beds (narrow bands, insects) are moved to the nearest note of the key that is playing.
export const AMBIENCE_LEVEL=.5;   // about −6 dB on top of each bed's own level
export const BREATH=.45;          // how deep the dip on the beat is
// Gain factor for a point of the beat, 0 on the beat and 1 just before the next one.
export function breath(phase){const p=((phase%1)+1)%1;return 1-BREATH+BREATH*Math.min(1,p*2.5);}
// The nearest frequency to `hz` that is a note of the scale (semitones from A, plus the transposition).
export function inKey(hz,scale,tr=0){if(!(hz>0)||!Array.isArray(scale)||!scale.length)return hz;const m=Math.round(69+12*Math.log2(hz/440));
 for(let d=0;d<=6;d++)for(const n of [m-d,m+d])if(scale.includes((((n-57-tr)%12)+12)%12))return 440*2**((n-69)/12);return hz;}
export function initialize(runtime){
 let bus=null,owner=null;
 function key(){const MU=runtime.MU||{},scale=MU.dnaA?.scale||runtime.BIOMES?.[MU.biome||0]?.scale;return {scale,tr:MU.tr||0};}
 function phase(){const ac=runtime.ac,bq=runtime.MU?.bq;if(!ac||!bq?.length)return .5;const beat=(runtime.SIX||.15)*4;return (ac.currentTime-bq[bq.length-1])/beat;}
 // The shared gain, made on first use and rebuilt if the audio context changes.
 function out(){const ac=runtime.ac;if(!ac||!runtime.bus)return runtime.bus;if(!bus||owner!==ac){bus=ac.createGain();bus.gain.value=AMBIENCE_LEVEL;bus.connect(runtime.bus);owner=ac;}return bus;}
 // Called every frame: follow the beat.
 function tick(){const ac=runtime.ac;if(!ac||!bus||owner!==ac)return;bus.gain.setTargetAtTime(AMBIENCE_LEVEL*breath(phase()),ac.currentTime,.03);}
 Object.defineProperties(runtime,{ambienceBus:{get:()=>out()},ambienceTick:{get:()=>tick},ambienceInKey:{get:()=>hz=>{const {scale,tr}=key();return inKey(hz,scale,tr);}}});
}
