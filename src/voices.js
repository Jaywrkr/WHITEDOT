import {voiceExpression} from './voice-expression.js';
import {inhabitantVoice} from './pixel-life-model.js';
import {microVoice,microArticulation,microKit} from './micro-instruments-model.js';
import {electronicDrum} from './electronic-ensemble.js';
import {consonantPitch,fitRegister} from './musical-conductor.js';
import {performanceVoice} from './performance.js';
import {labScore,labInteractionVoice} from './lab-score.js';
import {walkerVoice} from './walker-forms.js';
import {cubePulseVoice} from './cube-voice.js';
import {heritageVoice,relicVoice} from './heritage.js';
import {playMaterialStrike} from './percussion-material.js';
import {livingVoice} from './living-catalog.js';
import {INSTRUMENT_SPECS} from './instruments.js';
import {musicalCharacter,interactionInstruments,voiceRegister,expressiveBassInstruments} from './musical-character.js';
import {glassVoice} from './glass-music.js';
import {materiaVoice,materiaKindOf} from './materia-music.js';
import {vidaVoice,vidaKindOf} from './vida-music.js';
import {ecologyVoice} from './ecology-model.js';
import {encounterVoice} from './encounter-families.js';
import {rhythmVoice} from './percussion-model.js';
import {blobVoice} from './blobs.js';
import {hybridIdentity,hybridRegister} from './musical-hybrids.js';
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
  const character=musicalCharacter(region.genre);
  const roles = region.ecology||!character.upper?['bajo','perc','acorde','lead','perc']:ROLES.slice();
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }
  const genre = genres[region.genre];
  const calm = ['ambient','heart','downtempo','dub'].includes(region.genre);
  const bassPool = expressiveBassInstruments(region.genre,genre);
  const melodyPool = interactionInstruments(region.genre,genre,'lead');
  const chordPool = interactionInstruments(region.genre,genre,'acorde');
  const percussionPool = genre.percP || (calm ? ['tom','wood','shaker'] : ['kick','conga','wood','rim','tom','shaker']);
  const voices = Object.create(null);
  kinds.forEach((kind, i) => {
    const role = roles[i % roles.length];
    const pool = role === 'bajo' ? bassPool : role === 'perc' ? percussionPool : role==='acorde'?chordPool:melodyPool;
    voices[kind] = Object.freeze({role, instrument:pool[Math.floor(random()*pool.length)],
      degree:Math.floor(random()*7), response:[2,3,6][Math.floor(random()*3)],
      low:role==='bajo'?36:role==='agudo'?64:role==='acorde'?45:character.low,
      high:role==='bajo'?55:Math.min(region.ecology?69:character.high,role==='acorde'?69:character.high)});
  });
  return Object.freeze(voices);
}

