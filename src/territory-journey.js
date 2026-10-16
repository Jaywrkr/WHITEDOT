// Playback geography only. Separate hashes preserve terrain and discoveries.
const unit=h=>(h>>>0)/4294967296;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function territoryNucleus(rx,ry,size,seedOf){
 const key=rx+','+ry;
 return {x:(rx+.28+.44*unit(seedOf('music:nucleus:v1:x:'+key)))*size,y:(ry+.28+.44*unit(seedOf('music:nucleus:v1:y:'+key)))*size};
}
export function territoryField(x,y,size,regionAt,seedOf){
 const rx=Math.floor(x/size),ry=Math.floor(y/size),sources=[];
 for(let a=rx-1;a<=rx+1;a++)for(let b=ry-1;b<=ry+1;b++){
  const p=territoryNucleus(a,b,size,seedOf),distance=Math.hypot(x-p.x,y-p.y)/size;
  sources.push({...p,region:regionAt((a+.5)*size,(b+.5)*size),distance,power:1/(.001+distance**4)});
 }
 sources.sort((a,b)=>b.power-a.power);
 const [a,b]=sources,raw=b.power/(a.power+b.power),mix=clamp((raw-.08)/.84,0,.5);
 return {primary:a.region,secondary:mix>0?b.region:null,mix,core:clamp(1-a.distance,0,1),nucleus:{x:a.x,y:a.y}};
}
export function approachJourneyTempo(current,target){
 if(!Number.isFinite(current)||current<=0)return target;
 return current+clamp(target-current,-2,2);
}
export function windLevel(speed,energy=0){return clamp(Number.isFinite(speed)?speed:0,0,1)*.0012*(energy>.4?.65:1);}
export function createTerritoryJourney(){
 let state=null,lastBar=-1;
 function reset(){state=null;lastBar=-1;}
 function advance(field,bar){
  if(bar<lastBar)reset();
  if(state&&bar===lastBar)return {...state,swap:false,initial:false};lastBar=bar;
  if(!state){state={primary:field.primary,secondary:null,from:0,to:0,primarySince:bar,guestSince:bar,core:field.core,swap:false};return {...state,initial:true};}
  const next={...state,from:state.to,swap:false,initial:false};
  const same=field.primary.key===next.primary.key;
  const wanted=same?field.secondary:field.primary;
  const goal=same?field.mix:field.secondary?.key===next.primary.key?1-field.mix:1;
  // Retire a guest only after its complete phrase has faded out.
  if(next.secondary&&next.from<.001&&bar-next.guestSince>=8&&bar%4===0&&wanted?.key!==next.secondary.key)next.secondary=null;
  if(!next.secondary&&wanted&&wanted.key!==next.primary.key&&bar%4===0){next.secondary=wanted;next.guestSince=bar;}
  const target=next.secondary&&wanted?.key===next.secondary.key?goal:0;
  next.to=clamp(next.from+clamp(target-next.from,-.125,.125),0,1);
  // Swap the two existing radios instead of restarting the arriving composition.
  if(!same&&next.secondary&&wanted?.key===next.secondary.key&&next.from>=.5&&bar-next.primarySince>=8&&bar-next.guestSince>=4&&bar%8===0){
   [next.primary,next.secondary]=[next.secondary,next.primary];
   next.from=1-next.from;next.to=1-next.to;next.primarySince=bar;next.swap=true;
  }
  next.core=state.core+(field.core-state.core)*.15;state=next;return {...state};
 }
 return {reset,advance};
}
export function initialize(runtime){
 Object.defineProperty(runtime,'readTerritoryField',{get:()=>()=>territoryField(runtime.S.wx,runtime.S.wy,runtime.REG*runtime.WCH,runtime.regionOfPos,runtime.seedOf)});
}
