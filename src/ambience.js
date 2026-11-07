// The World's ambience (region air, rain, wind, night insects) is a background for the music, never a sound on its
// own. Every bed goes through one shared gain that sits far under the music (AMBIENCE_LEVEL, lower while the music
// plays), then a low-pass (AMBIENCE_CUT), and breathes a little with the beat.
// Pitched beds (narrow bands, insects) are moved to the nearest note of the key that is playing.
// Sonido limpio (Jay, 6 Nov 2026, said many times): wind, rain and storm must never get in the way of the music. The
// shared level drops from .5 to .12 (−12 dB more), a low-pass takes the hiss off every bed, and while the music plays
// the beds dip a further 6 dB. The breath is shallower too: a bed that pumps on the beat is heard as a sound.
export const AMBIENCE_LEVEL=.12;  // about −18 dB on top of each bed's own level
export const AMBIENCE_CUT=2200;   // Hz: the shared low-pass; the hiss of air and rain above it never reaches the mix
export const MUSIC_DUCK=.5;       // under the music, about −6 dB more
export const BREATH=.2;           // how deep the dip on the beat is
// Gain factor for a point of the beat, 0 on the beat and 1 just before the next one.
export function breath(phase){const p=((phase%1)+1)%1;return 1-BREATH+BREATH*Math.min(1,p*2.5);}
// The nearest frequency to `hz` that is a note of the scale (semitones from A, plus the transposition).
export function inKey(hz,scale,tr=0){if(!(hz>0)||!Array.isArray(scale)||!scale.length)return hz;const m=Math.round(69+12*Math.log2(hz/440));
 for(let d=0;d<=6;d++)for(const n of [m-d,m+d])if(scale.includes((((n-57-tr)%12)+12)%12))return 440*2**((n-69)/12);return hz;}
export function initialize(runtime){
 let bus=null,owner=null;
 function key(){const MU=runtime.MU||{},scale=MU.dnaA?.scale||runtime.BIOMES?.[MU.biome||0]?.scale;return {scale,tr:MU.tr||0};}
 function phase(){const ac=runtime.ac,bq=runtime.MU?.bq;if(!ac||!bq?.length)return .5;const beat=(runtime.SIX||.15)*4;return (ac.currentTime-bq[bq.length-1])/beat;}
 // The music plays: the World with sound, a region's radio running (the ambience then dips by MUSIC_DUCK).
 const playing=()=>runtime.S?.sound!==false&&!!runtime.MU?.radio;
 const level=()=>AMBIENCE_LEVEL*(playing()?MUSIC_DUCK:1);
 // The shared gain and its low-pass, made on first use and rebuilt if the audio context changes.
 function out(){const ac=runtime.ac;if(!ac||!runtime.bus)return runtime.bus;if(!bus||owner!==ac){bus=ac.createGain();bus.gain.value=level();
   if(ac.createBiquadFilter){const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=AMBIENCE_CUT;lp.Q.value=.5;bus.connect(lp).connect(runtime.bus);}else bus.connect(runtime.bus);owner=ac;}return bus;}
 // Called every frame: follow the beat.
 function tick(){const ac=runtime.ac;if(!ac||!bus||owner!==ac)return;bus.gain.setTargetAtTime(level()*breath(phase()),ac.currentTime,.03);}
 Object.defineProperties(runtime,{ambienceBus:{get:()=>out()},ambienceTick:{get:()=>tick},ambienceLevel:{get:()=>level},ambienceInKey:{get:()=>hz=>{const {scale,tr}=key();return inKey(hz,scale,tr);}}});
}
