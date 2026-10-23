import {hashKey} from './universe-regions.js';
import {calmMotion} from './frame-state.js';
import {beatGlow,worldCamera,sayOnce,chapterToast} from './journey-games.js';
// «Eco» (the Cueva, plan F17, docs/MUNDO.md): the cave sings a pattern for one bar and you sing it back the next. Eight
// sockets under the cube are the eighths of the bar: while the cave sings, its steps light up as they sound; while you
// answer, they wait for you. Every step on time and none extra is an echo: it fills the bar and the next pattern is one
// step longer (two to five). A wrong answer still counts its right steps a little and makes the next one shorter. With the bar full a gold drop comes and
// one pulse on time catches it. Off time, nothing. The music's sequencer drives the calls (audio.js calls
// echoMusicStep on every sixteenth), so the cave always sings on the beat it plays.
export const ECHO_GOAL=250,ECHO_MIN=2,ECHO_MAX=5,ECHO_GOLD_GAP=70;
export const echoValue=len=>6+2*len;
export const echoProgress=(points,goal=ECHO_GOAL)=>Math.max(0,Math.min(1,points/goal));
// The nth pattern: `len` different eighths of the bar, from hashes; it always starts on the «1» so it can be followed.
export function echoPattern(n,len){const all=[2,4,6,8,10,12,14].sort((a,b)=>hashKey('echo:'+n+':'+a)-hashKey('echo:'+n+':'+b));return [0,...all.slice(0,Math.max(0,Math.min(ECHO_MAX,len)-1))].sort((a,b)=>a-b);}
// An answer is an echo when it has every step of the pattern and nothing else.
export function echoJudge(pattern,steps){const got=new Set(steps);return pattern.every(s=>got.has(s))&&[...got].every(s=>pattern.includes(s));}
export function normalizeEcho(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{},pt=v=>v&&Number.isFinite(v.x)&&Number.isFinite(v.y)?{x:Math.round(v.x),y:Math.round(v.y)}:null;
 return {points:Number.isFinite(q.points)?Math.max(0,q.points):0,n:Number.isInteger(q.n)?Math.max(0,q.n):0,len:Number.isInteger(q.len)?Math.max(ECHO_MIN,Math.min(ECHO_MAX,q.len)):ECHO_MIN,echoes:Number.isInteger(q.echoes)?Math.max(0,q.echoes):0,best:Number.isInteger(q.best)?Math.max(0,q.best):0,gold:pt(q.gold),opened:q.opened===true,hinted:q.hinted===true};}
// The answer bar ends: an echo scores four a step and lengthens the next pattern; anything else scores two for each
// right step and shortens it. Pure.
export function echoClose(state,steps,{goal=ECHO_GOAL}={}){const pattern=echoPattern(state.n,state.len),ok=echoJudge(pattern,steps),right=steps.filter(x=>pattern.includes(x)).length,gained=ok?echoValue(state.len):2*right;
 if(ok){state.echoes++;state.best=Math.max(state.best,state.len);state.len=Math.min(ECHO_MAX,state.len+1);}else if(steps.length)state.len=Math.max(ECHO_MIN,state.len-1);
 state.n++;state.points=Math.min(goal,state.points+gained);return {ok,gained,pattern,answered:steps.length>0};}
