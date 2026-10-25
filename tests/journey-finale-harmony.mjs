import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';const palette={};data(palette);
import {finaleScore,finaleArrangement,finaleContext,scoreLength} from '../src/journey-finale.js';
const raw={llanura:[57,60,64],lago:[60,62],bosque:[55,58],tormenta:[51,54],vacio:[57,60]},before=structuredClone(raw);
for(const {scale} of palette.BIOMES)for(let tr=0;tr<12;tr++)for(const six of [.1,.125,1/6]){const context=finaleContext({MU:{dnaA:{scale},tr},SIX:six}),ratio=six/.125,score=finaleScore(raw).map(n=>({...n,at:n.at*ratio,seconds:n.eighths*.25*ratio})),events=finaleArrangement(score,context),pcs=new Set(scale.map(n=>(57+tr+n)%12));
 assert(events.every(e=>e.at<scoreLength(score)),'no attack during silence');for(const e of events){if(Number.isFinite(e.midi))assert(pcs.has((e.midi%12+12)%12),`${e.what} respects finale scale`);for(const n of e.tones||[])assert(pcs.has((n%12+12)%12));}assert(events.some(e=>e.group==='phrase'&&e.what==='cello'));assert(!events.some(e=>e.group==='phrase'&&e.what==='lead'),'no doubled square lead');}
assert.deepEqual(raw,before,'interpretation never rewrites player MIDI');assert.equal(finaleContext({SIX:.9}).six,1/6);console.log('PASS finale5: 396 biome/transpose/tempo contexts, interpreted phrases and bed in one key, no attack in silence, saved notes untouched');

{const score=finaleScore({llanura:[57]}),events=finaleArrangement(score,finaleContext());for(const id of ['llanura','lago','bosque','tormenta','vacio'])assert(events.some(e=>e.group==='bed'&&e.layer===id),'legacy chapters without notes still join their lit ring');}
