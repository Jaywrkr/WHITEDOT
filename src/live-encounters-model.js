// Living encounters (Jay, 27 Oct 2026; docs/HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos): something to chase, flee or do
// in every biome of the free World, in the same world you travel, one at a time. Batch 1 builds the common engine and
// the eleven «perseguir»; batch 2 adds the eleven «huir». A new encounter is one row of data and, at most, one small
// behaviour; a new verb is one rule.
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
// Fleeing: a pulse on time always shields the cube a moment (SHIELD) and helps in its own way; being reached only nudges
// the cube aside for KNOCK seconds at KNOCK_SPEED and ends the encounter without a reward. BODY: the cube's half size.
export const LIVE_SHIELD=1,LIVE_KNOCK=1,LIVE_KNOCK_SPEED=60,LIVE_BODY=6;
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
 {id:'estrella',biome:'vacio',verb:'perseguir',name:'Estrella fugaz',behavior:'shoot',speed:230,life:8,line:'Una estrella fugaz. Toca a tiempo.',bye:'La estrella pasó de largo.'},
 // Batch 2 · huir. speed: the threat's (or its pull's) in units per second; life: seconds it lasts. survive: lasting
 // that long is an escape too; far: getting that far from the threat is one. bye: the kind goodbye when it reaches you.
 {id:'remolino',biome:'llanura',verb:'huir',name:'Remolino de polvo',behavior:'whirl',speed:165,life:14,survive:true,far:520,line:'Un remolino te sigue. Aléjate.',bye:'El remolino te despeinó. Ya pasó.'},
 {id:'enjambre',biome:'bosque',verb:'huir',name:'Enjambre celoso',behavior:'swarm',speed:280,life:15,survive:true,line:'Un enjambre cuida su panal. Vete.',bye:'El enjambre volvió a su panal.'},
 {id:'ola',biome:'lago',verb:'huir',name:'Ola gigante',behavior:'wave',speed:165,life:12,line:'Una ola gigante. Llega al anillo.',bye:'La ola te mojó. Ya pasó.'},
 {id:'derrumbe',biome:'ruinas',verb:'huir',name:'Derrumbe al compás',behavior:'rubble',speed:0,life:10,survive:true,line:'Caen piedras al compás. Esquiva.',bye:'Te cayó polvo encima. Nada más.'},
 {id:'polen',biome:'jardin',verb:'huir',name:'Nube de polen',behavior:'pollen',speed:135,life:11,survive:true,line:'Una nube de polen. Que no te alcance.',bye:'El polen te desvió un poco.'},
 {id:'arena',biome:'dunas',verb:'huir',name:'Tormenta de arena',behavior:'sand',speed:120,life:12,line:'Viene arena. Escóndete tras una piedra.',bye:'La arena te empujó. Ya pasó.'},
 {id:'rayos',biome:'cristales',verb:'huir',name:'Rayos del prisma',behavior:'beams',speed:0,life:10,survive:true,line:'Rayos al compás. Sal de su alcance.',bye:'Un rayo te rozó. Ya pasó.'},
 {id:'ondas',biome:'faros',verb:'huir',name:'Ondas del púlsar',behavior:'rings',speed:110,life:13,line:'Ondas en el beat. Crúzalas a tiempo.',bye:'Una onda te empujó. Ya pasó.'},
 {id:'llamaradas',biome:'tormenta',verb:'huir',name:'Lluvia de llamaradas',behavior:'flares',speed:0,life:12,survive:true,line:'Llueven llamaradas. Sal del círculo.',bye:'Una llamarada te rozó. Ya pasó.'},
 {id:'pozo',biome:'cueva',verb:'huir',name:'Pozo que arrastra',behavior:'well',speed:125,life:14,survive:true,line:'El pozo te arrastra. Sube a tiempo.',bye:'Tocaste fondo. Ya saliste.'},
 {id:'agujero',biome:'vacio',verb:'huir',name:'Agujero negro',behavior:'hole',speed:175,life:14,survive:true,line:'Un agujero negro. Escapa a tiempo.',bye:'El agujero te soltó. Ya pasó.'}
].map(Object.freeze));
const BY_ID=new Map(LIVE_ENCOUNTERS.map(d=>[d.id,d]));
export const liveDefinition=id=>BY_ID.get(id)||null;
// The encounters a biome offers, in the order of the rows (its «perseguir», then its «huir»); the roll picks one of them.
// The controller rolls with the same hash as batch 1 (live:pick:v1): a roll under one half keeps the chase it always
// had, from one half up it is now the biome's «huir». Timing and places do not move. Later batches add rows, never a new engine.
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
// Per kind: caught counts completions (a catch, or an escape when fleeing), onTime those with a pulse on time, escaped
// the ones that ended without a reward, and hit (fleeing only) the times it reached the cube.
export function normalizeLive(raw){
 if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>LIVE_VERSION)return raw;
 const q=plain(raw)?raw:{},kinds={};
 for(const [id,e] of Object.entries(plain(q.kinds)?q.kinds:{}).slice(0,256)){if(!safeKey(id)||!plain(e))continue;kinds[id]={...e,first:typeof e.first==='string'?e.first.slice(0,24):'',caught:count(e.caught),onTime:Math.min(count(e.onTime),count(e.caught)),escaped:count(e.escaped)};if('hit' in e)kinds[id].hit=count(e.hit);}
 return {...q,version:LIVE_VERSION,kinds,count:count(q.count),caught:count(q.caught),earned:count(q.earned)};
}
const TAU=Math.PI*2,dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
const away=(s,p)=>{const dx=s.x-p.x,dy=s.y-p.y;return dx||dy?Math.atan2(dy,dx):s.heading;};
const go=(s,angle,speed,dt)=>{s.heading=angle;s.vx=Math.cos(angle)*speed;s.vy=Math.sin(angle)*speed;s.x+=s.vx*dt;s.y+=s.vy*dt;};
const unit=(s,k)=>hashKey('live:'+k+':'+s.seed);
const toward=(a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy);return l>1e-6?{x:dx/l,y:dy/l}:null;};
const along=(o,u,k)=>({x:o.x+u.x*k,y:o.y+u.y*k});
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
 // Fleeing: the spot ahead only gives the direction (dir) and the seed; each threat places itself.
 if(def.verb==='huir'){s.shield=0;s.drag=null;s.dir={x:Math.cos(s.heading),y:Math.sin(s.heading)};SETUP[def.behavior]?.(s,player,def);s.origin={x:s.x,y:s.y};}
 return s;
}
// Where each threat starts (batch 2). rim: getting out of that circle is safe; safe: reaching that ring is.
const SETUP={
 whirl(s,p){Object.assign(s,along(p,s.dir,240));},
 swarm(s,p){s.hive=along(p,s.dir,230);Object.assign(s,s.hive);s.rim={...s.hive,r:560};s.stun=0;},
 wave(s,p){s.safe={...along(p,s.dir,230),r:44};s.front=along(p,s.dir,-330);Object.assign(s,s.front);s.half=800;s.freeze=0;},
 rubble(s,p){s.x=p.x;s.y=p.y;s.shadows=[];s.fallen=[];},
 pollen(s,p){Object.assign(s,along(p,s.dir,230));s.radius=30;s.shrink=0;s.blow=0;},
 // The storm comes from ahead; behind each of three stones (on the side away from it) there is a shelter.
 sand(s,p){s.front=along(p,s.dir,360);Object.assign(s,s.front);s.half=800;s.stones=[0,1,2].map(i=>{const a=s.heading+(i-1)*2.1+(unit(s,'stone:'+i)-.5)*.6,q=along(p,{x:Math.cos(a),y:Math.sin(a)},110+unit(s,'far:'+i)*90);return {x:q.x,y:q.y,shelter:{...along(q,s.dir,-30),r:26}};});},
 // Three beams turn around the prism, an eighth of a turn on each beat; none starts on the cube.
 beams(s,p){Object.assign(s,along(p,s.dir,200));const base=Math.atan2(p.y-s.y,p.x-s.x)+.6+unit(s,'beam')*.4;s.beams=[0,1,2].map(i=>base+i*TAU/3);s.angles=s.beams.slice();s.spin=unit(s,'spin')<.5?1:-1;s.turns=0;s.length=360;s.rim={x:s.x,y:s.y,r:360};},
 rings(s,p){Object.assign(s,along(p,s.dir,240+unit(s,'core')*60));s.safe={x:s.x,y:s.y,r:38};const r0=20+unit(s,'ring')*60;s.rings=[{r:r0},{r:r0+110}];},
 flares(s,p){s.x=p.x;s.y=p.y;s.rim={x:p.x,y:p.y,r:260};s.flares=[];s.burnt=[];s.pp={x:p.x,y:p.y};s.v={x:0,y:0};},
 well(s,p){Object.assign(s,along(p,s.dir,200));s.rim={x:s.x,y:s.y,r:400};s.jump=0;},
 hole(s,p){Object.assign(s,along(p,s.dir,200));s.rim={x:s.x,y:s.y,r:520};s.jump=0;}
};
// The beat while fleeing: true on the step a new beat starts (the music's phase, or a steady clock without sound).
function beat(s,env){const ph=Number.isFinite(env.beatPhase)?env.beatPhase:(s.age/.55)%1,prev=s.phase;s.phase=ph;if(prev===undefined||!(ph<prev-.5))return false;if(s.beatAt!==undefined)s.beatLen=Math.max(.25,Math.min(1.2,s.age-s.beatAt));s.beatAt=s.age;s.beats=(s.beats||0)+1;return true;}
// What lands on a beat: true if it lands on the cube.
const land=(list,s,p,into)=>{let hit=false;for(let i=list.length-1;i>=0;i--){const q=list[i];if(q.land>s.beats)continue;if(dist(q,p)<q.r+LIVE_BODY)hit=true;into.push({x:q.x,y:q.y,r:q.r,at:s.age});list.splice(i,1);}if(into.length>8)into.splice(0,into.length-8);return hit;};
const pull=(s,p,g)=>{const u=toward(p,s);s.drag=u?{x:u.x*g,y:u.y*g}:null;};
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
 shoot(s,p,dt,d,k){go(s,s.heading,d.speed*k,dt);s.trail.push({x:s.x,y:s.y});if(s.trail.length>10)s.trail.shift();},
 // Batch 2 · huir: each moves its threat one step and says whether it reached the cube.
 // The dust whirl follows you, a little faster as it grows, never as fast as the cube.
 whirl(s,p,dt,d){if(s.age<.8)return false;go(s,Math.atan2(p.y-s.y,p.x-s.x)+Math.sin(s.age*2.3)*.25,Math.min(d.speed,120+s.age*8),dt);return dist(s,p)<28;},
 // The swarm darts at where you were, rests, darts again; outside its territory it lets you go.
 swarm(s,p,dt,d){if(s.age<1){s.vx=s.vy=0;return false;}if(s.stun>0){s.stun-=dt;go(s,Math.atan2(s.hive.y-s.y,s.hive.x-s.x),200,dt);return false;}
  if((s.age-1)%1<.6){if(!s.darting){s.aim=Math.atan2(p.y-s.y,p.x-s.x);s.darting=true;}go(s,s.aim,d.speed,dt);}else{s.darting=false;go(s,Math.atan2(p.y-s.y,p.x-s.x),30,dt);}return dist(s,p)<24;},
 // The giant wave comes from behind as a long front; a pulse on time as it passes lets you through it.
 wave(s,p,dt,d){if(s.freeze>0)s.freeze-=dt;else if(s.age>.6){s.front.x+=s.dir.x*d.speed*dt;s.front.y+=s.dir.y*d.speed*dt;}s.x=s.front.x;s.y=s.front.y;
  const ahead=(p.x-s.front.x)*s.dir.x+(p.y-s.front.y)*s.dir.y,side=Math.abs((p.y-s.front.y)*s.dir.x-(p.x-s.front.x)*s.dir.y);if(ahead>0||side>=s.half)return false;if(s.shield>0)s.passed=true;return !s.passed;},
 // Stones fall on the beat: each shadow shows two beats before, one where you are and one beside you.
 rubble(s,p,dt,d,k,env){s.x=p.x;s.y=p.y;if(!beat(s,env)||s.age<.5)return false;const hit=land(s.shadows,s,p,s.fallen),n=s.beats,a=unit(s,'rock:'+n)*TAU,r=60+unit(s,'reach:'+n)*90;
  s.shadows.push({x:p.x,y:p.y,r:30,land:n+2,at:s.age},{x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r,r:30,land:n+2,at:s.age});return hit;},
 // The pollen cloud drifts after you and grows; if it reaches you it pushes you aside.
 pollen(s,p,dt,d){s.radius=Math.max(20,Math.min(85,30+s.age*5)-s.shrink);if(s.blow>0){s.blow-=dt;go(s,s.blowDir,480,dt);return false;}if(s.age<.8)return false;go(s,Math.atan2(p.y-s.y,p.x-s.x)+Math.sin(s.age*1.3)*.35,d.speed,dt);return dist(s,p)<s.radius+LIVE_BODY;},
 // The sandstorm's front comes from ahead; when it passes you, you are safe if you are behind a stone (or shielded).
 sand(s,p,dt,d){if(s.age>1){s.front.x-=s.dir.x*d.speed*dt;s.front.y-=s.dir.y*d.speed*dt;}s.x=s.front.x;s.y=s.front.y;if(s.passed)return false;
  const ahead=(s.front.x-p.x)*s.dir.x+(s.front.y-p.y)*s.dir.y;if(ahead>0)return false;s.passed=true;s.win=s.shield>0||s.stones.some(q=>dist(q.shelter,p)<=q.shelter.r);return !s.win;},
 // The prism's beams turn an eighth of a turn on each beat, quickly; crossing one, or being swept, reaches you.
 beams(s,p,dt,d,k,env){const b=beat(s,env);if(s.age<1.4)return false;if(b){s.turns++;s.sweepAt=s.age;}
  const e=s.turns?Math.min(1,(s.age-s.sweepAt)/(.35*(s.beatLen||.5))):0,turn=s.spin*Math.PI/4*(s.turns?s.turns-1+e:0),prev=s.angles;s.angles=s.beams.map(a=>a+turn);
  const r=dist(p,s);if(r>s.length||r<10)return false;const phi=Math.atan2(p.y-s.y,p.x-s.x),margin=Math.atan2(LIVE_BODY+6,r);
  return s.angles.some((a,i)=>{const from=wrap(phi-prev[i])*s.spin,sweep=Math.abs(wrap(a-prev[i]));return from>=-margin&&from<=sweep+margin;});},
 // The pulsar sends a ring every two beats and drifts slowly toward you; a ring is bright, and reaches you, on the beat.
 // Reach its core.
 rings(s,p,dt,d,k,env){if(beat(s,env)&&s.beats%2===0)s.rings.push({r:12});const u=toward(s,p);if(u&&dist(s,p)>60){s.x+=u.x*20*dt;s.y+=u.y*20*dt;s.safe.x=s.x;s.safe.y=s.y;}const rp=dist(p,s),danger=s.age>=.8&&(s.phase??1)<.25,last=s.lastR??rp;s.lastR=rp;let hit=false;
  for(const q of s.rings){const was=last-q.r;q.r+=d.speed*dt;if(danger&&(was>0)!==(rp-q.r>0)&&rp>s.safe.r)hit=true;}s.rings=s.rings.filter(q=>q.r<520);return hit;},
 // Flares strike on the beat where they were marked one beat before: one where you are heading, two around you.
 flares(s,p,dt,d,k,env){if(dt>0){const k2=Math.min(1,dt*6);s.v.x+=((p.x-s.pp.x)/dt-s.v.x)*k2;s.v.y+=((p.y-s.pp.y)/dt-s.v.y)*k2;}s.pp={x:p.x,y:p.y};if(!beat(s,env)||s.age<.6)return false;
  const hit=land(s.flares,s,p,s.burnt),n=s.beats,L=(s.beatLen||.5)*.5;s.flares.push({x:p.x+s.v.x*L,y:p.y+s.v.y*L,r:30,land:n+1,at:s.age});
  for(let i=0;i<2;i++){const a=unit(s,'flare:'+n+':'+i)*TAU,r=40+unit(s,'spread:'+n+':'+i)*110;s.flares.push({x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r,r:30,land:n+1,at:s.age});}return hit;},
 // The well pulls you down, harder near the bottom and as it deepens; a pulse on time jumps you up.
 well(s,p,dt,d){const r=dist(p,s);if(s.jump>0){s.jump-=dt;pull(s,p,-320);return false;}const ramp=s.age<.6?0:Math.min(1,.4+(s.age-.6)*.3);pull(s,p,ramp*d.speed*Math.max(.5,Math.min(3,220/Math.max(r,1))));return r<26;},
 // The black hole pulls harder the closer you are; pulses on time push you out.
 hole(s,p,dt,d){const r=dist(p,s);if(s.jump>0){s.jump-=dt;pull(s,p,-400);return false;}const ramp=s.age<.8?0:Math.min(1,.5+(s.age-.8)*.25);pull(s,p,ramp*d.speed*Math.min(2.4,Math.pow(200/Math.max(r,1),1.5)));return r<30;}
};
// What a pulse on time does while fleeing, besides shielding the cube a moment: it undoes the whirl, scatters the
// swarm, holds the wave, blows the pollen away and jumps you up out of the well or the black hole.
const HELP={
 whirl:(s,p,w)=>dist(s,w)<=180?'safe':'',
 swarm(s,p,w){if(dist(s,w)<=300)s.stun=1;},
 wave(s){s.freeze=1;},
 pollen(s,p,w){if(dist(s,w)<=220){s.blow=.2;s.blowDir=away(s,w);s.shrink=Math.min(40,s.shrink+12);}},
 well(s){s.jump=.25;},hole(s){s.jump=.25;}
};
// Where to go while fleeing (the arrow by the cube): the safe ring, the nearest shelter, out of the circle, away from the
// threat, or the clearest spot among the falling stones.
export function liveGoal(s,p){
 if(!s||s.verb!=='huir')return s?{x:s.x,y:s.y}:null;
 if(s.safe)return {x:s.safe.x,y:s.safe.y};
 if(s.stones)return s.stones.map(q=>q.shelter).sort((a,b)=>dist(a,p)-dist(b,p))[0];
 const out=c=>{const u=toward(c,p)||s.dir;return along(p,u,120);};
 if(s.rim)return out(s.rim);
 if(s.shadows){const marks=s.shadows,score=q=>Math.min(1e9,...marks.map(m=>dist(m,q)));let best=null,bestScore=-1;for(let i=0;i<8;i++){const a=(s.goalAngle??0)+i*TAU/8,q=along(p,{x:Math.cos(a),y:Math.sin(a)},90),v=score(q)-(i?8:0);if(v>bestScore){best=q;bestScore=v;s.pick=a;}}s.goalAngle=s.pick;return best;}
 return out(s);
}
export const LIVE_BEHAVIORS=Object.freeze(Object.keys(BEHAVIORS));
// The verbs' rules. perseguir: touch it or pulse on time near it; it gets away if you fall far behind, its time runs out
// or it reaches its goal. huir and hacer (batches 2 and 3) add their rule here and reuse the same stages and rewards.
const VERB_RULES={
 perseguir(s,p,env,d,reached){
  if(!s.hidden)for(const w of env.pulses||[]){if(!w.beat)continue;const r=dist(s,w);if(r<=LIVE_PULSE_CATCH){s.onTime=true;return 'caught';}if(r<=LIVE_PULSE_HOLD)s.hold=LIVE_HOLD_SECONDS;}
  if(!s.hidden&&dist(s,p)<=LIVE_TOUCH)return 'caught';
  if(reached||s.age>=d.life||dist(s,p)>LIVE_FAR)return 'escaped';
  return '';
 },
 // huir: reached without a shield is a soft «hit» (no reward, a short nudge); safe when you reach the ring, leave the
 // circle, get far enough, or last its time when lasting is enough; it simply ends if its time runs out otherwise.
 huir(s,p,env,d,hit){
  if(hit&&!(s.shield>0)){const u=toward(s,p)||{x:Math.cos(unit(s,'knock')*TAU),y:Math.sin(unit(s,'knock')*TAU)},side=d.behavior==='pollen';s.drag={x:(side?-u.y:u.x)*LIVE_KNOCK_SPEED,y:(side?u.x:u.y)*LIVE_KNOCK_SPEED};return 'hit';}
  s.drag=s.drag&&['well','hole'].includes(d.behavior)?s.drag:null;
  if(s.win||s.safe&&dist(p,s.safe)<=s.safe.r||s.rim&&dist(p,s.rim)>=s.rim.r||d.far&&dist(p,s)>=d.far)return 'safe';
  if(s.age>=d.life)return d.survive?'safe':'escaped';
  if(dist(s,p)>LIVE_FAR*1.5)return 'escaped';
  return '';
 }
};
// Before the step: pulses heard while fleeing. Any on time shields the cube and counts for the 15 ✦; some also help more.
const VERB_PRE={
 huir(s,p,env,d){for(const w of env.pulses||[]){if(!w.beat)continue;s.onTime=true;s.shield=LIVE_SHIELD;const r=HELP[d.behavior]?.(s,p,w,d);if(r)return r;}return '';}
};
const WIN=new Set(['caught','safe']),LOSE=new Set(['escaped','hit']);
export const liveWon=s=>!!s&&WIN.has(s.result);
export const liveLost=s=>!!s&&LOSE.has(s.result);
// One step: dt in seconds (bounded), the cube's position and the pulses heard since the last step ({x,y,beat}).
export function stepLive(s,player,dt,env={}){
 dt=Math.max(0,Math.min(.05,dt||0));const d=liveDefinition(s.kind);if(!d)return s;
 if(s.stage!=='run'){s.over+=dt;if(s.stage==='escaped'&&d.verb==='perseguir'){s.x+=Math.cos(s.heading)*60*dt;s.y+=Math.sin(s.heading)*60*dt;}if(s.drag&&!(s.stage==='hit'&&s.over<LIVE_KNOCK))s.drag=null;return s;}
 s.age+=dt;const held=s.hold>0;s.hold=Math.max(0,s.hold-dt);if(s.shield>0)s.shield=Math.max(0,s.shield-dt);
 let result=VERB_PRE[d.verb]?.(s,player,env,d)||'';
 if(!result){const reached=!!BEHAVIORS[d.behavior]?.(s,player,dt,d,held?.2:1,env);result=VERB_RULES[d.verb]?.(s,player,env,d,reached);}
 if(result){s.stage=result;s.result=result;s.over=0;if(result!=='hit')s.drag=null;if(result==='caught'){s.vx=s.vy=0;}}
 return s;
}
export const liveFinished=s=>!!s&&s.stage!=='run'&&s.over>=LIVE_FAREWELL;
export const liveReward=s=>liveWon(s)?(s.onTime?LIVE_REWARD.onTime:LIVE_REWARD.base):0;
// Shortcut for tests (docs/MUNDO.md#herramientas-de-prueba): «?encuentro=polilla» forces that encounter soon.
export function liveForced(search=globalThis.location?.search){try{const id=new URLSearchParams(search||'').get('encuentro');return BY_ID.has(id)?id:null;}catch(_){return null;}}