export function initialize(runtime){
 const goal=()=>ECHO_GOAL*(runtime.placeGoalScale?.()||1);
 let owner=null,state=null,misses=0,shiver=0,goldPulse=0,phase=null;const sung=[],glows=[],toBar=[];
 // phase: {kind:'call'|'answer', start, end, pattern, steps} on the audio clock; the call is sung, the answer heard.
 const calm=()=>calmMotion(runtime.S);
 function own(){const j=runtime.S.journey||(runtime.S.journey={});if(owner!==runtime.S||j.echo!==state){owner=runtime.S;j.echo=normalizeEcho(j.echo);state=j.echo;phase=null;sung.length=0;glows.length=0;toBar.length=0;}return state;}
 const active=()=>!!runtime.journeyGamePlaying?.('cueva');
 const audible=()=>runtime.S.sound&&runtime.ac&&runtime.bus;
 const full=()=>own().points>=goal();
 const six=()=>runtime.SIX||.125;
 const heard=()=>{const ac=runtime.ac;return ac?ac.currentTime-(ac.outputLatency||ac.baseLatency||0):0;};
 function voice(step,t,soft=false){if(!audible())return;const ct=runtime.chordTones?.()||[60,64,67];let m=ct[(step/2)%ct.length]+12+(step>=8?12:0);while(m>88)m-=12;runtime.pluck?.(m,t,soft?.05:.09,2);if(!soft)runtime.pluck?.(m,t+six()*3,.035,2);}
 function arrive(){const s=own();if(s.gold)return;s.gold={x:Math.round(runtime.S.wx+ECHO_GOLD_GAP),y:Math.round(runtime.S.wy-ECHO_GOLD_GAP*.5)};goldPulse=1;runtime.save?.();chapterToast(runtime,'cueva','Cae una gota dorada: atrápala a tiempo.');}
 function open(){const s=own();if(s.opened)return 'done';s.opened=true;if(runtime.save?.()===false){s.opened=false;return null;}runtime.enterFx=1;runtime.flash=1;runtime.soon?.(t=>{for(let i=0;i<4;i++)voice(i*2,t+i*six()*2);},'player');runtime.journeyComplete?.('cueva');return 'open';}
 // On every sixteenth of the music: a bar starts a call or an answer; inside a call, the cave sings its steps.
 function step(s,t){if(!active()){phase=null;return;}const st=own();if(full()){phase=null;return;}const bar=six()*16;
  if(s===0){if(phase?.kind==='answer'){const before=st.points,r=echoClose(st,phase.steps,{goal:goal()});glows.push({at:performance.now()+Math.max(0,(t-(runtime.ac?.currentTime||t))*1000),kind:r.ok?'echo':r.answered?'wrong':'none',len:r.pattern.length});if(glows.length>12)glows.shift();
    if(r.gained){toBar.push({value:r.gained,from:before,at:performance.now()+150});runtime.save?.();}if(before<goal()&&st.points>=goal())arrive();
    phase=full()?null:{kind:'call',start:t,end:t+bar,pattern:echoPattern(st.n,st.len),steps:[]};}
   else if(phase?.kind==='call')phase={kind:'answer',start:t,end:t+bar,pattern:phase.pattern,steps:[]};
   else phase={kind:'call',start:t,end:t+bar,pattern:echoPattern(st.n,st.len),steps:[]};}
  if(phase?.kind==='call'&&t>=phase.start-1e-3&&phase.pattern.includes(s)){voice(s,t);sung.push({step:s,at:t});if(sung.length>12)sung.shift();}}
 // A pulse on time inside the answer bar answers its step; one in the call bar is simply early.
 function pulse(on,beat={}){if(!active())return null;const s=own();if(!on){misses++;shiver=1;return 'miss';}if(full()){if(!s.gold)arrive();return open();}
  if(beat.silent){const before=s.points;s.points=Math.min(goal(),s.points+2);toBar.push({value:2,from:before,at:performance.now()+150});if(before<goal()&&s.points>=goal())arrive();return 'echo';}
  const h=heard();if(!phase||phase.kind!=='answer'||h<phase.start-.1||h>phase.end+.1||!Number.isFinite(beat.step))return 'wait';
  if(!phase.steps.includes(beat.step))phase.steps.push(beat.step);runtime.soon?.(t=>voice(beat.step,t,true),'player');return phase.pattern.includes(beat.step)?'answer':'wrong';}
 function tick(){const s=own();if(full()&&!s.gold)arrive();
  if(s.gold){const dx=runtime.S.wx+ECHO_GOLD_GAP-s.gold.x,dy=runtime.S.wy-ECHO_GOLD_GAP*.5-s.gold.y;if(Math.hypot(dx,dy)>4){s.gold.x+=dx*.08;s.gold.y+=dy*.08;}}
  const MU=runtime.MU,p=echoProgress(s.points,goal());if(MU&&p>0){MU.journeyFloor=Math.max(MU.journeyFloor||0,.2+.6*p);if(MU.journeyCap!=null)MU.journeyCap=Math.max(MU.journeyCap,.4+.6*p);}}
 function under(c,W,H,t){if(!active())return;const s=own();sayOnce(runtime,s,'hinted','Escucha lo que canta la cueva. Repítelo.','cueva');tick();
  const still=calm(),cam=worldCamera(runtime),glow=beatGlow(runtime),gold=runtime.GOLD||'#f0d27a',red='#ff4f3a',cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y),h=heard(),now=performance.now();
  c.save();c.globalAlpha=.5;c.fillStyle='#000';c.fillRect(0,0,W,H);
  // The cave's voice above the cube: a red drop that rings while it sings, gold rings when you echo it.
  const vy=cy-70,singing=phase?.kind==='call';c.globalAlpha=singing?.9:.45;c.fillStyle=red;c.beginPath();c.moveTo(cx,vy-12);c.quadraticCurveTo(cx+9,vy+2,cx,vy+8);c.quadraticCurveTo(cx-9,vy+2,cx,vy-12);c.fill();
  for(const q of sung){const k=(h-q.at)/(six()*6);if(k<0||k>1)continue;c.globalAlpha=.7*(1-k);c.strokeStyle=red;c.lineWidth=1.5;c.beginPath();c.arc(cx,vy,10+(still?6:k*30),0,6.283);c.stroke();}
  // The eight sockets: in the call its steps light red as they sound; in the answer they wait, gold when you hit them.
  const y=cy+40,x0=cx-42;for(let i=0;i<8;i++){const st=i*2,x=x0+i*12,inPat=phase?.pattern?.includes(st),cur=phase&&h>=phase.start&&h<phase.end&&Math.floor((h-phase.start)/(six()*2))===i;
   let fill=null,alpha=.25;if(phase?.kind==='call'&&inPat){const done=h>=phase.start+st*six()-.02;fill=done?red:null;alpha=done?.95:.5;}
   if(phase?.kind==='answer'){const hit=phase.steps.includes(st);if(hit){fill=inPat?gold:'#ffffff';alpha=1;}else alpha=inPat?.75:.25;}
   const z=i%2===0?8:6;c.globalAlpha=alpha;c.strokeStyle=phase?.kind==='answer'&&inPat?gold:'#ffffff';c.lineWidth=cur?2:1;c.strokeRect(Math.round(x-z/2)+.5,Math.round(y-z/2)+.5,z,z);if(fill){c.fillStyle=fill;c.fillRect(Math.round(x-z/2)+1,Math.round(y-z/2)+1,z-1,z-1);}}
  // Below: the length of the pattern, two to five small drops.
  for(let k=0;k<ECHO_MAX;k++){c.globalAlpha=k<s.len?.85:.2;c.fillStyle=k<s.len?red:'#ffffff';c.fillRect(Math.round(cx-ECHO_MAX*4+k*8+2),Math.round(y+12),4,4);}
  for(const g of glows){const k=(now-g.at)/800;if(k<0||k>1)continue;c.globalAlpha=.85*(1-k);c.strokeStyle=g.kind==='echo'?gold:'#ffffff';c.lineWidth=g.kind==='echo'?2.5:1;c.beginPath();c.arc(cx,cy,18+k*(g.kind==='echo'?48:20),0,6.283);c.stroke();}
  if(s.gold&&!s.opened){const gx=W/2+(s.gold.x-cam.x),gy=H/2+(s.gold.y-cam.y),breath=still?0:Math.sin(t/700)*3+goldPulse*Math.sin(t/40)*5;goldPulse=Math.max(0,goldPulse-.02);
   c.globalAlpha=.25+.35*glow;c.fillStyle=gold;c.beginPath();c.arc(gx,gy,30+breath+6*glow,0,6.283);c.fill();c.globalAlpha=1;c.beginPath();c.moveTo(gx,gy-18);c.quadraticCurveTo(gx+13,gy+3,gx,gy+12);c.quadraticCurveTo(gx-13,gy+3,gx,gy-18);c.fill();}
  c.restore();}
 function over(c,W,H){if(!active())return;const now=performance.now(),gold=runtime.GOLD||'#f0d27a',cam=worldCamera(runtime),cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y);c.save();
  if(shiver>0&&!calm()){c.globalAlpha=.5*shiver;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.arc(cx+Math.sin(now/25)*2,cy,16,0,6.283);c.stroke();shiver=Math.max(0,shiver-.05);}
  const left=16,right=W-16,barY=42;
  for(let i=toBar.length-1;i>=0;i--){const d=toBar[i],k=(now-d.at)/450;if(k<0)continue;if(k>=1){toBar.splice(i,1);continue;}const tx=left+(right-left)*echoProgress(d.from+d.value,goal()),e=1-(1-k)*(1-k),z=2+Math.min(6,d.value/2);
   c.globalAlpha=1-k*.3;c.fillStyle=gold;c.fillRect(Math.round(cx+(tx-cx)*e-z/2),Math.round(cy+(barY-cy)*e-z/2),Math.round(z),Math.round(z));}
  c.restore();}
 runtime.registerJourneyGame?.('cueva',{pulse,under,over,progress:()=>echoProgress(own().points,goal())});
 Object.defineProperties(runtime,{echoMusicStep:{get:()=>step},journeyEcho:{get:()=>()=>{const s=own();return {active:active(),points:s.points,goal:goal(),progress:echoProgress(s.points,goal()),len:s.len,n:s.n,echoes:s.echoes,best:s.best,phase:phase?{kind:phase.kind,start:phase.start,end:phase.end,pattern:[...phase.pattern],steps:[...phase.steps]}:null,misses,gold:s.gold?{...s.gold}:null,opened:s.opened};}}});
}
