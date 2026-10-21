// Independent sites and bounded local scenes. No legacy RNG, physics or mining mutation.
export const MISCHIEF_CELL=1800,MISCHIEF_RATE=.12;
export const MISCHIEF=Object.freeze([
 ['helper','El cristal que pide ayuda'],['imitator','La criatura que te imita mal'],['rain','La lluvia que cae hacia arriba'],['shadow','El ladrón de sombras'],['audience','El público escondido'],['dance','La escultura que quiere bailar'],['race','La carrera que nadie anunció'],['breath','El paisaje contiene la respiración'],['twin','Los fragmentos que intentan construirte'],['farewell','La despedida que se contagia']
].map(([id,name],index)=>Object.freeze({id,name,index})));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),toward=(a,b,speed,dt)=>{const d=distance(a,b);if(d){const k=Math.min(1,speed*dt/d);a.x+=(b.x-a.x)*k;a.y+=(b.y-a.y)*k;}};
const stir=value=>{let h=value>>>0;h=Math.imul(h^(h>>>16),0x7feb352d);h=Math.imul(h^(h>>>15),0x846ca68b);return (h^(h>>>16))>>>0;};
export function mischiefCell(x,y,seedOf,layer='superficie'){
 const h=stir(seedOf('mischief:place:v1:'+layer+':'+x+','+y));if(h/4294967296>=MISCHIEF_RATE)return [];
 const k=stir(seedOf('mischief:kind:v1:'+layer+':'+x+','+y)),kind=MISCHIEF[k%10].id;
 if(layer!=='superficie'&&['helper','dance'].includes(kind))return [];
 return [{id:'mischief:v1:'+layer+':'+x+','+y,kind,x:(x+.25+(k>>>8)%500/1000)*MISCHIEF_CELL,y:(y+.25+(k>>>17)%500/1000)*MISCHIEF_CELL,seed:k}];
}
export function normalizeMischief(raw){
 if(Number.isInteger(raw?.version)&&raw.version>1)return raw;
 const valid=k=>typeof k==='string'&&k.length<160&&!['__proto__','constructor','prototype'].includes(k),record=v=>Object.fromEntries(Object.entries(v&&typeof v==='object'&&!Array.isArray(v)?v:{}).filter(([k])=>valid(k)).slice(0,4096));
 return {...raw,version:1,done:record(raw?.done),counts:record(raw?.counts),tricks:record(raw?.tricks),sculptures:record(raw?.sculptures)};
}
export function createMischief(site,player){
 const s={...site,age:0,stage:0,progress:0,turns:0,angle:null,circle:0,still:0,walk:0,last:{...player},actor:{x:site.x,y:site.y},trail:[{...player}],collected:[],clues:[],flags:[],notes:[],done:false,paid:false,rank:'',relay:0,release:0};
 // The shadow's clues sit far apart so following it is a real chase; other scenes keep their close ring.
 const ring=site.kind==='shadow'?160:55;s.drops=Array.from({length:8},(_,i)=>({x:site.x+Math.cos(i*Math.PI/4)*ring,y:site.y+Math.sin(i*Math.PI/4)*ring,rise:0}));
 s.followers=Array.from({length:6},(_,i)=>({x:site.x+(i-2)*13,y:site.y+24}));
 // The race finish lies 300 to 380 u beyond the site, away from where the player came from: you must turn and run.
 if(site.goal)s.goal=site.goal;else if(site.kind==='race'){const dx=site.x-player.x,dy=site.y-player.y,l=Math.hypot(dx,dy)||1,far=300+(site.seed>>>3)%81;s.goal={x:site.x+(l>1?dx/l:1)*far,y:site.y+(l>1?dy/l:0)*far};}else s.goal={x:site.x+130,y:site.y};
 return s;
}
export function stepMischief(s,player,dt,{broken=false,reduced=false,totem=null}={}){
 dt=Math.max(0,Math.min(.05,dt||0));if(s.done)return s;const d=distance(player,s),walk=distance(player,s.last),moving=walk>.15&&walk<30;
 s.age+=dt;s.walk+=moving?walk:0;s.still=moving?0:s.still+dt;
 if(moving){const a=Math.atan2(player.y-s.last.y,player.x-s.last.x);if(s.heading!==undefined&&Math.abs(Math.atan2(Math.sin(a-s.heading),Math.cos(a-s.heading)))>.9)s.turns++;s.heading=a;s.trail.push({...player});if(s.trail.length>36)s.trail.shift();}
 const note=i=>{if(s.notes.length<8)s.notes.push(i);},finish=flag=>{s.done=true;if(flag&&!s.flags.includes(flag))s.flags.push(flag);note(6);};
 switch(s.kind){
 case 'helper':
  if(!s.target)break;
  if(s.stage===0&&distance(player,s.actor)<45){s.stage=1;note(0);}
  if(s.stage===1){toward(s.actor,s.target,55,dt);if(distance(s.actor,s.target)<35)s.stage=2;}
  if(s.stage===2&&distance(player,s.target)<140){const d=distance(player,s.target)||1;toward(s.actor,{x:player.x+(player.x-s.target.x)/d*24,y:player.y+(player.y-s.target.y)/d*24},100,dt);}if(s.stage===2&&broken){finish('stoneLawyer');}break;
 case 'imitator':{
  if(s.stage===0&&d<60){s.stage=1;note(0);}
  if(s.stage===1){const delayed=s.trail[Math.max(0,s.trail.length-12)]||player,target={x:delayed.x+30,y:delayed.y+15};toward(s.actor,target,reduced?90:145,dt);s.wobble=moving?Math.sin(s.age*7)*.5:Math.sin(s.age*4)*Math.exp(-s.still*2);if(s.walk>110&&s.turns>=2&&s.still>.8){finish(s.turns>=3?'badChoreographer':null);}}
  break;}
 case 'rain':
  // Drops really rise and fall back, so they have to be caught at the right height.
  for(let i=0;i<s.drops.length;i++){const q=s.drops[i];if(s.collected.includes(i))continue;if(!reduced){q.rise=(q.rise||0)+dt*18;if(q.rise>32)q.rise=0;}if(distance(player,{x:q.x,y:q.y-(q.rise||0)})<24){s.collected.push(i);note(i%6);}}
  if(s.collected.length===8)finish('upsideDownWeather');break;
 case 'shadow':
  if(s.stage===0&&d<45){s.stage=1;note(0);}
  if(s.stage===1){const target=s.drops[(s.seed>>>5)%8];toward(s.actor,target,120,dt);if(distance(s.actor,target)<5)s.stage=2;}
  // Clues are found in order: only the next one counts (and only the next one is drawn).
  if(s.stage===2){const i=s.clues.length;if(i<3&&distance(player,s.drops[i*2])<25){s.clues.push(i);note(i);}if(s.clues.length===3&&distance(player,s.actor)<28)finish('shadowDetective');}break;
 case 'audience':
  if(s.stage===0&&d<75&&s.still>2){s.stage=1;s.watchers=3;note(0);}
  if(s.stage===1){s.watchers=Math.min(6,3+Math.floor(s.age/3));if(s.still>5)s.awkward=true;if(s.walk>90&&moving){s.stage=2;s.procession=0;note(2);}}
  if(s.stage===2){for(const [i,o]of s.followers.entries()){const orbit=(s.orbit||0)>Math.PI&&s.turns>=2,a=(reduced?0:s.age*.8)+i*Math.PI/3,target=orbit?{x:player.x+Math.cos(a)*(35+i*3),y:player.y+Math.sin(a)*(35+i*3)}:s.trail[Math.max(0,s.trail.length-1-(i+1)*4)]||player;toward(o,target,95,dt);if(orbit&&!s.orbitNote){note(3);s.orbitNote=true;}}s.procession+=moving?walk:0;const a=Math.atan2(player.y-s.y,player.x-s.x);if(s.lastOrbit!==undefined)s.orbit=(s.orbit||0)+Math.abs(Math.atan2(Math.sin(a-s.lastOrbit),Math.cos(a-s.lastOrbit)));s.lastOrbit=a;if(totem&&distance(player,totem)<100){s.stage=3;s.festival=true;s.stageAge=0;note(4);}else if(s.procession>220&&s.still>1){s.stage=3;s.stageAge=0;note(4);}}
  if(s.stage===3){s.stageAge+=dt;if(s.stageAge>2)finish(s.festival?'festivalManager':s.awkward?'awkwardSilence':null);}break;
 case 'dance':{
  const center=s.target||s,a=Math.atan2(player.y-center.y,player.x-center.x),r=distance(player,center);if(r>28&&r<115){if(s.angle!==null){const delta=Math.atan2(Math.sin(a-s.angle),Math.cos(a-s.angle));if(Math.abs(delta)<.4)s.circle+=delta;}s.angle=a;s.progress=Math.max(s.progress,Math.abs(s.circle));}else s.angle=null;
  if(s.progress>Math.PI*1.8){s.stage=1;s.danceTime=(s.danceTime||0)+dt;if(s.danceTime>2)finish(s.circle>0?'leftFeet':null);}break;}
 case 'race':
  // Countdown 3·2·1 on the scene's own notes, then a rival that can really win.
  if(s.stage===0&&d<45){s.stage=1;s.count=0;note(0);}
  if(s.stage===1){const before=Math.floor(s.count);s.count+=dt;if(Math.floor(s.count)>before&&s.count<3)note(Math.floor(s.count));if(s.count>=3){s.stage=2;s.raceTime=0;}}
  if(s.stage===2){s.raceTime+=dt;toward(s.actor,s.goal,reduced?110:150,dt);if(distance(s.actor,s.goal)<8&&!s.rank)s.rank='second';if(distance(player,s.goal)<25){if(!s.rank)s.rank='first';finish(s.rank==='second'?'politeLoser':null);}}break;
 case 'breath':
  if(s.stage===0&&d<70){s.stage=1;s.held=0;note(0);}
  if(s.stage===1){s.held+=dt;if(d>110){s.stage=2;s.release=0;note(3);}}
  if(s.stage===2){s.release+=dt;if(s.release>1.2)finish(s.held>=8?'heldLaughter':null);}break;
 case 'twin':
  if(s.stage===0&&d<70){s.stage=1;s.stageAge=0;note(0);}
  if(s.stage===1){s.stageAge+=dt;if(s.stageAge>1.5){s.stage=2;s.stageAge=0;}}
  if(s.stage===2){toward(s.actor,{x:player.x-35,y:player.y+10},260,dt);s.stageAge+=dt;if(s.stageAge>2.5&&s.walk>70){s.stage=3;s.drops=s.drops.map((p,i)=>({x:s.actor.x+(i%4-1.5)*17,y:s.actor.y+(i<4?-14:14)}));note(2);}}
  if(s.stage===3){for(let i=0;i<8;i++)if(!s.collected.includes(i)&&distance(player,s.drops[i])<25){s.collected.push(i);note(i%6);}if(s.collected.length===8)finish('identityCrisis');}break;
 case 'farewell':
  if(s.stage===0&&d<60){s.stage=1;note(0);}
  if(s.stage===1){toward(s.actor,{x:player.x-35,y:player.y+12},90,dt);if(s.walk>100){s.stage=2;s.relay=0;s.stageAge=0;note(0);}}
  if(s.stage===2){s.stageAge+=dt;const relay=Math.min(4,Math.floor(s.stageAge/.8));if(relay>s.relay){s.relay=relay;note(relay);}if(s.relay===4){s.release+=dt;if(s.release>1)finish('farewellConductor');}}break;
 }
 s.last={...player};return s;
}
