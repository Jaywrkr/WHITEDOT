import {directionTo} from './navigation.js';
export function createAutopilot(random=Math.random){
 const state={mode:null,layer:null,seconds:0,angle:0,targetAngle:0,nextTurn:0,paused:false};
 function stop(){state.mode=null;state.paused=false;}
 function start(mode,layer,angle=0){Object.assign(state,{mode,layer,angle,seconds:0,targetAngle:angle,nextTurn:40+random()*50,paused:false});}
 function vector(dt,context){
  if(!state.mode)return null;
  if(context.manual||(!context.active&&!context.studio)||context.layer!==state.layer){stop();return null;}
  state.paused=!!context.paused||context.studio;if(state.paused)return null;
  const direction=state.mode==='destination'?directionTo(context.x,context.y,context.target,context.layer):null;
  if(state.mode==='destination'&&(!direction||!direction.sameLayer||direction.arrived)){stop();return null;}
  state.seconds+=Math.max(0,Math.min(.05,dt));
  if(direction){const layerSpeed=context.layer==='cielo'?6:1,pace=Math.min(.65,Math.max(0,(direction.distance-20)/(Math.max(dt,.001)*context.speed*layerSpeed)));return {dx:direction.dx*pace,dy:direction.dy*pace};}
  if(state.seconds>=state.nextTurn){state.targetAngle=state.angle+(random()-.5)*Math.PI*1.2;state.nextTurn=state.seconds+40+random()*50;}
  if(context.seaAhead?.(state.angle)){
   const choices=[Math.PI/3,-Math.PI/3,Math.PI/2,-Math.PI/2,Math.PI];
   const turn=choices.find(turn=>!context.seaAhead(state.angle+turn));
   if(turn===undefined)return {dx:0,dy:0};state.targetAngle=state.angle+turn;
  }
  let delta=Math.atan2(Math.sin(state.targetAngle-state.angle),Math.cos(state.targetAngle-state.angle));state.angle+=Math.max(-dt*.7,Math.min(dt*.7,delta));
  if(context.seaAhead?.(state.angle))return {dx:0,dy:0};
  return {dx:Math.cos(state.angle)*.4,dy:Math.sin(state.angle)*.4};
 }
 return {state,start,stop,vector};
}
export function initialize(runtime){
 const engine=createAutopilot(),$=runtime.$;
 function ui(){const s=engine.state;$('autopilotHud').hidden=!runtime.inWorld()||s.mode!=='wander';$('autoStatus').textContent=s.paused?'Paseo en pausa':'Paseo musical';$('bAuto')?.setAttribute('aria-pressed',String(s.mode==='wander'));$('bAuto')?.setAttribute('aria-label',s.mode==='wander'?'Detener paseo musical':'Iniciar paseo musical');$('routeAuto').setAttribute('aria-pressed',String(s.mode==='destination'));$('routeAuto').setAttribute('aria-label',s.mode==='destination'?'Detener viaje automático':'Viajar automáticamente');}
 function stop(){engine.stop();ui();}
 function start(mode){
  if(!runtime.inWorld()){runtime.toast('<em>Autopilot</em> · Entra al Mundo para iniciar.');return false;}
  runtime.audio();runtime.navigationTick();const layer=runtime.S.layer||'superficie';
  if(mode==='destination'&&(!runtime.navigationState?.sameLayer||runtime.navigationState.arrived)){runtime.toast('<em>Autopilot</em> · Elige un destino en esta capa.');return false;}
  if(mode==='wander')runtime.cancelDestination();
  engine.start(mode,layer,runtime.seedOf(`paseo:${runtime.MU.dnaT?.key}`)/4294967296*Math.PI*2);$('mFavorites').hidden=true;ui();return true;
 }
 function vector(dt,manual,paused){
  const s=runtime.S,result=engine.vector(dt,{manual,paused,active:runtime.inWorld(),studio:s.mode==='studio'&&s.prevMode==='world',layer:s.layer||'superficie',x:s.wx,y:s.wy,target:runtime.navigationState?.target,speed:runtime.SPEED,seaAhead:(s.layer||'superficie')==='superficie'?angle=>{const size=runtime.REG*runtime.WCH;for(const d of [90,220]){const x=s.wx+Math.cos(angle)*d,y=s.wy+Math.sin(angle)*d;if(runtime.continents.at(Math.floor(x/size),Math.floor(y/size)).sea)return true;}return false;}:null});
  if(engine.state.seconds>=60)runtime.unlock('paseo1');ui();if(result&&s.layer!=='bajo'&&s.layer!=='cielo'&&runtime.MU.anomaly==='invertida')return {dx:-result.dx,dy:-result.dy};return result;
 }
 function actions(point,row){const button=document.createElement('button');button.textContent='Viajar';button.onclick=()=>{if(runtime.selectDestination(point.id))start('destination');};row.append(button);}
 if($('bAuto'))$('bAuto').onclick=()=>engine.state.mode==='wander'?stop():start('wander');
 $('favWalk').onclick=()=>start('wander');$('autoStop').onclick=stop;$('routeAuto').onclick=()=>engine.state.mode==='destination'?stop():start('destination');
 Object.defineProperties(runtime,{startAutopilot:{get:()=>start},stopAutopilot:{get:()=>stop},autopilotVector:{get:()=>vector},autopilotState:{get:()=>engine.state},autopilotActions:{get:()=>actions}});
 ui();
}
