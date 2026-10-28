import {openSurface} from './frame-state.js';
import {HOUSE_ROOMS,HOUSE_OBJECTS} from './house-model.js';
import {CAPSULE_PIECES,CAPSULE_PRICE,MACHINE,WORKBENCH,capsulePrize} from './house-capsules.js';
// House phase C5: the house told in words, used from the keyboard and announced from the menu.
// Refugio simple (alpha.234): the Taller and the Prisma left the rooms for «Más»; the Cielo shows your constellations.
const FIXED={sala:'paneles de tarjetas, tus trofeos y la constelación de logros',jardin:'las voces de tus tarjetas',azotea:'tus constelaciones y ornamentos',sotano:'columnas de cristal y el Núcleo'};
const placed=h=>(h.objects||[]).filter(o=>o&&HOUSE_OBJECTS.some(d=>d.id===o.kind));
// One short sentence per room: what is there, then what is close enough to use.
export function roomSummary(house,room,near=''){
 const r=HOUSE_ROOMS.find(r=>r.id===room);if(!r)return '';const n=placed(house).filter(o=>o.room===room).length,decor=(house.decor||[]).filter(d=>d.room===room).map(d=>CAPSULE_PIECES.find(p=>p.id===d.id)?.name).filter(Boolean);
 const parts=[n?n+(n===1?' objeto':' objetos'):'',...decor.slice(0,4),decor.length>4?'y '+(decor.length-4)+' más':'',FIXED[room]].filter(Boolean);
 return r.name+': '+parts.join(', ')+'.'+(near?' Cerca: '+near+'. Pulsa Enter.':'');}
// What the cube can use from where it stands.
// Since the Refugio simple nothing in the rooms is used from where the cube stands: the Taller and the Prisma are buttons.
export function nearThing(stand,house){return '';}
// The menu card says what is new in the house since the last time in it. Without anything new it does not insist
// (alpha.234: the ready capsule is no longer announced).
export function houseNews(s){const h=s.house||{},seen=h.seen&&typeof h.seen==='object'?h.seen:null,cards=Array.isArray(s.rareBook?.items)?s.rareBook.items.length:0,ach=Object.keys(s.ach||{}).length;
 if(seen&&Number.isSafeInteger(seen.cards)&&cards>seen.cards){const k=cards-seen.cards;return k===1?'Un panel nuevo':k+' paneles nuevos';}
 if(seen&&Number.isSafeInteger(seen.ach)&&ach>seen.ach)return 'Trofeos nuevos';
 return 'Tu Refugio viaja contigo';}
export const houseSeen=s=>({cards:Array.isArray(s.rareBook?.items)?s.rareBook.items.length:0,ach:Object.keys(s.ach||{}).length});
export function initialize(runtime){
 let said='';
 function tick(){if(!runtime.houseActive?.())return;const h=runtime.currentHouse(),stand=runtime.houseStand(),text=roomSummary(h,stand.room,nearThing(stand,h));if(text!==said){said=text;const el=runtime.$('houseSummary');if(el)el.textContent=text;}}
 // One quiet dot on the menu's Refugio while something new waits in it (house.js houseNewsNow); none otherwise.
 function menuNote(){const el=document.querySelector('#bStudio small');if(el)el.textContent=houseNews(runtime.S);const b=runtime.$('bStudio');if(!b)return;let n=0;try{n=runtime.houseNewsNow?.().count||0;}catch(_){n=0;}b.classList.toggle('has-new',n>0);b.setAttribute('aria-label',n>1?`Refugio · ${n} nuevos`:n?'Refugio · 1 nuevo':'Refugio');}
 // Enter uses what is nearby: the Prism (asks, then turns) or the Taller disc.
 addEventListener('keydown',e=>{if(e.key!=='Enter'||e.repeat||!runtime.houseActive?.()||e.target?.closest?.('input,textarea,select,button,a,summary')||openSurface('.modal:not([hidden])'))return;
  const h=runtime.currentHouse(),near=nearThing(runtime.houseStand(),h);if(!near)return;e.preventDefault();
  if(near==='disco del Taller')runtime.houseCapsuleTap?.((WORKBENCH.x0+WORKBENCH.x1)/2,(WORKBENCH.top+WORKBENCH.bottom)/2);else runtime.houseCapsuleTap?.(MACHINE.x,MACHINE.floor-MACHINE.h/2);});
 Object.defineProperties(runtime,{houseGuideTick:{get:()=>tick},houseMenuNote:{get:()=>menuNote},houseSeenNow:{get:()=>()=>houseSeen(runtime.S)}});
}
