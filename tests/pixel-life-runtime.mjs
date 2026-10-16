import assert from 'node:assert/strict';import {initialize} from '../src/pixel-life.js';
import {inhabitantPractice,inhabitantVoice,pixelColony,PIXEL_CELL} from '../src/pixel-life-model.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
let modal=false,balance=0,draws=0;const listeners=new Map(),pointerListeners=new Map(),queue=[],emitted=[];
globalThis.document={hidden:false,querySelector:()=>modal?{}:null};globalThis.matchMedia=()=>({matches:false});globalThis.addEventListener=(name,fn)=>listeners.set(name,fn);globalThis.localStorage={getItem:()=>null,setItem(){}};
const r={};data(r);progress(r);world(r);r.S.mode='world';r.S.sound=true;r.S.reducedMotion=false;
r.cx=new Proxy({save(){balance++;},restore(){balance--;}},{get:(o,k)=>k in o?o[k]:(...args)=>{for(const v of args)if(typeof v==='number')assert(Number.isFinite(v));draws++;}});
Object.assign(r,{W:390,H:844,cv:{addEventListener:(k,f)=>pointerListeners.set(k,f),getBoundingClientRect:()=>({left:10,top:20,width:390,height:844})},ac:{state:'running'},MU:{step:0},worldVisibility:{radius:650},body:{jump:false},beatSoon:fn=>queue.push(fn),playVoice:(...args)=>(emitted.push(args),true),getVoice:(kind,d,o)=>inhabitantVoice(o,d,r.GEN),musicInk:()=> '#bddbe0'});
initialize(r);const p=inhabitantPractice(r);r.S.wx=p.x;r.S.wy=p.y-80;const save=JSON.stringify(r.S);r.inhabitantTick(.05);const o=r.inhabitantsNear(300).find(o=>o.id===p.id);assert(o);r.drawInhabitants();assert(draws>10&&balance===0);
// A tap uses CSS-to-canvas coordinates, not a hidden button or full-screen pulse.
const event={isPrimary:true,pointerId:1,clientX:10+r.W/2+o.x-r.S.wx,clientY:20+r.H/2+o.y-r.S.wy};pointerListeners.get('pointerdown')(event);listeners.get('pointerup')(event);r.inhabitantTick(.05);assert(o.lit>.8&&queue.length===1);queue.shift()(2);assert(emitted[0][0]==='habitante'&&emitted[0][2]===2&&emitted[0][7]==='player');
assert(!r.inhabitantTouch(o),'held/repeated touch has a cooldown');
const before=r.inhabitantState.seconds,pos=[o.x,o.y];modal=true;r.inhabitantTick(10);assert.equal(r.inhabitantState.seconds,before);assert.deepEqual([o.x,o.y],pos);modal=false;
r.S.reducedMotion=true;for(let i=0;i<30;i++)r.inhabitantTick(.05);assert.deepEqual([o.x,o.y],pos);r.S.reducedMotion=false;
for(const q of r.inhabitantsNear(700).slice(0,6))r.inhabitantTouch(q);assert(queue.length<=1,'at most two musical responses per bar');while(queue.length)queue.shift()(3);
const saved=JSON.stringify(r.S);assert.equal(saved,save,'ephemeral life does not rewrite player progress');
// Travel far through the world: neither colonies nor travellers grow unbounded.
for(let i=0;i<150;i++){r.S.wx=i*700;r.S.wy=i*300;r.inhabitantTick(.05);r.drawInhabitants();assert(r.inhabitantState.cache<=64&&r.inhabitantState.travellers<=6);assert(r.inhabitantsNear(700).length<=24);}
const next=inhabitantPractice(r,'traveller');r.S.wx=next.x;r.S.wy=next.y-80;r.inhabitantTick(.05);assert(r.inhabitantsNear().some(o=>o.kind==='viajero'));
const pending=r.inhabitantsNear()[0];r.MU.step=16;r.inhabitantTouch(pending);const count=emitted.length;r.S={...r.S};r.inhabitantTick(0);while(queue.length)queue.shift()(10);assert.equal(emitted.length,count,'old scheduled voices cannot leak into a replacement save');assert.equal(r.inhabitantState.seconds,0);assert.equal(balance,0);
console.log('PASS actual inhabitant integration: tap, contact, musical queue, motion/modal pause, untouched saves, replacement ownership and bounded drawing/cache');
