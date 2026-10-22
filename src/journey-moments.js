import {prefersReducedMotion} from './frame-state.js';
import {playCello} from './journey-pulse.js';
// The Journey's moments in its first chapters (docs/VIAJE.md):
// - Llanura: a lighthouse in the distance with its own voice, a held tone that grows as you come near; reached, it
//   lights on every beat.
// - Lago: five lotuses around you answer the theme: a note on time near one opens it and it sings the note a fifth up.
// - Bosque: the first creature that follows you; it repeats each of your notes an octave down, half a bar later, and
//   stays with you until the Vacío, which it cannot enter.
// Places come from the World's map and the player's position, kept in S.journey.moments; no random sequence is used.
export const FARO_DISTANCE=520,FARO_REACH=60,FARO_HEAR=900,LOTUS_COUNT=5,LOTUS_RING=170,LOTUS_NEAR=120;
export function normalizeMoments(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{},pt=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)?{x:Math.round(p.x),y:Math.round(p.y)}:null,out={};
 const faro=pt(q.faro);if(faro)out.faro={...faro,reached:q.faro.reached===true};const lotos=pt(q.lotos);if(lotos)out.lotos={...lotos,open:Array.from({length:LOTUS_COUNT},(_,i)=>q.lotos.open?.[i]===true)};if(q.companion===true)out.companion=true;return out;}
