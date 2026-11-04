import {createGrammar} from './grammar.js';
import { POCKET_NAMES } from './pockets.js';

import { TOY_NAMES } from './playthings.js';

import { ROLES, INSTRUMENTS } from './journal.js';
import {registerScan,scanLevel,scanNear,scanReach,scanDistance,SCAN_ROWS} from './scanner-model.js';
import {drawScanWave} from './scanner-art.js';
import {elementFamily,discoveryElement} from './element-book-model.js';
import {activityDefinition} from './universe-activities-model.js';
import {PROBES,probeFound} from './secretos-cielo-model.js';
import {prefersReducedMotion} from './frame-state.js';
// El Escáner (coherencia T1, Jay, 4 Nov 2026; docs/MUNDO.md#el-escáner). Hold the finger 500 ms (or the key E): a ring of
// light leaves the cube and what it touches lights up a moment. Level 1 (from the start): a short wave and shapes
// without names. Level 2 (after the Journey): the name and the distance («Sonda · 120 m»). The «Cerca» panel (#scanner)
// says up to three things; found ones dim, new ones white. The registry is scanner-model.js; the light, scanner-art.js.
// Scanning silences nothing: the beacons keep sounding and the eclipse and the dust stay dark (bug 8).
const NAMES={props:null,lotus:'Fuente de ondas',crystals:'Cristal',pillars:'Órbita rota',flies:'Chispa',grass:'Estrella de luz',flowers:'Destello',stal:'Gota de luz',motes:'Luz',walkers:'Caminante',beacons:'Púlsar'};
const KINDS={lotus:'loto',crystals:'cristal',pillars:'pilar',flies:'luciernaga',grass:'arbol',flowers:'planta:flor',stal:'gota',motes:'luz',walkers:'caminante',beacons:'faro'};
export function nearbySources(chunks,x,y,radius=250) {
  const items=[];
  for(const chunk of chunks.values())for(const field of [...Object.keys(NAMES),'plants','sp','playthings'])for(const object of chunk[field]||[]) {
    if(field==='grass'&&!object.tall)continue;
    if(field==='plants'&&object.pt.t==='hierba')continue;
    const distance=Math.hypot(object.x-x,object.y-y);
    if(distance>radius)continue;
    const kind=field==='playthings'?`toy:${object.kind}`:field==='sp'?`forma:${object.s.id}`:field==='plants'?`planta:${object.pt.t}`:field==='props'?object.k:KINDS[field];
    const name=field==='playthings'?TOY_NAMES[object.kind]:field==='sp'?object.s.name:field==='plants'?object.pt.t:field==='props'?object.k:NAMES[field];
    items.push({object,kind,name,distance});
  }
  return items.sort((a,b)=>a.distance-b.distance).slice(0,5);
}
// ---------- what the scanner knows (providers) ----------
const surface=S=>(S?.layer||'superficie')==='superficie';
const ID_NAME=/^[a-z][a-z_:-]*$/;
// A voice's name for a child: the object's own name, or its family's name for a bare id («hongo» → «Hongo»).
function voiceName(source,r,own){
 const sp=source.object?.s;
 if(sp){const known=!!r.S.cat?.[sp.id];return r.blobHabitat?.(own)?(known?'Burbuja · '+sp.name:'Burbuja'):(known?sp.name:'Forma');}
 const n=source.object?.name||source.name;
 if(typeof n==='string'&&n&&!ID_NAME.test(n))return n;
 const e=discoveryElement(elementFamily(source.kind));if(e)return e.name;
 return typeof n==='string'&&n?n[0].toUpperCase()+n.slice(1):'Voz';}
function regionOfSource(source,r){const sp=source.object?.s;return sp?r.regionOfPos(...sp.id.split(':')[0].split(',').map(n=>+n*r.REG*r.WCH+1)):r.regionOfPos(source.object.x,source.object.y);}
// The voices of the old scanner: every nearby musical source, as before (props, plants, toys, forms and the systems'
// own lists). Their role, instrument and patch live in the Bitácora › Música and, for developers, in data-detail.
function voiceSources(r){
 const S=r.S,region=r.activeLayerRegion?.()||r.regionOfPos(S.wx,S.wy);
 if(region.recipe?.layer&&region.recipe.layer!=='superficie')return [];
 return [...nearbySources(r.sceneChunk?new Map([...r.wchunks].map(([id,c])=>[id,r.sceneChunk(c)])):r.wchunks,S.wx,S.wy),...(r.percussionSources?.()||[]),...(r.microSources?.()||[]),...(r.inhabitantSources?.()||[]),...(r.phenomenonSources?.()||[]),...(r.glassSources?.()||[]),...(r.materiaSources?.()||[]),...(r.vidaSources?.()||[]),...(r.mirrorSources?.()||[]),...(r.encounterSources?.()||[]),...(r.ecologySources?.()||[]),...(r.livingSources?.()||[])].sort((a,b)=>a.distance-b.distance).slice(0,5);}
