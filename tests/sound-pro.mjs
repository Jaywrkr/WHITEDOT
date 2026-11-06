// Sonido pro (alpha.266, alpha.267, alpha.268): fourteen sound families for the 52 genres, the ready profiles (tech house y
// minimal, house clásico and techno with their per-genre touches),
// the setting «Sonido clásico» and its save, the DJ transition planner mirrored from the journey, the one-shots, and the
// engine's contract with audio.js: off or for a classic family it plays nothing and draws no extra random number.
// Alpha.270: the player's own voices through the engine and the arrangement's answer to the player.
// Alpha.271: «Melodic y orgánico» and «Afro y latino» (andean moves into it): plucks, flutes, strings, piano, chants, log drum.
// Alpha.276: the nine remaining families (disco, UK, club bass, DnB, hip-hop, electro, ambient, jazz, experimental).
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SOUND_FAMILIES,soundFamily,soundProfile,convertedGenre,convertedFamilies,CLASSIC_LEVEL,CLASSIC_DRAWS,normalizeSoundPro,soundProWritable,soundProClassic,SOUND_PRO_VERSION,guestFilter,GUEST_HIGHPASS,createTransitionTracker,dropBuild,phraseBuild,buildSeed,FAMILY_BUILDS,BUILD_KINDS,FILL_FIGURES,LANDINGS} from '../src/sound-profiles.js';
import {ONE_SHOTS,roomImpulse,kickPitch,biquad,initialize} from '../src/sound-pro.js';
import {createTerritoryJourney} from '../src/territory-journey.js';
// A region key whose drop into '2,2' at bar 16 rests the kick for the last half bar in this genre (dropBuild; Sonido limpio).
const halfDrop=(genre,to='2,2',bar=16)=>{for(let i=1;i<200;i++){const k='1,'+i;if(dropBuild(genre,buildSeed(k,to,bar)).kickFrom===8)return k;}throw Error('no half-bar drop for '+genre);};
import {initialize as data} from '../src/data.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
// ---------- families and mapping ----------
const R={};data(R);const genres=Object.keys(R.GEN);
assert.equal(genres.length,52);assert.equal(SOUND_FAMILIES.length,14);
const mapped=SOUND_FAMILIES.flatMap(f=>f.genres);assert.equal(mapped.length,52,'every genre once');assert.equal(new Set(mapped).size,52);
for(const g of genres)assert.ok(soundFamily(g),g);
assert.deepEqual(SOUND_FAMILIES.map(f=>f.name),['House clásico','Tech house y minimal','Techno','Melodic y orgánico','Afro y latino','Disco y funk','UK y breaks','Club de bajos','DnB y dubstep','Hip-hop','Electro','Ambient','Jazz','Experimental']);
assert.deepEqual(soundFamily('techhouse').genres,['techhouse','minimal','rominimal','microhouse']);
const HOUSE=['deep','chicago','soulful','garagehouse','acidhouse','progressive','tropical'];
assert.deepEqual(soundFamily('deep').genres,HOUSE,'house clásico, tropical included');assert.equal(soundFamily('tropical').id,'house');assert.ok(!soundFamily('organic').genres.includes('tropical'));
const TECHNO=['dub','acid','minimaltechno','detroit','melodictechno'];
assert.deepEqual(soundFamily('dub').genres,TECHNO,'techno, melodic techno included');assert.equal(soundFamily('melodictechno').id,'techno');
const MELODIC=['melodic','organic'],AFRO=['afro','tribal','amapiano','andean'];
assert.deepEqual(soundFamily('melodic').genres,MELODIC);assert.deepEqual(soundFamily('afro').genres,AFRO,'afro y latino, andean included');assert.equal(soundFamily('andean').id,'afro');
// Alpha.276: all fourteen families converted, so every one of the 52 genres has a pro profile.
assert.deepEqual(convertedFamilies(),SOUND_FAMILIES.map(f=>f.id),'all fourteen families converted');
for(const g of genres){const p=soundProfile(g);assert.equal(convertedGenre(g),true,g);assert.equal(p.family,soundFamily(g).id,g);assert.ok(p.ready&&p.kit&&p.bass&&p.lead&&p.chords&&p.levels&&p.sidechain,g+' a full profile');}
assert.equal(soundProfile('electro').ready,true);assert.equal(soundProfile('electro').family,'electro');assert.equal(soundProfile('nada').family,null);assert.equal(soundProfile('nada').ready,false,'an unknown genre keeps the classic sound');
assert.equal(soundProfile('minimal'),soundProfile('minimal'),'profiles are shared, not rebuilt per hit');
const tech=soundProfile('rominimal');assert.equal(tech.family,'tech');assert.ok(Object.isFrozen(tech)&&Object.isFrozen(tech.levels));
for(const id of Object.keys(CLASSIC_LEVEL))assert.ok(tech.levels[id]>0,id);
// House clásico: one family, a touch per genre; tech is untouched by it.
{const P=Object.fromEntries(HOUSE.map(g=>[g,soundProfile(g)]));
 for(const [g,p] of Object.entries(P)){assert.equal(p.family,'house',g);assert.equal(p.ready,true,g);assert.ok(Object.isFrozen(p.kit.kick)&&Object.isFrozen(p.lead),g+' frozen');
  for(const id of Object.keys(CLASSIC_LEVEL))assert.ok(p.levels[id]>0,g+' '+id);assert.equal(p.lead.keep,1,g+' keeps the whole melody');assert.ok(p.sidechain.floor>0&&p.sidechain.floor<1,g);
  for(const k of ['click','decay','drive','length','hold','tail'])assert.ok(p.kit.kick[k]>0,g+' kick '+k);}
 assert.equal(new Set(HOUSE.map(g=>P[g].kit.id)).size,HOUSE.length,'each genre its own kit (buffers do not collide)');
 assert.equal(P.acidhouse.bass.kind,'acid');assert.ok(P.acidhouse.bass.q>=10,'a resonant acid line');for(const g of HOUSE)if(g!=='acidhouse')assert.equal(P[g].bass.kind,'split',g);
 assert.ok(P.chicago.kit.kick.click>P.deep.kit.kick.click&&P.chicago.kit.kick.drive>P.deep.kit.kick.drive,'raw 909 against the soft deep kick');assert.equal(P.chicago.chords.kind,'stab');assert.equal(P.chicago.chords.map,null);
 assert.ok(P.deep.kit.kick.click<.3&&P.deep.chords.kind==='pad'&&P.deep.chords.map.rhodes==='pad');
 for(const g of ['soulful','garagehouse'])assert.equal(P[g].chords.kind,'organ',g);assert.ok(P.garagehouse.ghostHats>P.deep.ghostHats&&P.soulful.ghostHats>P.deep.ghostHats,'shuffled ghost hats');
 assert.ok(P.progressive.build&&P.progressive.build.bars===32&&P.progressive.build.high>P.progressive.build.low,'long builds');for(const g of HOUSE)if(g!=='progressive')assert.equal(P[g].build,null,g);
 assert.equal(P.tropical.lead.kind,'mallet');assert.equal(P.tropical.lead.map.steel,'mallet');assert.ok(P.tropical.ghostHats<P.garagehouse.ghostHats);
 assert.equal(P.deep.lead.map.organ,'organ','the family map survives a touch');assert.equal(P.soulful.lead.map.rhodes,'ep');
 assert.equal(tech.kit.id,undefined);assert.equal(tech.lead.keep,2);assert.equal(tech.lead.kind,'chop');assert.equal(tech.bass.kind,undefined,'tech keeps its split bass');}
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
 // A field stays under half until you cross (territoryField reaches .5 only on the line between two nuclei).
 for(let b=12;b<30;b++)fields.push({primary:A,secondary:B,mix:Math.min(.48,(b-11)*.06),core:.5});
 for(let b=30;b<52;b++)fields.push({primary:B,secondary:b<40?A:C,mix:b<40?.2:.45,core:.5});
 for(let b=52;b<110;b++)fields.push({primary:C,secondary:null,mix:0,core:1});
 const rows=walk(fields),swaps=rows.filter(r=>r.f.swap).map(r=>r.f.bar||rows.indexOf(r));
 assert.ok(swaps.length>=2,'the walk swaps at least twice');
 // Sonido limpio: no riser in the plan; a build is announced one and two bars ahead, with one seed for the build and its drop.
 for(const s of swaps){assert.equal(rows[s].plan.impact,true,'the drop lands on the swap');assert.equal(rows[s-1].plan.drop,true,'the drop bar before the swap');assert.equal(rows[s-1].plan.build,1);assert.equal(rows[s-2].plan.build,2,'the build is known two bars ahead');
  assert.ok(rows[s].plan.seed!==null&&rows[s].plan.seed===rows[s-1].plan.seed&&rows[s-1].plan.seed===rows[s-2].plan.seed,'one seed for the build and its drop');}
 rows.forEach((r,i)=>{assert.equal('riser' in r.plan,false,'no riser in any plan: '+i);assert.equal('sweep' in r.plan,false);if(r.plan.drop)assert.ok(rows[i+1]?.f.swap,'no drop without a swap next bar: '+i);if(r.plan.build===2&&!rows[i+2]?.f.swap)assert.equal(rows[i+1].plan.drop,false,'a guest that stops short of half gives no drop: '+i);if(!r.plan.build&&!r.plan.impact)assert.equal(r.plan.seed,null);});
 // Phrases of 16 and 32 bars from the bar a region took over.
 const own=rows.filter(r=>!r.f.secondary&&r.f.primary.key==='C');assert.ok(own.length);
 for(const r of rows)if(r.plan.crash)assert.equal(r.plan.phrase%16,0);
 const s0=rows.findIndex(r=>r.f.swap&&r.f.primary.key==='C');assert.ok(s0>0);assert.equal(rows[s0+16].plan.crash,true);assert.equal(rows[s0+31].plan.phraseEnd,true);assert.equal(rows[s0+30].plan.phraseEnd,false);
 // Going back in time (a new journey) starts over.
 const t=createTransitionTracker();t.advance({bar:40,primary:'A',secondary:null,from:0,to:0});assert.equal(t.advance({bar:3,primary:'A',secondary:null,from:0,to:0}).phrase,0);}
