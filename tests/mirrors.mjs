import assert from 'node:assert/strict';
import {createMirrorSite,traceMirrors,normalizeMirrorSites,mirrorAngle,mirrorDragAngle} from '../src/mirrors.js';
import {claimInstallationBar} from '../src/installations.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const home=createMirrorSite(r.regionOfPos(900,900),3600,r.seedOf,r.rng);assert(home);
assert.deepEqual(home,createMirrorSite(r.regionOfPos(900,900),3600,r.seedOf,r.rng));
assert(!traceMirrors(home).connected);home.mirrors.forEach((m,i)=>m.angle=home.solution[i]);
const route=traceMirrors(home);assert(route.connected);assert.deepEqual(route.hits,[0,1,2]);assert(route.segments.length<=5);
// Segment edges and finite reflection caps also cover parallel rays and reflected loops.
for(let a=0;a<180;a++){
 home.mirrors.forEach((m,i)=>m.angle=mirrorAngle((a+i*37)/180*Math.PI));const t=traceMirrors(home);
 assert(t.hits.length<=4);assert(t.segments.length<=5);assert(t.segments.every(s=>[s.from.x,s.from.y,s.to.x,s.to.y].every(Number.isFinite)));
}
const trap={emitter:{x:50,y:0},rotation:0,target:{x:50,y:100},mirrors:[{x:0,y:0,angle:Math.PI/2},{x:100,y:0,angle:Math.PI/2}]};
const trapped=traceMirrors(trap);assert(!trapped.connected);assert.equal(trapped.hits.length,4);assert.equal(trapped.segments.length,5);
const parallel=traceMirrors({...trap,mirrors:[{x:100,y:0,angle:0}]});assert.equal(parallel.hits.length,0);
const saved=normalizeMirrorSites({'mirror:-2,3':{angles:[-1,10,1],solved:true},'mirror:0,0':{angles:'bad'},oops:{angles:[0,0,0]}});
assert.equal(Object.keys(saved).length,1);assert.deepEqual(saved,normalizeMirrorSites(JSON.parse(JSON.stringify(saved))));
assert(claimInstallationBar(r,10));assert(!claimInstallationBar(r,10));assert(claimInstallationBar(r,12));
let sites=0;for(let x=-15;x<=15;x++)for(let y=-15;y<=15;y++){
 const region=r.regionOfPos((x+.5)*3600,(y+.5)*3600),site=createMirrorSite(region,3600,r.seedOf,r.rng);if(!site)continue;
 sites++;assert(!region.sea);site.mirrors.forEach((m,i)=>m.angle=site.solution[i]);assert(traceMirrors(site).connected,site.id);
}
assert(sites>40&&sites<300);assert.deepEqual(r.fresh().mirrorSites,{});
console.log(`PASS: ${sites} sparse seeded mirror sites, solvable rotated routes, finite rays and shared musical budget`);

const pivot={x:10,y:20,angle:.3};
assert(Math.abs(mirrorDragAngle(pivot,{x:30,y:20},{x:10,y:40})-mirrorAngle(.3+Math.PI/2))<1e-9);
assert(Math.abs(mirrorDragAngle(pivot,{x:30,y:20},{x:30,y:20})-.3)<1e-9);
for(let a=-20;a<20;a++){const angle=mirrorDragAngle(pivot,{x:30,y:20},{x:10+Math.cos(a)*20,y:20+Math.sin(a)*20});assert(angle>=0&&angle<Math.PI);}
const {glassColor}=await import('../src/glass-music.js');
assert.equal(glassColor(340,0,1),100);assert(Math.abs(glassColor(340,.7,1)-glassColor(340,.7+2*Math.PI,1))<1e-9);
assert.notEqual(glassColor(30,0,0),glassColor(30,Math.PI/2,0));
