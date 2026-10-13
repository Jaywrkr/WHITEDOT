// Identidad musical estable por región; el aspecto no fija el instrumento.
const ROLES = ['bajo', 'perc', 'acorde', 'lead', 'agudo'];
const PROPS = {llanura:'piedra',bosque:'hongo',jardin:'campanilla',dunas:'cactus',tormenta:'antena',cueva:'gota',vacio:'astro'};
const SPECIAL = {lago:['loto'],ruinas:['pilar'],cristales:['cristal'],faros:['faro'],cueva:['gota']};

export function createRegionalVoices(region, biomes, genres, seedOf, rng) {
  const id = biomes[region.z].id;
  const kinds = [...new Set(['luz','pulso','arbol','luciernaga','agua','caminante','bandada',
    ...(PROPS[id] ? [PROPS[id]] : []), ...(SPECIAL[id] || []),
    ...(region.plants || []).map(p => `planta:${p.t}`),
    ...region.species.map(sp => `forma:${sp.id}`)])];
  const random = rng(seedOf(`voices:v1:${region.key}`));
  for (let i = kinds.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [kinds[i], kinds[j]] = [kinds[j], kinds[i]];
  }
  const roles = ROLES.slice();
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }
  const genre = genres[region.genre];
  const calm = ['ambient','heart','downtempo','dub'].includes(region.genre);
  const bassPool = [...new Set(genre.bassP||[genre.bassI, 'sub', calm ? 'fm' : 'pluck'])];
  const melodyPool = [...new Set([...genre.hookP,...(genre.bassP?[]:[calm ? 'flute' : 'organ', 'keys'])])];
  const percussionPool = genre.percP || (calm ? ['tom','wood','shaker'] : ['kick','conga','wood','rim','tom','shaker']);
  const voices = Object.create(null);
  kinds.forEach((kind, i) => {
    const role = roles[i % roles.length];
    const pool = role === 'bajo' ? bassPool : role === 'perc' ? percussionPool : melodyPool;
    voices[kind] = Object.freeze({role, instrument:pool[Math.floor(random()*pool.length)],
      degree:Math.floor(random()*7), response:[2,3,6][Math.floor(random()*3)],
      low:role==='bajo'?36:role==='agudo'?72:role==='acorde'?48:55,
      high:role==='bajo'?55:role==='agudo'?84:role==='acorde'?72:79});
  });
  return Object.freeze(voices);
}

export function initialize(runtime) {
  const cache = new Map();
  function getVoice(kind, region) {
    if (!cache.has(region.key)) cache.set(region.key, createRegionalVoices(region, runtime.BIOMES, runtime.GEN, runtime.seedOf, runtime.rng));
    const voices = cache.get(region.key);
    // Legacy or border objects absent from the region's own flora retain a stable voice.
    return voices[kind] || voices[Object.keys(voices)[runtime.seedOf(kind) % Object.keys(voices).length]];
  }
  function playVoice(kind, index, time, region, full=false, volume=1, source=null) {
    if (!runtime.ac || !region) return;
    runtime.loopTap?.(kind,index,time,region,full,volume);   // el looper guarda lo que causas tú
    const voice = getVoice(kind, region);
    const scale = region.scale, transposition = runtime.BIOMES[region.z].tr + region.trOff;
    const note = degree => {
      const d = ((runtime.MU.deg + voice.degree + degree) % 7 + 7) % 7;
      let n = 57 + transposition + scale[d];
      while (n < voice.low) n += 12;
      while (n > voice.high) n -= 12;
      return n;
    };
    function hit(t, degree, strength) {
      runtime.soundCue?.(source,voice.role,t);
      const n = note(degree);let v = runtime.vel(strength * volume)*(runtime.inWorld?.()?runtime.curatedVoiceGain?.(t,voice.role)??1:1);
      const emit=()=>{
        if (voice.role === 'bajo') runtime.bassInst(voice.instrument,n,t,v);
        else if (voice.role === 'perc') {
          if (voice.instrument === 'kick') runtime.kick(t,v);
          else if (voice.instrument === 'conga') runtime.conga(t,110+voice.degree*25,v);
          else if (voice.instrument === 'wood') runtime.wood(t,v);
          else if (voice.instrument === 'rim') runtime.rim(t,v);
          else if (voice.instrument === 'shaker') runtime.shaker(t,v);
          else if (voice.instrument === 'guiro') runtime.guiro(t,v);
          else if (voice.instrument === 'timbale') runtime.timbale(t,v);
          else if (voice.instrument === 'clap') runtime.clap(t,v);
          else if (voice.instrument === 'hat') runtime.hatHit(t,v);
          else if (voice.instrument === 'snare') runtime.snare(t,v*.8);
          else runtime.tom(t,55+voice.degree*15,v);
        } else if (voice.role === 'acorde') {
          [0,2,4].forEach(d=>runtime.hookInst(voice.instrument,note(degree+d)-(voice.instrument==='glass'?12:0),t,v*.4));
        } else runtime.hookInst(voice.instrument,n-(voice.instrument==='glass'?12:0),t,v);
      };
      const patchEmit=()=>{if(runtime.withInstrumentPatch)runtime.withInstrumentPatch(kind,region,voice,source,t,emit);else emit();};
      const spatialEmit=(gain=1)=>{v*=gain;if(runtime.withVoiceEffect)runtime.withVoiceEffect(kind,region,voice,t,patchEmit);else patchEmit();};
      if(runtime.withSpatialVoice)runtime.withSpatialVoice(source,t,spatialEmit);else spatialEmit();
    }
    const strength = voice.role === 'bajo' ? .15 : voice.role === 'perc' ? .12 : voice.role === 'agudo' ? .03 : .075;
    hit(time,index%7,strength);
    if (full) hit(time+runtime.SIX*voice.response,index%7,strength*.45);
  }
  Object.defineProperties(runtime, {
    getVoice: {get:()=>getVoice},
    playVoice: {get:()=>playVoice},
  });
}
