// Escenas musicales, entrega 1 (Jay, 3 Nov 2026, alpha.241; docs/UNIVERSO.md#escenas-musicales): the model, with no
// page, canvas or sound. With the setting «Escenas: más variedad» on, a few places of the free World are stages: as you
// come near one, a club of its own rises on top of the place's music (never instead of it) and fades out as you leave.
// Two scenes: the Almacén (a warehouse of techno, minimal, acid and EBM) and the Patio latino (an open-air patio of tech
// house, minimal, deep and afro). Each stage has its own hand (hats, swing, kit, filter, fills, the length of its arc), and
// each arc (intro, build, drop, breakdown, return) draws new patterns, so it never plays the same twice. Notes always come
// from the place's own chord: the harmony is untouched.
// Everything is placed with hashKey: no old random sequence is read and nothing on the map moves.
import {hashKey} from './universe-regions.js';
export const SCENES_VERSION=1;
export const UNITS_PER_KM=10000;
// Zones of 2×2 regions: one stage in about one of ten zones near the origin, one of six beyond 5 km.
export const ZONE_REGIONS=2,NEAR_SHARE=.1,FAR_SHARE=1/6,FAR_KM=5,STAGE_TRIES=4;
// Heard from 520 m, whole within 160 m of the stage (it rises and falls smoothly in between).
export const STAGE_HEAR=5200,STAGE_FULL=1600;
export const SCENES=Object.freeze([
 Object.freeze({id:'almacen',name:'Almacén',line:'Escena · Almacén',genres:Object.freeze(['acid','minimaltechno','melodictechno','detroit','algorave','minimal','rominimal','acidhouse','ebm','robotic','detroitelectro'])}),
 Object.freeze({id:'patio',name:'Patio latino',line:'Escena · Patio latino',genres:Object.freeze(['techhouse','minimal','rominimal','microhouse','deep','afro','tribal','organic','tropical','amapiano'])})
]);
// The world's key for the stages (the same identity as the map's, so another world has other stages).
export const sceneWorldKey=identity=>Math.floor(hashKey(JSON.stringify(identity??null))*4294967296).toString(36);
export const sceneById=id=>SCENES.find(s=>s.id===id)||null;
export const scenesFor=genre=>SCENES.filter(s=>s.genres.includes(genre));
// ---------- the setting (S.scenes) ----------
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
// Off by default. Unknown fields are kept; a later version is left untouched and reads off.
export function normalizeScenes(raw){if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>SCENES_VERSION)return raw;const q=plain(raw)?raw:{};return {...q,version:SCENES_VERSION,on:q.on===true};}
export const scenesWritable=q=>q?.version===SCENES_VERSION;
export const scenesOn=q=>scenesWritable(q)&&q.on===true;
// ---------- the stages ----------
// How near a stage is heard: 0 far away, 1 at the stage, a smooth rise in between.
export function stageProximity(d){if(!(d<STAGE_HEAR))return 0;if(d<=STAGE_FULL)return 1;const k=(STAGE_HEAR-d)/(STAGE_HEAR-STAGE_FULL);return k*k*(3-2*k);}
// The stage of a zone, or null. under(x,y) says what is there: {genre, sea}. RP is a region's size in world units.
// The stage sits near the middle of one of the zone's regions whose genre has a scene (the first of four tries).
export function stageInZone(world,zx,zy,under,RP){
 const key='scene:v1:'+world+':'+zx+','+zy,zp=RP*ZONE_REGIONS,far=Math.hypot((zx+.5)*zp,(zy+.5)*zp)>FAR_KM*UNITS_PER_KM;
 if(hashKey(key)>=(far?FAR_SHARE:NEAR_SHARE))return null;
 for(let k=0;k<STAGE_TRIES;k++){const pick=Math.floor(hashKey(key+':r'+k)*4)%4,rx=zx*ZONE_REGIONS+(pick&1),ry=zy*ZONE_REGIONS+(pick>>1);
  const x=(rx+.5+(hashKey(key+':x'+k)-.5)*.24)*RP,y=(ry+.5+(hashKey(key+':y'+k)-.5)*.24)*RP,d=under(x,y);if(!d||d.sea)continue;
  const options=scenesFor(d.genre);if(!options.length)continue;const scene=options[Math.floor(hashKey(key+':scene')*options.length)%options.length];
  return Object.freeze({id:'escena:'+zx+','+zy,key,x,y,zone:Object.freeze([zx,zy]),scene:scene.id,genre:d.genre,hand:handFor(key,scene.id)});}
 return null;
}
// Every stage whose middle is within radius of a point.
export function stagesNear(world,p,radius,under,RP){const zp=RP*ZONE_REGIONS,out=[];
 for(let zx=Math.floor((p.x-radius)/zp);zx<=Math.floor((p.x+radius)/zp);zx++)for(let zy=Math.floor((p.y-radius)/zp);zy<=Math.floor((p.y+radius)/zp);zy++){const s=stageInZone(world,zx,zy,under,RP);if(s&&Math.hypot(s.x-p.x,s.y-p.y)<=radius)out.push(s);}
 return out.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));}
