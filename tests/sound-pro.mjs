// Sonido pro (alpha.266): fourteen sound families for the 52 genres, the first ready profile (tech house y minimal),
// the setting «Sonido clásico» and its save, the DJ transition planner mirrored from the journey, the one-shots, and the
// engine's contract with audio.js: off or for a classic family it plays nothing and draws no extra random number.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SOUND_FAMILIES,soundFamily,soundProfile,convertedGenre,convertedFamilies,CLASSIC_LEVEL,CLASSIC_DRAWS,normalizeSoundPro,soundProWritable,soundProClassic,SOUND_PRO_VERSION,guestFilter,GUEST_HIGHPASS,createTransitionTracker} from '../src/sound-profiles.js';
import {ONE_SHOTS,roomImpulse,kickPitch,biquad,initialize} from '../src/sound-pro.js';
import {createTerritoryJourney} from '../src/territory-journey.js';
import {initialize as data} from '../src/data.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
// ---------- families and mapping ----------
const R={};data(R);const genres=Object.keys(R.GEN);
assert.equal(genres.length,52);assert.equal(SOUND_FAMILIES.length,14);
const mapped=SOUND_FAMILIES.flatMap(f=>f.genres);assert.equal(mapped.length,52,'every genre once');assert.equal(new Set(mapped).size,52);
for(const g of genres)assert.ok(soundFamily(g),g);
assert.deepEqual(SOUND_FAMILIES.map(f=>f.name),['House clásico','Tech house y minimal','Techno','Melodic y orgánico','Afro y latino','Disco y funk','UK y breaks','Club de bajos','DnB y dubstep','Hip-hop','Electro','Ambient','Jazz','Experimental']);
assert.deepEqual(soundFamily('techhouse').genres,['techhouse','minimal','rominimal','microhouse']);
assert.deepEqual(convertedFamilies(),['tech'],'only the first family is converted in this batch');
for(const g of genres)assert.equal(convertedGenre(g),['techhouse','minimal','rominimal','microhouse'].includes(g),g);
assert.equal(soundProfile('deep').ready,false);assert.equal(soundProfile('deep').family,'house');assert.equal(soundProfile('nada').family,null);
assert.equal(soundProfile('minimal'),soundProfile('minimal'),'profiles are shared, not rebuilt per hit');
const tech=soundProfile('rominimal');assert.equal(tech.family,'tech');assert.ok(Object.isFrozen(tech)&&Object.isFrozen(tech.levels));
for(const id of Object.keys(CLASSIC_LEVEL))assert.ok(tech.levels[id]>0,id);
assert.ok(tech.lead.keep>=2,'less melody: one melody note in each two or more');
assert.ok(tech.sidechain.floor>0&&tech.sidechain.floor<1);
// The classic hits' own random draws (audio.js): hat 2 (tone, offset), noise hits 1, tones none.
assert.deepEqual(CLASSIC_DRAWS,{hat:2,hatO:2,shaker:1,rim:1,clap:1,snare:1,wood:1});
// ---------- the setting ----------
assert.deepEqual(normalizeSoundPro(undefined),{version:SOUND_PRO_VERSION,classic:false},'the new sound by default');
assert.deepEqual(normalizeSoundPro({classic:true,extra:3}),{classic:true,extra:3,version:1},'unknown fields kept');
assert.deepEqual(normalizeSoundPro({version:1,classic:'yes'}),{version:1,classic:false});
assert.deepEqual(normalizeSoundPro([1]),{version:1,classic:false});
const future={version:7,classic:true,more:1};assert.equal(normalizeSoundPro(future),future,'a later version is left untouched');
assert.equal(soundProWritable(future),false);assert.equal(soundProClassic(future),false,'a later version reads as the default');
assert.equal(soundProClassic(normalizeSoundPro({classic:true})),true);
// ---------- transitions: mirror the real journey ----------
{let last=-1;for(let w=0;w<=1;w+=.05){const f=guestFilter(w);assert.equal(f.highpass,GUEST_HIGHPASS);assert.ok(f.lowpass>=last);last=f.lowpass;}
 assert.equal(guestFilter(0).lowpass,700);assert.equal(guestFilter(.45).lowpass,20000);assert.equal(guestFilter(NaN).lowpass,700);}
