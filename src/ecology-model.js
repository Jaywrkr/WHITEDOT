import {contentVariant} from './content-contracts.js';
import {personalityOf} from './personality.js';
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>x*x*(3-2*x);
const row=(id,name,terrain,flora,ground,material)=>Object.freeze({id,name,terrain,flora,ground,material});
// Local ecologies reuse the 11 base biomes; these are distinct compositions, not new genre IDs.
export const ECOLOGIES=Object.freeze({
 llanura:[row('estepa','Estepa de hilos','ridges','hierba','arena','air'),row('pradera','Pradera de semillas','roots','flor','musgo','wood'),row('tundra','Tundra luminosa','flecks','arbusto','piedra','glass')],
 bosque:[row('canopia','Canopia de filamentos','roots','helecho','musgo','wood'),row('micelio','Bosque de micelio','cells','arbusto','musgo','wood'),row('bambu','Bosque de juncos','ridges','junco','musgo','air')],
 lago:[row('humedal','Humedal de pulsos','ripples','junco','agua','wood'),row('manglar','Manglar de luz','roots','arbusto','musgo','wood'),row('laguna','Laguna de vidrio','cells','coral','agua','glass')],
 ruinas:[row('basalto','Ruinas de basalto','cells','coral','piedra','metal'),row('terrazas','Terrazas dormidas','ridges','hierba','piedra','wood'),row('oxido','Ruinas de cobre','flecks','arbusto','ceniza','metal')],
 jardin:[row('polen','Jardín de polen','flecks','flor','musgo','air'),row('raices','Jardín de raíces','roots','helecho','musgo','wood'),row('vainas','Jardín de vainas','ripples','arbusto','musgo','glass')],
 dunas:[row('salinas','Salinas resonantes','cells','coral','arena','glass'),row('sedas','Dunas de seda','ridges','hierba','arena','air'),row('oasis','Oasis de cobre','ripples','junco','arena','metal')],
 cristales:[row('geodas','Campo de geodas','cells','coral','cristal','glass'),row('agujas','Agujas de luz','ridges','junco','cristal','metal'),row('escarcha','Cristales de escarcha','flecks','helecho','piedra','air')],
 faros:[row('acantilado','Acantilados de eco','ridges','hierba','piedra','metal'),row('mareas','Faros de marea','ripples','junco','musgo','glass'),row('bruma','Faros de bruma','flecks','arbusto','piedra','air')],
 tormenta:[row('fulgurita','Campo de fulguritas','roots','coral','ceniza','glass'),row('magnetico','Llanura magnética','cells','arbusto','piedra','metal'),row('nubes','Archipiélago de nubes','ripples','junco','ceniza','air')],
 cueva:[row('hongos','Gruta de esporas','roots','helecho','musgo','wood'),row('estalactitas','Gruta de agujas','ridges','coral','piedra','metal'),row('subterraneo','Lago subterráneo','ripples','junco','cristal','glass')],
 vacio:[row('silencio','Mar de silencio','flecks',null,null,'air'),row('sal','Mar de sal','ripples',null,null,'glass'),row('constelacion','Vacío de constelaciones','cells',null,null,'air')]
});
export const ECOLOGY_CONTENT=Object.freeze([
 {id:'ecology:reed',name:'Junco de pulso',kind:'life',biomes:['llanura','bosque','lago','jardin','faros'],actions:['touch','bend','listen'],materials:['wood','air'],roles:['bass','groove','space'],rarity:.62,cell:'chunk'},
 {id:'ecology:pod',name:'Vaina viajera',kind:'life',biomes:['llanura','bosque','jardin','dunas','cristales'],actions:['touch','drag','listen'],materials:['wood','glass'],roles:['bass','melody','groove'],rarity:.45,cell:'chunk'},
 {id:'ecology:lichen',name:'Micelio resonante',kind:'life',biomes:['bosque','lago','jardin','cueva'],actions:['touch','hold','listen'],materials:['wood'],roles:['bass','groove','space'],rarity:.5,cell:'chunk'},
 {id:'ecology:stone',name:'Piedra estriada',kind:'toy',biomes:['llanura','ruinas','dunas','cristales','faros','tormenta','cueva'],actions:['touch','drag','listen'],materials:['metal','glass'],roles:['bass','groove'],rarity:.58,cell:'chunk'},
 {id:'ecology:filament',name:'Filamento de bruma',kind:'phenomenon',biomes:['lago','faros','cueva','vacio'],actions:['touch','drag','listen'],materials:['air'],roles:['space','melody','groove'],rarity:.25,cell:'chunk'},
 {id:'ecology:coral',name:'Coral de cobre',kind:'life',biomes:['ruinas','dunas','cristales','tormenta','cueva'],actions:['touch','bend','listen'],materials:['metal','glass'],roles:['bass','groove','melody'],rarity:.35,cell:'chunk'}
]);
export function climateField(rx,ry,seedOf,rng){
 const sample=(tag,span)=>{const x=rx/span,y=ry/span,a=Math.floor(x),b=Math.floor(y),tx=smooth(x-a),ty=smooth(y-b);
  const at=(i,j)=>rng(seedOf(`ecology:v2:climate:${tag}:${i},${j}`))();
  return (at(a,b)*(1-tx)+at(a+1,b)*tx)*(1-ty)+(at(a,b+1)*(1-tx)+at(a+1,b+1)*tx)*ty;
 };
 return {humidity:sample('humidity',5),temperature:sample('temperature',7),elevation:sample('elevation',4),fertility:sample('fertility',3)};
}
const TARGETS={llanura:[.45,.6],bosque:[.8,.5],lago:[.95,.55],ruinas:[.3,.5],jardin:[.65,.75],dunas:[.08,.9],cristales:[.3,.2],faros:[.4,.35],tormenta:[.75,.5],cueva:[.75,.15],vacio:[.08,.1]};
const HOME={humedal:'lago',salinas:'dunas',basalto:'ruinas',micelio:'bosque',raices:'jardin'};
export function homeEcologyBiome(seed){return HOME[String(seed).split('-')[0]]||null;}
export function chooseEcologyBiome(rx,ry,eligible,seedOf,rng){
 const field=climateField(rx,ry,seedOf,rng),random=rng(seedOf(`ecology:v2:biome:${Math.floor(rx/3)},${Math.floor(ry/3)}`));
 const weight=b=>{const [h,t]=TARGETS[b.id];return Math.max(.03,b.w)*(.06+Math.exp(-((field.humidity-h)**2+(field.temperature-t)**2)*12));};
 let pick=random()*eligible.reduce((n,[,b])=>n+weight(b),0);for(const [i,b]of eligible){pick-=weight(b);if(pick<=0)return i;}return eligible.at(-1)[0];
}
export function buildEcology(region,biome,seedOf,rng,worldSeed=''){
 const [rx,ry]=region.key.split(',').map(Number),field=climateField(rx,ry,seedOf,rng),climate={...field,humidity:(field.humidity+TARGETS[biome][0])/2,temperature:(field.temperature+TARGETS[biome][1])/2},random=tag=>rng(seedOf(`ecology:v2:${tag}:${region.key}`))();
 const options=ECOLOGIES[biome],block=rng(seedOf(`ecology:v2:habitat:${Math.floor(rx/3)},${Math.floor(ry/3)}`))();
 let profile=options[Math.floor(block*options.length)];const home=worldSeed.split('-')[0];if(!rx&&!ry)profile=options.find(p=>p.id===home)||profile;
 const quiet=region.sea||biome==='vacio',density=quiet?0:clamp(.1+climate.fertility*.65+(random('density')-.5)*.25),wet=climate.humidity>.64;
 const flora=quiet?0:.18+density*(wet?1.1:.8),fauna=quiet?0:.15+random('fauna')*.65;
 const terrainScale=[44,64,88][Math.min(2,Math.floor(climate.elevation*3))],form=['open','grove','islands','terraces'][Math.floor(random('form')*4)];
 const architecture=['breathing','rooted','interlocking','floating'][Math.floor(random('score')*4)];
 return Object.freeze({...profile,floraType:profile.flora,version:2,climate:Object.freeze(climate),density,flora,fauna,terrainScale,form,
  air:region.sea?'claro':wet?'niebla':climate.humidity<.28?'polvo':random('air')<.3?'esporas':'claro',
  weather:region.sea?'calm':climate.humidity>.7?'rain':climate.temperature<.3?'mist':climate.humidity<.3?'dry':'clear',
  score:Object.freeze({architecture,phraseBars:[8,12,16][Math.floor(random('phrases')*3)],hookLimit:2+Math.floor(random('notes')*3),brightness:5600+random('brightness')*3000}),
  signature:Object.freeze([profile.id,Math.floor(climate.humidity*5),Math.floor(climate.temperature*5),Math.floor(climate.elevation*5),Math.floor(density*5),Math.floor(fauna*4),terrainScale,form,architecture])});
}
export function applyEcology(region,biome,seedOf,rng,worldSeed){
 const ecology=buildEcology(region,biome,seedOf,rng,worldSeed);region.ecology=ecology;region.ground=ecology.ground;region.air=ecology.air;
 region.hab=[ecology.id,ecology.name,ecology.flora,ecology.fauna,ecology.material==='metal'||ecology.material==='glass'?1:.55];
 if(ecology.flora>0){const r=rng(seedOf(`ecology:v2:flora:${region.key}`));region.plants=[{t:ecology.floraType,h:8+r()*18,pet:4+Math.floor(r()*4),hue:region.hue}];}
 else region.plants=[];
 region.species.forEach((sp,i)=>{const r=rng(seedOf(`ecology:v2:fauna:${sp.id}`));sp.mob=ecology.form==='open'?'deriva':['orbita','timida','salta'][Math.floor(r()*3)];sp.spd=.3+r()*.65;sp.cell=Math.min(3,sp.cell);});
 return region;
}
export function ecologyRecipe(recipe,region,directory,biome,seedOf,rng){
 const e=region.ecology,extra=directory.compatible(biome).filter(d=>d.id.startsWith('ecology:')).map(d=>{const v=contentVariant(d,region.key,biome,seedOf,rng);return {id:d.id,present:!region.sea&&e.density>0&&v.present,weight:e.density};});
 return Object.freeze({...recipe,version:2,ecology:e,material:e.material,materialName:{wood:'Madera cálida',glass:'Cristal suave',metal:'Metal filtrado',air:'Aire sedoso'}[e.material],layout:e.form==='open'?'scattered':e.form==='islands'?'rings':'clusters',objectDensity:.2+e.density*.8,elements:Object.freeze([...recipe.elements,...extra].map(Object.freeze)),budgets:Object.freeze({...recipe.budgets,objects:region.sea?0:8+Math.floor(e.density*16)})});
}
export function createEcologyObjects(cx,cy,size,region,biome,directory,seedOf,rng,pockets,forced=false){
 if(!region.ecology||region.sea||region.ecology.density===0)return [];
 const objects=[],ensemble=pockets.find(p=>p.kind==='ensemble'),limit=1+Math.floor(region.ecology.density*4);
 const definitions=directory.compatible(biome).filter(d=>d.id.startsWith('ecology:'));
 if(forced){const preferred={micelio:'lichen',hongos:'lichen',salinas:'stone',basalto:'stone',geodas:'stone',vainas:'pod',bruma:'filament',fulgurita:'coral'}[region.ecology.id];definitions.sort((a,b)=>Number(b.id==='ecology:'+preferred)-Number(a.id==='ecology:'+preferred));}
 for(const definition of definitions){
  const v=contentVariant(definition,`${cx},${cy}`,biome,seedOf,rng),allowed=v.present&&region.recipe.elements.find(e=>e.id===definition.id)?.present;
  if((!allowed&&!(forced&&!objects.length))||objects.length>=limit)continue;
  const r=rng(seedOf(`ecology:v2:object:${definition.id}:${cx},${cy}`)),a=r()*Math.PI*2,d=30+r()*70;
  const x=(forced?cx*size:ensemble?.x??(cx+.5)*size)+Math.cos(a)*d,y=(forced?cy*size:ensemble?.y??(cy+.5)*size)+Math.sin(a)*d;
  const id=`${definition.id}:${cx},${cy}`,personality=personalityOf(id,seedOf,rng);
  objects.push({id,name:definition.name,kind:definition.id.slice(8),channel:v.role,material:v.material,variant:v.variant,x,y,hx:x,hy:y,size:8+r()*9,phase:r()*Math.PI*2,personality,lit:0,charge:0,bend:0,cd:0});
 }return objects;
}
export function ecologyVoice(kind,region,genres,seedOf,rng){
 const channel=kind.split(':').at(-1),role={bass:'bajo',groove:'perc',melody:'lead',space:'acorde'}[channel]||'perc',g=genres[region.genre],r=rng(seedOf(`ecology:v2:voice:${region.key}:${kind}`));
 const pool=role==='bajo'?(g.bassP||[g.bassI]):role==='perc'?(g.percP||['wood','rim','tom','shaker']):g.hookP;
 return {role,instrument:pool[Math.floor(r()*pool.length)],degree:Math.floor(r()*7),response:4,low:role==='bajo'?36:role==='acorde'?48:52,high:role==='bajo'?55:69};
}
