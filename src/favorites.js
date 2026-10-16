import {favoriteSignatureSVG} from './wow-memory.js';
import {placeAddress,worldIdentity,supportedWorld,supportedMusic,sameWorld} from './world-identity.js';
export const FAVORITE_LIMIT=256;
const layers=new Set(['superficie','bajo','cielo']);
const cleanName=name=>String(name||'Lugar musical').trim().slice(0,60)||'Lugar musical';
const folded=value=>String(value||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase('es');
export const matchesFavorite=(point,query,genres={})=>folded([point.name,point.genre,genres[point.genre]?.name,point.character,point.regionName,point.notes].join(' ')).includes(folded(query));
export function normalizeFavorites(saved,identity=worldIdentity()){
 if(Number.isInteger(saved?.version)&&saved.version>1)return saved;
 const items=Array.isArray(saved?.items)?saved.items:[],seen=new Set();
 return {...(saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{}),version:1,items:items.filter(p=>p&&typeof p.id==='string'&&!seen.has(p.id)&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Math.abs(p.x)<1e12&&Math.abs(p.y)<1e12&&layers.has(p.layer)&&seen.add(p.id)).map(p=>({...p,name:cleanName(p.name),...(Object.hasOwn(p,'notes')?{notes:typeof p.notes==='string'?p.notes.slice(0,280):''}:{}),address:Object.hasOwn(p,'address')?(supportedWorld(p.address)?placeAddress(p.address,p.x,p.y,p.layer):p.address??null):placeAddress(identity,p.x,p.y,p.layer)}))};
}
export function storeFavorite(state,point){
 state.favorites=normalizeFavorites(state.favorites,state.worldIdentity||worldIdentity());if(state.favorites.version!==1)return null;const items=state.favorites.items;
 const existing=items.find(p=>p.layer===point.layer&&sameWorld(p.address,point.address||state.worldIdentity||worldIdentity())&&Math.hypot(p.x-point.x,p.y-point.y)<8);
 if(existing){Object.assign(existing,point,{id:existing.id,name:cleanName(point.name),address:placeAddress(point.address||state.worldIdentity||worldIdentity(),point.x,point.y,point.layer)});return existing;}
 if(items.length>=FAVORITE_LIMIT)return null;
 const stem=`favorite:${point.created}:${point.layer}:${Math.round(point.x)}:${Math.round(point.y)}`;let id=stem,serial=0;while(items.some(p=>p.id===id))id=`${stem}:${++serial}`;
 const result={...point,id,name:cleanName(point.name),address:point.address||placeAddress(state.worldIdentity||worldIdentity(),point.x,point.y,point.layer)};items.push(result);return result;
}
export function initialize(runtime){
 runtime.S.favorites=normalizeFavorites(runtime.S.favorites,runtime.worldIdentity);
 const readOnly=()=>runtime.S.favorites.version!==1,list=()=>Array.isArray(runtime.S.favorites.items)?runtime.S.favorites.items.filter(p=>p&&typeof p.id==='string'&&Number.isFinite(p.x)&&Number.isFinite(p.y)):[],$=runtime.$;let shown=20,query='';
 function persist(point,learn=false){
  if(!runtime.save()){runtime.toast('Lugar pendiente. Menú → Guardar copia.');render();return null;}
  if(learn){runtime.unlock('favorito1');runtime.firstJourneyEvent?.('save');}
  render();return point;
 }
 function add(name){
  if(!runtime.inWorld()||readOnly())return null;
  const s=runtime.S,region=runtime.activeLayerRegion?.()||runtime.regionOfPos(s.wx,s.wy);
  const point=storeFavorite(s,{address:placeAddress(runtime.musicalAddress?.()||runtime.worldIdentity,s.wx,s.wy,s.layer||'superficie'),name:name||region.name,x:s.wx,y:s.wy,layer:s.layer||'superficie',created:Date.now(),region:region.key,regionName:region.name,genre:region.genre,bpm:region.bpm,scale:[...region.scale],phase:runtime.livingEnvironment?.name||'',notes:'',character:region.recipe?.name||'',material:region.recipe?.materialName||'',recipeVersion:region.recipe?.version||1,musicStamp:runtime.musicStamp?.(region)});
  if(!point){runtime.toast(`<em>Favoritos</em> · Límite de ${FAVORITE_LIMIT}. Exporta tu copia.`);return null;}
  return persist(point,true);
 }
 // Guarda un lugar recibido por código. Si es del mismo mundo, completa su identidad musical.
 function addAddress(address,name){
  const s=runtime.S,same=sameWorld(address,runtime.worldIdentity),region=same&&address.layer==='superficie'?runtime.regionOfPos(address.x,address.y):null;
  const point=storeFavorite(s,{address,name,x:address.x,y:address.y,layer:address.layer,created:Date.now(),shared:true,region:region?.key||'',regionName:region?.name||'',genre:region?.genre||'',bpm:region?.bpm||0,scale:region?[...region.scale]:[],character:region?.recipe?.name||'',material:region?.recipe?.materialName||'',...(region?{musicStamp:runtime.musicStamp?.(region,address.musicMode)}:{})});
  return point?persist(point):null;
 }
 function rename(id,name){if(readOnly())return null;const point=list().find(p=>p.id===id);if(point){point.name=cleanName(name);runtime.save();}return point;}
 function remove(id){if(readOnly())return;runtime.S.favorites.items=list().filter(p=>p.id!==id);runtime.favoriteRemoved?.(id);runtime.save();render();}
 function render(){
  const body=$('favoritesBody');body.replaceChildren();$('favSave').disabled=!runtime.inWorld()||readOnly();
  $('favNote').textContent=readOnly()?'Lugares conservados. Actualiza para editarlos.':runtime.inWorld()?'Guarda el lugar. Su música sigue viviendo.':'Entra al Mundo. Tus lugares siguen guardados.';
  if(!list().length){const p=document.createElement('p');p.textContent='Todavía no hay lugares guardados.';body.append(p);}
  const matching=list().slice().reverse().filter(p=>matchesFavorite(p,query,runtime.GEN));$('favCount').textContent=matching.length+' lugares';
  if(list().length&&!matching.length){const p=document.createElement('p');p.textContent='Prueba otro nombre o estilo.';body.append(p);}
  for(const point of matching.slice(0,shown)){
   const card=document.createElement('article');card.className='journal-card favorite-card';card.dataset.favorite=point.id;
   const title=document.createElement('h3'),label=document.createElement('span'),signature=document.createElement('span');title.className='favorite-title';label.textContent=point.name;signature.className='favorite-signature';signature.innerHTML=favoriteSignatureSVG(point);title.append(label,signature);const input=document.createElement('input');input.value=point.name;input.maxLength=60;input.setAttribute('aria-label','Nombre del favorito');
   const details=document.createElement('p');details.textContent=[point.layer==='bajo'?'Subsuelo':point.layer==='cielo'?'Cielo':'Superficie',point.genre?(runtime.GEN[point.genre]?.name||point.genre):'',point.bpm?`${point.bpm} BPM`:''].filter(Boolean).join(' · ');
   const notes=document.createElement('textarea');notes.rows=2;notes.maxLength=280;notes.value=point.notes||'';notes.setAttribute('aria-label','Recuerdo del lugar');notes.placeholder='Qué te gusta de este lugar';notes.onchange=()=>{point.notes=notes.value.slice(0,280);runtime.save();};
   const edit=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Editar y compartir';edit.append(summary);const row=document.createElement('div');row.className='row';
   const button=(text,callback)=>{const b=document.createElement('button');b.textContent=text;b.onclick=callback;row.append(b);return b;};
   button('Renombrar',()=>{rename(point.id,input.value);input.value=point.name;label.textContent=point.name;});button('Borrar',()=>remove(point.id));
   button('Código',async()=>{try{const code=runtime.encodeFavorite?.(point);if(code){$('placeCode').value=code;try{await navigator.clipboard.writeText(code);runtime.toast('<em>Código</em> · copiado');}catch(_){runtime.toast('<em>Código</em> · listo para copiar arriba');}}}catch(_){}});
   const visit=document.createElement('button');visit.textContent='Ir a este lugar';visit.disabled=!supportedWorld(point.address)||!supportedMusic(point.address);visit.onclick=()=>runtime.visitWorldAddress?.(point.address);
   const route=document.createElement('div');route.className='row';if(sameWorld(point.address,runtime.worldIdentity))runtime.favoriteActions?.(point,route);
   const provenance=document.createElement('p');provenance.textContent=[point.character,point.shared?'Compartido':'',`${Math.round(point.x)}, ${Math.round(point.y)}`].filter(Boolean).join(' · ');if(readOnly()){input.disabled=notes.disabled=true;for(const b of row.querySelectorAll('button'))if(b.textContent!=='Código')b.disabled=true;}
   edit.append(provenance,input,notes,row,route);card.append(title,details,visit,edit);body.append(card);
  }
  if(shown<matching.length){const more=document.createElement('button');more.textContent='Ver más lugares';more.onclick=()=>{shown+=20;render();};body.append(more);}
  $('favReturn').hidden=!runtime.previousWorldAddress?.();
  runtime.refreshDestinations?.();
 }
 function open(){runtime.stopScanner?.();shown=20;query='';$('favSearch').value='';$('arrivalMode').value=runtime.S.arrivalMode==='continue'?'continue':'explore';const region=runtime.inWorld()?(runtime.activeLayerRegion?.()||runtime.regionOfPos(runtime.S.wx,runtime.S.wy)):null;$('favName').value=region?.name||'';render();$('mFavorites').hidden=false;}
 $('favSearch').oninput=e=>{query=e.target.value.trim().toLocaleLowerCase('es');shown=20;render();};$('arrivalMode').onchange=e=>{runtime.S.arrivalMode=e.target.value;runtime.save();};
 $('bFavorites').onclick=open;$('era').onclick=()=>{if(runtime.inWorld())open();};$('quickSave').onclick=()=>{if(!runtime.inWorld()||readOnly())return;const s=runtime.S,existing=list().find(p=>p.layer===(s.layer||'superficie')&&sameWorld(p.address,runtime.worldIdentity)&&Math.hypot(p.x-s.wx,p.y-s.wy)<8);if(existing){persist(existing,true);open();return;}const point=add();if(point)runtime.toast('<em>Lugar guardado</em> · Toca su nombre para volver.');};$('favReturn').onclick=()=>{const address=runtime.previousWorldAddress?.();if(address)runtime.visitWorldAddress?.(address);};$('favoritesClose').onclick=()=>{$('mFavorites').hidden=true;};
 $('favForm').onsubmit=e=>{e.preventDefault();add($('favName').value);};
 Object.defineProperties(runtime,{favorites:{get:()=>list()},addFavorite:{get:()=>add},addFavoriteAddress:{get:()=>addAddress},renameFavorite:{get:()=>rename},removeFavorite:{get:()=>remove},openFavorites:{get:()=>open},renderFavorites:{get:()=>render}});
}
