// Additive landscape DNA. Never consumes legacy placement, rarity or music streams.
// Geometry/addresses stay in generator 1/2; this is a versioned presentation grammar.
export const WORLD_FAMILY_VERSION=1;
const family=(id,name,terrain,material,biomes,genres,flora,fauna,hooks,music,life)=>({
 id,name,terrain,material,biomes:biomes.split(' '),genres:genres.split(' '),
 flora:flora.split(' '),fauna:fauna.split(' '),hooks:hooks.split(' '),music,life,
});
export const WORLD_FAMILIES=[
 family('tidal','Cauces de seda','currents','glass','lago faros vacio','ambient liquid downtempo heart dub',
  'reeds moss','jelly manta turtle','choir bowed rhodes granularair silkstrings graincloud',{attack:1.18,decay:1.12,tone:.82,air:.8,brightness:6100},{pace:.7,density:.7,flora:.8,fauna:1.2}),
 family('grove','Raíces entrelazadas','roots','wood','bosque jardin llanura','organic andean afro tropical microhouse',
  'breath-tree vine fungal-net pulse-fruit','deer moth','resonantpluck reed kalimba rhodes pluckbody airflute',{attack:.95,decay:1.05,tone:.88,air:.9,brightness:6700},{pace:.8,density:1,flora:1.2,fauna:.8}),
 family('terraces','Terrazas de cobre','terraces','metal','ruinas faros tormenta','techhouse electro ebm robotic detroit',
  'lichen cactus','beetle worm','phasekeys hollow machine metalkeys wavetable',{attack:.8,decay:.8,tone:.84,air:.8,brightness:6200},{pace:.85,density:.85,flora:.7,fauna:1.1}),
 family('orbital','Jardines orbitales','orbits','air','jardin llanura faros','nudisco cosmic boogie soulful chicago',
  'seed pressure-flower','blob moth','phasekeys orbitorgan brass clav feltpiano',{attack:.85,decay:.95,tone:.96,air:.95,brightness:7600},{pace:1.1,density:.9,flora:.9,fauna:1.1}),
 family('prism','Arrecifes de cristal','facets','glass','cristales tormenta lago','melodic melodictechno progressive berlin idm',
  'lichen reeds','crab worm','fmglass strings phasekeys resonantpluck wavetable silkstrings',{attack:1.1,decay:1.05,tone:.91,air:.75,brightness:7100},{pace:.75,density:.7,flora:.8,fauna:1}),
 family('vault','Bóvedas de eco','vaults','metal','cueva ruinas','dub minimal minimaltechno dubstep acid acidhouse',
  'fungal-net moss lichen','turtle worm','hollow orbitorgan resonantpluck bowed pluckbody',{attack:1.15,decay:1.2,tone:.7,air:.65,brightness:4900},{pace:.55,density:.65,flora:1,fauna:.7}),
 family('dunes','Estratos de aire','ridges','air','dunas llanura vacio','ambient downtempo lofi jazztronica deep rominimal',
  'cactus seed reeds','beetle deer','rhodes granularair reed choir airflute graincloud',{attack:1.2,decay:1.1,tone:.76,air:.7,brightness:5400},{pace:.6,density:.55,flora:.7,fauna:.7}),
 family('marsh','Islas de membranas','islands','wood','lago bosque tormenta','amapiano tribal breaks brokenbeat garage garagehouse dnb footwork algorave',
  'pulse-fruit reeds moss','turtle blob crab','membrane rhodes resonantpluck phasekeys feltpiano',{attack:.85,decay:.85,tone:.85,air:.85,brightness:6400},{pace:1,density:.85,flora:1,fauna:1.1}),
];
for(const f of WORLD_FAMILIES){for(const v of Object.values(f))if(v&&typeof v==='object')Object.freeze(v);Object.freeze(f);}Object.freeze(WORLD_FAMILIES);
export const worldFamilyDefinition=id=>WORLD_FAMILIES.find(f=>f.id===id);
export function createWorldFamily(region,biome,seedOf,rng){
 const [rx,ry]=region.key.split(',').map(Number),zone=`${Math.floor((rx||0)/2)},${Math.floor((ry||0)/2)}:${biome}`;
 const choose=rng(seedOf(`world:family:v1:${zone}:${region.genre}`)),variant=rng(seedOf(`world:variation:v1:${region.key}`));
 const compatible=WORLD_FAMILIES.filter(f=>f.biomes.includes(biome));
 const pool=compatible.length?compatible:WORLD_FAMILIES,weight=f=>f.genres.includes(region.genre)?5:1;
 let pick=choose()*pool.reduce((n,f)=>n+weight(f),0),definition=pool.at(-1);
 for(const f of pool){pick-=weight(f);if(pick<=0){definition=f;break;}}
 const quiet=!!region.sea||biome==='vacio',angle=variant()*Math.PI,spacing=180+variant()*90;
 return Object.freeze({version:WORLD_FAMILY_VERSION,key:region.key,genre:region.genre,id:definition.id,name:definition.name,
  terrain:definition.terrain,material:definition.material,quiet,angle,spacing,seed:seedOf(`world:space:v1:${region.key}`),
  hue:((region.hue||0)+variant()*36-18+360)%360,saturation:32+Math.floor(variant()*22),
  pace:definition.life.pace*(.9+variant()*.2),density:quiet?.15:definition.life.density,
  music:definition.music,signature:`WF1:${definition.id}:${Math.round(angle*10)}:${Math.round(spacing)}:${region.genre}`});
}
export function activeWorldFamily(region){const f=region?.worldFamily;return f?.key===region.key&&f.genre===region.genre?f:null;}
// Smooth spatial niches shared by contours and common inhabitants, across chunk edges.
export function familyHabitat(f,x,y){
 if(!f)return 1;
 const u=(x*Math.cos(f.angle)+y*Math.sin(f.angle))/f.spacing,
  v=(-x*Math.sin(f.angle)+y*Math.cos(f.angle))/f.spacing;
 const a=Math.sin(u*Math.PI),b=Math.sin(v*Math.PI),radius=Math.hypot(a,b);
 let k;
 switch(f.terrain){
 case 'currents':k=Math.exp(-Math.pow((b+Math.sin(u)*.45)*2.4,2));break;
 case 'roots':k=Math.max(0,1-radius*.85);break;
 case 'terraces':k=Math.pow(Math.abs(b),4);break;
 case 'orbits':k=Math.max(0,1-Math.abs(radius-.8)*3);break;
 case 'facets':k=Math.pow(Math.abs(a*b),2);break;
 case 'vaults':k=Math.max(0,1-Math.abs(radius-1)*4);break;
 case 'ridges':k=Math.pow(Math.abs(Math.sin(v*Math.PI+Math.sin(u)*.8)),6);break;
 default:k=Math.max(0,1-(a*a+b*b)*.7);
 }
 return .12+.88*k;
}
export function familyField(items,field,chunkId,f,seedOf){
 if(!f||!['grass','plants','sp','flies'].includes(field))return items;
 return items.filter((o,i)=>{
  if(o.s?.rare||o.rare||o.id?.startsWith('nursery:'))return true;
  const x=o.hx??o.x,y=o.hy??o.y,weight=(.25+.75*familyHabitat(f,x,y))*f.density;
  return seedOf(`world:field:v1:${chunkId}:${field}:${i}`)%10000<weight*10000;
 });
}
export function familyMusic(identity,region,allowedHooks=identity.hooks){
 const f=activeWorldFamily(region);if(!f)return identity;
 const definition=worldFamilyDefinition(f.id),preferred=definition.hooks.filter(id=>allowedHooks.includes(id));
 return {...identity,worldFamily:f.id,hooks:Object.freeze(preferred.length?preferred:identity.hooks),
  attack:Math.min(2.1,identity.attack*f.music.attack),decay:Math.min(1.5,identity.decay*f.music.decay),
  tone:identity.tone*f.music.tone,air:identity.air*f.music.air,brightness:Math.min(identity.brightness,f.music.brightness)};
}
