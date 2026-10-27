// L2 · no Spanish the player can read escapes the text system. Every readable text of src/*.js, index.html and
// recovery.html (string literals with ${…} as a sample value, the page's text and labels, markup written in JavaScript)
// that reads Spanish must come out of the English translation with no Spanish left. The exceptions are few and named.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EN} from '../src/i18n-en.js';
import {useDictionary,setLang,translate} from '../src/i18n.js';
import {sourceTexts,spanish,words,SPANISH_WORDS} from '../scripts/i18n-scan.mjs';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
// Spanish words: those of the keys that never appear in English, plus articles and prepositions.
const lexicon=new Set(Object.keys(EN).flatMap(words));for(const w of Object.values(EN).flatMap(words))lexicon.delete(w);
assert.ok(lexicon.size>2000&&lexicon.has('cerrar')&&lexicon.has('bitácora')&&!lexicon.has('dub'));
const EXCEPTIONS=[
 {file:'src/world-families.js',test:t=>/^[a-z]+( [a-z]+)+$/.test(t),why:'ids of the places of a world family, never shown'},
];
// Templates whose parts are of different kinds, with the values the game puts in them.
const SAMPLES={'{} · {} · a {} región{} del origen':['Nofe','Llanura','3','es']};
useDictionary(EN);await setLang('en',null);
const rows=sourceTexts(),checked=new Set(),left=[];let excepted=0;
for(const {text,file,line}of rows){
 if(!spanish(text,lexicon))continue;
 if(EXCEPTIONS.some(e=>e.file===file&&e.test(text))){excepted++;continue;}
 checked.add(text);
 // A ${…} part is a number or a name: the text passes with either sample (a name stays a name).
 const filled=SAMPLES[text]?[SAMPLES[text].reduce((t,v)=>t.replace('{}',v),text)]:['7','Jardín'].map(v=>text.replace(/\{\}/g,v));
 const outs=filled.map(translate);
 if(!outs.some(out=>!spanish(out.replace(/Jardín/g,''),lexicon)))left.push(`${file}:${line} ${JSON.stringify(text)} → ${JSON.stringify(outs)}`);
}
assert.deepEqual(left,[],'Spanish text without English');
assert.ok(checked.size>3000,'the scan reaches the whole game: '+checked.size);
assert.ok(excepted<=10,'the exceptions stay short');
// The scan sees the kinds of text it must: a label, a canvas word, a toast and the guide.
for(const t of ['Cerrar menú','Abre el Mundo con diez cristales','El progreso se guarda en este dispositivo.','Tu canción'])assert.ok(checked.has(t),t);
// Spanish is the game as it was: the text system returns its input untouched.
await setLang('es',null);for(const t of [...checked].slice(0,500))assert.equal(translate(t),t);
// Wiring: first module of main.js, started right after the save is read; one entry each in the worker's shell; the
// setting in Ajustes; the guide line valid for the app; recovery.html translated too.
const main=read('src/main.js');assert.ok(main.startsWith("import {initialize as i18n} from './i18n.js';"));assert.match(main,/\nprogress\(runtime\);\ni18n\(runtime\);\n/);
const sw=read('sw.js');for(const m of ['"./src/i18n.js"','"./src/i18n-en.js"'])assert.equal(sw.split(m).length-1,1,m);
const html=read('index.html');
assert.match(html,/<label for="language" translate="no">Idioma \/ Language<\/label><select id="language" translate="no"><option value="es" lang="es">Español<\/option><option value="en" lang="en">English<\/option><\/select>/);
assert.match(html,/<style>html\[data-i18n-wait\] body\{visibility:hidden\}<\/style>/);assert.match(html,/setTimeout\(function\(\)\{h\.removeAttribute\('data-i18n-wait'\)\},4000\)/);
assert.match(html,/<p>El progreso se guarda en este dispositivo\.<span data-cloud>/);assert.ok(!html.includes('este navegador'));
assert.match(read('recovery.html'),/await import\('\.\/src\/i18n\.js'\)/);
console.log(`PASS i18n coverage: ${checked.size} Spanish texts in src/, index.html and recovery.html come out in English; ${excepted} named exceptions; Spanish untouched`);
