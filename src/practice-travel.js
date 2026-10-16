import {territoryNucleus} from './territory-journey.js';
import {labScore} from './lab-score.js';
import {musicIdentity} from './musical-recipes.js';
import {livingChunk} from './living-catalog.js';
import {populationProfile,populatedChunk} from './living-populations.js';
import {encodePlace} from './share-tools.js';
import {placeAddress} from './world-identity.js';
import {hybridIdentity} from './musical-hybrids.js';
const validPoint=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Math.abs(p.x)<1e12&&Math.abs(p.y)<1e12&&['superficie','bajo','cielo'].includes(p.layer);
export function normalizePracticeTravel(raw){
 if(Number.isInteger(raw?.version)&&raw.version>1)return raw;
 const bounded=items=>Array.isArray(items)?items.filter(s=>typeof s==='string').slice(-8).map(s=>s.slice(0,160)):[];
 return {...raw,version:1,previous:validPoint(raw?.previous)?{...raw.previous,x:raw.previous.x,y:raw.previous.y,layer:raw.previous.layer}:null,
  recent:bounded(raw?.recent),sounds:bounded(raw?.sounds)};
}
export function practiceSoundIdentity(band,identity=null){return [identity?.hooks?.join(',')||band?.leads?.join(','),band?.electronic?.count||0,Math.floor((band?.electronic?.kit?.snap||0)/350)].join(':');}
export function choosePracticePlace(runtime,random,history=[],festive=false,recentSounds=[]){
 const R=runtime.REG*runtime.WCH,s=runtime.S,current=runtime.regionOfPos(s.wx,s.wy),previous=musicIdentity(current,runtime.seedOf,runtime.rng,runtime.GEN),previousHybrid=hybridIdentity(current,runtime.seedOf,runtime.rng),previousBand=labScore(current,runtime.seedOf,runtime.rng),candidates=[];
 for(let i=0;i<24;i++){
  const rx=Math.floor(s.wx/R)+Math.floor((random()-.5)*160),ry=Math.floor(s.wy/R)+Math.floor((random()-.5)*160),
   cx=rx*runtime.REG+Math.floor(random()*runtime.REG),cy=ry*runtime.REG+Math.floor(random()*runtime.REG),d=runtime.regionOfPos((cx+.5)*runtime.WCH,(cy+.5)*runtime.WCH);
  if(d.sea||d.key===current.key||Math.abs(cx*runtime.WCH)>1e12-1e6||Math.abs(cy*runtime.WCH)>1e12-1e6)continue;
  const identity=musicIdentity(d,runtime.seedOf,runtime.rng,runtime.GEN),profile=populationProfile(d,runtime.BIOMES[d.z].id,runtime.seedOf,runtime.rng),
   inhabitants=populatedChunk(livingChunk(cx,cy,runtime.WCH,d,runtime.BIOMES[d.z].id,runtime.seedOf,runtime.rng),cx,cy,runtime.WCH,d,profile,runtime.seedOf,runtime.rng);
  if(!inhabitants.length)continue;
  const band=labScore(d,runtime.seedOf,runtime.rng),hybrid=hybridIdentity(d,runtime.seedOf,runtime.rng),animal=inhabitants.find(o=>o.group==='fauna')||inhabitants[0],score=(d.genre!==current.genre?6:0)+(identity?.id!==previous?.id?4:0)+(d.z!==current.z?2:0)+(history.some(s=>s===identity?.id||s.startsWith(identity?.id+'~'))?-5:0)+(d.worldFamily?.id!==current.worldFamily?.id?5:0)+(hybrid?.id!==previousHybrid?.id?4:0)+(band?.id!==previousBand?.id?6:0)+(band?.leads.join(',')!==previousBand?.leads.join(',')?4:0)+(JSON.stringify(band?.kick)!==JSON.stringify(previousBand?.kick)?3:0)+(festive&&band?.festive?25:0)+Math.min(5,Math.abs((d.bpm||100)-(current.bpm||100))/8)-(recentSounds.some(sound=>sound===practiceSoundIdentity(band,identity)||sound===practiceSoundIdentity(band))?12:0);
  candidates.push({x:animal.x,y:animal.y+(animal.y-75<ry*R?75:-75),layer:'superficie',region:d,identity,hybrid,band,population:profile,score});
  if(score>=21&&i>=7&&(!festive||band?.festive))break;
 }return candidates.sort((a,b)=>b.score-a.score)[0]||null;
}
// A monotonic spiral allocates each automatic arrival region only once.
export function arrivalCell(index){
 if(index===0)return {x:0,y:0};const ring=Math.ceil((Math.sqrt(index+1)-1)/2),side=ring*2,d=(side+1)**2-1-index;
 if(d<side)return {x:ring-d,y:-ring};if(d<side*2)return {x:-ring,y:-ring+d-side};
 if(d<side*3)return {x:-ring+d-side*2,y:ring};return {x:ring,y:ring-d+side*3};
}
export function nextArrivalPlace(runtime,state){
 const size=runtime.REG*runtime.WCH,s=runtime.S,origin=Number.isSafeInteger(state.arrivalOrigin?.x)&&Number.isSafeInteger(state.arrivalOrigin?.y)?state.arrivalOrigin:{x:Math.floor(s.wx/size),y:Math.floor(s.wy/size)},start=Number.isSafeInteger(state.arrivalCursor)&&state.arrivalCursor>=1?state.arrivalCursor:1;
 const current=runtime.regionOfPos(s.wx,s.wy),candidates=[];let cursor=start;
 for(let n=0;n<96&&candidates.length<8;n++,cursor++){
  if(!Number.isSafeInteger(cursor+1))break;
  const cell=arrivalCell(cursor),rx=origin.x+cell.x,ry=origin.y+cell.y;
  if(Math.abs(rx*size)>1e12-size||Math.abs(ry*size)>1e12-size)continue;
  const d=runtime.regionOfPos((rx+.5)*size,(ry+.5)*size);if(d.sea)continue;
  const point=territoryNucleus(rx,ry,size,runtime.seedOf),identity=musicIdentity(d,runtime.seedOf,runtime.rng,runtime.GEN),band=labScore(d,runtime.seedOf,runtime.rng),sound=practiceSoundIdentity(band,identity);
  const score=(d.genre!==current.genre?6:0)+(d.worldFamily?.id!==current.worldFamily?.id?3:0)-(state.sounds.includes(sound)?8:0)+(runtime.seedOf('arrival:contrast:v1:'+d.key)%100)/100;
  candidates.push({...point,layer:'superficie',region:d,identity,band,score});
 }
 const point=candidates.sort((a,b)=>b.score-a.score)[0];return point?{point,origin,cursor}:null;
}
export function initialize(runtime){
 const $=runtime.$;let counter=0;runtime.S.practiceTravel=normalizePracticeTravel(runtime.S.practiceTravel);
 const blocked=()=>runtime.S.practiceTravel?.version>1||!!runtime.duetRoom||!!runtime.setRecording||!!runtime.jam?.loop?.rec||!!runtime.jam?.loop?.armed||!!runtime.scanning;
 function ui(){const world=runtime.inWorld();$('bJump').hidden=!world;$('bJumpBack').hidden=!world||!runtime.S.practiceTravel?.previous;
  $('bJump').disabled=blocked();$('bJumpBack').disabled=blocked();}
 function move(point,state,prepare=null,updateAddress=true){
  const old={wx:runtime.S.wx,wy:runtime.S.wy,layer:runtime.S.layer,destination:runtime.S.destination,practiceTravel:runtime.S.practiceTravel};
  runtime.S.wx=point.x;runtime.S.wy=point.y;runtime.S.layer=point.layer;runtime.S.practiceTravel=state;runtime.S.destination=null;
  // Persist the complete destination before changing queues, URL or navigation.
  if(!runtime.save()){Object.assign(runtime.S,old);ui();return false;}
  runtime.resetMusicJourney?.();prepare?.();runtime.stopAutopilot?.();runtime.ptr=null;runtime.S.destination=null;runtime.S.wx=point.x;runtime.S.wy=point.y;runtime.S.layer=point.layer;
  runtime.MU.dnaT=runtime.regionOfPos(point.x,point.y);runtime.MU.near=[];runtime.MU.singers=[];runtime.MU.nb=null;runtime.MU.nbW=0;runtime.MU.radio=null;runtime.MU.influenced=null;runtime.MU.neighborRadio=null;
  runtime.MU.layers=new Set();runtime.MU.flowers=[];runtime.MU.boltAt=0;runtime.MU.q8?.splice(0);runtime.MU.queue?.splice(0);
  runtime.waves.length=0;runtime.clearSoundCues?.();runtime.clearMusicalFrames?.();runtime.curRegion=null;runtime.RP=null;
  if(updateAddress&&!runtime.labMode&&typeof location!=='undefined'&&typeof history!=='undefined'){const url=new URL(location.href);url.searchParams.set('addr',encodePlace(placeAddress(runtime.worldIdentity,point.x,point.y,point.layer)));history.replaceState(null,'',url.href);}
  runtime.hud();ui();return true;}
 function jump(){if(!runtime.inWorld()||blocked()||document.querySelector('.modal:not([hidden])'))return false;
  // Commit the current place/progress before replacing coordinates. UI itself emits no note.
  if(!runtime.save())return false;
  const state=normalizePracticeTravel(runtime.S.practiceTravel),random=runtime.rng(runtime.seedOf(`travel:practice:v1:${Date.now()}:${counter++}`)),point=choosePracticePlace(runtime,random,state.recent,counter%3===0,state.sounds);
  if(!point){runtime.toast('No encontré otro lugar. Intenta otra vez.');return false;}
  state.previous={x:runtime.S.wx,y:runtime.S.wy,layer:runtime.S.layer||'superficie'};state.recent.push(point.identity.id+'~'+(point.hybrid?.id||'native'));state.recent=state.recent.slice(-8);state.sounds=[...state.sounds,practiceSoundIdentity(point.band,point.identity)].slice(-8);
  if(!move(point,state,runtime.labMode?()=>runtime.labGo(point.band?'band:'+point.band.id:'music:'+point.identity.id):null))return false;runtime.toast(`${point.region.worldFamily?.name||runtime.BIOMES[point.region.z].name} · ${point.band?.festive?point.band.name:point.identity.name}`);return true;
 }
 function back(){const p=runtime.S.practiceTravel?.previous;if(!runtime.inWorld()||blocked()||!validPoint(p)||!runtime.save())return false;
  const here={x:runtime.S.wx,y:runtime.S.wy,layer:runtime.S.layer||'superficie'};const state={...normalizePracticeTravel(runtime.S.practiceTravel),previous:here};if(!move(p,state))return false;$('mMenu').hidden=true;return true;}
 function travel(point){if(!runtime.inWorld()||blocked()||!validPoint(point)||runtime.duetRoom||!runtime.save())return false;
  const state=normalizePracticeTravel(runtime.S.practiceTravel),band=labScore(runtime.regionOfPos(point.x,point.y),runtime.seedOf,runtime.rng);state.previous={x:runtime.S.wx,y:runtime.S.wy,layer:runtime.S.layer||'superficie'};state.sounds=[...state.sounds,practiceSoundIdentity(band,musicIdentity(runtime.regionOfPos(point.x,point.y),runtime.seedOf,runtime.rng,runtime.GEN))].slice(-8);return move(point,state);}
 let arrived=false;
 function dailyArrival(){
  const s=runtime.S,params=new URLSearchParams(globalThis.location?.search||'');
  if(arrived||blocked()||!s.help?.mundo||s.previewSeed||runtime.arrivedByAddress||params.has('addr')||!runtime.save())return false;
  const state=normalizePracticeTravel(s.practiceTravel),serial=Number.isSafeInteger(state.arrivals)?state.arrivals:0;
  const allocated=nextArrivalPlace(runtime,state);if(!allocated)return false;const {point,origin,cursor}=allocated;
  state.arrivalOrigin=origin;state.arrivalCursor=cursor;
  state.previous={x:s.wx,y:s.wy,layer:s.layer||'superficie'};state.arrivals=serial+1;
  state.recent=[...state.recent,point.identity.id+'~'+(point.hybrid?.id||'native')].slice(-8);
  state.sounds=[...state.sounds,practiceSoundIdentity(point.band,point.identity)].slice(-8);
  const path={px:s.px,py:s.py};if(s.mode==='camino'){s.px+=(runtime.REG*runtime.WCH)*(.2+serial%5*.05);s.py=runtime.pathY(s.px);}
  if(!move(point,state,null,false)){Object.assign(s,path);return false;}arrived=true;return true;
 }
 // A new document is a fresh visit. Background/resume never runs this again.
 // Explicit addresses and preview saves retain their exact coordinates.
 if(runtime.scopeHadSave)dailyArrival();
 $('bJump').onclick=jump;$('bJumpBack').onclick=back;setInterval(ui,250);ui();
 Object.defineProperties(runtime,{canPracticeTravel:{get:()=>()=>!blocked()&&!runtime.duetRoom},travelPracticePoint:{get:()=>travel},dailyArrival:{get:()=>dailyArrival},jumpPracticePlace:{get:()=>jump},returnPracticePlace:{get:()=>back}});
}