// ---------- builds into a drop (Sonido limpio) ----------
{assert.ok(!BUILD_KINDS.includes('riser'),'no riser among the builds');
 for(const f of SOUND_FAMILIES){const fb=FAMILY_BUILDS[f.id];assert.ok(fb&&fb.list.length>=4,f.id);for(const k of fb.list)assert.ok(BUILD_KINDS.includes(k),f.id+' '+k);
  assert.ok(new Set(fb.list).size>=3,f.id+': at least three different builds');assert.ok(fb.list.includes('none')||f.id==='house'||f.id==='disco'||f.id==='bass'||f.id==='dnb'||f.id==='electro'||f.id==='experimental'?true:false);
  assert.ok(fb.list.filter(k=>k==='reverse').length<=1,f.id+': a reversed cymbal is rare');}
 for(const f of SOUND_FAMILIES){const g=f.genres[0],seen=new Set(),lands=new Set(),figs=new Set();for(let i=0;i<400;i++){const b=dropBuild(g,buildSeed('a'+i,'b',i*8));assert.ok(BUILD_KINDS.includes(b.kind));assert.ok(LANDINGS.includes(b.land));seen.add(b.kind);lands.add(b.land);if(b.fill)figs.add(b.figure);
   assert.equal(b.fill!==null,b.kind==='fill');assert.equal(b.kickFrom,b.kind==='none'?null:b.kind==='dropout'?0:8);assert.equal(b.bars,b.kind==='filter'?2:1);}
  assert.ok(seen.size>=3,f.id+' varies its builds: '+[...seen]);assert.ok(lands.size>=2,f.id+' varies what lands');if(figs.size)assert.equal(figs.size,FILL_FIGURES.length,f.id+' plays every fill figure');}
 assert.ok(!Array.from({length:300},(_,i)=>dropBuild('ambient',buildSeed('x',i,i)).kind).includes('fill'),'ambient has no drums to fill with');
 const fams=new Set(Array.from({length:200},(_,i)=>dropBuild('techno',buildSeed('p','q',i*8)).kind));assert.ok(fams.has('none'),'some drops have no build at all');
 assert.deepEqual(dropBuild('dub',buildSeed('1,1','2,2',16)),dropBuild('dub',buildSeed('1,1','2,2',16)),'the same drop builds the same way');
 const consecutive=Array.from({length:12},(_,i)=>dropBuild('techhouse',buildSeed('1,'+i,'1,'+(i+1),8*(i+2))).kind);assert.ok(new Set(consecutive).size>=3,'a walk of drops does not repeat one build: '+consecutive);
 const ph=Array.from({length:120},(_,i)=>phraseBuild('deep',buildSeed('k','phrase',i)));assert.ok(ph.filter(b=>b.kind==='none').length>=40,'most phrase ends play no build');assert.ok(ph.every(b=>['none','fill','filter'].includes(b.kind)&&b.kickFrom===null&&b.land==='none'));}
// ---------- one-shots ----------
{const sr=44100,k=tech.kit.kick;
 const shots={kick:ONE_SHOTS.kick(sr,52,k),hat:ONE_SHOTS.hat(sr,false,1.47),hatO:ONE_SHOTS.hat(sr,true,1.47),clap:ONE_SHOTS.clap(sr),snare:ONE_SHOTS.snare(sr),rim:ONE_SHOTS.rim(sr),shaker:ONE_SHOTS.shaker(sr),perc:ONE_SHOTS.perc(sr,300,.07),cowbell:ONE_SHOTS.cowbell(sr),crash:ONE_SHOTS.crash(sr)};
 for(const [id,d] of Object.entries(shots)){let pk=0;for(const x of d){assert.ok(Number.isFinite(x),id);pk=Math.max(pk,Math.abs(x));}assert.ok(Math.abs(pk-1)<1e-6,id+' is peak-normalized');assert.equal(Math.abs(d.at(-1))<.01,true,id+' ends at silence');}
 assert.deepEqual(Array.from(ONE_SHOTS.clap(sr).slice(0,64)),Array.from(shots.clap.slice(0,64)),'deterministic');
 assert.ok(shots.kick.length<=Math.ceil(.5*sr)&&shots.hat.length<shots.hatO.length);
 const ir=roomImpulse(sr,1.8);assert.equal(ir.length,2);assert.equal(ir[0].length,Math.round(1.8*sr));assert.ok(ir[0].slice(0,600).every(x=>x===0),'pre-delay');
 const lp=biquad('lowpass',1000,.7,sr);let y=0;for(let i=0;i<4000;i++)y=lp(1);assert.ok(Math.abs(y-1)<1e-3,'a lowpass passes DC');}
for(const hz of [55,61.7,65.4,73.4,82.4,98,110,130.8,146.8]){const f=kickPitch(hz);assert.ok(f>=36&&f<=75,hz+'→'+f);}
assert.equal(kickPitch(110),55);assert.equal(kickPitch(110,50),55);assert.equal(kickPitch(0,50),50);assert.ok(Math.abs(Math.log2(kickPitch(98,50)/50))<.5);assert.equal(kickPitch(146.8),55,'D sits on its fifth (A), not at 73 Hz');assert.equal(kickPitch(0),52);
// ---------- the engine's contract ----------
function fakeAudio(){let made=0;const param=v=>({value:v,setValueAtTime(x){this.at=x;},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(x){this.target=x;},cancelScheduledValues(){}});
 const filters=[],oscs=[];const node=()=>{made++;const n={gain:param(1),frequency:param(1),Q:param(1),pan:param(0),detune:param(0),delayTime:param(0),playbackRate:param(1),threshold:param(0),ratio:param(1),attack:param(0),release:param(0),knee:param(0),connect:x=>{(n.to||=[]).push(x);return x||n;},disconnect(){},start(){},stop(){},curve:null};return n;};
 const ac={currentTime:1,sampleRate:8000,state:'running',createBuffer:(c,n)=>({length:n,data:Array.from({length:c},()=>new Float32Array(n)),getChannelData(i){return this.data[i];}})};
 for(const k of ['Gain','DynamicsCompressor','WaveShaper','Convolver','Delay','StereoPanner','BufferSource'])ac['create'+k]=node;
 ac.createBiquadFilter=()=>{const n=node();filters.push(n);return n;};ac.createOscillator=()=>{const n=node();n.setPeriodicWave=w=>{n.wave=w;};oscs.push(n);return n;};
 const all=[];const base=node;const track=()=>{const n=base();all.push(n);return n;};for(const k of ['Gain','DynamicsCompressor','WaveShaper','Convolver','Delay','StereoPanner','BufferSource'])ac['create'+k]=track;
 return {ac,made:()=>made,filters,oscs,all};}
