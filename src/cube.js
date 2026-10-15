import {normalizeCube} from './cube-model.js';
import {CUBE_DEFAULTS,wardrobeByType,cubeStyleUnlocked} from './wardrobe-model.js';
import {cubeSurface,cubeAura,cubeHalo,cubeTrailPreview} from './cube-art.js';
export function initialize(runtime){
 const S=()=>runtime.S,$=runtime.$;let owner=null,path=[],last=null,inspection=null;
 function settings(){if(owner!==S()){owner=S();S().cube=normalizeCube(S().cube||{color:S().color},S().ach,S().rewards);path=[];last=null;inspection=null;}return S().cube;}
 function unlocked(p){return cubeStyleUnlocked(p.type,p.value,S().ach,S().rewards)||(p.type==='color'&&runtime.colorOk([p.value,p.name,p.ach||'reward:'+p.id]));}
 function choose(type,value){const p=wardrobeByType(type).find(p=>p.value===value);if(!p)return false;
  if(!unlocked(p)){inspection=p;drawPanel();return false;}inspection=null;settings()[type]=value;if(type==='color')S().color=value;runtime.save();drawPanel();return true;
 }
 function drawPanel(){const s=settings(),groups={color:'cubeColors',material:'cubeMaterials',form:'cubeForms',trail:'cubeTrails',halo:'cubeHalos',aura:'cubeAuras',voice:'cubeVoices'};let owned=0;
  for(const [type,id]of Object.entries(groups)){$(id).replaceChildren();for(const p of wardrobeByType(type)){const ok=unlocked(p);if(ok)owned++;const b=document.createElement('button');b.type='button';b.className=type==='color'?'cube-swatch':'cube-option';b.dataset.locked=String(!ok);b.dataset.earned=String(ok&&!p.free);b.setAttribute('aria-label',p.name);b.setAttribute('aria-pressed',String(ok&&s[type]===p.value));b.title=ok?p.name:p.hint;
    if(type==='color'){b.style.background=ok?p.value:'#000';if(!ok)b.textContent='□';}else b.textContent=(ok?'':'□ ')+p.name;
    b.onclick=()=>choose(type,p.value);$(id).append(b);}}
  $('cubeCount').textContent=owned+' de 50';$('cubeHint').textContent=inspection?inspection.hint:'Tu pulso suena con el cubo en el Mundo.';
  const preview=$('cubePreview');preview.style.setProperty('--cube-ink',inspection?'#fff':s.color);preview.dataset.silhouette=String(!!inspection);for(const type of Object.keys(CUBE_DEFAULTS))preview.dataset[type]=s[type];
 }
 $('bCube').onclick=()=>{$('mMenu').hidden=true;inspection=null;drawPanel();$('mCube').hidden=false;};$('cubeClose').onclick=()=>$('mCube').hidden=true;
 addEventListener('keydown',e=>{if(e.key==='Escape')$('mCube').hidden=true;});
 function draw(t,dt,beat,size){if(!runtime.inWorld()){path=[];last=null;return;}const s=settings(),c=runtime.cx,x=S().wx,y=S().wy;
  if(!last||Math.hypot(x-last.x,y-last.y)>400){path=[];last={x,y};}if(Math.hypot(x-last.x,y-last.y)>7){path.push({x,y,a:1});if(path.length>28)path.shift();last={x,y};}
  for(const p of path)p.a-=dt*.8;path=path.filter(p=>p.a>0);c.save();c.fillStyle=c.strokeStyle=s.color;c.lineWidth=1;
  if(s.trail==='line'&&path.length>1){c.globalAlpha=.25;c.beginPath();path.forEach((p,i)=>{const px=p.x+runtime.W/2-x,py=p.y+runtime.H/2-y;i?c.lineTo(px,py):c.moveTo(px,py);});c.stroke();}
  else if(s.trail!=='none')path.forEach((p,i)=>{if(s.trail==='notes'&&i%3)return;const px=p.x+runtime.W/2-x,py=p.y+runtime.H/2-y;c.globalAlpha=p.a*.3;
   if(s.trail==='orbit'){c.beginPath();c.arc(px,py,2,0,Math.PI*2);c.stroke();}else if(s.trail==='steps'){c.fillRect(px+(i%2?2:-2),py,1,3);}else if(s.trail==='grains'){for(let j=0;j<2;j++)c.fillRect(px+Math.sin(i+j)*2,py+Math.cos(i+j)*2,1,1);}else if(s.trail==='weave'){c.beginPath();c.moveTo(px-2,py-2);c.lineTo(px+2,py+2);c.stroke();}else{c.fillRect(px,py,2,2);if(s.trail==='notes'){c.beginPath();c.moveTo(px+2,py);c.lineTo(px+2,py-5);c.stroke();}}});
  cubeHalo(c,s,runtime.W/2,runtime.H/2,size,t,beat);
  cubeAura(c,s,runtime.W/2,runtime.H/2,t,beat);c.restore();
 }
 function previewDraw(t,beat){if($('mCube').hidden)return;const s=settings(),cv=$('cubePreviewCanvas'),w=Math.max(100,$('cubePreview').clientWidth),h=70,dpr=Math.min(devicePixelRatio||1,2);if(cv.width!==Math.round(w*dpr)||cv.height!==h*dpr){cv.width=Math.round(w*dpr);cv.height=h*dpr;}const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#000';c.fillRect(0,0,w,h);const x=w*.52+Math.sin(t/1600)*12,y=h/2;
  if(inspection){c.strokeStyle='#ffffff66';c.strokeRect(x-7,y-7,14,14);return;}cubeTrailPreview(c,s,x,y,t);cubeHalo(c,s,x,y,14,t,beat);cubeAura(c,s,x,y,t,beat);c.globalAlpha=1;c.fillStyle=s.color;c.fillRect(x-7,y-7,14,14);cubeSurface(c,s,x,y,14,t,beat);
 }
 function surface(t,beat,size){if(!runtime.inWorld())return;const c=runtime.cx,s=settings();c.save();if(runtime.quietState?.stage>=6||runtime.hasPower?.('cometa')){c.translate(runtime.W/2,runtime.H/2);c.rotate(Math.sin(t/600)*.12);cubeSurface(c,s,0,0,size,t,beat);}else cubeSurface(c,s,runtime.W/2,runtime.H/2,size,t,beat);c.restore();}
 Object.defineProperties(runtime,{cubeColor:{get:()=>()=>settings().color},cubeSettings:{get:()=>settings},chooseCubeStyle:{get:()=>choose},drawCubeStyle:{get:()=>draw},drawCubePreview:{get:()=>previewDraw},drawCubeSurface:{get:()=>surface}});
}
