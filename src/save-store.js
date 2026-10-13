import {sameWorld,supportedWorld,validWorldIdentity} from './world-identity.js';
export const SAVE_VERSION=1,MAX_SAVE_BYTES=8*1024*1024;
const incompatible=message=>Object.assign(new Error(message),{code:'incompatible'});
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
export function checkSaveSize(raw){if(typeof raw!=='string'||new TextEncoder().encode(raw).byteLength>MAX_SAVE_BYTES)throw Error('Archivo demasiado grande');return raw;}
export function checkSaveTree(value){
 let count=0;function visit(v,depth){if(++count>150000||depth>24)throw Error('Partida demasiado compleja');
  if(typeof v==='number'&&!Number.isFinite(v))throw Error('Número inválido');
  if(typeof v==='string'&&v.length>65536)throw Error('Texto demasiado largo');
  if(v&&typeof v==='object')for(const [key,next]of Object.entries(v)){if(['__proto__','prototype','constructor'].includes(key))throw Error('Clave no permitida');visit(next,depth+1);}
 }visit(value,0);return value;
}
export function validateSave(value,defaults,identity){
 if(!object(value))throw Error('El archivo no contiene una partida');checkSaveTree(value);
 if(value.saveVersion!==undefined&&value.saveVersion!==SAVE_VERSION){if(Number.isInteger(value.saveVersion)&&value.saveVersion>SAVE_VERSION)throw incompatible('Versión de partida no compatible');throw Error('Versión de partida inválida');}
 if(value.worldIdentity!==undefined){if(!validWorldIdentity(value.worldIdentity))throw Error('Identidad de mundo inválida');if(!supportedWorld(value.worldIdentity)||!sameWorld(value.worldIdentity,identity))throw incompatible('Mundo o versión no compatible');}
 for(const [key,fallback]of Object.entries(defaults)){
  if(value[key]===undefined||fallback===null)continue;
  const v=value[key];if(Array.isArray(fallback)?!Array.isArray(v):typeof fallback==='object'?!object(v):typeof v!==typeof fallback)throw Error('Campo inválido: '+key);
 }
 for(const key of ['wx','wy','px','py'])if(value[key]!==undefined&&Math.abs(value[key])>=1e12)throw Error('Posición fuera de rango');
 for(const key of ['ach','help','cat','species','places','events','zones','retos'])if(value[key]!==undefined&&!object(value[key]))throw Error('Registro inválido: '+key);
 if(value.studio){if(value.studio.slots!==undefined&&!object(value.studio.slots))throw Error('Estudio inválido');for(const p of ['x','y'])if(value.studio[p]!==undefined&&value.studio[p]!==null&&(typeof value.studio[p]!=='number'||Math.abs(value.studio[p])>=1e12))throw Error('Posición de Estudio inválida');}
 if(value.journal){for(const [k,v]of Object.entries(value.journal))if(!object(v))throw Error('Bitácora inválida: '+k);for(const [k,v]of Object.entries(value.journal.music||{}))if(!object(v))throw Error('Registro musical inválido: '+k);}
 if(value.stars?.some(v=>!object(v)))throw Error('Reliquias inválidas');
 if(value.trail?.some(v=>!Array.isArray(v)||v.length!==2||!v.every(Number.isFinite)))throw Error('Camino inválido');
 if(value.rel!==undefined&&value.rel!==null&&(!object(value.rel)||!Array.isArray(value.rel.list)||value.rel.list.some(v=>!object(v))))throw Error('Reliquias antiguas inválidas');
 if(value.favorites!==undefined&&(!object(value.favorites)||!Array.isArray(value.favorites.items)))throw Error('Favoritos inválidos');
 if(value.mode!==undefined&&!['camino','world','studio'].includes(value.mode))throw Error('Modo inválido');
 if(value.layer!==undefined&&!['superficie','bajo','cielo'].includes(value.layer))throw Error('Capa inválida');
 for(const key of ['todayKey','lastDay','lastWorldDay','lampDay'])if(value[key]!==undefined&&value[key]!==null&&(typeof value[key]!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value[key])))throw Error('Fecha inválida: '+key);
 if(value.session!==undefined&&value.session!==null){const q=value.session;if(!object(q)||q.version!==1||!['baseline','visited','genres','instruments'].every(k=>object(q[k]))||!Number.isFinite(q.seconds)||q.seconds<0)throw Error('Sesión inválida');}
 if(value.lastSession!==undefined&&value.lastSession!==null){const q=value.lastSession;if(!object(q)||!['visited','genres','instruments'].every(k=>Array.isArray(q[k]))||!Number.isFinite(q.seconds))throw Error('Resumen inválido');}
 const base=structuredClone(defaults),result={...base,...value,saveVersion:SAVE_VERSION,worldIdentity:{...identity}};
 result.studio={...base.studio,...value.studio};result.journal={...base.journal,...value.journal};result.journal.music={...base.journal.music,...value.journal?.music};
 return result;
}
export function parseSave(raw,defaults,identity){return validateSave(JSON.parse(checkSaveSize(raw)),defaults,identity);}
export function createSaveStore(storage,key,defaults,identity){
 const status={kind:'ok',message:'Progreso guardado',locked:false},backupKey=key+':backup';let lastGood=null,original=null,backupWritten=false;
 const setStatus=(kind,message,locked=false)=>Object.assign(status,{kind,message,locked});
 function load(){
  let raw;try{raw=storage.getItem(key);original=raw;}catch(_){setStatus('unavailable','El navegador no permite leer el progreso');return structuredClone(defaults);}
  if(!raw)return structuredClone(defaults);
  try{const value=parseSave(raw,defaults,identity);lastGood=raw;return value;}catch(error){
   if(error.code==='incompatible'){setStatus('unsupported','Esta partida necesita su mundo y versión compatibles. Conservamos el original.',true);return structuredClone(defaults);}
   try{const copy=storage.getItem(backupKey);if(copy){const value=parseSave(copy,defaults,identity);lastGood=copy;setStatus('recovered','Recuperamos la última copia válida. El original está conservado.',true);return value;}}catch(_){}
   setStatus('corrupt','No pudimos leer la partida. Conservamos el original para recuperar o exportar.',true);return structuredClone(defaults);
  }
 }
 function save(state){
  if(status.locked)return false;
  let raw;try{raw=checkSaveSize(JSON.stringify(validateSave(state,defaults,identity)));
   // Reserve a last-known-good copy before the first overwrite in this session.
   if(lastGood&&!backupWritten){storage.setItem(backupKey,lastGood);backupWritten=true;}
   storage.setItem(key,raw);lastGood=raw;setStatus('ok','Progreso guardado');return true;
  }catch(_){setStatus('write-error','No se pudo guardar. Exporta una copia; seguimos conservando tu progreso en esta sesión.');return false;}
 }
 function restore(state){
  const valid=validateSave(state,defaults,identity),raw=checkSaveSize(JSON.stringify(valid));
  // Preserve the actual on-disk original before replacing it, including corrupt data.
  const current=storage.getItem(key);if(current)storage.setItem(key+':before-restore',current);
  storage.setItem(key,raw);lastGood=raw;backupWritten=false;setStatus('ok','Partida restaurada');return valid;
 }
 function recover(){if(status.kind!=='recovered')throw Error('No hay copia válida para recuperar');return restore(parseSave(lastGood,defaults,identity));}
 return {load,save,restore,recover,status,original:()=>original,backupKey,key};
}
export function makeBackup(state,defaults,identity,scope){return {format:'whitedot-backup',version:SAVE_VERSION,createdAt:new Date().toISOString(),scope,worldIdentity:{...identity},state:validateSave(state,defaults,identity)};}
export function readBackup(raw,defaults,identity,scope){
 const file=JSON.parse(checkSaveSize(raw));if(!object(file))throw Error('El archivo no contiene un respaldo');checkSaveTree(file);
 if(file.format!=='whitedot-backup'||file.version!==SAVE_VERSION||!sameWorld(file.worldIdentity,identity)||file.scope?.kind!==scope.kind||file.scope?.seed!==scope.seed||file.scope?.layout!==scope.layout)throw Error('Este archivo pertenece a otra partida, semilla o versión');
 return validateSave(file.state,defaults,identity);
}
