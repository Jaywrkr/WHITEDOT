// Exact canonical baseline: never infer progress from balance or timestamps.
// Session summaries and elapsed ambience do not change the shared world.
export function cloudStateKey(state){
 const clean=(value,root=false,path='')=>Array.isArray(value)?value.map(v=>clean(v,false,path)):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().filter(k=>(!root||!['session','lastSession','livingSeconds'].includes(k))&&(path!=='playerProfile'||!['activeSeconds','worldSeconds','caminoSeconds','houseSeconds','sessions'].includes(k))).map(k=>[k,clean(value[k],false,root?k:path+'.'+k)])):value;
 return JSON.stringify(clean(state,true));
}
export function createCloudSync({client,storage,now=()=>Date.now(),onStatus=()=>{}}){
 let scope=null,owner=null,revision=0,ready=false,busy=false,generation=0,last='',lastAttempt=0,baseline=null,baseRevision=0;
 const metadata=()=>`kubono:cloud:${owner}:${scope}`;
 function valid(g){return generation===g&&owner===client.user()?.id;}
 function reset(){generation++;scope=null;owner=null;revision=0;ready=false;last='';lastAttempt=0;baseline=null;baseRevision=0;}
 function remember(state){baseRevision=revision;baseline=cloudStateKey(state);try{storage.setItem(metadata(),JSON.stringify({revision,baseline}));}catch(_){onStatus('Copia online guardada; no pudimos conservar la referencia local. Al volver tendrás que elegir copia.');}}
 function conflict(){ready=false;onStatus('Hay avances distintos en ambos dispositivos. Elige recuperar o conservar esta partida; no sobrescribimos ninguna copia.');return false;}
 async function inspect(nextScope){
  reset();scope=nextScope;owner=client.user()?.id;const g=generation;if(!owner)return null;
  const copy=await client.read(scope);if(!valid(g))throw Error('La cuenta o partida cambió; no aplicamos la respuesta.');
  revision=copy?.revision||0;let known=null;try{known=storage.getItem(metadata());}catch(_){}
  const record=(()=>{try{return JSON.parse(known);}catch(_){return null;}})();baseline=record?.baseline||null;baseRevision=record?.revision||0;ready=known!==null&&(Number(known)===revision||record?.revision===revision);
  onStatus(copy?(ready?'Cuenta conectada. Guardado automático.':'Comprobando tu avance…'):'Sincronizando tu avance…');return copy;
 }
 async function push(snapshot,{manual=false,force=false}={}){
  if(busy||!owner||owner!==client.user()?.id||!manual&&!ready)return false;
  if(!manual&&!force&&now()-lastAttempt<5000)return false;
  busy=true;lastAttempt=now();const g=generation,currentScope=scope;
  try{const state=snapshot(),raw=JSON.stringify(state);if(!manual&&cloudStateKey(state)===baseline)return true;
   const result=await client.write(currentScope,revision,state);if(!valid(g))return false;
   if(!result?.ok){ready=false;onStatus('La copia online cambió. Hay avances distintos; elige cuál continuar.');return false;}
   revision=result.revision;ready=true;last=raw;remember(state);onStatus('Guardado automáticamente.');return true;
  }catch(e){if(valid(g)){if(e.status===401)ready=false;onStatus(e.message);}return false;}finally{busy=false;}
 }
 async function pull(restore){
  if(busy)throw Error('Espera a que termine el respaldo.');busy=true;const g=generation,currentScope=scope;
  try{const copy=await client.read(currentScope);if(!valid(g))throw Error('La cuenta o partida cambió.');if(!copy?.state)throw Error('Todavía no hay copia online.');const applied=await restore(copy.state);if(!valid(g))throw Error('La cuenta o partida cambió.');revision=copy.revision;ready=true;last='';lastAttempt=now();remember(applied||copy.state);onStatus('Partida sincronizada.');return copy;}finally{busy=false;}
 }
 // Read before writing on resume. A local change during the request cancels restore.
 async function reconcile(snapshot,restore,{empty=()=>false,remoteEmpty=()=>false}={}){
  if(busy||!owner||owner!==client.user()?.id)return false;
  busy=true;const g=generation,currentScope=scope;
  try{
   snapshot();
   const copy=await client.read(currentScope);if(!valid(g))return false;
   const after=cloudStateKey(snapshot());
   const remoteKey=copy?.state?cloudStateKey(copy.state):null;
   if(!copy){revision=0;ready=true;return true;}
   if(remoteKey===after){revision=copy.revision;ready=true;remember(copy.state);return true;}
   if(!baseline&&remoteEmpty(copy.state)){revision=copy.revision;ready=true;return true;}
   if(baseline&&copy.revision===baseRevision){ready=true;return true;}
   if(baseline&&after===baseline||!baseline&&empty()){
    // Restore validates the world and preserves the actual local copy first.
    const applied=await restore(copy.state);if(!valid(g))return false;
    revision=copy.revision;ready=true;lastAttempt=now();remember(applied||copy.state);
    onStatus('Partida actualizada desde tu otro dispositivo.');return true;
   }
   if(baseline&&remoteKey===baseline){revision=copy.revision;ready=true;return true;}
   return conflict();
  }catch(e){if(valid(g))onStatus(e.message);return false;}finally{busy=false;}
 }
 return {inspect,push,pull,reconcile,reset,get ready(){return ready;},get busy(){return busy;},get scope(){return scope;}};
}
