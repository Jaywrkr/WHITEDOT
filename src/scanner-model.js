// El Escáner (coherencia T1, Jay, 4 Nov 2026; docs/MUNDO.md#el-escáner). What is near the cube, as one registry. The
// model only: no page, canvas, sound or save writes. The runtime (scanner.js) draws the wave and the «Cerca» panel.
// · registerScan({id, name, shape, level, km, rarity, secret, batch, sites, done, page}) — once per kind of thing, at
//   load. Registering the same id twice throws. sites(p, reach, S, ctx) gives the things within reach of p:
//   [{key, x, y, name?, kind?, hint?}], from the thing's own generator or from hashKey (scanSiteAt), never from the old
//   random sequence. done(S, site, ctx): already found (drawn dim). page(S, ctx): its line for the Bitácora (later).
// · scanLevel(S, {charged}): the level the save has opened. 1 from the start (short wave, shapes without names); 2 after
//   the Journey or the first trophy (names and distance). 3 (the eleven places, S.lugares.won) and 4a/4b/4c (S.bandas.far ≥ 10/30/60 km)
//   are written here so later batches only add; SCAN_OPEN keeps the rest closed until then. charged = 4c (the boxes, T3).
//   T2 opens level 3: arrows at the screen's edge (scanner-arrows.js), secrets and rumours as «?», a row marks the map.
// · scanReach(level) in units (10 per metre), scanNear(p, S, {level, ctx, max, minRarity}) in order: rarity, then
//   distance, then not found first (a secret entry is named «?»); scanPage(S, ctx) lists what is registered for the
//   Bitácora.
// · scanBandEntry(band, opts): the hook for registerBand (bandas-model.js): a band's thing registered at level 4 by its
//   km. Not called yet (FINAL.md T2/T4).
import {hashKey} from './universe-regions.js';
import {ICON_KINDS,iconKind} from './scan-icons.js';
export const UNITS_PER_M=10;
// The ladder. reach in metres; names: the panel and the wave say what each thing is; arrows: edge marks (from level 3).
export const SCAN_LEVELS=Object.freeze([
 Object.freeze({id:'1',rank:1,level:1,reach:40,names:false,arrows:0,km:0,wave:.9}),
 Object.freeze({id:'2',rank:2,level:2,reach:120,names:true,arrows:0,km:0,wave:1.3}),
 Object.freeze({id:'3',rank:3,level:3,reach:300,names:true,arrows:3,km:0,wave:1.4}),
 Object.freeze({id:'4a',rank:4,level:4,reach:600,names:true,arrows:3,km:10,wave:1.6}),
 Object.freeze({id:'4b',rank:5,level:4,reach:900,names:true,arrows:3,km:30,wave:1.8}),
 Object.freeze({id:'4c',rank:6,level:4,reach:1200,names:true,arrows:3,km:60,wave:2})
]);
// The highest rank a save can reach today: 3 (levels 1 to 3, coherencia T2). Later batches raise it.
export const SCAN_OPEN=3;
export const SCAN_ROWS=3;
// Escáner NMS (alpha.263): a shape is a kind of the one icon table (scan-icons.js); old words (portal, estrella,
// pregunta) are read as their kinds.
export const SCAN_SHAPES=ICON_KINDS;
const ID=/^[a-z][a-z0-9-]{0,31}$/;
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const registry=new Map();
export function registerScan(entry){
 if(!plain(entry)||!ID.test(entry.id)||typeof entry.name!=='string'||!entry.name||typeof entry.sites!=='function')throw Error('Invalid scan entry');
 if(registry.has(entry.id))throw Error('Scan entry registered twice: '+entry.id);
 const level=Number.isInteger(entry.level)&&entry.level>=1&&entry.level<=4?entry.level:1;
 const e=Object.freeze({id:entry.id,name:entry.name,shape:iconKind(entry.shape),level,
  km:Number.isFinite(entry.km)&&entry.km>=0?entry.km:0,rarity:Number.isFinite(entry.rarity)?Math.max(0,Math.min(3,entry.rarity)):0,
  secret:entry.secret===true,batch:typeof entry.batch==='string'?entry.batch:'',sites:entry.sites,
  done:typeof entry.done==='function'?entry.done:null,page:typeof entry.page==='function'?entry.page:null,
  // A secret kind is «?» until known(S) says you have found one of its kind; then it shows its own icon and name.
  known:typeof entry.known==='function'?entry.known:null});
 registry.set(e.id,e);return e;}
