import {EXPANDED_LIVING,EXTRA_RHYTHMS} from './expanded-content.js';
export const ECOREGION_NAMES={llanura:['Deriva de hilos','Deriva de membranas'],bosque:['Racimo de arcos','Racimo de escobillas'],lago:['Orilla de gravedad','Ondas de seda'],dunas:['Anillo de cañas','Anillo de piel'],cristales:['Malla de bronce','Prisma velado'],jardin:['Semillero de brotes','Semillero de respiros'],ruinas:['Órbita de claves','Umbrales de metal'],cueva:['Cámara de esporas','Pozo de cuerpos graves'],tormenta:['Lluvia de plasma','Campo de velas solares'],faros:['Constelación de campanas','Púlsares de viento'],vacio:['Nidos de penumbra','Cintas del vacío']};
export function ecoregionAt(region,biome,seedOf){const [x,y]=region.key.split(',').map(Number),zone=Math.floor(x/3)+','+Math.floor(y/3),seed=seedOf('ecoregion:v1:'+zone+':'+biome),variant=seed%2;return {id:biome+':'+variant,zone,name:(ECOREGION_NAMES[biome]||ECOREGION_NAMES.llanura)[variant],variant,hue:(region.hue+(variant?22:-18)+360)%360,density:variant?.22:.1};}
export function expandedChunk(cx,cy,size,region,biome,base,seedOf,rng){
 if(region.sea||base.length>=3)return [];const eco=ecoregionAt(region,biome,seedOf),r=rng(seedOf('living:expansion:v1:'+cx+','+cy));if(r()>eco.density)return [];
 const pool=EXPANDED_LIVING.filter(d=>d.affinity.includes(biome)),group=['flora','fauna','architecture'][seedOf('ecoregion:guild:v1:'+eco.zone+':'+biome)%3],preferred=pool.filter(d=>d.group===group),candidates=preferred.length?preferred:pool;if(!candidates.length)return [];
 const def=candidates[seedOf('ecoregion:lineage:v1:'+eco.zone+':'+biome)%candidates.length],variant=Math.floor(r()*256);if(def.group==='architecture'&&variant%8)return [];
 const x=(cx+.2+r()*.6)*size,y=(cy+.2+r()*.6)*size;
 return [{id:'living:expansion:v1:'+cx+','+cy,kind:def.id,group:def.group,shape:def.shape,variant,x,y,homeX:x,homeY:y,hue:eco.hue,size:def.group==='architecture'?22:10+variant%9,phase:r()*6.283,personality:['timida','curiosa','social'][variant%3],activeAt:variant%4,rare:variant===(def.group==='architecture'?248:255),studyVariant:variant%12,lit:0,energy:0,phrase:[],touching:false,ecotype:eco.id}];
}
export function expandedRhythm(cx,cy,size,region,biome,base,seedOf,rng){
 if(region.sea||base.length)return [];const r=rng(seedOf('rhythm:expansion:v1:'+cx+','+cy));if(r()>.28)return [];const eco=ecoregionAt(region,biome,seedOf),pool=Object.entries(EXTRA_RHYTHMS).filter(([,d])=>d.affinity.includes(biome));if(!pool.length)return [];
 const [kind]=pool[seedOf('ecoregion:rhythm:v1:'+eco.zone+':'+biome)%pool.length];return [{id:'rhythm:expansion:v1:'+cx+','+cy,kind,x:(cx+.2+r()*.6)*size,y:(cy+.2+r()*.6)*size,variant:Math.floor(r()*8),phase:r()*6.283,touching:false,lit:0,cooldown:0,turn:0}];
}
