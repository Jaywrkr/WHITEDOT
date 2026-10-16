// One electronic foundation. Each territory owns a band, kit and harmonic vocabulary.
const POOLS={
 floor:['rhodes','p_gutguitar','p_barkkeys','phasekeys','p_cellobody','p_feltmallet'],
 bass:['p_tinepiano','p_cellobody','resonantpluck','p_bassclarinet','p_gutguitar','p_feltmallet'],
 warm:['p_tinepiano','p_gutguitar','p_cellobody','clav','p_softhorn','p_tapepiano'],
 organic:['p_gutguitar','p_cellobody','p_panreed','kalimba','p_tinepiano','p_feltmallet'],
 machine:['p_barkkeys','phasekeys','p_fmharp','resonantpluck','p_cellobody','p_bassclarinet'],
 broken:['p_tinepiano','p_gutguitar','p_cellobody','resonantpluck','p_feltmallet','p_panreed'],
 melodic:['p_cellobody','p_tinepiano','p_gutguitar','phasekeys','p_panreed','p_feltmallet'],
 disco:['rhodes','p_softhorn','p_gutguitar','clav','p_cellobody','p_barkkeys'],
 calm:['p_tapepiano','p_cellobody','p_gutguitar','bamboowind','p_feltmallet','p_bassclarinet']
};
export function electronicEnsemble(region,kind,ensemble,seedOf){
 const h=seedOf(`electronic:ensemble:v2:${region.key}:${region.genre}`)>>>0,calm=['ambient','heart'].includes(region.genre),
  count=calm?1+h%3:ensemble===1?4+h%2:ensemble===2?6+h%2:8+h%3,
  order=calm?['motif','chords','air']:kind==='organic'?['kick','bass','motif','percussion','hats','chords','snare','counter','sequence','air']:['kick','bass','motif','snare','hats','chords','percussion','counter','sequence','air'],
  pool=POOLS[kind]||POOLS.floor;
 return Object.freeze({version:2,count,layers:Object.freeze(order.slice(0,count)),pool:Object.freeze([...pool]),
  kit:Object.freeze({seed:h,snareStyle:(h>>>23)%4,body:130+(h>>>3)%90,snap:1700+(h>>>10)%1400,tail:.09+(h>>>17)%10*.01,
   kick:40+(h>>>6)%16,metal:kind==='machine',dark:['dub','minimal','rominimal','microhouse'].includes(region.genre)})});
}
export function ensembleVoices(plan,lead,variant=0){
 const pool=plan.pool.filter(id=>id!==lead),at=(Number.isFinite(variant)?variant:0)%pool.length,
  voices=pool.slice(at).concat(pool.slice(0,at));
 return {chords:voices[0],counter:voices[1],sequence:voices[2],air:voices[3]};
}
export function electronicDrum(runtime,instrument,time,volume,kit){
 if(!kit||!['kick','snare','clap','hat','hatO','hatRoll','clapRoll','snareRoll'].includes(instrument))return false;
 const ac=runtime.ac;if(!ac)return false;
 if(instrument.endsWith('Roll')){
  const voice=instrument.startsWith('clap')?'clap':instrument.startsWith('snare')?'snare':'hat';
  for(let i=0;i<3;i++)electronicDrum(runtime,voice,time+(runtime.SIX||.125)*i/3,volume*(i===0?.8:.55),kit);
  return true;
 }
 const tone=(frequency,end,level,decay,type='sine')=>{const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(frequency,time);o.frequency.exponentialRampToValueAtTime(end,time+.055);runtime.env(g,time,.002,level,decay);o.connect(g).connect(runtime.bus);o.onended=()=>{o.disconnect();g.disconnect();};o.start(time);o.stop(time+decay+.05);};
 runtime.recordInstrument?.(instrument);
 if(instrument==='kick')tone(kit.kick*2.8,kit.kick,volume,.26+(kit.seed%4)*.025);
 else if(instrument.startsWith('snare')){
  const style=snareBody(kit);tone(kit.body*style.fall,kit.body,volume*style.body,style.decay,kit.metal?'triangle':'sine');
  runtime.noiseHit(time,'bandpass',kit.snap*style.tone,kit.dark?1.8:1,volume*style.noise,kit.tail*style.tail,false);
 }else if(instrument.startsWith('clap')){
  for(const offset of [0,.011,.024])runtime.noiseHit(time+offset,'bandpass',kit.snap*.85,1.1,volume*.42,offset?.035:kit.tail,false);
 }else runtime.noiseHit(time,'highpass',kit.dark?4300:5500+kit.seed%1600,.7,volume,instrument==='hatO'?.14:.035+(kit.seed%4)*.008,false);
 runtime.electronicDrumCue?.({instrument,time,kit:kit.seed});return true;
}

// Four dry regional snare bodies: wood, brush, skin and a short electronic gate.
const SNARE_BODIES=Object.freeze([
 {body:.7,noise:.32,fall:1.12,decay:.075,tail:.55,tone:.72},
 {body:.28,noise:.65,fall:1.15,decay:.11,tail:1.25,tone:.9},
 {body:.5,noise:.85,fall:1.3,decay:.145,tail:.85,tone:1},
 {body:.62,noise:.6,fall:1.5,decay:.09,tail:.45,tone:.82}
].map(Object.freeze));
export function snareBody(kit={}){const n=Number.isInteger(kit.snareStyle)?kit.snareStyle:Number.isInteger(kit.seed)?kit.seed:0;return SNARE_BODIES[(n%4+4)%4];}
