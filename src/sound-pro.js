import {soundProfile,CLASSIC_LEVEL,CLASSIC_DRAWS,normalizeSoundPro,soundProWritable,soundProClassic,createTransitionTracker,guestFilter,GUEST_HIGHPASS} from './sound-profiles.js';
// Sonido pro (alpha.266; house clásico alpha.267): one shared production engine under the composition. audio.js keeps deciding every hit and
// note; for a genre whose family profile is ready, the hit or note sounds here instead (runtime.proDrum and
// runtime.proVoice), on one bus per region («deck»): a layered kit synthesized once into buffers, the bass split in sub
// and mid under the kick's sidechain, wide synths, generated room and echo, glue and saturation. Region changes are
// mixed like a DJ from the journey's own cues. «Sonido clásico» (Sonido › Avanzado) turns it all off.

// ---------- one-shots, synthesized once in plain JS into AudioBuffers ----------
const TAU=Math.PI*2;
function rng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function biquad(type,f,q,sr,db=0){
 const w=TAU*Math.min(f,sr*.45)/sr,c=Math.cos(w),s=Math.sin(w),al=s/(2*q),A=Math.pow(10,db/40),sq=2*Math.sqrt(A)*al;let b0,b1,b2,a0,a1,a2;
 if(type==='lowpass'){b0=(1-c)/2;b1=1-c;b2=b0;a0=1+al;a1=-2*c;a2=1-al;}
 else if(type==='highpass'){b0=(1+c)/2;b1=-(1+c);b2=b0;a0=1+al;a1=-2*c;a2=1-al;}
 else if(type==='bandpass'){b0=al;b1=0;b2=-al;a0=1+al;a1=-2*c;a2=1-al;}
 else if(type==='peaking'){b0=1+al*A;b1=-2*c;b2=1-al*A;a0=1+al/A;a1=-2*c;a2=1-al/A;}
 else{b0=A*((A+1)+(A-1)*c+sq);b1=-2*A*((A-1)+(A+1)*c);b2=A*((A+1)+(A-1)*c-sq);a0=(A+1)-(A-1)*c+sq;a1=2*((A-1)-(A+1)*c);a2=(A+1)-(A-1)*c-sq;}
 b0/=a0;b1/=a0;b2/=a0;a1/=a0;a2/=a0;let x1=0,x2=0,y1=0,y2=0;
 return x=>{const y=b0*x+b1*x1+b2*x2-a1*y1-a2*y2;x2=x1;x1=x;y2=y1;y1=y;return y;};
}
const chain=(...f)=>x=>{for(const g of f)x=g(x);return x;};
const sat=d=>x=>Math.tanh(d*x)/Math.tanh(d);
const glide=(t,a,b,len)=>a*Math.pow(b/a,Math.min(1,t/len));
function finish(d,sr){const fade=Math.min(d.length,Math.round(.004*sr));for(let i=0;i<fade;i++)d[d.length-1-i]*=i/fade;let pk=0;for(const x of d)pk=Math.max(pk,Math.abs(x));if(pk>0)for(let i=0;i<d.length;i++)d[i]/=pk;return d;}
function render(sec,sr,fn){const n=Math.max(1,Math.round(sec*sr)),d=new Float32Array(n);for(let i=0;i<n;i++)d[i]=fn(i/sr);return finish(d,sr);}
const metal=[205.3,304.4,369.6,522.7,540,800];
const square=(ph)=>ph%1<.5?1:-1;
export const ONE_SHOTS={
 kick(sr,f0,k){const r=rng(3),click=chain(biquad('highpass',2500,.7,sr),biquad('peaking',4500,1,sr,6)),lp=biquad('lowpass',9000,.7,sr),drive=sat(k.drive);let ph=0;
  return render(k.length,sr,t=>{const f=t<.018?glide(t,f0*5.5,f0*1.6,.018):glide(t-.018,f0*1.6,f0,.067);ph+=TAU*f/sr;
   const amp=t<.0015?t/.0015:t<.05?1:Math.exp(-(t-.05)/k.decay),body=lp(drive(Math.sin(ph)*amp)),c=click(r()*2-1)*(t<.007?k.click*Math.pow(.001/k.click,t/.007):0);return (body+c)*(t<k.hold?1:Math.exp(-(t-k.hold)/k.tail));});},
 hat(sr,open,tone){const r=rng(open?9:5),f=chain(biquad('bandpass',10500,.6,sr),biquad('highpass',7200,.7,sr),biquad('highshelf',12000,.7,sr,-3)),ph=metal.map(()=>0),tau=open?.11:.018;
  return render(open?.6:.15,sr,t=>{let s=0;metal.forEach((m,i)=>{ph[i]+=m*tone/sr;s+=square(ph[i]);});const amp=t<.0008?t/.0008:t<.002?1:Math.exp(-(t-.002)/tau);return f((s*.25+(r()*2-1)*.5))*amp;});},
 clap(sr){const r=rng(13),f=chain(biquad('bandpass',1150,1.1,sr),biquad('highpass',550,.7,sr),biquad('peaking',2400,1.5,sr,3)),at=[0,.011,.021,.032],lv=[.85,.85,.85,1];
  const env=t=>{if(t>=.034){const e=.15+(1-.15)*Math.exp(-(.034-.032)/.0035);return e*Math.exp(-(t-.034)/.065);}let k=0;for(let i=0;i<4;i++)if(t>=at[i])k=i;return .15+(lv[k]-.15)*Math.exp(-(t-at[k])/.0035);};
  return render(.45,sr,t=>f(r()*2-1)*env(t));},
 snare(sr){const r=rng(19),n=chain(biquad('highpass',1400,.7,sr),biquad('peaking',4200,1,sr,4)),drive=sat(1.8),tones=[[185,.8,.05],[330,.35,.03]],ph=[0,0];
  return render(.4,sr,t=>{let s=0;tones.forEach(([f,v,d],i)=>{ph[i]+=TAU*glide(t,f*1.3,f,.02)/sr;s+=Math.sin(ph[i])*v*(t<.003?1:Math.exp(-(t-.003)/d));});s+=n(r()*2-1)*.9*(t<.004?1:Math.exp(-(t-.004)/.06));return drive(s);});},
 rim(sr){const r=rng(29),n=biquad('bandpass',3200,3,sr),drive=sat(3);let a=0,b=0;
  return render(.1,sr,t=>{a+=TAU*1720/sr;b+=TAU*820/sr;const e=Math.exp(-t/.009);return drive(Math.sin(a)*.6*e+Math.sin(b)*.5*e+n(r()*2-1)*.7*Math.exp(-t/.006)*3);});},
 shaker(sr){const r=rng(37),f=chain(biquad('bandpass',7200,.9,sr),biquad('highpass',4200,.7,sr));
  return render(.12,sr,t=>f(r()*2-1)*(t<.011?t/.011:Math.exp(-(t-.013)/.018)));},
 perc(sr,f0,dec){const r=rng(43+Math.round(f0)),n=biquad('bandpass',Math.min(f0*6,16000),2,sr),drive=sat(1.6);let ph=0;
  return render(Math.min(1.2,dec*6+.05),sr,t=>{ph+=TAU*glide(t,f0*1.5,f0,.025)/sr;const e=t<.001?t/.001:Math.exp(-Math.max(0,t-.004)/dec);return drive(Math.sin(ph)*e)+n(r()*2-1)*.4*Math.exp(-t/.004)*2;});},
 cowbell(sr){const f=biquad('bandpass',800,3,sr),drive=sat(1.5);let a=0,b=0;
  return render(.3,sr,t=>{a+=540/sr;b+=800/sr;return drive(f(square(a)+square(b))*Math.exp(-t/.06)*3);});},
 crash(sr){const r=rng(53),f=chain(biquad('bandpass',6500,.8,sr),biquad('highpass',4000,.7,sr)),ph=[];for(const m of metal)for(const k of [2.1,3.3])ph.push([m*k,0]);
  return render(2,sr,t=>{let s=0;for(const p of ph){p[1]+=p[0]/sr;s+=square(p[1]);}const e=t<.001?t/.001:.25+.75*Math.exp(-(t-.001)/.02);return f(s*.2+(r()*2-1)*.6)*e*Math.exp(-t/.6);});}
};
// Impulse response for the shared room: stereo, a short pre-delay and a tail that darkens as it decays.
export function roomImpulse(sr,sec,seed=61){const n=Math.round(sec*sr),pre=Math.round(.015*sr),out=[new Float32Array(n),new Float32Array(n)];
 for(let c=0;c<2;c++){const r=rng(seed+c);let y=0;for(let i=pre;i<n;i++){const x=i/n,k=.85-.75*x;y+=(r()*2-1-y)*k;out[c][i]=y*Math.pow(1-x,2.4)*(i-pre<sr*.004?(i-pre)/(sr*.004):1);}}
 let pk=0;for(const d of out)for(const x of d)pk=Math.max(pk,Math.abs(x));for(const d of out)for(let i=0;i<n;i++)d[i]*=.35/(pk||1);return out;}