// ---------- the hand of a stage ----------
// Sixteenth patterns of the hats (a velocity per step).
export const HAT_PATTERNS=Object.freeze([
 [.55,.25,1,.3,.55,.25,1,.3,.55,.25,1,.3,.55,.25,1,.45],
 [.4,.4,1,.4,.4,.7,1,.4,.4,.4,1,.4,.4,.7,1,.6],
 [.7,.3,.9,.3,.7,.3,.9,.5,.7,.3,.9,.3,.7,.3,.9,.7],
 [.3,.6,1,.6,.3,.6,1,.6,.3,.6,1,.6,.3,.6,1,.8],
 [.6,0,1,.35,.6,0,1,.35,.6,0,1,.35,.6,.35,1,.35]
].map(Object.freeze));
// Kits: the long kick's pitch (Hz) and length (s), the rumble, the hats' tone (Hz) and the wave of the acid line.
export const KITS=Object.freeze({
 almacen:Object.freeze([{kick:48,decay:.62,rumble:.9,tone:8200,wave:'sawtooth'},{kick:44,decay:.75,rumble:1,tone:7400,wave:'sawtooth'},{kick:52,decay:.5,rumble:.7,tone:9000,wave:'square'},{kick:46,decay:.68,rumble:.85,tone:7800,wave:'square'}].map(Object.freeze)),
 patio:Object.freeze([{conga:0,bongo:12,tone:6800,bass:'sine'},{conga:-2,bongo:10,tone:7400,bass:'triangle'},{conga:2,bongo:12,tone:6200,bass:'sine'},{conga:0,bongo:14,tone:7000,bass:'triangle'}].map(Object.freeze))
});
// Filters on the whole scene through its arc: the Almacén's low-pass and the Patio's high-pass (Hz): intro, the start and
// end of the build, the drop, the breakdown.
export const FILTERS=Object.freeze({
 almacen:Object.freeze([[700,900,7000,18000,1100],[500,700,5000,18000,900],[900,1200,9000,18000,1500]].map(Object.freeze)),
 patio:Object.freeze([[900,700,140,20,380],[1200,900,180,20,500],[700,600,110,20,300]].map(Object.freeze))
});
// Claves for the cowbell: son 3-2 and rumba 3-2.
export const CLAVES=Object.freeze({son:Object.freeze([0,3,6,10,12]),rumba:Object.freeze([0,3,7,10,12])});
export function handFor(key,scene){const h=k=>hashKey(key+':hand:'+k),pick=(k,list)=>list[Math.floor(h(k)*list.length)%list.length];
 const kits=KITS[scene]||KITS.almacen,filters=FILTERS[scene]||FILTERS.almacen;
 return Object.freeze({key,scene,arc:h('arc')<.5?32:64,fill:h('fill')<.5?8:16,hats:Math.floor(h('hats')*HAT_PATTERNS.length)%HAT_PATTERNS.length,kit:pick('kit',kits),filter:pick('filter',filters),
  swing:scene==='patio'?.1+.12*h('swing'):.03*h('swing'),clave:h('clave')<.5?'son':'rumba',resonance:11+7*h('res'),acidRise:.6+.4*h('rise'),voice:pick('voice',['a','o','e','i'])});}
// ---------- the arc ----------
// Bars of each section for an arc of 64 (half for 32): intro, build, drop, breakdown, return.
export const SECTIONS=Object.freeze([['intro',8],['build',16],['drop',16],['breakdown',8],['return',16]].map(Object.freeze));
// The scene's level in each section (the build rises from .5 to .8).
export const SECTION_LEVEL=Object.freeze({intro:.4,build:.5,drop:1,breakdown:.12,return:1});
export function arcAt(hand,bar){const len=hand.arc,scale=len/64,b=((bar%len)+len)%len,cycle=Math.floor(bar/len);let start=0;
 for(const [name,size64]of SECTIONS){const size=size64*scale;if(b<start+size){const i=b-start,progress=size>1?i/(size-1):1;
  const riser=(name==='build'||name==='breakdown')&&i>=size-2,drop=(name==='drop'||name==='return')&&i===0;
  const fill=!riser&&name!=='intro'&&name!=='breakdown'&&(b+1)%hand.fill===0;
  const level=name==='build'?SECTION_LEVEL.build+.3*progress:SECTION_LEVEL[name];
  return {section:name,i,size,progress,riser,riserStart:riser&&i===size-2,drop,fill,level,cycle,bar:b};}start+=size;}
 return {section:'intro',i:0,size:1,progress:0,riser:false,riserStart:false,drop:false,fill:false,level:SECTION_LEVEL.intro,cycle,bar:b};}
