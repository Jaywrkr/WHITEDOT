import {compositionFrame} from './composition.js';
import {musicalCharacter,hookInstruments} from './musical-character.js';
import {REFERENCE_STEPS,REFERENCE_BASS} from './references.js';
import {createGrammar,shapeMotif} from './grammar.js';
import {PALETTE_STEPS} from './palettes.js';
import {RHYTHM_GENRES} from './rhythms.js';
import {musicIdentity,identityGrammar,identityExpression,identityBass} from './musical-recipes.js';
import {hybridIdentity,hybridArrangement} from './musical-hybrids.js';
import {labScore,labArrangement} from './lab-score.js';
import {directedFrame} from './music-direction.js';
// Composición por frases: el reloj musical avanza sin necesitar movimiento.
// No modifica el ADN de la región ni guarda estado en la partida.
export function createRadio(seedOf, rng, genres, {living=()=>false}={}) {
  let transportKey=null,lastBar=-1,regionKey = null, phrase = -1, nextPhrase = 0, nextSection = 0;
  let section = 0, energy = .25, arrangement = null,grammar,identity,startBar=0,lastLiving=null;
  const levels = [.24, .43, .62, .3];

  function advance(region, bar, environment = {}) {
    if(bar<lastBar)regionKey=null;lastBar=bar;
    const alive=!environment.room&&living();
    if (region.key !== regionKey||transportKey!==(environment.room||null)||lastLiving!==alive) {
      lastLiving=alive;
      transportKey=environment.room||null;
      regionKey = region.key;
      startBar=environment.room?0:bar;
      phrase = -1;
      nextPhrase = nextSection = bar;
      section = 0;
      energy = region.genre === 'ambient' ? .16 : .25;
      arrangement = null;
      identity=musicIdentity(region,seedOf,rng,genres);
      grammar=identityGrammar(createGrammar(region,seedOf,rng),identity);
    }
    if (bar >= nextPhrase) {
      phrase=environment.room?Math.floor(bar/grammar.phraseBars):phrase+1;
      const random = rng(seedOf(`radio:${region.key}:${phrase}`));
      if(environment.room){section=Math.floor(bar/32)%levels.length;nextSection=(Math.floor(bar/32)+1)*32;}
      else if (bar >= nextSection) {
        // Cada sección lleva a otra; no se vuelve a una grabación en bucle.
        const opening=hybridIdentity(region,seedOf,rng);
        section = phrase===0 ? opening&&!['ambient','heart'].includes(region.genre)?opening.id==='blues-machine'?2:1:Math.floor(random()*levels.length) : (section+1)%levels.length;
        nextSection = bar + 12 + Math.floor(random() * 4) * 4;
      }
      if(environment.room)section=Math.floor(bar/32)%levels.length;
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
        if(RHYTHM_GENRES[region.genre])degree=RHYTHM_GENRES[region.genre].bass[step];
        else if(REFERENCE_BASS[region.genre])degree=REFERENCE_BASS[region.genre].includes(step)?(region.genre==='ebm'||region.genre==='berlin'?0:[0,0,4,2][step%4]):-1;
        if (degree < 0 || (step !== 0 && random() < (sparse ? .45 : .12))) return -1;
        return step === 0 ? 0 : Math.max(0, Math.min(9, degree));
      });
      // Keep a recognisable motif for four phrases; vary space and accents first.
      const motifRandom=rng(seedOf(`radio-motif:v1:${region.key}:${Math.floor(phrase/4)}`));
      const character=musicalCharacter(region.genre);
      const budget=Math.min(grammar.hookLimit,character.budget[section]);
      const steps=RHYTHM_GENRES[region.genre]?.steps||REFERENCE_STEPS[region.genre]||PALETTE_STEPS[region.genre];
      const motifSteps=identity?.motif||steps;
      const recipe=motifSteps?Array.from({length:16},(_,i)=>motifSteps.includes(i)?0:-1):region.track.hook;
      const candidates=shapeMotif(recipe,grammar).map((degree,step)=>({degree,step})).filter(n=>n.degree>=0);
      const anchor=candidates.find(n=>n.step%4===0)?.step??0;
      const positions=[anchor,...candidates.filter(n=>n.step!==anchor).map(n=>n.step)];
      for(let i=positions.length-1;i>1;i--){const j=1+Math.floor(motifRandom()*i);[positions[i],positions[j]]=[positions[j],positions[i]];}
      const motif=Array(16).fill(-1),tones=genres[region.genre].melodyDegrees||[0,2,4];
      positions.slice(0,grammar.hookLimit).forEach((step,i)=>{motif[step]=i===0?0:tones[Math.floor(motifRandom()*tones.length)];});
      const hook=motif.map((degree,step)=>degree<0||step!==anchor&&(random()<.25)?-1:degree);
      let notes=1;hook.forEach((degree,step)=>{if(step!==anchor&&degree>=0&&++notes>budget)hook[step]=-1;});
      hook[anchor]=motif[anchor];
      if(!environment.room&&arrangement&&hook.every((n,i)=>n===arrangement.hook[i])){
        const active=hook.findIndex((n,i)=>i!==anchor&&n>=0);
        if(active>=0)hook[active]=-1;
        else if(budget>1){const alternative=motif.findIndex((n,i)=>i!==anchor&&n>=0);if(alternative>=0)hook[alternative]=motif[alternative];}
      }
      // Silence is part of the arrangement: a whole phrase can belong to bass and drums.
      if(budget===0)hook.fill(-1);
      // Identity changes with the section, rather than swapping instruments every phrase.
      const toneRandom=rng(seedOf(`radio-tone:v1:${region.key}:${section}`));
      const pool = identity?.hooks||hookInstruments(region.genre,genres[region.genre]);
      arrangement = { phrase, section, grammar, character, identity,
        expression:identityExpression(compositionFrame(region.genre,phrase,section),identity),
        melodyRest:budget===0, bass:identityBass(bass,identity,region.genre,section,phrase), hook,
        bassI:identity?.bassI||region.track.bassI,hookI: pool[Math.floor(toneRandom() * pool.length)] };
      nextPhrase = environment.room?(phrase+1)*grammar.phraseBars:bar + grammar.phraseBars + (random()<.25?2:0);
    }
    const life = Math.min(.08, (environment.near || 0) * .002 + (environment.singers || 0) * .015);
    const event = environment.event === 'eclipse' ? -.06 : environment.event ? .05 : 0;
    const density = environment.variant === 0 ? -.05 : environment.variant === 4 ? .04 : 0;
    const limit = environment.quiet ? .24 : identity?.energyCap??(region.genre === 'ambient' ? .3 : .7);
    const sectionEnergy=levels[section]*Math.min(1,(limit-.06)/.62);
    const target = Math.max(.14, Math.min(limit, sectionEnergy + life + event + density + Math.min(.06,Math.max(0,environment.initiative||0)*.06)));
    energy += (target - energy) * .25;
    const frame={ ...arrangement, harmonyBar:bar-startBar, energy, genre: region.genre };
    const native=hybridArrangement(frame,region,bar-startBar,environment.room?null:hybridIdentity(region,seedOf,rng),genres);
    return alive?directedFrame(labArrangement(native,labScore(region,seedOf,rng),environment),region.genre):native;
  }
  return { advance };
}
