import {CUBE_WARDROBE} from './wardrobe-model.js';
import {DISCOVERY_ELEMENTS} from './element-book-model.js';
import {LIVING_CATALOG} from './living-catalog.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function albumEntries(state,rewards=[]){
 const rows=[...rewards.filter(p=>p.id!=='achievement:dj'||p.owned).map(p=>({id:p.id,name:p.name,group:p.id.startsWith('cube:')?'cubo':p.type==='achievement'?'logros':'casa',owned:p.owned,earned:p.source?.kind!=='default',value:p.value,date:p.obtainedAt,hint:p.hint,rarity:p.rarity,shape:p.type})),
 ...DISCOVERY_ELEMENTS.map(p=>({id:p.id,name:p.name,group:'elementos',owned:!!state.elementBook?.found?.[p.id],date:state.elementBook?.found?.[p.id]?.day,hint:'Acércate y escucha su respuesta.',shape:p.group})),
 ...LIVING_CATALOG.map(p=>({id:'living:'+p.id,name:p.name,group:'linajes',owned:!!state.livingSeen?.[p.id],date:state.livingSeen?.[p.id]?.day,hint:({quietud:'Permanece cerca y escucha.',orbita:'Rodéalo despacio con el cubo.',presion:'Acércate y mantén el contacto.',seguir:'Acompaña su recorrido.',respuesta:'Toca una frase y escucha.',contacto:'Tócalo con el cubo.',cruce:'Cruza su camino.'})[p.gesture],shape:p.shape}))];
 return rows;
}
export function filterAlbum(rows,{group='todo',search='',owned='todo'}={}){const query=search.trim().toLocaleLowerCase('es');return rows.filter(p=>(group==='todo'||p.group===group)&&(owned==='todo'||p.owned===(owned==='ganado'))&&(!query||(p.name+' '+p.hint).toLocaleLowerCase('es').includes(query))).sort((a,b)=>Number(b.owned)-Number(a.owned)||String(b.date||'').localeCompare(String(a.date||'')));}
export function progressRing(owned,total,label,{earned=owned}={}){const amount=total?Math.min(1,owned/total):0;return `<div class="journal-progress" role="img" aria-label="${escape(label)}: ${owned} de ${total}"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16"/><circle class="available" cx="20" cy="20" r="16" pathLength="100" stroke-dasharray="${amount*100} 100"/><circle class="earned" cx="20" cy="20" r="16" pathLength="100" stroke-dasharray="${(total?Math.min(1,earned/total):0)*100} 100"/></svg><span>${owned} de ${total} · ${escape(label)}</span></div>`;}
export function nextDiscovery(state,region){const missing=LIVING_CATALOG.find(p=>p.affinity.includes(region.biomeId)&&!state.livingSeen?.[p.id]);return missing?{name:missing.name,text:({quietud:'Quédate junto a una forma que respira.',orbita:'Rodea una forma y escucha sus cambios.',seguir:'Camina con una criatura del lugar.'})[missing.gesture]||'Acércate despacio y escucha una nueva voz.'}:{name:'Otro lugar',text:'Explora una región vecina sin correr.'};}
export const CUBE_TOTAL=CUBE_WARDROBE.length;
