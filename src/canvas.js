// Canvas, input de movimiento y estado visual temporal.
export function initialize(runtime) {
  /* ---------- canvas ---------- */
  const cv=document.getElementById("w"),cx=cv.getContext("2d");
  let W=0,H=0,DPR=1;
  function resize(){DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0);}
  addEventListener("resize",resize);resize();
  const keys={};let ptr=null;
  addEventListener("keydown",e=>{if(e.target?.closest?.('input,textarea,select,[contenteditable="true"]'))return;if(e.key==='Escape')runtime.stopAutopilot?.();keys[e.key.toLowerCase()]=1;runtime.audio();if(e.key.startsWith("Arrow"))e.preventDefault();if(e.code==="Space"&&!e.repeat&&e.target===document.body){e.preventDefault();runtime.sonar();}});
  addEventListener("keyup",e=>{keys[e.key.toLowerCase()]=0;});
  let holdTimer=null,activePointer=null,dragging=false,held=false;
  const cancelHold=()=>{clearTimeout(holdTimer);holdTimer=null;};
  // El juego escucha toda la pantalla: un arrastre que empieza sobre textos del HUD o la Voz también mueve al pixel.
  // Solo se excluyen botones, paneles abiertos y el Estudio.
  const blocked=t=>!!t?.closest?.('button,a,input,select,textarea,label,summary,.modal:not([hidden]),#studioPanel,#scanner,#fxPanel');
  let fromOverlay=false;
  addEventListener("pointerdown",e=>{
    if(e.target===cv||blocked(e.target))return;
    if(!e.isPrimary||activePointer!==null||runtime.S.mode==="studio")return;
    fromOverlay=true;start(e);
  },true);
  cv.addEventListener("pointerdown",e=>{fromOverlay=false;start(e);});
  function start(e){
    if(!e.isPrimary||activePointer!==null)return;
    runtime.audio();if(runtime.S.mode==="studio"){runtime.studioTap(e.clientX,e.clientY);return;}
    activePointer=e.pointerId;dragging=held=false;
    runtime.tapStart={t:performance.now(),x:e.clientX,y:e.clientY};ptr=null;if(!fromOverlay)try{cv.setPointerCapture(e.pointerId);}catch(_){}   // sin captura sobre textos: así un toque en la Voz la sigue abriendo
    if(runtime.inWorld()&&!fromOverlay)holdTimer=setTimeout(()=>{held=true;runtime.startScanner();},500);
    else if(!runtime.inWorld())ptr={x:e.clientX,y:e.clientY};
  }
  addEventListener("pointermove",e=>{
    if(e.pointerId!==activePointer||held||!runtime.tapStart)return;
    if(Math.hypot(e.clientX-runtime.tapStart.x,e.clientY-runtime.tapStart.y)>=14){dragging=true;cancelHold();}
    if(runtime.inWorld()&&dragging){
      // Joystick flotante: la dirección es hacia donde mueves el dedo desde donde empezaste, en cualquier parte de la pantalla.
      let ox=ptr?.ox??runtime.tapStart.x,oy=ptr?.oy??runtime.tapStart.y;const ddx=e.clientX-ox,ddy=e.clientY-oy,l=Math.hypot(ddx,ddy),MAXR=70;
      if(l>MAXR){ox+=ddx/l*(l-MAXR);oy+=ddy/l*(l-MAXR);}
      ptr={x:e.clientX,y:e.clientY,ox,oy};
    }else if(!runtime.inWorld())ptr={x:e.clientX,y:e.clientY};
  });
  const up=e=>{
    if(e.pointerId!==activePointer)return;
    cancelHold();
    if(e.type==="pointerup"&&!held&&!dragging&&!fromOverlay&&runtime.tapStart&&performance.now()-runtime.tapStart.t<240)runtime.sonar();
    runtime.stopScanner();runtime.tapStart=null;ptr=null;activePointer=null;held=dragging=fromOverlay=false;
  };
  addEventListener("pointerup",up);addEventListener("pointercancel",up);cv.addEventListener("lostpointercapture",up);
  cv.addEventListener("contextmenu",e=>e.preventDefault());
  addEventListener("keydown",e=>{if(e.code==="KeyE"&&!e.repeat&&e.target===document.body)runtime.startScanner();});
  addEventListener("keyup",e=>{if(e.code==="KeyE")runtime.stopScanner();});
  addEventListener("blur",()=>{cancelHold();activePointer=null;ptr=null;runtime.tapStart=null;for(const key in keys)keys[key]=0;runtime.stopScanner();});

  let parts=[],flash=0,pulse=0,lastTrail=null,camX=0,camY=0,curZone=-1,hudT=0,flocks=[],enterFx=0,inPond=false,bolts=[],planted=false,gardenN=0;
  const STARS=Array.from({length:110},()=>({x:Math.random(),y:Math.random(),s:Math.random()<.1?2:1,a:.08+Math.random()*.22}));
  const DUST=Array.from({length:45},()=>({x:Math.random()*2000,y:Math.random()*2000,z:.3+Math.random()*.5,ph:Math.random()*6}));
  let leftT=0,lowT=0,offStreak=0,zoneHops=0,pondT=0,dodgeT=0,lastNoteMs=0,styleMoves=[],idleSaid=false,selSample="luz";const studioHit={};

  Object.defineProperties(runtime, {
    cx: { get: () => cx },
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
