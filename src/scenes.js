// Escenas musicales, entrega 1 (Jay, 3 Nov 2026, alpha.241; docs/UNIVERSO.md#escenas-musicales). With «Escenas: más
// variedad» on (Sonido; off by default, kept in S.scenes), a few places of the free World are stages. Coming near one,
// its club rises over a few bars on top of the place's music: the Almacén (long kick and rumble, sixteenth hats and an
// airy ride, a resonant acid line whose envelope climbs, metal strikes; breakdown, build and drop) or the Patio latino
// (congas, bongós, timbal, a cowbell in clave, a swung shaker, a rolling bass, synthetic vocal chops of formants only and
// a high-pass that opens). A short line says where you are («Escena · Almacén»). Leaving, it fades and its bus is let go:
// the music is exactly as before. With the setting off nothing here plays, builds a node or draws a random number.
// The clock is the music's own: audio.js calls runtime.sceneStep on every sixteenth it schedules (after its own voices),
// and every note is a tone of the chord sounding then (runtime.chordTones, runtime.root), in the place's tuning.
import {openSurface} from './frame-state.js';
import {freeOpen} from './journey-mode.js';
import {fitRegister} from './musical-conductor.js';
import {SCENES,sceneById,normalizeScenes,scenesWritable,scenesOn,stageProximity,stagesNear,arcAt,filterAt,sceneBuild,acidLine,metalSteps,congaPattern,bongoSteps,bassSteps,chopSteps,
 HAT_PATTERNS,CLAVES,VOWELS,STAGE_HEAR,humanize,sceneWorldKey} from './scenes-model.js';