export const scanEntries=()=>[...registry.values()];
export const scanEntry=id=>registry.get(id)||null;
// Tests only: forget an entry (the game never unregisters).
export const unregisterScan=id=>registry.delete(id);
// ---------- levels ----------
const journeyDone=j=>!!(plain(j)&&(j.free===true||j.finished===true));
// A World given at the start (alpha.269, journey-mode.js `freeGiven`), not earned by the Journey.
const freeGiven=j=>plain(j)&&j.freeGiven===true;
const farKm=S=>{const f=Number(S?.bandas?.far);return Number.isFinite(f)&&f>0?f:0;};
// «Los lugares te encuentran» (Jay, 5 Nov 2026, alpha.264): each trophy (a place complete, its ★) upgrades the radar.
// After the Journey: level 2 (names) from the start, level 3 (arrows, «?») from five trophies, and the reach grows with
// every trophy (TROPHY_REACH, metres, by trophies). «Directo mundo abierto» (alpha.269): a World given at the start
// begins at level 1, the weakest; the first trophy (TROPHY_LEVEL2) gives level 2. The eleven (or S.lugares.won) keep level 3 at 300 m, as before, and
// level 4 still waits for the eleven and the km. A save that had its level keeps it: nothing goes down.
export const TROPHY_IDS=Object.freeze(['llanura','lago','bosque','tormenta','vacio','jardin','dunas','cristales','faros','ruinas','cueva']);
export const TROPHY_LEVEL2=1,TROPHY_LEVEL3=5;
export const TROPHY_REACH=Object.freeze([120,120,140,160,180,200,215,230,250,265,280,300]);
// Trophies in a save: places with their ★ (S.lugares.stars) and chapters kept in the Journey, each once.
export function scanTrophies(S){const stars=S?.lugares?.stars,done=S?.journey?.done;let n=0;
 for(const id of TROPHY_IDS)if(stars?.[id]?.[0]===true||done?.[id]===true)n++;return n;}
// The rank the save has earned, before SCAN_OPEN caps it.
export function scanEarned(S){
 const t=scanTrophies(S);if(!journeyDone(S?.journey)||freeGiven(S?.journey)&&t<TROPHY_LEVEL2)return 1;let rank=2;const eleven=S?.lugares?.won===true||t>=TROPHY_IDS.length;
 if(eleven||t>=TROPHY_LEVEL3)rank=3;
 if(eleven)for(const L of SCAN_LEVELS)if(L.level===4&&farKm(S)>=L.km)rank=Math.max(rank,L.rank);
 return rank;}
// The radar's reach for a save at levels 2 and 3, in metres (trophies); other levels keep their own.
export function trophyReach(S,L){if(L.level!==2&&L.level!==3)return L.reach;const t=S?.lugares?.won===true?TROPHY_IDS.length:scanTrophies(S);
 return L.level===2?Math.min(TROPHY_REACH[Math.min(t,TROPHY_LEVEL3-1)],TROPHY_REACH[TROPHY_LEVEL3]-1):Math.max(TROPHY_REACH[TROPHY_LEVEL3],TROPHY_REACH[Math.min(t,TROPHY_IDS.length)]);}
export function scanLevel(S,{charged=false,open=SCAN_OPEN}={}){
 const rank=charged?SCAN_LEVELS.length:Math.min(scanEarned(S),Math.max(1,open|0)),L=SCAN_LEVELS[Math.max(0,Math.min(SCAN_LEVELS.length,rank)-1)];
 if(charged)return L;const reach=trophyReach(S,L);return reach===L.reach?L:Object.freeze({...L,reach,trophies:scanTrophies(S)});}
