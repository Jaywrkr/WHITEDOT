import assert from 'node:assert/strict';
import {approachTempo,transitionGain,sparseFoundationGain,territoryPalette,territoryInk} from '../src/territory-transition.js';
for(const [from,to]of [[70,174],[174,70],[126,132]]){let bpm=from,steps=0;while(bpm!==to&&steps++<20){const next=approachTempo(bpm,to);assert(Math.abs(next-bpm)<=24);assert(Math.abs(next-to)<Math.abs(bpm-to));bpm=next;}assert.equal(bpm,to);assert(steps<=10);}
assert(transitionGain(0)>0&&transitionGain(0)<transitionGain(1)&&transitionGain(2)===1);assert(sparseFoundationGain(1)>sparseFoundationGain(2)&&sparseFoundationGain(4)===1);
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);let mono=0,mixed=0;const inks=new Set();
for(let x=-20;x<20;x++)for(let y=-10;y<10;y++){
 const d=r.regionOfPos((x+.5)*3600,(y+.5)*3600),before=JSON.stringify(d),p=territoryPalette(d,r.seedOf),roles=['bajo','perc','acorde','lead','agudo'].map(role=>territoryInk(d,role,r.seedOf));assert.equal(JSON.stringify(d),before);assert(roles.every(c=>/^#[0-9a-f]{6}$/.test(c)));roles.forEach(c=>inks.add(c));if(d.worldFamily.paletteMode==='monochrome'){mono++;assert.equal(new Set(roles).size,1);assert.equal(roles[0],d.worldFamily.ink);}else mixed++;
}
assert(mono>50&&mixed>50&&inks.size>20);
console.log('PASS varied regional tempi with bounded convergence, audible sparse transitions, stable monochrome/accent territories and preserved world DNA');