function walk(fields){const j=createTerritoryJourney(),t=createTransitionTracker(),rows=[];
 fields.forEach((field,bar)=>{const f=j.advance(field,bar);rows.push({f,plan:t.advance({time:bar*2,bar,primary:f.primary.key,secondary:f.secondary?.key||null,from:f.from,to:f.to,swap:f.swap})});});return rows;}
{const A={key:'A'},B={key:'B'},C={key:'C'};
 // Stand in A; walk toward B (the field gives B half), cross into B, then on into C.
 const fields=[];for(let b=0;b<12;b++)fields.push({primary:A,secondary:null,mix:0,core:1});
 for(let b=12;b<30;b++)fields.push({primary:A,secondary:B,mix:Math.min(.5,(b-11)*.06),core:.5});
 for(let b=30;b<52;b++)fields.push({primary:B,secondary:b<40?A:C,mix:b<40?.2:.45,core:.5});
 for(let b=52;b<110;b++)fields.push({primary:C,secondary:null,mix:0,core:1});
 const rows=walk(fields),swaps=rows.filter(r=>r.f.swap).map(r=>r.f.bar||rows.indexOf(r));
 assert.ok(swaps.length>=2,'the walk swaps at least twice');
 for(const s of swaps){assert.equal(rows[s].plan.impact,true,'impact on the swap');assert.equal(rows[s-1].plan.drop,true,'the kick drops in the half bar before the swap');assert.equal(rows[s-2].plan.riser,2,'a two-bar riser before the swap');}
 rows.forEach((r,i)=>{if(r.plan.drop)assert.ok(rows[i+1]?.f.swap,'no drop without a swap next bar: '+i);if(r.plan.riser)assert.ok(rows[i+2]?.f.swap,'no riser without a swap two bars on: '+i);});
 // Phrases of 16 and 32 bars from the bar a region took over.
 const own=rows.filter(r=>!r.f.secondary&&r.f.primary.key==='C');assert.ok(own.length);
 for(const r of rows)if(r.plan.crash)assert.equal(r.plan.phrase%16,0);
 const s0=rows.findIndex(r=>r.f.swap&&r.f.primary.key==='C');assert.ok(s0>0);assert.equal(rows[s0+16].plan.crash,true);assert.equal(rows[s0+31].plan.sweep,true);
 // Going back in time (a new journey) starts over.
 const t=createTransitionTracker();t.advance({bar:40,primary:'A',secondary:null,from:0,to:0});assert.equal(t.advance({bar:3,primary:'A',secondary:null,from:0,to:0}).phrase,0);}
// ---------- one-shots ----------
{const sr=44100,k=tech.kit.kick;
 const shots={kick:ONE_SHOTS.kick(sr,52,k),hat:ONE_SHOTS.hat(sr,false,1.47),hatO:ONE_SHOTS.hat(sr,true,1.47),clap:ONE_SHOTS.clap(sr),snare:ONE_SHOTS.snare(sr),rim:ONE_SHOTS.rim(sr),shaker:ONE_SHOTS.shaker(sr),perc:ONE_SHOTS.perc(sr,300,.07),cowbell:ONE_SHOTS.cowbell(sr),crash:ONE_SHOTS.crash(sr)};
 for(const [id,d] of Object.entries(shots)){let pk=0;for(const x of d){assert.ok(Number.isFinite(x),id);pk=Math.max(pk,Math.abs(x));}assert.ok(Math.abs(pk-1)<1e-6,id+' is peak-normalized');assert.equal(Math.abs(d.at(-1))<.01,true,id+' ends at silence');}
 assert.deepEqual(Array.from(ONE_SHOTS.clap(sr).slice(0,64)),Array.from(shots.clap.slice(0,64)),'deterministic');
 assert.ok(shots.kick.length<=Math.ceil(.5*sr)&&shots.hat.length<shots.hatO.length);
 const ir=roomImpulse(sr,1.8);assert.equal(ir.length,2);assert.equal(ir[0].length,Math.round(1.8*sr));assert.ok(ir[0].slice(0,600).every(x=>x===0),'pre-delay');
 const lp=biquad('lowpass',1000,.7,sr);let y=0;for(let i=0;i<4000;i++)y=lp(1);assert.ok(Math.abs(y-1)<1e-3,'a lowpass passes DC');}
