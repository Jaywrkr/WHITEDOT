// L1: one edition flag. The source is the web edition; packagers stamp the sale edition ('store') into a staged copy.
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,copyFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {EDITION,EDITIONS,cloudEnabled} from '../src/edition.js';
import {setEdition} from '../scripts/set-edition.mjs';
const root=new URL('../',import.meta.url),read=f=>readFileSync(new URL(f,root),'utf8');
assert.equal(EDITION,'web','the source tree stays the web edition');
assert.deepEqual([...EDITIONS],['web','store']);
assert.equal(cloudEnabled('web'),true);assert.equal(cloudEnabled('store'),false);
for(const odd of ['','Store','venta',null])assert.equal(cloudEnabled(odd),false,'any unknown edition fails closed');
// The stamp rewrites only the staged copy, refuses the source tree and unknown editions.
const dir=mkdtempSync(join(tmpdir(),'kubono-edition-'));
try{
 mkdirSync(join(dir,'src'));copyFileSync(new URL('src/edition.js',root),join(dir,'src/edition.js'));
 assert.throws(()=>setEdition({directory:dir,edition:'venta'}),/Edition must be/);
 setEdition({directory:dir,edition:'store'});
 const staged=await import(join(dir,'src/edition.js')+'?store');
 assert.equal(staged.EDITION,'store');assert.equal(staged.cloudEnabled(),false);
 setEdition({directory:dir,edition:'web'});assert.equal((await import(join(dir,'src/edition.js')+'?web')).EDITION,'web');
 assert.throws(()=>setEdition({directory:new URL('.',root).pathname,edition:'store'}),/never the source tree/);
 assert.equal(read('src/edition.js').match(/export const EDITION='([^']*)';/)[1],'web','the source was not stamped');
}finally{rmSync(dir,{recursive:true,force:true});}
// A saved web session only names whose local save it is: read locally, never sent.
const {savedAccountOwner}=await import('../src/account-entry.js');
const {CLOUD_CONFIG}=await import('../src/cloud-config.js');
const memory=entries=>{const m=new Map(entries);return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]??null,get length(){return m.size;}};};
const session=id=>JSON.stringify({access_token:'a',refresh_token:'r',user:{id,email:'fixture@example.test'},expires_at:1});
assert.equal(savedAccountOwner(memory([])),null);
assert.equal(savedAccountOwner(memory([['kubono:auth:'+new URL(CLOUD_CONFIG.url).origin,session('u-1')]])),'u-1');
assert.equal(savedAccountOwner(memory([['kubono:auth:https://other.supabase.co',session('u-2')]])),'u-2','a single stored session from another project still counts');
assert.equal(savedAccountOwner(memory([['kubono:auth:https://a.supabase.co',session('u-2')],['kubono:auth:https://b.supabase.co',session('u-3')]])),null,'two owners: no guess');
assert.equal(savedAccountOwner(memory([['kubono:auth:'+new URL(CLOUD_CONFIG.url).origin,'{broken']])),null);
assert.equal(savedAccountOwner({getItem(){throw Error('blocked');},key:()=>null,length:0}),null);
// Wiring: main.js builds no client in the sale edition, Cuenta yields to «Guardar copia», the worker caches the flag once
// and the Android staging stamps KUBONO_EDITION.
const main=read('src/main.js');assert.match(main,/!ownSave\|\|!cloudEnabled\(\)\?null:await requireAccount\(\)/);
const account=read('src/cloud-account.js');assert.match(account,/if\(!cloudEnabled\(\)\)\{[^\n]*\$\('bConnection'\)\.hidden=true[^\n]*\$\('bSaveTools'\)\.hidden=false/);
assert.equal(read('sw.js').split('"./src/edition.js"').length-1,1);
assert.match(read('scripts/android-assets.mjs'),/if\(process\.env\.KUBONO_EDITION\)setEdition\(\{directory:out,edition:process\.env\.KUBONO_EDITION\}\)/);
assert.match(read('recovery.html'),/cloudEnabled\(\)\)\{status\.textContent='Esta edición no usa cuenta/);
console.log('PASS sale edition: one flag, web in the source, store stamped only into a staged copy, unknown editions without cloud, saved session read locally as save owner');