import {createSceneBus,sceneVoices,SCENE_TRIM} from './scenes-audio.js';
// The cáscara on the timbal's shell.
const CASCARA=new Set([0,2,4,5,7,9,11,12,14]);
// Bars a scene keeps fading before its bus is let go.
const FADE_BARS=3;
export function initialize(r){
 const $=id=>r.$?.(id)||globalThis.document?.getElementById(id)||null;
 let owner=null,state=null;
 function own(){if(owner!==r.S){owner=r.S;r.S.scenes=normalizeScenes(r.S.scenes);state=r.S.scenes;}return state;}
 const on=()=>!!r.S&&scenesOn(own());
 // Where it lives: the free World's surface after the Journey, outside every level, activity, the Refugio and the finales.
 const allowed=()=>!!r.S&&r.inWorld?.()&&(r.S.layer||'superficie')==='superficie'&&freeOpen(r.S.journey)&&!r.activityActive&&!r.labMode&&!(r.S.previewSeed&&!r.realTravel)&&!r.houseActive?.()&&!r.travelInLevel?.()&&!r.placeRun?.()&&!r.songStageState?.()?.running&&!r.journeyFinaleState?.()?.running;
 // ---------- the setting ----------
 function set(value){if(!r.S||!scenesWritable(own()))return false;const before=state.on;state.on=!!value;if(r.save?.()===false){state.on=before;sync();return false;}sync();return true;}
 function sync(){const box=$('scenesSetting');if(!box)return;box.checked=on();box.disabled=!!r.S&&!scenesWritable(own());}
 const box=$('scenesSetting');if(box)box.onchange=()=>{set(box.checked);};
 const panel=$('mMusic');if(panel&&globalThis.MutationObserver)new MutationObserver(()=>{if(!panel.hidden)sync();}).observe(panel,{attributes:true,attributeFilter:['hidden']});
 if(r.S)sync();
 // ---------- the stages near you ----------
 let world='',worldOf=null;
 const under=(x,y)=>{const d=r.regionOfPos?.(x,y);return d?{genre:d.genre,sea:!!d.sea}:null;};
 const RP=()=>r.REG*r.WCH;
 function near(p){const id=r.worldIdentity??r.S?.worldIdentity??null;if(id!==worldOf){worldOf=id;world=sceneWorldKey(id);}return stagesNear(world,p,STAGE_HEAR,under,RP());}
 // ---------- the scene playing ----------
 let bus=null,voices=null,active=null,prevAcid=null,heard=0;
 const swingOf=()=>{const MU=r.MU,g=r.GEN?.[MU?.dnaA?.genre];return Math.max(0,Math.min(.38,MU?.radio?.identity?.swing??g?.sw??0));};
 // The bus joins the output stage after the music's compressor. Renders may send it elsewhere (r.sceneOutput) or start
 // the arc further on (r.sceneArcFrom, tests/audio_mix.mjs); the game sets neither.
 function open(){if(bus)return true;const ac=r.ac,dest=r.sceneOutput||r.outputStage?.makeup||r.bus,noise=r.noiseBuffer;if(!ac||!dest||!noise||!r.hz)return false;bus=createSceneBus(ac,dest);voices=sceneVoices(ac,bus,noise,r.hz);return true;}
 function close(){if(bus)bus.disconnect();bus=null;voices=null;active=null;prevAcid=null;}
 function announce(stage){const scene=sceneById(stage.scene);if(!scene||r.S.universeTexts===false)return;r.toast?.(scene.line,{level:2,category:'escena'});r.sceneCue?.({kind:'line',scene:scene.id,stage:stage.id});}
 // Each bar: which stage, how near, where in its arc; the bus follows (approach, section level, filters, echo).
 function bar(t,b){
  const want=on()&&allowed()&&r.S.sound!==false&&r.ac?.state==='running';
  let stage=null,prox=0;if(want){const p={x:r.S.wx,y:r.S.wy},s=near(p)[0];if(s){stage=s;prox=stageProximity(Math.hypot(s.x-p.x,s.y-p.y));}}
  if(active&&(!stage||stage.id!==active.stage.id||prox<=0)){if(active.fadeFrom==null){active.fadeFrom=b;active.prox=0;bus?.approach.gain.setTargetAtTime(0,t,.9);}if(b-active.fadeFrom>=FADE_BARS)close();else advance(t,b);return;}
  if(!active){if(!stage||prox<=0||!open())return;active={stage,start:b-(Number.isInteger(r.sceneArcFrom)?r.sceneArcFrom:0),fadeFrom:null,announced:false,cache:new Map(),prox:0};}
  active.fadeFrom=null;active.prox=prox;bus.approach.gain.setTargetAtTime(prox,t,1.2);
  advance(t,b);
  if(!active.announced&&prox>=.35){active.announced=true;announce(active.stage);}
  r.sceneCue?.({kind:'bar',time:t,bar:b,stage:active.stage.id,scene:active.stage.scene,section:active.arc.section,level:active.arc.level,prox});
 }
 // The arc moves on (also while the scene fades away).
 function advance(t,b){
  const hand=active.stage.hand,a=arcAt(hand,b-active.start),six=r.SIX,soft=!!r.S.softMusic,end=t+16*six;active.arc=a;
  const next=a.section==='build'?{...a,progress:Math.min(1,a.progress+1/Math.max(1,a.size-1))}:a;
  // The section's level: the build climbs through its bar, a drop lands on its first beat.
  const g=bus.section.gain;g.cancelScheduledValues(t);
  if(a.section==='build'){g.setValueAtTime(a.level,t);g.linearRampToValueAtTime(a.level+.3/Math.max(1,a.size-1),end);}else if(a.drop)g.setValueAtTime(a.level,t);else g.setTargetAtTime(a.level,t,.08);
  // The filter: the Almacén's low-pass and the Patio's high-pass sweep through the build and open on the drop.
  const ceiling=soft?5500:18000,f=filterAt(hand,a),fn=filterAt(hand,next);
  const sweep=(param,from,to)=>{param.cancelScheduledValues(t);if(a.section==='build'){param.setValueAtTime(from,t);param.exponentialRampToValueAtTime(to,end);}else if(a.drop)param.setValueAtTime(to,t);else param.setTargetAtTime(to,t,.4);};
  if(hand.scene==='almacen'){sweep(bus.lp.frequency,Math.min(ceiling,f),Math.min(ceiling,fn));bus.hp.frequency.setTargetAtTime(20,t,.2);}
  else{sweep(bus.hp.frequency,Math.max(20,f),Math.max(20,fn));bus.lp.frequency.setTargetAtTime(ceiling,t,.4);}
  bus.trim.gain.setTargetAtTime((soft?.6:1)*(SCENE_TRIM[hand.scene]??SCENE_TRIM.almacen),t,.05);bus.delay.delayTime.setTargetAtTime(3*six,t,.1);
 }
 const patterns=cycle=>{const c=active.cache;if(!c.has(cycle)){const h=active.stage.hand;c.set(cycle,{acid:acidLine(h,cycle),metal:metalSteps(h,cycle),conga:congaPattern(h,cycle),bongo:bongoSteps(h,cycle),bass:bassSteps(h,cycle),chop:chopSteps(h,cycle)});while(c.size>2)c.delete(c.keys().next().value);}return c.get(cycle);};
 // The sidechain: down on the beat, back within a sixteenth.
 function duck(t,depth){const d=bus.duck.gain;d.cancelScheduledValues(t);d.setValueAtTime(1,Math.max(0,t-.004));d.linearRampToValueAtTime(depth,t);d.setTargetAtTime(1,t+.03,.05);}
 function almacen(s,b,t,a,P,ct,R,six,hum){const h=active.stage.hand,kit=h.kit,sw=swingOf(),tt=t+(s%2?sw*six:0),sec=a.section,drums=sec==='build'||sec==='drop'||sec==='return';
  // The long kick and its rumble (out on the last bar of the build: the drop lands after a breath).
  const breath=a.riser&&a.i===a.size-1&&sec==='build';
  if(drums&&s%4===0&&!breath){voices.kick(t,.5,kit);voices.rumble(t+six,.3,fitRegister(R-12,33,45),six,kit);}
  // Hats: off-beats in the intro, the hand's sixteenths in the build (growing) and drops, nearly gone in the breakdown.
  const hv=HAT_PATTERNS[h.hats][s];let hat=0;if(sec==='intro')hat=s%4===2?.5:0;else if(sec==='build')hat=hv*(.45+.55*a.progress);else if(sec==='breakdown')hat=s%4===2?.18:0;else hat=hv;
  if(hat>0)voices.hat(tt,.55*hat*(.85+.3*hum),kit.tone,s%4===2?.08:.045,hum);
  if(a.fill&&s>=8&&s%2===1)voices.hat(tt+six/2,.25,kit.tone*1.1,.03,hum+.5);
  // The ride with air on the off-beats of the drops; once a bar in the breakdown.
  if((sec==='drop'||sec==='return')&&s%4===2)voices.ride(tt,.16*(.9+.2*hum),hum);else if((sec==='breakdown'||sec==='intro')&&s===8)voices.ride(t,.14,hum);
  // The acid line: its envelope climbs through the build, wide open in the drops, low and dark in the breakdown.
  const step=P.acid[s];if(sec!=='intro'&&step.on){const amount=sec==='build'?h.acidRise*a.progress:sec==='breakdown'?.12:1;
   const note=fitRegister(ct[step.tone],45,57)+(step.up?12:0),next=P.acid[(s+1)%16],len=six*(next.on&&next.slide?1.05:.7);
   voices.acid(t,(sec==='breakdown'?.05:.065)*(.9+.2*hum),note,step.slide?prevAcid:null,{slide:step.slide,accent:step.accent,cut:180+260*amount,env:300+3200*amount,res:h.resonance,wave:kit.wave,len});prevAcid=note;}
  // Metal strikes on the hand's off-beats, a chord tone high up; a flam on the fills.
  if((sec==='drop'||sec==='return')&&P.metal.includes(s))voices.metal(tt,.07*(.85+.3*hum),fitRegister(ct[(b+s)%5],79,91));
  if(a.fill&&(s===12||s===14))voices.metal(tt,.07,fitRegister(ct[4],84,96));
  // The breakdown's stab: three chord tones, every second bar.
  if(sec==='breakdown'&&s===0&&a.i%2===0)voices.stab(t,.16,ct.slice(0,3).map(n=>fitRegister(n,57,69)));
  // The last bar before a drop (Sonido limpio): a hat roll, metal strikes climbing the chord, or only the breath.
  if(a.riser&&a.i===a.size-1){const k=sceneBuild(active.stage.key,'almacen',a.cycle,sec);
   if(k==='roll'&&s>=8){voices.hat(tt,.22+.05*(s-8),kit.tone,.03,hum);if(s>=12)voices.hat(tt+six/2,.18+.05*(s-12),kit.tone*1.05,.025,hum+.5);}
   else if(k==='climb'&&s>=8&&s%2===0)voices.metal(tt,.05+.006*(s-8),fitRegister(ct[((s-8)/2)%5],72+(s-8),96));}
  if(a.drop&&s===0)voices.impact(t,.4,fitRegister(R,33,45),hum);
 }
 function patio(s,b,t,a,P,ct,R,six,hum){const h=active.stage.hand,kit=h.kit,sw=Math.min(.33,swingOf()+h.swing),tt=t+(s%2?sw*six:0),sec=a.section,full=sec==='drop'||sec==='return',late=sec==='build'&&a.progress>=.5;
  // The shaker, swung, louder on the off-beat.
  {const sv=s%4===2?.5:s%2?.34:.24;voices.shaker(tt,.5*sv*(sec==='breakdown'?.7:1)*(.85+.3*hum),kit.tone,hum);}
  // The cowbell in clave (from the build).
  if(sec!=='intro'&&CLAVES[h.clave].includes(s))voices.cowbell(tt,.11*(sec==='breakdown'?.6:1),fitRegister(ct[0],76,88));
  // Congas and tumba on chord tones: from the build, open tones only in the breakdown.
  if(sec!=='intro'){for(const [st,drum,stroke]of P.conga)if(st===s&&(sec!=='breakdown'||stroke==='open')){const tone=drum==='tumba'?ct[0]:ct[(7+kit.conga)%5];voices.conga(tt,(drum==='tumba'?.34:.28)*(.85+.3*hum),fitRegister(tone,drum==='tumba'?48:55,drum==='tumba'?58:66),stroke);}}
  // Bongós' martillo, from the second half of the build.
  if(full||late){for(const [st,drum,stroke]of P.bongo)if(st===s)voices.bongo(tt,.16*(.8+.4*hum),drum==='macho'?fitRegister(ct[1],62,72):fitRegister(ct[3],66,77),stroke);}
  // Timbal: the cáscara on the shell in the drops, a hit at the end of every fourth bar, a roll on the fills.
  if(full&&CASCARA.has(s))voices.cascara(tt,.12*(s%4===0?1:.7),hum);
  if(full&&s===14&&b%4===3)voices.timbal(tt,.2,fitRegister(ct[2],62,72));
  if(a.fill&&s>=12)voices.timbal(tt,.1+.04*(s-12),fitRegister(ct[(s-12)%3*2],62,74));
  // The rolling bass on the off-beat sixteenths (from the second half of the build; out in the breakdown).
  if(full||late){for(const [st,tone]of P.bass)if(st===s)voices.bass(tt,.36*(.9+.2*hum),fitRegister(ct[tone],36,47),six*.85,kit.bass);}
  // Vocal chops (formants, no voices): every other bar in the drops and the breakdown (there with more echo).
  if((full&&b%2===1)||(sec==='breakdown'&&b%2===0)||(late&&b%4===3)){for(const c of P.chop)if(c.step===s)voices.chop(tt,.15*(sec==='breakdown'?.8:1),fitRegister(ct[c.tone],60,72),c.from,c.to,c.len*six*.9,VOWELS);}
  // The last bar before a drop (Sonido limpio): a timbal roll or a conga run up the chord, or nothing.
  if(a.riser&&a.i===a.size-1&&s>=8){const k=sceneBuild(active.stage.key,'patio',a.cycle,sec);
   if(k==='timbal')voices.timbal(tt,.06+.012*(s-8),fitRegister(ct[(s-8)%3*2],62,74));
   else if(k==='conga'&&s%2===0)voices.conga(tt,.16+.02*(s-8),fitRegister(ct[((s-8)/2)%5],55,70),'open');}
  if(a.drop&&s===0)voices.impact(t,.36,fitRegister(R,33,45),hum);
 }
 // Called by the music on every sixteenth it schedules (audio.js), after the music's own voices.
 function step(s,b,t){
  if(!r.S||(!active&&!on()))return;
  if(s===0)bar(t,b);if(!active||!bus)return;
  const a=active.arc;if(!a)return;const P=patterns(a.cycle),ct=r.chordTones?.(),R=r.root?.(),six=r.SIX;if(!ct?.length||!Number.isFinite(R)||!(six>0))return;
  const hum=humanize(active.stage.key,b,s);if(s%4===0)duck(t,.06);
  if(active.stage.hand.scene==='almacen')almacen(s,b,t,a,P,ct,R,six,hum);else patio(s,b,t,a,P,ct,R,six,hum);heard++;
 }
 Object.defineProperties(r,{
  sceneStep:{get:()=>step,configurable:true},
  sceneState:{get:()=>()=>({on:on(),stage:active?.stage||null,scene:active?.stage?.scene||null,section:active?.arc?.section||null,bar:active?.arc?.bar??null,prox:active?.prox||0,fading:active?.fadeFrom!=null,bus:!!bus,heard,voices:voices?.voices||0}),configurable:true},
  scenesNear:{get:()=>(p=r.S?{x:r.S.wx,y:r.S.wy}:{x:0,y:0})=>near(p),configurable:true},
  setScenes:{get:()=>set,configurable:true},
  sceneList:{get:()=>SCENES,configurable:true}
 });
}
