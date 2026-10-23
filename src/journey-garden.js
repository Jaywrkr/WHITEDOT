import {calmMotion} from './frame-state.js';
import {beatGlow,worldCamera,sayOnce,chapterToast} from './journey-games.js';
import {onBeat,onAnd} from './journey-rhythm.js';
// «Siembra» (the Jardín, plan F9, docs/MUNDO.md): eight beds around where the round began. A pulse on time on an
// empty bed sows a seed; every pulse on time grows the plants within reach one step (seed, sprout, bud, flower); a
// pulse on time on a flower picks it and the bed is free again. Since plan F14 its rhythm splits the verbs: sow and
// pick on the beat, water on the «y» (journey-rhythm.js). A plant nobody tends for eight bars wilts one step,
// so you walk between beds and choose what to care for. Each flower adds a note to an arpeggio, the Jardín's layer of
// your song. With the bar full a gold tree comes beside the cube and one pulse on time makes it bloom. Off time,
// nothing happens.
export const GARDEN_GOAL=360,GARDEN_BEDS=8,GARDEN_REACH=95,GARDEN_BED_R=26,GARDEN_WILT_BARS=8,GARDEN_MAESTRO_WILT=6,GARDEN_TREE_GAP=70;
export const STAGES=Object.freeze(['vacío','semilla','brote','capullo','flor']);
// What each step is worth: sowing a little, growing more, a flower opening a lot, picking it as much again.
export const GARDEN_VALUES=Object.freeze({sow:2,grow:3,bloom:8,pick:6});
// The beds: a ring of eight around the centre, near and far in turn, so some can be tended together and some not.
export function bedSpots(center){return Array.from({length:GARDEN_BEDS},(_,i)=>{const a=-Math.PI/2+i/GARDEN_BEDS*2*Math.PI,d=i%2?230:150;return {x:Math.round(center.x+Math.cos(a)*d),y:Math.round(center.y+Math.sin(a)*d)};});}
export function normalizeGarden(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{},pt=v=>v&&Number.isFinite(v.x)&&Number.isFinite(v.y)?{x:Math.round(v.x),y:Math.round(v.y)}:null;
 const beds=Array.from({length:GARDEN_BEDS},(_,i)=>{const b=Array.isArray(q.beds)?q.beds[i]:null;return {stage:Number.isInteger(b?.stage)?Math.max(0,Math.min(4,b.stage)):0,care:Number.isFinite(b?.care)?b.care:0};});
 return {points:Number.isFinite(q.points)?Math.max(0,q.points):0,center:pt(q.center),beds,blooms:Number.isInteger(q.blooms)?Math.max(0,q.blooms):0,tree:pt(q.tree),opened:q.opened===true,hinted:q.hinted===true};}
// One pulse on time at a point: sow the empty bed underneath, grow what is within reach, pick a flower underneath.
// With its rhythm (plan F14) a pulse on the beat sows and picks ('sow') and one on the «y» waters, so what is within
// reach grows ('water'); without a mode (sound off) one pulse does both. Pure: the game and the tests agree.
export function gardenPulse(state,pos,now,{reach=GARDEN_REACH,goal=GARDEN_GOAL,mode=null}={}){const sow=mode!=='water',water=mode!=='sow';const spots=bedSpots(state.center),events=[];let gained=0;
 const near=spots.map((p,i)=>({i,d:Math.hypot(p.x-pos.x,p.y-pos.y)})).filter(e=>e.d<=reach).sort((a,b)=>a.d-b.d),under=near.find(e=>e.d<=GARDEN_BED_R+18);
 // The bed underneath: a flower is picked; an empty bed is sown. Then everything else within reach grows.
 let touched=null;if(under&&sow){const b=state.beds[under.i];if(b.stage===4){b.stage=0;b.care=now;gained+=GARDEN_VALUES.pick;events.push({kind:'pick',bed:under.i});touched=under.i;}
  else if(b.stage===0){b.stage=1;b.care=now;gained+=GARDEN_VALUES.sow;events.push({kind:'sow',bed:under.i});touched=under.i;}}
 if(water)for(const e of near){if(e.i===touched)continue;const b=state.beds[e.i];if(b.stage>=1&&b.stage<=3){b.stage++;b.care=now;if(b.stage===4){gained+=GARDEN_VALUES.bloom;state.blooms++;events.push({kind:'bloom',bed:e.i});}else{gained+=GARDEN_VALUES.grow;events.push({kind:'grow',bed:e.i,stage:b.stage});}}else if(b.stage===4)b.care=now;}
 state.points=Math.min(goal,state.points+gained);return {gained,events};}
