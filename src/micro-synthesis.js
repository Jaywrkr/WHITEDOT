// Small original signal paths, with bounded envelopes and harmonic modulation.
export const MICRO_SYNTHS=Object.freeze(Object.fromEntries([
 ['mi_acid','Bajo ácido','bass'],['mi_analog','Bajo analógico','bass'],['mi_poly','Polifonía cálida','pad'],['mi_fm','Tecla FM','fm'],['mi_slice','Recorte sintético','membrane'],['mi_ring','Modulación armónica','lead']
].map(([id,name,kind])=>[id,Object.freeze({name,kind,micro:true,partials:[]})])));
export function createMicroPlayer(runtime){
 const noise=new WeakMap(),voices=new WeakMap();
 return function play(id,m,time,volume,expression={}){
  if(!MICRO_SYNTHS[id])return false;const ac=runtime.ac;if(!ac)return true;if(!Number.isFinite(m)||!Number.isFinite(time)||!Number.isFinite(volume)||volume<=0)return true;const held=(voices.get(ac)||[]).filter(end=>end>(ac.currentTime||0));voices.set(ac,held);if(held.length>=24)return true;
  const parameter=Math.max(0,Math.min(1,Number.isFinite(expression.pressure)?expression.pressure:.35)),patch=runtime.activeInstrumentPatch,
   pitch=runtime.hz(m),six=runtime.SIX||.125,attack=id==='mi_poly'?.055:.004,
   duration=id==='mi_poly'?.8:id==='mi_fm'?.72:id==='mi_slice'?Math.min(.13,six*.9):.25+parameter*.18,
   level=Math.max(0,Math.min(.2,volume))*(patch?.level||1)*(expression.technique==='ghost'?.4:expression.technique==='accent'?1.1:1),nodes=[],sources=[],end=time+duration+attack+.08;
  const make=method=>{const node=ac[method]();nodes.push(node);return node;},filter=make('createBiquadFilter'),out=make('createGain');
  filter.type='lowpass';filter.Q.value=id==='mi_acid'?1.8+parameter*3.2:.65;
  const cutoff=(id==='mi_acid'?260+parameter*1900:id==='mi_analog'?500+parameter*500:id==='mi_poly'?950+parameter*1300:id==='mi_fm'?2300:1800)*(patch?.toneScale||1);
  filter.frequency.setValueAtTime(cutoff,time);filter.frequency.exponentialRampToValueAtTime(Math.max(100,cutoff*(id==='mi_acid'?.18:.65)),time+Math.min(duration,six*3));
  runtime.env(out,time,attack,level,duration,true);filter.connect(out).connect(runtime.bus);
  const oscillator=(ratio,type,gain)=>{const o=make('createOscillator'),g=make('createGain');o.type=type;o.frequency.value=pitch*ratio;g.gain.value=gain;o.connect(g).connect(filter);sources.push(o);o.start(time);o.stop(end);return o;};
  if(id==='mi_acid'){oscillator(1,'sawtooth',.42);oscillator(.5,'sine',.12);}
  else if(id==='mi_analog'){oscillator(1,'sine',.65);oscillator(1.001,'triangle',.22);oscillator(2,'sine',.08);}
  else if(id==='mi_poly'){oscillator(.997,'sawtooth',.2);oscillator(1.003,'triangle',.36);}
  else if(id==='mi_fm'){const carrier=oscillator(1,'sine',.7),mod=make('createOscillator'),depth=make('createGain');mod.frequency.value=pitch;depth.gain.setValueAtTime(pitch*(.3+parameter*1.2),time);depth.gain.exponentialRampToValueAtTime(.01,time+duration*.8);mod.connect(depth).connect(carrier.frequency);sources.push(mod);mod.start(time);mod.stop(end);}
  else if(id==='mi_ring'){const carrier=make('createOscillator'),ring=make('createGain'),mod=make('createOscillator'),depth=make('createGain');carrier.type='triangle';carrier.frequency.value=pitch;ring.gain.value=.42;mod.frequency.value=pitch*2;depth.gain.value=.05+parameter*.15;mod.connect(depth).connect(ring.gain);carrier.connect(ring).connect(filter);sources.push(carrier,mod);carrier.start(time);mod.start(time);carrier.stop(end);mod.stop(end);}
  else{
   if(!noise.has(ac)){const buffer=ac.createBuffer(1,Math.ceil(ac.sampleRate*.12),ac.sampleRate),data=buffer.getChannelData(0);let seed=731;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=(seed/2147483648-1)*.25;}noise.set(ac,buffer);}
   const grain=make('createBufferSource');grain.buffer=noise.get(ac);grain.playbackRate.value=.8+parameter*.4;grain.connect(filter);sources.push(grain);grain.start(time);grain.stop(Math.min(end,time+.11));oscillator(1,'sine',.3);
  }
  held.push(end);sources.at(-1).onended=()=>nodes.forEach(node=>node.disconnect?.());
  runtime.microSynthesisCue?.({instrument:id,note:m,time,parameter,cutoff});return true;
 };
}
