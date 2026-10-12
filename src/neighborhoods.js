const smooth=x=>x*x*(3-2*x);
export function musicalField(rx,ry,seedOf,rng) {
 const x=rx/4,y=ry/4,gx=Math.floor(x),gy=Math.floor(y),tx=smooth(x-gx),ty=smooth(y-gy);
 const anchor=(a,b)=>{if(a===0&&b===0)return [124,0,.3];const r=rng(seedOf(`musical-field:v1:${a},${b}`));return [68+r()*106,-3+r()*6,r()];};
 const corners=[anchor(gx,gy),anchor(gx+1,gy),anchor(gx,gy+1),anchor(gx+1,gy+1)];
 const values=[0,1,2].map(i=>(corners[0][i]*(1-tx)+corners[1][i]*tx)*(1-ty)+(corners[2][i]*(1-tx)+corners[3][i]*tx)*ty);
 return {tempo:values[0],fifths:Math.round(values[1]),warm:values[2]>.5};
}
const WEIGHT_CACHE=new Map();
// Ajuste iterativo sobre los tempos del campo musical en 61×61 regiones: busca pesos tales que
// cada género ocupe una parte similar del mundo, respetando la compatibilidad de tempo local.
export function genreWeights(genres,seedOf,rng){
 const ids=Object.keys(genres),cacheKey=ids.join('|');if(WEIGHT_CACHE.has(cacheKey))return WEIGHT_CACHE.get(cacheKey);
 const samples=[];
 for(let rx=-30;rx<=30;rx++)for(let ry=-30;ry<=30;ry++){if(!rx&&!ry)continue;const tempo=musicalField(rx,ry,seedOf,rng).tempo;
  const cost=ids.map(id=>Math.max(genres[id].bpm[0]-tempo,tempo-genres[id].bpm[1],0)),best=Math.min(...cost);
  samples.push(ids.map((_,i)=>i).filter(i=>cost[i]<=best+5));}
 const w=ids.map(()=>1),target=samples.length/ids.length;
 for(let it=0;it<300;it++){const share=ids.map(()=>0);
  for(const cand of samples){let t=0;for(const i of cand)t+=w[i];for(const i of cand)share[i]+=w[i]/t;}
  ids.forEach((_,i)=>{if(share[i]>0)w[i]=Math.min(1e3,Math.max(1e-3,w[i]*Math.sqrt(target/share[i])));});}
 const out=Object.fromEntries(ids.map((id,i)=>[id,w[i]]));WEIGHT_CACHE.set(cacheKey,out);return out;
}
export function applyNeighborhood(region,biomes,genres,seedOf,rng) {
 const [rx,ry]=region.key.split(',').map(Number),field=musicalField(rx,ry,seedOf,rng);
 if(rx===0&&ry===0)return region;
 const r=rng(seedOf(`musical-neighbor-choice:v1:${region.key}`));
 if(biomes[region.z].id!=='vacio'){
  const scored=Object.entries(genres).map(([id,g])=>({id,g,cost:Math.max(g.bpm[0]-field.tempo,field.tempo-g.bpm[1],0)}));
  const best=Math.min(...scored.map(s=>s.cost)),candidates=scored.filter(s=>s.cost<=best+5);
  // Elección ponderada: cada género recibe un peso para que el reparto global sea parejo
  // (sin pesos, los estilos con rangos de tempo amplios ocupaban gran parte del mundo).
  const weights=genreWeights(genres,seedOf,rng),total=candidates.reduce((sum,c)=>sum+weights[c.id],0);
  let pick=r()*total;region.genre=candidates[candidates.length-1].id;
  for(const c of candidates){pick-=weights[c.id];if(pick<=0){region.genre=c.id;break;}}
 }
 const g=genres[region.genre];region.bpm=Math.round(Math.max(g.bpm[0],Math.min(g.bpm[1],field.tempo)));
 const pitch=((field.fifths*7)%12+12)%12;region.trOff=(pitch>5?pitch-12:pitch)-biomes[region.z].tr;
 const modes=field.warm?[[0,2,4,5,7,9,10],[0,2,4,5,7,9,11]]:[[0,2,3,5,7,9,10],[0,2,3,5,7,8,10]];
 const scales=g.scales||modes;region.scale=scales[Math.floor(r()*scales.length)].slice();
 region.track.bassI=g.bassI;region.track.hookI=g.hookP[Math.floor(r()*g.hookP.length)];
 return region;
}
