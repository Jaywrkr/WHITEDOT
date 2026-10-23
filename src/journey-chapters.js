import {openSurface,prefersReducedMotion} from './frame-state.js';
import {THEME,themePitch,playCello} from './journey-pulse.js';
import {FESTIVAL_CHAPTERS} from './festival.js';
import {familyOf} from './superbiomes.js';
// The Journey, phase 4: the album. Seven chapters, five of them biomes of the World. In each one the music climbs
// through three states (Llegada, Pertenencia, Plenitud): completing the cube's theme on time there is its Plenitud,
// the theme plays whole, the chapter is kept and a gold portal opens to the next. If the player stops playing, the
// music falls back to a pedal and waits. Places come from the World's own map; nothing consumes the old random sequence.
export const CHAPTERS=Object.freeze(['camino','llanura','lago','bosque','tormenta','vacio','refugio']);
export const WORLD_CHAPTERS=Object.freeze(['llanura','lago','bosque','tormenta','vacio']);
// How loud the music may get in each state, as a cap on its energy.
export const STATE_CAP=Object.freeze({llegada:.38,pertenencia:.66,plenitud:1,silencio:.16});
export const SILENCE_BARS=8;
// Held up from below (Phase 7, measured in a full playthrough as voices per second): every Plenitud is fuller than its
// Pertenencia, and the Tormenta, the climax, is the fullest moment once you play. The Vacío stays alone.
export const STATE_FLOOR=Object.freeze({plenitud:.8});
export const STORM_FLOOR=Object.freeze({pertenencia:.6,plenitud:.92});
export const stateFloor=(state,id)=>id==='vacio'?null:(id==='tormenta'?STORM_FLOOR:STATE_FLOOR)[state]||null;
// The Vacío: the cube alone (a very low cap), and after this many notes the creatures come back and repeat them.
export const VOID_CAP=.1,VOID_ECHO_AFTER=8,VOID_PHRASE=12;
// The cap of a state in a chapter: in the Vacío the music never rises above the cube.
// Phase 2 of the plan (El Viaje con tiempo): a chapter is complete when you live its moment and stay a while in its
// music, not with six hits. The moment: the lighthouse reached, three lotuses open, the creature following you for a
// walk, four bolts of your own, the creatures' echo. The stay: bars played in the chapter (counted only while you
// play). Together the five chapters, the Camino and the finale aim at 15 to 20 minutes (docs/VIAJE.md).
// About ten minutes of music in all at each family's tempo (house 122, downtempo 93, disco 118, techno 128, ambient 78):
// an estimate until people play it (phase 7 of the plan).
export const CHAPTER_BARS=Object.freeze({llanura:48,lago:56,bosque:56,tormenta:64,vacio:40});
export const LOTUS_GOAL=3,FOLLOW_GOAL=600,BOLT_GOAL=4,ECHO_GOAL=1;
// The portal opens after the theme in tutti: at least four seconds of Plenitud first.
export const PORTAL_WAIT=4000;
// Whether a chapter's moment was lived, from its saved progress and the moments of journey-moments.js.
export function momentLived(id,progress={},moments={}){
 if(id==='llanura')return moments.faro?.reached===true;
 if(id==='lago')return (moments.lotos?.open||[]).filter(Boolean).length>=LOTUS_GOAL;
 if(id==='bosque')return moments.companion===true&&(progress.walk||0)>=FOLLOW_GOAL;
 if(id==='tormenta')return (progress.bolts||0)>=BOLT_GOAL;
 if(id==='vacio')return (progress.echoes||0)>=ECHO_GOAL;
 return true;}
// How far a chapter has come, 0 to 1, for the bar at the top (the same one that fills with the Camino's crystals):
// half for its moment (in steps where it has them) and half for its bars; done is 1 (phase 6 of the plan).
export function chapterProgress(id,progress={},moments={},done=false){if(done)return 1;const need=CHAPTER_BARS[id];if(!need)return 0;
 const lotus=(moments.lotos?.open||[]).filter(Boolean).length,moment=momentLived(id,progress,moments)?1:id==='lago'?Math.min(1,lotus/LOTUS_GOAL):id==='bosque'?(moments.companion?Math.min(1,(progress.walk||0)/FOLLOW_GOAL):0):id==='tormenta'?Math.min(1,(progress.bolts||0)/BOLT_GOAL):0;
 return Math.min(1,.5*moment+.5*Math.min(1,(progress.bars||0)/need));}