function fakeRuntime({classic=false,genre='minimal',save=true}={}){let draws=0;const audio=fakeAudio(),headroom={gain:{value:.92,setTargetAtTime(v){this.target=v;}}};
 const r={S:{soundPro:{version:1,classic}},inWorld:()=>true,ac:audio.ac,bus:{},SIX:.12,MU:{step:0,dnaA:{key:'1,1',genre},radio:{hookI:'pluck',identity:{swing:.1}}},GEN:R.GEN,rnd:()=>{draws++;return .5;},hz:m=>440*Math.pow(2,(m-69)/12),root:()=>45,
  currentVoiceOrigin:'track',outputStage:{headroom},noiseBuffer:{},save:()=>save};
 initialize(r);return {r,audio,draws:()=>draws,headroom};}
{const {r,audio,draws}=fakeRuntime({classic:true});
 for(const id of ['kick','hat','clap','rim','shaker'])assert.equal(r.proDrum({gid:'minimal',DO:false},id,1.1,.2),false,'classic: '+id);
 assert.equal(r.proVoice('bajo','roll',45,1.1,.14,{key:'1,1',genre:'minimal'}),false);assert.equal(draws(),0);assert.equal(audio.made(),0,'classic builds nothing');assert.equal(r.proCeiling(),0);}
{const {r,audio,draws,headroom}=fakeRuntime();
 assert.equal(r.proDrum({gid:'nada',DO:false},'kick',1.1,.26),false,'a genre without a profile keeps audio.js');assert.equal(audio.made(),0);
 assert.equal(r.proDrum({gid:'minimal',DO:false},'kick',1.1,.26),true);assert.ok(audio.made()>0);
 for(const id of ['hat','hatO','clap','rim','shaker','wood','snare']){const before=draws();assert.equal(r.proDrum({gid:'minimal',DO:false},id,1.2,.03),true,id);assert.equal(draws()-before,CLASSIC_DRAWS[id],'same random draws as the classic '+id);}
 assert.equal(r.proDrum(null,'wood',1.3,.04),true,'a track accent without a drum context belongs to the region');
 r.currentVoiceOrigin='ambient';assert.equal(r.proDrum(null,'wood',1.3,.04),false,'other voices keep their sound');r.currentVoiceOrigin='track';
 assert.equal(r.proVoice('bajo','roll',45,1.2,.14,{key:'1,1',genre:'minimal'}),true);
 assert.equal(r.proVoice('bajo','roll',45,1.2,.14,{key:'2,2',genre:'nada'}),false);
 const kept=[0,1,2,3].map(i=>r.proVoice('lead','pluck',69+i,1.3+i*.1,.07,{key:'1,1',genre:'minimal'}));assert.deepEqual(kept,[true,true,true,true],'melody notes are taken (half of them silently)');
 assert.ok(r.soundProStats().voices===3,'two of four melody notes sound, plus the bass: '+JSON.stringify(r.soundProStats()));
 assert.equal(r.proCeiling(),16000);r.MU.step=16;r.proDrum({gid:'minimal',DO:false},'kick',3,.26);assert.ok(headroom.gain.target<.92&&headroom.gain.target>.75,'trim under a converted family');
 // Half-bar drop before a swap: the cue predicts it; kicks of every family are held, the rest plays.
 const K=halfDrop('minimal');   // a drop whose build rests the kick for the last half bar (dropBuild)
 r.MU.dnaA={key:K,genre:'minimal'};
 const frames=[];r.territoryJourneyCue=f=>frames.push(f);
 const cue=(bar,o)=>{r.MU.step=bar*16;r.territoryJourneyCue({time:bar*2,bar,primary:K,secondary:'2,2',from:o.from,to:o.to,swap:!!o.swap});};
 r.MU.neighborRadio={key:'2,2',genre:'nada'};
 for(let b=0;b<16;b++)cue(b,{from:Math.min(.5,b*.05),to:Math.min(.55,(b+1)*.05)});
 assert.equal(frames.length,16,'a listener set later still hears every cue');
 r.MU.step=15*16+8;assert.equal(r.proDrum({gid:'nada',DO:true},'kick',30,.2),true,'the guest kick drops out');assert.equal(r.proDrum({gid:'minimal',DO:false},'kick',30,.2),true);
 assert.equal(r.proDrum({gid:'nada',DO:true},'hat',30,.02),false,'the guest hats keep playing classic');
 r.MU.step=15*16+2;assert.equal(r.proDrum({gid:'nada',DO:true},'kick',29,.2),false,'the first half of the bar plays');
 r.S.soundPro.classic=true;r.MU.step=16*16;r.proDrum({gid:'minimal',DO:false},'kick',31,.26);assert.equal(headroom.gain.target,.92,'«Sonido clásico» gives the trim back');}
// House clásico through the engine: every kit hit, the acid line, each chord and melody kind, the organ chord hook.
{const {r,audio,draws}=fakeRuntime({genre:'acidhouse'});r.MU.radio={hookI:'organ',identity:{swing:.12}};
 for(const g of HOUSE){r.MU.dnaA={key:'5,'+g.length,genre:g};
  for(const id of ['kick','hat','hatO','clap','rim','shaker','wood','snare','conga','cowbell']){const before=draws();assert.equal(r.proDrum({gid:g,DO:false},id,1.2,id==='kick'?.26:.03,id==='conga'?190:undefined),true,g+' '+id);assert.equal(draws()-before,CLASSIC_DRAWS[id]||0,g+' '+id+' draws');}}
 const stats=r.soundProStats();assert.ok(stats.buffers>=HOUSE.length,'a kick per kit: '+stats.buffers);
 // Acid: a saw through a resonant low-pass; a close second note can slide.
 const reg={key:'7,7',genre:'acidhouse'};r.MU.dnaA=reg;let before=audio.oscs.length;
 for(let i=0;i<32;i++){r.MU.step=i;assert.equal(r.proVoice('bajo','acid',45+(i%3)*7,2+i*.12,.17,reg),true);}
 const acid=audio.oscs.slice(before).filter(o=>o.type==='sawtooth');assert.ok(acid.length===32,'one saw per acid note');
 const q=audio.filters.filter(f=>f.Q.value>=15);assert.ok(q.length>=32,'resonant filter on every acid note');
 const slides=acid.filter(o=>o.frequency.at&&o.frequency.at!==o.frequency.value);assert.ok(slides.length>0,'some notes slide');
 // Melody keeps every note; each instrument the composition chose has its own voice.
 const deepReg={key:'8,8',genre:'deep'};r.MU.dnaA=deepReg;r.MU.radio={hookI:'rhodes',identity:{swing:.12}};const v0=r.soundProStats().voices;
 for(let i=0;i<4;i++)assert.equal(r.proVoice('lead','rhodes',64+i,3+i*.2,.07,deepReg),true);assert.equal(r.soundProStats().voices-v0,4,'house plays the whole melody');
 for(const [g,ty] of [['deep','organ'],['soulful','organ'],['garagehouse','rhodes'],['chicago','rhodes'],['progressive','saw'],['tropical','steel'],['progressive','strings']]){const rg={key:'9,'+g,genre:g};r.MU.dnaA=rg;r.MU.radio={hookI:'pluck'};before=audio.made();assert.equal(r.proVoice('lead',ty,60,4,.02,rg),true,g+' '+ty);assert.ok(audio.made()>before,g+' '+ty+' builds a voice');}
 // A chord on the melody's own instrument (organ chords in garage, Rhodes in chicago) sounds as chords after its first note.
 {const rg={key:'10,10',genre:'deep'};r.MU.dnaA=rg;r.MU.radio={hookI:'organ'};const n0=audio.oscs.length;for(const m of [60,64,67])r.proVoice('lead','organ',m,8,.02,rg);
  assert.equal(audio.oscs.slice(n0).filter(o=>o.type==='sawtooth').length,6,'the melody note, then two pad notes');assert.equal(tech.syncChords,undefined,'tech keeps its melody rule');}
 // The organ chord (deep and progressive call it from audio.js) asks the engine as «acorde».
 const heard=[];r.recordInstrument=x=>heard.push(x);const pr={key:'6,6',genre:'progressive'};r.MU.dnaA=pr;
 assert.equal(r.proVoice('acorde','organ',62,5,.05,pr),true);assert.deepEqual(heard,['organ'],'the organ chord is still counted');
 assert.equal(r.proVoice('acorde','organ',62,5,.05,{key:'1,1',genre:'nada'}),false,'a genre without a profile plays its own organ');
 // Progressive build: the pad opens over the 32-bar phrase.
 const cut=st=>{r.MU.step=st;const n=audio.filters.length;r.proVoice('acorde','organ',62,6,.05,pr);return audio.filters.slice(n).find(f=>f.frequency.at>0).frequency.at;};
 const early=cut(0),late=cut(16*22);assert.ok(late>early*4,'the build opens: '+early+' → '+late);assert.ok(cut(16*32)<late,'and closes for the next phrase');
 // Drawbars and tines as periodic waves when the context has them.
 r.ac.createPeriodicWave=(re,im)=>({im:Array.from(im)});r.MU.dnaA=deepReg;r.MU.radio={hookI:'organ'};before=audio.oscs.length;r.proVoice('lead','organ',64,7,.07,deepReg);assert.ok(audio.oscs.slice(before).some(o=>o.wave?.im?.length>4),'an organ drawbar wave');
 assert.equal(r.proCeiling(),16000,'the ceiling opens under house too');}
