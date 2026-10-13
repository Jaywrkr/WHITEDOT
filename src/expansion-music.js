// Expansión (puro, probado en Node): zonas de música experimental, etapas de quietud y cajas misteriosas.
// Todo usa flujos de semilla propios: no cambia recetas, catálogo ni lugares guardados.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

// ---------- música experimental ----------
// Algunos lugares se salen del pulso: texturas libres, métricas impares, glitches o microtonos.
// Depende de varios parámetros: semilla propia, bioma, aire, anomalía, hora local y cuánto llevas quieto.
const BIOME_WEIRD={cristales:.32,cueva:.3,tormenta:.26,vacio:.36,ruinas:.18,faros:.12,lago:.08,dunas:.1,bosque:.04,jardin:.02,llanura:0};
const AIR_WEIRD={niebla:.14,esporas:.18,ceniza:.2,polvo:.06};
export const EXPERIMENTAL_MODES=['libre','irregular','glitch','micro'];
export const EXPERIMENTAL_NAMES={libre:'Sin pulso',irregular:'Métrica impar',glitch:'Fallas',micro:'Microtonos'};
export function experimentalZone(region,biome,seedOf,rng){
 if(!region?.key||region.sea)return {level:0,mode:null};
 const r=rng(seedOf(`experimental:v1:${region.key}`)),roll=r(),mode=EXPERIMENTAL_MODES[Math.floor(r()*4)];
 const raw=roll*.75+(BIOME_WEIRD[biome]||0)+(AIR_WEIRD[region.air]||0)+(region.anomaly?.25:0);
 return {level:+clamp((raw-.7)*2.6,0,1).toFixed(3),mode};
}
// Nivel que suena ahora: la zona + la noche + la quietud (quedarse empuja lo experimental).
export function experimentalLevel(zone,{hour=12,quietStage=0}={}){
 const night=hour<5||hour>=23?.12:0;if(!zone||(!zone.level&&quietStage<4))return 0;
 return clamp(zone.level+night+Math.max(0,quietStage-2)*.08,0,1);
}
// Patrones euclidianos para métricas impares (5, 7, 11, 13 pasos que no cuadran con el compás).
export function euclid(k,n,rot=0){const p=[];for(let i=0;i<n;i++)p.push(((i+rot)*k)%n<k?1:0);return p;}
export const ODD_CYCLES=[[3,5],[4,7],[5,11],[5,13]];
// Desafinación microtonal en cents, estable por lugar y nota.
export const microCents=(seed,i,level)=>Math.round((((seed*9301+i*49297)%233280)/233280-.5)*2*(18+level*42));

// ---------- quietud: el lugar cambia si te quedas ----------
// Etapas por segundos quieto (en el mismo sitio). Cada una se nota en el sonido y en la imagen.
export const QUIET_STAGES=[
 {at:0,id:'llegada'},
 {at:20,id:'color',name:'El lugar te nota',text:'El color sube.'},
 {at:50,id:'voz',name:'Voz del lugar',text:'Entra una voz nueva.'},
 {at:90,id:'visita',name:'Visitas',text:'Algo viene a verte.'},
 {at:140,id:'giro',name:'Giro',text:'La música cambia de rumbo.'},
 {at:200,id:'regalo',name:'Regalo',text:'Te dejaron algo.'},
 {at:300,id:'ritual',name:'Ritual',text:'Cinco minutos. El lugar ya es tuyo.'}
];
export function quietStage(seconds){let k=0;for(let i=0;i<QUIET_STAGES.length;i++)if(seconds>=QUIET_STAGES[i].at)k=i;return k;}
// Lugares escuchados: al volver, empiezan más adelante (la mitad de lo que alcanzaste).
export const quietStart=(saved)=>QUIET_STAGES[Math.max(0,Math.floor((saved||0)/2))]?.at||0;

// ---------- cajas misteriosas y poderes ----------
export const POWERS={
 campo:{name:'Campo de escucha',seconds:150,text:'Un campo te sigue: solo suena lo que está dentro. Pasa por las cosas y el campo las toca a tempo.'},
 cometa:{name:'Cometa',seconds:90,text:'Vas mucho más rápido y dejas una estela que suena.'},
 brujula:{name:'Brújula',seconds:180,text:'Flechas hacia lo raro: materia, aves lira, santuarios, puertas y otras cajas.'},
 iman:{name:'Imán',seconds:120,text:'Lo pequeño te sigue y suena a tu alrededor como una banda.'},
 pincel:{name:'Pincel sonoro',seconds:120,text:'Tu camino deja notas que se repiten mientras sigan encendidas.'},
 companero:{name:'Compañero',seconds:240,text:'Una luz te acompaña, contesta lo que tocas y a veces te lleva a algo raro.'}
};
export const POWER_IDS=Object.keys(POWERS);
export const BOX_RARITY=.16;   // fracción de chunks de tierra con una caja (más en mundos vastos por tamaño)
export function boxAt(cx,cy,size,seedOf,rng){
 const r=rng(seedOf(`caja:v1:${cx},${cy}`));if(r()>=BOX_RARITY/4)return null;   // ~4 % de chunks
 const power=POWER_IDS[Math.floor(r()*POWER_IDS.length)];
 return {id:`caja:${cx},${cy}`,x:(cx+.15+r()*.7)*size,y:(cy+.15+r()*.7)*size,power,hue:Math.floor(r()*360),spin:r()*6.283};
}
// Poderes activos: {id: hasta (ms)}. Solo duran la sesión de juego; no se guardan.
export function activePowers(powers,now){return Object.entries(powers||{}).filter(([,until])=>until>now).map(([id,until])=>({id,left:(until-now)/1000}));}
export const powerSpeed=(powers,now)=>activePowers(powers,now).some(p=>p.id==='cometa')?2.2:1;
// Campo: radio que crece al abrirse y se encoge al final.
export function fieldRadius(left,total){const open=clamp((total-left)/1.2,0,1),close=clamp(left/4,0,1);return 150*Math.min(open,close)+20*open;}
