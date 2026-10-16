import assert from 'node:assert/strict';
import {smoothRange,distanceOpacity,detailBlend,deviceDetail,fogTarget,blendFog,preloadCells,visualHash,DEPTH_PLANES,planePoint} from '../src/world-visibility-model.js';
assert.equal(distanceOpacity(0,750),1);assert.equal(distanceOpacity(750,750),0);assert.equal(distanceOpacity(751,750),0);assert.equal(distanceOpacity(NaN,750),0);
let last=1;for(let d=0;d<=850;d++){const a=distanceOpacity(d,850);assert(a<=last&&last-a<.01);last=a;}
for(const d of [260,420,500,620,750]){assert(Number.isFinite(detailBlend(d)));assert(Math.abs(detailBlend(d-.01)-detailBlend(d+.01))<.001);}
for(const q of [0,.2,.5,.8,1])assert(Number.isFinite(detailBlend(400,q)));
assert.equal(deviceDetail({memory:2,cores:8}),0);assert.equal(deviceDetail({memory:8,cores:8}),2);
const a=fogTarget({biome:'llanura',seconds:0}),b=fogTarget({biome:'cueva',storm:1,lamp:0,seconds:300});let previous=a;
for(let i=0;i<240;i++){const next=blendFog(previous,b,1/60);assert(Math.abs(next.radius-previous.radius)<3);assert(Math.abs(next.density-previous.density)<.02);previous=next;}
assert(Math.abs(previous.radius-b.radius)<2);
const before=fogTarget({seconds:599.999}),after=fogTarget({seconds:600.001});assert(Math.abs(before.day-after.day)<.001,'day/night wraps continuously');
const cells=preloadCells(-1,-1,900,390,844);assert(cells.some(([x,y])=>x===0&&y===0));assert(cells.some(([x,y])=>x===-2&&y===-2));assert(new Set(cells.map(c=>c.join(','))).size===cells.length);assert(cells.length<=36);
assert.equal(visualHash(42,-37,5),visualHash(42,-37,5));assert.notEqual(visualHash(42,-37,5),visualHash(42,-37,6));
assert.equal(DEPTH_PLANES.length,3);const p=planePoint(100,200,0,0,390,844,.28),q=planePoint(100,200,10,0,390,844,.28);assert(Math.abs(p.x-q.x-2.8)<1e-8);
assert.equal(smoothRange(0,1,-1),0);assert.equal(smoothRange(0,1,2),1);
console.log('PASS continuous fog/day/LOD, zero-opacity cutoff, negative-coordinate preload margin, three decor-only parallax planes and independent visual hash');
// Exercise the real lineage renderer, including a bright source at its old cutoff.
const {initialize}=await import('../src/living.js');
let strokes=[];const ctx=new Proxy({globalAlpha:1,stroke(){strokes.push(this.globalAlpha);},fill(){strokes.push(this.globalAlpha);},fillRect(){strokes.push(this.globalAlpha);}},{get:(target,k)=>k in target?target[k]:()=>{}});
const state={wx:0,wy:0};const runtime={S:state,ACH:[],W:390,H:844,cx:ctx,labLiving:'breath-tree',inWorld:()=>true,worldVisibility:{radius:750,day:1},visualDetail:{detailQuality:1}};
initialize(runtime);const o=runtime.livingNear()[0];o.lit=1;
const drawAt=d=>{state.wx=o.x;state.wy=o.y-d;strokes=[];runtime.drawLiving(1000);return Math.max(0,...strokes);};
assert(Math.abs(drawAt(499)-drawAt(501))<.02,'real glyph-to-point transition cannot jump at 500');
assert(drawAt(749.9)<.000001,'even a bright lineage must fade before unloading');
assert.equal(drawAt(750),0);assert.equal(drawAt(751),0);
console.log('PASS actual lineage rendering fades bright sources and blends the former 500px cutoff');

const red=fogTarget({tint:[220,35,50]}),blue=fogTarget({tint:[30,60,225]}),tinted=blendFog(red,blue,.05);assert(tinted.red<red.red&&tinted.red>blue.red);assert(tinted.blue>red.blue&&tinted.blue<blue.blue);