// DJ mix in and out of the family: a tech guest under house drops its kick before the swap, house as guest too.
{const K=halfDrop('deep');const {r}=fakeRuntime({genre:'deep'});r.MU.dnaA={key:K,genre:'deep'};r.MU.neighborRadio={key:'2,2',genre:'techhouse'};
 r.proDrum({gid:'deep',DO:false},'kick',1,.26);r.proDrum({gid:'techhouse',DO:true},'kick',1,.2);
 for(let b=0;b<16;b++){r.MU.step=b*16;r.territoryJourneyCue({time:b*2,bar:b,primary:K,secondary:'2,2',from:Math.min(.5,b*.05),to:Math.min(.55,(b+1)*.05),swap:false});}
 r.MU.step=15*16+8;assert.equal(r.proDrum({gid:'techhouse',DO:true},'kick',30,.2),true);assert.equal(r.proDrum({gid:'deep',DO:false},'kick',30,.26),true,'the house kick drops out too');
 assert.equal(r.proVoice('bajo','pluck',45,30,.17,{key:K,genre:'deep'}),true,'the bass rests in the drop');assert.equal(r.soundProStats().voices,0);
 r.MU.step=16*16;r.territoryJourneyCue({time:32,bar:16,primary:'2,2',secondary:K,from:.5,to:.4,swap:true});
 r.MU.step=16*16+1;assert.equal(r.proVoice('bajo','pluck',45,32.2,.17,{key:K,genre:'deep'}),true,'after the swap house plays on as the guest');assert.equal(r.soundProStats().voices,1);
 r.S.soundPro.classic=true;assert.equal(r.proDrum({gid:'deep',DO:false},'kick',33,.26),false,'«Sonido clásico» turns house off too');assert.equal(r.proVoice('bajo','pluck',45,33,.17,{key:K,genre:'deep'}),false);}
// Techno: one family, a touch per genre; its own kick with rumble, the tape echo, the dub stab, a harder 303, strings and arps.
{const P=Object.fromEntries(TECHNO.map(g=>[g,soundProfile(g)]));
 for(const [g,p] of Object.entries(P)){assert.equal(p.family,'techno',g);assert.equal(p.ready,true,g);assert.ok(Object.isFrozen(p.rumble)&&Object.isFrozen(p.chords),g+' frozen');assert.equal(p.lead.keep,1,g);
  for(const id of Object.keys(CLASSIC_LEVEL))assert.ok(p.levels[id]>0,g+' '+id);assert.ok(p.rumble.level>0&&p.sidechain.floor>0&&p.sidechain.floor<1,g);}
 assert.equal(new Set(TECHNO.map(g=>P[g].kit.id)).size,TECHNO.length,'each genre its own kit');
 assert.ok(P.dub.chords.tape>=.5&&P.dub.chords.hall>=.5&&P.dub.chords.kind==='stab'&&P.dub.bass.sub>P.dub.bass.mid*2,'dub: stabs into tape and hall, a deep sub');
 assert.equal(P.acid.bass.kind,'acid');assert.ok(P.acid.bass.q>soundProfile('acidhouse').bass.q&&P.acid.bass.drive>soundProfile('acidhouse').bass.drive&&P.acid.kit.kick.click>soundProfile('acidhouse').kit.kick.click,'acid techno harder than acid house');
 assert.ok(P.minimaltechno.kit.kick.length<P.dub.kit.kick.length&&P.minimaltechno.room.rim<.1&&P.minimaltechno.rumble.level<P.acid.rumble.level,'minimal: dry and tight');
 assert.equal(P.detroit.chords.kind,'strings');assert.equal(P.detroit.chords.map.rhodes,'ep');assert.ok(P.detroit.kit.hatTone>=1.6&&P.detroit.ghostHats>P.acid.ghostHats,'909 hats');
 assert.equal(P.melodictechno.lead.kind,'arp');assert.ok(P.melodictechno.build?.bars===32&&P.melodictechno.chords.width>1.4,'big wide arps and pads');for(const g of TECHNO)if(g!=='melodictechno')assert.equal(P[g].build,null,g);
 const sr=8000,rb=ONE_SHOTS.rumble(sr,48,.45,P.acid.rumble);let pk=0,early=0;for(let i=0;i<rb.length;i++){pk=Math.max(pk,Math.abs(rb[i]));if(i<.03*sr)early=Math.max(early,Math.abs(rb[i]));}
 assert.ok(Math.abs(pk-1)<1e-6&&early===0&&Math.abs(rb.at(-1))<.01,'the rumble swells in after the hit and ends at silence');
 const {r,audio,draws}=fakeRuntime({genre:'dub'});r.MU.radio={hookI:'saw',identity:{swing:.05}};
 for(const g of TECHNO){r.MU.dnaA={key:'11,'+g.length+g[0],genre:g};const b0=r.soundProStats().hits;
  for(const id of ['kick','hat','hatO','clap','rim','shaker','wood','snare','tom','blip']){const before=draws();assert.equal(r.proDrum({gid:g,DO:false},id,1.2,id==='kick'?.26:.03,id==='tom'?90:id==='blip'?60:undefined),true,g+' '+id);assert.equal(draws()-before,CLASSIC_DRAWS[id]||0,g+' '+id+' draws');}
  assert.ok(r.soundProStats().hits>=11,g+' plays the kick with its rumble');}
 assert.ok(r.soundProStats().buffers>=2*TECHNO.length,'a kick and a rumble per kit');
 // The dub chord: «stab» as acorde, into the tape, not counted as an instrument; the classic family keeps its stab.
 const heard=[];r.recordInstrument=x=>heard.push(x);const dub={key:'12,12',genre:'dub'};r.MU.dnaA=dub;const g0=audio.made();
 for(const m of [57,60,64])assert.equal(r.proVoice('acorde','stab',m,4,.045,dub),true);assert.deepEqual(heard,[],'the stab is not an instrument');assert.ok(audio.made()-g0>=3*8,'three stab notes with their sends');
 assert.equal(r.proVoice('acorde','stab',57,4,.045,{key:'1,1',genre:'heart'}),true,'heart (ambient, alpha.276) plays the dub chord in the engine');
 // Harder acid: resonance above the acid house line.
 const ac={key:'13,13',genre:'acid'};r.MU.dnaA=ac;let before=audio.filters.length;for(let i=0;i<16;i++){r.MU.step=i;r.proVoice('bajo','acid',45+(i%2)*7,5+i*.12,.17,ac);}
 assert.ok(audio.filters.slice(before).filter(f=>f.Q.value>=20).length>=16,'a resonant 303 on every note');
 // Detroit strings and melodic techno arps: four saws each, the arp wide.
 for(const [g,ty,kind] of [['detroit','strings','strings'],['melodictechno','saw','arp'],['minimaltechno','keys','stab']]){const rg={key:'14,'+g,genre:g};r.MU.dnaA=rg;r.MU.radio={hookI:ty};before=audio.oscs.length;
  assert.equal(r.proVoice('lead',ty,64,6,.07,rg),true,g);const saws=audio.oscs.slice(before).filter(o=>o.type==='sawtooth').length;assert.equal(saws,kind==='stab'?2:4,g+' '+kind);}
 const mt={key:'15,15',genre:'melodictechno'};r.MU.dnaA=mt;r.MU.radio={hookI:'saw'};const cut=st=>{r.MU.step=st;const n=audio.filters.length;r.proVoice('acorde','strings',62,7,.05,mt);return audio.filters.slice(n).find(f=>f.frequency.at>0).frequency.at;};
 assert.ok(cut(16*22)>cut(0)*4,'melodic techno pads open over the phrase');
 assert.equal(r.proCeiling(),16000,'the ceiling opens under techno');}
// DJ mix out of techno into house and back: the techno kick drops before the swap.
{const K=halfDrop('dub');const {r}=fakeRuntime({genre:'dub'});r.MU.dnaA={key:K,genre:'dub'};r.MU.neighborRadio={key:'2,2',genre:'deep'};
 r.proDrum({gid:'dub',DO:false},'kick',1,.26);r.proDrum({gid:'deep',DO:true},'kick',1,.2);
 for(let b=0;b<16;b++){r.MU.step=b*16;r.territoryJourneyCue({time:b*2,bar:b,primary:K,secondary:'2,2',from:Math.min(.5,b*.05),to:Math.min(.55,(b+1)*.05),swap:false});}
 r.MU.step=15*16+8;const h0=r.soundProStats().hits;assert.equal(r.proDrum({gid:'dub',DO:false},'kick',30,.26),true,'the techno kick drops out');assert.equal(r.soundProStats().hits,h0,'nothing sounds for it, rumble included');
 assert.equal(r.proVoice('bajo','sub',45,30,.17,{key:K,genre:'dub'}),true,'the bass rests in the drop');assert.equal(r.soundProStats().voices,0);
 r.S.soundPro.classic=true;assert.equal(r.proDrum({gid:'dub',DO:false},'kick',33,.26),false,'«Sonido clásico» turns techno off too');assert.equal(r.proVoice('acorde','stab',57,33,.045,{key:K,genre:'dub'}),false);}
