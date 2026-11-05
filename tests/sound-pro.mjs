// Sonido pro (alpha.266, alpha.267, alpha.268): fourteen sound families for the 52 genres, the ready profiles (tech house y
// minimal, house clásico and techno with their per-genre touches),
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
const HOUSE=['deep','chicago','soulful','garagehouse','acidhouse','progressive','tropical'];
assert.deepEqual(soundFamily('deep').genres,HOUSE,'house clásico, tropical included');assert.equal(soundFamily('tropical').id,'house');assert.ok(!soundFamily('organic').genres.includes('tropical'));
const TECHNO=['dub','acid','minimaltechno','detroit','melodictechno'];
assert.deepEqual(soundFamily('dub').genres,TECHNO,'techno, melodic techno included');assert.equal(soundFamily('melodictechno').id,'techno');assert.deepEqual(soundFamily('melodic').genres,['melodic','organic','andean']);
assert.deepEqual(convertedFamilies(),['house','tech','techno'],'three families converted: tech house y minimal, house clásico, techno');
for(const g of genres)assert.equal(convertedGenre(g),['techhouse','minimal','rominimal','microhouse',...HOUSE,...TECHNO].includes(g),g);
assert.equal(soundProfile('electro').ready,false);assert.equal(soundProfile('electro').family,'electro');assert.equal(soundProfile('nada').family,null);
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
assert.equal(kickPitch(110),55);assert.equal(kickPitch(110,50),55);assert.equal(kickPitch(0,50),50);assert.ok(Math.abs(Math.log2(kickPitch(98,50)/50))<.5);assert.equal(kickPitch(146.8),55,'D sits on its fifth (A), not at 73 Hz');assert.equal(kickPitch(0),52);
// ---------- the engine's contract ----------
function fakeAudio(){let made=0;const param=v=>({value:v,setValueAtTime(x){this.at=x;},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(x){this.target=x;},cancelScheduledValues(){}});
 const filters=[],oscs=[];const node=()=>{made++;const n={gain:param(1),frequency:param(1),Q:param(1),pan:param(0),detune:param(0),delayTime:param(0),playbackRate:param(1),threshold:param(0),ratio:param(1),attack:param(0),release:param(0),knee:param(0),connect:x=>x||n,disconnect(){},start(){},stop(){},curve:null};return n;};
 const ac={currentTime:1,sampleRate:8000,state:'running',createBuffer:(c,n)=>({length:n,data:Array.from({length:c},()=>new Float32Array(n)),getChannelData(i){return this.data[i];}})};
 for(const k of ['Gain','DynamicsCompressor','WaveShaper','Convolver','Delay','StereoPanner','BufferSource'])ac['create'+k]=node;
 ac.createBiquadFilter=()=>{const n=node();filters.push(n);return n;};ac.createOscillator=()=>{const n=node();n.setPeriodicWave=w=>{n.wave=w;};oscs.push(n);return n;};
 return {ac,made:()=>made,filters,oscs};}
