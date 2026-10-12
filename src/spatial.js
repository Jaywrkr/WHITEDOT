// Distance changes presence, rather than raising the maximum level of a voice.
export function proximityGain(source,x,y,radius=360) {
 if(!source||!Number.isFinite(source.x)||!Number.isFinite(source.y))return 1;
 const d=Math.min(1,Math.hypot(source.x-x,source.y-y)/radius);
 return 1-d*d*(3-2*d);
}
export function chooseNearbySource(items,x,y,random) {
 const candidates=items.filter(o=>typeof o.snd==='function'&&Number.isFinite(o.x)&&Number.isFinite(o.y));
 const weights=candidates.map(o=>proximityGain(o,x,y)),total=weights.reduce((a,b)=>a+b,0);
 if(!total)return null;
 let pick=random()*total;
 for(let i=0;i<candidates.length;i++){pick-=weights[i];if(pick<0)return candidates[i];}
 return candidates.at(-1)||null;
}
export function initialize(runtime) {
 const active=[];
 function spatialTick(){
  if(!runtime.ac)return;
  const now=runtime.ac.currentTime;
  for(let i=active.length-1;i>=0;i--){
   const rig=active[i];
   if(rig.end<=now){rig.nodes.forEach(n=>n.disconnect());active.splice(i,1);continue;}
   const gain=runtime.inWorld()?proximityGain(rig.source,runtime.S.wx,runtime.S.wy):0;
   if(Math.abs(gain-rig.gain)>.005){rig.nodes.forEach(n=>n.gain.setTargetAtTime(gain,now,.12));rig.gain=gain;}
  }
 }
 function withSpatialVoice(source,time,emit){
  if(!runtime.inWorld()||!source||!Number.isFinite(source.x)||!Number.isFinite(source.y))return emit(1);
  const gain=proximityGain(source,runtime.S.wx,runtime.S.wy);
  if(gain<=0)return;
  spatialTick();
  const ac=runtime.ac;
  if(!runtime.S.sound||ac?.state!=='running'||!runtime.bus||!runtime.verbIn||!runtime.dsend||active.length>=32)return emit(gain);
  const original=[runtime.bus,runtime.verbIn,runtime.dsend],nodes=original.map(destination=>{const node=ac.createGain();node.gain.value=gain;node.connect(destination);return node;});
  active.push({source,nodes,gain,end:time+3});
  [runtime.bus,runtime.verbIn,runtime.dsend]=nodes;
  try{return emit(1);}finally{[runtime.bus,runtime.verbIn,runtime.dsend]=original;}
 }
 Object.defineProperties(runtime,{spatialTick:{get:()=>spatialTick},withSpatialVoice:{get:()=>withSpatialVoice},activeSpatialCount:{get:()=>active.length}});
}
