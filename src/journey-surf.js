import {hashKey} from './universe-regions.js';
import {calmMotion} from './frame-state.js';
import {beatGlow,worldCamera,sayOnce,chapterToast,commitJourneyClose} from './journey-games.js';
// «Surfea» (the Dunas, plan F10, docs/MUNDO.md): waves of sand cross the dunes in time. A ring of sand shows where the
// crest of the next wave will pass, and an arc around it closes until its beat. Be in the ring and pulse on time as
// the crest passes: you ride it, it pushes you along, and the bar fills. Waves ridden in a row are worth more; letting
// one pass starts the streak again. With the bar full a gold wave comes; riding it ends the round. Off time, nothing.
// Since plan F14 the crest passes on the «y», between two beats (journey-rhythm.js).
export const SURF_GOAL=150,SURF_EVERY=4,SURF_BAND=46,SURF_MAESTRO_BAND=34,SURF_NEAR=90,SURF_FAR=170,SURF_PUSH=70,SURF_AHEAD=4;
// A ride is worth two, plus one for each wave ridden before it in a row, up to four.
export const surfValue=streak=>Math.min(4,2+Math.max(0,streak|0));
export const surfProgress=(points,goal=SURF_GOAL)=>Math.max(0,Math.min(1,points/goal));
// Where the nth wave's crest passes: an angle and a distance from where the cube was, from hashes, never random.
export function waveSpot(n,from,seed='surf:v1'){const a=hashKey(seed+':a:'+n)*6.283,d=SURF_NEAR+(SURF_FAR-SURF_NEAR)*hashKey(seed+':d:'+n),dir=hashKey(seed+':w:'+n)*6.283;
 return {x:Math.round(from.x+Math.cos(a)*d),y:Math.round(from.y+Math.sin(a)*d),dir};}