for(const hz of [55,61.7,65.4,73.4,82.4,98,110,130.8,146.8]){const f=kickPitch(hz);assert.ok(f>=36&&f<=75,hz+'→'+f);}
assert.equal(kickPitch(110),55);assert.equal(kickPitch(146.8),55,'D sits on its fifth (A), not at 73 Hz');assert.equal(kickPitch(0),52);
// ---------- the engine's contract ----------
function fakeAudio(){let made=0;const param=v=>({value:v,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(x){this.target=x;},cancelScheduledValues(){}});
 const node=()=>{made++;const n={gain:param(1),frequency:param(1),Q:param(1),pan:param(0),detune:param(0),delayTime:param(0),playbackRate:param(1),threshold:param(0),ratio:param(1),attack:param(0),release:param(0),knee:param(0),connect:x=>x||n,disconnect(){},start(){},stop(){},curve:null};return n;};
 const ac={currentTime:1,sampleRate:8000,state:'running',createBuffer:(c,n)=>({length:n,data:Array.from({length:c},()=>new Float32Array(n)),getChannelData(i){return this.data[i];}})};
 for(const k of ['Gain','DynamicsCompressor','WaveShaper','Convolver','BiquadFilter','Delay','StereoPanner','BufferSource','Oscillator'])ac['create'+k]=node;
 return {ac,made:()=>made};}
function fakeRuntime({classic=false,genre='minimal',save=true}={}){let draws=0;const audio=fakeAudio(),headroom={gain:{value:.92,setTargetAtTime(v){this.target=v;}}};
 const r={S:{soundPro:{version:1,classic}},inWorld:()=>true,ac:audio.ac,bus:{},SIX:.12,MU:{step:0,dnaA:{key:'1,1',genre},radio:{hookI:'pluck',identity:{swing:.1}}},GEN:R.GEN,rnd:()=>{draws++;return .5;},hz:m=>440*Math.pow(2,(m-69)/12),root:()=>45,
  currentVoiceOrigin:'track',outputStage:{headroom},noiseBuffer:{},save:()=>save};
 initialize(r);return {r,audio,draws:()=>draws,headroom};}
{const {r,audio,draws}=fakeRuntime({classic:true});
 for(const id of ['kick','hat','clap','rim','shaker'])assert.equal(r.proDrum({gid:'minimal',DO:false},id,1.1,.2),false,'classic: '+id);
 assert.equal(r.proVoice('bajo','roll',45,1.1,.14,{key:'1,1',genre:'minimal'}),false);assert.equal(draws(),0);assert.equal(audio.made(),0,'classic builds nothing');assert.equal(r.proCeiling(),0);}
{const {r,audio,draws,headroom}=fakeRuntime();
 assert.equal(r.proDrum({gid:'deep',DO:false},'kick',1.1,.26),false,'a classic family keeps audio.js');assert.equal(audio.made(),0);
 assert.equal(r.proDrum({gid:'minimal',DO:false},'kick',1.1,.26),true);assert.ok(audio.made()>0);
 for(const id of ['hat','hatO','clap','rim','shaker','wood','snare']){const before=draws();assert.equal(r.proDrum({gid:'minimal',DO:false},id,1.2,.03),true,id);assert.equal(draws()-before,CLASSIC_DRAWS[id],'same random draws as the classic '+id);}
 assert.equal(r.proDrum(null,'wood',1.3,.04),true,'a track accent without a drum context belongs to the region');
 r.currentVoiceOrigin='ambient';assert.equal(r.proDrum(null,'wood',1.3,.04),false,'other voices keep their sound');r.currentVoiceOrigin='track';
 assert.equal(r.proVoice('bajo','roll',45,1.2,.14,{key:'1,1',genre:'minimal'}),true);
 assert.equal(r.proVoice('bajo','roll',45,1.2,.14,{key:'2,2',genre:'acid'}),false);
 const kept=[0,1,2,3].map(i=>r.proVoice('lead','pluck',69+i,1.3+i*.1,.07,{key:'1,1',genre:'minimal'}));assert.deepEqual(kept,[true,true,true,true],'melody notes are taken (half of them silently)');
 assert.ok(r.soundProStats().voices===3,'two of four melody notes sound, plus the bass: '+JSON.stringify(r.soundProStats()));
 assert.equal(r.proCeiling(),16000);r.MU.step=16;r.proDrum({gid:'minimal',DO:false},'kick',3,.26);assert.ok(headroom.gain.target<.92&&headroom.gain.target>.75,'trim under a converted family');
 // Half-bar drop before a swap: the cue predicts it; kicks of every family are held, the rest plays.
 const frames=[];r.territoryJourneyCue=f=>frames.push(f);
 const cue=(bar,o)=>{r.MU.step=bar*16;r.territoryJourneyCue({time:bar*2,bar,primary:'1,1',secondary:'2,2',from:o.from,to:o.to,swap:!!o.swap});};
 r.MU.neighborRadio={key:'2,2',genre:'deep'};
 for(let b=0;b<16;b++)cue(b,{from:Math.min(.5,b*.05),to:Math.min(.55,(b+1)*.05)});
 assert.equal(frames.length,16,'a listener set later still hears every cue');
 r.MU.step=15*16+8;assert.equal(r.proDrum({gid:'deep',DO:true},'kick',30,.2),true,'the guest kick drops out');assert.equal(r.proDrum({gid:'minimal',DO:false},'kick',30,.2),true);
 assert.equal(r.proDrum({gid:'deep',DO:true},'hat',30,.02),false,'the guest hats keep playing classic');
 r.MU.step=15*16+2;assert.equal(r.proDrum({gid:'deep',DO:true},'kick',29,.2),false,'the first half of the bar plays');
 r.S.soundPro.classic=true;r.MU.step=16*16;r.proDrum({gid:'minimal',DO:false},'kick',31,.26);assert.equal(headroom.gain.target,.92,'«Sonido clásico» gives the trim back');}
