// Arreglos de la media hora (Jay, alpha.242): the six fixes after a 30-minute bot session in the free World.
// 1 a wild spark is caught by passing through it with the sound off; 2 rumors: one near (1–3 km), spaced, refilled;
// 3 living encounters never twice in a row, the Vacío's weigh less near the origin; 4 an idle mischief scene says goodbye
// after ~40 s and holds nothing back after 10 s; 5 marks at the screen's edge for activities, finds and boxes within
// 300 m; 6 fewer achievement notices in the first half hour, none lost from the Bitácora.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hashKey} from '../src/universe-regions.js';
import {WILD_TOUCH,WILD_SPARKS,wildTouched,initialize as wild} from '../src/wild.js';
import {RUMOR_NEAR_MIN,RUMOR_NEAR_MAX,RUMOR_GAP,RUMOR_REFILL,RUMOR_OPEN_MAX,rumorFor,rumorNearOpen,rumorSpaced,normalizeRumors,worldKey,kmBetween,EDGE_REACH,edgeNearest,edgeSpot} from '../src/descubrir-model.js';
import {LIVE_ENCOUNTERS,LIVE_VOID_KM,liveFor,livePick,normalizeLive} from '../src/live-encounters-model.js';
import {MISCHIEF_IDLE,MISCHIEF_HOLD,mischiefMark,initialize as mischief} from '../src/universe-mischief.js';
import {mischiefCell} from '../src/universe-mischief-model.js';
import {FIRST_WORLD,ACH_GAP,achievementMinor,achievementPick,initialize as achievements} from '../src/achievements.js';
import {EN} from '../src/i18n-en.js';
globalThis.document={hidden:false,querySelector:()=>null};
const seedOf=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const canvas=new Proxy({},{get:(t,k)=>k in t?t[k]:()=>{},set:(t,k,v)=>{t[k]=v;return true;}});

// ---------- 1 · the wild spark with the sound off ----------
assert.equal(wildTouched({x:0,y:0},{x:WILD_TOUCH,y:0},false),true);assert.equal(wildTouched({x:0,y:0},{x:WILD_TOUCH+1,y:0},false),false);
assert.equal(wildTouched({x:0,y:0},{x:0,y:0},true),false,'with sound the five pulses on time stay the way');
function wildGame(sound){const toasts=[],r={S:{mode:'world',layer:'superficie',journey:{finished:true,free:true},todayKey:'2026-11-03',wx:0,wy:0,sparks:0,sound},toasts,inWorld:()=>true,toast:(t)=>toasts.push(t),save:()=>true,hud(){},W:390,H:844};wild(r);return r;}
{const r=wildGame(false);assert(r.wildSpawn());const sp=r.wildState().spark;assert.match(r.toasts.at(-1),/Pasa por ella/);r.S.wx=sp.x-10;r.S.wy=sp.y;r.drawWild(canvas,390,844,0);
 const st=r.wildState();assert.equal(st.spark,null,'passing through it catches it');assert.equal(st.caught,1);assert.equal(r.S.sparks,WILD_SPARKS,'the same 15 ✦');assert.match(r.toasts.at(-1),/Atrapada/);}
{const r=wildGame(true);assert(r.wildSpawn());const sp=r.wildState().spark;assert.equal(r.toasts.at(-1),'Una chispa salvaje.');r.S.wx=sp.x;r.S.wy=sp.y;r.drawWild(canvas,390,844,0);assert(r.wildState().spark,'with sound on, touching alone does not catch it');}

// ---------- 2 · rumors ----------
const under=(x,y)=>({biome:['llanura','bosque','lago','vacio'][Math.floor(hashKey('b:'+Math.floor(x/3600)+','+Math.floor(y/3600))*4)],region:null});
const landmarkAt=(rx,ry)=>hashKey('lm:'+rx+','+ry)<.1?{id:'lm:'+rx+','+ry,type:'torre',x:(rx+.5)*3600,y:(ry+.5)*3600}:null;
const look={under,landmarkAt,anomalyAt:()=>null,RP:3600},world=worldKey({seed:42});
{let n0=0;for(let n=0;n<200;n++){const from={x:(n%9-4)*70000,y:(n%7-3)*70000},q=rumorFor(from,world,n,look,{near:true}),km=kmBetween(from,q);
  const said=Number(q.text.match(/a (\d+) km/)[1]);assert(said>=1&&said<=3,q.text);assert(km>=.7&&km<=RUMOR_NEAR_MAX,km);if(q.kind!=='region')n0++;
  // Real, as before: what it says is there (a landmark is re-read).
  if(q.kind==='landmark'){const [rx,ry]=q.key.slice(3).split(',').map(Number);assert(landmarkAt(rx,ry));}}
 assert(n0>100,'near rumors point at real things, not only a biome: '+n0);}
