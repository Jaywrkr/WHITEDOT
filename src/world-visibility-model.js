const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function smoothRange(a,b,v){const k=clamp((v-a)/(b-a||1),0,1);return k*k*(3-2*k);}
export function distanceOpacity(distance,radius){if(!Number.isFinite(distance)||!Number.isFinite(radius)||radius<=0)return 0;return 1-smoothRange(radius*.62,radius,Math.max(0,distance));}
export function detailBlend(distance,quality=1){const q=clamp(quality,0,1);return 1-smoothRange(260+160*q,420+200*q,distance);}
export function deviceDetail({memory=4,cores=4}={}){return memory<=2||cores<=2?0:memory>=8&&cores>=8?2:1;}
export const DEPTH_PLANES=Object.freeze([.08,.28,1]);
export function fogTarget({biome='llanura',storm=0,air='claro',seconds=0,phaseOffset=0,lamp=1,layer='superficie',width=390,height=844,tint=[150,185,225]}={}){
 const day=(1+Math.cos((seconds/600+phaseOffset/4-.25)*Math.PI*2))/2;
 const mist=air==='niebla'?1:biome==='bosque'||biome==='lago'?.35:biome==='cueva'?1:0;
 const density=clamp(.13+mist*.12+storm*.2+(1-day)*.14+(layer==='bajo'?.1:0),.08,.65);
 const extent=clamp(Math.hypot(width,height)*.72,400,850);
 const radius=extent*(1-density*.23)*(.88+.12*clamp(lamp,0,1));
 return {radius,density,day,wet:clamp(storm,0,1),lamp:clamp(lamp,0,1),red:clamp(tint[0],0,255),green:clamp(tint[1],0,255),blue:clamp(tint[2],0,255)};
}
export function blendFog(previous,target,seconds){if(!previous)return {...target};const mix=1-Math.exp(-clamp(seconds,0,.1)*1.2);return Object.fromEntries(Object.keys(target).map(k=>[k,previous[k]+(target[k]-previous[k])*mix]));}
export function preloadCells(x,y,size,width,height,margin=size){
 const out=[],hx=Math.min(850,width/2)+margin,hy=Math.min(850,height/2)+margin;
 for(let a=Math.floor((x-hx)/size);a<=Math.floor((x+hx)/size);a++)for(let b=Math.floor((y-hy)/size);b<=Math.floor((y+hy)/size);b++)out.push([a,b]);
 return out.sort((a,b)=>Math.hypot((a[0]+.5)*size-x,(a[1]+.5)*size-y)-Math.hypot((b[0]+.5)*size-x,(b[1]+.5)*size-y));
}
// Visual namespace only; this hash never consumes map/music RNG streams.
export function visualHash(x,y,seed=0){let h=Math.imul(x^seed,374761393)^Math.imul(y,668265263);h=Math.imul(h^h>>>13,1274126177);return ((h^h>>>16)>>>0)/4294967296;}
export function planePoint(x,y,cameraX,cameraY,width,height,plane){return {x:width/2+(x-cameraX)*plane,y:height/2+(y-cameraY)*plane};}
