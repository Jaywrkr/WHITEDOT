import {makeBackup,readBackup,checkSaveSize,parseSave,MAX_SAVE_BYTES} from './save-store.js';
export function initialize(runtime){
 const $=runtime.$,panel=$('mSaveTools'),status=$('saveStatus');let pending=null,lastNotice='',reading=0;
 function text(message){status.textContent=message;}
 function refresh(){const s=runtime.storageStatus;text(s.message);$('saveRecover').hidden=s.kind!=='recovered';$('saveImportApply').disabled=!pending;$('saveOriginal').hidden=!runtime.saveStore.original()||!s.locked;}
 function download(value,name){const blob=new Blob([value],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function exportCurrent(){try{runtime.S.collected=[...runtime.collected];const data=makeBackup(runtime.S,runtime.fresh(),runtime.worldIdentity,runtime.saveScope);download(checkSaveSize(JSON.stringify(data)),`kubono-${runtime.saveScope.kind}-${runtime.saveScope.seed||'principal'}-${runtime.worldIdentity.generatorVersion===2?'vivo':'original'}.json`);text('Copia descargada. Guárdala para recuperar esta partida.');}catch(error){text(error.message);}}
 async function choose(file){pending=null;$('saveImportApply').disabled=true;const token=++reading;if(!file)return;
  try{if(file.size>MAX_SAVE_BYTES)throw Error('Archivo demasiado grande');const raw=await file.text();if(token!==reading)return;pending=readBackup(raw,runtime.fresh(),runtime.worldIdentity,runtime.saveScope);text(`Copia válida: ${Object.keys(pending.ach||{}).length} logros · ${pending.favorites.items.length} favoritos. Restaurar conserva una copia previa y recarga el juego.`);$('saveImportApply').disabled=false;}catch(error){if(token===reading)text(error.message);}
 }
 function apply(){if(!pending)return;try{runtime.stopAutopilot?.();runtime.saveStore.restore(pending);pending=null;location.reload();}catch(error){text('No se pudo restaurar: '+error.message);}}
 function recover(){try{runtime.saveStore.recover();location.reload();}catch(error){text('No se pudo recuperar: '+error.message);}}
 function open(){pending=null;$('saveImportFile').value='';$('saveImportName').textContent='Ningún archivo elegido';reading++;refresh();panel.hidden=false;}
 function tick(){const s=runtime.storageStatus;if(s.kind==='ok'){lastNotice='';return;}if(s.kind!==lastNotice&&runtime.toast){lastNotice=s.kind;runtime.toast('No pudimos guardar en este dispositivo. Tu progreso necesita atención.');}}
 $('bSaveTools').onclick=open;$('saveToolsClose').onclick=()=>{panel.hidden=true;reading++;pending=null;};$('saveExport').onclick=exportCurrent;$('saveImportFile').onchange=e=>{const f=e.target.files[0];$('saveImportName').textContent=f?f.name.slice(0,60):'Ningún archivo elegido';choose(f);};$('saveImportApply').onclick=apply;$('saveRecover').onclick=recover;
 $('saveOriginal').onclick=()=>download(runtime.saveStore.original(),'kubono-original-conservado.json');
 // Starting over (phase 6 of the plan): a new game on this device, with the current one kept as the previous game so it
 // can come back. Only without an account: with one, the cloud would take the empty game as the newest.
 const storage=()=>{try{return globalThis.localStorage;}catch(_){return null;}};
 const previousKey=()=>runtime.saveStore.key+':before-restore';
 const signedIn=()=>!!runtime.accountClient?.user?.();
 function previous(){try{return storage()?.getItem(previousKey())||null;}catch(_){return null;}}
 function settings(){const start=$('bStartOver'),back=$('bPreviousSave'),hint=$('startOverHint');if(!start)return;const online=signedIn();start.disabled=online;if(hint)hint.textContent=online?'Sal de la cuenta para usarlo':'Se guarda una copia';if(back)back.hidden=online||!previous();}
 // After replacing the save, nothing of this session may write over it before the page reloads.
 function freeze(){runtime.stopAutopilot?.();runtime.saveStore.save=()=>true;}
 let armed=0;
 function startOver(){if(signedIn())return false;const button=$('bStartOver'),label=button?.querySelector('span')?.firstChild;
  if(Date.now()-armed>3000){armed=Date.now();if(label)label.textContent='¿Seguro? ';return false;}
  try{runtime.saveStore.restore(runtime.fresh());freeze();location.reload();return true;}catch(error){text('No se pudo empezar de cero: '+error.message);return false;}}
 function goBack(){if(signedIn())return false;const raw=previous();if(!raw)return false;try{runtime.saveStore.restore(parseSave(raw,runtime.fresh(),runtime.worldIdentity));freeze();location.reload();return true;}catch(error){text('No se pudo volver: '+error.message);return false;}}
 if($('bStartOver'))$('bStartOver').onclick=startOver;if($('bPreviousSave'))$('bPreviousSave').onclick=goBack;
 const settingsSheet=$('mSettings');if(settingsSheet)new MutationObserver(()=>{if(!settingsSheet.hidden){armed=0;const label=$('bStartOver')?.querySelector('span')?.firstChild;if(label)label.textContent='Empezar de cero';settings();}}).observe(settingsSheet,{attributes:true,attributeFilter:['hidden']});
 Object.defineProperties(runtime,{saveToolsTick:{get:()=>tick},openSaveTools:{get:()=>open},startOver:{get:()=>startOver},previousSave:{get:()=>goBack},hasPreviousSave:{get:()=>()=>!!previous()}});
}
