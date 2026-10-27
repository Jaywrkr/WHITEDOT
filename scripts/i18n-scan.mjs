// Finds the player-visible Spanish text in the source (L2): string literals of src/*.js (templates with ${…} as {}),
// the text and labels of index.html and recovery.html, and the text inside markup written in JavaScript.
// `node scripts/i18n-scan.mjs` lists what has no English yet; tests/i18n-keys.mjs and tests/i18n-coverage.mjs use it.
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

export function jsStrings(src){
 const out=[];let i=0,line=1,prev='';const n=src.length;
 const regexBefore=/[(,=:[!&|?{};+\-*%<>~^]$/,keyword=/^(?:return|typeof|case|do|else|in|of|new|delete|void|throw|yield|await)$/;
 const quoted=q=>{let t='';i++;while(i<n&&src[i]!==q){if(src[i]==='\\'){t+=unescape(src[i+1]);i+=2;}else{if(src[i]==='\n')line++;t+=src[i++];}}i++;return t;};
 function unescape(c){return c==='n'?'\n':c==='t'?'\t':c;}
 function template(){const start=line;let s='';i++;
  while(i<n){const c=src[i];
   if(c==='\\'){s+=unescape(src[i+1]);i+=2;continue;}
   if(c==='`'){i++;break;}
   if(c==='$'&&src[i+1]==='{'){i+=2;s+='{}';let depth=1;
    while(i<n&&depth>0){const d=src[i];
     if(d==='{'){depth++;i++;}else if(d==='}'){depth--;i++;}
     else if(d==='\''||d==='"'){const l=line;out.push({text:quoted(d),line:l});}
     else if(d==='`')out.push(template());
     else{if(d==='\n')line++;i++;}}
    continue;}
   if(c==='\n')line++;s+=c;i++;}
  return {text:s,line:start};}
 while(i<n){const c=src[i];
  if(c==='\n'){line++;i++;continue;}
  if(/\s/.test(c)){i++;continue;}
  if(c==='/'&&src[i+1]==='/'){while(i<n&&src[i]!=='\n')i++;continue;}
  if(c==='/'&&src[i+1]==='*'){i+=2;while(i<n&&!(src[i]==='*'&&src[i+1]==='/')){if(src[i]==='\n')line++;i++;}i+=2;continue;}
  if(c==='\''||c==='"'){const l=line;out.push({text:quoted(c),line:l});prev='"';continue;}
  if(c==='`'){out.push(template());prev='`';continue;}
  if(c==='/'&&(prev===''||regexBefore.test(prev)||keyword.test(prev))){i++;let cls=false;
   while(i<n){const d=src[i];if(d==='\\'){i+=2;continue;}if(d==='[')cls=true;else if(d===']')cls=false;else if(d==='/'&&!cls){i++;break;}else if(d==='\n')break;i++;}
   while(/[a-z]/i.test(src[i]||''))i++;prev='/';continue;}
  if(/[\w$]/.test(c)){let w='';while(i<n&&/[\w$]/.test(src[i]))w+=src[i++];prev=w;continue;}
  prev=c;i++;}
 return out;
}

const ENTITIES={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:'\u00a0'};
const decode=s=>s.replace(/&(#x?[0-9a-f]+|\w+);/gi,(m,e)=>e[0]==='#'?String.fromCodePoint(parseInt(e[1]==='x'||e[1]==='X'?e.slice(2):e.slice(1),e[1]==='x'||e[1]==='X'?16:10)):ENTITIES[e]??m);
export const LABELS=['aria-label','title','placeholder','alt','aria-roledescription','aria-valuetext','data-tip'];
// The visible pieces of a piece of markup: text between tags and the labels the game translates.
export function markupTexts(html){
 const out=[];const body=html.replace(/<!--[\s\S]*?-->/g,'').replace(/<(\w+)\b[^>]*\btranslate="no"[^>]*>[\s\S]*?<\/\1>/g,'').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi,'').replace(/<(textarea)\b[^>]*>[\s\S]*?<\/\1>/gi,'');
 const re=/<[^>]*>/g;let last=0,m;
 const skipMeta=tag=>/^<(meta|link|title|svg|path|circle|rect|g|line|polyline|polygon|ellipse|use|defs)\b/i.test(tag);
 while((m=re.exec(body))){const text=body.slice(last,m.index);if(text.trim())out.push(decode(text));last=re.lastIndex;
  if(!skipMeta(m[0])||/^<svg/i.test(m[0]))for(const a of LABELS){const v=new RegExp('\\s'+a+'="([^"]*)"').exec(m[0]);if(v&&v[1].trim())out.push(decode(v[1]));}}
 const rest=body.slice(last);if(rest.trim())out.push(decode(rest));
 return out;
}
// Spanish words that never appear in English text: articles, prepositions, pronouns; plus accents, ñ, ¿ and ¡.
export const SPANISH_WORDS=new Set('de del la las el los un una unos unas y o u en con por para al lo le les se su sus tu tus mi mis te que qué como cómo cuando cuándo donde dónde ya hay muy más sin sobre entre hasta desde este esta estos estas ese esa eso esto otro otra otros otras cada todo toda todos todas nada algo aquí allí ahora también pero porque es está están eres ser fue ha han nos vez veces'.split(' '));
const ACCENT=/[áéíóúñÁÉÍÓÚÑ¿¡]/;
export const words=s=>s.toLocaleLowerCase('es').match(/\p{L}+(?:[-’']\p{L}+)*/gu)||[];
// True when a text reads as Spanish: an accent, ñ, ¿ or ¡, or a Spanish-only word.
export function spanish(text,lexicon=SPANISH_WORDS){if(ACCENT.test(text))return true;return words(text).some(w=>SPANISH_WORDS.has(w)||lexicon.has(w));}
// Text a player could read: letters, not an identifier, a CSS value, a key name or markup alone.
export function readable(text){
 const s=text.trim();if(!/\p{L}{2}/u.test(s))return false;
 if(/^[a-z0-9_:.\-/#?=&%]+$/.test(s)||/^[a-z]{2}-[A-Z]{2}$/.test(s))return false;// ids, keys, paths, locales
 if(!/\s/.test(s)&&(/[:_{}|]/.test(s)||/[a-z][A-Z]/.test(s)))return false;// keyed ids: ambient:v1:{}, placeClose
 if(/^[a-z]+( [a-z]+){7,}$/.test(s))return false;// id lists
 if(/^M-?\d/.test(s)||/\[|:not\(|^[a-z]+(,[a-z]+)+$|^(GET|POST|PUT|PNG|NFD|SCRIPT)$/.test(s))return false;// path data, selectors
 if(/^[a-z_0-9]+( [a-z_0-9]+)+$/.test(s)&&/_|\b(organic|floor|broken|calm|melodic|warm|disco|machine|bass|feltpiano|rhodes|minimal|deep|afro|ambient|clav|phasekeys|hollow)\b/.test(s))return false;// tag and id lists
 if(/^[A-Z][a-z]+[A-Z]\w*$/.test(s))return false;// ArrowLeft, KeyE
 if(/^(\d+ )?\d*px|^\d+(\.\d+)?(px|em|rem|%|ms|s)\b|rgba?\(|hsla?\(|#[0-9a-f]{3,8}\b|Geist|monospace|prefers-|:scope|^\(|^[.#\[][\w-]/i.test(s)&&!ACCENT.test(s))return false;
 return true;
}
// Every readable text of the game's source, with where it comes from.
export function sourceTexts(root=fileURLToPath(new URL('..',import.meta.url))){
 const rows=[];const add=(text,file,line)=>{const labels=[...text.matchAll(/\b(?:aria-label|title|alt|placeholder)="([^"]*)/g)].map(m=>m[1]);if(/="/.test(text)&&!/<[a-z]/i.test(text))text='';
  for(const piece of [...labels,.../<\/?[a-z][^>]*>/i.test(text)?markupTexts(text):[text]]){const s=piece.replace(/\s+/g,' ').replace(/^[·\s]+|[\s·]+$/g,'');if(readable(s))rows.push({text:s,file,line});}};
 for(const file of readdirSync(root+'/src').filter(f=>f.endsWith('.js')&&!f.startsWith('i18n')).sort())
  for(const {text,line}of jsStrings(readFileSync(root+'/src/'+file,'utf8')))add(text,'src/'+file,line);
 for(const file of ['index.html','recovery.html']){const html=readFileSync(root+'/'+file,'utf8');for(const text of markupTexts(html))add(text,file,0);
  for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))for(const {text,line}of jsStrings(m[1]))add(text,file,line);}
 return rows;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const {EN}=await import('../src/i18n-en.js'),{useDictionary,setLang,translate}=await import('../src/i18n.js');
 useDictionary(EN);await setLang('en',null);const lexicon=new Set(Object.keys(EN).flatMap(words));for(const w of Object.values(EN).flatMap(words))lexicon.delete(w);
 const seen=new Set();for(const {text,file,line}of sourceTexts()){if(seen.has(text)||!spanish(text,lexicon))continue;seen.add(text);
  const sample=text.replace(/\{\}/g,'7'),out=translate(sample);if(spanish(out,lexicon))console.log(file+':'+line+'\t'+JSON.stringify(text)+'\t→ '+JSON.stringify(out));}
}
