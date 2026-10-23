import {hashKey} from './universe-regions.js';
import {calmMotion} from './frame-state.js';
import {beatGlow,worldCamera,sayOnce,chapterToast} from './journey-games.js';
// «Baila» (the Tormenta, chapter 4 of the Journey's games, Jay's decision of 23 October): the storm marks a circle on
// the ground near the cube, and a bolt will fall there in a bar and a half. Step into the circle and pulse on time: you
// send the bolt back to the sky. Each one returned in a row is worth more. A bolt you miss falls white and the row
// starts again. Off time nothing happens. With the bar full the eye of the storm comes beside the cube, and one pulse
// on time closes it.
// Where the circles fall comes from hashes of their count, never from the old random sequence.
export const DANCE_GOAL=250,DANCE_FIRST=28,DANCE_RADIUS=42,DANCE_LIFE_BARS=1.5,DANCE_NEAR=100,DANCE_FAR=170,DANCE_EYE_GAP=70;
// Returned in a row: 10, then 15, then 20.
export const danceValue=row=>10+5*Math.max(0,Math.min(2,row-1));
export const danceProgress=points=>Math.max(0,Math.min(1,points/DANCE_GOAL));
// The nth circle: a direction and a distance from where the cube is when it appears.
export function danceSpot(n,from,seed='dance:v1'){const a=hashKey(seed+':'+n+':a')*6.283,d=DANCE_NEAR+(DANCE_FAR-DANCE_NEAR)*hashKey(seed+':'+n+':d');return {x:Math.round(from.x+Math.cos(a)*d),y:Math.round(from.y+Math.sin(a)*d)};}
export function normalizeDance(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const eye=q.eye&&Number.isFinite(q.eye.x)&&Number.isFinite(q.eye.y)?{x:Math.round(q.eye.x),y:Math.round(q.eye.y)}:null;
 return {points:Number.isFinite(q.points)?Math.max(0,Math.min(DANCE_GOAL,q.points)):0,count:Number.isInteger(q.count)?Math.max(0,Math.min(1e6,q.count)):0,returned:Number.isInteger(q.returned)?Math.max(0,Math.min(1e6,q.returned)):0,
  best:Number.isInteger(q.best)?Math.max(0,Math.min(999,q.best)):0,eye,closed:q.closed===true,hinted:q.hinted===true};}
