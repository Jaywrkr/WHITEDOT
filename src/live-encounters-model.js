// Living encounters (Jay, 27 Oct 2026; docs/HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos): something to chase, flee or do
// in every biome of the free World, in the same world you travel, one at a time. Batch 1 builds the common engine and
// the eleven «perseguir»; batch 2 adds the eleven «huir»; batch 3 the eleven «hacer». A new encounter is one row of data
// and, at most, one small behaviour; a new verb is one rule.
// Everything comes from hashKey: no old random sequence is read and nothing on the map moves.
import {hashKey} from './universe-regions.js';
import {UNIVERSE_BASE,DIFFICULTY,RARITY,universeReward} from './spark-rules.js';
export const LIVE_VERSION=1;
// Paid only on completion, every time, by the universe's rule (spark-rules.js, H1, alpha.233): base 5 × difficulty ×
// distance from the origin × rarity, ×1.5 when a pulse on time did it. Difficulty is measured: LIVE_FOOT is the share of
// 40 seeds a bot walking toward it (or toward the white arrow) completes without a pulse, at once and 1.5 s late,
// averaged (tests/live-encounters.mjs measures it again). 90 % or more is easy, 40 % or more medium, below, hard. Every
// biome shows up about as often as the others (5–9 % of the map each, the Void 42–44 %), so no encounter is rarer than
// another: rarity ×1. Until alpha.232 it was 10 ✦, or 15 ✦ on time (E1); H1 first had 30 and 45.
export const LIVE_FOOT=Object.freeze({tambor:.5,semilla:.66,cometa:.28,eco:.14,estrella:.5,derrumbe:.5,rayos:.5,ondas:.55,llamaradas:.5,agujero:.5});
export const liveFoot=def=>LIVE_FOOT[def?.id]??1;
export const liveDifficulty=def=>{const f=liveFoot(def);return f>=.9?DIFFICULTY.easy:f>=.4?DIFFICULTY.medium:DIFFICULTY.hard;};
export const liveRewardFor=(def,{x=0,y=0,onTime=false}={})=>universeReward(UNIVERSE_BASE.live,{difficulty:liveDifficulty(def),x,y,rarity:RARITY.common,onTime});
// One every 60 to 90 seconds of travel (time moving in the free World, never paused or standing in a menu).
export const LIVE_EVERY=Object.freeze({min:60,max:90});
// Where it appears: ahead of the cube, a little to one side.
export const LIVE_AHEAD=Object.freeze({near:280,far:340,side:90});
// Catching: touching it with the cube; a pulse on time near it catches it (CATCH) or holds it still a moment (HOLD).
export const LIVE_TOUCH=26,LIVE_PULSE_CATCH=110,LIVE_PULSE_HOLD=260,LIVE_HOLD_SECONDS=2,LIVE_FAR=720,LIVE_FAREWELL=1.4;
// Fleeing: a pulse on time always shields the cube a moment (SHIELD) and helps in its own way; being reached only nudges
// the cube aside for KNOCK seconds at KNOCK_SPEED and ends the encounter without a reward. BODY: the cube's half size.
export const LIVE_SHIELD=1,LIVE_KNOCK=1,LIVE_KNOCK_SPEED=60,LIVE_BODY=6;
// Doing (batch 3): a target counts when the cube is within REACH of it; a pulse on time does a step from up to PULSE away
// (or two: it counts double) and always adds BONUS seconds to the task, up to BONUS_MAX. A lit pulsar burns BURN seconds.
export const LIVE_DO_REACH=24,LIVE_DO_PULSE=150,LIVE_DO_BONUS=1,LIVE_DO_BONUS_MAX=6,LIVE_BURN=9;
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
 {id:'agujero',biome:'vacio',verb:'huir',name:'Agujero negro',behavior:'hole',speed:175,life:14,survive:true,line:'Un agujero negro. Escapa a tiempo.',bye:'El agujero te soltó. Ya pasó.'},
 // Batch 3 · hacer. life: seconds for the task (pulses on time add a little); need: its steps, shown as a counter by the
 // cube. bye: the kind goodbye when time runs out or you walk away. Nothing is lost.
 {id:'motas',biome:'llanura',verb:'hacer',name:'Cinco motas',behavior:'sow',life:30,need:5,line:'Siembra cinco motas en orden.',bye:'El viento guardó las motas.'},
 {id:'estrellita',biome:'bosque',verb:'hacer',name:'Estrellita perdida',behavior:'carry',life:28,need:2,line:'Lleva la estrellita a su racimo.',bye:'La estrellita sigue buscando.'},
 {id:'burbujas',biome:'lago',verb:'hacer',name:'Burbujas al ritmo',behavior:'bubbles',life:26,need:12,line:'Rompe burbujas al ritmo. Sube.',bye:'Las burbujas se fueron arriba.'},
 {id:'guardian',biome:'ruinas',verb:'hacer',name:'Guardián de piedra',behavior:'guardian',life:30,need:3,line:'Golpea sus marcas por la espalda.',bye:'El guardián volvió a dormirse.'},
 {id:'brotes',biome:'jardin',verb:'hacer',name:'Cinco brotes',behavior:'water',life:30,need:5,line:'Riega los brotes. Que no se marchiten.',bye:'Los brotes esperarán la lluvia.'},
 {id:'caravana',biome:'dunas',verb:'hacer',name:'Caravana',behavior:'caravan',life:30,need:4,line:'Guía la caravana entre las piedras.',bye:'La caravana acampó aquí.'},
 {id:'nodos',biome:'cristales',verb:'hacer',name:'Nodos que suenan',behavior:'melody',life:30,need:5,line:'Toca los nodos en el orden que suenan.',bye:'Los nodos se callaron.'},
 {id:'pulsares',biome:'faros',verb:'hacer',name:'Cuatro púlsares',behavior:'ignite',life:30,need:4,line:'Enciende los cuatro a la vez.',bye:'Los púlsares se durmieron.'},
 {id:'antena',biome:'tormenta',verb:'hacer',name:'Antena caída',behavior:'antenna',life:30,need:2,line:'Lleva la antena a su base.',bye:'La antena puede esperar.'},
 {id:'luciernagas',biome:'cueva',verb:'hacer',name:'Luciérnagas del pozo',behavior:'fireflies',life:30,need:5,line:'Reúne cinco luciérnagas. Súbelas.',bye:'Las luciérnagas volvieron al fondo.'},
 {id:'constelacion',biome:'vacio',verb:'hacer',name:'Constelación',behavior:'constellation',life:28,need:6,line:'Pasa por sus estrellas. Dibújala.',bye:'Las estrellas siguen ahí.'}
].map(Object.freeze));
const BY_ID=new Map(LIVE_ENCOUNTERS.map(d=>[d.id,d]));
export const liveDefinition=id=>BY_ID.get(id)||null;
// Jay (28 Oct 2026, alpha.230): an encounter says what it is and what to do as it starts («Polilla de luz · atrápala»)
// and leaves one line as it ends («Polilla · atrapada · +15 ✦», «Ola · te alcanzó · sin premio»). Per encounter: a short
// name, its verb as an order and, to chase, whether the prey is «la» or «el». Rules and rewards do not change.
export const LIVE_WORDS=Object.freeze(Object.fromEntries(Object.entries({
 polilla:['Polilla','atrápala','f'],racimo:['Racimo','atrápalo','m'],pez:['Pez','atrápalo','m'],tambor:['Tambor','atrápalo','m'],semilla:['Semilla','atrápala','f'],cometa:['Cometa','atrápala','f'],reflejo:['Reflejo','atrápalo','m'],pulsar:['Púlsar','atrápalo','m'],llamarada:['Llamarada','atrápala','f'],eco:['Eco','atrápalo','m'],estrella:['Estrella','atrápala','f'],
 remolino:['Remolino','aléjate'],enjambre:['Enjambre','sal de su círculo'],ola:['Ola','llega al anillo'],derrumbe:['Derrumbe','esquiva las piedras'],polen:['Polen','que no te alcance'],arena:['Arena','escóndete'],rayos:['Rayos','sal de su alcance'],ondas:['Ondas','llega al centro'],llamaradas:['Llamaradas','sal del círculo'],pozo:['Pozo','sube al borde'],agujero:['Agujero','escapa'],
 motas:['Motas','siémbralas en orden'],estrellita:['Estrellita','llévala a su racimo'],burbujas:['Burbujas','rómpelas'],guardian:['Guardián','tócale la espalda'],brotes:['Brotes','riégalos'],caravana:['Caravana','llévala al oasis'],nodos:['Nodos','tócalos en orden'],pulsares:['Púlsares','enciende los cuatro'],antena:['Antena','llévala a su base'],luciernagas:['Luciérnagas','súbelas a la boca'],constelacion:['Constelación','pasa por todas']
}).map(([id,[short,cue,g]])=>[id,Object.freeze({short,cue,...(g?{g}:{})})])));
// How long the notice and the summary stay, in seconds.
export const LIVE_NOTICE=3,LIVE_SUMMARY=3;
export function liveTitle(kind){const d=liveDefinition(kind),w=LIVE_WORDS[kind];return d&&w?d.name+' · '+w.cue:d?.name||'';}
// What happened, in one or two words: caught (by gender), safe, done; reached you, got away or the task left undone.
export function liveOutcome(s){const d=liveDefinition(s?.kind),w=LIVE_WORDS[s?.kind];if(!d||!w)return '';const r=s.result;
 if(r==='caught')return w.g==='m'?'atrapado':'atrapada';if(r==='safe')return 'a salvo';if(r==='done')return 'hecho';if(r==='hit')return 'te alcanzó';
 if(r==='escaped')return d.verb==='perseguir'?'se escapó':d.verb==='huir'?'se fue':'sin terminar';return '';}