registerScan({id:'voces',name:'Voz',shape:'voz',level:1,rarity:0,
 sites:(p,reach,S,r)=>{if(!r?.inWorld?.())return [];return voiceSources(r).filter(s=>s.object&&Number.isFinite(s.object.x)).map(source=>{const own=regionOfSource(source,r);
  return {key:source.kind+':'+Math.round(source.object.x)+','+Math.round(source.object.y),x:source.object.x,y:source.object.y,name:voiceName(source,r,own),kind:source.kind,shape:source.object.s?'forma':'voz',hint:source.hint||r.gestureHint?.(source.kind)||null,source,own};});},
 done:(S,s,r)=>{const sp=s.source?.object?.s;if(sp)return !!S.cat?.[sp.id];const id=elementFamily(s.kind,false);return !!(id&&S.elementBook?.found?.[id]);}});
registerScan({id:'cajas',name:'Caja',shape:'caja',level:1,rarity:2,
 sites:(p,reach,S,r)=>surface(S)?(r?.boxesNear?.(reach)||[]).map(b=>({key:b.id,x:b.x,y:b.y})):[]});
registerScan({id:'hallazgos',name:'Hallazgo',shape:'hallazgo',level:1,rarity:1,
 sites:(p,reach,S,r)=>surface(S)?(r?.nearbyRelics?.()||[]).map(s=>({key:s.id,x:s.x,y:s.y,name:s.name})):[],
 done:(S,s)=>!!S.relicSites?.[s.key]});
registerScan({id:'actividades',name:'Juego',shape:'portal',level:1,rarity:1,
 sites:(p,reach,S,r)=>surface(S)&&!r?.activityActive?(r?.activityNear?.()||[]).map(o=>({key:o.id,x:o.x,y:o.y,name:activityDefinition(o.kind)?.name||'Juego',id:o.id})):[],
 done:(S,s)=>S.activities?.done?.[s.id]===true});
// The lost probes (secretos-cielo-model.js): fixed points, heard before seen. After the Journey, on the surface.
registerScan({id:'sondas',name:'Sonda',shape:'sonda',level:2,rarity:2,
 sites:(p,reach,S,r)=>{if(!surface(S)||(S.previewSeed&&!r?.realTravel)||S.skySecrets?.version!==1)return [];const out=[];for(const q of PROBES)if(Math.hypot(q.x-p.x,q.y-p.y)<=reach)out.push({key:q.id,x:q.x,y:q.y,i:q.i});return out;},
 done:(S,s)=>probeFound(S.skySecrets,s.i)});
