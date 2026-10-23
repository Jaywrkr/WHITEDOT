import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
// Calm motion follows the player's setting or the system's preference (docs/ARQUITECTURA.md).
let reduce=false;globalThis.matchMedia=()=>({get matches(){return reduce;},addEventListener(){}});
const {calmMotion}=await import('../src/frame-state.js');
assert.equal(calmMotion({}),false);assert.equal(calmMotion({reducedMotion:true}),true);assert.equal(calmMotion(null),false);
reduce=true;const fresh=await import('../src/frame-state.js?system');assert.equal(fresh.calmMotion({}),true,'the system preference alone is enough');
// No module decides on S.reducedMotion alone: it is never set outside previews, so it would ignore the system.
const bare=/runtime\.S\.reducedMotion(?!\s*\|\|)/;
// Each use is checked on its own (lines are long): the setting must be joined to the system preference right there.
for(const f of readdirSync(new URL('../src/',import.meta.url)).filter(f=>f.endsWith('.js'))){const text=readFileSync(new URL('../src/'+f,import.meta.url),'utf8');
 for(const m of text.matchAll(/runtime\.S\.reducedMotion/g)){const around=text.slice(m.index,m.index+60);if(!/^runtime\.S\.reducedMotion\s*\|\|/.test(around))assert.fail(f+' decides calm motion on S.reducedMotion alone: '+text.slice(Math.max(0,m.index-40),m.index+40));}}
console.log('PASS calm motion: setting or system preference, and no module reads the setting alone');
