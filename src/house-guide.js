import {openSurface} from './frame-state.js';
import {HOUSE_ROOMS,HOUSE_OBJECTS} from './house-model.js';
import {CAPSULE_PIECES,CAPSULE_PRICE,MACHINE,WORKBENCH,capsulePrize} from './house-capsules.js';
// House phase C5: the house told in words, used from the keyboard and announced from the menu.
const FIXED={sala:'cuadros, trofeos y la máquina de cápsulas',jardin:'el jardín de voces',azotea:'el cielo y el telescopio',sotano:'vitrinas y la mesa del Taller'};
const placed=h=>(h.objects||[]).filter(o=>o&&HOUSE_OBJECTS.some(d=>d.id===o.kind));
// One short sentence per room: what is there, then what is close enough to use.
export function roomSummary(house,room,near=''){
 const r=HOUSE_ROOMS.find(r=>r.id===room);if(!r)return '';const n=placed(house).filter(o=>o.room===room).length,decor=(house.decor||[]).filter(d=>d.room===room).map(d=>CAPSULE_PIECES.find(p=>p.id===d.id)?.name).filter(Boolean);
 const parts=[n?n+(n===1?' objeto':' objetos'):'',...decor.slice(0,4),decor.length>4?'y '+(decor.length-4)+' más':'',FIXED[room]].filter(Boolean);
 return r.name+': '+parts.join(', ')+'.'+(near?' Cerca: '+near+'. Pulsa Enter.':'');}
// What the cube can use from where it stands.
export function nearThing(stand,house){if(!stand)return '';if(stand.floor===1&&Math.abs(stand.fx-MACHINE.x)<50)return 'máquina de cápsulas';if(stand.floor===2&&(house.unlocked||[]).includes('sotano')&&stand.fx>=WORKBENCH.x0-20&&stand.fx<=WORKBENCH.x1+20)return 'mesa del Taller';return '';}
// The menu card says what is new in the house since the last time in it.
export function houseNews(s){const h=s.house||{},seen=h.seen&&typeof h.seen==='object'?h.seen:null,cards=Array.isArray(s.rareBook?.items)?s.rareBook.items.length:0,ach=Object.keys(s.ach||{}).length;
 if(seen&&Number.isSafeInteger(seen.cards)&&cards>seen.cards){const k=cards-seen.cards;return k===1?'Un cuadro nuevo':k+' cuadros nuevos';}
 if(seen&&Number.isSafeInteger(seen.ach)&&ach>seen.ach)return 'Trofeos nuevos';
 if(!h.readOnly&&(s.sparks||0)>=CAPSULE_PRICE&&capsulePrize(h,placed(h).map(o=>o.kind)))return 'Cápsula lista · '+CAPSULE_PRICE+' ✦';
 return 'Tus objetos y el taller';}
export const houseSeen=s=>({cards:Array.isArray(s.rareBook?.items)?s.rareBook.items.length:0,ach:Object.keys(s.ach||{}).length});
export function initialize(runtime){
 let said='';
 function tick(){if(!runtime.houseActive?.())return;const h=runtime.currentHouse(),stand=runtime.houseStand(),text=roomSummary(h,stand.room,nearThing(stand,h));if(text!==said){said=text;const el=runtime.$('houseSummary');if(el)el.textContent=text;}}
 function menuNote(){const el=document.querySelector('#bStudio small');if(el)el.textContent=houseNews(runtime.S);}
 // Enter uses what is nearby: the machine (asks, then turns) or the workbench.
 addEventListener('keydown',e=>{if(e.key!=='Enter'||e.repeat||!runtime.houseActive?.()||e.target?.closest?.('input,textarea,select,button,a,summary')||openSurface('.modal:not([hidden])'))return;
  const h=runtime.currentHouse(),near=nearThing(runtime.houseStand(),h);if(!near)return;e.preventDefault();
  if(near==='mesa del Taller')runtime.houseCapsuleTap?.((WORKBENCH.x0+WORKBENCH.x1)/2,(WORKBENCH.top+WORKBENCH.bottom)/2);else runtime.houseCapsuleTap?.(MACHINE.x,MACHINE.floor-MACHINE.h/2);});
 Object.defineProperties(runtime,{houseGuideTick:{get:()=>tick},houseMenuNote:{get:()=>menuNote},houseSeenNow:{get:()=>()=>houseSeen(runtime.S)}});
}
