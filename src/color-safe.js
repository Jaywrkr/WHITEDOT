import {LANDSCAPES} from './house-view.js';
// Colours for colour blindness: an option in Ajustes. The places and chapters of the Journey take hues from the
// Okabe–Ito palette, told apart by people with red–green and blue–yellow colour blindness. White still marks states
// and gold what is earned. Panel 10 (P7, Roset): no two places share a colour; the three that did (Dunas, Cristales,
// Ruinas) take an ochre, a pale green and a slate blue chosen to stay apart in simulated deuteranopia, protanopia and
// tritanopia (tests/color-earned.mjs).
export const SAFE_COLORS=Object.freeze({llanura:'#e69f00',lago:'#56b4e9',bosque:'#2fbf8f',tormenta:'#cc79a7',vacio:'#ffffff',refugio:'#f0d27a',
 ruinas:'#5577cc',jardin:'#ff9ad0',dunas:'#aa9955',cristales:'#bbffbb',faros:'#f0e442',cueva:'#d55e00'});
export const placeColor=(id,base,safe)=>safe&&Object.hasOwn(SAFE_COLORS,id)?SAFE_COLORS[id]:base;
// D4 (panel 10, P7): a place once complete shows its own colour on its portal, its chapter mark, the map and the
// Refugio; gold stays for the stars. White for anything else.
export const earnedColor=(id,safe)=>Object.hasOwn(LANDSCAPES,id)?placeColor(id,LANDSCAPES[id],safe):'#ffffff';
export function initialize(runtime){
 const box=runtime.$('colorSafe');
 if(box)box.onchange=e=>{const before=runtime.S.colorSafe;runtime.S.colorSafe=e.target.checked;if(runtime.save()===false){runtime.S.colorSafe=before;e.target.checked=!!before;}};
 Object.defineProperties(runtime,{colorSafe:{get:()=>()=>!!runtime.S.colorSafe},placeColor:{get:()=>(id,base)=>placeColor(id,base,!!runtime.S.colorSafe)},earnedColor:{get:()=>id=>earnedColor(id,!!runtime.S.colorSafe)}});
}
