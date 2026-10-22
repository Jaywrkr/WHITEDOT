// Colours for colour blindness: an option in Ajustes. The places and chapters of the Journey take hues from the
// Okabe–Ito palette, told apart by people with red–green and blue–yellow colour blindness. White still marks states
// and gold what is earned.
export const SAFE_COLORS=Object.freeze({llanura:'#e69f00',lago:'#56b4e9',bosque:'#2fbf8f',tormenta:'#cc79a7',vacio:'#ffffff',refugio:'#f0d27a',
 ruinas:'#f0e442',jardin:'#ff9ad0',dunas:'#e69f00',cristales:'#56b4e9',faros:'#f0e442',cueva:'#d55e00'});
export const placeColor=(id,base,safe)=>safe&&Object.hasOwn(SAFE_COLORS,id)?SAFE_COLORS[id]:base;
export function initialize(runtime){
 const box=runtime.$('colorSafe');
 if(box)box.onchange=e=>{const before=runtime.S.colorSafe;runtime.S.colorSafe=e.target.checked;if(runtime.save()===false){runtime.S.colorSafe=before;e.target.checked=!!before;}};
 Object.defineProperties(runtime,{colorSafe:{get:()=>()=>!!runtime.S.colorSafe},placeColor:{get:()=>(id,base)=>placeColor(id,base,!!runtime.S.colorSafe)}});
}
