import {HYBRID_STYLES,hybridIdentity} from './musical-hybrids.js';
// Production travel selects existing terrain; it never completes the Camino or awards music.
import {groveNodes} from './connection-groves.js';
import {labScore} from './lab-score.js';
export function* genrePlaces(runtime,origin={x:runtime.S.wx,y:runtime.S.wy},radius=40){
 const size=runtime.REG*runtime.WCH,ox=Math.floor(origin.x/size),oy=Math.floor(origin.y/size);
 for(let ring=0;ring<=radius;ring++)for(let dx=-ring;dx<=ring;dx++)for(let dy=-ring;dy<=ring;dy++){
  if(Math.max(Math.abs(dx),Math.abs(dy))!==ring)continue;
  const x=(ox+dx+.5)*size,y=(oy+dy+.5)*size;
  if(Math.abs(x)>1e12-1e6||Math.abs(y)>1e12-1e6)continue;
  const region=runtime.regionOfPos(x,y);yield region.sea?null:{x,y,layer:'superficie',region};
 }
}
export function initialize(runtime){
 const $=runtime.$,destinations=new Map();let owner=runtime.S,search=null,query='',mode='genres',busy=false,generation=0;
 const names=()=>((mode==='hybrids'?HYBRID_STYLES.map(h=>['fusion:'+h.id,h]):Object.entries(runtime.GEN))).sort((a,b)=>a[1].name.localeCompare(b[1].name,'es'));
 function render(){
  $('musicTravelConnections').disabled=busy;
  $('musicTravelFull').disabled=busy;$('musicTravelSolo').disabled=busy;$('musicTravelBack').hidden=!runtime.S.practiceTravel?.previous;$('musicTravelBack').disabled=busy||!runtime.canPracticeTravel?.();
  const heard=mode==='hybrids'?Object.fromEntries(Object.entries(runtime.S.journal?.music?.hybrids||{}).map(([id,v])=>['fusion:'+id,v])):runtime.S.journal?.music?.genres||{},rows=names().filter(([id,g])=>(g.name+' '+id).toLocaleLowerCase('es').includes(query));
  $('musicTravelGenres').setAttribute('aria-pressed',String(mode==='genres'));$('musicTravelHybrids').setAttribute('aria-pressed',String(mode==='hybrids'));
  $('musicTravelCount').textContent=`${names().filter(([id])=>heard[id]).length} de ${names().length} escuchados`;
  $('musicTravelList').replaceChildren(...rows.map(([id,g])=>{
   const row=document.createElement('div'),button=document.createElement('button'),check=document.createElement('span');row.className='music-destination';
   button.textContent=g.name;button.dataset.musicGenre=id;button.disabled=busy;button.setAttribute('aria-label','Viajar a '+g.name);
   check.textContent=heard[id]?'✓ Escuchado':'Por descubrir';check.className=heard[id]?'music-heard':'';row.append(button,check);return row;
  }));
 }
 function reset(){if(owner!==runtime.S){owner=runtime.S;destinations.clear();search=null;generation++;busy=false;}}
 async function find(id,token){
  if(destinations.has(id))return destinations.get(id);
  search||=genrePlaces(runtime);
  let done=false;
  while(!done&&token===generation){
   for(let i=0;i<24;i++){
    const next=search.next();if(next.done){done=true;break;}
    const p=next.value;if(p){if(!destinations.has(p.region.genre))destinations.set(p.region.genre,p);const fusion=hybridIdentity(p.region,runtime.seedOf,runtime.rng);if(fusion&&!destinations.has('fusion:'+fusion.id))destinations.set('fusion:'+fusion.id,p);}
    if(p&&id==='connections'){
     const nodes=groveNodes(Math.floor(p.x/runtime.WCH),Math.floor(p.y/runtime.WCH),runtime.WCH,p.region,runtime.seedOf),node=nodes[5];
     if(node)destinations.set('connections',{...p,x:node.x,y:node.y});
    }
    if(p&&id==='solo'&&labScore(p.region,runtime.seedOf,runtime.rng)?.electronic?.count===1)destinations.set('solo',p);
    if(p&&id==='full'&&labScore(p.region,runtime.seedOf,runtime.rng)?.electronic?.count===10)destinations.set('full',p);
    if(destinations.has(id))return destinations.get(id);
   }
   if(!done)await new Promise(resolve=>setTimeout(resolve,0));
  }
  return null;
 }
 async function go(id){
  reset();if(busy||!runtime.GEN[id]&&!['connections','full','solo'].includes(id)&&!HYBRID_STYLES.some(h=>'fusion:'+h.id===id)||!runtime.inWorld()||!runtime.canPracticeTravel?.())return false;
  busy=true;const token=++generation,scope=runtime.S;render();$('musicTravelStatus').textContent='Buscando un lugar real…';
  try{
   const point=await find(id,token);
   if(token!==generation||scope!==runtime.S||$('mMusicTravel').hidden||!runtime.inWorld())return false;
   if(!point){$('musicTravelStatus').textContent='No aparece cerca. Prueba otro estilo.';return false;}
   if(!runtime.travelPracticePoint(point)){ $('musicTravelStatus').textContent='Termina la grabación o revisa el guardado.';return false;}
   $('mMusicTravel').hidden=true;runtime.toast(id==='connections'?'Toca para conectar. Permanece sobre un hilo para retirarlo.':id==='solo'?'Una voz. Camina para encontrar otra respuesta.':point.region.name+' · '+runtime.GEN[point.region.genre].name);return true;
  }finally{if(token===generation){busy=false;render();}}
 }
 function open(){if(!runtime.inWorld())return;reset();mode='genres';query='';$('musicTravelSearch').value='';$('musicTravelStatus').textContent='Viaja, escucha y descubre.';render();$('mMusicTravel').hidden=false;}
 $('bStyles').onclick=open;$('musicTravelClose').onclick=()=>{generation++;busy=false;$('mMusicTravel').hidden=true;};
 $('musicTravelConnections').onclick=()=>go('connections');
 $('musicTravelFull').onclick=()=>go('full');$('musicTravelSolo').onclick=()=>go('solo');
 $('musicTravelBack').onclick=()=>{if(busy)return;if(runtime.returnPracticePlace())$('mMusicTravel').hidden=true;else $('musicTravelStatus').textContent='Revisa el guardado antes de volver.';};
 for(const [button,value]of [['musicTravelGenres','genres'],['musicTravelHybrids','hybrids']])$(button).onclick=()=>{if(busy)return;mode=value;query='';$('musicTravelSearch').value='';render();};
 $('musicTravelSearch').oninput=e=>{query=e.target.value.toLocaleLowerCase('es');render();};
 $('musicTravelList').onclick=e=>{const b=e.target.closest('[data-music-genre]');if(b)go(b.dataset.musicGenre);};
 $('bStyles').hidden=!runtime.inWorld();
 setInterval(()=>{$('bStyles').hidden=!runtime.inWorld();reset();},250);
 Object.defineProperties(runtime,{openMusicTravel:{get:()=>open},travelMusicGenre:{get:()=>go}});
}
