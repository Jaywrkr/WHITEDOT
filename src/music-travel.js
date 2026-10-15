// Production travel selects existing terrain; it never completes the Camino or awards music.
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
 const $=runtime.$,destinations=new Map();let owner=runtime.S,search=null,query='',busy=false,generation=0;
 const names=()=>Object.entries(runtime.GEN).sort((a,b)=>a[1].name.localeCompare(b[1].name,'es'));
 function render(){
  const heard=runtime.S.journal?.music?.genres||{},rows=names().filter(([id,g])=>(g.name+' '+id).toLocaleLowerCase('es').includes(query));
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
    const p=next.value;if(p&&!destinations.has(p.region.genre))destinations.set(p.region.genre,p);
    if(destinations.has(id))return destinations.get(id);
   }
   if(!done)await new Promise(resolve=>setTimeout(resolve,0));
  }
  return null;
 }
 async function go(id){
  reset();if(busy||!runtime.GEN[id]||!runtime.inWorld()||!runtime.canPracticeTravel?.())return false;
  busy=true;const token=++generation,scope=runtime.S;render();$('musicTravelStatus').textContent='Buscando un lugar real…';
  try{
   const point=await find(id,token);
   if(token!==generation||scope!==runtime.S||$('mMusicTravel').hidden||!runtime.inWorld())return false;
   if(!point){$('musicTravelStatus').textContent='No aparece cerca. Prueba otro estilo.';return false;}
   if(!runtime.travelPracticePoint(point)){ $('musicTravelStatus').textContent='Termina la grabación o revisa el guardado.';return false;}
   $('mMusicTravel').hidden=true;runtime.toast(point.region.name+' · '+runtime.GEN[id].name);return true;
  }finally{if(token===generation){busy=false;render();}}
 }
 function open(){if(!runtime.inWorld())return;reset();query='';$('musicTravelSearch').value='';$('musicTravelStatus').textContent='Viaja, escucha y descubre.';render();$('mMusicTravel').hidden=false;}
 $('bStyles').onclick=open;$('musicTravelClose').onclick=()=>{generation++;busy=false;$('mMusicTravel').hidden=true;};
 $('musicTravelSearch').oninput=e=>{query=e.target.value.toLocaleLowerCase('es');render();};
 $('musicTravelList').onclick=e=>{const b=e.target.closest('[data-music-genre]');if(b)go(b.dataset.musicGenre);};
 setInterval(()=>{$('bStyles').hidden=!runtime.inWorld();reset();},250);
 Object.defineProperties(runtime,{openMusicTravel:{get:()=>open},travelMusicGenre:{get:()=>go}});
}
