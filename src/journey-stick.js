import {hashKey} from './universe-regions.js';
import {calmMotion} from './frame-state.js';
import {beatGlow as glowNow,worldCamera,sayOnce,chapterToast,commitJourneyClose,barTarget,drawBarDrop} from './journey-games.js';
// «Pégate» (prototype for the Llanura, chosen by Jay on 23 October): things around the cube beat with the music; a
// pulse on time next to one sticks it to the cube, it sounds and fills the bar at the top. Off time nothing moves.
// Small things are many and fill a little, big ones are few and fill a lot. When the bar is full a gold cloud comes
// beside the cube, and one last pulse on time swallows it: the Llanura is complete.
// Places and kinds come from hashes of the map cell, never from the old random sequence.
export const STICK_GOAL=150,STICK_CELL=150,STICK_REACH=90,STICK_GONE_LIMIT=800,STICK_CLOUD_GAP=70;
export const STICK_KINDS=Object.freeze([
 Object.freeze({id:'mota',value:1,r:3,weight:.45}),Object.freeze({id:'chispa',value:3,r:6,weight:.32}),
 Object.freeze({id:'piedra',value:8,r:9,weight:.15}),Object.freeze({id:'cometa',value:20,r:13,weight:.08})]);
// One thing per cell at most, more than eight cells in ten (plan F1: the Llanura took Jay eight minutes).
export function cellItem(cx,cy,seed='stick:v1'){const key=seed+':'+cx+','+cy;if(hashKey(key)>.85)return null;let k=hashKey(key+':k'),kind=STICK_KINDS[0];
 for(const option of STICK_KINDS){if(k<option.weight){kind=option;break;}k-=option.weight;}
 return {id:cx+','+cy,kind:kind.id,value:kind.value,r:kind.r,x:Math.round((cx+.15+.7*hashKey(key+':x'))*STICK_CELL),y:Math.round((cy+.15+.7*hashKey(key+':y'))*STICK_CELL)};}
export const stickProgress=(points,goal=STICK_GOAL)=>Math.max(0,Math.min(1,points/goal));
// How big the cube is drawn: from its usual size to a little over three times, with the bar.
export const cubeScale=(points,goal=STICK_GOAL)=>1+2.2*stickProgress(points,goal);
// The first prototype kept a size from 3 to 40; it becomes points on the same bar.
export function normalizeStick(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const points=Number.isFinite(q.points)?Math.max(0,Math.min(STICK_GOAL,q.points)):Number.isFinite(q.size)?Math.round(Math.max(0,Math.min(1,(q.size-3)/37))*STICK_GOAL):0;
 const cloud=q.cloud&&Number.isFinite(q.cloud.x)&&Number.isFinite(q.cloud.y)?{x:Math.round(q.cloud.x),y:Math.round(q.cloud.y)}:null;
 const gone=Array.isArray(q.gone)?q.gone.filter(id=>typeof id==='string'&&/^-?\d+,-?\d+$/.test(id)).slice(-STICK_GONE_LIMIT):[];
 return {points,cloud,gone,swallowed:q.swallowed===true,hinted:q.hinted===true};}
