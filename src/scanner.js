import { POCKET_NAMES } from './pockets.js';

import { TOY_NAMES } from './playthings.js';

import { ROLES, INSTRUMENTS, MODES } from './journal.js';
const NAMES={props:null,lotus:'Loto',crystals:'Cristal',pillars:'Pilar',flies:'Luciérnaga',grass:'Árbol',flowers:'Flor',stal:'Gota',motes:'Luz',walkers:'Caminante',beacons:'Faro'};
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
export function initialize(runtime) {
  let scanning=false,lastUpdate=-Infinity;
  const panel=document.getElementById('scanner'),list=document.getElementById('scannerSources');
  function stopScanner(){scanning=false;panel.hidden=true;}
  function updateScanner(force=false) {
    if(!scanning)return;
    if(!runtime.inWorld()||[...document.querySelectorAll('.modal')].some(m=>!m.hidden)){stopScanner();return;}
    const now=performance.now();if(!force&&now-lastUpdate<200)return;lastUpdate=now;
    const region=runtime.regionOfPos(runtime.S.wx,runtime.S.wy);
    document.getElementById('scannerRegion').textContent=`${region.name}${runtime.currentPocket()?.kind?" · "+POCKET_NAMES[runtime.currentPocket().kind]:""} · ${runtime.GEN[region.genre].name} · ${region.bpm} BPM · ${MODES[region.scale.join(",")]||"Escala regional"}`;
    list.replaceChildren();
    const sources=nearbySources(runtime.wchunks,runtime.S.wx,runtime.S.wy);
    for(const source of sources) {
      const sp=source.object.s;
      const own=sp?runtime.regionOfPos(...sp.id.split(':')[0].split(',').map(n=>+n*runtime.REG*runtime.WCH+1)):runtime.regionOfPos(source.object.x,source.object.y);
      const voice=runtime.getVoice(source.kind,own),item=document.createElement('li');
      const name=sp&&!runtime.S.cat[sp.id]?'Forma desconocida':source.name;
      item.textContent=`${name} · ${ROLES[voice.role]} · ${INSTRUMENTS[voice.instrument]?.[0]||voice.instrument} · ${own.name}${source.object.personality?" · "+source.object.personality.name:""}`;
      list.append(item);
    }
    if(!sources.length){const item=document.createElement('li');item.textContent='Sin objetos musicales cercanos. La región sigue componiendo.';list.append(item);}
    document.getElementById('scannerHint').textContent=runtime.S.sound?'Voces cercanas · no todas suenan al mismo tiempo':'Sonido silenciado · mostrando las voces del lugar';
    while(panel.scrollHeight>panel.clientHeight+2&&list.childElementCount>1)list.lastElementChild.remove();
  }
  function startScanner(){if(!runtime.inWorld())return;scanning=true;runtime.ptr=null;panel.hidden=false;updateScanner(true);}
  Object.defineProperties(runtime,{scanning:{get:()=>scanning},startScanner:{get:()=>startScanner},stopScanner:{get:()=>stopScanner},updateScanner:{get:()=>updateScanner}});
}
