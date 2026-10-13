// Mesa de efectos estilo Kaoss pad: produces sobre la música mientras suena.
// Pad XY: horizontal = filtro (izquierda graves, derecha agudos, centro limpio); vertical = espacio (reverb + eco).
// Botones: Eco (repeticiones largas a tempo), Robot (reducción de bits), Stop (frenazo de cinta) y Fijar
// (el efecto se queda al soltar; si no, vuelve suave a neutro).

// Mapeo puro del pad a parámetros (x, y en 0..1, y=1 arriba).
export function padParams(x,y,eco=false,robot=false){
 const lp=x<.45?200*Math.pow(2,(x/.45)*6.6):20000,hp=x>.55?20*Math.pow(2,((x-.55)/.45)*9.4):10;
 return {lp,hp,verb:y*.85,delay:eco?.55+y*.25:y*.35,fb:eco?.72:.4,crush:robot?.55:0,dry:robot?.6:1};
}

export function initialize(runtime){
 const $=runtime.$,state={open:false,x:.5,y:0,eco:false,robot:false,hold:false,active:false,used:0,lastT:0};
 const neutral=()=>state.x===.5&&state.y===0&&!state.eco&&!state.robot;
 function apply(glide=.04){
  const fx=runtime.fx,ac=runtime.ac;if(!fx||!ac)return;const t=ac.currentTime,p=padParams(state.x,state.y,state.eco,state.robot);
  fx.lp.frequency.setTargetAtTime(p.lp,t,glide);fx.hp.frequency.setTargetAtTime(p.hp,t,glide);fx.verbSend.gain.setTargetAtTime(p.verb,t,glide);
  fx.delaySend.gain.setTargetAtTime(p.delay,t,glide);fx.fb.gain.setTargetAtTime(p.fb,t,glide);fx.delay.delayTime.setTargetAtTime(runtime.SIX*(state.eco?3:2),t,.05);
  fx.crushSend.gain.setTargetAtTime(p.crush,t,glide);fx.dry.gain.setTargetAtTime(p.dry,t,glide);
  draw();
 }
 function draw(){
  const dot=$('fxDot');if(!dot)return;dot.style.left=(state.x*100)+'%';dot.style.top=((1-state.y)*100)+'%';
  $('fxEco').setAttribute('aria-pressed',String(state.eco));$('fxRobot').setAttribute('aria-pressed',String(state.robot));$('fxHold').setAttribute('aria-pressed',String(state.hold));
  const p=padParams(state.x,state.y);$('fxRead').textContent=`${state.x<.45?'Filtro graves':state.x>.55?'Filtro agudos':'Limpio'} · espacio ${Math.round(state.y*100)} %`;
 }
 function toggle(){runtime.audio();state.open=!state.open;$('fxPanel').hidden=!state.open;$('bFx').setAttribute('aria-pressed',String(state.open));
  if(state.open&&!runtime.S.help.fx){runtime.S.help.fx=true;runtime.say(runtime.VOZ.fx,'Mesa de efectos');}draw();}
 function fromEvent(e){const r=$('fxPad').getBoundingClientRect();state.x=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));state.y=Math.min(1,Math.max(0,1-(e.clientY-r.top)/r.height));
  if(Math.abs(state.x-.5)<.05)state.x=.5;}   // imán al centro: fácil volver a limpio
 const pad=$('fxPad');
 pad.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();pad.setPointerCapture(e.pointerId);state.active=true;fromEvent(e);apply();});
 pad.addEventListener('pointermove',e=>{if(!state.active)return;fromEvent(e);apply();});
 const up=()=>{if(!state.active)return;state.active=false;if(!state.hold){state.x=.5;state.y=0;apply(.12);}};
 pad.addEventListener('pointerup',up);pad.addEventListener('pointercancel',up);
 $('bFx').onclick=e=>{e.stopPropagation();e.currentTarget.blur();toggle();};
 $('fxClose').onclick=()=>{if(state.open)toggle();};
 $('fxEco').onclick=()=>{state.eco=!state.eco;apply();};
 $('fxRobot').onclick=()=>{state.robot=!state.robot;apply();if(state.robot)runtime.unlock('robot');};
 $('fxHold').onclick=()=>{state.hold=!state.hold;if(!state.hold&&!state.active){state.x=.5;state.y=0;}apply(.12);};
 // Stop de cinta: el filtro y el volumen caen en un tiempo y vuelven en el siguiente.
 $('fxStop').onclick=()=>{const fx=runtime.fx,ac=runtime.ac;if(!fx||!ac)return;const t=ac.currentTime,beat=runtime.SIX*4;
  fx.lp.frequency.cancelScheduledValues(t);fx.lp.frequency.setValueAtTime(fx.lp.frequency.value,t);fx.lp.frequency.exponentialRampToValueAtTime(120,t+beat);
  fx.dry.gain.cancelScheduledValues(t);fx.dry.gain.setValueAtTime(fx.dry.gain.value,t);fx.dry.gain.linearRampToValueAtTime(.05,t+beat);
  setTimeout(()=>{fx.dry.gain.cancelScheduledValues(ac.currentTime);fx.lp.frequency.cancelScheduledValues(ac.currentTime);apply(.03);},beat*2*1000);runtime.unlock('cinta');};
 // Contador de uso (logro "Productor") y el panel solo existe en el Mundo.
 function tick(dt){if(!runtime.inWorld()&&state.open)toggle();$('bFx').hidden=!runtime.inWorld();if(!neutral()){state.used+=dt;if(state.used>30)runtime.unlock('productor');}}
 function reset(){state.x=.5;state.y=0;state.eco=state.robot=state.hold=false;if(state.open)toggle();apply(.1);}
 Object.defineProperties(runtime,{fxTick:{get:()=>tick},fxReset:{get:()=>reset},fxState:{get:()=>state},fxApply:{get:()=>apply}});
}
