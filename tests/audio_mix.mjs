// Real Web Audio render of the scheduler, with a virtual clock and deterministic noise.
export async function renderMix(genre='minimal', {dense=false,soft=false,fx=false,sampleRate=48000,influenced=false,worldSeed='',encounter=null,deep=false,installation=null,trail=false,glass=false,generation=1,ecology=false,testInstrument=null,scene=null,celebration=false,identityKey='0,0',worldPoint=null,actorEcology=false,renderSeconds=10,savedMemory=null,pulseVoice=null,livingMusic=false,evolutionBar=null}={}) {
 const modules=await Promise.all(['data','progress','world','audio','foreground','voices','instruments','patches','effects','spatial','influence','blobs','living-composition','world-memory','performance'].map(id=>import(`../src/${id}.js`)));
 if(!Number.isFinite(renderSeconds)||renderSeconds<5||renderSeconds>30)throw Error('Invalid render duration');
 const r=Object.create(null),duration=renderSeconds,context=new OfflineAudioContext(2,duration*sampleRate,sampleRate);
 const storageDescriptor=Object.getOwnPropertyDescriptor(window,'localStorage'),renderStorage=new Map();
 const original={AudioContext:window.AudioContext,setInterval:window.setInterval,setTimeout:window.setTimeout,random:Math.random};
 const performanceNotes=[],labPerformance=[],lessonNotes=[],walkerNotes=[],houseNotes=[],cultureNotes=[],foregroundNotes=[],materialStrikes=[],instrumentHits={},petNotes=[],percussionNotes=[],celebrationNotes=[],advancedNotes=[],modularGraphs=[];let instrumentNotes=0;let clock=0,schedule,trailNotes=0,glassNotes=0,ecologyNotes=0,rendering=false,deferredDisconnects=0;const glassRoles=new Set();const originalURL=location.href;
 // The scheduler advances virtually before offline rendering starts. Its expired
 // patches must leave the bookkeeping cache, but their graph must survive until
 // those earlier notes have actually rendered. Live AudioContext needs no override.
 const proxy=new Proxy(context,{get(target,key){if(key==='currentTime')return clock;if(key==='state')return 'running';const value=Reflect.get(target,key,target);
  if(typeof value==='function'&&String(key).startsWith('create'))return (...args)=>{const node=value.apply(target,args);if(node?.disconnect){const disconnect=node.disconnect.bind(node);node.disconnect=(...ports)=>{if(rendering)disconnect(...ports);else deferredDisconnects++;};}return node;};
  return typeof value==='function'?value.bind(target):value;}});
 try {
  Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>renderStorage.get(k)??null,setItem:(k,v)=>renderStorage.set(k,String(v)),removeItem:k=>renderStorage.delete(k)}});
  if(generation===2){const url=new URL(location.href);url.searchParams.set('testSeed',worldSeed||'humedal-01');url.searchParams.set('layout','classic');url.searchParams.set('generation','2');history.replaceState(null,'',url);}
  window.AudioContext=function(){return proxy;};window.setInterval=fn=>{schedule=fn;return 0;};window.setTimeout=()=>0;
  for(const m of modules.slice(0,2))m.initialize(r);if(savedMemory)r.S.worldMemory=structuredClone(savedMemory);r.S.worldSeed=worldSeed;modules[2].initialize(r);
  Math.random=r.rng(r.seedOf('mix-render:v1'));
  for(const m of modules.slice(3))m.initialize(r);
  r.performanceCue=n=>performanceNotes.push(n);r.labPerformanceCue=n=>{if(labPerformance.length<512)labPerformance.push(n);};
  r.cultureNoteCue=n=>cultureNotes.push(n);r.foregroundNoteCue=n=>{if(foregroundNotes.length<128)foregroundNotes.push(n);};r.materialStrikeCue=n=>materialStrikes.push(n);r.advancedNoteCue=n=>advancedNotes.push(n);r.modularGraphCue=signature=>modularGraphs.push(signature);
  const origin=r.regionOfPos(worldPoint?.x??900,worldPoint?.y??900),G=r.GEN[genre];
  if(worldPoint&&origin.genre!==genre)throw Error('Audio destination does not match its native genre');
  r.S.mode='world';r.S.livingMusic=livingMusic;r.S.softMusic=soft;r.S.sound=true;r.S.wx=worldPoint?.x??900;r.S.wy=worldPoint?.y??900;
  r.MU.dnaT=worldPoint?{...origin}:{...origin,key:identityKey,genre,bpm:(G.bpm[0]+G.bpm[1])/2,track:{...origin.track,bassI:G.bassI,hookI:G.hookP[0]}};
  if(pulseVoice)r.S.cube={...r.S.cube,voice:pulseVoice};
  r.MU.E=dense?.8:.45;r.MU.vit=1;r.MU.vari=2;r.audio();
  if(influenced){r.activeLayerRegion=()=>r.MU.dnaT;for(const k of ['bass','groove','melody'])r.driveInfluence(r.MU.dnaT,k,1,3);for(let i=0;i<100;i++)r.influenceTick(.05,false);}
  if(glass){
   r.soundCue=(source,role)=>{if(source?.id?.startsWith('glass:')){glassNotes++;glassRoles.add(role);}};
   origin.genre=genre;origin.track={...r.MU.dnaT.track};r.$=id=>document.getElementById(id);r.unlock=()=>{};r.stopAutopilot=()=>{};document.querySelectorAll('.modal').forEach(m=>m.hidden=true);
   const interactions=await import('../src/interactions.js');interactions.initialize(r);const {initialize}=await import('../src/glass.js');initialize(r);const site=r.nearbyGlass(5000).find(s=>s.id==='glass:0,0');if(!site)throw Error('missing glass mix site');
   r.S.wx=site.x;r.S.wy=site.y;for(let i=0;i<3;i++){site.lastInput=-Infinity;r.turnGlass(site,i,i*.3);}r.S.glassSites[site.id]={seen:true,angles:site.angles};
  }
  if(fx){r.fx.verbSend.gain.value=.7;r.fx.delaySend.gain.value=.5;r.fx.fb.gain.value=.72;}
  if(encounter){
   // The actual encounter scheduler asks the world for its region, so its cached region must match the tested genre.
   origin.genre=genre;origin.track={...r.MU.dnaT.track};
   document.querySelectorAll('.modal').forEach(m=>m.hidden=true);
   const url=new URL(location.href);url.searchParams.set('encounter',encounter);history.replaceState(null,'',url);
   r.S.previewSeed='audio-review';r.S.wx=r.S.wy=r.REG*r.WCH/2;
   const {initialize}=await import('../src/encounters.js');initialize(r);r.unlock=()=>{};const depth=await import('../src/encounter-depth.js');depth.initialize(r);r.encounterTick(.05,false);
   const object=r.encounterObjects.find(o=>o.id==='preview:'+encounter);if(!object)throw Error('missing audio encounter '+encounter);
   const {FAMILIES}=await import('../src/encounter-families.js');FAMILIES[encounter].drag(object.state,70,-60,200);object.state.used=true;object.state.active=999;
   if(deep){
    const model=await import('../src/encounter-depth-model.js');
    if(encounter==='weaver'){const nodes=r.depthAnchors(object);r.depthConnect(object,nodes[0],nodes[1]);r.depthConnect(object,nodes[1],nodes[2]);}
    if(encounter==='box'){object.state.a=.9;for(const part of object.state.box.parts){part.enabled=true;part.steps.fill(0);}}
    if(encounter==='animal'){object.state.dialogue=model.startDialogue();for(const [step,degree]of [[0,0],[4,2],[12,4],[24,2]])model.captureDialogue(object.state.dialogue,{step,degree});model.finishDialogue(object.state.dialogue);}
   }
  }
  if(scene){r.recordInstrument=id=>{instrumentHits[id]=(instrumentHits[id]||0)+1;};
   document.querySelectorAll('.modal').forEach(m=>m.hidden=true);r.$=id=>document.getElementById(id);r.W=390;r.H=844;r.unlock=()=>{};r.toast=()=>{};r.say=()=>{};r.burst=()=>{};r.stopAutopilot=()=>{};
   origin.genre=genre;origin.track={...r.MU.dnaT.track};
   if(!r.beatSoon){const m=await import('../src/interactions.js');m.initialize(r);}
   const {initialize:body}=await import('../src/body.js');body(r);r.bodyTick(.025);
   if(['living:','lesson:','synth:','filter:'].some(prefix=>scene.startsWith(prefix))){r.labLiving=scene.startsWith('living:')||scene.startsWith('lesson:')?scene.slice(7):'breath-tree';r.labSynth=scene.startsWith('synth:')?scene.slice(6):null;r.labFilter=scene.startsWith('filter:')?scene.slice(7):null;const synth=await import('../src/living-synthesis.js'),life=await import('../src/living.js');synth.initialize(r);life.initialize(r);if(actorEcology){for(const name of ['living-behavior','living-ecology']){const m=await import('../src/'+name+'.js');m.initialize(r);}}const o=r.livingNear(1000)[0];r.S.wx=o.x;r.S.wy=o.y;r.livingNoteCue=n=>{instrumentHits['living:'+n.role]=(instrumentHits['living:'+n.role]||0)+1;};}
   if(scene.startsWith('lesson:')){const m=await import('../src/lab-learning.js');m.initialize(r);r.labLearningNoteCue=n=>lessonNotes.push(n);r.beginLabLearning();const o=r.livingNear(1000)[0];r.labLearningHear('living:'+o.kind,0,0,r.MU.dnaT,o,'player');}
   if(scene.startsWith('rhythm:')){r.labRhythm=scene.slice(7);const m=await import('../src/percussion.js');m.initialize(r);const o=r.nearbyPercussion(1e6)[0];r.S.wx=o.x-70;r.S.wy=o.y;r.percussionCue=n=>percussionNotes.push(n);}
   if(scene.startsWith('pet:')){const {createPet}=await import('../src/pet-model.js');r.S.pet=createPet(scene.split(':')[1],123);r.S.pet.seconds=6000;r.S.pet.places=Array.from({length:20},(_,i)=>i+',0');const m=await import('../src/pet.js');m.initialize(r);r.petState.ready=true;r.petState.x=r.S.wx+50;r.petState.y=r.S.wy+24;if(scene.endsWith(':idle'))r.petState.sleep=30;r.petNoteCue=n=>petNotes.push(n);}
   if(scene.startsWith('heritage:')){const [,culture,index]=scene.split(':');r.labCulture=culture;const m=await import('../src/cultures.js');m.initialize(r);r.S.cultures.collections[culture]=3;const site=r.cultureHome(),{culturalResonators}=await import('../src/heritage.js'),p=culturalResonators(site,3)[Number(index)];r.S.wx=p.x;r.S.wy=p.y;}
   if(scene==='relic'){const {relicAt,initialize}=await import('../src/relics.js');initialize(r);let site;for(let x=2;x<500&&!site;x++)site=relicAt(x,1,r.WCH,r.seedOf,r.rng);if(!site)throw Error('Missing relic');r.S.relicSites={[site.id]:{day:r.S.todayKey,name:site.name}};r.S.wx=site.x;r.S.wy=site.y;}
   if(scene.startsWith('culture:')){r.labCulture=scene.slice(8);const m=await import('../src/cultures.js');m.initialize(r);const site=r.cultureHome();r.S.wx=site.x;r.S.wy=site.y;}
   if(scene==='house'||scene==='garden'||scene==='garden-birth'){const {HOUSE_OBJECTS,normalizeHouse}=await import('../src/house-model.js'),h=normalizeHouse({objects:HOUSE_OBJECTS.map((d,i)=>({kind:d.id,room:['sala','jardin','azotea','sotano'][i%4],x:(i%16)/16,y:(i%7)/7}))},14);r.S.mode='studio';r.houseActive=()=>true;r.currentHouse=()=>h;r.houseAudioCue=n=>houseNotes.push(n);if(scene==='garden'||scene==='garden-birth'){h.objects=[];r.S.house=h;r.rareCards=['bajo','perc','acorde','lead'].map((role,i)=>({id:'garden:'+i,type:'living:'+['deer','turtle','manta','moth'][i],context:{role,instrument:['reedbass','handslap','duskpad','silkpluck'][i]}}));r.S.collectionGarden={version:1,cards:r.rareCards.map(c=>c.id),sets:scene==='garden-birth'?[{name:'earned'}]:[]};r.$=id=>document.getElementById(id);const garden=await import('../src/collection-garden.js');garden.initialize(r);}const m=await import('../src/house-audio.js');m.initialize(r);}
   if(scene==='mirror'){const m=await import('../src/mirrors.js');m.initialize(r);const site=r.nearbyMirrors(5000).find(s=>s.id==='mirror:0,0');r.S.wx=site.x;r.S.wy=site.y;site.solution.forEach((a,i)=>r.turnMirror(site,i,a));}
   if(scene.startsWith('phenomenon:')){const m=await import('../src/phenomena.js');m.initialize(r);let found=null;for(let x=-15;x<15&&!found;x++){r.S.wx=x*900+450;r.S.wy=450;found=r.nearbyPhenomena(1200).find(o=>o.kind===scene.slice(11));}if(!found)throw Error('Missing percussion phenomenon');r.S.wx=found.x;r.S.wy=found.y;r.testPhenomenon=found;}
   if(scene==='birds'){const m=await import('../src/vida.js');m.initialize(r);const f=r.nearbyFlocks(5000).find(f=>f.region.key==='0,0');f.species='grulla';f.trust=1;r.S.wx=f.x;r.S.wy=f.y;}
   if(scene.startsWith('walker:')){const {initialize,WALKER_FORMS}=await import('../src/walker-forms.js');initialize(r);const f=WALKER_FORMS[Number(scene.slice(7))];if(!f)throw Error('Invalid walker form');r.MU.walkerFollowers=[{id:'walker:mix:'+f.id,x:r.S.wx+45,y:r.S.wy+15,hx:r.S.wx+45,hy:r.S.wy+15,follow:30,walkerForm:f}];r.walkerNoteCue=n=>walkerNotes.push(n);}
   if(scene==='quiet'){const m=await import('../src/quietud.js');m.initialize(r);r.quietState.stage=4;}
   if(scene.startsWith('power:')){const m=await import('../src/cajas.js');m.initialize(r);r.givePower(scene.slice(6));r.MU.near=Array.from({length:8},(_,i)=>({x:r.S.wx+Math.cos(i)*70,y:r.S.wy+Math.sin(i)*70,snd:t=>r.playVoice('arbol',i,t,r.MU.dnaT,false,.4)}));}
   if(scene.startsWith('experimental:')){r.labMode=true;r.labExperimental={level:.8,mode:scene.slice(13)};const m=await import('../src/experimental.js');m.initialize(r);}
  }
  const sources=Array.from({length:8},(_,i)=>({x:(trail||worldPoint?r.S.wx:900)+10*i,y:trail||worldPoint?r.S.wy:900,id:`mix:${i}`}));
  for(let tick=0;tick<duration/.025;tick++){
   clock=tick*.025;if(scene==='performance'&&tick===60)r.performanceReply({id:'performance:specimen',kind:'moth',variant:25,x:r.S.wx,y:r.S.wy,homeX:r.S.wx,homeY:r.S.wy,phrase:[],energy:1},clock+.13,r.MU.dnaT);if(tick===40&&Number.isInteger(evolutionBar)&&evolutionBar>=0)r.MU.step=evolutionBar*16;if(r.testPhenomenon&&tick%80===60)r.triggerPhenomenon(r.testPhenomenon,clock+.13,'player');if(scene==='storm'&&tick%80===60)r.thunder(clock+.13,{x:r.S.wx,y:r.S.wy});if(celebration&&tick===60){const {playBoxCelebration}=await import('../src/celebration-audio.js');r.celebrationAudioCue=n=>celebrationNotes.push(n);playBoxCelebration(r,Math.ceil((clock+.13)/(r.SIX*2))*(r.SIX*2),r.MU.dnaA||r.MU.dnaT);}if(scene?.startsWith('rhythm:')){const o=r.nearbyPercussion(1e6)[0];r.S.wx=o.x+(tick%120<90?0:-70);r.S.wy=o.y;}if(scene==='power:pincel')r.S.wx+=4;if(scene){r.bodyTick(.025);r.livingTick?.(.025);r.percussionTick?.(.025);if(scene?.startsWith('rhythm:'))r.influenceTick?.(.025,false);r.cajasTick?.(.025);r.cultureTick?.(.025);r.relicEchoTick?.();r.petTick?.(.025);if(scene==='power:cometa')r.body.speed=120;}if(testInstrument&&tick%8===0){const {compositionFrame}=await import('../src/composition.js');r.withInstrumentPatch('track',r.MU.dnaT,{instrument:testInstrument,role:'lead'},null,clock+.13,()=>r.playNewInstrument(testInstrument,60+(tick%3)*2,clock+.13,.035,compositionFrame(genre,Math.floor(tick/40),2)));instrumentNotes++;}if(trail)r.trailTick(.025,false);if(encounter)r.encounterTick(.025,false);schedule();
   if(ecology&&tick%16===0)sources.slice(0,4).forEach((source,i)=>{r.playVoice('ecology:'+['reed','pod','lichen','stone'][i]+':'+['bass','groove','space','groove'][i],i,clock+.13,r.MU.dnaT,false,.5,source,'player');ecologyNotes++;});
   if(dense&&tick%10===0)sources.forEach((source,i)=>r.playVoice(worldSeed?'forma:'+r.MU.dnaT.species[i%r.MU.dnaT.species.length].id:['arbol','cristal','pulso','luz'][i%4],i,clock+.13,r.MU.dnaT,true,.9,source,scene?'player':'ambient'));
  }
  rendering=true;const buffer=await context.startRendering(),data=Array.from({length:2},(_,i)=>buffer.getChannelData(i));
  let peak=0,sum=0,hot=0,n=0;
  for(const samples of data)for(let i=sampleRate;i<samples.length;i++){const value=samples[i];if(!Number.isFinite(value))throw Error('nonfinite rendered audio');peak=Math.max(peak,Math.abs(value));sum+=value*value;hot+=Math.abs(value)>.98;n++;}
  if(window.__mixProgress)await window.__mixProgress({genre,scene,identity:r.MU.radio?.identity?.id,dense,soft,peak});
  return {performanceNotes,labEvolution:r.MU.radio?.labEvolution,labPerformance,lessonNotes,labBand:r.MU.radio?.labScore?.id,...(scene?.startsWith('walker:')?{walkerNotes}:{}),...(['house','garden','garden-birth'].includes(scene)?{houseNotes}:{}),...(pulseVoice?{pulseVoice,pulseRouting:r.getVoice('pulso',r.MU.dnaT)}:{}),cultureNotes,foregroundNotes,materialStrikes,hybrid:r.MU.radio?.hybrid?.id,advancedNotes,modularGraphs,actorSeconds:r.S.livingSeconds||0,ecologyPhase:r.livingEnvironment?.phase,actorIntent:r.livingNear?.(1000)[0]?.intent,identity:r.MU.radio?.identity?.id,worldFamily:r.MU.radio?.identity?.worldFamily,hookI:r.MU.radio?.hookI,brightness:r.MU.radio?.grammar?.brightness,deferredDisconnects,...(celebration?{celebrationNotes}:{}),scene,filterMotion:r.livingNear?.(1000)[0]?.filterMotion,instrumentHits,petNotes,percussionNotes,cultureHeard:Object.values(r.S.cultures?.sites||{}).some(e=>e.heard),testInstrument,instrumentNotes,genre,dense,soft,fx,influenced,worldSeed,generation,ecology,ecologyNotes,encounter,deep,installation,trail,glass,trailNotes,glassNotes,glassRoles:[...glassRoles],sampleRate,peak,rmsDb:20*Math.log10(Math.sqrt(sum/n)),hotFraction:hot/n};
 } finally {if(storageDescriptor)Object.defineProperty(window,'localStorage',storageDescriptor);else delete window.localStorage;window.AudioContext=original.AudioContext;window.setInterval=original.setInterval;window.setTimeout=original.setTimeout;Math.random=original.random;history.replaceState(null,'',originalURL);}
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
