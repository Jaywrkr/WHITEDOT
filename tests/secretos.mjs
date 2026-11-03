// Secretos (alpha.244): the arrow code from keys and swipes, seven taps, the special places, the real dates (the full
// moon computed with no network), the save and its migration, no sparks, no random numbers, and the wiring.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SECRETS,secretById,ARROW_CODE,codeReader,swipeDirection,tapCounter,placesReached,ASTEROID,dateSecret,moonAge,fullMoonNear,SYNODIC_DAYS,
 normalizeSecrets,findSecret,secretFound,secretCount,goldEarned,goldOn,scaleNote,sequence,SECRETS_VERSION,CODE_EFFECT,FACE_SECONDS} from '../src/secretos-model.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
// --- the catalogue: unique ids, short lines, no person named
assert.equal(new Set(SECRETS.map(s=>s.id)).size,SECRETS.length);
for(const s of SECRETS){assert.ok(s.name.length<=24&&s.line.length<=48,s.id);assert.ok(!/luca|jay/i.test(s.name+s.line),s.id);}
assert.equal(CODE_EFFECT,20);assert.equal(FACE_SECONDS,10);
// --- the arrow code
const code=codeReader();let t=0,done=false;for(const d of ARROW_CODE)done=code.push(d,t+=200);assert.equal(done,true,'the eight arrows');
for(const d of ['up','up','up','down','down','left','right','left'])done=code.push(d,t+=200);assert.equal(done,false);assert.equal(code.push('right',t+=200),true,'↑↑↑ is still ↑↑');
for(const d of ARROW_CODE.slice(0,4))code.push(d,t+=200);t+=4000;for(const d of ARROW_CODE.slice(4))done=code.push(d,t+=200);assert.equal(done,false,'a long pause starts again');
assert.equal(swipeDirection(80,4,120),'right');assert.equal(swipeDirection(-80,10,120),'left');assert.equal(swipeDirection(5,-90,200),'up');assert.equal(swipeDirection(3,70,200),'down');
assert.equal(swipeDirection(10,8,100),null,'a tap is no swipe');assert.equal(swipeDirection(80,0,900),null,'a slow drag is no swipe');assert.equal(swipeDirection(70,60,100),null,'a diagonal is no swipe');
// --- seven taps
const taps=tapCounter();let got=false;for(let i=0;i<6;i++)got=taps.tap(i*300);assert.equal(got,false);assert.equal(taps.tap(1800),true);
for(let i=0;i<6;i++)taps.tap(5000+i*300);assert.equal(taps.tap(5000+5*300+2000),false,'a pause starts the count again');
// --- the special places: distances from the origin (10000 units to a km), the asteroid at its fixed point
assert.deepEqual(placesReached(900,900),[]);assert.deepEqual(placesReached(100,-100),['origen']);
assert.deepEqual(placesReached(420000,0),['km42']);assert.deepEqual(placesReached(0,-770001),['km42','km77']);assert.deepEqual(placesReached(600000,800000),['km42','km77','km100']);
assert.deepEqual(placesReached(ASTEROID.x+100,ASTEROID.y),['asteroide']);assert.ok(Math.hypot(ASTEROID.x,ASTEROID.y)/10000>4&&Math.hypot(ASTEROID.x,ASTEROID.y)/10000<4.3);
// --- the real dates, in the device's time zone
const at=(y,m,d,h=12)=>new Date(y,m-1,d,h);
assert.equal(dateSecret(at(2026,12,24)),'navidad');assert.equal(dateSecret(at(2026,12,25,23)),'navidad');assert.equal(dateSecret(at(2026,12,26)),null);
assert.equal(dateSecret(at(2026,12,31)),'anonuevo');assert.equal(dateSecret(at(2027,1,1,0)),'anonuevo');assert.equal(dateSecret(at(2027,1,2)),null);
assert.equal(dateSecret(at(2027,8,1,9)),'especial');assert.equal(dateSecret(at(2030,8,1,21)),'especial','every year');assert.equal(dateSecret(at(2027,8,2)),null);
assert.equal(dateSecret(new Date(NaN)),null);
// The full moon: known full moons (UTC) fall within the window; new moons do not.
for(const s of ['2024-04-23T23:49Z','2024-12-15T09:02Z','2025-01-13T22:27Z','2025-09-07T18:09Z','2026-01-03T10:03Z','2026-12-24T01:28Z'])assert.ok(fullMoonNear(Date.parse(s)),s);
for(const s of ['2024-04-08T18:21Z','2025-01-29T12:36Z','2026-11-09T07:02Z'])assert.ok(!fullMoonNear(Date.parse(s)),s);
assert.ok(moonAge(Date.parse('2024-04-08T18:21Z'))<1||moonAge(Date.parse('2024-04-08T18:21Z'))>SYNODIC_DAYS-1,'a new moon is near age 0');
const fullNight=new Date(Date.parse('2026-01-03T10:03Z'));fullNight.setHours(22,0,0,0);assert.ok(['luna',null].includes(dateSecret(fullNight)));
let nights=0;for(let d=0;d<60;d++){const x=new Date(2026,2,1+d,22);if(dateSecret(x)==='luna')nights++;}assert.ok(nights>=2&&nights<=6,'two or three nights a month: '+nights);
for(let d=0;d<60;d++)assert.notEqual(dateSecret(new Date(2026,2,1+d,13)),'luna','only at night');
// --- the save: fresh, migrated, kept, a later version only read; the dates keep no day (and so no year)
const fresh=normalizeSecrets(undefined);assert.equal(fresh.version,SECRETS_VERSION);assert.deepEqual(fresh.found,{});assert.equal(goldOn(fresh),false);
assert.equal(findSecret(fresh,'km42','2026-11-03'),true);assert.deepEqual(fresh.found.km42,{at:'2026-11-03'});assert.equal(findSecret(fresh,'km42','2026-11-04'),false,'once');
assert.equal(findSecret(fresh,'especial','2027-08-01'),true);assert.deepEqual(fresh.found.especial,{},'no year kept');assert.ok(!JSON.stringify(fresh).includes('2027'));
assert.equal(findSecret(fresh,'nada','2026-11-03'),false);
const old=normalizeSecrets({version:1,found:{km100:{at:'2026-01-02'},especial:{at:'2025-08-01'},zzz:{}},wear:{gold:false,other:1},mine:'kept'});
assert.equal(old.mine,'kept');assert.deepEqual(old.found,{km100:{at:'2026-01-02'},especial:{}},'a stored year is dropped, an unknown id too');assert.equal(goldEarned(old),true);assert.equal(goldOn(old),false);assert.equal(old.wear.other,1);
const on=normalizeSecrets({found:{km100:{at:'2026-01-02'}},wear:{gold:true}});assert.equal(goldOn(on),true);assert.equal('gold' in on.wear,false);
const later=normalizeSecrets({version:2,found:{x:1},future:true});assert.equal(later.readOnly,true);assert.equal(later.version,2);assert.equal(findSecret(later,'km42','2026-01-01'),false);
assert.equal(secretCount(fresh),2);assert.ok(secretFound(fresh,'km42'));assert.ok(secretById('asteroide'));
// --- sound: in the scale, inside the range
for(const d of [0,2,4,7,9,11,14,16]){const n=scaleNote([0,2,3,5,7,8,10],57,d);assert.ok(n>=36&&n<=96);}
assert.equal(scaleNote([0,2,4,5,7,9,11],57,7),69);
// --- drawing sequence: deterministic, in [0,1)
const a=sequence(7),b=sequence(7);for(let i=0;i<50;i++){const x=a();assert.equal(x,b());assert.ok(x>=0&&x<1);}
// --- no sparks, no random, no network, no person named, the music untouched
const src=read('src/secretos.js')+read('src/secretos-model.js');
assert.ok(!/Math\.random|runtime\.rng|r\.rng|\brnd\(/.test(src),'no random number');assert.ok(!/creditSparks|S\.sparks|universeReward/.test(src),'no sparks');assert.ok(!/fetch\(|XMLHttpRequest/.test(src),'no network');
assert.ok(!/['"`][^'"`]*\bLuca\b/.test(src),'Luca never named in a text');
// --- wiring
const sw=read('sw.js');for(const m of ['"./src/secretos.js"','"./src/secretos-model.js"'])assert.equal(sw.split(m).length-1,1,m);
assert.ok(read('src/main.js').includes("import {initialize as secretos} from './secretos.js';")&&read('src/main.js').includes('secretos(runtime);'));
const render=read('src/render.js');for(const h of ['runtime.secretTick?.(dt,modal)','runtime.drawSecrets?.()','runtime.drawSecretCube?.('])assert.ok(render.includes(h),h);
assert.ok(read('src/journal.js').includes('runtime.secretSection?.()'));
const html=read('index.html');for(const id of ['cubeSecretSection','cubeSecretOptions','menuAvatar','w'])assert.equal(html.split(`id="${id}"`).length-1,1,id);
assert.ok(!read('src/audio.js').includes('secret'),'audio.js untouched');
console.log('PASS secretos: arrow code from keys and swipes, seven taps, origin, 42/77/100 km and the asteroid, Christmas, New Year, 1 August and the real full moon at night, save and migration (no year kept), no sparks or random numbers, wiring');