export const magnetVoiceGain=role=>({bajo:1.8,perc:1.75,acorde:1.6,lead:1.8,agudo:1.35}[role]||1.6);
export function initialize(runtime) {
  const cache = new Map(),blobCache=new Map();
  let magnetSource=null;
  function withMagnetVoice(source,emit){const previous=magnetSource;magnetSource=source;try{return emit();}finally{magnetSource=previous;}}
  let voiceOrigin="ambient",budgetOwner=null,budgetKey=null,manualHits=0;const sourceHits=new Map();
  function withVoiceOrigin(origin,emit){const previous=voiceOrigin;voiceOrigin=origin;try{return emit();}finally{voiceOrigin=previous;}}
  function rawVoice(kind, region, source) {
    if(kind==='habitante'&&source?.genome)return inhabitantVoice(source,region,runtime.GEN);
    if(kind.startsWith('micro:')){const voice=microVoice(kind,source);if(voice)return voice;}
    if(kind==='caminante'&&source)return walkerVoice(source,region,runtime.GEN,runtime.seedOf);
    if(kind==='reliquia')return relicVoice(region,source,runtime.seedOf);
    if(kind.startsWith('heritage:')){const v=heritageVoice(kind);if(v)return v;}
    if(kind.startsWith('living:')){const v=livingVoice(kind,region,runtime.GEN,runtime.seedOf,runtime.rng,source);if(v)return v;}
    if(kind.startsWith('rhythm:')){const v=rhythmVoice(kind,region,runtime.seedOf);if(v)return v;}
    if(kind.startsWith('ecology:')&&region.ecology)return ecologyVoice(kind,region,runtime.GEN,runtime.seedOf,runtime.rng);
    if(/^installation:glass:[0-2]$/.test(kind))return glassVoice(region,Number(kind.at(-1)),runtime.GEN,runtime.seedOf);
    {const m=materiaKindOf(kind);if(m)return materiaVoice(m.kind,m.index,region,runtime.GEN,runtime.seedOf);}
    {const v=vidaKindOf(kind);if(v)return vidaVoice(v.kind,v.index,region,runtime.GEN,runtime.seedOf);}
    if(kind.startsWith('encounter:'))return encounterVoice(kind.slice(10),region,runtime.GEN,runtime.seedOf);
    if(kind.startsWith('forma:')&&runtime.blobHabitat?.(region)){const key=region.key+':'+kind;if(!blobCache.has(key)){blobCache.set(key,blobVoice(kind,region,runtime.GEN,runtime.seedOf,runtime.rng));while(blobCache.size>128)blobCache.delete(blobCache.keys().next().value);}return blobCache.get(key);}
    if (!cache.has(region.key)){cache.set(region.key, createRegionalVoices(region, runtime.BIOMES, runtime.GEN, runtime.seedOf, runtime.rng));while(cache.size>128)cache.delete(cache.keys().next().value);}
    const voices = cache.get(region.key);
    // Legacy or border objects absent from the region's own flora retain a stable voice.
    return voices[kind] || voices[Object.keys(voices)[runtime.seedOf(kind) % Object.keys(voices).length]];
  }
  function getVoice(kind,region,source=null){
    let raw=rawVoice(kind,region,source);
    if(source?.id?.startsWith('living:lab:')&&INSTRUMENT_SPECS[source.labSynth]){
      const spec=INSTRUMENT_SPECS[source.labSynth],role=spec.kind==='bass'||['velvetbass','reedbass','p_foldbass'].includes(source.labSynth)?'bajo':spec.kind==='membrane'?'perc':spec.sustain&&['bow','pad'].includes(spec.kind)||['analogpad','choir','orbitorgan'].includes(source.labSynth)?'acorde':'lead';
      raw={...raw,role,instrument:source.labSynth,low:role==='bajo'||role==='perc'?36:45,high:role==='bajo'?54:role==='perc'?57:69};
    }
    if(runtime.MU?.radio?.labScore&&!source?.labSynth&&!kind.startsWith('micro:')&&kind!=='habitante')raw=labInteractionVoice(raw,labScore(region,runtime.seedOf,runtime.rng),kind,source,runtime.seedOf);
    if(runtime.MU?.radio?.labScore&&!kind.startsWith('micro:')&&kind!=='habitante')raw=performanceVoice(raw,region,kind,source,runtime.seedOf);
    if(kind==='pulso')raw=runtime.cubeShopPulseVoice?.(raw)||cubePulseVoice(raw,runtime.S.cube?.voice);
    return hybridRegister(voiceRegister(raw,region.genre),hybridIdentity(region,runtime.seedOf,runtime.rng));
  }
  function playVoice(kind, index, time, region, full=false, volume=1, source=null, origin=voiceOrigin) {
    if (!runtime.ac || !region) return;
    const magnetic=!!magnetSource;if(magnetic&&!source)source=magnetSource;
    time=runtime.musicalTime?.(time)??time;
    const raw=getVoice(kind,region,source),voice=origin==='duet'?runtime.duetVoice?.(raw,source?.duetSlot,region)||raw:raw;
    if(runtime.unifiedMusic===true&&!runtime.labMode&&!runtime.duetRoom&&origin==='player'&&source&&runtime.inWorld()){
      const key=(runtime.MU.dnaA?.key||region.key)+':'+Math.floor(runtime.MU.step/16);
      if(budgetOwner!==runtime.S||budgetKey!==key){budgetOwner=runtime.S;budgetKey=key;manualHits=0;sourceHits.clear();}
      const id=source.id||kind+':'+source.x+':'+source.y,count=sourceHits.get(id)||0;
      if(manualHits>=16||count>=(kind==='pulso'?8:voice.role==='perc'?6:3)||Math.hypot(source.x-runtime.S.wx,source.y-runtime.S.wy)>360)return;
      sourceHits.set(id,count+1);manualHits++;
    }
    if(origin==='player'&&runtime.duetCapture?.(kind,index,time,region,source))return;
    runtime.labLearningHear?.(kind,index,time,region,source,origin);runtime.influenceInput?.(kind,region,source,origin);runtime.voiceGuideHear?.(kind,region,source,origin);runtime.livingHear?.(kind,index,region,source,origin);
    runtime.loopTap?.(kind,index,time,region,full,volume,source,origin);
    if(origin==='player')runtime.recordElement?.(kind,region);
    if(origin==='player'){runtime.vidaHear?.(kind,index,time);runtime.powerHear?.(index);}   // el ave lira escucha lo que tocas   // el looper guarda lo que causas tú
    if(origin==='player')runtime.petHear?.({degree:((runtime.MU.deg+voice.degree+index)%7+7)%7,time,region,source});
    if(origin==='player'&&(!source||Math.hypot(source.x-runtime.S.wx,source.y-runtime.S.wy)<360))runtime.depthHear?.({origin,degree:((runtime.MU.deg+voice.degree+index)%7+7)%7,time,region,layer:runtime.S.layer||'superficie'});
    const frame=runtime.musicalFrame?.(time);
    const note = (degree,harmonicFrame=frame,onset=time) => {
      const harmonicRegion=harmonicFrame?.region||(origin==='band'?(runtime.MU.dnaA||region):region),scale=harmonicRegion.scale,
       transposition=harmonicFrame?.transposition??(runtime.BIOMES[harmonicRegion.z].tr+harmonicRegion.trOff),d=(((harmonicFrame?.degree??runtime.MU.deg)+voice.degree+degree)%7+7)%7;
      let n=57+transposition+scale[d];while(n<voice.low)n+=12;while(n>voice.high)n-=12;
      const step=harmonicFrame?harmonicFrame.step+Math.round((onset-harmonicFrame.time)/harmonicFrame.six):null;
      return harmonicFrame&&(voice.role==='bajo'||step%4===0)?consonantPitch(n,harmonicFrame.chords.slice(0,3),voice.low,voice.high):n;
    };
    // Only automatic upper voices rest; a player's gesture still receives its own response.
    if(origin==='ambient'&&(voice.role==='lead'||voice.role==='agudo')&&runtime.MU.radio?.genre===region.genre&&runtime.MU.radio?.melodyRest)return;
    function hit(t, degree, strength) {
      if(['player','field','lesson'].includes(origin))runtime.focusGesture?.(t,source,voice.role);
      runtime.soundCue?.(source,voice.role,t,origin);
      if(magnetic)runtime.magnetVoiceCue?.({id:source?.id,role:voice.role,instrument:voice.instrument,time:t,gain:magnetVoiceGain(voice.role)});
      const hitFrame=runtime.musicalFrame?.(t)??frame,n=note(degree,hitFrame,t);if(origin==='player'&&source)runtime.identityGesture?.(source,voice,n);let v = runtime.vel(strength * volume*(voice.volume??1)*(magnetic?magnetVoiceGain(voice.role):1))*(runtime.inWorld?.()?runtime.curatedVoiceGain?.(t,voice.role)??1:1);
      const expression=voiceExpression(voice,source,hitFrame,t);v*=expression.velocity;
      const articulation={...expression,...(kind.startsWith('micro:')?microArticulation(source):{}),technique:runtime.cardTechnique?.(source)|| (source?.expression==='staccato'?'muted':source?.expression==='glide'?'slide':voice.technique||'normal')};
      if(source){source.musicRole=voice.role;source.musicInstrument=voice.instrument;}
      const emit=()=>{
        if(voice.instrument?.startsWith?.('shop:')&&runtime.playCubeShopVoice?.(voice.instrument,n,t,v,hitFrame))return;
        if(kind.startsWith('micro:'))runtime.microVoiceCue?.({kind,instrument:voice.instrument,role:voice.role,note:n,time:t,tones:hitFrame?.chords||[],pitches:voice.role==='acorde'&&hitFrame?hitFrame.chords.slice(0,3).map(n=>fitRegister(n,voice.low,voice.high)):[n],strongBeat:!!hitFrame&&(hitFrame.step+Math.round((t-hitFrame.time)/hitFrame.six))%4===0,morph:articulation.morph});
        if(kind.startsWith('micro:')&&voice.role==='bajo'&&runtime.playNewInstrument?.(voice.instrument,n,t,v,articulation)){runtime.recordInstrument?.(voice.instrument);return;}
        if(kind==='micro:drum'&&electronicDrum(runtime,voice.instrument,t,v,microKit(region,runtime.seedOf)))return;
        if(voice.role==='perc'&&INSTRUMENT_SPECS[voice.instrument]&&runtime.playNewInstrument?.(voice.instrument,n,t,v,articulation)){runtime.recordInstrument?.(voice.instrument);if(kind.startsWith('living:'))runtime.livingNoteCue?.({id:source?.id,role:voice.role,note:n,time:t,material:voice.material,instrument:voice.instrument});return;}
        if(kind.startsWith('living:')&&runtime.livingSynthesis?.(voice,n,t,v,source,articulation))return;
        if(kind.startsWith('rhythm:')&&playMaterialStrike(runtime,kind.split(':')[1],source?.variant||0,t,v)){runtime.recordInstrument?.(voice.instrument);return;}
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
          [0,2,4].forEach((d,i)=>runtime.hookInst(voice.instrument,(hitFrame?fitRegister(hitFrame.chords[i],voice.low,voice.high):note(degree+d,hitFrame,t))-(voice.instrument==='glass'?12:0),t,v*.4,region,articulation));
        } else runtime.hookInst(voice.instrument,n-(voice.instrument==='glass'?12:0),t,v,region,articulation);
      };
      const patchEmit=()=>{const produce=()=>withVoiceOrigin(origin,emit);if(runtime.withInstrumentPatch)runtime.withInstrumentPatch(kind,region,voice,source,t,produce);else produce();};
      const spatialEmit=(gain=1)=>{v*=gain;if(runtime.withVoiceEffect)runtime.withVoiceEffect(kind,region,voice,t,patchEmit,source);else patchEmit();};
      if(runtime.withSpatialVoice)runtime.withSpatialVoice(source,t,spatialEmit);else spatialEmit();
    }
    const strength = voice.role === 'bajo' ? .15 : voice.role === 'perc' ? .12 : voice.role === 'agudo' ? .03 : .075;
    hit(time,index%7,strength);
    if(origin==='player'&&kind!=='caminante')runtime.walkerHear?.({degree:((runtime.MU.deg+voice.degree+index)%7+7)%7,time,region});
    // A pulse on time (source.accent) answers with a rising arpeggio in the same voice: its note, the third and the
    // fifth on the grid, so it sounds like the place and its rhythm, never like a separate instrument.
    if (full&&kind==='pulso'&&source?.accent) {for(const [k,steps,gain] of [[2,voice.response,.6],[4,voice.response+2,.45]]){const at=time+runtime.SIX*steps;hit(runtime.musicalTime?.(at)??at,(index+k)%7,strength*gain);}}
    else if (full) {const reply=time+runtime.SIX*voice.response;hit(runtime.musicalTime?.(reply)??reply,index%7,strength*.45);}
    return true;
  }
  Object.defineProperties(runtime, {
    withMagnetVoice:{get:()=>withMagnetVoice},
    currentVoiceOrigin:{get:()=>voiceOrigin},
    withVoiceOrigin: {get:()=>withVoiceOrigin},
    getVoice: {get:()=>getVoice},
    playVoice: {get:()=>playVoice},
  });
}
