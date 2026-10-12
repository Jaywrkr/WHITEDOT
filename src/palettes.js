export const WORLD_GENRES={
 tropical:{scales:[[0,2,4,5,7,9,11],[0,2,4,5,7,9,10]],name:'Tropical house',bpm:[108,116],sw:.12,pt:1,bassI:'rubber',bassP:['rubber','sub'],hookP:['steel','kalimba'],percP:['conga','guiro','timbale','shaker'],pad:.12},
 melodic:{scales:[[0,2,3,5,7,8,10],[0,2,3,5,7,9,10]],name:'Melodic house',bpm:[118,124],sw:.04,pt:0,bassI:'rubber',bassP:['rubber','sub'],hookP:['rhodes','strings'],percP:['kick','rim','shaker'],pad:.3},
 robotic:{scales:[[0,1,3,5,7,8,10],[0,2,3,5,7,8,10]],name:'Electro robótico',bpm:[124,132],sw:.02,pt:5,bassI:'machine',bassP:['machine','fm'],hookP:['vocalform','metalkeys'],percP:['kick','rim','timbale','hat'],pad:0},
 nudisco:{scales:[[0,2,4,5,7,9,10],[0,2,3,5,7,9,10]],name:'Nu-disco',bpm:[112,122],sw:.16,pt:0,bassI:'rubber',bassP:['rubber','pluck'],hookP:['clav','brass','rhodes'],percP:['kick','clap','guiro','shaker'],pad:.15}
};
const POOLS={llanura:['nudisco','melodic'],bosque:['tropical','nudisco'],lago:['tropical','melodic'],ruinas:['robotic','nudisco'],jardin:['tropical','nudisco','melodic'],dunas:['tropical','robotic'],cristales:['robotic','melodic'],faros:['nudisco','melodic'],tormenta:['robotic'],cueva:['robotic','melodic'],vacio:[]};
export function applyPalette(region,biome,origin,seedOf,rng) {
 const r=rng(seedOf(`world-palette:v1:${region.key}`)),pool=POOLS[biome];
 if(origin||!pool.length||r()>=.4)return region;
 region.genre=pool[Math.floor(r()*pool.length)];const g=WORLD_GENRES[region.genre];
 region.scale=g.scales[Math.floor(r()*g.scales.length)].slice();
 region.bpm=Math.round(g.bpm[0]+r()*(g.bpm[1]-g.bpm[0]));region.track.bassI=g.bassI;region.track.hookI=g.hookP[Math.floor(r()*g.hookP.length)];
 return region;
}
export const PALETTE_STEPS={tropical:[0,3,6,10,14],melodic:[0,4,6,10,12],robotic:[0,3,7,10],nudisco:[0,3,6,10,14]};
