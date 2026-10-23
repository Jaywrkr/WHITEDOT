import {calmMotion} from './frame-state.js';
import {beatGlow,worldCamera,sayOnce,chapterToast} from './journey-games.js';
// «Reconstruye» (the Ruinas, plan F15–F16, docs/MUNDO.md): eight broken pillars in a ring around where the round began.
// Beside a pillar, play the Ruinas' pattern («1 · 2y · 3 · 4», journey-rhythm.js) on time: three of its four steps in
// one bar lay a stone (all four in the Maestro). A pillar takes seven stones; two whole pillars side by side are joined by
// a gold arch, worth more. With the bar full a gold capstone comes beside the cube and one pulse on time sets it.
// Off time, nothing.
export const RUINS_PILLARS=8,RUINS_STONES=7,RUINS_REACH=80,RUINS_RING=200,RUINS_NEED=3,RUINS_MAESTRO_NEED=4,RUINS_GOLD_GAP=70;
export const RUINS_VALUES=Object.freeze({stone:4,arch:10});
export const ruinsProgress=(points,goal=RUINS_GOAL)=>Math.max(0,Math.min(1,points/goal));
// The pillars: a ring of eight, fixed; some start with a stone or two still standing.
export function pillarSpots(center){return Array.from({length:RUINS_PILLARS},(_,i)=>{const a=-Math.PI/2+i/RUINS_PILLARS*2*Math.PI;return {x:Math.round(center.x+Math.cos(a)*RUINS_RING),y:Math.round(center.y+Math.sin(a)*RUINS_RING)};});}
export const RUINS_START=Object.freeze([1,0,2,0,1,0,0,1]);
// Everything a round can earn: every missing stone and every arch. The Maestro's longer bar asks for all of it.
export const RUINS_MAX=(RUINS_PILLARS*RUINS_STONES-RUINS_START.reduce((a,b)=>a+b,0))*RUINS_VALUES.stone+RUINS_PILLARS*RUINS_VALUES.arch;
export const RUINS_GOAL=265;
export function normalizeRebuild(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{},pt=v=>v&&Number.isFinite(v.x)&&Number.isFinite(v.y)?{x:Math.round(v.x),y:Math.round(v.y)}:null;
 const stones=Array.from({length:RUINS_PILLARS},(_,i)=>Number.isInteger(q.stones?.[i])?Math.max(0,Math.min(RUINS_STONES,q.stones[i])):RUINS_START[i]);
 const arches=Array.from({length:RUINS_PILLARS},(_,i)=>q.arches?.[i]===true);
 return {points:Number.isFinite(q.points)?Math.max(0,q.points):0,center:pt(q.center),stones,arches,laid:Number.isInteger(q.laid)?Math.max(0,q.laid):0,pending:null,gold:pt(q.gold),opened:q.opened===true,hinted:q.hinted===true};}
// The pillar within reach of a point, the nearest one; null when none is.
export function pillarAt(state,pos,reach=RUINS_REACH){let best=null;pillarSpots(state.center).forEach((p,i)=>{const d=Math.hypot(p.x-pos.x,p.y-pos.y);if(d<=reach&&(!best||d<best.d))best={i,d};});return best?best.i:null;}
// One pulse on time at a step of a bar beside a pillar: it counts toward that bar; with enough steps a stone is laid,
// and a pillar made whole beside another whole one raises the arch between them. Pure.
export function rebuildPulse(state,pos,{bar,step,need=RUINS_NEED,goal=RUINS_GOAL,steps=[0,6,8,12]}={}){const i=pillarAt(state,pos),events=[];let gained=0;
 if(i===null||!steps.includes(step))return {gained,events,pillar:i};
 const p=state.pending;if(!p||p.pillar!==i||p.bar!==bar)state.pending={pillar:i,bar,steps:[step],laid:false};else if(!p.steps.includes(step))p.steps.push(step);
 const q=state.pending;events.push({kind:'beat',pillar:i,count:q.steps.length});
 if(!q.laid&&q.steps.length>=need&&state.stones[i]<RUINS_STONES){q.laid=true;state.stones[i]++;state.laid++;gained+=RUINS_VALUES.stone;events.push({kind:'stone',pillar:i,height:state.stones[i]});
  if(state.stones[i]===RUINS_STONES)for(const j of [(i+RUINS_PILLARS-1)%RUINS_PILLARS,(i+1)%RUINS_PILLARS]){const a=j===(i+1)%RUINS_PILLARS?i:j;if(state.stones[j]===RUINS_STONES&&!state.arches[a]){state.arches[a]=true;gained+=RUINS_VALUES.arch;events.push({kind:'arch',from:a,to:(a+1)%RUINS_PILLARS});}}}
 state.points=Math.min(goal,state.points+gained);return {gained,events,pillar:i};}
