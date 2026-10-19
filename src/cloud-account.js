import {CLOUD_CONFIG} from './cloud-config.js';
import {createCloudClient} from './cloud-client.js';
import {createCloudSync} from './cloud-sync.js';
import {validateSave} from './save-store.js';
export function initialize(runtime){
 let conflictShown=false;const $=runtime.$,status=text=>{$('connectionStatus').textContent=text;if((text.startsWith('Hay avances distintos')||text.startsWith('La copia online cambió'))&&!document.hidden&&!conflictShown){conflictShown=true;$('mMenu').hidden=true;$('mConnection').hidden=false;}};let client=null,sync=null,busy=false,recovery=false,checked=false,nextTick=0,nextCheck=0,resumePending=false,scopeState=runtime.S;
 try{client=createCloudClient(CLOUD_CONFIG);}catch(e){status(e.message);}
 if(client){let storage;try{storage=globalThis.localStorage;}catch(_){}sync=createCloudSync({client,storage:storage||{getItem:()=>null,setItem(){}},onStatus:status});}
 function ui(){const live=!!client?.user();$('accountGuest').textContent=live?'Volver al juego':'Seguir sin cuenta';$('accountState').textContent=live?'Cuenta conectada · '+client.user().email:'Juegas sin cuenta. Tu progreso permanece en este dispositivo.';
  for(const id of ['accountRegister','accountRecover','accountVerify','accountVerifyRecovery'])$(id).disabled=!client||busy;
  $('accountForm').querySelector('[type="submit"]').disabled=!client||busy;
  for(const id of ['cloudPush','cloudPull'])$(id).disabled=!live||busy||recovery||!checked;
  for(const id of ['cloudPush','cloudPull'])$(id).hidden=!(live&&checked&&!sync.ready);if(sync?.ready)conflictShown=false;
  $('accountLogout').disabled=!live||busy;$('accountDelete').disabled=!live||busy||recovery;$('accountUpdatePassword').disabled=!live||!recovery||busy;
  if(!client)status('Cuenta online aún no configurada para estas pruebas. Puedes seguir jugando sin cuenta.');
 }
 async function run(action){if(busy)return;busy=true;ui();try{await action();}catch(e){status(e.message);}finally{busy=false;ui();}}
 async function inspect(){checked=false;scopeState=runtime.S;if(!client?.user())return;await sync.inspect(runtime.saveStore.key);checked=true;await sync.reconcile(capture,restore,{empty:emptyLocal,remoteEmpty:emptyLocal});if(sync.ready)await sync.push(snapshot,{force:true});}
 function emptyLocal(s=runtime.S){const q=s.sparkEconomy||{},p=s.playerProfile||{};
  const records=['ach','cat','species','places','events','retos','relicSites','glassSites','mirrorSites','patchSites'];
  return !s.sparks&&!q.earned&&!q.spent&&!s.totalLight&&!s.totalDays&&!p.distanceUnits&&s.mode==='camino'&&!(s.pathCrystals?.length||s.collected?.length||s.stars?.length||s.favorites?.items?.length)&&!records.some(k=>Object.keys(s[k]||{}).length)&&!Object.keys(q.claims||{}).length&&!Object.keys(s.activities?.done||{}).length&&!Object.keys(s.mischief?.done||{}).length;
 }
 function capture(){if(scopeState!==runtime.S||sync.scope!==runtime.saveStore.key)throw Error('La partida cambió. Abre Cuenta de nuevo.');return validateSave(runtime.S,runtime.fresh(),runtime.worldIdentity);}
 function restore(state){const valid=validateSave(state,runtime.fresh(),runtime.worldIdentity);snapshot();runtime.S=runtime.saveStore.restore(valid);scopeState=runtime.S;runtime.collected=new Set(runtime.S.collected);runtime.chunks.clear();runtime.wchunks.clear();runtime.bcache.clear();runtime.hud();return capture();}
 function snapshot(){if(scopeState!==runtime.S||sync.scope!==runtime.saveStore.key)throw Error('La partida cambió. Abre Cuenta de nuevo.');if(!runtime.save())throw Error('No pudimos guardar en este dispositivo. No reemplazamos tu avance online.');return validateSave(runtime.S,runtime.fresh(),runtime.worldIdentity);}
 $('bConnection').hidden=false;$('bConnection').textContent='Cuenta';$('connectionRooms').hidden=true;
 $('bConnection').onclick=()=>{$('mMenu').hidden=true;$('mConnection').hidden=false;if(client&&!recovery)run(inspect);else ui();};$('connectionClose').onclick=()=>{$('mConnection').hidden=true;};
 function credentials(){if(!$('accountForm').reportValidity())return null;return [$('accountName').value.trim(),$('accountPassword').value];}
 $('accountForm').onsubmit=e=>{e.preventDefault();const values=credentials();if(!values||!client)return;run(async()=>{sync.reset();checked=false;recovery=false;try{await client.login(...values);}finally{$('accountPassword').value='';}await inspect();});};
 $('accountRegister').onclick=()=>{const values=credentials();if(!values||!client)return;run(async()=>{sync.reset();checked=false;try{await client.signup(...values);}finally{$('accountPassword').value='';}if(client.user())await inspect();else status('Abre el enlace de confirmación de tu correo; después vuelve y entra.');});};
 $('accountRecover').onclick=()=>{const input=$('accountName');if(!input.reportValidity()||!client)return;run(async()=>{await client.recover(input.value.trim());status('Si la cuenta existe, recibirás un enlace para recuperar el acceso. Mantén el servidor local del puerto 3000 abierto.');});};
 const verify=type=>run(async()=>{sync.reset();checked=false;await client.verify($('accountName').value.trim(),$('accountCode').value.trim(),type);$('accountCode').value='';recovery=type==='recovery';if(recovery)status('Acceso verificado. Escribe y guarda tu nueva clave.');else await inspect();});
 $('accountVerify').onclick=()=>{if(client)verify('signup');};$('accountVerifyRecovery').onclick=()=>{if(client)verify('recovery');};
 $('accountUpdatePassword').onclick=()=>{const input=$('accountNewPassword');if(!input.value||!input.reportValidity())return;run(async()=>{await client.password(input.value);input.value='';recovery=false;await inspect();});};
 $('accountLogout').onclick=()=>run(async()=>{sync.reset();checked=false;recovery=false;await client.logout();$('accountPassword').value='';$('accountCode').value='';$('accountNewPassword').value='';status('Sesión cerrada. Tu partida local permanece.');});
 $('accountGuest').onclick=()=>{$('mConnection').hidden=true;};
 $('accountDelete').onclick=()=>{if(!confirm('¿Eliminar la cuenta y todas sus copias online? Tu partida local se conserva.'))return;const values=credentials();if(!values)return;if(values[0].toLowerCase()!==client.user().email.toLowerCase()){status('Escribe el correo de tu cuenta conectada y su clave para confirmar.');return;}run(async()=>{sync.reset();checked=false;try{await client.erase(values[1]);}finally{$('accountPassword').value='';}status('Cuenta y copias online eliminadas. Tu partida local permanece.');});};
 $('cloudPush').onclick=()=>{if(!confirm('¿Usar esta partida local como copia online? Se reemplazará la copia online de este mundo.'))return;run(async()=>{const prior=await sync.inspect(runtime.saveStore.key);scopeState=runtime.S;checked=true;if(prior?.state){try{localStorage.setItem('kubono:before-cloud-replace:'+client.user().id+':'+runtime.saveStore.key,JSON.stringify(prior));}catch(_){throw Error('No hay espacio para conservar ambos avances. No reemplazamos ninguno.');}}await sync.push(snapshot,{manual:true});});};
 $('cloudPull').onclick=()=>{if(!confirm('¿Recuperar la copia online? Conservaremos un respaldo de tu partida local antes de reemplazarla.'))return;run(()=>sync.pull(restore));};

 async function resume(){if(!client?.user()||recovery||busy)return;await run(async()=>{if(!checked||scopeState!==runtime.S)await inspect();else await sync.reconcile(capture,restore,{empty:emptyLocal,remoteEmpty:emptyLocal});if(sync.ready)await sync.push(snapshot,{force:true});});}
 const tick=()=>{if(performance.now()<nextTick)return;nextTick=performance.now()+1000;if(scopeState!==runtime.S||sync?.scope&&sync.scope!==runtime.saveStore.key){sync?.reset();checked=false;scopeState=runtime.S;resumePending=true;}if(document.hidden)return;if(resumePending){resumePending=false;resume();return;}if(client?.user()&&checked&&!recovery&&!busy&&performance.now()>=nextCheck){nextCheck=performance.now()+5000;run(async()=>{await sync.reconcile(capture,restore,{empty:emptyLocal,remoteEmpty:emptyLocal});if(sync.ready)await sync.push(snapshot);});}};
 // Final network delivery is best effort on iOS; local save remains authoritative offline.
 const leave=()=>{if(client?.user()&&checked&&!busy&&sync.ready){runtime.save();run(()=>sync.push(snapshot,{force:true}));}};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)leave();else resumePending=true;});
 globalThis.addEventListener('pagehide',leave);globalThis.addEventListener('focus',()=>{resumePending=true;});globalThis.addEventListener('online',()=>{resumePending=true;});
 Object.defineProperty(runtime,'connectionTick',{get:()=>tick});ui();if(client?.user())run(inspect);
}
