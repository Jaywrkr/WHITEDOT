// A separate active-time clock: menus and suspended audio never count as listening.
export function createStillnessDirector(){
 const state={seconds:0,strength:0,stage:0,key:null,x:null,y:null};
 function reset(){Object.assign(state,{seconds:0,strength:0,stage:0,key:null,x:null,y:null});}
 function tick(dt,{x,y,key,active,moving=false}){
  dt=Math.max(0,Math.min(.25,dt));
  if(state.key!==key){reset();state.key=key;state.x=x;state.y=y;}
  if(!active)return state;
  if(moving||Math.hypot(x-state.x,y-state.y)>2){state.seconds=0;state.stage=0;state.x=x;state.y=y;state.strength*=Math.exp(-dt/2);}
  else{state.seconds+=dt;state.stage=state.seconds<60?0:Math.min(3,1+Math.floor((state.seconds-60)/32));const target=Math.min(1,Math.max(0,(state.seconds-60)/20));state.strength+=(target-state.strength)*Math.min(1,dt/2);}
  return state;
 }
 return {state,tick,reset};
}
export function initialize(runtime){
 const director=createStillnessDirector();let lastBar=-1,lastStage=0,enabled=false;
 function tick(dt,moving,paused){
  if(!runtime.inWorld()){director.reset();lastStage=0;enabled=false;return;}
  const s=runtime.S,m=runtime.MU,key=`${s.layer||'superficie'}:${m.dnaT?.key||''}`;
  enabled=!paused&&!runtime.scanning&&!document.hidden&&s.sound&&runtime.ac?.state==='running';
  const state=director.tick(dt,{x:s.wx,y:s.wy,key,moving,active:enabled});
  if(state.stage>0&&!lastStage){runtime.unlock('escuchaViva');}lastStage=state.stage;
 }
 function bar(time,bar){
  const state=director.state,m=runtime.MU,region=m.dnaA;
  if(!enabled||document.hidden||state.stage===0||!runtime.inWorld()||!runtime.S.sound||runtime.ac?.state!=='running'||!region||state.strength<.1||lastBar===bar||bar%4||runtime.currentPocket?.()?.kind==='quiet')return;
  lastBar=bar;
  const random=runtime.rng(runtime.seedOf(`initiative:v1:${region.key}:${Math.floor(bar/4)}:${state.stage}`));
  const nearby=m.near.filter(o=>o.snd&&Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<280);
  const at=time+runtime.SIX*[3,7,11][Math.floor(random()*3)];
  if(nearby.length){const source=nearby[Math.floor(random()*nearby.length)];runtime.withVoiceOrigin('ambient',()=>source.snd(at));setTimeout(()=>{source.lit=1;},Math.max(0,(at-runtime.ac.currentTime)*1000));}
  else{const note=runtime.chordTones()[(state.stage+Math.floor(random()*3))%4];runtime.hookInst(region.track.hookI,note,at,.022*state.strength,region);}
 }
 Object.defineProperties(runtime,{initiativeLastBar:{get:()=>lastBar},initiativeTick:{get:()=>tick},initiativeBar:{get:()=>bar},initiativeState:{get:()=>director.state}});
}