export function initialize(runtime){
 const maestro=()=>!!runtime.placeRun?.()?.maestro,goal=()=>Math.min(RUINS_MAX,RUINS_GOAL*(runtime.placeGoalScale?.()||1)),need=()=>maestro()?RUINS_MAESTRO_NEED:RUINS_NEED;
 let owner=null,state=null,misses=0,shiver=0,goldPulse=0;const glows=[],toBar=[];
 const calm=()=>calmMotion(runtime.S);
 function own(){const j=runtime.S.journey||(runtime.S.journey={});if(owner!==runtime.S||j.rebuild!==state){owner=runtime.S;j.rebuild=normalizeRebuild(j.rebuild);state=j.rebuild;glows.length=0;toBar.length=0;}
  if(!state.center)state.center={x:Math.round(runtime.S.wx),y:Math.round(runtime.S.wy)};return state;}
 const active=()=>!!runtime.journeyGamePlaying?.('ruinas');
 const audible=()=>runtime.S.sound&&runtime.ac&&runtime.bus;
 const full=()=>own().points>=goal();
 const barMs=()=>(runtime.SIX||.125)*16*1000;
 const patternSteps=()=>runtime.journeyRhythm?.()?.steps||[0,6,8,12];
 // Which bar a pulse belongs to: the time its bar began, counted in bars.
 function barOf(step){const start=performance.now()-(Number.isFinite(step)?step:0)*(runtime.SIX||.125)*1000;return Math.round(start/barMs());}
 // A stone is a low knock and its note; an arch, the chord.
 function knock(height,arch=false){if(!audible())return;runtime.soon?.(t=>{const ct=runtime.chordTones?.()||[60,64,67];runtime.kick?.(t,.18);let m=ct[height%ct.length]+12;while(m>84)m-=12;runtime.pluck?.(m,t,.08,2);if(arch)ct.slice(0,3).forEach((n,k)=>runtime.pluck?.(n+24,t+k*(runtime.SIX||.125),.06,2));},'player');}
 function arrive(){const s=own();if(s.gold)return;s.gold={x:Math.round(runtime.S.wx+RUINS_GOLD_GAP),y:Math.round(runtime.S.wy-RUINS_GOLD_GAP*.5)};goldPulse=1;runtime.save?.();chapterToast(runtime,'ruinas','Llegó la piedra dorada: colócala a tiempo.');}
 function open(){const s=own();if(s.opened)return 'done';s.opened=true;if(runtime.save?.()===false){s.opened=false;return null;}runtime.enterFx=1;runtime.flash=1;for(let i=0;i<4;i++)knock(i,i===3);runtime.journeyComplete?.('ruinas');return 'open';}
 function pulse(on,beat={}){if(!active())return null;const s=own();if(!on){misses++;shiver=1;return 'miss';}if(full()){if(!s.gold)arrive();return open();}
  const step=beat.silent?patternSteps()[(s.pending?.steps?.length||0)%patternSteps().length]:beat.step;
  const before=s.points,now=performance.now(),r=rebuildPulse(s,{x:runtime.S.wx,y:runtime.S.wy},{bar:beat.silent?(s.pending?.laid?s.pending.bar+1:(s.pending?.bar??0)):barOf(step),step,need:need(),goal:goal(),steps:patternSteps()}),spots=pillarSpots(s.center);
  for(const e of r.events){if(e.kind==='stone'){knock(e.height);glows.push({x:spots[e.pillar].x,y:spots[e.pillar].y,at:now,kind:'stone'});}else if(e.kind==='arch'){knock(0,true);const a=spots[e.from],b=spots[e.to];glows.push({x:(a.x+b.x)/2,y:(a.y+b.y)/2,at:now,kind:'arch'});}}
  if(glows.length>40)glows.splice(0,glows.length-40);if(r.gained){toBar.push({value:r.gained,from:before,at:now+150});runtime.save?.();}if(before<goal()&&s.points>=goal())arrive();
  return r.events.some(e=>e.kind==='stone')?'stone':r.events.length?'beat':'still';}
 function tick(){const s=own();if(full()&&!s.gold)arrive();
  if(s.gold){const dx=runtime.S.wx+RUINS_GOLD_GAP-s.gold.x,dy=runtime.S.wy-RUINS_GOLD_GAP*.5-s.gold.y;if(Math.hypot(dx,dy)>4){s.gold.x+=dx*.08;s.gold.y+=dy*.08;}}
  const MU=runtime.MU,p=ruinsProgress(s.points,goal());if(MU&&p>0){MU.journeyFloor=Math.max(MU.journeyFloor||0,.2+.6*p);if(MU.journeyCap!=null)MU.journeyCap=Math.max(MU.journeyCap,.4+.6*p);}}
 function under(c,W,H,t){if(!active())return;const s=own();sayOnce(runtime,s,'hinted','Junto a una columna, toca el patrón: pon una piedra.','ruinas');tick();
  const still=calm(),cam=worldCamera(runtime),sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),glow=beatGlow(runtime),gold=runtime.GOLD||'#f0d27a',now=performance.now(),spots=pillarSpots(s.center),here=pillarAt(s,{x:runtime.S.wx,y:runtime.S.wy});
  c.save();c.globalAlpha=.45;c.fillStyle='#000';c.fillRect(0,0,W,H);
  // The arches first, behind the pillars: gold curves between two whole pillars.
  for(let i=0;i<RUINS_PILLARS;i++){if(!s.arches[i])continue;const a=spots[i],b=spots[(i+1)%RUINS_PILLARS],ax=sx(a.x),ay=sy(a.y)-RUINS_STONES*7,bx=sx(b.x),by=sy(b.y)-RUINS_STONES*7,mx=(ax+bx)/2,my=(ay+by)/2-28;
   c.globalAlpha=.9;c.strokeStyle=gold;c.lineWidth=3;c.beginPath();c.moveTo(ax,ay);c.quadraticCurveTo(mx,my,bx,by);c.stroke();}
  // Each pillar: its stones stacked from the ground, the missing ones dashed; within reach, brighter, with the bar's steps.
  spots.forEach((p,i)=>{const x=sx(p.x),y=sy(p.y),h=s.stones[i],near=i===here,whole=h===RUINS_STONES;
   c.globalAlpha=near?.6:.3;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.arc(x,y+4,RUINS_REACH*.35,0,6.283);c.stroke();
   for(let k=0;k<RUINS_STONES;k++){const yy=y-k*7-6;if(k<h){c.globalAlpha=near||whole?1:.75;c.fillStyle=whole?gold:'#ffffff';c.fillRect(Math.round(x-7),Math.round(yy),14,6);}else{c.globalAlpha=near?.45:.18;c.strokeStyle='#ffffff';c.setLineDash?.([2,2]);c.strokeRect(Math.round(x-7)+.5,Math.round(yy)+.5,13,5);c.setLineDash?.([]);}}
   if(near){const q=s.pending&&s.pending.pillar===i&&s.pending.bar===barOf(runtime.journeyRhythmState?.()?.step??0)?s.pending.steps.length:0,n=need();for(let k=0;k<n;k++){c.globalAlpha=k<q?1:.35;c.fillStyle=k<q?gold:'#ffffff';c.fillRect(Math.round(x-n*5+k*10+2),Math.round(y+14),6,3);}}});
  for(const g of glows){const k=(now-g.at)/(g.kind==='arch'?900:600);if(k>1)continue;c.globalAlpha=.85*(1-k);c.strokeStyle=g.kind==='arch'?gold:'#ffffff';c.lineWidth=g.kind==='arch'?2.5:1.5;c.beginPath();c.arc(sx(g.x),sy(g.y)-20,10+k*(g.kind==='arch'?44:22),0,6.283);c.stroke();}
  if(s.gold&&!s.opened){const gx=sx(s.gold.x),gy=sy(s.gold.y),breath=still?0:Math.sin(t/700)*3+goldPulse*Math.sin(t/40)*5;goldPulse=Math.max(0,goldPulse-.02);
   c.globalAlpha=.25+.35*glow;c.fillStyle=gold;c.beginPath();c.arc(gx,gy,30+breath+6*glow,0,6.283);c.fill();c.globalAlpha=1;c.fillRect(Math.round(gx-12),Math.round(gy-6),24,12);c.fillStyle='#000';c.globalAlpha=.5;c.fillRect(Math.round(gx-12),Math.round(gy-1),24,2);}
  c.restore();}
 function over(c,W,H){if(!active())return;const now=performance.now(),gold=runtime.GOLD||'#f0d27a',cam=worldCamera(runtime),cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y);c.save();
  if(shiver>0&&!calm()){c.globalAlpha=.5*shiver;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.arc(cx+Math.sin(now/25)*2,cy,16,0,6.283);c.stroke();shiver=Math.max(0,shiver-.05);}
  const left=16,right=W-16,barY=42;
  for(let i=toBar.length-1;i>=0;i--){const d=toBar[i],k=(now-d.at)/450;if(k<0)continue;if(k>=1){toBar.splice(i,1);continue;}const tx=left+(right-left)*ruinsProgress(d.from+d.value,goal()),e=1-(1-k)*(1-k),z=2+Math.min(6,d.value/2);
   c.globalAlpha=1-k*.3;c.fillStyle=gold;c.fillRect(Math.round(cx+(tx-cx)*e-z/2),Math.round(cy+(barY-cy)*e-z/2),Math.round(z),Math.round(z));}
  c.restore();}
 runtime.registerJourneyGame?.('ruinas',{pulse,under,over,progress:()=>ruinsProgress(own().points,goal())});
 Object.defineProperties(runtime,{journeyRebuild:{get:()=>()=>{const s=own();return {active:active(),points:s.points,goal:goal(),progress:ruinsProgress(s.points,goal()),spots:pillarSpots(s.center),stones:[...s.stones],arches:[...s.arches],laid:s.laid,pending:s.pending?{...s.pending,steps:[...s.pending.steps]}:null,need:need(),misses,gold:s.gold?{...s.gold}:null,opened:s.opened};}}});
}
