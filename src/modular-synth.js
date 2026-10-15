// Original DSP/voices. No presets, recordings or external dependencies.
export const ADVANCED_INSTRUMENTS=Object.freeze({
 feltpiano:{name:'Piano de fieltro',engine:'modal',attack:.008,dec:2.25,partials:[]},
 airflute:{name:'Flauta de aire',engine:'wind',attack:.07,dec:1.8,partials:[]},
 silkstrings:{name:'Cuerdas de seda',engine:'ensemble',attack:.18,dec:2.3,partials:[]},
 wavetable:{name:'Ondas entrelazadas',engine:'wavetable',attack:.04,dec:1.9,partials:[]},
 graincloud:{name:'Nube de granos',engine:'granular',attack:.12,dec:1.6,partials:[]},
 pluckbody:{name:'Cuerda física',engine:'string',attack:.004,dec:1.9,partials:[]},
 modaldrum:{name:'Membrana profunda',engine:'membrane',attack:.003,dec:.65,partials:[]},
});
export const voiceLifetime=id=>ADVANCED_INSTRUMENTS[id]?2.9:2;
export function physicalString(sampleRate,hz,duration=2,seed=17){
 if(!Number.isFinite(sampleRate)||sampleRate<1000||sampleRate>192000||!Number.isFinite(hz)||hz<=0||!Number.isFinite(duration)||duration<=0||duration>4)throw Error('Invalid physical string parameters');
 const length=Math.ceil(sampleRate*duration),out=new Float32Array(length),delay=Math.max(4,sampleRate/Math.max(30,Math.min(1600,hz))-.5),ring=new Float32Array(Math.ceil(delay)+3),feedback=Math.pow(.001,1/(hz*2.1));
 let random=seed>>>0,mean=0;
 for(let k=0;k<ring.length;k++){random=(Math.imul(random,1664525)+1013904223)>>>0;ring[k]=random/2147483648-1;mean+=ring[k];}
 mean/=ring.length;for(let k=0;k<ring.length;k++)ring[k]-=mean;
 let previous=0;
 for(let i=0;i<length;i++){const cursor=i%ring.length,read=(cursor-delay+ring.length*2)%ring.length,a=Math.floor(read),f=read-a,
  value=ring[a]*(1-f)+ring[(a+1)%ring.length]*f;
  ring[cursor]=(value+previous)*.5*feedback;previous=value;out[i]=value*.55*Math.min(1,i/(sampleRate*.002));
 }return out;
}
export function createAdvancedPlayer(runtime){
 const contexts=new WeakMap();
 function cache(ac){let c=contexts.get(ac);if(!c){c={buffers:new Map(),waves:new Map(),active:[]};contexts.set(ac,c);}return c;}
 function play(id,note,time,volume,articulation={}){
  const spec=ADVANCED_INSTRUMENTS[id];if(!spec)return false;const ac=runtime.ac;if(!ac||!Number.isFinite(volume)||volume<=0||!Number.isFinite(note)||!Number.isFinite(time))return true;
  const state=cache(ac);state.active=state.active.filter(end=>end>ac.currentTime);if(state.active.length>=24)return true;
  const patch=runtime.activeInstrumentPatch,hz=runtime.hz(Math.max(30,Math.min(88,note))),end=time+2.65,
   nodes=[],sources=[],make=method=>{const n=ac[method]();nodes.push(n);return n;},filter=make('createBiquadFilter'),out=make('createGain');
  filter.type='lowpass';filter.frequency.value=Math.max(650,Math.min(4200,(id==='airflute'?1900:id==='silkstrings'?1800:2800)*(patch?.toneScale||1)));filter.Q.value=.65;filter.connect(out).connect(runtime.bus);
  const level=Math.min(.1,Math.max(0,volume))*(patch?.level||1),attack=Math.min(.3,spec.attack*(articulation?.attackScale||1)),tail=Math.min(2.4,spec.dec*(articulation?.decayScale||1)),hold=id==='silkstrings'?.32:0;
  out.gain.setValueAtTime(0,time);out.gain.linearRampToValueAtTime(level,time+attack);out.gain.setValueAtTime(level,time+attack+hold);out.gain.exponentialRampToValueAtTime(.00001,time+Math.min(2.6,attack+hold+tail));
  if(id!=='modaldrum'&&id!=='pluckbody'){const send=make('createGain');send.gain.value=.06;out.connect(send).connect(runtime.verbIn);}
  const oscillator=(ratio,type,amount,decay=0)=>{const osc=make('createOscillator'),gain=make('createGain');osc.type=type;osc.frequency.value=hz*ratio;gain.gain.setValueAtTime(amount,time);if(decay)gain.gain.exponentialRampToValueAtTime(.0001,time+decay);osc.connect(gain).connect(filter);osc.start(time);osc.stop(end);sources.push(osc);return {osc,gain};};
  const noise=()=>{const key='excitation';if(!state.buffers.has(key)){const b=ac.createBuffer(1,Math.ceil(ac.sampleRate*.65),ac.sampleRate),data=b.getChannelData(0);let h=314159;for(let i=0;i<data.length;i++){h=(Math.imul(h,1664525)+1013904223)>>>0;const t=i/ac.sampleRate;data[i]=.28*Math.sin(t*2*Math.PI*220)+.1*Math.sin(t*2*Math.PI*440)+.04*(h/2147483648-1);}state.buffers.set(key,b);}return state.buffers.get(key);};
  if(spec.engine==='string'){
   const key='string:'+Math.round(hz*100);if(!state.buffers.has(key)){const b=ac.createBuffer(1,Math.ceil(ac.sampleRate*2),ac.sampleRate);b.copyToChannel(physicalString(ac.sampleRate,hz,2,Math.round(hz*31)),0);state.buffers.set(key,b);while(state.buffers.size>24)state.buffers.delete(state.buffers.keys().next().value);}
   const source=make('createBufferSource');source.buffer=state.buffers.get(key);source.connect(filter);source.start(time);source.stop(end);sources.push(source);
  }else if(spec.engine==='granular'){
   const buffer=noise();for(let i=0;i<14;i++){const source=make('createBufferSource'),gain=make('createGain'),at=time+i*.072,duration=.13+(i%3)*.018;
    source.buffer=buffer;source.playbackRate.value=hz/220*(1+Math.sin(i*2.4)*.0015);gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.35,at+duration*.45);gain.gain.linearRampToValueAtTime(0,at+duration);
    source.connect(gain).connect(filter);source.start(at,(i%4)*.012,duration*source.playbackRate.value);source.stop(at+duration);sources.push(source);
   }
  }else if(spec.engine==='wavetable'){
   for(let i=0;i<2;i++){const key='table:'+i;if(!state.waves.has(key)){const real=new Float32Array(17),imag=new Float32Array(17);for(let k=1;k<17;k++)imag[k]=i?(k%2?1/k**1.8:0):1/k**1.4;state.waves.set(key,ac.createPeriodicWave(real,imag));}
    const {osc,gain}=oscillator(i?1.001:1,'sine',i?.08:.5);osc.setPeriodicWave(state.waves.get(key));gain.gain.linearRampToValueAtTime(i?.5:.08,time+1.1);}
  }else if(spec.engine==='ensemble'){
   [-3.5,0,3.5].forEach(cents=>oscillator(2**(cents/1200),'sawtooth',.12));oscillator(1,'sine',.18);
  }else if(spec.engine==='wind'){
   const {osc}=oscillator(1,'sine',.62);oscillator(2,'triangle',.075);const lfo=make('createOscillator'),depth=make('createGain');lfo.frequency.value=4.6;depth.gain.value=hz*.0007;lfo.connect(depth).connect(osc.frequency);lfo.start(time);lfo.stop(end);sources.push(lfo);
   const breath=make('createBufferSource'),gain=make('createGain');breath.buffer=noise();breath.loop=true;gain.gain.value=.025;breath.connect(gain).connect(filter);breath.start(time);breath.stop(end);sources.push(breath);
  }else{
   const ratios=spec.engine==='membrane'?[1,1.593,2.136,2.65]:[1,2.002,3.006,4.012,6.025];
   ratios.forEach((ratio,i)=>{const {osc}=oscillator(ratio,'sine',[.52,.2,.09,.045,.018][i],Math.max(.08,tail/(1+i*.7)));if(spec.engine==='membrane'){osc.frequency.setValueAtTime(hz*ratio*1.35,time);osc.frequency.exponentialRampToValueAtTime(hz*ratio,time+.045);}});
  }
  // A silent sentinel outlives short grains; one early grain cannot disconnect the cloud.
  const sentinel=make('createConstantSource'),silence=make('createGain');silence.gain.value=0;sentinel.connect(silence).connect(out);sentinel.start(time);sentinel.stop(end+.01);sentinel.onended=()=>nodes.forEach(n=>n.disconnect());
  state.active.push(end+.01);runtime.advancedNoteCue?.({instrument:id,time,end,engine:spec.engine,sources:sources.length});return true;
 }
 return play;
}
