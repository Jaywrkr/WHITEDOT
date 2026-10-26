import {openSurface} from './frame-state.js';
import {elementInk,elementAlpha} from './visual.js';
import {contactEntry} from './contact.js';
export function initialize(runtime){
 let gesture=null,lastEmission=-Infinity;
 const surface=()=>runtime.inWorld()&&(runtime.S.layer||'superficie')==='superficie';
 const playable=()=>surface()&&!runtime.scanning&&!document.hidden&&!openSurface('.modal:not([hidden])');
 const audible=()=>playable()&&runtime.S.sound&&runtime.ac?.state==='running';
 const kind=o=>`ecology:${o.kind}:${o.channel}`;
 const motif=o=>((o.variant+Math.round(o.bend*3))%8+8)%8;
 function visible(){if(!surface()||runtime.worldIdentity.generatorVersion!==2)return [];const a=Math.floor(runtime.S.wx/runtime.WCH),b=Math.floor(runtime.S.wy/runtime.WCH),out=[];
  for(let x=a-1;x<=a+1;x++)for(let y=b-1;y<=b+1;y++)out.push(...(runtime.wchunk(x,y).ecologyObjects||[]));return out.filter(o=>Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<450);
 }
 function record(o){runtime.recordElement?.(kind(o),runtime.regionOfPos(o.hx,o.hy));runtime.S.journal.ecologies||={};runtime.S.journal.ecologyObjects||={};runtime.S.journal.ecologyObjects[o.kind]=1;
  const e=runtime.regionOfPos(o.hx,o.hy).ecology;if(e)runtime.S.journal.ecologies[e.id]=1;
  runtime.creativeAction?.(o.channel,'touch');runtime.unlock('ecologyTouch');if(Object.keys(runtime.S.journal.ecologyObjects).length>=4)runtime.unlock('ecologyFour');runtime.save();
 }
 function respond(o){if(!audible())return false;const now=performance.now();if(now<o.cd||now-lastEmission<260)return false;
  lastEmission=now;o.cd=now+Math.max(650,o.personality.cooldown);o.lit=1;o.charge=Math.max(o.charge,.2);if(o.kind==='pod')o.flight=1;
  const region=runtime.regionOfPos(o.hx,o.hy);runtime.touched();runtime.MU.act+=.08;
  runtime.driveInfluence?.(region,o.channel,.35+.35*o.charge,motif(o));
  runtime.beatSoon(q=>runtime.playVoice(kind(o),motif(o)%7,q,region,false,.5,o,'player'));record(o);return true;
 }
 function hit(e){const x=runtime.S.wx+e.clientX-runtime.W/2,y=runtime.S.wy+e.clientY-runtime.H/2;return visible().find(o=>Math.hypot(o.x-x,o.y-y)<Math.max(18,o.size+6)&&Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy)<240);}
 function down(e){if(!e.isPrimary||gesture||!playable())return false;const o=hit(e);if(!o)return false;
  runtime.audio();runtime.stopAutopilot?.();gesture={id:e.pointerId,o,x:e.clientX,y:e.clientY,bend:o.bend,charge:o.charge,moved:false};try{runtime.$('w').setPointerCapture(e.pointerId);}catch(_){}return true;
 }
 function move(e){if(gesture?.id!==e.pointerId)return false;if(!playable()){cancel();return true;}const g=gesture,dx=e.clientX-g.x,dy=e.clientY-g.y;g.moved||=Math.hypot(dx,dy)>10;
  if(g.moved){g.o.bend=Math.max(-1,Math.min(1,dx/70));g.o.charge=Math.max(0,Math.min(1,.5-dy/120));}return true;
 }
 function cancel(){if(gesture){gesture.o.bend=gesture.bend;gesture.o.charge=gesture.charge;}gesture=null;}
 function up(e){if(gesture?.id!==e.pointerId)return false;if(e.type!=='pointerup'||!playable()){cancel();return true;}const g=gesture;gesture=null;
  if(g.moved&&audible()){runtime.driveInfluence?.(runtime.regionOfPos(g.o.hx,g.o.hy),g.o.channel,g.o.charge,motif(g.o));record(g.o);}else if(hit(e)===g.o)respond(g.o);return true;
 }
 function tick(dt,paused){if(gesture&&(!playable()||paused))cancel();if(!surface())return;
  for(const o of visible()){
   const distance=Math.hypot(o.hx-runtime.S.wx,o.hy-runtime.S.wy);o.lit=Math.max(0,o.lit-dt*1.2);
   if(paused||!playable())continue;
   if(o===gesture?.o)continue;
   if(o.flight>0){o.flight=Math.max(0,o.flight-dt*.22);o.x=o.hx+Math.sin((1-o.flight)*Math.PI*2+o.phase)*o.flight*32;o.y=o.hy-Math.sin(o.flight*Math.PI)*42;}
   else{o.x=o.hx;o.y=o.hy;}
   const entered=contactEntry(o,distance<22,true),wave=runtime.waves.length&&runtime.hitW(o.x,o.y);
   if(entered||wave)respond(o);
   if(audible()){
    const growTime={reed:6,pod:8,lichen:12,stone:10,filament:14,coral:9}[o.kind];
    const tending=distance<52&&runtime.MU.speed<.06;o.charge=Math.max(0,Math.min(1,o.charge+dt*(tending?1/growTime:-1/18)));
    if(tending&&o.charge>.15)runtime.driveInfluence?.(runtime.regionOfPos(o.hx,o.hy),o.channel,o.charge*.65,motif(o));
    if(tending&&o.charge>.95){runtime.unlock('ecologyGrow');if(!o.grown){o.grown=true;record(o);}}
   }
  }
 }
 function drawTerrain(chunk,ox,oy,R){const e=chunk.ecology;if(!e||e.density===0)return;const c=runtime.cx,scale=e.terrainScale,[cx,cy]=chunk.id.split(',').map(Number),size=runtime.WCH;
  const x0=Math.max(cx*size,Math.floor((runtime.S.wx-R)/scale)*scale),y0=Math.max(cy*size,Math.floor((runtime.S.wy-R)/scale)*scale);
  c.save();c.strokeStyle=elementInk(e.material,runtime.regionOfPos(cx*size+1,cy*size+1).hue);c.lineWidth=1;const texture=runtime.groundTexture?.()??1;
  for(let x=x0;x<Math.min((cx+1)*size,runtime.S.wx+R);x+=scale)for(let y=y0;y<Math.min((cy+1)*size,runtime.S.wy+R);y+=scale){
   const h=runtime.seedOf(`ecology:v2:terrain:${Math.round(x)},${Math.round(y)}`)%1000/1000,d=Math.hypot(x-runtime.S.wx,y-runtime.S.wy);if(d>R||h>.28+e.density*.28)continue;
   const field=decorativeField(x,y,runtime.seedOf);if(field<.002)continue;const px=x+ox,py=y+oy,r=5+h*13;c.globalAlpha=.12*(1-d/R)*field*texture;c.beginPath();
   if(e.terrain==='ripples')c.ellipse(px,py,r*1.5,r*.5,0,0,Math.PI*2);
   else if(e.terrain==='cells'){for(let i=0;i<=6;i++){const a=i*Math.PI/3;i?c.lineTo(px+Math.cos(a)*r,py+Math.sin(a)*r):c.moveTo(px+r,py);}}
   else if(e.terrain==='roots'){c.moveTo(px-r,py+r);c.quadraticCurveTo(px,py-r,px+r,py);c.moveTo(px,py);c.lineTo(px+r*.6,py-r);}
   else if(e.terrain==='ridges'){c.moveTo(px-r,py);c.quadraticCurveTo(px,py-r,px+r,py);c.moveTo(px-r,py+4);c.quadraticCurveTo(px,py-r+4,px+r,py+4);}
   else {c.moveTo(px-2,py);c.lineTo(px+2,py);c.moveTo(px,py-2);c.lineTo(px,py+2);}c.stroke();
  }c.restore();
 }
 function draw(chunk,t,ox,oy,R){drawTerrain(chunk,ox,oy,R);const c=runtime.cx;
  for(const o of chunk.ecologyObjects||[]){const d=Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy);if(d>R*1.2)continue;
   const sw=Math.sin(t/o.personality.period+o.phase)*3+o.bend*10,s=o.size*(1+o.charge*.15);
   c.save();c.translate(o.x+ox,o.y+oy);c.globalAlpha=elementAlpha(d,R,o.lit)*.7;c.strokeStyle=elementInk(o.material,chunk.pal?runtime.regionOfPos(o.hx,o.hy).hue:190,o.lit>.1);c.fillStyle=c.strokeStyle;c.lineWidth=1.2;c.beginPath();
   // Seen from above: reeds are three short rays from a centre, swaying as a turn.
   if(o.kind==='reed'){for(let i=0;i<3;i++){const a=i*Math.PI*2/3+sw*.05;c.moveTo(0,0);c.lineTo(Math.cos(a)*s,Math.sin(a)*s);c.moveTo(Math.cos(a)*s+2,Math.sin(a)*s);c.arc(Math.cos(a)*s,Math.sin(a)*s,2,0,Math.PI*2);}}
   else if(o.kind==='pod'){c.rotate(sw*.04);c.ellipse(0,0,s*.6,s,0,0,Math.PI*2);c.moveTo(0,-s);c.quadraticCurveTo(sw,0,0,s);}
   else if(o.kind==='lichen'){for(let i=0;i<5;i++){const a=i*Math.PI*2/5;c.moveTo(0,0);c.quadraticCurveTo(Math.cos(a+.4)*s*.5,Math.sin(a+.4)*s*.5,Math.cos(a)*s,Math.sin(a)*s);}}
   else if(o.kind==='stone'){c.ellipse(0,0,s,s*.55,sw*.03,0,Math.PI*2);for(let i=-1;i<=1;i++){c.moveTo(-s*.65,i*4);c.lineTo(s*.65,i*4+sw*.2);}}
   else if(o.kind==='filament'){c.moveTo(-s,0);c.bezierCurveTo(-s/2,-s+sw,s/2,s+sw,s,0);}
   else {for(let i=0;i<4;i++){const a=i*Math.PI/2+sw*.04;c.moveTo(0,0);c.lineTo(Math.cos(a)*s,Math.sin(a)*s);c.moveTo(Math.cos(a)*s*.5,Math.sin(a)*s*.5);c.lineTo(Math.cos(a+.6)*s*.8,Math.sin(a+.6)*s*.8);}}
   c.stroke();if(o.charge>.12){c.globalAlpha*=.6;c.beginPath();c.arc(0,0,s+5,-Math.PI/2,-Math.PI/2+o.charge*Math.PI*2);c.stroke();}c.restore();
  }
 }
 const sources=()=>visible().map(o=>({object:o,kind:kind(o),name:o.name,distance:Math.hypot(o.x-runtime.S.wx,o.y-runtime.S.wy),hint:'Toca · arrastra para modelar · quédate cerca para cultivar'})).filter(o=>o.distance<250);
 Object.defineProperties(runtime,{ecologyTick:{get:()=>tick},drawEcology:{get:()=>draw},ecologySources:{get:()=>sources},ecologyDown:{get:()=>down},ecologyMove:{get:()=>move},ecologyUp:{get:()=>up},ecologyEngaged:{get:()=>!!gesture}});
}
import {decorativeField} from './territory-presentation.js';