// The far ones keep their own hash: without near, the same rumor as before.
{const a=rumorFor({x:0,y:0},world,5,look),b=rumorFor({x:0,y:0},world,5,look,{near:false});assert.deepEqual(a,b);}
assert.equal(rumorNearOpen({open:[{x:25000,y:0}]},{x:0,y:0}),true);assert.equal(rumorNearOpen({open:[{x:90000,y:0}]},{x:0,y:0}),false);assert.equal(rumorNearOpen({open:[]},{x:0,y:0}),false);
assert(rumorSpaced(0,-Infinity));assert(!rumorSpaced(RUMOR_GAP-1,0));assert(rumorSpaced(RUMOR_GAP,0));assert(RUMOR_GAP*2>180,'the three never in the first three minutes');assert(RUMOR_REFILL>0);
{const q=normalizeRumors({owed:7,open:[],done:[]});assert.equal(q.owed,RUMOR_OPEN_MAX);assert.equal('owed' in normalizeRumors({owed:0}),false);assert.equal('owed' in normalizeRumors(undefined),false);assert.equal(normalizeRumors({owed:2,extra:1}).extra,1);}

// ---------- 3 · living encounters ----------
{const scope='w:superficie';let last='',repeats=0,first=0;for(let n=0;n<400;n++){const b=['llanura','bosque','lago','vacio'][n%4],d=livePick(b,scope,n,{last,km:20});if(d.id===last)repeats++;if(d.id===liveFor(b,hashKey('live:pick:v1:'+scope+':'+n)).id)first++;assert.equal(d.biome,b,'far from the origin, each biome its own');last=d.id;}
 assert.equal(repeats,0,'never the same twice in a row');assert(first>300,'the first pick is the old hash: '+first);}
{const scope='v:superficie';let lent=0,near=0;for(let n=0;n<400;n++){const d=livePick('vacio',scope,n,{km:1,land:'bosque'});if(d.biome==='bosque')lent++;const f=livePick('vacio',scope,n,{km:LIVE_VOID_KM+1,land:'bosque'});if(f.biome==='vacio')near++;}
 assert(lent>150&&lent<250,'near the origin about half come from the nearest land: '+lent);assert.equal(near,400,'from 5 km the Vacío keeps its own');
 assert.equal(livePick('vacio',scope,3,{km:1,land:null}).biome,'vacio','with no land near, the Vacío');}
assert.equal(LIVE_ENCOUNTERS.length,33,'the encounters themselves do not change');
assert.equal(normalizeLive({last:'polilla'}).last,'polilla');assert.equal('last' in normalizeLive({last:7}),false);assert.deepEqual(normalizeLive(null),{version:1,kinds:{},count:0,caught:0,earned:0});

// ---------- 4 · mischief that does not move on ----------
function mischiefGame(){const r={S:{mode:'world',todayKey:'2026-11-03',layer:'superficie',wx:0,wy:0,sparks:0,sound:false,sparkEconomy:{version:1,earned:0,log:[]}},worldIdentity:{seed:'',generation:1},MU:{step:0},seedOf,regionOfPos:()=>({genre:'deep',sea:false}),inWorld(){return true;},save:()=>true,chordTones:()=>[57,60,64],vel:n=>n,hookInst(){},beatSoon(){},totemNear:()=>[],inhabitantsNear:()=>[],cx:canvas,W:390,H:844,camX:0,camY:0};mischief(r);return r;}
const site=(()=>{for(let x=-40;x<40;x++)for(let y=-40;y<40;y++)for(const o of mischiefCell(x,y,seedOf))if(o.kind==='rain')return o;})();
{const r=mischiefGame();r.S.wx=site.x;r.S.wy=site.y;r.mischiefTick(.05);const s=r.mischiefState.scene;assert(s&&r.mischiefBusy(),'a fresh scene is busy');
 let t=0;for(;t<MISCHIEF_HOLD+1;t+=.05){r.S.wx=site.x+(Math.round(t*20)%2?8:-8);r.mischiefTick(.05);}assert(r.mischiefState.scene&&!r.mischiefBusy(),'idle for 10 s it holds nothing back');
 for(;t<MISCHIEF_IDLE+2&&r.mischiefState.scene;t+=.05){r.S.wx=site.x+(Math.round(t*20)%2?8:-8);r.mischiefTick(.05);}assert(!r.mischiefState.scene,'and says goodbye by itself');assert(t>=MISCHIEF_IDLE-.2&&t<=MISCHIEF_IDLE+.5,t);
 for(let i=0;i<10;i++)r.mischiefTick(.05);assert(!r.mischiefState.scene,'it does not come back while you stay');r.drawMischief();}
// A scene that moves on stays: the drops caught one by one, more than 40 s in all.
{const r=mischiefGame();r.S.wx=site.x;r.S.wy=site.y;r.mischiefTick(.05);const s=r.mischiefState.scene;for(const [i,q] of s.drops.entries()){for(let k=0;k<160;k++)r.mischiefTick(.05);assert(r.mischiefState.scene,'still there before drop '+i);r.S.wx=q.x;r.S.wy=q.y-(q.rise||0);r.mischiefTick(.05);}
 assert(s.done||s.collected.length>=6,s.collected.length);}
