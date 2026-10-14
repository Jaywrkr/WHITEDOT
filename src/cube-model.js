export const CUBE_TRAILS=[{id:'none',name:'Nada'},{id:'dots',name:'Puntos',ach:'mundo'},{id:'line',name:'Línea',ach:'poder_cometa'},{id:'notes',name:'Notas',ach:'bandada1'}];
export const CUBE_HALOS=[{id:'soft',name:'Suave'},{id:'close',name:'Cercano',ach:'quietud5'},{id:'pulse',name:'Pulso',ach:'tiempo'}];
export function cosmeticUnlocked(item,ach){return !item.ach||!!ach?.[item.ach];}
export function normalizeCube(raw,ach={}){return {version:1,color:typeof raw?.color==='string'?raw.color:'#ffffff',trail:CUBE_TRAILS.some(t=>t.id===raw?.trail&&cosmeticUnlocked(t,ach))?raw.trail:'none',halo:CUBE_HALOS.some(t=>t.id===raw?.halo&&cosmeticUnlocked(t,ach))?raw.halo:'soft'};}
