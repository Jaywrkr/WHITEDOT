import {CULTURES} from './culture-model.js';
import {livingDefinition} from './living-catalog.js';
const RESIDENTS={altiplano:['seed','manta'],islas:['pulse-fruit','crab'],sabana:['pulse-fruit','turtle'],oasis:['reeds','jelly'],norte:['moss','deer'],corriente:['pressure-flower','worm'],tinta:['reeds','moth'],cauce:['cactus','beetle']};
export function culturalResidents(site,seedOf){
 const culture=CULTURES[site.culture];if(!culture)return [];
 return RESIDENTS[site.culture].map((kind,i)=>{const d=livingDefinition(kind),variant=seedOf(`heritage:individual:v1:${site.id}:${i}`)%224,x=site.x+(i?94:-82),y=site.y+(i?28:-42);
  return {id:`living:heritage:v1:${site.key}:${i}`,kind,shape:d.shape,group:d.group,heritage:site.culture,x,y,homeX:x,homeY:y,size:12+variant%7,variant,hue:culture.hue,phase:variant/30,lit:0,energy:0,phrase:[],personality:i?'curiosa':'social',rare:false};});
}
export function heritageVoice(kind){const [,culture,index]=kind.split(':'),c=CULTURES[culture],i=Number(index);if(!c||!Number.isInteger(i)||i<0||i>2)return null;
 return {role:['lead','perc','acorde'][i],instrument:i===1?['wood','tom','conga'][c.glyph%3]:c.instrument,degree:0,response:6,low:45,high:67};}
export function culturalResonators(site,earned){return Array.from({length:Math.max(0,Math.min(3,earned||0))},(_,i)=>({id:site.id+':artifact:'+i,index:i,x:site.x+(i-1)*35,y:site.y+58,voice:`heritage:${site.culture}:${i}`}));}
export function relicVoice(region,source,seedOf){const n=seedOf(`relic:voice:v1:${source?.id||region.key}`),role=['bajo','perc','acorde','lead'][n%4],pool=role==='bajo'?['sub','velvetbass']:role==='perc'?['tom','wood','conga']:role==='acorde'?['silkstrings','orbitorgan','graincloud']:['feltpiano','airflute','pluckbody'];
 return {role,instrument:pool[Math.floor(n/4)%pool.length],degree:0,response:6,low:role==='bajo'?36:45,high:role==='bajo'?54:67};}