// Melodic y orgánico and afro y latino: two families, a touch per genre, each new instrument through the engine.
{const G=[...MELODIC,...AFRO],P=Object.fromEntries(G.map(g=>[g,soundProfile(g)]));
 for(const [g,p] of Object.entries(P)){assert.equal(p.family,MELODIC.includes(g)?'melodic':'afro',g);assert.equal(p.ready,true,g);assert.ok(Object.isFrozen(p.kit.kick)&&Object.isFrozen(p.lead.map),g+' frozen');assert.equal(p.lead.keep,1,g);
  for(const id of Object.keys(CLASSIC_LEVEL))assert.ok(p.levels[id]>0,g+' '+id);assert.ok(p.front>0&&p.front<1,g+' front');assert.ok(p.answer?.id,g+' answer');assert.ok(p.sidechain.floor>=.36,g+' a gentle pump');}
 assert.equal(new Set(G.map(g=>P[g].kit.id)).size,G.length,'each genre its own kit');
 assert.ok(P.organic.kit.kick.click<.2&&P.melodic.kit.kick.click<.3,'a soft round kick');assert.equal(P.melodic.lead.kind,'pluck');assert.ok(P.melodic.lead.echo>=.5&&P.melodic.chords.width>=1.6&&P.melodic.build?.bars===32,'plucks into the echo, wide pads that open');
 assert.equal(P.organic.lead.kind,'string');assert.ok(P.organic.kit.congaDecay>P.afro.kit.congaDecay,'organic hand drums ring longer');
 assert.equal(P.amapiano.bass.kind,'logdrum');assert.equal(P.amapiano.chords.kind,'piano');assert.equal(P.amapiano.lead.map.rhodes,'piano');assert.ok(P.amapiano.sidechain.floor>=.55);
 assert.equal(P.tribal.lead.kind,'chant');assert.equal(P.tribal.answer.id,'tom');assert.ok(P.tribal.kit.tomDecay>P.afro.kit.tomDecay&&P.tribal.levels.tom>=1,'tribal toms');
 assert.equal(P.andean.lead.kind,'flute');assert.equal(P.andean.lead.map.kalimba,'charango');assert.equal(P.andean.chords.kind,'charango');assert.ok(P.andean.kit.kick.skin>0&&P.andean.kit.kickHz<48&&P.andean.kit.kick.length>.6,'a bombo legüero');assert.equal(P.andean.answer.id,'wood');
 for(const g of G)if(g!=='melodic')assert.equal(P[g].build,null,g);
 // One-shots: the bombo's skin and the plucked string are finite, peak-normalized, end at silence; the kits before it do not move.
 const sr=8000;for(const d of [ONE_SHOTS.kick(sr,44,P.andean.kit.kick),ONE_SHOTS.string(sr,220,.5,1),ONE_SHOTS.string(sr,660,.8,1)]){let pk=0;for(const x of d){assert.ok(Number.isFinite(x));pk=Math.max(pk,Math.abs(x));}assert.ok(Math.abs(pk-1)<1e-6&&Math.abs(d.at(-1))<.01);}
 assert.deepEqual(Array.from(ONE_SHOTS.kick(sr,52,tech.kit.kick).slice(0,200)),Array.from(ONE_SHOTS.kick(sr,52,{...tech.kit.kick,skin:0}).slice(0,200)),'no skin, the same kick');
 {const d=ONE_SHOTS.string(44100,220,.5,.5);let best=0,lag=0;for(let L=120;L<300;L++){let c=0;for(let i=4000;i<12000;i++)c+=d[i]*d[i+L];if(c>best){best=c;lag=L;}}assert.ok(Math.abs(44100/lag-220)<3,'the string rings at its pitch: '+44100/lag);}
 const {r,audio,draws}=fakeRuntime({genre:'afro'});r.MU.radio={hookI:'marimba',identity:{swing:.1}};
 for(const g of G){r.MU.dnaA={key:'21,'+g,genre:g};
  for(const id of ['kick','hat','hatO','clap','rim','shaker','wood','snare','tom','conga','cowbell']){const before=draws();assert.equal(r.proDrum({gid:g,DO:false},id,1.2,id==='kick'?.26:.03,id==='tom'?90:id==='conga'?200:undefined),true,g+' '+id);assert.equal(draws()-before,CLASSIC_DRAWS[id]||0,g+' '+id+' draws');}}
 assert.ok(r.soundProStats().buffers>=G.length+4,'a kick per kit, toms and congas by skin');
 // Each genre's instruments: the melody kind (and its oscillators or buffers) for the composition's own hooks.
 const kinds=[['melodic','rhodes','pluck'],['melodic','strings','pad'],['organic','kalimba','mallet'],['organic','p_gutguitar','string'],['afro','marimba','mallet'],['afro','flute','flute'],['amapiano','rhodes','piano'],['tribal','organ','chant'],['tribal','marimba','mallet'],['andean','flute','flute'],['andean','kalimba','charango']];
 for(const [g,ty,kind] of kinds){const rg={key:'22,'+g+ty,genre:g};r.MU.dnaA=rg;r.MU.radio={hookI:ty};const o0=audio.oscs.length,f0=audio.filters.length,n0=audio.all.length;
  assert.equal(r.proVoice('lead',ty,64,6,.07,rg),true,g+' '+ty);const os=audio.oscs.slice(o0),fs=audio.filters.slice(f0),src=audio.all.slice(n0).filter(n=>n.buffer?.length>0);
  if(kind==='pluck')assert.ok(os.filter(o=>o.type==='sawtooth').length===2&&os.some(o=>o.type==='square'),g+' pluck');
  if(kind==='pad')assert.equal(os.filter(o=>o.type==='sawtooth').length,3,g+' pad');
  if(kind==='mallet')assert.equal(os.length,2,g+' mallet');
  if(kind==='flute')assert.ok(fs.some(f=>f.type==='bandpass'&&f.Q.value===1.6),g+' flute breath');
  if(kind==='string')assert.equal(src.length,1,g+' one string');
  if(kind==='charango')assert.equal(src.length,2,g+' a double course');
  if(kind==='piano')assert.ok(os.filter(o=>o.type==='sine').length===2&&os.length===3,g+' piano');
  if(kind==='chant')assert.equal(fs.filter(f=>f.Q.value===8).length,3,g+' three formants');}
 // Amapiano's log drum: the bass voice, a sine that drops onto the note with a triangle knock, gently driven.
 const am={key:'23,23',genre:'amapiano'};r.MU.dnaA=am;const o0=audio.oscs.length;assert.equal(r.proVoice('bajo','logdrum',45,7,.15,am),true);
 const ld=audio.oscs.slice(o0);assert.equal(ld.length,2);assert.ok(ld.some(o=>o.type==='triangle'),'the knock');assert.ok(Math.abs(ld.find(o=>o.type!=='triangle').frequency.at-110*2.1)<1,'it knocks in above the note');
 assert.equal(r.soundProStats().voices>=12,true);
 // Andean chords: charango strums, the low note first.
 {const rg={key:'24,24',genre:'andean'};r.MU.dnaA=rg;r.MU.radio={hookI:'flute'};const n0=audio.all.length;for(const m of [52,56,59])r.proVoice('lead','p_gutguitar',m,8,.03,rg);
  const at=audio.all.slice(n0).filter(n=>n.buffer?.length>0).map(n=>n.__at);assert.equal(at.length,6,'three double courses');assert.ok(at[0]<at[2]&&at[2]<at[4],'an upward strum');}
 // The groove layer answers with the family's drum: a tom in tribal, the wood in the Andes.
 for(const [g,id] of [['tribal','tom'],['andean','wood'],['afro','conga']]){const {r:q}=fakeRuntime({genre:g});q.MU.dnaA={key:'1,1',genre:g};Object.defineProperty(q,'influenceState',{get:()=>({values:{melody:0,groove:1,space:0,bass:0}})});
  const h0=q.soundProStats().hits;for(let s=0;s<64;s+=4){q.MU.step=s;q.proDrum({gid:g,DO:false},'kick',1+s*.12,.26);}assert.ok(q.soundProStats().hits-h0>=16+16+4,g+' the groove layer plays');assert.ok(q.soundProStats().buffers>=4,g+' and its '+id);}
 assert.equal(r.proCeiling(),16000,'the ceiling opens under these families');}
// The player in these families: touches through their own instruments, at their front share; the log drum for a bass element.
{const settle=()=>new Promise(res=>queueMicrotask(res));
 for(const [g,kind] of [['organic','string'],['amapiano','piano'],['andean','flute'],['tribal','chant']]){const {r,audio}=fakeRuntime({genre:g}),reg={key:'1,1',genre:g},bus={id:'bus '+g};r.MU.dnaA=reg;r.bus=bus;r.MU.radio={hookI:'x'};
  r.proDrum({gid:g,DO:false},'hat',1.9,.02);r.currentVoiceOrigin='player';const f0=audio.filters.length,n0=audio.all.length;assert.equal(r.proVoice('lead','pluck',67,2,.07,reg),true,g);await settle();
  const p=soundProfile(g),lv=.3*(p.output??1)*p.front;assert.ok(audio.all.some(n=>n.to?.includes(bus)&&Math.abs(n.gain.value-lv)<1e-9),g+' into the touch bus at its front level');
  if(kind==='chant')assert.equal(audio.filters.slice(f0).filter(f=>f.Q.value===8).length,3);if(kind==='string')assert.ok(audio.all.slice(n0).some(n=>n.buffer?.length>0));
  if(g==='amapiano'){const o0=audio.oscs.length;r.proVoice('bajo','logdrum',40,3,.15,reg);await settle();assert.ok(audio.oscs.slice(o0).some(o=>o.type==='triangle'),'a log drum for the player\'s bass');}
  r.S.soundPro.classic=true;assert.equal(r.proVoice('lead','pluck',67,4,.07,reg),false,'«Sonido clásico» '+g);}}
