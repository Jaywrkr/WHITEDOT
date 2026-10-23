import {hashKey} from './universe-regions.js';
import {calmMotion} from './frame-state.js';
import {beatGlow,worldCamera,sayOnce,chapterToast} from './journey-games.js';
// «Rodea» (the Bosque, chapter 3 of the Journey's games, Jay's decision of 23 October): the cube leaves a trail of light
// for a few seconds. Walk around a group of fireflies until the trail closes (the closing line turns gold) and pulse
// on time: every firefly inside is caught. Each one is worth as many as were caught together, up to three, so wide
// circles fill the bar faster. Off time nothing happens. With the bar full the Bosque's creature comes beside the cube,
// and one pulse on time makes it your companion for the rest of the Journey.
// Places come from hashes of the map cell, never from the old random sequence.
export const LASSO_GOAL=240,LASSO_CELL=220,LASSO_TRAIL_MS=8000,LASSO_HOLD_MS=1500,LASSO_TRAIL_MAX=160,LASSO_CLOSE=45,LASSO_MIN_AREA=2500,LASSO_CAUGHT_LIMIT=800,LASSO_FRIEND_GAP=60;
// Fireflies come in groups: one in two cells, three to six around a centre.
export function cellFireflies(cx,cy,seed='lasso:v1'){const key=seed+':'+cx+','+cy;if(hashKey(key)>.5)return [];const n=3+Math.floor(4*hashKey(key+':n')),x0=(cx+.3+.4*hashKey(key+':x'))*LASSO_CELL,y0=(cy+.3+.4*hashKey(key+':y'))*LASSO_CELL,out=[];
 for(let k=0;k<n;k++){const a=hashKey(key+':a'+k)*6.283,d=10+45*hashKey(key+':d'+k);out.push({id:cx+','+cy+','+k,x:Math.round(x0+Math.cos(a)*d),y:Math.round(y0+Math.sin(a)*d),phase:hashKey(key+':p'+k)*6.283});}return out;}
export const lassoValue=count=>Math.max(1,Math.min(3,count));
export const lassoProgress=(points,goal=LASSO_GOAL)=>Math.max(0,Math.min(1,points/goal));
// Shoelace area and the ray test: the loop the trail closes, and what is inside it.
export function loopArea(points){let a=0;for(let i=0;i<points.length;i++){const p=points[i],q=points[(i+1)%points.length];a+=p.x*q.y-q.x*p.y;}return Math.abs(a)/2;}
export function insideLoop(points,x,y){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const p=points[i],q=points[j];if((p.y>y)!==(q.y>y)&&x<(q.x-p.x)*(y-p.y)/(q.y-p.y)+p.x)inside=!inside;}return inside;}
// The loop the trail makes with the cube now: from the oldest trail point close to the cube (at least half a second
// old), if what it encloses is wide enough.
export function closedLoop(trail,here,now){for(let i=0;i<trail.length;i++){const p=trail[i];if(now-p.at<500)break;if(Math.hypot(p.x-here.x,p.y-here.y)<=LASSO_CLOSE){const loop=[...trail.slice(i),here];if(loopArea(loop)>=LASSO_MIN_AREA)return loop;}}return null;}
export function normalizeLasso(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const friend=q.friend&&Number.isFinite(q.friend.x)&&Number.isFinite(q.friend.y)?{x:Math.round(q.friend.x),y:Math.round(q.friend.y)}:null;
 return {points:Number.isFinite(q.points)?Math.max(0,Math.min(LASSO_GOAL,q.points)):0,caught:Array.isArray(q.caught)?q.caught.filter(id=>typeof id==='string'&&/^-?\d+,-?\d+,\d$/.test(id)).slice(-LASSO_CAUGHT_LIMIT):[],
  friend,joined:q.joined===true,hinted:q.hinted===true,best:Number.isInteger(q.best)?Math.max(0,Math.min(99,q.best)):0};}
