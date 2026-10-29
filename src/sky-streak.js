// Racha suave (Jay, 29 Oct 2026, alpha.236, «Ganas de volver»): each real day you play lights one star in the sky of the
// Refugio. Days in a row join their stars with a thread; missing a day takes nothing away: the lit stars stay, the old
// thread stays drawn, and the next day simply starts a new one. No sparks (what is special never pays ✦), no sad words.
// Built on the day counter that was already there (progress.js: S.lastDay, S.streak, S.totalDays, decision 5A): a day
// counts once onFirstLight has marked it played. Pure helpers first; no random sequence (hashKey only).
import {hashKey} from './universe-regions.js';
export const SKY_STREAK_VERSION=1;
// Milestones written in the Bitácora: days in a row, and stars lit in all.
export const RUN_MARKS=Object.freeze([3,7,14,30,60,100,365]),TOTAL_MARKS=Object.freeze([10,30,100,365]);
// Old threads kept one by one; older ones fold into the loose stars (still lit, without their thread).
export const KEEP_RUNS=400;
const object=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const count=v=>Number.isSafeInteger(v)&&v>0?v:0;
const dayOk=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v);
export function diffDays(a,b){const p=s=>{const [y,m,d]=s.split('-').map(Number);return Date.UTC(y,m-1,d);};return Math.round((p(b)-p(a))/864e5);}
// The saved sky. A save from before alpha.236 starts with every day it already played lit (S.totalDays): the current
// days in a row (S.streak) on their thread, the rest loose. Unknown fields are kept; a future version is never rewritten.
export function normalizeSkyStreak(raw,state={}){
 if(object(raw)&&Number.isInteger(raw.version)&&raw.version>SKY_STREAK_VERSION)return raw;
 if(!object(raw)){const total=count(state.totalDays),last=dayOk(state.lastDay)?state.lastDay:null,run=last?Math.min(total,count(state.streak)):0;
  return {version:SKY_STREAK_VERSION,loose:total-run,runs:[],run,best:Math.max(run,Math.min(total,count(state.best))),lastDay:last,marks:{}};}
 const runs=Array.isArray(raw.runs)?raw.runs.filter(n=>count(n)>0):[],last=dayOk(raw.lastDay)?raw.lastDay:null,run=last?count(raw.run):0;
 let loose=count(raw.loose);while(runs.length>KEEP_RUNS)loose+=runs.shift();
 const marks=object(raw.marks)?Object.fromEntries(Object.entries(raw.marks).filter(([k,v])=>/^(run|total):\d+$/.test(k)&&dayOk(v))):{};
 return {...raw,version:SKY_STREAK_VERSION,loose,runs,run,best:Math.max(count(raw.best),run,...runs),lastDay:last,marks};}
export const skyFuture=sky=>object(sky)&&Number.isInteger(sky.version)&&sky.version>SKY_STREAK_VERSION;
// Stars lit in all: every day played, in or out of a run.
export const skyLit=sky=>skyFuture(sky)?0:count(sky?.loose)+(sky?.runs||[]).reduce((a,n)=>a+count(n),0)+count(sky?.run);
// Days in a row as of today: the run while it is alive (played today or yesterday), else 0. Never a loss: just no number.
export function aliveRun(sky,today){if(skyFuture(sky)||!sky?.lastDay||!dayOk(today))return 0;const d=diffDays(sky.lastDay,today);return d>=0&&d<=1?count(sky.run):0;}
// One played day. The same day twice, or a clock gone back, changes nothing. Returns the milestones reached now.
export function recordDay(sky,day){if(skyFuture(sky)||!dayOk(day))return [];if(sky.lastDay){const d=diffDays(sky.lastDay,day);if(d<=0)return [];
  if(d===1)sky.run=count(sky.run)+1;else{if(count(sky.run))sky.runs.push(sky.run);while(sky.runs.length>KEEP_RUNS)sky.loose=count(sky.loose)+sky.runs.shift();sky.run=1;}}
 else{if(count(sky.run))sky.runs.push(sky.run);sky.run=1;}
 sky.lastDay=day;sky.best=Math.max(count(sky.best),sky.run);const lit=skyLit(sky),now=[];sky.marks=object(sky.marks)?sky.marks:{};
 for(const n of RUN_MARKS)if(sky.run>=n&&!sky.marks['run:'+n]){sky.marks['run:'+n]=day;now.push('run:'+n);}
 for(const n of TOTAL_MARKS)if(lit>=n&&!sky.marks['total:'+n]){sky.marks['total:'+n]=day;now.push('total:'+n);}
 return now;}