// DJ mix out of afro y latino into melodic and on into techno: the kick drops before each swap, «Sonido clásico» turns both off.
{const K=halfDrop('andean');const {r}=fakeRuntime({genre:'andean'});r.MU.dnaA={key:K,genre:'andean'};r.MU.neighborRadio={key:'2,2',genre:'melodic'};
 r.proDrum({gid:'andean',DO:false},'kick',1,.26);r.proDrum({gid:'melodic',DO:true},'kick',1,.2);
 for(let b=0;b<16;b++){r.MU.step=b*16;r.territoryJourneyCue({time:b*2,bar:b,primary:K,secondary:'2,2',from:Math.min(.5,b*.05),to:Math.min(.55,(b+1)*.05),swap:false});}
 r.MU.step=15*16+8;const h0=r.soundProStats().hits;assert.equal(r.proDrum({gid:'andean',DO:false},'kick',30,.26),true);assert.equal(r.proDrum({gid:'melodic',DO:true},'kick',30,.2),true);assert.equal(r.soundProStats().hits,h0,'both kicks drop out');
 assert.equal(r.proVoice('bajo','sub',45,30,.17,{key:K,genre:'andean'}),true,'the bass rests in the drop');assert.equal(r.soundProStats().voices,0);
 r.MU.step=16*16;r.territoryJourneyCue({time:32,bar:16,primary:'2,2',secondary:'3,3',from:.5,to:.4,swap:true});r.MU.dnaA={key:'2,2',genre:'melodic'};r.MU.neighborRadio={key:'3,3',genre:'dub'};
 r.MU.step=16*16+1;assert.equal(r.proVoice('bajo','sub',45,32.2,.17,{key:'2,2',genre:'melodic'}),true,'melodic takes the bass after the swap');assert.equal(r.soundProStats().voices,1);
 r.S.soundPro.classic=true;assert.equal(r.proDrum({gid:'melodic',DO:false},'kick',33,.26),false);assert.equal(r.proDrum({gid:'amapiano',DO:false},'kick',33,.26),false,'«Sonido clásico» turns these families off too');}
// Alpha.276: the nine remaining families. Every genre its own kit, each hit with the classic draws, each new bass and voice kind.
{const NINE=['disco','uk','bass','dnb','hiphop','electro','ambient','jazz','experimental'],G=NINE.flatMap(id=>SOUND_FAMILIES.find(f=>f.id===id).genres),P=Object.fromEntries(G.map(g=>[g,soundProfile(g)]));
 assert.equal(G.length,30,'thirty genres in the nine families');
 for(const [g,p] of Object.entries(P)){assert.equal(p.ready,true,g);assert.equal(p.beats,true,g+' the beat layer');assert.ok(p.front>0&&p.front<1,g+' front');assert.ok(p.answer?.id,g+' answer');assert.ok(p.output>0&&p.output<2,g+' output');
  for(const id of Object.keys(CLASSIC_LEVEL))assert.ok(p.levels[id]>0,g+' '+id);assert.ok(Object.isFrozen(p.kit)&&Object.isFrozen(p.lead.map),g+' frozen');}
 assert.equal(new Set(G.map(g=>P[g].kit.id)).size,G.length,'each genre its own kit');
 assert.equal(P.nudisco.bass.kind,'slap');assert.ok(P.nudisco.chords.phase>0&&P.nudisco.loop?.bars===8&&P.nudisco.warm>1,'disco: phased strings, a filtered loop, warm glue');assert.equal(P.electrofunk.bass.pop,0);assert.equal(P.electrofunk.lead.kind,'talkbox');
 assert.equal(P.breaks.bass.kind,'reese');assert.ok(P.breaks.kit.snareClap>0&&P.garage.ghostHats>P.breaks.ghostHats,'a layered break, the 2-step shuffle');
 assert.equal(P.trap.bass.kind,'boom');assert.ok(P.trap.bass.glide>0&&P.miamibass.kit.kick.length>=.9,'808 glide, the long Miami kick');assert.equal(P.ghetto.bass.kind,'split');
 assert.equal(P.dnb.bass.kind,'reese');assert.equal(P.dubstep.bass.kind,'wobble');assert.equal(P.liquid.bass.kind,'split');
 assert.ok(P.lofi.vinyl>0&&P.lofi.lead.wobble>0,'lo-fi vinyl and tape wobble');assert.equal(P.gfunk.lead.kind,'whine');
 assert.equal(P.electro.lead.kind,'vocoder');assert.ok(P.ebm.kit.snare.gate>0,'a gated EBM snare');
 assert.equal(P.ambient.lead.kind,'grain');assert.equal(P.berlin.lead.kind,'pluck');assert.ok(P.ambient.build?.bars===32);
 assert.equal(P.jazztronica.bass.kind,'upright');assert.ok(P.jazztronica.kit.brush&&P.jazztronica.kit.ride>0&&P.jazztronica.lead.kind==='sax','brushes, ride, sax');
 assert.ok(P.idm.stutter.p>0&&P.algorave.stutter.p>P.idm.stutter.p,'glitch stutters');
 // One-shots: the new ones are finite, peak-normalized and end at silence; the shared snare without a kit does not move.
 {const sr=8000;for(const d of [ONE_SHOTS.ride(sr),ONE_SHOTS.brush(sr),ONE_SHOTS.vinyl(sr,1),ONE_SHOTS.upright(sr,55),ONE_SHOTS.snare(sr,P.ebm.kit.snare)]){let pk=0;for(const x of d){assert.ok(Number.isFinite(x));pk=Math.max(pk,Math.abs(x));}assert.ok(Math.abs(pk-1)<1e-6&&Math.abs(d.at(-1))<.01);}
  assert.deepEqual(Array.from(ONE_SHOTS.snare(sr)),Array.from(ONE_SHOTS.snare(sr,undefined)),'the same snare without a kit');assert.ok(ONE_SHOTS.snare(sr,P.ebm.kit.snare).length<ONE_SHOTS.snare(sr).length,'the gate cuts the tail');}
 const {r,audio,draws}=fakeRuntime({genre:'nudisco'});r.MU.radio={hookI:'clav',identity:{swing:.1}};
 for(const g of G){r.MU.dnaA={key:'31,'+g,genre:g};
  for(const id of ['kick','hat','hatO','clap','rim','shaker','wood','snare','tom','conga','cowbell']){const before=draws();assert.equal(r.proDrum({gid:g,DO:false},id,1.2,id==='kick'?.26:.03,id==='tom'?90:id==='conga'?200:undefined),true,g+' '+id);assert.equal(draws()-before,CLASSIC_DRAWS[id]||0,g+' '+id+' draws');}}
 // Each bass kind: its own oscillators.
 for(const [g,ty,check] of [['nudisco','rubber',os=>os.some(o=>o.type==='square')&&os.some(o=>o.type==='triangle')],['electrofunk','machine',os=>!os.some(o=>o.type==='triangle')],
  ['breaks','reese',os=>os.filter(o=>o.type==='sawtooth').map(o=>o.detune.value).sort().join()==='-16,16'],['dubstep','reese',os=>os.some(o=>o.type==='triangle'&&o.frequency.value>0&&o.frequency.value<20)],
  ['trap','sub',os=>os.some(o=>o.type==='triangle')],['jazztronica','rubber',os=>os.length===1],['boombap','sub',os=>os.filter(o=>o.type==='sawtooth').length===2]]){
  const rg={key:'32,'+g,genre:g};r.MU.dnaA=rg;const o0=audio.oscs.length;assert.equal(r.proVoice('bajo',ty,45,3,.14,rg),true,g);assert.ok(check(audio.oscs.slice(o0)),g+' bass '+P[g].bass.kind);}
 {const rg={key:'33,33',genre:'trap'};r.MU.dnaA=rg;r.MU.step=0;let glides=0;for(let i=0;i<24;i++){r.MU.step=i*2;const o0=audio.oscs.length;r.proVoice('bajo','sub',40+(i%3)*3,4+i*.24,.14,rg);const o=audio.oscs.slice(o0).find(x=>x.type!=='triangle');if(o.frequency.at<440*Math.pow(2,(40+(i%3)*3-69)/12)*2)glides++;}assert.ok(glides>0,'some 808 notes glide');}
 // Each voice kind: the melody instrument of the composition through its family.
 const kinds=[['nudisco','clav',(os,fs)=>os.some(o=>o.type==='square')&&os.some(o=>o.type==='sawtooth')&&fs.some(f=>f.type==='peaking')],['boogie','brass',os=>os.filter(o=>o.type==='sawtooth').length===3],
  ['electrofunk','vocalform',(os,fs)=>fs.filter(f=>f.type==='bandpass'&&f.Q.value===6).length===3],['electro','vocalform',(os,fs)=>fs.filter(f=>f.type==='bandpass'&&f.Q.value===10).length===4],
  ['jazztronica','reed',(os,fs)=>fs.filter(f=>f.type==='bandpass'&&f.Q.value===4).length===3],['gfunk','saw',os=>os.some(o=>o.type==='sawtooth')&&os.some(o=>o.type==='sine')],
  ['detroitelectro','metalkeys',os=>os.length===2&&os.every(o=>o.type!=='sawtooth')],['ambient','x',os=>os.length===6],['idm','metalkeys',os=>os.length===2],['ghetto','vocalform',os=>os.length>0]];
 for(const [g,ty,check] of kinds){const rg={key:'34,'+g+ty,genre:g};r.MU.dnaA=rg;r.MU.radio={hookI:ty};const o0=audio.oscs.length,f0=audio.filters.length;
  assert.equal(r.proVoice('lead',ty,64,6,.07,rg),true,g+' '+ty);assert.ok(check(audio.oscs.slice(o0),audio.filters.slice(f0)),g+' '+ty+' voice');}
 assert.equal(r.proCeiling(),16000,'the ceiling opens under these families');
 r.S.soundPro.classic=true;for(const g of G)assert.equal(r.proDrum({gid:g,DO:false},'kick',40,.26),false,'«Sonido clásico» '+g);}
