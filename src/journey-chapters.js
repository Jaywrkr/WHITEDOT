import {openSurface,prefersReducedMotion} from './frame-state.js';
import {THEME,themePitch,playCello} from './journey-pulse.js';
import {FESTIVAL_CHAPTERS} from './festival.js';
// The Journey, phase 4: the album. Seven chapters, five of them biomes of the World. In each one the music climbs
// through three states (Llegada, Pertenencia, Plenitud): completing the cube's theme on time there is its Plenitud,
// the theme plays whole, the chapter is kept and a gold portal opens to the next. If the player stops playing, the
// music falls back to a pedal and waits. Places come from the World's own map; nothing consumes the old random sequence.
export const CHAPTERS=Object.freeze(['camino','llanura','lago','bosque','tormenta','vacio','refugio']);
export const WORLD_CHAPTERS=Object.freeze(['llanura','lago','bosque','tormenta','vacio']);
// How loud the music may get in each state, as a cap on its energy.
export const STATE_CAP=Object.freeze({llegada:.38,pertenencia:.66,plenitud:1,silencio:.16});
export const SILENCE_BARS=8;
// The Vacío: the cube alone (a very low cap), and after this many notes the creatures come back and repeat them.
export const VOID_CAP=.1,VOID_ECHO_AFTER=8,VOID_PHRASE=12;
// The cap of a state in a chapter: in the Vacío the music never rises above the cube.
export function stateCap(state,id){const cap=STATE_CAP[state]??null;return cap!=null&&id==='vacio'?Math.min(cap,VOID_CAP):cap;}
export function normalizeChapters(j,inWorld=false){
 const q=j&&typeof j==='object'?j:{},chapter=Number.isInteger(q.chapter)&&q.chapter>=0&&q.chapter<CHAPTERS.length?q.chapter:inWorld?1:0;
 const done={},notes={};for(const id of CHAPTERS){if(q.done?.[id]===true)done[id]=true;const n=Array.isArray(q.notes?.[id])?q.notes[id].filter(m=>Number.isFinite(m)&&m>=24&&m<=96).slice(-16):[];if(n.length)notes[id]=n;}
 return {chapter,done,notes};}
