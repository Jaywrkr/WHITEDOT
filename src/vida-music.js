// Fase 5 · Vida e intercambio musical (puro, probado en Node).
// - Bandadas: grupos que se mueven juntos, cantan una llamada y se contestan entre ellas. Si tocas un ave,
//   la bandada aprende tu llamada y te la devuelve. Quieto cerca, ganan confianza y se acercan; si entras
//   corriendo, se dispersan. Luciérnagas: parpadean desordenadas y se sincronizan si te quedas.
// - Flora: matas que crecen mientras estás cerca (más en primavera) y decrecen con el tiempo si no vuelves.
//   Cada etapa suma una nota a su arpegio.
// Presencia con flujos de semilla propios: no toca catálogo ni recetas.
import {voiceRegister} from './musical-character.js';
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export const SPECIES={
 golondrina:{name:'Golondrinas de eco',count:[4,7],channel:'melody',pool:['flute','pluck','kalimba'],low:62,high:79,speed:1.3,hue:30},
 grulla:{name:'Grullas graves',count:[3,4],channel:'bass',pool:['reed','hollow','bowed'],low:38,high:55,speed:.55,hue:200},
 luciernaga:{name:'Luciérnagas de pulso',count:[6,9],channel:'groove',pool:['glass','bell','steel'],low:67,high:84,speed:.35,hue:60},
 lira:{name:'Ave lira',count:[1,1],channel:'melody',pool:['flute','vocalform'],low:60,high:81,speed:.9,hue:45,rare:true}
};
export const SPECIES_IDS=Object.keys(SPECIES);
const POOLS={llanura:['golondrina','grulla'],bosque:['golondrina','luciernaga'],lago:['grulla','luciernaga'],ruinas:['golondrina','grulla'],jardin:['luciernaga','golondrina'],dunas:['grulla','golondrina'],cristales:['luciernaga','golondrina'],faros:['golondrina','grulla'],tormenta:['grulla'],cueva:['luciernaga']};
export const FLOCK_RARITY=.3,LIRA_SHARE=.05,PLANT_RARITY=.28;
export const HOME_FLOCK=[2800,1650],HOME_PLANTS=[[620,1700],[760,1800],[540,1860]];
const keyOk=key=>/^-?\d+,-?\d+$/.test(key);

