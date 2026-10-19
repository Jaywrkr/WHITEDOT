import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {cloudConfig,createCloudClient} from '../src/cloud-client.js';
import {createCloudSync} from '../src/cloud-sync.js';
const config={url:'https://fixture.supabase.co',publishableKey:'sb_publishable_fixture'};
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k),m};};
assert.equal(cloudConfig({}),null);assert.throws(()=>cloudConfig({...config,url:'http://evil.test'}));assert.throws(()=>cloudConfig({...config,publishableKey:'service_role_secret'}));
let now=100000,refreshes=0,writes=0,online=true,requests=[],responseUser='one';const storage=memory();
const session=()=>({access_token:'access-'+responseUser,refresh_token:'refresh-'+responseUser,expires_in:120,user:{id:responseUser,email:'fixture@example.test'}});
const fetcher=async(url,options)=>{requests.push({url,options});if(!online)throw Error('offline');let data={};
 if(url.includes('grant_type=refresh_token')){refreshes++;data=session();}
 else if(url.includes('/token?')||url.includes('/verify'))data=session();
 else if(url.includes('/signup'))data={user:{id:'new'}};
 else if(url.includes('/kubono_saves?'))data=[];
 else if(url.includes('/rpc/kubono_save')){writes++;data={ok:true,revision:1};}
 return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});};
const client=createCloudClient(config,{fetcher,storage,now:()=>now});assert.equal(client.user(),null);await client.login('fixture@example.test','not-a-real-password');assert.equal(client.user().id,'one');assert(!JSON.stringify([...storage.m]).includes('not-a-real-password'));assert.equal(requests[0].options.credentials,'omit');
now+=70000;await Promise.all([client.read('seed?x=a&b'),client.read('other')]);assert.equal(refreshes,1,'concurrent operations share refresh');assert(requests.some(r=>r.url.includes('seed%3Fx%3Da%26b')));
await client.signup('new@example.test','another-test-password');assert.equal(client.user(),null,'confirmation does not keep a previous account');await client.verify('new@example.test','123456');online=false;await assert.rejects(()=>client.read('main'),/Sin conexión/);await client.logout();assert.equal(client.user(),null);assert.equal(storage.m.size,0);
let remote=null,user={id:'one'},pendingRead=null;const fake={user:()=>user,read:async()=>pendingRead?await pendingRead:structuredClone(remote),write:async(scope,revision,state)=>{writes++;if(revision!==(remote?.revision||0))return {ok:false};remote={state:structuredClone(state),revision:revision+1};return {ok:true,revision:remote.revision};}};
const meta=memory(),messages=[];let local={sparks:42},restored=0;now=200000;const sync=createCloudSync({client:fake,storage:meta,now:()=>now,onStatus:t=>messages.push(t)});
await sync.inspect('world-A');assert.equal(sync.ready,false);await sync.push(()=>local);assert.equal(remote,null,'no automatic first upload');await sync.push(()=>local,{manual:true});assert.equal(remote.state.sparks,42);assert(sync.ready);local={sparks:55};await sync.push(()=>local);assert.equal(remote.state.sparks,42,'minute throttle');now+=60001;await sync.push(()=>local);assert.equal(remote.state.sparks,55);
const before=writes;now+=60001;await sync.push(()=>local);assert.equal(writes,before,'unchanged saves do not upload');remote={state:{sparks:70},revision:remote.revision+1};now+=60001;await sync.push(()=>({sparks:60}));assert.equal(remote.state.sparks,70);assert(!sync.ready,'conflict stops automatic writes');assert.equal(local.sparks,55);
await sync.pull(state=>{restored++;local=state;});assert.equal(local.sparks,70);assert.equal(restored,1);assert(sync.ready);await assert.rejects(()=>sync.pull(()=>{throw Error('invalid world');}),/invalid world/);assert.equal(local.sparks,70);
let resolve;pendingRead=new Promise(r=>resolve=r);const late=sync.inspect('world-A');user={id:'two'};sync.reset();resolve({revision:999,state:{sparks:999}});await assert.rejects(()=>late,/cambió/);assert(!sync.ready);pendingRead=null;
const disabled=createCloudClient({});assert.equal(disabled,null);
console.log('PASS cloud REST: public-key restriction, optional/offline access, no password persistence, single token refresh, account switch, safe initial choice, throttled backups, conflict pause, recovery, stale-response isolation');

const schema=readFileSync(new URL('../supabase/setup.sql',import.meta.url),'utf8');
assert.match(schema,/revoke all on public\.kubono_saves from public, anon, authenticated/);
assert.match(schema,/create function kubono_private\.kubono_delete_account\(\) returns void language plpgsql security definer/);
assert.match(schema,/create function public\.kubono_delete_account\(\) returns void language sql security invoker/);
assert.match(schema,/revoke all on function public\.rls_auto_enable\(\) from public,anon,authenticated/);

// A new adapter/browser tab resumes the existing persistent token, without a password.
const persistent=memory();const first=createCloudClient(config,{fetcher,storage:persistent,now:()=>now});online=true;responseUser='persistent';await first.login('fixture@example.test','private-fixture-password');
const reopened=createCloudClient(config,{fetcher,storage:persistent,now:()=>now});assert.equal(reopened.user().id,'persistent');assert(!JSON.stringify([...persistent.m]).includes('private-fixture-password'));
await first.logout();assert.equal(reopened.user(),null,'sign-out propagates to other tabs');
console.log('PASS persistent login: reopen without password and shared-storage sign-out');

// A refresh finishing after another tab signs out must not revive the session.
await first.login('fixture@example.test','private-fixture-password');now+=120001;
let finishRefresh;const pendingRefresh=new Promise(r=>finishRefresh=r);
const lateClient=createCloudClient(config,{storage:persistent,now:()=>now,fetcher:async(url,options)=>{if(url.includes('grant_type=refresh_token'))await pendingRefresh;return fetcher(url,options);}});
const lateRead=lateClient.read('world');await reopened.logout();finishRefresh();await assert.rejects(lateRead,/cambió/);assert.equal(lateClient.user(),null);
await first.login('fixture@example.test','private-fixture-password');persistent.setItem('kubono:auth:'+config.url,'invalid JSON');assert.equal(first.user(),null,'corrupt persisted credentials must not remain authenticated');
console.log('PASS persistent auth: late refresh cannot revive logout; corrupt credentials rejected');
