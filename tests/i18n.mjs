// L2 · how the text system behaves: the language chosen on the first start, kept in the save and changed in Ajustes;
// Spanish untouched; English for whole texts, texts with numbers, joined texts, upper case, decorations and dates.
import assert from 'node:assert/strict';
import {EN} from '../src/i18n-en.js';
import {LANGS,LANG_KEY,normalizeLang,systemLang,bootLang,langOfSave,useDictionary,setLang,currentLang,translate,t,initialize} from '../src/i18n.js';
assert.deepEqual([...LANGS],['es','en']);
for(const [v,want]of [['es','es'],['en','en'],['fr','es'],[undefined,'es'],[null,'es'],['EN','es']])assert.equal(normalizeLang(v),want);
assert.equal(normalizeLang('fr','en'),'en');
// The system's language: any Spanish locale is Spanish; anything else is English.
for(const [langs,want]of [[['es-EC'],'es'],[['es'],'es'],[['es-419','en'],'es'],[['en-US'],'en'],[['pt-BR','es'],'en'],[['fr'],'en'],[[],'es'],[[undefined],'es']])assert.equal(systemLang(langs),want,String(langs));
// First start: ?lang= first, then the language of the last start, then Spanish for a device with a game or an automated
// browser, then the system's.
const store=entries=>Object.assign(Object.create({getItem(k){return Object.hasOwn(this,k)?this[k]:null;}}),entries);
const phone={languages:['en-US'],webdriver:false};
assert.equal(bootLang({storage:store({}),nav:phone,search:''}),'en');
assert.equal(bootLang({storage:store({}),nav:{languages:['es-MX']},search:''}),'es');
assert.equal(bootLang({storage:store({'pixel-blanco-v4':'{}'}),nav:phone,search:''}),'es','a game saved before L2 stays in Spanish');
assert.equal(bootLang({storage:store({'kubono:legacy-owner':'u'}),nav:phone,search:''}),'es');
assert.equal(bootLang({storage:store({[LANG_KEY]:'en','pixel-blanco-v4':'{}'}),nav:{languages:['es']},search:''}),'en','the last start wins');
assert.equal(bootLang({storage:store({}),nav:{languages:['en-US'],webdriver:true},search:''}),'es','automated browsers read the Spanish game');
assert.equal(bootLang({storage:store({[LANG_KEY]:'es'}),nav:phone,search:'?lang=en'}),'en');
assert.equal(bootLang({storage:{getItem(){throw Error('blocked');}},nav:phone,search:''}),'en','blocked storage: the system decides');
// The save: old saves stay Spanish, new games keep the language they started in, a later version's language is kept.
assert.deepEqual(langOfSave({},{first:true,hadSave:true,current:'en'}),{show:'es',store:'es'});
assert.deepEqual(langOfSave({},{first:true,hadSave:false,current:'en'}),{show:'en',store:'en'});
assert.deepEqual(langOfSave({lang:'en'},{first:true,hadSave:true,current:'es'}),{show:'en',store:'en'});
assert.deepEqual(langOfSave({lang:'pt'},{first:true,hadSave:true,current:'en'}),{show:'es',store:'pt'},'a future language is kept in the save');
assert.deepEqual(langOfSave({lang:42},{first:true,hadSave:true,current:'en'}),{show:'es',store:'es'});
assert.deepEqual(langOfSave({},{first:false,hadSave:true,current:'en'}),{show:'en',store:'en'},'starting over keeps the language');
assert.deepEqual(langOfSave({lang:'es'},{first:true,hadSave:true,asked:'en',current:'es'}),{show:'en',store:'en'});
// Spanish: nothing is translated, not even with the dictionary loaded.
useDictionary(EN);await setLang('es',null);assert.equal(currentLang(),'es');
for(const s of ['Cerrar menú','DÍA 4','✦ 3 chispas'])assert.equal(translate(s),s);
assert.equal(t('Hola, {nombre}',{nombre:'Luca'}),'Hola, Luca');
// English.
await setLang('en',null);assert.equal(currentLang(),'en');
const cases={
 'Cerrar menú':'Close menu','Ajustes':'Settings','Tu canción':'Your Song','El Viaje':'The Journey','Bitácora':'Logbook',
 'DÍA 4':'DAY 4','LUGARES':'PLACES','✦ 3 chispas':'✦ 3 sparks','✦ 1 chispa':'✦ 1 spark','Caminado · 12 m':'Walked · 12 m',
 '5/11 lugares':'5/11 places','Cerrar Ajustes':'Close Settings','· Toca su nombre para volver.':'· Tap its name to go back.',
 '¿Seguro?':'Sure?','«Volviste. Todo sigue aquí.»':'«You\'re back. Everything is still here.»',
 'Gran territorio · regiones de 50.400':'Great territory · regions of 50,400','Comparte 5 días distintos.':'Share 5 different days.',
 'Cúmulo · House, oído el 27 oct':'Cluster · House, heard on Oct 27','12 oct 2026':'Oct 12, 2026',
 'Dicen que al norte, no muy lejos, arriba es abajo. Yo no fui. Me dio flojera.':'Word is that to the north, not very far, up is down. Wasn\'t me. Couldn\'t be bothered.',
 'Soriveltan de niebla':'Soriveltan of mist','Kubono':'Kubono','':'','12':'12','Mi primer lugar':'Mi primer lugar'};