// The lighthouse: the first of eight directions, at a fixed distance, that stays in the Llanura and off the sea.
export function placeFaro(from,inPlace){for(let i=0;i<8;i++){const a=-Math.PI/4+i*Math.PI/4,x=Math.round(from.x+Math.cos(a)*FARO_DISTANCE),y=Math.round(from.y+Math.sin(a)*FARO_DISTANCE);if(inPlace(x,y))return {x,y};}return {x:Math.round(from.x+FARO_DISTANCE),y:Math.round(from.y)};}
export const lotusAt=(center,i)=>({x:Math.round(center.x+Math.cos(i/LOTUS_COUNT*6.283)*LOTUS_RING),y:Math.round(center.y+Math.sin(i/LOTUS_COUNT*6.283)*LOTUS_RING*.6)});
// The lighthouse's voice: louder as you come near, silent beyond hearing.
export const faroVolume=d=>d>=FARO_HEAR?0:.05*(1-d/FARO_HEAR)**1.5;
export function initialize(runtime){
 let owner=null,tone=null,trail=[];const lit=[];const counts={faro:0,lotus:0,companion:0};
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 function own(){const j=runtime.S.journey||{};if(owner!==runtime.S){owner=runtime.S;j.moments=normalizeMoments(j.moments);trail=[];stopTone();}j.moments||={};return j.moments;}
 const ids=()=>runtime.BIOMES.map(b=>b.id);
 const inBiome=id=>(x,y)=>ids()[runtime.biomeOfPos(x,y)]===id&&!runtime.regionOfPos?.(x,y)?.sea;
 const here=()=>({x:runtime.S.wx,y:runtime.S.wy});
 // How close we are to the last beat: 1 on it, fading over the beat.
 function beatNow(){const ac=runtime.ac,bq=runtime.MU?.bq;if(!ac||!bq?.length)return 0;let last=-Infinity;for(const b of bq)if(b<=ac.currentTime)last=Math.max(last,b);return Math.max(0,1-(ac.currentTime-last)/((runtime.SIX||.15)*4));}
 const audible=()=>runtime.S.sound&&runtime.ac&&runtime.bus;
 function stopTone(){if(!tone)return;const ac=runtime.ac;try{tone.g.gain.setTargetAtTime(.0001,ac.currentTime,.2);tone.o.stop(ac.currentTime+1);}catch(_){}tone=null;}
 // The lighthouse's held tone, the fifth of the place, following the distance.
 function faroTone(d){const v=faroVolume(d);if(!audible()||v<=0){stopTone();return 0;}const ac=runtime.ac;
  if(!tone){const o=ac.createOscillator(),g=ac.createGain(),MU=runtime.MU||{};o.type='sine';o.frequency.setValueAtTime(440*2**((57+(MU.tr||0)+7-69)/12),ac.currentTime);g.gain.setValueAtTime(.0001,ac.currentTime);o.connect(g);g.connect(runtime.bus);o.start();tone={o,g};}
  tone.g.gain.setTargetAtTime(Math.max(.0001,v),ac.currentTime,.3);return v;}
 // A note played on time in a chapter (from journey-chapters.js).
 function note(id,midi){const m=own(),ac=runtime.ac,eighth=(runtime.SIX||.15)*2;
  if(id==='lago'&&m.lotos){let best=-1,dist=Infinity;for(let i=0;i<LOTUS_COUNT;i++){const p=lotusAt(m.lotos,i),d=Math.hypot(p.x-runtime.S.wx,p.y-runtime.S.wy);if(d<dist){dist=d;best=i;}}
   if(best>=0&&dist<LOTUS_NEAR){const was=m.lotos.open[best];m.lotos.open[best]=true;if(!was&&runtime.save()===false)m.lotos.open[best]=false;lit.push({i:best,at:performance.now()});if(lit.length>8)lit.shift();counts.lotus++;
    if(audible())runtime.soon?.(t=>{const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(440*2**((midi+7-69)/12),t+eighth);g.gain.setValueAtTime(.0001,t+eighth);g.gain.exponentialRampToValueAtTime(.08,t+eighth+.01);g.gain.exponentialRampToValueAtTime(.0001,t+eighth+1.4);o.connect(g);g.connect(runtime.bus);o.start(t+eighth);o.stop(t+eighth+1.5);},'player');}}
  if(id==='bosque'&&!m.companion){m.companion=true;if(runtime.save()===false)delete m.companion;}
  if(m.companion&&id!=='vacio'){counts.companion++;if(audible())runtime.soon?.(t=>playCello(ac,runtime.bus,t+eighth*4,midi-12,eighth,.06),'player');trail.length&&(trail[trail.length-1].sang=performance.now());}}
 // Each frame in a chapter: place what is missing, tune the lighthouse, move the creature.
 function draw(c,W,H,t,id,inside){if(!id){stopTone();return;}const m=own();if(!inside||id!=='llanura')stopTone();if(!inside&&!(m.companion&&id!=='vacio'))return;const still=calm(),cam={x:runtime.camX??runtime.S.wx,y:runtime.camY??runtime.S.wy},sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),beat=still?.5:beatNow();
  c.save();
  if(inside&&id==='llanura'){if(!m.faro){m.faro={...placeFaro(here(),inBiome('llanura')),reached:false};runtime.save();}
   const f=m.faro,d=Math.hypot(f.x-runtime.S.wx,f.y-runtime.S.wy);faroTone(d);if(!f.reached&&d<FARO_REACH){f.reached=true;counts.faro++;if(runtime.save()===false)f.reached=false;runtime.enterFx=Math.max(runtime.enterFx||0,.6);}
   // A pulsar seen from above: a bright core, a halo and a beam that sweeps the ground around it.
   const x=sx(f.x),y=sy(f.y),ink=runtime.placeColor?.('faros','#fff36a')||'#fff36a',glow=f.reached?.6+.4*beat:.4;
   if(!still){const a=t/900;c.globalAlpha=.1*glow;c.fillStyle=ink;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a-.12)*170,y+Math.sin(a-.12)*170);c.lineTo(x+Math.cos(a+.12)*170,y+Math.sin(a+.12)*170);c.closePath();c.fill();}
   c.globalAlpha=.25*glow;c.strokeStyle=ink;c.lineWidth=1;c.beginPath();c.arc(x,y,9+4*beat,0,6.283);c.stroke();
   c.globalAlpha=.9;c.fillStyle=ink;c.fillRect(Math.round(x)-2,Math.round(y)-2,5,5);c.fillStyle='#ffffff';c.fillRect(Math.round(x)-1,Math.round(y)-1,3,3);}
  if(inside&&id==='lago'){if(!m.lotos){m.lotos={...here(),open:Array(LOTUS_COUNT).fill(false)};runtime.save();}const ink=runtime.placeColor?.('lago','#8ad1ff')||'#8ad1ff',now=performance.now();
   for(let i=0;i<LOTUS_COUNT;i++){const p=lotusAt(m.lotos,i),x=sx(p.x),y=sy(p.y),open=m.lotos.open[i],fresh=lit.find(l=>l.i===i&&now-l.at<900),r=open?7+(fresh&&!still?4*(1-(now-fresh.at)/900):0):3;
    // A wave source: closed, a dot in a ring; open, rings that keep spreading from it.
    c.strokeStyle=open?ink:'#ffffff';c.lineWidth=1;const rings=open?3:1;for(let k=0;k<rings;k++){const grow=still?k/rings:((t/1600+k/rings)%1),rr=open?r+grow*18:r+2;c.globalAlpha=(open?.8:.45)*(open?1-grow:1);c.beginPath();c.arc(x,y,rr,0,6.283);c.stroke();}
    c.globalAlpha=open?.9:.5;c.fillStyle=open?ink:'#ffffff';c.fillRect(Math.round(x)-1,Math.round(y)-1,2,2);}}
  // The creature: it walks a little behind you, on your trail.
  if(m.companion&&id!=='vacio'){trail.push({x:runtime.S.wx,y:runtime.S.wy,sang:trail[trail.length-1]?.sang||0});if(trail.length>40)trail.shift();const p=trail[0],x=sx(p.x-18),y=sy(p.y+14),sang=performance.now()-(trail[trail.length-1].sang||0)<500;
   // A small cluster of three stars from the Cúmulo, turning slowly; it lights up when it repeats your note.
   c.globalAlpha=1;c.fillStyle=sang?(runtime.placeColor?.('bosque','#6fe08a')||'#6fe08a'):'#ffffff';for(let k=0;k<3;k++){const a=k/3*6.283+(still?0:t/700);c.fillRect(Math.round(x+Math.cos(a)*4)-1,Math.round(y+Math.sin(a)*4)-1,k?2:3,k?2:3);}}
  c.restore();}
 Object.defineProperties(runtime,{journeyMomentNote:{get:()=>note},drawJourneyMoments:{get:()=>draw},journeyMoments:{get:()=>()=>({...JSON.parse(JSON.stringify(own())),tone:!!tone,counts:{...counts}})}});
}