function fakeRuntime({classic=false,genre='minimal',save=true}={}){let draws=0;const audio=fakeAudio(),headroom={gain:{value:.92,setTargetAtTime(v){this.target=v;}}};
 const r={S:{soundPro:{version:1,classic}},inWorld:()=>true,ac:audio.ac,bus:{},SIX:.12,MU:{step:0,dnaA:{key:'1,1',genre},radio:{hookI:'pluck',identity:{swing:.1}}},GEN:R.GEN,rnd:()=>{draws++;return .5;},hz:m=>440*Math.pow(2,(m-69)/12),root:()=>45,
  currentVoiceOrigin:'track',outputStage:{headroom},noiseBuffer:{},save:()=>save};
 initialize(r);return {r,audio,draws:()=>draws,headroom};}
{const {r,audio,draws}=fakeRuntime({classic:true});
 for(const id of ['kick','hat','clap','rim','shaker'])assert.equal(r.proDrum({gid:'minimal',DO:false},id,1.1,.2),false,'classic: '+id);
 assert.equal(r.proVoice('bajo','roll',45,1.1,.14,{key:'1,1',genre:'minimal'}),false);assert.equal(draws(),0);assert.equal(audio.made(),0,'classic builds nothing');assert.equal(r.proCeiling(),0);}
{const {r,audio,draws,headroom}=fakeRuntime();
 assert.equal(r.proDrum({gid:'dnb',DO:false},'kick',1.1,.26),false,'a classic family keeps audio.js');assert.equal(audio.made(),0);
 assert.equal(r.proDrum({gid:'minimal',DO:false},'kick',1.1,.26),true);assert.ok(audio.made()>0);
 for(const id of ['hat','hatO','clap','rim','shaker','wood','snare']){const before=draws();assert.equal(r.proDrum({gid:'minimal',DO:false},id,1.2,.03),true,id);assert.equal(draws()-before,CLASSIC_DRAWS[id],'same random draws as the classic '+id);}
 assert.equal(r.proDrum(null,'wood',1.3,.04),true,'a track accent without a drum context belongs to the region');
 r.currentVoiceOrigin='ambient';assert.equal(r.proDrum(null,'wood',1.3,.04),false,'other voices keep their sound');r.currentVoiceOrigin='track';
 assert.equal(r.proVoice('bajo','roll',45,1.2,.14,{key:'1,1',genre:'minimal'}),true);
 assert.equal(r.proVoice('bajo','roll',45,1.2,.14,{key:'2,2',genre:'electro'}),false);
 const kept=[0,1,2,3].map(i=>r.proVoice('lead','pluck',69+i,1.3+i*.1,.07,{key:'1,1',genre:'minimal'}));assert.deepEqual(kept,[true,true,true,true],'melody notes are taken (half of them silently)');
 assert.ok(r.soundProStats().voices===3,'two of four melody notes sound, plus the bass: '+JSON.stringify(r.soundProStats()));
 assert.equal(r.proCeiling(),16000);r.MU.step=16;r.proDrum({gid:'minimal',DO:false},'kick',3,.26);assert.ok(headroom.gain.target<.92&&headroom.gain.target>.75,'trim under a converted family');
 // Half-bar drop before a swap: the cue predicts it; kicks of every family are held, the rest plays.
 const frames=[];r.territoryJourneyCue=f=>frames.push(f);
 const cue=(bar,o)=>{r.MU.step=bar*16;r.territoryJourneyCue({time:bar*2,bar,primary:'1,1',secondary:'2,2',from:o.from,to:o.to,swap:!!o.swap});};
 r.MU.neighborRadio={key:'2,2',genre:'electro'};
 for(let b=0;b<16;b++)cue(b,{from:Math.min(.5,b*.05),to:Math.min(.55,(b+1)*.05)});
 assert.equal(frames.length,16,'a listener set later still hears every cue');
 r.MU.step=15*16+8;assert.equal(r.proDrum({gid:'electro',DO:true},'kick',30,.2),true,'the guest kick drops out');assert.equal(r.proDrum({gid:'minimal',DO:false},'kick',30,.2),true);
 assert.equal(r.proDrum({gid:'electro',DO:true},'hat',30,.02),false,'the guest hats keep playing classic');
 r.MU.step=15*16+2;assert.equal(r.proDrum({gid:'electro',DO:true},'kick',29,.2),false,'the first half of the bar plays');
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
 assert.equal(r.proVoice('acorde','organ',62,5,.05,{key:'1,1',genre:'dnb'}),false,'a classic family plays its own organ');
 // Progressive build: the pad opens over the 32-bar phrase.
 const cut=st=>{r.MU.step=st;const n=audio.filters.length;r.proVoice('acorde','organ',62,6,.05,pr);return audio.filters.slice(n).find(f=>f.frequency.at>0).frequency.at;};
 const early=cut(0),late=cut(16*22);assert.ok(late>early*4,'the build opens: '+early+' → '+late);assert.ok(cut(16*32)<late,'and closes for the next phrase');
 // Drawbars and tines as periodic waves when the context has them.
 r.ac.createPeriodicWave=(re,im)=>({im:Array.from(im)});r.MU.dnaA=deepReg;r.MU.radio={hookI:'organ'};before=audio.oscs.length;r.proVoice('lead','organ',64,7,.07,deepReg);assert.ok(audio.oscs.slice(before).some(o=>o.wave?.im?.length>4),'an organ drawbar wave');
 assert.equal(r.proCeiling(),16000,'the ceiling opens under house too');}