export const markText=id=>{const [kind,n]=String(id).split(':');return kind==='run'?`${n} días seguidos`:n+' estrellas';};
// The line under the sky: always what is true now, never what was lost.
export function skyCaption(sky,today){const lit=skyLit(sky),run=aliveRun(sky,today);if(!lit)return 'Juega hoy y se enciende una estrella.';
 const hito=sky.lastDay===today?Object.entries(sky.marks||{}).filter(([,d])=>d===today).map(([k])=>k).sort((a,b)=>a.localeCompare(b)).at(-1):null;
 if(hito)return 'Hito: '+markText(hito);
 return (lit===1?'1 estrella':lit+' estrellas')+(run>=2?` · ${run} días seguidos`:'');}
export const SKY_TAP='Cada día que juegas enciende una estrella. Si faltas, se quedan.';
// Where each star goes in a strip of the screen: one per played day, in order, left to right and row by row; the
// latest rows stay in view. A thread joins the days of one run inside a row. Positions depend only on the star's
// number, so tomorrow's star never moves today's.
export function skyLayout(sky,{x=0,y=0,w=300,h=60,cell=14,row=18}={}){
 const cols=Math.max(8,Math.min(40,Math.floor(w/cell))),rows=Math.max(1,Math.floor(h/row)),lit=skyLit(sky);
 if(!lit||w<40||h<8)return {cols,rows,stars:[],lines:[],hidden:lit};
 // Which run each star belongs to: loose stars have none (-1); the current run is the last.
 const owners=[];for(let i=0;i<count(sky.loose);i++)owners.push(-1);(sky.runs||[]).forEach((n,r)=>{for(let i=0;i<n;i++)owners.push(r);});for(let i=0;i<count(sky.run);i++)owners.push((sky.runs||[]).length);
 const firstRow=Math.max(0,Math.floor((lit-1)/cols)-rows+1),start=firstRow*cols,stars=[],lines=[];
 for(let i=start;i<lit;i++){const col=i%cols,r=Math.floor(i/cols)-firstRow,jx=(hashKey('refugio:cielo:v1:x:'+i)-.5)*.5,jy=(hashKey('refugio:cielo:v1:y:'+i)-.5)*.6;
  stars.push({i,x:x+(col+.5+jx)/cols*w,y:y+(r+.5+jy)/rows*h,run:owners[i],current:owners[i]===(sky.runs||[]).length&&count(sky.run)>0,newest:i===lit-1});}
 for(let k=1;k<stars.length;k++){const a=stars[k-1],b=stars[k];if(a.run>=0&&a.run===b.run&&Math.floor(a.i/cols)===Math.floor(b.i/cols))lines.push({x0:a.x,y0:a.y,x1:b.x,y1:b.y,current:b.current});}
 return {cols,rows,stars,lines,hidden:start};}
// The Bitácora's card: stars, the longest run and the milestones with their day.
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function skyDate(day){try{const [y,m,d]=day.split('-').map(Number);return new Intl.DateTimeFormat('es',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(Date.UTC(y,m-1,d))).replace('.','');}catch(_){return day;}}
export function skyCard(sky){if(skyFuture(sky))return '';const lit=skyLit(sky);if(!lit)return '';
 const marks=Object.entries(sky.marks||{}).sort((a,b)=>a[1].localeCompare(b[1])||a[0].localeCompare(b[0])).map(([k,d])=>skyDate(d)+' · '+markText(k));
 return `<article class="journal-card" data-sky-streak><h3>Cielo del Refugio</h3><p>${escape((lit===1?'1 estrella':lit+' estrellas')+' · '+(sky.best===1?'la racha más larga, 1 día':`la racha más larga, ${sky.best} días`))}</p>${marks.length?`<p>Hitos</p>${marks.map(m=>`<p>${escape(m)}</p>`).join('')}`:''}</article>`;}