// A family without drums builds the engine from its first note (ambient, heart); the beat layer hangs ghosts on the beat; stutters.
{const {r,audio}=fakeRuntime({genre:'ambient'}),rg={key:'1,1',genre:'ambient'};r.MU.radio={hookI:'glass'};assert.equal(r.proVoice('lead','glass',64,1,.07,rg),true,'ambient sounds without a drum');assert.ok(audio.made()>0);
 assert.equal(r.proVoice('acorde','stab',57,1.5,.045,{key:'1,1',genre:'heart'}),true,'heart too');}
for(const [g,more] of [['garage',1.3],['idm',1.1],['lofi',1]]){const {r}=fakeRuntime({genre:g});r.MU.dnaA={key:'1,1',genre:g};const h0=r.soundProStats().hits;let n=0;
 for(let s=0;s<64;s+=2){r.MU.step=s;r.proDrum({gid:g,DO:false},'hat',1+s*.12,.03);n++;}assert.ok(r.soundProStats().hits-h0>n*more,g+' plays more than its hats: '+(r.soundProStats().hits-h0)+' for '+n);}
// The player in these families: touches through their instruments, at their front share.
{const settle=()=>new Promise(res=>queueMicrotask(res));
 for(const g of ['boogie','garage','footwork','liquid','lofi','robotic','downtempo','jazztronica','algorave']){const {r,audio}=fakeRuntime({genre:g}),reg={key:'1,1',genre:g},bus={id:'bus '+g};r.MU.dnaA=reg;r.bus=bus;r.MU.radio={hookI:'x'};
  r.proDrum({gid:g,DO:false},'hat',1.9,.02);r.currentVoiceOrigin='player';assert.equal(r.proVoice('lead','pluck',67,2,.07,reg),true,g);await settle();
  const p=soundProfile(g),lv=.3*(p.output??1)*p.front;assert.ok(audio.all.some(n=>n.to?.includes(bus)&&Math.abs(n.gain.value-lv)<1e-9),g+' into the touch bus at its front level');
  r.S.soundPro.classic=true;assert.equal(r.proVoice('lead','pluck',67,4,.07,reg),false,'«Sonido clásico» '+g);}}
// The setting saves, and a failed save restores it.
{const {r}=fakeRuntime({save:false});assert.equal(r.setSoundProClassic(true),false);assert.equal(r.S.soundPro.classic,false);
 const ok=fakeRuntime();assert.equal(ok.r.setSoundProClassic(true),true);assert.equal(ok.r.soundProClassic(),true);
 const old={S:{},inWorld:()=>true};initialize(old);assert.equal(old.soundProClassic(),false);assert.deepEqual(old.S.soundPro,{version:1,classic:false},'an old save gains the default');}
// ---------- the player inside the music (alpha.270) ----------
{const settle=()=>new Promise(res=>queueMicrotask(res));
 const {r,audio,draws}=fakeRuntime({genre:'techhouse'}),reg={key:'1,1',genre:'techhouse'},bus={id:'player bus'};r.MU.dnaA=reg;r.MU.dnaT=reg;r.bus=bus;
 // A touch's melody note: the family's lead (tech: a vocal chop, two vowel band-passes), into the bus it was given.
 r.proDrum({gid:'techhouse',DO:false},'hat',1.9,.02);r.currentVoiceOrigin='player';let f0=audio.filters.length;assert.equal(r.proVoice('lead','pluck',67,2,.07,reg),true,'a touch plays through the engine');
 assert.equal(audio.filters.length,f0,'it waits for the end of its burst');await settle();
 const chop=audio.filters.slice(f0);assert.equal(chop.length,2);assert.ok(chop.every(f=>f.Q.value===7),'a vocal chop');
 assert.ok(audio.all.some(n=>n.to?.includes(bus)&&n.gain.value===.3),'into the bus the touch was given (distance, effects), at the front level');assert.equal(r.soundProStats().front,1);
 // A chord element: the three notes struck together play the family's chord instrument (tech: a saw stab).
 f0=audio.filters.length;for(const m of [60,64,67])r.proVoice('lead','pluck',m,2.5,.03,reg);await settle();
 assert.deepEqual(audio.filters.slice(f0).map(f=>f.Q.value),[2,2,2],'struck together: a stab chord');
 // Bass and percussion elements, with the classic hit's random draws.
 assert.equal(r.proVoice('bajo','sub',40,3,.15,reg),true);await settle();assert.equal(r.soundProStats().front,5);
 for(const id of ['rim','shaker','hat','clap','kick','conga']){const d0=draws();assert.equal(r.proDrum(null,id,3.2,id==='kick'?.2:.04,id==='conga'?200:undefined),true,'a player '+id);assert.equal(draws()-d0,CLASSIC_DRAWS[id]||0,id+' draws');}
 r.currentVoiceOrigin='field';assert.equal(r.proVoice('lead','pluck',67,3.4,.07,reg),true,'a power calls the same way');await settle();
 // Other voices and other families keep their sound; «Sonido clásico» turns the player's voices back too.
 r.currentVoiceOrigin='ambient';assert.equal(r.proVoice('lead','pluck',67,4,.07,reg),false,'the ambient voices stay as they were');
 r.currentVoiceOrigin='player';assert.equal(r.proVoice('lead','pluck',67,4,.07,{key:'5,5',genre:'nada'}),false,'a genre without a profile plays its own voices');
 r.MU.dnaA={key:'5,5',genre:'nada'};assert.equal(r.proDrum(null,'rim',4,.04),false);r.MU.dnaA=reg;
 r.S.soundPro.classic=true;assert.equal(r.proVoice('lead','pluck',67,4,.07,reg),false);assert.equal(r.proDrum(null,'rim',4,.04),false);r.S.soundPro.classic=false;
 // A pulse on the beat: the theme's three notes come as ambient right after a new hit of the journey's pulse.
 const js={hits:0,misses:0};r.journeyPulseState=()=>({...js});r.currentVoiceOrigin='track';r.MU.step=1;r.proDrum({gid:'techhouse',DO:false},'hat',4.5,.02);
 r.currentVoiceOrigin='ambient';js.hits=1;assert.deepEqual([60,64,67,72].map((m,i)=>r.proVoice('lead','pluck',m,5+i*.24,.1,reg)),[true,true,true,false],'the theme note, its third and fifth');await settle();
 assert.ok(audio.all.filter(n=>n.gain.value===.28).length>=3,'each theme note throws a little into the echo');
 assert.equal(r.proVoice('lead','pluck',60,6,.1,reg),false,'no new hit, no theme');}
