// The festival build (docs/VIAJE.md): the whole Journey, Camino to the Refugio's finale, as a closed arc (plan I5; it
// ended after the Lago before).
// Opened with ?festival=1. It plays in the Journey, without an account, on its own local save, so it never touches
// a player's game; it ends in the Refugio with your phrase, and «Otra persona» starts again for the next player.
export const FESTIVAL_KEY='kubono:festival';
export const FESTIVAL_CHAPTERS=Object.freeze(['llanura','lago','bosque','tormenta','vacio']);
export function isFestival(search=globalThis.location?.search){try{return new URLSearchParams(search||'').get('festival')==='1';}catch(_){return false;}}
export function initialize(runtime){
 const on=isFestival();
 if(on)document.body.classList.add('festival');
 // Starts again for the next player: only the festival's own save is cleared.
 function restart(){try{globalThis.localStorage?.removeItem(FESTIVAL_KEY);}catch(_){}location.reload();}
 Object.defineProperties(runtime,{festival:{get:()=>on},festivalRestart:{get:()=>restart}});
}
