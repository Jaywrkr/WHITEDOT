import {openSurface,calmMotion} from './frame-state.js';
// The Journey's hint without words (decision 7A): after four seconds without a touch, a ghost finger shows the two
// gestures, drag to walk and tap on the beat. It goes away at the first touch, key or click.
export const HINT_IDLE=4000,HINT_DRAG=1600,HINT_CYCLE=3600;
// Where the ghost finger is in its cycle: dragging to the right, then still and tapping on the beats.
export function hintPose(ms,W,H){const k=((ms%HINT_CYCLE)+HINT_CYCLE)%HINT_CYCLE,x0=W/2+28,y=H/2+56,reach=Math.min(110,W*.25);
 if(k<HINT_DRAG){const u=k/HINT_DRAG,ease=u<.5?2*u*u:1-2*(1-u)**2;return {x:x0+reach*ease,y,drag:true,fade:Math.min(1,k/250)};}
 return {x:x0+reach,y,drag:false,fade:Math.min(1,(HINT_CYCLE-k)/250)};}
export function initialize(runtime){
 let lastInput=performance.now(),shown=0;
 const touched=()=>{lastInput=performance.now();};
 for(const kind of ['pointerdown','touchstart','keydown','wheel'])addEventListener(kind,touched,{capture:true,passive:true});
 const where=()=>runtime.S.mode==='camino'||runtime.inWorld?.()&&(runtime.S.layer||'superficie')==='superficie';
 const active=()=>!!(runtime.journeyQuiet?.()&&where()&&!runtime.activityActive&&!runtime.journeyFinaleState?.().running&&!document.hidden&&!openSurface('.modal:not([hidden])'));
 const idle=()=>performance.now()-lastInput;
 // How close the music is to its last beat: 1 on it, fading in a quarter of a beat (the tap's ring).
 function onBeat(){const ac=runtime.ac,bq=runtime.MU?.bq;if(!ac||!bq?.length)return 0;let last=-Infinity;for(const b of bq)if(b<=ac.currentTime)last=Math.max(last,b);return Math.max(0,1-(ac.currentTime-last)/((runtime.SIX||.15)))}
 function draw(c,W,H){if(!active()||idle()<HINT_IDLE)return;const still=calmMotion(runtime.S),ms=idle()-HINT_IDLE,p=still?{x:W/2+28,y:H/2+56,drag:false,fade:1}:hintPose(ms,W,H),beat=p.drag?0:onBeat();shown++;
  c.save();c.globalAlpha=.32*p.fade;c.fillStyle='#ffffff';c.beginPath();c.arc(p.x,p.y-(beat>0&&!still?3*beat:0),13,0,6.283);c.fill();
  // The drag leaves a short trail; the tap, a ring that opens on the beat.
  if(p.drag){c.globalAlpha=.18*p.fade;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.moveTo(W/2+28,p.y);c.lineTo(p.x-14,p.y);c.stroke();}
  else if(beat>0||still){const k=still?.5:beat;c.globalAlpha=.45*k*p.fade;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.arc(p.x,p.y,14+(1-k)*16,0,6.283);c.stroke();}
  c.restore();}
 Object.defineProperties(runtime,{drawJourneyHint:{get:()=>draw},journeyHint:{get:()=>()=>({showing:active()&&idle()>=HINT_IDLE,idle:Math.round(idle()),frames:shown})}});
}
