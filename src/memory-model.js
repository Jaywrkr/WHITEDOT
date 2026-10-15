// Additive save data: no audio nodes, timers or frozen world simulations.
export const MEMORY_LIMITS=Object.freeze({patches:128,bonds:256});
const obj=v=>v&&typeof v==='object'&&!Array.isArray(v),id=v=>typeof v==='string'&&v.length>0&&v.length<=160&&!['__proto__','constructor','prototype'].includes(v),point=p=>obj(p)&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Math.abs(p.x)<1e12&&Math.abs(p.y)<1e12;
export function normalizePatch(raw){
 if(!obj(raw)||!point(raw)||!['weaver','box','animal'].includes(raw.kind))return null;
 const out={kind:raw.kind,x:raw.x,y:raw.y};
 if(raw.kind==='weaver'){
  const edges=[],seen=new Set();for(const e of Array.isArray(raw.weave?.edges)?raw.weave.edges:[]){if(edges.length>=6)break;
   if(!id(e?.from)||!id(e?.to)||e.from===e.to||!point(e.a)||!point(e.b)||Math.hypot(e.a.x-e.b.x,e.a.y-e.b.y)>220||Math.hypot(e.a.x-raw.x,e.a.y-raw.y)>220||Math.hypot(e.b.x-raw.x,e.b.y-raw.y)>220)continue;
   const key=[e.from,e.to].sort().join('|');if(seen.has(key))continue;seen.add(key);edges.push({key,from:e.from,to:e.to,a:{...e.a},b:{...e.b}});
  }out.weave={edges};
 }else if(raw.kind==='box'){
  const parts=raw.box?.parts;if(!Array.isArray(parts)||parts.length!==3||new Set(parts.map(p=>p?.id)).size!==3)return null;
  if(parts.some(p=>!['bass','groove','melody'].includes(p.id)||!Array.isArray(p.steps)||p.steps.length!==16||p.steps.some(n=>!Number.isInteger(n)||n< -1||n>9)))return null;
  out.box={parts:parts.map(p=>({id:p.id,enabled:p.enabled!==false,steps:p.steps.slice()})),selected:Number.isInteger(raw.box.selected)&&raw.box.selected>=0&&raw.box.selected<3?raw.box.selected:0};
 }else{
  const phrase=raw.phrase;if(!Array.isArray(phrase)||!phrase.length||phrase.length>4||phrase.some(n=>!Number.isInteger(n.step)||n.step<0||n.step>14||!Number.isInteger(n.index)||n.index<0||n.index>6))return null;
  out.phrase=phrase.map(n=>({step:n.step,index:n.index}));
 }return out;
}
export function normalizeBond(raw){if(!obj(raw)||!id(raw.kind)||!point(raw)||!Array.isArray(raw.phrase))return null;
 return {kind:raw.kind,x:raw.x,y:raw.y,visits:Math.max(0,Math.min(999,Math.trunc(raw.visits)||0)),phrase:raw.phrase.filter(n=>Number.isInteger(n)&&n>=0&&n<7).slice(-6)};}
export function normalizeWorldMemory(raw){
 if(obj(raw)&&raw.version!==undefined&&raw.version!==1)return raw; // Preserve future data read-only.
 const out={...(obj(raw)?raw:{}),version:1,patches:{},bonds:{}};
 for(const [key,value]of Object.entries(obj(raw?.patches)?raw.patches:{})){const p=id(key)&&normalizePatch(value);if(p)out.patches[key]=p;}
 for(const [key,value]of Object.entries(obj(raw?.bonds)?raw.bonds:{})){const p=id(key)&&normalizeBond(value);if(p)out.bonds[key]=p;}return out;
}
export function rememberEntry(book,group,key,value){
 if(book.version!==1||!['patches','bonds'].includes(group)||!id(key))return false;
 const normalized=group==='patches'?normalizePatch(value):normalizeBond(value);if(!normalized)return false;
 if(!Object.hasOwn(book[group],key)&&Object.keys(book[group]).length>=MEMORY_LIMITS[group])return false;
 book[group][key]=normalized;return true;
}
export function patchFromObject(o){return normalizePatch({kind:o.kind,x:o.x,y:o.y,weave:o.state.weave,box:o.state.box,phrase:o.state.dialogue?.phrase});}
export function applyPatch(o,p){if(!p||p.kind!==o.kind||Math.hypot(o.x-p.x,o.y-p.y)>1)return false;
 if(p.weave)o.state.weave=structuredClone(p.weave);if(p.box)o.state.box=structuredClone(p.box);
 if(p.phrase)o.state.dialogue={phase:'replying',phrase:structuredClone(p.phrase),age:0,lastReplyBar:-Infinity};
 o.state.used=true;o.state.active=0;return true;
}
export function musicalDistance(a,b){if(!a||!b)return 0;return (a.family!==b.family?2:0)+(a.hybrid!==b.hybrid?2:0)+(a.genre!==b.genre?2:0)+(a.band!==b.band?3:0)+(a.palette!==b.palette?2:0)+(a.rhythm!==b.rhythm?2:0)+Math.min(2,Math.abs((a.bpm||0)-(b.bpm||0))/24);}