export function initialize(runtime){
 // A Maestro round in a place asks for half as much again (places.js, plan F4).
 const goal=()=>LASSO_GOAL*(runtime.placeGoalScale?.()||1);
 let owner=null,state=null,caught=new Set(),misses=0,shiver=0,friendPulse=0,loops=0,armed=null;const trail=[],flying=[],orbit=[],toBar=[];
 const calm=()=>calmMotion(runtime.S);
 function own(){const j=runtime.S.journey||{};if(owner!==runtime.S||j.lasso!==state){owner=runtime.S;j.lasso=normalizeLasso(j.lasso);state=j.lasso;caught=new Set(state.caught);trail.length=0;flying.length=0;orbit.length=0;toBar.length=0;armed=null;}return state;}
 const inBosque=(x,y)=>runtime.BIOMES[runtime.biomeOfPos(x,y)]?.id==='bosque';
 const active=()=>!!runtime.journeyGamePlaying?.('bosque');
 const audible=()=>runtime.S.sound&&runtime.ac&&runtime.bus;
 const full=()=>own().points>=goal();
 const here=()=>({x:runtime.S.wx,y:runtime.S.wy});
 function fireflies(x,y,radius){const out=[],x0=Math.floor((x-radius)/LASSO_CELL),x1=Math.floor((x+radius)/LASSO_CELL),y0=Math.floor((y-radius)/LASSO_CELL),y1=Math.floor((y+radius)/LASSO_CELL);
  for(let i=x0;i<=x1;i++)for(let j=y0;j<=y1;j++)for(const f of cellFireflies(i,j)){if(caught.has(f.id)||!inBosque(f.x,f.y))continue;if(Math.hypot(f.x-x,f.y-y)<=radius)out.push(f);}return out;}
 // Caught together, they sound together: a chord, one tone per firefly.
 function chord(count){if(!audible())return;const ct=runtime.chordTones?.()||[60,64,67];runtime.soon?.(t=>{for(let k=0;k<Math.min(5,count);k++){let m=ct[k%ct.length]+12*Math.floor(k/ct.length)+12;while(m>88)m-=12;runtime.pluck?.(m,t+k*.03,runtime.vel?.(.07)??.07,2);}},'player');}
 function arrive(){const s=own();if(s.friend)return;s.friend={x:Math.round(runtime.S.wx-LASSO_FRIEND_GAP),y:Math.round(runtime.S.wy+LASSO_FRIEND_GAP*.4)};friendPulse=1;runtime.save?.();
  chapterToast(runtime,'bosque','La criatura del bosque llegó: tócala a tiempo.');}
 // The creature joins: it is the companion of journey-moments.js from now on.
 function join(){const s=own();if(s.joined)return 'done';s.joined=true;const m=runtime.S.journey.moments||(runtime.S.journey.moments={});const had=m.companion;m.companion=true;
  if(runtime.save?.()===false){s.joined=false;if(!had)delete m.companion;return null;}runtime.enterFx=1;runtime.flash=1;chord(5);runtime.journeyComplete?.('bosque');return 'join';}
 // A loop stays closed for a moment after the cube drifts off its start: on a phone you lift the finger to tap.
 function loopNow(now){const loop=closedLoop(trail,here(),now);if(loop){armed={loop,at:now};return loop;}return armed&&now-armed.at<LASSO_HOLD_MS?armed.loop:null;}
 // Only on time: if the trail is closed around fireflies, they are caught. Off time the cube shivers.
 function pulse(on){if(!active())return null;const s=own();if(!on){misses++;shiver=1;return 'miss';}
  if(full()){if(!s.friend)arrive();return join();}
  const now=performance.now(),loop=loopNow(now);if(!loop)return 'open';
  const near=fireflies(runtime.S.wx,runtime.S.wy,600).filter(f=>insideLoop(loop,f.x,f.y));trail.length=0;armed=null;if(!near.length)return 'empty';
  loops++;const value=lassoValue(near.length),before=s.points;
  for(const [k,f] of near.entries()){caught.add(f.id);s.caught.push(f.id);flying.push({...f,at:now+k*60});}
  if(s.caught.length>LASSO_CAUGHT_LIMIT)s.caught.splice(0,s.caught.length-LASSO_CAUGHT_LIMIT);
  s.points=Math.min(goal(),s.points+value*near.length);if(near.length>s.best)s.best=near.length;toBar.push({value:value*near.length,from:before,at:now+300});chord(near.length);
  if(before<goal()&&s.points>=goal())arrive();runtime.save?.();return 'catch';}
 function tick(){const s=own(),now=performance.now(),p=here(),last=trail[trail.length-1];
  if(!last||Math.hypot(p.x-last.x,p.y-last.y)>=8){trail.push({...p,at:now});if(trail.length>LASSO_TRAIL_MAX)trail.shift();}
  while(trail.length&&now-trail[0].at>LASSO_TRAIL_MS)trail.shift();
  if(full()&&!s.friend)arrive();
  if(s.friend&&!s.joined){const dx=runtime.S.wx-LASSO_FRIEND_GAP-s.friend.x,dy=runtime.S.wy+LASSO_FRIEND_GAP*.4-s.friend.y;if(Math.hypot(dx,dy)>4){s.friend.x+=dx*.08;s.friend.y+=dy*.08;}}
  const MU=runtime.MU,q=lassoProgress(s.points,goal());if(MU&&q>0){MU.journeyFloor=Math.max(MU.journeyFloor||0,.2+.6*q);if(MU.journeyCap!=null)MU.journeyCap=Math.max(MU.journeyCap,.4+.6*q);}}
 // Under the cube: the forest dims, fireflies blink with the beat, the trail glows and its closing line turns gold.
 function under(c,W,H,t){if(!active())return;const s=own();sayOnce(runtime,s,'hinted','Da una vuelta alrededor de las luciérnagas y toca a tiempo.','bosque');tick();
  const still=calm(),cam=worldCamera(runtime),sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),glow=beatGlow(runtime),gold=runtime.GOLD||'#f0d27a',now=performance.now();
  c.save();c.globalAlpha=.4;c.fillStyle='#000';c.fillRect(0,0,W,H);
  const loop=loopNow(now),inside=loop?new Set(fireflies(runtime.S.wx,runtime.S.wy,600).filter(f=>insideLoop(loop,f.x,f.y)).map(f=>f.id)):new Set();
  for(const f of fireflies(cam.x,cam.y,Math.max(W,H)*.75)){const wob=still?0:3,x=sx(f.x+Math.sin(t/900+f.phase)*wob),y=sy(f.y+Math.cos(t/1100+f.phase)*wob),blink=.5+.5*Math.sin(t/400+f.phase),lit=inside.has(f.id),z=2.5+1.5*glow;
   c.globalAlpha=(lit?.45:.22)*(.5+glow);c.fillStyle=lit?gold:'#fff6c8';c.beginPath();c.arc(x,y,z*3+4,0,6.283);c.fill();
   c.globalAlpha=lit?1:.6+.4*Math.max(glow,still?1:blink);c.fillRect(Math.round(x-z/2),Math.round(y-z/2),Math.round(z),Math.round(z));
   if(lit){c.globalAlpha=.8;c.strokeStyle='#ffffff';c.lineWidth=1.5;c.beginPath();c.arc(x,y,z+7+2*glow,0,6.283);c.stroke();}}
  // The trail: brighter where it is newer.
  if(trail.length>1){c.lineWidth=loop?3:2;for(let i=1;i<trail.length;i++){const a=trail[i-1],b=trail[i],k=1-(now-b.at)/LASSO_TRAIL_MS;c.globalAlpha=Math.max(0,(loop?.9:.55)*k);c.strokeStyle=loop?gold:'#ffffff';c.beginPath();c.moveTo(sx(a.x),sy(a.y));c.lineTo(sx(b.x),sy(b.y));c.stroke();}}
  // Closed: the inside lights up with the beat, so it reads even while the chapter is still pale.
  if(loop){c.globalAlpha=.1+.18*glow;c.fillStyle='#ffffff';c.beginPath();loop.forEach((p,i)=>i?c.lineTo(sx(p.x),sy(p.y)):c.moveTo(sx(p.x),sy(p.y)));c.closePath();c.fill();}
  if(loop){const a=loop[0];c.globalAlpha=.6+.4*glow;c.strokeStyle=gold;c.lineWidth=2;c.setLineDash?.([4,4]);c.beginPath();c.moveTo(sx(a.x),sy(a.y));c.lineTo(sx(runtime.S.wx),sy(runtime.S.wy));c.stroke();c.setLineDash?.([]);}
  if(s.friend&&!s.joined){const gx=sx(s.friend.x),gy=sy(s.friend.y),breath=still?0:Math.sin(t/700)*3+friendPulse*Math.sin(t/40)*5;friendPulse=Math.max(0,friendPulse-.02);
   c.globalAlpha=.25+.35*glow;c.fillStyle=gold;c.beginPath();c.arc(gx,gy,26+breath+6*glow,0,6.283);c.fill();
   // Three stars of the Cúmulo, turning: the creature.
   c.globalAlpha=.95;for(let k=0;k<3;k++){const a=(still?0:t/1200)+k*2.094,x=gx+Math.cos(a)*9,y=gy+Math.sin(a)*9;c.fillRect(Math.round(x)-3,Math.round(y)-3,6,6);}}
  c.restore();}
 // Over the cube: caught fireflies fly in and circle it; gold drops fly to the bar.
 function over(c,W,H,t){if(!active())return;const now=performance.now(),gold=runtime.GOLD||'#f0d27a',cam=worldCamera(runtime),cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y),sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),still=calm();c.save();
  for(let i=flying.length-1;i>=0;i--){const f=flying[i],k=Math.max(0,Math.min(1,(now-f.at)/320));if(k>=1){flying.splice(i,1);orbit.push({a:f.phase,d:14+8*hashKey(f.id)});if(orbit.length>30)orbit.shift();continue;}
   c.globalAlpha=1;c.fillStyle=gold;c.fillRect(Math.round(sx(f.x+(runtime.S.wx-f.x)*k))-2,Math.round(sy(f.y+(runtime.S.wy-f.y)*k))-2,4,4);}
  for(const o of orbit){const a=o.a+(still?0:t/1500);c.globalAlpha=.8;c.fillStyle='#fff6c8';c.fillRect(Math.round(cx+Math.cos(a)*o.d)-1,Math.round(cy+Math.sin(a)*o.d)-1,3,3);}
  if(shiver>0&&!still){c.globalAlpha=.5*shiver;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.arc(cx+Math.sin(now/25)*2,cy,16,0,6.283);c.stroke();shiver=Math.max(0,shiver-.05);}
  const left=16,right=W-16,barY=42;
  for(let i=toBar.length-1;i>=0;i--){const d=toBar[i],k=(now-d.at)/450;if(k<0)continue;if(k>=1){toBar.splice(i,1);continue;}const tx=left+(right-left)*lassoProgress(d.from+d.value,goal()),e=1-(1-k)*(1-k),z=Math.min(10,3+d.value/3);
   c.globalAlpha=1-k*.3;c.fillStyle=gold;c.fillRect(Math.round(cx+(tx-cx)*e-z/2),Math.round(cy+(barY-cy)*e-z/2),Math.round(z),Math.round(z));}
  c.restore();}
 runtime.registerJourneyGame?.('bosque',{pulse,under,over,progress:()=>lassoProgress(own().points,goal())});
 Object.defineProperties(runtime,{journeyLasso:{get:()=>()=>{const s=own(),now=performance.now(),loop=loopNow(now);return {active:active(),points:s.points,progress:lassoProgress(s.points,goal()),caught:s.caught.length,best:s.best,loops,misses,trail:trail.length,closed:!!loop,
  inside:loop?fireflies(runtime.S.wx,runtime.S.wy,600).filter(f=>insideLoop(loop,f.x,f.y)).length:0,friend:s.friend?{...s.friend}:null,joined:s.joined};}},journeyLassoTick:{get:()=>()=>{if(active())tick();}}});
}