// DJ mix in and out of the family: a tech guest under house drops its kick before the swap, house as guest too.
{const {r}=fakeRuntime({genre:'deep'});r.MU.dnaA={key:'1,1',genre:'deep'};r.MU.neighborRadio={key:'2,2',genre:'techhouse'};
 r.proDrum({gid:'deep',DO:false},'kick',1,.26);r.proDrum({gid:'techhouse',DO:true},'kick',1,.2);
 for(let b=0;b<16;b++){r.MU.step=b*16;r.territoryJourneyCue({time:b*2,bar:b,primary:'1,1',secondary:'2,2',from:Math.min(.5,b*.05),to:Math.min(.55,(b+1)*.05),swap:false});}
 r.MU.step=15*16+8;assert.equal(r.proDrum({gid:'techhouse',DO:true},'kick',30,.2),true);assert.equal(r.proDrum({gid:'deep',DO:false},'kick',30,.26),true,'the house kick drops out too');
 assert.equal(r.proVoice('bajo','pluck',45,30,.17,{key:'1,1',genre:'deep'}),true,'the bass rests in the drop');assert.equal(r.soundProStats().voices,0);
 r.MU.step=16*16;r.territoryJourneyCue({time:32,bar:16,primary:'2,2',secondary:'1,1',from:.5,to:.4,swap:true});
 r.MU.step=16*16+1;assert.equal(r.proVoice('bajo','pluck',45,32.2,.17,{key:'1,1',genre:'deep'}),true,'after the swap house plays on as the guest');assert.equal(r.soundProStats().voices,1);
 r.S.soundPro.classic=true;assert.equal(r.proDrum({gid:'deep',DO:false},'kick',33,.26),false,'«Sonido clásico» turns house off too');assert.equal(r.proVoice('bajo','pluck',45,33,.17,{key:'1,1',genre:'deep'}),false);}
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
 assert.equal(r.proVoice('acorde','stab',57,4,.045,{key:'1,1',genre:'heart'}),false,'heart keeps the classic dub chord');
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
{const {r}=fakeRuntime({genre:'dub'});r.MU.dnaA={key:'1,1',genre:'dub'};r.MU.neighborRadio={key:'2,2',genre:'deep'};
 r.proDrum({gid:'dub',DO:false},'kick',1,.26);r.proDrum({gid:'deep',DO:true},'kick',1,.2);
 for(let b=0;b<16;b++){r.MU.step=b*16;r.territoryJourneyCue({time:b*2,bar:b,primary:'1,1',secondary:'2,2',from:Math.min(.5,b*.05),to:Math.min(.55,(b+1)*.05),swap:false});}
 r.MU.step=15*16+8;const h0=r.soundProStats().hits;assert.equal(r.proDrum({gid:'dub',DO:false},'kick',30,.26),true,'the techno kick drops out');assert.equal(r.soundProStats().hits,h0,'nothing sounds for it, rumble included');
 assert.equal(r.proVoice('bajo','sub',45,30,.17,{key:'1,1',genre:'dub'}),true,'the bass rests in the drop');assert.equal(r.soundProStats().voices,0);
 r.S.soundPro.classic=true;assert.equal(r.proDrum({gid:'dub',DO:false},'kick',33,.26),false,'«Sonido clásico» turns techno off too');assert.equal(r.proVoice('acorde','stab',57,33,.045,{key:'1,1',genre:'dub'}),false);}
// The setting saves, and a failed save restores it.
{const {r}=fakeRuntime({save:false});assert.equal(r.setSoundProClassic(true),false);assert.equal(r.S.soundPro.classic,false);
 const ok=fakeRuntime();assert.equal(ok.r.setSoundProClassic(true),true);assert.equal(ok.r.soundProClassic(),true);
 const old={S:{},inWorld:()=>true};initialize(old);assert.equal(old.soundProClassic(),false);assert.deepEqual(old.S.soundPro,{version:1,classic:false},'an old save gains the default');}
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
console.log('PASS sound families (52 genres, 14 families, tech, house and techno ready, per-genre touches, acid lines, rumble, tape echo, dub stab, chord kinds, builds), «Sonido clásico» save, DJ transitions from the journey, one-shots and the engine contract');
