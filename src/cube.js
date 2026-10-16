import {normalizeCube} from './cube-model.js';
import {CUBE_DEFAULTS,wardrobeByType,cubeStyleUnlocked} from './wardrobe-model.js';
import {cubeSurface,cubeAura,cubeHalo,cubeTrailPreview} from './cube-art.js';
import {PULSE_FAMILIES,PULSE_FORMS,ownedPulses,pulseForm,pulseHint,drawPulse} from './pulse-forms.js';
export function initialize(runtime){
 const S=()=>runtime.S,$=runtime.$;let owner=null,path=[],last=null,inspection=null,draft=null,tab='appearance',previewName='',pulseFamily='ring';
 function settings(){if(owner!==S()){owner=S();S().cube=normalizeCube(S().cube||{color:S().color},S().ach,S().rewards);path=[];last=null;inspection=null;draft=null;}return S().cube;}
 const safe=()=>settings().version===2?settings():{version:2,...CUBE_DEFAULTS};
 function unlocked(p){return cubeStyleUnlocked(p.type,p.value,S().ach,S().rewards)||(p.type==='color'&&runtime.colorOk([p.value,p.name,p.ach||'reward:'+p.id]));}
 function choose(type,value){const p=wardrobeByType(type).find(p=>p.value===value);if(!p)return false;
  if(settings().version!==2)return false;
  if(!unlocked(p)){inspection=p;drawPanel();return false;}inspection=null;const previous={...settings()},color=S().color;settings()[type]=value;if(type==='color')S().color=value;
  if(!runtime.save()){S().cube=previous;S().color=color;drawPanel();$('cubeHint').textContent='No se guardó. Conserva una copia e intenta otra vez.';return false;}
  if(draft)draft={...settings()};drawPanel();return true;
 }
 function inspectStyle(type,value){const p=wardrobeByType(type).find(p=>p.value===value);if(!p||settings().version!==2)return;draft||={...safe()};if(!unlocked(p)){inspection=p;}else{inspection=null;previewName=p.name;draft[type]=value;}drawPanel();}
 function apply(){if(!draft||settings().version!==2)return false;const previous=settings(),color=S().color;S().cube=normalizeCube({...previous,...draft},S().ach,S().rewards);S().color=S().cube.color;
  if(!runtime.save()){S().cube=previous;S().color=color;$('cubeHint').textContent='No se guardó. Conserva una copia e intenta otra vez.';return false;}
  draft=null;inspection=null;$('mCube').hidden=true;return true;
 }
 function close(){draft=null;inspection=null;previewName='';$('mCube').hidden=true;}
 function drawPanel(){const current=settings(),s=draft||safe(),focused=document.activeElement?.dataset,pulseFocus=focused?.pulseForm,focus=focused?.cubeStyleType?{type:focused.cubeStyleType,value:focused.cubeStyleValue}:null,groups={color:'cubeColors',material:'cubeMaterials',form:'cubeForms',trail:'cubeTrails',halo:'cubeHalos',aura:'cubeAuras',voice:'cubeVoices'};let owned=0;
  for(const [type,id]of Object.entries(groups)){$(id).replaceChildren();for(const p of wardrobeByType(type).slice().sort((a,b)=>Number(unlocked(b))-Number(unlocked(a)))){const ok=unlocked(p);if(ok)owned++;const b=document.createElement('button');b.type='button';b.className=type==='color'?'cube-swatch':'cube-option';b.dataset.locked=String(!ok);b.dataset.earned=String(ok&&!p.free);b.setAttribute('aria-label',p.name);b.setAttribute('aria-pressed',String(ok&&s[type]===p.value));b.title=ok?p.name:p.hint;
    if(type==='color'){b.style.background=ok?p.value:'#000';if(!ok)b.textContent='□';}else b.textContent=(ok?'':'□ ')+p.name;
    b.dataset.cubeStyleType=type;b.dataset.cubeStyleValue=p.value;b.disabled=current.version!==2;b.onclick=()=>inspectStyle(type,p.value);$(id).append(b);}}
  drawPulses(s,current);
  $('cubeCount').textContent=owned+' de 50';if($('cubePulseCount'))$('cubePulseCount').textContent='Ondas '+ownedPulses(S()).size+'/50';$('cubeHint').textContent=current.version!==2?'Actualiza para editar este cubo.':inspection?inspection.hint:previewName?previewName+' · Vista previa sin guardar.':'Prueba aquí. Aplica cuando esté listo.';
  $('cubeApply').disabled=current.version!==2||!['pulse',...Object.keys(CUBE_DEFAULTS)].some(k=>s[k]!==current[k]);$('cubeRestore').disabled=current.version!==2;
  for(const b of $('cubeTabs').querySelectorAll('[role="tab"]')){const selected=b.dataset.cubeTab===tab;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;}
  for(const p of $('mCube').querySelectorAll('[data-cube-panel]'))p.hidden=p.dataset.cubePanel!==tab;
  const preview=$('cubePreview');preview.style.setProperty('--cube-ink',inspection?'#fff':s.color);preview.dataset.silhouette=String(!!inspection);for(const type of Object.keys(CUBE_DEFAULTS))preview.dataset[type]=s[type];
  if(focus&&!$('mCube').hidden)[...$(groups[focus.type]).querySelectorAll('button')].find(b=>b.dataset.cubeStyleValue===focus.value)?.focus();
  if(pulseFocus&&!$('mCube').hidden)[...$('cubePulses').querySelectorAll('button')].find(b=>b.dataset.pulseForm===pulseFocus)?.focus();
 }
 function drawPulses(s,current){const family=$('cubePulseFamily'),list=$('cubePulses');if(!family||!list)return;
  if(!family.options.length)for(const p of PULSE_FAMILIES){const option=document.createElement('option');option.value=p.id;option.textContent=p.name;family.append(option);}
  family.value=pulseFamily;const unlocked=ownedPulses(S());list.replaceChildren();
  for(const p of PULSE_FORMS.filter(p=>p.family===pulseFamily)){const ok=unlocked.has(p.id),b=document.createElement('button');b.type='button';b.className='cube-option';b.textContent=(ok?'':'□ ')+p.name;b.dataset.pulseForm=p.id;b.dataset.earned=String(ok&&p.id!=='ring-0');b.setAttribute('aria-pressed',String(ok&&(s.pulse||'ring-0')===p.id));b.title=ok?p.name:pulseHint(p.id);b.disabled=current.version!==2;
   b.onclick=()=>{if(!ok){inspection={type:'pulse',value:p.id,hint:pulseHint(p.id)};}else{draft||={...safe()};draft.pulse=p.id;previewName=p.name;inspection=null;}drawPanel();};list.append(b);}
 }
 if($('cubePulseFamily'))$('cubePulseFamily').onchange=e=>{pulseFamily=e.target.value;drawPanel();};
 $('bCube').onclick=()=>{$('mMenu').hidden=true;settings();draft={...safe()};pulseFamily=pulseForm(draft.pulse).family;inspection=null;previewName='';drawPanel();$('mCube').hidden=false;};$('cubeClose').onclick=close;$('cubeApply').onclick=apply;
 $('cubeRestore').onclick=()=>{draft={...safe(),...CUBE_DEFAULTS,pulse:'ring-0'};inspection=null;previewName='Cubo original';drawPanel();};
 $('cubeTabs').onclick=e=>{const b=e.target.closest('[data-cube-tab]');if(b){tab=b.dataset.cubeTab;drawPanel();}};
 $('cubeTabs').onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...$('cubeTabs').querySelectorAll('[role="tab"]')],i=tabs.findIndex(b=>b.dataset.cubeTab===tab),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tab=tabs[next].dataset.cubeTab;drawPanel();tabs[next].focus();};
 addEventListener('keydown',e=>{if(e.key==='Escape')close();});
 function draw(t,dt,beat,size){if(!runtime.inWorld()){path=[];last=null;return;}const s=safe(),c=runtime.cx,x=S().wx,y=S().wy;
  if(!last||Math.hypot(x-last.x,y-last.y)>400){path=[];last={x,y};}if(Math.hypot(x-last.x,y-last.y)>7){path.push({x,y,a:1});if(path.length>28)path.shift();last={x,y};}
  for(const p of path)p.a-=dt*.8;path=path.filter(p=>p.a>0);c.save();c.fillStyle=c.strokeStyle=s.color;c.lineWidth=1;
  if(s.trail==='line'&&path.length>1){c.globalAlpha=.25;c.beginPath();path.forEach((p,i)=>{const px=p.x+runtime.W/2-x,py=p.y+runtime.H/2-y;i?c.lineTo(px,py):c.moveTo(px,py);});c.stroke();}
  else if(s.trail!=='none')path.forEach((p,i)=>{if(s.trail==='notes'&&i%3)return;const px=p.x+runtime.W/2-x,py=p.y+runtime.H/2-y;c.globalAlpha=p.a*.3;
   if(s.trail==='orbit'){c.beginPath();c.arc(px,py,2,0,Math.PI*2);c.stroke();}else if(s.trail==='steps'){c.fillRect(px+(i%2?2:-2),py,1,3);}else if(s.trail==='grains'){for(let j=0;j<2;j++)c.fillRect(px+Math.sin(i+j)*2,py+Math.cos(i+j)*2,1,1);}else if(s.trail==='weave'){c.beginPath();c.moveTo(px-2,py-2);c.lineTo(px+2,py+2);c.stroke();}else{c.fillRect(px,py,2,2);if(s.trail==='notes'){c.beginPath();c.moveTo(px+2,py);c.lineTo(px+2,py-5);c.stroke();}}});
  cubeHalo(c,s,runtime.W/2,runtime.H/2,size,t,beat);
  cubeAura(c,s,runtime.W/2,runtime.H/2,t,beat);c.restore();
 }
 function previewDraw(t,beat){if($('mCube').hidden)return;const base=draft||safe(),s=inspection?{...base,[inspection.type]:inspection.value,color:inspection.type==='color'?'#fff':base.color}:base,cv=$('cubePreviewCanvas'),w=Math.max(100,$('cubePreview').clientWidth),h=70,dpr=Math.min(devicePixelRatio||1,2),reduced=S().reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;if(reduced){t=0;beat=0;}if(cv.width!==Math.round(w*dpr)||cv.height!==h*dpr){cv.width=Math.round(w*dpr);cv.height=h*dpr;}const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#000';c.fillRect(0,0,w,h);const x=w*.52+(reduced?0:Math.sin(t/1600)*12),y=h/2;
  cubeTrailPreview(c,s,x,y,t);cubeHalo(c,s,x,y,14,t,beat);cubeAura(c,s,x,y,t,beat);c.save();c.strokeStyle=s.color;c.lineWidth=1;c.globalAlpha=.55;drawPulse(c,pulseForm(s.pulse),x,y,reduced?26:10+(t%2200)/2200*20,reduced);c.restore();c.globalAlpha=inspection?.5:1;c.fillStyle=s.color;c.fillRect(x-7,y-7,14,14);cubeSurface(c,s,x,y,14,t,beat);
 }
 function surface(t,beat,size){if(!runtime.inWorld())return;const c=runtime.cx,s=safe();c.save();if(runtime.quietState?.stage>=6||runtime.hasPower?.('cometa')){c.translate(runtime.W/2,runtime.H/2);c.rotate(Math.sin(t/600)*.12);cubeSurface(c,s,0,0,size,t,beat);}else cubeSurface(c,s,runtime.W/2,runtime.H/2,size,t,beat);c.restore();}
 Object.defineProperties(runtime,{cubeColor:{get:()=>()=>safe().color},cubeSettings:{get:()=>settings},chooseCubeStyle:{get:()=>choose},drawCubeStyle:{get:()=>draw},drawCubePreview:{get:()=>previewDraw},drawCubeSurface:{get:()=>surface}});
}
