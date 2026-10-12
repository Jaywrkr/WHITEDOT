// Atlas de ritmos: herramienta de prototipo para listar todos los géneros, verificar
// que existen en el mundo y viajar a la región más cercana de cada uno.
import {REFERENCE_GENRES} from './references.js';
import {WORLD_GENRES} from './palettes.js';

export const ATLAS_RADIUS=30; // anillos de regiones alrededor del origen (61×61 = 3.721 regiones)

const sourceOf=id=>REFERENCE_GENRES[id]?'Referencia':WORLD_GENRES[id]?'Paleta':'Base';

// Recorre las regiones anillo por anillo. Función pura sobre runtime.regionOfPos para poder probarla sin DOM.
export function buildAtlas(runtime,radius=ATLAS_RADIUS){
  const out=new Map();let total=0;
  for(const id of Object.keys(runtime.GEN))out.set(id,{id,name:runtime.GEN[id].name||id,bpm:runtime.GEN[id].bpm,source:sourceOf(id),count:0,nearest:null});
  for(let ring=0;ring<=radius;ring++)for(let rx=-ring;rx<=ring;rx++)for(let ry=-ring;ry<=ring;ry++){
    if(Math.max(Math.abs(rx),Math.abs(ry))!==ring)continue;
    const [cx,cy]=regionCenter(runtime,rx,ry),d=runtime.regionOfPos(cx,cy);total++;
    let e=out.get(d.genre);if(!e){e={id:d.genre,name:d.genre,bpm:[d.bpm,d.bpm],source:'?',count:0,nearest:null};out.set(d.genre,e);}
    e.count++;
    const dist=Math.hypot(rx,ry);
    if(!e.nearest||dist<e.nearest.dist)e.nearest={rx,ry,ring,dist,name:d.name,biome:runtime.BIOMES[d.z]?.name||'',bpm:d.bpm};
  }
  const list=[...out.values()].sort((a,b)=>a.bpm[0]-b.bpm[0]||a.name.localeCompare(b.name));
  return {list,total,radius,missing:list.filter(e=>!e.count).map(e=>e.id)};
}

// Centro de la región en coordenadas del mundo.
export const regionCenter=(runtime,rx,ry)=>{const s=runtime.REG*runtime.WCH;return [rx*s+s/2,ry*s+s/2];};

export function initialize(runtime){
  let atlas=null;const $=runtime.$;
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  function render(){
    const heard=runtime.S.journal?.music?.genres||{};
    const ok=atlas.list.length-atlas.missing.length,heardN=atlas.list.filter(e=>heard[e.id]).length;
    $("atlasSummary").textContent=`${atlas.list.length} ritmos · ${ok} verificados en ${atlas.total.toLocaleString('es')} regiones · ${heardN} escuchados`;
    $("atlasBody").innerHTML=atlas.list.map(e=>{
      const n=e.nearest,pct=(e.count/atlas.total*100).toFixed(1).replace('.',',');
      const where=n?`${esc(n.name)} · ${esc(n.biome)} · a ${n.ring} región${n.ring===1?'':'es'} del origen`:'No aparece en el área revisada';
      return `<div class="atlas-row ${heard[e.id]?'got':''}"><span class="px"></span><span class="atlas-txt"><strong>${esc(e.name)}</strong><small>${e.bpm[0]}–${e.bpm[1]} BPM · ${e.source} · ${e.count} regiones (${pct} %)</small><small>${where}</small></span>${n?`<button data-atlas="${esc(e.id)}" aria-label="Ir a ${esc(e.name)}">Ir</button>`:''}</div>`;
    }).join('');
  }

  function open(){
    $("mAtlas").hidden=false;
    if(!atlas){$("atlasSummary").textContent='Revisando el mundo…';$("atlasBody").innerHTML='';
      setTimeout(()=>{atlas=buildAtlas(runtime);render();},30);}
    else render();
  }

  function go(id){
    const e=atlas&&atlas.list.find(x=>x.id===id);if(!e||!e.nearest)return;
    const S=runtime.S,[x,y]=regionCenter(runtime,e.nearest.rx,e.nearest.ry);
    // Herramienta de prueba: si el Camino de hoy no está completo, lo completa.
    if(!runtime.inWorld()&&!runtime.isFree()){if(S.lastDay!==S.todayKey)runtime.onFirstLight();S.totalLight+=runtime.CAP-S.todayLight;S.todayLight=runtime.CAP;S.capShown=true;}
    if(!runtime.inWorld()&&runtime.lampLeft()<=0){runtime.toast("<em>Linterna</em> · Usa +1 día en Prototipo para recargarla");return;}
    $("mAtlas").hidden=true;
    S.wx=x;S.wy=y;
    if(runtime.inWorld()){runtime.toast(`<em>Atlas</em> · ${esc(e.name)}`);} // el loop detecta la región nueva y la inicializa
    else{S.lastWorldDay=S.todayKey;runtime.enterWorld();}
    runtime.save();
  }

  $("dAtlas").onclick=open;
  $("atlasClose").onclick=()=>{$("mAtlas").hidden=true;};
  $("atlasBody").onclick=ev=>{const b=ev.target.closest("button[data-atlas]");if(b)go(b.dataset.atlas);};

  Object.defineProperties(runtime,{openAtlas:{get:()=>open},atlasGo:{get:()=>go}});
}
