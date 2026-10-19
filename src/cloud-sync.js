// Local progress is authoritative until the player explicitly chooses an initial copy.
export function createCloudSync({client,storage,now=()=>Date.now(),onStatus=()=>{}}){
 let scope=null,owner=null,revision=0,ready=false,busy=false,generation=0,last='',lastAttempt=0;
 const metadata=()=>`kubono:cloud:${client.user()?.id}:${scope}`;
 function valid(g){return generation===g&&owner===client.user()?.id;}
 function reset(){generation++;scope=null;owner=null;revision=0;ready=false;last='';lastAttempt=0;}
 function remember(){try{storage.setItem(metadata(),String(revision));}catch(_){}}
 async function inspect(nextScope){
  reset();scope=nextScope;owner=client.user()?.id;const g=generation;if(!owner)return null;
  const copy=await client.read(scope);if(!valid(g))throw Error('La cuenta o partida cambió; no aplicamos la respuesta.');
  revision=copy?.revision||0;let known=null;try{known=storage.getItem(metadata());}catch(_){}
  ready=known!==null&&Number(known)===revision;
  onStatus(copy?(ready?'Copia conectada. Respaldo automático cada minuto.':'Hay una copia online. Elige recuperar o conservar esta partida.'):'Elige «Usar esta partida» para activar el respaldo online.');return copy;
 }
 async function push(snapshot,{manual=false}={}){
  if(busy||!owner||owner!==client.user()?.id||!manual&&!ready)return false;
  if(!manual&&now()-lastAttempt<60000)return false;
  busy=true;lastAttempt=now();const g=generation,currentScope=scope;
  try{const state=snapshot(),raw=JSON.stringify(state);if(!manual&&raw===last)return true;
   const result=await client.write(currentScope,revision,state);if(!valid(g))return false;
   if(!result?.ok){ready=false;onStatus('La copia online cambió. Descarga o recupera antes de seguir; no la sobrescribimos.');return false;}
   revision=result.revision;ready=true;last=raw;remember();onStatus('Respaldo online guardado.');return true;
  }catch(e){if(valid(g)){if(e.status===401)ready=false;onStatus(e.message);}return false;}finally{busy=false;}
 }
 async function pull(restore){
  if(busy)throw Error('Espera a que termine el respaldo.');busy=true;const g=generation,currentScope=scope;
  try{const copy=await client.read(currentScope);if(!valid(g))throw Error('La cuenta o partida cambió.');if(!copy?.state)throw Error('Todavía no hay copia online.');await restore(copy.state);if(!valid(g))throw Error('La cuenta o partida cambió.');revision=copy.revision;ready=true;last='';lastAttempt=now();remember();onStatus('Copia recuperada; conservamos el respaldo local anterior.');return copy;}finally{busy=false;}
 }
 return {inspect,push,pull,reset,get ready(){return ready;},get busy(){return busy;},get scope(){return scope;}};
}
