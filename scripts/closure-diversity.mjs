// Structural recipes sampled at real addresses; never a claim of unique songs.
import {writeFileSync} from 'node:fs';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {hybridIdentity,HYBRID_STYLES} from '../src/musical-hybrids.js';import {WORLD_FAMILIES} from '../src/world-families.js';import {createRadio} from '../src/radio.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const r={};data(r);progress(r);world(r);const regions=4096,genres=new Set(),families=new Set(),hybrids=new Set(),pairs=new Set(),phrases=new Set(),examples=[];let land=0,pure=0;
for(let i=0;i<regions;i++){
 const x=i%64-32,y=Math.floor(i/64)-32,d=r.regionOfPos((x+.5)*3600,(y+.5)*3600);if(d.sea)continue;land++;
 const h=hybridIdentity(d,r.seedOf,r.rng),family=d.worldFamily?.id||'native';genres.add(d.genre);families.add(family);if(h)hybrids.add(h.id);else pure++;
 const signature=[d.genre,family,h?.id||'pure'];pairs.add(signature.join('|'));const radio=createRadio(r.seedOf,r.rng,r.GEN),frames=[0,16,64].map(bar=>{const f=radio.advance(d,bar);return [f.hook,f.hookI,f.bassI,f.grammar.progression,f.grammar.brightness,f.identity?.swing];});phrases.add(JSON.stringify([signature,d.bpm,d.scale,frames]));
 if(examples.length<24&&(!examples.some(e=>e.hybrid===(h?.id||'pure'))||!examples.some(e=>e.family===family)))examples.push({region:d.key,x:(x+.5)*3600,y:(y+.5)*3600,genre:d.genre,family,hybrid:h?.id||'pure',bpm:d.bpm});
}
const report={sampledRegions:regions,land,pure,genres:genres.size,families:families.size,influences:hybrids.size,structuralCombinations:pairs.size,threeFrameRecipes:phrases.size,examples,interpretation:'Real sampled addresses and composition data. Correlated traits are not multiplied. Distinct recipes do not certify perceptually distinct worlds or songs; no estimate of millions is asserted.'};
writeFileSync('scripts/cierre-f10-diversity.json',JSON.stringify(report,null,2)+'\n');
if(genres.size!==52||hybrids.size!==HYBRID_STYLES.length||families.size!==WORLD_FAMILIES.length||pure===0)throw Error('A native style, family, influence or pure region became unreachable');console.log('PASS '+JSON.stringify(report));
