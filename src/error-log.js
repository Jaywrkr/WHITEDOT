// Errors that happen while playing stay on this device, so a problem can be described later with
// "Copiar diagnóstico" in Ajustes. Only the message and the file/line: no saves, names or addresses.
export const ERROR_KEY='kubono:errores',ERROR_LIMIT=20;
const clean=(text,max)=>String(text??'').replace(/[\u0000-\u001f]+/g,' ').slice(0,max);
const place=(file,line)=>file?clean(String(file).split(/[?#]/)[0].split('/').pop(),60)+(Number.isFinite(line)?':'+line:''):'';
export function readErrors(storage){try{const list=JSON.parse(storage?.getItem(ERROR_KEY)||'[]');return Array.isArray(list)?list.filter(e=>e&&typeof e.message==='string').slice(-ERROR_LIMIT):[];}catch(_){return [];}}
// Repeats within five seconds count up instead of filling the list.
export function recordError(storage,entry,now=Date.now()){
 const list=readErrors(storage),last=list.at(-1),item={at:new Date(now).toISOString(),kind:entry.kind==='promesa'?'promesa':'error',message:clean(entry.message,200)||'Error sin mensaje',where:place(entry.file,entry.line),version:clean(entry.version,40),count:1};
 if(last&&last.message===item.message&&last.where===item.where&&now-Date.parse(last.at)<5000)last.count=(last.count||1)+1;else list.push(item);
 try{storage?.setItem(ERROR_KEY,JSON.stringify(list.slice(-ERROR_LIMIT)));}catch(_){/* A full or blocked storage only loses the diagnosis. */}
 return list.slice(-ERROR_LIMIT);
}
export function errorReport(list,{version='',agent=''}={}){
 const lines=['Kubono '+version,agent?'Navegador: '+clean(agent,160):'',list.length?list.length+' errores registrados en este dispositivo:':'Sin errores registrados.'];
 for(const e of list)lines.push('- '+e.at+' · '+e.kind+(e.count>1?' ×'+e.count:'')+' · '+e.message+(e.where?' · '+e.where:'')+(e.version&&e.version!==version?' · '+e.version:''));
 return lines.filter(Boolean).join('\n');
}
const storage=(()=>{try{return globalThis.localStorage;}catch(_){return null;}})();
const version=()=>globalThis.document?.getElementById?.('releaseVersion')?.textContent||'';
// Listening starts as soon as this module loads, before the rest of the game.
globalThis.addEventListener?.('error',e=>{if(e?.message||e?.error)recordError(storage,{kind:'error',message:e.message||e.error?.message,file:e.filename,line:e.lineno,version:version()});});
globalThis.addEventListener?.('unhandledrejection',e=>{const r=e?.reason;recordError(storage,{kind:'promesa',message:r?.message||r,version:version()});});
export function initialize(runtime){
 const $=runtime.$;
 function show(){const n=readErrors(storage).length;$('diagnosticInfo').textContent=n?n+(n===1?' error registrado en este dispositivo.':' errores registrados en este dispositivo.'):'Sin errores registrados.';}
 $('diagnosticCopy').onclick=async()=>{const text=errorReport(readErrors(storage),{version:version(),agent:navigator.userAgent});try{await navigator.clipboard.writeText(text);$('diagnosticInfo').textContent='Diagnóstico copiado.';}catch(_){$('diagnosticInfo').textContent='No se pudo copiar en este navegador.';}};
 new MutationObserver(()=>{if(!$('mSettings').hidden)show();}).observe($('mSettings'),{attributes:true,attributeFilter:['hidden']});
 Object.defineProperty(runtime,'errorLog',{get:()=>()=>readErrors(storage)});show();
}
