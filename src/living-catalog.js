import {musicIdentity} from './musical-recipes.js';
import {interactionInstruments,expressiveBassInstruments} from './musical-character.js';
// Independent namespaces: additions do not consume the legacy generator's RNG.
export const LIVING_VERSION=1;
const plant=(id,name,gesture,role,shape,material,affinity)=>({id,name,group:'flora',gesture,role,shape,material,affinity});
const animal=(id,name,gesture,role,shape,material,affinity)=>({id,name,group:'fauna',gesture,role,shape,material,affinity});
const building=(id,name,gesture,role,shape,material,affinity)=>({id,name,group:'architecture',gesture,role,shape,material,affinity});
export const LIVING_CATALOG=Object.freeze([
 plant('breath-tree','Árbol que respira','quietud','acorde','branch','cuerda',['bosque','jardin']),
 plant('pulse-fruit','Frutos de pulso','contacto','perc','pods','semilla',['bosque','jardin']),
 plant('vine','Enredadera conductora','orbita','bajo','vine','cuerda',['bosque','ruinas']),
 plant('fungal-net','Red de hongos','quietud','bajo','network','madera',['cueva','bosque']),
 plant('pressure-flower','Flor de presión','presion','lead','flower','membrana',['jardin','llanura']),
 plant('reeds','Cañas de viento','cruce','perc','reeds','madera',['lago','dunas']),
 plant('moss','Musgo de silencio','quietud','acorde','moss','tela',['bosque','cueva']),
 plant('cactus','Cactus de memoria','respuesta','bajo','cactus','semilla',['dunas','llanura']),
 plant('seed','Semilla viajera','seguir','lead','seed','madera',['llanura','jardin']),
 plant('lichen','Colonia de líquenes','orbita','perc','lichen','piedra',['ruinas','cristales']),
 animal('manta','Manta del aire','seguir','acorde','manta','cuerda',['vacio','lago']),
 animal('deer','Ciervo resonante','seguir','bajo','deer','madera',['bosque','llanura']),
 animal('turtle','Tortuga de piedra','presion','perc','turtle','piedra',['lago','cueva']),
 animal('beetle','Escarabajo reloj','cruce','perc','beetle','madera',['dunas','ruinas']),
 animal('jelly','Medusa de pulso','orbita','bajo','jelly','agua',['lago','vacio']),
 animal('worm','Gusano secuenciador','seguir','lead','worm','metal',['cueva','cristales']),
 animal('whale','Fragmento de ballena del vacío','quietud','bajo','whale','agua',['vacio']),
 animal('moth','Polilla del eco','respuesta','lead','moth','tela',['bosque','faros']),
 animal('crab','Crustáceo de cristal','contacto','perc','crab','metal',['cristales','lago']),
 animal('blob','Blob social','orbita','acorde','blob','membrana',['jardin','tormenta']),
 building('root-house','Casa de raíces','quietud','acorde','roots','madera',['bosque','jardin']),
 building('mill','Molino de escucha','orbita','perc','mill','madera',['dunas','lago']),
 building('cathedral','Catedral del silencio','quietud','acorde','arches','piedra',['cueva','ruinas']),
 building('observatory','Observatorio de órbitas','orbita','lead','orbit','metal',['vacio','faros']),
 building('plaza','Plaza de resonancia','presion','perc','plaza','membrana',['llanura','jardin']),
 building('mirror-grove','Arboleda de espejos','orbita','acorde','mirrors','vidrio',['cristales','ruinas']),
 building('bridge','Puente de respuesta','respuesta','bajo','bridge','cuerda',['lago','ruinas']),
 building('membrane-home','Refugio de membranas','presion','bajo','shelter','membrana',['tormenta','dunas']),
]);
for(const item of LIVING_CATALOG){Object.freeze(item.affinity);Object.freeze(item);}
export const livingDefinition=id=>LIVING_CATALOG.find(v=>v.id===id);
export const RHYTHM_FAMILIES=Object.freeze({straight:[0,4,8,12],broken:[0,3,7,10,14],sync:[0,6,9,14],free:[0,5,11],clave:[0,3,6,10,12],swing:[0,3,6,10,13],half:[0,8,14],double:[0,2,4,6,8,10,12,14]});
export function musicRecipe(region,seedOf,rng){
 const r=rng(seedOf(`living:score:v1:${region.key}:${region.genre}`)),genre=region.genre;
 const family=['ambient','heart'].includes(genre)?'free':['dnb','liquid','breaks','idm','electro','dubstep'].includes(genre)?'broken':['tropical','afro','andean','tribal'].includes(genre)?'clave':['garage','amapiano','microhouse','deep'].includes(genre)?'swing':'straight';
 return {version:1,genre,family,steps:RHYTHM_FAMILIES[family],swing:family==='swing'?.16+r()*.14:.01+r()*.045,
  feel:['ambient','heart','dubstep','amapiano'].includes(genre)?'half':['dnb','liquid'].includes(genre)?'double':'normal',
  attack:.005+r()*.03,decay:.15+r()*.7,accent:.65+r()*.3,rotation:Math.floor(r()*4)*2,
  palette:Math.floor(r()*16),signature:['calida','limpia','analogica','robotica','textural'][Math.floor(r()*5)],
  progression:[[0,3,5,4],[0,5,3,4],[0,0,3,0],[0,4,5,3]][Math.floor(r()*4)],voiceLeading:Math.floor(r()*3)-1};
}
export function livingChunk(cx,cy,size,region,biome,seedOf,rng,groups=['flora','fauna','architecture']){
 const random=rng(seedOf(`living:placement:v1:${cx},${cy}`));
 if(region.sea||random()<.24)return [];
 const density=Math.floor(random()*4),out=[];
 for(let i=0;i<density;i++){
  const group=['flora','fauna','architecture'][Math.floor(random()*3)];
  let pool=LIVING_CATALOG.filter(d=>d.group===group&&d.affinity.includes(biome));
  if(!pool.length)pool=LIVING_CATALOG.filter(d=>d.group===group);if(!pool.length)continue;
  const d=pool[Math.floor(random()*pool.length)],variant=Math.floor(random()*256);
  if(d.id==='whale'&&variant%32!==0)continue;
  if(d.group==='architecture'&&variant%8!==0)continue;
  out.push({id:`living:v1:${cx},${cy}:${i}`,kind:d.id,group:d.group,shape:d.shape,variant,x:(cx+.15+random()*.7)*size,y:(cy+.15+random()*.7)*size,
   homeX:0,homeY:0,hue:(region.hue+variant%50)%360,size:d.group==='architecture'?30+variant%14:9+variant%12,
   studyVariant:seedOf(`living:study:v1:${cx},${cy}:${i}`)%12,personality:['timida','curiosa','social'][variant%3],activeAt:variant%4,rare:variant===(d.group==='architecture'?248:255)||d.id==='whale',lit:0,phase:variant/256*Math.PI*2,energy:0,phrase:[],touching:false});
 }
 for(const o of out){o.homeX=o.x;o.homeY=o.y;}return out.filter(o=>groups.includes(o.group));
}
export function livingVoice(kind,region,genres,seedOf,rng,source=null){
 const id=kind.replace(/^living:/,''),d=livingDefinition(id);if(!d)return null;
 const score=musicRecipe(region,seedOf,rng),h=seedOf(`living:voice:v1:${region.key}:${id}`),role=score.palette%4===0?(d.role==='bajo'?'perc':d.role==='perc'?'bajo':d.role):d.role;
 const genre=genres[region.genre],mind=source?.mind,identity=mind&&musicIdentity(region,seedOf,rng,genres);
 const pool=role==='bajo'?(mind?expressiveBassInstruments(region.genre,genre):(genre.bassP||[genre.bassI])):role==='perc'?['tom','wood','rim','conga','shaker','kick']:
  mind?(role==='acorde'?interactionInstruments(region.genre,genre,role):identity?.hooks||interactionInstruments(region.genre,genre,role)):(genre.hookP||['rhodes']);
 return {role,instrument:pool[(h+(mind?.instrumentChoice||0))%pool.length],degree:(h+(mind?.degree||0))%7,response:mind?2+Math.round(mind.patience*4):[2,3,6][h%3],low:role==='bajo'?36:45,high:role==='bajo'?54:69,
  score:mind?{...score,attack:score.attack*(.8+mind.patience*.8),decay:Math.min(1.1,score.decay*(.7+mind.energy*.5))}:score,material:d.material};
}
// Expanded oceans keep wide empty spaces; aquatic encounters use a separate sparse stream.
export function aquaticChunk(cx,cy,size,region,seedOf,rng){
 const r=rng(seedOf(`living:water:v1:${cx},${cy}`));if(r()>.12)return [];
 const kinds=['jelly','manta','turtle','reeds'],kind=kinds[Math.floor(r()*kinds.length)],def=livingDefinition(kind),variant=Math.floor(r()*256),x=(cx+.2+r()*.6)*size,y=(cy+.2+r()*.6)*size;
 return [{id:`living:v1:${cx},${cy}:9`,kind,shape:def.shape,group:def.group,variant,x,y,homeX:x,homeY:y,hue:region.hue,size:10+variant%10,phase:variant/256*Math.PI*2,lit:0,energy:0,phrase:[],personality:['timida','curiosa','social'][variant%3],activeAt:variant%4,rare:variant===255,studyVariant:0,aquatic:true}];
}
