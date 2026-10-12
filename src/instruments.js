// Synthesized families: resonant partials, FM keys and filtered subtractive voices.
export const INSTRUMENT_SPECS={
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
 function playNewInstrument(id,m,time,volume) {
  const spec=INSTRUMENT_SPECS[id],ac=runtime.ac;if(!spec)return false;if(!ac)return true;
  const patch=runtime.activeInstrumentPatch,attack=Math.min(.12,(spec.attack||.008)*(patch?.attackScale||1)),decay=Math.min(1.3,spec.dec*(patch?.decayScale||1)),cut=spec.cut*(patch?.toneScale||1);
  const hz=runtime.hz(m),end=time+attack+decay+.12,f=ac.createBiquadFilter(),gain=ac.createGain();
  f.type=spec.formant?'bandpass':'lowpass';f.Q.value=spec.formant?2.2:patch?.resonance||.7;
  f.frequency.setValueAtTime(cut,time);f.frequency.exponentialRampToValueAtTime(cut*(spec.formant?.55:.45),time+Math.min(.25,decay));
  runtime.env(gain,time,attack,volume*(patch?.level||1),decay,true);f.connect(gain).connect(runtime.bus);
  if(spec.send){const send=ac.createGain();send.gain.value=spec.send;gain.connect(send).connect(runtime.verbIn);}
  spec.partials.forEach(([ratio,type,level],i)=>{
   const osc=ac.createOscillator(),levelGain=ac.createGain();osc.type=type;osc.frequency.value=hz*ratio;levelGain.gain.value=level*(i>0?(patch?.harmonics||1):1);if(i>0&&patch)osc.detune.value=(i%2?1:-1)*patch.widthCents;osc.connect(levelGain).connect(f);
   if(spec.fm&&i===0){const mod=ac.createOscillator(),depth=ac.createGain();mod.frequency.value=hz*spec.fm;depth.gain.setValueAtTime(hz*spec.index*(patch?.fmIndex||1),time);depth.gain.exponentialRampToValueAtTime(.1,time+decay*.75);mod.connect(depth).connect(osc.frequency);mod.start(time);mod.stop(end);}
   osc.start(time);osc.stop(end);
  });
  return true;
 }
 function guiro(time,volume){runtime.recordInstrument?.('guiro');for(let i=0;i<3;i++)runtime.noiseHit(time+i*.018,'bandpass',1800+i*180,1.2,volume*(1-i*.2),.025,false);}
 function timbale(time,volume){runtime.recordInstrument?.('timbale');runtime.tom(time,340,volume*.7);runtime.noiseHit(time,'bandpass',2600,2,volume*.25,.055,false);}
 Object.defineProperties(runtime,{playNewInstrument:{get:()=>playNewInstrument},guiro:{get:()=>guiro},timbale:{get:()=>timbale}});
}
