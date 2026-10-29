// Mapa del cielo (F1, Jay, 28 Oct 2026; docs/IDEAS_UNIVERSO.md#constelaciones--ficha-ampliada-f1). Loose, faint stars in
// the free World that join into named figures when the cube passes through them in order. Each figure is a constellation
// inside the Mapa del cielo; the name avoids the Abyss region «Constelaciones», the living encounter «constelacion»,
// the activity «Constelación caída» and the relics' «Tu constelación».
// Everything comes from hashKey: no old random sequence is read and nothing on the map moves. A figure is data: its
// stars in the order they are joined, where each line comes from, and the notes of its motif.
import {hashKey} from './universe-regions.js';
import {UNIVERSE_BASE,DIFFICULTY,RARITY,universeReward} from './spark-rules.js';
export const SKY_VERSION=1;
// The world in cells of half a kilometre (10 u are 1 m): at most one figure per cell, kept off the cell's edges so two
// figures are always far apart. Seen from the cube, about one every kilometre or less (decision 11).
export const SKY_CELL=5000,SKY_MARGIN=.2;
// Chance that a cell holds a figure, by what is under it: more in the Void and the Pulsars, most in the Abyss region of
// Constelaciones; at night (real hour, 20:00–5:59) a few more cells light up.
export const SKY_SHARE=Object.freeze({base:.16,vacio:.3,faros:.3,constelaciones:.45,night:.14});
// Distances in world units: the figure's size, how near starts it, how far leaves it (rule 2: 720 u, as the living
// encounters), the touch, a pulse on time and how far the faint hint at the screen edge reaches.
export const SKY_SCALE=160,SKY_START=300,SKY_LEAVE=720,SKY_TOUCH=26,SKY_PULSE=150,SKY_HINT=1600;
// Seconds: the notice, the summary, the figure shining when complete.
export const SKY_NOTICE=3,SKY_SUMMARY=3,SKY_GLOW=3;
// Decision 9: a figure pays once, the first time it is joined; another copy of a figure already in your map pays
// nothing: the music and the light are its reward. How much, by the universe's rule (spark-rules.js, H1, alpha.233):
// base 4 × difficulty (its stars: up to 5 easy, 6–7 medium, 8 or more hard) × distance from the origin × rarity (a
// legend, La Mano, ×3; a figure only at night or from 20 km, rare, ×1.5), ×1.5 if a pulse on time lit a star. Until
// alpha.232, 10 or 15 for every figure; H1 first had 20 and 30. SKY_REWARD (below the catalogue) is only for the model.
export const skyDifficulty=f=>{const n=f?.stars?.length||0;return n>=8?DIFFICULTY.hard:n>=6?DIFFICULTY.medium:DIFFICULTY.easy;};
export const skyRarity=f=>f?.legend?RARITY.legend:f?.night||f?.km>=20?RARITY.rare:RARITY.common;
export const skyRewardFor=(f,{x=0,y=0,onTime=false}={})=>universeReward(UNIVERSE_BASE.sky,{difficulty:skyDifficulty(f),x,y,rarity:skyRarity(f),onTime});
// Notes, far under the music (docs/IDEAS_UNIVERSO.md, audio): a star is quieter than a living encounter's note; the
// motif sits at a living encounter's level.
export const SKY_STAR_GAIN=.012,SKY_MOTIF_GAIN=.02;
// Bounds of the save: unfinished figures kept where they were left, finished ones kept as a faint memory.
export const SKY_MAX_OPEN=64,SKY_MAX_DONE=200;
export const SKY_SERIES=Object.freeze([
 {id:'zodiaco',name:'Zodiaco'},
 {id:'norte',name:'Cielo del norte'},
 {id:'sur',name:'Cielo del sur'},
 {id:'propias',name:'Propias'}
].map(Object.freeze));
// Bands of distance from the origin (decision 5), in km: short figures near, the zodiac from 5 km, long and rare ones
// from 20 km, the legend from 50 km. side: only in that half of the map (north is up, negative y). belt: the zodiac
// lives along a band across the map (|y| up to 12 km). night: only at night (real hour).
// stars: [x,y] in the figure's frame (−1…1, y down), in the order they are joined; from: the star each line comes from
// (−1 starts a new line); extra: lines drawn once both ends are lit; motif: scale degrees (0 the tonic, 7 an octave up).
const F=(id,name,series,{km=0,side=null,belt=false,night=false,legend=false,secret=false}={},stars,from,extra,motif)=>Object.freeze({id,name,series,km,side,belt,night,legend,secret,stars:Object.freeze(stars.map(p=>Object.freeze(p))),from:Object.freeze(from),extra:Object.freeze((extra||[]).map(Object.freeze)),motif:Object.freeze(motif)});
export const SKY_FIGURES=Object.freeze([
 // Real, public-domain shapes, simplified so they read in a second.
 F('orion','Orión','sur',{km:5},[[-.45,-.8],[-.2,.02],[0,-.03],[.2,-.08],[.42,-.7],[.45,.8],[-.38,.82]],[-1,0,1,2,3,3,1],[[0,4]],[2,2,3,4,4,3,2]),
 F('osamayor','Osa Mayor','norte',{km:5,side:'norte'},[[-1,-.3],[-.62,-.38],[-.3,-.3],[0,-.15],[.1,.25],[.62,.3],[.66,-.15]],[-1,0,1,2,3,4,5],[[3,6]],[0,0,4,4,5,5,4]),
 F('osamenor','Osa Menor','norte',{side:'norte'},[[-1,-.4],[-.6,-.25],[-.25,-.2],[.05,0],[.2,.35],[.6,.35],[.55,0]],[-1,0,1,2,3,4,5],[[3,6]],[4,3,2,1,2,3,4]),
 F('casiopea','Casiopea','norte',{},[[-1,-.3],[-.5,.35],[0,-.1],[.5,.35],[1,-.35]],[-1,0,1,2,3],[],[0,1,2,0,4]),
 F('cisne','Cisne','norte',{km:5,night:true},[[0,-.9],[0,-.2],[0,.9],[-.75,-.35],[.75,-.1]],[-1,0,1,1,1],[],[4,2,0,3,5]),
 F('lira','Lira','norte',{},[[-.15,-.9],[.05,-.45],[-.3,-.3],[-.15,.35],[.25,.2]],[-1,0,0,2,1],[[3,4]],[7,4,2,4,0]),
 F('cruzdelsur','Cruz del Sur','sur',{side:'sur'},[[0,-.9],[0,.9],[-.62,-.05],[.55,-.2]],[-1,0,-1,2],[],[4,0,2,4,7]),
 F('canmayor','Can Mayor','sur',{km:20,night:true},[[.1,-.55],[-.15,-.85],[.5,-.7],[0,.05],[-.5,.6],[.35,.75]],[-1,0,0,0,3,3],[],[0,4,5,4,2,0]),
 // The zodiac, along the band.
 F('aries','Aries','zodiaco',{km:5,belt:true},[[-1,.2],[-.2,-.25],[.45,-.3],[.82,-.05]],[-1,0,1,2],[],[0,2,4,2,0]),
 F('tauro','Tauro','zodiaco',{km:5,belt:true},[[0,.45],[-.3,.05],[-.95,-.6],[.3,.05],[.9,-.55]],[-1,0,1,0,3],[],[0,2,4,2,5]),
 F('geminis','Géminis','zodiaco',{km:5,belt:true},[[-.4,-.9],[-.45,0],[-.5,.85],[.35,-.85],[.3,0],[.25,.85]],[-1,0,1,-1,3,4],[[0,3]],[0,2,4,0,2,4]),
 F('cancer','Cáncer','zodiaco',{km:5,belt:true},[[0,-.9],[0,0],[-.7,.7],[.7,.75]],[-1,0,1,1],[],[4,2,0,2,4]),
 F('leo','Leo','zodiaco',{km:5,belt:true},[[.75,-.8],[.5,-.95],[.25,-.6],[.4,-.2],[.6,.15],[-.55,0],[-.95,.35]],[-1,0,1,2,3,3,5],[[4,6]],[4,5,4,2,0,2,4]),
 F('virgo','Virgo','zodiaco',{km:5,belt:true},[[-.9,-.4],[-.4,-.2],[0,0],[.2,.8],[.5,-.35],[.95,-.6]],[-1,0,1,2,2,4],[],[2,3,4,1,5,4]),
 F('libra','Libra','zodiaco',{km:5,belt:true},[[0,-.8],[-.6,-.2],[.6,-.25],[-.5,.6],[.55,.55]],[-1,0,0,1,2],[[1,2]],[4,2,6,0,4]),
 F('escorpio','Escorpio','zodiaco',{km:5,belt:true},[[-.9,-.75],[-.55,-.45],[-.35,-.1],[-.1,.35],[.3,.7],[.75,.65],[.9,.3]],[-1,0,1,2,3,4,5],[],[7,6,4,3,2,1,0]),
 F('sagitario','Sagitario','zodiaco',{km:5,belt:true},[[-.8,.5],[-.8,-.05],[-.3,-.35],[.2,-.1],[.55,.35],[.15,.55]],[-1,0,1,2,3,4],[[5,0],[1,3]],[0,2,4,5,4,2]),
 F('capricornio','Capricornio','zodiaco',{km:5,belt:true},[[-.9,-.5],[0,.75],[.9,-.2],[.35,-.35],[-.3,-.45]],[-1,0,1,2,3],[[4,0]],[4,0,7,5,4]),
 F('acuario','Acuario','zodiaco',{km:5,belt:true},[[-.9,-.6],[-.35,-.35],[0,.1],[-.4,.55],[.3,.6],[.85,.3]],[-1,0,1,2,2,4],[],[0,1,2,1,3,4]),
 F('piscis','Piscis','zodiaco',{km:5,belt:true},[[-.95,-.7],[-.55,-.1],[-.1,.7],[.5,.45],[.95,.4]],[-1,0,1,2,3],[],[4,2,0,2,4]),
 // Our own: things of the universe of Kubono, and a secret wink (decision 8: «La Mano», never naming anyone).
 F('gato','Gato','propias',{},[[-.65,.5],[-.7,-.6],[0,-.2],[.7,-.6],[.65,.5]],[-1,0,1,2,3],[[4,0]],[4,7,4,2,0]),
 F('cubo','Cubo','propias',{},[[-.6,-.6],[.6,-.6],[.6,.6],[-.6,.6]],[-1,0,1,2],[[3,0]],[0,2,4,7,4]),
 F('vinilo','Vinilo','propias',{km:20},[[0,-.9],[.78,-.45],[.78,.45],[0,.9],[-.78,.45],[-.78,-.45],[0,0]],[-1,0,1,2,3,4,-1],[[5,0]],[0,2,4,5,4,2,0]),
 F('auricular','Auricular','propias',{km:20},[[-.7,.6],[-.75,-.1],[-.4,-.7],[.4,-.7],[.75,-.1],[.7,.6]],[-1,0,1,2,3,4],[],[0,4,7,7,4,0]),
 F('ballena','Ballena','propias',{km:20},[[-.95,.05],[-.4,.45],[.35,.4],[.7,.05],[.98,-.35],[.98,.3],[-.1,-.2],[-.6,-.75]],[-1,0,1,2,3,3,0,0],[[6,3]],[0,2,4,2,0,-1,0,4]),
 F('cohete','Cohete','propias',{km:20},[[0,-.95],[-.3,-.35],[-.3,.45],[.3,.45],[.3,-.35],[-.6,.85],[.6,.85]],[-1,0,1,2,3,2,3],[[4,0]],[7,5,4,2,0,2,0]),
 F('guitarra','Guitarra','propias',{km:20},[[.9,-.9],[.45,-.45],[.05,-.05],[-.45,0],[-.85,.45],[-.45,.9],[0,.5]],[-1,0,1,2,3,4,5],[[6,2]],[0,4,2,4,0,4,7]),
 F('mano','La Mano','propias',{km:50,legend:true,secret:true},[[0,.95],[0,.15],[-.85,.05],[-.45,-.8],[-.05,-.95],[.35,-.8],[.7,-.5]],[-1,0,1,1,1,1,1],[],[0,2,4,7,4,2,0])
]);
const BY_ID=new Map(SKY_FIGURES.map(f=>[f.id,f]));
// For the economy model only (scripts/play-curve.mjs): the average first reward of the short figures near the origin.
const NEAR=SKY_FIGURES.filter(f=>!f.km&&!f.night);
export const SKY_REWARD=Object.freeze({base:NEAR.reduce((n,f)=>n+skyRewardFor(f),0)/NEAR.length,onTime:NEAR.reduce((n,f)=>n+skyRewardFor(f,{onTime:true}),0)/NEAR.length});
export const skyFigure=id=>BY_ID.get(id)||null;
export const skySeries=id=>SKY_FIGURES.filter(f=>f.series===id);
// The lines of a figure: one from each star to the one it comes from, then the extras.
export function skyLines(f){const out=[];f.from.forEach((a,i)=>{if(a>=0)out.push([a,i]);});return out.concat(f.extra);}
// Night by the real hour, as the light of the World (world-light.js).
export const skyNight=(hour=new Date().getHours())=>hour>=20||hour<6;
// Where a figure may appear: its band of distance, its half of the map, the zodiac's band, night.
export function skyEligible(f,{km=0,y=0,night=false}={}){
 if(km<f.km||f.night&&!night)return false;
 if(f.side==='norte'&&!(y<-SKY_CELL))return false;if(f.side==='sur'&&!(y>SKY_CELL))return false;
 if(f.belt&&Math.abs(y)>120000)return false;return true;
}
// Rarer from 20 km, legends from 50 km: far away, the figures of the far bands weigh more.
export function skyWeight(f,km=0){if(f.legend)return km>=50?4:0;if(f.km>=20)return 3;if(f.km>=5)return km>=20?2:1.5;return km>=20?.6:1;}
export function skyPick(list,km,roll){const weights=list.map(f=>skyWeight(f,km)),sum=weights.reduce((a,b)=>a+b,0);if(!(sum>0))return null;let k=Math.max(0,Math.min(.999999,roll))*sum;for(let i=0;i<list.length;i++){k-=weights[i];if(k<0&&weights[i]>0)return list[i];}return list.findLast((f,i)=>weights[i]>0)||null;}
// The share of a cell by what is under its centre (biome id and the Abyss region, if any).
export function skyShare(biome,region){if(region==='constelaciones')return SKY_SHARE.constelaciones;return SKY_SHARE[biome]??SKY_SHARE.base;}
// The figure of a cell, or null. world: a short key of the world; under(x,y): {biome,region} at that point. A day site
// is there day and night; a night site only at night. Its figure depends only on where it is and its kind, never on the
// hour, so a figure never changes under you.
export function skyCell(world,i,j,under,{night=false}={}){
 const key=world+':'+i+','+j,roll=hashKey('sky:v1:'+key),x=(i+SKY_MARGIN+(1-2*SKY_MARGIN)*hashKey('sky:x:v1:'+key))*SKY_CELL,y=(j+SKY_MARGIN+(1-2*SKY_MARGIN)*hashKey('sky:y:v1:'+key))*SKY_CELL;
 const here=under?.(x,y)||{},share=skyShare(here.biome,here.region),kind=roll<share?'day':roll<share+SKY_SHARE.night?'night':null;if(!kind)return null;
 if(kind==='night'&&!night)return null;
 const km=Math.hypot(x,y)/10000,list=SKY_FIGURES.filter(f=>skyEligible(f,{km,y,night:kind==='night'})),fig=skyPick(list,km,hashKey('sky:fig:v1:'+key));if(!fig)return null;
 // A little turn, so two copies of a figure do not look stamped.
 const turn=(hashKey('sky:turn:v1:'+key)-.5)*.5;
 return {id:'sky:'+key,fig:fig.id,x,y,turn,kind};
}
// A star in the world: the figure's frame turned and scaled round its centre.
export function skyStar(site,k){const f=skyFigure(site.fig);if(!f)return null;const [a,b]=f.stars[k],c=Math.cos(site.turn||0),s=Math.sin(site.turn||0);return {x:site.x+(a*c-b*s)*SKY_SCALE,y:site.y+(a*s+b*c)*SKY_SCALE};}
export const skyStars=site=>{const f=skyFigure(site.fig);return f?f.stars.map((_,k)=>skyStar(site,k)):[];};
// A note of the figure: the star's own degree of the scale, or the motif's. tonic: the MIDI note of the scale's 0.
export function skyNote(scale,tonic,degree){const sc=Array.isArray(scale)&&scale.length===7?scale:[0,2,4,5,7,9,11],d=Math.floor(degree),o=Math.floor(d/7),i=((d%7)+7)%7;return tonic+sc[i]+12*o;}
export const skyStarDegree=(f,k)=>f.motif[k%f.motif.length];
const plain=v=>v&&typeof v==='object'&&!Array.isArray(v);
const count=v=>Number.isSafeInteger(v)&&v>0?Math.min(v,1e9):0;
const safeKey=k=>typeof k==='string'&&k.length>0&&k.length<120&&!['__proto__','constructor','prototype'].includes(k);
const day=v=>typeof v==='string'?v.slice(0,24):'';
const finite=v=>Number.isFinite(v)&&Math.abs(v)<1e12;
// Saves keep what they do not know: a figure of a later catalog stays, a later version is left untouched. Per figure:
// first (the day it was first joined), done (times joined) and onTime (times with a pulse on time). Per site: the figure,
// where it is, how many stars are lit in order, done, a pulse on time and when. wear.halo: the star halo is on.
export function normalizeSkyMap(raw){
 if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>SKY_VERSION)return raw;
 const q=plain(raw)?raw:{},figures={},sites={};
 for(const [id,e] of Object.entries(plain(q.figures)?q.figures:{}).slice(0,512)){if(!safeKey(id)||!plain(e))continue;figures[id]={...e,first:day(e.first),done:count(e.done),onTime:Math.min(count(e.onTime),count(e.done))};}
 const open=[],done=[];
 for(const [id,e] of Object.entries(plain(q.sites)?q.sites:{})){if(!safeKey(id)||!plain(e)||!safeKey(e.fig)||!finite(e.x)||!finite(e.y))continue;const f=skyFigure(e.fig),n=f?f.stars.length:64,lit=Math.min(count(e.lit),n),site={...e,fig:e.fig,x:e.x,y:e.y,turn:Number.isFinite(e.turn)?Math.max(-1,Math.min(1,e.turn)):0,lit,done:e.done===true||(!!f&&lit>=n),onTime:e.onTime===true,at:day(e.at)};if(site.done&&f)site.lit=n;if(!site.lit&&!site.done)continue;(site.done?done:open).push([id,site]);}
 for(const [id,s] of [...open.slice(-SKY_MAX_OPEN),...done.slice(-SKY_MAX_DONE)])sites[id]=s;
 const wear=plain(q.wear)?{...q.wear}:{},halo=plain(q.halo)&&typeof q.halo.at==='string'?{...q.halo,at:day(q.halo.at)}:null;
 if(!halo)delete wear.halo;else wear.halo=wear.halo!==false;
 return {...q,version:SKY_VERSION,figures,sites,earned:count(q.earned),halo,wear};
}
// A series: how many of its figures are in your map.
export function skySeriesProgress(q,id){const list=skySeries(id);return {done:list.filter(f=>count(q?.figures?.[f.id]?.done)>0).length,total:list.length};}
export const skyZodiacComplete=q=>{const p=skySeriesProgress(q,'zodiaco');return p.total>0&&p.done===p.total;};
// One step: which stars a touch or a pulse on time lights. The next star lights when the cube is within TOUCH of it; a
// pulse on time within PULSE of it lights it, and the one after if that one is also within PULSE of the pulse (it counts
// double). Returns how many were lit.
export function skyStep(site,player,pulses=[]){
 const f=skyFigure(site.fig);if(!f||site.done)return {lit:0,onTime:false};const n=f.stars.length;let lit=0,onTime=false;
 const near=(k,p,r)=>{const s=skyStar(site,k);return Math.hypot(s.x-p.x,s.y-p.y)<=r;};
 if(site.lit<n&&near(site.lit,player,SKY_TOUCH)){site.lit++;lit++;}
 for(const w of pulses){if(!w.beat||site.lit>=n)continue;if(!near(site.lit,w,SKY_PULSE))continue;onTime=true;site.lit++;lit++;if(site.lit<n&&near(site.lit,w,SKY_PULSE)){site.lit++;lit++;}}
 if(site.lit>=n)site.done=true;if(onTime)site.onTime=true;return {lit,onTime};
}
export const skyReward=(site,first)=>first?skyRewardFor(skyFigure(site?.fig),{x:site?.x,y:site?.y,onTime:!!site?.onTime}):0;
// The direction of a point seen from the cube, in words for the Bitácora («al norte»).
export function skyDirection(from,to){const dx=to.x-from.x,dy=to.y-from.y;if(Math.hypot(dx,dy)<SKY_LEAVE)return 'aquí';const a=Math.atan2(dy,dx),k=Math.round(a/(Math.PI/4));return ['al este','al sureste','al sur','al suroeste','al oeste','al noroeste','al norte','al noreste','al este'][(k+8)%8];}
// Shortcut for tests (docs/MUNDO.md#herramientas-de-prueba): «?cielo=orion» brings that figure near after 3 s.
export function skyForced(search=globalThis.location?.search){try{const id=new URLSearchParams(search||'').get('cielo');return BY_ID.has(id)?id:null;}catch(_){return null;}}