// ---------- bandadas ----------
export function createFlock(region,regionSize,biome,seedOf,rng){
 if(region.sea||!keyOk(region.key)||biome==='vacio')return null;
 const home=region.key==='0,0';if(!home&&rng(seedOf(`vida:flock:presence:v1:${region.key}`))()>=FLOCK_RARITY)return null;
 const r=rng(seedOf(`vida:flock:v1:${region.key}`)),pool=POOLS[biome]||['golondrina'];
 const [zx,zy]=region.key.split(',').map(v=>Math.floor(Number(v)/3)),dominant=seedOf(`population:flock:v1:${zx},${zy}:${biome}`)%pool.length;
 // Keep the legacy presence/rare roll and coordinate draws; only common species are biased by territory.
 const species=home?'golondrina':r()<LIRA_SHARE?'lira':pool[(dominant+(r()<.8?0:1))%pool.length],spec=SPECIES[species];
 const [rx,ry]=region.key.split(',').map(Number),x=home?HOME_FLOCK[0]:(rx+.2+r()*.6)*regionSize,y=home?HOME_FLOCK[1]:(ry+.2+r()*.6)*regionSize;
 const n=spec.count[0]+Math.floor(r()*(spec.count[1]-spec.count[0]+1)),phase=r()*TAU;
 const members=Array.from({length:n},(_,i)=>{const a=i/n*TAU;return {x:x+Math.cos(a)*40,y:y+Math.sin(a)*30,vx:0,vy:0,phase:r()*TAU,flash:0};});
 return {id:`flock:${region.key}`,species,x,y,hx:x,hy:y,phase,offset:Math.floor(r()*8),motif:Math.floor(r()*4),hue:(region.hue+spec.hue)%360,members,trust:0,scatter:0,sync:.1,learned:[],answerBar:-1,region};
}
// Centro al que vuelve la bandada: deambula alrededor de su casa.
export function flockAnchor(f,t){const s=SPECIES[f.species].speed;return {x:f.hx+Math.cos(t*.05*s+f.phase)*120,y:f.hy+Math.sin(t*.037*s+f.phase*1.7)*80};}
// Un paso de conducta. player = {x,y,speed (px/s),still (s quieto)}. Devuelve eventos nuevos.
export function stepFlock(f,dt,t,player){
 const spec=SPECIES[f.species],d=Math.hypot(player.x-f.x,player.y-f.y),events=[];
 if(player.speed>((f.follow||0)>0?400:230)&&d<130&&f.scatter<.2){f.scatter=1;f.trust=0;f.follow=0;events.push('scatter');}
 const before=f.trust;
 if(player.still>1.5&&d<220&&f.scatter<.1)f.trust=Math.min(1,f.trust+dt/5);else if(d>320)f.trust=Math.max(0,f.trust-dt/12);
 if(before<.6&&f.trust>=.6)events.push('gather');
 if(f.species==='luciernaga'){const before2=f.sync;f.sync=clamp(f.sync+dt*(player.still>1.5&&d<220?.07:-.02),.1,1);if(before2<.9&&f.sync>=.9)events.push('sync');}
 f.scatter=Math.max(0,f.scatter-dt*.35);
 const anchor=flockAnchor(f,t),gather=(f.trust>=.6&&d<320)||(f.follow||0)>0,cx=gather?player.x:anchor.x,cy=gather?player.y:anchor.y,n=f.members.length;
 let mx=0,my=0;
 f.members.forEach((m,i)=>{
  const a=i/n*TAU+t*spec.speed*.6,orbit=gather?52:34+12*Math.sin(t*.7+i),tx=cx+Math.cos(a)*orbit,ty=cy+Math.sin(a)*orbit*.7;
  let ax=(tx-m.x)*1.6*spec.speed,ay=(ty-m.y)*1.6*spec.speed;
  if(f.scatter>0){const dx=m.x-player.x,dy=m.y-player.y,l=Math.hypot(dx,dy)||1;ax+=dx/l*900*f.scatter;ay+=dy/l*900*f.scatter;}
  m.vx=(m.vx+ax*dt)*Math.exp(-dt*2.2);m.vy=(m.vy+ay*dt)*Math.exp(-dt*2.2);m.x+=m.vx*dt;m.y+=m.vy*dt;m.flash=Math.max(0,m.flash-dt*2.5);mx+=m.x;my+=m.y;
 });
 f.x=mx/n;f.y=my/n;return events;
}
// Llamada propia de cada especie: notas {step (0..15), degree, volume, member}.
const CALLS={
 golondrina:[[[0,4],[1,2],[2,4]],[[0,2],[1,4],[2,5]],[[0,4],[2,5],[3,4]],[[0,5],[1,4],[3,2]]],
 grulla:[[[0,0],[6,-3]],[[0,0],[4,4]],[[0,-3],[8,0]],[[0,0],[6,2]]],
 lira:[[[0,0],[2,2],[4,4],[6,5],[8,4],[12,2]],[[0,4],[2,5],[3,4],[6,2],[10,0],[12,2]],[[0,2],[4,4],[6,6],[8,4],[10,2],[14,0]],[[0,0],[1,2],[2,4],[8,4],[9,5],[10,7]]]
};
export function flockCall(f,bar){
 const spec=SPECIES[f.species],n=f.members.length;
 if(f.species==='luciernaga')return fireflyPattern(f.sync,n,f.offset*31+bar).map((step,i)=>({step,degree:[0,2,4,7][i%4],volume:.05+f.sync*.04,member:i%n}));
 const motif=CALLS[f.species][(f.motif+Math.floor(bar/8))%4];
 // Cada ave canta una nota; las siguientes repiten la llamada en canon, más suave (se contestan entre ellas).
 const lead=motif.map(([step,degree],i)=>({step,degree,volume:spec.channel==='bass'?.12:.08,member:i%n}));
 const echo=n>2&&spec.channel!=='bass'?motif.map(([step,degree],i)=>({step:step+8,degree:degree+2,volume:.05,member:(i+1)%n})).filter(x=>x.step<16):[];
 return [...lead,...echo];
}
// Luciérnagas: con poca sincronía parpadean al azar; sincronizadas, caen todas en un groove.
export function fireflyPattern(sync,n,seed){
 const groove=[0,3,6,8,11,14],aligned=Math.round(clamp(sync,0,1)*n),out=[];let h=Math.imul(seed|0,2654435761)>>>0;
 for(let i=0;i<n;i++){if(i<aligned)out.push(groove[i%groove.length]);else{h=(Math.imul(h,1103515245)+12345)>>>0;out.push((h>>>16)%16);}}
 return out;
}
// Respuesta: la bandada devuelve tu llamada con su voz (mismo ritmo, una tercera arriba o una octava abajo).
export function answerCall(f,learned){
 const shift=f.species==='grulla'?-7:f.species==='luciernaga'?4:2;
 return learned.slice(-6).map((n,i)=>({step:clamp(n.step,0,15),degree:n.degree+shift,volume:.09,member:i%f.members.length}));
}
// Grado de un toque según la altura dentro de la bandada: más arriba, más agudo.
export const callDegree=(dy)=>clamp(Math.round(-dy/14),-2,6)+2;
// Cada cuántos compases canta según la estación (y el doble de seguido si confía en ti).
export function callEvery(season,trust=0){const base={primavera:2,verano:2,otono:4,invierno:8}[season]||4;return trust>=.6?Math.max(1,base/2):base;}

