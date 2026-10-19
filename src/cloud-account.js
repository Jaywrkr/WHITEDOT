import {CLOUD_CONFIG} from './cloud-config.js';
import {createCloudClient} from './cloud-client.js';
import {createCloudSync} from './cloud-sync.js';
import {validateSave,makeBackup} from './save-store.js';
export function initialize(runtime){
 const $=runtime.$,status=text=>{$('connectionStatus').textContent=text;};let client=null,sync=null,busy=false,recovery=false,checked=false,nextTick=0,scopeState=runtime.S;
 try{client=createCloudClient(CLOUD_CONFIG);}catch(e){status(e.message);}
 if(client){let storage;try{storage=globalThis.localStorage;}catch(_){}sync=createCloudSync({client,storage:storage||{getItem:()=>null,setItem(){}},onStatus:status});}
 function ui(){const live=!!client?.user();$('accountGuest').textContent=live?'Volver al juego':'Seguir sin cuenta';$('accountState').textContent=live?'Cuenta conectada · '+client.user().email:'Juegas sin cuenta. Tu progreso permanece en este dispositivo.';
  for(const id of ['accountRegister','accountRecover','accountVerify','accountVerifyRecovery'])$(id).disabled=!client||busy;
  $('accountForm').querySelector('[type="submit"]').disabled=!client||busy;
  for(const id of ['cloudPush','cloudPull','cloudDownload'])$(id).disabled=!live||busy||recovery||!checked;
  $('accountLogout').disabled=!live||busy;$('accountDelete').disabled=!live||busy||recovery;$('accountUpdatePassword').disabled=!live||!recovery||busy;
  if(!client)status('Cuenta online aún no configurada para estas pruebas. Puedes seguir jugando sin cuenta.');
 }
 async function run(action){if(busy)return;busy=true;ui();try{await action();}catch(e){status(e.message);}finally{busy=false;ui();}}
 async function inspect(){checked=false;scopeState=runtime.S;if(!client?.user())return;await sync.inspect(runtime.saveStore.key);checked=true;}
 function snapshot(){if(scopeState!==runtime.S||sync.scope!==runtime.saveStore.key)throw Error('La partida cambió. Abre Cuenta y respaldo de nuevo.');if(!runtime.save())throw Error('Primero resuelve el guardado local o exporta tu progreso.');return validateSave(runtime.S,runtime.fresh(),runtime.worldIdentity);}
 function download(state){const copy=makeBackup(validateSave(state,runtime.fresh(),runtime.worldIdentity),runtime.fresh(),runtime.worldIdentity,runtime.saveScope),url=URL.createObjectURL(new Blob([JSON.stringify(copy)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='kubono-copia-remota.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 $('bConnection').hidden=false;$('bConnection').textContent='Cuenta y respaldo';$('connectionRooms').hidden=true;
 $('bConnection').onclick=()=>{$('mMenu').hidden=true;$('mConnection').hidden=false;if(client&&!recovery)run(inspect);else ui();};$('connectionClose').onclick=()=>{$('mConnection').hidden=true;};
 function credentials(){if(!$('accountForm').reportValidity())return null;return [$('accountName').value.trim(),$('accountPassword').value];}
 $('accountForm').onsubmit=e=>{e.preventDefault();const values=credentials();if(!values||!client)return;run(async()=>{sync.reset();checked=false;recovery=false;try{await client.login(...values);}finally{$('accountPassword').value='';}await inspect();});};
 $('accountRegister').onclick=()=>{const values=credentials();if(!values||!client)return;run(async()=>{sync.reset();checked=false;try{await client.signup(...values);}finally{$('accountPassword').value='';}if(client.user())await inspect();else status('Revisa tu correo y escribe el código de confirmación.');});};
 $('accountRecover').onclick=()=>{const input=$('accountName');if(!input.reportValidity()||!client)return;run(async()=>{await client.recover(input.value.trim());status('Si la cuenta existe, recibirás un código para recuperar el acceso.');});};
 const verify=type=>run(async()=>{sync.reset();checked=false;await client.verify($('accountName').value.trim(),$('accountCode').value.trim(),type);$('accountCode').value='';recovery=type==='recovery';if(recovery)status('Acceso verificado. Escribe y guarda tu nueva clave.');else await inspect();});
 $('accountVerify').onclick=()=>{if(client)verify('signup');};$('accountVerifyRecovery').onclick=()=>{if(client)verify('recovery');};
 $('accountUpdatePassword').onclick=()=>{const input=$('accountNewPassword');if(!input.value||!input.reportValidity())return;run(async()=>{await client.password(input.value);input.value='';recovery=false;await inspect();});};
 $('accountLogout').onclick=()=>run(async()=>{sync.reset();checked=false;recovery=false;await client.logout();$('accountPassword').value='';$('accountCode').value='';$('accountNewPassword').value='';status('Sesión cerrada. Tu partida local permanece.');});
 $('accountGuest').onclick=()=>{$('mConnection').hidden=true;};
 $('accountDelete').onclick=()=>{if(!confirm('¿Eliminar la cuenta y todas sus copias online? Tu partida local se conserva.'))return;const values=credentials();if(!values)return;if(values[0].toLowerCase()!==client.user().email.toLowerCase()){status('Escribe el correo de tu cuenta conectada y su clave para confirmar.');return;}run(async()=>{sync.reset();checked=false;try{await client.erase(values[1]);}finally{$('accountPassword').value='';}status('Cuenta y copias online eliminadas. Tu partida local permanece.');});};
 $('cloudPush').onclick=()=>{if(!confirm('¿Usar esta partida local como copia online? Se reemplazará la copia online de este mundo.'))return;run(async()=>{if(scopeState!==runtime.S)await inspect();await sync.push(snapshot,{manual:true});});};
 $('cloudPull').onclick=()=>{if(!confirm('¿Recuperar la copia online? Conservaremos un respaldo de tu partida local antes de reemplazarla.'))return;run(()=>sync.pull(state=>{if(scopeState!==runtime.S||sync.scope!==runtime.saveStore.key)throw Error('La partida cambió.');const valid=validateSave(state,runtime.fresh(),runtime.worldIdentity);snapshot();runtime.S=runtime.saveStore.restore(valid);scopeState=runtime.S;runtime.collected=new Set(runtime.S.collected);runtime.chunks.clear();runtime.wchunks.clear();runtime.bcache.clear();runtime.hud();}));};
 $('cloudDownload').onclick=()=>run(async()=>{const state=runtime.S,scope=runtime.saveStore.key,copy=await client.read(scope);if(state!==runtime.S)throw Error('La partida cambió.');if(!copy?.state)throw Error('Todavía no hay copia online.');download(copy.state);status('Copia descargada. Tu partida local permanece.');});
 const tick=()=>{if(performance.now()<nextTick)return;nextTick=performance.now()+1000;if(scopeState!==runtime.S||sync?.scope&&sync.scope!==runtime.saveStore.key){sync?.reset();checked=false;scopeState=runtime.S;}if(client?.user()&&checked&&!recovery&&!busy&&!document.hidden&&sync.ready)sync.push(snapshot).then(ui);};
 Object.defineProperty(runtime,'connectionTick',{get:()=>tick});ui();if(client?.user())run(inspect);
}
