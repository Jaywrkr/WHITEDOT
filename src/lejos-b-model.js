// Lejos, tanda B (Jay, 4 Nov 2026, alpha.249; docs/MUNDO.md#lejos-del-origen-tanda-b): five things spread over the
// universe by distance from the origin, from 10 to 30 km, so that going further is a reward in itself. Each one appears
// from its band and keeps appearing beyond it. The rules, with no page:
// · Región apagada (10 km): a grey, still region with its music low. Four embers in it; passing by each and pulsing on
//   time (with the sound off, passing is enough) lights it. All four bring back colour, creatures and the music, for good.
// · Hábitat (12 km): a nest and two or three elements of space around it (a rock, water, light). Bring them together by
//   passing through them and a creature comes to live there; it knows you when you come back.
// · Canción del cielo (15 km): four stones that hint a phrase. Four notes in order and on time (without sound, passing
//   the stones in order) change the local sky for a minute: an aurora, a shower of stars or a nebula.
// · Fusión de sonidos (20 km): the first time you reach 20 km, the Refugio lets you join two sounds of the album into a
//   new one, fixed by the pair and in the harmony that sounds.
// · Postal de buscar (25 km): a dense patch of stars where a creature lost five things. Finding them gives its page and
//   a postcard.
// Nothing here draws a random number: every place comes from hashKey and nothing on the map moves.
import {hashKey} from './universe-regions.js';
import {UNIVERSE_BASE,DIFFICULTY,RARITY,universeReward} from './spark-rules.js';
import {nearestSatellite} from './recorrer-model.js';
import {soundById} from './descubrir-model.js';
import {registerBand} from './bandas-model.js';
export const LEJOS_B_VERSION=1,UNITS_PER_KM=10000;
const TAU=Math.PI*2;
// The distance bands (bandas-model.js, from tanda A): each thing of this batch with the km it starts from, registered
// here, on load, with the notice given the first time you cross that km and the page «Lo que hay más lejos».
export const BAND_ITEMS=Object.freeze([
 Object.freeze({id:'region-apagada',km:10,name:'Región apagada',notice:'Región apagada · Empieza aquí.'}),
 Object.freeze({id:'habitat',km:12,name:'Hábitat',notice:'Hábitat · Empieza aquí.'}),
 Object.freeze({id:'cancion-del-cielo',km:15,name:'Canción del cielo',notice:'Canción del cielo · Empieza aquí.'}),
 Object.freeze({id:'fusion-de-sonidos',km:20,name:'Fusión de sonidos',notice:'Fusión de sonidos · Te espera en el Refugio.'}),
 Object.freeze({id:'postal',km:25,name:'Postal de buscar',notice:'Postal de buscar · Empieza aquí.'})]);
for(const b of BAND_ITEMS)registerBand({...b,batch:'B'});
// The kinds that have a place in the World, with the km they start from (the fusion lives in the Refugio).
export const SITE_KINDS=Object.freeze({apagada:10,habitat:12,cancion:15,postal:25});
export const FUSION_KM=20;
// ---------- places ----------
// The World in cells of 800 m: three in five hold one thing, of a kind whose band it is in (all kinds alike), kept
// off the cell's edges and 120 m or more from a rest satellite. The point itself must be in its band.
export const SITE_CELL=8000,SITE_SHARE=.6,SITE_MARGIN=.25,SITE_CLEAR=1200;
export const kmOf=p=>Math.hypot(p.x,p.y)/UNITS_PER_KM;
export const kindsAt=km=>Object.keys(SITE_KINDS).filter(k=>km>=SITE_KINDS[k]);
export function siteCell(world,i,j){
 const key=world+':'+i+','+j;if(hashKey('lejosb:has:v1:'+key)>=SITE_SHARE)return null;
 const span=1-2*SITE_MARGIN,x=Math.round((i+SITE_MARGIN+span*hashKey('lejosb:x:v1:'+key))*SITE_CELL),y=Math.round((j+SITE_MARGIN+span*hashKey('lejosb:y:v1:'+key))*SITE_CELL);
 const kinds=kindsAt(kmOf({x,y}));if(!kinds.length)return null;
 const kind=kinds[Math.min(kinds.length-1,Math.floor(hashKey('lejosb:kind:v1:'+key)*kinds.length))];
 const sat=nearestSatellite(world,{x,y});if(sat&&sat.d<SITE_CLEAR)return null;
 return Object.freeze({id:'lejos:'+key,kind,x,y,km:Math.round(kmOf({x,y})*10)/10,key});}
