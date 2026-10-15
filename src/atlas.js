// Atlas de ritmos: herramienta de prototipo para listar todos los géneros, verificar
// que existen en el mundo y viajar a la región más cercana de cada uno.
import {REFERENCE_GENRES} from './references.js';
import {WORLD_GENRES} from './palettes.js';
import {FAMILIES,familyOf} from './rhythms.js';

export const ATLAS_RADIUS=30; // anillos de regiones alrededor del origen (61×61 = 3.721 regiones)

const sourceOf=id=>familyOf(id);

// Recorre las regiones anillo por anillo. Función pura sobre runtime.regionOfPos para poder probarla sin DOM.
export function buildAtlas(runtime,radius=ATLAS_RADIUS){
  const out=new Map();let total=0;
  for(const id of Object.keys(runtime.GEN))out.set(id,{id,name:runtime.GEN[id].name||id,bpm:runtime.GEN[id].bpm,family:sourceOf(id),count:0,nearest:null});
  for(let ring=0;ring<=radius;ring++)for(let rx=-ring;rx<=ring;rx++)for(let ry=-ring;ry<=ring;ry++){
    if(Math.max(Math.abs(rx),Math.abs(ry))!==ring)continue;
    const [cx,cy]=regionCenter(runtime,rx,ry),d=runtime.regionOfPos(cx,cy);total++;
    let e=out.get(d.genre);if(!e){e={id:d.genre,name:d.genre,bpm:[d.bpm,d.bpm],family:'experimental',count:0,nearest:null};out.set(d.genre,e);}
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

  let filter='all';
  const tested=()=>(runtime.S.atlasTested||={});
  function render(){
    const heard=runtime.S.journal?.music?.genres||{},done=tested();
    const ok=atlas.list.length-atlas.missing.length,heardN=atlas.list.filter(e=>heard[e.id]).length,testedN=atlas.list.filter(e=>done[e.id]).length;
    $("atlasSummary").textContent=`${atlas.list.length} ritmos · ${ok} verificados en ${atlas.total.toLocaleString('es')} regiones · ${heardN} escuchados · ${testedN} probados`;
    const fams=Object.keys(FAMILIES).filter(f=>atlas.list.some(e=>e.family===f));
    const chip=(id,label,n)=>`<button data-atlas-filter="${id}" aria-pressed="${filter===id}">${esc(label)} · ${n}</button>`;
    $("atlasFilters").innerHTML=chip('all','Todos',atlas.list.length)+chip('untested','Sin probar',atlas.list.length-testedN)+fams.map(f=>chip(f,FAMILIES[f],atlas.list.filter(e=>e.family===f).length)).join('');
    const rows=atlas.list.filter(e=>filter==='all'||(filter==='untested'?!done[e.id]:e.family===filter));
    $("atlasBody").innerHTML=rows.map(e=>{
      const n=e.nearest,pct=(e.count/atlas.total*100).toFixed(1).replace('.',',');
      const where=n?`${esc(n.name)} · ${esc(n.biome)} · a ${n.ring} región${n.ring===1?'':'es'} del origen`:'No aparece en el área revisada';
      return `<div class="atlas-row ${done[e.id]?'got':''}"><button class="atlas-check" data-atlas-test="${esc(e.id)}" aria-pressed="${!!done[e.id]}" aria-label="Marcar ${esc(e.name)} como probado">${done[e.id]?'✓':''}</button><span class="atlas-txt"><strong>${esc(e.name)}${heard[e.id]?' <em>· escuchado</em>':''}</strong><small>${e.bpm[0]}–${e.bpm[1]} BPM · ${esc(FAMILIES[e.family]||e.family)} · ${pct} % del mundo</small><small>${where}</small></span>${n?`<button data-atlas="${esc(e.id)}" aria-label="Ir a ${esc(e.name)}">Ir</button>`:''}</div>`;
    }).join('')||'<div><span class="atlas-txt"><small>Nada en este filtro.</small></span></div>';
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
    $("mAtlas").hidden=true;
    S.wx=x;S.wy=y;S.layer='superficie';
    if(runtime.inWorld()){runtime.toast(`<em>Atlas</em> · ${esc(e.name)}`);} // el loop detecta la región nueva y la inicializa
    else{S.lastWorldDay=S.todayKey;runtime.enterWorld();}
    runtime.save();
  }

  $("dAtlas").onclick=open;
  $("atlasClose").onclick=()=>{$("mAtlas").hidden=true;};
  $("atlasBody").onclick=ev=>{
    const t=ev.target.closest("button[data-atlas-test]");
    if(t){const d=tested(),id=t.dataset.atlasTest;if(d[id])delete d[id];else d[id]=1;runtime.save();render();return;}
    const b=ev.target.closest("button[data-atlas]");if(b)go(b.dataset.atlas);};
  $("atlasFilters").onclick=ev=>{const b=ev.target.closest("button[data-atlas-filter]");if(!b)return;filter=b.dataset.atlasFilter;render();$("atlasBody").parentElement.scrollTop=0;};

  Object.defineProperties(runtime,{openAtlas:{get:()=>open},atlasGo:{get:()=>go}});
}
