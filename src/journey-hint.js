import {openSurface,calmMotion} from './frame-state.js';
import {audibleTime} from './journey-pulse.js';
// The Journey's hint without words (decision 7A): after four seconds without a touch, a ghost finger shows the two
// gestures, drag to walk and tap on the beat. It goes away at the first touch, key or click, never shows while a finger
// is down or moving, and once you have played on time a few times it waits much longer before coming back.
export const HINT_IDLE=4000,HINT_LEARNED_IDLE=20000,HINT_LEARNED_HITS=3,HINT_DRAG=1600,HINT_CYCLE=3600;
// Panel 10 (P3): the finger is born beside the cube and is never bigger than it. At rest it is a ring of 1 px around
// a dot of 3 px, inside the cube's 14×14 box, its centre under 30 px from the cube.
export const HINT_DX=20,HINT_DY=18,HINT_RING=6;
// Where the ghost finger is in its cycle: dragging to the right from beside the cube, then back beside it, tapping.
export function hintPose(ms,W,H){const k=((ms%HINT_CYCLE)+HINT_CYCLE)%HINT_CYCLE,x0=W/2+HINT_DX,y=H/2+HINT_DY,reach=Math.min(110,W*.25);
 if(k<HINT_DRAG){const u=k/HINT_DRAG,ease=u<.5?2*u*u:1-2*(1-u)**2;return {x:x0+reach*ease,y,drag:true,fade:Math.min(1,k/250,(HINT_DRAG-k)/250)};}
 return {x:x0,y,drag:false,fade:Math.min(1,(k-HINT_DRAG)/250,(HINT_CYCLE-k)/250)};}
// The steps the finger taps: the place's own (journey-rhythm.js), or the beat where nothing asks for a rhythm.
export const hintSteps=runtime=>{const st=runtime.journeyRhythmState?.()?.steps;return Array.isArray(st)&&st.length?st:[0,4,8,12];};
// How strongly the finger taps at a step of the bar (0–16): 1 on a counted step, fading over the next step and a half.
export function hintBeatAt(step,steps){if(!Number.isFinite(step))return 0;let best=0;for(const s of steps){const age=((step-s)%16+16)%16;if(age<1.5)best=Math.max(best,1-age/1.5);}return best;}
// The step of the bar as heard (audio clock minus output latency), from the steps the music scheduled.
export function heardStep(runtime){const ac=runtime.ac,sq=runtime.MU?.sq;if(!ac||!sq?.length)return null;const t=audibleTime(ac);let last=null;for(const e of sq)if(e.t<=t)last=e;if(!last)return null;return (last.s+Math.min(.99,Math.max(0,t-last.t)/(runtime.SIX||.15)))%16;}
// The finger's tap now: the place's steps, in audible time (Matsuura: it marked the raw beat, before it was heard).
export const hintBeat=runtime=>hintBeatAt(heardStep(runtime),hintSteps(runtime));
export function initialize(runtime){
 let lastInput=performance.now(),shown=0;
 const touched=()=>{lastInput=performance.now();};
 for(const kind of ['pointerdown','pointermove','touchstart','touchmove','keydown','wheel'])addEventListener(kind,touched,{capture:true,passive:true});
 const where=()=>runtime.S.mode==='camino'||runtime.inWorld?.()&&(runtime.S.layer||'superficie')==='superficie';
 const active=()=>!!(runtime.journeyQuiet?.()&&where()&&!runtime.activityActive&&!runtime.journeyFinaleState?.().running&&!document.hidden&&!openSurface('.modal:not([hidden])'));
 const idle=()=>runtime.ptr?0:performance.now()-lastInput;
 const wait=()=>(runtime.journeyPulseState?.().hits||0)>=HINT_LEARNED_HITS?HINT_LEARNED_IDLE:HINT_IDLE;
 function draw(c,W,H){if(!active()||idle()<wait())return;const still=calmMotion(runtime.S),ms=idle()-wait(),p=still?{x:W/2+HINT_DX,y:H/2+HINT_DY,drag:false,fade:1}:hintPose(ms,W,H),beat=p.drag||still?0:hintBeat(runtime);shown++;
  c.save();c.strokeStyle='#ffffff';c.fillStyle='#ffffff';c.lineWidth=1;
  // At rest: a dot of 3 px in a ring of 1 px, no bigger than the cube's box.
  c.globalAlpha=.7*p.fade;c.fillRect(Math.round(p.x)-1,Math.round(p.y)-1,3,3);
  c.globalAlpha=.45*p.fade;c.beginPath();c.arc(Math.round(p.x)+.5,Math.round(p.y)+.5,HINT_RING,0,6.283);c.stroke();
  // The drag leaves a short trail back to the cube; the tap, a ring that opens on each step the place counts.
  if(p.drag){c.globalAlpha=.18*p.fade;c.beginPath();c.moveTo(W/2+HINT_DX,p.y+.5);c.lineTo(p.x-HINT_RING-2,p.y+.5);c.stroke();}
  else if(beat>0){c.globalAlpha=.55*beat*p.fade;c.beginPath();c.arc(Math.round(p.x)+.5,Math.round(p.y)+.5,HINT_RING+(1-beat)*8,0,6.283);c.stroke();}
  c.restore();}
 Object.defineProperties(runtime,{drawJourneyHint:{get:()=>draw},journeyHint:{get:()=>()=>({showing:active()&&idle()>=wait(),idle:Math.round(idle()),frames:shown,beat:hintBeat(runtime),steps:[...hintSteps(runtime)]})}});
}
