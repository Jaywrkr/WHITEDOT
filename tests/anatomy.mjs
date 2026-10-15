import assert from 'node:assert/strict';
import {anatomyOf,anatomyPath,anatomyGenes,normalizeAnatomy} from '../src/anatomy.js';
import {LIVING_CATALOG} from '../src/living-catalog.js';
import {livingPortrait} from '../src/living-portraits.js';
import {makeRareCard,normalizeRareBook} from '../src/rare-card-model.js';
import {worldIdentity} from '../src/world-identity.js';
let variants=0;const silhouettes=new Set();
for(const def of LIVING_CATALOG){
 const paths=new Set();for(let i=0;i<32;i++){
  const source={...def,kind:def.id,id:'specimen:'+i,variant:i},before=JSON.stringify(source),a=anatomyOf(source,{id:'grove',key:'2,3'}),path=anatomyPath(a);
  assert.deepEqual(a,anatomyOf(source,{id:'grove',key:'2,3'}));assert.equal(JSON.stringify(source),before);
  assert(!/NaN|Infinity|undefined/.test(path));assert(path.length<14000);assert([...path.matchAll(/-?\d*\.?\d+/g)].every(m=>Math.abs(+m[0])<=1.6));
  assert(anatomyGenes(a).limbs<=5);paths.add(path);
  const card=makeRareCard({type:'living:'+def.id,sourceId:source.id,world:worldIdentity(),appearance:a});
  assert.deepEqual(normalizeRareBook({items:[card]}).items[0].appearance,a);
  assert.equal(livingPortrait(card.type,card.appearance),livingPortrait(card.type,a));
 }assert.equal(paths.size,32,'individuals cannot share an identical silhouette');variants+=paths.size;
 silhouettes.add(anatomyPath(anatomyOf({...def,kind:def.id,id:'same'})));
}
assert.equal(silhouettes.size,28,'previously shared kinds must now have distinct anatomy');
assert.equal(normalizeAnatomy({version:1,shape:'<script>'}),null);
assert.equal(normalizeAnatomy({...anatomyOf({shape:'blob'}),lineage:Infinity}),null);
console.log(`PASS ${variants} deterministic individual anatomies, 28 distinct lineages, bounded complexity/coordinates and migrated exact specimen portraits`);