const levelOf=level=>typeof level==='object'&&level?level:SCAN_LEVELS.find(L=>L.id===String(level)||L.rank===level)||SCAN_LEVELS[0];
export const scanReach=level=>levelOf(level).reach*UNITS_PER_M;
// An entry is in reach of a level when the level is as high, and a level-4 entry when its km is reached.
// A band's thing belongs to the tier of the last step of the ladder it starts after (25 km: tanda B, 4a).
const tierKm=km=>[60,30,10].find(k=>km>=k)||0;
export function scanVisible(entry,level){const L=levelOf(level);if(!entry)return false;if(entry.level<4)return entry.level<=L.level;return L.level===4&&tierKm(entry.km)<=L.km;}
// ---------- what is near ----------
const finite=v=>Number.isFinite(v);
// «8 m», «120 m», «1,2 km»: how the scanner writes a distance in units (10 per metre).
export function scanDistance(units){const m=Math.max(0,Number(units)||0)/UNITS_PER_M;
 if(m<100)return `${Math.max(1,Math.round(m))} m`;if(m<1000)return `${Math.round(m/10)*10} m`;
 return `${String(Math.round(m/100)/10).replace('.',',')} km`;}
export function scanNear(p,S,{level=scanLevel(S),ctx=null,max=SCAN_ROWS,reach=null,minRarity=0}={}){
 const L=levelOf(level),R=finite(reach)?reach:scanReach(L),out=[],seen=new Set();
 if(!p||!finite(p.x)||!finite(p.y))return out;
 for(const e of registry.values()){
  if(!scanVisible(e,L)||e.rarity<minRarity)continue;let sites;
  try{sites=e.sites(p,R,S,ctx)||[];}catch(_){continue;}
  for(const s of sites){
   if(!s||!finite(s.x)||!finite(s.y))continue;const d=Math.hypot(s.x-p.x,s.y-p.y);if(d>R)continue;
   const key=e.id+':'+(s.key??`${Math.round(s.x)},${Math.round(s.y)}`);if(seen.has(key))continue;seen.add(key);
   let done=false;try{done=!!e.done?.(S,s,ctx);}catch(_){done=false;}
   const ask=e.secret&&!done&&!kindKnown(e,S,ctx);
   out.push({id:e.id,key,shape:ask?'secreto':s.shape?iconKind(s.shape,e.shape):e.shape,name:L.names?(ask?'?':s.name||e.name):null,ask,
    x:s.x,y:s.y,d,rarity:finite(s.rarity)?s.rarity:e.rarity,done,secret:e.secret,kind:s.kind||null,hint:s.hint||null,site:s});
  }
 }
 out.sort((a,b)=>b.rarity-a.rarity||a.d-b.d||Number(a.done)-Number(b.done)||a.key.localeCompare(b.key));
 return max>0?out.slice(0,max):out;}
// Whether a secret entry's kind is known (one of them found): then it is no longer «?».
export function kindKnown(e,S,ctx=null){if(!e)return false;if(!e.secret)return true;try{return !!e.known?.(S,ctx);}catch(_){return false;}}
// What the Bitácora will list (T9): every entry the level shows, with its own line when it has one.
export function scanPage(S,ctx=null,level=scanLevel(S)){const out=[];
 for(const e of registry.values()){if(!scanVisible(e,level)||e.secret)continue;let line=null;try{line=e.page?.(S,ctx)??null;}catch(_){line=null;}out.push({id:e.id,name:e.name,shape:e.shape,line});}
 return out;}
// ---------- positions ----------
// One site at most per cell of `cell` units, in `share` of the cells, from hashKey only: the same cell gives the same
// site on every load and nothing reads the old random sequence. For a provider with no generator of its own.
export function scanSiteAt(kind,i,j,{cell,share=1,margin=.2,world=''}={}){const k=`scan:${kind}:v1:${world}:${i},${j}`;if(hashKey(k+':has')>=share)return null;
 const span=1-2*margin;return {key:`${i},${j}`,x:Math.round((i+margin+span*hashKey(k+':x'))*cell),y:Math.round((j+margin+span*hashKey(k+':y'))*cell),u:hashKey(k+':u')};}
// ---------- the band hook ----------
// The level-4 tier a band's km opens: under 10 km a band is level 2 (what is close is named), from 10/30/60 km 4a/4b/4c.
export function scanBandLevel(km){return km>=10?4:2;}
export function scanBandEntry(band,{shape='banda',rarity=1,sites,done=null,page=null,secret=false}={}){
 if(!plain(band)||typeof sites!=='function')throw Error('Invalid band scan');const km=Number(band.km)||0,level=scanBandLevel(km);
 return registerScan({id:'banda-'+band.id,name:band.name,shape,level,km:level===4?km:0,rarity,secret,batch:band.batch||'',sites,done,page});}
