// Modo tranquilo (Jay, 29 Oct 2026, alpha.239, «Con Luca»; the rules in tranquilo-model.js; docs/MUNDO.md#con-luca).
// The switch in Ajustes; while it is on, in a round of the eleven places (not Maestro) or in the Journey: no clock in the
// games (they ask runtime.tranquiloValue), a wider window on time (MU.onTimeWindow, read by journey-pulse.js), bigger
// signals (journey-pulse.js asks runtime.tranquiloSignals) and the next thing to reach marked in white. A calm round
// counts as one without sound (run.silent), so it gives ★ and not ★★ or ★★★; the card and Ajustes say so. Never touches
// the music, the cube's size or what was already won. Loaded by the ring (places-ring.js).
import {WORLD_CHAPTERS} from './journey-chapters.js';
import {openSurface,calmMotion} from './frame-state.js';
import {normalizeTranquilo,tranquiloWritable,tranquiloOn,calmApplies,calmValue,calmTarget,GAME_STATES,CALM_WINDOW,CALM_TARGET_R} from './tranquilo-model.js';
export function initialize(runtime){
 const $=id=>globalThis.document?.getElementById(id);
 let owner=null,state=null;
 function own(){if(owner!==runtime.S){owner=runtime.S;runtime.S.tranquilo=normalizeTranquilo(runtime.S.tranquilo);state=runtime.S.tranquilo;calmRun=null;ended=null;}return state;}
 const on=()=>!!runtime.S&&tranquiloOn(own());
 const run=()=>runtime.placeRun?.()||null;
 // The Journey: the Camino, then each of its five chapters until it is finished.
 const inJourney=()=>{const S=runtime.S;if(S.mode==='camino')return true;if(S.journey?.finished===true)return false;const ch=runtime.journeyChapter?.();return !!ch&&WORLD_CHAPTERS.includes(ch.id);};
 const applies=()=>!!runtime.S&&calmApplies({on:on(),run:run(),journey:inJourney()});
 // The switch: on and off at any moment; a failed save puts it back as it was.
 function set(value){if(!runtime.S||!tranquiloWritable(own()))return false;const before=state.on;state.on=!!value;if(runtime.save?.()===false){state.on=before;sync();return false;}tick();sync();return true;}
 function sync(){const box=$('calmKids');if(!box)return;box.checked=on();box.disabled=!tranquiloWritable(own());}
 const box=$('calmKids');if(box){box.onchange=()=>{set(box.checked);};}
 // Ajustes shows the switch as it is each time it opens.
 const settings=$('mSettings');if(settings&&globalThis.MutationObserver)new MutationObserver(()=>{if(!settings.hidden)sync();}).observe(settings,{attributes:true,attributeFilter:['hidden']});
 // ---------- each tick ----------
 let calmRun=null,ended=null,applied=false;
 function tick(){if(!runtime.S)return;own();const r=run(),now=applies(),MU=runtime.MU;
  // The window: wider while calm applies; given back when it stops (only if it is still ours).
  if(MU){if(now){if(!(MU.onTimeWindow>=CALM_WINDOW))MU.onTimeWindow=CALM_WINDOW;applied=true;}else if(applied){if(MU.onTimeWindow===CALM_WINDOW)MU.onTimeWindow=null;applied=false;}}
  // A round played calm counts as one without sound: ★, not ★★ or ★★★ (places.js, roundStars).
  if(r&&now&&!r.free){r.silent=true;if(calmRun?.run!==r)calmRun={id:r.id,run:r};}
  if(calmRun&&calmRun.run!==r){ended={id:calmRun.id,ms:Date.now()-calmRun.run.startedAt};calmRun=null;}
  // A chapter of the Journey played calm: its ★ when it is kept, its ★★ later in its place (places.js, chapterKept).
  if(!r&&now){const ch=runtime.journeyChapter?.(),d=runtime.placesData?.();if(ch&&WORLD_CHAPTERS.includes(ch.id)&&!ch.done?.[ch.id]&&d&&!d.readOnly&&d.journeyShare){const j=d.journeyShare[ch.id]||(d.journeyShare[ch.id]={hits:0,total:0,silent:false});j.silent=true;}}}
 setInterval(()=>{try{tick();}catch(_){}},60)?.unref?.();
 // ---------- the card and the sheets ----------
 // The round's card: a calm round says what it gave and where ★★ and ★★★ wait.
 function card(r){if(!r||!ended||ended.id!==r.id||Math.abs(ended.ms-r.ms)>800)return null;return {rows:['Modo tranquilo: ★ ganada.','★★ y ★★★, en el modo normal.']};}
 // ---------- drawing ----------
 // The thing to reach next, in white (white = next): a soft ring around it and, off screen, a small arrow at the edge.
 let drawn=null;
 function target(){if(!applies())return null;const r=run(),ch=r?null:runtime.journeyChapter?.(),id=r?.id||ch?.id;if(!id)return null;
  if(!r&&ch?.done?.[id]&&ch.portal)return {x:ch.portal.x,y:ch.portal.y,kind:'portal'};
  const key=GAME_STATES[id];if(!key||!runtime.journeyGamePlaying?.(id))return null;const p=calmTarget(id,runtime[key]?.(),{x:runtime.S.wx,y:runtime.S.wy});return p?{...p,kind:'game'}:null;}
 function draw(c,W,H,t){drawn=null;if(!runtime.S||openSurface('.modal:not([hidden])'))return;const p=target();if(!p)return;const S=runtime.S,cx=runtime.camX??S.wx,cy=runtime.camY??S.wy,x=W/2+p.x-cx,y=H/2+p.y-cy,still=calmMotion(S),beat=still?0:.5+.5*Math.sin(t/300);
  c.save();c.strokeStyle='#ffffff';
  if(x>-CALM_TARGET_R&&x<W+CALM_TARGET_R&&y>-CALM_TARGET_R&&y<H+CALM_TARGET_R){if(Math.hypot(p.x-S.wx,p.y-S.wy)<CALM_TARGET_R*.6){c.restore();return;}c.lineWidth=3;c.globalAlpha=.55+.35*beat;c.beginPath();c.arc(x,y,CALM_TARGET_R+(still?0:4*beat),0,6.283);c.stroke();c.lineWidth=1.5;c.globalAlpha=.35;c.beginPath();c.arc(x,y,CALM_TARGET_R+12,0,6.283);c.stroke();drawn={x:p.x,y:p.y,kind:p.kind,edge:false};}
  else{const dx=x-W/2,dy=y-H/2,k=Math.min((W/2-28)/Math.max(1,Math.abs(dx)),(H/2-28)/Math.max(1,Math.abs(dy))),ex=W/2+dx*k,ey=H/2+dy*k,a=Math.atan2(dy,dx);c.translate(ex,ey);c.rotate(a);c.globalAlpha=.85;c.lineWidth=3;c.beginPath();c.moveTo(-10,-9);c.lineTo(4,0);c.lineTo(-10,9);c.stroke();drawn={x:p.x,y:p.y,kind:p.kind,edge:true};}
  c.restore();}
 own();sync();
 Object.defineProperties(runtime,{tranquilo:{get:()=>on},tranquiloApplies:{get:()=>applies},tranquiloSet:{get:()=>set},
  // The games ask for their value (journey-dance.js, journey-garden.js, journey-guide.js, journey-resonance.js, journey-surf.js).
  tranquiloValue:{get:()=>(kind,normal)=>calmValue(kind,normal,applies())},
  // journey-pulse.js: bigger signals on the Line and on the cube, while calm applies.
  tranquiloSignals:{get:()=>applies},drawTranquilo:{get:()=>draw},tranquiloCard:{get:()=>card},
  // Tests only (the runtime is never published).
  tranquiloState:{get:()=>()=>({save:structuredClone(own()),on:on(),applies:applies(),window:runtime.MU?.onTimeWindow??null,calmRun:calmRun?{id:calmRun.id,startedAt:calmRun.run.startedAt}:null,ended:ended?{...ended}:null,target:target(),drawn:drawn?{...drawn}:null})}});
}