// The section's filter value at a point of the arc (the build sweeps from its start to its end).
export function filterAt(hand,a){const [intro,b0,b1,drop,breakdown]=hand.filter;
 switch(a.section){case 'intro':return intro;case 'build':return b0*Math.pow(b1/b0,a.progress);case 'breakdown':return breakdown;default:return drop;}}
// ---------- the patterns of each arc (new every cycle: endless variation, always on the chord) ----------
const v=(key,k)=>hashKey(key+':'+k);
// The acid line: per step on/off, the chord tone (0–4), up an octave, accent and slide.
export function acidLine(hand,cycle){const key=hand.key+':acid:'+cycle,out=[];
 for(let s=0;s<16;s++){const on=s===0||v(key,'on'+s)<(s%2?.45:.72);out.push(Object.freeze({on,tone:s===0?0:Math.floor(v(key,'t'+s)*5)%5,up:v(key,'u'+s)<.22,accent:v(key,'a'+s)<.3,slide:s>0&&v(key,'s'+s)<.2}));}
 return Object.freeze(out);}
// Metal strikes of the Almacén: a few off-beat steps.
export function metalSteps(hand,cycle){const key=hand.key+':metal:'+cycle,base=[3,6,7,11,14,15].filter(s=>v(key,'m'+s)<.42);return Object.freeze(base.length?base:[7]);}
// The conga tumbao (steps: drum and stroke) and the bongó's martillo, with a few ghost notes drawn per cycle.
export const TUMBAOS=Object.freeze([
 [[0,'conga','mute'],[2,'conga','slap'],[4,'conga','mute'],[6,'tumba','open'],[7,'tumba','open'],[8,'conga','mute'],[10,'conga','slap'],[12,'conga','mute'],[14,'conga','open'],[15,'conga','open']],
 [[0,'tumba','open'],[3,'conga','slap'],[4,'conga','mute'],[6,'conga','open'],[7,'conga','open'],[10,'conga','slap'],[12,'conga','mute'],[14,'tumba','open'],[15,'tumba','open']],
 [[2,'conga','slap'],[4,'conga','mute'],[6,'tumba','open'],[8,'conga','mute'],[10,'conga','slap'],[11,'conga','mute'],[13,'conga','open'],[14,'tumba','open']]
].map(p=>Object.freeze(p.map(Object.freeze))));
export function congaPattern(hand,cycle){const key=hand.key+':conga:'+cycle,base=TUMBAOS[Math.floor(v(key,'p')*TUMBAOS.length)%TUMBAOS.length],taken=new Set(base.map(n=>n[0])),ghosts=[];
 for(let s=1;s<16;s+=2)if(!taken.has(s)&&v(key,'g'+s)<.25)ghosts.push(Object.freeze([s,'conga','ghost']));
 return Object.freeze([...base,...ghosts].sort((a,b)=>a[0]-b[0]));}
export function bongoSteps(hand,cycle){const key=hand.key+':bongo:'+cycle,out=[];for(let s=0;s<16;s+=2)out.push(Object.freeze([s,s%4===0?'macho':'hembra',v(key,'o'+s)<.3?'open':'tap']));for(let s=1;s<16;s+=2)if(v(key,'x'+s)<.18)out.push(Object.freeze([s,'hembra','tap']));return Object.freeze(out.sort((a,b)=>a[0]-b[0]));}
// The rolling bass: off-beat sixteenths, root or fifth of the chord.
export function bassSteps(hand,cycle){const key=hand.key+':bass:'+cycle,base=[[2,0],[3,0],[6,0],[7,2],[10,0],[11,0],[14,0],[15,2]];return Object.freeze(base.filter(([s])=>s%4===2||v(key,'b'+s)<.6).map(([s,tone])=>Object.freeze([s,v(key,'f'+s)<.2?2:tone])));}
// Synthetic vocal chops (formants only, no human voice): steps, chord tone, the vowel pair and length (sixteenths).
export const VOWELS=Object.freeze({a:Object.freeze([800,1150,2900]),e:Object.freeze([400,1700,2600]),i:Object.freeze([300,2200,3000]),o:Object.freeze([450,800,2830]),u:Object.freeze([325,700,2530])});
export function chopSteps(hand,cycle){const key=hand.key+':chop:'+cycle,keys=Object.keys(VOWELS),out=[];
 for(const s of [3,6,10,11,14])if(v(key,'c'+s)<.4){const to=keys[Math.floor(v(key,'w'+s)*keys.length)%keys.length];out.push(Object.freeze({step:s,tone:Math.floor(v(key,'t'+s)*3)%3+2,from:hand.voice,to,len:v(key,'l'+s)<.5?1:2}));}
 if(!out.length)out.push(Object.freeze({step:10,tone:2,from:hand.voice,to:'i',len:2}));return Object.freeze(out);}
// A small deterministic variation for velocities and offsets (never the game's random sequence).
export const humanize=(key,bar,s,k='')=>hashKey(key+':h:'+bar+':'+s+':'+k);
