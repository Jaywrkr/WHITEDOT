// Descubrir (Jay, 29 Oct 2026, alpha.240; docs/MUNDO.md#descubrir): the model, with no page, canvas or sound.
// Rumores: completing something in the open universe (a living encounter, a figure of the Mapa del cielo, an activity, a
// mischief scene) sometimes brings a hint of something far and real: «Dicen que al norte, a 30 km, canta una ballena».
// The hint always points at something that is there: a sky figure, a rarity of the map, a landmark, a rare sound or, at
// least, a biome. At most three open at a time, never expiring, never lost; reaching one fulfils it.
// Álbum de sonidos: each biome has five rare sounds, placed with hashKey in spots of that biome. Walking to one (or a pulse
// on time near it) keeps it in the album. With them you make your own mix, on top of the music, never instead of it.
// Everything is placed with hashKey: no old random sequence is read and nothing on the map moves.
import {hashKey} from './universe-regions.js';
import {UNIVERSE_BASE,DIFFICULTY,RARITY,universeReward} from './spark-rules.js';
import {skyCell,skyFigure,skyDirection,skyNote,SKY_CELL} from './sky-map-model.js';
import {LETTER_PLACES} from './universe-letter.js';
export const RUMOR_VERSION=1,ALBUM_VERSION=1;
export const UNITS_PER_KM=10000;
// ---------- Rumores ----------
// At most three open; the last 24 fulfilled stay in the Bitácora. Chance of a rumor after something completed (the first
// one always comes). How near counts as arriving (a biome is reached a little before its centre).
export const RUMOR_OPEN_MAX=3,RUMOR_DONE_MAX=24,RUMOR_CHANCE=.45,RUMOR_ARRIVE=1200,RUMOR_ARRIVE_REGION=2400;
// How far from you a rumor speaks of, in km: nearer more often (decision 11: something every km, rare from 20, legends
// from 50 km from the origin).
export const RUMOR_DISTANCES=Object.freeze([2,3,4,5,6,8,10,12,15,20,25,30,40,50]);
export const RUMOR_DIRECTIONS=Object.freeze(['al este','al sureste','al sur','al suroeste','al oeste','al noroeste','al norte','al noreste']);
// What each kind of thing does in a rumor.
export const RUMOR_FIGURE_SAY=Object.freeze({ballena:'canta una ballena',guitarra:'suena una guitarra de estrellas',cohete:'despega un cohete de estrellas',vinilo:'gira un vinilo de estrellas',auricular:'brilla un auricular de estrellas',mano:'hay estrellas que nadie ha unido'});
export const RUMOR_FIGURE_DEFAULT='brillan las estrellas de {}';
export const RUMOR_LANDMARK_SAY=Object.freeze({torre:'se alza una Estrella guía',arbol:'respira una Nebulosa madre',ciudad:'flota un Cúmulo de formas',monolito:'espera un Monolito',faro:'parpadea una Baliza'});
export const RUMOR_LANDMARK_NAME=Object.freeze({torre:'Estrella guía',arbol:'Nebulosa madre',ciudad:'Cúmulo de formas',monolito:'Monolito',faro:'Baliza'});
export const RUMOR_REGION_SAY='se extiende {}';
export const RUMOR_KIND_NAMES=Object.freeze({figure:'Constelación',rare:'Rareza',landmark:'Hito',sound:'Sonido raro',region:'Paisaje'});
// ---------- Álbum de sonidos ----------
export const SOUND_BIOMES=Object.freeze(['llanura','bosque','lago','ruinas','jardin','dunas','cristales','faros','tormenta','cueva','vacio']);
export const SOUND_BIOME_NAMES=Object.freeze({llanura:'Llanura',bosque:'Bosque',lago:'Lago',ruinas:'Ruinas',jardin:'Jardín',dunas:'Dunas',cristales:'Cristales',faros:'Faros',tormenta:'Tormenta',cueva:'Cueva',vacio:'Vacío'});
// The world in cells of 600 m: at most one sound per cell, kept off its edges. Heard from 260 m (it sings every two
// bars, softly, louder as you come near), kept when the cube passes within 9 m, or by a pulse on time within 30 m.
export const SOUND_CELL=6000,SOUND_MARGIN=.2,SOUND_SHARE=.16,SOUND_HEAR=2600,SOUND_TOUCH=90,SOUND_PULSE=300,SOUND_NEAR=700;
// Far under the music: a sound singing in the World at most a living encounter's quiet step; kept, a living encounter's
// note; each voice of your mix as quiet as a star of the Mapa del cielo.
export const SOUND_SING_GAIN=.012,SOUND_KEEP_GAIN=.02,SOUND_MIX_GAIN=.012;
// Each instrument's own level differs a lot: these trims, measured by render (tests/descubrir_mix.py), bring every
// sound's motif to about a living encounter's note in its family's lead (some 28 dB under the music; a mix of four, about 28 dB under it too).
export const SOUND_TRIM=Object.freeze({kalimba:0.083,steel:0.098,airflute:0.068,membrane:0.135,choir:0.503,hollow:0.585,plucked:0.112,logdrum:0.128,granularair:0.24,bowed:0.45,fmglass:0.075,phasekeys:0.098,clav:0.203,rhodes:0.068,metalkeys:0.135,orbitorgan:0.12,reed:0.398,pad:0.21,resonantpluck:0.247});
// Your mix: up to four sounds at once. The spots already kept: the latest 400 (they stay silent).
export const MIX_MAX=4,SPOTS_MAX=400;
// A sound: its biome, place in the series (0–4; the fourth is rarer near the origin, the fifth much rarer before 20 km),
// name, how a rumor says it, instrument, motif (scale degrees), its eighths in a bar and octave.
const N=(biome,slug,name,a,inst,motif,steps,oct=0,say='suena')=>({biome,slug,name,a,inst,motif,steps,oct,say});
const RAW=[
 N('llanura','grillo','Grillo de cristal','un grillo de cristal','kalimba',[4,4,7],[0,1,4],1,'canta'),
 N('llanura','campana','Campana de hierba','una campana de hierba','steel',[0,4,2],[0,3,6],1),
 N('llanura','espigas','Viento en las espigas','el viento en las espigas','airflute',[2,4,5,4],[0,2,4,6],0),
 N('llanura','latido','Latido bajo la tierra','un latido bajo la tierra','membrane',[0,0,-3],[0,1,4],-1,'late'),
 N('llanura','semillas','Coro de semillas','un coro de semillas','choir',[0,2,4,7],[0,2,4,6],0,'canta'),
 N('bosque','buho','Búho de madera','un búho de madera','hollow',[4,2],[0,3],0,'canta'),
 N('bosque','gotas','Gotas en las hojas','unas gotas en las hojas','plucked',[7,5,4,2],[0,1,3,5],1,'suenan'),
 N('bosque','tronco','Tronco hueco','un tronco hueco','logdrum',[0,0,4],[0,3,6],-1),
 N('bosque','musgo','Musgo que zumba','un musgo que zumba','granularair',[2,3],[0,4],0,'zumba'),
 N('bosque','arbol','Árbol que canta','un árbol que canta','bowed',[0,4,7,9],[0,2,4,6],0,'canta'),
 N('lago','pez','Pez campana','un pez campana','fmglass',[4,7],[0,3],1),
 N('lago','ola','Ola pequeña','una ola pequeña','phasekeys',[0,2,4,2],[0,2,4,6],0),
 N('lago','burbuja','Burbuja grave','una burbuja grave','membrane',[0,4],[0,5],-1),
 N('lago','rana','Rana de vidrio','una rana de vidrio','clav',[4,4,5],[0,1,2],1,'canta'),
 N('lago','ballena','Ballena del lago','una ballena del lago','choir',[0,-1,0,4],[0,2,4,6],-1,'canta'),
 N('ruinas','columna','Columna que silba','una columna que silba','airflute',[7,4],[0,4],1,'silba'),
 N('ruinas','piedra','Piedra hueca','una piedra hueca','logdrum',[0,2,0],[0,3,5],-1),
 N('ruinas','arco','Eco del arco','el eco de un arco','rhodes',[4,2,0],[0,3,6],0),
 N('ruinas','reloj','Reloj parado','un reloj parado','metalkeys',[7,7,7],[0,2,4],1),
 N('ruinas','organo','Órgano roto','un órgano roto','orbitorgan',[0,3,4,7],[0,2,4,6],0),
 N('jardin','flor','Flor que suena','una flor que suena','kalimba',[2,4,7],[0,2,4],1),
 N('jardin','abeja','Abeja de luz','una abeja de luz','reed',[4,5,4],[0,1,2],1,'zumba'),
 N('jardin','riego','Lluvia de riego','una lluvia de riego','plucked',[7,6,4,2],[0,1,2,3],1,'cae'),
 N('jardin','semilla','Semilla que late','una semilla que late','membrane',[0,0],[0,4],-1,'late'),
 N('jardin','raiz','Raíz que canta','una raíz que canta','bowed',[0,2,4,5],[0,2,4,6],-1,'canta'),
 N('dunas','arena','Arena que canta','la arena que canta','granularair',[0,4],[0,4],0,'canta'),
 N('dunas','escarabajo','Escarabajo de cobre','un escarabajo de cobre','clav',[2,0,2],[0,1,3],1),
 N('dunas','cascabel','Cascabel del viento','un cascabel del viento','metalkeys',[4,7,4],[0,2,3],1),
 N('dunas','respira','Duna que respira','una duna que respira','pad',[0,4],[0,4],-1,'respira'),
 N('dunas','caravana','Caravana lejana','una caravana lejana','reed',[0,2,3,4],[0,2,4,6],0),
 N('cristales','prisma','Prisma que vibra','un prisma que vibra','fmglass',[0,7],[0,2],1,'vibra'),
 N('cristales','copa','Copa de cuarzo','una copa de cuarzo','steel',[4,9],[0,4],1),
 N('cristales','geoda','Geoda','una geoda','kalimba',[2,4,2,0],[0,1,2,3],1),
 N('cristales','eco','Eco de cristal','un eco de cristal','phasekeys',[4,4,4],[0,3,6],1),
 N('cristales','arpa','Arpa de luz','un arpa de luz','resonantpluck',[0,2,4,7,9],[0,1,2,3,4],0),
 N('faros','pulsar','Púlsar pequeño','un púlsar pequeño','metalkeys',[7,7],[0,4],1,'late'),
 N('faros','senal','Señal lejana','una señal lejana','hollow',[4,2,4],[0,2,4],0),
 N('faros','haz','Haz que gira','un haz que gira','phasekeys',[0,4,7,4],[0,2,4,6],0,'gira'),
 N('faros','boya','Boya','una boya','steel',[2,0],[0,4],0),
 N('faros','faro','Faro dormido','un faro dormido','orbitorgan',[0,4,0],[0,3,6],-1,'respira'),
 N('tormenta','trueno','Trueno lejano','un trueno lejano','membrane',[0,0,0],[0,1,4],-1,'retumba'),
 N('tormenta','chispa','Chispa eléctrica','una chispa eléctrica','clav',[7,9],[0,1],1,'salta'),
 N('tormenta','lluvia','Lluvia de metal','una lluvia de metal','metalkeys',[4,2,4,2],[0,1,2,3],1,'cae'),
 N('tormenta','rayo','Rayo que canta','un rayo que canta','fmglass',[7,4,0],[0,1,2],1,'canta'),
 N('tormenta','ojo','Ojo de la tormenta','el ojo de la tormenta','choir',[0,3,4],[0,3,6],0,'canta'),
 N('cueva','gota','Gota en la piedra','una gota en la piedra','kalimba',[7,4],[0,5],1,'cae'),
 N('cueva','murcielago','Murciélago de luz','un murciélago de luz','reed',[9,7,9],[0,1,2],1,'canta'),
 N('cueva','profundo','Eco profundo','un eco profundo','rhodes',[0,0],[0,4],-1),
 N('cueva','estalactita','Estalactita','una estalactita','steel',[4,2,0],[0,2,4],1),
 N('cueva','corazon','Corazón de la cueva','el corazón de la cueva','logdrum',[0,0,4,0],[0,1,4,5],-1,'late'),
 N('vacio','zumba','Estrella que zumba','una estrella que zumba','granularair',[0,4],[0,4],0,'zumba'),
 N('vacio','satelite','Satélite perdido','un satélite perdido','metalkeys',[7,4,7],[0,2,4],1),
 N('vacio','polvo','Polvo cósmico','un polvo cósmico','plucked',[2,4,7,9],[0,1,2,3],1),
 N('vacio','cometa','Cometa que silba','un cometa que silba','airflute',[7,4,2],[0,2,4],1,'silba'),
 N('vacio','voz','Voz del vacío','la voz del vacío','choir',[0,4,7],[0,3,6],-1,'canta')
];
export const SOUNDS=Object.freeze(RAW.map((s,i)=>Object.freeze({...s,id:s.biome+':'+s.slug,n:i%5,motif:Object.freeze(s.motif),steps:Object.freeze(s.steps)})));
const SOUND_BY_ID=new Map(SOUNDS.map(s=>[s.id,s]));
export const soundById=id=>SOUND_BY_ID.get(id)||null;
export const biomeSounds=biome=>SOUNDS.filter(s=>s.biome===biome);
// How a rumor says a sound: «canta un grillo de cristal».
export const soundSay=s=>s.say+' '+s.a;
// The weight of each place in the series by distance from the origin: the fourth rarer before 5 km; the fifth much rarer
// before 20 km (decision 11: rare things from 20 km).
export function soundWeight(n,km=0){if(n===4)return km>=20?1.2:.12;if(n===3)return km>=5?1:.35;return 1;}
export function soundPick(biome,km,roll){const list=biomeSounds(biome);if(!list.length)return null;const w=list.map(s=>soundWeight(s.n,km)),sum=w.reduce((a,b)=>a+b,0);let k=Math.max(0,Math.min(.999999,roll))*sum;for(let i=0;i<list.length;i++){k-=w[i];if(k<0)return list[i];}return list.at(-1);}
// The sound of a cell, or null. world: a short key of the world; under(x,y): {biome} at that point.
export function soundCell(world,i,j,under){
 const key=world+':'+i+','+j,roll=hashKey('sonido:v1:'+key);if(roll>=SOUND_SHARE)return null;
 const x=(i+SOUND_MARGIN+(1-2*SOUND_MARGIN)*hashKey('sonido:x:v1:'+key))*SOUND_CELL,y=(j+SOUND_MARGIN+(1-2*SOUND_MARGIN)*hashKey('sonido:y:v1:'+key))*SOUND_CELL;
 const biome=under?.(x,y)?.biome,b=SOUND_BIOMES.includes(biome)?biome:'vacio',s=soundPick(b,Math.hypot(x,y)/UNITS_PER_KM,hashKey('sonido:pick:v1:'+key));if(!s)return null;
 return {id:'sonido:'+key,sound:s.id,biome:b,x,y};
}
// The sounds within a radius of a point (the cells around it).
export function soundsAround(world,p,radius,under){const out=[],n=Math.ceil(radius/SOUND_CELL),i0=Math.floor(p.x/SOUND_CELL),j0=Math.floor(p.y/SOUND_CELL);
 for(let i=i0-n;i<=i0+n;i++)for(let j=j0-n;j<=j0+n;j++){const s=soundCell(world,i,j,under);if(s&&Math.hypot(s.x-p.x,s.y-p.y)<=radius)out.push(s);}return out;}
