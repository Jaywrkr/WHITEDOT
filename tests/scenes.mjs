// Escenas musicales (alpha.241): the model (stages by hashKey, the hand, the arc, the patterns on the chord), the setting
// and its save, and the module's contract: off, it builds nothing and draws no random number; on, at a stage, its voices
// play on a bus of their own, on chord tones, and leaving lets the bus go.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SCENES,sceneById,scenesFor,sceneWorldKey,normalizeScenes,scenesOn,scenesWritable,stageProximity,stageInZone,stagesNear,handFor,arcAt,filterAt,acidLine,metalSteps,congaPattern,bongoSteps,bassSteps,chopSteps,
 SCENES_VERSION,STAGE_HEAR,STAGE_FULL,NEAR_SHARE,FAR_SHARE,UNITS_PER_KM,ZONE_REGIONS,HAT_PATTERNS,VOWELS,SECTION_LEVEL,SCENE_BUILDS,sceneBuild} from '../src/scenes-model.js';
import {initialize} from '../src/scenes.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
// ---------- the scenes ----------
assert.deepEqual(SCENES.map(s=>s.id),['almacen','patio']);
assert.equal(sceneById('almacen').line,'Escena · Almacén');assert.equal(sceneById('patio').line,'Escena · Patio latino');
for(const g of ['acid','minimaltechno','ebm','minimal'])assert.ok(scenesFor(g).some(s=>s.id==='almacen'),g);
for(const g of ['techhouse','minimal','deep','afro'])assert.ok(scenesFor(g).some(s=>s.id==='patio'),g);
for(const g of ['ambient','dnb','dub','boombap'])assert.equal(scenesFor(g).length,0,g);
// ---------- the setting ----------
assert.deepEqual(normalizeScenes(undefined),{version:SCENES_VERSION,on:false});
assert.deepEqual(normalizeScenes({on:true,extra:7}),{on:true,extra:7,version:1},'unknown fields are kept');
assert.deepEqual(normalizeScenes({version:1,on:'yes'}),{version:1,on:false});
const future={version:9,on:true,thing:1};assert.equal(normalizeScenes(future),future,'a later version is left untouched');
assert.equal(scenesOn(future),false);assert.equal(scenesWritable(future),false);assert.equal(scenesOn(normalizeScenes({version:1,on:true})),true);
// ---------- the stages ----------
assert.equal(stageProximity(STAGE_HEAR),0);assert.equal(stageProximity(STAGE_HEAR+1),0);assert.equal(stageProximity(STAGE_FULL),1);assert.equal(stageProximity(0),1);
{let last=1;for(let d=STAGE_FULL;d<=STAGE_HEAR;d+=100){const p=stageProximity(d);assert.ok(p<=last+1e-12&&p>=0);last=p;}}
const RP=3600,zp=RP*ZONE_REGIONS;
// A world with all land and every genre in bands: the share of zones with a stage, near and far.
const GENRES=['minimal','techhouse','acid','deep','ambient','afro','ebm','dnb'];
const under=(x,y)=>({genre:GENRES[((Math.floor(x/RP)%8)+8)%8],sea:false});
let nearZones=0,nearStages=0,farZones=0,farStages=0;const world=sceneWorldKey({seed:'test'});
for(let zx=-60;zx<60;zx++)for(let zy=-60;zy<60;zy++){const far=Math.hypot((zx+.5)*zp,(zy+.5)*zp)>5*UNITS_PER_KM,s=stageInZone(world,zx,zy,under,RP);
 if(far){farZones++;if(s)farStages++;}else{nearZones++;if(s)nearStages++;}
 if(s){assert.ok(s.x>=zx*zp&&s.x<(zx+1)*zp&&s.y>=zy*zp&&s.y<(zy+1)*zp,'inside its zone');assert.ok(scenesFor(s.genre).some(c=>c.id===s.scene));assert.equal(under(s.x,s.y).genre,s.genre);
  assert.deepEqual(stageInZone(world,zx,zy,under,RP),s,'the same stage every time');}}
