import assert from 'node:assert/strict';
import {createCloudSync,cloudStateKey} from '../src/cloud-sync.js';
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)};};
let remote=null,writes=0,gate=null,time=200000;
const client={user:()=>({id:'owner'}),read:async()=>{if(gate)await gate;return structuredClone(remote);},write:async(scope,revision,state)=>{if(revision!==(remote?.revision||0))return {ok:false};writes++;remote={revision:revision+1,state:structuredClone(state)};return {ok:true,revision:remote.revision};}};
function device(storage=memory()){
 let local={sparks:0,earned:0,spent:0},backup=null;const messages=[];
 const sync=createCloudSync({client,storage,now:()=>time,onStatus:x=>messages.push(x)});
 return {sync,storage,messages,get state(){return local;},set state(v){local=v;},get backup(){return backup;},snapshot:()=>structuredClone(local),restore:s=>{backup=structuredClone(local);local=structuredClone(s);}};
}
const a=device(),b=device();await a.sync.inspect('world');a.state={sparks:24,earned:24,spent:0};await a.sync.push(a.snapshot,{manual:true});
await b.sync.inspect('world');assert.equal(await b.sync.reconcile(b.snapshot,b.restore),false,'unknown local save needs initial choice');await b.sync.pull(b.restore);
a.state={sparks:29,earned:29,spent:0};await a.sync.push(a.snapshot,{force:true});
assert.equal(await b.sync.reconcile(b.snapshot,b.restore),true);assert.equal(b.state.sparks,29);assert.equal(b.backup.sparks,24);
b.state={sparks:9,earned:29,spent:20};await b.sync.push(b.snapshot,{force:true});await a.sync.reconcile(a.snapshot,a.restore);assert.equal(a.state.sparks,9,'spending follows to other device too');
// Full close/reopen uses persisted common baseline, not a balance maximum.
const reopened=device(a.storage);reopened.state=structuredClone(a.state);await reopened.sync.inspect('world');b.state={sparks:12,earned:32,spent:20};await b.sync.push(b.snapshot,{force:true});await reopened.sync.reconcile(reopened.snapshot,reopened.restore);assert.equal(reopened.state.sparks,12);
// Both devices advance: neither automatic read nor write may choose a winner.
a.state={sparks:10,earned:30,spent:20};const before=writes;assert.equal(await a.sync.reconcile(a.snapshot,a.restore),false);assert.equal(a.state.sparks,10);assert.equal(remote.state.sparks,12);await a.sync.push(a.snapshot,{force:true});assert.equal(writes,before);
// A local change during the remote read cannot be discarded.
let release;gate=new Promise(r=>release=r);const pending=reopened.sync.reconcile(reopened.snapshot,reopened.restore);reopened.state.sparks=15;release();await pending;gate=null;assert.equal(reopened.state.sparks,15);assert(!reopened.sync.ready);
// Old numeric revision metadata cannot prove that a local save is unchanged.
const legacy=device({getItem:()=>String(remote.revision),setItem(){}});legacy.state={sparks:99};await legacy.sync.inspect('world');await legacy.sync.reconcile(legacy.snapshot,legacy.restore);assert.equal(legacy.state.sparks,99);assert(!legacy.sync.ready);
assert.equal(cloudStateKey({sparks:4,session:{seconds:10},livingSeconds:20}),cloudStateKey({livingSeconds:21,session:{seconds:12},sparks:4}));
assert.notEqual(cloudStateKey({sparks:4}),cloudStateKey({sparks:24}));
console.log('PASS two-device handoff: earned/spent balance, reopen baseline, previous-local backup, divergent progress, in-flight edits and legacy migration');

// Restoration can normalize older state; retain the applied baseline, not raw bytes.
const normalized=device();await normalized.sync.inspect('world');await normalized.sync.pull(s=>{normalized.state={...s,normalized:true};return normalized.snapshot();});
await normalized.sync.reconcile(normalized.snapshot,()=>{throw Error('unchanged revision must not repeatedly restore');});assert(normalized.sync.ready);
let invalid=true;await normalized.sync.reconcile(()=>{if(invalid)throw Error('local storage locked');return normalized.snapshot();},normalized.restore);invalid=false;
await normalized.sync.reconcile(normalized.snapshot,normalized.restore);assert(!normalized.sync.busy,'a failed snapshot cannot lock future sync');
