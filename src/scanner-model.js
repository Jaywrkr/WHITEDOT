// El Escáner (coherencia T1, Jay, 4 Nov 2026; docs/MUNDO.md#el-escáner). What is near the cube, as one registry. The
// model only: no page, canvas, sound or save writes. The runtime (scanner.js) draws the wave and the «Cerca» panel.
// · registerScan({id, name, shape, level, km, rarity, secret, batch, sites, done, page}) — once per kind of thing, at
//   load. Registering the same id twice throws. sites(p, reach, S, ctx) gives the things within reach of p:
//   [{key, x, y, name?, kind?, hint?}], from the thing's own generator or from hashKey (scanSiteAt), never from the old
//   random sequence. done(S, site, ctx): already found (drawn dim). page(S, ctx): its line for the Bitácora (later).
// · scanLevel(S, {charged}): the level the save has opened. 1 from the start (short wave, shapes without names); 2 after
//   the Journey (names and distance). 3 (the eleven places, S.lugares.won) and 4a/4b/4c (S.bandas.far ≥ 10/30/60 km)
//   are written here so later batches only add; SCAN_OPEN keeps the rest closed until then. charged = 4c (the boxes, T3).
//   T2 opens level 3: arrows at the screen's edge (scanner-arrows.js), secrets and rumours as «?», a row marks the map.
// · scanReach(level) in units (10 per metre), scanNear(p, S, {level, ctx, max, minRarity}) in order: rarity, then
//   distance, then not found first (a secret entry is named «?»); scanPage(S, ctx) lists what is registered for the
//   Bitácora.
// · scanBandEntry(band, opts): the hook for registerBand (bandas-model.js): a band's thing registered at level 4 by its
//   km. Not called yet (FINAL.md T2/T4).
import {hashKey} from './universe-regions.js';
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
export const SCAN_SHAPES=Object.freeze(['voz','caja','hallazgo','portal','sonda','forma','estrella','boya','pregunta']);
const ID=/^[a-z][a-z0-9-]{0,31}$/;
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const registry=new Map();
export function registerScan(entry){
 if(!plain(entry)||!ID.test(entry.id)||typeof entry.name!=='string'||!entry.name||typeof entry.sites!=='function')throw Error('Invalid scan entry');
 if(registry.has(entry.id))throw Error('Scan entry registered twice: '+entry.id);
 const level=Number.isInteger(entry.level)&&entry.level>=1&&entry.level<=4?entry.level:1;
 const e=Object.freeze({id:entry.id,name:entry.name,shape:SCAN_SHAPES.includes(entry.shape)?entry.shape:'estrella',level,
  km:Number.isFinite(entry.km)&&entry.km>=0?entry.km:0,rarity:Number.isFinite(entry.rarity)?Math.max(0,Math.min(3,entry.rarity)):0,
  secret:entry.secret===true,batch:typeof entry.batch==='string'?entry.batch:'',sites:entry.sites,
  done:typeof entry.done==='function'?entry.done:null,page:typeof entry.page==='function'?entry.page:null});
 registry.set(e.id,e);return e;}
export const scanEntries=()=>[...registry.values()];
export const scanEntry=id=>registry.get(id)||null;
// Tests only: forget an entry (the game never unregisters).
export const unregisterScan=id=>registry.delete(id);
// ---------- levels ----------
const journeyDone=j=>!!(plain(j)&&(j.free===true||j.finished===true));
const farKm=S=>{const f=Number(S?.bandas?.far);return Number.isFinite(f)&&f>0?f:0;};
// The rank the save has earned, before SCAN_OPEN caps it.
export function scanEarned(S){
 if(!journeyDone(S?.journey))return 1;let rank=2;
 if(S?.lugares?.won===true)rank=3;
 if(rank>=3)for(const L of SCAN_LEVELS)if(L.level===4&&farKm(S)>=L.km)rank=Math.max(rank,L.rank);
 return rank;}
export function scanLevel(S,{charged=false,open=SCAN_OPEN}={}){
 const rank=charged?SCAN_LEVELS.length:Math.min(scanEarned(S),Math.max(1,open|0));
 return SCAN_LEVELS[Math.max(0,Math.min(SCAN_LEVELS.length,rank)-1)];}
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
   out.push({id:e.id,key,shape:s.shape&&SCAN_SHAPES.includes(s.shape)?s.shape:e.shape,name:L.names?(e.secret?'?':s.name||e.name):null,
    x:s.x,y:s.y,d,rarity:finite(s.rarity)?s.rarity:e.rarity,done,secret:e.secret,kind:s.kind||null,hint:s.hint||null,site:s});
  }
 }
 out.sort((a,b)=>b.rarity-a.rarity||a.d-b.d||Number(a.done)-Number(b.done)||a.key.localeCompare(b.key));
 return max>0?out.slice(0,max):out;}
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
export function scanBandEntry(band,{shape='estrella',rarity=1,sites,done=null,page=null,secret=false}={}){
 if(!plain(band)||typeof sites!=='function')throw Error('Invalid band scan');const km=Number(band.km)||0,level=scanBandLevel(km);
 return registerScan({id:'banda-'+band.id,name:band.name,shape,level,km:level===4?km:0,rarity,secret,batch:band.batch||'',sites,done,page});}
