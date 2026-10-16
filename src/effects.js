import {musicDirection} from './music-direction.js';
export const EFFECT_NAMES={dry:'Natural',filter:'Filtro suave',echo:'Eco rítmico',space:'Espacio profundo',metal:'Modulación metálica'};
export function effectProfile(kind,region,role,seedOf,rng) {
  const r=rng(seedOf(`effect:v1:${region.key}:${kind}`));
  const spacious=!region.genre||musicDirection(region.genre).space>.5;
  const pool=role==='bajo'?['dry']:role==='perc'?['dry','dry','filter']:spacious?['dry','dry','filter','echo','space','metal']:['dry','dry','dry','filter','echo','metal'];
  const type=pool[Math.floor(r()*pool.length)];
  const h=seedOf('effect:shape:v1:'+region.key+':'+kind)>>>0;
  return {type,name:EFFECT_NAMES[type],cutoff:1100+r()*900,rate:32+r()*26,mode:role==='perc'?'lowpass':h%3===0?'bandpass':'lowpass',stages:role==='perc'?1:1+(h>>>3)%2,resonance:role==='perc'?.7:.7+(h>>>6)%6*.3,endRatio:[.4,.65,1.35][(h>>>10)%3],beats:2+(h>>>13)%3,amount:.45+(h>>>16)%4*.15};
}
export function initialize(runtime) {
  const active=[];
  function effectsTick() {
    const time=runtime.ac?.currentTime||0;
    for(let i=active.length-1;i>=0;i--)if(active[i].end<=time){for(const n of active[i].nodes)n.disconnect();active.splice(i,1);}
  }
  function getEffectProfile(kind,region,voice){return effectProfile(kind,region,voice.role,runtime.seedOf,runtime.rng);}
  function withVoiceEffect(kind,region,voice,time,emit,source=null) {
    effectsTick();
    const profile=getEffectProfile(kind,region,voice),ac=runtime.ac,guitar=voice.instrument==='p_gutguitar'&&runtime.MU?.radio?.labScore?.production?.id==='guitar';
    if(profile.type==='dry'&&!guitar||!runtime.inWorld()||!runtime.S.sound||ac?.state!=='running'||!runtime.bus||!runtime.verbIn||!runtime.dsend||active.length>=12)return emit();
    const original={bus:runtime.bus,verb:runtime.verbIn,send:runtime.dsend},nodes=[];
    const make=method=>{const n=ac[method]();nodes.push(n);return n;};
    const input=make('createGain'),dry=make('createGain'),verb=make('createGain'),send=make('createGain');
    dry.gain.value=.9;verb.gain.value=.18;send.gain.value=0;
    verb.connect(original.verb);send.connect(original.send);
    let signal=input;
    if(guitar){const pre=make('createGain'),amp=make('createWaveShaper'),post=make('createGain'),curve=new Float32Array(129);for(let i=0;i<129;i++)curve[i]=Math.tanh((i/64-1)*2.2)/Math.tanh(2.2);pre.gain.value=8;post.gain.value=.055;amp.curve=curve;amp.oversample='2x';signal.connect(pre).connect(amp).connect(post);signal=post;}
    if(profile.type==='filter'){
      const clean=make('createGain');clean.gain.value=(1-profile.amount)*.9;signal.connect(clean).connect(original.bus);dry.gain.value=profile.amount*.9;
      let route=signal;const end=profile.cutoff*profile.endRatio;for(let i=0;i<profile.stages;i++){const f=make('createBiquadFilter');f.type=profile.mode;f.Q.value=profile.resonance;f.frequency.setValueAtTime(profile.cutoff,time);f.frequency.exponentialRampToValueAtTime(end,time+runtime.SIX*profile.beats);route.connect(f);route=f;}route.connect(dry);
      runtime.filterCue?.(source,voice.role,{start:profile.cutoff,end,stages:profile.stages,slope:profile.stages*12,mode:profile.mode},time);
    }else signal.connect(dry);
    dry.connect(original.bus);
    if(profile.type==='echo'){
      const delay=make('createDelay'),f=make('createBiquadFilter'),wet=make('createGain');
      delay.delayTime.value=Math.min(1.2,runtime.SIX*3);f.type='lowpass';f.frequency.value=1400;wet.gain.value=.14;
      input.connect(delay).connect(f).connect(wet).connect(original.bus);
    }else if(profile.type==='space'){
      const wet=make('createGain');wet.gain.value=.2;input.connect(wet).connect(original.verb);
    }else if(profile.type==='metal'){
      const ring=make('createGain'),osc=make('createOscillator'),depth=make('createGain');
      ring.gain.value=0;depth.gain.value=.08;osc.frequency.value=profile.rate;osc.type='sine';
      osc.connect(depth).connect(ring.gain);input.connect(ring).connect(original.bus);osc.start(time);osc.stop(time+2.5);
    }
    active.push({nodes,end:time+3});
    runtime.bus=input;runtime.verbIn=verb;runtime.dsend=send;
    try{return emit();}finally{runtime.bus=original.bus;runtime.verbIn=original.verb;runtime.dsend=original.send;}
  }
  Object.defineProperties(runtime,{getEffectProfile:{get:()=>getEffectProfile},withVoiceEffect:{get:()=>withVoiceEffect},effectsTick:{get:()=>effectsTick},activeEffectCount:{get:()=>active.length}});
}