export function sitesAround(world,p,radius,cell=siteCell){const out=[],n=Math.ceil(radius/SITE_CELL),i0=Math.floor(p.x/SITE_CELL),j0=Math.floor(p.y/SITE_CELL);
 for(let i=i0-n;i<=i0+n;i++)for(let j=j0-n;j<=j0+n;j++){const s=cell(world,i,j);if(s){const d=Math.hypot(s.x-p.x,s.y-p.y);if(d<=radius)out.push({...s,d});}}return out.sort((a,b)=>a.d-b.d);}
// The nearest one of a kind (tests and the map's search): rings of cells outward.
export function nearestSite(world,p,kind,maxCells=40){const i0=Math.floor(p.x/SITE_CELL),j0=Math.floor(p.y/SITE_CELL);let best=null;
 for(let n=0;n<=maxCells;n++){for(let i=i0-n;i<=i0+n;i++)for(let j=j0-n;j<=j0+n;j++){if(Math.max(Math.abs(i-i0),Math.abs(j-j0))!==n)continue;const s=siteCell(world,i,j);if(!s||kind&&s.kind!==kind)continue;const d=Math.hypot(s.x-p.x,s.y-p.y);if(!best||d<best.d)best={...s,d};}
  if(best&&best.d<(n-1)*SITE_CELL)break;}return best;}
// A point around a site at a distance (units) and angle from hashKey.
const around=(site,tag,k,min,max)=>{const a=(k/4+hashKey(`${tag}:a:v1:${site.key}:${k}`)*.18)*TAU+hashKey(`${tag}:r0:v1:${site.key}`)*TAU,d=min+(max-min)*hashKey(`${tag}:d:v1:${site.key}:${k}`);return {k,x:Math.round(site.x+Math.cos(a)*d),y:Math.round(site.y+Math.sin(a)*d)};};
// What every place reveals, as everything in the edge marks: from EDGE_REACH (800 m), the nearest one not done yet.
export const EDGE_REACH=8000;
// ---------- región apagada ----------
// Sixty metres across the cube's way (a phone sees 39 m). Inside, the music goes to DEAD_DUCK (about 10 dB lower, evenly,
// through runtime.musicDuck, the one line Jay authorised in audio.js in alpha.246) until it is revived.
export const DEAD_R=600,EMBERS=4,EMBER_MIN=150,EMBER_MAX=420,EMBER_TOUCH=60,EMBER_PULSE=120,DEAD_DUCK=.3,DEAD_TAU=.8;
export const embersOf=site=>Array.from({length:EMBERS},(_,k)=>around(site,'brasa',k,EMBER_MIN,EMBER_MAX));
// An ember lit: with sound, by a pulse on time within reach of it; without, by the cube passing through it.
export function emberLit(ember,player,pulses,sound){
 if(!sound)return Math.hypot(ember.x-player.x,ember.y-player.y)<=EMBER_TOUCH?{onTime:false}:null;
 for(const w of pulses||[])if(w.beat&&Math.hypot(ember.x-w.x,ember.y-w.y)<=EMBER_PULSE)return {onTime:true};return null;}
