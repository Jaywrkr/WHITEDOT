// Secretos del cielo (alpha.247): fifty comet crystals and the lost probes at fixed points from hashKey (a few crystals
// under 3 km), the meteor showers (rare, crossing past the cube, caught on time or, without sound, by passing), their
// reward by the universe's rule, the eclipses on the device's clock, the coordinates the probes give, the save and its
// migration, the English, no random numbers, and the wiring.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {COMETS,COMET_COUNT,COMET_BANDS,COMET_GAP,PROBES,PROBE_COUNT,PROBE_HEAR,METEOR_EVERY,meteorInterval,METEOR_COUNT,METEOR_LIFE,METEOR_SIDE,meteorPath,meteorHead,meteorCaught,meteorReward,
 eclipseCell,eclipseNear,eclipsePhase,eclipseWait,ECLIPSE_TOTAL,ECLIPSE_SECONDS,ECLIPSE_CUTOFF,normalizeSkySecrets,keepComet,cometCount,cometFound,orbitEarned,orbitOn,keepProbe,probeTarget,probeFound,fulfilCoord,
 skyPagesFound,SKY_SECRETS_VERSION,probeLoudness,meteorDegree,PROBE_GAIN,METEOR_GAIN,COMET_GAIN} from '../src/secretos-cielo-model.js';