// The summary line: «Polilla · atrapada · +15 ✦»; without a reward «… · sin premio».
export function liveSummary(s,reward=0){const w=LIVE_WORDS[s?.kind],outcome=liveOutcome(s);if(!w||!outcome)return '';return w.short+' · '+outcome+' · '+(reward>0?'+'+reward+' ✦':'sin premio');}
// The encounters a biome offers, in the order of the rows (its «perseguir», its «huir», its «hacer»); the roll picks one.
// The controller rolls with the same hash as batch 1 (live:pick:v1), now in thirds: under one third the chase it always
// had, from one third to two thirds the biome's «huir», from two thirds up its «hacer» (batch 2 split it in halves).
// Timing and places do not move. New batches add rows, never a new engine.
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
 // Doing: the task is laid out ahead of the cube; s.x,s.y is its middle (walking far from it ends the task).
 if(def.verb==='hacer'){s.done=0;s.need=def.need;s.bonus=0;s.cues=[];s.drag=null;s.lost=false;s.dir={x:Math.cos(s.heading),y:Math.sin(s.heading)};SETUP_DO[def.behavior]?.(s,player,def);s.origin={x:s.x,y:s.y};}
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
// Batch 3 · hacer. Where the task is laid out: at(s,p,ahead,side) is a point ahead of the cube along its heading.
const at=(s,p,f,side)=>({x:p.x+s.dir.x*f-s.dir.y*side,y:p.y+s.dir.y*f+s.dir.x*side});
const mid=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
const range=n=>Array.from({length:n},(_,i)=>i);
// A fixed order from the seed (the prism's tune, which sprout dries first).
const order=(s,n,k)=>range(n).sort((a,b)=>unit(s,k+':'+a)-unit(s,k+':'+b));
// Something that follows the cube (or the one ahead of it) at most speed u/s and stops gap units behind.
const follow=(o,lead,speed,gap,dt)=>{const l=dist(o,lead);if(l<=gap)return;const u=toward(o,lead),k=Math.min(l-gap,speed*dt);o.x+=u.x*k;o.y+=u.y*k;};
// Constellations: six stars (ahead, aside) and the lines that draw them, faint until you pass.
const SKY=[
 {stars:[[-170,-110],[-85,-85],[0,-40],[85,-10],[95,95],[190,70]],lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,3]]},
 {stars:[[-190,-40],[-115,70],[-35,-50],[45,70],[125,-50],[195,60]],lines:[[0,1],[1,2],[2,3],[3,4],[4,5]]},
 {stars:[[-170,0],[-70,0],[30,0],[140,0],[30,-115],[30,115]],lines:[[0,1],[1,2],[2,3],[4,2],[2,5]]}
];
const SETUP_DO={
 // Five numbered motes in a gentle zigzag ahead: stand on each, in order, until it takes root.
 sow(s,p){s.items=range(5).map(i=>({...at(s,p,130+i*95,(i%2?1:-1)*(60+unit(s,'mote:'+i)*50)),r:LIVE_DO_REACH,n:i+1,grow:0,done:false}));Object.assign(s,at(s,p,320,0));},
 // A little lost star and its cluster (the marked ring), some way off to one side.
 carry(s,p){const side=unit(s,'side')<.5?1:-1,a=Math.atan2(s.dir.y,s.dir.x)+side*(.5+unit(s,'turn')*.5);s.star={...at(s,p,170,side*50),held:false};s.home={x:s.star.x+Math.cos(a)*600,y:s.star.y+Math.sin(a)*600,r:44};Object.assign(s,mid(s.star,s.home));s.boost=0;},
 // Bubbles rise around the cube, one on each beat: pop twelve to climb.
 bubbles(s,p){s.x=p.x;s.y=p.y;s.bubbles=[];s.pops=[];s.lift=0;},
 // A slow stone guardian faces the cube; its three marks are on its back.
 guardian(s,p){Object.assign(s,at(s,p,230,0));s.face=Math.atan2(p.y-s.y,p.x-s.x);s.stun=0;s.cool=0;s.armed=true;s.bump=0;s.behind=false;s.back={x:s.x,y:s.y};},
 // Five sprouts round a clearing; each dries at its own time (the soonest first in the order of the seed).
 water(s,p){const c=at(s,p,210,0),h=Math.atan2(s.dir.y,s.dir.x),rank=order(s,5,'thirst');s.sprouts=range(5).map(i=>{const a=h+i*TAU/5+(unit(s,'sprout:'+i)-.5)*.5,r=120+unit(s,'far:'+i)*90,left=13+3.5*rank.indexOf(i);return {x:c.x+Math.cos(a)*r,y:c.y+Math.sin(a)*r,r:LIVE_DO_REACH,wet:0,done:false,dry:false,left,full:left};});Object.assign(s,c);},
 // A caravan of four waits ahead; its oasis is far beyond three stones.
 caravan(s,p){const side=unit(s,'side')<.5?1:-1,start=at(s,p,150,0);s.oasis={...at(s,p,700,side*80),r:80};s.camels=range(4).map(i=>({...at(s,p,150+i*18,0),stuck:0,bumped:false}));
  s.stones=[.3,.55,.8].map((f,i)=>{const q={x:start.x+(s.oasis.x-start.x)*f,y:start.y+(s.oasis.y-start.y)*f},off=(unit(s,'stone:'+i)-.5)*60;return {x:q.x-s.dir.y*off,y:q.y+s.dir.x*off,r:26};});Object.assign(s,mid(start,s.oasis));s.joined=false;s.rush=0;},
 // Five nodes of the prism's mesh; they sound (and light) one by one, then wait to be touched in that order.
 melody(s,p){const c=at(s,p,240,0),a0=unit(s,'mesh')*TAU;s.nodes=range(5).map(i=>({x:c.x+Math.cos(a0+i*TAU/5)*120,y:c.y+Math.sin(a0+i*TAU/5)*120,r:LIVE_DO_REACH,n:0,done:false,flash:-9,wrong:-9}));s.seq=order(s,5,'tune');s.shown=0;s.show=true;Object.assign(s,c);},
 // Four pulsars asleep round a wide square: lit, each burns for nine seconds.
 ignite(s,p){const c=at(s,p,230,0),a0=unit(s,'lamp')*TAU;s.lamps=range(4).map(i=>({x:c.x+Math.cos(a0+i*TAU/4)*210,y:c.y+Math.sin(a0+i*TAU/4)*210,r:LIVE_DO_REACH,lit:0,warm:0}));Object.assign(s,c);},
 // A fallen antenna and its base, some way off; the solar wind gusts on the beat.
 antenna(s,p){const side=unit(s,'side')<.5?1:-1,a=Math.atan2(s.dir.y,s.dir.x)+side*(.7+unit(s,'turn')*.4);s.mast={...at(s,p,160,side*50),held:false};s.base={x:s.mast.x+Math.cos(a)*600,y:s.mast.y+Math.sin(a)*600,r:40};Object.assign(s,mid(s.mast,s.base));s.gust=null;s.guard=0;s.boost=0;},
 // Five fireflies circle down in the well; its mouth (the ring) is where the cube stands.
 fireflies(s,p){const c=at(s,p,270,0);s.well={x:c.x,y:c.y,r:240};s.mouth={...at(s,p,40,0),r:46};s.flies=range(5).map(i=>{const a=unit(s,'fly:'+i)*TAU,r=60+unit(s,'deep:'+i)*150;return {hx:c.x+Math.cos(a)*r,hy:c.y+Math.sin(a)*r,x:c.x+Math.cos(a)*r,y:c.y+Math.sin(a)*r,ph:unit(s,'ph:'+i)*TAU,w:.8+unit(s,'w:'+i)*.8,got:false};});s.got=0;Object.assign(s,c);},
 // Six stars of a constellation; passing through each draws its line.
 constellation(s,p){const sky=SKY[Math.floor(unit(s,'sky')*SKY.length)];s.lines=sky.lines;s.stars=sky.stars.map(([f,side])=>({...at(s,p,300+f*1.4,side*1.4),r:LIVE_DO_REACH,seen:false}));s.drawn=[];s.last=-1;Object.assign(s,at(s,p,300,0));}
};
// Each step of a task: true when it is complete. s.done counts its steps for the counter by the cube.
const pop=(s,b,k)=>{b.popped=true;s.done=Math.min(s.need,s.done+k);s.lift=.3;s.pops.push({x:b.x,y:b.y,at:s.age});if(s.pops.length>8)s.pops.shift();};
const strike=s=>{s.done++;s.armed=false;s.cool=1.4;};
const touchNode=(s,q)=>{q.done=true;q.flash=s.age;s.cues.push({step:s.nodes.indexOf(q)});s.done++;};
const see=(s,i)=>{const q=s.stars[i];if(q.seen)return;q.seen=true;if(s.last>=0)s.drawn.push([s.last,i]);s.last=i;s.done++;};
Object.assign(BEHAVIORS,{
 sow(s,p,dt){const q=s.items.find(i=>!i.done);if(q&&dist(q,p)<=q.r){q.grow+=dt/.9;if(q.grow>=1){q.grow=1;q.done=true;s.done++;}}return s.done>=s.need;},
 // The lost star drifts shyly away until you reach it; then it follows the cube, slower than the cube walks.
 carry(s,p,dt){const st=s.star;if(s.boost>0){s.boost-=dt;const u=toward(p,s.home);s.drag=u?{x:u.x*300,y:u.y*300}:null;if(s.drag){st.x+=s.drag.x*dt;st.y+=s.drag.y*dt;}}else s.drag=null;
  if(!st.held){const u=toward(p,st);if(u&&s.age>.6&&dist(st,p)<260){st.x+=u.x*45*dt;st.y+=u.y*45*dt;}if(dist(st,p)<=LIVE_DO_REACH+4){st.held=true;s.done=1;}return false;}
  follow(st,p,110,16,dt);if(dist(st,s.home)<=s.home.r){s.done=2;return true;}return false;},
 bubbles(s,p,dt,d,k,env){s.x=p.x;s.y=p.y;if(s.lift>0){s.lift-=dt;s.drag={x:0,y:-110};}else s.drag=null;
  for(const b of s.bubbles){b.y-=35*dt;b.age+=dt;}
  if(beat(s,env)&&s.age>.6){const n=s.beats,a=-Math.PI/2+(unit(s,'bub:'+n)-.5)*2.6,r=100+unit(s,'bubr:'+n)*100;s.bubbles.push({x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r,r:14,age:0});}
  for(const b of s.bubbles)if(!b.popped&&dist(b,p)<=b.r+LIVE_BODY+6)pop(s,b,1);
  s.bubbles=s.bubbles.filter(b=>!b.popped&&b.age<3.4);return s.done>=s.need;},
 // It turns slowly toward the cube and walks a little; touching its back (from behind) strikes a mark. From the front it
 // only nudges the cube away.
 guardian(s,p,dt){const f={x:Math.cos(s.face),y:Math.sin(s.face)},rel={x:p.x-s.x,y:p.y-s.y};s.back={x:s.x-f.x*30,y:s.y-f.y*30};s.behind=rel.x*f.x+rel.y*f.y<-8;
  if(s.bump>0)s.bump-=dt;else s.drag=null;
  if(s.cool>0)s.cool-=dt;else if(s.stun>0)s.stun-=dt;else if(s.age>.8){const turn=wrap(Math.atan2(rel.y,rel.x)-s.face);s.face+=Math.sign(turn)*Math.min(Math.abs(turn),1*dt);if(Math.hypot(rel.x,rel.y)>70){s.x+=f.x*45*dt;s.y+=f.y*45*dt;}}
  if(!s.armed&&dist(p,s.back)>70)s.armed=true;
  if(s.armed&&s.behind&&dist(p,s.back)<=LIVE_DO_REACH)strike(s);
  else if(!s.behind&&dist(p,s)<34&&s.bump<=0){const u=toward(s,p)||s.dir;s.drag={x:u.x*90,y:u.y*90};s.bump=.4;}
  return s.done>=s.need;},
 // Standing on a sprout waters it; one left dry ends the task (kindly: nothing is lost).
 water(s,p,dt){for(const q of s.sprouts){if(q.done)continue;q.left-=dt;if(q.left<=0){q.left=0;q.dry=true;s.lost=true;}else if(dist(q,p)<=q.r){q.wet+=dt;if(q.wet>=1){q.wet=1;q.done=true;s.done++;}}}return s.done>=s.need;},
 // Touch the first camel and the caravan follows, each one behind the other, cutting corners: a camel that bumps into a
 // stone waits a moment. The counter is the camels in the oasis.
 caravan(s,p,dt){if(!s.joined){if(dist(p,s.camels[0])<=40)s.joined=true;return false;}
  const fast=s.rush>0;if(fast)s.rush-=dt;let lead=p;
  s.camels.forEach((c,i)=>{if(c.stuck>0&&!fast)c.stuck-=dt;else follow(c,lead,fast?240:120,i?16:22,dt);let touch=false;
   if(!fast)for(const q of s.stones){const l=dist(c,q);if(l<q.r+5){const u=toward(q,c)||s.dir;c.x=q.x+u.x*(q.r+5);c.y=q.y+u.y*(q.r+5);touch=true;}}
   if(touch&&!c.bumped)c.stuck=.6;c.bumped=touch;lead=c;});
  s.done=s.camels.filter(c=>dist(c,s.oasis)<=s.oasis.r).length;return s.done>=s.need;},
 // First the tune: one node lights and sounds on each beat. Then touch them in that order; a wrong one only flickers.
 melody(s,p,dt,d,k,env){const b=beat(s,env);
  if(s.show){if(b&&s.age>.8){const i=s.seq[s.shown],q=s.nodes[i];q.n=s.shown+1;q.flash=s.age;s.cues.push({step:i});if(++s.shown>=s.nodes.length)s.show=false;}return false;}
  const q=s.nodes[s.seq[s.done]];if(q&&dist(q,p)<=q.r)touchNode(s,q);else for(const o of s.nodes)if(!o.done&&o!==q&&dist(o,p)<=o.r)o.wrong=s.age;
  return s.done>=s.need;},
 // Staying a moment on a pulsar lights it (or lights it again); it burns nine seconds. All four at once completes it.
 ignite(s,p,dt){for(const q of s.lamps){if(q.lit>0)q.lit=Math.max(0,q.lit-dt);if(dist(q,p)<=q.r&&q.lit<LIVE_BURN-.3){q.warm+=dt;if(q.warm>=.4){q.lit=LIVE_BURN;q.warm=0;}}else q.warm=0;}s.done=s.lamps.filter(q=>q.lit>0).length;return s.done>=s.need;},
 // Once picked up, the antenna rides on the cube against a steady wind; every two beats the solar wind marks a gust
 // (one beat ahead) that pushes the cube aside a moment.
 antenna(s,p,dt,d,k,env){const m=s.mast,b=beat(s,env);if(s.guard>0)s.guard-=dt;
  if(s.boost>0){s.boost-=dt;const u=toward(p,s.base);s.drag=u?{x:u.x*260,y:u.y*260}:null;}
  else if(s.gust&&s.age>=s.gust.from&&s.age<s.gust.until&&!(s.guard>0))s.drag={x:s.gust.x*110,y:s.gust.y*110};
  // Carrying it, the wind blows against the cube from the base (a pulse on time keeps it off a moment).
  else if(m.held&&!(s.guard>0)){const u=toward(p,s.base);s.drag=u?{x:-u.x*50,y:-u.y*50}:null;}else s.drag=null;
  if(!m.held){if(dist(m,p)<=LIVE_DO_REACH+4){m.held=true;s.done=1;}return false;}
  m.x=p.x;m.y=p.y;if(b&&s.beats%2===0){const u=toward(p,s.base)||s.dir,side=unit(s,'gust:'+s.beats)<.5?1:-1,L=s.beatLen||.55;s.gust={x:-u.y*side,y:u.x*side,from:s.age+L,until:s.age+L+.45};}
  if(dist(p,s.base)<=s.base.r){s.done=2;return true;}return false;},
 // The fireflies circle in the well; touched, one joins the line behind the cube. All five at the mouth completes it.
 fireflies(s,p,dt){let lead=p;for(const f of s.flies){if(f.got){follow(f,lead,170,14,dt);lead=f;continue;}const a=s.age*f.w+f.ph;f.x=f.hx+Math.cos(a)*40;f.y=f.hy+Math.sin(a)*40;if(dist(f,p)<=LIVE_DO_REACH+4){f.got=true;s.got++;}}
  s.done=s.got;return s.got>=s.need&&dist(p,s.mouth)<=s.mouth.r;},
 constellation(s,p){s.stars.forEach((q,i)=>{if(!q.seen&&dist(q,p)<=q.r)see(s,i);});return s.done>=s.need;}
});
// What a pulse on time does while doing, besides adding a second: it counts double, speeds up, shields or keeps alight.
const HELP_DO={
 sow(s,p,w){for(let n=0;n<2;n++){const q=s.items.find(i=>!i.done);if(!q||dist(q,w)>LIVE_DO_PULSE)break;q.grow=1;q.done=true;s.done++;}},
 carry(s,p,w){if(!s.star.held){if(dist(s.star,w)<=LIVE_DO_PULSE+10){s.star.held=true;s.done=1;}}else s.boost=.3;},
 bubbles(s,p,w){for(const b of s.bubbles)if(!b.popped&&dist(b,w)<=LIVE_DO_PULSE)pop(s,b,2);},
 guardian(s,p,w){if(dist(s,w)<=LIVE_DO_PULSE+10)s.stun=1.6;if(s.armed&&s.behind&&dist(w,s.back)<=70)strike(s);},
 water(s,p,w){for(const q of s.sprouts){if(q.done||q.dry)continue;if(dist(q,w)<=LIVE_DO_PULSE){q.wet=1;q.done=true;s.done++;}else{q.left+=3;q.full=Math.max(q.full,q.left);}}},
 caravan(s,p,w){if(!s.joined&&dist(w,s.camels[0])<=LIVE_DO_PULSE+10)s.joined=true;if(s.joined){s.rush=1.5;for(const c of s.camels)c.stuck=0;}},
 melody(s,p,w){if(s.show){s.seq.forEach((i,k)=>{s.nodes[i].n=k+1;});s.shown=s.nodes.length;s.show=false;return;}for(let n=0;n<2;n++){const q=s.nodes[s.seq[s.done]];if(!q||dist(q,w)>LIVE_DO_PULSE)break;touchNode(s,q);}},
 ignite(s,p,w){for(const q of s.lamps)if(q.lit>0||dist(q,w)<=LIVE_DO_PULSE)q.lit=LIVE_BURN;},
 antenna(s,p,w){if(!s.mast.held){if(dist(s.mast,w)<=LIVE_DO_PULSE+10){s.mast.held=true;s.done=1;}}else{s.guard=1.2;s.boost=.3;}},
 fireflies(s,p,w){for(const f of s.flies)if(!f.got&&dist(f,w)<=LIVE_DO_PULSE+10){f.got=true;s.got++;}s.done=s.got;},
 constellation(s,p,w){s.stars.forEach((q,i)=>{if(!q.seen&&dist(q,w)<=LIVE_DO_PULSE)see(s,i);});}
};
const nearest=(list,p)=>list.slice().sort((a,b)=>dist(a,p)-dist(b,p))[0]||null;
// Where to go while doing (the arrow and the white ring): the next step of the task. The caravan's way goes round the
// stones; the guardian's, round its side to its back.
function doGoal(s,p){
 switch(s.kind){
  case 'motas':return s.items.find(i=>!i.done)||null;
  case 'estrellita':return s.star.held?s.home:s.star;
  case 'burbujas':return nearest(s.bubbles.filter(b=>!b.popped),p)||{x:p.x,y:p.y-80};
  case 'guardian':{const f={x:Math.cos(s.face),y:Math.sin(s.face)};if(!s.armed)return {x:s.x-f.x*120,y:s.y-f.y*120};if(s.behind)return s.back;const rel={x:p.x-s.x,y:p.y-s.y},side=Math.sign(f.x*rel.y-f.y*rel.x)||1;return {x:s.x-f.x*40-f.y*side*80,y:s.y-f.y*40+f.x*side*80};}
  case 'brotes':{const open=s.sprouts.filter(q=>!q.done&&!q.dry),urgent=open.filter(q=>q.left<4).sort((a,b)=>a.left-b.left)[0];return urgent||nearest(open,p);}
  case 'caravana':{if(!s.joined)return s.camels[0];const g=s.oasis,dx=g.x-p.x,dy=g.y-p.y,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;
   for(const q of s.stones.slice().sort((a,b)=>((a.x-p.x)*ux+(a.y-p.y)*uy)-((b.x-p.x)*ux+(b.y-p.y)*uy))){const along=(q.x-p.x)*ux+(q.y-p.y)*uy,off=(q.y-p.y)*ux-(q.x-p.x)*uy;if(along<-10||along>len)continue;if(Math.abs(off)<q.r+45){const side=off>0?-1:1;return {x:q.x-uy*side*(q.r+60),y:q.y+ux*side*(q.r+60)};}}return g;}
  case 'nodos':return s.show?null:s.nodes[s.seq[s.done]]||null;
  case 'pulsares':return nearest(s.lamps.filter(q=>q.lit<=0),p)||nearest(s.lamps.slice().sort((a,b)=>a.lit-b.lit).slice(0,1),p);
  case 'antena':return s.mast.held?s.base:s.mast;
  case 'luciernagas':return s.got>=s.need?s.mouth:nearest(s.flies.filter(f=>!f.got),p);
  case 'constelacion':{if(s.last>=0){const next=s.lines.find(([a,b])=>a===s.last&&!s.stars[b].seen||b===s.last&&!s.stars[a].seen);if(next)return s.stars[next[0]===s.last?next[1]:next[0]];}return s.stars.find(q=>!q.seen)||null;}
 }
 return null;
}
// Where to go while fleeing (the arrow by the cube): the safe ring, the nearest shelter, out of the circle, away from the
// threat, or the clearest spot among the falling stones.
export function liveGoal(s,p){
 if(s?.verb==='hacer')return doGoal(s,p);
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
 },
 // hacer: done when the task is complete; it ends kindly, with nothing lost, when its time runs out (plus the seconds
 // pulses on time added), a sprout dries or the cube walks far from it.
 hacer(s,p,env,d,complete){
  if(complete)return 'done';
  if(s.lost||s.age>=d.life+s.bonus||dist(p,s)>LIVE_FAR)return 'escaped';
  return '';
 }
};
// Before the step: pulses heard while fleeing. Any on time shields the cube and counts for the 15 ✦; some also help more.
// While doing, any pulse on time counts for the 15 ✦, adds a second to the task and helps in its own way (HELP_DO).
const VERB_PRE={
 huir(s,p,env,d){for(const w of env.pulses||[]){if(!w.beat)continue;s.onTime=true;s.shield=LIVE_SHIELD;const r=HELP[d.behavior]?.(s,p,w,d);if(r)return r;}return '';},
 hacer(s,p,env,d){for(const w of env.pulses||[]){if(!w.beat)continue;s.onTime=true;s.bonus=Math.min(LIVE_DO_BONUS_MAX,s.bonus+LIVE_DO_BONUS);HELP_DO[d.behavior]?.(s,p,w,d);}return '';}
};
const WIN=new Set(['caught','safe','done']),LOSE=new Set(['escaped','hit']);
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
export const liveReward=s=>liveWon(s)?liveRewardFor(liveDefinition(s.kind),{x:s.origin?.x,y:s.origin?.y,onTime:s.onTime}):0;
// For the economy model only (scripts/spark-economy.mjs): the average reward of the 33 near the origin, off and on time.
export const LIVE_REWARD=Object.freeze({base:LIVE_ENCOUNTERS.reduce((n,d)=>n+liveRewardFor(d),0)/LIVE_ENCOUNTERS.length,onTime:LIVE_ENCOUNTERS.reduce((n,d)=>n+liveRewardFor(d,{onTime:true}),0)/LIVE_ENCOUNTERS.length});
// Shortcut for tests (docs/MUNDO.md#herramientas-de-prueba): «?encuentro=polilla» forces that encounter soon.
export function liveForced(search=globalThis.location?.search){try{const id=new URLSearchParams(search||'').get('encuentro');return BY_ID.has(id)?id:null;}catch(_){return null;}}
