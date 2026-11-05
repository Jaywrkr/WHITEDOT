// Bandas de distancia (Jay, 4 Nov 2026, alpha.248; docs/MUNDO.md#lo-que-hay-más-lejos): going further is a reward in
// itself. Each new thing of the open universe starts at a distance from the origin (its band) and keeps appearing
// beyond it; it never runs out. This is the model, with no page, canvas or sound. Its API, for every batch of things
// (A, 0–10 km; B, 10–30 km; C, 30–60 km; D, 60 km and more):
// · registerBand({id, km, name, notice?, hint?, batch?}) — on the batch's model load, once per thing. km: where it
//   starts (km from the origin, 0 allowed). name: what the Bitácora calls it once reached («Radares de ritmo»). notice:
//   the line shown the first time you cross km («Radares de ritmo · Empiezan aquí.»); none for a thing found by itself.
//   hint: a short line under its name in the Bitácora. Registering an id twice with other data throws.
// · bandEntries() / bandGroups(): what is registered, by km (the groups are the bands: one per distinct km).
// · bandSiteAt(kind, i, j, opts) / bandSites(kind, p, reach, opts): fixed sites from hashKey, one at most per cell, only
//   at fromKm or more from the origin. opts: {cell, share, fromKm, margin, world}. Nothing reads the old random sequence
//   and nothing already on the map moves.
// · normalizeBandas(raw, seed) and noteFar(q, km): the save S.bandas (the farthest km reached, the notices given).
// The runtime (bandas.js) gives the notices and the Bitácora page «Lo que hay más lejos», and lets each batch attach its
// scene, its points on the Mapa del universo and its line in the Bitácora (r.bandAttach).
import {hashKey} from './universe-regions.js';
export const BANDAS_VERSION=1,UNITS_PER_KM=10000;
const ID=/^[a-z][a-z0-9-]{0,31}$/;
const registry=new Map();
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const finiteKm=v=>Number.isFinite(v)&&v>=0&&v<1e5;
export function registerBand(entry){
 if(!plain(entry)||!ID.test(entry.id)||!finiteKm(entry.km)||typeof entry.name!=='string'||!entry.name)throw Error('Invalid band entry');
 const e=Object.freeze({id:entry.id,km:Math.round(entry.km*100)/100,name:entry.name,notice:typeof entry.notice==='string'&&entry.notice?entry.notice:null,hint:typeof entry.hint==='string'&&entry.hint?entry.hint:null,batch:typeof entry.batch==='string'?entry.batch:''});
 const was=registry.get(e.id);if(was){if(JSON.stringify(was)!==JSON.stringify(e))throw Error('Band entry registered twice: '+e.id);return was;}
 registry.set(e.id,e);return e;}
export const bandEntries=()=>[...registry.values()].sort((a,b)=>a.km-b.km||a.id.localeCompare(b.id));
export const bandEntry=id=>registry.get(id)||null;
export function bandGroups(){const out=[];for(const e of bandEntries()){const last=out.at(-1);if(last&&last.km===e.km)last.entries.push(e);else out.push({km:e.km,entries:[e]});}return out;}
export const kmOf=p=>Math.hypot(Number(p?.x)||0,Number(p?.y)||0)/UNITS_PER_KM;
// «0 km», «500 m», «1 km», «2,5 km»: how the Bitácora writes a band (Spanish decimal comma).
export const formatKm=km=>km>0&&km<1?`${Math.round(km*1000)} m`:`${String(Math.round(km*10)/10).replace('.',',')} km`;
// ---------- sites ----------
// One site at most in each cell of `cell` units, in a share of the cells, away from the cell's edge by `margin`; a site
// under fromKm from the origin does not exist. The same cell gives the same site on every load.
export function bandSiteAt(kind,i,j,{cell,share,fromKm=0,margin=.2,world=''}={}){const k=`${kind}:v1:${world}:${i},${j}`;if(hashKey(k+':has')>=share)return null;
 const span=1-2*margin,x=Math.round((i+margin+span*hashKey(k+':x'))*cell),y=Math.round((j+margin+span*hashKey(k+':y'))*cell);
 if(Math.hypot(x,y)<fromKm*UNITS_PER_KM)return null;return {id:`${kind}:${i},${j}`,kind,i,j,x,y,km:Math.hypot(x,y)/UNITS_PER_KM,u:hashKey(k+':u')};}
// The sites within `reach` of a point, nearest first.
export function bandSites(kind,p,reach,opts){const cell=opts.cell,i0=Math.floor(p.x/cell),j0=Math.floor(p.y/cell),n=Math.ceil(reach/cell),out=[];
 for(let i=i0-n;i<=i0+n;i++)for(let j=j0-n;j<=j0+n;j++){const s=bandSiteAt(kind,i,j,opts);if(!s)continue;const d=Math.hypot(s.x-p.x,s.y-p.y);if(d<=reach)out.push({...s,d});}
 return out.sort((a,b)=>a.d-b.d);}
// ---------- the save: S.bandas ----------
// version 1: far (the farthest distance from the origin reached in the free World, km, two decimals) and seen (the
// notices already given, id → day). Unknown fields are kept; a later version is left untouched (and never written).
// seed: on a save that has none yet, what is already known to be reached (the farthest buoy, where you are): those
// notices count as given, silently, so an old save does not get them all at once.
const dayKey=v=>typeof v==='string'&&/^(\d{4}-\d{2}-\d{2})?$/.test(v)?v:'';
export const bandasReadOnly=q=>plain(q)&&Number.isInteger(q.version)&&q.version>BANDAS_VERSION;
export function normalizeBandas(raw,seed=null){
 if(bandasReadOnly(raw))return raw;const fresh=!plain(raw),q=fresh?{}:raw,seen={};
 for(const [id,v] of Object.entries(plain(q.seen)?q.seen:{}))if(ID.test(id))seen[id]=dayKey(v);
 const out={...q,version:BANDAS_VERSION,far:finiteKm(q.far)?Math.round(q.far*100)/100:0,seen};
 if(fresh&&seed){out.far=Math.max(out.far,finiteKm(seed.far)?Math.round(seed.far*100)/100:0);for(const e of bandEntries())if(e.notice&&e.km>0&&e.km<=out.far)out.seen[e.id]='';}
 return out;}
export const bandReached=(q,e)=>!!e&&(e.km<=0||(Number(q?.far)||0)>=e.km);
// You are at km: the farthest is kept, and the notices of what starts between the old farthest and here, not given yet,
// are returned (nearest first) and marked as given. Returns [] for a later version.
export function noteFar(q,km,day=''){if(!plain(q)||q.version!==BANDAS_VERSION||!finiteKm(km))return [];const k=Math.round(km*100)/100;if(k>q.far)q.far=k;
 const out=bandEntries().filter(e=>e.notice&&e.km>0&&e.km<=q.far&&!Object.hasOwn(q.seen,e.id));for(const e of out)q.seen[e.id]=dayKey(day);return out;}
// The Bitácora: the bands, in order; a band reached shows its things, one not reached only its km.
export function bandRows(q){return bandGroups().map(g=>({km:g.km,reached:bandReached(q,{km:g.km}),entries:g.entries}));}
