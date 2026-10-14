import {livingDefinition} from './living-catalog.js';import {studyOf} from './living-studies.js';
export function initialize(runtime){
 let route=null,routeAt=0,avoid=new Map();
 function context(o,gesture='contacto'){const e=runtime.livingEnvironment,d=runtime.regionOfPos(o.x,o.y),v=runtime.getVoice('living:'+o.kind,d,o);return {habitat:runtime.microhabitat?.().id||'',weather:runtime.weather?.i>.4?'tormenta':'calma',phase:e?.name||'',gesture,role:v.role,instrument:v.material+' · '+v.instrument,character:v.score?.signature||'',study:o.group==='architecture'?studyOf(o).name:''};}
 function found(o){runtime.recordElement?.('living:'+o.kind,runtime.regionOfPos(o.x,o.y));
  if(o.rare&&runtime.livingEnvironment?.convergence)runtime.collectRareCard?.('event:convergence',{...o,id:'convergence:'+o.id+':'+Math.floor(runtime.S.livingSeconds/150)},{context:context(o,'escucha')});
  if(o.rare)runtime.collectRareCard?.('living:'+o.kind,o,{name:livingDefinition(o.kind).name+' · '+(o.variant%2?'pulso velado':'voz profunda'),context:context(o),forced:o.id.startsWith('living:lab:')});
 }
 function relation(o,peer,type){if(!o.rare&&!peer.rare)return;const ids=[o.id,peer.id].sort();runtime.collectRareCard?.('living:relation',{...o,id:'relation:'+ids.join('|').slice(0,95)},{context:{...context(o,'escucha'),relation:type}});}
 function building(o,study){if(!o.rare)return;runtime.collectRareCard?.('living:study',o,{name:study.name,context:context(o,'activacion')});}
 function aim(){const now=performance.now();if(route&&Math.hypot(route.x-runtime.S.wx,route.y-runtime.S.wy)<65){avoid.set(route.id,now+60000);route=null;while(avoid.size>32)avoid.delete(avoid.keys().next().value);}
  if(now-routeAt<1200)return route;routeAt=now;
  const intent=runtime.S.autoIntent||'paisaje';let candidates=runtime.livingNear(750).filter(o=>Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)>90&&(avoid.get(o.id)||0)<now);
  if(intent==='hallazgos')candidates=candidates.filter(o=>o.rare||o.group==='architecture');else if(intent==='vida')candidates=candidates.filter(o=>o.group==='fauna'||o.relation);else candidates=candidates.filter(o=>o.group==='flora');
  route=candidates.sort((a,b)=>Math.hypot(a.x-runtime.S.wx,a.y-runtime.S.wy)-Math.hypot(b.x-runtime.S.wx,b.y-runtime.S.wy))[0]||null;return route?{...route,layer:runtime.S.layer||'superficie'}:null;
 }
 const select=runtime.$('autoIntent');select.value=runtime.S.autoIntent||'paisaje';select.onchange=()=>{runtime.S.autoIntent=select.value;route=null;runtime.save();};
 Object.defineProperties(runtime,{livingFound:{get:()=>found},livingRelationFound:{get:()=>relation},livingBuildingFound:{get:()=>building},autopilotAim:{get:()=>aim}});
}
