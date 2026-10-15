// Laboratorio: un mundo de prueba aparte (no toca tu partida) para probar cada elemento interactivo,
// uno por uno, y anotar qué mejorar. Te pone frente al elemento, dice qué probar, puede callar la música
// del lugar («Solo») y exporta un informe en Markdown para llevarlo a Claude/ChatGPT.
import {LAB_ELEMENTS,LAB_GROUPS,LAB_CHECKS,LAB_VERDICTS,labElement,labStep,normalizeLabNotes,labTested,labReport} from './lab-catalog.js';
import {createPhenomena} from './phenomena.js';
import {createFlock} from './vida-music.js';
import {musicIdentity} from './musical-recipes.js';
import {livingChunk} from './living-catalog.js';
import {populationProfile,populatedChunk} from './living-populations.js';

const KEY='whitedot-lab-v1',LAB_SEED='laboratorio';
export const labURL=href=>{const url=new URL(href);url.searchParams.set('testSeed',LAB_SEED);url.searchParams.set('layout','wide');url.searchParams.set('generation','2');url.searchParams.set('lab','1');url.searchParams.delete('encounter');return url.href;};

export function initialize(runtime){
 const $=runtime.$,params=new URLSearchParams(location.search);
 $('dLab').onclick=()=>location.assign(labURL(location.href));
 const active=params.get('lab')==='1'&&!!runtime.S.previewSeed;
 Object.defineProperty(runtime,'labMode',{get:()=>active,configurable:true});
 if(!active)return;

 // ---------- estado del laboratorio (solo en este navegador; no es parte de la partida) ----------
 let book={current:LAB_ELEMENTS[0].id,notes:{},solo:false};
 try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw){book.current=labElement(raw.current)?raw.current:book.current;book.notes=normalizeLabNotes(raw.notes);book.solo=!!raw.solo;}}catch(_){}
 const keep=()=>{try{localStorage.setItem(KEY,JSON.stringify(book));}catch(_){}};
 runtime.labSolo=book.solo;
 const note=id=>book.notes[id]||(book.notes[id]={verdict:'',checks:{},text:'',at:0});

 // ---------- encontrar cada elemento ----------
 const S=()=>runtime.S,size=()=>runtime.REG*runtime.WCH;
 function spiral(test,radius=14){
  // Busca por chunks alrededor del centro del laboratorio, del más cercano al más lejano.
  const c=Math.floor(size()/2/runtime.WCH);let best=null;
  for(let r=0;r<=radius&&!best;r++)for(let a=c-r;a<=c+r;a++)for(let b=c-r;b<=c+r;b++){
   if(Math.max(Math.abs(a-c),Math.abs(b-c))!==r)continue;const hit=test(a,b);
   if(hit&&(!best||Math.hypot(hit.x-size()/2,hit.y-size()/2)<Math.hypot(best.x-size()/2,best.y-size()/2)))best=hit;
  }return best;
 }
 function locate(e){
  const f=e.find,home=Math.floor(runtime.REG/2)*runtime.WCH;
  if(f.type==='landscape'){
   const R=size();for(let radius=0;radius<=32;radius++)for(let x=-radius;x<=radius;x++)for(let y=-radius;y<=radius;y++){
    if(Math.max(Math.abs(x),Math.abs(y))!==radius)continue;
    const d=runtime.regionOfPos((x+.5)*R,(y+.5)*R);if(d.sea||d.worldFamily?.id!==f.family)continue;
    // Locate an actual inhabitant, using exactly the same population as the World.
    for(let a=0;a<runtime.REG;a++)for(let b=0;b<runtime.REG;b++){
     const cx=x*runtime.REG+a,cy=y*runtime.REG+b,biome=runtime.BIOMES[d.z].id,
      profile=populationProfile(d,biome,runtime.seedOf,runtime.rng),
      objects=populatedChunk(livingChunk(cx,cy,runtime.WCH,d,biome,runtime.seedOf,runtime.rng),cx,cy,runtime.WCH,d,profile,runtime.seedOf,runtime.rng);
     const object=objects.find(o=>runtime.regionOfPos(o.x,o.y-110).key===d.key);
     if(object)return {x:object.x,y:object.y};
    }
   }return null;
  }
  if(f.type==='music'){
   const R=size();for(let radius=0;radius<=32;radius++)for(let x=-radius;x<=radius;x++)for(let y=-radius;y<=radius;y++){
    if(Math.max(Math.abs(x),Math.abs(y))!==radius)continue;
    const d=runtime.regionOfPos((x+.5)*R,(y+.5)*R);if(d.sea)continue;
    if(musicIdentity(d,runtime.seedOf,runtime.rng,runtime.GEN)?.id===f.identity)return {x:(x+.5)*R,y:(y+.5)*R};
   }return null;
  }
  if(f.type==='culture'){const site=runtime.cultureHome();return site?{x:site.x,y:site.y}:null;}
  if(['box','quiet','experimental','rhythm','living','synth','filter'].includes(f.type))return {x:home+80,y:home};
  if(f.type==='home')return {x:f.x,y:f.y};
  if(f.type==='family')return {x:home+100,y:home};
  if(f.type==='toy')return spiral((a,b)=>{const raw=runtime.wchunk(a,b),c=runtime.sceneChunk?.(raw)||raw;return (c.playthings||[]).find(o=>o.kind===f.kind)||null;});
  if(f.type==='phenomenon')return spiral((a,b)=>{const region=runtime.regionOfPos(a*runtime.WCH+1,b*runtime.WCH+1);return createPhenomena(a,b,runtime.WCH,runtime.BIOMES[region.z].id,runtime.seedOf,runtime.rng).find(o=>o.kind===f.kind)||null;});
  if(f.type==='flock'){const R=size(),c=0;let best=null;   // por regiones: las bandadas viven a escala de región
   for(let r=0;r<=24&&!best;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;const d=runtime.regionOfPos((a+.5)*R,(b+.5)*R),fl=createFlock(d,R,runtime.BIOMES[d.z]?.id,runtime.seedOf,runtime.rng);if(fl?.species===f.species&&(!best||Math.hypot(fl.x,fl.y)<Math.hypot(best.x,best.y)))best=fl;}
   return best;}
  return null;   // herramientas: se prueban donde estés
 }
 function closeOverlays(){for(const m of document.querySelectorAll('.modal:not([hidden])'))if(m.id!=='mLab')m.hidden=true;if(runtime.fxState?.open)runtime.fxReset?.();}
 function go(id=book.current){
  const e=labElement(id)||LAB_ELEMENTS[0];book.current=e.id;keep();closeOverlays();
  runtime.stopAutopilot?.();runtime.clearPowers?.();runtime.cancelMateria?.();
  runtime.labLiving=e.find.type==='living'?e.find.kind:['synth','filter'].includes(e.find.type)?'breath-tree':null;runtime.labSynth=e.find.type==='synth'?e.find.instrument:null;runtime.labFilter=e.find.type==='filter'?e.find.program:null;
  runtime.labRhythm=e.find.type==='rhythm'?e.find.kind:null;
  runtime.labCulture=e.find.type==='culture'?e.find.culture:null;runtime.cultureReset?.();runtime.labExperimental=e.find.type==='experimental'?{level:.8,mode:e.find.mode}:null;runtime.labEncounter=e.find.type==='family'?e.find.family:null;runtime.encounterReset?.();
  const s=S();s.layer='superficie';const p=locate(e);
  // El elemento queda un poco por debajo del pixel, a la vista y lejos de la barra del laboratorio.
  if(p){s.wx=p.x;s.wy=p.y-110;runtime.ptr=null;}
  runtime.MU.dnaT=runtime.regionOfPos(s.wx,s.wy);
  if(e.find.type==='box')runtime.spawnBox(p.x,p.y,e.find.power);
  if(e.find.type==='quiet')runtime.quietPreview?.(e.find.seconds);
  if(e.find.tool==='fx'){if(!runtime.fxState?.open)$('bFx').click();}
  else if(e.find.tool==='favorites')$('bFavorites').click();
  runtime.audio?.();draw();
 }

 // ---------- interfaz ----------
 const bar=$('labBar');bar.hidden=false;document.body.classList.add('lab');
 // La barra se aparta cuando hay una hoja abierta (notas, favoritos, menú…).
 setInterval(()=>{bar.hidden=!!document.querySelector('.modal:not([hidden])');},200);
 function draw(){
  const e=labElement(book.current),i=LAB_ELEMENTS.indexOf(e),n=book.notes[e.id];
  $('labName').textContent=e.name;$('labMeta').textContent=`${e.group} · ${i+1} de ${LAB_ELEMENTS.length}${n?.verdict?' · '+LAB_VERDICTS[n.verdict]:''}`;
  $('labTry').innerHTML=e.try.map(t=>`<li>${t}</li>`).join('');$('labSolo').setAttribute('aria-pressed',String(!!book.solo));
  if(!$('mLab').hidden)drawSheet();
 }
 function drawSheet(){
  const e=labElement(book.current),n=note(e.id);
  $('labSheetName').textContent=e.name;
  $('labVerdicts').innerHTML=Object.entries(LAB_VERDICTS).map(([k,v])=>`<button data-verdict="${k}" aria-pressed="${n.verdict===k}">${v}</button>`).join('');
  $('labChecks').innerHTML=LAB_CHECKS.map(c=>{const v=n.checks[c.id];return `<button data-check="${c.id}" class="lab-check ${v===true?'yes':v===false?'no':''}">${v===true?'✓':v===false?'✗':'·'} ${c.label}</button>`;}).join('');
  if(document.activeElement!==$('labText'))$('labText').value=n.text;
  const tested=LAB_ELEMENTS.filter(x=>labTested(book.notes[x.id])).length;$('labProgress').textContent=`Probados ${tested} de ${LAB_ELEMENTS.length}`;
  $('labList').innerHTML=LAB_GROUPS.map(g=>`<p class="lab-group">${g}</p>`+LAB_ELEMENTS.filter(x=>x.group===g).map(x=>{const v=book.notes[x.id]?.verdict;return `<button data-go="${x.id}" class="${x.id===e.id?'here':''} ${v?'v-'+v:labTested(book.notes[x.id])?'v-seen':''}">${x.name}${v?' · '+LAB_VERDICTS[v]:''}</button>`;}).join('')).join('');
 }
 const touch=()=>{note(book.current).at=Date.now();keep();};
 $('labPrev').onclick=()=>go(labStep(book.current,-1).id);
 $('labNext').onclick=()=>go(labStep(book.current,1).id);
 $('labHere').onclick=()=>go();
 $('labSolo').onclick=()=>{book.solo=!book.solo;runtime.labSolo=book.solo;keep();draw();runtime.toast(book.solo?'<em>Solo</em> · la música del lugar calla; oyes el elemento':'<em>Solo</em> · vuelve la música del lugar');};
 $('labNotes').onclick=()=>{$('mLab').hidden=false;drawSheet();};
 $('labClose').onclick=()=>{$('mLab').hidden=true;};
 $('labVerdicts').onclick=e=>{const b=e.target.closest('[data-verdict]');if(!b)return;const n=note(book.current);n.verdict=n.verdict===b.dataset.verdict?'':b.dataset.verdict;touch();drawSheet();draw();};
 // Cada pregunta rota: sin marcar → sí → no → sin marcar.
 $('labChecks').onclick=e=>{const b=e.target.closest('[data-check]');if(!b)return;const n=note(book.current),v=n.checks[b.dataset.check];if(v===undefined)n.checks[b.dataset.check]=true;else if(v===true)n.checks[b.dataset.check]=false;else delete n.checks[b.dataset.check];touch();drawSheet();};
 $('labText').oninput=()=>{note(book.current).text=$('labText').value.slice(0,1200);touch();};
 $('labList').onclick=e=>{const b=e.target.closest('[data-go]');if(!b)return;$('mLab').hidden=true;go(b.dataset.go);};
 const report=()=>labReport(book.notes,{date:new Date().toISOString().slice(0,10)});
 $('labCopy').onclick=async()=>{let ok=false;try{await navigator.clipboard.writeText(report());ok=true;}catch(_){}
  if(!ok){$('labText').value=report();$('labText').select();}runtime.toast(ok?'<em>Informe</em> · copiado. Pégalo en el chat':'<em>Informe</em> · selecciónalo y cópialo');};
 $('labDownload').onclick=()=>{const url=URL.createObjectURL(new Blob([report()],{type:'text/markdown'})),a=document.createElement('a');a.href=url;a.download=`laboratorio-${new Date().toISOString().slice(0,10)}.md`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 $('labExit').onclick=()=>{const url=new URL(location.href);for(const k of ['testSeed','layout','generation','lab','encounter'])url.searchParams.delete(k);location.assign(url.href);};
 Object.defineProperties(runtime,{labGo:{get:()=>go},labBook:{get:()=>book},labReportText:{get:()=>report}});
 // Arranque: el mundo de prueba ya está en el Mundo (seeds.js); ponte frente al elemento en curso.
 requestAnimationFrame(()=>go());
}
