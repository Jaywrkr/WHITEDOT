import {rarePortrait} from './rare-card-art.js';
import {ACH_CATEGORIES} from './achievement-metadata.js';
import {CUBE_SHOP} from './cube-shop-model.js';
import {pieceImage} from './cube-shop-preview.js';
import {livingGlyph} from './living-art.js';
import {livingDefinition} from './living-catalog.js';
import {roomBox,FLOORS} from './house-view.js';
// What you collected, on show in the Refugio: light panels, a constellation of achievements, glass columns and creatures. Only reads the save.
const TIER_RANK={mitico:4,legendario:3,singular:2,raro:1},TIER_INK={raro:'#9fe8ff',singular:'#bda5f5',legendario:'#bda5f5',mitico:'#f0d27a'};
export const GALLERY=Object.freeze([{x:262,y:40},{x:330,y:40},{x:398,y:40},{x:466,y:40}].map(Object.freeze));
export const SHOWCASES=Object.freeze([290,356,422,488,554,620].map(x=>Object.freeze({x,w:52,h:96})));
export const SHELF=Object.freeze({x:28,y:150,w:196});
// The rarest cards first; among equals, the newest.
export function galleryCards(cards,n=GALLERY.length){return (Array.isArray(cards)?cards:[]).map((c,i)=>({c,i,r:TIER_RANK[c?.odds?.tier]||0})).filter(e=>e.c&&typeof e.c.id==='string').sort((a,b)=>b.r-a.r||b.i-a.i).slice(0,n).map(e=>e.c);}
// One trophy per achievement category: how many earned out of how many there are.
export function trophyShelf(earned,catalog,meta){const out=ACH_CATEGORIES.map(category=>({category,earned:0,total:0}));for(const a of Array.isArray(catalog)?catalog:[]){const m=meta(a);if(!m||m.retired)continue;const row=out.find(r=>r.category===m.category);if(!row)continue;row.total++;if(earned?.[a[0]])row.earned++;}return out;}
// The latest pieces bought in the shop, newest last, as they were bought.
export function showcasePieces(economy,n=SHOWCASES.length){const bought=Object.keys(economy?.purchases||{}).filter(id=>economy.purchases[id]&&CUBE_SHOP.some(p=>p.id===id));return bought.slice(-n);}
// Creatures you met that come to visit: a steady handful, chosen by name so they do not change every frame.
export function visitors(seen,pet,n=4){const ids=Object.keys(seen||{}).filter(id=>livingDefinition(id)).sort().slice(0,n);return pet?.species?['pet:'+pet.species,...ids].slice(0,n+1):ids;}
const portraits=new Map();
// A card portrait as an image: the game's own vector, coloured inline so it can be drawn on the canvas.
export function portraitImage(card){
 if(portraits.has(card.id))return portraits.get(card.id);const entry={img:null,ready:false};portraits.set(card.id,entry);
 if(typeof Image!=='function')return entry;
 try{const ink=TIER_INK[card.odds?.tier]||'#ffffff',svg=rarePortrait(card).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="128" height="96" ').replace(/<svg([^>]*)>/,`<svg$1><style>path{fill:none;stroke-width:1.6;stroke:${ink}}.rare-orbit{stroke:#ffffff40}.rare-scene{opacity:.25;stroke-width:.6}</style>`);
  const img=new Image();img.onload=()=>{entry.ready=true;};img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);entry.img=img;}catch(_){/* A portrait that fails stays an empty frame. */}
 return entry;
}
const pictures=new Map();
function pieceImg(id,color){const key=id+'|'+color;if(pictures.has(key))return pictures.get(key);const entry={img:null,ready:false};pictures.set(key,entry);if(typeof Image!=='function')return entry;const url=pieceImage(id,{color});if(url){const img=new Image();img.onload=()=>{entry.ready=true;};img.src=url;entry.img=img;}return entry;}
export function initialize(runtime){
 const creatures=new Map();let owner=null,hop=-1e9,hopAt=null,chirps=0;const hits=[];
 function own(){if(owner!==runtime.S){owner=runtime.S;creatures.clear();}}
 // Each visitor wanders its floor: walks to a spot, rests, sometimes comes close to the cube.
 function creature(id,i,unlocked,t){let s=creatures.get(id);const rooms=['sala','jardin','azotea'].filter(r=>unlocked.includes(r));if(!rooms.length)return null;
  if(!s){const room=rooms[i%rooms.length],b=roomBox(room);s={id,room,x:b.x+40+((i*137)%Math.max(1,b.w-80)),goal:null,rest:t+1500+i*700,flip:1};creatures.set(id,s);}
  if(!rooms.includes(s.room)){s.room=rooms[0];const b=roomBox(s.room);s.x=b.x+b.w/2;}
  return s;}
 function stepCreatures(list,unlocked,t,dt,cube,calm){for(const [i,id]of list.entries()){const s=creature(id,i,unlocked,t);if(!s)continue;const b=roomBox(s.room);
  if(calm){continue;}
  if(s.goal===null&&t>s.rest){const near=cube&&cube.floor===b.floor&&Math.random()<.35;s.goal=near?Math.max(b.x+20,Math.min(b.x+b.w-20,cube.x+(i%2?50:-50))):b.x+30+Math.random()*(b.w-60);}
  if(s.goal!==null){const d=s.goal-s.x,v=Math.sign(d)*Math.min(Math.abs(d),(id.startsWith('pet:')?70:40)*dt);s.x+=v;if(v)s.flip=Math.sign(v);if(Math.abs(d)<2){s.goal=null;s.rest=t+2000+Math.random()*4000;}}}}
 // A pulse: nearby creatures hop and answer with a short chirp, one after another.
 function pulse(at){hop=performance.now();hopAt=at;const ac=runtime.ac;if(!runtime.S.sound||ac?.state!=='running'||!runtime.bus)return;let i=0;
  for(const [id,s]of creatures){if(roomBox(s.room).floor!==at.floor||Math.abs(s.x-at.x)>220)continue;const t=ac.currentTime+.08+i*.09,o=ac.createOscillator(),g=ac.createGain(),f=900+((id.length*137)%600);o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.6,t+.07);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.02,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.12);o.connect(g).connect(runtime.bus);o.start(t);o.stop(t+.14);chirps++;i++;}}
 function draw(c,{toScreen,k,t,dt,calm,house,cube}){
  own();hits.length=0;const unlocked=house.unlocked||['sala'];const sala=roomBox('sala');c.save();c.lineWidth=1;
  // Light panels: the rarest cards, outlined in their tier colour.
  if(unlocked.includes('sala')){const cards=galleryCards(runtime.rareCards);for(const [i,slot]of GALLERY.entries()){const card=cards[i],p=toScreen(sala.x+slot.x,sala.y+slot.y),w=54*k,h=44*k;c.strokeStyle=card?TIER_INK[card.odds?.tier]||'#ffffff':'#ffffff40';c.globalAlpha=card?.8:1;if(!card)c.setLineDash?.([3,4]);c.strokeRect(Math.round(p.x)+.5,Math.round(p.y)+.5,Math.round(w),Math.round(h));c.setLineDash?.([]);c.globalAlpha=1;
   if(card){const pic=portraitImage(card);if(pic.ready)c.drawImage(pic.img,p.x+3*k,p.y+3*k,w-6*k,h-6*k);hits.push({x:p.x,y:p.y,w,h,text:card.name+' · '+({raro:'Raro',singular:'Singular',legendario:'Legendario',mitico:'Mítico'}[card.odds?.tier]||'Tarjeta')});}
   else{hits.push({x:p.x,y:p.y,w,h,text:'Un panel vacío: encuentra tarjetas raras para encenderlo.'});}}
   // A constellation of achievements: one star per category, gold and brighter as you earn more.
   const rows=trophyShelf(runtime.S.ach,runtime.ACH,a=>runtime.achievementMeta?.(a)||{category:'Camino'}),stars=rows.map((row,i)=>({row,p:toScreen(sala.x+SHELF.x+14+i*27,sala.y+SHELF.y-6+((i*37)%3-1)*8)}));
   c.strokeStyle='#f0d27a55';c.beginPath();stars.forEach(({p},i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke();
   for(const {row,p}of stars){const share=row.total?row.earned/row.total:0,size=Math.max(2,(2+share*3)*k*1.4);c.fillStyle=row.earned?'#f0d27a':'#ffffff55';c.globalAlpha=row.earned?.55+.45*share:1;c.fillRect(Math.round(p.x-size/2),Math.round(p.y-size/2),Math.round(size),Math.round(size));c.globalAlpha=1;hits.push({x:p.x-8,y:p.y-8,w:16,h:16,text:row.category.replace('Casa','Refugio')+' · '+row.earned+' de '+row.total+' logros'});}}
  // Glass columns in the Raíz: what you bought in the shop.
  if(unlocked.includes('sotano')){const b=roomBox('sotano'),list=showcasePieces(runtime.sparkEconomy),color=runtime.cubeColor?.()||'#fff';for(const [i,v]of SHOWCASES.entries()){const p=toScreen(b.x+v.x,b.y+b.h-v.h-6),w=v.w*k,h=v.h*k,id=list[i];c.strokeStyle='#cfe6ff59';c.strokeRect(Math.round(p.x)+.5,Math.round(p.y)+.5,Math.round(w),Math.round(h));c.strokeStyle='#9fd7ff22';c.beginPath();c.moveTo(p.x+w*.2,p.y+4);c.lineTo(p.x+w*.05,p.y+h*.4);c.stroke();c.fillStyle='#ffffff22';c.fillRect(p.x-2*k,p.y+h,w+4*k,4*k);
   if(id){const pic=pieceImg(id,color);if(pic.ready){const iw=w-4*k,ih=iw*68/102;c.save();c.globalCompositeOperation='lighten';c.drawImage(pic.img,p.x+2*k,p.y+h*.38-ih/2,iw,ih);c.restore();}const piece=CUBE_SHOP.find(q=>q.id===id);hits.push({x:p.x,y:p.y,w,h,text:(piece?.name||'Pieza')+' · comprada en la tienda'});}
   else hits.push({x:p.x,y:p.y,w,h,text:'Columna vacía: lo que compres en la tienda aparece aquí.'});}}
  // Garden voices: each one a stem of light rising from the floor to where it sounds.
  for(const o of (runtime.gardenObjects?.(house)||[]).filter(o=>o.gardenCard&&unlocked.includes(o.room))){const b=roomBox(o.room),top=toScreen(b.x+18+o.x*(b.w-36),b.y+26+o.y*(b.h-52)),base=toScreen(b.x+18+o.x*(b.w-36),b.y+b.h),card=runtime.rareCards?.find(q=>q.id===o.cardId),ink=TIER_INK[card?.odds?.tier]||'#9fd7c7';
   c.strokeStyle=ink;c.globalAlpha=.45;c.beginPath();c.moveTo(base.x,base.y);c.quadraticCurveTo(base.x+6*k,(base.y+top.y)/2,top.x,top.y+6*k);c.stroke();c.globalAlpha=1;
   c.fillStyle=ink;c.globalAlpha=.35;c.beginPath();c.arc(top.x,top.y,10*k,0,6.283);c.fill();c.globalAlpha=1;}
  // Visitors: the creatures you met, and your pet following you.
  const list=visitors(runtime.S.livingSeen,runtime.S.pet);stepCreatures(list.filter(id=>!id.startsWith('pet:')),unlocked,t,dt,cube,calm);const sinceHop=(performance.now()-hop)/1000;
  for(const [i,id]of list.entries()){let x,floor;if(id.startsWith('pet:')){if(!cube)continue;x=cube.x-(28+i*4);floor=cube.floor;}else{const s=creatures.get(id);if(!s)continue;x=s.x;floor=roomBox(s.room).floor;}
   const near=hopAt&&hopAt.floor===floor&&Math.abs(hopAt.x-x)<220,jump=near&&!calm&&sinceHop<.6?Math.sin(sinceHop/.6*Math.PI)*16:0,p=toScreen(x,FLOORS[floor].bottom-16-jump);c.save();c.translate(p.x,p.y);c.scale(k*2,k*2);c.strokeStyle=c.fillStyle=id.startsWith('pet:')?'#ffffffcc':'#9fd7c7';
   if(id==='pet:luciernaga'){c.fillRect(-2,-1,4,2);}else if(id.startsWith('pet:')){c.beginPath();c.moveTo(-7,Math.sin(t/280)*2);c.lineTo(0,0);c.lineTo(7,Math.sin(t/280)*2);c.stroke();}else livingGlyph(c,{shape:livingDefinition(id)?.shape||'moth',size:7,phase:i},calm?0:t);
   if(near&&sinceHop<1.2){c.fillStyle='#e58fb0';c.globalAlpha=Math.max(0,1-sinceHop/1.2);c.fillRect(-2,-16-sinceHop*10,2,2);c.fillRect(1,-16-sinceHop*10,2,2);c.fillRect(-1,-15-sinceHop*10,3,2);}
   c.restore();hits.push({x:p.x-10,y:p.y-12,w:20,h:20,text:(id.startsWith('pet:')?'Tu mascota':livingDefinition(id)?.name||'Criatura')+' · de visita'});
   if(runtime.S.house&&!runtime.S.house.readOnly&&!runtime.houseVisiting?.()&&!runtime.S.house.knownVisitors?.[id])runtime.S.house.knownVisitors={...runtime.S.house.knownVisitors,[id]:true};}
  c.restore();
 }
 // What is under a tap, to name it.
 function lookAt(x,y){return hits.find(h=>x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h)?.text||null;}
 Object.defineProperties(runtime,{drawHouseCollection:{get:()=>draw},houseCollectionLook:{get:()=>lookAt},houseCollectionPulse:{get:()=>pulse},houseCollectionState:{get:()=>()=>({creatures:[...creatures.values()].map(s=>({id:s.id,room:s.room,x:s.x})),hits:hits.length,chirps})}});
}
