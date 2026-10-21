import {CLOUD_CONFIG} from './cloud-config.js';
import {createCloudClient} from './cloud-client.js';
import {createCloudSync,purgeUserStorage} from './cloud-sync.js';
import {validateSave} from './save-store.js';
export function initialize(runtime){
 let conflictShown=false;const $=runtime.$,status=text=>{$('connectionStatus').textContent=text;if((text.startsWith('Hay avances distintos')||text.startsWith('La copia online cambió'))&&!document.hidden&&!conflictShown){conflictShown=true;$('mMenu').hidden=true;$('mConnection').hidden=false;}};let client=null,sync=null,busy=false,recovery=false,checked=false,nextTick=0,nextCheck=0,resumePending=false,scopeState=runtime.S;
 try{client=runtime.accountClient||createCloudClient(CLOUD_CONFIG);}catch(e){status(e.message);}
 if(client){let storage;try{storage=globalThis.localStorage;}catch(_){}sync=createCloudSync({client,storage:storage||{getItem:()=>null,setItem(){}},onStatus:status});}
 function ui(){const live=!!client?.user();$('accountGuest').hidden=true;$('accountLogout').hidden=false;$('accountDelete').hidden=false;$('connectionClose').hidden=!live;$('accountState').textContent=live?'Cuenta conectada · '+client.user().email:'Entra en tu cuenta para jugar.';
  for(const id of ['accountRegister','accountRecover','accountVerify','accountVerifyRecovery'])$(id).disabled=!client||busy;
  $('accountForm').querySelector('[type="submit"]').disabled=!client||busy;
  for(const id of ['cloudPush','cloudPull'])$(id).disabled=!live||busy||recovery||!checked;
  for(const id of ['cloudPush','cloudPull'])$(id).hidden=!(live&&checked&&!sync.ready);if(sync?.ready)conflictShown=false;
  $('accountLogout').disabled=!live||busy;$('accountDelete').disabled=!live||busy||recovery;$('accountUpdatePassword').disabled=!live||!recovery||busy;
  if(!client)status('El acceso no está configurado. No se puede iniciar el juego.');
 }
 async function run(action){if(busy)return;busy=true;ui();try{await action();}catch(e){status(e.message);}finally{busy=false;ui();}}
 async function inspect(){checked=false;scopeState=runtime.S;if(!client?.user())return;await sync.inspect((runtime.cloudScope||runtime.saveStore.key));checked=true;await sync.reconcile(capture,restore,{empty:emptyLocal,remoteEmpty:emptyLocal});if(sync.ready)await sync.push(snapshot,{force:true});}
 function emptyLocal(s=runtime.S){const q=s.sparkEconomy||{},p=s.playerProfile||{};
  const records=['ach','cat','species','places','events','retos','relicSites','glassSites','mirrorSites','patchSites'];
  return !s.sparks&&!q.earned&&!q.spent&&!s.totalLight&&!s.totalDays&&!p.distanceUnits&&s.mode==='camino'&&!(s.pathCrystals?.length||s.collected?.length||s.stars?.length||s.favorites?.items?.length)&&!records.some(k=>Object.keys(s[k]||{}).length)&&!Object.keys(q.claims||{}).length&&!Object.keys(s.activities?.done||{}).length&&!Object.keys(s.mischief?.done||{}).length;
 }
 function capture(){if(scopeState!==runtime.S||sync.scope!==(runtime.cloudScope||runtime.saveStore.key))throw Error('La partida cambió. Abre Cuenta de nuevo.');return validateSave(runtime.S,runtime.fresh(),runtime.worldIdentity);}
 function restore(state){const valid=validateSave(state,runtime.fresh(),runtime.worldIdentity);snapshot();const was=runtime.S.mode;runtime.S=runtime.saveStore.restore(valid);scopeState=runtime.S;runtime.collected=new Set(runtime.S.collected);runtime.chunks.clear();runtime.wchunks.clear();runtime.bcache.clear();settleMode(was);runtime.hud();return capture();}
 // A restored copy may be in the other mode: run the normal transition so region, session and music follow, keeping the restored place.
 function settleMode(was){const s=runtime.S,now=s.mode,modes=['world','camino'];if(now===was||!modes.includes(now)||!modes.includes(was))return;
  if(now==='camino'){s.mode='world';runtime.exitWorld?.(false);return;}
  const day=s.lastWorldDay;s.mode='camino';s.lastWorldDay=s.todayKey;runtime.enterWorld?.({automatic:true});if(!runtime.inWorld())s.lastWorldDay=day;}
 function snapshot(){if(scopeState!==runtime.S||sync.scope!==(runtime.cloudScope||runtime.saveStore.key))throw Error('La partida cambió. Abre Cuenta de nuevo.');if(!runtime.save())throw Error('No pudimos guardar en este dispositivo. No reemplazamos tu avance online.');return validateSave(runtime.S,runtime.fresh(),runtime.worldIdentity);}
 $('bConnection').hidden=false;($('bConnection').querySelector('span')||$('bConnection')).textContent='Cuenta';$('connectionRooms').hidden=true;
 $('bConnection').onclick=()=>{$('mMenu').hidden=true;$('mConnection').hidden=false;if(client&&!recovery)run(inspect);else ui();};$('connectionClose').onclick=()=>{$('mConnection').hidden=true;};
 function credentials(){if(!$('accountForm').reportValidity())return null;return [$('accountName').value.trim(),$('accountPassword').value];}
 $('accountForm').onsubmit=e=>{e.preventDefault();const values=credentials();if(!values||!client)return;run(async()=>{sync.reset();checked=false;recovery=false;try{await client.login(...values);if(runtime.accountClient&&client.user()?.id!==runtime.accountUserId){location.reload();return;}}finally{$('accountPassword').value='';}if(runtime.accountClient&&client.user()?.id!==runtime.accountUserId)return;await inspect();});};
 $('accountRegister').onclick=()=>{const values=credentials();if(!values||!client)return;run(async()=>{sync.reset();checked=false;try{await client.signup(...values);}finally{$('accountPassword').value='';}if(client.user()&&runtime.accountClient&&client.user().id!==runtime.accountUserId){location.reload();return;}if(client.user())await inspect();else status('Abre el enlace de confirmación de tu correo; después vuelve y entra.');});};
 $('accountRecover').onclick=()=>{const input=$('accountName');if(!input.reportValidity()||!client)return;run(async()=>{await client.recover(input.value.trim());status('Si la cuenta existe, recibirás un enlace para recuperar el acceso.'+(client.recoveryLocal?' Mantén el servidor local del puerto 3000 abierto.':' Ábrelo en un navegador.'));});};
 const verify=type=>run(async()=>{sync.reset();checked=false;await client.verify($('accountName').value.trim(),$('accountCode').value.trim(),type);$('accountCode').value='';recovery=type==='recovery';if(recovery)status('Acceso verificado. Escribe y guarda tu nueva clave.');else await inspect();});
 $('accountVerify').onclick=()=>{if(client)verify('signup');};$('accountVerifyRecovery').onclick=()=>{if(client)verify('recovery');};
 $('accountUpdatePassword').onclick=()=>{const input=$('accountNewPassword');if(!input.value||!input.reportValidity())return;run(async()=>{await client.password(input.value);input.value='';recovery=false;await inspect();});};
 $('accountLogout').onclick=()=>run(async()=>{sync.reset();checked=false;recovery=false;await client.logout();$('accountPassword').value='';$('accountCode').value='';$('accountNewPassword').value='';location.reload();});
 $('accountGuest').onclick=()=>{$('mConnection').hidden=true;};
 $('accountDelete').onclick=()=>{const values=credentials();if(!values)return;if(values[0].toLowerCase()!==client.user().email.toLowerCase()){status('Escribe el correo de tu cuenta conectada y su clave para confirmar.');return;}if(!confirm('¿Eliminar la cuenta, sus copias online y su partida guardada en este dispositivo? Otros dispositivos conservan su copia hasta borrar sus datos.'))return;run(async()=>{sync.reset();checked=false;const userId=client.user().id;try{await client.erase(values[1]);}finally{$('accountPassword').value='';}try{purgeUserStorage(localStorage,userId);}catch(_){/* The online deletion already succeeded; a local cleanup failure must not block the exit. */}location.reload();});};
 $('cloudPush').onclick=()=>{if(!confirm('¿Usar esta partida local como copia online? Se reemplazará la copia online de este mundo.'))return;run(async()=>{const prior=await sync.inspect((runtime.cloudScope||runtime.saveStore.key));scopeState=runtime.S;checked=true;if(prior?.state){try{localStorage.setItem('kubono:before-cloud-replace:'+client.user().id+':'+(runtime.cloudScope||runtime.saveStore.key),JSON.stringify(prior));}catch(_){throw Error('No hay espacio para conservar ambos avances. No reemplazamos ninguno.');}}await sync.push(snapshot,{manual:true});});};
 $('cloudPull').onclick=()=>{if(!confirm('¿Recuperar la copia online? Conservaremos un respaldo de tu partida local antes de reemplazarla.'))return;run(()=>sync.pull(restore));};

 async function resume(){if(!client?.user()||recovery||busy)return;await run(async()=>{if(!checked||scopeState!==runtime.S)await inspect();else await sync.reconcile(capture,restore,{empty:emptyLocal,remoteEmpty:emptyLocal});if(sync.ready)await sync.push(snapshot,{force:true});});}
 const tick=()=>{if(runtime.accountClient&&client.user()?.id!==runtime.accountUserId){location.reload();return;}if(performance.now()<nextTick)return;nextTick=performance.now()+1000;if(scopeState!==runtime.S||sync?.scope&&sync.scope!==(runtime.cloudScope||runtime.saveStore.key)){sync?.reset();checked=false;scopeState=runtime.S;resumePending=true;}if(document.hidden)return;if(resumePending){resumePending=false;resume();return;}if(client?.user()&&checked&&!recovery&&!busy&&performance.now()>=nextCheck){nextCheck=performance.now()+5000;run(async()=>{await sync.reconcile(capture,restore,{empty:emptyLocal,remoteEmpty:emptyLocal});if(sync.ready)await sync.push(snapshot);});}};
 // Final network delivery is best effort on iOS; local save remains authoritative offline.
 const leave=()=>{if(client?.user()&&checked&&!busy&&sync.ready){runtime.save();run(()=>sync.push(snapshot,{force:true}));}};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)leave();else resumePending=true;});
 globalThis.addEventListener('pagehide',leave);globalThis.addEventListener('focus',()=>{resumePending=true;});globalThis.addEventListener('online',()=>{resumePending=true;});
 Object.defineProperty(runtime,'connectionTick',{get:()=>tick});ui();if(client?.user())run(inspect);
}
