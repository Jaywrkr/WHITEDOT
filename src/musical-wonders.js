import {WONDERS,WONDER_CELL,wonderCell,wonderDefinition,normalizeWonders} from './musical-wonders-model.js';
import {drawWonder,drawWonderGift,drawMagicShow} from './musical-wonders-art.js';
import {playWonderNote} from './musical-wonders-audio.js';
import {makeRareCard,normalizeRareBook,storeRareCard} from './rare-card-model.js';
import {pulseCrossed} from './pulse-forms.js';
export function initialize(r){
 let owner=null,scope='',cache=new Map(),clock=0,queue=[],show=null,song=null,last=null;
 const reduced=()=>r.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
 const active=()=>r.inWorld()&&!r.activityActive&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!document.hidden&&!r.scanning&&!r.noticeLane?.inspecting&&!document.querySelector('.modal:not([hidden]),#fxPanel:not([hidden]),#mirrorPanel:not([hidden])');
 function book(){
  const key=JSON.stringify(r.worldIdentity)+':'+(r.S.layer||'superficie');
  if(owner!==r.S||scope!==key){owner=r.S;scope=key;owner.musicalWonders=normalizeWonders(owner.musicalWonders);cache=new Map();clock=0;queue=[];show=song=null;last=null;}
  return owner.musicalWonders;
 }
 function nearby(){book();const out=[],x=Math.floor(r.S.wx/WONDER_CELL),y=Math.floor(r.S.wy/WONDER_CELL);
  for(let a=x-1;a<=x+1;a++)for(let b=y-1;b<=y+1;b++){const key=a+','+b;if(!cache.has(key)){cache.set(key,wonderCell(a,b,r.seedOf,r.S.layer||'superficie'));while(cache.size>48)cache.delete(cache.keys().next().value);}out.push(...cache.get(key).filter(o=>Math.hypot(o.x-r.S.wx,o.y-r.S.wy)<650));}return out;
 }
 function celebrate(o,d,first,variant=d.index%6){
  const event={...o,d,first,variant,at:0};queue.push(event);queue=queue.slice(-8);
 }
 function grant(o){
  const q=book(),d=wonderDefinition(o.kind);if(!d||q.version!==1||!active()||q.found[d.id]===true)return false;
  const region=r.regionOfPos(o.x,o.y),card=makeRareCard({type:'wonder:'+d.id,sourceId:'wonder:shape:'+d.id,world:r.worldIdentity,address:{...r.worldIdentity,x:o.x,y:o.y,layer:r.S.layer||'superficie'},regionName:region.name,genre:region.genre,day:r.S.todayKey,firstSeen:new Date().toISOString(),context:{role:'lead',instrument:d.instrument}});
  if(!card)return false;const previous=owner.rareBook,previousWonders=structuredClone(q),nextBook=normalizeRareBook(previous);
  if(nextBook.readOnly||storeRareCard(nextBook,card)==='full')return false;
  q.found[d.id]=true;owner.rareBook=nextBook;
  if(r.save()===false){owner.musicalWonders=previousWonders;owner.rareBook=previous;return false;}
  r.sparkCardFound?.(card);r.unlock?.('tarjeta1');celebrate(o,d,true);r.toast?.(d.name+' · '+d.gift+' ganado. Equípalo en Tu cubo.',{level:2,category:'hallazgo',coalesce:true});return true;
 }
 function totem(o){
  const q=book();if(q.version!==1||!active())return false;
  const kinds=['stack','hourglass','orb','diamond','bottle','spire'],i=kinds.indexOf(o.kind);if(i<0)return false;
  const first=q.totems[o.kind]!==true;
  if(first){q.totems[o.kind]=true;if(r.save()===false){delete q.totems[o.kind];return false;}}
  celebrate(o,WONDERS[[3,4,0,11,12,14][i]],first,i);return true;
 }
 function tick(dt,paused=false){
  const q=book();if(paused||!active()){song=null;return;}
  if(last&&Math.hypot(last.x-r.S.wx,last.y-r.S.wy)>400){queue=[];show=song=null;}last={x:r.S.wx,y:r.S.wy};clock+=Math.max(0,Math.min(.05,dt||0));
  if(q.version!==1)return;const automatic=r.autopilotState?.mode==='wander'&&!r.autopilotState.paused;
  if(!automatic)for(const o of nearby()){
   if(q.found[o.kind]===true||(o.retryAt||0)>clock)continue;
   const near=Math.hypot(o.x-r.S.wx,o.y-r.S.wy)<55,wave=(r.waves||[]).some(w=>w.origin==='player'&&pulseCrossed(w,o.x,o.y));
   if(near||wave&&Math.hypot(o.x-r.S.wx,o.y-r.S.wy)<180)if(!grant(o))o.retryAt=clock+2;
  }
  if(show&&clock-show.at>=(show.first?4.8:1.2)){show=song=null;}
  if(!show&&queue.length){show=queue.shift();show.at=clock;song={event:show,start:null,next:0,scope};}
 }
 function musicStep(s,bar,time){
  if(!song)return;if(!active()||!r.S.sound||owner!==r.S||song.scope!==JSON.stringify(r.worldIdentity)+':'+(r.S.layer||'superficie')||Math.hypot(song.event.x-r.S.wx,song.event.y-r.S.wy)>650){song=null;return;}
  const step=r.MU.step;if(song.start===null){if(s%2)return;song.start=step;}
  const d=song.event.d,count=song.event.first?6:2;
  while(song.next<count&&step-song.start>=d.steps[song.next]){playWonderNote(r,d,song.next,time);song.next++;}
  if(song.next>=count)song=null;
 }
 function gift(c,x,y,size,time=0,id=null){const q=book(),d=wonderDefinition(id??r.S.cube?.wonder);if(q.version!==1||!d||q.found[d.id]!==true)return;drawWonderGift(c,d,x,y,size,time/1000,reduced());}
 function draw(){
  book();if(!active())return;const c=r.cx,ox=r.W/2-r.camX,oy=r.H/2-r.camY;
  for(const o of nearby()){
   const d=wonderDefinition(o.kind),distance=Math.hypot(o.x-r.S.wx,o.y-r.S.wy),fade=r.worldOpacity?.(distance)??Math.max(0,1-distance/650);if(fade<.01)continue;
   c.save();c.globalAlpha=fade;drawWonder(c,d,o.x+ox,o.y+oy,clock,reduced());
   if(distance<150){c.fillStyle=d.color;c.textAlign='center';c.font='11px "Geist Mono",monospace';c.fillText(d.name,o.x+ox,o.y+oy+48);c.fillText(book().found[o.kind]?'Recuerdo conservado':'Acércate o lanza un pulso',o.x+ox,o.y+oy+65);}c.restore();
  }
  if(show){const age=(clock-show.at)*(show.first?1:4),point={x:show.x+ox,y:show.y+oy};drawMagicShow(c,point,age,show.variant,show.d.color,reduced());
   c.save();c.globalAlpha=Math.min(1,Math.max(0,(show.first?4.8:1.2)-(clock-show.at)));c.fillStyle=show.d.color;c.textAlign='center';c.font='12px "Geist Mono",monospace';c.fillText(show.d.style+' · '+(show.id.startsWith('wonder:')?show.d.gift:'Encuentro mágico'),r.W/2,Math.min(r.H-130,r.H/2+120));c.restore();
   if(show.id.startsWith('wonder:'))drawWonderGift(c,show.d,r.W/2,r.H/2,12,clock,reduced());
  }
 }
 Object.defineProperties(r,{wonderTick:{get:()=>tick},drawWonders:{get:()=>draw},drawWonderGift:{get:()=>gift},wonderMusicStep:{get:()=>musicStep},celebrateTotem:{get:()=>totem},wonderNear:{get:()=>nearby},wonderGifts:{get:()=>book().version===1?WONDERS.filter(d=>book().found?.[d.id]===true):[]},wonderState:{get:()=>({cache:cache.size,show:show?.d.id||null,pending:queue.length,playing:!!song,book:book()})}});book();
}
