import {DISCOVERY_ELEMENTS,elementFamily,discoveryElement,migrateElementBook,knownElementFound} from './element-book-model.js';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function initialize(runtime){
 let owner=null;
 const ensure=()=>{if(owner!==runtime.S){runtime.S.elementBook=migrateElementBook(runtime.S);owner=runtime.S;}return runtime.S.elementBook;};
 function ui(){const b=ensure(),n=Object.keys(knownElementFound(b)).length,e=runtime.$('elementCount');if(b.version>1){e.textContent='Elementos · versión posterior';e.title='Tus hallazgos siguen guardados. Actualiza para continuar.';return;}e.textContent=`Elementos ${n}/${DISCOVERY_ELEMENTS.length}`;e.title=`${n} familias descubiertas de ${DISCOVERY_ELEMENTS.length}; los ejemplares repetidos no suman.`;}
 function record(kind,region){
  if(typeof kind!=='string'||!runtime.inWorld()||document.hidden||runtime.scanning||document.querySelector('.modal:not([hidden])'))return false;
  if(runtime.realTravel&&runtime.S.lastDay!==runtime.S.todayKey)runtime.onFirstLight();
  const id=elementFamily(kind,kind.startsWith('forma:')&&runtime.blobHabitat?.(region));if(!discoveryElement(id))return false;
  const b=ensure();if(b.version>1||b.found[id])return false;
  b.found[id]={day:runtime.S.todayKey||'',genre:region?.genre||''};ui();
  const n=Object.keys(b.found).length;if(n>=10)runtime.unlock?.('elementos10');if(n>=30)runtime.unlock?.('elementos30');
  // Save runs normally; collecting never plays a note or displays a modal/toast.
  return true;
 }
 function cards(){
  const b=ensure();if(b.version>1)return '<article class="journal-card"><h3>Tu colección</h3><p>Libro de una versión posterior. Tus hallazgos siguen guardados.</p></article>';const found=knownElementFound(b),n=Object.keys(found).length;
  let html=`<article class="journal-card"><h3>${n} de ${DISCOVERY_ELEMENTS.length} familias</h3><p>Registra lo que tocas, modelas o encuentras. Otro ejemplar de la misma familia no suma. Las formas individuales conservan su catálogo aparte.</p><p>${DISCOVERY_ELEMENTS.length-n} familias por descubrir. No es un contador de mundos ni de canciones únicas.</p></article>`;
  const groups=[...new Set(DISCOVERY_ELEMENTS.filter(e=>found[e.id]).map(e=>e.group))];
  for(const group of groups){html+='<h3>'+escape(group)+'</h3>';for(const e of DISCOVERY_ELEMENTS.filter(e=>e.group===group&&found[e.id])){const entry=found[e.id];html+=`<article class="journal-card"><h3>${escape(e.name)}</h3><p>${escape(entry.genre?(runtime.GEN[entry.genre]?.name||entry.genre):'Hallazgo conservado')}${entry.day?' · '+escape(entry.day):''}</p></article>`;}}
  return html;
 }
 ensure();ui();
 Object.defineProperties(runtime,{recordElement:{get:()=>record},elementBookUI:{get:()=>ui},elementBookCards:{get:()=>cards},elementFamilyCount:{get:()=>Object.keys(knownElementFound(ensure())).length}});
}
