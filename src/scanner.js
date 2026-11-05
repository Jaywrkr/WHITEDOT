import {createGrammar} from './grammar.js';
import { POCKET_NAMES } from './pockets.js';

import { TOY_NAMES } from './playthings.js';

import { ROLES, INSTRUMENTS } from './journal.js';
import {registerScan,scanLevel,scanNear,scanReach,scanDistance,scanMarks,edgeReach,SCAN_ROWS,SCAN_MARKS,SCAN_SHOW,SCAN_SHOW_FADE} from './scanner-model.js';
import {drawScanWave,drawScanMarks,waveRadius,SCAN_FLASH} from './scanner-art.js';
import {elementFamily,discoveryElement} from './element-book-model.js';
import {activityDefinition} from './universe-activities-model.js';
import {PROBES,probeFound,COMETS,cometFound} from './secretos-cielo-model.js';
import {ASTEROID,secretFound} from './secretos-model.js';
import {initialize as arrows} from './scanner-arrows.js';
import {prefersReducedMotion} from './frame-state.js';
// El Escáner (coherencia T1, Jay, 4 Nov 2026; docs/MUNDO.md#el-escáner). Hold the finger 500 ms (or the key E): a ring of
// light leaves the cube and what it touches lights up a moment. Level 1 (from the start): a short wave and shapes
// without names. Level 2 (after the Journey): the name and the distance («Sonda · 120 m»). Found ones dim, new ones
// white. The registry is scanner-model.js; the light, scanner-art.js; the icons, scan-icons.js.
// Scanning silences nothing: the beacons keep sounding and the eclipse and the dust stay dark (bug 8).
// Level 3 (the eleven places, coherencia T2): the arrows at the screen's edge (scanner-arrows.js) also point at what the
// registry reaches; secrets and rumours show as «?». (The panel's rows that marked the map went with the panel in
// alpha.263: the map keeps its own «Marcar».)
// T3 «la carga»: the radar is always there without boxes; a Carga from a box raises it to the top level for 20 s.
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
registerScan({id:'actividades',name:'Juego',shape:'juego',level:1,rarity:1,
 sites:(p,reach,S,r)=>surface(S)&&!r?.activityActive?(r?.activityNear?.()||[]).map(o=>({key:o.id,x:o.x,y:o.y,name:activityDefinition(o.kind)?.name||'Juego',id:o.id})):[],
 done:(S,s)=>S.activities?.done?.[s.id]===true});
// The lost probes (secretos-cielo-model.js): fixed points, heard before seen. After the Journey, on the surface.
registerScan({id:'sondas',name:'Sonda',shape:'sonda',level:2,rarity:2,
 sites:(p,reach,S,r)=>{if(!surface(S)||(S.previewSeed&&!r?.realTravel)||S.skySecrets?.version!==1)return [];const out=[];for(const q of PROBES)if(Math.hypot(q.x-p.x,q.y-p.y)<=reach)out.push({key:q.id,x:q.x,y:q.y,i:q.i});return out;},
 done:(S,s)=>probeFound(S.skySecrets,s.i)});
// Level 3 (T2): what is secret or only said, shown as «?» until you know its kind (Escáner NMS: one comet crystal found
// and every crystal shows its own icon; the asteroid once found; a rumour stays «?»). Open rumours (S.rumors), the comet
// crystals (fixed points) and the secret asteroid, on the surface, never in a preview world.
const real=(S,r)=>surface(S)&&!(S.previewSeed&&!r?.realTravel);
registerScan({id:'rumores',name:'Rumor',shape:'secreto',level:3,rarity:2,secret:true,
 sites:(p,reach,S,r)=>real(S,r)?(Array.isArray(S.rumors?.open)?S.rumors.open:[]).filter(q=>q&&Number.isFinite(q.x)&&Number.isFinite(q.y)&&Math.hypot(q.x-p.x,q.y-p.y)<=reach).map(q=>({key:String(q.id),x:q.x,y:q.y})):[]});
const anyOf=o=>!!o&&typeof o==='object'&&Object.keys(o).length>0;
registerScan({id:'cometas',name:'Cristal de cometa',shape:'cometa',level:3,rarity:2,secret:true,known:S=>anyOf(S?.skySecrets?.comets),
 sites:(p,reach,S,r)=>{if(!real(S,r)||S.skySecrets?.version!==1)return [];const out=[];for(const q of COMETS)if(Math.hypot(q.x-p.x,q.y-p.y)<=reach)out.push({key:q.id,x:q.x,y:q.y,i:q.i});return out;},
 done:(S,s)=>cometFound(S.skySecrets,s.i)});
registerScan({id:'asteroide',name:'Asteroide',shape:'asteroide',level:3,rarity:3,secret:true,known:S=>secretFound(S?.secrets,'asteroide'),
 sites:(p,reach,S,r)=>real(S,r)&&Math.hypot(ASTEROID.x-p.x,ASTEROID.y-p.y)<=reach?[{key:'asteroide',x:ASTEROID.x,y:ASTEROID.y}]:[],
 done:S=>secretFound(S.secrets,'asteroide')});