// Small and repeatable (decision 9): a region revived pays like an easy living encounter, by the universe's rule: 8 ✦ at
// 10–20 km, 11 if every ember was lit on time; 10 and 15 beyond 20 km.
export const reviveReward=(x,y,onTime)=>universeReward(UNIVERSE_BASE.live,{difficulty:DIFFICULTY.easy,x,y,onTime});
// ---------- hábitat ----------
export const ELEMENTS=Object.freeze(['roca','agua','luz']);
export const ELEMENT_NAMES=Object.freeze({roca:'Roca',agua:'Agua',luz:'Luz'});
export const RECIPES=Object.freeze([['roca','agua'],['roca','luz'],['agua','luz'],['roca','agua','luz']].map(Object.freeze));
// The creature of each recipe, in the same order.
export const CREATURES=Object.freeze(['Tortuga de cometa','Luciérnaga de piedra','Medusa de luz','Ballena de bolsillo']);
export const NEST_R=60,ELEMENT_MIN=180,ELEMENT_MAX=380,ELEMENT_TOUCH=60,HAB_NEAR=320,HAB_LEAVE=2500;
export const recipeOf=site=>RECIPES[Math.min(RECIPES.length-1,Math.floor(hashKey('habitat:receta:v1:'+site.key)*RECIPES.length))];
export const creatureOf=recipe=>CREATURES[RECIPES.findIndex(x=>x.join()===recipe.join())]||null;
export const elementsOf=site=>recipeOf(site).map((el,k)=>({...around(site,'elemento',k,ELEMENT_MIN,ELEMENT_MAX),el}));
// A creature comes: like an easy living encounter (8 ✦ at 12–20 km); with three elements, a rare one (11).
export const habitatReward=(x,y,three)=>universeReward(UNIVERSE_BASE.live,{difficulty:DIFFICULTY.easy,x,y,rarity:three?RARITY.rare:RARITY.common});
// ---------- canción del cielo ----------
export const PHRASES=Object.freeze([[0,2,4,7],[4,2,0,-3],[0,4,2,5],[7,4,5,2],[2,4,7,9],[0,-1,2,4]].map(Object.freeze));
export const SKY_EFFECTS=Object.freeze(['aurora','estrellas','nebulosa']);
export const SKY_EFFECT_NAMES=Object.freeze({aurora:'Aurora',estrellas:'Lluvia de estrellas',nebulosa:'Nebulosa'});
export const STONE_R=120,STONE_TOUCH=45,STONE_PULSE=70,SONG_HINT=600,SONG_GAP=6,SONG_SECONDS=60,SONG_LOCAL=2500;
export const phraseOf=site=>PHRASES[Math.min(PHRASES.length-1,Math.floor(hashKey('cancion:frase:v1:'+site.key)*PHRASES.length))];
export const effectOf=site=>SKY_EFFECTS[Math.min(SKY_EFFECTS.length-1,Math.floor(hashKey('cancion:cielo:v1:'+site.key)*SKY_EFFECTS.length))];
export function stonesOf(site){const a0=hashKey('cancion:giro:v1:'+site.key)*TAU;return [0,1,2,3].map(k=>({k,x:Math.round(site.x+Math.cos(a0+k*TAU/4)*STONE_R),y:Math.round(site.y+Math.sin(a0+k*TAU/4)*STONE_R)}));}
// One step of the phrase: the next stone, on time (with sound: a pulse on time by it; without, the cube passing it).
// Returns 'next' (that stone), 'wrong' (another stone: the phrase starts again, without loss) or null (nothing).
export function songStep(stones,next,player,pulses,sound){
 const hit=p=>{let best=null,bd=Infinity;for(const s of stones){const d=Math.hypot(s.x-p.x,s.y-p.y);if(d<bd){bd=d;best=s;}}return best;};
 if(!sound){const s=hit(player);if(!s||Math.hypot(s.x-player.x,s.y-player.y)>STONE_TOUCH)return null;return s.k===next?'next':s.k===(next+3)%4?null:'wrong';}
 for(const w of pulses||[]){const s=hit(w);if(!s||Math.hypot(s.x-w.x,s.y-w.y)>STONE_PULSE)continue;if(!w.beat)return 'wrong';return s.k===next?'next':'wrong';}return null;}
