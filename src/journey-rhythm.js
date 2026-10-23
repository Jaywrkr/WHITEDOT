import {calmMotion} from './frame-state.js';
import {worldCamera,chapterToast} from './journey-games.js';
// Ritmos (plan F14, docs/MUNDO.md): Jay found every place asked for the same thing, the beat. Now each place has its
// own rhythm: on the beat, on the «y» between beats, on the «1», or a pattern. Only a pulse on one of its steps is on
// time. A row of dots under the cube shows the bar in eighths: the steps that count are lit, the «1» in gold, and the
// dot of the moment is brighter. In the Journey, Llanura, Lago and Bosque stay on the beat; the Tormenta is the first
// mix and the Vacío keeps its «1» (its game waits for it gently and draws its own four dots).
export const RHYTHMS=Object.freeze({
 tiempo:Object.freeze({steps:Object.freeze([0,4,8,12]),name:'A tiempo'}),
 contra:Object.freeze({steps:Object.freeze([2,6,10,14]),name:'Contratiempo',say:'Aquí se toca en el «y», entre los tiempos.'}),
 uno:Object.freeze({steps:Object.freeze([0]),judge:Object.freeze([0,4,8,12]),name:'El «1»',guide:false}),
 mezcla:Object.freeze({steps:Object.freeze([0,4,6]),name:'1 · 2 · y',say:'Aquí el ritmo es «1 · 2 · y».'}),
 siembra:Object.freeze({steps:Object.freeze([0,2,4,6,8,10,12,14]),name:'Siembra a tiempo, riega en el «y»'}),
 acorde:Object.freeze({steps:Object.freeze([0,2,4]),name:'1 · y · 2',say:'Aquí el acorde es «1 · y · 2».'}),
 faro:Object.freeze({steps:Object.freeze([0,8,10]),name:'1 · 3 · y',say:'El faro destella en «1 · 3 · y».'}),
 ruina:Object.freeze({steps:Object.freeze([0,6,8,12]),name:'1 · 2y · 3 · 4',say:'Las Ruinas piden «1 · 2y · 3 · 4».'}),
 // The Cueva's pattern changes every call: any eighth is on time, and its game draws what it sang (journey-echo.js).
 eco:Object.freeze({steps:Object.freeze([0,2,4,6,8,10,12,14]),name:'Lo que canta la cueva',guide:false})});
// The places as rounds (plan F4) and the Journey's chapters: the table Jay approved on 23 October.
export const PLACE_RHYTHMS=Object.freeze({llanura:'tiempo',lago:'contra',bosque:'tiempo',tormenta:'mezcla',vacio:'uno',jardin:'siembra',dunas:'contra',cristales:'acorde',faros:'faro',ruinas:'ruina',cueva:'eco'});
export const JOURNEY_RHYTHMS=Object.freeze({llanura:'tiempo',lago:'tiempo',bosque:'tiempo',tormenta:'mezcla',vacio:'uno'});
// Whether a step of the bar (0–15) is on the beat, or on the «y» halfway to the next one.
export const onBeat=step=>Number.isFinite(step)&&Math.round(step)%4===0;
export const onAnd=step=>Number.isFinite(step)&&Math.round(step)%4===2;
// The nearest moment a rhythm counts: every beat the music scheduled (and one either side), with the steps of its beat
// that the rhythm asks for. `stepOf(beat)` says which step of the bar that beat is (0, 4, 8 or 12).
export function rhythmTarget(heard,beats,beatLen,stepOf,steps){if(!beats?.length||!(beatLen>0))return null;const six=beatLen/4,list=[beats[0]-beatLen,...beats,beats[beats.length-1]+beatLen];let best=null;
 for(const b of list){const sb=stepOf(b);if(!Number.isFinite(sb))continue;for(let k=0;k<4;k++){const s=(sb+k)%16;if(!steps.includes(s))continue;const t=b+k*six,d=Math.abs(heard-t);if(!best||d<best.dist)best={time:t,step:s,dist:d};}}
 return best;}
