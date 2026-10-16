import {ecosystemAt} from './ecosystem-field.js';
import {interactionInstruments,expressiveBassInstruments} from './musical-character.js';

export const PIXEL_CELL=280;
export const PIXEL_ACTIVITIES=Object.freeze(['curioso','esquivo','orbital','saltarín','serpenteante','danzante','centinela','dormilón','recolector','escolta','explorador','enjambre']);
const TAU=Math.PI*2,unit=h=>(h>>>0)/4294967296;
const stir=value=>{let h=value>>>0;h=Math.imul(h^(h>>>16),0x7feb352d);h=Math.imul(h^(h>>>15),0x846ca68b);return (h^(h>>>16))>>>0;};
// Independent genes: the original terrain/species RNG and saved ownership are untouched.
export function pixelGenome(id,seedOf){
 const a=stir(seedOf('inhabitants:body:v1:'+id)),b=stir(seedOf('inhabitants:mind:v1:'+id));
 return {body:a%8,crown:(a>>>3)%8,eyes:(a>>>6)%4,feet:(a>>>8)%4,mark:(a>>>10)%8,
  activity:PIXEL_ACTIVITIES[b%12],phase:unit(a)*TAU,speed:8+(b>>>5)%22,period:2+(b>>>12)%7,
  role:['perc','bajo','lead','acorde'][(b>>>16)%4],degree:(b>>>20)%7,variant:(a>>>14)%256};
}
export function pixelGeometry(g){
 const pixels=new Set(),put=(x,y)=>pixels.add(x+','+y);
 // Eight distinct cores, crowns, eye gaps, feet and small individual markings.
 for(let y=-2;y<=2;y++)for(let x=-3;x<=3;x++){
  const inside=[Math.abs(x)+Math.abs(y)<4,x*x+y*y<10,Math.abs(x)<=2,Math.abs(x)<3-Math.floor((y+2)/2),Math.abs(x)<=Math.abs(y)+1,Math.abs(x)+Math.abs(y)<4&&y!==0,Math.abs(x)<3&&y!==1,Math.abs(x)<3&&!(Math.abs(x)===2&&y===0)][g.body];
  if(inside&&!(y===-1&&(g.eyes===0?x===0:g.eyes===1?Math.abs(x)===1:g.eyes===2?x===-1:x===1)))put(x,y);
 }
 for(let i=0;i<3;i++)if(g.crown>>i&1){put((i-1)*2,-3);put((i-1)*2,-4);}
 for(let i=0;i<2;i++){const x=(i?1:-1)*(1+g.feet%2);put(x,3);if(g.feet>=2)put(x+(i?1:-1),3);}
 for(let i=0;i<3;i++)if(g.mark>>i&1)put(i-1,4);
 return [...pixels].map(p=>p.split(',').map(Number));
}
export function pixelColony(cx,cy,region,seedOf){
 if(region.sea)return [];
 const size=PIXEL_CELL,h=seedOf(`inhabitants:colony:v1:${cx},${cy}`)>>>0,
  field=ecosystemAt(region.worldFamily,(cx+.5)*size,(cy+.5)*size,seedOf),quiet=region.worldFamily?.quiet,
  count=quiet?(h%5===0?1:0):field.niche==='clearing'?(h%3===0?1:0):1+(h%3),out=[];
 const regional=stir(seedOf('inhabitants:kin:v1:'+region.key));
 for(let i=0;i<count;i++){
  const id=`inhabitant:${cx},${cy}:${i}`,a=seedOf(id+':place')>>>0,genome=pixelGenome(id,seedOf);
  // Relatives share a regional core and a dominant activity, with individual exceptions.
  if((a>>>17)%4)genome.body=regional%8;if((a>>>4)%3)genome.activity=PIXEL_ACTIVITIES[(regional>>>5)%12];
  const x=(cx+.18+unit(a)*.64)*size,y=(cy+.18+unit(seedOf(id+':y'))*.64)*size;
  out.push({id,x,y,hx:x,hy:y,genome,lit:0,kind:'habitante'});
 }return out;
}
export function inhabitantTarget(o,player,seconds){
 const g=o.genome,p=seconds/g.period+g.phase,dx=o.hx-player.x,dy=o.hy-player.y,d=Math.hypot(dx,dy)||1;
 let x=o.hx+Math.cos(p)*22,y=o.hy+Math.sin(p*.8)*16,pose=0,rotation=0;
 switch(g.activity){
 case 'curioso':if(d<170){x=player.x+dx/d*38;y=player.y+dy/d*38;}break;
 case 'esquivo':if(d<130){x=o.hx+dx/d*72;y=o.hy+dy/d*72;}break;
 case 'orbital':x=o.hx+Math.cos(p)*48;y=o.hy+Math.sin(p)*48;rotation=Math.sin(p)*.2;break;
 case 'saltarín':x=o.hx+Math.sin(p)*32;pose=-Math.abs(Math.sin(p*3))*13;break;
 case 'serpenteante':x=o.hx+Math.sin(p*.5)*60;y=o.hy+Math.sin(p*3)*22;rotation=Math.cos(p*3)*.15;break;
 case 'danzante':x=o.hx+Math.sin(p*2)*14;y=o.hy+Math.cos(p*2)*7;rotation=Math.sin(p*3)*.3;break;
 case 'centinela':x=o.hx;y=o.hy;rotation=Math.sin(p*.5)*.18;break;
 case 'dormilón':{const awake=Math.sin(p*.4)>.4;x=o.hx+(awake?Math.sin(p)*20:0);y=o.hy;pose=awake?0:2;break;}
 case 'recolector':{const stop=Math.floor(p)%4;x=o.hx+[-32,25,40,-20][((stop%4)+4)%4];y=o.hy+Math.sin(stop*2)*24;break;}
 case 'escolta':if(d<170){x=player.x+dx/d*64;y=player.y+dy/d*64;}break;
 case 'explorador':x=o.hx+Math.sin(p*.5)*80;y=o.hy+Math.sin(p*.8)*60;break;
 case 'enjambre':x=o.hx+Math.cos(p*1.8)*38;y=o.hy+Math.sin(p*2.4)*28;break;
 }return {x,y,pose,rotation};
}
export function moveInhabitant(o,player,seconds,dt,reduced=false){
 if(reduced)return o;const target=inhabitantTarget(o,player,seconds),dx=target.x-o.x,dy=target.y-o.y,d=Math.hypot(dx,dy)||1,
  travel=Math.min(d,Math.max(0,Math.min(.05,dt))*o.genome.speed*2);
 o.x+=dx/d*travel;o.y+=dy/d*travel;o.pose=target.pose;o.rotation=target.rotation;return o;
}
// Two analytic migration streams. Inverse lookup keeps only the visible neighborhood.
export function migratingBeings(x,y,seconds,seedOf,reach=500,reduced=false){
 const out=[],cell=1000,t=reduced?0:seconds;
 for(let stream=0;stream<2;stream++){
  const h=seedOf('inhabitants:migration:v1:'+stream)>>>0,angle=unit(h)*TAU,vx=Math.cos(angle)*(14+stream*7),vy=Math.sin(angle)*(14+stream*7),
   cx=Math.floor((x-vx*t)/cell),cy=Math.floor((y-vy*t)/cell);
  for(let a=cx-1;a<=cx+1;a++)for(let b=cy-1;b<=cy+1;b++){
   const id=`traveller:${stream}:${a},${b}`,h=seedOf(id)>>>0;if(h%4===0)continue;
   const px=(a+.12+unit(h)*.76)*cell+vx*t,py=(b+.12+unit(seedOf(id+':y'))*.76)*cell+vy*t;
   if(Math.hypot(px-x,py-y)>reach)continue;
   out.push({id,kind:'viajero',x:px,y:py,hx:px,hy:py,vx,vy,genome:pixelGenome(id,seedOf),lit:0});
  }
 }return out.slice(0,6);
}
export function inhabitantVoice(source,region,genres){
 const g=source.genome,role=g.role,definition=genres[region.genre],
  pool=role==='bajo'?expressiveBassInstruments(region.genre,definition):role==='perc'?(definition.percP||['wood','tom','conga','shaker']):interactionInstruments(region.genre,definition,role);
 return {role,instrument:pool[g.variant%pool.length],degree:g.degree,response:4,low:role==='bajo'?36:45,high:role==='bajo'?54:69};
}
export function inhabitantPractice(runtime,kind='colony'){
 const size=kind==='traveller'?1000:PIXEL_CELL;
 for(let ring=0;ring<=20;ring++)for(let a=-ring;a<=ring;a++)for(let b=-ring;b<=ring;b++){
  if(Math.max(Math.abs(a),Math.abs(b))!==ring)continue;
  const d=runtime.regionOfPos((a+.5)*size,(b+.5)*size);if(d.sea)continue;
  const objects=kind==='traveller'?migratingBeings((a+.5)*size,(b+.5)*size,runtime.inhabitantState?.travelSeconds||0,runtime.seedOf,450):pixelColony(a,b,d,runtime.seedOf);
  const o=objects.find(o=>!runtime.regionOfPos(o.x,o.y).sea);if(o)return {x:o.x,y:o.y,id:o.id};
 }return null;
}