// Escáner NMS (Jay, 5 Nov 2026, alpha.263): «como No Man's Sky». Hold (500 ms or the key E): the ring leaves the cube
// and each thing it reaches becomes a mark, its icon and «Nombre · distancia», on a ring round the cube that stops at the
// screen's edge (scanMarks). No panel: nothing covers the view. The marks stay SCAN_SHOW s after the scan and fade; then
// the view is clean. The «Cerca» panel (#scanner and its ids) stays in the page, hidden; with ?dev=1 it lists the rows
// and each voice's technical line (data-detail) for developers.
export function initialize(runtime) {
  let scanning=false,lastUpdate=-Infinity,level=scanLevel(runtime.S),items=[],wave=null,lit=new Map(),closing=0,until=0,
    drawn={ring:false,icons:0,labels:0,radius:0},marks=[];
  const panel=document.getElementById('scanner'),list=document.getElementById('scannerSources');
  arrows(runtime);
  // T3 «la carga»: while a Carga lasts (cajas.js, power brujula) the scanner is at its top level (4c: 1200 m, names).
  const charged=()=>!!runtime.scanCharged?.(),levelNow=()=>scanLevel(runtime.S,{charged:charged()});
  const still=()=>!!runtime.S.reducedMotion||prefersReducedMotion();
  // Only an explicit ?dev=1 (not localhost or an automated browser, which also set body.dev): never a player.
  const dev=()=>{try{return new URLSearchParams(location.search).has('dev');}catch(_){return false;}};
  const busy=()=>[...document.querySelectorAll('.modal')].some(m=>!m.hidden);
  // While the finger is held the notices, the zone's line and the HUD of a power step aside (styles: body[data-scan]).
  const flag=on=>{if(document.body){if(on)document.body.dataset.scan='on';else delete document.body.dataset.scan;}};
  function stopScanner(){if(scanning&&wave){closing=performance.now();until=closing+SCAN_SHOW*1000;}scanning=false;flag(false);panel.hidden=true;}
  // Clean the view at once: a sheet, leaving the World.
  function clear(){wave=null;items=[];marks=[];lit.clear();until=0;drawn={ring:false,icons:0,labels:0,radius:0};}
  function icon(shape){const i=document.createElement('i');i.className='scan-ico';i.dataset.shape=shape;i.setAttribute('aria-hidden','true');return i;}
  // The old technical line of a voice (role · instrument · patch · region · effect · personality): developers only, as
  // the row's data-detail, never on screen. The player reads it in the Bitácora › Música.
  function detail(s){const source=s.source,own=s.own;if(!source||!own)return '';const voice=source.voice||runtime.getVoice?.(source.kind,own);if(!voice)return '';
    const patch=runtime.getInstrumentPatch?.(source.kind,own,voice,source.object),effect=runtime.getEffectProfile?.(source.kind,own,voice);
    return `${ROLES[voice.role]} · ${INSTRUMENTS[voice.instrument]?.[0]||voice.instrument}${patch?' · '+patch.name:''} · ${own.name}${effect&&effect.type!=='dry'?' · '+effect.name:''}${source.object.personality?' · '+source.object.personality.name:''}`;}
  // ?dev=1 only: the rows as the panel had them, for a developer to read (never shown to a player).
  function devPanel(all){const S=runtime.S;panel.dataset.level=level.id;panel.dataset.charged=String(charged());
    const region=runtime.activeLayerRegion?.()||runtime.regionOfPos(S.wx,S.wy),regionLine=document.getElementById('scannerRegion');
    regionLine.textContent=level.names?`${region.name}${runtime.currentPocket()?.kind?' · '+POCKET_NAMES[runtime.currentPocket().kind]:''} · ${region.ecology?.name||region.recipe?.name||createGrammar(region,runtime.seedOf,runtime.rng).character}`:'';
    regionLine.hidden=!regionLine.textContent;list.replaceChildren();
    for(const it of all.slice(0,SCAN_ROWS)){const li=document.createElement('li');li.className='scan-row'+(it.done?' found':'')+(it.ask?' secret':'');li.dataset.id=it.id;
      li.append(icon(it.shape),document.createTextNode(level.names?`${it.name} · ${scanDistance(it.d)}`:'·'));if(it.id==='voces'){const d=detail(it.site||{});if(d)li.dataset.detail=d;}list.append(li);}
    if(!all.length){const li=document.createElement('li');li.textContent='Nada cerca. Sigue.';list.append(li);}
    document.getElementById('scannerHint').hidden=true;panel.hidden=false;}
  function updateScanner(force=false) {
    if(!scanning){if(until&&(!runtime.inWorld()||busy()))clear();return;}
    if(!runtime.inWorld()||busy()){stopScanner();clear();return;}
    const now=performance.now();if(!force&&now-lastUpdate<200)return;lastUpdate=now;until=now+SCAN_SHOW*1000;
    const S=runtime.S,p={x:S.wx,y:S.wy};level=levelNow();
    items=scanNear(p,S,{level,ctx:runtime,max:0});
    if(dev())devPanel(items);
  }
  function startScanner(){if(!runtime.inWorld())return;const was=scanning;scanning=true;runtime.ptr=null;flag(true);
    if(!was){lit=new Map();closing=0;marks=[];level=levelNow();wave={t0:performance.now(),dur:level.wave,reach:scanReach(level)};}
    updateScanner(true);}
  // The light, every frame while held and a short fade after: under the cube, over the World. The marks, every frame
  // while they last: a thing joins when the ring reaches it (at once with reduced motion) and keeps its place as the
  // cube moves; its distance is read again each frame. The names are asked for (the finger was held), so they are
  // written even in the quiet view; «Textos del universo» off still hides them. The prototype's fillText is the
  // translated one (i18n.js).
  const proto=globalThis.CanvasRenderingContext2D?.prototype;
  const write=(c,text,x,y)=>proto?.fillText?proto.fillText.call(c,text,x,y):c.fillText(text,x,y);
  const FADE=.35;
  function draw(){
    drawWave();runtime.drawEdgeArrows?.();}
  function drawWave(){
    if(!wave)return;const now=performance.now(),fade=scanning?1:closing?Math.max(0,1-(now-closing)/1000/FADE):0,left=(until-now)/1000;
    if(!runtime.inWorld()||(!(fade>0)&&!(left>-SCAN_SHOW_FADE))){clear();return;}
    const W=runtime.W,H=runtime.H,camX=runtime.camX??runtime.S.wx,camY=runtime.camY??runtime.S.wy,ox=W/2-camX,oy=H/2-camY,S=runtime.S,cx=S.wx+ox,cy=S.wy+oy;
    const age=(now-wave.t0)/1000,calm=still(),light=!!runtime.lightQuality?.();
    const ring=fade>0?drawScanWave(runtime.cx,cx,cy,W,H,{age,dur:wave.dur,reach:wave.reach,still:calm,light,fade}):{ring:false,radius:0};
    // Which things the ring has reached: on the screen when it passes them, off the screen when it leaves the screen in
    // their direction.
    const radius=fade>0?ring.radius:waveRadius(wave.reach,W,H),names=level.names&&S.universeTexts!==false,view={W,H,cx,cy};
    const shown=[];
    for(const it of items){const x=it.x+ox,y=it.y+oy,d=Math.hypot(x-cx,y-cy);
      if(!lit.has(it.key)){if(!scanning||(!calm&&Math.min(d,edgeReach(Math.atan2(y-cy,x-cx),view,0,0,0))>radius+1))continue;lit.set(it.key,age);}
      const m=Math.hypot(it.x-S.wx,it.y-S.wy);
      shown.push({key:it.key,id:it.id,x,y,shape:it.shape,done:it.done,flash:Math.max(0,1-(age-lit.get(it.key))/SCAN_FLASH),label:names&&it.name?`${it.name} · ${scanDistance(m)}`:null});}
    const placed=scanMarks(shown,view,{cap:SCAN_MARKS}),by=new Map(shown.map(s=>[s.key,s]));
    marks=placed.map(q=>({...by.get(q.key),...q}));
    const alpha=scanning||left>0?1:Math.max(0,1+left/SCAN_SHOW_FADE);
    const out=drawScanMarks(runtime.cx,marks,{alpha,light,still:calm,W,write});
    drawn={ring:!!ring.ring,icons:out.icons,labels:out.labels,radius:ring.radius||0};
    if(!(fade>0)&&!(alpha>0))clear();
  }
  // What the marks show now (world units), so the arrows at the edge do not say it twice (scanner-arrows.js).
  // Each with its box on the screen, so no arrow sits on a mark either.
  const marked=()=>marks.length&&wave?marks.map(m=>{const it=items.find(i=>i.key===m.key);return it?{x:it.x,y:it.y,box:m.box}:null;}).filter(Boolean):[];
  // Tests only (the runtime is never published): the level, what is near, the marks and what the last frame drew.
  function state(){const now=performance.now();return {scanning,charged:charged(),level:level.id,names:level.names,reach:scanReach(level),items:items.map(({id,key,name,shape,d,done,ask})=>({id,key,name,shape,m:Math.round(d/10),done,ask:!!ask})),
    wave:wave?{age:(now-wave.t0)/1000,dur:wave.dur,reach:wave.reach}:null,left:until?Math.max(0,(until-now)/1000):0,
    marks:marks.map(({key,id,shape,label,x,y,edge,ring,done})=>({key,id,shape,label,x,y,edge,ring,done:!!done})),drawn:{...drawn},still:still()};}
  Object.defineProperties(runtime,{scanning:{get:()=>scanning},startScanner:{get:()=>startScanner},stopScanner:{get:()=>stopScanner},updateScanner:{get:()=>updateScanner},drawScan:{get:()=>draw},scanState:{get:()=>state},scanMarked:{get:()=>marked}});
}
