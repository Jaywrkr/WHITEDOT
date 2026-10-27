// Spanish and English (L2). The game is written in Spanish; Spanish is the key. `t(key, vars)` gives a key in the
// player's language, and `translate(text)` does the same for any finished text: exact keys first, then keys with
// numbers ({n}) or open parts ({}), then the pieces between separators. In English the module translates at the exits:
// the page's text and labels (a MutationObserver), canvas text (fillText, strokeText, measureText) and the browser's
// dialogs. In Spanish every function returns its input untouched, so the Spanish game is byte for byte the old one.
// The dictionary (src/i18n-en.js) loads only when English is needed. A text in a [translate="no"] element (names the
// player wrote, codes) is never translated. The language lives in the save (S.lang); docs/TRADUCCION.md.
export const LANGS=Object.freeze(['es','en']);
export const LANG_KEY='kubono:lang';
const ATTRS=['aria-label','title','placeholder','alt','aria-roledescription','aria-valuetext','data-tip'];
const SEPARATORS=['\n',' · ',' — ',' – ',' | ',' / ',': ',', ',' → ',' ← '];
const MONTHS={ene:'Jan',feb:'Feb',mar:'Mar',abr:'Apr',may:'May',jun:'Jun',jul:'Jul',ago:'Aug',sept:'Sep',sep:'Sep',oct:'Oct',nov:'Nov',dic:'Dec'};
let lang='es',exact=new Map(),patterns=[],numeric=new Map(),loaded=null,cache=new Map(),hits=null;

export const normalizeLang=(value,fallback='es')=>LANGS.includes(value)?value:LANGS.includes(fallback)?fallback:'es';
// The system's language on the first start: Spanish for any Spanish locale, English for everything else.
export const systemLang=(languages=globalThis.navigator?.languages||[globalThis.navigator?.language])=>{
 const first=[...(languages||[])].find(v=>typeof v==='string'&&v);return first&&/^es\b/i.test(first)?'es':first?'en':'es';};
export const currentLang=()=>lang;