import {ASTEROID} from '../src/secretos-model.js';
import {EN} from '../src/i18n-en.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const km=p=>Math.hypot(p.x,p.y)/10000;
// --- fifty crystals: fixed, near to far, a few under 3 km, apart from each other, the origin and the asteroid
assert.equal(COMETS.length,COMET_COUNT);assert.equal(COMET_COUNT,50);assert.equal(COMET_BANDS.reduce((a,b)=>a+b[2],0),50);
assert.ok(COMETS.filter(c=>km(c)<3).length>=3,'a few under 3 km');assert.ok(COMETS.every(c=>km(c)>=.85),'none on the origin');
assert.ok(COMETS.some(c=>km(c)>50)&&COMETS.filter(c=>km(c)>=20).length>=20,'and far');
for(const a of COMETS){assert.ok(Math.hypot(a.x-ASTEROID.x,a.y-ASTEROID.y)>=COMET_GAP);for(const b of COMETS)if(a!==b)assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>=COMET_GAP,a.id+' '+b.id);}
assert.deepEqual((await import('../src/secretos-cielo-model.js?again')).COMETS.map(c=>[c.x,c.y]),COMETS.map(c=>[c.x,c.y]),'the same on every load');
// --- the probes: few, fixed, apart from the crystals
assert.equal(PROBES.length,PROBE_COUNT);assert.ok(PROBE_COUNT<=12);assert.ok(PROBES.some(p=>km(p)<3));
for(const p of PROBES)for(const c of COMETS)assert.ok(Math.hypot(p.x-c.x,p.y-c.y)>=COMET_GAP);
assert.ok(probeLoudness(0)===1&&probeLoudness(PROBE_HEAR)<.25&&probeLoudness(PROBE_HEAR/2)<probeLoudness(PROBE_HEAR/4),'louder as you come near');
// --- meteor showers: rare, deterministic, past the cube
for(let n=0;n<40;n++){const s=meteorInterval(n);assert.ok(s>=METEOR_EVERY.min&&s<=METEOR_EVERY.max);}assert.ok(METEOR_EVERY.min>=300,'rare: five minutes at least');
const from={x:12345,y:-6789};for(let k=0;k<METEOR_COUNT;k++){const m=meteorPath(3,k,from);assert.deepEqual(m,meteorPath(3,k,from));let best=Infinity;for(let a=0;a<=METEOR_LIFE;a+=.05){const h=meteorHead(m,a);best=Math.min(best,Math.hypot(h.x-from.x,h.y-from.y));}assert.ok(best<=METEOR_SIDE+1,'it passes near: '+best);}
const head={x:0,y:0};
assert.deepEqual(meteorCaught(head,{x:30,y:0},[],false),{by:'touch',onTime:false},'without sound, passing through it');
assert.equal(meteorCaught(head,{x:30,y:0},[],true),null,'with sound, passing is not enough');
assert.equal(meteorCaught(head,{x:500,y:0},[{x:100,y:0,beat:false}],true),null,'with sound, a pulse off time does not catch');
assert.deepEqual(meteorCaught(head,{x:500,y:0},[{x:100,y:0,beat:true}],true),{by:'pulse',onTime:true});
assert.deepEqual(meteorCaught(head,{x:500,y:0},[{x:100,y:0,beat:false}],false),{by:'pulse',onTime:false},'without sound any pulse near it');
// The reward: a whole shower like a living encounter (10 near the origin, 15 on time), more far away, by the share caught.
assert.equal(meteorReward(METEOR_COUNT,METEOR_COUNT,{x:0,y:0}),10);assert.equal(meteorReward(METEOR_COUNT,METEOR_COUNT,{x:0,y:0,onTime:true}),15);
assert.equal(meteorReward(0,METEOR_COUNT),0);assert.ok(meteorReward(3,METEOR_COUNT)<10&&meteorReward(1,METEOR_COUNT)>=1);assert.equal(meteorReward(METEOR_COUNT,METEOR_COUNT,{x:300000,y:0}),20,'×2 from 20 km');
for(let k=0;k<20;k++)assert.ok([0,2,4,7,9,11,14].includes(meteorDegree(k)));
// --- eclipses: rare sites, a covering once a period on the clock, a few seconds of darker music
let sites=0;for(let i=-10;i<10;i++)for(let j=-10;j<10;j++){const s=eclipseCell(i,j);if(s){sites++;assert.deepEqual(s,eclipseCell(i,j));assert.ok(s.period>=240&&s.period<=360);}}
assert.ok(sites>=60&&sites<=180,'about one cell in three: '+sites);assert.equal(eclipseCell(0,0),null,'none on the ring');
const site=eclipseNear({x:0,y:0},2e6);assert.ok(site);let covered=0;for(let t=0;t<site.period;t++)if(eclipsePhase(site,t).total)covered++;assert.ok(Math.abs(covered-ECLIPSE_TOTAL)<=1,'covered '+covered+' s a period');
let t0=1000;while(eclipsePhase(site,t0).total)t0+=7;const w=eclipseWait(site,t0);assert.ok(w>0&&w<site.period,w);assert.equal(eclipsePhase(site,t0+w+.5).total,true);assert.equal(eclipseWait(site,t0+w+.5),0);assert.equal(eclipsePhase(site,t0+w-.5).total,false);
assert.ok(ECLIPSE_SECONDS>=5&&ECLIPSE_SECONDS<=12&&ECLIPSE_CUTOFF<1000);
// --- the save: fresh, migrated, kept, a later version only read
const fresh=normalizeSkySecrets(undefined);assert.equal(fresh.version,SKY_SECRETS_VERSION);assert.deepEqual(fresh.comets,{});assert.deepEqual(skyPagesFound(fresh),[]);
assert.deepEqual(keepComet(fresh,2,'2026-11-04'),{count:1,all:false});assert.equal(keepComet(fresh,2,'2026-11-05'),null,'once');assert.equal(keepComet(fresh,99,''),null);
assert.ok(cometFound(fresh,2));assert.deepEqual(skyPagesFound(fresh),['cometas']);
for(let i=0;i<COMET_COUNT;i++)keepComet(fresh,i,'2026-11-04');assert.equal(cometCount(fresh),50);assert.ok(orbitEarned(fresh)&&orbitOn(fresh));
fresh.wear.orbit=false;assert.equal(orbitOn(normalizeSkySecrets(structuredClone(fresh))),false,'taken off, kept off');
const old=normalizeSkySecrets({version:1,comets:{'1':'2026-01-01','x':'1','70':'2026-01-01'},probes:{'0':'bad'},coords:[{id:'coord:0',probe:0,kind:'cometa',target:'cometa:3',x:1,y:2},{id:'coord:0',probe:0,kind:'cometa',target:'cometa:3',x:1,y:2},{id:'z',kind:'otro'}],meteors:{n:4,caught:-1,mine:1},wear:{orbit:true,other:2},future:'kept'});
assert.deepEqual(old.comets,{'1':'2026-01-01'});assert.deepEqual(old.probes,{'0':''});assert.equal(old.coords.length,1);assert.equal(old.meteors.n,4);assert.equal(old.meteors.caught,0);assert.equal(old.meteors.mine,1);
assert.equal(old.future,'kept');assert.equal(old.wear.other,2);assert.equal('orbit' in old.wear,false);
const later=normalizeSkySecrets({version:2,comets:{'1':'x'},new:true});assert.equal(later.readOnly,true);assert.equal(later.version,2);assert.equal(keepComet(later,3,''),null);assert.equal(keepProbe(later,0,'',{}),null);
// --- probes give a coordinate towards somewhere that exists, never twice the same
const q=normalizeSkySecrets({});const sat=p=>({id:'sat:w:s',x:p.x+50000,y:p.y});
const c0=keepProbe(q,0,'2026-11-04',{asteroidFound:false,satellite:sat});assert.equal(c0.kind,'cometa');assert.ok(COMETS.some(c=>c.id===c0.target&&c.x===c0.x&&c.y===c0.y));
const c1=keepProbe(q,1,'2026-11-04',{asteroidFound:false,satellite:sat});assert.equal(c1.kind,'asteroide');assert.equal(c1.x,ASTEROID.x);
const c3=keepProbe(q,3,'2026-11-04',{asteroidFound:false,satellite:sat});assert.equal(c3.kind,'satelite');
const c5=keepProbe(q,5,'2026-11-04',{asteroidFound:false,satellite:sat});assert.equal(c5.kind,'cometa','the asteroid already pointed at: a crystal');assert.notEqual(c5.target,c0.target);
assert.equal(keepProbe(q,0,'',{}),null,'once');assert.ok(probeFound(q,0));assert.equal(q.coords.length,4);
assert.ok(probeTarget({comets:{},coords:[],coordsDone:[]},7,{asteroidFound:true})?.kind==='cometa','a found asteroid is never pointed at');
const done=fulfilCoord(q,'coord:1','2026-11-05');assert.equal(done.done,'2026-11-05');assert.equal(q.coords.length,3);assert.equal(q.coordsDone.length,1);assert.equal(fulfilCoord(q,'coord:1',''),null);
assert.deepEqual(skyPagesFound(q),['sondas']);
// --- English
for(const k of ['Lluvia de estrellas','Lluvia de estrellas. Pulsa a tiempo cuando pasen.','Lluvia de estrellas. Pasa por ellas.','{n} estrellas cazadas','{n} estrella cazada','Cristales de cometa','Cristal de cometa','Órbita de cometa','Llévala o quítala en Tu cubo','Juntaste los {n} cristales','Sondas perdidas','Sonda perdida','Guardaba una coordenada','Vacía','{n} encontradas','{n} encontrada','Coordenada · {}','Coordenada secreta','Mírala en el Mapa del universo','Coordenada cumplida','Una sonda guardaba esta coordenada.','La música se oscureció un momento.','Eclipse'])assert.ok(EN[k],k);
// --- no random numbers, sparks only for the showers and only by the universe's rule, the music untouched
const src=read('src/secretos-cielo.js')+read('src/secretos-cielo-model.js');
assert.ok(!/Math\.random|runtime\.rng|r\.rng|\brnd\(/.test(src),'no random number');assert.ok(!/fetch\(|XMLHttpRequest/.test(src),'no network');
assert.equal((read('src/secretos-cielo.js').match(/creditSparks\(/g)||[]).length,1,'one place pays: the shower');assert.ok(read('src/secretos-cielo.js').includes('meteorReward(')&&read('src/secretos-cielo-model.js').includes('universeReward('));
assert.ok(PROBE_GAIN<=.012&&METEOR_GAIN<=.02&&COMET_GAIN<=.02,'as quiet as the album of sounds');
assert.ok(!read('src/audio.js').includes('skySecret')&&!read('src/audio.js').includes('eclipse'),'audio.js untouched');
// --- wiring
const sw=read('sw.js');for(const m of ['"./src/secretos-cielo.js"','"./src/secretos-cielo-model.js"'])assert.equal(sw.split(m).length-1,1,m);
assert.ok(read('src/main.js').includes("import {initialize as secretosCielo} from './secretos-cielo.js';")&&read('src/main.js').includes('secretosCielo(runtime);'));
const render=read('src/render.js');for(const h of ['runtime.skySecretTick?.(dt,modal)','runtime.drawSkySecrets?.()','runtime.drawSkySecretCube?.('])assert.ok(render.includes(h),h);
for(const f of ['src/live-encounters.js','src/sky-map.js','src/descubrir.js','src/recorrer.js'])assert.ok(read(f).includes('r.skySecretBusy?.()'),'one scene at a time: '+f);
assert.ok(read('src/universe-map.js').includes('runtime.skySecretCoordsForMap?.()'));assert.ok(read('src/secretos.js').includes('r.skySecretRows?.()')&&read('src/secretos.js').includes('r.skySecretCubeOption?.()'));
console.log('PASS secretos del cielo: fifty comet crystals and twelve probes at fixed points (four crystals under 3 km), rare meteor showers past the cube (on time, or passing without sound) paying 10–15 ✦ near the origin, eclipses on the clock, coordinates to real places, save and migration, English, no random numbers, wiring');