// ---------- the marks (Escáner NMS, Jay, 5 Nov 2026, alpha.263) ----------
// «Como No Man's Sky»: after a scan, each thing within reach shows as its icon and a short text («Caja · 240 m») on a
// ring round the cube that stops at the screen's edge: a thing farther than the ring (or off the screen) sits on the
// screen's perimeter in its direction, one on the screen beyond the ring sits on itself, and one close to the cube sits
// on the ring (never on the cube). SCAN_MARKS at most, in the registry's order; none covers another.
export const SCAN_MARKS=8;
export const SCAN_SHOW=7,SCAN_SHOW_FADE=1;              // s the marks stay after the scan, and their fade
export const MARK_SIDE=22,MARK_TOP=104,MARK_BOTTOM=104;  // px kept off the sides and the bars (as the edge arrows)
export const MARK_ICON=14,MARK_CHAR=7.3,MARK_GAP=4;      // px: the icon, one letter at 12 px Geist Mono, between them
// The inner ring's radius (px) on a screen W×H.
export const markRing=(W,H)=>Math.max(70,Math.min(160,.28*Math.min(W,H)));
// How far from (cx,cy) along angle a before leaving the safe area of the screen.
export function edgeReach(a,{W,H,cx,cy},side=MARK_SIDE,top=MARK_TOP,bottom=MARK_BOTTOM){const c=Math.cos(a),s=Math.sin(a),x0=Math.max(side,Math.min(W-side,cx)),y0=Math.max(top,Math.min(H-bottom,cy));
 const tx=c>1e-9?(W-side-x0)/c:c<-1e-9?(side-x0)/c:Infinity,ty=s>1e-9?(H-bottom-y0)/s:s<-1e-9?(top-y0)/s:Infinity;return Math.max(0,Math.min(tx,ty));}
// The box a mark takes: its icon and, under it, its words (centred, kept inside the screen).
export function markBox(x,y,label,W){const half=MARK_ICON/2+2;let box={x:x-half,y:y-half,w:half*2,h:half*2,lx:x,ly:y+MARK_ICON/2+MARK_GAP};
 if(label){const w=label.length*MARK_CHAR+4,lx=Math.max(6+w/2,Math.min(W-6-w/2,x));box={...box,lx,x:Math.min(box.x,lx-w/2),w:Math.max(box.x+box.w,lx+w/2)-Math.min(box.x,lx-w/2),h:half*2+MARK_GAP+16};}
 return box;}
const hit=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
// items: [{key, x, y (screen px), label}] in order; view: {W, H, cx, cy} with (cx,cy) the cube on screen. Returns the
// marks kept: {key, x, y, a, edge (on the perimeter), ring (pushed out to the ring), box, label}.
export function scanMarks(items,view,{cap=SCAN_MARKS,ring=markRing(view.W,view.H)}={}){
 const out=[];if(!view||!(view.W>0)||!(view.H>0))return out;
 for(const it of items||[]){
  if(out.length>=cap)break;if(!it||!finite(it.x)||!finite(it.y))continue;
  const dx=it.x-view.cx,dy=it.y-view.cy,d=Math.hypot(dx,dy),a0=d>.5?Math.atan2(dy,dx):-Math.PI/2;
  // Try its own direction, then a little to each side, a step about a mark's width at that distance.
  const place=a=>{const edge=edgeReach(a,view),rho=Math.min(Math.max(d,ring),edge),x=view.cx+Math.cos(a)*rho,y=view.cy+Math.sin(a)*rho;
   return {x:Math.round(x),y:Math.round(y),a,edge:rho>=edge-.5,ring:d<ring&&rho<edge-.5,box:markBox(x,y,it.label,view.W)};};
  let got=null;const step=Math.max(.06,24/Math.max(ring,Math.min(d,edgeReach(a0,view))));
  for(let i=0;i<=8&&!got;i++)for(const sgn of i?[1,-1]:[1]){const m=place(a0+sgn*i*step);if(!out.some(o=>hit(o.box,m.box))){got=m;break;}}
  if(got)out.push({key:it.key,label:it.label||null,...got});
 }
 return out;}