// The kick sits on the root or its fifth, whichever octave lands nearest 52 Hz (or the kit's own target).
export const kickPitch=(hz,target=52)=>{if(!(hz>0))return target;let best=target,bd=9;for(const r of [1,1.5])for(let k=-6;k<=2;k++){const f=hz*r*Math.pow(2,k),d=Math.abs(Math.log2(f/target));if(d<bd){bd=d;best=f;}}return Math.round(best);};
const mix=(a,b)=>((a*2654435761)^(b*2246822519))>>>0;
const unit=h=>{h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16;return (h>>>0)/4294967296;};

export function initialize(runtime){
 // ---------- the setting ----------
 const $=id=>runtime.$?.(id)||globalThis.document?.getElementById?.(id)||null;
 let owner=null,state=null;
 function own(){if(owner!==runtime.S){owner=runtime.S;if(runtime.S)runtime.S.soundPro=normalizeSoundPro(runtime.S.soundPro);state=runtime.S?.soundPro||null;}return state;}
 const classic=()=>!runtime.S||soundProClassic(own());
 function setClassic(value){if(!runtime.S||!soundProWritable(own()))return false;const before=state.classic;state.classic=!!value;if(runtime.save?.()===false){state.classic=before;sync();return false;}sync();return true;}
 function sync(){const box=$('classicSound');if(!box)return;box.checked=classic();box.disabled=!!runtime.S&&!soundProWritable(own());}
 const box=$('classicSound');if(box)box.onchange=()=>{setClassic(box.checked);};
 const panel=$('mMusic');if(panel&&globalThis.MutationObserver)new MutationObserver(()=>{if(!panel.hidden)sync();}).observe(panel,{attributes:true,attributeFilter:['hidden']});
 if(runtime.S)sync();
 const live=()=>!classic()&&runtime.inWorld?.()===true&&!runtime.labMode;

 // ---------- the engine, built once per AudioContext ----------
 let E=null,nodes=0,hits=0,voices=0;
 const count=n=>{nodes++;return n;};
 function engine(){
  const ac=runtime.ac;if(!ac||!ac.createBuffer)return null;if(E&&E.ac===ac)return E;
  const dest=runtime.accompanimentStage?.()?.inputs?.[0]||runtime.bus;if(!dest)return null;
  const sr=ac.sampleRate,buffers=new Map(),decks=new Map(),p=soundProfile('techhouse');
  const sum=ac.createGain(),glue=ac.createDynamicsCompressor(),shape=ac.createWaveShaper?ac.createWaveShaper():ac.createGain(),out=ac.createGain();
  if(glue.threshold){glue.threshold.value=p.glue.threshold;glue.ratio.value=p.glue.ratio;glue.attack.value=p.glue.attack;glue.release.value=p.glue.release;glue.knee.value=8;}
  if(shape.curve!==undefined){const n=2048,c=new Float32Array(n),d=p.drive;for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=Math.tanh(d*x)/Math.tanh(d);}shape.curve=c;shape.oversample='2x';}
  out.gain.value=OUTPUT;sum.connect(glue).connect(shape).connect(out).connect(dest);
  // Room (generated impulse) and a ping-pong echo of a dotted eighth.
  const verb=ac.createConvolver(),verbIn=ac.createGain(),verbRet=ac.createGain(),ir=roomImpulse(sr,p.space.seconds),irb=ac.createBuffer(2,ir[0].length,sr);irb.getChannelData(0).set(ir[0]);irb.getChannelData(1).set(ir[1]);verb.buffer=irb;
  const verbHp=ac.createBiquadFilter();verbHp.type='highpass';verbHp.frequency.value=220;verbRet.gain.value=p.space.ret;verbIn.connect(verbHp).connect(verb).connect(verbRet).connect(sum);
  const echoIn=ac.createGain(),dl=ac.createDelay(2),dr=ac.createDelay(2),fb=ac.createGain(),tone=ac.createBiquadFilter(),pl=ac.createStereoPanner(),pr=ac.createStereoPanner(),echoRet=ac.createGain();
  tone.type='lowpass';tone.frequency.value=3200;fb.gain.value=p.space.feedback;pl.pan.value=-.6;pr.pan.value=.6;echoRet.gain.value=p.space.echoRet;
  const six=runtime.SIX||.12;dl.delayTime.value=dr.delayTime.value=Math.min(1.9,six*p.space.echoSteps);
  echoIn.connect(tone).connect(dl);dl.connect(pl).connect(echoRet);dl.connect(fb).connect(dr);dr.connect(pr).connect(echoRet);dr.connect(dl);echoRet.connect(sum);
  // A longer, darker hall for the warm families' chords and pads (house): sent to only by voices that ask for it.
  const hall=ac.createConvolver(),hallIn=ac.createGain(),hallRet=ac.createGain(),hallHp=ac.createBiquadFilter(),hir=roomImpulse(sr,3.2,71),hb=ac.createBuffer(2,hir[0].length,sr);hb.getChannelData(0).set(hir[0]);hb.getChannelData(1).set(hir[1]);hall.buffer=hb;
  hallHp.type='highpass';hallHp.frequency.value=300;hallRet.gain.value=.45;hallIn.connect(hallHp).connect(hall).connect(hallRet).connect(sum);
  nodes+=20;
  E={ac,sr,buffers,decks,sum,out,verbIn,echoIn,hallIn,dl,dr,glue,waves:new Map()};
  return E;
 }
 // Pro bus level into audio.js's own master (its compressor and limiter stay the last stage), the comfort ceiling
 // a converted family asks for, and the final trim that keeps true peak at or under -1 dBTP.
 const OUTPUT=.105,CEILING=16000,TRIM=.88;
 function buffer(key,make){const e=E;let b=e.buffers.get(key);if(!b){const d=make(e.sr);b=e.ac.createBuffer(1,d.length,e.sr);b.getChannelData(0).set(d);e.buffers.set(key,b);}return b;}
 function deck(key,p){
  const e=E;key=key||'solo';let d=e.decks.get(key);if(d){d.used=runtime.MU?.step??0;return d;}
  const ac=e.ac,duck=ac.createGain(),dry=ac.createGain(),hp=ac.createBiquadFilter(),lp=ac.createBiquadFilter(),out=ac.createGain();nodes+=5;
  hp.type='highpass';hp.frequency.value=10;hp.Q.value=.7;lp.type='lowpass';lp.frequency.value=20000;lp.Q.value=.7;
  duck.connect(hp);dry.connect(hp);hp.connect(lp).connect(out).connect(e.sum);
  // A deck's level is its family's output (house sits a little under tech for the same loudness at the limiter).
  d={key,duck,dry,hp,lp,out,level:p?.output??1,used:runtime.MU?.step??0,lead:0};out.gain.value=d.level;e.decks.set(key,d);
  if(mixKeys&&key===mixKeys.secondary){hp.frequency.value=GUEST_HIGHPASS;lp.frequency.value=guestFilter(mixKeys.to).lowpass;}
  if(e.decks.size>4){let old=null;for(const x of e.decks.values())if(x!==d&&(!old||x.used<old.used))old=x;if(old){e.decks.delete(old.key);const t=ac.currentTime;old.out.gain.setTargetAtTime(0,t,.3);setTimeout?.(()=>{try{old.out.disconnect();}catch(err){}},3000);}}
  return d;
 }
 function play(buf,t,gain,{dest,pan=0,room=0,echo=0,rate=1}={}){
  const e=E,ac=e.ac,src=count(ac.createBufferSource()),g=count(ac.createGain()),list=[src,g];src.buffer=buf;if(rate!==1)src.playbackRate.value=rate;g.gain.value=gain;src.connect(g);
  let node=g;if(pan&&ac.createStereoPanner){const p=count(ac.createStereoPanner());p.pan.value=Math.max(-1,Math.min(1,pan));g.connect(p);node=p;list.push(p);}node.connect(dest);
  if(room){const s=count(ac.createGain());s.gain.value=room;node.connect(s).connect(e.verbIn);list.push(s);}
  if(echo){const s=count(ac.createGain());s.gain.value=echo;node.connect(s).connect(e.echoIn);list.push(s);}
  src.onended=()=>{for(const n of list)n.disconnect();};src.start(Math.max(t,0));hits++;
 }
 const duckAll=(t,p)=>{for(const d of E.decks.values()){const g=d.duck.gain;g.setTargetAtTime(p.sidechain.floor,t,.003);g.setTargetAtTime(1,t+.045,p.sidechain.release);}};
 const swingOf=g=>Math.max(0,Math.min(.38,runtime.MU?.radio?.identity?.swing??runtime.GEN?.[g]?.sw??0));
 // Region key → genre, learned from the hits themselves (the journey's cues carry only keys).
 const keyGenre=new Map();
 const learn=(key,genre)=>{if(key&&genre){keyGenre.set(key,genre);if(keyGenre.size>64)keyGenre.delete(keyGenre.keys().next().value);}};
 const ready=genre=>soundProfile(genre).ready===true;

 // ---------- transitions ----------
 const tracker=createTransitionTracker();let dropBar=null,mixKeys=null;
 const inDrop=()=>{const st=runtime.MU?.step;return dropBar!==null&&Number.isFinite(st)&&(st>>4)===dropBar&&st%16>=8;};
 function riser(t,len){const e=E,ac=e.ac,src=count(ac.createBufferSource()),bp=count(ac.createBiquadFilter()),g=count(ac.createGain()),s=count(ac.createGain());src.buffer=runtime.noiseBuffer;src.loop=true;
  bp.type='bandpass';bp.Q.value=2.2;bp.frequency.setValueAtTime(300,t);bp.frequency.exponentialRampToValueAtTime(7000,t+len);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+len);g.gain.linearRampToValueAtTime(0,t+len+.03);
  s.gain.value=.5;src.connect(bp).connect(g).connect(e.sum);g.connect(s).connect(e.verbIn);src.onended=()=>{for(const n of [src,bp,g,s])n.disconnect();};src.start(t);src.stop(t+len+.1);}
 function impact(t){const e=E,ac=e.ac,o=count(ac.createOscillator()),a=count(ac.createGain()),f=kickPitch(runtime.hz?.(runtime.root?.()??45)??55);o.frequency.setValueAtTime(f*2,t);o.frequency.exponentialRampToValueAtTime(f*.8,t+.9);
  a.gain.setValueAtTime(.3,t);a.gain.setTargetAtTime(0,t+.02,.35);o.connect(a).connect(e.sum);o.onended=()=>{o.disconnect();a.disconnect();};o.start(t);o.stop(t+2.5);
  play(buffer('crash',sr=>ONE_SHOTS.crash(sr)),t,.22,{dest:e.sum,room:.5});}
 function cue(f){
  const plan=tracker.advance(f);phraseAt={bar:plan.bar,phrase:plan.phrase};if(!live()){dropBar=null;mixKeys=null;return;}const e=engine();if(!e)return;
  const MU=runtime.MU;if(MU?.dnaA)learn(MU.dnaA.key,MU.dnaA.genre);if(MU?.neighborRadio)learn(MU.neighborRadio.key,MU.neighborRadio.genre);
  const six=runtime.SIX||.12,T=f.time,bar=16*six,active=live()&&(ready(keyGenre.get(plan.primary))||ready(keyGenre.get(plan.secondary)));
  e.dl.delayTime.setTargetAtTime(Math.min(1.9,six*3),T,.1);e.dr.delayTime.setTargetAtTime(Math.min(1.9,six*3),T,.1);
  dropBar=active&&plan.drop?plan.bar:null;mixKeys=active?plan:null;
  for(const d of e.decks.values()){
   if(active&&d.key===plan.secondary){const a=guestFilter(plan.from),b=guestFilter(plan.to);d.hp.frequency.setValueAtTime(GUEST_HIGHPASS,T);d.lp.frequency.setValueAtTime(a.lowpass,T);d.lp.frequency.exponentialRampToValueAtTime(b.lowpass,T+bar);d.out.gain.setTargetAtTime(d.level,T,.05);}
   else if(!active||d.key===plan.primary){d.hp.frequency.setValueAtTime(10,T);d.lp.frequency.setValueAtTime(20000,T);d.out.gain.setTargetAtTime(d.level,T,.05);
    if(active&&plan.sweep&&ready(keyGenre.get(d.key)))d.hp.frequency.exponentialRampToValueAtTime(320,T+bar);}
   else d.out.gain.setTargetAtTime(0,T,bar/3);
  }
  if(!active)return;
  if(plan.impact)impact(T);
  if(plan.riser)riser(T,plan.riser*bar);
  if(plan.crash&&ready(keyGenre.get(plan.primary)))play(buffer('crash',sr=>ONE_SHOTS.crash(sr)),T,.14,{dest:e.sum,room:.4,pan:.2});
 }
 // The journey's cue is a plain optional callback in audio.js: keep any listener a test or module sets beside this one.
 let listener=runtime.territoryJourneyCue||null;
 Object.defineProperty(runtime,'territoryJourneyCue',{configurable:true,get:()=>frame=>{try{cue(frame);}finally{listener?.(frame);}},set:fn=>{listener=typeof fn==='function'?fn:null;}});

 // ---------- the hooks audio.js calls ----------
 function drawLike(id){for(let i=CLASSIC_DRAWS[id]||0;i>0;i--)runtime.rnd?.();}
 // The output stage's last trim (headroom, exposed by audio.js): a little lower under a converted family, so its true
 // peak stays at or under -1 dBTP; back to audio.js's own value elsewhere and with «Sonido clásico».
 let trimBar=null;
 function trim(t){const h=runtime.outputStage?.headroom,bar=(runtime.MU?.step??0)>>4;if(!E||!h?.gain||bar===trimBar)return;trimBar=bar;
  if(E.headroom===undefined)E.headroom=h.gain.value;const want=live()&&ready(runtime.MU?.dnaA?.genre)?E.headroom*TRIM:E.headroom;h.gain.setTargetAtTime(want,Math.max(t-.05,0),.03);}
 function proDrum(ctx,id,t,v,x){
  trim(t);
  if(!live()||!Number.isFinite(t)||!(v>=0))return false;
  const MU=runtime.MU,neighbor=!!ctx?.DO,gid=ctx?ctx.gid:runtime.currentVoiceOrigin==='track'?MU?.dnaA?.genre:null;if(!gid)return false;
  const key=neighbor?MU?.neighborRadio?.key:MU?.dnaA?.key;learn(key,gid);
  const swallow=id==='kick'&&mixKeys&&inDrop();
  const p=soundProfile(gid);if(!p.ready&&!swallow)return false;
  const e=engine();if(!e)return false;trim(t);
  drawLike(id);if(swallow)return true;
  const d=deck(key,p),base=v/(CLASSIC_LEVEL[id]||.05),lv=p.levels[id]??.3,pan=p.pan[id]||0,room=p.room[id]||0,echo=p.echo[id]||0,step=MU?.step??0,h=unit(mix(step,id.length*131+(neighbor?7:0)));
  const kit=p.kit.id||'tech';
  if(id==='kick'){const f=kickPitch(runtime.hz?.(runtime.root?.()??45),p.kit.kickHz||52);play(buffer('kick:'+kit+':'+f,sr=>ONE_SHOTS.kick(sr,f,p.kit.kick)),t,.5*base*lv,{dest:d.dry});duckAll(t,p);
   if(!neighbor&&p.ghostHats&&step%4===0){const six=runtime.SIX||.12,sw=swingOf(gid),hb=buffer('hat:'+p.kit.hatTone,sr=>ONE_SHOTS.hat(sr,false,p.kit.hatTone));
    for(const k of [1,3]){const r=unit(mix(step+k,977));if(r<.72)play(hb,t+(k+sw)*six+(r-.5)*.003,.5*p.ghostHats*(.7+.4*r),{dest:d.dry,pan:p.pan.ghost});}}
   return true;}
  const time=t+(h-.5)*.003,gain=.5*Math.min(4,base)*lv;
  if(id==='hat'||id==='hatO')play(buffer(id+':'+p.kit.hatTone,sr=>ONE_SHOTS.hat(sr,id==='hatO',p.kit.hatTone)),time,gain,{dest:d.dry,pan});
  else if(id==='clap'){play(buffer('clap',sr=>ONE_SHOTS.clap(sr)),t+.003,gain,{dest:d.dry,room:p.kit.clapRoom});play(buffer('snare',sr=>ONE_SHOTS.snare(sr)),t,gain*p.kit.snareUnderClap,{dest:d.dry,room:.15});}
  else if(id==='snare')play(buffer('snare',sr=>ONE_SHOTS.snare(sr)),time,gain,{dest:d.dry,room});
  else if(id==='rim')play(buffer('rim',sr=>ONE_SHOTS.rim(sr)),time,gain,{dest:d.dry,pan,room,echo:step%16===14?echo:0});
  else if(id==='shaker')play(buffer('shaker',sr=>ONE_SHOTS.shaker(sr)),time,gain,{dest:d.dry,pan:pan*(step%4===1?-1:1)});
  else if(id==='wood')play(buffer('wood',sr=>ONE_SHOTS.perc(sr,780,.035)),time,gain,{dest:d.dry,pan,room,echo});
  else if(id==='tom'||id==='conga'){const f=Math.round(Math.max(40,Math.min(900,x||(id==='tom'?90:200))));play(buffer(id+':'+f,sr=>ONE_SHOTS.perc(sr,f,id==='tom'?.12:.07)),time,gain,{dest:d.dry,pan,room});}
  else if(id==='cowbell')play(buffer('cowbell',sr=>ONE_SHOTS.cowbell(sr)),time,gain,{dest:d.dry,pan});
  else if(id==='blip'){const f=Math.round(runtime.hz?.(x)||440);play(buffer('blip:'+f,sr=>ONE_SHOTS.perc(sr,f,.08)),time,gain,{dest:d.duck,pan,room,echo});}
  else return false;
  return true;
 }
 // ---------- voices: bass, melody and chords ----------
 const hzOf=n=>runtime.hz?runtime.hz(n):440*Math.pow(2,(n-69)/12);
 // Drawbar organ and tine harmonics as periodic waves, made once per context (a square or sine without them).
 function wave(kind){const e=E;if(!e.ac.createPeriodicWave)return null;let w=e.waves.get(kind);if(!w){const h=kind==='organ'?[0,1,.85,.5,.38,0,.22,0,.16]:[0,1,.3,.1];w=e.ac.createPeriodicWave(new Float32Array(h.length),new Float32Array(h));e.waves.set(kind,w);}return w;}
 // A progressive build: pads and leads open over the phrase (counted from the bar a region took over, or the clock).
 let phraseAt=null;
 function buildCut(p,fallback){const b=p.build;if(!b)return fallback;const st=runtime.MU?.step??0,bar=st>>4,phrase=phraseAt?phraseAt.phrase+bar-phraseAt.bar:bar;
  const x=Math.min(1,(((phrase%b.bars)+b.bars)%b.bars+(st%16)/16)/(b.bars*.75));return b.low*Math.pow(b.high/b.low,x*x);}
 function splitBass(d,p,n,t,level){const e=E,ac=e.ac,hz=hzOf;let s=n;while(hz(s)>80)s-=12;while(hz(s)<38)s+=12;
  const len=p.bass.steps*(runtime.SIX||.12),o=count(ac.createOscillator()),a=count(ac.createGain());
  o.frequency.value=hz(s);a.gain.setValueAtTime(0,t);a.gain.linearRampToValueAtTime(.24*level*p.bass.sub,t+.005);a.gain.setValueAtTime(.24*level*p.bass.sub,t+len);a.gain.linearRampToValueAtTime(0,t+len+.035);o.connect(a).connect(d.duck);o.start(t);o.stop(t+len+.06);
  const lp=count(ac.createBiquadFilter()),hp=count(ac.createBiquadFilter()),b=count(ac.createGain()),saws=[-8,8].map(dt=>{const s2=count(ac.createOscillator());s2.type='sawtooth';s2.frequency.value=hz(n);s2.detune.value=dt;s2.connect(lp);s2.start(t);s2.stop(t+len+.08);return s2;});
  lp.type='lowpass';lp.Q.value=3.2;const top=300+1700*p.bass.bright;lp.frequency.setValueAtTime(220,t);lp.frequency.linearRampToValueAtTime(top,t+.006);lp.frequency.setTargetAtTime(260,t+.008,.07+.1*p.bass.bright);
  hp.type='highpass';hp.frequency.value=110;b.gain.setValueAtTime(0,t);b.gain.linearRampToValueAtTime(.09*level*p.bass.mid,t+.003);b.gain.setValueAtTime(.09*level*p.bass.mid,t+len);b.gain.linearRampToValueAtTime(0,t+len+.03);lp.connect(hp).connect(b).connect(d.duck);
  o.onended=()=>{for(const x of [o,a,lp,hp,b,...saws])x.disconnect();};}
 // Acid house: one saw through a resonant low-pass, the 303 way. Its envelope snaps open on each note (more on an
 // accent), the cutoff breathes over the cycle, some notes slide from the last one; a light sub under it and drive.
 function acidBass(d,p,n,t,level,step){const e=E,ac=e.ac,b=p.bass,six=runtime.SIX||.12,f=hzOf(n);
  if(!d.acid){const g=count(ac.createGain()),sh=count(ac.createWaveShaper?ac.createWaveShaper():ac.createGain());
   if(sh.curve!==undefined){const c=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i/1023*2-1;c[i]=Math.tanh(b.drive*x)/Math.tanh(b.drive);}sh.curve=c;}g.connect(sh).connect(d.duck);d.acid={in:g,last:null};}
  const prev=d.acid.last,slide=!!prev&&t>prev.t&&t-prev.t<=six*1.6&&unit(mix(step,303))<b.slide,accent=unit(mix(step,909))<b.accent||level>1.2;
  const bar=step>>4,cyc=.5-.5*Math.cos(TAU*((bar%b.cycle)+(step%16)/16)/b.cycle),cut=b.low*Math.pow(b.high/b.low,cyc)*(accent?1.45:1),len=six*b.steps*(slide?1.05:.8);
  const o=count(ac.createOscillator()),lp=count(ac.createBiquadFilter()),a=count(ac.createGain()),list=[o,lp,a];o.type='sawtooth';
  if(slide){o.frequency.setValueAtTime(prev.f,t);o.frequency.exponentialRampToValueAtTime(f,t+.055);}else o.frequency.setValueAtTime(f,t);
  lp.type='lowpass';lp.Q.value=b.q+(accent?4:0);lp.frequency.setValueAtTime(Math.min(9000,cut*(slide?1.6:3)),t);lp.frequency.setTargetAtTime(Math.max(120,cut*.4),t+.003,accent?.1:.07);
  const peak=.1*level*b.mid*(accent?1.35:1);a.gain.setValueAtTime(0,t);a.gain.linearRampToValueAtTime(peak,t+.003);a.gain.setValueAtTime(peak,t+len);a.gain.linearRampToValueAtTime(0,t+len+.025);
  o.connect(lp).connect(a).connect(d.acid.in);o.start(t);o.stop(t+len+.05);
  if(b.sub){let s=n;while(hzOf(s)>80)s-=12;while(hzOf(s)<38)s+=12;const so=count(ac.createOscillator()),sg=count(ac.createGain());so.frequency.value=hzOf(s);
   sg.gain.setValueAtTime(0,t);sg.gain.linearRampToValueAtTime(.24*level*b.sub,t+.005);sg.gain.setValueAtTime(.24*level*b.sub,t+len);sg.gain.linearRampToValueAtTime(0,t+len+.03);so.connect(sg).connect(d.duck);so.start(t);so.stop(t+len+.05);list.push(so,sg);}
  d.acid.last={t,f};o.onended=()=>{for(const x of list)x.disconnect();};}
 function proVoice(role,ty,m,t,v,region){
  if(!live()||runtime.currentVoiceOrigin!=='track'||!region||!Number.isFinite(m)||!Number.isFinite(t))return false;
  const p=soundProfile(region.genre);if(!p.ready)return false;const e=E&&E.ac===runtime.ac?E:null;if(!e)return false;
  learn(region.key,region.genre);const d=deck(region.key,p),ac=e.ac,hz=hzOf,six=runtime.SIX||.12;
  if(role==='bajo'){
   if(mixKeys&&inDrop())return true;
   let n=m;while(n>52)n-=12;while(n<38)n+=12;const level=Math.min(3,v/.14);
   if(p.bass.kind==='acid')acidBass(d,p,n,t,level,runtime.MU?.step??0);else splitBass(d,p,n,t,level);
   voices++;return true;
  }
  const MU=runtime.MU,arrangement=region.key===MU?.dnaA?.key?MU?.radio:MU?.neighborRadio;let melody=role==='lead'&&!!arrangement?.hookI&&ty===arrangement.hookI;
  if(melody&&p.syncChords){if(d.melodyT!==undefined&&Math.abs(t-d.melodyT)<.002)melody=false;else d.melodyT=t;}
  if(melody){d.lead=(d.lead+1)%p.lead.keep;if(d.lead!==1%p.lead.keep)return true;}
  if(role==='acorde')runtime.recordInstrument?.(ty);
  const style=melody?p.lead:p.chords,kind=style.map?.[ty]||style.kind,level=Math.min(3,v/(melody?.07:role==='acorde'?.05:.025))*style.level,h=unit(mix(Math.round(t*1000),m));
  let n=m;const [lo,hi]=melody?[60,76]:kind==='pad'?[48,69]:[52,72];while(n>hi)n-=12;while(n<lo)n+=12;
  const out=count(ac.createGain()),pan=count(ac.createStereoPanner()),list=[out,pan],oscs=[];pan.pan.value=Math.max(-.6,Math.min(.6,(h-.5)*(melody?.6:kind==='pad'?1.2:.9)));out.connect(pan).connect(d.duck);
  const send=(amount,to)=>{if(!amount)return;const s=count(ac.createGain());s.gain.value=amount;pan.connect(s).connect(to);list.push(s);};
  send(style.room,e.verbIn);send(style.hall,e.hallIn);send(style.echo,e.echoIn);
  const osc=(type,f,dt=0)=>{const o=count(ac.createOscillator());if(type&&typeof type==='object')o.setPeriodicWave(type);else o.type=type;o.frequency.value=f;if(dt)o.detune.value=dt;list.push(o);oscs.push(o);return o;};
  const hold=(style.hold||2)*six,f=hz(n);let first,end;
  if(kind==='chop'){   // a synthetic vocal chop: a saw through two vowel formants (no recorded voice)
   const o=osc('sawtooth',f),vow=[[800,1150],[400,2000],[600,1000],[350,1700]][Math.floor(h*4)%4];first=o;
   for(const [fq,gq] of [[vow[0],1],[vow[1],.6]]){const b=count(ac.createBiquadFilter()),g=count(ac.createGain());b.type='bandpass';b.frequency.value=fq;b.Q.value=7;g.gain.value=gq;o.connect(b).connect(g).connect(out);list.push(b,g);}
   out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(.3*level,t+.01);out.gain.setTargetAtTime(0,t+.15,.04);end=t+.6;
  }else if(kind==='ep'){   // Rhodes-like: a sine bell (FM, index falling fast) and a quiet tine an octave up
   const o=osc('sine',f),mo=osc('sine',f),mg=count(ac.createGain()),tine=osc(wave('tine')||'sine',f*2),tg=count(ac.createGain());list.push(mg,tg);first=o;
   mg.gain.setValueAtTime(f*2.2,t);mg.gain.setTargetAtTime(f*.2,t+.002,.12);mo.connect(mg).connect(o.frequency);o.connect(out);
   tg.gain.setValueAtTime(.22,t);tg.gain.setTargetAtTime(0,t+.002,.08);tine.connect(tg).connect(out);
   out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(.12*level,t+.004);out.gain.setTargetAtTime(.05*level,t+.01,.25);out.gain.setTargetAtTime(0,t+hold,.16);end=t+hold+1;
  }else if(kind==='organ'){   // drawbar organ: two slightly detuned voices, a soft key click
   const w=wave('organ')||'square',lp=count(ac.createBiquadFilter());lp.type='lowpass';lp.frequency.value=w==='square'?2400:6000;lp.Q.value=.5;lp.connect(out);list.push(lp);
   for(const dt of [-5,5]){const o=osc(w,f,dt);o.connect(lp);first=first||o;}
   out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(.07*level,t+.006);out.gain.setValueAtTime(.07*level,t+hold);out.gain.setTargetAtTime(0,t+hold,.07);end=t+hold+.5;
  }else if(kind==='pad'){   // warm pad: three detuned saws under a soft low-pass (the build opens it), slow in and out
   const lp=count(ac.createBiquadFilter()),cut=buildCut(p,1500);lp.type='lowpass';lp.Q.value=.7;lp.frequency.setValueAtTime(cut*.6,t);lp.frequency.linearRampToValueAtTime(cut,t+hold*.6);lp.connect(out);list.push(lp);
   for(const dt of [-14,0,14]){const o=osc('sawtooth',f,dt);o.connect(lp);first=first||o;}
   out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(.032*level,t+Math.min(.3,hold*.4));out.gain.setValueAtTime(.032*level,t+hold);out.gain.setTargetAtTime(0,t+hold,.45);end=t+hold+3;
  }else if(kind==='mallet'){   // marimba-like: a sine and its bright overtone (×3.98), struck and gone
   const o=osc('sine',f),ov=osc('sine',f*3.98),og=count(ac.createGain());list.push(og);first=o;o.connect(out);og.gain.setValueAtTime(.35,t);og.gain.setTargetAtTime(0,t+.002,.035);ov.connect(og).connect(out);
   out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(.17*level,t+.002);out.gain.setTargetAtTime(0,t+.004,.2);end=t+1.4;
  }else if(kind==='supersaw'){   // progressive lead: three wide saws, a plucked low-pass that the build opens
   const lp=count(ac.createBiquadFilter()),cut=buildCut(p,3000);lp.type='lowpass';lp.Q.value=1.4;lp.frequency.setValueAtTime(Math.min(16000,cut*1.6),t);lp.frequency.setTargetAtTime(cut*.35,t+.004,.12);lp.connect(out);list.push(lp);
   for(const dt of [-18,0,18]){const o=osc('sawtooth',f,dt);o.connect(lp);first=first||o;}
   out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(.045*level,t+.003);out.gain.setTargetAtTime(0,t+.02,.16);end=t+1;
  }else{   // a short detuned saw stab
   const lp=count(ac.createBiquadFilter()),top=style.cut||2600;lp.type='lowpass';lp.Q.value=2;lp.frequency.setValueAtTime(top,t);lp.frequency.setTargetAtTime(500,t+.004,.06);lp.connect(out);list.push(lp);
   for(const dt of [-12,12]){const o=osc('sawtooth',f,dt);o.connect(lp);first=first||o;}
   out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(.06*level,t+.003);out.gain.setTargetAtTime(0,t+.02,.07);end=t+.5;
  }
  for(const o of oscs){o.start(t);o.stop(end);}
  first.onended=()=>{for(const x of list)x.disconnect();};voices++;return true;
 }
 Object.defineProperties(runtime,{
  proDrum:{get:()=>proDrum},proVoice:{get:()=>proVoice},proCeiling:{get:()=>()=>live()&&ready(runtime.MU?.dnaA?.genre)?CEILING:0},
  soundProClassic:{get:()=>classic},setSoundProClassic:{get:()=>setClassic},
  soundProStats:{get:()=>()=>({nodes,hits,voices,decks:E?E.decks.size:0,buffers:E?E.buffers.size:0})}
 });
}