// With a living encounter starting, an idle scene steps aside.
{const r=mischiefGame();r.S.wx=site.x;r.S.wy=site.y;r.mischiefTick(.05);for(let i=0;i<(MISCHIEF_HOLD+4)/.05;i++)r.mischiefTick(.05);r.liveEncounterActive=()=>true;r.mischiefTick(.05);assert(!r.mischiefState.scene);}
assert.notEqual(mischiefMark({stage:0,collected:[],clues:[]}),mischiefMark({stage:1,collected:[],clues:[]}));
assert.equal(mischiefMark({kind:'rain',stage:0,collected:[],clues:[],turns:9}),mischiefMark({kind:'rain',stage:0,collected:[],clues:[],turns:0}),'turning round on the spot is not a step');

// ---------- 5 · marks at the edge ----------
{const view={x:-195,y:-422,w:390,h:844},p={x:0,y:0};assert.equal(edgeNearest([{x:10,y:10}],p,view),null,'in view, no mark');
 assert.equal(edgeNearest([{x:EDGE_REACH+1,y:0}],p,view),null,'beyond 300 m, none');const n=edgeNearest([{x:2600,y:0},{x:0,y:2200},{x:900,y:0}],p,view);assert.equal(n.o.x,900);
 const q=edgeSpot(390,844,1000,0,22,104);assert.equal(Math.round(q.x),390-22);assert.equal(Math.round(q.y),422);const u=edgeSpot(390,844,0,-1000,22,104);assert.equal(Math.round(u.y),104);}
const desc=readFileSync(new URL('../src/descubrir.js',import.meta.url),'utf8');for(const k of ['activityCell','wonderCell','boxAt','drawMarks'])assert(desc.includes(k),k);
assert(EDGE_REACH>=2000&&EDGE_REACH<=3000);

// ---------- 6 · achievements in the first half hour ----------
assert(achievementMinor('v2:biomes:5')&&!achievementMinor('adventure:story:rain:1')&&!achievementMinor('evento1'));
{const meta=id=>({a:{tier:'bronce'},b:{tier:'oro'},c:{tier:'plata',hidden:true}})[id];assert.equal(achievementPick(['a','b'],meta),'b');assert.equal(achievementPick(['a','b','c'],meta),'c');assert.equal(achievementPick(['v2:x:1'],meta),null);}
function achGame(seconds){const toasts=[],r={S:{mode:'world',todayKey:'2026-11-03',journey:{finished:true,free:true},ach:{},journal:{},...(seconds!==undefined?{firstWorldSeconds:seconds}:{})},ACH:[['evento1','Testigo','x'],['hito1','Lo oíste primero','x'],['frontera','Frontera','x']],toasts,inWorld:()=>true,
 placesData:()=>({seen:{llanura:true}}),toast:t=>{toasts.push(t);return true;},save:()=>true,unlock(){},$:()=>null};achievements(r);return r;}
{const r=achGame();const v2=r.ACH.find(a=>a[0].startsWith('v2:'))[0];r.S.ach[v2]='d';r.achievementEarned([v2]);r.achievementsTick(2);assert.equal(r.toasts.length,0,'a minor one waits in silence');assert(r.achievementsUnread(),'but stays unread in the Bitácora');
 r.S.ach.evento1='d';r.achievementEarned(['evento1']);r.achievementsTick(2);assert.equal(r.toasts.length,1);assert.match(r.toasts[0],/Testigo/);
 r.S.ach.hito1='d';r.achievementEarned(['hito1']);r.achievementsTick(2);assert.equal(r.toasts.length,1,'the next waits its gap');
 for(let i=0;i<ACH_GAP*4+40;i++)r.achievementsTick(.25);assert.equal(r.toasts.length,2,'then it comes');assert.match(r.toasts[1],/Lo oíste primero/);assert(r.achievementsFirstWorld().seconds>=ACH_GAP);}
{const r=achGame(FIRST_WORLD);const v2=r.ACH.find(a=>a[0].startsWith('v2:'))[0];r.S.ach[v2]='d';r.achievementEarned([v2]);r.achievementsTick(2);assert.equal(r.toasts.length,1,'after the first half hour, as before');}
{const r=achGame();r.S.journey={finished:false};assert.equal(r.achievementsFirstWorld().first,false);}
// A save from before alpha.242 with many achievements is past its first half hour.
{const r={S:{mode:'world',journey:{finished:true},ach:Object.fromEntries(Array.from({length:45},(_,i)=>['old'+i,'d'])),journal:{}},ACH:[],inWorld:()=>true,save:()=>true,unlock(){},$:()=>null,toast(){}};achievements(r);r.achievementsTick(2);assert.equal(r.S.firstWorldSeconds,FIRST_WORLD);}

// English for the new texts.
for(const k of ['Una chispa salvaje. Pasa por ella.','Se despidió.'])assert(EN[k],k);
console.log('PASS arreglos de la media hora: the wild spark caught by passing through it with the sound off (same 15 ✦); a near rumor at 1–3 km when none is near, spaced 100 s, one owed per one fulfilled; living encounters never twice in a row, the Vacío lends half its turns to the nearest land under 5 km; an idle mischief scene holds nothing back after 10 s and says goodbye after 40 s; edge marks for activities, finds and boxes within 300 m; in the first half hour minor achievements wait in silence and the rest come 3 min apart, all unread in the Bitácora');
