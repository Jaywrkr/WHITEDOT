import assert from 'node:assert/strict';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
import {choosePracticePlace,normalizePracticeTravel,practiceSoundIdentity,initialize} from '../src/practice-travel.js';
const records=new Map();globalThis.localStorage={getItem:k=>records.get(k)||null,setItem:(k,v)=>records.set(k,v)};
const buttons={bJump:{hidden:true,disabled:false},bJumpBack:{hidden:true,disabled:false},mMenu:{hidden:true}};
globalThis.document={querySelector:()=>null,getElementById:id=>buttons[id]};const interval=globalThis.setInterval;globalThis.setInterval=()=>0;
try{
 const r={};data(r);progress(r);world(r);r.$=id=>buttons[id];r.S.mode='world';r.MU={};r.waves=[];r.hud=()=>{};r.toast=()=>{};
 const genres=new Set(),regions=new Set();for(let i=0;i<30;i++){const p=choosePracticePlace(r,r.rng(r.seedOf('travel-unit:'+i)));assert(p&&p.score>=10&&p.layer==='superficie');assert(!p.region.sea);genres.add(p.region.genre);regions.add(p.region.key);}
 assert(genres.size>5&&regions.size>20);
 r.S.ach.kept='2026-10-14';r.S.cat.kept=true;const point={x:r.S.wx,y:r.S.wy,layer:r.S.layer||'superficie'};let refuseSave=false,saveCalls=0,failAt=0;const proxy=new Proxy(r,{get:(o,k)=>k==='save'?()=>{if(refuseSave||++saveCalls===failAt)return false;return o.save();}:Reflect.get(o,k)});initialize(proxy);
 assert.equal(r.jumpPracticePlace(),true);assert(Math.hypot(r.S.wx-point.x,r.S.wy-point.y)>900);assert.deepEqual(r.S.practiceTravel.previous,point);assert(r.S.cat.kept&&r.S.ach.kept);
 assert.equal(r.returnPracticePlace(),true);assert.equal(r.S.wx,point.x);assert.equal(r.S.wy,point.y);assert.equal(r.S.layer,point.layer);
 assert.equal(r.S.practiceTravel.recent.length,1);assert.equal(normalizePracticeTravel({previous:{x:Infinity,y:0,layer:'cielo'}}).previous,null);
 assert.equal(normalizePracticeTravel({recent:Array(99).fill('a')}).recent.length,8);
 for(const key of ['setRecording','scanning']){r[key]=true;assert.equal(r.jumpPracticePlace(),false);assert.equal(r.returnPracticePlace(),false);assert.equal(r.S.wx,point.x);r[key]=false;}
 r.jam={loop:{armed:true}};assert.equal(r.jumpPracticePlace(),false);assert.equal(r.returnPracticePlace(),false);r.jam.loop.armed=false;
 refuseSave=true;
 assert.equal(r.jumpPracticePlace(),false);assert.equal(r.S.wx,point.x);refuseSave=false;
 const beforeFailure=JSON.stringify({x:r.S.wx,y:r.S.wy,layer:r.S.layer,travel:r.S.practiceTravel});failAt=saveCalls+2;
 assert.equal(r.travelPracticePoint({x:12000,y:-500,layer:'cielo'}),false);
 assert.equal(JSON.stringify({x:r.S.wx,y:r.S.wy,layer:r.S.layer,travel:r.S.practiceTravel}),beforeFailure,'second-write failure rolls back the entire travel before any queue or URL changes');
 const raw={version:1,extra:{kept:true},previous:{x:3,y:4,layer:'cielo',future:'kept'},sounds:Array(10).fill('timbre')};const norm=normalizePracticeTravel(raw);assert.equal(norm.sounds.length,8);assert.deepEqual(norm.extra,raw.extra);assert.equal(norm.previous.future,'kept');
 const p=choosePracticePlace(r,r.rng(r.seedOf('sound-history'))),key=practiceSoundIdentity(p.band),again=choosePracticePlace(r,r.rng(r.seedOf('sound-history')),[],false,[key]);assert(practiceSoundIdentity(again.band)!==key,'recent timbres alter destination selection rather than maps');
 const future={version:8,previous:point,future:{raw:true}};assert.equal(normalizePracticeTravel(future),future);r.S.practiceTravel=future;assert.equal(r.jumpPracticePlace(),false);assert.equal(r.returnPracticePlace(),false);assert.equal(r.travelPracticePoint({x:1,y:2,layer:'superficie'}),false);assert.deepEqual(r.S.practiceTravel,future);
 console.log('PASS contrasting populated destinations, bounded history, exact coordinate/layer return, progress preservation and blocked travel on save failure');
}finally{globalThis.setInterval=interval;}
