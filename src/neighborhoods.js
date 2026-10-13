const smooth=x=>x*x*(3-2*x);
export function musicalField(rx,ry,seedOf,rng) {
 const x=rx/4,y=ry/4,gx=Math.floor(x),gy=Math.floor(y),tx=smooth(x-gx),ty=smooth(y-gy);
 const anchor=(a,b)=>{if(a===0&&b===0)return [124,0,.3];const r=rng(seedOf(`musical-field:v1:${a},${b}`));return [68+r()*106,-3+r()*6,r()];};
 const corners=[anchor(gx,gy),anchor(gx+1,gy),anchor(gx,gy+1),anchor(gx+1,gy+1)];
 const values=[0,1,2].map(i=>(corners[0][i]*(1-tx)+corners[1][i]*tx)*(1-ty)+(corners[2][i]*(1-tx)+corners[3][i]*tx)*ty);
 return {tempo:values[0],fifths:Math.round(values[1]),warm:values[2]>.5};
}
import {familyOf} from './rhythms.js';
const AFFINITY=6;          // cuánto prefiere un continente los géneros de su familia
// Contexto musical de una región: campo de tempo suave + identidad del continente.
export function musicalContext(rx,ry,seedOf,rng,contAt){
 const field=musicalField(rx,ry,seedOf,rng),c=contAt?.(rx,ry);
 if(!c||!c.continent)return {...field,family:null,sea:!!c?.sea};
 const k=c.continent;return {tempo:Math.max(66,Math.min(178,k.tempo+(field.tempo-121)*.5)),fifths:k.fifths,warm:field.warm,family:k.family,sea:c.sea};
}
const candidatesFor=(ids,genres,tempo)=>{const cost=ids.map(id=>Math.max(genres[id].bpm[0]-tempo,tempo-genres[id].bpm[1],0)),best=Math.min(...cost);return ids.map((_,i)=>i).filter(i=>cost[i]<=best+5);};
const WEIGHT_CACHE=new Map();
// Ajuste iterativo sobre 61×61 regiones: busca pesos tales que cada género ocupe una parte
// similar del mundo, respetando el tempo local y la preferencia de familia de cada continente.
export function genreWeights(genres,seedOf,rng,contAt){
 const ids=Object.keys(genres),cacheKey=ids.join('|')+(contAt?'|c':'');if(WEIGHT_CACHE.has(cacheKey))return WEIGHT_CACHE.get(cacheKey);
 const fam=ids.map(id=>familyOf(id)),samples=[];
 for(let rx=-30;rx<=30;rx++)for(let ry=-30;ry<=30;ry++){if(!rx&&!ry)continue;const m=musicalContext(rx,ry,seedOf,rng,contAt);if(m.sea)continue;
  const cand=candidatesFor(ids,genres,m.tempo);samples.push(cand.map(i=>[i,m.family&&fam[i]===m.family?AFFINITY:1]));}
 const w=ids.map(()=>1),target=samples.length/ids.length;
 for(let it=0;it<60;it++){const share=ids.map(()=>0);
  for(const cand of samples){let t=0;for(const [i,a]of cand)t+=w[i]*a;for(const [i,a]of cand)share[i]+=w[i]*a/t;}
  ids.forEach((_,i)=>{if(share[i]>0)w[i]=Math.min(1e3,Math.max(1e-3,w[i]*Math.sqrt(target/share[i])));});}
 const out=Object.fromEntries(ids.map((id,i)=>[id,w[i]]));WEIGHT_CACHE.set(cacheKey,out);return out;
}
export function applyNeighborhood(region,biomes,genres,seedOf,rng,contAt) {
 const [rx,ry]=region.key.split(',').map(Number),field=musicalContext(rx,ry,seedOf,rng,contAt);
 if(rx===0&&ry===0)return region;
 const r=rng(seedOf(`musical-neighbor-choice:v1:${region.key}`));
 if(biomes[region.z].id!=='vacio'){
  const ids=Object.keys(genres),candidates=candidatesFor(ids,genres,field.tempo).map(i=>ids[i]);
  // Elección ponderada: reparto global parejo, con preferencia por la familia del continente.
  const weights=genreWeights(genres,seedOf,rng,contAt),wt=id=>weights[id]*(field.family&&familyOf(id)===field.family?AFFINITY:1);
  const total=candidates.reduce((sum,id)=>sum+wt(id),0);
  let pick=r()*total;region.genre=candidates[candidates.length-1];
  for(const id of candidates){pick-=wt(id);if(pick<=0){region.genre=id;break;}}
 }
 const g=genres[region.genre];region.bpm=Math.round(Math.max(g.bpm[0],Math.min(g.bpm[1],field.tempo)));
 // Todo el continente comparte tonalidad: cruzar a otro se oye como un cambio de tono.
 const pitch=((field.fifths*7)%12+12)%12;region.trOff=(pitch>5?pitch-12:pitch)-biomes[region.z].tr;
 const modes=field.warm?[[0,2,4,5,7,9,10],[0,2,4,5,7,9,11]]:[[0,2,3,5,7,9,10],[0,2,3,5,7,8,10]];
 const scales=g.scales||modes;region.scale=scales[Math.floor(r()*scales.length)].slice();
 region.track.bassI=g.bassI;region.track.hookI=g.hookP[Math.floor(r()*g.hookP.length)];
 return region;
}
