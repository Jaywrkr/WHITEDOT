import {PERFORMANCE_INSTRUMENTS} from './performance-instruments.js';
import {physicalString} from './modular-synth.js';
// Original modeled voices; the names describe inspiration, not sampled instruments.
const spec=(name,kind,cut,attack,decay,partials,noise=0,sustain=false)=>Object.freeze({name,kind,cut,attack,decay,partials:Object.freeze(partials.map(p=>Object.freeze(p))),noise,sustain,technique:true});
export const TECHNIQUE_INSTRUMENTS=Object.freeze({
 ...PERFORMANCE_INSTRUMENTS,
 silkpluck:spec('Cuerda de seda','string',2500,.006,1.65,[[1,'sine',.7],[2.01,'triangle',.09]],.025),
 skinpluck:spec('Cuerda de piel','string',2900,.003,.65,[[1,'triangle',.5],[2.02,'square',.08]],.15),
 lowbow:spec('Arco de madera','bow',1300,.24,1.7,[[.998,'sawtooth',.25],[1.002,'triangle',.35],[2,'sine',.08]],.025,true),
 bamboowind:spec('Aire de bambú','wind',2000,.1,1.1,[[1,'sine',.65],[2,'triangle',.08]],.055,true),
 clayflute:spec('Flauta de barro','wind',1200,.055,.85,[[1,'sine',.7],[3,'sine',.035]],.025,true),
 skinbass:spec('Membrana grave','membrane',1600,.003,.48,[[1,'sine',.7],[1.593,'sine',.14],[2.14,'sine',.05]]),
 handslap:spec('Golpe de mano','membrane',3200,.002,.19,[[1,'sine',.45],[1.75,'sine',.12],[2.5,'sine',.05]],.32),
 acousticsnare:spec('Caja de fibras','membrane',3800,.002,.23,[[1,'sine',.28],[1.48,'sine',.1],[2.13,'sine',.04]],.65),
 feltkeys:spec('Teclas de madera','struck',2900,.007,1.7,[[1,'sine',.55],[2.001,'sine',.19],[3.005,'sine',.08],[4.011,'sine',.035]],.015),
 duskpad:spec('Pad de penumbra','pad',1200,.4,1.7,[[.997,'triangle',.3],[1.003,'sawtooth',.18],[2,'sine',.08]],.01,true),
 reedbass:spec('Bajo respirado','bass',650,.018,.6,[[1,'triangle',.6],[.5,'sine',.15],[2,'sine',.035]]),
});
export const TECHNIQUES=Object.freeze(['normal','muted','slide','ghost','accent','breathy']);
export function techniqueShape(spec,expression={}){
 if(!expression||typeof expression!=='object')expression={};
 const mode=TECHNIQUES.includes(expression.technique)?expression.technique:'normal',muted=mode==='muted',ghost=mode==='ghost';
 return {mode,attack:Math.max(.002,Math.min(.5,spec.attack*(expression.attackScale||1)*(mode==='breathy'?1.5:1))),
  decay:Math.max(.07,Math.min(2,spec.decay*(muted?.25:ghost?.5:1)*(expression.decayScale||1))),
  cut:Math.max(250,Math.min(4800,spec.cut*(muted?.55:1)*(expression.toneScale||1))),
  level:ghost?.4:mode==='accent'?1.12:1,bend:mode==='slide'?1.5:0,noise:spec.noise*(mode==='breathy'?1.8:muted?.5:1)};
}
export function createTechniquePlayer(runtime){
 const buffers=new WeakMap(),strings=new WeakMap();let active=[];
 function prune(){const now=runtime.ac?.currentTime||0;active=active.filter(h=>h.end>now);}
 function noiseBuffer(ac){if(!buffers.has(ac)){const b=ac.createBuffer(1,Math.ceil(ac.sampleRate*.2),ac.sampleRate),data=b.getChannelData(0);let s=721;
  for(let i=0;i<data.length;i++){s=(Math.imul(s,1664525)+1013904223)>>>0;data[i]=s/2147483648-1;}buffers.set(ac,b);}return buffers.get(ac);}
 function stringBuffer(ac,hz){
  let cache=strings.get(ac);if(!cache){cache=new Map();strings.set(ac,cache);}const key=String(hz);
  if(cache.has(key)){const b=cache.get(key);cache.delete(key);cache.set(key,b);return b;}
  const b=ac.createBuffer(1,Math.ceil(ac.sampleRate*2),ac.sampleRate);b.copyToChannel(physicalString(ac.sampleRate,hz,2,Math.round(hz*37)),0);
  cache.set(key,b);if(cache.size>8)cache.delete(cache.keys().next().value);runtime.techniqueBufferBuilt?.({size:cache.size});return b;
 }
 function start(id,note,time,volume,expression={},held=false){
  const spec=TECHNIQUE_INSTRUMENTS[id],ac=runtime.ac;
  if(!spec||!ac||!Number.isFinite(note)||!Number.isFinite(time)||!Number.isFinite(volume)||volume<=0||held&&!spec.sustain)return null;
  prune();const priority=held||['player','field'].includes(runtime.currentVoiceOrigin)?2:runtime.currentVoiceOrigin==='lesson'?1:0;
  if(held&&active.filter(h=>h.held&&!h.released).length>=4)return null;
  if(active.length>=16){const victim=active.find(h=>!h.held&&h.priority<priority);if(!victim)return null;victim.release(Math.max(ac.currentTime,time),.025);active=active.filter(h=>h!==victim);}
  const shape=techniqueShape(spec,expression),at=Math.max(ac.currentTime||0,time),hz=runtime.hz(Math.max(30,Math.min(84,note))),
   level=Math.min(.065,volume)*shape.level*(runtime.activeInstrumentPatch?.level||1),duration=held?24:Math.min(2.65,shape.attack+shape.decay+.08),
   nodes=[],sources=[],oscillators=[],make=method=>{const n=ac[method]();nodes.push(n);return n;},filter=make('createBiquadFilter'),gain=make('createGain');
  filter.type='lowpass';filter.frequency.value=shape.cut;filter.Q.value=.65;filter.connect(gain).connect(runtime.bus);
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(level,at+shape.attack);
  if(!held)gain.gain.exponentialRampToValueAtTime(.00001,at+duration);
  const voice={id,held,end:at+duration,level,released:false,sources,nodes,priority};
  const oscillator=(ratio,type,amount)=>{const o=make('createOscillator'),g=make('createGain');o.type=type;o.frequency.setValueAtTime(hz*ratio*2**(shape.bend/12),at);
   if(shape.bend)o.frequency.exponentialRampToValueAtTime(hz*ratio,at+.12);
   if(spec.kind==='membrane'){o.frequency.setValueAtTime(hz*ratio*1.6,at);o.frequency.exponentialRampToValueAtTime(hz*ratio,at+.045);}
   g.gain.setValueAtTime(amount,at);if(!held)g.gain.exponentialRampToValueAtTime(.0001,at+duration*(spec.kind==='struck'?.8:1));
   o.connect(g).connect(filter);o.start(at);o.stop(voice.end+.02);sources.push(o);oscillators.push({o,ratio});};
  if(spec.kind==='string'&&!held){const source=make('createBufferSource');source.buffer=stringBuffer(ac,hz);
   if(shape.bend){source.playbackRate.setValueAtTime(2**(shape.bend/12),at);source.playbackRate.exponentialRampToValueAtTime(1,at+.12);}source.connect(filter);source.start(at);source.stop(voice.end+.02);sources.push(source);
   // The skin bridge adds a short, inharmonic rattle distinct from the silk body.
   if(id==='skinpluck')oscillator(2.02,'triangle',.1);
  }else for(const [ratio,type,amount]of spec.partials)oscillator(ratio,type,amount);
  if(spec.kind==='fm'&&oscillators.length){const mod=make('createOscillator'),depth=make('createGain');mod.frequency.value=hz*spec.fmRatio;depth.gain.setValueAtTime(hz*spec.fmIndex,at);depth.gain.exponentialRampToValueAtTime(.01,at+Math.min(1.5,duration*.8));mod.connect(depth).connect(oscillators[0].o.frequency);mod.start(at);mod.stop(voice.end+.02);sources.push(mod);}
  if(shape.noise){const source=make('createBufferSource'),g=make('createGain'),breath=make('createBiquadFilter');source.buffer=noiseBuffer(ac);source.loop=true;breath.type='bandpass';breath.frequency.value=spec.kind==='membrane'?1900:1200;breath.Q.value=.8;g.gain.value=shape.noise;
   source.connect(breath).connect(g).connect(filter);source.start(at);source.stop(voice.end+.02);sources.push(source);}
  if(spec.kind==='wind'||spec.kind==='bow'){const lfo=make('createOscillator'),depth=make('createGain');lfo.frequency.value=spec.kind==='wind'?4.4:3.1;depth.gain.value=hz*.0012;
   for(const {o}of oscillators)lfo.connect(depth).connect(o.frequency);lfo.start(at);lfo.stop(voice.end+.02);sources.push(lfo);}
  const sentinel=make('createConstantSource'),silent=make('createGain');silent.gain.value=0;sentinel.connect(silent).connect(gain);sentinel.start(at);sentinel.stop(voice.end+.04);sources.push(sentinel);
  sentinel.onended=()=>{for(const n of nodes)n.disconnect?.();active=active.filter(h=>h!==voice);};
  voice.release=(when=ac.currentTime,fade=.18)=>{if(voice.released)return;voice.released=true;const t=Math.max(ac.currentTime,Number.isFinite(when)?when:ac.currentTime),end=t+Math.max(.02,Math.min(.18,fade));
   if(gain.gain.cancelAndHoldAtTime)gain.gain.cancelAndHoldAtTime(t);else{gain.gain.cancelScheduledValues?.(t);gain.gain.setValueAtTime(Math.max(.00001,gain.gain.value||voice.level),t);}gain.gain.exponentialRampToValueAtTime(.00001,end);voice.end=end;
   for(const s of sources)try{s.stop(end+.03);}catch(_){}
  };
  voice.update=(values={},when=ac.currentTime)=>{if(voice.released)return;const t=Math.max(ac.currentTime||0,Number.isFinite(when)?when:ac.currentTime||0),pressure=Number.isFinite(values.pressure)?Math.max(0,Math.min(1,values.pressure)):1,bend=Number.isFinite(values.bend)?Math.max(-2,Math.min(2,values.bend)):0;
   voice.level=level*pressure;gain.gain.setTargetAtTime(Math.max(.00001,voice.level),t,.04);filter.frequency.setTargetAtTime(shape.cut*(.6+.4*pressure),t,.08);
   for(const {o,ratio}of oscillators)o.frequency.setTargetAtTime(hz*ratio*2**(bend/12),t,.07);
  };
  active.push(voice);runtime.techniqueNoteCue?.({instrument:id,kind:spec.kind,technique:shape.mode,time:at,end:voice.end,held,nodes:nodes.length});return voice;
 }
 const releaseHeld=()=>{for(const v of active)if(v.held)v.release();};
 globalThis.window?.addEventListener?.('blur',releaseHeld);
 return {play(id,n,t,v,e){if(!TECHNIQUE_INSTRUMENTS[id])return false;start(id,n,t,v,e);return true;},hold:(id,n,t,v,e)=>start(id,n,t,v,e,true),
  tick(){prune();if(globalThis.document?.hidden||!['world','studio'].includes(runtime.S.mode)||globalThis.document?.querySelector?.('.modal:not([hidden])'))releaseHeld();},
  releaseHeld,get stringCacheSize(){return strings.get(runtime.ac)?.size||0;},get active(){prune();return active.length;}};
}