// Plants nobody tended for too long go back one step, and the clock starts again.
export function gardenWilt(state,now,barSeconds,bars=GARDEN_WILT_BARS){const limit=bars*barSeconds*1000,out=[];state.beds.forEach((b,i)=>{if(b.stage>0&&now-b.care>limit){b.stage--;b.care=now;out.push(i);}});return out;}
export const gardenProgress=(points,goal=GARDEN_GOAL)=>Math.max(0,Math.min(1,points/goal));
export function initialize(runtime){
 const goal=()=>GARDEN_GOAL*(runtime.placeGoalScale?.()||1),wiltBars=()=>runtime.placeRun?.()?.maestro?GARDEN_MAESTRO_WILT:GARDEN_WILT_BARS;
 let owner=null,state=null,misses=0,shiver=0,treePulse=0;const glows=[],toBar=[];
 const calm=()=>calmMotion(runtime.S);
 function own(){const j=runtime.S.journey||(runtime.S.journey={});if(owner!==runtime.S||j.garden!==state){owner=runtime.S;j.garden=normalizeGarden(j.garden);state=j.garden;glows.length=0;toBar.length=0;}
  if(!state.center){state.center={x:Math.round(runtime.S.wx),y:Math.round(runtime.S.wy)};const now=performance.now();state.beds.forEach(b=>{b.care=now;});}return state;}
 const active=()=>!!runtime.journeyGamePlaying?.('jardin');
 const audible=()=>runtime.S.sound&&runtime.ac&&runtime.bus;
 const full=()=>own().points>=goal();
 const bar=()=>(runtime.SIX||.125)*16;
 // Each flower adds the next note of an arpeggio over the chord: the more flowers, the longer the phrase.
 function note(step,soft=false){if(!audible())return;const ct=runtime.chordTones?.()||[60,64,67];runtime.soon?.(t=>{let m=ct[step%ct.length]+12*Math.floor(step/ct.length%2)+12;while(m>86)m-=12;runtime.pluck?.(m,t,(soft?.04:.08),2);},'player');}
 function arrive(){const s=own();if(s.tree)return;s.tree={x:Math.round(runtime.S.wx+GARDEN_TREE_GAP),y:Math.round(runtime.S.wy-GARDEN_TREE_GAP*.5)};treePulse=1;runtime.save?.();chapterToast(runtime,'jardin','El árbol dorado llegó: tócalo a tiempo.');}
 function open(){const s=own();if(s.opened)return 'done';s.opened=true;if(runtime.save?.()===false){s.opened=false;return null;}runtime.enterFx=1;runtime.flash=1;for(let i=0;i<6;i++)note(i);runtime.journeyComplete?.('jardin');return 'open';}
 function pulse(on,beat={}){if(!active())return null;const s=own();if(!on){misses++;shiver=1;return 'miss';}if(full()){if(!s.tree)arrive();return open();}
  const mode=beat.silent||runtime.journeyRhythm?.()?.key!=='siembra'?null:onAnd(beat.step)?'water':onBeat(beat.step)?'sow':null;
  const before=s.points,r=gardenPulse(s,{x:runtime.S.wx,y:runtime.S.wy},performance.now(),{goal:goal(),mode}),spots=bedSpots(s.center),now=performance.now();
  for(const e of r.events){const p=spots[e.bed];glows.push({x:p.x,y:p.y,at:now,kind:e.kind});if(e.kind==='bloom')note(s.blooms-1);else if(e.kind==='grow')note(e.stage,true);}if(glows.length>40)glows.splice(0,glows.length-40);
  if(r.gained)toBar.push({value:r.gained,from:before,at:now+150});if(r.events.length)runtime.save?.();if(before<goal()&&s.points>=goal())arrive();return r.events.length?'grow':'still';}
 function tick(){const s=own(),now=performance.now();if(gardenWilt(s,now,bar(),wiltBars()).length)runtime.save?.();if(full()&&!s.tree)arrive();
  if(s.tree){const dx=runtime.S.wx+GARDEN_TREE_GAP-s.tree.x,dy=runtime.S.wy-GARDEN_TREE_GAP*.5-s.tree.y;if(Math.hypot(dx,dy)>4){s.tree.x+=dx*.08;s.tree.y+=dy*.08;}}
  const MU=runtime.MU,p=gardenProgress(s.points,goal());if(MU&&p>0){MU.journeyFloor=Math.max(MU.journeyFloor||0,.2+.6*p);if(MU.journeyCap!=null)MU.journeyCap=Math.max(MU.journeyCap,.4+.6*p);}}
 // A plant drawn by its stage: a seed, a stem, a stem with a bud, a flower with five petals and a gold heart.
 function plant(c,x,y,stage,glow,still,t){const white='#ffffff',gold=runtime.GOLD||'#f0d27a';c.fillStyle=c.strokeStyle=white;c.lineWidth=1.5;
  if(stage===1){c.globalAlpha=.9;c.fillRect(Math.round(x)-2,Math.round(y)-2,4,4);return;}
  const h=stage===2?10:16,sway=still?0:Math.sin(t/900+x)*1.5;c.globalAlpha=.9;c.beginPath();c.moveTo(x,y+6);c.quadraticCurveTo(x+sway,y,x+sway,y+6-h);c.stroke();
  if(stage===2){c.beginPath();c.ellipse(x+sway+3,y-1,3,1.5,-.5,0,6.283);c.fill();return;}
  const tx=x+sway,ty=y+6-h;if(stage===3){c.beginPath();c.ellipse(tx,ty-2,2.5,4,0,0,6.283);c.fill();return;}
  const open=4+(still?0:glow*1.5);for(let k=0;k<5;k++){const a=k*1.2566+(still?0:t/6000);c.beginPath();c.ellipse(tx+Math.cos(a)*open,ty+Math.sin(a)*open,3.2,2,a,0,6.283);c.fill();}c.fillStyle=gold;c.fillRect(Math.round(tx)-2,Math.round(ty)-2,4,4);}
 function under(c,W,H,t){if(!active())return;const s=own();sayOnce(runtime,s,'hinted','Siembra a tiempo. Riega en el «y».','jardin');tick();
  const still=calm(),cam=worldCamera(runtime),sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),glow=beatGlow(runtime),gold=runtime.GOLD||'#f0d27a',now=performance.now(),limit=wiltBars()*bar()*1000;
  c.save();c.globalAlpha=.4;c.fillStyle='#000';c.fillRect(0,0,W,H);
  bedSpots(s.center).forEach((p,i)=>{const b=s.beds[i],x=sx(p.x),y=sy(p.y),near=Math.hypot(p.x-runtime.S.wx,p.y-runtime.S.wy)<=GARDEN_REACH;
   // The bed: a dotted ring, brighter within reach; around a growing plant, a thin arc of the time left before it wilts.
   c.globalAlpha=near?.7:.35;c.strokeStyle='#ffffff';c.lineWidth=1;c.setLineDash?.([3,4]);c.beginPath();c.arc(x,y,GARDEN_BED_R*(1+(near?.06*glow:0)),0,6.283);c.stroke();c.setLineDash?.([]);
   if(b.stage>0){const left=Math.max(0,1-(now-b.care)/limit),low=left<.25;c.globalAlpha=low&&!still?.5+.5*Math.sin(now/120):.7;c.strokeStyle=low?'#ffffff':gold;c.lineWidth=2;c.beginPath();c.arc(x,y,GARDEN_BED_R+5,-Math.PI/2,-Math.PI/2+left*6.283);c.stroke();plant(c,x,y,b.stage,glow,still,t);}});
  for(const g of glows){const k=(now-g.at)/700;if(k>1)continue;c.globalAlpha=.8*(1-k);c.strokeStyle=g.kind==='bloom'||g.kind==='pick'?gold:'#ffffff';c.lineWidth=2;c.beginPath();c.arc(sx(g.x),sy(g.y),8+k*26,0,6.283);c.stroke();}
  if(s.tree&&!s.opened){const gx=sx(s.tree.x),gy=sy(s.tree.y),breath=still?0:Math.sin(t/700)*3+treePulse*Math.sin(t/40)*5;treePulse=Math.max(0,treePulse-.02);
   c.globalAlpha=.25+.35*glow;c.fillStyle=gold;c.beginPath();c.arc(gx,gy-8,30+breath+6*glow,0,6.283);c.fill();c.globalAlpha=.95;c.strokeStyle=c.fillStyle=gold;c.lineWidth=2.5;
   c.beginPath();c.moveTo(gx,gy+18);c.lineTo(gx,gy-6);for(const [a,l] of [[-.7,14],[.7,14],[-1.4,10],[1.4,10]]){c.moveTo(gx,gy-2-Math.abs(a)*4);c.lineTo(gx+Math.sin(a)*l,gy-2-Math.abs(a)*4-Math.cos(a)*l);}c.stroke();
   for(let k=0;k<7;k++){const a=-Math.PI/2+(k-3)*.45,r=18+breath*.5;c.beginPath();c.arc(gx+Math.cos(a)*r,gy-8+Math.sin(a)*r*.8,3.5,0,6.283);c.fill();}}
  c.restore();}
 function over(c,W,H){if(!active())return;const now=performance.now(),gold=runtime.GOLD||'#f0d27a',cam=worldCamera(runtime),cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y);c.save();
  if(shiver>0&&!calm()){c.globalAlpha=.5*shiver;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.arc(cx+Math.sin(now/25)*2,cy,16,0,6.283);c.stroke();shiver=Math.max(0,shiver-.05);}
  const left=16,right=W-16,barY=42;
  for(let i=toBar.length-1;i>=0;i--){const d=toBar[i],k=(now-d.at)/450;if(k<0)continue;if(k>=1){toBar.splice(i,1);continue;}const tx=left+(right-left)*gardenProgress(d.from+d.value,goal()),e=1-(1-k)*(1-k),z=2+Math.min(6,d.value/2);
   c.globalAlpha=1-k*.3;c.fillStyle=gold;c.fillRect(Math.round(cx+(tx-cx)*e-z/2),Math.round(cy+(barY-cy)*e-z/2),Math.round(z),Math.round(z));}
  c.restore();}
 runtime.registerJourneyGame?.('jardin',{pulse,under,over,progress:()=>gardenProgress(own().points,goal())});
 Object.defineProperties(runtime,{journeyGarden:{get:()=>()=>{const s=own();return {active:active(),points:s.points,goal:goal(),progress:gardenProgress(s.points,goal()),center:{...s.center},beds:s.beds.map(b=>({...b})),spots:bedSpots(s.center),blooms:s.blooms,misses,tree:s.tree?{...s.tree}:null,opened:s.opened};}}});
}
