// Mapa del universo (Jay, 29 Oct 2026, alpha.235; docs/MUNDO.md#mapa-del-universo): a screen of its own, opened with
// one touch from the World (#bUniverseMap) or from the Bitácora's map. Three zooms (pinch, + / −, the wheel), drag to
// move, «centrar en mí». Fog: only what you visited has colour. A tap opens a card: «Ir» where today's rules already
// let you go (a place of the ring you can travel to, «Volver al anillo», a favourite); «Marcar» everywhere else. One
// mark at a time: the compass by the cube and the line under the HUD lead to it (places-ring.js asks mapMarkRoute).
// Nothing is drawn while it is closed; the optional mini map (Ajustes, off by default) redraws twice a second.
import {openSurface} from './frame-state.js';
import {freeOpen} from './journey-mode.js';
import {sameWorld} from './world-identity.js';
import {formatDistance} from './player-profile-model.js';
import {LANDMARK_TYPES} from './landmarks.js';
import {skyFigure,skyStars,skyLines} from './sky-map-model.js';
import {LIVE_COLORS,liveDefinition} from './live-encounters-model.js';
import {UMAP_VERSION,UMAP_LEVEL_NAMES,UMAP_BANDS,UNITS_PER_KM,normalizeUniverseMap,noteLive,fogCells,bandCells,bandProgress,currentBand,levelOf,viewFor,stepLevel,zoomAt,toWorld,hitTest,cardActions,markOf,markRoute,clampScale,spanOf} from './universe-map-model.js';
import {buildFog,drawUniverseMap} from './universe-map-art.js';

// Room kept free for the buttons at the sides and the header and legend above and below.
const INSET=Object.freeze({x:64,y:84});
const hexA=(hex,a)=>{const n=parseInt(String(hex).slice(1),16);return Number.isFinite(n)?`rgba(${n>>16&255},${n>>8&255},${n&255},${a})`:null;};