// The rhythm for a place round or a chapter, by its id; the free World keeps the beat (null).
export function rhythmFor(id,{place=false}={}){const key=(place?PLACE_RHYTHMS:JOURNEY_RHYTHMS)[id];return key?{key,...RHYTHMS[key]}:null;}
export function initialize(runtime){
 let lastHit=null;
 const calm=()=>calmMotion(runtime.S);
 // The rhythm that judges now: the round's place, or the Journey chapter whose game is playing.
 function active(){const run=runtime.placeRun?.();if(run?.id&&runtime.journeyGamePlaying?.(run.id))return run.remix&&RHYTHMS[run.remix]?{key:run.remix,...RHYTHMS[run.remix],remix:true}:rhythmFor(run.id,{place:true});
  const ch=runtime.journeyChapter?.();if(ch?.id&&runtime.journeyGamePlaying?.(ch.id))return rhythmFor(ch.id);return null;}
 // Which step of the bar a beat is, from the steps the music scheduled; beyond them, counted on from the nearest.
 function stepOf(b){const sq=runtime.MU?.sq||[],six=runtime.SIX||.15;let near=null;for(const e of sq)if(!near||Math.abs(e.t-b)<Math.abs(near.t-b))near=e;if(!near)return 0;
  const s=near.s+Math.round((b-near.t)/six);return ((Math.round(s/4)*4)%16+16)%16;}
 // What journey-pulse.js asks: null keeps the plain beat; otherwise the nearest step this rhythm counts.
 function target(heard){const r=active();if(!r||r.key==='tiempo')return null;const steps=r.judge||r.steps;if(steps.length===4&&steps.every((s,i)=>s===i*4))return null;
  const bq=runtime.MU?.bq;return {rhythm:r.key,hit:rhythmTarget(heard,bq,(runtime.SIX||.15)*4,stepOf,steps)};}
 // Where the bar is now (0–16), from the steps the music scheduled and the audio clock, as heard.
 function stepNow(){const sq=runtime.MU?.sq,ac=runtime.ac;if(!sq?.length||!ac)return null;const t=ac.currentTime-(ac.outputLatency||ac.baseLatency||0);let last=null;for(const e of sq)if(e.t<=t)last=e;if(!last)return null;return (last.s+Math.min(.99,Math.max(0,t-last.t)/(runtime.SIX||.15)))%16;}
 // Pulses closer than 240 ms are dropped (interactions.js); a rhythm with two eighths in a row needs them a little
 // closer, so the gap becomes two thirds of an eighth at the music's tempo.
 function gap(){const r=active();if(!r)return null;const st=r.judge||r.steps;if(!st.some(s=>st.includes((s+2)%16)))return null;return Math.min(240,Math.round((runtime.SIX||.15)*2*1000*2/3));}
 // Its line, once per save, when a round or chapter with a rhythm of its own begins.
 function sayRhythm(r,id){if(!r?.say)return;const j=runtime.S.journey||(runtime.S.journey={}),said=j.rhythmSaid&&typeof j.rhythmSaid==='object'&&!Array.isArray(j.rhythmSaid)?j.rhythmSaid:(j.rhythmSaid={});if(said[r.key])return;said[r.key]=true;runtime.save?.();chapterToast(runtime,id,r.say,3200,12000);}
 // The dots under the cube: eight eighths of the bar; the steps that count lit, the «1» gold, the one of now brighter.
 function guide(c,W,H){const r=active();if(!r||r.guide===false)return;const id=runtime.placeRun?.()?.id||runtime.journeyChapter?.()?.id;sayRhythm(r,id);const step=stepNow();if(step===null)return;
  const cam=worldCamera(runtime),cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y),y=cy+36*Math.max(1,Math.min(1.6,runtime.cubeGrowth?.()||1)),gold=runtime.GOLD||'#f0d27a',now=Math.floor(step/2),still=calm();c.save();
  for(let i=0;i<8;i++){const s=i*2,counts=r.steps.includes(s),x=cx-28+i*8,big=i%2===0,z=counts?(big?5:4):2;c.globalAlpha=counts?(i===now?1:.45):(i===now?.45:.25);c.fillStyle=counts&&s===0?gold:'#ffffff';c.fillRect(Math.round(x-z/2),Math.round(y-z/2),z,z);}
  if(lastHit&&performance.now()-lastHit.at<450){const k=(performance.now()-lastHit.at)/450;c.globalAlpha=1-k;c.strokeStyle=gold;c.lineWidth=1.5;c.beginPath();c.arc(cx-28+Math.round(lastHit.step/2)*8,y,5+(still?0:8*k),0,6.283);c.stroke();}
  c.restore();}
 // journey-pulse.js tells which step a pulse on time answered, for the ring on its dot.
 function hit(step){if(Number.isFinite(step))lastHit={step:Math.round(step)%16,at:performance.now()};}
 Object.defineProperties(runtime,{journeyRhythm:{get:()=>active},journeyRhythmTarget:{get:()=>target},drawRhythmGuide:{get:()=>guide},journeyRhythmHit:{get:()=>hit},journeyRhythmGap:{get:()=>gap},
  journeyRhythmState:{get:()=>()=>{const r=active();return {rhythm:r?.key||null,steps:r?[...r.steps]:null,guide:!!r&&r.guide!==false,step:stepNow(),lastHit:lastHit?{...lastHit}:null};}}});
}
