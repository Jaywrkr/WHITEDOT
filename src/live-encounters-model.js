// Living encounters (Jay, 27 Oct 2026; docs/HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos): something to chase, flee or do
// in every biome of the free World, in the same world you travel, one at a time. Batch 1 builds the common engine and
// the eleven «perseguir». A new encounter is one row of data and, at most, one small behaviour; a new verb is one rule.
// Everything comes from hashKey: no old random sequence is read and nothing on the map moves.
import {hashKey} from './universe-regions.js';
export const LIVE_VERSION=1;
// Paid only on completion, every time: 10 ✦, or 15 ✦ when a pulse on time made the catch.
export const LIVE_REWARD=Object.freeze({base:10,onTime:15});
// One every 60 to 90 seconds of travel (time moving in the free World, never paused or standing in a menu).
export const LIVE_EVERY=Object.freeze({min:60,max:90});
// Where it appears: ahead of the cube, a little to one side.
export const LIVE_AHEAD=Object.freeze({near:280,far:340,side:90});
// Catching: touching it with the cube; a pulse on time near it catches it (CATCH) or holds it still a moment (HOLD).
export const LIVE_TOUCH=26,LIVE_PULSE_CATCH=110,LIVE_PULSE_HOLD=260,LIVE_HOLD_SECONDS=2,LIVE_FAR=720,LIVE_FAREWELL=1.4;
export const LIVE_VERBS=Object.freeze(['perseguir','huir','hacer']);
// Region colours of docs/UNIVERSO.md: the encounter shines in the light of its biome.
export const LIVE_COLORS=Object.freeze({llanura:'#eb9a3c',bosque:'#6fe08a',lago:'#5cc8ff',ruinas:'#a88c6a',jardin:'#ff8fc8',dunas:'#f3e6b0',cristales:'#9ef0e6',faros:'#fff36a',tormenta:'#b48cff',cueva:'#ff4f3a',vacio:'#ffffff'});
// Batch 1 · perseguir. speed in world units per second (the cube walks at 190); life in seconds before it is gone.
// line: the one short line when it appears; bye: the one short line when it gets away.
export const LIVE_ENCOUNTERS=Object.freeze([
 {id:'polilla',biome:'llanura',verb:'perseguir',name:'Polilla de luz',behavior:'flutter',speed:178,life:24,line:'Una polilla de luz. Atrápala.',bye:'La polilla se fue volando.'},
 {id:'racimo',biome:'bosque',verb:'perseguir',name:'Racimo saltarín',behavior:'hop',speed:440,reach:135,life:24,line:'Un racimo salta entre estrellas.',bye:'El racimo saltó lejos.'},
 {id:'pez',biome:'lago',verb:'perseguir',name:'Pez de onda',behavior:'surface',speed:150,life:24,line:'Un pez asoma en las crestas.',bye:'El pez se hundió.'},
 {id:'tambor',biome:'ruinas',verb:'perseguir',name:'Tambor rodante',behavior:'roll',speed:182,life:22,line:'Un tambor rueda cuesta abajo.',bye:'El tambor siguió rodando.'},
 {id:'semilla',biome:'jardin',verb:'perseguir',name:'Semilla traviesa',behavior:'bounce',speed:205,life:22,line:'Una semilla rebota por aquí.',bye:'La semilla rebotó lejos.'},
 {id:'cometa',biome:'dunas',verb:'perseguir',name:'Cometa en el viento',behavior:'kite',speed:140,life:26,line:'Alcanza la cometa antes de la marca.',bye:'La cometa llegó a la marca.'},
 {id:'reflejo',biome:'cristales',verb:'perseguir',name:'Tu reflejo',behavior:'mirror',speed:260,life:24,line:'Tu reflejo huye entre los nodos.',bye:'Tu reflejo se perdió en la malla.'},
 {id:'pulsar',biome:'faros',verb:'perseguir',name:'Púlsar fugaz',behavior:'blink',speed:80,life:24,line:'Un púlsar se apaga y vuelve.',bye:'El púlsar no volvió.'},
 {id:'llamarada',biome:'tormenta',verb:'perseguir',name:'Llamarada viva',behavior:'flare',speed:230,life:24,line:'Una llamarada corre. Se cansa.',bye:'La llamarada se apagó lejos.'},
 {id:'eco',biome:'cueva',verb:'perseguir',name:'Tu eco',behavior:'echo',speed:140,life:26,line:'Tu eco escapa hacia el fondo.',bye:'Tu eco llegó al fondo.'},
 {id:'estrella',biome:'vacio',verb:'perseguir',name:'Estrella fugaz',behavior:'shoot',speed:230,life:8,line:'Una estrella fugaz. Toca a tiempo.',bye:'La estrella pasó de largo.'}
].map(Object.freeze));
const BY_ID=new Map(LIVE_ENCOUNTERS.map(d=>[d.id,d]));
export const liveDefinition=id=>BY_ID.get(id)||null;
// The encounters a biome offers today (batch 1: its «perseguir»); later batches add rows, never a new engine.
export const liveFor=(biome,roll=0)=>{const list=LIVE_ENCOUNTERS.filter(d=>d.biome===biome);return list.length?list[Math.min(list.length-1,Math.floor(Math.max(0,roll)*list.length))]:null;};
// Seconds of travel before the n-th encounter of a world: 60 to 90, from the hash, the same on every replay.
export function liveInterval(scope,n){return LIVE_EVERY.min+(LIVE_EVERY.max-LIVE_EVERY.min)*hashKey('live:every:v1:'+scope+':'+n);}
// A point near and ahead of the cube along its heading (radians), from the hash of the world and the count.
export function liveSpawnPoint(player,heading,scope,n){
 const a=Number.isFinite(heading)?heading:0,far=LIVE_AHEAD.near+(LIVE_AHEAD.far-LIVE_AHEAD.near)*hashKey('live:ahead:v1:'+scope+':'+n),side=(hashKey('live:side:v1:'+scope+':'+n)*2-1)*LIVE_AHEAD.side;
 return {x:player.x+Math.cos(a)*far-Math.sin(a)*side,y:player.y+Math.sin(a)*far+Math.cos(a)*side,seed:Math.floor(hashKey('live:seed:v1:'+scope+':'+n)*4294967296)>>>0};
}
const plain=v=>v&&typeof v==='object'&&!Array.isArray(v);
const count=v=>Number.isSafeInteger(v)&&v>0?Math.min(v,1e9):0;
const safeKey=k=>typeof k==='string'&&k.length>0&&k.length<60&&!['__proto__','constructor','prototype'].includes(k);
// Saves keep what they do not know: unknown kinds (a later batch) stay, a later version is left untouched.
export function normalizeLive(raw){
 if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>LIVE_VERSION)return raw;
 const q=plain(raw)?raw:{},kinds={};
 for(const [id,e] of Object.entries(plain(q.kinds)?q.kinds:{}).slice(0,256)){if(!safeKey(id)||!plain(e))continue;kinds[id]={...e,first:typeof e.first==='string'?e.first.slice(0,24):'',caught:count(e.caught),onTime:Math.min(count(e.onTime),count(e.caught)),escaped:count(e.escaped)};}
 return {...q,version:LIVE_VERSION,kinds,count:count(q.count),caught:count(q.caught),earned:count(q.earned)};
}
const TAU=Math.PI*2,dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
const away=(s,p)=>{const dx=s.x-p.x,dy=s.y-p.y;return dx||dy?Math.atan2(dy,dx):s.heading;};
const go=(s,angle,speed,dt)=>{s.heading=angle;s.vx=Math.cos(angle)*speed;s.vy=Math.sin(angle)*speed;s.x+=s.vx*dt;s.y+=s.vy*dt;};
const unit=(s,k)=>hashKey('live:'+k+':'+s.seed);
// The prism's mesh: a node and its six neighbours.
const meshAround=q=>Array.from({length:7},(_,i)=>i?{x:q.x+Math.cos(i*TAU/6)*170,y:q.y+Math.sin(i*TAU/6)*170}:{x:q.x,y:q.y});
export function createLive(def,point,player,{now=0}={}){
 const s={id:def.id,kind:def.id,biome:def.biome,verb:def.verb,x:point.x,y:point.y,vx:0,vy:0,seed:point.seed>>>0,age:0,hold:0,hidden:false,stage:'run',over:0,onTime:false,result:'',trail:[],hop:0,rest:0,node:0,born:now};
 s.heading=Math.atan2(point.y-player.y,point.x-player.x);s.origin={x:point.x,y:point.y};
 // Behaviour set-up, all from the encounter's own seed.
 if(def.behavior==='roll')s.downhill=s.heading+(unit(s,'downhill')-.5);
 if(def.behavior==='kite'){const a=s.heading+(unit(s,'wind')-.5)*.8,far=700;s.goal={x:point.x+Math.cos(a)*far,y:point.y+Math.sin(a)*far};}
 if(def.behavior==='echo'){const a=s.heading+(unit(s,'well')-.5)*.6,far=640;s.goal={x:point.x+Math.cos(a)*far,y:point.y+Math.sin(a)*far};}
 if(def.behavior==='bounce'){s.heading+=unit(s,'bounce')*TAU;s.arena=230;}
 if(def.behavior==='mirror'){s.nodes=meshAround(point);s.node=0;s.target=null;}
 // The shooting star crosses in front of the cube, across its path.
 if(def.behavior==='shoot'){const side=unit(s,'cross')<.5?1:-1;s.heading=Math.atan2(player.y-point.y,player.x-point.x)+side*Math.PI/2;s.x-=Math.cos(s.heading)*330;s.y-=Math.sin(s.heading)*330;}
 return s;
}
// Small behaviours: each moves the prey one step and may say it reached its goal (it got away) or is hidden.
const BEHAVIORS={
 // The moth flutters away and settles for a moment now and then.
 flutter(s,p,dt,d,k){const rest=s.age%2.6>1.9;go(s,away(s,p)+Math.sin(s.age*3.1)*.9,d.speed*k*(rest?.25:1),dt);},
 // The cluster hops between stars when you come near, then waits.
 hop(s,p,dt,d,k){s.rest-=dt;if(s.hop>0){s.hop-=dt;go(s,s.heading,d.speed*k,dt);return;}s.vx=s.vy=0;if(s.rest<=0&&dist(s,p)<d.reach){s.hopIndex=(s.hopIndex||0)+1;s.heading=away(s,p)+(s.hopIndex%2?.7:-.7);s.hop=.25*Math.pow(.95,s.hopIndex-1);s.rest=.6;}},
 // The wave fish swims a wavy line and only shows on the crests (the beat): hidden in between.
 surface(s,p,dt,d,k,env){const phase=Number.isFinite(env.beatPhase)?env.beatPhase:(s.age/.6)%1;s.hidden=phase>.4;go(s,away(s,p)+Math.sin(s.age*1.7)*.6,d.speed*k,dt);},
 // The drum rolls downhill, faster and faster; it does not dodge: cut it off.
 roll(s,p,dt,d,k){const v=Math.min(d.speed,110+s.age*16);go(s,s.downhill+Math.sin(s.age*5)*.08,v*k,dt);},
 // The seed bounces inside its patch and off the cube.
 bounce(s,p,dt,d,k){if(dist(s,p)<60)s.heading=away(s,p);go(s,s.heading,d.speed*k,dt);const dx=s.x-s.origin.x,dy=s.y-s.origin.y,r=Math.hypot(dx,dy);if(r>s.arena){const n=Math.atan2(dy,dx);s.heading=wrap(Math.PI+2*n-s.heading);s.x=s.origin.x+Math.cos(n)*s.arena;s.y=s.origin.y+Math.sin(n)*s.arena;}},
 // The kite flies with the wind to its mark: reach it before it gets there.
 kite(s,p,dt,d,k){const a=Math.atan2(s.goal.y-s.y,s.goal.x-s.x);go(s,a+Math.sin(s.age*2.2)*.5,d.speed*k,dt);return dist(s,s.goal)<18;},
 // Your reflection runs along the prism's mesh to the node farthest from you and rests there.
 mirror(s,p,dt,d,k){s.rest-=dt;if(!s.target){if(s.rest>0||dist(s,p)>200){s.vx=s.vy=0;return;}const next=s.nodes.map((q,i)=>({i,d:dist(q,p)})).filter(q=>q.i!==s.node).sort((a,b)=>b.d-a.d)[0];s.target=next.i;}
  const q=s.nodes[s.target],l=dist(s,q),step=d.speed*k*dt;if(l<=step||l<1){s.x=q.x;s.y=q.y;s.node=s.target;s.target=null;s.rest=.3;s.vx=s.vy=0;if(s.node){s.nodes=meshAround(q);s.node=0;}return;}go(s,Math.atan2(q.y-s.y,q.x-s.x),d.speed*k,dt);},
 // The pulsar drifts, goes out and lights up again further away.
 blink(s,p,dt,d,k){const t=s.age%1.95,off=t>1.4;if(off&&!s.hidden){s.hidden=true;}else if(!off&&s.hidden){s.hidden=false;s.blinks=(s.blinks||0)+1;const a=away(s,p)+(hashKey('live:blink:'+s.seed+':'+s.blinks)-.5)*1.2;s.x+=Math.cos(a)*150;s.y+=Math.sin(a)*150;}if(!s.hidden)go(s,away(s,p),d.speed*k,dt);},
 // The flare runs fast and erratic, and tires: after a few seconds the cube can catch it.
 flare(s,p,dt,d,k){if(Math.floor(s.age/.5)!==s.turn){s.turn=Math.floor(s.age/.5);s.swerve=(hashKey('live:swerve:'+s.seed+':'+s.turn)-.5)*1.6;}go(s,away(s,p)+s.swerve,(90+(d.speed-90)*Math.exp(-s.age/6))*k,dt);s.trail.push({x:s.x,y:s.y});if(s.trail.length>14)s.trail.shift();},
 // Your echo spirals down to the bottom of the well; once there it is gone.
 echo(s,p,dt,d,k){const a=Math.atan2(s.goal.y-s.y,s.goal.x-s.x);go(s,a+.55,d.speed*k,dt);return dist(s,s.goal)<24;},
 // The shooting star crosses straight and fast: only a pulse on time, or being in its path, catches it.
 shoot(s,p,dt,d,k){go(s,s.heading,d.speed*k,dt);s.trail.push({x:s.x,y:s.y});if(s.trail.length>10)s.trail.shift();}
};
export const LIVE_BEHAVIORS=Object.freeze(Object.keys(BEHAVIORS));
// The verbs' rules. perseguir: touch it or pulse on time near it; it gets away if you fall far behind, its time runs out
// or it reaches its goal. huir and hacer (batches 2 and 3) add their rule here and reuse the same stages and rewards.
const VERB_RULES={
 perseguir(s,p,env,d,reached){
  if(!s.hidden)for(const w of env.pulses||[]){if(!w.beat)continue;const r=dist(s,w);if(r<=LIVE_PULSE_CATCH){s.onTime=true;return 'caught';}if(r<=LIVE_PULSE_HOLD)s.hold=LIVE_HOLD_SECONDS;}
  if(!s.hidden&&dist(s,p)<=LIVE_TOUCH)return 'caught';
  if(reached||s.age>=d.life||dist(s,p)>LIVE_FAR)return 'escaped';
  return '';
 }
};
// One step: dt in seconds (bounded), the cube's position and the pulses heard since the last step ({x,y,beat}).
export function stepLive(s,player,dt,env={}){
 dt=Math.max(0,Math.min(.05,dt||0));const d=liveDefinition(s.kind);if(!d)return s;
 if(s.stage!=='run'){s.over+=dt;if(s.stage==='escaped'){s.x+=Math.cos(s.heading)*60*dt;s.y+=Math.sin(s.heading)*60*dt;}return s;}
 s.age+=dt;const held=s.hold>0;s.hold=Math.max(0,s.hold-dt);
 const reached=!!BEHAVIORS[d.behavior]?.(s,player,dt,d,held?.2:1,env);
 const result=VERB_RULES[d.verb]?.(s,player,env,d,reached);
 if(result){s.stage=result;s.result=result;s.over=0;if(result==='caught'){s.vx=s.vy=0;}}
 return s;
}
export const liveFinished=s=>!!s&&s.stage!=='run'&&s.over>=LIVE_FAREWELL;
export const liveReward=s=>s?.result==='caught'?(s.onTime?LIVE_REWARD.onTime:LIVE_REWARD.base):0;
// Shortcut for tests (docs/MUNDO.md#herramientas-de-prueba): «?encuentro=polilla» forces that encounter soon.
export function liveForced(search=globalThis.location?.search){try{const id=new URLSearchParams(search||'').get('encuentro');return BY_ID.has(id)?id:null;}catch(_){return null;}}
