import {LIVING_CATALOG} from './living-catalog.js';
import {RHYTHM_EMPTY_CHANCE,FOSSIL_DENOMINATOR} from './percussion-model.js';
import {RELIC_RATE,MAGICAL_RELIC_RATE} from './relics.js';
import {ANOMALIES,TIERS} from './wonders.js';
import {NATURAL_BOX_RATE,POWERS,POWER_IDS} from './expansion-music.js';
import {PET_SPECIES,PET_BOX_DENOMINATOR} from './pet-model.js';
import {placeAddress,supportedWorld} from './world-identity.js';
import {deploymentTime} from './release-model.js';
import {normalizeAnatomy} from './anatomy.js';
export const RARE_BOOK_LIMIT=512,RARE_PAGE_SIZE=12;
export const CARD_TIERS={raro:{name:'Raro',ink:'#9fe8ff'},singular:{name:'Singular',ink:'#bda5f5'},legendario:{name:'Legendario',ink:'#bda5f5'},mitico:{name:'Mítico',ink:'#f0d27a'}};
const boxChance=NATURAL_BOX_RATE/POWER_IDS.length;
export const RARE_CARDS=Object.freeze({
 ...Object.fromEntries(LIVING_CATALOG.map(d=>['living:'+d.id,{name:d.name,tier:d.id==='whale'?'singular':'raro',probability:d.id==='whale'||d.group==='architecture'?1/32:null,variantProbability:1/256,unit:'individuos elegibles',condition:d.id==='whale'?'Una variante de 32 candidatos de este linaje llega a manifestarse. No es una probabilidad por distancia.':d.group==='architecture'?'Variante 248 entre las 32 variantes admitidas de esta construcción. Condicionado a que el tipo esté presente; no es frecuencia por sector.':'Variante 255 entre 256 tiradas de variante. La población y presencia del linaje dependen del territorio; su frecuencia conjunta no está medida.',text:'Un ejemplar singular del universo vivo. El lugar queda guardado; la criatura o el momento pueden cambiar.',art:'living'}])),
 'event:convergence':{name:'Convergencia de lluvia y vida',tier:'singular',probability:null,unit:'encuentros elegibles',condition:'Un individuo raro fue observado durante tormenta y atardecer del ciclo local. Frecuencia conjunta sin estimar.',text:'El clima y una voz singular coincidieron durante tu recorrido.',art:'living'},
 'living:relation':{name:'Encuentro entre voces',tier:'singular',probability:null,unit:'encuentros elegibles',condition:'Una relación local real incluye al menos un individuo raro. La frecuencia conjunta no se ha estimado; no multiplicamos probabilidades correlacionadas.',text:'Dos presencias encontraron una frase en común.',art:'living'},
 'living:study':{name:'Memoria de una construcción',tier:'singular',probability:null,unit:'encuentros elegibles',condition:'Se activó una construcción de variante rara. La frecuencia conjunta de presencia y resolución no está estimada.',text:'Una forma, una afinidad y una manera de escuchar quedaron vinculadas.',art:'living'},
 'culture:artifact':{name:'Recuerdo del guardián',tier:'singular',probability:null,unit:'encuentros elegibles',condition:'Llamada escuchada, dos huellas recorridas y puerta resuelta en orden. Frecuencia conjunta sin estimar.',text:'Un instrumento recuperado. Vuelve al guardián y toca el pequeño resonador dorado con tu cubo.',art:'relic'},
 fossil:{name:'Fósil de ritmo',tier:'raro',probability:RHYTHM_EMPTY_CHANCE/FOSSIL_DENOMINATOR,unit:'sectores de tierra',condition:'Solo en un sector sin percusión ordinaria. Es una frecuencia teórica, no una garantía por distancia.',text:'Una espiral guardó un pulso antiguo. Tócala; permanece para escuchar cómo cambia.',art:'fossil'},
 'relic:ordinary':{name:'Eco antiguo',tier:'raro',probability:RELIC_RATE-MAGICAL_RELIC_RATE,unit:'sectores elegibles',condition:'Fuera de los nueve sectores centrales. Esta cifra corresponde al Eco antiguo, sin incluir la constelación.',text:'Escucha seis segundos y responde con tres pulsos. Vuelve al punto para tocar su voz recuperada.',art:'relic'},
 'relic:magical':{name:'Constelación dormida',tier:'singular',probability:MAGICAL_RELIC_RATE,unit:'sectores elegibles',condition:'Fuera de los nueve sectores centrales. Parte del conjunto de reliquias, no una tirada adicional.',text:'Doce segundos de escucha y cinco pulsos despiertan una constelación. Vuelve para tocarla.',art:'relic'},
 ...Object.fromEntries(Object.entries(ANOMALIES).map(([type,a])=>['anomaly:'+type,{name:a.name,tier:a.tier,probability:TIERS[a.tier].p/Object.values(ANOMALIES).filter(b=>b.tier===a.tier).length,unit:'regiones elegibles',condition:'Regiones de tierra a cuatro o más regiones del Origen. Frecuencia de este tipo concreto; las regiones vecinas no son tiradas de un sorteo al caminar.',text:a.rule,art:'anomaly'}])),
 ...Object.fromEntries(POWER_IDS.map(id=>['box:'+id,{name:'Caja · '+POWERS[id].name,tier:'raro',probability:boxChance,unit:'sectores de tierra',condition:'Caja natural con este poder: aparición de caja × selección del poder. Los regalos por quietud/formación no entran en esta cifra.',text:POWERS[id].text,art:'box'}])),
 ...Object.fromEntries(Object.entries(PET_SPECIES).map(([id,p])=>['petbox:'+id,{name:p.name,tier:'singular',probability:1/PET_BOX_DENOMINATOR,unit:'cajas naturales',condition:'Probabilidad de que una caja natural origine compañía, como visita temporal. No es la probabilidad de esta especie: no multiplicamos tasas sin demostrar su independencia.',text:'Una voz rara te acompaña durante unos minutos de juego; el encuentro permanece en esta tarjeta.',art:'pet'}]))
});
export const rareDefinition=type=>Object.hasOwn(RARE_CARDS,type)?RARE_CARDS[type]:null;
export function rarityLabel(type,recorded=null){const d=recorded||rareDefinition(type);if(!d)return '';if(d.probability===null)return rareDefinition(type)?.variantProbability?'Variante ≈1/256 · territorio sin medir':'Frecuencia conjunta sin estimar';return `≈1/${Math.round(1/d.probability).toLocaleString('es-EC')} ${d.unit}`;}
const clean=(v,n)=>typeof v==='string'?v.slice(0,n):'';
export const cardKey=(type,sourceId,world)=>JSON.stringify([type,sourceId,world.seed,world.layout,world.generatorVersion,world.catalogVersion,world.layoutVersion]);
export function cardSerial(key){let h=2166136261;for(const ch of key)h=Math.imul(h^ch.charCodeAt(0),16777619);return (h>>>0).toString(16).padStart(8,'0').toUpperCase();}
export function makeRareCard(raw){
 if(!rareDefinition(raw?.type)||typeof raw.sourceId!=='string'||!raw.sourceId||raw.sourceId.length>120||!supportedWorld(raw.world))return null;
 const world={seed:raw.world.seed,layout:raw.world.layout,generatorVersion:raw.world.generatorVersion,catalogVersion:raw.world.catalogVersion,layoutVersion:raw.world.layoutVersion};
 let address=null;
 if(raw.address){try{if(!supportedWorld(raw.address)||cardKey('', '',raw.address)!==cardKey('', '',world))return null;address=placeAddress(world,raw.address.x,raw.address.y,raw.address.layer);}catch(_){return null;}}
 const def=rareDefinition(raw.type),o=raw.odds,units=new Set(['sectores de tierra','sectores elegibles','regiones elegibles','cajas naturales','individuos elegibles','encuentros elegibles']);
 const valid=o?.version===1&&(o.probability===null&&def.probability===null||Number.isFinite(o.probability)&&o.probability>=1e-12&&o.probability<=1)&&units.has(o.unit)&&Object.hasOwn(CARD_TIERS,o.tier)&&typeof o.condition==='string';
 const odds={version:1,probability:valid?o.probability:def.probability,unit:valid?o.unit:def.unit,tier:valid?o.tier:def.tier,condition:clean(valid?o.condition:def.condition,600)};
 const context={...raw.context};for(const key of ['habitat','weather','phase','gesture','study','relation','role','instrument','character']){const value=clean(raw.context?.[key],100);if(value)context[key]=value;}
 const observations=Array.isArray(raw.observations)?raw.observations.filter(o=>o&&typeof o==='object'&&deploymentTime(o.at)).slice(-8).map(o=>({at:deploymentTime(o.at),phase:clean(o.phase,40),weather:clean(o.weather,40)})):[];
 const date=clean(raw.day,10);return {...raw,id:cardKey(raw.type,raw.sourceId,world),type:raw.type,name:clean(raw.name,64)||def.name,odds,sourceId:raw.sourceId,world,address,appearance:normalizeAnatomy(raw.appearance),
  precision:address?(raw.precision==='region'?'region':'point'):'unknown',regionName:clean(raw.regionName,64)||'Lugar no registrado',biome:clean(raw.biome,40),genre:clean(raw.genre,40),
  firstSeen:deploymentTime(raw.firstSeen),day:deploymentTime(date+'T00:00:00Z')?date:'',artVariant:Number.isInteger(raw.artVariant)?Math.abs(raw.artVariant)%12:0,forced:raw.forced===true,legacy:raw.legacy===true,context,observations};
}
export function normalizeRareBook(raw){
 if(Number.isInteger(raw?.version)&&raw.version>1)return {...raw,readOnly:true,items:Array.isArray(raw.items)?raw.items:[]};
 const unknown=[...(Array.isArray(raw?.unrecognizedItems)?raw.unrecognizedItems:[])];for(const value of Array.isArray(raw?.items)?raw.items:[])if(value&&typeof value.type==='string'&&!rareDefinition(value.type))unknown.push(value);
 const items=[],seen=new Set();if(Array.isArray(raw?.items))for(const value of raw.items){const c=makeRareCard(value);if(!c||seen.has(c.id))continue;seen.add(c.id);items.push(c);}
 return {...raw,version:1,items,...(unknown.length?{unrecognizedItems:unknown}:{})};
}
export function storeRareCard(book,card){
 if(book.readOnly)return 'readonly';if(!card||book.items.some(c=>c.id===card.id))return 'duplicate';if(book.items.length>=RARE_BOOK_LIMIT)return 'full';book.items.push(card);return 'added';
}

export function cardAbility(card){
 const role=card.context?.role||((card.type||'').startsWith('box:')?'transformacion':card.type==='fossil'?'perc':'lead');
 const names={bajo:['Cuerpo','Sostiene el suelo musical.'],perc:['Pulso','Dibuja acentos entre los golpes.'],acorde:['Aire','Abre espacio entre las voces.'],lead:['Frase','Contesta con una pequeña melodía.'],agudo:['Detalle','Añade un brillo breve.'],transformacion:['Cambio','Transforma temporalmente tu manera de tocar.']};
 const [name,text]=names[role]||names.lead;return {role,name,text,instrument:card.context?.instrument||''};
}