// The first song of each site pays like an easy encounter, on time with sound (11 ✦ at 15–20 km, 15 beyond 20 km).
export const songReward=(x,y,onTime)=>universeReward(UNIVERSE_BASE.live,{difficulty:DIFFICULTY.easy,x,y,onTime});
// ---------- postal de buscar ----------
export const POSTAL_CREATURES=Object.freeze(['Pulpo de nebulosa','Polilla de cometa','Tortuga lunar','Búho de estrellas','Pez de luz']);
export const LOST_THINGS=Object.freeze(['Campanita','Semilla','Pluma','Farolito','Concha']);
export const POSTAL_R=350,POSTAL_LEAVE=700,LOST_MIN=70,LOST_MAX=300,LOST_TOUCH=40,LOST_LIGHT=160,POSTAL_STARS=230;
export const postalCreatureOf=site=>POSTAL_CREATURES[Math.min(POSTAL_CREATURES.length-1,Math.floor(hashKey('postal:quien:v1:'+site.key)*POSTAL_CREATURES.length))];
export const lostOf=site=>LOST_THINGS.map((name,k)=>({...around(site,'perdido',k*.8,LOST_MIN,LOST_MAX),k,name}));
// The dense stars of the scene, fixed by the site (drawing only).
export function postalStars(site,n=POSTAL_STARS){const out=[];for(let k=0;k<n;k++){const a=hashKey(`postal:sa:v1:${site.key}:${k}`)*TAU,d=Math.sqrt(hashKey(`postal:sd:v1:${site.key}:${k}`))*POSTAL_R*1.25;out.push({x:site.x+Math.cos(a)*d,y:site.y+Math.sin(a)*d,b:hashKey(`postal:sb:v1:${site.key}:${k}`)});}return out;}
// ---------- fusión de sonidos ----------
export const FUSION_NAMES=Object.freeze(['Eco de marea','Luz que respira','Campana de polvo','Grillo de nube','Viento de cobre','Latido de cristal','Lluvia que canta','Órbita pequeña','Musgo de luz','Ola de hierro','Coro de arena','Faro de agua','Semilla de trueno','Vidrio que late','Raíz de estrellas','Niebla que suena','Copa de viento','Púlsar de hojas','Duna de vidrio','Reloj de lluvia','Burbuja de luz','Arco de nieve','Chispa de musgo','Cometa dormido']);
export const FUSION_MADE_MAX=1600;
// The id of a pair (in either order): 'fusion:a+b' with a, b sorted. Null for a sound with itself or one that is not.
export function fusionId(a,b){if(!soundById(a)||!soundById(b)||a===b)return null;return 'fusion:'+[a,b].sort().join('+');}
// The sound of a pair, fixed by it: its name, the instrument of one of the two, the two motifs interleaved (scale
// degrees: always in the harmony that sounds), on the eighths of the bar, in the octave of one of the two.
export function fusedSound(id){
 const m=/^fusion:([a-z]+:[a-z]+)\+([a-z]+:[a-z]+)$/.exec(String(id||''));if(!m)return null;const A=soundById(m[1]),B=soundById(m[2]);if(!A||!B||A===B||m[1]>m[2])return null;
 const key=m[1]+'+'+m[2],h=k=>hashKey(`fusion:${k}:v1:${key}`),motif=[];for(let k=0;motif.length<5&&k<Math.max(A.motif.length,B.motif.length);k++){if(k<A.motif.length)motif.push(A.motif[k]);if(motif.length<5&&k<B.motif.length)motif.push(B.motif[k]);}
 const n=motif.length,steps=motif.map((_,k)=>Math.min(7,Math.round(k*8/n)));
 return Object.freeze({id:'fusion:'+key,fusion:true,parts:Object.freeze([A.id,B.id]),name:FUSION_NAMES[Math.min(FUSION_NAMES.length-1,Math.floor(h('nombre')*FUSION_NAMES.length))],inst:h('inst')<.5?A.inst:B.inst,motif:Object.freeze(motif),steps:Object.freeze(steps),oct:h('oct')<.5?A.oct:B.oct,biome:'fusion',n:-1});}