export const barsLived=(id,progress={})=>(progress.bars||0)>=(CHAPTER_BARS[id]||0);
export function stateCap(state,id){const cap=STATE_CAP[state]??null;return cap!=null&&id==='vacio'?Math.min(cap,VOID_CAP):cap;}
export function normalizeChapters(j,inWorld=false){
 const q=j&&typeof j==='object'?j:{},chapter=Number.isInteger(q.chapter)&&q.chapter>=0&&q.chapter<CHAPTERS.length?q.chapter:inWorld?1:0;
 const done={},notes={},steps={},progress={},count=(v,max)=>Number.isFinite(v)&&v>0?Math.min(max,v):0;
 for(const id of CHAPTERS){if(q.done?.[id]===true)done[id]=true;const raw=Array.isArray(q.notes?.[id])?q.notes[id]:[],keep=raw.map((m,i)=>Number.isFinite(m)&&m>=24&&m<=96?i:-1).filter(i=>i>=0).slice(-16),n=keep.map(i=>raw[i]);if(n.length)notes[id]=n;
  // When each note sounded (the music's sixteenth), kept beside the notes so the finale plays your rhythm; older saves have none.
  const st=Array.isArray(q.steps?.[id])&&q.steps[id].length===raw.length?keep.map(i=>q.steps[id][i]):null;if(n.length&&st?.every(v=>Number.isInteger(v)&&v>=0))steps[id]=st;
  const p=q.progress?.[id],out={};if(p&&typeof p==='object'){for(const [k,max] of [['bars',9999],['walk',99999],['bolts',999],['echoes',999]]){const v=count(p[k],max);if(v)out[k]=k==='bars'||k==='walk'?Math.round(v*10)/10:Math.floor(v);}}if(Object.keys(out).length)progress[id]=out;}
 return {chapter,done,notes,steps,progress};}
// The state of a chapter from its on-time hits and whether it is done.
export function chapterState(hits,done){return done?'plenitud':hits>0?'pertenencia':'llegada';}
// The nearest place of a biome, searched in rings around a point on the World's grid. Never the sea, except for the
// Vacío, which is the open sea between continents.
export function findBiome(want,from,biomeAt,isSea,step=300,rings=60){for(let d=1;d<=rings;d++)for(let a=0;a<16;a++){const x=Math.round(from.x+Math.cos(a/16*6.283)*d*step),y=Math.round(from.y+Math.sin(a/16*6.283)*d*step);if(biomeAt(x,y)===want&&(want==='vacio'||!isSea(x,y)))return {x,y};}return null;}
// Superbiomes in the Journey (docs/UNIVERSO.md, phase 18): each chapter goes to a fixed superbiome, its region with the
// music family that fits its feeling. The map is not changed: the chapter looks for a place of that region whose music
// is of that family, trying the families in order, and falls back to any place of the region.
export const CHAPTER_FAMILIES=Object.freeze({llanura:Object.freeze(['house','downtempo']),lago:Object.freeze(['downtempo','dub','ambient']),bosque:Object.freeze(['disco','house']),tormenta:Object.freeze(['techno','electro','breaks','dub']),vacio:Object.freeze(['ambient'])});
// The portal carries the cube, so the search for the superbiome reaches far (200 rings, about 60 000 px); the fallback
// to any place of the region stays near.
export function findChapter(want,from,biomeAt,isSea,familyAt,step=300,rings=200){
 for(const family of CHAPTER_FAMILIES[want]||[]){const spot=findBiome(want,from,(x,y)=>biomeAt(x,y)===want&&familyAt(x,y)===family?want:null,isSea,step,rings);if(spot)return {...spot,family};}
 const spot=findBiome(want,from,biomeAt,isSea,step,Math.min(rings,60));return spot?{...spot,family:null}:null;}
