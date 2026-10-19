import {CLOUD_CONFIG} from './cloud-config.js';
import {createCloudClient} from './cloud-client.js';
// The world is not initialized until Auth accepts an account (or a prior session resumes offline).
export async function requireAccount(){
 const client=createCloudClient(CLOUD_CONFIG),$=id=>document.getElementById(id);
 document.body.dataset.accountLocked='true';$('mConnection').hidden=false;
 $('accountState').textContent='Entra o crea tu cuenta para jugar.';
 for(const id of ['accountGuest','connectionClose','accountLogout','accountDelete','cloudPush','cloudPull'])$(id).hidden=true;
 if(!client){$('connectionStatus').textContent='El acceso no está configurado. No se ha iniciado ninguna partida.';$('accountForm').querySelector('[type=submit]').disabled=true;$('accountRegister').disabled=true;return new Promise(()=>{});}
 if(client.user())try{await client.identity();delete document.body.dataset.accountLocked;$('mConnection').hidden=true;return client;}catch(e){if(!e.status&&client.user()){delete document.body.dataset.accountLocked;$('mConnection').hidden=true;return client;}}
 return new Promise(resolve=>{
  let busy=false;
  const run=async action=>{if(busy)return;busy=true;const submit=$('accountForm').querySelector('[type=submit]');submit.disabled=true;$('accountRegister').disabled=true;
   try{await action();}catch(e){$('connectionStatus').textContent=e.message;}finally{busy=false;submit.disabled=false;$('accountRegister').disabled=false;}
  };
  const credentials=()=>$('accountForm').reportValidity()?[$('accountName').value.trim(),$('accountPassword').value]:null;
  const finish=()=>{if(!client.user())return;delete document.body.dataset.accountLocked;$('mConnection').hidden=true;$('accountForm').onsubmit=null;$('accountRegister').onclick=null;$('accountRecover').onclick=null;resolve(client);};
  $('accountForm').onsubmit=e=>{e.preventDefault();const values=credentials();if(values)run(async()=>{try{await client.login(...values);}finally{$('accountPassword').value='';}finish();});};
  $('accountRegister').onclick=()=>{const values=credentials();if(values)run(async()=>{try{await client.signup(...values);}finally{$('accountPassword').value='';}if(client.user())finish();else $('connectionStatus').textContent='Abre el enlace de confirmación de tu correo; después vuelve y entra.';});};
  $('accountRecover').onclick=()=>{if($('accountName').reportValidity())run(async()=>{await client.recover($('accountName').value.trim());$('connectionStatus').textContent='Si la cuenta existe, recibirás el enlace para cambiar tu clave.';});};
 });
}