const nearShare=nearStages/nearZones,farShare=farStages/farZones;
assert.ok(nearShare>.04&&nearShare<NEAR_SHARE+.04,'about one zone in ten near the origin: '+nearShare);
assert.ok(farShare>.1&&farShare<FAR_SHARE+.03&&farShare>nearShare,'about one in six beyond 5 km: '+farShare);
// The sea and genres without a scene have no stage.
for(let zx=0;zx<200;zx++){assert.equal(stageInZone(world,zx,3,()=>({genre:'minimal',sea:true}),RP),null);assert.equal(stageInZone(world,zx,3,()=>({genre:'ambient',sea:false}),RP),null);}
// Another world has other stages.
{const other=sceneWorldKey({seed:'other'});let same=0,n=0;for(let zx=0;zx<80;zx++)for(let zy=0;zy<20;zy++){const a=stageInZone(world,zx,zy,under,RP),b=stageInZone(other,zx,zy,under,RP);if(a||b){n++;if(a&&b&&a.x===b.x)same++;}}assert.ok(n>20&&same<n/4);}
// Near: sorted by distance, all within the radius.
{let found=null;for(let zx=0;zx<80&&!found;zx++)for(let zy=0;zy<80&&!found;zy++)found=stageInZone(world,zx,zy,under,RP);
 const list=stagesNear(world,{x:found.x+300,y:found.y},STAGE_HEAR,under,RP);assert.equal(list[0].id,found.id);for(const s of list)assert.ok(Math.hypot(s.x-found.x-300,s.y-found.y)<=STAGE_HEAR);}
// ---------- the hand and the arc ----------
const hands=Array.from({length:200},(_,i)=>handFor('scene:v1:t:'+i,i%2?'patio':'almacen'));
assert.ok(hands.every(h=>(h.arc===32||h.arc===64)&&(h.fill===8||h.fill===16)&&h.hats>=0&&h.hats<HAT_PATTERNS.length));
assert.ok(new Set(hands.map(h=>h.arc)).size===2&&new Set(hands.map(h=>h.fill)).size===2&&new Set(hands.map(h=>h.hats)).size===HAT_PATTERNS.length,'hands differ');
for(const h of hands.filter(h=>h.scene==='patio'))assert.ok(h.swing>=.1&&h.swing<=.22&&VOWELS[h.voice]);
for(const h of hands.filter(h=>h.scene==='almacen'))assert.ok(h.swing>=0&&h.swing<=.03&&h.resonance>=11&&h.resonance<=18);
for(const len of [32,64]){const h={...hands[0],arc:len};const seen=[];
 for(let b=0;b<len;b++){const a=arcAt(h,b);if(seen.at(-1)!==a.section)seen.push(a.section);assert.ok(a.level>0&&a.level<=1);}
 assert.deepEqual(seen,['intro','build','drop','breakdown','return'],'intro → build → drop → breakdown → return');
 const drop=Array.from({length:len},(_,b)=>arcAt(h,b)).filter(a=>a.drop);assert.equal(drop.length,2,'two drops: the drop and the return');
 const risers=Array.from({length:len},(_,b)=>arcAt(h,b)).filter(a=>a.riserStart);assert.equal(risers.length,2,'a build before each drop (the arc keeps its riser flag; no noise riser sounds)');
 for(const a of risers)assert.ok(['build','breakdown'].includes(a.section));
 assert.equal(arcAt(h,len).cycle,1);assert.equal(arcAt(h,len).section,'intro');
 const build=Array.from({length:len},(_,b)=>arcAt(h,b)).filter(a=>a.section==='build');assert.ok(build.at(-1).level>build[0].level+.25,'the build climbs');
 assert.equal(arcAt(h,len*.375).level,SECTION_LEVEL.drop);
 for(const fills of [8,16]){const hh={...h,fill:fills},bars=Array.from({length:len},(_,b)=>arcAt(hh,b)).filter(a=>a.fill).map(a=>a.bar);assert.ok(bars.length>=1&&bars.every(b=>(b+1)%fills===0));}}
{const h=hands.find(h=>h.scene==='almacen');const lows=[0,4,8,9,12].map(b=>filterAt(h,arcAt(h,b)));assert.ok(lows[3]>=lows[2]&&filterAt(h,arcAt(h,h.arc*.375))===18000,'the low-pass opens on the drop');
 const p=hands.find(h=>h.scene==='patio');assert.equal(filterAt(p,arcAt(p,p.arc*.375)),20,'the high-pass opens on the drop');assert.ok(filterAt(p,arcAt(p,0))>=600);}
