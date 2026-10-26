import assert from 'node:assert/strict';
import {normalizeSessions,summarize} from '../src/playtest.js';
const input=[{start:1000,ms:6000,order:['ronda:jardin'],chapters:{'ronda:jardin':{activeMs:5000,firstActionMs:2000,noProgressMs:3000,helps:1,done:true}}}];
const got=normalizeSessions(input);assert.equal(got[0].chapters['ronda:jardin'].helps,1);assert.equal(got[0].chapters['ronda:jardin'].firstActionMs,2000);assert.match(summarize(got),/Jardín · ronda/);assert.match(summarize(got),/primer avance 0:02/);assert.match(summarize(got),/ayuda 1/);
const old=normalizeSessions([{start:1,order:['bosque'],chapters:{bosque:{ms:6000}}}]);assert.equal(old[0].chapters.bosque.firstActionMs,null);assert.equal(old[0].chapters.bosque.activeMs,0);assert.equal(normalizeSessions([{start:1,order:['unknown'],chapters:{unknown:{}}}])[0].order.length,0);
console.log('PASS opt-in observations: eleven place rounds, first progress, active/stalled time, explicit help and compatible old notes');
// A resumed save is the baseline, not an action made in this session.
const {initialize,CHAPTER_NAMES}=await import('../src/playtest.js');
const oldEnv={document:globalThis.document,location:globalThis.location,localStorage:globalThis.localStorage,setInterval:globalThis.setInterval,now:performance.now};
let clock=0;performance.now=()=>clock;const db=new Map();globalThis.localStorage={getItem:k=>db.get(k),setItem:(k,v)=>db.set(k,v)};globalThis.location={search:'?prueba=1'};globalThis.setInterval=()=>0;globalThis.document={hidden:false,querySelector:()=>null,addEventListener(){}};
try {
 let progress=.4,round=null;const r={S:{},journeyQuiet:()=>true,journeyChapter:()=>({id:'llanura'}),journeyGameProgress:()=>progress,placeRun:()=>round};initialize(r);clock=1000;r.playtestTick();assert.equal(r.playtest().current.chapters.llanura.firstActionMs,null,'saved40% is not a fresh action');
 progress=.5;clock=2000;r.playtestTick();assert.equal(r.playtest().current.chapters.llanura.firstActionMs,2000);
 r.journeyQuiet=()=>false;progress=0;
 for(const key of Object.keys(CHAPTER_NAMES).filter(k=>k.startsWith('ronda:'))){round={id:key.slice(6)};clock+=1000;r.playtestTick();round=null;clock+=1000;r.playtestTick();}
 r.journeyQuiet=()=>true;r.journeyChapter=()=>({id:'camino'});r.S.pathCrystals=[];clock+=1000;r.playtestTick();r.S.pathCrystals.push('first');clock+=1000;r.playtestTick();assert(r.playtest().current.chapters.camino.firstActionMs!==null,'Camino measures real crystal progress');
 const session=r.playtest().current;assert(session.order.length>20);assert.match(summarize([session]),/Cueva · ronda/,'every place remains in the report after return transitions');
}finally{performance.now=oldEnv.now;for(const key of ['document','location','localStorage','setInterval']){if(oldEnv[key]===undefined)delete globalThis[key];else globalThis[key]=oldEnv[key];}}
