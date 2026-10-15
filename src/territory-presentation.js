// Presentation only: keeps every source, collectible and native map coordinate.
const caches=new WeakMap(),smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
export function decorativeField(x,y,seedOf){
 const size=2400,cx=Math.floor(x/size),cy=Math.floor(y/size),fx=smooth(x/size-cx),fy=smooth(y/size-cy);
 let state=caches.get(seedOf);if(!state){state={points:new Map(),last:null};caches.set(seedOf,state);}const cache=state.points;
 const value=(a,b)=>{const key=a+','+b;if(!cache.has(key)){cache.set(key,(seedOf('decoration:clearings:v1:'+key)>>>0)/4294967296);if(cache.size>64)cache.delete(cache.keys().next().value);}return cache.get(key);};
 let cell=state.last;if(!cell||cell.x!==cx||cell.y!==cy){cell={x:cx,y:cy,a:value(cx,cy),b:value(cx+1,cy),c:value(cx,cy+1),d:value(cx+1,cy+1)};state.last=cell;}
 const top=cell.a*(1-fx)+cell.b*fx,bottom=cell.c*(1-fx)+cell.d*fx;
 return smooth((top*(1-fy)+bottom*fy-.5)/.3)*.7;
}
export function territorialOrchestra(region,primary,secondary,seedOf){
 const pair=String(region.key).match(/(-?\d+),(-?\d+)$/),zone=pair?`${Math.floor(Number(pair[1])/2)},${Math.floor(Number(pair[2])/2)}`:region.key,
  seed=seedOf('territory:orchestra:v1:'+zone+':'+region.genre),native=[...new Set(primary)],guest=[...new Set(secondary)].filter(id=>!native.includes(id));
 return Object.freeze({zone,primary:Object.freeze(native),secondary:Object.freeze(guest),every:3+seed%2,offset:(seed>>>8)%4});
}
export function territoryInstrument(orchestra,window,chapter){
 if(orchestra.secondary.length&&(window+orchestra.offset)%orchestra.every===orchestra.every-1)return orchestra.secondary[(Math.floor(window/orchestra.every)+orchestra.offset)%orchestra.secondary.length];
 return orchestra.primary[(chapter+orchestra.offset)%orchestra.primary.length];
}
export function blendProductionSpace(a,b,weight){
 const w=Math.max(0,Math.min(1,Number.isFinite(weight)?weight:0));
 return Object.fromEntries(['room','space','echo','feedback'].map(key=>[key,a[key]*(1-w)+b[key]*w]));
}
