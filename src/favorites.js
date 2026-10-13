import {placeAddress,worldIdentity,supportedWorld,sameWorld} from './world-identity.js';
export const FAVORITE_LIMIT=64;
const layers=new Set(['superficie','bajo','cielo']);
const cleanName=name=>String(name||'Lugar musical').trim().slice(0,60)||'Lugar musical';
export function normalizeFavorites(saved,identity=worldIdentity()){
 const items=Array.isArray(saved?.items)?saved.items:[],seen=new Set();
 return {version:1,items:items.filter(p=>p&&typeof p.id==='string'&&!seen.has(p.id)&&seen.add(p.id)&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Math.abs(p.x)<1e12&&Math.abs(p.y)<1e12&&layers.has(p.layer)).slice(0,FAVORITE_LIMIT).map(p=>({...p,name:cleanName(p.name),address:Object.hasOwn(p,'address')?(supportedWorld(p.address)?placeAddress(p.address,p.x,p.y,p.layer):p.address??null):placeAddress(identity,p.x,p.y,p.layer)}))};
}
export function storeFavorite(state,point){
 state.favorites=normalizeFavorites(state.favorites,state.worldIdentity||worldIdentity());const items=state.favorites.items;
 const existing=items.find(p=>p.layer===point.layer&&sameWorld(p.address,point.address||state.worldIdentity||worldIdentity())&&Math.hypot(p.x-point.x,p.y-point.y)<8);
 if(existing){Object.assign(existing,point,{id:existing.id,name:cleanName(point.name),address:placeAddress(point.address||state.worldIdentity||worldIdentity(),point.x,point.y,point.layer)});return existing;}
 if(items.length>=FAVORITE_LIMIT)return null;
 const id=`favorite:${point.created}:${point.layer}:${Math.round(point.x)}:${Math.round(point.y)}`;
 const result={...point,id,name:cleanName(point.name),address:point.address||placeAddress(state.worldIdentity||worldIdentity(),point.x,point.y,point.layer)};items.push(result);return result;
}
export function initialize(runtime){
 runtime.S.favorites=normalizeFavorites(runtime.S.favorites,runtime.worldIdentity);
 const list=()=>runtime.S.favorites.items,$=runtime.$;
 function add(name){
  if(!runtime.inWorld())return null;
  const s=runtime.S,region=runtime.activeLayerRegion?.()||runtime.regionOfPos(s.wx,s.wy);
  const point=storeFavorite(s,{address:placeAddress(runtime.worldIdentity,s.wx,s.wy,s.layer||'superficie'),name:name||region.name,x:s.wx,y:s.wy,layer:s.layer||'superficie',created:Date.now(),region:region.key,regionName:region.name,genre:region.genre,bpm:region.bpm,scale:[...region.scale],character:region.recipe?.name||'',material:region.recipe?.materialName||'',recipeVersion:region.recipe?.version||1});
  if(!point){runtime.toast('<em>Favoritos</em> · Límite de 64. Borra uno para guardar otro.');return null;}
  runtime.unlock('favorito1');runtime.save();render();return point;
 }
 function rename(id,name){const point=list().find(p=>p.id===id);if(point){point.name=cleanName(name);runtime.save();}return point;}
 function remove(id){runtime.S.favorites.items=list().filter(p=>p.id!==id);runtime.favoriteRemoved?.(id);runtime.save();render();}
 function render(){
  const body=$('favoritesBody');body.replaceChildren();$('favSave').disabled=!runtime.inWorld();
  $('favNote').textContent=runtime.inWorld()?'Guarda este punto. La región conserva su identidad; la música sigue evolucionando.':'Entra al Mundo para guardar un punto. Tus favoritos permanecen aquí.';
  if(!list().length){const p=document.createElement('p');p.textContent='Todavía no hay lugares guardados.';body.append(p);}
  for(const point of list()){
   const card=document.createElement('article');card.className='journal-card favorite-card';card.dataset.favorite=point.id;
   const input=document.createElement('input');input.value=point.name;input.maxLength=60;input.setAttribute('aria-label','Nombre del favorito');
   const details=document.createElement('p');details.textContent=`${point.layer==='bajo'?'Subsuelo':point.layer==='cielo'?'Cielo':'Superficie'} · ${runtime.GEN[point.genre]?.name||point.genre} · ${point.bpm} BPM · ${point.character} · (${Math.round(point.x)}, ${Math.round(point.y)})`;
   const row=document.createElement('div');row.className='row';
   const button=(text,callback)=>{const b=document.createElement('button');b.textContent=text;b.onclick=callback;row.append(b);return b;};
   button('Renombrar',()=>{rename(point.id,input.value);input.value=point.name;});button('Borrar',()=>remove(point.id));
   if(sameWorld(point.address,runtime.worldIdentity))runtime.favoriteActions?.(point,row);else{const note=document.createElement('p');note.textContent='Necesita su semilla y versión originales para regresar.';card.append(note);}
   card.append(input,details,row);body.append(card);
  }
  runtime.refreshDestinations?.();
 }
 function open(){const region=runtime.inWorld()?(runtime.activeLayerRegion?.()||runtime.regionOfPos(runtime.S.wx,runtime.S.wy)):null;$('favName').value=region?.name||'';render();$('mFavorites').hidden=false;}
 $('bFavorites').onclick=open;$('favoritesClose').onclick=()=>{$('mFavorites').hidden=true;};
 $('favForm').onsubmit=e=>{e.preventDefault();add($('favName').value);};
 Object.defineProperties(runtime,{favorites:{get:()=>list()},addFavorite:{get:()=>add},renameFavorite:{get:()=>rename},removeFavorite:{get:()=>remove},openFavorites:{get:()=>open},renderFavorites:{get:()=>render}});
}