export function initialize(runtime){
 let owner=null,state=null,target=null,row=0,misses=0,fallen=0,shiver=0,eyePulse=0,wait=0;const strikes=[],toBar=[];
 const calm=()=>calmMotion(runtime.S);
 function own(){const j=runtime.S.journey||{};if(owner!==runtime.S||j.dance!==state){owner=runtime.S;j.dance=normalizeDance(j.dance);state=j.dance;target=null;row=0;strikes.length=0;toBar.length=0;}return state;}
 const active=()=>!!runtime.journeyGamePlaying?.('tormenta');
 const full=()=>own().points>=DANCE_GOAL;
 const barMs=()=>(runtime.SIX||.15)*16*1000;
 const inside=()=>!!target&&Math.hypot(runtime.S.wx-target.x,runtime.S.wy-target.y)<=DANCE_RADIUS;
 function thunder(x,y,mine){runtime.flash=Math.max(runtime.flash||0,mine?.8:.5);runtime.cameraKick?.(0,mine?2:1.5);if(runtime.S.sound&&runtime.ac)runtime.now?.(q=>runtime.thunder?.(q,{x,y}));}
 // The first circle of the chapter appears right beside the cube, so the rule is learnt at once (plan F1).
 function spawn(){const s=own(),first=s.count===0,from={x:runtime.S.wx,y:runtime.S.wy},spot=first?{x:Math.round(from.x+DANCE_FIRST),y:from.y}:danceSpot(s.count,from);target={...spot,at:performance.now(),n:s.count};s.count++;}
 function arrive(){const s=own();if(s.eye)return;target=null;s.eye={x:Math.round(runtime.S.wx+DANCE_EYE_GAP),y:Math.round(runtime.S.wy-DANCE_EYE_GAP*.5)};eyePulse=1;runtime.save?.();
  chapterToast(runtime,'tormenta','El ojo de la tormenta llegó: tócalo a tiempo.');}
 function close(){const s=own();if(s.closed)return 'done';s.closed=true;if(runtime.save?.()===false){s.closed=false;return null;}runtime.enterFx=1;thunder(runtime.S.wx,runtime.S.wy,true);runtime.journeyComplete?.('tormenta');return 'close';}
 // Only on time, and only inside the circle: the bolt goes back up. Off time the cube shivers.
 function pulse(on){if(!active())return null;const s=own();if(!on){misses++;shiver=1;return 'miss';}
  if(full()){if(!s.eye)arrive();return close();}
  if(!inside())return 'outside';
  row++;const value=danceValue(row),before=s.points;s.points=Math.min(DANCE_GOAL,s.points+value);s.returned++;if(row>s.best)s.best=row;
  strikes.push({x:target.x,y:target.y,at:performance.now(),mine:true});toBar.push({value,from:before,at:performance.now()+200});thunder(target.x,target.y,true);
  target=null;wait=performance.now()+500;if(before<DANCE_GOAL&&s.points>=DANCE_GOAL)arrive();runtime.save?.();return 'return';}
 function tick(){const s=own(),now=performance.now();
  if(full()){if(!s.eye)arrive();}
  else if(!target&&now>=wait)spawn();
  else if(target&&now-target.at>=barMs()*DANCE_LIFE_BARS){strikes.push({x:target.x,y:target.y,at:now,mine:false});thunder(target.x,target.y,false);fallen++;row=0;target=null;wait=now+600;}
  if(s.eye&&!s.closed){const dx=runtime.S.wx+DANCE_EYE_GAP-s.eye.x,dy=runtime.S.wy-DANCE_EYE_GAP*.5-s.eye.y;if(Math.hypot(dx,dy)>4){s.eye.x+=dx*.08;s.eye.y+=dy*.08;}}
  const MU=runtime.MU,p=danceProgress(s.points);if(MU){MU.journeyOwnBolts=true;if(p>0){MU.journeyFloor=Math.max(MU.journeyFloor||0,.3+.6*p);if(MU.journeyCap!=null)MU.journeyCap=Math.max(MU.journeyCap,.5+.5*p);}}}
 // A discharge seen from above: branches out from where it falls.
 function bolt(c,x,y,seed,k,ink){c.globalAlpha=Math.max(0,1-k);c.strokeStyle=ink;c.lineWidth=2;for(let b=0;b<3;b++){const dir=hashKey(seed+':'+b)*6.283;c.beginPath();c.moveTo(x,y);for(let i=1;i<=6;i++){const d=i*10,w=(hashKey(seed+':'+b+':'+i)-.5)*14;c.lineTo(x+Math.cos(dir)*d-Math.sin(dir)*w,y+Math.sin(dir)*d+Math.cos(dir)*w);}c.stroke();}}
 // Under the cube: the place dims; the circle waits, filling as its bolt comes; bolts that fell or went back up.
 function under(c,W,H,t){if(!active())return;const s=own();sayOnce(runtime,s,'hinted','Entra en el círculo y toca a tiempo: devuelves el rayo.','tormenta');tick();
  const still=calm(),cam=worldCamera(runtime),sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),glow=beatGlow(runtime),gold=runtime.GOLD||'#f0d27a',now=performance.now();
  c.save();c.globalAlpha=.4;c.fillStyle='#000';c.fillRect(0,0,W,H);
  if(target){const x=sx(target.x),y=sy(target.y),k=Math.min(1,(now-target.at)/(barMs()*DANCE_LIFE_BARS)),here=inside();
   // The circle fills as the bolt comes; with the cube inside it lights up on every beat.
   c.globalAlpha=(here?.18+.22*glow:.08+.1*k);c.fillStyle='#ffffff';c.beginPath();c.arc(x,y,DANCE_RADIUS,0,6.283);c.fill();
   c.globalAlpha=here?.95:.6+.3*glow;c.strokeStyle=here?gold:'#ffffff';c.lineWidth=here?3:2;c.beginPath();c.arc(x,y,DANCE_RADIUS,0,6.283);c.stroke();
   c.globalAlpha=.7;c.lineWidth=2;c.beginPath();c.arc(x,y,DANCE_RADIUS+6,-1.571,-1.571+6.283*(1-k));c.stroke();
   // Where it is, when it is off the screen.
   if(x<0||x>W||y<0||y>H){const a=Math.atan2(y-H/2,x-W/2),ex=Math.max(20,Math.min(W-20,W/2+Math.cos(a)*W)),ey=Math.max(110,Math.min(H-120,H/2+Math.sin(a)*H));c.globalAlpha=.8;c.strokeStyle='#ffffff';c.beginPath();c.arc(ex,ey,10+3*glow,0,6.283);c.stroke();}}
  for(let i=strikes.length-1;i>=0;i--){const b=strikes[i],k=(now-b.at)/500;if(k>=1){strikes.splice(i,1);continue;}bolt(c,sx(b.x),sy(b.y),'dance:'+b.at,k,b.mine?gold:'#ffffff');if(b.mine&&!still){c.globalAlpha=1-k;c.strokeStyle=gold;c.lineWidth=2;c.beginPath();c.arc(sx(b.x),sy(b.y),DANCE_RADIUS*(1+k*1.5),0,6.283);c.stroke();}}
  if(s.eye&&!s.closed){const gx=sx(s.eye.x),gy=sy(s.eye.y),breath=still?0:Math.sin(t/700)*3+eyePulse*Math.sin(t/40)*5;eyePulse=Math.max(0,eyePulse-.02);
   c.globalAlpha=.25+.35*glow;c.fillStyle=gold;c.beginPath();c.arc(gx,gy,30+breath+6*glow,0,6.283);c.fill();
   // A spiral turning in: the eye.
   c.globalAlpha=.95;c.strokeStyle=gold;c.lineWidth=2;c.beginPath();for(let i=0;i<=60;i++){const a=i/60*12.566+(still?0:t/900),r=26*(1-i/60);i?c.lineTo(gx+Math.cos(a)*r,gy+Math.sin(a)*r):c.moveTo(gx+Math.cos(a)*r,gy+Math.sin(a)*r);}c.stroke();}
  c.restore();}
 function over(c,W,H){if(!active())return;const now=performance.now(),gold=runtime.GOLD||'#f0d27a',cam=worldCamera(runtime),cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y);c.save();
  if(shiver>0&&!calm()){c.globalAlpha=.5*shiver;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.arc(cx+Math.sin(now/25)*2,cy,16,0,6.283);c.stroke();shiver=Math.max(0,shiver-.05);}
  const left=16,right=W-16,barY=42;
  for(let i=toBar.length-1;i>=0;i--){const d=toBar[i],k=(now-d.at)/450;if(k<0)continue;if(k>=1){toBar.splice(i,1);continue;}const tx=left+(right-left)*danceProgress(d.from+d.value),e=1-(1-k)*(1-k),z=4+d.value/4;
   c.globalAlpha=1-k*.3;c.fillStyle=gold;c.fillRect(Math.round(cx+(tx-cx)*e-z/2),Math.round(cy+(barY-cy)*e-z/2),Math.round(z),Math.round(z));}
  c.restore();}
 runtime.registerJourneyGame?.('tormenta',{pulse,under,over,progress:()=>danceProgress(own().points)});
 Object.defineProperties(runtime,{journeyDance:{get:()=>()=>{const s=own();return {active:active(),points:s.points,progress:danceProgress(s.points),returned:s.returned,row,best:s.best,fallen,misses,target:target?{x:target.x,y:target.y,n:target.n}:null,inside:inside(),eye:s.eye?{...s.eye}:null,closed:s.closed};}}});
}
