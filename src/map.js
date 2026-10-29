// Mapa dibujado: solo muestra lo que viste. Lo visitado lleva el color de su bioma, con bordes suaves; los hitos a
// los que llegaste con su símbolo y los que solo oíste como "?". Todo lo demás queda negro: el mapa recuerda, no revela.
// Desde alpha.235 (Mapa del universo, universe-map.js) la Bitácora muestra una vista quieta de todo lo descubierto y
// «Abrir el mapa» (o tocarla) abre la pantalla entera, con sus tres acercamientos.
import {initialize as universeMap} from './universe-map.js';

export function mapData(runtime){
 const S=runtime.S,RP=runtime.REG*runtime.WCH,cells=[];
 for(const key of Object.keys(S.places||{})){
  const [rx,ry]=key.split(',').map(Number);if(!Number.isFinite(rx)||!Number.isFinite(ry))continue;
  const d=runtime.regionOfPos((rx+.5)*RP,(ry+.5)*RP);
  cells.push({rx,ry,sea:!!d.sea,hue:d.continent?.hue??d.hue,cont:d.continent?.id||null,contName:d.continent?.name||null,strange:d.strange||0});
 }
 const reached=Object.keys(S.landmarks||{}).map(id=>{const [rx,ry]=id.slice(3).split(',').map(Number);const lm=runtime.landmarkAt?.(rx,ry);return lm?{...lm,reached:true}:null;}).filter(Boolean);
 const heard=Object.entries(S.heardLm||{}).filter(([id])=>!S.landmarks?.[id]).map(([id,[rx,ry,type]])=>({id,rx,ry,type}));
 const me=[Math.floor(S.wx/RP),Math.floor(S.wy/RP)],camp=S.studio?.x!=null?[S.studio.x/RP,S.studio.y/RP]:null;
 const continents=new Set(cells.filter(c=>c.cont&&!c.sea).map(c=>c.cont)).size;
 return {ring:runtime.ringPortals?.()||[],favorites:(S.favorites?.items||[]).filter(p=>p.layer==='superficie'),cells,reached,heard,me,pos:[S.wx/RP,S.wy/RP],camp,continents,record:S.maxRing||0,RP};
}

export function initialize(runtime){
 const $=runtime.$;universeMap(runtime);
 function render(){
  const c=$("mapCv");runtime.universeMapPreview?.(c,{margin:24*c.width/(c.clientWidth||c.width)});const m=mapData(runtime);
  $("mRegions").textContent=m.cells.length;$("mConts").textContent=m.continents;$("mRecord").textContent=m.record;
  $("mapZoom").textContent='Abrir el mapa';
  // One item per span: lines break between items, never leaving a separator hanging (panel 10, Nesbitt #14).
  const rare=Object.keys(runtime.S.anomalies||{}).length,open=m.ring.filter(q=>q.open).length;
  // Panel 10 (P8): no counter at zero; regions, continents and record live in Tú (index.html #journalYouPart).
  $("mapNote").replaceChildren(...[m.favorites.length&&`${m.favorites.length} favoritos (◇)`,m.reached.length&&`${m.reached.length} hitos visitados`,m.heard.length&&`${m.heard.length} oídos sin visitar (?)`,rare&&`${rare} rarezas (✶)`,m.camp&&'⌂ tu Refugio',open&&`${open} portales abiertos (○)`].filter(Boolean).map(t=>{const e=document.createElement('span');e.textContent=t;return e;}));
  runtime.renderRingTravel?.();
 }
 function open(){runtime.openJournal?.('places');render();runtime.unlock('mapa1');}
 // The whole screen of the map, from the Bitácora (its button or a tap on the drawing).
 function full(){const ok=runtime.openUniverseMap?.('universo');if(ok)$("mJournal").hidden=true;return ok;}
 async function share(){
  await Promise.all([document.fonts.load('400 14px "Geist Mono"'),document.fonts.load('600 14px "Geist Mono"'),document.fonts.load('400 24px "Geist Mono"')]);
  const c=document.createElement("canvas");c.width=1080;c.height=1350;const x=c.getContext("2d");x.fillStyle="#000";x.fillRect(0,0,1080,1350);
  runtime.universeMapPreview?.(c,{X:100,Y:250,W:880,H:880});const m=mapData(runtime);
  x.textBaseline="top";x.fillStyle="#fff";x.font='96px "Geist Mono", monospace';x.fillText("MI MAPA",100,96);
  x.font='28px "Geist Mono", monospace';x.fillStyle="#8a8a8f";x.fillText(`DÍA ${runtime.displayDay()} · SOLO LO QUE VI`,104,206);
  x.fillStyle="#fff";x.font='600 34px "Geist Mono", monospace';x.fillText(`REGIONES ${m.cells.length}`,100,1160);x.fillText(`CONTINENTES ${m.continents}`,440,1160);x.fillText(`RÉCORD ${m.record}`,820,1160);
  x.fillStyle="#8a8a8f";x.font='26px "Geist Mono", monospace';x.fillText("KUBONO  ·  @jaywrkr",100,1250);
  runtime.$("shareImg").alt="Mi mapa en Kubono";runtime.$("shareImg").src=c.toDataURL("image/png");runtime.$("mJournal").hidden=true;runtime.$("mShare").hidden=false;
 }
 $("bMap").onclick=open;$("mapClose").onclick=()=>{runtime.$("mJournal").hidden=true;};
 $("mapZoom").onclick=full;$("mapCv").onclick=full;$("mapShare").onclick=share;
 Object.defineProperties(runtime,{openMap:{get:()=>open},renderMap:{get:()=>render}});
}