export function initialize(runtime){
 // A Maestro round in a place asks for half as much again (places.js, plan F4).
 const goal=()=>STICK_GOAL*(runtime.placeGoalScale?.()||1);
 let owner=null,state=null,gone=new Set(),streak=0,stuck=0,misses=0,cubeWobble=0,cloudPulse=0,hinted=false;const flying=[],toBar=[],attached=[];
 const calm=()=>calmMotion(runtime.S);
 function own(){const j=runtime.S.journey||{};if(owner!==runtime.S||j.stick!==state){owner=runtime.S;j.stick=normalizeStick(j.stick);state=j.stick;gone=new Set(state.gone);flying.length=0;toBar.length=0;attached.length=0;streak=0;}return state;}
 const ids=()=>runtime.BIOMES.map(b=>b.id);
 const inLlanura=(x,y)=>ids()[runtime.biomeOfPos(x,y)]==='llanura'&&!runtime.regionOfPos?.(x,y)?.sea;
 const active=()=>!!runtime.journeyGamePlaying?.('llanura');
 const audible=()=>runtime.S.sound&&runtime.ac&&runtime.bus;
 const full=()=>own().points>=goal();
 function near(radius){const out=[],x0=Math.floor((runtime.S.wx-radius)/STICK_CELL),x1=Math.floor((runtime.S.wx+radius)/STICK_CELL),y0=Math.floor((runtime.S.wy-radius)/STICK_CELL),y1=Math.floor((runtime.S.wy+radius)/STICK_CELL);
  for(let i=x0;i<=x1;i++)for(let j=y0;j<=y1;j++){const it=cellItem(i,j);if(!it||gone.has(it.id)||!inLlanura(it.x,it.y))continue;it.d=Math.hypot(it.x-runtime.S.wx,it.y-runtime.S.wy);if(it.d<=radius)out.push(it);}
  return out.sort((a,b)=>a.d-b.d);}
 const reach=()=>STICK_REACH+12*cubeScale(own().points,goal());
 const beatGlow=()=>glowNow(runtime);
 // A short note in the key for each thing that sticks: smaller things sound higher.
 function pop(value,delay=0){if(!audible())return;const ct=runtime.chordTones?.()||[60,64,67];runtime.soon?.(t=>{let m=ct[(stuck+value)%ct.length]+(value>=8?0:12);while(m>84)m-=12;runtime.pluck?.(m,t+delay,runtime.vel?.(.09)??.09,2);},'player');}
 function stick(it,k){gone.add(it.id);state.gone.push(it.id);if(state.gone.length>STICK_GONE_LIMIT)state.gone.splice(0,state.gone.length-STICK_GONE_LIMIT);const before=state.points;state.points=Math.min(goal(),state.points+it.value);stuck++;
  flying.push({...it,at:performance.now()+k*90});toBar.push({value:it.value,at:performance.now()+k*90+280,from:before});pop(it.value,k*.06);
  if(before<goal()&&state.points>=goal())arrive();}
 // The bar is full: the gold cloud comes beside the cube.
 function arrive(){const s=own();if(s.cloud)return;s.cloud={x:Math.round(runtime.S.wx+STICK_CLOUD_GAP),y:Math.round(runtime.S.wy-STICK_CLOUD_GAP*.5)};cloudPulse=1;
  chapterToast(runtime,'llanura','La nube dorada llegó: tócala a tiempo.');}
 function swallow(){const s=own();if(s.swallowed)return 'done';s.swallowed=true;if(!commitJourneyClose(runtime,'llanura')){s.swallowed=false;return null;}runtime.enterFx=1;runtime.flash=1;for(let i=0;i<5;i++)pop(8,i*.12);return 'swallow';}
 // Every pulse of the player in the Llanura (journey-pulse.js). Only on time something happens: off time the things stay
 // where they are and only the cube shivers.
 function pulse(on){if(!active())return null;const s=own();
  if(!on){streak=0;misses++;cubeWobble=1;return 'miss';}
  if(full()){if(!s.cloud)arrive();return swallow();}
  const list=near(reach());if(!list.length){streak=0;return null;}
  streak++;list.slice(0,streak>=3?3:1).forEach(stick);runtime.save?.();return 'stick';}
 // Once per save, the only rule in one line.
 function tell(){if(hinted)return;hinted=true;sayOnce(runtime,own(),'hinted','Toca a tiempo cerca de lo que brilla: se pega.','llanura');}
 // The cloud stays beside the cube while you walk.
 function tick(){const s=own();if(full()&&!s.cloud)arrive();if(s.cloud){const dx=runtime.S.wx+STICK_CLOUD_GAP-s.cloud.x,dy=runtime.S.wy-STICK_CLOUD_GAP*.5-s.cloud.y;if(Math.hypot(dx,dy)>4){s.cloud.x+=dx*.08;s.cloud.y+=dy*.08;}}
  // The music grows with the bar: what sticks to you plays.
  const MU=runtime.MU,p=stickProgress(s.points,goal());if(MU&&p>0){MU.journeyFloor=Math.max(MU.journeyFloor||0,.2+.6*p);if(MU.journeyCap!=null)MU.journeyCap=Math.max(MU.journeyCap,.4+.6*p);}}
 const camera=()=>worldCamera(runtime);
 // Under the cube: the place dims, the things that stick shine with the beat, and the gold cloud.
 function drawUnder(c,W,H,t){if(!active())return;tell();tick();const s=own(),still=calm(),cam=camera(),sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),glow=beatGlow(),gold=runtime.GOLD||'#f0d27a',r=reach();
  c.save();c.globalAlpha=.4;c.fillStyle='#000';c.fillRect(0,0,W,H);
  for(const it of near(Math.max(W,H)*.75)){const x=sx(it.x),inReach=it.d<=r,shake=!still&&inReach?Math.sin(t/45+it.x)*1.2:0,y=sy(it.y)+shake,z=it.r*(1+.25*glow);
   // A soft halo that grows on the beat.
   c.globalAlpha=(inReach?.32:.16)*(.4+glow);c.fillStyle='#ffffff';c.beginPath();c.arc(x,y,z*2.4+4,0,6.283);c.fill();
   c.globalAlpha=inReach?1:.55+.4*glow;c.strokeStyle=c.fillStyle='#ffffff';
   if(it.kind==='mota')c.fillRect(Math.round(x-z*.7),Math.round(y-z*.7),Math.round(z*1.4),Math.round(z*1.4));
   else if(it.kind==='chispa'){c.lineWidth=2;c.beginPath();c.moveTo(x-z,y);c.lineTo(x+z,y);c.moveTo(x,y-z);c.lineTo(x,y+z);c.stroke();}
   else if(it.kind==='piedra'){c.beginPath();c.moveTo(x,y-z);c.lineTo(x+z,y);c.lineTo(x,y+z);c.lineTo(x-z,y);c.closePath();c.fill();}
   else{c.fillRect(Math.round(x)-4,Math.round(y)-4,8,8);c.globalAlpha*=.5;c.fillRect(Math.round(x)-z*2,Math.round(y)-1,z*2,2);}
   if(inReach){c.globalAlpha=.6;c.lineWidth=1;c.beginPath();c.arc(x,y,it.r+8,0,6.283);c.stroke();}}
  if(s.cloud&&!s.swallowed){const gx=sx(s.cloud.x),gy=sy(s.cloud.y),breath=still?0:Math.sin(t/700)*3+cloudPulse*Math.sin(t/40)*5;cloudPulse=Math.max(0,cloudPulse-.02);
   c.globalAlpha=.25+.35*glow;c.fillStyle=gold;c.beginPath();c.arc(gx,gy,34+breath+6*glow,0,6.283);c.fill();
   c.globalAlpha=.9;c.strokeStyle=gold;c.lineWidth=1.5;c.beginPath();c.arc(gx,gy,30+breath,0,6.283);c.stroke();
   for(let i=0;i<30;i++){const a=i*2.4+(still?0:t/3000),rr=(i%7)/7*28;c.globalAlpha=.8*(1-rr/40);c.fillRect(Math.round(gx+Math.cos(a)*rr)-1,Math.round(gy+Math.sin(a)*rr)-1,2,2);}}
  c.restore();}
 // Over the cube: things flying to it and stuck around it, and a gold drop to the bar for each one.
 function draw(c,W,H,t){if(!active())return;const s=own(),still=calm(),cam=camera(),sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),now=performance.now(),scale=cubeScale(s.points,goal()),gold=runtime.GOLD||'#f0d27a';
  c.save();
  for(let i=flying.length-1;i>=0;i--){const f=flying[i],k=Math.max(0,Math.min(1,(now-f.at)/280));if(k>=1){flying.splice(i,1);attached.push({kind:f.kind,a:hashKey(f.id)*6.283,d:.6+.4*hashKey(f.id+':d')});if(attached.length>48)attached.shift();cubeWobble=Math.max(cubeWobble,.5);continue;}
   const x=sx(f.x+(runtime.S.wx-f.x)*k),y=sy(f.y+(runtime.S.wy-f.y)*k);c.globalAlpha=1;c.fillStyle=gold;c.fillRect(Math.round(x)-3,Math.round(y)-3,6,6);}
  const cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y),ring=6+7*scale,spin=still?0:t/2400,shiver=still?0:cubeWobble*3;cubeWobble=Math.max(0,cubeWobble-.04);
  for(const a of attached){const ang=a.a+spin,rr=ring*a.d+shiver*Math.sin(t/30+a.a);c.globalAlpha=.9;c.fillStyle=a.kind==='mota'?'#ffffff':gold;const z=a.kind==='mota'?3:a.kind==='chispa'?4:a.kind==='piedra'?5:6;c.fillRect(Math.round(cx+Math.cos(ang)*rr)-z/2,Math.round(cy+Math.sin(ang)*rr)-z/2,z,z);}
  // The drop flies to where the bar is filling: bigger things, bigger drops.
  const dropTo=barTarget(W),left=dropTo.left,right=dropTo.right,barY=dropTo.y;
  for(let i=toBar.length-1;i>=0;i--){const d=toBar[i],k=(now-d.at)/450;if(k<0)continue;if(k>=1){toBar.splice(i,1);continue;}const tx=left+(right-left)*stickProgress(d.from+d.value,goal()),e=1-(1-k)*(1-k),z=2+Math.min(6,d.value/3);
   drawBarDrop(c,cx,cy,tx,barY,e,z,1-k*.3,gold);}
  c.restore();}
 runtime.registerJourneyGame?.('llanura',{pulse,under:drawUnder,over:draw,progress:()=>stickProgress(own().points,goal()),growth:()=>cubeScale(own().points,goal())});
 Object.defineProperties(runtime,{journeyStick:{get:()=>()=>({active:active(),points:own().points,progress:stickProgress(own().points,goal()),stuck,misses,attached:attached.length,flying:flying.length,cloud:own().cloud?{...own().cloud}:null,swallowed:own().swallowed,near:near(reach()).map(it=>({id:it.id,kind:it.kind,value:it.value}))})}});
}
