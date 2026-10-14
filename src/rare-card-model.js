import {RHYTHM_EMPTY_CHANCE,FOSSIL_DENOMINATOR} from './percussion-model.js';
import {RELIC_RATE,MAGICAL_RELIC_RATE} from './relics.js';
import {ANOMALIES,TIERS} from './wonders.js';
import {NATURAL_BOX_RATE,POWERS,POWER_IDS} from './expansion-music.js';
import {PET_SPECIES,PET_BOX_DENOMINATOR} from './pet-model.js';
import {placeAddress,supportedWorld} from './world-identity.js';
import {deploymentTime} from './release-model.js';
export const RARE_BOOK_LIMIT=512,RARE_PAGE_SIZE=12;
export const CARD_TIERS={raro:{name:'Raro',ink:'#9fe8ff'},singular:{name:'Singular',ink:'#bda5f5'},legendario:{name:'Legendario',ink:'#bda5f5'},mitico:{name:'Mítico',ink:'#f0d27a'}};
const boxChance=NATURAL_BOX_RATE/POWER_IDS.length;
export const RARE_CARDS=Object.freeze({
 fossil:{name:'Fósil de ritmo',tier:'raro',probability:RHYTHM_EMPTY_CHANCE/FOSSIL_DENOMINATOR,unit:'sectores de tierra',condition:'Solo en un sector sin percusión ordinaria. Es una frecuencia teórica, no una garantía por distancia.',text:'Una espiral guardó un pulso antiguo. Tócala; permanece para escuchar cómo cambia.',art:'fossil'},
 'relic:ordinary':{name:'Eco antiguo',tier:'raro',probability:RELIC_RATE-MAGICAL_RELIC_RATE,unit:'sectores elegibles',condition:'Fuera de los nueve sectores centrales. Esta cifra corresponde al Eco antiguo, sin incluir la constelación.',text:'Escucha seis segundos y responde con tres pulsos. La reliquia permanece en tu colección.',art:'relic'},
 'relic:magical':{name:'Constelación dormida',tier:'singular',probability:MAGICAL_RELIC_RATE,unit:'sectores elegibles',condition:'Fuera de los nueve sectores centrales. Parte del conjunto de reliquias, no una tirada adicional.',text:'Doce segundos de escucha y cinco pulsos despiertan una constelación.',art:'relic'},
 ...Object.fromEntries(Object.entries(ANOMALIES).map(([type,a])=>['anomaly:'+type,{name:a.name,tier:a.tier,probability:TIERS[a.tier].p/Object.values(ANOMALIES).filter(b=>b.tier===a.tier).length,unit:'regiones elegibles',condition:'Regiones de tierra a cuatro o más regiones del Origen. Frecuencia de este tipo concreto; las regiones vecinas no son tiradas de un sorteo al caminar.',text:a.rule,art:'anomaly'}])),
 ...Object.fromEntries(POWER_IDS.map(id=>['box:'+id,{name:'Caja · '+POWERS[id].name,tier:'raro',probability:boxChance,unit:'sectores de tierra',condition:'Caja natural con este poder: aparición de caja × selección del poder. Los regalos por quietud/formación no entran en esta cifra.',text:POWERS[id].text,art:'box'}])),
 ...Object.fromEntries(Object.entries(PET_SPECIES).map(([id,p])=>['petbox:'+id,{name:p.name,tier:'singular',probability:1/PET_BOX_DENOMINATOR,unit:'cajas naturales',condition:'Probabilidad de que una caja natural origine compañía, si aún no tienes mascota. No es la probabilidad de esta especie: no multiplicamos tasas sin demostrar su independencia.',text:'Algo raro eligió quedarse. Esta voz aprendida viaja contigo.',art:'pet'}]))
});
export const rareDefinition=type=>Object.hasOwn(RARE_CARDS,type)?RARE_CARDS[type]:null;
export function rarityLabel(type,recorded=null){const d=recorded||rareDefinition(type);if(!d)return '';return `≈1/${Math.round(1/d.probability).toLocaleString('es-EC')} ${d.unit}`;}
const clean=(v,n)=>typeof v==='string'?v.slice(0,n):'';
export const cardKey=(type,sourceId,world)=>JSON.stringify([type,sourceId,world.seed,world.layout,world.generatorVersion,world.catalogVersion,world.layoutVersion]);
export function cardSerial(key){let h=2166136261;for(const ch of key)h=Math.imul(h^ch.charCodeAt(0),16777619);return (h>>>0).toString(16).padStart(8,'0').toUpperCase();}
export function makeRareCard(raw){
 if(!rareDefinition(raw?.type)||typeof raw.sourceId!=='string'||!raw.sourceId||raw.sourceId.length>120||!supportedWorld(raw.world))return null;
 const world={seed:raw.world.seed,layout:raw.world.layout,generatorVersion:raw.world.generatorVersion,catalogVersion:raw.world.catalogVersion,layoutVersion:raw.world.layoutVersion};
 let address=null;
 if(raw.address){try{if(!supportedWorld(raw.address)||cardKey('', '',raw.address)!==cardKey('', '',world))return null;address=placeAddress(world,raw.address.x,raw.address.y,raw.address.layer);}catch(_){return null;}}
 const def=rareDefinition(raw.type),o=raw.odds,units=new Set(['sectores de tierra','sectores elegibles','regiones elegibles','cajas naturales']);
 const valid=o?.version===1&&Number.isFinite(o.probability)&&o.probability>=1e-12&&o.probability<=1&&units.has(o.unit)&&Object.hasOwn(CARD_TIERS,o.tier)&&typeof o.condition==='string';
 const odds={version:1,probability:valid?o.probability:def.probability,unit:valid?o.unit:def.unit,tier:valid?o.tier:def.tier,condition:clean(valid?o.condition:def.condition,600)};
 const date=clean(raw.day,10);return {id:cardKey(raw.type,raw.sourceId,world),type:raw.type,name:clean(raw.name,64)||def.name,odds,sourceId:raw.sourceId,world,address,
  precision:address?(raw.precision==='region'?'region':'point'):'unknown',regionName:clean(raw.regionName,64)||'Lugar no registrado',biome:clean(raw.biome,40),genre:clean(raw.genre,40),
  firstSeen:deploymentTime(raw.firstSeen),day:deploymentTime(date+'T00:00:00Z')?date:'',artVariant:Number.isInteger(raw.artVariant)?Math.abs(raw.artVariant)%12:0,forced:raw.forced===true,legacy:raw.legacy===true};
}
export function normalizeRareBook(raw){
 const items=[],seen=new Set();if(Array.isArray(raw?.items))for(const value of raw.items){if(items.length>=RARE_BOOK_LIMIT)break;const c=makeRareCard(value);if(!c||seen.has(c.id))continue;seen.add(c.id);items.push(c);}
 return {version:1,items};
}
export function storeRareCard(book,card){
 if(!card||book.items.some(c=>c.id===card.id))return 'duplicate';if(book.items.length>=RARE_BOOK_LIMIT)return 'full';book.items.push(card);return 'added';
}
