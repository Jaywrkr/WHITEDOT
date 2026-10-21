import {openSurface,prefersReducedMotion} from './frame-state.js';
import {wearing} from './cube-shop-model.js';
// Cube shop batch 5: pulse voices, cube sounds and step notes. Synthesized here on the music bus, in the region's
// harmony and on the game's eighth-note clock; nothing changes reach, movement or the master volume.
export const SHOP_VOICES=Object.freeze(['voice:808','voice:bell','voice:acid','voice:vocal','voice:scratch','voice:chord']);
export const SHOP_SOUNDS=Object.freeze(['sound:hat','sound:filter','sound:hum','sound:dj','sound:antenna']);
const TAU=Math.PI*2;
export const fit=(n,lo,hi)=>{while(n<lo)n+=12;while(n>hi)n-=12;return n;};
const hzOf=m=>440*Math.pow(2,(m-69)/12);
function shaped(ac,t,a,peak,dec){const g=ac.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,peak),t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dec);return g;}
function osc(ac,type,freq,t,end){const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(freq,t);o.start(t);o.stop(end);return o;}
function filter(ac,type,freq,q=1){const f=ac.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;return f;}
// Five vowels for Corte vocal: the first two formants of a, o, i, e, u.
const VOWELS=[[730,1090],[570,840],[300,2290],[530,1840],[300,870]];
function scratch(ac,out,t,m,v,noise){
 const g=shaped(ac,t,.005,v*.75,.2),band=filter(ac,'bandpass',900,3);band.frequency.setValueAtTime(900,t);band.frequency.linearRampToValueAtTime(2600,t+.07);band.frequency.linearRampToValueAtTime(700,t+.2);
 if(noise){const s=ac.createBufferSource();s.buffer=noise;s.playbackRate.setValueAtTime(.6,t);s.playbackRate.linearRampToValueAtTime(1.8,t+.07);s.playbackRate.linearRampToValueAtTime(.5,t+.2);s.connect(band);s.start(t);s.stop(t+.25);}
 const tone=osc(ac,'sawtooth',hzOf(m)*1.5,t,t+.25),low=filter(ac,'lowpass',1200),tg=ac.createGain();tone.frequency.linearRampToValueAtTime(hzOf(m)*2.2,t+.07);tone.frequency.linearRampToValueAtTime(hzOf(m)*.6,t+.2);tg.gain.value=.35;
 tone.connect(low).connect(tg).connect(g);band.connect(g);g.connect(out);
}
// One pulse in a bought voice. Returns the notes it played (MIDI), for tests and cues.
export function playShopVoice(ac,out,id,t,n,v,{tones=[],noise=null}={}){
 if(!ac||!out||!SHOP_VOICES.includes(id)||!Number.isFinite(n)||!(v>0))return [];
 if(id==='voice:808'){const m=fit(n,31,43),o=osc(ac,'sine',hzOf(m)*2.6,t,t+.9),g=shaped(ac,t,.004,v*1.25,.75);o.frequency.exponentialRampToValueAtTime(hzOf(m),t+.07);o.connect(g).connect(out);return [m];}
 if(id==='voice:bell'){const m=fit(n,72,84),c=osc(ac,'sine',hzOf(m),t,t+1.4),mod=osc(ac,'sine',hzOf(m)*3.5,t,t+1.4),depth=ac.createGain(),g=shaped(ac,t,.002,v*.42,1.25);depth.gain.setValueAtTime(hzOf(m)*2.2,t);depth.gain.exponentialRampToValueAtTime(hzOf(m)*.05,t+.9);mod.connect(depth).connect(c.frequency);c.connect(g).connect(out);return [m];}
 if(id==='voice:acid'){const m=fit(n,36,48),o=osc(ac,'sawtooth',hzOf(m+12),t,t+.35),f=filter(ac,'lowpass',2400,14),g=shaped(ac,t,.003,v*.5,.2);o.frequency.exponentialRampToValueAtTime(hzOf(m),t+.04);f.frequency.setValueAtTime(2400,t);f.frequency.exponentialRampToValueAtTime(260,t+.16);o.connect(f).connect(g).connect(out);return [m];}
 if(id==='voice:vocal'){const m=fit(n,55,67),[a,b]=VOWELS[((m%5)+5)%5],src=osc(ac,'sawtooth',hzOf(m),t,t+.25),g=shaped(ac,t,.004,v*1.1,.13);for(const [freq,level]of [[a,1],[b,.6]]){const f=filter(ac,'bandpass',freq,9),l=ac.createGain();l.gain.value=level;src.connect(f).connect(l).connect(g);}g.connect(out);return [m];}
 if(id==='voice:scratch'){const m=fit(n,48,60);scratch(ac,out,t,m,v,noise);return [m];}
 const notes=(tones.length>=3?tones.slice(0,3):[n,n+4,n+7]).map(x=>fit(x,55,72)),low=filter(ac,'lowpass',2400);low.connect(out);
 notes.forEach((m,i)=>{const at=t+i*.014,g=shaped(ac,at,.006,v*.32,.9),o=osc(ac,'triangle',hzOf(m),at,at+1);o.connect(g).connect(low);});
 return notes;
}
// Cube sounds, small and quiet.
export function playHum(ac,out,t,m,v){const g=shaped(ac,t,.09,v,.55),low=filter(ac,'lowpass',900);for(const [type,k,level]of [['sine',1,1],['triangle',2,.3]]){const o=osc(ac,type,hzOf(m)*k,t,t+.75),l=ac.createGain();l.gain.value=level;o.connect(l).connect(low);}low.connect(g).connect(out);return m;}
export function playRadio(ac,out,t,m,v){const g=shaped(ac,t,.01,v,.25),band=filter(ac,'bandpass',1400,2.5),o=osc(ac,'square',hzOf(m),t,t+.4);o.connect(band).connect(g).connect(out);return m;}
export function playStepNote(ac,out,t,m,v){const g=shaped(ac,t,.003,v,.5),a=osc(ac,'triangle',hzOf(m),t,t+.6),b=osc(ac,'sine',hzOf(m)*2,t,t+.6),l=ac.createGain();l.gain.value=.25;a.connect(g);b.connect(l).connect(g);g.connect(out);return m;}
export function playScratch(ac,out,t,m,v,noise){scratch(ac,out,t,fit(m,48,60),v,noise);return m;}
// Where the filter sits for a speed (world units per second): almost closed when still, wide open when running.
export const filterCutoff=speed=>Math.round(Math.exp(Math.log(4200)+(Math.log(18000)-Math.log(4200))*Math.min(1,Math.max(0,speed)/160)));
// A step note's degree comes from where it lies, so the same path always plays the same tune.
export const stepDegree=(x,y)=>((Math.floor(x/64)*3+Math.floor(y/64)*5)%7+7)%7;
// Glyphs that show each piece: in the shop picture and, small, beside the cube when it sounds.
export function drawSoundGlyph(c,id,x,y,s,t,{color='#fff',ink='#fff',alpha=1,calm=false}={}){
 c.save();c.globalAlpha=alpha;c.strokeStyle=c.fillStyle=ink;c.lineWidth=1;const px=(a,b,w=1,h=1)=>c.fillRect(Math.round(a),Math.round(b),w,h),gx=x+s*.9+8,gy=y-s*.4;
 if(id==='voice:808'){c.beginPath();c.arc(gx+6,gy+4,7,0,TAU);c.stroke();c.beginPath();c.arc(gx+6,gy+4,3,0,TAU);c.fill();}
 else if(id==='voice:bell'){c.beginPath();c.moveTo(gx,gy+10);c.lineTo(gx+12,gy+10);c.lineTo(gx+10,gy+7);c.lineTo(gx+10,gy+2);c.quadraticCurveTo(gx+6,gy-3,gx+2,gy+2);c.lineTo(gx+2,gy+7);c.closePath();c.stroke();px(gx+5,gy+11,2,2);}
 else if(id==='voice:acid'){c.beginPath();for(let i=0;i<=14;i++){const k=i%4;c.lineTo(gx+i,gy+4+(k===0?-5:k===1?3:k===2?1:4));}c.stroke();}
 else if(id==='voice:vocal'){c.strokeRect(gx+.5,gy-2.5,14,10);c.beginPath();c.moveTo(gx+3,gy+7.5);c.lineTo(gx+1,gy+11);c.lineTo(gx+6,gy+7.5);c.stroke();for(let i=0;i<5;i++)px(gx+3+i*2,gy+2-(i%2?1:-1)*(i===2?2:1),1,2);}
 else if(id==='voice:scratch'||id==='sound:dj'){const turn=calm?0:t/220;c.beginPath();c.arc(gx+6,gy+4,7,0,TAU);c.stroke();px(gx+5,gy+3,2,2);c.beginPath();c.arc(gx+6,gy+4,4.5,turn,turn+1.2);c.stroke();if(id==='sound:dj'){px(gx-3,gy+4,2,1);px(gx+15,gy+4,2,1);}}
 else if(id==='voice:chord'){for(let i=0;i<3;i++){px(gx+i*4,gy+8-i*4,3,3);px(gx+i*4+2,gy+i*-4-1,1,9);}}
 else if(id==='sound:hat'){const lift=calm?0:Math.abs(Math.sin(t/120))*2;px(gx,gy-lift,11,1);px(gx+1,gy-1-lift,9,1);px(gx,gy+2,11,1);px(gx+5,gy+3,1,9);px(gx+2,gy+12,7,1);}
 else if(id==='sound:filter'){c.beginPath();c.moveTo(gx,gy+2);c.lineTo(gx+7,gy+2);c.quadraticCurveTo(gx+10,gy,gx+11,gy+11);c.stroke();px(gx+13,gy-2,1,7);px(gx+12,gy-1,3,1);}
 else if(id==='sound:hum'){const rise=calm?0:(t/40)%10;for(let i=0;i<2;i++){const nx=gx+i*7,ny=gy+4-i*5-rise*.4;px(nx,ny,3,2);px(nx+2,ny-6,1,6);}}
 else if(id==='sound:antenna'){const top=y-s/2;c.strokeStyle=color;px(x,top-9,1,9);c.fillStyle=ink;px(x-1,top-11,3,3);for(let k=1;k<=2;k++){c.globalAlpha=alpha*(calm?.6:.4+.4*Math.sin(t/200-k));c.beginPath();c.arc(x,top-10,3+k*3,-2.4,-.7);c.stroke();}}
 else if(id==='trail:notes'){for(let i=0;i<4;i++){const nx=x-s-6-i*12,ny=y+s*.4+(i%2)*3;c.globalAlpha=alpha*(1-i*.18);px(nx,ny,3,2);px(nx+2,ny-5,1,5);}}
 c.restore();
}
export function initialize(runtime){
 let owner=null,lastT=null,lastX=0,lastY=0,speed=0,stopped=0,lastFast=null,djAt=-1e9,hatPending=-1e9,humPending=-1e9,radioPending=-1e9,eighth=0,glyphAt=-1e9,glyph='',humAt=-1e9,radioAt=-1e9,hatAt=-1e9,cutoff=null,neighbour=null,neighbourAt=-1e9,marks=[],lastMark=null;
 const counts={voice:0,hat:0,hum:0,dj:0,radio:0,step:0,filter:0};
 // The cube sounds wherever it is seen: the World and the house.
 const here=()=>runtime.inWorld()||!!runtime.houseActive?.(),house=()=>!!runtime.houseActive?.();
 const q=()=>runtime.sparkEconomy||{},has=id=>here()&&wearing(q(),id);
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const surface=()=>!house()&&(runtime.S.layer||'superficie')==='superficie';
 const live=()=>!!(runtime.S.sound&&runtime.ac&&runtime.bus&&here()&&!globalThis.document?.hidden&&!openSurface('.modal:not([hidden])'));
 const level=x=>runtime.vel?.(x)??x;
 const queue=fn=>{runtime.MU?.q8?.push({fn:time=>{if(live())fn(time);}});};
 const voiceId=()=>{const id=q().wear?.pulseVoice||'';return here()&&SHOP_VOICES.includes(id)?id:'';};
 // getVoice hands the pulse to a bought voice; the voice keeps its role so loops and budgets treat it the same.
 function pulseVoice(raw){const id=voiceId();return id?Object.freeze({...raw,instrument:'shop:'+id,volume:.82}):null;}
 function play(instrument,n,t,v,frame){
  const id=instrument.slice(5);if(!SHOP_VOICES.includes(id)||!runtime.ac||!runtime.bus)return false;
  const tones=frame?.chords?.length?frame.chords:runtime.chordTones?.()||[];
  const notes=playShopVoice(runtime.ac,runtime.bus,id,t,n,v,{tones,noise:runtime.noiseBuffer});if(!notes.length)return false;
  counts.voice++;glyph=id;glyphAt=performance.now()+Math.max(0,(t-runtime.ac.currentTime)*1000);runtime.shopSoundCue?.({id,notes,time:t});return true;
 }
 function region(){return runtime.MU?.dnaT||runtime.regionOfPos?.(runtime.S.wx,runtime.S.wy);}
 function noteOf(rg,degree,lo,hi){if(!rg?.scale)return null;const tr=(runtime.BIOMES?.[rg.z]?.tr||0)+(rg.trOff||0),d=((degree%7)+7)%7;const n=57+tr+rg.scale[d]+12*Math.floor(degree/7);return Number.isFinite(n)?fit(n,lo,hi):null;}
 function findNeighbour(now){
  if(now-neighbourAt<1000)return neighbour;neighbourAt=now;neighbour=null;const S=runtime.S,here=runtime.regionOfPos?.(S.wx,S.wy);if(!here)return null;
  for(const r of [450,800])for(let i=0;i<8&&!neighbour;i++){const a=i*TAU/8,rg=runtime.regionOfPos(S.wx+Math.cos(a)*r,S.wy+Math.sin(a)*r);if(rg&&rg.key!==here.key)neighbour={region:rg,distance:r,angle:a};}
  return neighbour;
 }
 function sample(t){
  const S=runtime.S,pos=house()?runtime.houseMotion?.()||{x:S.wx,y:S.wy}:{x:S.wx,y:S.wy};if(owner!==S){owner=S;lastT=null;marks=[];lastMark=null;lastFast=null;}
  if(lastT===null||t<lastT||t-lastT>500){lastT=t;lastX=pos.x;lastY=pos.y;return 0;}
  const dt=(t-lastT)/1000,dx=pos.x-lastX,dy=pos.y-lastY,scale=!house()&&S.layer==='bajo'?8:!house()&&S.layer==='cielo'?6:1;lastT=t;lastX=pos.x;lastY=pos.y;const moved=Math.hypot(dx,dy)/scale;
  if(moved>400)return 0;
  speed=speed*.7+moved/Math.max(dt,.001)*.3;stopped=speed<8?stopped+dt:0;
  // Modo DJ: moving fast again in a very different direction soon after, like pulling a record back.
  if(speed>60&&moved>.5){const h=Math.atan2(dy,dx);if(lastFast&&t-lastFast.t<900){let d=Math.abs(h-lastFast.h)%TAU;if(d>Math.PI)d=TAU-d;if(d>1.9&&t-djAt>350&&has('sound:dj')){djAt=t;if(live())queue(time=>{playScratch(runtime.ac,runtime.bus,time,noteOf(region(),0,48,60)??52,level(.05),runtime.noiseBuffer);counts.dj++;});}}lastFast={h,t};}
  return moved;
 }
 function sounds(t,moved){
  if(!live())return;const ac=runtime.ac,now=ac.currentTime;
  if(has('sound:hat')&&speed>40&&now-hatPending>.5){hatPending=now;queue(time=>{hatPending=-1e9;if(speed<=40)return;eighth++;runtime.hatHit?.(time,level(eighth%2?.03:.045));counts.hat++;hatAt=performance.now()+Math.max(0,(time-runtime.ac.currentTime)*1000);});}
  if(has('sound:hum')&&stopped>2&&now-humPending>2){humPending=now;queue(time=>{const rg=region(),k=counts.hum,pattern=[0,2,4,2,5,4,2,1];const m=noteOf(rg,pattern[k%8]+(runtime.MU?.deg||0),55,67);if(m==null||stopped<=2)return;playHum(runtime.ac,runtime.bus,time,m,level(.03));counts.hum++;humAt=performance.now()+Math.max(0,(time-runtime.ac.currentTime)*1000);});}
  if(has('sound:antenna')&&surface()&&now-radioPending>2.2){const n=findNeighbour(t);if(n){radioPending=now;queue(time=>{const k=counts.radio,v=level(n.distance<600?.03:.018),six=runtime.SIX||.125;for(const [i,d]of [[0,k%5],[1,(k*3+2)%7]].entries()){const m=noteOf(n.region,d,60,76);if(m!=null)playRadio(runtime.ac,runtime.bus,time+i*six*2,m,v);}counts.radio++;radioAt=performance.now()+Math.max(0,(time-runtime.ac.currentTime)*1000);});}}
 }
 // Step notes are drawn even when silent; stepping on one again plays it when the sound is on.
 function stepNotes(t,moved){
  if(!has('trail:notes')||!surface()||!moved)return;const S=runtime.S,sound=live();
  if(!lastMark||Math.hypot(S.wx-lastMark.x,S.wy-lastMark.y)>=64){lastMark={x:Math.round(S.wx),y:Math.round(S.wy),born:t,hit:-1e9,degree:stepDegree(S.wx,S.wy)};marks.push(lastMark);if(marks.length>24)marks.shift();}
  for(const m of marks){if(m===lastMark||t-m.born<1200||t-m.hit<1000||Math.hypot(S.wx-m.x,S.wy-m.y)>14)continue;m.hit=t;if(sound)queue(time=>{const n=noteOf(region(),m.degree,60,79);if(n==null)return;playStepNote(runtime.ac,runtime.bus,time,n,level(.06));counts.step++;});}
 }
 function filterTick(){
  // Only while walking the World surface: Camino, Casa and activities always hear the music open.
  const want=has('sound:filter')&&surface()&&runtime.S.mode==='world'&&!runtime.activityActive&&runtime.S.sound&&!runtime.inPond&&runtime.ac&&runtime.mfilt;
  if(!want){if(cutoff!==null&&runtime.mfilt&&runtime.ac&&!runtime.inPond)runtime.mfilt.frequency.setTargetAtTime(18000,runtime.ac.currentTime,.3);cutoff=null;return;}
  const target=filterCutoff(speed);if(cutoff===null||Math.abs(target-cutoff)/cutoff>.08){cutoff=target;runtime.mfilt.frequency.setTargetAtTime(target,runtime.ac.currentTime,.25);counts.filter++;}
 }
 // Under the cube: step notes on the ground.
 function drawUnder(c,x,y,s,t){
  if(!runtime.inWorld())return;const moved=sample(t);sounds(t,moved);stepNotes(t,moved);
  if(!has('trail:notes')||!surface())return;const S=runtime.S,ox=x-S.wx,oy=y-S.wy,ink=runtime.musicInk?.(null,'lead')||'#fff',still=calm();c.save();c.fillStyle=ink;
  for(const m of marks){const sx=m.x+ox,sy=m.y+oy;if(sx<-8||sy<-8||sx>runtime.W+8||sy>runtime.H+8)continue;const glow=Math.max(0,1-(t-m.hit)/600);c.globalAlpha=.45+glow*.55;c.fillRect(Math.round(sx-1),Math.round(sy),3,2);c.fillRect(Math.round(sx+1),Math.round(sy-5),1,5);if(glow&&!still){c.globalAlpha=glow*.6;c.strokeStyle=ink;c.strokeRect(Math.round(sx-5)+.5,Math.round(sy-7)+.5,11,11);}}
  if(still&&!marks.length)drawSoundGlyph(c,'trail:notes',x,y,s,t,{ink,calm:true,alpha:.7});
  c.restore();
 }
 // Over the cube: what is sounding right now.
 function drawOver(c,x,y,s,t){
  if(!runtime.inWorld())return;const ink=runtime.musicInk?.(null,'lead')||'#fff',color=runtime.cubeColor?.()||'#fff',still=calm(),now=performance.now(),fade=at=>Math.max(0,1-(now-at)/500);
  if(has('sound:antenna'))drawSoundGlyph(c,'sound:antenna',x,y,s,t,{color,ink:fade(radioAt)>0?ink:color,calm:still,alpha:.9});
  if(has('sound:hat')&&fade(hatAt)>0)drawSoundGlyph(c,'sound:hat',x,y,s,t,{ink,calm:still,alpha:.5+.5*fade(hatAt)});
  if(has('sound:hum')&&(fade(humAt)>0||still&&stopped>2))drawSoundGlyph(c,'sound:hum',x,y,s,t,{ink,calm:still,alpha:still?.8:fade(humAt)});
  if(has('sound:dj')&&now-djAt<500)drawSoundGlyph(c,'sound:dj',x,y,s,t,{ink,calm:still,alpha:1-(now-djAt)/500});
  if(has('sound:filter')&&speed>40)drawSoundGlyph(c,'sound:filter',x,y,s,t,{ink,calm:still,alpha:Math.min(.8,speed/160)});
  if(glyph&&voiceId()===glyph&&fade(glyphAt)>0)drawSoundGlyph(c,glyph,x,y,s,t,{ink,calm:still,alpha:fade(glyphAt)});
 }
 Object.defineProperties(runtime,{cubeShopPulseVoice:{get:()=>pulseVoice},cubeShopFilterTick:{get:()=>filterTick},cubeShopSoundTick:{get:()=>t=>{if(!here())return;const moved=sample(t);sounds(t,moved);}},playCubeShopVoice:{get:()=>play},drawCubeShopSoundUnder:{get:()=>drawUnder},drawCubeShopSoundOver:{get:()=>drawOver},
  cubeShopSounds:{get:()=>()=>({...counts,speed,stopped,cutoff,marks:marks.length,neighbour:neighbour?.region?.key||null})}});
}
