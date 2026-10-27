import {CLOUD_CONFIG} from './cloud-config.js';
import {createCloudClient} from './cloud-client.js';
import {cloudPaused} from './cloud-account.js';
// The account is optional (docs/VIAJE.md): without a session the game starts at once with a local save, and the
// account is offered later as «Guardar en la nube». A saved session starts the game at once and is checked in the
// background. The sheet only comes back to someone who already had an account here and has not chosen local play.
const LAST_EMAIL='kubono:last-email',LOCAL_PLAY='kubono:local-play';
const remembered=()=>{try{return localStorage.getItem(LAST_EMAIL)||'';}catch(_){return '';}};
const remember=email=>{try{localStorage.setItem(LAST_EMAIL,email);}catch(_){}};
const localChosen=()=>{try{return localStorage.getItem(LOCAL_PLAY)==='1';}catch(_){return false;}};
const chooseLocal=on=>{try{if(on)localStorage.setItem(LOCAL_PLAY,'1');else localStorage.removeItem(LOCAL_PLAY);}catch(_){}};
// Sale edition (src/edition.js): no account and no network. A session saved earlier by the web edition still names
// whose local save this is (kubono:user:ID:…), so that progress loads as before. Read only; never sent or checked online.
export function savedAccountOwner(storage){
 try{storage??=globalThis.localStorage;const id=raw=>{try{const s=JSON.parse(raw||'null');return typeof s?.user?.id==='string'&&s.user.id&&typeof s.access_token==='string'?s.user.id:null;}catch(_){return null;}};
  let owner=null;try{owner=id(storage.getItem('kubono:auth:'+new URL(CLOUD_CONFIG.url).origin));}catch(_){}
  if(owner)return owner;
  const keys=Array.from({length:storage.length||0},(_,i)=>storage.key(i)).filter(k=>typeof k==='string'&&k.startsWith('kubono:auth:'));
  const owners=[...new Set(keys.map(k=>id(storage.getItem(k))).filter(Boolean))];return owners.length===1?owners[0]:null;
 }catch(_){return null;}
}
export async function requireAccount(){
 const client=createCloudClient(CLOUD_CONFIG),$=id=>document.getElementById(id);
 if(client?.user()){if(client.user().email)remember(client.user().email);client.identity().catch(()=>{});return client;}
 if(!client||!remembered()||localChosen())return client||null;
 document.body.dataset.accountLocked='true';$('mConnection').hidden=false;
 const title=$('mConnection').querySelector('h2'),submitButton=$('accountForm').querySelector('[type=submit]');title.textContent='Kubono';submitButton.classList.add('gold');
 $('accountState').textContent='Entra una vez. Después, Kubono te recuerda en este dispositivo.';
 for(const id of ['connectionClose','accountLogout','accountDelete','cloudPush','cloudPull'])$(id).hidden=true;$('accountRegister').hidden=cloudPaused();
 const guest=$('accountGuest'),guestLabel=guest.textContent;guest.hidden=false;guest.textContent='Jugar sin cuenta';
 // Only the sign-up code belongs to this sheet; recovery keeps its own steps in Cuenta.
 const codeOnly=['accountVerifyRecovery','accountNewPassword','accountUpdatePassword'],labels=[...$('accountCodeBox').querySelectorAll('label[for="accountNewPassword"]')];
 const email=remembered();if(email){$('accountName').value=email;$('accountPassword').focus({preventScroll:true});}else $('accountName').focus({preventScroll:true});
 return new Promise(resolve=>{
  let busy=false;const submit=$('accountForm').querySelector('[type=submit]'),labelOf=b=>b.dataset.idle||(b.dataset.idle=b.textContent);
  const run=async(button,working,action)=>{if(busy)return;busy=true;const buttons=[submit,$('accountRegister'),$('accountVerify'),$('accountRecover')];for(const b of buttons){labelOf(b);b.disabled=true;}button.textContent=working;$('connectionStatus').textContent='';
   try{await action();}catch(e){$('connectionStatus').textContent=e.message;}finally{busy=false;for(const b of buttons){b.disabled=false;b.textContent=b.dataset.idle;}}
  };
  const credentials=()=>$('accountForm').reportValidity()?[$('accountName').value.trim(),$('accountPassword').value]:null;
  const leave=()=>{title.textContent='Cuenta';submitButton.classList.remove('gold');delete document.body.dataset.accountLocked;$('mConnection').hidden=true;guest.textContent=guestLabel;guest.hidden=true;guest.onclick=null;$('accountForm').onsubmit=null;$('accountRegister').onclick=null;$('accountRecover').onclick=null;$('accountVerify').onclick=null;};
  guest.onclick=()=>{chooseLocal(true);leave();resolve(client);};
  const finish=()=>{if(!client.user())return;chooseLocal(false);guest.textContent=guestLabel;guest.hidden=true;guest.onclick=null;title.textContent='Cuenta';submitButton.classList.remove('gold');remember($('accountName').value.trim());delete document.body.dataset.accountLocked;$('mConnection').hidden=true;$('accountCodeBox').hidden=true;for(const id of codeOnly)$(id).hidden=false;for(const l of labels)l.hidden=false;
   $('accountForm').onsubmit=null;$('accountRegister').onclick=null;$('accountRecover').onclick=null;$('accountVerify').onclick=null;resolve(client);};
  const askCode=()=>{$('accountCodeBox').hidden=false;for(const id of codeOnly)$(id).hidden=true;for(const l of labels)l.hidden=true;$('connectionStatus').textContent='Te enviamos un correo de confirmación. Escribe aquí su código o abre su enlace y vuelve a entrar.';$('accountCode').focus({preventScroll:true});};
  $('accountForm').onsubmit=e=>{e.preventDefault();const values=credentials();if(values)run(submit,'Entrando…',async()=>{try{await client.login(...values);}finally{$('accountPassword').value='';}finish();});};
  $('accountRegister').onclick=()=>{const values=credentials();if(values)run($('accountRegister'),'Creando…',async()=>{try{await client.signup(...values);}finally{$('accountPassword').value='';}if(client.user())finish();else{remember(values[0]);askCode();}});};
  $('accountVerify').onclick=()=>{const code=$('accountCode').value.trim();if(!code){$('accountCode').focus();return;}run($('accountVerify'),'Confirmando…',async()=>{await client.verify($('accountName').value.trim(),code,'signup');$('accountCode').value='';finish();});};
  $('accountRecover').onclick=()=>{if($('accountName').reportValidity())run($('accountRecover'),'Enviando…',async()=>{await client.recover($('accountName').value.trim());$('connectionStatus').textContent='Si la cuenta existe, recibirás el enlace para cambiar tu clave.';});};
 });
}
