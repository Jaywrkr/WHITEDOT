// Locally synthesized material samples and smooth resonant voices, no copyrighted recordings.
const MATERIALS=['agua','madera','semilla','tela','metal','piedra','membrana','cuerda','vidrio'];
export function materialSamples(ac,material,variant){
 const id=MATERIALS.indexOf(material),length=Math.floor(ac.sampleRate*.24),buffer=ac.createBuffer(1,length,ac.sampleRate),out=buffer.getChannelData(0);
 let state=(variant+1)*7919+(id+1)*3571;
 for(let i=0;i<length;i++){state=(Math.imul(state,1664525)+1013904223)>>>0;const noise=state/2147483648-1,t=i/ac.sampleRate;
  const f=material==='piedra'?90:material==='metal'?430:material==='agua'?180:130+(id+1)*23;
  out[i]=(.58*Math.sin(2*Math.PI*f*t)+.22*Math.sin(2*Math.PI*f*1.57*t)+(material==='tela'?.3:.1)*noise)*Math.exp(-t*(material==='metal'?21:35))*Math.min(1,t/.003);
 }return buffer;
}
export function initialize(runtime){
 const caches=new WeakMap();
 function emit(voice,n,time,volume,source){
  const ac=runtime.ac;if(!ac||ac.state!=='running')return true;
  const spec=voice.score,variant=source?.variant||0;volume=Math.min(.085,Math.max(0,volume));const end=time+Math.min(1.4,spec.decay+.22);
  const gain=ac.createGain(),filter=ac.createBiquadFilter();filter.type='lowpass';filter.frequency.value=voice.role==='bajo'?900:spec.signature==='robotica'?2500:1700;filter.Q.value=.65;
  filter.connect(gain).connect(runtime.bus);gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume,time+spec.attack);gain.gain.exponentialRampToValueAtTime(.00001,end);
  const nodes=[gain,filter],sources=[];
  if(voice.role==='perc'){
   let cache=caches.get(ac);if(!cache){cache=new Map();caches.set(ac,cache);}const key=voice.material+':'+variant%8;
   if(!cache.has(key)){cache.set(key,materialSamples(ac,voice.material,variant%8));if(cache.size>32)cache.delete(cache.keys().next().value);}
   const b=ac.createBufferSource();b.buffer=cache.get(key);b.playbackRate.value=.75+variant%8*.06;b.connect(filter);sources.push(b);nodes.push(b);
  }else{
   const hz=runtime.hz(n),ratios=voice.role==='acorde'?[1,1.25,1.5]:[1,1.002];
   for(const [i,ratio]of ratios.entries()){const osc=ac.createOscillator(),level=ac.createGain();osc.frequency.value=hz*ratio;level.gain.value=(voice.role==='acorde'?.25:.42);
    if(variant%3===0){const real=new Float32Array([0,0,0,0,0]),imag=new Float32Array([0,1,.14,.06,.02]);osc.setPeriodicWave(ac.createPeriodicWave(real,imag));}
    else osc.type=voice.role==='bajo'?'triangle':variant%3===1?'sine':'triangle';
    osc.connect(level).connect(filter);sources.push(osc);nodes.push(osc,level);
    if(spec.signature==='robotica'&&i===0){const mod=ac.createOscillator(),depth=ac.createGain();mod.frequency.value=hz*.5;depth.gain.setValueAtTime(hz*.08,time);depth.gain.exponentialRampToValueAtTime(.1,end);mod.connect(depth).connect(osc.frequency);sources.push(mod);nodes.push(mod,depth);}
   }
  }
  runtime.livingNoteCue?.({id:source?.id,role:voice.role,note:n,time,material:voice.material});
  const [main]=sources;main.onended=()=>nodes.forEach(node=>node.disconnect());for(const source of sources){source.start(time);source.stop(end+.01);}return true;
 }
 Object.defineProperty(runtime,'livingSynthesis',{get:()=>emit});
}
