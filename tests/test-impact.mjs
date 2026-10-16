import assert from 'node:assert/strict';import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {affectedTests} from '../scripts/test-impact-model.mjs';
const root=mkdtempSync(join(tmpdir(),'whitedot-impact-'));try{
 for(const dir of ['src','tests','styles'])mkdirSync(join(root,dir));
 const files={'src/a.js':"import './b.js';",'src/b.js':"import './a.js';",'src/other.js':'export const n=1;','tests/a.mjs':"import '../src/a.js';",'tests/other.mjs':"import '../src/other.js';",'tests/style.mjs':"new URL('../styles/j.css',import.meta.url)",'tests/dynamic.mjs':"await import(name)",'styles/j.css':'body{}','tests/audio_mix.mjs':"import '../src/a.js';"};
 for(const [file,text]of Object.entries(files))writeFileSync(join(root,file),text);
 assert.deepEqual(affectedTests(root,['src/b.js']),['a.mjs','dynamic.mjs']);
 assert.deepEqual(affectedTests(root,['styles/j.css']),['style.mjs']);
 assert.deepEqual(affectedTests(root,['tests/other.mjs']),['dynamic.mjs','other.mjs']);
 assert.deepEqual(affectedTests(root,['README.md']),[]);
 writeFileSync(join(root,'tests/walk.mjs'),"import {readdirSync} from 'node:fs';readdirSync(path)");assert(affectedTests(root,['src/new.js']).includes('walk.mjs'));
 console.log('PASS transitive/cyclic dependencies, source-resource checks, new tests, conservative dynamic imports/walks and unchanged-code exclusion');
}finally{rmSync(root,{recursive:true,force:true});}
