import assert from 'node:assert/strict';
import {initialize as interactions} from '../src/interactions.js';
import {initialize as data} from '../src/data.js';
// The World's small life seen from above (docs/UNIVERSO.md): no stems rising from a ground line. Every plant kind draws
// a form centred on its place, as tall above as below.
const pts=[];const rec=(x,y)=>pts.push([x,y]);
const cx=new Proxy({},{get:(o,k)=>k in o?o[k]:k==='fillRect'?(x,y,w,h)=>{rec(x,y);rec(x+w,y+h);}:k==='moveTo'||k==='lineTo'?(x,y)=>rec(x,y):k==='arc'?(x,y,r)=>{rec(x-r,y-r);rec(x+r,y+r);}:()=>{},set:(o,k,v)=>{o[k]=v;return true;}});
globalThis.document={getElementById:()=>({}),querySelectorAll:()=>[],addEventListener(){}};globalThis.window=globalThis;globalThis.addEventListener=()=>{};
const r={cx,S:{},$:()=>({addEventListener(){},classList:{toggle(){}},style:{}}),musicInk:()=>'#fff'};
try{interactions(r);}catch(e){}
assert(typeof r.drawPlant==='function','drawPlant available');
for(const t of ['hierba','flor','arbusto','helecho','junco','coral']){pts.length=0;r.drawPlant({pt:{t,hue:120,pet:5},h:30,ph:.4,sw:0,lit:0,personality:null},100,100,0,0);
 assert(pts.length,t+' draws');const ys=pts.map(p=>p[1]-100),up=-Math.min(...ys),down=Math.max(...ys);assert(up<16&&down<16,`${t} stays near its place (${up},${down})`);assert(Math.abs(up-down)<8,`${t} is centred, not a stem (${up} up, ${down} down)`);}
// No living thing of the Earth in the names the World shows for its life and its drums.
const d={};data(d);
const EARTH=/(?<!\p{L})(árbol|árboles|luciérnagas?|bandadas?|pájaros?|flor|flores|matas?|pilar|pilares|lotos?|agua|ruinas|jardín|jardinero)(?!\p{L})/iu;
for(const [,name,text] of d.SPECIES)assert(!EARTH.test(name)&&!EARTH.test(text),name);
for(const [k,v] of Object.entries(d.SAMPLES))assert(!EARTH.test(v),k+': '+v);
for(const id of ['bandada1','bandadaAmiga','formacion','flor1','jardinVivo','faro','banda','jardinero','tambor','vuelo','ballena','insistente']){const a=d.ACH.find(x=>x[0]===id);assert(a,id);assert(!EARTH.test(a[1])&&!EARTH.test(a[2]),id+': '+a[1]+' · '+a[2]);assert(!EARTH.test(d.VOZ[id]||''),id+' voice: '+d.VOZ[id]);}
console.log('PASS universe cleanup: every plant kind draws centred on its place seen from above, and the names of life, drums and their moments carry no word of the Earth');
