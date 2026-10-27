// L2 · the English dictionary (src/i18n-en.js). Every key is Spanish text the game shows, every value its English:
// none missing (a value for each key, the same placeholders, no Spanish left) and none extra (each key is reached by the
// source text it translates or is made of words the source holds; the short list below names the few built at run time).
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EN} from '../src/i18n-en.js';
import {useDictionary,setLang,translate,trackKeys} from '../src/i18n.js';
import {sourceTexts,sourceCorpus,spanish,words} from '../scripts/i18n-scan.mjs';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const keys=Object.keys(EN);
assert.ok(keys.length>3000,'the whole game is in the dictionary');
assert.equal((read('src/i18n-en.js').match(/^ "/gm)||[]).length,keys.length,'no key written twice');
const placeholders=s=>(s.match(/\{n?\d?\}/g)||[]).map(p=>p.replace(/\d/,'')).sort().join(' ');
for(const [es,en]of Object.entries(EN)){
 assert.equal(typeof en,'string',es);assert.ok(en&&en===en.trim(),'empty or untrimmed English for '+es);
 assert.ok(es&&es===es.trim(),'untrimmed key '+es);
 assert.equal(placeholders(en),placeholders(es),'placeholders differ for '+es);
 if(es.includes('{n}'))assert.ok(!/\d/.test(es.replace(/\{n\}/g,'')),'a numbered key keeps every number as {n}: '+es);
 assert.ok(!spanish(en),'English that still reads Spanish: '+en);
}
// None extra.
useDictionary(EN);await setLang('en',null);const hits=trackKeys(true);
const texts=[...new Set(sourceTexts().map(r=>r.text))];
for(const text of texts)for(const sample of ['7','Lugar'])translate(text.replace(/\{\}/g,sample));
const corpus=new Set(words(sourceCorpus()));
// Keys reached only by text the game joins while playing, whose words are not all in the source as written.
const COMPOSED=new Set(['a {n} regiónes del origen']);
const extra=keys.filter(k=>!hits().has(k)&&!COMPOSED.has(k)&&!words(k.replace(/\{n?\d?\}/g,' ')).every(w=>corpus.has(w)));
assert.deepEqual(extra,[],'keys no source text uses');
for(const k of COMPOSED)assert.ok(k in EN&&!hits().has(k),'the composed list stays short and real: '+k);
trackKeys(false);
console.log(`PASS i18n keys: ${keys.length} Spanish keys, each with English, same placeholders, no Spanish left and none unused`);
