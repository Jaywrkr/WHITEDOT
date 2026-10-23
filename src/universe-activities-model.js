// Thirty movement-only places. Shared mechanisms, independent layouts and no legacy world RNG.
export const ACTIVITY_CELL=6000,ACTIVITY_RATE=.15,ACTIVITY_TILE=36;
const rows=[
 ['maze','Laberinto colosal','navigate','Encuentra el centro y regresa por la puerta.'],['mirrors','Campo de espejos','rotate','Pisa los mecanismos hasta llevar la luz al destino.'],['stars','Constelación caída','push','Empuja cada estrella hacia su marca.'],['orchestra','Orquesta dormida','switch','Despierta las voces acercando el cubo.'],['islands','Corriente de islas','navigate','Sigue las plataformas hasta la otra orilla.'],['echoes','Bosque de ecos','navigate','Sigue la presencia que responde.'],['ruins','Ruina que se reconstruye','push','Empuja las piezas sobre sus cimientos.'],['caravan','Caravana perdida','escort','Reúne a las criaturas y acompáñalas al refugio.'],['race','Carrera contra tu eco','navigate','Recorre las señales; tu siguiente visita tendrá tu eco.'],['waves','Lago de ondas','rotate','Ajusta las fuentes hasta que sus ondas coincidan.'],['tower','Torre de puertas','doors','Busca en cada sala la puerta del mismo símbolo.'],['domino','Campo de dominó gigante','rotate','Orienta las piezas y observa la reacción.'],['silence','Santuario del silencio','switch','Apaga las presencias para recuperar la calma.'],['machine','Máquina abandonada','rotate','Conecta los conductos para despertar la máquina.'],['fireflies','Mar de destellos','herd','Guía las luces hacia el refugio de su color.'],['fold','Planeta plegable','rotate','Gira los sectores y conecta el camino al centro.'],['shadows','Cazador de sombras','doors','Encuentra la silueta que coincide con la señal.'],['cathedral','Catedral de acordes','switch','Reproduce con las columnas la figura del portón.'],['excavation','Excavación de cristal','dig','Quédate sobre las grietas para descubrir lo enterrado.'],['train','Tren sin vías','rotate','Orienta las vías; el tren espera si falta un tramo.'],['gravity','Campo de gravedad','attract','Acércate para atraer las esferas a sus destinos.'],['archive','Archivo de recuerdos','push','Ordena los fragmentos en sus pedestales.'],['storm','Tormenta embotellada','rotate','Ajusta las válvulas hasta llenar cada marca.'],['theatre','Teatro de criaturas','push','Coloca a los personajes en sus lugares del escenario.'],['bridges','Puentes de música','sequence','Recorre la frase para abrir tres puentes.'],['observatory','Observatorio imposible','rotate','Alinea los anillos para revelar la presencia.'],['garden','Huerto extraterrestre','push','Lleva las semillas a su luz y deja que crezcan.'],['giant','El gigante dormido','navigate','Recorre su cuerpo y despierta sus seis puntos.'],['city','Ciudad de interruptores','switch','Cada plaza cambia sus vecinos. Ilumina la ciudad.'],['tracks','Expedición de huellas','navigate','Sigue los rastros hasta encontrar su origen.']
];
export const ACTIVITIES=Object.freeze(rows.map(([id,name,family,hint],index)=>Object.freeze({id,name,family,hint,index})));
export const activityDefinition=id=>ACTIVITIES.find(d=>d.id===id);
export function activityCell(x,y,seedOf,layer='superficie'){
 const h=seedOf('activities:place:v1:'+layer+':'+x+','+y)>>>0;if(h/4294967296>=ACTIVITY_RATE)return [];
 const k=seedOf('activities:kind:v1:'+layer+':'+x+','+y)>>>0;return [{id:'activity:v1:'+layer+':'+x+','+y,kind:ACTIVITIES[k%30].id,seed:k,x:(x+.3+(k>>>7)%400/1000)*ACTIVITY_CELL,y:(y+.3+(k>>>17)%400/1000)*ACTIVITY_CELL}];
}
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function activityLevel(id,seed){
 const def=activityDefinition(id);if(!def)throw Error('Unknown activity');let h=seed>>>0||1;const rnd=()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return (h>>>0)/4294967296;};
 const n=id==='maze'?51:17,floor=Array(n*n).fill(0),spawn={x:1.5,y:n-1.5},exit={x:1.5,y:n-.5},goal={x:n-1.5,y:1.5};
 for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)floor[y*n+x]=1;
 if(id==='maze'){
  floor.fill(0);const stack=[[1,n-2]];floor[(n-2)*n+1]=1;
  while(stack.length){const [x,y]=stack.at(-1),dirs=[[2,0],[-2,0],[0,2],[0,-2]].filter(([dx,dy])=>x+dx>0&&x+dx<n-1&&y+dy>0&&y+dy<n-1&&!floor[(y+dy)*n+x+dx]);if(!dirs.length){stack.pop();continue;}const [dx,dy]=dirs[Math.floor(rnd()*dirs.length)];floor[(y+dy/2)*n+x+dx/2]=1;floor[(y+dy)*n+x+dx]=1;stack.push([x+dx,y+dy]);}
  // Extra passages and small chambers keep the large maze from being a single corridor tree.
  for(let i=0;i<16;i++){const x=2+Math.floor(rnd()*((n-3)/2))*2,y=1+Math.floor(rnd()*((n-1)/2))*2;floor[y*n+x]=1;}
  for(let i=0;i<4;i++){const x=3+Math.floor(rnd()*((n-7)/2))*2,y=3+Math.floor(rnd()*((n-7)/2))*2;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)floor[(y+dy)*n+x+dx]=1;}
 }
 floor[(n-1)*n+1]=1;
 const nodes=Array.from({length:id==='city'?9:id==='shadows'?6:id==='giant'?6:4},(_,i)=>({x:3.5+(i%3)*4,y:4.5+Math.floor(i/3)*4,shape:i%6}));
 if(id==='tower')nodes.splice(0,nodes.length,...[3.5,8.5,13.5].map((x,i)=>({x,y:3.5,shape:i})));
 if(id!=='tower')for(const p of nodes){p.x+=(rnd()-.5)*.6;p.y+=(rnd()-.5)*.6;}
 const route=[{...spawn}];
 if(id==='islands'){let x=1.5;for(let y=n-2;y>=2;y--){const next=clamp(x+(rnd()>.5?1:-1),1.5,n-2.5);route.push({x,y:y+.5});x=next;route.push({x,y:y+.5});}goal.x=x;goal.y=2.5;route.push({...goal});}
 else for(let i=0;i<7;i++)route.push({x:3+rnd()*(n-6),y:n-4-i*(n-7)/7});
 const count=id==='fireflies'?6:id==='ruins'?4:3,targets=Array.from({length:count},(_,i)=>({x:4.5+(i%3)*4,y:4.5+Math.floor(i/3)*4}));
 const blocks=targets.map((p,i)=>({x:p.x+(rnd()>.5?-2:2),y:p.y+2,index:i}));
 if(id==='fireflies'){targets.splice(0,targets.length,{x:3,y:8},{x:14,y:8});for(const [i,b]of blocks.entries()){b.x=7.5+(i%2);b.y=4+i*1.5;b.index=i%2;}}
 if(id==='caravan'){targets.splice(0,targets.length,{x:13,y:3});for(const [i,b]of blocks.entries()){b.x=3+i*4;b.y=11-i*3;b.index=0;}}
 const solution=nodes.map(()=>Math.floor(rnd()*4)),values=solution.map(v=>(v+1+Math.floor(rnd()*3))%4),sequence=Array.from({length:id==='tower'?6:id==='shadows'?3:12},()=>Math.floor(rnd()*(id==='tower'?3:id==='shadows'?6:4)));
 if(def.family==='switch')for(let i=0;i<nodes.length;i++){solution[i]=id==='silence'?0:id==='cathedral'?Number(rnd()>.4):1;values[i]=id==='silence'?1:0;}
 if(id==='cathedral')solution[0]=1;
 const cityMoves=[];if(id==='city'){values.fill(1);for(let i=0;i<8;i++){const k=Math.floor(rnd()*9);cityMoves.push(k);toggleCity(values,k);}if(values.every(v=>v===1)){cityMoves.push(0);toggleCity(values,0);}}
 const digCells=Array.from({length:7},(_,i)=>Math.floor(nodes[i%nodes.length].y)*n+Math.floor(nodes[i%nodes.length].x)+(i>=4?2:0));
 return {def,n,floor,spawn,exit,goal,nodes,route,targets,blocks,solution,values,sequence,cityMoves,digCells,seed};
}
export function toggleCity(values,k){for(const i of [k,k%3>0?k-1:-1,k%3<2?k+1:-1,k-3,k+3])if(i>=0&&i<9)values[i]=1-values[i];}
export function activityState(l,raw){
 const base={x:l.spawn.x,y:l.spawn.y,values:l.values.slice(),blocks:structuredClone(l.blocks),visited:l.nodes.map(()=>false),locked:l.blocks.map(()=>false),growth:l.blocks.map(()=>0),levels:l.nodes.map(()=>0),next:0,stage:0,flow:0,time:0,dug:[],touch:[],trace:[],done:false};
 if(!raw||typeof raw!=='object')return base;
 const s={...raw,...base};for(const key of ['x','y'])if(Number.isFinite(raw[key]))s[key]=clamp(raw[key],.5,l.n-.5);
 for(const [key,max]of [['next',100],['stage',10],['flow',100],['time',86400]])if(Number.isFinite(raw[key]))s[key]=clamp(raw[key],0,max);
 for(const key of ['values','visited','locked','growth','levels'])if(Array.isArray(raw[key]))s[key]=base[key].map((v,i)=>typeof v==='boolean'?raw[key][i]===true:Number.isFinite(raw[key][i])?clamp(raw[key][i],0,key==='values'?3:10):v);
 if(Array.isArray(raw.blocks))s.blocks=base.blocks.map((b,i)=>({...b,x:Number.isFinite(raw.blocks[i]?.x)?clamp(raw.blocks[i].x,1,l.n-1):b.x,y:Number.isFinite(raw.blocks[i]?.y)?clamp(raw.blocks[i].y,1,l.n-1):b.y}));
 s.dug=Array.isArray(raw.dug)?[...new Set(raw.dug.filter(k=>Number.isInteger(k)&&k>=0&&k<l.n*l.n))]:[];
 s.touch=Array.isArray(raw.touch)?raw.touch.filter(i=>Number.isInteger(i)&&i>=0&&i<l.nodes.length):[];s.ghost=Array.isArray(raw.ghost)?raw.ghost.filter(p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite)).slice(-180):[];
 s.trace=Array.isArray(raw.trace)?raw.trace.filter(p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite)).slice(-180):[];s.done=raw.done===true;return s;
}
export function activityCanStand(l,x,y){
 if(!Number.isFinite(x)||!Number.isFinite(y))return false;
 if(l.def.id==='islands')return distance({x,y},l.exit)<.75||l.route.some(p=>distance({x,y},p)<.76);
 for(const dx of [-.2,.2])for(const dy of [-.2,.2]){const a=Math.floor(x+dx),b=Math.floor(y+dy);if(a<0||b<0||a>=l.n||b>=l.n||!l.floor[b*l.n+a])return false;}return true;
}
export function moveActivity(l,s,dx,dy){
 const count=Math.max(1,Math.ceil(Math.hypot(dx,dy)/.12)),old={x:s.x,y:s.y};
 for(let k=0;k<count;k++)for(const axis of ['x','y']){const delta=(axis==='x'?dx:dy)/count,p={x:s.x,y:s.y};p[axis]+=delta;if(!activityCanStand(l,p.x,p.y))continue;
  if(l.def.family==='push')for(const [i,b]of s.blocks.entries())if(!s.locked[i]&&distance(p,b)<.68){const v=b[axis]+delta;if(v>1&&v<l.n-1)b[axis]=v;}
  s[axis]=p[axis];
 }return Math.hypot(s.x-old.x,s.y-old.y);
}
export function updateActivity(l,s,dt){
 dt=clamp(Number.isFinite(dt)?dt:0,0,.05);s.time+=dt;const id=l.def.id,family=l.def.family,point={x:s.x,y:s.y},touch=l.nodes.map((p,i)=>distance(p,point)<.7?i:-1).filter(i=>i>=0),entered=touch.filter(i=>!s.touch.includes(i));s.touch=touch;
 if(s.done)return {complete:true,event:false};const beforeNext=s.next;let event=entered.length>0;
 if(family==='rotate'){
  for(const i of entered)s.values[i]=(s.values[i]+1)%4;
  const aligned=s.values.every((v,i)=>v===l.solution[i]);
  if(id==='train'){const i=Math.floor(s.flow);if(i<l.nodes.length&&s.values[i]===l.solution[i])s.flow+=dt*.6;s.done=s.flow>=l.nodes.length;}
  else if(id==='storm'){for(let i=0;i<s.levels.length;i++)s.levels[i]+=clamp(s.values[i]-s.levels[i],-dt*1.5,dt*1.5);s.done=s.levels.every((v,i)=>Math.abs(v-l.solution[i])<.04);}
  else if(id==='fold')s.done=aligned&&distance(point,l.goal)<.7;
  else if(['machine','domino','observatory'].includes(id)){s.flow=aligned?s.flow+dt:0;s.done=s.flow>=(id==='observatory'?.8:2);}
  else s.done=aligned;
 }
 else if(family==='switch'){
  for(const i of entered){if(id==='city')toggleCity(s.values,i);else s.values[i]=id==='orchestra'?1:id==='silence'?0:1-s.values[i];}s.done=s.values.every((v,i)=>v===l.solution[i]);
 }
 else if(['push','escort','herd','attract'].includes(family)){
  for(const [i,b]of s.blocks.entries()){
   if(s.locked[i])continue;const d=distance(b,point);
   if(family==='escort'&&d<2)s.visited[i]=true;
   if((family==='escort'&&s.visited[i]&&d>.9&&d<6)||(family==='attract'&&d>.7&&d<3.5)){b.x+=(point.x-b.x)/d*dt*2.2;b.y+=(point.y-b.y)/d*dt*2.2;}
   if(family==='herd'&&d>0&&d<2){b.x=clamp(b.x+(b.x-point.x)/d*dt*2,1,l.n-1);b.y=clamp(b.y+(b.y-point.y)/d*dt*2,1,l.n-1);}
   const target=l.targets[b.index];if(distance(b,target)<(family==='herd'||family==='escort'?1.2:.45)){s.locked[i]=true;b.x=target.x;b.y=target.y;event=true;}
  }
  if(id==='garden'){for(let i=0;i<s.growth.length;i++)if(s.locked[i])s.growth[i]+=dt;s.done=s.growth.every(v=>v>=2);}else s.done=s.locked.every(Boolean);
 }
 else if(family==='doors'){
  for(const i of entered){const expected=l.sequence[id==='tower'?s.stage:s.next];if(i===expected){if(id==='tower')s.stage++;else s.next++;}else if(id==='tower')s.stage=Math.max(0,s.stage-1);else s.next=0;if(id==='tower'){s.x=l.spawn.x;s.y=l.spawn.y;s.touch=[];}}
  s.done=id==='tower'?s.stage>=6:s.next>=3;
 }
 else if(family==='sequence'){
  for(const i of entered)s.next=i===l.sequence[s.next]?s.next+1:Math.floor(s.next/4)*4;s.stage=Math.floor(s.next/4);s.done=s.next>=12;
 }
 else if(family==='dig'){
  const cell=Math.floor(s.y)*l.n+Math.floor(s.x);if(s.digCell!==cell){s.digCell=cell;s.digHold=0;}s.digHold=(s.digHold||0)+dt;if(s.digHold>.35&&!s.dug.includes(cell)){s.dug.push(cell);event=true;}s.done=l.digCells.every(k=>s.dug.includes(k));
 }
 else if(id==='maze')s.done=distance(point,l.goal)<.7;
 else if(id==='giant'){for(const i of entered)s.visited[i]=true;s.done=s.visited.every(Boolean);}
 else {if(distance(point,l.route[s.next]||l.goal)<.8)s.next++;s.done=s.next>=l.route.length;}
 if(id==='race'&&s.trace.length<180&&s.time-(s.trace.at(-1)?.[2]??-1)>.3)s.trace.push([s.x,s.y,s.time]);
 return {complete:s.done,event:event||s.next!==beforeNext};
}
export function normalizeActivities(raw){
 if(Number.isInteger(raw?.version)&&raw.version>1)return raw;
 const valid=k=>k.startsWith('activity:v1:')&&k.length<120;
 return {...raw,version:1,done:Object.fromEntries(Object.entries(raw?.done&&typeof raw.done==='object'?raw.done:{}).filter(([k,v])=>valid(k)&&v===true).slice(-8192)),progress:Object.fromEntries(Object.entries(raw?.progress&&typeof raw.progress==='object'?raw.progress:{}).filter(([k,v])=>valid(k)&&v&&typeof v==='object').slice(-32))};
}