// ---------- flora ----------
export const PLANT_ARP=[[0],[0,4],[0,2,4],[0,2,4,6],[0,2,4,6,9]];
export const SEASON_GROWTH={primavera:1.6,verano:1.1,otono:.7,invierno:.35};
export const PLANT_DECAY_MS=6*3600e3;   // una etapa cada 6 h sin visitas
export function createPlants(region,regionSize,biome,seedOf,rng){
 if(region.sea||!keyOk(region.key)||biome==='vacio')return [];
 const home=region.key==='0,0';if(!home&&rng(seedOf(`vida:plant:presence:v1:${region.key}`))()>=PLANT_RARITY)return [];
 const r=rng(seedOf(`vida:plant:v1:${region.key}`)),[rx,ry]=region.key.split(',').map(Number),count=home?3:1+Math.floor(r()*3);
 const cx=(rx+.2+r()*.6)*regionSize,cy=(ry+.2+r()*.6)*regionSize;
 return Array.from({length:count},(_,i)=>({id:`plant:${region.key}:${i}`,x:home?HOME_PLANTS[i][0]:cx+(r()-.5)*160,y:home?HOME_PLANTS[i][1]:cy+(r()-.5)*120,hue:(region.hue+90+i*25)%360,form:Math.floor(r()*3),offset:Math.floor(r()*4),lean:(r()-.5)*.5,lit:0,region}));
}
// Crecimiento guardado {g: 0..4, t: ms}. Leer aplica el decrecimiento por el tiempo sin visitas.
export function plantGrowth(entry,now){if(!entry)return 0;const g=Number(entry.g)||0,t=Number(entry.t)||now;return clamp(g-Math.max(0,now-t)/PLANT_DECAY_MS,0,4);}
export const plantStage=g=>clamp(Math.floor(g+1e-9),0,4);
export function growPlant(entry,now,amount){return {g:clamp(plantGrowth(entry,now)+amount,0,4),t:now};}

// ---------- voces ----------
const pick=(pool,n)=>pool[((n%pool.length)+pool.length)%pool.length];
export function vidaVoice(kind,index,region,genres,seedOf){
 if(kind==='plant')return voiceRegister({role:'lead',instrument:pick(['marimba','kalimba','keys','bell'],seedOf(`vida-voice:plant:${region.key}`)),degree:0,response:4,low:55,high:79},region.genre);
 const spec=SPECIES[kind];if(!spec)return null;
 const instrument=pick(spec.pool,seedOf(`vida-voice:${kind}:${region.key}`)+index);
 return spec.channel==='bass'?{role:'bajo',instrument,degree:0,response:4,low:spec.low,high:spec.high}:{role:'lead',instrument,degree:0,response:4,low:spec.low,high:spec.high};
}
export const vidaKindOf=kind=>{const m=/^vida:(golondrina|grulla|luciernaga|lira|plant):(\d)$/.exec(kind);return m?{kind:m[1],index:Number(m[2])}:null;};

// ---------- guardado: solo especies vistas y crecimiento de plantas (nada de confianza ni llamadas) ----------
export function normalizeVida(saved){
 const out={seen:{},plants:{}};if(!saved||typeof saved!=='object')return out;
 for(const k of SPECIES_IDS)if(saved.seen?.[k])out.seen[k]=true;if(saved.seen?.plant)out.seen.plant=true;
 for(const [id,e] of Object.entries(saved.plants||{})){if(!/^plant:-?\d+,-?\d+:\d$/.test(id)||!e||typeof e!=='object')continue;const g=Number(e.g),t=Number(e.t);if(Number.isFinite(g)&&Number.isFinite(t))out.plants[id]={g:clamp(g,0,4),t};}
 return out;
}
