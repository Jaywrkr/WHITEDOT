import {familyHabitat} from './world-families.js';
const pools=new WeakMap(),clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
// Smooth colonies span chunk boundaries. Only new independent visual hashes are read.
export function ecosystemAt(f,x,y,seedOf){
 if(!f)return {niche:'corridor',weight:.55,angle:0};
 let cache=pools.get(seedOf);if(!cache){cache=new Map();pools.set(seedOf,cache);}const size=900,cx=Math.floor(x/size),cy=Math.floor(y/size);let cloud=0,angle=f.angle;
 for(let a=cx-1;a<=cx+1;a++)for(let b=cy-1;b<=cy+1;b++){
  const key=f.seed+':'+a+','+b;let p=cache.get(key);if(!p){const h=seedOf('ecosystem:colony:v1:'+key)>>>0;p={x:(a+.2+(h%600)/1000)*size,y:(b+.2+((h>>>10)%600)/1000)*size,radius:170+(h>>>20)%170,angle:(h%628)/100};cache.set(key,p);if(cache.size>160)cache.delete(cache.keys().next().value);}
  const d=Math.hypot(x-p.x,y-p.y),value=Math.exp(-d*d/(2*p.radius*p.radius));if(value>cloud){cloud=value;angle=p.angle;}
 }
 const weight=clamp(.1+.9*cloud*(.5+.5*familyHabitat(f,x,y)));
 return {weight,niche:weight<.2?'clearing':weight<.43?'corridor':weight>.7?'colony':'refuge',angle};
}
const caps={grass:70,plants:24,sp:14,flies:12,walkers:4,props:12,crystals:16,pillars:12,playthings:9};
export const protectedInhabitant=o=>!!(o.rare||o.s?.rare||o.id?.startsWith?.('nursery:')||o.done||o.given||o.follow>0);
export function ecosystemField(items,field,chunkId,profile,seedOf){
 if(!caps[field]||!Array.isArray(items)||items.length<3)return items;
 const f=profile.family,retained=[],candidates=[];
 for(let i=0;i<items.length;i++){
  const o=items[i];if(protectedInhabitant(o)){retained.push(o);continue;}
  const point=ecosystemAt(f,o.hx??o.x,o.hy??o.y,seedOf),dominant=field==='sp'?o.s?.id===profile.animal:field==='plants'?o.pt?.t===profile.plant:true,
   density=clamp(.6+profile.density*.4,.65,1.1),base=field==='grass'?.12:field==='sp'?.23:.2,
   probability=clamp((base+point.weight*.65)*(dominant?1:.55)*density*(f?.quiet?.4:1),.04,.95),
   lottery=(seedOf(`ecosystem:presence:v1:${chunkId}:${field}:${i}`)>>>0)/4294967296;
  candidates.push({o,eligible:lottery<probability,score:point.weight+(dominant?.25:0)-lottery*.2});
 }
 const selected=candidates.filter(v=>v.eligible).sort((a,b)=>b.score-a.score).slice(0,caps[field]);
 // A populated chunk keeps a native representative; empty chunks stay empty.
 if(!selected.length&&!retained.length&&field==='sp'&&candidates.length)selected.push(candidates.sort((a,b)=>b.score-a.score)[0]);
 return [...retained,...selected.map(v=>v.o)];
}