export function initialize(runtime){
 const $=id=>runtime.$?.(id)||document.getElementById(id);
 let owner=null,view=null,raf=0,draws=0,items=[],scene=null,fog=null,fogKey='',bandsKey='',bandList=[],heading=-Math.PI/2,last=null,card=null,miniKey='',miniAt=0,miniDraws=0,drawnIcons=[];
 const pointers=new Map();let gesture=null;
 const RP=()=>runtime.REG*runtime.WCH;
 // The save: S.universeMap (normalizeUniverseMap keeps unknown fields and a later version as it is).
 function book(){if(owner!==runtime.S){owner=runtime.S;owner.universeMap=normalizeUniverseMap(owner.universeMap);fog=null;fogKey='';bandsKey='';}return owner.universeMap;}
 const usable=()=>book().version===UMAP_VERSION;
 // Where the map belongs: the free World after the Journey, on the surface, outside every level, the Refugio and the finales.
 function allowed(){const S=runtime.S;return !!(S&&runtime.inWorld?.()&&freeOpen(S.journey)&&(S.layer||'superficie')==='superficie'&&!runtime.placeRun?.()&&!runtime.houseActive?.()&&!runtime.travelInLevel?.()&&!runtime.journeyFinaleState?.()?.running&&!runtime.songStageState?.()?.running&&!runtime.activityActive&&!runtime.labMode);}
 const me=()=>({x:runtime.S.wx,y:runtime.S.wy});
 const biomeId=(x,y)=>{try{const z=runtime.biomeOfPos?runtime.biomeOfPos(x,y):runtime.regionOfPos?.(x,y)?.z;return runtime.BIOMES?.[z]?.id||'vacio';}catch(_){return 'vacio';}};
 const colorOf=id=>runtime.placeColor?.(id,LIVE_COLORS[id])||LIVE_COLORS[id]||'#ffffff';
 // The fog, rebuilt only when the regions you visited change (or the world, or the colours for colour blindness).
 function fogNow(){const places=runtime.S.places||{},keys=Object.keys(places),key=keys.length+':'+(keys.at(-1)||'')+':'+RP()+':'+(runtime.S.colorSafe?1:0)+':'+(runtime.S.worldSeed||'');
  if(key!==fogKey){fogKey=key;const r=RP();fog=buildFog(fogCells(places),c=>{const id=biomeId((c.rx+.5)*r,(c.ry+.5)*r);return id==='vacio'?'rgba(255,255,255,.07)':hexA(colorOf(id),.36);});}return fog;}
 // The distance rings: how much of each disc you discovered; a full one is won (gold) and kept with its day.
 function bandsNow(){const places=runtime.S.places||{},key=Object.keys(places).length+':'+RP();if(key!==bandsKey){bandsKey=key;bandList=UMAP_BANDS.map(km=>bandProgress(places,RP(),km,cells(km)));}return bandList;}
 const cellCache=new Map();function cells(km){const k=km+':'+RP();if(!cellCache.has(k))cellCache.set(k,bandCells(RP(),km));return cellCache.get(k);}
 function checkBands(){if(!usable()||book().readOnly)return;const q=book();for(const b of bandsNow())if(b.complete&&!q.bands[b.km]){q.bands[b.km]=runtime.S.todayKey||'';if(runtime.save?.()===false){delete q.bands[b.km];return;}runtime.toast?.(`<em>Mapa del universo</em> · Todo hasta ${b.km} km descubierto`,{level:2,category:'ganado'});}}
 // Everything the map shows, as plain points.
 function collect(){
  const S=runtime.S,r=RP(),out=[],q=book(),state=runtime.ringState?.(),portals=runtime.ringPortals?.()||[],center=state?.center||null;
  for(const p of portals)out.push({kind:'place',id:p.id,x:p.x,y:p.y,name:p.name,open:p.open,complete:p.complete,ink:p.ink,stars:p.stars});
  const studio=S.studio&&Number.isFinite(S.studio.x)&&Number.isFinite(S.studio.y)?{x:S.studio.x,y:S.studio.y}:null,home=!!(center&&freeOpen(S.journey));
  if(studio)out.push({kind:'refugio',id:'refugio',x:studio.x,y:studio.y,name:'Tu Refugio',home:home&&Math.hypot(studio.x-center.x,studio.y-center.y)<400});
  if(home&&!(studio&&Math.hypot(studio.x-center.x,studio.y-center.y)<400))out.push({kind:'ringHome',id:'ring',x:center.x,y:center.y,name:'Centro del anillo'});
  for(const key of Object.keys(S.landmarks||{})){const [rx,ry]=key.slice(3).split(',').map(Number);if(!Number.isFinite(rx)||!Number.isFinite(ry))continue;let lm=null;try{lm=runtime.landmarkAt?.(rx,ry);}catch(_){}if(lm)out.push({kind:'landmark',id:lm.id||key,x:lm.x,y:lm.y,type:lm.type,name:lm.name||LANDMARK_TYPES[lm.type]?.name||'Hito'});}
  for(const [id,v] of Object.entries(S.heardLm||{})){if(S.landmarks?.[id]||!Array.isArray(v))continue;const [rx,ry,type]=v;if(!Number.isFinite(rx)||!Number.isFinite(ry))continue;out.push({kind:'heard',id,x:(rx+.5)*r,y:(ry+.5)*r,type,name:LANDMARK_TYPES[type]?.name||'Algo lejano'});}
  const sky=S.skyMap;if(sky&&sky.version===1&&sky.sites&&typeof sky.sites==='object')for(const [id,s] of Object.entries(sky.sites)){const f=skyFigure(s?.fig);if(!f||!Number.isFinite(s.x)||!Number.isFinite(s.y))continue;const known=(sky.figures?.[f.id]?.done||0)>0;
   out.push({kind:'sky',id,x:s.x,y:s.y,name:f.secret&&!known?'???':f.name,done:!!s.done,lit:s.done?f.stars.length:Math.min(f.stars.length,s.lit|0),total:f.stars.length,stars:skyStars(s),lines:skyLines(f)});}
  if(usable())for(const e of book().live){const def=liveDefinition(e.k);if(!def)continue;out.push({kind:'live',id:'live:'+e.k+':'+e.x+','+e.y,x:e.x,y:e.y,name:def.name,color:colorOf(def.biome),won:e.w,live:e.k});}
  for(const p of runtime.favorites||[])if((p.layer||'superficie')==='superficie'&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&(!p.address||!runtime.worldIdentity||sameWorld(p.address,runtime.worldIdentity)))out.push({kind:'favorite',id:p.id,x:p.x,y:p.y,name:p.name||'Favorito',point:p});
  for(const [key,a] of Object.entries(S.anomalies||{})){const [rx,ry]=key.split(',').map(Number);if(Number.isFinite(rx)&&Number.isFinite(ry))out.push({kind:'rare',id:'rare:'+key,x:(rx+.5)*r,y:(ry+.5)*r,name:'Rareza'});}
  if(usable()&&q.mark)out.push({kind:'mark',id:'mark',x:q.mark.x,y:q.mark.y,name:q.mark.name});
  return {items:out,center,next:state?.next?portals.find(p=>p.id===state.next)||null:null};
 }
 // The points the universe zoom must fit: what is yours and every region visited (cached with the scene).
 let pts=[];
 function sceneNow(){const c=collect();items=c.items;pts=items.filter(i=>i.kind!=='heard').map(i=>({x:i.x,y:i.y})).concat(fogCells(runtime.S.places||{}).map(f=>({x:(f.rx+.5)*RP(),y:(f.ry+.5)*RP()})));const band=bandsNow();return {fog:fogNow(),RP:RP(),items,me:{...me(),heading},next:c.next?{x:c.next.x,y:c.next.y,name:c.next.name}:null,mark:usable()?book().mark:null,bands:band.map(b=>({km:b.km,complete:b.complete})),center:c.center};}
 const context=()=>({me:me(),ring:scene?.center||runtime.ringState?.()?.center||null,points:pts});

 // ---------- the screen ----------
 const box=$('mUniverseMap'),cv=$('umapCv');
 const size=()=>{const W=cv.clientWidth||window.innerWidth,H=cv.clientHeight||window.innerHeight;return [W,H];};
 function fit(){const [W,H]=size(),dpr=Math.min(2,window.devicePixelRatio||1);if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);}return [W,H,dpr];}
 function header(){const [W,H]=size(),level=levelOf(view,W,H,INSET);$('umapLevel').textContent=UMAP_LEVEL_NAMES[level];box.dataset.level=level;
  const d=Math.hypot(runtime.S.wx,runtime.S.wy)/UNITS_PER_KM,b=currentBand(bandsNow(),d);$('umapShare').textContent=b?(b.complete?`Hasta ${b.km} km · todo descubierto`:`Hasta ${b.km} km · ${b.pct} % descubierto`):'';
  $('umapIn').disabled=!stepLevel(view,1,W,H,context(),INSET);$('umapOut').disabled=!stepLevel(view,-1,W,H,context(),INSET);}
 function draw(){raf=0;if(box.hidden){return;}draws++;const [W,H,dpr]=fit(),c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);const level=levelOf(view,W,H,INSET);scene.level=level;
  drawnIcons=drawUniverseMap(c,W,H,view,scene,{names:spanOf(view,W,H,INSET)<30000,bottom:24});header();}
 const redraw=()=>{if(!raf&&!box.hidden)raf=requestAnimationFrame(draw);};
 function open(level='region'){if(!box)return false;book();checkBands();box.hidden=false;const mm=$('miniMap');if(mm)mm.hidden=true;scene=sceneNow();const [W,H]=fit();view=viewFor(level,context(),W,H,INSET);hideCard();box.dataset.level=level;draw();runtime.unlock?.('mapa1');return true;}
 function close(){if(box)box.hidden=true;hideCard();pointers.clear();gesture=null;if(raf){cancelAnimationFrame(raf);raf=0;}}
 function setLevel(level){if(box.hidden)return false;const [W,H]=size();view=viewFor(level,context(),W,H,INSET);redraw();return true;}
 function step(dir){const [W,H]=size(),v=stepLevel(view,dir,W,H,context(),INSET);if(v){view=v;redraw();}}
 function centerMe(){view={...view,x:runtime.S.wx,y:runtime.S.wy};redraw();}
 // ---------- the card ----------
 const kindLine=it=>{switch(it.kind){
  case 'place':return it.complete?'Lugar del anillo · completo':it.open?'Lugar del anillo · abierto':'Lugar del anillo · cerrado';
  case 'ringHome':return 'El centro de los once lugares';case 'refugio':return 'Donde está tu Refugio';case 'favorite':return 'Tu lugar guardado';
  case 'sky':return it.done?'Constelación · completa':`Constelación · ${it.lit} de ${it.total}`;
  case 'live':return it.won?'Encuentro vivo · logrado':'Encuentro vivo · visto';
  case 'landmark':return 'Hito visitado';case 'heard':return 'Rumor · lo oíste, aún no llegaste';case 'rare':return 'Rareza encontrada';
  case 'mark':return 'Tu marca · la brújula te lleva';case 'me':return 'Tú';default:return it.visited?'Lugar explorado':'Sin explorar';}};
 function flags(it){return {canTravel:it.kind==='place'&&!!runtime.ringCanTravel?.(it.id),canHome:(it.kind==='ringHome'||it.home)&&!!runtime.ringHomePoint?.(),canFavorite:it.kind==='favorite'&&!!runtime.canPracticeTravel?.()&&!!runtime.visitWorldAddress&&!!it.point?.address,mark:usable()?book().mark:null};}
 function showCard(it){card=it;const a=cardActions(it,flags(it)),d=Math.hypot(it.x-runtime.S.wx,it.y-runtime.S.wy);
  $('umapCardName').textContent=it.kind==='me'?'Tú':it.name;$('umapCardWhat').textContent=kindLine(it);
  $('umapCardDist').textContent=it.kind==='me'?`A ${formatDistance(Math.hypot(it.x,it.y))} del origen`:d<300?'Aquí':`A ${formatDistance(d)} de ti`;
  const go=$('umapGo'),mark=$('umapMark');go.hidden=!a.go;go.textContent=a.go==='ring'?'Volver al anillo':'Ir';go.dataset.go=a.go||'';
  mark.hidden=!a.mark;mark.textContent=a.mark==='unmark'?'Quitar marca':'Marcar';mark.dataset.mark=a.mark||'';mark.classList.toggle('gold',a.mark==='mark'&&!a.go);go.classList.toggle('gold',!!a.go);
  $('umapCard').hidden=false;box.dataset.card=it.kind;}
 function hideCard(){card=null;const c=$('umapCard');if(c)c.hidden=true;if(box)delete box.dataset.card;}
 // ---------- the mark ----------
 function setMark(it){if(!usable()||book().readOnly)return false;const q=book(),before=q.mark,m=markOf(it);if(!m)return false;q.mark=m;if(runtime.save?.()===false){q.mark=before;runtime.toast?.('No se pudo guardar la marca.',{force:true});return false;}if(runtime.S.destination)runtime.cancelDestination?.();scene=sceneNow();redraw();return true;}
 function clearMark(){if(!usable())return false;const q=book(),before=q.mark;if(!before)return false;q.mark=null;if(runtime.save?.()===false){q.mark=before;return false;}if(!box.hidden){scene=sceneNow();redraw();}return true;}
 // The compass's target while there is a mark (places-ring.js): reaching it clears it, with one quiet line.
 function route(){if(!usable())return null;const q=book();if(!q.mark)return null;const r=markRoute(q.mark,me());if(r.arrived){clearMark();runtime.toast?.('Llegaste a tu marca');return null;}return r;}
 function go(){const it=card;if(!it)return;const a=cardActions(it,flags(it));let ok=false;
  if(a.go==='place')ok=!!runtime.ringTravel?.(it.id);else if(a.go==='ring')ok=!!runtime.ringHome?.();
  else if(a.go==='favorite'){runtime.rememberFavoriteReturn?.(it.point);ok=!!runtime.visitWorldAddress?.(it.point.address);if(!ok)runtime.clearFavoriteReturn?.();}
  if(ok){close();const j=$('mJournal');if(j)j.hidden=true;}else showCard(it);}
 function markAction(){const it=card;if(!it)return;const a=cardActions(it,flags(it));if(a.mark==='unmark'){clearMark();hideCard();return;}if(a.mark==='mark'&&setMark(it)){runtime.toast?.('Marca puesta · la brújula te lleva');showCard({...it});}}
 // ---------- touch, mouse and keys ----------
 function tap(px,py){const [W,H]=size(),ring=drawnIcons.find(d=>d.kind==='ring');let it=hitTest(ring?items.filter(i=>i.kind!=='place'&&i.kind!=='ringHome'):items,view,W,H,px,py);
  // Far out the eleven places are one small ring: its card is the ring's centre («Volver al anillo»).
  if(ring&&Math.hypot(ring.x-px,ring.y-py)<26&&(!it||['live','landmark','heard','rare','sky','favorite'].includes(it.kind))){const c=scene?.center;if(c)it={kind:'ringHome',id:'ring',x:c.x,y:c.y,name:'Los once lugares'};}const meAt=drawnIcons.find(d=>d.kind==='me');if(meAt&&Math.hypot(meAt.x-px,meAt.y-py)<16&&(!it||it.kind!=='mark'))it={kind:'me',x:runtime.S.wx,y:runtime.S.wy,name:'Tú'};
  if(!it){const [wx,wy]=toWorld(view,W,H,px,py),r=RP(),key=Math.floor(wx/r)+','+Math.floor(wy/r),visited=!!runtime.S.places?.[key];let name='Este punto';if(visited){const id=biomeId(wx,wy);name=runtime.BIOMES?.find(b=>b.id===id)?.name||name;}it={kind:'spot',id:'spot',x:Math.round(wx),y:Math.round(wy),name,visited};}
  showCard(it);}
 function onDown(e){cv.setPointerCapture?.(e.pointerId);pointers.set(e.pointerId,{x:e.offsetX,y:e.offsetY,x0:e.offsetX,y0:e.offsetY,t:performance.now()});
  if(pointers.size===2){const [a,b]=[...pointers.values()];gesture={pinch:Math.hypot(a.x-b.x,a.y-b.y),moved:true};}else if(pointers.size===1)gesture={moved:false};e.preventDefault();}
 function onMove(e){const p=pointers.get(e.pointerId);if(!p)return;const [W,H]=size(),dx=e.offsetX-p.x,dy=e.offsetY-p.y;p.x=e.offsetX;p.y=e.offsetY;
  if(pointers.size>=2){const [a,b]=[...pointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(gesture?.pinch&&d>0){view=zoomAt(view,d/gesture.pinch,(a.x+b.x)/2,(a.y+b.y)/2,W,H);gesture.pinch=d;}view={...view,x:view.x-dx/2/view.scale,y:view.y-dy/2/view.scale};redraw();return;}
  if(gesture&&!gesture.moved&&Math.hypot(p.x-p.x0,p.y-p.y0)>8)gesture.moved=true;if(gesture?.moved){view={...view,x:view.x-dx/view.scale,y:view.y-dy/view.scale};redraw();}}
 function onUp(e){const p=pointers.get(e.pointerId);pointers.delete(e.pointerId);if(!p)return;if(pointers.size===0){const quick=performance.now()-p.t<600;if(gesture&&!gesture.moved&&quick)tap(e.offsetX,e.offsetY);gesture=null;}}
 function onWheel(e){e.preventDefault();const [W,H]=size();view=zoomAt(view,Math.exp(-Math.max(-300,Math.min(300,e.deltaY*(e.deltaMode===1?33:1)))/250),e.offsetX,e.offsetY,W,H);redraw();}
 // Escape and the phone's back: first the card, then the map (accessibility.js closes the dialog otherwise).
 window.addEventListener('keydown',e=>{if(!box||box.hidden)return;if(e.key==='Escape'&&card){e.preventDefault();e.stopImmediatePropagation();hideCard();return;}
  if(e.target?.matches?.('input,select,textarea'))return;if(e.key==='+'||e.key==='='){e.preventDefault();step(1);}else if(e.key==='-'||e.key==='_'){e.preventDefault();step(-1);}
  else if(/^Arrow/.test(e.key)&&!e.target?.matches?.('button,summary')){e.preventDefault();const [W,H]=size(),k=Math.min(W,H)/4/view.scale;view={...view,x:view.x+(e.key==='ArrowLeft'?-k:e.key==='ArrowRight'?k:0),y:view.y+(e.key==='ArrowUp'?-k:e.key==='ArrowDown'?k:0)};redraw();}},true);
 if(box&&cv){cv.addEventListener('pointerdown',onDown);cv.addEventListener('pointermove',onMove);cv.addEventListener('pointerup',onUp);cv.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);gesture=null;});cv.addEventListener('wheel',onWheel,{passive:false});
  $('umapClose').onclick=close;$('umapIn').onclick=()=>step(1);$('umapOut').onclick=()=>step(-1);$('umapMe').onclick=centerMe;$('umapGo').onclick=go;$('umapMark').onclick=markAction;$('umapCardClose').onclick=()=>{hideCard();cv.focus?.({preventScroll:true});};
  $('umapLegend')?.addEventListener('toggle',()=>{hideCard();});
  window.addEventListener('resize',()=>{if(!box.hidden)redraw();});
  // A dialog closed by accessibility.js (Escape) stops drawing too.
  new MutationObserver(()=>{if(box.hidden){hideCard();if(raf){cancelAnimationFrame(raf);raf=0;}}}).observe(box,{attributes:true,attributeFilter:['hidden']});}

 // ---------- the button in the World, the mini map and the heading ----------
 const button=$('bUniverseMap'),mini=$('miniMap'),miniCv=$('miniMapCv'),toggle=$('miniMapSetting');
 if(button)button.onclick=()=>{$('mMenu')&&($('mMenu').hidden=true);open('region');};
 if(mini)mini.onclick=()=>open('region');
 if(toggle){toggle.checked=usable()&&book().mini;toggle.onchange=()=>{if(!usable())return;const q=book(),before=q.mini;q.mini=toggle.checked;if(runtime.save?.()===false){q.mini=before;toggle.checked=before;}miniKey='';tick();};}
 function drawMini(){if(!miniCv)return;miniDraws++;const W=88,H=88,dpr=Math.min(2,window.devicePixelRatio||1);if(miniCv.width!==W*dpr){miniCv.width=W*dpr;miniCv.height=H*dpr;}const c=miniCv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);
  const s=sceneNow();s.level='region';s.items=s.items.filter(i=>['place','refugio','mark','ringHome'].includes(i.kind));drawUniverseMap(c,W,H,{x:runtime.S.wx,y:runtime.S.wy,scale:W/24000},s,{names:false,scale:false,words:false});}
 function tick(){const S=runtime.S;if(!S)return;if(owner!==S){book();if(toggle)toggle.checked=usable()&&book().mini;}
  const p=me();if(last){const dx=p.x-last.x,dy=p.y-last.y;if(Math.hypot(dx,dy)>20)heading=Math.atan2(dy,dx);}last=p;
  const ok=allowed();if(button&&button.hidden===ok)button.hidden=!ok;
  // Its switch in Ajustes, once the free World is open (in both views: it is a way to find your way, not a tool).
  const row=$('miniMapRow'),free=freeOpen(S.journey);if(row&&row.hidden===free)row.hidden=!free;
  const showMini=ok&&usable()&&book().mini&&!openSurface('.modal:not([hidden])');if(mini&&mini.hidden===showMini)mini.hidden=!showMini;
  if(showMini){const key=Math.round(p.x/40)+','+Math.round(p.y/40)+':'+Object.keys(S.places||{}).length+':'+(book().mark?.x??'')+':'+Math.round(heading*8);if(key!==miniKey||performance.now()-miniAt>4000){miniKey=key;miniAt=performance.now();drawMini();}}
  if(ok)checkBands();}
 setInterval(()=>{try{tick();}catch(_){}},500);

 // ---------- the Bitácora's map and the shared image ----------
 // A still view of everything you discovered (the Bitácora draws it; a tap on it opens the map).
 function fitView(W,H,margin=24){const pts=context().points.concat([me()]);let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;for(const p of pts){x0=Math.min(x0,p.x);y0=Math.min(y0,p.y);x1=Math.max(x1,p.x);y1=Math.max(y1,p.y);}
  if(!Number.isFinite(x0))return {x:runtime.S.wx,y:runtime.S.wy,scale:Math.min(W,H)/16000};const span=Math.max(16000,x1-x0+RP(),y1-y0+RP());return {x:(x0+x1)/2,y:(y0+y1)/2,scale:clampScale(Math.min(W-2*margin,H-2*margin)/span,W,H)};}
 function preview(canvas,{X=0,Y=0,W=canvas.width,H=canvas.height,margin=24}={}){const c=canvas.getContext('2d');book();const s=sceneNow();const v=fitView(W,H,margin);s.level=levelOf(v,W,H);c.save();c.translate(X,Y);c.beginPath();c.rect(0,0,W,H);c.clip();const drawn=drawUniverseMap(c,W,H,v,s,{names:spanOf(v,W,H)<30000,scale:true,bottom:16});c.restore();return {drawn,items:s.items,view:v};}
 // Tests only (the runtime is never published): the state, a tap at a point of the screen, the level.
 function state(){const [W,H]=box&&!box.hidden?size():[390,844];return {open:!!box&&!box.hidden,draws,miniDraws,level:view?levelOf(view,W,H,INSET):null,view,book:book(),allowed:allowed(),items:items.map(i=>({kind:i.kind,id:i.id,x:i.x,y:i.y,name:i.name})),drawn:drawnIcons.slice(),card:card?{kind:card.kind,id:card.id,name:card.name}:null,bands:bandsNow().map(b=>({km:b.km,done:b.done,total:b.total,pct:b.pct,complete:b.complete})),fogCells:fogCells(runtime.S.places||{}).length,heading};}
 function noteSeen(s){if(!usable()||!s)return false;return noteLive(book(),{kind:s.kind,x:s.x,y:s.y,won:!!s.won,day:runtime.S.todayKey||''});}
 Object.defineProperties(runtime,{
  openUniverseMap:{get:()=>open},closeUniverseMap:{get:()=>close},universeMapLevel:{get:()=>setLevel},universeMapPreview:{get:()=>preview},
  mapMarkRoute:{get:()=>route},clearMapMark:{get:()=>clearMark},mapNoteLive:{get:()=>s=>{const ok=noteSeen(s);if(box&&!box.hidden){scene=sceneNow();redraw();}return ok;}},
  universeMapState:{get:()=>state},universeMapTap:{get:()=>(px,py)=>{if(box.hidden)return null;tap(px,py);return card?{kind:card.kind,id:card.id,name:card.name}:null;}},
  universeMapShow:{get:()=>it=>{if(box.hidden||!it)return false;showCard(it);return true;}},universeMapTick:{get:()=>tick}
 });
 book();tick();
}
