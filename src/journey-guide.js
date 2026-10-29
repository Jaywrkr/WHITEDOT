import {hashKey} from './universe-regions.js';
import {calmMotion} from './frame-state.js';
import {beatGlow,worldCamera,sayOnce,chapterToast,commitJourneyClose,barTarget,drawBarDrop} from './journey-games.js';
// «Guía» (the Faros, plan F15, docs/MUNDO.md): the cube is a lighthouse. Small boats are lost in the dark around the
// harbour where the round began. A pulse on time lights the boats within reach and they follow the cube for two bars;
// each pulse on time near them keeps them following. Bring them into the harbour and they dock: a boat is worth four,
// and two more for each other lit boat that came with it, so a convoy is worth more. Off the Faros' rhythm
// («1 · 3 · y», journey-rhythm.js) nothing lights. With the bar full a gold boat comes beside the cube and one pulse on
// time lights it.
export const GUIDE_GOAL=260,GUIDE_BOATS=6,GUIDE_REACH=110,GUIDE_HARBOR=70,GUIDE_FOLLOW_BARS=2,GUIDE_MAESTRO_FOLLOW=1.5,GUIDE_SPEED=190,GUIDE_DRIFT=8,GUIDE_GOLD_GAP=70;
export const GUIDE_NEAR=220,GUIDE_FAR=430;
// What a boat is worth as it docks: four, and two for each other lit boat in the convoy, up to three of them.
export const dockValue=convoy=>4+2*Math.min(3,Math.max(0,(convoy|0)-1));
export const guideProgress=(points,goal=GUIDE_GOAL)=>Math.max(0,Math.min(1,points/goal));
// Where the nth boat waits: an angle and a distance from the harbour, from hashes, never random.
export function boatSpot(n,center,seed='guide:v1'){const a=hashKey(seed+':a:'+n)*6.283,d=GUIDE_NEAR+(GUIDE_FAR-GUIDE_NEAR)*hashKey(seed+':d:'+n);return {x:Math.round(center.x+Math.cos(a)*d),y:Math.round(center.y+Math.sin(a)*d)};}
export function normalizeGuide(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{},pt=v=>v&&Number.isFinite(v.x)&&Number.isFinite(v.y)?{x:Math.round(v.x),y:Math.round(v.y)}:null;
 const boats=Array.isArray(q.boats)?q.boats.filter(b=>pt(b)&&Number.isInteger(b.n)).slice(0,GUIDE_BOATS).map(b=>({n:b.n,x:b.x,y:b.y,until:0})):[];
 return {points:Number.isFinite(q.points)?Math.max(0,q.points):0,center:pt(q.center),n:Number.isInteger(q.n)?Math.max(0,q.n):0,boats,docked:Number.isInteger(q.docked)?Math.max(0,q.docked):0,best:Number.isInteger(q.best)?Math.max(0,q.best):0,gold:pt(q.gold),opened:q.opened===true,hinted:q.hinted===true};}
// Keep six boats out in the dark: a docked one is replaced by the next.
export function guideFill(state){if(!state.center)return state;while(state.boats.length<GUIDE_BOATS){const p=boatSpot(state.n,state.center);state.boats.push({n:state.n,x:p.x,y:p.y,until:0});state.n++;}return state;}
export const lit=(b,now)=>b.until>now;
// One pulse on time at a point: every boat within reach is lit (or kept lit) for the follow time. Pure.
export function guidePulse(state,pos,now,{reach=GUIDE_REACH,followMs=4000}={}){const events=[];
 for(const b of state.boats)if(Math.hypot(b.x-pos.x,b.y-pos.y)<=reach){events.push({kind:lit(b,now)?'keep':'light',boat:b.n});b.until=now+followMs;}return {events};}
// A moment passing: lit boats follow the cube in a line; the others drift a little; lit boats in the harbour dock. Pure.
export function guideStep(state,pos,now,dt,{goal=GUIDE_GOAL,speed=GUIDE_SPEED}={}){const docked=[];let gained=0,k=0;
 for(const b of state.boats){if(lit(b,now)){const gap=34+k*22,dx=pos.x-b.x,dy=pos.y-b.y,d=Math.hypot(dx,dy);k++;if(d>gap){const step=Math.min(d-gap,speed*dt);b.x+=dx/d*step;b.y+=dy/d*step;}}
  else{const a=hashKey('guide:drift:'+b.n)*6.283+now/4000;b.x+=Math.cos(a)*GUIDE_DRIFT*dt;b.y+=Math.sin(a)*GUIDE_DRIFT*dt;}}
 const home=state.boats.filter(b=>lit(b,now)&&Math.hypot(b.x-state.center.x,b.y-state.center.y)<=GUIDE_HARBOR);
 if(home.length){const convoy=state.boats.filter(b=>lit(b,now)).length;for(const b of home){const value=dockValue(convoy);gained+=value;docked.push({boat:b.n,value,convoy});}
  state.boats=state.boats.filter(b=>!home.includes(b));state.docked+=home.length;state.best=Math.max(state.best,convoy);state.points=Math.min(goal,state.points+gained);guideFill(state);}
 return {gained,docked};}