// The state of a chapter from its on-time hits and whether it is done.
export function chapterState(hits,done){return done?'plenitud':hits>0?'pertenencia':'llegada';}
// The nearest place of a biome, searched in rings around a point on the World's grid. Never the sea, except for the
// Vacío, which is the open sea between continents.
export function findBiome(want,from,biomeAt,isSea,step=300,rings=60){for(let d=1;d<=rings;d++)for(let a=0;a<16;a++){const x=Math.round(from.x+Math.cos(a/16*6.283)*d*step),y=Math.round(from.y+Math.sin(a/16*6.283)*d*step);if(biomeAt(x,y)===want&&(want==='vacio'||!isSea(x,y)))return {x,y};}return null;}
export function initialize(runtime){
 let owner=null,hits=0,lastPulse=-1e9,portal=null;const storm=[],echoes=[];const moments={bolts:0,echoes:0};
 const calm=()=>!!(runtime.S.reducedMotion||prefersReducedMotion());
 const journey=()=>runtime.S.journey||{};
 function own(){if(owner!==runtime.S){owner=runtime.S;const j=journey();Object.assign(j,normalizeChapters(j,runtime.inWorld?.()));hits=0;portal=null;storm.length=0;echoes.length=0;lastPulse=performance.now();}return journey();}
 const active=()=>!!(runtime.journeyQuiet?.()&&runtime.inWorld?.()&&(runtime.S.layer||'superficie')==='superficie');
 const current=()=>CHAPTERS[own().chapter];
 const biomeId=()=>runtime.BIOMES?.[Math.max(0,runtime.curZone)]?.id;
 const inChapter=()=>active()&&WORLD_CHAPTERS.includes(current())&&biomeId()===current();
 function stateNow(){if(!active())return null;const j=own();const bars=(performance.now()-lastPulse)/1000/((runtime.SIX||.15)*16);if(bars>SILENCE_BARS&&!portal)return 'silencio';return chapterState(inChapter()?hits:0,!!j.done[current()]);}
 // Every pulse of the player: on-time theme notes are remembered for the finale.
 function pulse(on,midi){lastPulse=performance.now();if(!on||!inChapter())return;hits++;const j=own(),id=current();(j.notes[id]||=[]).push(midi);if(j.notes[id].length>16)j.notes[id].splice(0,j.notes[id].length-16);
  // The Tormenta: every note on time brings a bolt down on the beat.
  if(id==='tormenta'&&runtime.ac){storm.push(runtime.ac.currentTime);moments.bolts++;}
  // The Vacío: after eight notes the creatures that followed you come back and repeat each one, a bar later.
  if(id==='vacio'&&hits>VOID_ECHO_AFTER)echo(midi);}
 function echo(midi){const ac=runtime.ac,bar=(runtime.SIX||.15)*16;moments.echoes++;echoes.push({at:performance.now()+bar*1000,midi});if(echoes.length>8)echoes.shift();
  if(runtime.S.sound&&ac&&runtime.bus)runtime.soon?.(t=>{const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(440*2**((midi+12-69)/12),t+bar);g.gain.setValueAtTime(.0001,t+bar);g.gain.exponentialRampToValueAtTime(.07,t+bar+.02);g.gain.exponentialRampToValueAtTime(.0001,t+bar+.9);o.connect(g);g.connect(runtime.bus);o.start(t+bar);o.stop(t+bar+1);},'player');}
 // The whole theme, once, in tutti: the cube's voice with its octave below.
 function plenitude(){const ac=runtime.ac;if(!runtime.S.sound||!ac||!runtime.bus)return;runtime.soon?.(t=>{const MU=runtime.MU||{},scale=MU.dnaA?.scale||runtime.BIOMES?.[MU.biome||0]?.scale,eighth=(runtime.SIX||.15)*2;let at=t;for(const [d,l]of THEME){const m=themePitch(d,scale,MU.tr||0);playCello(ac,runtime.bus,at,m,l*eighth,.15);playCello(ac,runtime.bus,at,m-12,l*eighth,.08);at+=l*eighth;}},'player');}
 // A completed theme in the chapter's biome: Plenitud, and the portal to the next chapter.
 function phrase(){if(!inChapter())return false;const j=own(),id=current();if(j.done[id]||(id==='vacio'&&hits<VOID_PHRASE))return false;j.done[id]=true;if(runtime.save()===false){delete j.done[id];return false;}
  // The Tormenta's Plenitud: a bar of bolts, one on every beat.
  if(id==='tormenta'&&runtime.ac){const beat=(runtime.SIX||.15)*4;for(let i=1;i<=4;i++)storm.push(runtime.ac.currentTime+i*beat);moments.bolts+=4;}
  plenitude();runtime.enterFx=Math.max(runtime.enterFx||0,1);portal={x:runtime.S.wx+140,y:runtime.S.wy-40,at:performance.now()};return true;}
 // Through the portal: the next chapter's biome, found on the map near here.
 function travel(){const j=own();if(j.chapter>=CHAPTERS.length-1)return false;const next=j.chapter+1,id=CHAPTERS[next];
  // The festival build ends after the Lago, in the Refugio, with your phrase.
  if(runtime.festival&&!FESTIVAL_CHAPTERS.includes(id)){portal=null;finaleAsked=true;if(runtime.journeyFinale)runtime.journeyFinale({festival:true});else runtime.landHouse?.();return true;}
  if(id==='refugio'){j.chapter=next;portal=null;finaleAsked=true;runtime.save();if(runtime.journeyFinale)runtime.journeyFinale();else runtime.landHouse?.();return true;}
  const ids=runtime.BIOMES.map(b=>b.id),spot=findBiome(id,{x:runtime.S.wx,y:runtime.S.wy},(x,y)=>ids[runtime.biomeOfPos(x,y)],(x,y)=>!!runtime.regionOfPos?.(x,y)?.sea);if(!spot)return false;
  const before={chapter:j.chapter,wx:runtime.S.wx,wy:runtime.S.wy};j.chapter=next;runtime.S.wx=spot.x;runtime.S.wy=spot.y;if(runtime.save()===false){j.chapter=before.chapter;runtime.S.wx=before.wx;runtime.S.wy=before.wy;return false;}
  portal=null;hits=0;storm.length=0;echoes.length=0;lastPulse=performance.now();runtime.enterFx=1;return true;}
 // Where the chapter's biome is, refreshed every few seconds while the player is away from it.
 let way=null,wayAt=-1e9,wayFor='';
 function beacon(){if(!WORLD_CHAPTERS.includes(current())||inChapter()||portal||biomeId()===current())return null;const now=performance.now();if(wayFor!==current()||now-wayAt>3000){wayAt=now;wayFor=current();const ids=runtime.BIOMES.map(b=>b.id);way=findBiome(current(),{x:runtime.S.wx,y:runtime.S.wy},(x,y)=>ids[runtime.biomeOfPos(x,y)],(x,y)=>!!runtime.regionOfPos?.(x,y)?.sea,300,30);}return way;}
 // Entering the World in the Journey starts chapter 1 in the Llanura.
 function arrive(){const j=own();if(!active()||j.chapter!==0)return;j.chapter=1;const ids=runtime.BIOMES.map(b=>b.id);if(biomeId()!=='llanura'){const spot=findBiome('llanura',{x:runtime.S.wx,y:runtime.S.wy},(x,y)=>ids[runtime.biomeOfPos(x,y)],(x,y)=>!!runtime.regionOfPos?.(x,y)?.sea);if(spot){runtime.S.wx=spot.x;runtime.S.wy=spot.y;}}runtime.save();}
 let finaleAsked=false;
 function tick(){if(!active()){runtime.MU&&(runtime.MU.journeyCap=null);return;}arrive();
  // A Journey saved in the Refugio before its finale finished plays it again.
  if(current()==='refugio'&&!own().finished&&!finaleAsked&&runtime.journeyFinale){finaleAsked=true;runtime.journeyFinale();return;}const st=stateNow();if(runtime.MU)runtime.MU.journeyCap=st?stateCap(st,current()):null;
  if(storm.length&&runtime.MU&&!runtime.MU.boltAt&&runtime.ac&&storm[0]<=runtime.ac.currentTime+.02){runtime.MU.boltAt=Math.max(storm.shift(),runtime.ac.currentTime);}
  if(portal&&Math.hypot(runtime.S.wx-portal.x,runtime.S.wy-portal.y)<34)travel();}
 // The portal in the World, and seven small marks on the Line's right end: gold for done, white for here.
 function draw(c,W,H,t){tick();if(!active()||openSurface('.modal:not([hidden])'))return;const j=own(),still=calm();c.save();
  if(portal){const x=W/2+(portal.x-(runtime.camX??runtime.S.wx)),y=H/2+(portal.y-(runtime.camY??runtime.S.wy)),grow=Math.min(1,(performance.now()-portal.at)/900),r=22*grow;
   const g=c.createRadialGradient(x,y,0,x,y,r*2.4);g.addColorStop(0,'rgba(240,210,122,.35)');g.addColorStop(1,'rgba(240,210,122,0)');c.fillStyle=g;c.fillRect(x-r*2.4,y-r*2.4,r*4.8,r*4.8);
   c.strokeStyle='#f0d27a';c.lineWidth=1.5;for(let i=0;i<3;i++){c.globalAlpha=.9-i*.25;c.beginPath();c.arc(x,y,r*(1-i*.25),still?0:t/600+i,(still?0:t/600+i)+Math.PI*1.6);c.stroke();}}
  // The creatures of the Vacío around the cube: they light up when they repeat a note.
  if(current()==='vacio'&&inChapter()&&hits>VOID_ECHO_AFTER){const n=Math.max(2,Object.keys(j.done).length),now=performance.now();for(let i=0;i<n;i++){const a=i/n*6.283+(still?0:t/4000),x=W/2+Math.cos(a)*70,y=H/2+Math.sin(a)*46,lit=echoes.some(e=>now>=e.at&&now-e.at<400);c.globalAlpha=lit?.95:.35;c.fillStyle='#ffffff';c.fillRect(Math.round(x)-2,Math.round(y)-2,lit?5:4,lit?5:4);}}
  // Away from the chapter's biome, a beacon at the edge of the screen shows the way back.
  const way=beacon();if(way){const a=Math.atan2(way.y-runtime.S.wy,way.x-runtime.S.wx),ex=W/2+Math.cos(a)*(W/2-18),ey=H/2+Math.sin(a)*(H/2-60),bx=Math.max(14,Math.min(W-14,ex)),by=Math.max(70,Math.min(H-120,ey)),glow=still?.8:.55+.3*Math.sin(t/500);c.fillStyle='#f0d27a';for(let i=0;i<10;i++){c.globalAlpha=glow*.55*(i+1)/10;c.fillRect(bx-2,by-80+i*10,4,10);}c.globalAlpha=1;c.fillStyle='#f0d27a';c.fillRect(bx-2,by+18,4,4);}
  const y=Math.round(H*.8)+.5,x1=W-Math.max(24,W*.12),gap=9;c.globalAlpha=1;
  WORLD_CHAPTERS.forEach((id,i)=>{const x=x1-(WORLD_CHAPTERS.length-1-i)*gap,isHere=current()===id;c.fillStyle=j.done[id]?'#f0d27a':isHere?'#ffffff':'#ffffff40';c.globalAlpha=isHere&&!j.done[id]&&!still?.6+.4*Math.sin(t/300):1;c.fillRect(Math.round(x)-1,y+9,3,3);});
  c.restore();}
 Object.defineProperties(runtime,{journeyChapterPulse:{get:()=>pulse},journeyPhrase:{get:()=>phrase},journeyTravel:{get:()=>travel},drawJourneyChapters:{get:()=>draw},
  journeyChapter:{get:()=>()=>({moments:{...moments,storm:storm.length},beacon:!!(active()&&beacon()),chapter:own().chapter,id:current(),state:stateNow(),hits,portal:portal?{x:portal.x,y:portal.y}:null,done:{...own().done},notes:Object.fromEntries(Object.entries(own().notes).map(([k,v])=>[k,[...v]]))})}});
}