// Keys: '{n}' stands for a number, '{}' for any part (translated on its own). An English value may use '{1}', '{2}'…
// to change the order; plain '{}' / '{n}' fill in order.
function compile(dict){
 exact=new Map();numeric=new Map();patterns=[];cache=new Map();
 for(const [es,en]of Object.entries(dict)){
  // An open part never spans a separator or a sentence break the key itself does not have.
  if(es.includes('{}')){const stops=[' · ','. ',': ','\n',' — '].filter(x=>!es.includes(x)).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),part=stops?`((?:(?!${stops})[\\s\\S])+?)`:'([\\s\\S]+?)';
   patterns.push({es,en,re:new RegExp('^'+es.split('{}').map(p=>p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\\\{n\\\}/g,'(\\d+(?:[.,]\\d+)*)')).join(part)+'$')});}
  else if(es.includes('{n}'))numeric.set(es,en);
  else exact.set(es,en);
 }
 // The most specific pattern first: more fixed letters, fewer open parts.
 const fixed=p=>p.es.replace(/\{n?\}/g,'').length;patterns.sort((a,b)=>fixed(b)-fixed(a));
}
// Spanish number marks in English: 50.400 → 50,400 and 1,5 → 1.5.
const number=x=>/^\d{1,3}(?:\.\d{3})+$/.test(x)?x.replace(/\./g,','):/^\d+,\d+$/.test(x)?x.replace(',','.'):x;
function fill(template,values){
 let i=0;return template.replace(/\{(n?)(\d?)\}/g,(_,isNumber,index)=>{const v=index?values[index-1]:values[i++];return v===undefined?'':number(v);});
}
const hit=key=>{if(hits)hits.add(key);};
function lookup(s,depth,open=true){
 let v=exact.get(s);if(v!==undefined){hit(s);return v;}
 if(/\d/.test(s)){const numbers=[],key=s.replace(/\d+(?:[.,]\d+)*/g,x=>{numbers.push(x);return '{n}';});v=numeric.get(key);if(v!==undefined){hit(key);return fill(v,numbers);}}
 if(open&&depth<4)for(const p of patterns){const m=p.re.exec(s);if(m){hit(p.es);return fill(p.en,m.slice(1).map(x=>/^\d+(?:[.,]\d+)*$/.test(x)?x:tr(x,depth+1)));}}
 return undefined;
}
function tr(s,depth=0){
 if(depth>8||!/\p{L}/u.test(s))return s;
 const space=/^(\s*)([\s\S]*?)(\s*)$/.exec(s);if(space[1]||space[3]){const core=tr(space[2],depth+1);return space[1]+core+space[3];}
 // A whole key first, also with decorations around it (· ★ ✦ «» ¿? ¡! a final stop); keys with open parts after.
 const deco=/^([^\p{L}\d]*)([\s\S]*?)([^\p{L}\d]*)$/u.exec(s);
 for(const open of [false,true]){
  const found=lookup(s,depth,open);if(found!==undefined)return found;
  if(deco[1]||deco[3])for(let p=0;p<=deco[1].length;p++)for(let q=deco[3].length;q>=0;q--){const pre=deco[1].slice(0,p),core=deco[1].slice(p)+deco[2]+deco[3].slice(0,q),post=deco[3].slice(q);if(core===s||!/\p{L}/u.test(core))continue;const v=lookup(core,depth,open);if(v!==undefined)return pre.replace(/[¿¡]/g,'')+v+post;}
 }
 // Upper-case text (DÍA 1, LUGARES): the key in its usual case, then upper case again.
 if(/\p{Lu}/u.test(s)&&s===s.toLocaleUpperCase('es')&&s!==s.toLocaleLowerCase('es')){
  const lower=s.toLocaleLowerCase('es'),cap=lower.charAt(0).toLocaleUpperCase('es')+lower.slice(1),words=lower.replace(/(^|\s)(\p{L})/gu,(m,a,b)=>a+b.toLocaleUpperCase('es'));
  for(const k of [cap,words,lower]){const v=lookup(k,depth);if(v!==undefined)return v.toLocaleUpperCase('en');}
 }
 // A lower-case first letter (a name inside a sentence): the capitalised key, lower-cased again.
 if(/^\p{Ll}/u.test(s)){const cap=s.charAt(0).toLocaleUpperCase('es')+s.slice(1),v=lookup(cap,depth);if(v!==undefined)return /^[A-Z][a-z]/.test(v)&&!/^(I|I'm|I've|I'll)\b/.test(v)?v.charAt(0).toLowerCase()+v.slice(1):v;}
 if(/\s\s|[\n\t]/.test(s)){const flat=s.replace(/\s+/g,' '),v=lookup(flat,depth);if(v!==undefined)return v;}
 // Pieces: sentences one by one, or the parts between a separator. The split that leaves the fewest Spanish parts wins.
 let best=null;
 const pieces=(parts,join)=>{if(parts.length<2)return;const out=parts.map(p=>tr(p,depth+1)),left=out.filter((p,i)=>p===parts[i]&&/\p{L}/u.test(p)).length;if(out.some((p,i)=>p!==parts[i])&&(!best||left<best.left))best={left,text:out.join(join)};};
 pieces(s.split(/(?<=[.!?…])\s+(?=[\p{Lu}¿¡«"(])/u),' ');
 for(const sep of SEPARATORS)if(s.includes(sep))pieces(s.split(sep),sep);
 if(best)return best.text;
 // Dates written by Intl in Spanish inside a text: «12 oct», «12 oct 2026», «12 de oct. de 2026».
 const dated=s.replace(/\b(\d{1,2})(?: de)? (ene|feb|mar|abr|may|jun|jul|ago|sept?|oct|nov|dic)\b\.?(?:(?: de)? (\d{4}))?/gi,(m,d,mo,y)=>MONTHS[mo.toLowerCase()]+' '+d+(y?', '+y:''));
 if(dated!==s)return tr(dated,depth+1);
 // Words around numbers («Escucha 5 biomas.»): each side on its own.
 if(/\d/.test(s)){const parts=s.split(/(\d+(?:[.,]\d+)*)/);if(parts.length>2){const out=parts.map((p,i)=>i%2?p:tr(p,depth+1));if(out.some((p,i)=>p!==parts[i]))return out.join('');}}
 // Decorations around the words (★, ✦, «», ¿?, ¡!, brackets, a final full stop).
 const around=/^([^\p{L}\d]*)([\s\S]*?\p{L}[\s\S]*?)([^\p{L}\d]*)$/u.exec(s);
 if(around&&(around[1]||around[3])){const core=tr(around[2],depth+1);if(core!==around[2])return around[1].replace(/[¿¡]/g,'')+core+around[3];}
 return s;
}
// Any finished text, in the current language.
export function translate(text){
 if(lang!=='en'||typeof text!=='string'||!text||!loaded)return text;
 let v=cache.get(text);if(v!==undefined)return v;
 v=tr(text);if(cache.size>6000)cache.clear();cache.set(text,v);return v;
}
// A key with variables, t('Hola, {nombre}', {nombre}): in English a key of that exact form uses its English template;
// otherwise the filled Spanish text is translated as a whole.
export function t(key,vars){
 const put=(template,tr)=>vars?template.replace(/\{(\w+)\}/g,(m,k)=>Object.hasOwn(vars,k)?tr(String(vars[k])):m):template;
 if(lang==='en'&&loaded&&exact.has(key)){hit(key);return put(exact.get(key),translate);}
 return translate(put(key,v=>v));
}
// Tests: which keys a run of translations used.
export function trackKeys(on=true){hits=on?new Set():null;return ()=>hits;}
export function useDictionary(dict){compile(dict);loaded=true;}
export async function loadDictionary(){if(!loaded){const {EN}=await import('./i18n-en.js');if(!loaded)useDictionary(EN);}return loaded;}

/* ---------- the page ---------- */
const textMemory=new WeakMap(),attrMemory=new WeakMap();
// Text the player wrote (textarea content, editable areas) and anything under translate="no" stays as it is; the labels
// of a textarea or an input are the game's and are translated.
const skipped=(node,label=false)=>{const el=node.nodeType===1?node:node.parentElement;return !el||!!el.closest(label?'[translate="no"]':'script,style,textarea,[translate="no"],[contenteditable="true"]');};
function textNode(node){
 if(skipped(node))return;
 const now=node.data,mem=textMemory.get(node),source=mem&&now===mem.out?mem.src:now,out=lang==='en'?translate(source):source;
 if(mem&&mem.src===source&&mem.out===out&&now===out)return;
 textMemory.set(node,{src:source,out});if(out!==now)node.data=out;
}
function attribute(el,name){
 if(!el.hasAttribute(name)||skipped(el,true))return;
 let map=attrMemory.get(el);if(!map)attrMemory.set(el,map=new Map());
 const now=el.getAttribute(name),mem=map.get(name),source=mem&&now===mem.out?mem.src:now,out=lang==='en'?translate(source):source;
 if(mem&&mem.src===source&&mem.out===out&&now===out)return;
 map.set(name,{src:source,out});if(out!==now)el.setAttribute(name,out);
}
// The Spanish text of an element as the game wrote it, even after it was shown in English (for labels built from it).
export function sourceText(el){
 if(!el)return '';let out='';const it=(el.ownerDocument||globalThis.document).createTreeWalker(el,4);
 for(let n=it.nextNode();n;n=it.nextNode()){const mem=textMemory.get(n);out+=mem&&n.data===mem.out?mem.src:n.data;}
 return out;
}
function walk(root){
 if(!root)return;if(root.nodeType===3){textNode(root);return;}if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
 const doc=root.ownerDocument||root,it=doc.createTreeWalker(root,5);let n=root.nodeType===1?root:it.nextNode();
 for(;n;n=it.nextNode()){if(n.nodeType===3)textNode(n);else for(const a of ATTRS)if(n.hasAttribute(a))attribute(n,a);}
}
let observer=null;
export function translateDocument(doc=globalThis.document){
 if(!doc)return;doc.documentElement.lang=lang;walk(doc.documentElement);doc.documentElement.removeAttribute?.('data-i18n-wait');
 if(!observer&&lang==='en'&&typeof MutationObserver==='function'){
  observer=new MutationObserver(records=>{for(const r of records){
   if(r.type==='characterData')textNode(r.target);else if(r.type==='attributes')attribute(r.target,r.attributeName);else for(const n of r.addedNodes)walk(n);}});
  observer.observe(doc.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:ATTRS});
 }
}
/* ---------- canvas and dialogs ---------- */
let patched=false;
function patchOutputs(){
 if(patched)return;patched=true;
 for(const proto of [globalThis.CanvasRenderingContext2D?.prototype,globalThis.OffscreenCanvasRenderingContext2D?.prototype].filter(Boolean))
  for(const name of ['fillText','strokeText','measureText']){const original=proto[name];if(typeof original!=='function')continue;
   proto[name]=function(text,...rest){return original.call(this,typeof text==='string'?translate(text):text,...rest);};}
 for(const name of ['alert','confirm','prompt']){const original=globalThis[name];if(typeof original!=='function')continue;
  globalThis[name]=function(message,...rest){return original.call(this,translate(message),...rest);};}
}
// Change the language now: the page's text, the canvas from the next frame, the mirror for the next start.
export async function setLang(next,doc=globalThis.document){
 next=normalizeLang(next);if(next==='en')await loadDictionary();
 lang=next;cache=new Map();try{globalThis.localStorage?.setItem(LANG_KEY,next);}catch(_){/* The save keeps the choice. */}
 if(next==='en')patchOutputs();if(doc)translateDocument(doc);return lang;
}
// Before the save is read: ?lang= when given, else the language of the last start, else Spanish for a device that
// already has a game or for an automated browser (the tests read the Spanish game), else the system's.
const urlLang=(search=globalThis.location?.search)=>{try{const v=new URLSearchParams(search||'').get('lang');return LANGS.includes(v)?v:null;}catch(_){return null;}};
export function bootLang({storage=(()=>{try{return globalThis.localStorage;}catch(_){return null;}})(),nav=globalThis.navigator,search=globalThis.location?.search}={}){
 const asked=urlLang(search);if(asked)return asked;
 try{const saved=storage?.getItem(LANG_KEY);if(LANGS.includes(saved))return saved;
  if(storage&&Object.keys(storage).some(k=>k==='pixel-blanco-v4'||k.startsWith('kubono:')))return 'es';}catch(_){/* Unknown device: the system decides. */}
 if(nav?.webdriver===true)return 'es';
 return systemLang(nav?.languages||[nav?.language]);
}
// The save decides (S.lang). Saves from before L2 have no language and stay in Spanish; a new game takes the language
// it started in. A language from a later version is kept in the save untouched (this one shows its fallback). Ajustes
// changes it; a failed write keeps the old choice.
export function langOfSave(S,{first=false,hadSave=false,asked=null,current=lang}={}){
 const fallback=first&&hadSave?'es':current;
 if(first&&asked)return {show:asked,store:asked};
 if(LANGS.includes(S?.lang))return {show:S.lang,store:S.lang};
 if(typeof S?.lang==='string'&&S.lang)return {show:fallback,store:S.lang};
 return {show:fallback,store:fallback};
}
export function initialize(runtime){
 let owner=null;const box=globalThis.document?.getElementById('language');
 const sync=()=>{const S=runtime.S;if(!S||S===owner)return;const first=!owner;owner=S;
  const {show,store}=langOfSave(S,{first,hadSave:!!runtime.scopeHadSave,asked:urlLang()});if(S.lang!==store)S.lang=store;
  if(show!==lang)setLang(show);if(box)box.value=show;};
 sync();setInterval(sync,1000);
 if(box)box.onchange=async e=>{const before=runtime.S.lang,next=normalizeLang(e.target.value,lang);runtime.S.lang=next;
  if(runtime.save()===false){runtime.S.lang=before;e.target.value=lang;return;}await setLang(next);};
 Object.defineProperties(runtime,{lang:{get:()=>lang},t:{get:()=>t},translate:{get:()=>translate}});
}
// Module start in the page: decide the language before anything is drawn.
if(globalThis.document){const first=bootLang();if(first==='en')await setLang('en');else{const root=globalThis.document.documentElement;root.lang='es';root.removeAttribute('data-i18n-wait');}}
