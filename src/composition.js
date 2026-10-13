// Playback-only phrasing: world DNA and saved coordinates stay unchanged.
import {GENRE_CHARACTERS} from './musical-character.js';
const SHAPES={
 floor:{attack:.7,decay:.65,tone:.8,answer:.72,chords:false},
 bass:{attack:.65,decay:.75,tone:.85,answer:.78,chords:false},
 warm:{attack:1.2,decay:1.1,tone:.9,answer:.82,chords:true},
 organic:{attack:.9,decay:.85,tone:.85,answer:.75,chords:false},
 melodic:{attack:1.1,decay:1.15,tone:.95,answer:.85,chords:true},
 disco:{attack:.7,decay:.7,tone:1,answer:.85,chords:true},
 calm:{attack:1.8,decay:1.2,tone:.75,answer:.65,chords:false},
 machine:{attack:.6,decay:.6,tone:.9,answer:.7,chords:false},
 broken:{attack:.7,decay:.65,tone:.85,answer:.65,chords:false},
};
for(const shape of Object.values(SHAPES))Object.freeze(shape);
const STAGES=['statement','answer','development','release'];
export function compositionFrame(genre,phrase,section){
 const shape=SHAPES[GENRE_CHARACTERS[genre]||'warm'];
 const cycle=Math.floor(Math.max(0,phrase)/2)%4;
 return Object.freeze({stage:STAGES[cycle],cycle,shape,
  level:[.88,.78,1,.7][cycle],
  attackScale:shape.attack*(cycle===3?1.25:1),
  decayScale:shape.decay*(cycle===1?.75:cycle===3?1.15:1),
  toneScale:shape.tone*(cycle===3?.8:1),
  harmony:shape.chords&&cycle===2&&section===2});
}
export function phraseAccent(frame,step){
 // Deliberate object gestures bypass this policy; only the automatic motif breathes.
 return (step%4===0?1:frame.shape.answer)*(step>=8&&frame.cycle===1?.8:1)*frame.level;
}