assert.equal(soundProfile('techhouse').front,undefined);assert.equal(soundProfile('deep').front,.75);assert.equal(soundProfile('melodictechno').front,.6,'the player\'s share of each family, by measurement');assert.equal(soundProfile('organic').front,.7);assert.equal(soundProfile('andean').front,.7);
// The arrangement answers the player's influence; idle, every factor is neutral.
{const pad=values=>{const {r,audio}=fakeRuntime({genre:'deep'}),reg={key:'1,1',genre:'deep'};r.MU.dnaA=reg;r.MU.radio={hookI:'organ'};r.bus={};if(values)Object.defineProperty(r,'influenceState',{get:()=>({values})});
  r.MU.step=4;r.proDrum({gid:'deep',DO:false},'kick',1,.26);const f0=audio.filters.length;r.proVoice('acorde','rhodes',60,1.1,.05,reg);return {cut:audio.filters.slice(f0)[0].frequency.at,r};};
 const idle=pad(null),zero=pad({melody:0,groove:0,space:0,bass:0}),open=pad({melody:1,groove:0,space:0,bass:0}),closed=pad({melody:-1,groove:0,space:0,bass:0});
 assert.equal(zero.cut,idle.cut,'no influence: the pad as composed');assert.equal(idle.r.soundProStats().shape.cut,1);
 assert.ok(open.cut>idle.cut*1.8,'the player\'s melody opens the pad');assert.ok(closed.cut<idle.cut*.8,'taking the melody away closes it');
 const beat=values=>{const {r}=fakeRuntime({genre:'techhouse'});r.MU.dnaA={key:'1,1',genre:'techhouse'};if(values)Object.defineProperty(r,'influenceState',{get:()=>({values})});
  let n=0;for(let s=0;s<64;s+=4){r.MU.step=s;const h0=r.soundProStats().hits;r.proDrum({gid:'techhouse',DO:false},'kick',1+s*.12,.26);n+=r.soundProStats().hits-h0;}return n;};
 const still=beat(null);assert.equal(beat({melody:0,groove:0,space:0,bass:0}),still,'idle: the same hits');assert.ok(beat({melody:0,groove:1,space:0,bass:0})>=still+16,'groove adds a percussion layer on the beats');}
// A streak of pulses on the beat (Sonido limpio, Jay: «sonidos espantosos»): no riser, no clap fill, no crash. The kicks
// sound exactly as without the streak; it still counts, and a miss breaks it.
{const run=withStreak=>{const {r,audio}=fakeRuntime({genre:'techhouse'}),js={hits:0,misses:0};r.MU.dnaA={key:'1,1',genre:'techhouse'};r.journeyPulseState=()=>({...js});
  const kick=s=>{r.MU.step=s;r.proDrum({gid:'techhouse',DO:false},'kick',1+s*.12,.26);};kick(0);const h0=r.soundProStats().hits,f0=audio.filters.length,n0=audio.all.length;
  for(let s=4;s<=64;s+=4){if(withStreak)js.hits++;kick(s);}
  return {r,js,kick,hits:r.soundProStats().hits-h0,filters:audio.filters.slice(f0),nodes:audio.all.slice(n0)};};
 const plain=run(false),streak=run(true);
 assert.ok(streak.r.soundProStats().streak>=12,'the streak counts');
 assert.ok(!streak.filters.some(f=>f.Q.value===2.2),'no riser');assert.ok(!streak.nodes.some(n=>n.buffer===streak.r.noiseBuffer),'no noise');
 assert.equal(streak.hits,plain.hits,'no fill, no crash: the same hits as without the streak');
 streak.js.misses++;streak.kick(72);assert.equal(streak.r.soundProStats().streak,0,'a miss breaks the streak');}
// Builds in the engine: across many drops of each family, no noise source and no riser filter; each kind sounds as it says.
{const kinds=new Map();
 for(const g of ['techhouse','deep','dub','melodic','afro','nudisco','garage','ghetto','dnb','boombap','electro','ambient','jazztronica','idm'])for(let i=1;i<=24;i++){
  const {r,audio}=fakeRuntime({genre:g}),K='3,'+i,to='4,'+i,b=dropBuild(g,buildSeed(K,to,16));r.MU.dnaA={key:K,genre:g};r.MU.neighborRadio={key:to,genre:'nada'};r.chordTones=()=>[57,60,64,67];
  r.proDrum({gid:g,DO:false},'kick',1,.26);if(g==='ambient')r.proVoice('acorde','pad',60,1,.05,r.MU.dnaA);
  const f0=audio.filters.length,n0=audio.all.length,h0=r.soundProStats().hits,v0=r.soundProStats().voices;
  for(let bar=0;bar<16;bar++){r.MU.step=bar*16;r.territoryJourneyCue({time:bar*2,bar,primary:K,secondary:to,from:Math.min(.5,bar*.05),to:Math.min(.55,(bar+1)*.05),swap:false});}
  const built=r.soundProStats().build,hits=r.soundProStats().hits-h0,voices=r.soundProStats().voices-v0;
  const sounded=st=>{r.MU.step=st;const h=r.soundProStats().hits;r.proDrum({gid:g,DO:false},'kick',30+st/100,.26);return r.soundProStats().hits-h;},early=sounded(15*16+2),late=sounded(15*16+10),hl=r.soundProStats().hits;
  r.MU.step=16*16;r.territoryJourneyCue({time:32,bar:16,primary:to,secondary:K,from:.5,to:.4,swap:true});const landed=r.soundProStats().hits-hl;
  assert.ok(!audio.filters.slice(f0).some(f=>f.Q.value===2.2),g+' '+b.kind+': no riser filter');assert.ok(!audio.all.slice(n0).some(n=>n.buffer===r.noiseBuffer),g+': no noise');
  if(b.kickFrom===null)assert.ok(late>0,g+': no build, the kick plays into the drop');else assert.equal(late,0,g+': the kick rests in the last half bar');
  assert.equal(early===0,b.kickFrom===0,g+' '+b.kind+': only a dropout rests the whole bar');
  if(b.kind==='fill'){assert.equal(built?.kind,'fill');assert.ok(hits>=FILL_FIGURES[b.figure].length,g+': a fill of '+FILL_FIGURES[b.figure].length+' hits, '+hits);}
  if(b.kind==='lift')assert.ok(voices>=8,g+': eight climbing notes');
  if(b.kind==='reverse')assert.ok(hits>=1,g+': a reversed cymbal');
  if(b.land==='crash'||b.land==='impact')assert.ok(landed>=1,g+': a crash lands');if(b.land==='none'||b.land==='sub')assert.equal(landed,0,g+': no crash lands');
  kinds.set(b.kind,(kinds.get(b.kind)||0)+1);}
 for(const k of ['fill','dropout','filter','lift','none'])assert.ok(kinds.get(k)>0,'the walk heard '+k);}
// ---------- wiring ----------
const audioSource=read('src/audio.js');
assert.equal(audioSource.split("proHit('").length-1,11,'one hook in each kit primitive');assert.ok(audioSource.includes("proHit(dec>=.1?'hatO':'hat',t,v)||noise("));
assert.ok(audioSource.includes("const proHit=(id,t,v,x)=>runtime.proDrum?.(drumCtx,id,t,v,x)===true;"));
assert.equal(audioSource.split('runtime.proVoice?.(').length-1,4,'bass, lead, organ chord and dub chord hooks');
assert.ok(audioSource.includes("  function dubChord(ct,t){const tri=ct.slice(0,3).map(n=>inRegister(n,45,65));if(!tri.every(m=>runtime.proVoice?.('acorde','stab',m,t,.045,MU.dnaA)))stab(tri,t,.35);}"),'the dub chord asks the engine first, same pitches, no random draw');
assert.ok(audioSource.includes("  function organChord(ct,t){ct.slice(0,3).forEach(n=>{const m=inRegister(n,48,71),v=vel(.05);if(!runtime.proVoice?.('acorde','organ',m,t,v,MU.dnaA))organ(m,t,v);});}"),'the organ chord asks the engine first, same pitch and velocity');
assert.ok(audioSource.includes('runtime.proCeiling?.()||0'));
const sw=read('sw.js');for(const f of ['./src/sound-profiles.js','./src/sound-pro.js'])assert.equal(sw.split('"'+f+'"').length-1,1,f);
const html=read('index.html'),adv=html.slice(html.indexOf('<details id="musicAdvanced"'),html.indexOf('</details>',html.indexOf('<details id="musicAdvanced"')));
assert.ok(adv.includes('id="classicSound"')&&adv.includes('Sonido clásico'),'the setting lives in Sonido › Avanzado');
const en=read('src/i18n-en.js');assert.ok(en.includes('"Sonido clásico":"Classic sound"'));
assert.ok(read('src/main.js').includes("import {initialize as soundPro} from './sound-pro.js';"));
console.log('PASS sound families (52 genres, 14 families, tech, house, techno, melodic y orgánico and afro y latino and the nine others ready, per-genre touches, slap, reese, wobble, 808 boom, upright, talkbox, vocoder, sax, whine, FM bells, grains, the beat layer, stutters, acid lines, rumble, tape echo, dub stab, chord kinds, builds, plucks, flutes, strings, piano, chants, log drum, bombo), «Sonido clásico» save, DJ transitions from the journey with varied builds and no noise riser, one-shots, the player inside the music (front voices, theme throws, influence, groove layer, a streak with no riser) and the engine contract');
