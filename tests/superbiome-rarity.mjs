import assert from 'node:assert/strict';
import {SUPERBIOME_RARITY} from '../src/superbiome-rarity.js';
import {FAMILIES,LAND_REGIONS,ABYSS_REGIONS,SUPERBIOME_COUNT,valid,superbiome} from '../src/superbiomes.js';
import {census,table,rarity} from '../scripts/superbiome-census.mjs';
// Every valid superbiome has a rarity, and only valid ones.
const ids=Object.keys(SUPERBIOME_RARITY);assert.equal(ids.length,SUPERBIOME_COUNT);
for(const id of ids){const [r,f]=id.split(':');assert(valid(r,f),id);assert(['comun','raro','muy-raro','ausente'].includes(SUPERBIOME_RARITY[id]));}
for(const r of LAND_REGIONS)for(const f of FAMILIES)assert(SUPERBIOME_RARITY[r+':'+f.id]);for(const r of ABYSS_REGIONS)assert(SUPERBIOME_RARITY[r+':ambient']);
// Thresholds: none counted is absent; share of the regions decides the rest.
assert.equal(rarity(0,100),'ausente');assert.equal(rarity(1,1000),'muy-raro');assert.equal(rarity(2,1000),'raro');assert.equal(rarity(5,1000),'comun');
// The table matches a fresh census: it is measured, not hand written, and the map was not changed to make it.
const stats=await census();assert.deepEqual(table(stats),{...SUPERBIOME_RARITY});
assert.equal(superbiome('ruinas','dnb').rarity,'ausente');assert.equal(superbiome('llanura','deep').rarity,'comun');
const n=k=>Object.values(SUPERBIOME_RARITY).filter(v=>v===k).length;
console.log(`PASS superbiome rarity: ${n('comun')} common, ${n('raro')} rare, ${n('muy-raro')} very rare, ${n('ausente')} absent over ${stats.land+stats.abyss} regions of six worlds, matching a fresh census`);
