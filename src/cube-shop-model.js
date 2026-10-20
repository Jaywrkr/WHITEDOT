// Cube shop: slots from docs/TIENDA_DEL_CUBO.md and the pieces that are already built.
// A piece is listed only once it works; later batches add pieces here without touching saves.
export const CUBE_SHOP_SLOTS=Object.freeze([
 {id:'motion',name:'Movimiento',many:false},
 {id:'body',name:'Cuerpo',many:false},
 {id:'eyes',name:'Ojos',many:false},
 {id:'habits',name:'Hábitos',many:true},
 {id:'accessory',name:'Accesorio',many:false},
 {id:'trail',name:'Rastro',many:false},
 {id:'companion',name:'Compañero',many:false},
 {id:'pulse',name:'Forma del pulso',many:false},
 {id:'pulseVoice',name:'Voz del pulso',many:false},
 {id:'sound',name:'Sonido del cubo',many:true},
 {id:'gestures',name:'Gestos',many:true},
 {id:'world',name:'El mundo reacciona',many:true},
 {id:'wild',name:'Locuras',many:true},
 {id:'skills',name:'Habilidades',many:true}
].map(Object.freeze));
// Former ids are kept so existing purchases stay valid.
// art: extra SVG marks for the 180x60 preview, around the cube drawn at 85,25 (10x10).
export const CUBE_SHOP=Object.freeze([
 {id:'dust',slot:'trail',name:'Polvo viajero',cost:40,text:'Deja pequeñas chispas blancas al caminar.',art:'<path d="M32 34h2m14-7h2m13 9h2m9-8h2"/>'},
 {id:'facet',slot:'pulse',name:'Pulso facetado',cost:80,text:'Añade facetas visuales sin cambiar el alcance.',art:'<path d="M90 7l40 23-40 23-40-23zM90 7v46M50 30h80"/>'},
 {id:'orbit',slot:'companion',name:'Órbita personal',cost:150,text:'Tres luces acompañan a tu cubo.',art:'<circle cx="90" cy="30" r="20"/><circle cx="70" cy="30" r="2"/><circle cx="100" cy="13" r="2"/><circle cx="100" cy="47" r="2"/>'},
 {id:'motion:jelly',slot:'motion',name:'Gelatina',cost:150,text:'Se aplasta al frenar y se estira al arrancar.',art:'<path d="M70 38q20 6 40 0M74 22q16-5 32 0"/>'},
 {id:'motion:skate',slot:'motion',name:'Patinador',cost:200,text:'Se desliza con inercia y deja marcas.',art:'<path d="M80 39h20M40 27h30M44 33h26"/>'},
 {id:'motion:pogo',slot:'motion',name:'Pogo',cost:250,text:'Avanza a saltitos con sombra.',art:'<path d="M84 46h12M60 40q10-30 22-12M100 28q12-18 22 12"/>'},
 {id:'motion:worm',slot:'motion',name:'Gusano',cost:300,text:'Se estira y se encoge para avanzar.',art:'<path d="M60 30h20M100 30h22M66 26v8M114 26v8"/>'},
 {id:'motion:float',slot:'motion',name:'Ingravidez',cost:350,text:'Flota sobre el suelo y se balancea.',art:'<path d="M82 48h16M80 18q10-6 20 0"/>'},
 {id:'motion:roll',slot:'motion',name:'Rodar',cost:400,text:'Avanza girando cara por cara, como un dado.',art:'<path d="M70 20a24 24 0 0 1 40 0M106 14l4 6-7 1"/>'},
 {id:'motion:legs',slot:'motion',name:'Patitas',cost:500,text:'Le salen patas de píxel al caminar.',art:'<path d="M86 35l-3 6M90 35l1 6M94 35l-1 6M98 35l3 6"/>'},
 {id:'motion:blink',slot:'motion',name:'Parpadeo',cost:600,text:'Reaparece un poco más adelante, a tempo.',art:'<rect x="105" y="25" width="10" height="10" stroke-dasharray="2 2"/>'},
 {id:'body:beat',slot:'body',name:'Latido',cost:150,text:'Late al tempo de la región.',art:'<rect x="81" y="21" width="18" height="18"/><rect x="77" y="17" width="26" height="26" stroke-opacity=".4"/>'},
 {id:'body:dice',slot:'body',name:'Dado',cost:200,text:'Muestra un número que cambia con cada cristal roto.',art:'<path d="M60 24h1M60 36h1M66 30h1"/>'},
 {id:'body:chameleon',slot:'body',name:'Camaleón',cost:300,text:'Toma el color de la región.',art:'<path d="M60 30h14M106 30h14" stroke-dasharray="1 3"/>'},
 {id:'body:streak',slot:'body',name:'Racha',cost:400,text:'Crece un poco con cada cristal de una cadena.',art:'<rect x="80" y="20" width="20" height="20" stroke-opacity=".5"/><rect x="76" y="16" width="28" height="28" stroke-opacity=".25"/>'},
 {id:'body:fish',slot:'body',name:'Pecera',cost:600,text:'Cubo de cristal con un pez de luz dentro.',art:'<rect x="78" y="18" width="24" height="24"/><path d="M86 30h6M92 28v4"/>'},
 {id:'body:origami',slot:'body',name:'Origami',cost:700,text:'Se despliega como papel al lanzar un pulso.',art:'<path d="M85 25l5-12 5 12M85 35l5 12 5-12M85 25l-12 5 12 5M95 25l12 5-12 5"/>'},
 {id:'body:assembly',slot:'body',name:'Ensamblaje',cost:800,text:'Hecho de píxeles que se separan al quedarte quieto.',art:'<path d="M74 22h4M102 22h4M74 38h4M102 38h4M90 14v4M90 42v4"/>'},
 {id:'body:disco',slot:'body',name:'Bola de disco',cost:900,text:'Facetas y puntos de luz que giran en el suelo.',art:'<path d="M50 44h2M62 50h2M118 46h2M128 40h2M40 38h2M138 52h2"/>'},
 {id:'body:swarm',slot:'body',name:'Enjambre',cost:1200,text:'Cuatro mini cubos que te siguen y se reúnen al parar.',art:'<rect x="66" y="22" width="5" height="5"/><rect x="58" y="32" width="5" height="5"/><rect x="108" y="22" width="5" height="5"/><rect x="116" y="32" width="5" height="5"/>'}
].map(Object.freeze));
export const shopPiece=id=>CUBE_SHOP.find(p=>p.id===id)||null;
export const shopSlot=id=>CUBE_SHOP_SLOTS.find(s=>s.id===id)||null;
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const safeKey=k=>typeof k==='string'&&k.length>0&&k.length<80&&!['__proto__','constructor','prototype'].includes(k);
// wear: one piece per single slot; on: pieces switched on in slots that allow many.
// Entries a newer version wrote for pieces this version does not know are kept untouched when they are owned.
export function normalizeWear(raw,purchases={},legacyEquipped=''){
 const owned=id=>safeKey(id)&&!!purchases?.[id],wear={},on={};
 if(object(raw?.wear))for(const [slot,id] of Object.entries(raw.wear)){
  if(!safeKey(slot)||!owned(id))continue;const piece=shopPiece(id),known=shopSlot(slot);
  if(piece&&(piece.slot!==slot||shopSlot(slot)?.many))continue;if(known?.many)continue;wear[slot]=id;
 }
 else if(owned(legacyEquipped)&&shopPiece(legacyEquipped))wear[shopPiece(legacyEquipped).slot]=legacyEquipped;
 if(object(raw?.on))for(const [id,value] of Object.entries(raw.on)){
  if(value!==true||!owned(id))continue;const piece=shopPiece(id);if(piece&&!shopSlot(piece.slot)?.many)continue;on[id]=true;
 }
 return {wear,on};
}
export const wearing=(q,id)=>{const piece=shopPiece(id);if(!piece)return false;return shopSlot(piece.slot)?.many?q?.on?.[id]===true:q?.wear?.[piece.slot]===id;};