export function initialize(runtime){
 let owner=null,hits=0,lastPulse=-1e9,portal=null;const storm=[],echoes=[];const moments={bolts:0,echoes:0};
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const journey=()=>runtime.S.journey||{};
 function own(){if(owner!==runtime.S){owner=runtime.S;const j=journey();Object.assign(j,normalizeChapters(j,runtime.inWorld?.()));hits=0;portal=null;storm.length=0;echoes.length=0;lastPulse=lastTick=performance.now();lastSpot=null;}return journey();}
 let lastTick=0,lastSpot=null;
 const progress=id=>{const j=own();return (j.progress[id]||={});};
 const ready=id=>momentLived(id,progress(id),journey().moments||{})&&barsLived(id,progress(id));
 const portalOpen=()=>!!portal&&performance.now()>=portal.at;
 const active=()=>!!(runtime.journeyQuiet?.()&&runtime.inWorld?.()&&(runtime.S.layer||'superficie')==='superficie');
 const current=()=>CHAPTERS[own().chapter];
 const biomeId=()=>runtime.BIOMES?.[Math.max(0,runtime.curZone)]?.id;
 // The chapter's place: its region with the chapter's music family when the map has one nearby (findChapter).
 const find=(id,from,step,rings)=>{const ids=runtime.BIOMES.map(b=>b.id);return findChapter(id,from,(x,y)=>ids[runtime.biomeOfPos(x,y)],(x,y)=>!!runtime.regionOfPos?.(x,y)?.sea,(x,y)=>familyOf(runtime.regionOfPos?.(x,y)?.genre)?.id||null,step,rings);};
 const familyHere=()=>familyOf(runtime.regionOfPos?.(runtime.S.wx,runtime.S.wy)?.genre)?.id||null;
 const inChapter=()=>active()&&WORLD_CHAPTERS.includes(current())&&biomeId()===current();
 function stateNow(){if(!active())return null;const j=own();const bars=(performance.now()-lastPulse)/1000/((runtime.SIX||.15)*16);if(bars>SILENCE_BARS&&!portal)return 'silencio';return chapterState(inChapter()?hits:0,!!j.done[current()]);}
 // Every pulse of the player: on-time theme notes are remembered for the finale.
 function pulse(on,midi,step){lastPulse=performance.now();if(!on||!inChapter())return;hits++;const j=own(),id=current(),notes=(j.notes[id]||=[]);
  // Steps stay beside the notes only while every note has one.
  const steps=j.steps[id]||(notes.length?null:(j.steps[id]=[]));notes.push(midi);if(steps){if(Number.isInteger(step)&&step>=0)steps.push(step);else delete j.steps[id];}
  runtime.journeyMomentNote?.(id,midi);if(notes.length>16){notes.splice(0,notes.length-16);j.steps[id]?.splice(0,j.steps[id].length-16);}
  // The Tormenta: every note on time brings your own bolt down on the beat; once yours fall, the storm's stop.
  if(id==='tormenta'&&runtime.ac){storm.push(runtime.ac.currentTime);moments.bolts++;progress(id).bolts=(progress(id).bolts||0)+1;}
  // The Vacío: after eight notes the creatures that followed you come back and repeat each one, a bar later.
  if(id==='vacio'&&hits>VOID_ECHO_AFTER)echo(midi);}
 function echo(midi){const ac=runtime.ac,bar=(runtime.SIX||.15)*16;moments.echoes++;progress('vacio').echoes=(progress('vacio').echoes||0)+1;echoes.push({at:performance.now()+bar*1000,midi});if(echoes.length>8)echoes.shift();
  if(runtime.S.sound&&ac&&runtime.bus)runtime.soon?.(t=>{const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(440*2**((midi+12-69)/12),t+bar);g.gain.setValueAtTime(.0001,t+bar);g.gain.exponentialRampToValueAtTime(.07,t+bar+.02);g.gain.exponentialRampToValueAtTime(.0001,t+bar+.9);o.connect(g);g.connect(runtime.bus);o.start(t+bar);o.stop(t+bar+1);},'player');}
 // The whole theme, once, in tutti: the cube's voice with its octave below.
 function plenitude(){const ac=runtime.ac;if(!runtime.S.sound||!ac||!runtime.bus)return;runtime.soon?.(t=>{const MU=runtime.MU||{},scale=MU.dnaA?.scale||runtime.BIOMES?.[MU.biome||0]?.scale,eighth=(runtime.SIX||.15)*2;let at=t;for(const [d,l]of THEME){const m=themePitch(d,scale,MU.tr||0);playCello(ac,runtime.bus,at,m,l*eighth,.15);playCello(ac,runtime.bus,at,m-12,l*eighth,.08);at+=l*eighth;}},'player');}
 // A completed theme in the chapter's biome, once its moment is lived and its bars played: Plenitud, and the portal to
 // the next chapter after the theme sounds in tutti.
 function phrase(){if(!inChapter())return false;const j=own(),id=current();if(j.done[id]||(id==='vacio'&&hits<VOID_PHRASE)||!ready(id))return false;
  // A chapter played by its own game (journey-games.js) ends with that game's gold close, not with the theme.
  if(runtime.journeyGame?.(id))return false;return complete(id);}
 // A chapter kept: Plenitud, the theme in tutti and, after it, the portal to the next one.
 function complete(id=current()){const j=own();if(j.done[id]||current()!==id)return false;j.done[id]=true;if(runtime.save()===false){delete j.done[id];return false;}
  // The Tormenta's Plenitud: a bar of bolts, one on every beat.
  if(id==='tormenta'&&runtime.ac){const beat=(runtime.SIX||.15)*4;for(let i=1;i<=4;i++)storm.push(runtime.ac.currentTime+i*beat);moments.bolts+=4;}
  plenitude();runtime.enterFx=Math.max(runtime.enterFx||0,1);const theme=THEME.reduce((s,[,l])=>s+l,0)*(runtime.SIX||.15)*2*1000;portal={x:runtime.S.wx+140,y:runtime.S.wy-40,at:performance.now()+Math.max(PORTAL_WAIT,theme)};return true;}
 // Through the portal: the next chapter's biome, found on the map near here.
 function travel(){const j=own();if(j.chapter>=CHAPTERS.length-1)return false;const next=j.chapter+1,id=CHAPTERS[next];
  // The festival build ends after the Lago, in the Refugio, with your phrase.
  if(runtime.festival&&!FESTIVAL_CHAPTERS.includes(id)){portal=null;finaleAsked=true;if(runtime.journeyFinale)runtime.journeyFinale({festival:true});else runtime.landHouse?.();return true;}
  if(id==='refugio'){j.chapter=next;portal=null;finaleAsked=true;runtime.save();if(runtime.journeyFinale)runtime.journeyFinale();else runtime.landHouse?.();return true;}
  const spot=find(id,{x:runtime.S.wx,y:runtime.S.wy});if(!spot)return false;
  const before={chapter:j.chapter,wx:runtime.S.wx,wy:runtime.S.wy};j.chapter=next;runtime.S.wx=spot.x;runtime.S.wy=spot.y;if(runtime.save()===false){j.chapter=before.chapter;runtime.S.wx=before.wx;runtime.S.wy=before.wy;return false;}
  portal=null;hits=0;storm.length=0;echoes.length=0;lastPulse=performance.now();lastSpot=null;runtime.journeyPulseReset?.();runtime.enterFx=1;return true;}
 // Where the chapter's biome is, refreshed every few seconds while the player is away from it.
 let way=null,wayAt=-1e9,wayFor='';
 function beacon(){if(!WORLD_CHAPTERS.includes(current())||inChapter()||portal||biomeId()===current())return null;const now=performance.now();if(wayFor!==current()||now-wayAt>3000){wayAt=now;wayFor=current();way=find(current(),{x:runtime.S.wx,y:runtime.S.wy},300,30);}return way;}
 // Entering the World in the Journey starts chapter 1 in the Llanura.
 function arrive(){const j=own();if(!active()||j.chapter!==0)return;j.chapter=1;runtime.journeyPulseReset?.();if(biomeId()!=='llanura'||familyHere()!==CHAPTER_FAMILIES.llanura[0]){const spot=find('llanura',{x:runtime.S.wx,y:runtime.S.wy});if(spot){runtime.S.wx=spot.x;runtime.S.wy=spot.y;}}runtime.save();}
 let finaleAsked=false;
 function tick(){if(!active()){if(runtime.MU){runtime.MU.journeyCap=null;runtime.MU.journeyFloor=null;}return;}arrive();
  // A Journey saved in the Refugio before its finale finished plays it again.
  if(current()==='refugio'&&!own().finished&&!finaleAsked&&runtime.journeyFinale){finaleAsked=true;runtime.journeyFinale();return;}const st=stateNow(),id=current(),here=inChapter();if(runtime.MU){runtime.MU.journeyCap=st?stateCap(st,id):null;runtime.MU.journeyFloor=here?stateFloor(st,id):null;runtime.MU.journeyOwnBolts=here&&id==='tormenta'&&(progress(id).bolts||0)>0;}
  // The stay: bars count only while you play in the chapter; in the Bosque, the walk with the creature.
  const now=performance.now(),dt=Math.max(0,Math.min(.25,(now-lastTick)/1000));lastTick=now;
  if(here&&!own().done[id]&&st!=='silencio'){const p=progress(id),before=Math.floor((p.bars||0)/8);p.bars=Math.min(9999,(p.bars||0)+dt/((runtime.SIX||.15)*16));
   // Kept every eight bars, so leaving and coming back never loses the stay (phase 6 of the plan).
   if(Math.floor(p.bars/8)>before)runtime.save();
   if(id==='bosque'&&journey().moments?.companion&&lastSpot)p.walk=Math.min(99999,(p.walk||0)+Math.min(40,Math.hypot(runtime.S.wx-lastSpot.x,runtime.S.wy-lastSpot.y)));}
  lastSpot={x:runtime.S.wx,y:runtime.S.wy};
  // The bar at the top shows the chapter's way: white while it fills, gold once the chapter is kept.
  if(WORLD_CHAPTERS.includes(id)){const fill=document.getElementById?.('barfill');if(fill){const p=runtime.journeyGame?.(id)&&!own().done[id]?runtime.journeyGameProgress(id):chapterProgress(id,progress(id),journey().moments||{},!!own().done[id]),w=(Math.round(p*200)/2)+'%';if(fill.style.width!==w)fill.style.width=w;fill.parentElement?.classList.toggle('free',!!own().done[id]);}}
  // A chapter kept before a reload, but not yet left: its portal opens again beside you.
  if(here&&own().done[id]&&!portal)portal={x:runtime.S.wx+140,y:runtime.S.wy-40,at:now};
  if(storm.length&&runtime.MU&&!runtime.MU.boltAt&&runtime.ac&&storm[0]<=runtime.ac.currentTime+.02){runtime.MU.boltAt=Math.max(storm.shift(),runtime.ac.currentTime);runtime.MU.boltMine=true;}
  if(portalOpen()&&Math.hypot(runtime.S.wx-portal.x,runtime.S.wy-portal.y)<34)travel();}
 // The portal in the World, and seven small marks on the Line's right end: gold for done, white for here.
 function draw(c,W,H,t){tick();if(!active()){runtime.drawJourneyMoments?.(c,W,H,t,null,false);return;}if(openSurface('.modal:not([hidden])'))return;const j=own(),still=calm();runtime.drawJourneyMoments?.(c,W,H,t,current(),inChapter());runtime.drawJourneyGames?.(c,W,H,t);c.save();
  if(portalOpen()){const x=W/2+(portal.x-(runtime.camX??runtime.S.wx)),y=H/2+(portal.y-(runtime.camY??runtime.S.wy)),grow=Math.min(1,(performance.now()-portal.at)/900),r=22*grow;
   const g=c.createRadialGradient(x,y,0,x,y,r*2.4);g.addColorStop(0,'rgba(240,210,122,.35)');g.addColorStop(1,'rgba(240,210,122,0)');c.fillStyle=g;c.fillRect(x-r*2.4,y-r*2.4,r*4.8,r*4.8);
   c.strokeStyle='#f0d27a';c.lineWidth=1.5;for(let i=0;i<3;i++){c.globalAlpha=.9-i*.25;c.beginPath();c.arc(x,y,r*(1-i*.25),still?0:t/600+i,(still?0:t/600+i)+Math.PI*1.6);c.stroke();}}
  // The creatures of the Vacío around the cube: they light up when they repeat a note.
  if(current()==='vacio'&&inChapter()&&hits>VOID_ECHO_AFTER){const n=Math.max(2,Object.keys(j.done).length),now=performance.now();for(let i=0;i<n;i++){const a=i/n*6.283+(still?0:t/4000),x=W/2+Math.cos(a)*70,y=H/2+Math.sin(a)*46,lit=echoes.some(e=>now>=e.at&&now-e.at<400);c.globalAlpha=lit?.95:.35;c.fillStyle='#ffffff';c.fillRect(Math.round(x)-2,Math.round(y)-2,lit?5:4,lit?5:4);}}
  // Away from the chapter's biome, a beacon at the edge of the screen shows the way back.
  const way=beacon();if(way){const a=Math.atan2(way.y-runtime.S.wy,way.x-runtime.S.wx),ex=W/2+Math.cos(a)*(W/2-18),ey=H/2+Math.sin(a)*(H/2-60),bx=Math.max(14,Math.min(W-14,ex)),by=Math.max(70,Math.min(H-120,ey)),glow=still?.8:.55+.3*Math.sin(t/500);
   // Seen from above: a gold light at the edge with a halo and a chevron pointing the way.
   c.globalAlpha=.25*glow;c.strokeStyle='#f0d27a';c.lineWidth=1;c.beginPath();c.arc(bx,by,10,0,6.283);c.stroke();c.globalAlpha=glow;c.fillStyle='#f0d27a';c.fillRect(Math.round(bx)-2,Math.round(by)-2,4,4);
   c.beginPath();c.moveTo(bx+Math.cos(a)*16,by+Math.sin(a)*16);c.lineTo(bx+Math.cos(a+2.5)*9,by+Math.sin(a+2.5)*9);c.moveTo(bx+Math.cos(a)*16,by+Math.sin(a)*16);c.lineTo(bx+Math.cos(a-2.5)*9,by+Math.sin(a-2.5)*9);c.stroke();c.globalAlpha=1;}
  const y=Math.round(H*.8)+.5,x1=W-Math.max(24,W*.12),gap=9;c.globalAlpha=1;
  WORLD_CHAPTERS.forEach((id,i)=>{const x=x1-(WORLD_CHAPTERS.length-1-i)*gap,isHere=current()===id;c.fillStyle=j.done[id]?'#f0d27a':isHere?'#ffffff':'#ffffff40';c.globalAlpha=isHere&&!j.done[id]&&!still?.6+.4*Math.sin(t/300):1;c.fillRect(Math.round(x)-1,y+9,3,3);});
  c.restore();}
 Object.defineProperties(runtime,{journeyChapterPulse:{get:()=>pulse},journeyPhrase:{get:()=>phrase},journeyComplete:{get:()=>complete},journeyTravel:{get:()=>travel},drawJourneyChapters:{get:()=>draw},
  journeyChapter:{get:()=>()=>({moments:{...moments,storm:storm.length},progress:{...progress(current())},lived:momentLived(current(),progress(current()),journey().moments||{}),bars:barsLived(current(),progress(current())),portalOpen:portalOpen(),beacon:!!(active()&&beacon()),chapter:own().chapter,id:current(),state:stateNow(),hits,portal:portal?{x:portal.x,y:portal.y}:null,done:{...own().done},notes:Object.fromEntries(Object.entries(own().notes).map(([k,v])=>[k,[...v]]))})}});
}
