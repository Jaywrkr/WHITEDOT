import {phraseAccent} from './composition.js';
import {musicalCharacter,hookPitch,inRegister} from './musical-character.js';
import {peakGuardCurve,returnFilters} from './mix.js';
import {REFERENCE_GENRES,referenceRhythm} from './references.js';
import {RHYTHM_GENRES,rhythmPattern} from './rhythms.js';
import {chooseNearbySource} from './spatial.js';
import {harmonicDegree,createVoiceCurator} from './grammar.js';
import { createRadio } from './radio.js';

// Motor musical, síntesis y programación de Web Audio.
export function initialize(runtime) {
  /* ---------- música generativa ----------
     La región compone por frases y secciones aunque estés quieto; tu movimiento
     añade energía. Cada zona conserva su escala, género y timbres. */
  const A=57;
  const NEXTD={0:[5,3,6,2],1:[4,6,0],2:[5,3,6],3:[0,6,4,1],4:[0,5,3],5:[2,6,3,0],6:[2,0,5]};
  const UPD=[2,6,5,4],DOWND=[3,5,0,1];
  const CELLS=[[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],[1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],[0,0,1,0,0,0,1,0,0,0,1,0,0,0,2,0],[1,0,0,1,0,0,2,0,0,0,1,0,0,2,1,0]];
  const ACID=[1,0,1,1,0,1,0,2,1,0,1,0,2,1,0,1];
  const TIMBRE=[
   {r:2,w:"triangle",h:.04,dec:.5,send:.35},
   {r:4,w:"sine",h:.12,dec:.25,send:.5},
   {r:2,w:"triangle",h:0,dec:1.2,send:.7},
   {r:3,w:"triangle",h:.15,dec:.18,send:.3},
   {r:2.76,w:"sine",h:.35,dec:1.4,send:.6},
   {r:1.006,w:"sawtooth",h:.25,dec:.28,send:.3}
  ];
  let BPM=96,SIX=60/BPM/4;
  const KB={llanura:.3,bosque:.4,lago:.1,ruinas:.5,jardin:.5,dunas:.4,cristales:.6,faros:.45,tormenta:.95,cueva:.2,vacio:0};
  const style=()=>{if(runtime.S.mode==="camino")return .08;return runtime.clamp((KB[BI().id]??.3)+(MU.dnaA?MU.dnaA.kOff||0:0),0,1);};
  const MU={deg:0,pending:false,dist:0,E:0,act:0,still:0,dirY:0,speed:0,mel:69,motif:[],lastNoteStep:-999,step:0,next:0,queue:[],bq:[],cell:CELLS[0],lastChange:0,
    biome:0,biomeT:0,tr:0,sq:[],nb:null,nbW:0,prevKit:null,xf0:-999,bpmFrom:96,dnaA:null,dnaT:null,q8:[],near:[],singers:[],vari:-1,timbre:0,follower:false,voices:[57,60,64,67],resp:false,layers:new Set(),flowers:[],boltAt:0,groove:0};
  const radio = createRadio(runtime.seedOf, runtime.rng, runtime.GEN);
  const neighborRadio=createRadio(runtime.seedOf,runtime.rng,runtime.GEN);
  MU.radio = null;MU.neighborRadio=null;
  let arrangementAir=1;
  const LOUD=5.6;   // ganancia de compensación en modo normal: fuerte pero limpio (6.8 saturaba)
  let ac=null,fx=null,master,mfilt,punch,presence,makeup,limiter,clipper,comfortShelf,comfortLowpass,subsonic,headroom,bus,delay,dfb,dsend,verb,verbIn,padF,padG,padOsc=[],drone,droneG,noiseBuf,windG,windF;
  const voiceCurator=createVoiceCurator();
  const musicVolume=()=>runtime.S.sound?(runtime.S.softMusic?.65:1):0;
  function applyComfort(time=ac?.currentTime||0){
    if(!ac)return;
    const soft=!!runtime.S.softMusic;
    master.gain.setTargetAtTime(musicVolume(),time,.25);
    comfortShelf.gain.setTargetAtTime(soft?-5:0,time,1);
    if(punch){punch.gain.setTargetAtTime(soft?0:2,time,.5);presence.gain.setTargetAtTime(soft?0:2.5,time,.5);makeup.gain.setTargetAtTime(soft?1.6:LOUD,time,.5);}
    comfortLowpass.frequency.setTargetAtTime(soft?5500:runtime.inWorld()?(MU.anomaly==='detenido'&&MU.still>1?700:Math.min(MU.radio?.grammar?.brightness||10000,MU.radio?.character?.ceiling||10000)*(MU.season?.bright||1)*(1-.35*(MU.storm||0))):18000,time,1.2);
  }
  function impulse(sec){const n=ac.sampleRate*sec|0,b=ac.createBuffer(2,n,ac.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.6);}return b;}
  function audio(){
    if(!ac){
      try{ac=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
      // iPhone: sonar como música (volumen multimedia y aunque el interruptor de silencio esté activo).
      try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch(e){}
      master=ac.createGain();master.gain.value=musicVolume();
      mfilt=ac.createBiquadFilter();mfilt.type="lowpass";mfilt.frequency.value=18000;
      const comp=ac.createDynamicsCompressor();
      if(comp.threshold){comp.threshold.value=-26;comp.knee.value=10;comp.ratio.value=3.5;comp.attack.value=.012;comp.release.value=.22;}   // ataque más lento: los golpes respiran
      // Volumen de fiesta: graves con más cuerpo, ganancia de compensación y un limitador final que evita saturar.
      punch=ac.createBiquadFilter();punch.type='lowshelf';punch.frequency.value=110;punch.gain.value=runtime.S.softMusic?0:2;
      makeup=ac.createGain();makeup.gain.value=runtime.S.softMusic?1.6:LOUD;
      // Presencia: los parlantes del teléfono casi no dan graves; el cuerpo que se oye está en los medios.
      presence=ac.createBiquadFilter();presence.type='peaking';presence.frequency.value=2400;presence.Q.value=.8;presence.gain.value=runtime.S.softMusic?0:2.5;
      // Protección de picos: señal lineal hasta 0,9; solo redondea los últimos picos.
      // La reducción de bits del jugador permanece en su ruta de efecto explícita.
      if(ac.createWaveShaper){clipper=ac.createWaveShaper();clipper.curve=peakGuardCurve();clipper.oversample='4x';}else clipper=ac.createGain();
      limiter=ac.createDynamicsCompressor();if(limiter.threshold){limiter.threshold.value=-1;limiter.knee.value=0;limiter.ratio.value=20;limiter.attack.value=.002;limiter.release.value=.2;}
      comfortShelf=ac.createBiquadFilter();comfortShelf.type='highshelf';comfortShelf.frequency.value=3500;comfortShelf.gain.value=runtime.S.softMusic?-5:0;
      comfortLowpass=ac.createBiquadFilter();comfortLowpass.type='lowpass';comfortLowpass.Q.value=.7;comfortLowpass.frequency.value=runtime.S.softMusic?5500:18000;
      // Mesa de efectos del jugador (Kaoss pad): filtros, espacio, eco, robot. Neutra por defecto.
      fx={lp:ac.createBiquadFilter(),hp:ac.createBiquadFilter(),dry:ac.createGain(),verb:ac.createConvolver(),verbSend:ac.createGain(),delay:ac.createDelay(2),fb:ac.createGain(),delaySend:ac.createGain(),dtone:ac.createBiquadFilter(),crushSend:ac.createGain(),crush:ac.createWaveShaper?ac.createWaveShaper():ac.createGain()};
      fx.lp.type='lowpass';fx.lp.frequency.value=20000;fx.lp.Q.value=Math.SQRT1_2;fx.hp.type='highpass';fx.hp.frequency.value=10;fx.hp.Q.value=Math.SQRT1_2;
      fx.verb.buffer=impulse(4.5);fx.verbSend.gain.value=0;fx.delaySend.gain.value=0;fx.fb.gain.value=.45;fx.dtone.type='lowpass';fx.dtone.frequency.value=2600;fx.crushSend.gain.value=0;
      if(fx.crush.curve!==undefined){const n=4096,cv=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;cv[i]=Math.round(x*6)/6;}fx.crush.curve=cv;}
      subsonic=ac.createBiquadFilter();subsonic.type='highpass';subsonic.frequency.value=20;subsonic.Q.value=Math.SQRT1_2;
      headroom=ac.createGain();headroom.gain.value=.95;   // reserve margin after oversampling, including dense low-register arrangements
      const fxRoom=returnFilters(ac,180,8000),fxEcho=returnFilters(ac,110,8000);
      master.connect(subsonic).connect(mfilt).connect(fx.lp).connect(fx.hp).connect(fx.dry).connect(punch);
      fx.hp.connect(fx.verbSend).connect(fx.verb).connect(fxRoom.input);fxRoom.output.connect(punch);
      fx.hp.connect(fx.delaySend).connect(fx.delay).connect(fx.dtone).connect(fx.fb).connect(fx.delay);fx.dtone.connect(fxEcho.input);fxEcho.output.connect(punch);
      fx.hp.connect(fx.crushSend).connect(fx.crush).connect(punch);
      // Modulación y congelado (mesa de efectos): chorus, phaser y freeze de un tiempo. Envíos en 0 por defecto.
      {const lfo=(rate,depth,target)=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=rate;g.gain.value=depth;o.connect(g).connect(target);o.start();return o;};
       fx.chorusSend=ac.createGain();fx.chorusSend.gain.value=0;fx.chorus=ac.createDelay(.05);fx.chorus.delayTime.value=.014;lfo(.8,.004,fx.chorus.delayTime);
       fx.hp.connect(fx.chorusSend).connect(fx.chorus).connect(punch);
       fx.phaserSend=ac.createGain();fx.phaserSend.gain.value=0;let node=fx.phaserSend;fx.phaserStages=[];
       for(let i=0;i<4;i++){const ap=ac.createBiquadFilter();ap.type='allpass';ap.frequency.value=900;ap.Q.value=.7;lfo(.25,700,ap.frequency);node.connect(ap);node=ap;fx.phaserStages.push(ap);}
       fx.hp.connect(fx.phaserSend);node.connect(punch);
       fx.freezeIn=ac.createGain();fx.freezeIn.gain.value=1;fx.freeze=ac.createDelay(2);fx.freeze.delayTime.value=.5;fx.freezeFb=ac.createGain();fx.freezeFb.gain.value=0;fx.freezeOut=ac.createGain();fx.freezeOut.gain.value=0;
       fx.hp.connect(fx.freezeIn).connect(fx.freeze).connect(fx.freezeFb).connect(fx.freeze);fx.freeze.connect(fx.freezeOut).connect(punch);}
      punch.connect(comfortShelf).connect(comfortLowpass).connect(presence).connect(comp).connect(makeup).connect(limiter).connect(clipper).connect(headroom).connect(ac.destination);
      bus=ac.createGain();bus.connect(master);
      verb=ac.createConvolver();verb.buffer=impulse(3.2);verbIn=ac.createGain();verbIn.gain.value=.8;const room=returnFilters(ac);verbIn.connect(verb).connect(room.input);room.output.connect(master);
      delay=ac.createDelay(1.5);delay.delayTime.value=SIX*3;dfb=ac.createGain();dfb.gain.value=.38;const dl=ac.createBiquadFilter();dl.type="lowpass";dl.frequency.value=2000;
      delay.connect(dl).connect(dfb).connect(delay);const echo=returnFilters(ac,110,8000);dl.connect(echo.input);echo.output.connect(master);echo.output.connect(verbIn);
      dsend=ac.createGain();dsend.gain.value=1;dsend.connect(delay);
      padF=ac.createBiquadFilter();padF.type="lowpass";padF.frequency.value=600;padF.Q.value=.5;padG=ac.createGain();padG.gain.value=0;
      padF.connect(padG);padG.connect(master);padG.connect(verbIn);
      MU.voices.forEach((m,i)=>{[-5,5].forEach(det=>{const o=ac.createOscillator();o.type=i%2?"triangle":"sine";o.frequency.value=hz(m);o.detune.value=det+(Math.random()*4-2);const g=ac.createGain();g.gain.value=i%2?.5:1;o.connect(g).connect(padF);o.start();padOsc.push({o,i});});});
      drone=ac.createOscillator();drone.type="sine";drone.frequency.value=hz(33);droneG=ac.createGain();droneG.gain.value=0;drone.connect(droneG).connect(master);drone.start();
      noiseBuf=ac.createBuffer(1,ac.sampleRate*2|0,ac.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
      const wn=ac.createBufferSource();wn.buffer=noiseBuf;wn.loop=true;windF=ac.createBiquadFilter();windF.type="bandpass";windF.frequency.value=700;windF.Q.value=.8;windG=ac.createGain();windG.gain.value=0;
      wn.connect(windF).connect(windG).connect(master);wn.start();
      MU.next=ac.currentTime+.1;setInterval(sched,25);
    }
    if(ac.state==="suspended")ac.resume();
  }
  // Afinación: en las tierras raras la región entera se desafina unos cents (MU.tune).
  const hz=m=>440*Math.pow(2,(m-69)/12+((runtime.inWorld?.()&&MU.tune)||0)/1200);
  let VW=1;const rnd=Math.random, vel=v=>v*VW*(.82+rnd()*.3), jit=()=>(rnd()-.5)*.008;
  const BI=()=>runtime.BIOMES[MU.biome];
  function chordTones(){const sc=MU.dnaA?MU.dnaA.scale:BI().scale,d=MU.deg;return [0,2,4,6,8].map(k=>{const i=d+k;return A+MU.tr+sc[i%7]+12*Math.floor(i/7);});}
  function root(){let r=45+MU.tr+(MU.dnaA?MU.dnaA.scale:BI().scale)[MU.deg];while(r>52)r-=12;while(r<40)r+=12;return r;}
  function voiceLead(){
    const pcs=chordTones().slice(0,4).map(n=>((n%12)+12)%12),out=[];
    const prev=MU.voices.slice(),used=new Set();
    prev.forEach(v=>{let best=null,bd=99;pcs.forEach((pc,j)=>{if(used.has(j))return;let n=v-((v%12)-pc);[n-12,n,n+12].forEach(c=>{if(c<50||c>76)return;const d=Math.abs(c-v);if(d<bd){bd=d;best=[c,j];}});});
      if(best){used.add(best[1]);out.push(best[0]);}else out.push(v);});
    MU.voices=out;
  }
  function changeChord(t){
    let opts=NEXTD[MU.deg];
    const pref=MU.dirY<-.3?UPD:MU.dirY>.3?DOWND:null;
    if(pref){const f=opts.filter(o=>pref.includes(o));if(f.length&&rnd()<.7)opts=f;}
    MU.deg=runtime.inWorld()&&MU.radio?.grammar?harmonicDegree(MU.radio.grammar,MU.radio.harmonyBar):opts[Math.floor(rnd()*opts.length)];MU.pending=false;MU.dist=0;MU.lastChange=MU.step;
    voiceLead();
    padOsc.forEach(p=>p.o.frequency.setTargetAtTime(hz(MU.voices[p.i]),t,.35+rnd()*.4));
    drone.frequency.setTargetAtTime(hz(root()-12),t,.6);
  }
  function setBiome(z){MU.biomeT=z;MU.timbre=runtime.S.mode==="camino"?2:MU.dnaT?runtime.GEN[MU.dnaT.genre].pt:runtime.BIOMES[z].tim;}
  function sched(){
    runtime.effectsTick?.();
    runtime.spatialTick?.();
    runtime.patchTick?.();
    if(!ac||ac.state!=="running")return;
    const roomRegion=runtime.duetRegion?.();if(roomRegion){MU.dnaA=MU.dnaT=roomRegion;MU.biomeT=roomRegion.z;MU.nb=null;MU.nbW=0;}
    const synchronized=runtime.duetTransport?.(ac.currentTime);if(synchronized){SIX=synchronized.six;MU.step=synchronized.step;MU.next=synchronized.next;}
    if(MU.next<ac.currentTime){const n=Math.ceil((ac.currentTime-MU.next)/SIX);MU.next+=n*SIX;MU.step+=n;}
    while(MU.next<ac.currentTime+.12){playStep(MU.next);MU.next+=SIX;MU.step++;}
  }
  function kitPlay(kit,s,t,tt,E,k,R,ct,g,P,bassF,DO){
    switch(kit){
      case "soft":
        if(s%4===0){const four=k>.4&&E>.5;let p=E<.22?0:four?1:s===0?runtime.clamp((E-.2)*3,0,1):s===8?runtime.clamp((E-.35)*2,0,1):0;if(rnd()<p)kick(t,vel(.24+E*.12));}
        if(s%4===2&&E>.4&&rnd()<runtime.clamp((E-.4)*1.8*(.4+k),0,1))hat(tt,vel(.02+k*.03),.04+k*.1);
        if(s%2===1&&s%4!==2&&E>.7&&k>.55&&rnd()<(E-.7)*2.2)hat(tt,vel(.008),.03);
        if((s===4||s===12)&&E>.68&&k>.55&&rnd()<.85)clap(t+jit(),vel(.07));
        if(E>.3&&MU.cell[s]&&rnd()<runtime.clamp((E-.25)*2.5,0,1))!DO&&bassF(MU.cell[s]===2?R+7:R,.15);
        if(k>.6&&E>.75&&s===6&&rnd()<.4)!DO&&stab(ct.slice(0,3).map(n=>n+12),tt,k);
        break;
      case "broken":
        if((s===0||s===10)&&P(.95))kick(t,vel(.26));
        if(s===7&&P(.4))kick(t,vel(.16));
        if((s===4||s===12)&&P(.8))rim(tt,vel(.05));
        if([3,7,11,14].includes(s)&&P(.6))hat(tt,vel(.02),.04);
        if([0,6,11].includes(s)&&P(.8))!DO&&softBass(s===6?R+7:R,tt,vel(.14));
        break;
      case "float":
        if(s===0&&E>.15)tom(t,70,vel(.12));
        if((s===6||s===14)&&P(.5))!DO&&pluck(ct[Math.floor(rnd()*3)]+24,tt,vel(.03),4);
        if(s===0&&E>.3)!DO&&softBass(R,t,vel(.12));
        break;
      case "tribal":{
        const T={0:70,3:95,6:70,8:130,11:95,14:70,15:110};
        if(T[s]&&P(s===0?1:.7))tom(tt,T[s],vel(.17));
        if(E>.5&&s%2===1&&P(.6))shaker(tt,vel(.02));
        if(s===0&&P(1))!DO&&softBass(R,t,vel(.14));
        break;}
      case "half":
        if(s===0&&P(1))kick(t,vel(.3));
        if(s===8&&P(.9))clap(t,vel(.08));
        if(s%2===1&&E>.35&&P(.7))shaker(t+SIX*.3,vel(.02));
        if((s===0||s===7)&&P(.8))!DO&&softBass(s===7?R+5:R,tt,vel(.15));
        break;
      case "garage":
        if([0,7,10].includes(s)&&P(s===0?1:.7))kick(t,vel(.26));
        if((s===4||s===12)&&P(.9))clap(t,vel(.07));
        if(s%4===2&&P(.8))hat(tt,vel(.03),.06);
        if([0,3,10].includes(s)&&P(.8))!DO&&bassF(R+(s===3?12:0),.14);
        if(s===14&&P(.4))!DO&&stab(ct.slice(0,3).map(n=>n+12),tt,.7);
        break;
      case "techno":
        if(s%4===0&&E>.2)kick(t,vel(.32));
        if(s%4===2&&P(.9))hat(t,vel(.04),.1);
        if(s%2===1&&E>.5&&P(.7))hat(t,vel(.012),.03);
        if((s===4||s===12)&&E>.6&&P(.8))clap(t,vel(.06));
        if(ACID[s]&&P(.85))!DO&&acid(R+(ACID[s]===2?12:0)+(s===14?3:0),t,vel(.11),200+MU.speed*2600);
        break;
      case "heart":
        if(s===0||s===3)kick(t,vel(s===0?.22:.14));
        if(s===0&&MU.step%32===0)!DO&&pluck(ct[0]+12,t,.04,2);
        break;
      case "none":break;
    }
  }
  function playStep(t){
    const s=MU.step%16,k=style(),calm=runtime.isFree()&&runtime.S.mode==="camino";
    const live=runtime.inWorld()||runtime.S.mode==="studio";
    if(s===0){
      if(MU.biome!==MU.biomeT||MU.dnaA!==MU.dnaT){MU.biome=MU.biomeT;MU.dnaA=MU.dnaT;MU.tr=BI().tr+(MU.dnaA?MU.dnaA.trOff:0);MU.pending=true;MU.harmonyRegion=null;}
      const nb=runtime.inWorld()?MU.nb:null,w=nb?MU.nbW:0;
      const a2=live&&MU.dnaA?MU.dnaA:null,bA=a2?a2.bpm:76,bB=nb?nb.bpm:bA;BPM=Math.round(bA*(1-w)+bB*w);if(runtime.inWorld())BPM+=MU.seasonBpm||0;if(runtime.inWorld()&&MU.anomaly==='detenido'&&MU.still>1)BPM=Math.round(BPM*.55);BPM=runtime.duetBPM?.()||BPM;SIX=60/BPM/4;delay.delayTime.setTargetAtTime(SIX*(runtime.inWorld()&&MU.anomaly==='canon'?4:3),t,.2);
      if(!runtime.inWorld()&&(MU.pending||(MU.step-MU.lastChange>16*(6+Math.floor(rnd()*4)))))changeChord(t);
      if(BI().id==="tormenta"&&runtime.inWorld()&&(MU.step/16)%2===0&&rnd()<.75)MU.boltAt=t+SIX*(rnd()<.5?0:8);
    }
    if(runtime.inWorld()&&MU.dnaA){
      if(s===0||!MU.radio)MU.radio=radio.advance(MU.dnaA,MU.step>>4,{
        room:runtime.duetRoom?.code||null,near:MU.near.length,singers:MU.singers.length,variant:MU.vari,quiet:runtime.currentPocket?.()?.kind==='quiet',
        event:runtime.eventOf(MU.dnaA)?.[0],initiative:runtime.initiativeState?.strength||0
      });
      if(s===0&&runtime.composeLivingArrangement)MU.radio=runtime.composeLivingArrangement(MU.dnaA,MU.radio);
      if(s===0){const degree=harmonicDegree(MU.radio.grammar,MU.radio.harmonyBar);if(MU.harmonyRegion!==MU.dnaA.key||MU.deg!==degree){changeChord(t);MU.harmonyRegion=MU.dnaA.key;}else if(MU.pending){MU.pending=false;MU.dist=0;}}
      if(s===0){runtime.initiativeBar?.(t,MU.step>>4);runtime.clueBar?.(t,MU.step>>4);runtime.encounterBar?.(t,MU.step>>4);}
      if(s===0&&(runtime.S.layer||'superficie')==='superficie')runtime.horizonBar?.(t,MU.step>>4);
      if(s===0&&(runtime.S.layer||'superficie')==='superficie')runtime.riverBar?.(t);
      if(s===0&&(runtime.S.layer||'superficie')==='superficie')runtime.stormBar?.(t);   // hitos lejanos: se oyen antes de verse
    }else{MU.radio=null;voiceCurator.clear();}
    if(runtime.inWorld()){runtime.loopStep?.(s,MU.step,t);runtime.bandStep?.(s,MU.step>>4,t);}   // ecos en bucle y banda de criaturas
    if(runtime.inWorld()&&MU.nb&&MU.nbW>0){if(s===0||MU.neighborRadio?.key!==MU.nb.key)MU.neighborRadio={...neighborRadio.advance(MU.nb,MU.step>>4),key:MU.nb.key};}else MU.neighborRadio=null;
    if(s===0)applyComfort(t);
    if(s===0&&runtime.inWorld()&&MU.dnaA)MU.influenced=runtime.shapeInfluence?.(MU.dnaA,MU.radio)||MU.radio;
    // En zonas vacías la música se adelgaza (subida); en un oasis vuelve completa (drop).
    const vitCap=runtime.inWorld()?.16+.7*Math.min(1,(MU.vit??1)/.7):1;
    let E=(calm||runtime.S.mode==="camino")?Math.min(MU.E,.2):Math.min(vitCap,Math.max(MU.E,MU.radio?.energy||0));
    if(runtime.inWorld()&&!calm){if(MU.river)E=Math.max(E,.3+.45*MU.river);if(MU.anomaly==='luna')E=Math.max(E,.85);}   // río abajo sube la energía; la luna lo abre todo
    const A=live&&MU.dnaA?MU.dnaA:null,G=A?runtime.GEN[A.genre]:runtime.GEN.ambient,nb=runtime.inWorld()&&MU.nb&&MU.nb!==A?MU.nb:null,w=nb?MU.nbW:0;
    if(s%4===0){MU.bq.push(t);if(MU.bq.length>8)MU.bq.shift();}
    MU.sq.push({t,s});if(MU.sq.length>12)MU.sq.shift();
    const id=BI().id,cave=id==="cueva",vac=id==="vacio",bar=MU.step>>4;
    const since=MU.step-MU.lastChange,padLv=(G.pad||0)*(1-w)+(nb&&runtime.GEN[nb.genre].pad||0)*w,padOn=since<24||MU.radio?.melodyRest?padLv:0;
    padG.gain.setTargetAtTime(.03*(1-E*.4)*padOn*(runtime.labSolo||(runtime.fieldSolo&&runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie')?0:1)+.0001,t,padOn?.6:2.2);
    padF.frequency.setTargetAtTime((380+E*1700-(cave?200:0))*(MU.radio?.identity?.tone??1),t,.9);
    droneG.gain.setTargetAtTime(0,t,1.5);
    dfb.gain.setTargetAtTime(runtime.inWorld()&&MU.anomaly==='canon'?.72:cave||(A&&A.genre==="dub")?.6:MU.still>3?.5:.36,t,1);
    dsend.gain.setTargetAtTime(cave?2.2:MU.vari===3&&runtime.inWorld()?1.8:1,t,.5);
    const air=runtime.inWorld()&&MU.dnaA?MU.dnaA.air:null;
    verbIn.gain.setTargetAtTime(vac?1.6:cave||air==="niebla"?1.25:.8,t,1);
    if(!MU.radio?.melodyRest&&air==="esporas"&&s===14&&bar%4===3&&rnd()<.2)pluck(hookPitch('glass',chordTones()[1],musicalCharacter(MU.dnaA.genre)),t,.012,4);
    if(runtime.inWorld())E=runtime.clamp(E+(runtime.influenceState?.values.groove||0)*.09,.05,.9);
    const swA=(s%2)?SIX*Math.max(0,Math.min(.38,(MU.radio?.identity?.swing??G.sw??0)+(runtime.influenceState?.values.groove||0)*.035)):0,tt=t+swA+jit(),R=root(),ct=chordTones();
    const xp=runtime.inWorld()?(runtime.experimentalLevel?.()||0):0;   // zonas experimentales: ≥0.7 sin batería ni pista
    if(live&&!runtime.labSolo&&!(runtime.fieldSolo&&runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie')&&xp<.7){   // Campo de escucha: solo suena lo que está dentro   // laboratorio: «Solo» calla la música del lugar para oír el elemento
      if(nb){VW=w;const nt=t+((s%2)?SIX*(MU.neighborRadio?.identity?.swing??runtime.GEN[nb.genre].sw??0):0)+jit();drums(nb.genre,s,bar,t,nt,E,ct,true,MU.neighborRadio);playTrack(nb,s,nt,E,ct,MU.neighborRadio); }
      VW=1-w;if(!(xp>.4&&rnd()<(xp-.4)*2.2))drums(A?A.genre:"ambient",s,bar,t,tt,E,ct,false);   // entre 0.4 y 0.7 la batería se deshace
      if(runtime.inWorld()&&A){
        playTrack(A,s,tt,E,ct,MU.influenced||MU.radio);
        const grammar=MU.radio?.grammar;
        if(grammar&&E>.32&&runtime.currentPocket?.()?.kind!=='quiet'&&grammar.accents.includes(s)&&s%4!==0){
          const v=vel(grammar.accentLevel*(MU.radio.section===0?.5:1));
          if(grammar.accentInstrument==='wood')wood(tt,v);else if(grammar.accentInstrument==='rim')rim(tt,v);else shaker(tt,v*(MU.radio?.melodyRest?.25:1));
        }
      }
      VW=1;
    }
    // tu Estudio: cada pieza suena en su paso
    if(runtime.S.mode==="studio"){for(const key in runtime.S.studio.slots){const c=key.indexOf(",");if(+key.slice(c+1)===s){runtime.playSample(runtime.S.studio.slots[key],+key.slice(0,c),t,ct,R);runtime.studioHit[key]=performance.now()+(t-ac.currentTime)*1000;}}}
    // faros: instrumentos que encendiste
    if(runtime.inWorld()&&(runtime.S.layer||"superficie")==="superficie"){
      if(MU.layers.has(0)&&s%2===0)runtime.playVoice('faro',0,t+jit(),MU.dnaA,false,.4);
      if(MU.layers.has(1)&&(s===0||s===8))runtime.playVoice('faro',1,t,MU.dnaA,false,.7);
      if(MU.layers.has(2)&&s%4===0&&rnd()<.6)runtime.playVoice('faro',2,t,MU.dnaA,false,.4);
      for(const f of MU.flowers){if(f.st===s){runtime.playVoice('planta:flor',f.n%7,t,runtime.regionOfPos(f.x,f.y),false,.7,f);f.hit=performance.now()+(t-ac.currentTime)*1000;}}
    }
    // quieto: campanas lentas sobre el acorde
    if(!live&&MU.still>2.5&&s%2===0&&rnd()<.05){const n=ct[Math.floor(rnd()*ct.length)]+12+(rnd()<.4?12:0);pluck(n,t+jit(),vel(.045),2);}
    // la música te responde con tu propia frase
    if(!runtime.inWorld()&&!MU.resp&&MU.motif.length>=3&&MU.step-MU.lastNoteStep===24){
      MU.resp=true;const st0=MU.motif[0].st;
      MU.motif.slice(-6).forEach(m=>{const off=Math.min(m.st-st0,24);pluck(snap(m.n,ct)-12,t+off*SIX,vel(.05),2);});
    }
    // el mundo toca solo: objetos cercanos suenan en el beat, las criaturas que te siguen cantan
    if(runtime.inWorld()&&s%4===0&&MU.near.length&&rnd()<(.04+.12*E)*(MU.vari===4?1.8:MU.vari===0?.6:1)){const o=chooseNearbySource(MU.near,runtime.S.wx,runtime.S.wy,rnd);if(o?.snd){o.snd(t);setTimeout(()=>{o.lit=1;o.hit=1;},Math.max(0,(t-ac.currentTime)*1000));}}
    if(runtime.inWorld()&&s===0&&(MU.step>>4)%2===1)MU.singers.slice(0,1).forEach(o=>{runtime.speciesSound(o.s,t+SIX*2,true,o.personality,o);setTimeout(()=>{o.lit=1;},Math.max(0,(t+SIX*2-ac.currentTime)*1000));});
    // lo que tocas espera la siguiente corchea (con un poco de vida humana)
    if(s%2===0){let m=0;while(MU.q8.length&&m<3){const it=MU.q8.shift(),t2=t+jit()*1.5;it.fn(t2);if(it.vis)setTimeout(it.vis,Math.max(0,(t2-ac.currentTime)*1000));m++;}}
    runtime.duetStep?.(s,bar,t);runtime.livingStep?.(s,bar,t);
    runtime.percussionStep?.(s,bar,t);
    runtime.petStep?.(s,bar,t);
    runtime.glassStep?.(s,bar,t);
    runtime.mirrorStep?.(s,bar,t);
    runtime.materiaStep?.(s,bar,t);
    runtime.vidaStep?.(s,bar,t);
    runtime.experimentalStep?.(s,bar,t);
    runtime.quietStep?.(s,bar,t);
    runtime.cajasStep?.(s,bar,t);
    runtime.phenomenaStep?.(s,bar,t);
    let n=0;while(MU.queue.length&&n<4){MU.queue.shift()(t);n++;}
  }
  function snap(n,ct){let best=n,bd=99;ct.forEach(c=>{for(let o=-36;o<=36;o+=12){const d=Math.abs(c+o-n);if(d<bd){bd=d;best=c+o;}}});return best;}
  function scaleNotes(){const sc=MU.dnaA?MU.dnaA.scale:BI().scale,out=[];for(let o=-12;o<=36;o+=12)sc.forEach(d=>{const n=A+o+d+MU.tr;if(n>=62&&n<=91)out.push(n);});return out.sort((a,b)=>a-b);}
  function nextMel(){
    const sc=scaleNotes();let i=0,bd=99;sc.forEach((n,j)=>{const d=Math.abs(n-MU.mel);if(d<bd){bd=d;i=j;}});
    const dir=MU.dirY<-.25?1:MU.dirY>.25?-1:(rnd()<.5?1:-1);
    i+=dir*(rnd()<.7?1:2);if(i<0)i=1;if(i>=sc.length)i=sc.length-2;
    let n=sc[i];if((MU.step+1)%4===0)n=snap(n,chordTones());
    MU.mel=n;return n;
  }
  function onBeatNow(){if(!ac)return false;const n=ac.currentTime;let best=9;MU.bq.forEach(b=>best=Math.min(best,Math.abs(n-b)));const l=MU.bq[MU.bq.length-1];if(l!==undefined)best=Math.min(best,Math.abs(n-(l+SIX*4)));return best<.09;}
  let grooveFx=0;
  function playerNote(v=.1,gold=false){
    if(!ac)return;
    const ob=onBeatNow();
    runtime.lastNoteMs=performance.now();runtime.dodgeT=0;
    if(ob){MU.groove++;MU.act+=.12;grooveFx=1;runtime.offStreak=0;if(runtime.inWorld()&&runtime.RP&&runtime.RP.type==="tiempo")runtime.retoSet("tiempo",runtime.RP.val+1);if(MU.groove>=8)runtime.unlock("tiempo");}else{MU.groove=0;runtime.offStreak++;if(runtime.offStreak>=20)runtime.unlock("contratiempo");}
    const n=nextMel();MU.act+=.22;MU.resp=false;
    MU.motif.push({n,st:MU.step});if(MU.motif.length>8)MU.motif.shift();MU.lastNoteStep=MU.step;
    MU.queue.push(t=>{if(runtime.inWorld()){runtime.playVoice('luz',n%7,t,runtime.activeLayerRegion?.()||runtime.regionOfPos(runtime.S.wx,runtime.S.wy),gold,1,null,'player');return;}pluck(n,t,vel(v),MU.timbre);
      if(ob){const h=snap(n+4,chordTones());pluck(h,t,vel(v*.6),MU.timbre);if(MU.groove>=4)pluck(snap(n+7,chordTones())+12,t+SIX,vel(v*.4),4);}
      if(gold)chordTones().slice(0,4).forEach((c,i)=>pluck(snap(n+3+i*4,chordTones()),t+(i+1)*SIX,vel(.07),MU.timbre));
      if(MU.follower)pluck(n-12,t+SIX*8,vel(.05),2);});
  }
  function env(g,t,a,peak,dec,shaped=false){const patch=shaped?null:runtime.activeInstrumentPatch;if(patch){a=Math.min(.12,a*patch.attackScale);dec*=patch.legacyDecay;peak*=patch.level;}g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,peak),t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dec);}
  function kick(t,v){runtime.recordInstrument?.("kick");const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(44,t+.11);env(g,t,.003,v,.32);o.connect(g).connect(bus);o.start(t);o.stop(t+.4);}
  function tom(t,f,v){runtime.recordInstrument?.("tom");const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(f*1.6,t);o.frequency.exponentialRampToValueAtTime(f,t+.06);env(g,t,.003,v,.28);o.connect(g).connect(bus);const s=ac.createGain();s.gain.value=.4;g.connect(s).connect(verbIn);o.start(t);o.stop(t+.4);}
  function noise(t,type,f,q,v,dec,toVerb){const s=ac.createBufferSource();s.buffer=noiseBuf;const fl=ac.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=ac.createGain();env(g,t,.001,v,dec);s.connect(fl).connect(g).connect(bus);if(toVerb)g.connect(verbIn);s.start(t,rnd()*1.5);s.stop(t+dec+.05);}
  const hat=(t,v,dec)=>(runtime.recordInstrument?.("hat"),noise(t,"highpass",7500+rnd()*1500,.7,v,dec));
  const shaker=(t,v)=>{runtime.recordInstrument?.("shaker");return noise(t,"bandpass",6000,1.5,v*arrangementAir,.05);};
  const rim=(t,v)=>{runtime.recordInstrument?.("rim");return noise(t,"bandpass",2800,6,v,.03);};
  const clap=(t,v)=>{runtime.phenomenonPercussionCue?.(t);runtime.recordInstrument?.("clap");return noise(t,"bandpass",1500,1.2,v,.14,true);};
  function softBass(m,t,v){const o=ac.createOscillator(),g=ac.createGain();o.type="sine";o.frequency.value=hz(m);env(g,t,.01,v*1.1,.45);o.connect(g).connect(bus);o.start(t);o.stop(t+.6);}
  function houseBass(m,t,v,k){const o=ac.createOscillator(),g=ac.createGain(),f=ac.createBiquadFilter();o.type="sawtooth";o.frequency.value=hz(m);f.type="lowpass";f.Q.value=6;f.frequency.setValueAtTime(160+k*650+MU.E*300,t);f.frequency.exponentialRampToValueAtTime(130,t+.2);env(g,t,.004,v,.22);o.connect(f).connect(g).connect(bus);o.start(t);o.stop(t+.3);}
  function acid(m,t,v,cut){const o=ac.createOscillator(),g=ac.createGain(),f=ac.createBiquadFilter();o.type="sawtooth";o.frequency.value=hz(m);f.type="lowpass";f.Q.value=13;f.frequency.setValueAtTime(cut,t);f.frequency.exponentialRampToValueAtTime(Math.max(120,cut*.3),t+.12);env(g,t,.003,v,.15);o.connect(f).connect(g).connect(bus);const d=ac.createGain();d.gain.value=.2;g.connect(d).connect(dsend);o.start(t);o.stop(t+.22);}
  function stab(tri,t,k){const f=ac.createBiquadFilter();f.type="lowpass";f.frequency.value=700+k*900;f.Q.value=3;const g=ac.createGain(),d=ac.createGain();d.gain.value=.8;env(g,t,.003,.045,.22);
    tri.forEach(m=>{const o=ac.createOscillator();o.type="sawtooth";o.frequency.value=hz(m);o.connect(f);o.start(t);o.stop(t+.35);});f.connect(g).connect(bus);g.connect(d).connect(dsend);}
  function pluck(m,t,v,tim=0){runtime.recordInstrument?.(["keys","marimba","bell","pluck","glass","saw"][tim]||"keys");
    const T=TIMBRE[tim]||TIMBRE[0],o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(),g2=ac.createGain(),sd=ac.createGain(),sv=ac.createGain();
    o.type="sine";o2.type=T.w;o.frequency.value=hz(m);o2.frequency.value=hz(m)*T.r;g2.gain.value=T.h*(runtime.activeInstrumentPatch?.harmonics||1);
    const world=runtime.inWorld();
    if(world){const f=ac.createBiquadFilter();f.type="lowpass";f.Q.value=.65;f.frequency.setValueAtTime(tim===4?1800:2400,t);f.frequency.exponentialRampToValueAtTime(tim===4?650:1000,t+.2);o.connect(f);o2.connect(g2).connect(f);f.connect(g);g2.gain.value=T.h*.55*(runtime.activeInstrumentPatch?.harmonics||1);}
    else{o.connect(g);o2.connect(g2).connect(g);}
    env(g,t,world?.012:.005,v,world?Math.min(T.dec,.65):T.dec);g.connect(bus);
    sd.gain.value=runtime.inWorld()?.18:.3;g.connect(sd).connect(dsend);sv.gain.value=runtime.inWorld()?T.send*.65:T.send;g.connect(sv).connect(verbIn);
    o.start(t);o2.start(t);o.stop(t+T.dec+.3);o2.stop(t+T.dec+.3);
  }
  function fmBass(m,t,v){const o=ac.createOscillator(),mo=ac.createOscillator(),mg=ac.createGain(),g=ac.createGain();o.frequency.value=hz(m);mo.frequency.value=hz(m)*2;mg.gain.setValueAtTime(hz(m)*2.5,t);mg.gain.exponentialRampToValueAtTime(1,t+.25);mo.connect(mg).connect(o.frequency);env(g,t,.004,v,.3);o.connect(g).connect(bus);o.start(t);mo.start(t);o.stop(t+.4);mo.stop(t+.4);}
  function sawLead(m,t,v){const o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain(),d=ac.createGain();o.type="sawtooth";o.frequency.value=hz(m);f.type="lowpass";f.frequency.setValueAtTime(2200,t);f.frequency.exponentialRampToValueAtTime(500,t+.2);f.Q.value=4;env(g,t,.005,v*.7,.22);d.gain.value=.5;o.connect(f).connect(g).connect(bus);g.connect(d).connect(dsend);o.start(t);o.stop(t+.3);}
  function organ(m,t,v){runtime.recordInstrument?.("organ");const f=ac.createBiquadFilter(),g=ac.createGain();f.type="lowpass";f.frequency.value=1600;[0,12].forEach(k=>{const o=ac.createOscillator();o.type="square";o.frequency.value=hz(m+k);o.connect(f);o.start(t);o.stop(t+.3);});env(g,t,.008,v*.45,.2);f.connect(g).connect(bus);const sv=ac.createGain();sv.gain.value=.3;g.connect(sv).connect(verbIn);}
  function flute(m,t,v){runtime.recordInstrument?.("flute");const o=ac.createOscillator(),l=ac.createOscillator(),lg=ac.createGain(),g=ac.createGain(),sv=ac.createGain();o.type="sine";o.frequency.value=hz(m);l.frequency.value=5.2;lg.gain.value=hz(m)*.006;l.connect(lg).connect(o.frequency);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v*(runtime.activeInstrumentPatch?.level||1),t+.06*(runtime.activeInstrumentPatch?.attackScale||1));g.gain.exponentialRampToValueAtTime(.0001,t+.6*(runtime.activeInstrumentPatch?.legacyDecay||1));sv.gain.value=.5;o.connect(g).connect(bus);g.connect(sv).connect(verbIn);o.start(t);l.start(t);o.stop(t+.7);l.stop(t+.7);}
  function kick2(t,v,fe,dec){runtime.recordInstrument?.("kick");const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(125,t);o.frequency.exponentialRampToValueAtTime(fe,t+.1);env(g,t,.003,v,dec);o.connect(g).connect(bus);o.start(t);o.stop(t+dec+.1);}
  function snare(t,v){runtime.phenomenonPercussionCue?.(t);runtime.recordInstrument?.("snare");noise(t,"bandpass",1800,1,v,.14,true);const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=190;env(g,t,.002,v*.6,.08);o.connect(g).connect(bus);o.start(t);o.stop(t+.12);}
  function conga(t,f,v){runtime.recordInstrument?.("conga");const o=ac.createOscillator(),g=ac.createGain(),sv=ac.createGain();o.frequency.setValueAtTime(f*1.4,t);o.frequency.exponentialRampToValueAtTime(f,t+.03);env(g,t,.002,v,.13);sv.gain.value=.25;o.connect(g).connect(bus);g.connect(sv).connect(verbIn);o.start(t);o.stop(t+.2);}
  function clave(t,v){const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=2500;env(g,t,.001,v,.04);o.connect(g).connect(bus);o.start(t);o.stop(t+.08);}
  // Golpe de llegada a un oasis: bombo largo, platillo filtrado y acorde abierto.
  function dropHit(t,ct){kick2(t,vel(.4),38,.9);noise(t,"highpass",5000,.7,vel(.05),1.2);ct.slice(0,3).forEach(n=>hookInst('strings',n+12,t,vel(.03)));}
  function cowbell(t,v){runtime.recordInstrument?.("cowbell");const f=ac.createBiquadFilter(),g=ac.createGain();f.type="bandpass";f.frequency.value=800;f.Q.value=3;[540,800].forEach(fr=>{const o=ac.createOscillator();o.type="square";o.frequency.value=fr;o.connect(f);o.start(t);o.stop(t+.2);});env(g,t,.001,v,.12);f.connect(g).connect(bus);}
  function wood(t,v){runtime.recordInstrument?.("wood");noise(t,"bandpass",1100,8,v,.04);const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=820;env(g,t,.001,v*.5,.03);o.connect(g).connect(bus);o.start(t);o.stop(t+.06);}
  const hatC=(t,v)=>hat(t,v*arrangementAir,.035),hatO=(t,v)=>hat(t,v*arrangementAir,.15);
  function blip(m,t,v){const o=ac.createOscillator(),g=ac.createGain(),d=ac.createGain();o.type="sine";o.frequency.value=hz(m);env(g,t,.002,v,.06);d.gain.value=.6;o.connect(g).connect(bus);g.connect(d).connect(dsend);o.start(t);o.stop(t+.1);}
  function dubChord(ct,t){stab(ct.slice(0,3).map(n=>inRegister(n,45,65)),t,.35);}
  function organChord(ct,t){ct.slice(0,3).forEach(n=>organ(inRegister(n,48,71),t,vel(.05)));}
  function reese(m,t,v){runtime.recordInstrument?.("reese");const f=ac.createBiquadFilter(),g=ac.createGain();f.type="lowpass";f.frequency.value=480;[-12,12].forEach(dt=>{const o=ac.createOscillator();o.type="sawtooth";o.frequency.value=hz(m);o.detune.value=dt;o.connect(f);o.start(t);o.stop(t+.45);});env(g,t,.01,v*.7,.35);f.connect(g).connect(bus);}
  function bassInst(ty,m,t,v,region=MU.dnaA||MU.dnaT){if(runtime.withInstrumentPatch&&runtime.inWorld()&&region&&!runtime.activeInstrumentPatch)return runtime.withInstrumentPatch('track',region,{instrument:ty,role:'bajo'},null,t,()=>bassInst(ty,m,t,v,region));runtime.recordInstrument?.(ty);if(runtime.playNewInstrument?.(ty,m,t,v))return;switch(ty){case "reese":reese(m,t,v);return;case "organb":organ(m,t,v*1.5);return;case "roll":houseBass(m,t,v*.8,.3);return;}switch(ty){case "sub":softBass(m,t,v);break;case "acid":acid(m,t,v*.85,300+MU.speed*2200);break;case "pluck":houseBass(m,t,v,.5);break;case "fm":fmBass(m,t,v);break;case "boing":runtime.boing(m,t,v);break;}}
  function hookInst(ty,m,t,v,region=MU.dnaA||MU.dnaT,articulation=null){if(runtime.withInstrumentPatch&&runtime.inWorld()&&region&&!runtime.activeInstrumentPatch)return runtime.withInstrumentPatch('track',region,{instrument:ty,role:'lead'},null,t,()=>hookInst(ty,m,t,v,region,articulation));runtime.recordInstrument?.(ty);if(runtime.playNewInstrument?.(ty,m,t,v,articulation))return;switch(ty){case "keys":pluck(m,t,v,0);break;case "marimba":pluck(m,t,v,1);break;case "glass":pluck(m+12,t,v*.8,4);break;case "saw":sawLead(m,t,v);break;case "organ":organ(m,t,v);break;case "flute":flute(m,t,v);break;}}
  function drums(gid,s,bar,t,tt,E,ct,DO,arrangement=MU.radio){
    const previous=arrangementAir;arrangementAir=(arrangement?.identity?.air??musicalCharacter(gid).air)*(arrangement?.melodyRest?.2:1);
    try{drumPattern(gid,s,bar,t,tt,E,ct,DO,arrangement);}finally{arrangementAir=previous;}
  }
  function drumPattern(gid,s,bar,t,tt,E,ct,DO,arrangement){
    if(runtime.inWorld()&&!DO&&runtime.depthGate?.(s)===false&&s%4!==0)return;
    const reduction=runtime.inWorld()?Math.max(0,-(runtime.influenceState?.values.groove||0)):0;
    const L1=E>.12,L2=E>.32&&reduction<.4,L3=E>.55&&reduction<.2&&!arrangement?.melodyRest,variation=(bar>>2)%3;
    if(reduction>.7&&s%4!==0)return;
    // Repeat the placement of ghost hits across four bars; velocity still breathes.
    const r=runtime.inWorld()?runtime.rng(runtime.seedOf(`groove:v1:${MU.dnaA?.key}:${gid}:${Math.floor(bar/4)}:${s}`)):rnd;
    if(L3&&s===15&&bar%4===3&&variation===2&&!["ambient","heart","downtempo","dub"].includes(gid)&&r()<.35){
      if(["afro","tribal"].includes(gid))conga(tt,220,vel(.045));
      else if(["breaks","garage","dnb"].includes(gid))snare(tt,vel(.025));
      else rim(tt,vel(.025));
    }
    if(RHYTHM_GENRES[gid]){
      // Tanda de ritmos ampliada: patrón por receta, tono de bombo propio, ráfagas y acordes.
      const G=RHYTHM_GENRES[gid],pattern=rhythmPattern(gid,variation),at=field=>pattern[field]?.includes(s),[kf,kd]=G.kickTone||[50,.28],soft=G.soft?.7:1;
      if(L1&&at('kick'))kick2(t,vel(.25*soft),kf,kd);
      if(L1&&at('snare'))snare(tt,vel(.085*soft));
      if(L2&&at('clap'))clap(t,vel(.055*soft));
      if(L2&&at('clapRoll')){clap(tt,vel(.035));clap(tt+SIX/2,vel(.03));}
      if(L2&&at('rim'))rim(tt,vel(.035*soft));
      if(L2&&at('hat'))hatC(tt,vel((s%4===2?.024:.016)*soft));
      if(L2&&at('hatO'))hatO(tt,vel(.03*soft));
      if(L3&&at('hatRoll'))[0,1,2].forEach(i=>hatC(tt+i*SIX/3,vel(.014+i*.003)));
      if(L2&&at('conga'))conga(tt,190+variation*30,vel(.06));
      if(L2&&at('tom'))tom(tt,80+(s%3)*20,vel(.09));
      if(L3&&at('cowbell'))cowbell(tt,vel(.02));
      if(L3&&at('shaker'))shaker(tt,vel(.013));
      if(L3&&at('chord')&&bar%2===0&&!DO)ct.slice(0,3).forEach(n=>hookInst(G.chordI||'rhodes',hookPitch(G.chordI||'rhodes',n,musicalCharacter(gid)),tt,vel(.02)));
      return;
    }
    if(REFERENCE_GENRES[gid]){
      const pattern=referenceRhythm(gid,variation),at=field=>pattern[field]?.includes(s),fast=gid==='liquid';
      if(L1&&at('kick'))kick2(t,vel(.24),fast?52:50,fast?.18:.29);
      if(L1&&at('snare'))snare(t,vel(fast?.09:.08));
      if(L2&&at('clap'))clap(t,vel(.055));
      if(L2&&at('rim'))rim(tt,vel(.035));
      if(L2&&at('hat'))hatC(tt,vel(fast?.018:.022));
      if(L2&&at('wood'))wood(tt,vel(.035));
      if(L2&&at('conga'))conga(tt,180+variation*35,vel(.06));
      if(L2&&at('guiro'))runtime.guiro(tt,vel(.023));
      if(L3&&at('timbale'))runtime.timbale(tt,vel(.04));
      if(L3&&at('shaker'))shaker(tt,vel(.013));
      if(L3&&at('chord')&&bar%4===0&&!DO)ct.slice(0,3).forEach(n=>hookInst(gid==='cosmic'?'strings':'rhodes',n,t,vel(.023)));
      return;
    }
    switch(gid){
      case "ambient":if(L2&&!arrangement?.melodyRest&&s===0&&bar%2===0&&!DO)pluck(inRegister(ct[0],45,67)-12,t,vel(.025),4);break;
      case "downtempo":if(L1&&(s===0||s===10))kick2(t,vel(.26),58,.35);if(L2&&s===8)snare(tt,vel(.09));if(L2&&s%4===2)hatC(tt,vel(.03));if(L3&&s%2===1&&r()<.4)hatC(tt,vel(.012));break;
      case "dub":if(L1&&s%4===0)kick2(t,vel(.22),48,.4);if(L2&&s%4===2)hatC(tt,vel(.025));if(L3&&(s===3||s===11)&&r()<.7&&!DO)dubChord(ct,tt);if(L3&&s%2===1&&r()<.3)shaker(tt,vel(.012));break;
      case "deep":if(L1&&s%4===0)kick2(t,vel(.28),52,.32);if(L2&&(s===4||s===12))clap(t,vel(.07));if(L2&&s%4===2)hatO(tt,vel(.035));if(L3&&s%2===1)shaker(tt,vel(.015));if(L3&&(s===6||s===14)&&r()<.6&&!DO)organChord(ct,tt);break;
      case "afro":{if(L1&&s%4===0)kick2(t,vel(.27),50,.3);const C={2:250,3:180,6:250,7:320,10:180,11:250,14:320};if(L2&&C[s]&&r()<.85)conga(tt,C[s],vel(.12));if(L2&&[0,3,6,10,12].includes(s))clave(tt,vel(.035));if(L3&&s%2===1)shaker(tt,vel(.018));if(L3&&(s===4||s===12))clap(t,vel(.05));break;}
      case "minimal":if(L1&&s%4===0)kick2(t,vel(.26),55,.25);if(L2&&s%4===2)hatC(tt,vel(.03));if(L2&&[3,7,13].includes(s)&&r()<.6)rim(tt,vel(.05));if(L3&&s%4===1&&r()<.4&&!DO)blip(ct[1],tt,vel(.025));break;
      case "rominimal":if(L1&&s%4===0&&!(s===12&&bar%4===3))kick2(t,vel(.26),52,.28);if(L2&&s%2===1)shaker(tt,vel(s%4===3?.026:.016));if(L2&&[3,6,11,15].includes(s)&&r()<.75)wood(tt,vel(.05));if(L3&&(s===4||s===12)&&r()<.5)rim(tt,vel(.04));break;
      case "acid":if(L1&&s%4===0)kick2(t,vel(.34),60,.25);if(L2&&s%2===1)hatC(tt,vel(.02));if(L2&&s%4===2)hatO(t,vel(.04));if(L3&&(s===4||s===12))clap(t,vel(.06));break;
      case "breaks":if(L1&&(s===0||s===10))kick2(t,vel(.3),58,.25);if(L1&&(s===4||s===12))snare(tt,vel(.12));if(L2&&(s===7||s===14)&&r()<.5)snare(tt,vel(.04));if(L2&&s%2===0)hatC(tt,vel(.025));if(L3&&s===11&&r()<.5)kick2(t,vel(.18),58,.2);break;
      case "garage":if(L1&&[0,7,10].includes(s)&&(s===0||r()<.75))kick2(t,vel(.27),55,.25);if(L1&&(s===4||s===12))snare(tt,vel(.1));if(L2&&s%2===1)hatC(tt,vel(.02));if(L3&&s%4===2)hatO(tt,vel(.03));break;
      case "tribal":{const T={0:70,3:95,6:70,8:130,11:95,14:70,15:110};if(L1&&s===0)kick2(t,vel(.25),50,.3);if(L1&&T[s]&&r()<.8)tom(tt,T[s],vel(.15));if(L2&&s%2===1)shaker(tt,vel(.018));if(L3&&(s===2||s===10))conga(tt,280,vel(.08));break;}
      case "electro":
        if(L1&&[0,variation===1?6:7,10].includes(s))kick2(t,vel(.28),54,.24);
        if(L1&&(s===4||s===12))snare(tt,vel(.1));
        if(L2&&s%2===0)hatC(tt,vel(.025));
        if(L3&&s===[3,11,15][variation])rim(tt,vel(.045));break;
      case "progressive":
        if(L1&&s%4===0)kick2(t,vel(.27),50,.32);
        if(L2&&(s===4||s===12))clap(t,vel(.065));
        if(L2&&s%4===2)hatO(tt,vel(.03));
        if(L3&&s%2===1)shaker(tt,vel(.012));
        if(L3&&s===[6,10,14][variation]&&!DO)organChord(ct,tt);break;
      case "microhouse":
        if(L1&&s%4===0&&!(s===12&&variation===2))kick2(t,vel(.22),55,.19);
        if(L2&&[3,variation===1?9:7,14].includes(s))wood(tt,vel(.04));
        if(L2&&s%4===2)hatC(tt,vel(.02));
        if(L3&&s===13&&!DO)blip(inRegister(ct[variation],45,65),tt,vel(.03));break;
      case "minimaltechno":
        if(L1&&s%4===0)kick2(t,vel(.29),47,.24);
        if(L2&&s%4===2)hatC(tt,vel(.025));
        if(L2&&s===[3,6,11][variation])rim(tt,vel(.05));
        if(L3&&s===15)tom(tt,80+variation*20,vel(.09));break;
      case "dubstep":
        if(L1&&(s===0||s===[6,11,14][variation]))kick2(t,vel(.3),44,.38);
        if(L1&&s===8)snare(t,vel(.13));
        if(L2&&[2,5,10,13].includes(s))hatC(tt,vel(.02));
        if(L3&&s===15)hatO(tt,vel(.025));break;
      case "dnb":
        if(L1&&(s===0||s===[6,10,11][variation]))kick2(t,vel(.25),55,.17);
        if(L1&&(s===4||s===12))snare(t,vel(.1));
        if(L2&&s%2===0)hatC(tt,vel(.02));
        if(L3&&s%4===3)hatC(tt,vel(.008));
        if(L3&&s===[7,9,15][variation])snare(tt,vel(.035));break;
      case "tropical":
        if(L1&&s%4===0)kick2(t,vel(.24),50,.28);
        if(L2&&[3,6,10,14].includes(s))conga(tt,[180,250,320][variation],vel(.085));
        if(L2&&(s===2||s===10))runtime.guiro(tt,vel(.024));
        if(L3&&s===15&&bar%4===3)runtime.timbale(tt,vel(.06));
        if(L2&&s%2===1)shaker(tt,vel(.014));break;
      case "melodic":
        if(L1&&s%4===0)kick2(t,vel(.26),49,.32);
        if(L2&&(s===4||s===12))clap(t,vel(.055));
        if(L2&&s%4===2)hatO(tt,vel(.025));
        if(L3&&s===0&&bar%4===0&&!DO)ct.slice(0,3).forEach(n=>hookInst('strings',n,t,vel(.025)));break;
      case "robotic":
        if(L1&&[0,7,10].includes(s))kick2(t,vel(.27),48,.22);
        if(L1&&(s===4||s===12))snare(t,vel(.085));
        if(L2&&s%2===0)hatC(tt,vel(.02));
        if(L3&&s===[3,11,15][variation])runtime.timbale(tt,vel(.04));break;
      case "nudisco":
        if(L1&&s%4===0)kick2(t,vel(.25),53,.25);
        if(L2&&(s===4||s===12))clap(t,vel(.07));
        if(L2&&s%4===2)hatO(tt,vel(.03));
        if(L3&&s===7)runtime.guiro(tt,vel(.025));
        if(L3&&(s===6||s===14)&&!DO)ct.slice(0,3).forEach(n=>hookInst('brass',n,tt,vel(.022)));break;
      case "heart":if(s===0||s===3)kick2(t,vel(s?.14:.22),45,.4);if(L3&&s===8&&r()<.4&&!DO)dubChord(ct,tt);break;
    }
  }
  // Neighbors retain their own groove/timbre/register while sharing the current harmonic center.
  function playTrack(d,s,t,E,ct,arrangement=MU.radio){
    const base=d&&d.track;if(!base)return;const tr=arrangement?{...base,...arrangement}:base;const sc=MU.dnaA?.scale||d.scale,trans=MU.dnaA?MU.tr:runtime.BIOMES[d.z].tr+d.trOff,profile=musicalCharacter(d.genre),bar=(MU.step>>4)&1,nt=(dg,base)=>base+trans+sc[((dg%7)+7)%7]+12*Math.floor(dg/7);
    const gid=d.genre,bs=arrangement?tr.bass[s]:gid==="rominimal"?(s%2===1?(s%8===7?4:0):-1):gid==="acid"?(ACID[s]?(ACID[s]===2?7:0):-1):tr.bass[s];
    if(tr.bassI&&E>.15&&bs>=0&&MU.vari!==0&&gid!=="ambient"){let n=nt(bs,45);while(n>52)n-=12;while(n<38)n+=12;bassInst(tr.bassI,n,t,vel((gid==="rominimal"?.13:.17)*(arrangement?.grammar.bassLevel||1)),d);}
    let h=tr.hook[s];if(h>=0&&!runtime.cultureListening&&!arrangement?.melodyRest&&(E>.12||s%4===0)&&!(MU.vari===0&&s%4)){if(bar&&!arrangement)h+=tr.shift;let n=nt(h,57);if(s%4===0)n=snap(n,ct);n=hookPitch(tr.hookI,n,profile);const expression=arrangement?.expression,accent=expression?phraseAccent(expression,s):1;
      const level=vel((.05+.05*E)*(arrangement?.grammar.hookLevel||1)*profile.level*accent);
      const harmony=expression?.harmony&&s===0&&((MU.step>>4)%4===0);
      hookInst(tr.hookI,n,t,level*(harmony?.7:1),d,expression);
      if(harmony){const companion=hookPitch(tr.hookI,snap(n+4+(tr.hookI==='glass'?12:0),ct),profile);if(companion!==n)hookInst(tr.hookI,companion,t,level*.3,d,expression);}}
  }
  function thunder(t){noise(t,"lowpass",900,.5,.25,.9,true);noise(t,"highpass",3000,.5,.06,.12);}
  const soon=(fn,origin="ambient")=>{if(ac)MU.queue.push(t=>runtime.withVoiceOrigin?runtime.withVoiceOrigin(origin,()=>fn(t)):fn(t));};
  const now=fn=>{if(ac&&ac.state==="running")fn(ac.currentTime+.01);};
  function beat(){if(!ac)return 0;const n=ac.currentTime;while(MU.bq.length>1&&MU.bq[1]<=n)MU.bq.shift();const bt=MU.bq[0];if(bt===undefined||bt>n)return 0;const ph=(n-bt)/(SIX*4);return ph>1?0:Math.pow(1-ph,4)*(.35+MU.E*.65);}


  Object.defineProperties(runtime, {
    musicVolume: { get: () => musicVolume },
    applyComfort: { get: () => applyComfort },
    curatedVoiceGain: { get: () => (time,role)=>voiceCurator.gain(time,SIX,role,runtime.S.softMusic) },
    comfortLowpass: { get: () => comfortLowpass },
    limiter: { get: () => limiter },
    fx: { get: () => fx },
    outputStage: { get: () => ({punch,presence,makeup,limiter,clipper,master,subsonic,headroom}) },
    noiseHit: { get: () => noise },
    snareHit: { get: () => snare },
    clap: { get: () => clap },
    hatHit: { get: () => hatC },
    snare: { get: () => snare },
    cowbell: { get: () => cowbell },
    dropHit: { get: () => dropHit },
    bassInst: { get: () => bassInst },
    hookInst: { get: () => hookInst },
    kick: { get: () => kick },
    conga: { get: () => conga },
    wood: { get: () => wood },
    rim: { get: () => rim },
    SIX: { get: () => SIX, set: value => { SIX = value; } },
    style: { get: () => style },
    MU: { get: () => MU },
    ac: { get: () => ac, set: value => { ac = value; } },
    master: { get: () => master, set: value => { master = value; } },
    mfilt: { get: () => mfilt, set: value => { mfilt = value; } },
    dsend: { get: () => dsend, set: value => { dsend = value; } },
    bus: { get: () => bus, set: value => { bus = value; } },
    verbIn: { get: () => verbIn, set: value => { verbIn = value; } },
    windG: { get: () => windG, set: value => { windG = value; } },
    windF: { get: () => windF, set: value => { windF = value; } },
    audio: { get: () => audio },
    hz: { get: () => hz },
    rnd: { get: () => rnd },
    vel: { get: () => vel },
    BI: { get: () => BI },
    chordTones: { get: () => chordTones },
    root: { get: () => root },
    setBiome: { get: () => setBiome },
    snap: { get: () => snap },
    nextMel: { get: () => nextMel },
    onBeatNow: { get: () => onBeatNow },
    grooveFx: { get: () => grooveFx, set: value => { grooveFx = value; } },
    playerNote: { get: () => playerNote },
    env: { get: () => env },
    tom: { get: () => tom },
    shaker: { get: () => shaker },
    softBass: { get: () => softBass },
    acid: { get: () => acid },
    pluck: { get: () => pluck },
    flute: { get: () => flute },
    thunder: { get: () => thunder },
    soon: { get: () => soon },
    now: { get: () => now },
    beat: { get: () => beat },
  });
}
