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
export const CUBE_SHOP=Object.freeze([
 {id:'dust',slot:'trail',name:'Polvo viajero',cost:40,text:'Deja pequeñas chispas blancas al caminar.'},
 {id:'facet',slot:'pulse',name:'Pulso facetado',cost:80,text:'Añade facetas visuales sin cambiar el alcance.'},
 {id:'orbit',slot:'companion',name:'Órbita personal',cost:150,text:'Tres luces acompañan a tu cubo.'}
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
