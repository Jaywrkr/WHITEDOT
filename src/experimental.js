// Música experimental en ciertos lugares: el pulso se afloja o desaparece y entran texturas.
// Modos: «Sin pulso» (eventos libres fuera de la rejilla), «Métrica impar» (ciclos de 5/7/11/13 contra el compás),
// «Fallas» (ráfagas cortadas) y «Microtonos» (racimos desafinados que laten). Nivel 0..1:
// <0.4 casi nada; 0.4–0.7 la batería se adelgaza; ≥0.7 sin batería ni pista: solo el lugar raro.
import {experimentalZone,experimentalLevel,EXPERIMENTAL_NAMES,euclid,ODD_CYCLES,microCents} from './expansion-music.js';

export function initialize(runtime){
 const S=()=>runtime.S;let zoneKey=null,zone={level:0,mode:null},level=0,cycle=0,announced=new Set();
 function current(){
  const d=runtime.MU.dnaT;if(!runtime.inWorld()||!d||(S().layer||'superficie')!=='superficie'){zone={level:0,mode:null};zoneKey=null;return zone;}
  if(d.key!==zoneKey){zoneKey=d.key;zone=experimentalZone(d,runtime.BIOMES[d.z]?.id,runtime.seedOf,runtime.rng);cycle=0;
   if(zone.level>=.4&&!announced.has(d.key)){announced.add(d.key);runtime.toast(`<em>Zona experimental</em> · ${EXPERIMENTAL_NAMES[zone.mode]}`);
    if(!S().help.experimental){S().help.experimental=true;runtime.say(runtime.VOZ.experimental,'Zona experimental');}runtime.unlock('experimental1');}}
  return zone;
 }
 function compute(){const z=current();level=experimentalLevel(z,{hour:new Date().getHours(),quietStage:runtime.quietState?.stage||0});return level;}
 // ---------- síntesis propia (corta, sin drones) ----------
 const hzOf=(midi,cents=0)=>440*Math.pow(2,(midi-69)/12+cents/1200);
 function tone(t,midi,cents,dur,v,{type='sine',swell=false,pan=0}={}){
  const ac=runtime.ac;if(!ac)return;const o=ac.createOscillator(),g=ac.createGain(),p=ac.createStereoPanner?ac.createStereoPanner():null,sv=ac.createGain();
  o.type=type;o.frequency.setValueAtTime(hzOf(midi,cents),t);g.gain.setValueAtTime(.0001,t);
  if(swell){g.gain.exponentialRampToValueAtTime(v,t+dur*.85);g.gain.exponentialRampToValueAtTime(.0001,t+dur);}   // «al revés»: sube lento y corta
  else{g.gain.exponentialRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur);}
  const out=p?(p.pan.value=pan,o.connect(g).connect(p),p):(o.connect(g),g);out.connect(runtime.bus);sv.gain.value=.5;out.connect(sv).connect(runtime.verbIn);
  o.start(t);o.stop(t+dur+.05);
 }
 const scaleNote=(d,i,oct=0)=>{const sc=d.scale||[0,2,4,5,7,9,11],tr=(runtime.BIOMES[d.z]?.tr||0)+(d.trOff||0);return 57+tr+sc[((i%sc.length)+sc.length)%sc.length]+12*(oct+Math.floor(i/sc.length));};
 function step(s,bar,time){
  if(!S().sound||runtime.ac?.state!=='running'||document.hidden)return;const x=compute(),d=runtime.MU.dnaT;if(x<.3||!d)return;
  const r=Math.random,six=runtime.SIX,seed=runtime.seedOf(`exp:${d.key}`),v=.025+x*.035;
  if(zone.mode==='libre'){   // sin rejilla: cuándo suena no depende del compás
   if(r()<.1*x){const t=time+r()*six*3,n=Math.floor(r()*7);tone(t,scaleNote(d,n,r()<.3?1:0),microCents(seed,n,x*.4),.6+r()*2.4,v,{type:r()<.5?'sine':'triangle',swell:r()<.4,pan:r()*1.6-.8});}
   if(r()<.04*x)runtime.noiseHit?.(time+r()*six*2,'bandpass',300+r()*3000,8,v*.6,.08+r()*.3,true);
  }else if(zone.mode==='irregular'){   // dos ciclos impares que se cruzan con el compás
   const [k1,n1]=ODD_CYCLES[seed%4],[k2,n2]=ODD_CYCLES[(seed+1)%4],a=euclid(k1,n1)[cycle%n1],b=euclid(k2,n2,1)[cycle%n2];cycle++;
   if(a)runtime.wood?.(time,v*1.6);if(b)runtime.tom?.(time,90+((cycle*37)%5)*22,v*2.2);
   if(a&&b)tone(time,scaleNote(d,cycle%5,1),0,.25,v,{type:'triangle',pan:(cycle%3-1)*.6});
  }else if(zone.mode==='glitch'){   // ráfagas de fallas: repeticiones rapidísimas que se cortan
   if(r()<.07*x){const n=3+Math.floor(r()*5),dt=six/(r()<.5?2:4),m=scaleNote(d,Math.floor(r()*7),1);for(let i=0;i<n;i++){runtime.noiseHit?.(time+i*dt,'highpass',5000+r()*4000,1,v*.7,.015);if(i%2===0)tone(time+i*dt,m+(i%3)*12,0,.05,v*.8,{type:'square',pan:r()*2-1});}}
  }else if(zone.mode==='micro'){   // racimos desafinados que laten entre sí
   if(s===0&&bar%2===0){const base=Math.floor(r()*5);for(let i=0;i<3;i++)tone(time+i*.03,scaleNote(d,base+i*2),microCents(seed,base+i,x),six*16*(1.2+r()),v*.8,{type:'sine',swell:true,pan:i-1});}
   if(r()<.05*x)tone(time+r()*six*2,scaleNote(d,Math.floor(r()*7),1),microCents(seed,7,x)+50,.8,v*.6,{type:'triangle'});
  }
 }
 Object.defineProperties(runtime,{experimentalLevel:{get:()=>()=>level},experimentalZone:{get:()=>zone},experimentalStep:{get:()=>step}});
}
