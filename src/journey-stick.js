import {hashKey} from './universe-regions.js';
import {calmMotion} from './frame-state.js';
import {placeFaro,edgePoint} from './journey-moments.js';
// «Pégate» (prototype for the Llanura, chosen by Jay on 23 October): the cube starts tiny and everything it reaches
// with a pulse on time sticks to it, adding its sound; off the beat, things bounce away with a comic boing. Bigger
// things only stick once the cube is big enough, and the chapter ends when the cube swallows the giant of the place.
// Places and kinds come from hashes of the map cell, never from the old random sequence.
export const STICK_START=3,STICK_TARGET=40,STICK_CELL=150,STICK_REACH=80,STICK_GONE_LIMIT=800;
export const STICK_KINDS=Object.freeze([
 Object.freeze({id:'mota',value:1,r:3,weight:.55}),Object.freeze({id:'chispa',value:2,r:6,weight:.27}),
 Object.freeze({id:'piedra',value:4,r:9,weight:.12}),Object.freeze({id:'cometa',value:8,r:13,weight:.06})]);
// One thing per cell at most, about seven cells in ten.
export function cellItem(cx,cy,seed='stick:v1'){const key=seed+':'+cx+','+cy;if(hashKey(key)>.7)return null;let k=hashKey(key+':k'),kind=STICK_KINDS[0];
 for(const option of STICK_KINDS){if(k<option.weight){kind=option;break;}k-=option.weight;}
 return {id:cx+','+cy,kind:kind.id,value:kind.value,r:kind.r,x:Math.round((cx+.15+.7*hashKey(key+':x'))*STICK_CELL),y:Math.round((cy+.15+.7*hashKey(key+':y'))*STICK_CELL)};}
// What may stick: things up to half the cube's size. Growing: half of what sticks.
export const canStick=(value,size)=>value<=size*.5;
export const grow=(size,value)=>Math.min(STICK_TARGET*1.5,size+value*.5);
export const stickProgress=size=>Math.max(0,Math.min(1,(size-STICK_START)/(STICK_TARGET-STICK_START)));
// How big the cube is drawn: from its usual size to a little over three times.
export const cubeScale=size=>Math.min(3.2,1+(Math.max(STICK_START,size)-STICK_START)/16);
export function normalizeStick(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{},size=Number.isFinite(q.size)?Math.max(STICK_START,Math.min(STICK_TARGET*1.5,q.size)):STICK_START;
 const giant=q.giant&&Number.isFinite(q.giant.x)&&Number.isFinite(q.giant.y)?{x:Math.round(q.giant.x),y:Math.round(q.giant.y)}:null;
 const gone=Array.isArray(q.gone)?q.gone.filter(id=>typeof id==='string'&&/^-?\d+,-?\d+$/.test(id)).slice(-STICK_GONE_LIMIT):[];
 return {size,giant,gone,swallowed:q.swallowed===true,hinted:q.hinted===true};}
