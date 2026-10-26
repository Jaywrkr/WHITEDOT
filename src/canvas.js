import {openSurface} from './frame-state.js';
import {installVivid} from './visual.js';
// Canvas, input de movimiento y estado visual temporal.
export function initialize(runtime) {
  /* ---------- canvas ---------- */
  const cv=document.getElementById("w"),cx=installVivid(cv.getContext("2d"));   // paleta viva: más variedad de color en el mundo
  let W=0,H=0,DPR=1;
  function resize(){DPR=Math.min(devicePixelRatio||1,runtime.lightQuality?.()?1:2);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0);}
  addEventListener("resize",resize);resize();
  const keys={};let ptr=null;
  addEventListener("keydown",e=>{
    const focusedMenu=e.target===document.getElementById('bMenu')&&runtime.inWorld();
    if(e.target!==document.body&&e.target!==cv&&!(focusedMenu&&['arrowright','arrowleft','arrowup','arrowdown','w','a','s','d'].includes(e.key.toLowerCase())))return;
    if(runtime.noticeLane?.inspecting||openSurface('.modal:not([hidden])'))return;
    if(e.key==='Escape'){runtime.stopAutopilot?.();return;}
    const key=e.key.toLowerCase();if(['arrowright','arrowleft','arrowup','arrowdown','w','a','s','d'].includes(key)){keys[key]=1;runtime.audio();if(e.key.startsWith('Arrow'))e.preventDefault();}
    if(e.code==='Space'&&!e.repeat){e.preventDefault();runtime.sonar();}
  });
  addEventListener("keyup",e=>{keys[e.key.toLowerCase()]=0;});
  let holdTimer=null,activePointer=null,dragging=false,held=false,directPulse=false;
  const cancelHold=()=>{clearTimeout(holdTimer);holdTimer=null;};
  // El juego escucha toda la pantalla: un arrastre que empieza sobre textos del HUD o la Voz también mueve al pixel.
  // Solo se excluyen botones, paneles abiertos y el Estudio.
  const blocked=t=>!!t?.closest?.('button,a,input,select,textarea,label,summary,.modal:not([hidden]),#studioPanel,#scanner,#fxPanel,#mirrorPanel,[data-inspect="true"],[role="button"]');
  let fromOverlay=false;
  // Where a touch is the pulse itself (D2-A): the Camino, a Journey chapter (the Journey not yet finished) and a round.
  const tapAnywhere=()=>runtime.S.mode==='camino'||runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie'&&(!!runtime.placeRun?.()||!!runtime.journeyQuiet?.()&&runtime.S.journey?.finished!==true);
  addEventListener("pointerdown",e=>{
    if(e.target===cv||blocked(e.target))return;
    if(!e.isPrimary||activePointer!==null||runtime.S.mode==="studio")return;
    start(e,true);
  },true);
  cv.addEventListener("pointerdown",e=>start(e));
  function start(e,overlay=false){
    if(!e.isPrimary||activePointer!==null||document.hidden||openSurface('.modal:not([hidden])')||runtime.depthEngaged||runtime.encounterEngaged||runtime.ecologyEngaged)return;
    fromOverlay=overlay;
    if(!fromOverlay&&runtime.housePointerDown?.(e))return;
    if(!fromOverlay&&runtime.fingerTouch&&!runtime.pinnedAt?.(e.clientX,e.clientY)&&(runtime.glassPointerDown?.(e)||runtime.materiaPointerDown?.(e)||runtime.vidaPointerDown?.(e)||runtime.mirrorPointerDown?.(e)||runtime.depthDown?.(e)||runtime.encounterDown?.(e)||runtime.ecologyDown?.(e)||runtime.creativePointerDown?.(e)))return;
    if(!fromOverlay)runtime.audio();if(runtime.S.mode==="studio"){runtime.studioTap(e.clientX,e.clientY);return;}
    activePointer=e.pointerId;dragging=held=directPulse=false;
    runtime.tapStart={t:performance.now(),x:e.clientX,y:e.clientY};ptr=null;if(!fromOverlay)try{cv.setPointerCapture(e.pointerId);}catch(_){}   // sin captura sobre textos: así un toque en la Voz la sigue abriendo
    // The cube is an explicit instrument. In the free World empty space keeps drag/hold ambiguity until release.
    // Panel 10 (P6, D2-A, Mizuguchi): in the Camino, the Journey's chapters and a place's round the pulse sounds when the
    // finger goes down anywhere on the canvas; a finger that then drags walks as always (the pulse already sounded, like
    // a step with a note) and one that rests still opens the scanner.
    const x=W/2+(runtime.inWorld()?runtime.S.wx-(runtime.camX??runtime.S.wx):0),y=H/2+(runtime.inWorld()?runtime.S.wy-(runtime.camY??runtime.S.wy):0),anywhere=tapAnywhere();
    if(!fromOverlay&&(anywhere||!runtime.fingerTouch&&(runtime.inWorld()||runtime.S.mode==='camino')&&Math.hypot(e.clientX-x,e.clientY-y)<=24)&&!openSurface('.modal:not([hidden])')){directPulse=true;runtime.sonar('player',runtime.tapStart.t);}
    if(runtime.inWorld()&&!fromOverlay&&(!directPulse||anywhere))holdTimer=setTimeout(()=>{if(activePointer!==e.pointerId||document.hidden||openSurface('.modal:not([hidden])'))return;held=true;runtime.startScanner();},500);
    else if(!runtime.inWorld())ptr={x:e.clientX,y:e.clientY};
  }
  addEventListener("pointermove",e=>{
    if(document.hidden||openSurface('.modal:not([hidden])')){cancelInput();return;}
    if(runtime.housePointerMove?.(e))return;
    if(runtime.fingerTouch&&(runtime.glassPointerMove?.(e)||runtime.materiaPointerMove?.(e)||runtime.vidaPointerMove?.(e)||runtime.mirrorPointerMove?.(e)||runtime.depthMove?.(e)||runtime.encounterMove?.(e)||runtime.ecologyMove?.(e)||runtime.creativePointerMove?.(e)))return;
    if(e.pointerId!==activePointer||!runtime.tapStart)return;
    // A finger that rested long enough to open the scanner and then moves wants to walk: close the scanner and walk.
    if(held){if(Math.hypot(e.clientX-runtime.tapStart.x,e.clientY-runtime.tapStart.y)<20)return;held=false;runtime.stopScanner();runtime.tapStart={...runtime.tapStart,x:e.clientX,y:e.clientY};}
    if(Math.hypot(e.clientX-runtime.tapStart.x,e.clientY-runtime.tapStart.y)>=14){if(!dragging&&fromOverlay)runtime.audio();dragging=true;cancelHold();}
    if(runtime.inWorld()&&dragging){
      // Joystick flotante: la dirección es hacia donde mueves el dedo desde donde empezaste, en cualquier parte de la pantalla.
      let ox=ptr?.ox??runtime.tapStart.x,oy=ptr?.oy??runtime.tapStart.y;const ddx=e.clientX-ox,ddy=e.clientY-oy,l=Math.hypot(ddx,ddy),MAXR=70;
      if(l>MAXR){ox+=ddx/l*(l-MAXR);oy+=ddy/l*(l-MAXR);}
      ptr={x:e.clientX,y:e.clientY,ox,oy};
    }else if(!runtime.inWorld())ptr={x:e.clientX,y:e.clientY};
  });
  const up=e=>{
    if(runtime.housePointerUp?.(e))return;
    if(runtime.fingerTouch&&(runtime.glassPointerUp?.(e)||runtime.materiaPointerUp?.(e)||runtime.vidaPointerUp?.(e)||runtime.mirrorPointerUp?.(e)||runtime.depthUp?.(e)||runtime.encounterUp?.(e)||runtime.ecologyUp?.(e)||runtime.creativePointerUp?.(e)))return;
    if(e.pointerId!==activePointer)return;
    cancelHold();
    if(e.type==="pointerup"&&!held&&!dragging&&!directPulse&&!fromOverlay&&runtime.tapStart&&performance.now()-runtime.tapStart.t<450&&!blocked(document.elementFromPoint(e.clientX,e.clientY))&&!openSurface('.modal:not([hidden])')){if(!runtime.fingerTouch||(!runtime.tapEcho?.(e.clientX,e.clientY)&&!runtime.tapMirror?.(e.clientX,e.clientY)&&!runtime.tapPatch?.(e.clientX,e.clientY)&&!runtime.creativeTap?.(e.clientX,e.clientY)))runtime.sonar('player',runtime.tapStart.t);}   // sin modo dedo, un toque siempre es el pulso del cubo
    runtime.stopScanner();runtime.tapStart=null;ptr=null;activePointer=null;held=dragging=directPulse=fromOverlay=false;
  };
  addEventListener("pointerup",up);addEventListener("pointercancel",up);cv.addEventListener("lostpointercapture",up);
  cv.addEventListener("contextmenu",e=>e.preventDefault());
  addEventListener("keydown",e=>{if(e.code==="KeyE"&&!e.repeat&&(e.target===document.body||e.target===cv||e.target===document.getElementById('bMenu'))&&!openSurface('.modal:not([hidden])'))runtime.startScanner();});
  addEventListener("keyup",e=>{if(e.code==="KeyE")runtime.stopScanner();});
  function cancelInput(){cancelHold();const captured=activePointer;activePointer=null;ptr=null;runtime.tapStart=null;held=dragging=directPulse=fromOverlay=false;for(const key in keys)keys[key]=0;runtime.stopScanner();if(captured!==null)try{cv.releasePointerCapture(captured);}catch(_){}}
  addEventListener('blur',cancelInput);addEventListener('pagehide',cancelInput);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelInput();});
  document.addEventListener('focusin',e=>{if(blocked(e.target))cancelInput();});

  let parts=[],flash=0,pulse=0,lastTrail=null,camX=0,camY=0,curZone=-1,hudT=0,flocks=[],enterFx=0,inPond=false,bolts=[],planted=false,gardenN=0;
  const STARS=Array.from({length:110},()=>({x:Math.random(),y:Math.random(),s:Math.random()<.1?2:1,a:.08+Math.random()*.22}));
  const DUST=Array.from({length:45},()=>({x:Math.random()*2000,y:Math.random()*2000,z:.3+Math.random()*.5,ph:Math.random()*6}));
  let leftT=0,lowT=0,offStreak=0,zoneHops=0,pondT=0,dodgeT=0,lastNoteMs=0,styleMoves=[],idleSaid=false,selSample="luz";const studioHit={};

  Object.defineProperties(runtime, {
    cx: { get: () => cx },
    resizeCanvas: { get: () => resize },
    W: { get: () => W, set: value => { W = value; } },
    H: { get: () => H, set: value => { H = value; } },
    keys: { get: () => keys },
    ptr: { get: () => ptr, set: value => { ptr = value; } },
    parts: { get: () => parts, set: value => { parts = value; } },
    flash: { get: () => flash, set: value => { flash = value; } },
    pulse: { get: () => pulse, set: value => { pulse = value; } },
    lastTrail: { get: () => lastTrail, set: value => { lastTrail = value; } },
    camX: { get: () => camX, set: value => { camX = value; } },
    camY: { get: () => camY, set: value => { camY = value; } },
    curZone: { get: () => curZone, set: value => { curZone = value; } },
    hudT: { get: () => hudT, set: value => { hudT = value; } },
    flocks: { get: () => flocks, set: value => { flocks = value; } },
    enterFx: { get: () => enterFx, set: value => { enterFx = value; } },
    inPond: { get: () => inPond, set: value => { inPond = value; } },
    bolts: { get: () => bolts, set: value => { bolts = value; } },
    planted: { get: () => planted, set: value => { planted = value; } },
    gardenN: { get: () => gardenN, set: value => { gardenN = value; } },
    STARS: { get: () => STARS },
    DUST: { get: () => DUST },
    leftT: { get: () => leftT, set: value => { leftT = value; } },
    lowT: { get: () => lowT, set: value => { lowT = value; } },
    offStreak: { get: () => offStreak, set: value => { offStreak = value; } },
    zoneHops: { get: () => zoneHops, set: value => { zoneHops = value; } },
    pondT: { get: () => pondT, set: value => { pondT = value; } },
    dodgeT: { get: () => dodgeT, set: value => { dodgeT = value; } },
    lastNoteMs: { get: () => lastNoteMs, set: value => { lastNoteMs = value; } },
    styleMoves: { get: () => styleMoves, set: value => { styleMoves = value; } },
    idleSaid: { get: () => idleSaid, set: value => { idleSaid = value; } },
    selSample: { get: () => selSample, set: value => { selSample = value; } },
    studioHit: { get: () => studioHit },
  });
}