export function initialize(runtime) {
  let scanning=false,lastUpdate=-Infinity,level=scanLevel(runtime.S),items=[],wave=null,lit=new Map(),closing=0,drawn={ring:false,icons:0,labels:0,radius:0};
  const panel=document.getElementById('scanner'),list=document.getElementById('scannerSources');
  const still=()=>!!runtime.S.reducedMotion||prefersReducedMotion();
  const dev=()=>!!document.body?.classList.contains('dev');
  function stopScanner(){if(scanning&&wave)closing=performance.now();scanning=false;panel.hidden=true;}
  function icon(shape){const i=document.createElement('i');i.className='scan-ico';i.dataset.shape=shape;i.setAttribute('aria-hidden','true');return i;}
  // The old technical line of a voice (role · instrument · patch · region · effect · personality): developers only, as
  // the row's data-detail, never on screen. The player reads it in the Bitácora › Música.
  function detail(s){const source=s.source,own=s.own;if(!source||!own)return '';const voice=source.voice||runtime.getVoice?.(source.kind,own);if(!voice)return '';
    const patch=runtime.getInstrumentPatch?.(source.kind,own,voice,source.object),effect=runtime.getEffectProfile?.(source.kind,own,voice);
    return `${ROLES[voice.role]} · ${INSTRUMENTS[voice.instrument]?.[0]||voice.instrument}${patch?' · '+patch.name:''} · ${own.name}${effect&&effect.type!=='dry'?' · '+effect.name:''}${source.object.personality?' · '+source.object.personality.name:''}`;}
  function updateScanner(force=false) {
    if(!scanning)return;
    if(!runtime.inWorld()||[...document.querySelectorAll('.modal')].some(m=>!m.hidden)){stopScanner();return;}
    const now=performance.now();if(!force&&now-lastUpdate<200)return;lastUpdate=now;
    const S=runtime.S,p={x:S.wx,y:S.wy};level=scanLevel(S);panel.dataset.level=level.id;
    const all=scanNear(p,S,{level,ctx:runtime,max:0});items=all;
    // The panel: the first three in the registry's order (rarity, then distance, then not found first).
    const rows=all.slice(0,SCAN_ROWS);
    const region=runtime.activeLayerRegion?.()||runtime.regionOfPos(S.wx,S.wy),regionLine=document.getElementById('scannerRegion');
    regionLine.textContent=level.names?`${region.name}${runtime.currentPocket()?.kind?' · '+POCKET_NAMES[runtime.currentPocket().kind]:''} · ${region.ecology?.name||region.recipe?.name||createGrammar(region,runtime.seedOf,runtime.rng).character}`:'';
    regionLine.hidden=!regionLine.textContent;
    list.replaceChildren();
    if(!level.names){
      // Level 1: the shapes, no names.
      const li=document.createElement('li');li.className='scan-shapes';
      if(all.length){for(const it of all.slice(0,5))li.append(icon(it.shape));li.append(document.createTextNode(`${all.length} cerca`));}
      else li.textContent='Nada cerca. Sigue.';
      list.append(li);
    }else{
      for(const it of rows){const li=document.createElement('li');li.className='scan-row'+(it.done?' found':'');li.dataset.id=it.id;li.append(icon(it.shape),document.createTextNode(`${it.name} · ${scanDistance(it.d)}`));
        if(it.id==='voces'&&dev()){const d=detail(it.site||{});if(d)li.dataset.detail=d;}
        list.append(li);}
      if(!rows.length){const li=document.createElement('li');li.textContent='Nada cerca. Sigue.';list.append(li);}
    }
    const hint=document.getElementById('scannerHint'),voice=level.names?rows.find(it=>it.id==='voces'&&it.hint):null;
    hint.textContent=!level.names?'Termina el Viaje para ver qué es.':!S.sound?'Sin sonido.':voice?voice.hint:'';
    hint.hidden=!hint.textContent;
    while(panel.scrollHeight>panel.clientHeight+2&&list.childElementCount>1)list.lastElementChild.remove();
  }
  function startScanner(){if(!runtime.inWorld())return;const was=scanning;scanning=true;runtime.ptr=null;panel.hidden=false;
    if(!was){lit=new Map();closing=0;level=scanLevel(runtime.S);wave={t0:performance.now(),dur:level.wave,reach:scanReach(level)};}
    updateScanner(true);}
  // The light, every frame while held and a short fade after: under the cube, over the World.
  // The names are asked for (the finger is held), so they are written even in the quiet view, which keeps the World's
  // canvas without words (journey-mode.js); «Textos del universo» off still hides them. The prototype's fillText is the
  // translated one (i18n.js).
  const proto=globalThis.CanvasRenderingContext2D?.prototype;
  const write=(c,text,x,y)=>proto?.fillText?proto.fillText.call(c,text,x,y):c.fillText(text,x,y);
  const FADE=.35;
  function draw(){
    if(!wave)return;const now=performance.now(),fade=scanning?1:closing?Math.max(0,1-(now-closing)/1000/FADE):0;
    if(!(fade>0)||!runtime.inWorld()){wave=null;items=[];lit.clear();drawn={ring:false,icons:0,labels:0,radius:0};return;}
    const W=runtime.W,H=runtime.H,camX=runtime.camX??runtime.S.wx,camY=runtime.camY??runtime.S.wy,ox=W/2-camX,oy=H/2-camY;
    const shown=items.map(it=>({key:it.key,x:it.x+ox,y:it.y+oy,shape:it.shape,name:it.name,dist:scanDistance(it.d),done:it.done}));
    drawn=drawScanWave(runtime.cx,runtime.S.wx+ox,runtime.S.wy+oy,W,H,{age:(now-wave.t0)/1000,dur:wave.dur,reach:wave.reach,still:still(),light:!!runtime.lightQuality?.(),fade,names:level.names&&runtime.S.universeTexts!==false,items:shown,lit,write});
  }
  // Tests only (the runtime is never published): the level, what is near and what the last frame drew.
  function state(){return {scanning,level:level.id,names:level.names,reach:scanReach(level),items:items.map(({id,key,name,shape,d,done})=>({id,key,name,shape,m:Math.round(d/10),done})),wave:wave?{age:(performance.now()-wave.t0)/1000,dur:wave.dur,reach:wave.reach}:null,drawn:{...drawn},still:still()};}
  Object.defineProperties(runtime,{scanning:{get:()=>scanning},startScanner:{get:()=>startScanner},stopScanner:{get:()=>stopScanner},updateScanner:{get:()=>updateScanner},drawScan:{get:()=>draw},scanState:{get:()=>state}});
}