export function initialize(runtime){
 const goal=()=>GUIDE_GOAL*(runtime.placeGoalScale?.()||1),followBars=()=>runtime.placeRun?.()?.maestro?GUIDE_MAESTRO_FOLLOW:runtime.tranquiloValue?.('guideFollow',GUIDE_FOLLOW_BARS)??GUIDE_FOLLOW_BARS;
 let owner=null,state=null,misses=0,shiver=0,goldPulse=0,last=null,flash=null;const glows=[],toBar=[];
 const calm=()=>calmMotion(runtime.S);
 function own(){const j=runtime.S.journey||(runtime.S.journey={});if(owner!==runtime.S||j.guide!==state){owner=runtime.S;j.guide=normalizeGuide(j.guide);state=j.guide;glows.length=0;toBar.length=0;last=null;}
  if(!state.center)state.center={x:Math.round(runtime.S.wx),y:Math.round(runtime.S.wy)};guideFill(state);return state;}
 const active=()=>!!runtime.journeyGamePlaying?.('faros');
 const audible=()=>runtime.S.sound&&runtime.ac&&runtime.bus;
 const full=()=>own().points>=goal();
 const bar=()=>(runtime.SIX||.125)*16;
 // A boat lit sounds a high note of the chord; a boat docking, the note and its fifth.
 function note(k,dock=false){if(!audible())return;runtime.soon?.(t=>{const ct=runtime.chordTones?.()||[60,64,67];let m=ct[k%ct.length]+24;while(m>93)m-=12;runtime.pluck?.(m,t,dock?.09:.05,2);if(dock)runtime.pluck?.(m+7,t+(runtime.SIX||.125)*2,.06,2);},'player');}
 function arrive(){const s=own();if(s.gold)return;s.gold={x:Math.round(runtime.S.wx+GUIDE_GOLD_GAP),y:Math.round(runtime.S.wy-GUIDE_GOLD_GAP*.5)};goldPulse=1;runtime.save?.();chapterToast(runtime,'faros','Llegó el barco dorado: enciéndelo a tiempo.');}
 function open(){const s=own();if(s.opened)return 'done';s.opened=true;if(!commitJourneyClose(runtime,'faros')){s.opened=false;return null;}runtime.enterFx=1;runtime.flash=1;for(let i=0;i<4;i++)note(i,true);return 'open';}
 function pulse(on){if(!active())return null;const s=own();if(!on){misses++;shiver=1;return 'miss';}if(full()){if(!s.gold)arrive();return open();}
  const now=performance.now(),r=guidePulse(s,{x:runtime.S.wx,y:runtime.S.wy},now,{followMs:followBars()*bar()*1000});flash={at:now};
  r.events.forEach((e,i)=>{const b=s.boats.find(q=>q.n===e.boat);if(e.kind==='light'){glows.push({x:b.x,y:b.y,at:now,kind:'light'});note(i);}});if(glows.length>40)glows.splice(0,glows.length-40);
  return r.events.some(e=>e.kind==='light')?'light':r.events.length?'keep':'still';}
 function tick(){const s=own(),now=performance.now(),dt=last===null?0:Math.min(.1,(now-last)/1000);last=now;
  if(dt>0){const before=s.points,r=guideStep(s,{x:runtime.S.wx,y:runtime.S.wy},now,dt,{goal:goal()});if(r.docked.length){r.docked.forEach((d,i)=>{glows.push({x:s.center.x,y:s.center.y,at:now+i*120,kind:'dock'});note(i,true);});toBar.push({value:r.gained,from:before,at:now+150});runtime.save?.();if(before<goal()&&s.points>=goal())arrive();}}
  if(full()&&!s.gold)arrive();
  if(s.gold){const dx=runtime.S.wx+GUIDE_GOLD_GAP-s.gold.x,dy=runtime.S.wy-GUIDE_GOLD_GAP*.5-s.gold.y;if(Math.hypot(dx,dy)>4){s.gold.x+=dx*.08;s.gold.y+=dy*.08;}}
  const MU=runtime.MU,p=guideProgress(s.points,goal());if(MU&&p>0){MU.journeyFloor=Math.max(MU.journeyFloor||0,.2+.6*p);if(MU.journeyCap!=null)MU.journeyCap=Math.max(MU.journeyCap,.4+.6*p);}}
 // A boat: a hull and a mast with its sail; lit, gold with a small light at the top.
 function boat(c,x,y,on,glow,still,t,n){const bob=still?0:Math.sin(t/500+n)*1.5,gold=runtime.GOLD||'#f0d27a';c.fillStyle=c.strokeStyle=on?gold:'#ffffff';c.lineWidth=1.5;
  c.beginPath();c.moveTo(x-8,y+bob);c.lineTo(x+8,y+bob);c.lineTo(x+5,y+4+bob);c.lineTo(x-5,y+4+bob);c.closePath();c.fill();
  c.beginPath();c.moveTo(x,y+bob);c.lineTo(x,y-11+bob);c.stroke();c.beginPath();c.moveTo(x+1,y-10+bob);c.lineTo(x+7,y-2+bob);c.lineTo(x+1,y-2+bob);c.closePath();c.fill();
  if(on){c.globalAlpha=.25+.3*glow;c.beginPath();c.arc(x,y-12+bob,5+2*glow,0,6.283);c.fill();}}
 // An arrow at the edge of the screen toward something out of sight.
 function edge(c,W,H,x,y,color,alpha){if(x>=12&&x<=W-12&&y>=12&&y<=H-12)return;const cx=W/2,cy=H/2,a=Math.atan2(y-cy,x-cx),m=24,k=Math.min((W/2-m)/Math.abs(Math.cos(a)||1e-6),(H/2-m)/Math.abs(Math.sin(a)||1e-6)),ex=cx+Math.cos(a)*k,ey=cy+Math.sin(a)*k;
  c.globalAlpha=alpha;c.fillStyle=color;c.beginPath();c.moveTo(ex+Math.cos(a)*9,ey+Math.sin(a)*9);c.lineTo(ex+Math.cos(a+2.5)*7,ey+Math.sin(a+2.5)*7);c.lineTo(ex+Math.cos(a-2.5)*7,ey+Math.sin(a-2.5)*7);c.closePath();c.fill();}
 function under(c,W,H,t){if(!active())return;const s=own();sayOnce(runtime,s,'hinted','Ilumina los barcos a tiempo y llévalos al puerto.','faros');tick();
  const still=calm(),cam=worldCamera(runtime),sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),glow=beatGlow(runtime),gold=runtime.GOLD||'#f0d27a',now=performance.now(),cx=sx(runtime.S.wx),cy=sy(runtime.S.wy);
  c.save();c.globalAlpha=.45;c.fillStyle='#000';c.fillRect(0,0,W,H);
  // The harbour: a gold ring with a small lighthouse in it.
  const hx=sx(s.center.x),hy=sy(s.center.y);c.globalAlpha=.7;c.strokeStyle=gold;c.lineWidth=1.5;c.setLineDash?.([4,5]);c.beginPath();c.arc(hx,hy,GUIDE_HARBOR,0,6.283);c.stroke();c.setLineDash?.([]);
  c.globalAlpha=.85;c.fillStyle=gold;c.beginPath();c.moveTo(hx-5,hy+10);c.lineTo(hx+5,hy+10);c.lineTo(hx+3,hy-8);c.lineTo(hx-3,hy-8);c.closePath();c.fill();c.globalAlpha=.3+.5*glow;c.beginPath();c.arc(hx,hy-11,4+3*glow,0,6.283);c.fill();
  // The beam turns with the bar, once a bar, from the cube; a pulse flashes the reach.
  const step=runtime.journeyRhythmState?.()?.step;if(Number.isFinite(step)&&!still){const a=-Math.PI/2+step/16*6.283;const g=c.createLinearGradient(cx,cy,cx+Math.cos(a)*GUIDE_REACH*1.6,cy+Math.sin(a)*GUIDE_REACH*1.6);g.addColorStop(0,'rgba(255,243,106,.28)');g.addColorStop(1,'rgba(255,243,106,0)');c.globalAlpha=1;c.fillStyle=g;c.beginPath();c.moveTo(cx,cy);c.arc(cx,cy,GUIDE_REACH*1.6,a-.18,a+.18);c.closePath();c.fill();}
  if(flash){const k=(now-flash.at)/450;if(k<1){c.globalAlpha=.5*(1-k);c.strokeStyle=gold;c.lineWidth=2;c.beginPath();c.arc(cx,cy,GUIDE_REACH*(still?1:.6+.4*k),0,6.283);c.stroke();}else flash=null;}
  // The boats: lit ones gold with an arc of the light they have left; the others white, brighter within reach.
  const follow=followBars()*bar()*1000;let anyOn=false,nearest=null;
  for(const b of s.boats){const x=sx(b.x),y=sy(b.y),on=lit(b,now),near=Math.hypot(b.x-runtime.S.wx,b.y-runtime.S.wy)<=GUIDE_REACH;if(on)anyOn=true;else{const d=Math.hypot(b.x-runtime.S.wx,b.y-runtime.S.wy);if(!nearest||d<nearest.d)nearest={x,y,d};}
   c.globalAlpha=on?1:near?.85:.5;boat(c,x,y,on,glow,still,t,b.n);
   if(on){const left=Math.max(0,(b.until-now)/follow);c.globalAlpha=.8;c.strokeStyle=gold;c.lineWidth=1.5;c.beginPath();c.arc(x,y-3,15,-Math.PI/2,-Math.PI/2+left*6.283);c.stroke();}}
  // Out of sight: the harbour in gold while boats follow, else the nearest boat in white.
  if(anyOn)edge(c,W,H,hx,hy,gold,.85);else if(nearest)edge(c,W,H,nearest.x,nearest.y,'#ffffff',.55);
  for(const g of glows){const k=(now-g.at)/(g.kind==='dock'?900:600);if(k<0||k>1)continue;c.globalAlpha=.85*(1-k);c.strokeStyle=g.kind==='dock'?gold:'#ffffff';c.lineWidth=g.kind==='dock'?2.5:1.5;c.beginPath();c.arc(sx(g.x),sy(g.y),10+k*(g.kind==='dock'?50:24),0,6.283);c.stroke();}
  if(s.gold&&!s.opened){const gx=sx(s.gold.x),gy=sy(s.gold.y),breath=still?0:Math.sin(t/700)*3+goldPulse*Math.sin(t/40)*5;goldPulse=Math.max(0,goldPulse-.02);
   c.globalAlpha=.25+.35*glow;c.fillStyle=gold;c.beginPath();c.arc(gx,gy,30+breath+6*glow,0,6.283);c.fill();c.save();c.translate(gx,gy);c.scale(1.8,1.8);c.globalAlpha=1;boat(c,0,0,true,glow,still,t,0);c.restore();}
  c.restore();}
 function over(c,W,H){if(!active())return;const now=performance.now(),gold=runtime.GOLD||'#f0d27a',cam=worldCamera(runtime),cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y);c.save();
  if(shiver>0&&!calm()){c.globalAlpha=.5*shiver;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.arc(cx+Math.sin(now/25)*2,cy,16,0,6.283);c.stroke();shiver=Math.max(0,shiver-.05);}
  const dropTo=barTarget(W),left=dropTo.left,right=dropTo.right,barY=dropTo.y,s=own(),hx=W/2+(s.center.x-cam.x),hy=H/2+(s.center.y-cam.y);
  for(let i=toBar.length-1;i>=0;i--){const d=toBar[i],k=(now-d.at)/450;if(k<0)continue;if(k>=1){toBar.splice(i,1);continue;}const tx=left+(right-left)*guideProgress(d.from+d.value,goal()),e=1-(1-k)*(1-k),z=2+Math.min(6,d.value/2);
   drawBarDrop(c,hx,hy,tx,barY,e,z,1-k*.3,gold);}
  c.restore();}
 runtime.registerJourneyGame?.('faros',{pulse,under,over,progress:()=>guideProgress(own().points,goal())});
 Object.defineProperties(runtime,{journeyGuide:{get:()=>()=>{const s=own(),now=performance.now();return {active:active(),points:s.points,goal:goal(),progress:guideProgress(s.points,goal()),center:{...s.center},boats:s.boats.map(b=>({n:b.n,x:b.x,y:b.y,lit:lit(b,now)})),docked:s.docked,best:s.best,misses,gold:s.gold?{...s.gold}:null,opened:s.opened};}}});
}
