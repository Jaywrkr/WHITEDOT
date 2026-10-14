import {musicRecipe} from './living-catalog.js';
import {musicalCharacter,GENRE_CHARACTERS} from './musical-character.js';
// Slow, phrase-aligned change; preserves each genre's native notes and drum grammar.
export function productionFrame(region,arrangement,seedOf,rng,context={}){
 const score=musicRecipe(region,seedOf,rng),bar=arrangement.harmonyBar||0,chapter=Math.floor(bar/32),random=rng(seedOf(`living:production:v1:${region.key}:${chapter}`));
 const stage=chapter%4,rest=stage===3||context.silence,soft=musicalCharacter(region.genre).level;
 const grammar={...arrangement.grammar,hookLevel:(arrangement.grammar.hookLevel||1)*(rest?.65:.85+random()*.1),bassLevel:(arrangement.grammar.bassLevel||1)*(rest?.8:.9),
  brightness:Math.min(arrangement.grammar.brightness||9000,score.signature==='calida'?6500:score.signature==='textural'?7200:8700)};
 // Long harmonic chapters grow from the regional palette without dissonant random chords.
 if(chapter>1&&['warm','organic','melodic','disco'].includes(context.character))grammar.progression=score.progression;
 const hook=arrangement.hook.map((n,i)=>rest&&i%8!==0?-1:n),out={...arrangement,grammar,hook,
  energy:Math.min(arrangement.energy,rest?.28:.65),production:{chapter,stage,signature:score.signature,score,soft},expression:{...arrangement.expression,toneScale:(arrangement.expression?.toneScale||1)*(rest?.8:1)}};
 const pool=context.genre?.bassP||[context.genre?.bassI];if(pool[0])out.bassI=pool[(score.palette+chapter)%pool.length];
 return out;
}
export function initialize(runtime){
 function compose(region,arrangement){
  const close=runtime.livingNear?.(110)||[],silence=close.some(o=>['moss','cathedral'].includes(o.kind)&&o.dwell>3);
  return productionFrame(region,arrangement,runtime.seedOf,runtime.rng,{genre:runtime.GEN[region.genre],silence,character:GENRE_CHARACTERS[region.genre]});
 }
 Object.defineProperty(runtime,'composeLivingArrangement',{get:()=>compose});
}
