import {cloudConfig} from './cloud-client.js';
// Recovery credentials never enter game storage or cloud-save synchronization.
export async function recoverySession(config,hash,{fetcher=globalThis.fetch}={}){
 const c=cloudConfig(config),params=new URLSearchParams(hash.replace(/^#/,''));
 if(!c||params.get('type')!=='recovery'||params.has('error')||!params.get('access_token'))throw Error('Enlace ausente o vencido. Solicita uno nuevo desde el juego.');
 let token=params.get('access_token');
 async function request(method,body){
  const response=await fetcher(c.url+'/auth/v1/user',{method,credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(15000),headers:{apikey:c.key,Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
  if(!response.ok)throw Error('No se pudo verificar o cambiar la clave. El enlace puede haber vencido.');
  return response.json();
 }
 const user=await request('GET');if(!user?.id)throw Error('Acceso no válido.');
 return {async change(password,confirmation){
  if(!token)throw Error('Solicita otro enlace.');
  if(password.length<12||password.length>128||password!==confirmation)throw Error('Usa entre 12 y 128 caracteres y repite la misma clave.');
  await request('PUT',{password});
  const old=token;token=null;
  try{await fetcher(c.url+'/auth/v1/logout?scope=local',{method:'POST',credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(15000),headers:{apikey:c.key,Authorization:'Bearer '+old}});}catch(_){/* Password already changed; no credentials persist locally. */}
 }};
}
