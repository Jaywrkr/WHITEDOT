// Small REST adapter: no SDK/runtime dependencies and no cookies across app origins.
export function cloudConfig(config){
 if(!config?.url||!config?.publishableKey)return null;
 const url=new URL(config.url);
 if(url.protocol!=='https:'||!/^[-a-z0-9]+\.supabase\.co$/.test(url.hostname)||url.username||url.password||url.search||url.hash||!['','/'].includes(url.pathname))throw Error('Proyecto Supabase no válido.');
 if(!/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey))throw Error('Usa solo una clave publicable de Supabase.');
 return {url:url.origin,key:config.publishableKey};
}
export function createCloudClient(config,{fetcher=globalThis.fetch,storage,now=()=>Date.now()}={}){
 const c=cloudConfig(config);if(!c)return null;
 if(!storage)try{storage=globalThis.sessionStorage;}catch(_){}
 storage||={getItem:()=>null,setItem(){},removeItem(){}};
 const key='kubono:auth:'+c.url;let session=null,refreshing=null,epoch=0;
 try{const s=JSON.parse(storage.getItem(key)||'null');if(s?.access_token&&s?.refresh_token&&s?.user?.id)session=s;}catch(_){}
 const user=()=>session?.user||null;
 function accept(data){if(!data?.access_token||!data.refresh_token||!data.user?.id)throw Error('Respuesta de acceso no válida.');session={access_token:data.access_token,refresh_token:data.refresh_token,user:{id:data.user.id,email:data.user.email},expires_at:now()+data.expires_in*1000};try{storage.setItem(key,JSON.stringify(session));}catch(_){/* Memory-only access remains available. */}return user();}
 function forget(){epoch++;session=null;try{storage.removeItem(key);}catch(_){} }
 async function request(path,{method='GET',body,token,signal}={}){
  let response;try{response=await fetcher(c.url+path,{method,...(body!==undefined&&JSON.stringify(body).length<15000?{keepalive:true}:{}),mode:'cors',credentials:'omit',cache:'no-store',signal:signal||AbortSignal.timeout(15000),headers:{apikey:c.key,...(token?{Authorization:'Bearer '+token}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});}catch(_){throw Error('Sin conexión. El progreso sigue guardándose en este dispositivo.');}
  const data=await response.json().catch(()=>null);
  if(!response.ok){const error=Error(response.status===429?'Demasiados intentos. Espera antes de repetir.':response.status===401||response.status===400&&path.startsWith('/auth/')?'No se pudo verificar el acceso. Revisa tus datos o el código.':'No se pudo guardar o conectar. Conservamos la partida local.');error.status=response.status;error.code=data?.code;throw error;}return data;
 }
 async function token(){
  if(!session)throw Error('Entra en tu cuenta primero.');
  if(session.expires_at>now()+60000)return session.access_token;
  if(!refreshing){const version=epoch;refreshing=request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token}}).then(data=>{if(version!==epoch)throw Error('El acceso cambió. Vuelve a entrar.');accept(data);return session.access_token;}).catch(e=>{if(version===epoch&&[400,401].includes(e.status))forget();throw e;}).finally(()=>{refreshing=null;});}return refreshing;
 }
 async function auth(path,body){forget();const version=epoch;const data=await request('/auth/v1/'+path,{method:'POST',body});if(version!==epoch)throw Error('El acceso cambió.');if(data?.access_token)return accept(data);return null;}
 return {user,login:(email,password)=>auth('token?grant_type=password',{email,password}),signup:(email,password)=>auth('signup',{email,password}),verify:(email,code,type='signup')=>auth('verify',{email,token:code,type}),recover:email=>request('/auth/v1/recover?redirect_to='+encodeURIComponent('http://localhost:3000/'),{method:'POST',body:{email}}),
  async password(password){const t=await token();await request('/auth/v1/user',{method:'PUT',token:t,body:{password}});},
  async logout(){const old=session?.access_token;forget();if(old)try{await request('/auth/v1/logout?scope=local',{method:'POST',token:old,body:{}});}catch(_){/* Local sign-out must also work offline. */}},
  async read(scope){const t=await token();const rows=await request('/rest/v1/kubono_saves?scope=eq.'+encodeURIComponent(scope)+'&select=revision,state,updated_at',{token:t});if(!Array.isArray(rows)||rows.length>1)throw Error('Copia remota no válida.');return rows[0]||null;},
  async write(scope,revision,state){const t=await token();return request('/rest/v1/rpc/kubono_save',{method:'POST',token:t,body:{p_scope:scope,p_revision:revision,p_state:state}});},
  async erase(password){const email=user()?.email;if(!email)throw Error('Entra en tu cuenta.');await auth('token?grant_type=password',{email,password});const t=await token();await request('/rest/v1/rpc/kubono_delete_account',{method:'POST',token:t,body:{}});forget();}
 };
}
