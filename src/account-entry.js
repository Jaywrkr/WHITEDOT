import {CLOUD_CONFIG} from './cloud-config.js';
import {createCloudClient} from './cloud-client.js';
// The world is not initialized until there is an account. A saved session starts the game at once and is
// checked in the background: if Auth rejects it, the session is forgotten and the game reloads to this sheet.
const LAST_EMAIL='kubono:last-email';
const remembered=()=>{try{return localStorage.getItem(LAST_EMAIL)||'';}catch(_){return '';}};
const remember=email=>{try{localStorage.setItem(LAST_EMAIL,email);}catch(_){}};
export async function requireAccount(){
 const client=createCloudClient(CLOUD_CONFIG),$=id=>document.getElementById(id);
 if(client?.user()){client.identity().catch(()=>{});return client;}
 document.body.dataset.accountLocked='true';$('mConnection').hidden=false;
 const title=$('mConnection').querySelector('h2'),submitButton=$('accountForm').querySelector('[type=submit]');title.textContent='Kubono';submitButton.classList.add('gold');
 $('accountState').textContent='Entra una vez. Después, Kubono te recuerda en este dispositivo.';
 for(const id of ['accountGuest','connectionClose','accountLogout','accountDelete','cloudPush','cloudPull'])$(id).hidden=true;
 if(!client){$('connectionStatus').textContent='El acceso no está configurado. No se ha iniciado ninguna partida.';$('accountForm').querySelector('[type=submit]').disabled=true;$('accountRegister').disabled=true;return new Promise(()=>{});}
 // Only the sign-up code belongs to this sheet; recovery keeps its own steps in Cuenta.
 const codeOnly=['accountVerifyRecovery','accountNewPassword','accountUpdatePassword'],labels=[...$('accountCodeBox').querySelectorAll('label[for="accountNewPassword"]')];
 const email=remembered();if(email){$('accountName').value=email;$('accountPassword').focus({preventScroll:true});}else $('accountName').focus({preventScroll:true});
 return new Promise(resolve=>{
  let busy=false;const submit=$('accountForm').querySelector('[type=submit]'),labelOf=b=>b.dataset.idle||(b.dataset.idle=b.textContent);
  const run=async(button,working,action)=>{if(busy)return;busy=true;const buttons=[submit,$('accountRegister'),$('accountVerify'),$('accountRecover')];for(const b of buttons){labelOf(b);b.disabled=true;}button.textContent=working;$('connectionStatus').textContent='';
   try{await action();}catch(e){$('connectionStatus').textContent=e.message;}finally{busy=false;for(const b of buttons){b.disabled=false;b.textContent=b.dataset.idle;}}
  };
  const credentials=()=>$('accountForm').reportValidity()?[$('accountName').value.trim(),$('accountPassword').value]:null;
  const finish=()=>{if(!client.user())return;title.textContent='Cuenta';submitButton.classList.remove('gold');remember($('accountName').value.trim());delete document.body.dataset.accountLocked;$('mConnection').hidden=true;$('accountCodeBox').hidden=true;for(const id of codeOnly)$(id).hidden=false;for(const l of labels)l.hidden=false;
   $('accountForm').onsubmit=null;$('accountRegister').onclick=null;$('accountRecover').onclick=null;$('accountVerify').onclick=null;resolve(client);};
  const askCode=()=>{$('accountCodeBox').hidden=false;for(const id of codeOnly)$(id).hidden=true;for(const l of labels)l.hidden=true;$('connectionStatus').textContent='Te enviamos un correo de confirmación. Escribe aquí su código o abre su enlace y vuelve a entrar.';$('accountCode').focus({preventScroll:true});};
  $('accountForm').onsubmit=e=>{e.preventDefault();const values=credentials();if(values)run(submit,'Entrando…',async()=>{try{await client.login(...values);}finally{$('accountPassword').value='';}finish();});};
  $('accountRegister').onclick=()=>{const values=credentials();if(values)run($('accountRegister'),'Creando…',async()=>{try{await client.signup(...values);}finally{$('accountPassword').value='';}if(client.user())finish();else{remember(values[0]);askCode();}});};
  $('accountVerify').onclick=()=>{const code=$('accountCode').value.trim();if(!code){$('accountCode').focus();return;}run($('accountVerify'),'Confirmando…',async()=>{await client.verify($('accountName').value.trim(),code,'signup');$('accountCode').value='';finish();});};
  $('accountRecover').onclick=()=>{if($('accountName').reportValidity())run($('accountRecover'),'Enviando…',async()=>{await client.recover($('accountName').value.trim());$('connectionStatus').textContent='Si la cuenta existe, recibirás el enlace para cambiar tu clave.';});};
 });
}