// ---------- patterns: new each cycle, always on chord tones ----------
{const h=hands[0],lines=Array.from({length:12},(_,c)=>JSON.stringify(acidLine(h,c)));assert.ok(new Set(lines).size>=11,'a new acid line each arc');
 for(let c=0;c<20;c++){const l=acidLine(h,c);assert.equal(l.length,16);assert.ok(l[0].on);for(const s of l)assert.ok(s.tone>=0&&s.tone<5);
  assert.ok(metalSteps(h,c).length>=1);const cp=congaPattern(h,c);assert.ok(cp.length>=8&&cp.every(([s,d,k])=>s>=0&&s<16&&['conga','tumba'].includes(d)&&['open','mute','slap','ghost'].includes(k)));
  assert.ok(bongoSteps(h,c).length>=8);assert.ok(bassSteps(h,c).every(([s,t])=>s%2===0?s%4===2:true)&&bassSteps(h,c).every(([,t])=>t===0||t===2));
  for(const k of chopSteps(h,c))assert.ok(VOWELS[k.from]&&VOWELS[k.to]&&k.tone>=2&&k.tone<5&&(k.len===1||k.len===2));}
 assert.ok(new Set(Array.from({length:12},(_,c)=>JSON.stringify(congaPattern(hands[1],c)))).size>=4,'congas vary');}