// ---------- sound ----------
// Notes of the place's scale, far under the music, through the voices and measured trims of the album of sounds.
export const LEJOS_INSTRUMENT='kalimba',LEJOS_GLASS='fmglass',LEJOS_GAIN=.02,LEJOS_HINT_GAIN=.006,LEJOS_HUM_GAIN=.008;
export const REVIVE_DEGREES=Object.freeze([0,2,4,7]),HABITAT_CALL=Object.freeze([4,7]),POSTAL_DONE=Object.freeze([0,2,4,7,9]);
// ---------- the save: S.lejosB ----------
// version 1: dead (site id → {lit: embers lit, done: day, x, y, b: biome}), habitats (site id → {placed, done, c:
// creature, x, y, visits, last}), songs (site id → {n, first}), effects (aurora/estrellas/nebulosa → times seen),
// fusion ({open: the day of 20 km, made: id → day}), postals (site id → {found, done, c}), cards (creature → day),
// earned (sparks). Unknown fields are kept; a later version is only read (readOnly) and never written.
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const dayKey=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:'';
const count=v=>Number.isSafeInteger(v)&&v>0?Math.min(v,1e9):0;
const finite=v=>Number.isFinite(v)&&Math.abs(v)<1e12;
const safeKey=k=>typeof k==='string'&&k.length>0&&k.length<120&&!['__proto__','constructor','prototype'].includes(k);
const keep=(raw,max,row)=>{const out={};if(plain(raw))for(const [k,v] of Object.entries(raw).slice(-max)){if(!safeKey(k)||!plain(v))continue;const r=row(v);if(r)out[k]=r;}return out;};
const indices=(v,max,allowed)=>[...new Set((Array.isArray(v)?v:[]).filter(x=>allowed?allowed.includes(x):Number.isInteger(x)&&x>=0&&x<max))].sort();
export function normalizeLejosB(raw){
 if(plain(raw)&&Number.isSafeInteger(raw.version)&&raw.version>LEJOS_B_VERSION)return Object.assign(raw,{readOnly:true});
 const q=plain(raw)?raw:{};const f=plain(q.fusion)?q.fusion:{},fx=plain(q.effects)?q.effects:{};
 const place=v=>finite(v.x)&&finite(v.y);
 const out=Object.assign(q,{version:LEJOS_B_VERSION,
  dead:keep(q.dead,400,v=>place(v)?Object.assign(v,{lit:indices(v.lit,EMBERS),done:dayKey(v.done),onTime:Math.min(EMBERS,count(v.onTime)),b:typeof v.b==='string'?v.b.slice(0,16):''}):null),
  habitats:keep(q.habitats,200,v=>place(v)?Object.assign(v,{placed:indices(v.placed,0,ELEMENTS),done:dayKey(v.done),c:typeof v.c==='string'&&CREATURES.includes(v.c)?v.c:'',visits:count(v.visits),last:dayKey(v.last)}):null),
  songs:keep(q.songs,200,v=>Object.assign(v,{n:count(v.n),first:dayKey(v.first)})),
  effects:Object.assign(fx,Object.fromEntries(SKY_EFFECTS.map(k=>[k,count(fx[k])]))),
  fusion:Object.assign(f,{open:dayKey(f.open),made:Object.fromEntries(Object.entries(plain(f.made)?f.made:{}).filter(([k])=>!!fusedSound(k)).slice(-FUSION_MADE_MAX).map(([k,v])=>[k,dayKey(v)]))}),
  postals:keep(q.postals,200,v=>Object.assign(v,{found:indices(v.found,LOST_THINGS.length),done:dayKey(v.done),c:POSTAL_CREATURES.includes(v.c)?v.c:''})),
  cards:Object.fromEntries(Object.entries(plain(q.cards)?q.cards:{}).filter(([k])=>POSTAL_CREATURES.includes(k)).map(([k,v])=>[k,dayKey(v)])),
  earned:count(q.earned)});
 delete out.readOnly;return out;}
const writable=q=>plain(q)&&!q.readOnly&&q.version===LEJOS_B_VERSION;
// ---------- changes (each returns what changed, or null; the caller saves and undoes on a failed save) ----------
// An ember lit: kept (with the region's place and biome); all four revive the region (once).
export function lightEmber(q,site,k,{day='',biome=''}={}){if(!writable(q)||!site||!(k>=0&&k<EMBERS))return null;const e=q.dead[site.id]||={lit:[],done:'',onTime:0,x:site.x,y:site.y,b:biome};if(e.done||e.lit.includes(k))return null;
 e.lit.push(k);e.lit.sort();if(biome&&!e.b)e.b=biome;const revived=e.lit.length===EMBERS;if(revived)e.done=dayKey(day)||'1970-01-01';return {lit:e.lit.length,revived};}
