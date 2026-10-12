import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {createRegionalVoices} from '../src/voices.js';import {WORLD_GENRES} from '../src/palettes.js';import {INSTRUMENTS} from '../src/journal.js';import {INSTRUMENT_SPECS,initialize as instruments} from '../src/instruments.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);r.S.todayKey='2026-10-12';
const found=new Map();for(let x=-25;x<=25;x++)for(let y=-25;y<=25;y++){const d=r.regionOfPos(x*3600+900,y*3600+900);if(WORLD_GENRES[d.genre])found.set(d.genre,d);}
assert.equal(found.size,4);assert.equal(r.regionOfPos(900,900).genre,'minimal');
for(const [genre,d]of found){const g=WORLD_GENRES[genre],voices=createRegionalVoices(d,r.BIOMES,r.GEN,r.seedOf,r.rng);assert(g.scales.some(scale=>JSON.stringify(scale)===JSON.stringify(d.scale)));assert(d.bpm>=g.bpm[0]&&d.bpm<=g.bpm[1]);for(const v of Object.values(voices)){assert(INSTRUMENTS[v.instrument]);if(v.role==='bajo')assert(g.bassP.includes(v.instrument));else if(v.role==='perc')assert(g.percP.includes(v.instrument));else assert(g.hookP.includes(v.instrument));}}
// Serialized chunks captured before the musical expansion: scenery and identities stay intact.
for(const [x,y,hash]of [[0,0,'ea382cf8ec2d5a26d421d0d1c2fb6094bdf2569c2297922afd17808e93a8c4d0'],[5,7,'8c176197df150437ca3e2d9fbb8c8afa9ed30caaeedb907dff50ca7a186a8dd6'],[-6,12,'f4ce82bff539aca10afe9e17487d0eed5cd3a464836e034c06acb9dd8a9cd781'],[21,-15,'56e091751107642a97eed4b2e51727de2c87ace059105119360b4f2e00f5bad1'],[-30,-20,'1aa57e10d58922b125bdd28b9fe86865427dd058443e01d0f9309f1fb742cb3d']])assert.equal(createHash('sha256').update(JSON.stringify(r.wchunk(x,y))).digest('hex'),hash);
let events=[];function param(){return {value:0,setValueAtTime(v,t){assert(Number.isFinite(v)&&Number.isFinite(t));events.push(['set',v,t]);},exponentialRampToValueAtTime(v,t){assert(v>0&&Number.isFinite(t));events.push(['ramp',v,t]);}};}
function node(){const n={frequency:param(),gain:param(),Q:param(),connect(target){return target;},start(t){assert.equal(t,10);events.push(['osc',this.type,this.frequency.value]);},stop(t){assert(t>10&&t<12);}};return n;}
r.ac={createOscillator:node,createGain:node,createBiquadFilter:node};r.bus=node();r.verbIn=node();r.hz=m=>440*2**((m-69)/12);r.env=(g,t,a,v,d)=>{assert(a>0&&v>0&&d>0);events.push(['env',a,v,d]);};instruments(r);
const signatures=new Set();for(const id of Object.keys(INSTRUMENT_SPECS)){assert(INSTRUMENTS[id]);for(const pitch of [36,60,84]){events=[];assert.equal(r.playNewInstrument(id,pitch,10,.1),true);assert(events.some(e=>e[0]==='osc'));if(pitch===60)signatures.add(JSON.stringify(events));}}
assert.equal(signatures.size,Object.keys(INSTRUMENT_SPECS).length);assert.equal(r.playNewInstrument('unknown',60,10,.1),false);
console.log('PASS: four reachable electronic palettes, family-specific voices, preserved world fixtures and distinct bounded synth graphs');
