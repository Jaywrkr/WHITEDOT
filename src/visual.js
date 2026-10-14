// Shared hierarchy: black space, local colored ink, gold audio response, white player.
export const WORLD_VISUAL=Object.freeze({background:'#000',line:1.2,maxElementAlpha:.88,gold:'#f0d27a',echo:'#9fe8ff'});
// Paleta viva: 36 muestras (una cada 10° del tono de un lugar). Reparte rojos, naranjas, rosas, blancos,
// cianes, violetas y verdes; el amarillo queda como una muestra más. Solo cambia cómo se pinta: los datos
// del lugar (tono, recetas, guardado) no cambian.
export const SWATCHES=Object.freeze([
 [350,78,58],[5,85,58],[12,90,64],[18,92,60],[28,95,58],[36,95,60],[44,88,60],[40,10,90],[56,85,62],
 [80,70,58],[110,55,56],[200,8,92],[150,65,52],[160,60,68],[175,70,48],[185,80,60],[192,90,58],[210,12,80],
 [205,85,66],[215,85,60],[225,80,62],[240,70,68],[50,20,92],[262,75,68],[275,70,62],[290,65,68],[305,80,62],
 [315,85,62],[325,90,66],[0,0,96],[335,80,70],[345,75,76],[8,80,72],[22,85,74],[355,85,50],[260,25,88]
]);
export const swatchOf=hue=>SWATCHES[Math.floor((((hue%360)+360)%360)/10)%36];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// Lleva un color hsl(...) del mundo a la paleta viva conservando su intención (más pálido/oscuro, alfa).
export function vividHSL(h,s,l){
 const [H,S,L]=swatchOf(h);
 if(S<20)return [H,S,clamp(Math.max(l,L-8),0,98)];                       // blancos: perla, nieve, marfil
 return [H,clamp(Math.round(s*S/48),0,100),clamp(Math.round(l+(L-62)*.6),18,90)];
}
const HSL=/^hsla?\(\s*(-?[\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)$/;
const cache=new Map();
export function vividColor(value){
 if(typeof value!=='string'||value.charCodeAt(0)!==104)return value;     // solo cadenas hsl/hsla
 let out=cache.get(value);if(out)return out;
 const m=HSL.exec(value);if(!m)return value;
 const [H,S,L]=vividHSL(+m[1],+m[2],+m[3]);out=m[4]===undefined?`hsl(${H},${S}%,${L}%)`:`hsla(${H},${S}%,${L}%,${m[4]})`;
 cache.set(value,out);if(cache.size>4000)cache.delete(cache.keys().next().value);return out;
}
// Aplica la paleta viva a un contexto 2D: colores de trazo, relleno y degradados pasan por vividColor.
export function installVivid(ctx){
 if(!ctx||ctx.__vivid)return ctx;ctx.__vivid=true;
 const proto=Object.getPrototypeOf(ctx);
 for(const key of ['fillStyle','strokeStyle','shadowColor']){const d=Object.getOwnPropertyDescriptor(proto,key);if(!d?.set)continue;
  Object.defineProperty(ctx,key,{configurable:true,get(){return d.get.call(this);},set(v){d.set.call(this,vividColor(v));}});}
 for(const fn of ['createRadialGradient','createLinearGradient']){const orig=proto[fn];if(!orig)continue;
  ctx[fn]=function(...args){const g=orig.apply(this,args),add=g.addColorStop.bind(g);g.addColorStop=(o,c)=>add(o,vividColor(c));return g;};}
 return ctx;
}
export function elementInk(material,hue=190,active=false){
 if(active)return WORLD_VISUAL.gold;
 const saturation={wood:38,glass:65,metal:42,air:28}[material]||42;
 return `hsl(${((hue%360)+360)%360},${saturation}%,68%)`;
}
export function elementAlpha(distance,radius,activity=0){return Math.max(0,Math.min(WORLD_VISUAL.maxElementAlpha,(1-distance/(radius*1.3))*.7+activity*.5));}
export function jamHudTop(height,panelTop=null,notice=false){return Math.max(120,Math.min(height-140,panelTop==null?height-140:panelTop-44)-(notice?34:0));}

// Decorative light is local; collision handles and persisted world coordinates stay intact.
export function localGlowRadius(width,height,requested){
 const shortest=Math.min(Number.isFinite(width)?width:390,Number.isFinite(height)?height:844);
 return Math.max(8,Math.min(requested,shortest*.18,72));
}