for(const [es,en]of Object.entries(cases))assert.equal(translate(es),en,es);
assert.equal(t('Siguiente: {}.'.replace('{}','{lugar}'),{lugar:'Jardín'}),'Next: Garden.');
assert.equal(translate(42),42);assert.equal(translate(null),null);
// The runtime: the save gets its language, Ajustes changes it and a failed write keeps the old choice.
globalThis.document=undefined;
const timers=[];const realSetInterval=globalThis.setInterval;globalThis.setInterval=(f,ms)=>{timers.push(f);return 0;};
try{
 await setLang('en',null);
 const runtime={S:{},scopeHadSave:true,save:()=>true};initialize(runtime);await new Promise(r=>setTimeout(r,0));
 assert.equal(runtime.S.lang,'es','an old save without a language stays Spanish');assert.equal(currentLang(),'es');assert.equal(runtime.lang,'es');
 runtime.S={};timers[0]();await new Promise(r=>setTimeout(r,0));assert.equal(runtime.S.lang,'es','a new save in the same session keeps the language');
 assert.equal(runtime.translate('Ajustes'),'Ajustes');assert.equal(typeof runtime.t,'function');
}finally{globalThis.setInterval=realSetInterval;delete globalThis.document;}
// Ajustes: the select changes the save and the page; a write that fails keeps the old language.
{
 const box={value:''},root={nodeType:1,hasAttribute:()=>false,lang:''};root.ownerDocument={createTreeWalker:()=>({nextNode:()=>null})};
 globalThis.document={getElementById:id=>id==='language'?box:null,documentElement:root,createTreeWalker:()=>({nextNode:()=>null})};
 globalThis.setInterval=()=>0;
 try{
  let ok=true;const runtime={S:{lang:'es'},scopeHadSave:true,save:()=>ok};initialize(runtime);
  assert.equal(box.value,'es');
  box.value='en';await box.onchange({target:box});assert.equal(runtime.S.lang,'en');assert.equal(currentLang(),'en');assert.equal(root.lang,'en');
  ok=false;box.value='es';await box.onchange({target:box});assert.equal(runtime.S.lang,'en','failed write: the save keeps English');assert.equal(box.value,'en');assert.equal(currentLang(),'en');
  ok=true;box.value='es';await box.onchange({target:box});assert.equal(runtime.S.lang,'es');assert.equal(currentLang(),'es');assert.equal(root.lang,'es');
 }finally{globalThis.setInterval=realSetInterval;delete globalThis.document;}
}
await setLang('es',null);
console.log('PASS i18n: system language on the first start, Spanish for old saves and automation, language kept in the save, Spanish untouched, English for whole, numbered, joined, upper-case, decorated and dated texts');
