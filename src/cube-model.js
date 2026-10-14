export const CUBE_COLORS=[["#ffffff","Blanco",null],["#f0d27a","Ámbar","tope"],["#7fe0b0","Menta","estrella1"],["#6fd3ff","Cian","mundo"],["#ff8a7a","Coral","r3"],["#b9a2ff","Lila","oculto"]];
export const CUBE_TRAILS=[{id:'none',name:'Nada'},{id:'dots',name:'Puntos',ach:'mundo'},{id:'line',name:'Línea',ach:'poder_cometa'},{id:'notes',name:'Notas',ach:'bandada1'}];
export const CUBE_HALOS=[{id:'soft',name:'Suave'},{id:'close',name:'Cercano',ach:'quietud5'},{id:'pulse',name:'Pulso',ach:'tiempo'}];
export function cosmeticUnlocked(item,ach,rewards){return !item.ach||!!ach?.[item.ach]||Object.hasOwn(rewards?.items||{},'cube:'+(CUBE_TRAILS.includes(item)?'trail:':'halo:')+item.id);}
export function normalizeCube(raw,ach={},rewards){return {version:1,color:typeof raw?.color==='string'?raw.color:'#ffffff',trail:CUBE_TRAILS.some(t=>t.id===raw?.trail&&cosmeticUnlocked(t,ach,rewards))?raw.trail:'none',halo:CUBE_HALOS.some(t=>t.id===raw?.halo&&cosmeticUnlocked(t,ach,rewards))?raw.halo:'soft'};}
