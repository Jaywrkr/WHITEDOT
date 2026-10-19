import {makeBackup,readBackup,checkSaveSize,MAX_SAVE_BYTES} from './save-store.js';
export function initialize(runtime){
 const $=runtime.$,panel=$('mSaveTools'),status=$('saveStatus');let pending=null,lastNotice='',reading=0;
 function text(message){status.textContent=message;}
 function refresh(){const s=runtime.storageStatus;text(s.message);$('saveRecover').hidden=s.kind!=='recovered';$('saveImportApply').disabled=!pending;$('saveOriginal').hidden=!runtime.saveStore.original()||!s.locked;}
 function download(value,name){const blob=new Blob([value],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function exportCurrent(){try{runtime.S.collected=[...runtime.collected];const data=makeBackup(runtime.S,runtime.fresh(),runtime.worldIdentity,runtime.saveScope);download(checkSaveSize(JSON.stringify(data)),`whitedot-${runtime.saveScope.kind}-${runtime.saveScope.seed||'principal'}-${runtime.worldIdentity.generatorVersion===2?'vivo':'original'}.json`);text('Copia descargada. Guárdala para recuperar esta partida.');}catch(error){text(error.message);}}
 async function choose(file){pending=null;$('saveImportApply').disabled=true;const token=++reading;if(!file)return;
  try{if(file.size>MAX_SAVE_BYTES)throw Error('Archivo demasiado grande');const raw=await file.text();if(token!==reading)return;pending=readBackup(raw,runtime.fresh(),runtime.worldIdentity,runtime.saveScope);text(`Copia válida: ${Object.keys(pending.ach||{}).length} logros · ${pending.favorites.items.length} favoritos. Restaurar conserva una copia previa y recarga el juego.`);$('saveImportApply').disabled=false;}catch(error){if(token===reading)text(error.message);}
 }
 function apply(){if(!pending)return;try{runtime.stopAutopilot?.();runtime.saveStore.restore(pending);pending=null;location.reload();}catch(error){text('No se pudo restaurar: '+error.message);}}
 function recover(){try{runtime.saveStore.recover();location.reload();}catch(error){text('No se pudo recuperar: '+error.message);}}
 function open(){pending=null;$('saveImportFile').value='';reading++;refresh();panel.hidden=false;}
 function tick(){const s=runtime.storageStatus;if(s.kind==='ok'){lastNotice='';return;}if(s.kind!==lastNotice&&runtime.toast){lastNotice=s.kind;runtime.toast('No pudimos guardar en este dispositivo. Tu progreso necesita atención.');}}
 $('bSaveTools').onclick=open;$('saveToolsClose').onclick=()=>{panel.hidden=true;reading++;pending=null;};$('saveExport').onclick=exportCurrent;$('saveImportFile').onchange=e=>choose(e.target.files[0]);$('saveImportApply').onclick=apply;$('saveRecover').onclick=recover;
 $('saveOriginal').onclick=()=>download(runtime.saveStore.original(),'whitedot-original-conservado.json');
 Object.defineProperties(runtime,{saveToolsTick:{get:()=>tick},openSaveTools:{get:()=>open}});
}