export function initialize(runtime){
 let owner=null,sky=null,hits=null,last=0;
 function own(){const S=runtime.S;if(owner!==S||S.skyStreak!==sky){owner=S;S.skyStreak=normalizeSkyStreak(S.skyStreak,S);sky=S.skyStreak;}return sky;}
 // A played day (onFirstLight marked it: S.lastDay is today) lights its star once. If the save fails, nothing changes.
 function tick(){const S=runtime.S,s=own();if(skyFuture(s)||!dayOk(S.lastDay)||S.lastDay!==S.todayKey||s.lastDay===S.lastDay)return [];
  const before=structuredClone(s),got=recordDay(s,S.lastDay);if(runtime.save?.()===false){S.skyStreak=before;sky=before;return [];}return got;}
 // Drawn by the Refugio in the free sky above the house: small white stars, the current thread a little brighter, today's
 // star breathing (still in calm motion). The caption is measured and kept clear of the Voz.
 // Where: the free sky above the house (a phone); with no room there, the sky beside the Cielo (a wide screen).
 function draw(c,{toScreen,k,t,calm,note,view,visit}){hits=null;if(visit)return;const s=own();if(skyFuture(s))return;
  const a=toScreen(0,0),z=toScreen(1000,0),floor=toScreen(0,240).y,top=view.top+6;
  const above={x:Math.max(view.left+16,a.x+14),y:top,r:Math.min(view.right-16,z.x-14),b:a.y-12},side={x:z.x+24,y:Math.max(top,a.y),r:view.right-16,b:Math.min(view.bottom-8,floor)};
  const fits=(q,w,h)=>q.r-q.x>=w&&q.b-q.y>=h,box=fits(above,120,34)?above:fits(side,140,34)?side:fits(above,120,14)?above:null;if(!box)return;
  c.save();c.font='10px "Geist Mono", monospace';c.letterSpacing='1px';c.textAlign='left';
  const text=skyCaption(s,runtime.S.todayKey),tw=c.measureText(text).width,left=box.x,right=box.r,bottom=box.b,btop=box.y;
  const voice=runtime.$?.('voice'),vr=voice&&!voice.hidden&&voice.classList.contains('on')?voice.getBoundingClientRect():null;
  const room=bottom-btop>=34,cap={x:left,y:btop+11,w:tw,h:12},clear=r=>!vr||!(r.x<vr.right&&vr.left<r.x+r.w&&r.y-r.h<vr.bottom&&vr.top<r.y+2);
  let area={x:left,y:room?btop+18:btop,w:right-left,h:room?bottom-btop-18:bottom-btop};
  if(!room){area={x:left+tw+14,y:btop,w:right-left-tw-14,h:bottom-btop};}
  if(tw<=right-left&&clear(cap)){c.fillStyle='#ffffffb3';c.fillText(text,cap.x,cap.y);note?.(c,text,cap.x,cap.y);}
  else if(!room)area={x:left,y:btop,w:right-left,h:bottom-btop};
  const lay=skyLayout(s,{...area,h:Math.min(area.h,96)});c.letterSpacing='0px';
  c.strokeStyle='#ffffff';c.lineWidth=1;for(const l of lay.lines){c.globalAlpha=l.current?.45:.2;c.beginPath();c.moveTo(l.x0,l.y0);c.lineTo(l.x1,l.y1);c.stroke();}
  c.fillStyle='#ffffff';for(const p of lay.stars){const z=p.newest&&s.lastDay===runtime.S.todayKey?3:2;c.globalAlpha=p.newest&&!calm?.6+.4*Math.abs(Math.sin(t/700)):p.current?.95:.6;c.fillRect(Math.round(p.x-z/2),Math.round(p.y-z/2),z,z);}
  c.restore();hits={x:left,y:btop,w:right-left,h:bottom-btop};}
 function look(px,py){return hits&&px>=hits.x&&px<=hits.x+hits.w&&py>=hits.y&&py<=hits.y+hits.h?SKY_TAP:null;}
 Object.defineProperties(runtime,{skyStreakTick:{get:()=>tick},drawRefugioSky:{get:()=>draw},refugioSkyLook:{get:()=>look},skyStreakCard:{get:()=>()=>skyCard(own())},skyStreakState:{get:()=>()=>{const s=own();return {lit:skyLit(s),run:aliveRun(s,runtime.S.todayKey),best:s.best,lastDay:s.lastDay,marks:{...(s.marks||{})},caption:skyCaption(s,runtime.S.todayKey),hits};}}});
 own();setInterval(()=>{const now=Date.now();if(now-last<900)return;last=now;try{tick();}catch(_){}},1000);
}
