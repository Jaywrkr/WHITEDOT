// Original synthetic studies, inspired by traditions; no sampled works or recordings.
// Independent presence streams preserve every existing world recipe.
export const CULTURES=Object.freeze({
 altiplano:{name:'Jardines del Altiplano',reference:'Pentatonía andina',scale:[0,2,4,7,9],instrument:'reed',rhythm:[0,3,6,10],hue:25,glyph:0},
 islas:{name:'Islas de bronce',reference:'Ensamble resonante inspirado en gamelan',scale:[0,1,3,7,8],instrument:'steel',rhythm:[0,4,8,12],hue:170,glyph:1},
 sabana:{name:'Campanas de sabana',reference:'Patrones de campana africana y respuesta',scale:[0,3,5,7,10],instrument:'membrane',rhythm:[0,4,9,13],hue:55,glyph:2},
 oasis:{name:'Patios del horizonte',reference:'Color interválico de hijaz, en afinación temperada',scale:[0,1,4,5,7,8,10],instrument:'hollow',rhythm:[0,3,8,11],hue:280,glyph:3},
 norte:{name:'Voces del norte',reference:'Llamadas, respiración y paisaje nórdico',scale:[0,2,5,7,9],instrument:'bowed',rhythm:[0,5,9,14],hue:195,glyph:4},
 corriente:{name:'Río de cinco notas',reference:'Desarrollo modal inspirado en tradiciones de India',scale:[0,2,4,7,9],instrument:'kalimba',rhythm:[0,2,7,12],hue:320,glyph:5},
 tinta:{name:'Jardines de tinta',reference:'Color de escala in japonesa',scale:[0,1,5,7,8],instrument:'flute',rhythm:[0,6,10,14],hue:355,glyph:6},
 cauce:{name:'Cauces de cobre',reference:'Síncopa inspirada en cumbia electrónica',scale:[0,2,3,5,7,9,10],instrument:'clav',rhythm:[0,3,7,10],hue:110,glyph:7},
});
export const CULTURE_IDS=Object.keys(CULTURES),CULTURE_RARITY=.12;
export const ARTIFACTS=['Voz dormida','Semilla de ritmo','Resonancia antigua'];
const keyOk=k=>/^-?\d+,-?\d+$/.test(k);
export function createSanctuary(region,size,regionAt,seedOf,rng,forcedCulture=null){
 if(region.sea||!keyOk(region.key))return null;
 const r=rng(seedOf(`culture:presence:v1:${region.key}`));
 if(!forcedCulture&&r()>=CULTURE_RARITY)return null;
 const q=rng(seedOf(`culture:site:v1:${region.key}`)),[rx,ry]=region.key.split(',').map(Number);
 const culture=CULTURES[forcedCulture]?forcedCulture:CULTURE_IDS[Math.floor(q()*CULTURE_IDS.length)];
 const x=(rx+.3+q()*.35)*size,y=(ry+.3+q()*.35)*size,lands=[];
 for(let ring=1;ring<=3&&lands.length<3;ring++)for(let a=-ring;a<=ring;a++)for(let b=-ring;b<=ring;b++){
  if(Math.max(Math.abs(a),Math.abs(b))!==ring)continue;
  const d=regionAt((rx+a+.5)*size,(ry+b+.5)*size);
  if(!d.sea)lands.push({x:rx+a,y:ry+b,key:d.key});
 }
 if(!lands.length)return null; // Never create a quest with an unreachable/missing destination.
 const routes=Array.from({length:3},(_,chapter)=>{
  const land=lands[chapter%lands.length],gx=(land.x+.3+q()*.4)*size,gy=(land.y+.3+q()*.4)*size;
  const order=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(q()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  return {x:gx,y:gy,key:land.key,order,clues:[{x:x+95+chapter*18,y:y+140},{x:gx-110,y:gy-170}],
   stones:Array.from({length:4},(_,i)=>({x:gx+(i-1.5)*42,y:gy+24})),relic:{x:gx,y:gy+92}};
 });
 return {id:`sanctuary:${region.key}`,key:region.key,culture,x,y,region,routes};
}
export function normalizeCultureBook(raw){
 const out={collections:{},sites:{}};
 for(const id of CULTURE_IDS){const n=raw?.collections?.[id];if(Number.isInteger(n)&&n>=0&&n<=3)out.collections[id]=n;}
 if(raw?.sites&&typeof raw.sites==='object')for(const [id,e]of Object.entries(raw.sites)){
  if(Object.keys(out.sites).length>=96)break;
  if(!/^sanctuary:-?\d+,-?\d+$/.test(id)||!e||!Number.isInteger(e.chapter)||e.chapter<0||e.chapter>3)continue;
  const heard=e.heard===true,clues=heard&&Number.isInteger(e.clues)?Math.max(0,Math.min(2,e.clues)):0;
  out.sites[id]={chapter:e.chapter,heard,clues,open:heard&&clues===2&&e.open===true};
 }
 return out;
}
export function captureStone(sequence,index,order){
 if(index===order[sequence.length])return [...sequence,index];
 return index===order[0]?[index]:[];
}
export function cultureNotes(site,chapter){
 const c=CULTURES[site.culture],r=site.routes[Math.min(2,chapter)];
 return r.order.map((stone,i)=>({stone,step:c.rhythm[i],interval:c.scale[stone%c.scale.length]}));
}
