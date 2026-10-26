import {calmMotion} from './frame-state.js';
import {beatGlow,worldCamera,sayOnce,chapterToast,commitJourneyClose,barTarget,drawBarDrop} from './journey-games.js';
// «Resuena» (the Cristales, plan F11, docs/MUNDO.md): nine crystals around where the round began, three of each note
// (triangle, diamond, hexagon). A pulse on time makes the crystals within reach ring; a ringing crystal keeps sounding
// for a few beats while its arc fades. When the three different notes ring at once they make a chord: it is worth far
// more, and the three fall silent so you build the next one. With the bar full a gold crystal comes beside the cube and
// one pulse on time makes it sing. Off time, nothing.
export const RES_GOAL=260,RES_REACH=95,RES_RING_BEATS=16,RES_MAESTRO_RING=15,RES_GOLD_GAP=70;
export const RES_VALUES=Object.freeze({ring:2,chord:14});
// Three rings of three, one note per ring position, so a chord always asks you to walk.
export function crystalSpots(center){return Array.from({length:9},(_,i)=>{const a=-Math.PI/2+i/9*2*Math.PI,d=[140,205,250][i%3];return {x:Math.round(center.x+Math.cos(a)*d),y:Math.round(center.y+Math.sin(a)*d),note:i%3};});}
export function normalizeResonance(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{},pt=v=>v&&Number.isFinite(v.x)&&Number.isFinite(v.y)?{x:Math.round(v.x),y:Math.round(v.y)}:null;
 const until=Array.from({length:9},(_,i)=>Number.isFinite(q.until?.[i])?q.until[i]:0);
 return {points:Number.isFinite(q.points)?Math.max(0,q.points):0,center:pt(q.center),until,chords:Number.isInteger(q.chords)?Math.max(0,q.chords):0,gold:pt(q.gold),opened:q.opened===true,hinted:q.hinted===true};}
// Which notes ring at a moment: a crystal rings until its time runs out.
export const ringing=(state,now)=>state.until.map((u,i)=>u>now?i:-1).filter(i=>i>=0);
// One pulse on time at a point: ring what is within reach; a chord when the three notes ring together. Pure.
export function resonancePulse(state,pos,now,{reach=RES_REACH,ringMs=4000,goal=RES_GOAL}={}){const spots=crystalSpots(state.center),events=[];let gained=0;
 spots.forEach((p,i)=>{if(Math.hypot(p.x-pos.x,p.y-pos.y)<=reach){if(!(state.until[i]>now))gained+=RES_VALUES.ring;state.until[i]=now+ringMs;events.push({kind:'ring',crystal:i,note:p.note});}});
 const on=ringing(state,now),notes=new Set(on.map(i=>spots[i].note));
 if(notes.size===3){gained+=RES_VALUES.chord;state.chords++;events.push({kind:'chord',crystals:on});for(const i of on)state.until[i]=0;}
 state.points=Math.min(goal,state.points+gained);return {gained,events};}