// A pulse rides a wave when it is on time, on that wave's beat, and inside its ring.
export function rides(wave,pos,beatTime,{band=SURF_BAND}={}){return !!wave&&Math.abs(wave.at-beatTime)<1e-3&&Math.hypot(pos.x-wave.x,pos.y-wave.y)<=band;}
export function normalizeSurf(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 return {points:Number.isFinite(q.points)?Math.max(0,q.points):0,streak:Number.isInteger(q.streak)?Math.max(0,q.streak):0,best:Number.isInteger(q.best)?Math.max(0,q.best):0,rides:Number.isInteger(q.rides)?Math.max(0,q.rides):0,n:Number.isInteger(q.n)?Math.max(0,q.n):0,gold:q.gold===true,opened:q.opened===true,hinted:q.hinted===true};}
export function initialize(runtime){
 const goal=()=>SURF_GOAL*(runtime.placeGoalScale?.()||1),band=()=>runtime.placeRun?.()?.maestro?SURF_MAESTRO_BAND:SURF_BAND;
 let owner=null,state=null,misses=0,shiver=0,push=null;const waves=[],splashes=[],toBar=[];
 const calm=()=>calmMotion(runtime.S);
 function own(){const j=runtime.S.journey||(runtime.S.journey={});if(owner!==runtime.S||j.surf!==state){owner=runtime.S;j.surf=normalizeSurf(j.surf);state=j.surf;waves.length=0;splashes.length=0;toBar.length=0;push=null;}return state;}
 const active=()=>!!runtime.journeyGamePlaying?.('dunas');
 const audible=()=>runtime.S.sound&&runtime.ac&&runtime.bus;
 const full=()=>own().points>=goal();
 const beatSec=()=>(runtime.SIX||.125)*4;
 // The crest's grid (plan F14): the «y» halfway between the beats the music scheduled, so the crest passes off the beat.
 const and=()=>runtime.journeyRhythm?.()?.key==='contra'?beatSec()/2:0;
 function nextBeat(after){const bq=runtime.MU?.bq||[],b=beatSec();if(!bq.length)return null;let t=bq[bq.length-1]+and();while(t<after)t+=b;return t;}
 function nearestBeat(t){const bq=runtime.MU?.bq||[],b=beatSec();if(!bq.length)return t;const base=bq[bq.length-1]+and();return base+Math.round((t-base)/b)*b;}
 // Keep two waves on the way, every other beat, the first a few beats ahead so there is time to walk to its ring.
 function feed(){const s=own(),now=runtime.ac?.currentTime;if(now==null)return;
  // The music can change its tempo (a new place, a Maestro round): the waves on the way move to the beats it plays now.
  for(const w of waves)if(!w.ridden)w.at=nearestBeat(w.at);
  for(let i=waves.length-1;i>=0;i--)if(waves[i].at<now-beatSec()*.6){const w=waves[i];waves.splice(i,1);if(!w.ridden&&!w.gold&&s.streak){s.streak=0;}}
  while(waves.length<2){const last=waves[waves.length-1],at=last?last.at+SURF_EVERY*beatSec():nextBeat(now+SURF_AHEAD*beatSec());if(at==null)return;
   const spot=waveSpot(s.n,last?{x:last.x,y:last.y}:{x:runtime.S.wx,y:runtime.S.wy});waves.push({...spot,at,n:s.n,gold:full()&&!s.gold});s.n++;}}
 function note(streak){if(!audible())return;runtime.soon?.(t=>{const ct=runtime.chordTones?.()||[60,64,67];runtime.pluck?.(ct[streak%ct.length]+12+12*(streak>=ct.length?1:0),t,.08,1);runtime.hatHit?.(t,.08);},'player');}
 function open(){const s=own();if(s.opened)return 'done';s.opened=true;if(!commitJourneyClose(runtime,'dunas')){s.opened=false;return null;}runtime.enterFx=1;runtime.flash=1;for(let i=0;i<6;i++)note(i);return 'open';}
 function pulse(on,beat={}){if(!active())return null;const s=own();if(!on){misses++;shiver=1;return 'miss';}const now=runtime.ac?.currentTime??0,heard=nearestBeat(now),pos={x:runtime.S.wx,y:runtime.S.wy};
  const w=waves.find(q=>!q.ridden&&rides(q,pos,heard,{band:band()}));if(!w)return 'still';w.ridden=true;
  if(w.gold){s.gold=true;return open();}
  const value=surfValue(s.streak),before=s.points;s.points=Math.min(goal(),s.points+value);s.streak++;s.best=Math.max(s.best,s.streak);s.rides++;note(s.streak);
  splashes.push({x:w.x,y:w.y,at:performance.now(),value});if(splashes.length>20)splashes.shift();toBar.push({value,from:before,at:performance.now()+150});
  push={dx:Math.cos(w.dir)*SURF_PUSH,dy:Math.sin(w.dir)*SURF_PUSH,left:1};runtime.save?.();
  if(before<goal()&&s.points>=goal())chapterToast(runtime,'dunas','Llega la ola dorada: súbete a tiempo.');return 'ride';}
 function tick(){const s=own();feed();if(push&&push.left>0){const k=Math.min(push.left,.12);runtime.S.wx+=push.dx*k;runtime.S.wy+=push.dy*k;push.left-=k;}
  const MU=runtime.MU,p=surfProgress(s.points,goal());if(MU&&p>0){MU.journeyFloor=Math.max(MU.journeyFloor||0,.2+.6*p);if(MU.journeyCap!=null)MU.journeyCap=Math.max(MU.journeyCap,.4+.6*p);}}
 // A wave of sand: a curved crest across the dunes, travelling along its direction and passing the ring on its beat.
 function crest(c,x,y,dir,gold,alpha,still,t){const nx=Math.cos(dir+Math.PI/2),ny=Math.sin(dir+Math.PI/2),len=150;c.globalAlpha=alpha;c.strokeStyle=gold?runtime.GOLD||'#f0d27a':'#ffffff';c.lineWidth=gold?3:2;
  c.beginPath();for(let i=-10;i<=10;i++){const k=i/10,bend=-Math.cos(k*1.57)*14,wob=still?0:Math.sin(t/300+i)*1.5;const px=x+nx*k*len+Math.cos(dir)*(bend+wob),py=y+ny*k*len+Math.sin(dir)*(bend+wob);i===-10?c.moveTo(px,py):c.lineTo(px,py);}c.stroke();}
 function under(c,W,H,t){if(!active())return;const s=own();sayOnce(runtime,s,'hinted','Espera la ola en el círculo. Súbete en el «y».','dunas');tick();
  const still=calm(),cam=worldCamera(runtime),sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),glow=beatGlow(runtime),gold=runtime.GOLD||'#f0d27a',now=runtime.ac?.currentTime??0,b=beatSec(),speed=SURF_FAR*1.4/(SURF_EVERY*b);
  c.save();c.globalAlpha=.35;c.fillStyle='#000';c.fillRect(0,0,W,H);
  waves.forEach((w,i)=>{const x=sx(w.x),y=sy(w.y),left=w.at-now,inside=Math.hypot(runtime.S.wx-w.x,runtime.S.wy-w.y)<=band(),first=i===0;
   // The ring: where to be. Its arc closes until the beat; the next one is brighter.
   c.globalAlpha=w.ridden?.2:(first?.85:.35);c.strokeStyle=w.gold?gold:'#ffffff';c.lineWidth=inside&&first?2.5:1.2;c.setLineDash?.(first?[]:[3,4]);c.beginPath();c.arc(x,y,band()*(1+(first&&!still?.05*glow:0)),0,6.283);c.stroke();c.setLineDash?.([]);
   if(first&&!w.ridden&&left>0){const k=Math.max(0,Math.min(1,left/(SURF_EVERY*b*2)));c.globalAlpha=.8;c.strokeStyle=w.gold?gold:'#ffffff';c.lineWidth=2;c.beginPath();c.arc(x,y,band()+6,-Math.PI/2,-Math.PI/2+k*6.283);c.stroke();}
   // The crest comes along its direction and crosses the ring on its beat.
   const d=-left*speed;if(Math.abs(d)<SURF_FAR*2)crest(c,x+Math.cos(w.dir)*d,y+Math.sin(w.dir)*d,w.dir,w.gold,(w.ridden?.25:.8)*Math.max(0,1-Math.abs(d)/(SURF_FAR*2)),still,t);});
  const nowMs=performance.now();for(const sp of splashes){const k=(nowMs-sp.at)/700;if(k>1)continue;c.globalAlpha=.8*(1-k);c.fillStyle=gold;for(let i=0;i<8;i++){const a=i*.785,r=10+k*30;c.fillRect(Math.round(sx(sp.x)+Math.cos(a)*r)-1,Math.round(sy(sp.y)+Math.sin(a)*r)-1,3,3);}}
  c.restore();}
 function over(c,W,H){if(!active())return;const now=performance.now(),gold=runtime.GOLD||'#f0d27a',cam=worldCamera(runtime),cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y),s=own();c.save();
  if(shiver>0&&!calm()){c.globalAlpha=.5*shiver;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.arc(cx+Math.sin(now/25)*2,cy,16,0,6.283);c.stroke();shiver=Math.max(0,shiver-.05);}
  // The streak: small gold marks under the cube, one per wave in a row (up to three, where it stops adding).
  for(let i=0;i<Math.min(3,s.streak);i++){c.globalAlpha=.9;c.fillStyle=gold;c.fillRect(Math.round(cx-15+i*6),Math.round(cy+18),3,3);}
  const left=16,right=W-16,barY=42;
  for(let i=toBar.length-1;i>=0;i--){const d=toBar[i],k=(now-d.at)/450;if(k<0)continue;if(k>=1){toBar.splice(i,1);continue;}const tx=left+(right-left)*surfProgress(d.from+d.value,goal()),e=1-(1-k)*(1-k),z=2+d.value/2;
   c.globalAlpha=1-k*.3;c.fillStyle=gold;c.fillRect(Math.round(cx+(tx-cx)*e-z/2),Math.round(cy+(barY-cy)*e-z/2),Math.round(z),Math.round(z));}
  c.restore();}
 runtime.registerJourneyGame?.('dunas',{pulse,under,over,progress:()=>surfProgress(own().points,goal())});
 Object.defineProperties(runtime,{journeySurf:{get:()=>()=>{const s=own();return {active:active(),points:s.points,goal:goal(),progress:surfProgress(s.points,goal()),streak:s.streak,best:s.best,rides:s.rides,misses,gold:s.gold,opened:s.opened,band:band(),waves:waves.map(w=>({x:w.x,y:w.y,at:w.at,dir:w.dir,ridden:!!w.ridden,gold:!!w.gold}))};}}});
}
