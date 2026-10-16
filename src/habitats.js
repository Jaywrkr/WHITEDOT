import {ecosystemAt} from './ecosystem-field.js';
// A distant habitat has an analytic clock: no background simulation or new placement draws.
export function habitatAt(region,x,y,seedOf){
 const seed=seedOf(`habitat:v1:${region.key}:${Math.floor(x/240)},${Math.floor(y/240)}`),place=ecosystemAt(region.worldFamily,x,y,seedOf),weight=place.weight,
  humidity=region.ecology?.climate.humidity??(.2+(seed%60)/100),fertility=region.ecology?.climate.fertility??((seed>>>8)%100)/100;
 const niche=region.sea?'coast':place.niche;
 return Object.freeze({version:1,niche,humidity,fertility,angle:(seed%628)/100,
  phase:seed%4,visitor:(seed>>>8)%5===0,guild:['pollinator','grazer','shoal','collector','sentinel'][(seed>>>12)%5]});
}
export function habitatIntent(o,player,clock,neighbors){
 const h=o.habitat,p=o.mind;if(!h||!p)return null;
 if(o.group!=='fauna')return h.humidity<.35&&p.lightPreference>.65?'retract':null;
 if(o.ecology?.humidity>.85&&p.caution>.5)return 'shelter';
 if(h.niche==='coast'&&o.ecology?.tide>.8)return 'shelter';
 if(o.awake<.5&&o.energy<.2)return 'rest';
 if(['pollinator','grazer','collector'].includes(h.guild)){
  const plant=neighbors.find(n=>n!==o&&n.group==='flora'&&Math.hypot(n.x-o.x,n.y-o.y)<140);
  if(plant&&p.musicInterest>.45&&Math.floor(clock/12+h.phase)%3!==2)return 'forage';
 }
 if((h.niche==='corridor'||h.visitor)&&o.ecology?.migration&&p.caution<.65)return 'migrate';
 if((h.niche==='colony'||h.guild==='shoal')&&p.sociability>.4&&neighbors.some(n=>n!==o&&n.kind===o.kind&&Math.hypot(n.x-o.x,n.y-o.y)<140))return 'cooperate';
 if(h.guild==='sentinel'&&Math.hypot(o.x-player.x,o.y-player.y)<150&&player.speed<55)return 'observe';
 return null;
}
export function spatialNeighbors(points,cell=120){
 const cells=new Map();for(const p of points){const key=Math.floor(p.x/cell)+','+Math.floor(p.y/cell);if(!cells.has(key))cells.set(key,[]);cells.get(key).push(p);}
 return (o,limit=12)=>{const x=Math.floor(o.x/cell),y=Math.floor(o.y/cell),out=[];
  for(let i=x-1;i<=x+1;i++)for(let j=y-1;j<=y+1;j++)for(const p of cells.get(i+','+j)||[])if(p!==o&&Math.hypot(o.x-p.x,o.y-p.y)<140)out.push(p);
  return out.sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y)).slice(0,limit);
 };
}