export function initialize(runtime){
 let owner=null,state=null,gone=new Set(),streak=0;const flying=[],attached=[],bounced=new Map();let giantWobble=0,cubeWobble=0,stuck=0,boings=0;
 const calm=()=>calmMotion(runtime.S);
 function own(){const j=runtime.S.journey||{};if(owner!==runtime.S){owner=runtime.S;j.stick=normalizeStick(j.stick);state=j.stick;gone=new Set(state.gone);flying.length=0;attached.length=0;streak=0;}return state;}
 const ids=()=>runtime.BIOMES.map(b=>b.id);
 const inLlanura=(x,y)=>ids()[runtime.biomeOfPos(x,y)]==='llanura'&&!runtime.regionOfPos?.(x,y)?.sea;
 const active=()=>{if(!runtime.journeyStickOn)return false;const ch=runtime.journeyChapter?.();return !!(ch&&ch.id==='llanura'&&!ch.done?.llanura&&runtime.journeyQuiet?.()&&runtime.inWorld?.()&&(runtime.S.layer||'superficie')==='superficie');};
 const audible=()=>runtime.S.sound&&runtime.ac&&runtime.bus;
 function near(radius){const out=[],x0=Math.floor((runtime.S.wx-radius)/STICK_CELL),x1=Math.floor((runtime.S.wx+radius)/STICK_CELL),y0=Math.floor((runtime.S.wy-radius)/STICK_CELL),y1=Math.floor((runtime.S.wy+radius)/STICK_CELL);
  for(let i=x0;i<=x1;i++)for(let j=y0;j<=y1;j++){const it=cellItem(i,j);if(!it||gone.has(it.id)||!inLlanura(it.x,it.y))continue;const b=bounced.get(it.id);if(b){it.x+=b.x;it.y+=b.y;}it.d=Math.hypot(it.x-runtime.S.wx,it.y-runtime.S.wy);if(it.d<=radius)out.push(it);}
  return out.sort((a,b)=>a.d-b.d);}
 const reach=()=>STICK_REACH+10*cubeScale(own().size);
 // A short note in the key for each thing that sticks: smaller things sound higher.
 function pop(value,delay=0){if(!audible())return;const ac=runtime.ac,ct=runtime.chordTones?.()||[60,64,67];runtime.soon?.(t=>{let m=ct[(stuck+value)%ct.length]+(value>=4?0:12);while(m>84)m-=12;runtime.pluck?.(m,t+delay,runtime.vel?.(.09)??.09,2);},'player');}
 function boing(low=false){boings++;if(!audible())return;const ac=runtime.ac,t=ac.currentTime+.01,o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(low?180:420,t);o.frequency.exponentialRampToValueAtTime(low?70:150,t+.22);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.06,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g);g.connect(runtime.bus);o.start(t);o.stop(t+.35);}
 function stick(it,k){gone.add(it.id);state.gone.push(it.id);if(state.gone.length>STICK_GONE_LIMIT)state.gone.splice(0,state.gone.length-STICK_GONE_LIMIT);const before=state.size;state.size=grow(state.size,it.value);stuck++;
  if(before<STICK_TARGET&&state.size>=STICK_TARGET)setTimeout(()=>runtime.toast?.('Ya eres grande: trágate la nube dorada.',{level:2,ttl:15000,coalesce:false,force:true}),600);
  flying.push({...it,at:performance.now()+k*90});pop(it.value,k*.06);}
 // Every pulse of the player in the Llanura (journey-pulse.js): on time it pulls, off time it pushes.
 function pulse(on){if(!active())return null;const s=own(),list=near(reach());if(!list.length)return null;
  if(!on){streak=0;const it=list[0];bounced.set(it.id,{x:(it.x-runtime.S.wx)/Math.max(1,it.d)*70+(bounced.get(it.id)?.x||0),y:(it.y-runtime.S.wy)/Math.max(1,it.d)*70+(bounced.get(it.id)?.y||0)});boing();cubeWobble=1;return 'bounce';}
  const ok=list.filter(it=>canStick(it.value,s.size));if(!ok.length){giantWobble=.5;boing(true);return 'too-big';}
  streak++;const count=streak>=3?3:1;ok.slice(0,count).forEach(stick);runtime.save?.();return 'stick';}
 // The giant of the Llanura: a cloud of dust far bigger than the cube, that you can only swallow at full size.
 function giant(){const s=own();if(!s.giant){const from={x:runtime.S.wx,y:runtime.S.wy};s.giant=placeFaro(from,inLlanura);runtime.save?.();}return s.giant;}
 let bumpedAt=0;
 function tick(){const s=own(),g=giant(),d=Math.hypot(g.x-runtime.S.wx,g.y-runtime.S.wy),reachG=60+8*cubeScale(s.size);
  if(d<reachG){if(s.size>=STICK_TARGET&&!s.swallowed){s.swallowed=true;if(runtime.save?.()===false){s.swallowed=false;return;}runtime.enterFx=1;runtime.flash=1;for(let i=0;i<5;i++)pop(8,i*.12);runtime.journeyComplete?.('llanura');}
   else if(performance.now()-bumpedAt>600){bumpedAt=performance.now();const a=Math.atan2(runtime.S.wy-g.y,runtime.S.wx-g.x);runtime.S.wx=g.x+Math.cos(a)*(reachG+6);runtime.S.wy=g.y+Math.sin(a)*(reachG+6);giantWobble=1;boing(true);}}
  // The music grows with the cube: what sticks to you plays.
  const MU=runtime.MU,p=stickProgress(s.size);if(MU&&p>0){MU.journeyFloor=Math.max(MU.journeyFloor||0,.2+.6*p);if(MU.journeyCap!=null)MU.journeyCap=Math.max(MU.journeyCap,.4+.6*p);}}
 let hinted=false;
 // Once per save, the only rule in one line.
 function hint(){const s=own();if(hinted||s.hinted)return;hinted=true;s.hinted=true;runtime.save?.();setTimeout(()=>runtime.toast?.('Toca a tiempo cerca de algo: se pega.',{level:2,ttl:12000,coalesce:false,force:true}),1500);}
 function draw(c,W,H,t){if(!active())return;hint();tick();const s=own(),still=calm(),cam={x:runtime.camX??runtime.S.wx,y:runtime.camY??runtime.S.wy},sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),now=performance.now(),scale=cubeScale(s.size),ink='#ffffff',gold=runtime.GOLD||'#f0d27a';
  c.save();
  // Things around you: the ones that would stick shine, the ones still too big are only outlined.
  for(const it of near(Math.max(W,H)*.75)){const x=sx(it.x),y=sy(it.y),ok=canStick(it.value,s.size),wob=still?0:Math.sin(t/300+it.x)*1.5;c.globalAlpha=ok?.9:.35;c.fillStyle=ok?ink:'#9aa0a8';c.strokeStyle=c.fillStyle;
   if(it.kind==='mota')c.fillRect(Math.round(x)-2,Math.round(y+wob)-2,4,4);
   else if(it.kind==='chispa'){c.lineWidth=2;c.beginPath();c.moveTo(x-it.r,y+wob);c.lineTo(x+it.r,y+wob);c.moveTo(x,y+wob-it.r);c.lineTo(x,y+wob+it.r);c.stroke();}
   else if(it.kind==='piedra'){c.lineWidth=1.5;c.beginPath();c.moveTo(x,y+wob-it.r);c.lineTo(x+it.r,y+wob);c.lineTo(x,y+wob+it.r);c.lineTo(x-it.r,y+wob);c.closePath();ok?c.fill():c.stroke();}
   else{c.fillRect(Math.round(x)-4,Math.round(y+wob)-4,8,8);c.globalAlpha*=.5;c.fillRect(Math.round(x)-it.r*2,Math.round(y+wob)-1,it.r*2,2);}
   // In reach and ready: a thin ring says «this one sticks now».
   if(ok&&it.d<=reach()){c.globalAlpha=.5;c.lineWidth=1;c.beginPath();c.arc(x,y+wob,it.r+6,0,6.283);c.stroke();}}
  // The giant: a big cloud of dust that breathes; gold and calling once you are big enough to swallow it.
  const g=giant(),gx=sx(g.x),gy=sy(g.y),ready=s.size>=STICK_TARGET,breath=still?0:Math.sin(t/700)*4+giantWobble*Math.sin(t/40)*6;giantWobble=Math.max(0,giantWobble-.03);
  c.globalAlpha=ready?.8:.45;c.strokeStyle=ready?gold:ink;c.lineWidth=1.5;c.beginPath();c.arc(gx,gy,60+breath,0,6.283);c.stroke();
  c.fillStyle=ready?gold:ink;for(let i=0;i<40;i++){const a=i*2.4+(still?0:t/3000),r=(i%7)/7*55;c.globalAlpha=(ready?.7:.35)*(1-r/70);c.fillRect(Math.round(gx+Math.cos(a)*r)-1,Math.round(gy+Math.sin(a)*r)-1,2,2);}
  if(ready){const e=edgePoint(g.x-cam.x,g.y-cam.y,W,H);if(e){e.y=Math.max(e.y,110);// below the bar at the top
   c.globalAlpha=.9;c.strokeStyle=gold;c.lineWidth=2;c.beginPath();c.arc(e.x,e.y,14,0,6.283);c.stroke();c.beginPath();c.moveTo(e.x+Math.cos(e.a)*20,e.y+Math.sin(e.a)*20);c.lineTo(e.x+Math.cos(e.a+2.5)*10,e.y+Math.sin(e.a+2.5)*10);c.moveTo(e.x+Math.cos(e.a)*20,e.y+Math.sin(e.a)*20);c.lineTo(e.x+Math.cos(e.a-2.5)*10,e.y+Math.sin(e.a-2.5)*10);c.stroke();}}
  // Things flying to the cube, then stuck around it, turning with it.
  for(let i=flying.length-1;i>=0;i--){const f=flying[i],k=Math.max(0,Math.min(1,(now-f.at)/280));if(k>=1){flying.splice(i,1);attached.push({kind:f.kind,r:f.r,a:hashKey(f.id)*6.283,d:.6+.4*hashKey(f.id+':d')});if(attached.length>48)attached.shift();cubeWobble=Math.max(cubeWobble,.5);continue;}
   const x=sx(f.x+(runtime.S.wx-f.x)*k),y=sy(f.y+(runtime.S.wy-f.y)*k);c.globalAlpha=1;c.fillStyle=gold;c.fillRect(Math.round(x)-3,Math.round(y)-3,6,6);}
  const cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y),ring=6+7*scale,spin=still?0:t/2400;cubeWobble=Math.max(0,cubeWobble-.04);
  for(const a of attached){const ang=a.a+spin,rr=ring*a.d+(still?0:cubeWobble*3*Math.sin(t/30+a.a));c.globalAlpha=.9;c.fillStyle=a.kind==='mota'?ink:gold;const z=a.kind==='mota'?3:a.kind==='chispa'?4:a.kind==='piedra'?5:6;c.fillRect(Math.round(cx+Math.cos(ang)*rr)-z/2,Math.round(cy+Math.sin(ang)*rr)-z/2,z,z);}
  c.restore();}
 // While it is a prototype, «?faro=1» keeps the old Llanura (the lighthouse) to compare both.
 const on=()=>!(typeof location!=='undefined'&&/[?&]faro=1\b/.test(location.search||''));
 Object.defineProperties(runtime,{journeyStickOn:{get:on},journeyStickPulse:{get:()=>pulse},drawJourneyStick:{get:()=>draw},
  cubeGrowth:{get:()=>()=>active()?cubeScale(own().size):1},journeyStickProgress:{get:()=>()=>stickProgress(own().size)},
  journeyStick:{get:()=>()=>({active:active(),size:own().size,progress:stickProgress(own().size),stuck,boings,attached:attached.length,flying:flying.length,giant:own().giant?{...own().giant}:null,swallowed:own().swallowed,near:near(reach()).map(it=>({id:it.id,value:it.value,stick:canStick(it.value,own().size)}))})}});
}