// A note of a sound: a scale degree over the place's tonic, in its octave, kept between C2 and C7.
export function soundNote(scale,tonic,degree,oct=0){let n=skyNote(scale,tonic+12*oct,degree);while(n>96)n-=12;while(n<36)n+=12;return n;}
// When each note of a sound plays, from the start of its bar (eighth = SIX × 2).
export const soundTimes=(s,start,eighth)=>s.steps.map(k=>start+k*eighth);
// A new sound pays like a rare living encounter (decision 9: the small and repeatable gives sparks); one you already have,
// found at another spot, pays a loose spark's worth by the same rule. Completing a biome's series pays nothing: it gives
// the Aro de sonidos, a visible prize (and its page in the album).
export const SOUND_REPEAT_BASE=1;
export function soundReward({first=false,x=0,y=0,onTime=false}={}){return first?universeReward(UNIVERSE_BASE.live,{difficulty:DIFFICULTY.easy,x,y,rarity:RARITY.rare,onTime}):universeReward(SOUND_REPEAT_BASE,{x,y,onTime});}

const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const finite=v=>Number.isFinite(v)&&Math.abs(v)<1e12;
const text=(v,n=160)=>typeof v==='string'?v.slice(0,n):'';
const count=v=>Number.isSafeInteger(v)&&v>0?Math.min(v,1e9):0;
const safeKey=k=>typeof k==='string'&&k.length>0&&k.length<120&&!['__proto__','constructor','prototype'].includes(k);
// ---------- the saves ----------
// S.rumors: open (at most three), done (the last fulfilled), n (rolls made, the hash counter) and given. Unknown fields
// kept; a later version is only read.
const rumorRow=e=>plain(e)&&safeKey(e.id)&&finite(e.x)&&finite(e.y)&&typeof e.text==='string'?{...e,id:e.id,kind:text(e.kind,16)||'region',key:text(e.key,120),name:text(e.name,60),text:text(e.text,200),x:e.x,y:e.y,at:text(e.at,24),...(e.done!==undefined?{done:text(e.done,24)}:{})}:null;
export function normalizeRumors(raw){
 if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>RUMOR_VERSION)return raw;const q=plain(raw)?raw:{};
 const open=(Array.isArray(q.open)?q.open:[]).map(rumorRow).filter(Boolean).slice(-RUMOR_OPEN_MAX).map(e=>{const {done,...rest}=e;return rest;});
 const done=(Array.isArray(q.done)?q.done:[]).map(rumorRow).filter(Boolean).slice(-RUMOR_DONE_MAX);
 return {...q,version:RUMOR_VERSION,open,done,n:count(q.n),given:count(q.given)};
}
// S.soundAlbum: per sound (first day, times kept, on time), the spots already kept (they stay silent), the biomes whose
// series is complete (the day), your mix (up to four sounds), the Aro worn and the sparks earned. Unknown fields kept.
export function normalizeAlbum(raw){
 if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>ALBUM_VERSION)return raw;const q=plain(raw)?raw:{};
 const sounds={};for(const [id,e] of Object.entries(plain(q.sounds)?q.sounds:{}).slice(0,512)){if(!safeKey(id)||!plain(e))continue;sounds[id]={...e,first:text(e.first,24),count:Math.max(1,count(e.count)),onTime:Math.min(count(e.onTime),Math.max(1,count(e.count)))};}
 const spots=[...new Set((Array.isArray(q.spots)?q.spots:[]).filter(safeKey))].slice(-SPOTS_MAX);
 const series={};for(const [b,d] of Object.entries(plain(q.series)?q.series:{}))if(safeKey(b)&&typeof d==='string')series[b]=d.slice(0,24);
 const mix=[...new Set((Array.isArray(q.mix)?q.mix:[]).filter(id=>safeKey(id)&&!!sounds[id]))].slice(0,MIX_MAX);
 const wear=plain(q.wear)?{...q.wear}:{};if(!Object.keys(series).length)delete wear.ring;else wear.ring=wear.ring!==false;
 return {...q,version:ALBUM_VERSION,sounds,spots,series,mix,wear,earned:count(q.earned)};
}
// ---------- the album ----------
export const albumHas=(q,id)=>!!q?.sounds?.[id];
export function seriesProgress(q,biome){const list=biomeSounds(biome);return {done:list.filter(s=>albumHas(q,s.id)).length,total:list.length};}
export const seriesComplete=(q,biome)=>{const p=seriesProgress(q,biome);return p.total>0&&p.done===p.total;};
export const albumCount=q=>SOUNDS.filter(s=>albumHas(q,s.id)).length;
// Keep a sound found at a spot. Returns what changed: first (new to the album), series (a biome completed now), or null if
// the spot was already kept. The caller pays and saves (and undoes on a failed save).
export function keepSound(q,spot,{day='',onTime=false}={}){
 if(!plain(q)||q.version!==ALBUM_VERSION)return null;const s=soundById(spot?.sound);if(!s||!safeKey(spot.id)||q.spots.includes(spot.id))return null;
 const first=!q.sounds[s.id];const e=q.sounds[s.id]||={first:day,count:0,onTime:0};e.count++;if(onTime)e.onTime++;
 q.spots.push(spot.id);if(q.spots.length>SPOTS_MAX)q.spots.splice(0,q.spots.length-SPOTS_MAX);
 let series=null;if(first&&!q.series[s.biome]&&seriesComplete(q,s.biome)){q.series[s.biome]=day;q.wear.ring=q.wear.ring!==false;series=s.biome;}
 return {sound:s,first,series};
}
// Your mix: a sound in it goes out; a new one goes in while there is room. False when full or not in the album.
export function toggleMix(q,id){if(!plain(q)||q.version!==ALBUM_VERSION||!albumHas(q,id))return false;const i=q.mix.indexOf(id);if(i>=0){q.mix.splice(i,1);return true;}if(q.mix.length>=MIX_MAX)return false;q.mix.push(id);return true;}
// ---------- rumors ----------
export const directionWord=(from,to)=>{const a=Math.atan2(to.y-from.y,to.x-from.x),k=Math.round(a/(Math.PI/4));return RUMOR_DIRECTIONS[(k+8)%8];};
export const kmBetween=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y)/UNITS_PER_KM;
export const rumorText=(dir,km,what)=>`Dicen que ${dir}, a ${km} km, ${what}.`;
// Whether something completed brings a rumor now: the first always does, then about one in two; never with three open.
export function rumorDue(q,world){if(!plain(q)||q.version!==RUMOR_VERSION||q.open.length>=RUMOR_OPEN_MAX)return false;return q.n===0||hashKey('rumor:roll:v1:'+world+':'+q.n)<RUMOR_CHANCE;}
// The rumor: where it points and what is there. from: where you are; world: a short key of the world; n: the count.
// look: what the world has (functions, so the model needs no page): under(x,y) → {biome,region}, landmarkAt(rx,ry),
// anomalyAt(rx,ry), RP (a region's size), and skip(key) for what you already have or a rumor already speaks of.
export function rumorFor(from,world,n,look){
 const skip=look.skip||(()=>false),RP=look.RP||3600,tries=[];
 for(let t=0;t<4;t++){const h=hashKey(`rumor:v1:${world}:${n}:${t}`),km=RUMOR_DISTANCES[Math.min(RUMOR_DISTANCES.length-1,Math.floor(Math.pow(h,1.4)*RUMOR_DISTANCES.length))],a=Math.floor(hashKey(`rumor:dir:v1:${world}:${n}:${t}`)*8)*Math.PI/4;
  tries.push({x:from.x+Math.cos(a)*km*UNITS_PER_KM,y:from.y+Math.sin(a)*km*UNITS_PER_KM,t});}
 for(const T of tries){const far=Math.hypot(T.x,T.y)/UNITS_PER_KM,turn=Math.floor(hashKey(`rumor:kind:v1:${world}:${n}:${T.t}`)*4);
  let order=far>=50?['legend','rare','figure','sound','landmark']:far>=20?['rare','figure','sound','landmark']:['sound','landmark','figure','rare'];
  if(far<20)order=order.slice(turn).concat(order.slice(0,turn));
  for(const kind of order){const c=find(kind,T,far,world,look,RP,skip);if(c)return build(c,from,n);}}
 // Always something: the biome there.
 const T=tries[0],b=look.under?.(T.x,T.y)?.biome,biome=LETTER_PLACES[b]?b:'vacio';const rx=Math.floor(T.x/RP),ry=Math.floor(T.y/RP);
 return build({kind:'region',key:'region:'+rx+','+ry,name:SOUND_BIOME_NAMES[biome],what:RUMOR_REGION_SAY.replace('{}',LETTER_PLACES[biome]),x:(rx+.5)*RP,y:(ry+.5)*RP,biome},from,n);
}
function find(kind,T,far,world,look,RP,skip){
 const best=list=>list.filter(c=>c&&!skip(c.key)).sort((a,b)=>Math.hypot(a.x-T.x,a.y-T.y)-Math.hypot(b.x-T.x,b.y-T.y))[0]||null;
 if(kind==='figure'||kind==='legend'){const i0=Math.floor(T.x/SKY_CELL),j0=Math.floor(T.y/SKY_CELL),out=[];
  for(let i=i0-3;i<=i0+3;i++)for(let j=j0-3;j<=j0+3;j++){const s=skyCell(world,i,j,look.under,{night:false});if(!s)continue;const f=skyFigure(s.fig);if(!f)continue;
   if(kind==='legend'&&!f.legend)continue;if(kind==='figure'&&far>=20&&!(f.km>=20))continue;
   out.push({kind:'figure',key:s.id,name:f.secret?'???':f.name,what:RUMOR_FIGURE_SAY[f.id]||RUMOR_FIGURE_DEFAULT.replace('{}',f.name),x:s.x,y:s.y,fig:f.id});}
  const c=best(out);if(c||kind==='figure')return c;}
 if(kind==='rare'||kind==='legend'){if(!look.anomalyAt)return null;const rx0=Math.floor(T.x/RP),ry0=Math.floor(T.y/RP),out=[];
  for(let rx=rx0-3;rx<=rx0+3;rx++)for(let ry=ry0-3;ry<=ry0+3;ry++){let a=null;try{a=look.anomalyAt(rx,ry);}catch(_){}if(!a||!a.rumor)continue;if(kind==='legend'&&a.tier==='raro')continue;
   out.push({kind:'rare',key:'rare:'+rx+','+ry,name:a.name||'Rareza',what:a.rumor,x:(rx+.5)*RP,y:(ry+.5)*RP,tier:a.tier});}
  return best(out);}
 if(kind==='landmark'){if(!look.landmarkAt)return null;const rx0=Math.floor(T.x/RP),ry0=Math.floor(T.y/RP),out=[];
  for(let rx=rx0-3;rx<=rx0+3;rx++)for(let ry=ry0-3;ry<=ry0+3;ry++){let lm=null;try{lm=look.landmarkAt(rx,ry);}catch(_){}if(!lm||!RUMOR_LANDMARK_SAY[lm.type])continue;
   out.push({kind:'landmark',key:lm.id||'lm:'+rx+','+ry,name:RUMOR_LANDMARK_NAME[lm.type],what:RUMOR_LANDMARK_SAY[lm.type],x:lm.x,y:lm.y,type:lm.type});}
  return best(out);}
 if(kind==='sound'){const list=soundsAround(world,T,SOUND_CELL*2.5,look.under).map(s=>{const d=soundById(s.sound);return {kind:'sound',key:s.id,name:d.name,what:soundSay(d),x:s.x,y:s.y,sound:d.id,rare:d.n,known:!!look.known?.(d.id)};});
  // A sound you do not have yet first.
  return best(list.filter(c=>!c.known))||(far>=20?best(list.filter(c=>c.rare>=3)):null)||best(list);}
 return null;
}
function build(c,from,n){const km=Math.max(1,Math.round(kmBetween(from,c)));const dir=directionWord(from,c);
 const {what,...rest}=c;return {...rest,id:'rumor:'+n,x:Math.round(c.x),y:Math.round(c.y),text:rumorText(dir,km,what),what};}
// Arriving: near enough to the point (a biome counts from a little further).
export function rumorArrived(r,p){return !!r&&!!p&&Math.hypot(r.x-p.x,r.y-p.y)<=(r.kind==='region'?RUMOR_ARRIVE_REGION:RUMOR_ARRIVE);}
// The line of an open rumor in the Bitácora: what was said, and where it is now from you.
export function rumorNow(r,p){const km=kmBetween(p,r);if(km<.2)return 'aquí';const d=directionWord(p,r);return km<1?`${d}, a ${Math.round(km*1000)} m`:`${d}, a ${Math.round(km)} km`;}
// The world key, as the Mapa del cielo makes it (sky-map.js), so both read the same sites.
export const worldKey=identity=>Math.floor(hashKey(JSON.stringify(identity))*4294967296).toString(36);
export {skyDirection};
