import {sameWorld} from './world-identity.js';
export function directionTo(x,y,target,layer='superficie'){
 if(!target)return null;const scale=layer==='bajo'?8:1,dx=(target.x-x)/scale,dy=(target.y-y)/scale,distance=Math.hypot(dx,dy);
 return {distance,dx:distance?dx/distance:0,dy:distance?dy/distance:0,angle:Math.atan2(dx,-dy),sameLayer:layer===(target.layer||'superficie'),arrived:distance<=30};
}
export function initialize(runtime){
 const $=runtime.$;let state=null,lastId=null,wasAway=false,announced=false;
 const target=()=>runtime.S.destination==='studio'?(runtime.S.studio.x==null?null:{id:'studio',name:'Tu Estudio',x:runtime.S.studio.x,y:runtime.S.studio.y,layer:'superficie'}):(runtime.favorites||[]).find(p=>p.id===runtime.S.destination)||null;
 function cancel(){runtime.S.destination=null;state=null;lastId=null;runtime.stopAutopilot?.();$('routeHud').hidden=true;runtime.save();}
 function select(id){const point=id==='studio'?(runtime.S.studio.x==null?null:{id}):(runtime.favorites||[]).find(p=>p.id===id);if(!point)return false;if(id!=='studio'&&!sameWorld(point.address,runtime.worldIdentity)){runtime.toast?.('Este favorito pertenece a otro mundo o versión');return false;}runtime.stopAutopilot?.();runtime.S.destination=id;lastId=null;runtime.save();$('mJournal').hidden=true;tick();return true;}
 function tick(){
  const point=target();if(!point){if(runtime.S.destination)cancel();else $('routeHud').hidden=true;return;}
  if(point.id!=='studio'&&!sameWorld(point.address,runtime.worldIdentity)){cancel();return;}
  const direction=directionTo(runtime.S.wx,runtime.S.wy,point,runtime.S.layer||'superficie');
  if(lastId!==point.id){lastId=point.id;wasAway=direction.distance>90;announced=false;}
  if(direction.distance>90)wasAway=true;
  state={target:point,...direction};$('routeHud').hidden=!runtime.inWorld();
  $('routeAuto').disabled=!direction.sameLayer||direction.arrived;
  $('routeName').textContent=point.name;
  const directions=['Este','Sureste','Sur','Suroeste','Oeste','Noroeste','Norte','Noreste'],bearing=directions[((Math.round(Math.atan2(direction.dy,direction.dx)/(Math.PI/4))%8)+8)%8];
  $('routeDetail').textContent=!direction.sameLayer?`Destino en ${point.layer==='bajo'?'Subsuelo':point.layer==='cielo'?'Cielo':'Superficie'} · busca un acceso`:direction.arrived?'Llegaste':`${bearing} · ${Math.max(1,Math.round(direction.distance/10))} pasos`;
  $('routeArrow').toggleAttribute('hidden',!direction.sameLayer||direction.arrived);$('routeArrow').style.transform=`rotate(${direction.angle}rad)`;
  if(runtime.inWorld()&&direction.sameLayer&&direction.arrived&&!announced){announced=true;runtime.stopAutopilot?.();if(point.address?.musicVersion===1&&['live','classic'].includes(point.address.musicMode)){runtime.S.livingMusic=point.address.musicMode==='live';runtime.refreshLivingMusic?.();runtime.save();}if(wasAway&&point.id!=='studio'){runtime.unlock('regresoMusical');if(runtime.S.voiceMode!=='discreta'&&runtime.S.voiceMode)runtime.say('Volviste a '+point.name+'. La identidad del lugar permanece; sus criaturas y su música siguen viviendo.','Un regreso');}}
 }
 function actions(point,row){const button=document.createElement('button');button.textContent='Orientar';button.onclick=()=>select(point.id);row.append(button);runtime.autopilotActions?.(point,row);}
 $('navCancel').onclick=cancel;$('favStudio').onclick=()=>select('studio');
 Object.defineProperties(runtime,{selectDestination:{get:()=>select},cancelDestination:{get:()=>cancel},navigationTick:{get:()=>tick},navigationState:{get:()=>state},favoriteActions:{get:()=>actions},favoriteRemoved:{get:()=>id=>{if(runtime.S.destination===id)cancel();}},refreshDestinations:{get:()=>()=>{$('favStudio').disabled=runtime.S.studio.x==null;}}});
 tick();
}
