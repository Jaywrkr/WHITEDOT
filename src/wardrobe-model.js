// Fifty earned styles; the original thirteen IDs remain stable.
const group=(type,entries)=>entries.map(([value,name,ach])=>({id:'cube:'+type+':'+(type==='color'?value.slice(1):value),type,value,name,ach:ach||null}));
const colors=[['#ffffff','Blanco'],['#f0d27a','Ámbar','tope'],['#7fe0b0','Menta','estrella1'],['#6fd3ff','Cian','mundo'],['#ff8a7a','Coral','r3'],['#b9a2ff','Lila','oculto'],['#e3e8ee','Perla'],['#72bca5','Jade'],['#b48bce','Amatista'],['#6c99d4','Cobalto'],['#d9a47c','Cobre'],['#eaedfa','Aurora']];
const trails=[['none','Nada'],['dots','Puntos','mundo'],['line','Línea','poder_cometa'],['notes','Notas','bandada1'],['grains','Granos'],['steps','Pasos'],['orbit','Órbita'],['weave','Trama']];
const halos=[['soft','Suave'],['close','Cercano','quietud5'],['pulse','Pulso','tiempo'],['breath','Respira'],['split','Dos voces'],['dusk','Crepúsculo']];
const materials=[['plain','Liso'],['grain','Grano'],['wood','Madera'],['glass','Vidrio'],['metal','Metal'],['water','Agua'],['cloth','Tela'],['star','Estelar']];
const forms=[['square','Cubo'],['double','Doble'],['cut','Esquinas'],['bars','Estrías'],['corners','Cuatro luces'],['beating','Latido']];
const auras=[['none','Sin aura'],['moss','Musgo'],['rain','Lluvia'],['firefly','Luciérnagas'],['constellation','Constelación']];
const voices=[['natural','Del lugar'],['wood','Madera'],['metal','Metal'],['water','Agua'],['string','Cuerda']];
const all=[...group('color',colors),...group('material',materials),...group('form',forms),...group('trail',trails),...group('halo',halos),...group('aura',auras),...group('voice',voices)];
const free=new Set(['cube:color:ffffff','cube:trail:none','cube:halo:soft','cube:material:plain','cube:form:square','cube:aura:none','cube:voice:natural']);
const commons=new Set([...free,...all.filter(p=>p.ach&&p.value!=='#b9a2ff'&&p.value!=='notes').map(p=>p.id)]);
const uncommonIds=new Set(['cube:color:b9a2ff','cube:trail:notes','cube:color:e3e8ee','cube:color:72bca5','cube:material:grain','cube:material:wood','cube:form:double','cube:form:cut','cube:trail:grains','cube:trail:steps','cube:halo:breath','cube:aura:moss','cube:aura:rain','cube:voice:wood','cube:material:glass']);
const rareIds=new Set(['cube:color:b48bce','cube:color:6c99d4','cube:material:metal','cube:material:water','cube:material:cloth','cube:form:bars','cube:halo:split','cube:voice:metal','cube:voice:water','cube:trail:orbit']);
const mythicIds=new Set(['cube:color:eaedfa','cube:material:star','cube:aura:constellation']);
const legacyHints={tope:'Completa el Camino de hoy.',estrella1:'Encuentra una estrella en el Mundo.',mundo:'Entra al Mundo.',r3:'Comparte tres días seguidos.',oculto:'Despierta un hallazgo oculto.',poder_cometa:'Abre una caja con Cometa.',bandada1:'Toca un ave y escucha su respuesta.',quietud5:'Permanece cinco minutos quieto en un lugar.',tiempo:'Toca ocho veces siguiendo el pulso.'};
let uncommon=0,rare=0,epic=0,mythic=0;
export const CUBE_WARDROBE=Object.freeze(all.map(p=>{
 const rarity=commons.has(p.id)?'comun':uncommonIds.has(p.id)?'poco_comun':rareIds.has(p.id)?'rara':mythicIds.has(p.id)?'mitica':'epica';
 let days=0,need=0;if(!p.ach&&!free.has(p.id)){if(rarity==='poco_comun'){days=[3,7,14,21][Math.floor(uncommon++/4)];need=1;}else if(rarity==='rara'){days=[30,45,60,75,90][Math.floor(rare++/2)];need=3+Math.floor(rare/2);}else if(rarity==='epica'){days=90+epic++*10;need=8;}else if(rarity==='mitica'){days=180+mythic++*30;need=16;}}
 return Object.freeze({...p,rarity,free:free.has(p.id),days,need,hint:p.ach?legacyHints[p.ach]:free.has(p.id)?'Conserva tu forma original.':'Juega '+days+' días y encuentra '+need+' linajes.'});
}));
export const wardrobePiece=(type,value)=>CUBE_WARDROBE.find(p=>p.type===type&&p.value===value);
export function wardrobeEligible(piece,state,hidden=[]){if(piece.free)return true;if(piece.ach)return piece.ach==='oculto'?hidden.some(id=>state.ach?.[id]):!!state.ach?.[piece.ach];return (state.totalDays||0)>=piece.days&&Object.keys(state.livingSeen||{}).length>=piece.need;}
export const wardrobeByType=type=>CUBE_WARDROBE.filter(p=>p.type===type);

export const CUBE_COLORS=wardrobeByType('color').map(p=>[p.value,p.name,p.free?null:p.ach||'reward:'+p.id]);
export const CUBE_TRAILS=wardrobeByType('trail').map(p=>({id:p.value,name:p.name,ach:p.free?null:p.ach||'reward:'+p.id}));
export const CUBE_HALOS=wardrobeByType('halo').map(p=>({id:p.value,name:p.name,ach:p.free?null:p.ach||'reward:'+p.id}));
export const CUBE_DEFAULTS=Object.freeze({color:'#ffffff',material:'plain',form:'square',trail:'none',halo:'soft',aura:'none',voice:'natural'});
export function cubeStyleUnlocked(type,value,ach={},rewards){const p=wardrobePiece(type,value);return !!p&&(p.free||Object.hasOwn(rewards?.items||{},p.id)||!!(p.ach&&p.ach!=='oculto'&&ach[p.ach]));}