// No random sequence anywhere in the scenes.
for(const f of ['src/scenes-model.js','src/scenes.js','src/scenes-audio.js'])assert.ok(!/Math\.random|\brnd\(|runtime\.rng|r\.rng|\.vel\(/.test(read(f)),f+' draws no random number');
// ---------- the module ----------
// A tiny fake Web Audio: every node counts itself.
function fakeAudio(){const made=[];let starts=0;const param=v=>({value:v,events:[],setValueAtTime(x,t){this.events.push(['set',x,t]);},linearRampToValueAtTime(x,t){this.events.push(['lin',x,t]);},exponentialRampToValueAtTime(x,t){assert.ok(x>0);this.events.push(['exp',x,t]);},setTargetAtTime(x,t,k){this.events.push(['target',x,t,k]);},cancelScheduledValues(){}});
 const node=kind=>{const n={kind,connected:[],gain:param(1),frequency:param(440),Q:param(1),detune:param(0),delayTime:param(0),playbackRate:param(1),threshold:param(0),knee:param(0),ratio:param(1),attack:param(0),release:param(0),connect(x){this.connected.push(x);return x;},disconnect(){this.connected=[];this.cut=true;},start(){starts++;},stop(){}};made.push(n);return n;};
 const ac={state:'running',currentTime:0,sampleRate:48000};for(const k of ['Gain','BiquadFilter','Oscillator','DynamicsCompressor','WaveShaper','Delay','BufferSource'])ac['create'+k]=()=>node(k);
 return {ac,made,starts:()=>starts};}
function runtime(onScenes,where){const A=fakeAudio(),toasts=[],cues=[],notes=[],dest={kind:'makeup',connect(){},disconnect(){}};let saves=0;
 const r={S:{wx:where.x,wy:where.y,sound:true,layer:'superficie',journey:{free:true},scenes:onScenes===undefined?undefined:{version:1,on:onScenes},worldIdentity:{seed:'test'}},
  inWorld:()=>true,ac:A.ac,outputStage:{makeup:dest},noiseBuffer:{duration:2},hz:m=>{notes.push(m);return 440*2**((m-69)/12);},chordTones:()=>[57,60,64,67,71],root:()=>45,SIX:.12,MU:{radio:{identity:{swing:.1}},dnaA:{genre:'minimal'}},GEN:{minimal:{sw:.08}},
  REG:4,WCH:900,regionOfPos:(x,y)=>({genre:under(x,y).genre,sea:false}),toast:(t,o)=>toasts.push([t,o]),save:()=>{saves++;return true;},sceneCue:c=>cues.push(c)};
 const real=Math.random;let draws=0;Math.random=()=>{draws++;return real();};try{initialize(r);}finally{Math.random=real;}
 return {r,A,toasts,cues,notes,dest,saves:()=>saves,draws:()=>draws,play(bars,from=0){const real=Math.random;Math.random=()=>{draws++;return real();};try{for(let b=from;b<from+bars;b++)for(let s=0;s<16;s++)r.sceneStep(s,b,(b*16+s)*r.SIX);}finally{Math.random=real;}}};}
// A stage of this fake world.
let stage=null;{const key=sceneWorldKey({seed:'test'});for(let zx=0;zx<80&&!stage;zx++)for(let zy=0;zy<80&&!stage;zy++){const s=stageInZone(key,zx,zy,under,RP);if(s&&s.scene==='almacen')stage=s;}}
assert.ok(stage);
// Off (the default, or off in the save): nothing built, no random draw, no line, no cue.
for(const value of [undefined,false]){const t=runtime(value,stage);t.play(70);assert.equal(t.A.made.length,0);assert.equal(t.draws(),0);assert.equal(t.toasts.length,0);assert.equal(t.cues.length,0);assert.deepEqual(t.r.S.scenes,{version:1,on:false});assert.equal(t.r.sceneState().bus,false);}
// On, at the stage: the bus to the output stage, the line once, the arc's sections, voices on chord tones, no random draw.
{const t=runtime(true,stage);t.play(stage.hand.arc+8);assert.equal(t.draws(),0,'no random number when on either');
 assert.equal(t.toasts.length,1);assert.equal(t.toasts[0][0],'Escena · Almacén');
 const sections=[...new Set(t.cues.filter(c=>c.kind==='bar').map(c=>c.section))];assert.deepEqual(sections,['intro','build','drop','breakdown','return']);
 assert.ok(t.A.made.some(n=>n.connected.includes(t.dest)),'its own bus joins the output stage');
 assert.ok(t.A.starts()>200,'it plays: '+t.A.starts());
 const chord=new Set([57,60,64,67,71].map(n=>n%12));assert.ok(t.notes.length>100);assert.deepEqual(t.notes.filter(n=>!chord.has(((n%12)+12)%12)),[],'every note is a tone of the chord');
 // Leaving: it fades over three bars and lets the bus go.
 t.r.S.wx+=50000;t.play(5,stage.hand.arc+8);const st=t.r.sceneState();assert.equal(st.bus,false);assert.equal(st.stage,null);assert.ok(t.A.made.filter(n=>n.kind==='DynamicsCompressor').every(n=>n.cut),'the bus is let go');}
// Patio latino: congas, shaker, cowbell and chops on chord tones; the high-pass opens on the drop.
{let p=null;const key=sceneWorldKey({seed:'test'});for(let zx=0;zx<80&&!p;zx++)for(let zy=0;zy<80&&!p;zy++){const s=stageInZone(key,zx,zy,under,RP);if(s&&s.scene==='patio')p=s;}
 const t=runtime(true,p);t.play(p.hand.arc);assert.equal(t.toasts[0][0],'Escena · Patio latino');assert.equal(t.draws(),0);
 const hp=t.A.made.find(n=>n.kind==='BiquadFilter'&&n.frequency.events.some(e=>e[1]===20));assert.ok(hp,'the high-pass opens to 20 Hz');}
// The switch: a failed save puts it back; a later version cannot be changed.
{const t=runtime(false,stage);t.r.save=()=>false;assert.equal(t.r.setScenes(true),false);assert.equal(t.r.S.scenes.on,false);t.r.save=()=>true;assert.equal(t.r.setScenes(true),true);assert.equal(t.r.S.scenes.on,true);
 const u=runtime(undefined,stage);u.r.S.scenes={version:3,on:true};assert.equal(u.r.setScenes(false),false);assert.equal(u.r.S.scenes.on,true);u.play(4);assert.equal(u.A.made.length,0,'a later version reads off');}
// Not in the Journey, a level, a round or the finales; no line with the landscape's texts off.
{const t=runtime(true,stage);t.r.S.journey={free:false};t.play(4);assert.equal(t.A.made.length,0);
 const u=runtime(true,stage);u.r.placeRun=()=>({id:'x'});u.play(4);assert.equal(u.A.made.length,0);
 const v=runtime(true,stage);v.r.S.universeTexts=false;v.play(4);assert.equal(v.toasts.length,0);assert.ok(v.A.made.length>0);}
// Sonido limpio (Jay, 6 Nov 2026): no noise riser in either stage; the build before a drop is a roll or a run on the
// stage's own drums, or nothing, and it varies by stage, cycle and drop.
{const voices=read('src/scenes-audio.js'),stage=read('src/scenes.js');assert.ok(!/riser\(/.test(voices)&&!/voices\.riser/.test(stage),'no riser voice');
 for(const [scene,list] of Object.entries(SCENE_BUILDS)){assert.ok(list.includes('none')&&list.length>=3,scene);const seen=new Set();for(let i=0;i<60;i++){const k=sceneBuild('scene:v1:t:'+i,scene,i%3,i%2?'build':'breakdown');assert.ok(list.includes(k));seen.add(k);}assert.equal(seen.size,list.length,scene+' plays every build');}
 assert.equal(sceneBuild('a','almacen',2,'build'),sceneBuild('a','almacen',2,'build'),'the same drop builds the same way');}
// Wiring: one hook in the music's step after its own voices, the module in main, each file once in the offline shell, the
// switch in Sonido, its English.
{const audio=read('src/audio.js');assert.equal(audio.split('runtime.sceneStep?.(s,bar,t);').length,2);assert.ok(audio.indexOf('runtime.sceneStep?.')>audio.indexOf('runtime.phenomenaStep?.(s,bar,t);'));
 assert.ok(audio.indexOf('runtime.sceneStep?.')>audio.indexOf('if(hush){runtime.songStageStep'),'silent under the finale of eleven');
 const main=read('src/main.js');assert.match(main,/import \{initialize as scenes\} from '\.\/scenes\.js';/);assert.match(main,/scenes\(runtime\);/);
 const sw=read('sw.js');for(const m of ['scenes-model.js','scenes-audio.js','scenes.js'])assert.equal(sw.split('"./src/'+m+'"').length,2,m);
 const html=read('index.html');assert.match(html,/id="mMusic"[\s\S]*id="scenesSetting" type="checkbox"[^>]*>Escenas: más variedad/);assert.ok(!/id="scenesSetting"[^>]*checked/.test(html),'off by default');
 const {EN}=await import('../src/i18n-en.js');for(const k of ['Escenas: más variedad','Escena · Almacén','Escena · Patio latino'])assert.ok(EN[k],k);}
console.log('PASS scenes: stages by hashKey (near '+nearShare.toFixed(3)+', far '+farShare.toFixed(3)+'), hands, arcs, builds without a riser, patterns on the chord, the setting and its save, off builds nothing');
