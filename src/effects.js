export const EFFECT_NAMES={dry:'Natural',filter:'Filtro suave',echo:'Eco rítmico',space:'Espacio profundo',metal:'Modulación metálica'};
export function effectProfile(kind,region,role,seedOf,rng) {
  const r=rng(seedOf(`effect:v1:${region.key}:${kind}`));
  const pool=role==='bajo'?['dry']:role==='perc'?['dry','dry','filter']:['dry','dry','filter','echo','space','metal'];
  const type=pool[Math.floor(r()*pool.length)];
  return {type,name:EFFECT_NAMES[type],cutoff:1100+r()*900,rate:32+r()*26};
}
export function initialize(runtime) {
  const active=[];
  function effectsTick() {
    const time=runtime.ac?.currentTime||0;
    for(let i=active.length-1;i>=0;i--)if(active[i].end<=time){for(const n of active[i].nodes)n.disconnect();active.splice(i,1);}
  }
  function getEffectProfile(kind,region,voice){return effectProfile(kind,region,voice.role,runtime.seedOf,runtime.rng);}
  function withVoiceEffect(kind,region,voice,time,emit) {
    effectsTick();
    const profile=getEffectProfile(kind,region,voice),ac=runtime.ac;
    if(profile.type==='dry'||!runtime.inWorld()||!runtime.S.sound||ac?.state!=='running'||!runtime.bus||!runtime.verbIn||!runtime.dsend||active.length>=12)return emit();
    const original={bus:runtime.bus,verb:runtime.verbIn,send:runtime.dsend},nodes=[];
    const make=method=>{const n=ac[method]();nodes.push(n);return n;};
    const input=make('createGain'),dry=make('createGain'),verb=make('createGain'),send=make('createGain');
    dry.gain.value=.9;verb.gain.value=.18;send.gain.value=0;
    verb.connect(original.verb);send.connect(original.send);
    if(profile.type==='filter'){
      const f=make('createBiquadFilter');f.type='lowpass';f.Q.value=.7;
      f.frequency.setValueAtTime(profile.cutoff,time);f.frequency.exponentialRampToValueAtTime(profile.cutoff*.65,time+.35);
      input.connect(f).connect(dry);
    }else input.connect(dry);
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