// The setting saves, and a failed save restores it.
{const {r}=fakeRuntime({save:false});assert.equal(r.setSoundProClassic(true),false);assert.equal(r.S.soundPro.classic,false);
 const ok=fakeRuntime();assert.equal(ok.r.setSoundProClassic(true),true);assert.equal(ok.r.soundProClassic(),true);
 const old={S:{},inWorld:()=>true};initialize(old);assert.equal(old.soundProClassic(),false);assert.deepEqual(old.S.soundPro,{version:1,classic:false},'an old save gains the default');}
// ---------- wiring ----------
const audioSource=read('src/audio.js');
assert.equal(audioSource.split("proHit('").length-1,11,'one hook in each kit primitive');assert.ok(audioSource.includes("proHit(dec>=.1?'hatO':'hat',t,v)||noise("));
assert.ok(audioSource.includes("const proHit=(id,t,v,x)=>runtime.proDrum?.(drumCtx,id,t,v,x)===true;"));
assert.equal(audioSource.split('runtime.proVoice?.(').length-1,2,'bass and lead hooks');
assert.ok(audioSource.includes('runtime.proCeiling?.()||0'));
const sw=read('sw.js');for(const f of ['./src/sound-profiles.js','./src/sound-pro.js'])assert.equal(sw.split('"'+f+'"').length-1,1,f);
const html=read('index.html'),adv=html.slice(html.indexOf('<details id="musicAdvanced"'),html.indexOf('</details>',html.indexOf('<details id="musicAdvanced"')));
assert.ok(adv.includes('id="classicSound"')&&adv.includes('Sonido clásico'),'the setting lives in Sonido › Avanzado');
const en=read('src/i18n-en.js');assert.ok(en.includes('"Sonido clásico":"Classic sound"'));
assert.ok(read('src/main.js').includes("import {initialize as soundPro} from './sound-pro.js';"));
console.log('PASS sound families (52 genres, 14 families, tech ready), «Sonido clásico» save, DJ transitions from the journey, one-shots and the engine contract');
