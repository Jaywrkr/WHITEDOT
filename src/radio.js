import {createGrammar,shapeMotif} from './grammar.js';
import {PALETTE_STEPS} from './palettes.js';
// Composición por frases: el reloj musical avanza sin necesitar movimiento.
// No modifica el ADN de la región ni guarda estado en la partida.
export function createRadio(seedOf, rng, genres) {
  let regionKey = null, phrase = -1, nextPhrase = 0, nextSection = 0;
  let section = 0, energy = .25, arrangement = null,grammar,startBar=0;
  const levels = [.24, .43, .62, .3];

  function advance(region, bar, environment = {}) {
    if (region.key !== regionKey) {
      regionKey = region.key;
      startBar=bar;
      phrase = -1;
      nextPhrase = nextSection = bar;
      section = 0;
      energy = region.genre === 'ambient' ? .16 : .25;
      arrangement = null;
      grammar=createGrammar(region,seedOf,rng);
    }
    if (bar >= nextPhrase) {
      phrase++;
      const random = rng(seedOf(`radio:${region.key}:${phrase}`));
      if (bar >= nextSection) {
        // Cada sección lleva a otra; no se vuelve a una grabación en bucle.
        section = (section + 1 + Math.floor(random() * 3)) % levels.length;
        nextSection = bar + 12 + Math.floor(random() * 4) * 4;
      }
      const sparse = section === 0;
      const bass = region.track.bass.map((degree, step) => {
        if (region.genre === 'rominimal') degree = step % 2 ? (step % 8 === 7 ? 4 : 0) : -1;
        if (region.genre === 'dubstep') degree = [0,3,4,10,14].includes(step) ? [0,0,4,7][Math.floor(random()*4)] : -1;
        if (region.genre === 'dnb') degree = [0,2,6,8,10,14].includes(step) ? [0,4,7][Math.floor(random()*3)] : -1;
        if (region.genre === 'progressive') degree = step%2===0 ? (step%8===6?4:0) : -1;
        if (region.genre === 'acid') degree = [1,0,1,1,0,1,0,2,1,0,1,0,2,1,0,1][step] ? (step === 7 || step === 12 ? 7 : 0) : -1;
        if(PALETTE_STEPS[region.genre]){
          const steps={tropical:[0,3,6,10,14],melodic:[0,6,8,14],robotic:[0,3,8,11,14],nudisco:[0,3,6,8,10,14]}[region.genre];
          degree=steps.includes(step)?(region.genre==='robotic'?0:[0,0,4,2][step%4]):-1;
        }
        if (degree < 0 || (step !== 0 && random() < (sparse ? .45 : .12))) return -1;
        return step === 0 ? 0 : Math.max(0, Math.min(9, degree));
      });
      // Keep a recognisable motif for four phrases; vary space and accents first.
      const motifRandom=rng(seedOf(`radio-motif:v1:${region.key}:${Math.floor(phrase/4)}`));
      const budget=sparse?2:grammar.hookLimit;
      const recipe=PALETTE_STEPS[region.genre]?Array.from({length:16},(_,i)=>PALETTE_STEPS[region.genre].includes(i)?0:-1):region.track.hook;
      const candidates=shapeMotif(recipe,grammar).map((degree,step)=>({degree,step})).filter(n=>n.degree>=0);
      const anchor=candidates.find(n=>n.step%4===0)?.step??0;
      const positions=[anchor,...candidates.filter(n=>n.step!==anchor).map(n=>n.step)];
      for(let i=positions.length-1;i>1;i--){const j=1+Math.floor(motifRandom()*i);[positions[i],positions[j]]=[positions[j],positions[i]];}
      const motif=Array(16).fill(-1),tones=[0,2,4];
      positions.slice(0,grammar.hookLimit).forEach((step,i)=>{motif[step]=i===0?0:tones[Math.floor(motifRandom()*tones.length)];});
      const hook=motif.map((degree,step)=>degree<0||step!==anchor&&(random()<.25)?-1:degree);
      let notes=1;hook.forEach((degree,step)=>{if(step!==anchor&&degree>=0&&++notes>budget)hook[step]=-1;});
      hook[anchor]=motif[anchor];
      if(arrangement&&hook.every((n,i)=>n===arrangement.hook[i])){
        const active=hook.findIndex((n,i)=>i!==anchor&&n>=0);
        if(active>=0)hook[active]=-1;
        else {const alternative=motif.findIndex((n,i)=>i!==anchor&&n>=0);if(alternative>=0)hook[alternative]=motif[alternative];}
      }
      // Identity changes with the section, rather than swapping instruments every phrase.
      const toneRandom=rng(seedOf(`radio-tone:v1:${region.key}:${section}`));
      const pool = genres[region.genre].hookP;
      arrangement = { phrase, section, grammar, bass, hook, hookI: pool[Math.floor(toneRandom() * pool.length)] };
      nextPhrase = bar + grammar.phraseBars + (random()<.25?2:0);
    }
    const life = Math.min(.08, (environment.near || 0) * .002 + (environment.singers || 0) * .015);
    const event = environment.event === 'eclipse' ? -.06 : environment.event ? .05 : 0;
    const density = environment.variant === 0 ? -.05 : environment.variant === 4 ? .04 : 0;
    const limit = environment.quiet ? .24 : region.genre === 'ambient' ? .3 : .7;
    const target = Math.max(.14, Math.min(limit, levels[section] + life + event + density));
    energy += (target - energy) * .25;
    return { ...arrangement, harmonyBar:bar-startBar, energy, genre: region.genre };
  }
  return { advance };
}