export const resonanceProgress=(points,goal=RES_GOAL)=>Math.max(0,Math.min(1,points/goal));
export function initialize(runtime){
 const goal=()=>RES_GOAL*(runtime.placeGoalScale?.()||1),ringBeats=()=>runtime.placeRun?.()?.maestro?RES_MAESTRO_RING:RES_RING_BEATS;
 let owner=null,state=null,misses=0,shiver=0,goldPulse=0;const glows=[],toBar=[];
 const calm=()=>calmMotion(runtime.S);
 function own(){const j=runtime.S.journey||(runtime.S.journey={});if(owner!==runtime.S||j.resonance!==state){owner=runtime.S;j.resonance=normalizeResonance(j.resonance);state=j.resonance;glows.length=0;toBar.length=0;}
  if(!state.center)state.center={x:Math.round(runtime.S.wx),y:Math.round(runtime.S.wy)};return state;}
 const active=()=>!!runtime.journeyGamePlaying?.('cristales');
 const audible=()=>runtime.S.sound&&runtime.ac&&runtime.bus;
 const full=()=>own().points>=goal();
 const ringMs=()=>ringBeats()*(runtime.SIX||.125)*4*1000;
 // Each note is a tone of the chord, high and bright: three crystals ringing together sound the chord.
 function tone(note,soft){if(!audible())return;runtime.soon?.(t=>{const ct=runtime.chordTones?.()||[60,64,67];let m=ct[note%ct.length]+24;while(m>96)m-=12;runtime.pluck?.(m,t,soft?.05:.09,2);},'player');}
 function arrive(){const s=own();if(s.gold)return;s.gold={x:Math.round(runtime.S.wx+RES_GOLD_GAP),y:Math.round(runtime.S.wy-RES_GOLD_GAP*.5)};goldPulse=1;runtime.save?.();chapterToast(runtime,'cristales','El cristal dorado llegó: hazlo cantar a tiempo.');}
 function open(){const s=own();if(s.opened)return 'done';s.opened=true;if(!commitJourneyClose(runtime,'cristales')){s.opened=false;return null;}runtime.enterFx=1;runtime.flash=1;for(let i=0;i<3;i++)tone(i);return 'open';}
 function pulse(on){if(!active())return null;const s=own();if(!on){misses++;shiver=1;return 'miss';}if(full()){if(!s.gold)arrive();return open();}
  const before=s.points,now=performance.now(),r=resonancePulse(s,{x:runtime.S.wx,y:runtime.S.wy},now,{ringMs:ringMs(),goal:goal()}),spots=crystalSpots(s.center);
  for(const e of r.events){if(e.kind==='ring'){tone(e.note,true);glows.push({x:spots[e.crystal].x,y:spots[e.crystal].y,at:now,kind:'ring'});}else{for(let k=0;k<3;k++)tone(k);for(const i of e.crystals)glows.push({x:spots[i].x,y:spots[i].y,at:now,kind:'chord'});}}
  if(glows.length>40)glows.splice(0,glows.length-40);if(r.gained)toBar.push({value:r.gained,from:before,at:now+150});if(r.events.length)runtime.save?.();if(before<goal()&&s.points>=goal())arrive();return r.events.some(e=>e.kind==='chord')?'chord':r.events.length?'ring':'still';}
 function tick(){const s=own();if(full()&&!s.gold)arrive();
  if(s.gold){const dx=runtime.S.wx+RES_GOLD_GAP-s.gold.x,dy=runtime.S.wy-RES_GOLD_GAP*.5-s.gold.y;if(Math.hypot(dx,dy)>4){s.gold.x+=dx*.08;s.gold.y+=dy*.08;}}
  const MU=runtime.MU,p=resonanceProgress(s.points,goal());if(MU&&p>0){MU.journeyFloor=Math.max(MU.journeyFloor||0,.2+.6*p);if(MU.journeyCap!=null)MU.journeyCap=Math.max(MU.journeyCap,.4+.6*p);}}
 // A crystal by its note: a triangle, a diamond or a hexagon.
 function shape(c,x,y,note,r){c.beginPath();const n=[3,4,6][note],off=note===1?0:-Math.PI/2;for(let k=0;k<n;k++){const a=off+k/n*6.283;k?c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r):c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}c.closePath();}
 function under(c,W,H,t){if(!active())return;const s=own();sayOnce(runtime,s,'hinted','Haz sonar tres cristales distintos a la vez.','cristales');tick();
  const still=calm(),cam=worldCamera(runtime),sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),glow=beatGlow(runtime),gold=runtime.GOLD||'#f0d27a',now=performance.now(),ms=ringMs();
  // The Cristales' own lattice of triangles is busy: the ground dims a little more than in the other games.
  c.save();c.globalAlpha=.55;c.fillStyle='#000';c.fillRect(0,0,W,H);
  crystalSpots(s.center).forEach((p,i)=>{const x=sx(p.x),y=sy(p.y),left=Math.max(0,(s.until[i]-now)/ms),near=Math.hypot(p.x-runtime.S.wx,p.y-runtime.S.wy)<=RES_REACH,r=12+(left&&!still?2*glow:0);
   // Ringing: filled, ripples and an arc of the time left. Silent: an outline, brighter within reach.
   if(left>0){c.globalAlpha=.25+.3*left;c.fillStyle='#ffffff';shape(c,x,y,p.note,r);c.fill();c.globalAlpha=.9;c.strokeStyle=gold;c.lineWidth=2;c.beginPath();c.arc(x,y,r+9,-Math.PI/2,-Math.PI/2+left*6.283);c.stroke();
    if(!still){const k=(now/600+i*.3)%1;c.globalAlpha=.4*(1-k)*left;c.strokeStyle='#ffffff';c.lineWidth=1;shape(c,x,y,p.note,r+4+k*16);c.stroke();}}
   c.globalAlpha=left>0?1:near?.85:.45;c.strokeStyle='#ffffff';c.lineWidth=1.5;shape(c,x,y,p.note,r);c.stroke();});
  // The notes ringing now, as three small marks under the cube: gold when that note is in.
  const on=new Set(ringing(s,now).map(i=>crystalSpots(s.center)[i].note)),cx=sx(runtime.S.wx),cy=sy(runtime.S.wy);for(let k=0;k<3;k++){c.globalAlpha=on.has(k)?.95:.3;c.strokeStyle=on.has(k)?gold:'#ffffff';c.lineWidth=1.2;shape(c,cx-12+k*12,cy+24,k,4);c.stroke();}
  for(const g of glows){const k=(now-g.at)/(g.kind==='chord'?900:600);if(k>1)continue;c.globalAlpha=.85*(1-k);c.strokeStyle=g.kind==='chord'?gold:'#ffffff';c.lineWidth=g.kind==='chord'?2.5:1.5;c.beginPath();c.arc(sx(g.x),sy(g.y),10+k*(g.kind==='chord'?40:22),0,6.283);c.stroke();}
  if(s.gold&&!s.opened){const gx=sx(s.gold.x),gy=sy(s.gold.y),breath=still?0:Math.sin(t/700)*3+goldPulse*Math.sin(t/40)*5;goldPulse=Math.max(0,goldPulse-.02);
   c.globalAlpha=.25+.35*glow;c.fillStyle=gold;c.beginPath();c.arc(gx,gy,30+breath+6*glow,0,6.283);c.fill();c.globalAlpha=.95;c.strokeStyle=c.fillStyle=gold;c.lineWidth=2;
   for(let k=0;k<3;k++){shape(c,gx,gy,k===0?2:k===1?1:0,18-k*5+breath*.3);c.stroke();}c.fillRect(Math.round(gx)-2,Math.round(gy)-2,4,4);}
  c.restore();}
 function over(c,W,H){if(!active())return;const now=performance.now(),gold=runtime.GOLD||'#f0d27a',cam=worldCamera(runtime),cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y);c.save();
  if(shiver>0&&!calm()){c.globalAlpha=.5*shiver;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.arc(cx+Math.sin(now/25)*2,cy,16,0,6.283);c.stroke();shiver=Math.max(0,shiver-.05);}
  const dropTo=barTarget(W),left=dropTo.left,right=dropTo.right,barY=dropTo.y;
  for(let i=toBar.length-1;i>=0;i--){const d=toBar[i],k=(now-d.at)/450;if(k<0)continue;if(k>=1){toBar.splice(i,1);continue;}const tx=left+(right-left)*resonanceProgress(d.from+d.value,goal()),e=1-(1-k)*(1-k),z=2+Math.min(6,d.value/2);
   drawBarDrop(c,cx,cy,tx,barY,e,z,1-k*.3,gold);}
  c.restore();}
 runtime.registerJourneyGame?.('cristales',{pulse,under,over,progress:()=>resonanceProgress(own().points,goal())});
 Object.defineProperties(runtime,{journeyResonance:{get:()=>()=>{const s=own(),now=performance.now();return {active:active(),points:s.points,goal:goal(),progress:resonanceProgress(s.points,goal()),spots:crystalSpots(s.center),ringing:ringing(s,now),chords:s.chords,misses,gold:s.gold?{...s.gold}:null,opened:s.opened};}}});
}
