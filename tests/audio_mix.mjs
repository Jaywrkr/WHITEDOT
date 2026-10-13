// Real Web Audio render of the scheduler, with a virtual clock and deterministic noise.
export async function renderMix(genre='minimal', {dense=false,soft=false,fx=false,sampleRate=48000,influenced=false,worldSeed='',encounter=null}={}) {
 const modules=await Promise.all(['data','progress','world','audio','voices','instruments','patches','effects','spatial','influence','blobs'].map(id=>import(`../src/${id}.js`)));
 const r=Object.create(null),duration=10,context=new OfflineAudioContext(2,duration*sampleRate,sampleRate);
 const original={AudioContext:window.AudioContext,setInterval:window.setInterval,setTimeout:window.setTimeout,random:Math.random};
 let clock=0,schedule;const originalURL=location.href;
 const proxy=new Proxy(context,{get(target,key){if(key==='currentTime')return clock;if(key==='state')return 'running';const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;}});
 try {
  window.AudioContext=function(){return proxy;};window.setInterval=fn=>{schedule=fn;return 0;};window.setTimeout=()=>0;
  for(const m of modules.slice(0,2))m.initialize(r);r.S.worldSeed=worldSeed;modules[2].initialize(r);
  Math.random=r.rng(r.seedOf('mix-render:v1'));
  for(const m of modules.slice(3))m.initialize(r);
  const origin=r.regionOfPos(900,900),G=r.GEN[genre];
  r.S.mode='world';r.S.softMusic=soft;r.S.sound=true;r.S.wx=900;r.S.wy=900;
  r.MU.dnaT={...origin,key:'0,0',genre,bpm:(G.bpm[0]+G.bpm[1])/2,track:{...origin.track,bassI:G.bassI,hookI:G.hookP[0]}};
  r.MU.E=dense?.8:.45;r.MU.vit=1;r.MU.vari=2;r.audio();
  if(influenced){r.activeLayerRegion=()=>r.MU.dnaT;for(const k of ['bass','groove','melody'])r.driveInfluence(r.MU.dnaT,k,1,3);for(let i=0;i<100;i++)r.influenceTick(.05,false);}
  if(fx){r.fx.verbSend.gain.value=.7;r.fx.delaySend.gain.value=.5;r.fx.fb.gain.value=.72;}
  if(encounter){
   // The actual encounter scheduler asks the world for its region, so its cached region must match the tested genre.
   origin.genre=genre;origin.track={...r.MU.dnaT.track};
   document.querySelectorAll('.modal').forEach(m=>m.hidden=true);
   const url=new URL(location.href);url.searchParams.set('encounter',encounter);history.replaceState(null,'',url);
   r.S.previewSeed='audio-review';r.S.wx=r.S.wy=r.REG*r.WCH/2;
   const {initialize}=await import('../src/encounters.js');initialize(r);r.unlock=()=>{};r.encounterTick(.05,false);
   const object=r.encounterObjects.find(o=>o.id==='preview:'+encounter);if(!object)throw Error('missing audio encounter '+encounter);
   const {FAMILIES}=await import('../src/encounter-families.js');FAMILIES[encounter].drag(object.state,70,-60,200);object.state.used=true;object.state.active=999;
  }
  const sources=Array.from({length:8},(_,i)=>({x:900+10*i,y:900,id:`mix:${i}`}));
  for(let tick=0;tick<duration/.025;tick++){
   clock=tick*.025;if(encounter)r.encounterTick(.025,false);schedule();
   if(dense&&tick%10===0)sources.forEach((source,i)=>r.playVoice(worldSeed?'forma:'+r.MU.dnaT.species[i%r.MU.dnaT.species.length].id:['arbol','cristal','pulso','luz'][i%4],i,clock+.13,r.MU.dnaT,true,.9,source));
  }
  const buffer=await context.startRendering(),data=Array.from({length:2},(_,i)=>buffer.getChannelData(i));
  let peak=0,sum=0,hot=0,n=0;
  for(const samples of data)for(let i=sampleRate;i<samples.length;i++){const value=samples[i];if(!Number.isFinite(value))throw Error('nonfinite rendered audio');peak=Math.max(peak,Math.abs(value));sum+=value*value;hot+=Math.abs(value)>.98;n++;}
  return {genre,dense,soft,fx,influenced,worldSeed,encounter,sampleRate,peak,rmsDb:20*Math.log10(Math.sqrt(sum/n)),hotFraction:hot/n};
 } finally {window.AudioContext=original.AudioContext;window.setInterval=original.setInterval;window.setTimeout=original.setTimeout;Math.random=original.random;history.replaceState(null,'',originalURL);}
}

// Measure added distortion with a sine wave below the protection knee.
export async function measureOutputColor() {
 const {peakGuardCurve,returnFilters}=await import('../src/mix.js');
 const render=async legacy=>{
  const ac=new OfflineAudioContext(1,48000*1.2,48000),osc=ac.createOscillator(),gain=ac.createGain(),guard=ac.createWaveShaper();
  osc.frequency.value=1000;gain.gain.value=.5;
  if(legacy){guard.curve=Float32Array.from({length:2048},(_,i)=>Math.tanh(1.05*(i/2047*2-1))/Math.tanh(1.05));guard.oversample='2x';}
  else{guard.curve=peakGuardCurve();guard.oversample='4x';}
  osc.connect(gain).connect(guard).connect(ac.destination);osc.start();
  const data=(await ac.startRendering()).getChannelData(0),start=4800,end=52800,n=end-start;
  let sin=0,cos=0;for(let i=start;i<end;i++){const a=2*Math.PI*1000*i/48000;sin+=data[i]*Math.sin(a);cos+=data[i]*Math.cos(a);}
  sin*=2/n;cos*=2/n;let residual=0;
  for(let i=start;i<end;i++){const a=2*Math.PI*1000*i/48000,d=data[i]-sin*Math.sin(a)-cos*Math.cos(a);residual+=d*d;}
  return 20*Math.log10(Math.sqrt(residual/n)/Math.hypot(sin,cos)*Math.SQRT2);
 };
 const oldDistortionDb=await render(true),distortionDb=await render(false),ac=new OfflineAudioContext(1,4800,48000),filters=returnFilters(ac);
 const frequencies=new Float32Array([40,1000]),hp=new Float32Array(2),lp=new Float32Array(2),phase=new Float32Array(2);
 filters.input.getFrequencyResponse(frequencies,hp,phase);filters.output.getFrequencyResponse(frequencies,lp,phase);
 const returnBassDb=20*Math.log10(hp[0]*lp[0]),returnMidDb=20*Math.log10(hp[1]*lp[1]);
 return {oldDistortionDb,distortionDb,returnBassDb,returnMidDb};
}
