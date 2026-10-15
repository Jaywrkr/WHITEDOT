import {musicIdentity} from './musical-recipes.js';
import {livingChunk} from './living-catalog.js';
import {populationProfile,populatedChunk} from './living-populations.js';
import {encodePlace} from './share-tools.js';
import {placeAddress} from './world-identity.js';
const validPoint=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Math.abs(p.x)<1e12&&Math.abs(p.y)<1e12&&['superficie','bajo','cielo'].includes(p.layer);
export function normalizePracticeTravel(raw){return {version:1,previous:validPoint(raw?.previous)?{x:raw.previous.x,y:raw.previous.y,layer:raw.previous.layer}:null,
 recent:Array.isArray(raw?.recent)?raw.recent.filter(s=>typeof s==='string').slice(-8).map(s=>s.slice(0,80)):[]};}
export function choosePracticePlace(runtime,random,history=[]){
 const R=runtime.REG*runtime.WCH,s=runtime.S,current=runtime.regionOfPos(s.wx,s.wy),previous=musicIdentity(current,runtime.seedOf,runtime.rng,runtime.GEN),candidates=[];
 for(let i=0;i<24;i++){
  const rx=Math.floor(s.wx/R)+Math.floor((random()-.5)*160),ry=Math.floor(s.wy/R)+Math.floor((random()-.5)*160),
   cx=rx*runtime.REG+Math.floor(random()*runtime.REG),cy=ry*runtime.REG+Math.floor(random()*runtime.REG),d=runtime.regionOfPos((cx+.5)*runtime.WCH,(cy+.5)*runtime.WCH);
  if(d.sea||d.key===current.key||Math.abs(cx*runtime.WCH)>1e12-1e6||Math.abs(cy*runtime.WCH)>1e12-1e6)continue;
  const identity=musicIdentity(d,runtime.seedOf,runtime.rng,runtime.GEN),profile=populationProfile(d,runtime.BIOMES[d.z].id,runtime.seedOf,runtime.rng),
   inhabitants=populatedChunk(livingChunk(cx,cy,runtime.WCH,d,runtime.BIOMES[d.z].id,runtime.seedOf,runtime.rng),cx,cy,runtime.WCH,d,profile,runtime.seedOf,runtime.rng);
  if(!inhabitants.length)continue;
  const animal=inhabitants.find(o=>o.group==='fauna')||inhabitants[0],score=(d.genre!==current.genre?6:0)+(identity?.id!==previous?.id?4:0)+(d.z!==current.z?2:0)+(history.includes(identity?.id)?-5:0)+(d.worldFamily?.id!==current.worldFamily?.id?5:0);
  candidates.push({x:animal.x,y:animal.y+(animal.y-75<ry*R?75:-75),layer:'superficie',region:d,identity,population:profile,score});
  if(score>=17&&i>=7)break;
 }return candidates.sort((a,b)=>b.score-a.score)[0]||null;
}
export function initialize(runtime){
 const $=runtime.$;let counter=0;runtime.S.practiceTravel=normalizePracticeTravel(runtime.S.practiceTravel);
 const blocked=()=>!!runtime.setRecording||!!runtime.jam?.loop?.rec||!!runtime.jam?.loop?.armed||!!runtime.scanning;
 function ui(){const world=runtime.inWorld();$('bJump').hidden=!world;$('bJumpBack').hidden=!world||!runtime.S.practiceTravel?.previous;
  $('bJump').disabled=blocked();$('bJumpBack').disabled=blocked();}
 function move(point){runtime.stopAutopilot?.();runtime.ptr=null;runtime.S.destination=null;runtime.S.wx=point.x;runtime.S.wy=point.y;runtime.S.layer=point.layer;
  runtime.MU.dnaT=runtime.regionOfPos(point.x,point.y);runtime.MU.near=[];runtime.MU.singers=[];runtime.MU.nb=null;runtime.MU.nbW=0;runtime.MU.radio=null;runtime.MU.influenced=null;runtime.MU.neighborRadio=null;
  runtime.MU.layers=new Set();runtime.MU.flowers=[];runtime.MU.boltAt=0;runtime.MU.q8?.splice(0);runtime.MU.queue?.splice(0);
  runtime.waves.length=0;runtime.clearSoundCues?.();runtime.curRegion=null;runtime.RP=null;
  if(!runtime.labMode&&typeof location!=='undefined'&&typeof history!=='undefined'){const url=new URL(location.href);url.searchParams.set('addr',encodePlace(placeAddress(runtime.worldIdentity,point.x,point.y,point.layer)));history.replaceState(null,'',url.href);}
  runtime.save();runtime.hud();ui();}
 function jump(){if(!runtime.inWorld()||blocked()||document.querySelector('.modal:not([hidden])'))return false;
  // Commit the current place/progress before replacing coordinates. UI itself emits no note.
  if(!runtime.save())return false;
  const state=runtime.S.practiceTravel=normalizePracticeTravel(runtime.S.practiceTravel),random=runtime.rng(runtime.seedOf(`travel:practice:v1:${Date.now()}:${counter++}`)),point=choosePracticePlace(runtime,random,state.recent);
  if(!point){runtime.toast('No encontré otro lugar. Intenta otra vez.');return false;}
  state.previous={x:runtime.S.wx,y:runtime.S.wy,layer:runtime.S.layer||'superficie'};state.recent.push(point.identity.id);state.recent=state.recent.slice(-8);
  if(runtime.labMode)runtime.labGo('music:'+point.identity.id);
  move(point);runtime.toast(`${point.region.worldFamily?.name||runtime.BIOMES[point.region.z].name} · ${point.identity.name}`);return true;
 }
 function back(){const p=runtime.S.practiceTravel?.previous;if(!runtime.inWorld()||blocked()||!validPoint(p)||!runtime.save())return false;
  const here={x:runtime.S.wx,y:runtime.S.wy,layer:runtime.S.layer||'superficie'};runtime.S.practiceTravel.previous=here;$('mMenu').hidden=true;move(p);return true;}
 $('bJump').onclick=jump;$('bJumpBack').onclick=back;setInterval(ui,250);ui();
 Object.defineProperties(runtime,{jumpPracticePlace:{get:()=>jump},returnPracticePlace:{get:()=>back}});
}
