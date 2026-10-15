// Synthesized families: resonant partials, FM keys and filtered subtractive voices.
import {ADVANCED_INSTRUMENTS,createAdvancedPlayer} from './modular-synth.js';
import {TECHNIQUE_INSTRUMENTS,createTechniquePlayer} from './instrument-techniques.js';
export const INSTRUMENT_SPECS={
 ...ADVANCED_INSTRUMENTS,
 ...TECHNIQUE_INSTRUMENTS,
 analogpad:{partials:[[.996,'sawtooth',.18],[1.004,'triangle',.28],[2,'sine',.06]],cut:1800,attack:.11,dec:1.2,send:.12},
 phasekeys:{partials:[[1,'triangle',.6],[2,'sine',.09]],periodic:true,cut:2500,attack:.009,dec:.48,send:.08},
 fmglass:{fm:2,index:1.1,partials:[[1,'sine',.7]],cut:2100,attack:.008,dec:.7,send:.1},
 choir:{partials:[[.998,'sawtooth',.22],[1.002,'triangle',.35]],formant:true,cut:1450,attack:.08,dec:1,send:.1},
 resonantpluck:{partials:[[1,'sawtooth',.25],[1,'triangle',.4],[2,'sine',.06]],cut:2800,attack:.005,dec:.42,send:.06},
 velvetbass:{partials:[[1,'sine',.7],[1,'triangle',.15]],cut:550,attack:.018,dec:.5,send:0},
 granularair:{partials:[[1,'triangle',.3],[2,'sine',.08]],noise:.1,cut:1600,attack:.1,dec:.9,send:.1},
 orbitorgan:{partials:[[1,'sine',.45],[2,'triangle',.16],[3,'sine',.08],[4,'sine',.035]],cut:2300,attack:.02,dec:.6,send:.08},
 pad:{partials:[[.998,'triangle',.35],[1.002,'sine',.45],[2,'sine',.06]],cut:900,attack:.12,dec:1.2,send:.08},
 plucked:{partials:[[1,'triangle',.5],[2,'sine',.18],[3,'sine',.05]],cut:1700,attack:.006,dec:.65,send:.09},
 reed:{fm:.5,index:.25,partials:[[1,'triangle',.55],[2,'sine',.12]],cut:1350,formant:true,attack:.035,dec:.55,send:.1},
 membrane:{partials:[[1,'sine',.6],[1.59,'sine',.13],[2.14,'sine',.07]],cut:1700,attack:.004,dec:.22,send:.06},
 bowed:{partials:[[.999,'sawtooth',.2],[1.001,'triangle',.3]],cut:1100,attack:.11,dec:.85,tremolo:4.2,send:.12},
 hollow:{partials:[[1,'square',.25],[2,'triangle',.12]],cut:950,formant:true,attack:.015,dec:.36,send:.08},
 logdrum:{fm:.5,index:2.2,partials:[[1,'sine',.9]],cut:500,dec:.24,send:0},
 steel:{partials:[[1,'sine',.65],[2.02,'sine',.2],[3.1,'sine',.08]],cut:2400,dec:.48,send:.16},
 kalimba:{fm:3,index:.7,partials:[[1,'sine',.8]],cut:2200,dec:.32,send:.12},
 rhodes:{fm:1,index:.65,partials:[[1,'sine',.8],[2,'sine',.08]],cut:1900,dec:.65,send:.16},
 strings:{partials:[[.997,'sawtooth',.3],[1.003,'sawtooth',.3]],cut:1500,attack:.08,dec:.95,send:.2},
 brass:{partials:[[.998,'sawtooth',.28],[1.002,'square',.2]],cut:2000,attack:.025,dec:.3,send:.09},
 clav:{partials:[[1,'triangle',.55],[2,'square',.1]],cut:2600,dec:.16,send:.05},
 rubber:{partials:[[1,'triangle',.65],[1,'sawtooth',.12]],cut:600,dec:.24,send:0},
 machine:{fm:1.5,index:1.2,partials:[[1,'sine',.8]],cut:950,dec:.28,send:0},
 vocalform:{partials:[[1,'sawtooth',.4],[1.005,'sawtooth',.15]],cut:1800,formant:true,attack:.025,dec:.38,send:.08},
 metalkeys:{fm:2.4,index:.45,partials:[[1,'sine',.65]],cut:2000,dec:.2,send:.07}
};
export function initialize(runtime) {
 const advanced=createAdvancedPlayer(runtime);
 const techniques=createTechniquePlayer(runtime);
 let held=null,heldKey=null,nearAt=0;
 function techniqueTick(){
  techniques.tick();const id=runtime.labSynth,spec=TECHNIQUE_INSTRUMENTS[id],ac=runtime.ac,
   blocked=!ac||ac.state!=='running'||runtime.S.mode!=='world'||globalThis.document?.hidden||globalThis.document?.querySelector?.('.modal:not([hidden])')||(runtime.musicVolume?.()??1)<=0;
  const source=!blocked&&spec?.sustain&&runtime.labMode?runtime.livingNear?.(90).find(o=>o.id?.startsWith('living:lab:')&&Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<42):null;
  const key=source?source.id+':'+id:null;
  if(key!==heldKey||!source){held?.release();held=null;heldKey=key;nearAt=ac?.currentTime||0;}
  if(!source)return;
  if(held&&(held.released||held.end<=ac.currentTime))held=null;
  if(!held&&ac.currentTime-nearAt>.35){const d=runtime.regionOfPos(source.x,source.y),voice=runtime.getVoice('living:'+source.kind,d,source),degree=((runtime.MU.deg+voice.degree)%7+7)%7;
   let note=57+(runtime.MU.tr||0)+d.scale[degree];while(note>69)note-=12;while(note<45)note+=12;
   held=techniques.hold(id,note,ac.currentTime+.01,.035);if(held)runtime.soundCue?.(source,voice.role,ac.currentTime+.01);
  }
 }
 const noiseBuffers=new WeakMap();
 function playNewInstrument(id,m,time,volume,articulation=null) {
  const spec=INSTRUMENT_SPECS[id],ac=runtime.ac;if(!spec)return false;if(!ac)return true;
  if(spec.technique)return techniques.play(id,m,time,volume,articulation||{});
  if(spec.engine)return advanced(id,m,time,volume,articulation||{});
  const patch=runtime.activeInstrumentPatch,attack=Math.min(.12,(spec.attack||.008)*(patch?.attackScale||1)*(articulation?.attackScale||1)),decay=Math.min(1.3,spec.dec*(patch?.decayScale||1)*(articulation?.decayScale||1)),cut=spec.cut*(patch?.toneScale||1)*(articulation?.toneScale||1);
  const hz=runtime.hz(m),end=time+attack+decay+.12,f=ac.createBiquadFilter(),gain=ac.createGain(),nodes=[f,gain],sources=[];
  f.type=spec.formant?'bandpass':'lowpass';f.Q.value=spec.formant?2.2:patch?.resonance||.7;
  f.frequency.setValueAtTime(cut,time);f.frequency.exponentialRampToValueAtTime(cut*(spec.formant?.55:.45),time+Math.min(.25,decay));
  runtime.env(gain,time,attack,volume*(patch?.level||1),decay,true);f.connect(gain).connect(runtime.bus);
  const tremolo=articulation?.tremolo||spec.tremolo;if(tremolo){const lfo=ac.createOscillator(),depth=ac.createGain();nodes.push(lfo,depth);lfo.frequency.value=Math.max(.5,Math.min(8,tremolo));depth.gain.value=volume*.035;lfo.connect(depth).connect(gain.gain);lfo.start(time);lfo.stop(end);}
  if(spec.send){const send=ac.createGain();nodes.push(send);send.gain.value=spec.send;gain.connect(send).connect(runtime.verbIn);}
  if(spec.noise){let buffer=noiseBuffers.get(ac);if(!buffer){buffer=ac.createBuffer(1,Math.ceil(ac.sampleRate*.15),ac.sampleRate);const data=buffer.getChannelData(0);let h=917;for(let i=0;i<data.length;i++){h=(Math.imul(h,1664525)+1013904223)>>>0;data[i]=h/2147483648-1;}noiseBuffers.set(ac,buffer);}const grain=ac.createBufferSource(),level=ac.createGain();grain.buffer=buffer;grain.loop=true;level.gain.value=spec.noise;grain.connect(level).connect(f);nodes.push(grain,level);sources.push(grain);grain.start(time);grain.stop(end);}
  spec.partials.forEach(([ratio,type,level],i)=>{
   const osc=ac.createOscillator(),levelGain=ac.createGain();nodes.push(osc,levelGain);sources.push(osc);osc.type=type;if(spec.periodic&&ac.createPeriodicWave){const real=new Float32Array(6),imag=new Float32Array([0,1,.3,.15,.08,.04]);for(let k=2;k<imag.length;k++)imag[k]*=patch?.program?.harmonics??1;osc.setPeriodicWave(ac.createPeriodicWave(real,imag));}osc.frequency.value=hz*ratio;if(Number.isFinite(articulation?.glide)){osc.frequency.setValueAtTime(hz*ratio*Math.pow(2,Math.max(-1,Math.min(1,articulation.glide))/12),time);osc.frequency.exponentialRampToValueAtTime(hz*ratio,time+.07);}levelGain.gain.value=level*(i>0?(patch?.harmonics||1)*(patch?.program?.harmonics??1):1);if(i>0&&patch)osc.detune.value=(i%2?1:-1)*patch.widthCents;osc.connect(levelGain).connect(f);
   if(spec.fm&&i===0){const mod=ac.createOscillator(),depth=ac.createGain();nodes.push(mod,depth);mod.frequency.value=hz*spec.fm;depth.gain.setValueAtTime(hz*spec.index*(patch?.fmIndex||1)*(patch?.program?.fmIndex??1),time);depth.gain.exponentialRampToValueAtTime(.1,time+decay*.75);mod.connect(depth).connect(osc.frequency);mod.start(time);mod.stop(end);}
   osc.start(time);osc.stop(end);
  });
  if(sources[0])sources[0].onended=()=>nodes.forEach(n=>n.disconnect?.());
  return true;
 }
 function guiro(time,volume){runtime.recordInstrument?.('guiro');for(let i=0;i<3;i++)runtime.noiseHit(time+i*.018,'bandpass',1800+i*180,1.2,volume*(1-i*.2),.025,false);}
 function timbale(time,volume){runtime.recordInstrument?.('timbale');runtime.tom(time,340,volume*.7);runtime.noiseHit(time,'bandpass',2600,2,volume*.25,.055,false);}
 Object.defineProperties(runtime,{playNewInstrument:{get:()=>playNewInstrument},holdInstrument:{get:()=>techniques.hold},releaseHeldInstruments:{get:()=>techniques.releaseHeld},techniqueTick:{get:()=>techniqueTick},activeTechniqueCount:{get:()=>techniques.active},guiro:{get:()=>guiro},timbale:{get:()=>timbale}});
}
