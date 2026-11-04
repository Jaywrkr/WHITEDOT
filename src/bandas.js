// Bandas de distancia (Jay, 4 Nov 2026, alpha.248; docs/MUNDO.md#lo-que-hay-más-lejos): the runtime of the bands, in
// the free World after the Journey, never in a chapter, a round, a finale, an activity or the Refugio. The model and its
// API are in bandas-model.js. Here:
// · The farthest distance from the origin you reached (S.bandas.far), and a quiet notice the first time you cross where
//   something new starts («Aquí empiezan los radares de ritmo.»), one at a time, never during a scene.
// · The Bitácora page «Lo que hay más lejos»: the bands reached with their things; the ones missing as «?» with their km.
// · r.bandAttach(id, {busy, mapPoints, line}): each batch's runtime attaches what the rest of the game asks of it, so no
//   other module has to learn each batch: r.bandBusy() (a scene of a batch plays: encounters, figures, sounds, buoys
//   and the sky's secrets wait, one scene at a time; a batch asks r.bandBusy('B'), a scene of any other batch),
//   r.bandMapPoints() (points for the Mapa del universo, as rumors are) and its line under its name in the Bitácora.
import {openSurface} from './frame-state.js';
import {freeOpen} from './journey-mode.js';
import {BANDAS_VERSION,normalizeBandas,bandasReadOnly,noteFar,bandRows,bandEntries,bandEntry,kmOf,formatKm} from './bandas-model.js';
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const NOTICE_GAP=4.5;
export function initialize(r){
 const $=id=>r.$?.(id)||globalThis.document?.getElementById(id)||null;
 const attached=new Map();let owner=null,clock=0,queue=[],shownAt=-Infinity,notices=0,seeding=false;
 const allowed=()=>!!r.S&&r.inWorld?.()&&(r.S.layer||'superficie')==='superficie'&&freeOpen(r.S.journey)&&!r.activityActive&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!r.houseActive?.()&&!r.travelInLevel?.()&&!r.placeRun?.()&&!r.placeCardDue?.()&&!r.songStageState?.()?.running&&!r.journeyFinaleState?.()?.running;
 const paused=()=>globalThis.document?.hidden||!!r.scanning||!!openSurface('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 // busy(batch): a scene of any batch but `batch` (each batch asks it of the others, so its own scene never stops itself).
 const busy=(skip='')=>{for(const [id,a] of attached)try{if(skip&&bandEntry(id)?.batch===skip)continue;if(a.busy?.())return true;}catch(_){}return false;};
 const scene=()=>!!r.liveEncounterActive?.()||!!r.skyMapActive?.()||!!(r.mischiefBusy?r.mischiefBusy():r.mischiefState?.scene)||!!r.skySecretBusy?.()||busy();
 // The save (S.bandas): normalised once per save. A save without it starts from what is known: the farthest buoy passed
 // (S.recorrer.far) and, on the first frame in the free World, where you are; those notices count as given.
 function book(){if(owner!==r.S){owner=r.S;const fresh=owner.bandas===undefined||owner.bandas===null;owner.bandas=normalizeBandas(owner.bandas,fresh?{far:Number(owner.recorrer?.far)||0}:null);queue=[];seeding=fresh;}return owner.bandas;}
 const ok=()=>book().version===BANDAS_VERSION&&!bandasReadOnly(book());
 const today=()=>r.S.todayKey||'';
 function tick(dt,modal=false){
  if(!r.S)return;const q=book();if(!allowed()||!ok())return;if(modal||paused())return;clock+=Math.max(0,Math.min(.05,dt||0));
  const km=kmOf({x:r.S.wx,y:r.S.wy});
  // A save that had no S.bandas: where you first stand in the free World counts as reached, silently (an old save does
  // not get every notice at once). The next km you walk tells you as usual.
  if(seeding){seeding=false;if(km>q.far){noteFar(q,km,'');r.save?.();}return;}
  if(km>q.far+.005){const before={far:q.far,seen:{...q.seen}},news=noteFar(q,km,today());
   if(news.length){if(r.save?.()===false){q.far=before.far;q.seen=before.seen;}else queue.push(...news);}}
  // One notice at a time, never over a scene; with «Textos del universo» off, nothing is said (the page still knows).
  // Its own category in the notice lane, so an everyday notice arriving after it does not take its place.
  if(queue.length&&clock-shownAt>=NOTICE_GAP&&!scene()){const e=queue.shift();shownAt=clock;if(r.S.universeTexts!==false){notices++;r.toast?.(e.notice,{level:2,ttl:30000,category:'lejos',coalesce:false});}}
 }
 // ---------- the Bitácora: «Lo que hay más lejos» ----------
 function section(){if(!r.S)return '';const q=book();if(q.version!==BANDAS_VERSION&&!bandasReadOnly(q))return '';const rows=bandRows(q);if(!rows.length)return '';
  const reached=rows.filter(b=>b.reached).length,far=Number(q.far)||0;
  const body=rows.map(b=>{if(!b.reached)return `<p class="banda-row banda-missing" data-banda-km="${b.km}"><span class="secret-name">${formatKm(b.km)}</span> · <span aria-label="Sin descubrir">?</span></p>`;
   return b.entries.map(e=>{let line='';try{line=attached.get(e.id)?.line?.()||'';}catch(_){line='';}line=line||e.hint||'';
    return `<p class="banda-row" data-banda-km="${b.km}" data-banda="${escape(e.id)}"><span class="secret-name">${formatKm(b.km)}</span> · ${escape(e.name)}${line?` · ${escape(line)}`:''}</p>`;}).join('');}).join('');
  const lead=far>=.05?`<p>Lo más lejos · ${formatKm(far<1?Math.floor(far*10)/10:Math.floor(far))}</p>`:'<p>Cuanto más lejos llegas, más cosas encuentras.</p>';
  const rest=reached===rows.length?'<p>Más lejos hay más.</p>':'';
  return `<details class="journal-section" data-journal-detail="Lo que hay más lejos" id="journalBandas"><summary>Lo que hay más lejos · ${reached} de ${rows.length}</summary>${lead}${body}${rest}</details>`;}
 // ---------- what each batch attaches ----------
 function attach(id,hooks){if(typeof id!=='string'||!hooks||typeof hooks!=='object')return false;attached.set(id,hooks);return true;}
 const mapPoints=()=>{const out=[];for(const a of attached.values())try{for(const e of a.mapPoints?.()||[])if(e&&Number.isFinite(e.x)&&Number.isFinite(e.y))out.push(e);}catch(_){}return out;};
 Object.defineProperties(r,{
  bandTick:{get:()=>tick},bandasSection:{get:()=>section},bandAttach:{get:()=>attach},bandBusy:{get:()=>busy},bandMapPoints:{get:()=>mapPoints},
  bandFar:{get:()=>()=>{if(!r.S)return 0;return Number(book().far)||0;}},
  // Tests only (the runtime is never published): the state.
  bandState:{get:()=>()=>{const q=book();return {version:q.version,allowed:allowed(),book:structuredClone(q),queue:queue.map(e=>e.id),notices,entries:bandEntries().map(e=>({id:e.id,km:e.km,notice:e.notice})),attached:[...attached.keys()],busy:busy()};}}
 });
}