export const revived=(q,id)=>!!q?.dead?.[id]?.done;
// An element brought to its nest; all of the recipe bring the creature (once).
export function placeElement(q,site,el,day=''){if(!writable(q)||!site)return null;const recipe=recipeOf(site);if(!recipe.includes(el))return null;const h=q.habitats[site.id]||={placed:[],done:'',c:'',x:site.x,y:site.y,visits:0,last:''};
 if(h.done||h.placed.includes(el))return null;h.placed.push(el);h.placed.sort();const done=recipe.every(e=>h.placed.includes(e));if(done){h.done=dayKey(day)||'1970-01-01';h.c=creatureOf(recipe);h.last=dayKey(day);}return {placed:h.placed.length,total:recipe.length,done,creature:done?h.c:null,three:recipe.length===3};}
export const habitatDone=(q,id)=>!!q?.habitats?.[id]?.done;
// Coming back to a creature that lives there: it knows you (a visit counted, once per return).
export function greet(q,id,day=''){if(!writable(q))return null;const h=q.habitats[id];if(!h?.done)return null;h.visits=count(h.visits)+1;h.last=dayKey(day);return {visits:h.visits,creature:h.c};}
// A song sung: the sky changes (counted); the first at a site says so (it pays).
export function singSong(q,site,day=''){if(!writable(q)||!site)return null;const s=q.songs[site.id]||={n:0,first:''};const first=!s.n;s.n++;if(first)s.first=dayKey(day);const fx=effectOf(site);q.effects[fx]=count(q.effects[fx])+1;return {first,effect:fx,n:s.n};}
// A lost thing found; all five give the postcard of its creature (once per creature).
export function findLost(q,site,k,day=''){if(!writable(q)||!site||!(k>=0&&k<LOST_THINGS.length))return null;const c=postalCreatureOf(site),p=q.postals[site.id]||={found:[],done:'',c};if(p.done||p.found.includes(k))return null;
 p.found.push(k);p.found.sort();const done=p.found.length===LOST_THINGS.length;let card=false;if(done){p.done=dayKey(day)||'1970-01-01';if(!q.cards[c]){q.cards[c]=dayKey(day)||'1970-01-01';card=true;}}return {found:p.found.length,done,card,creature:c};}
export const postalDone=(q,id)=>!!q?.postals?.[id]?.done;
// The fusion opens the first time you reach 20 km (free World).
export function openFusion(q,km,day=''){if(!writable(q)||q.fusion.open||!(km>=FUSION_KM))return false;q.fusion.open=dayKey(day)||'1970-01-01';return true;}
export const fusionOpen=q=>!!q?.fusion?.open;
// A fusion made: in the album (S.soundAlbum.sounds, as any sound) and here (the day). Null if made before or not open.
export function makeFusion(q,album,a,b,day=''){if(!writable(q)||!fusionOpen(q)||!plain(album)||album.readOnly||!plain(album.sounds))return null;const id=fusionId(a,b);if(!id||!album.sounds[a]||!album.sounds[b]||album.sounds[id]||q.fusion.made[id])return null;
 const s=fusedSound(id);album.sounds[id]={first:dayKey(day),count:1,onTime:0,fusion:true};q.fusion.made[id]=dayKey(day);return s;}
export const fusedIn=(album)=>Object.keys(plain(album?.sounds)?album.sounds:{}).filter(id=>!!fusedSound(id)).map(fusedSound);
// The pages of the Bitácora: each one once found (nothing is said of the rest).
export const LEJOS_PAGES=Object.freeze(['apagada','habitat','cancion','fusion','postal']);
export function lejosPages(q){if(!plain(q)||q.version!==LEJOS_B_VERSION&&!q.readOnly)return [];const any=o=>Object.values(plain(o)?o:{}).some(v=>v?.done);
 return LEJOS_PAGES.filter(id=>id==='apagada'?any(q.dead):id==='habitat'?any(q.habitats):id==='cancion'?Object.values(q.songs||{}).some(v=>v?.n>0):id==='fusion'?fusionOpen(q):Object.keys(q.cards||{}).length>0);}
