import {prefersReducedMotion} from './frame-state.js';
import {wonderPortrait} from './musical-wonders-art.js';
import {normalizeCube} from './cube-model.js';
import {CUBE_DEFAULTS,wardrobeByType,cubeStyleUnlocked} from './wardrobe-model.js';
import {cubeSurface,cubeAura,cubeHalo,cubeTrailPreview} from './cube-art.js';
import {PULSE_FAMILIES,PULSE_FORMS,ownedPulses,pulseForm,pulseHint,drawPulse} from './pulse-forms.js';
import {CUBE_SHOP,shopPiece,wearing} from './cube-shop-model.js';
import {makeStage,drawStage,pieceImage} from './cube-shop-preview.js';
import {SHOP_PULSES} from './cube-shop-pulse.js';
export function initialize(runtime){
 const S=()=>runtime.S,$=runtime.$;let owner=null,path=[],last=null,hint='',tab='wear',pulseFamily='ring',stage=null;
 function settings(){if(owner!==S()){owner=S();S().cube=normalizeCube(S().cube||{color:S().color},S().ach,S().rewards);path=[];last=null;hint='';}return S().cube;}
 const safe=()=>settings().version===2?settings():{version:2,...CUBE_DEFAULTS};
 function unlocked(p){return cubeStyleUnlocked(p.type,p.value,S().ach,S().rewards)||(p.type==='color'&&runtime.colorOk([p.value,p.name,p.ach||'reward:'+p.id]));}
 const shop=()=>runtime.sparkEconomy||{},shopTrail=()=>shop().wear?.trail||'';
 // Everything changes at once and is saved; a failed save puts the cube back as it was.
 function choose(type,value){const p=type==='pulse'?{value}:type==='wonder'?{value}:wardrobeByType(type).find(p=>p.value===value);if(!p)return false;
  if(settings().version!==2)return false;
  if(type!=='pulse'&&type!=='wonder'&&!unlocked(p)){hint=p.hint;drawPanel();return false;}hint='';const previous={...settings()},color=S().color;settings()[type]=value;if(type==='color')S().color=value;
  if(!runtime.save()){S().cube=previous;S().color=color;hint='No se guardó. Intenta otra vez.';drawPanel();return false;}
  // One trail at a time: an earned trail takes off a bought one.
  if(type==='trail'&&value!=='none'&&shopTrail())runtime.unequipSparkStyle?.(shopTrail());
  // Likewise one pulse shape: an earned shape takes off a bought look.
  if(type==='pulse'&&value!=='ring-0'&&SHOP_PULSES.includes(shop().wear?.pulse))runtime.unequipSparkStyle?.(shop().wear.pulse);
  drawPanel();return true;
 }
 function close(){hint='';$('mCube').hidden=true;}
 function wearPiece(id){const q=shop(),piece=shopPiece(id);if(!piece)return;
  if(wearing(q,id)){if(!runtime.unequipSparkStyle?.(id))hint='No se guardó. Intenta otra vez.';}
  else if(runtime.equipSparkStyle?.(id)){if(piece.slot==='trail'&&settings().trail!=='none')choose('trail','none');if(SHOP_PULSES.includes(id)&&(settings().pulse||'ring-0')!=='ring-0')choose('pulse','ring-0');}else hint='No se guardó. Intenta otra vez.';
  drawPanel();
 }
 function pieceButton(id){const q=shop(),p=shopPiece(id),b=document.createElement('button');b.type='button';b.className='cube-piece';b.dataset.shopPiece=id;b.dataset.earned='false';b.setAttribute('aria-pressed',String(wearing(q,id)));b.title=p.text;
  const img=document.createElement('img');img.alt='';img.src=pieceImage(id,{color:safe().color,ink:runtime.musicInk?.(null,'lead')||'#fff',reduced:still()});const name=document.createElement('span');name.textContent=p.name;b.append(img,name);b.onclick=()=>wearPiece(id);return b;}
 function drawOwned(){const q=shop(),owned=CUBE_SHOP.filter(p=>q.purchases?.[p.id]);
  for(const box of $('mCube').querySelectorAll('[data-owned-slot]')){const list=owned.filter(p=>p.slot===box.dataset.ownedSlot);box.hidden=!list.length;box.querySelector('.cube-options').replaceChildren(...list.map(p=>pieceButton(p.id)));}
  for(const p of owned.filter(p=>p.slot==='trail'))$('cubeTrails').append(pieceButton(p.id));
  return owned.length;
 }
 const still=()=>!!(S().reducedMotion||prefersReducedMotion());
 function drawPanel(){const current=settings(),s=safe(),focused=document.activeElement?.dataset,pulseFocus=focused?.pulseForm,pieceFocus=focused?.shopPiece,focus=focused?.cubeStyleType?{type:focused.cubeStyleType,value:focused.cubeStyleValue}:null,groups={color:'cubeColors',material:'cubeMaterials',form:'cubeForms',trail:'cubeTrails',halo:'cubeHalos',aura:'cubeAuras',voice:'cubeVoices'};let owned=0;
  for(const [type,id]of Object.entries(groups)){$(id).replaceChildren();for(const p of wardrobeByType(type).slice().sort((a,b)=>Number(unlocked(b))-Number(unlocked(a)))){const ok=unlocked(p);if(ok)owned++;const b=document.createElement('button');b.type='button';b.className=type==='color'?'cube-swatch':'cube-option';b.dataset.locked=String(!ok);b.dataset.earned=String(ok&&!p.free);b.setAttribute('aria-label',p.name);b.setAttribute('aria-pressed',String(ok&&s[type]===p.value&&!(type==='trail'&&shopTrail())));b.title=ok?p.name:p.hint;
    if(type==='color'){b.style.background=ok?p.value:'#000';if(!ok)b.textContent='□';}else b.textContent=(ok?'':'□ ')+p.name;
    b.dataset.cubeStyleType=type;b.dataset.cubeStyleValue=p.value;b.disabled=current.version!==2;b.onclick=()=>choose(type,p.value);$(id).append(b);}}
  const bought=drawOwned();
  const gifts=runtime.wonderGifts||[],gift=gifts.find(d=>d.id===s.wonder);$('cubeWonder').innerHTML='<option value="">Sin regalo</option>'+gifts.map(d=>'<option value="'+d.id+'" '+(s.wonder===d.id?'selected':'')+'>'+d.gift+'</option>').join('');$('cubeWonder').disabled=current.version!==2||!gifts.length;
  $('cubeGiftPortrait').innerHTML=gift?wonderPortrait(gift.id):'<span aria-hidden="true">◇</span>';$('cubeGiftName').textContent=gift?gift.name:'Regalos del universo';$('cubeGiftStatus').textContent=!gifts.length?'Encuentra un hallazgo para desbloquear su regalo.':gift?'Lo llevas':'Elige un regalo o no lleves ninguno.';$('cubeGiftCount').textContent=gifts.length+' de 20 encontrados';
  drawPulses(s,current);
  $('cubeCount').textContent='Ganado jugando '+owned+' de 50'+(bought?' · Comprado '+bought:'')+'. Toca para ponértelo; tócalo otra vez para quitarlo.';if($('cubePulseCount'))$('cubePulseCount').textContent='Ondas '+ownedPulses(S()).size+'/50';$('cubeHint').textContent=current.version!==2?'Actualiza para cambiar este cubo.':hint;
  $('cubeRestore').disabled=current.version!==2;
  for(const b of $('cubeTabs').querySelectorAll('[role="tab"]')){const selected=b.dataset.cubeTab===tab;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;}
  for(const p of $('mCube').querySelectorAll('[data-cube-panel]'))p.hidden=p.dataset.cubePanel!==tab;
  const preview=$('cubePreview');preview.style.setProperty('--cube-ink',s.color);for(const type of Object.keys(CUBE_DEFAULTS))preview.dataset[type]=s[type];
  runtime.renderSparks?.();
  if(focus&&!$('mCube').hidden)[...$(groups[focus.type]).querySelectorAll('button')].find(b=>b.dataset.cubeStyleValue===focus.value)?.focus();
  if(pulseFocus&&!$('mCube').hidden)[...$('cubePulses').querySelectorAll('button')].find(b=>b.dataset.pulseForm===pulseFocus)?.focus();
  if(pieceFocus&&!$('mCube').hidden)$('mCube').querySelector('[data-shop-piece="'+pieceFocus+'"]')?.focus();
 }
 function drawPulses(s,current){const family=$('cubePulseFamily'),list=$('cubePulses');if(!family||!list)return;
  if(!family.options.length)for(const p of PULSE_FAMILIES){const option=document.createElement('option');option.value=p.id;option.textContent=p.name;family.append(option);}
  family.value=pulseFamily;const unlocked=ownedPulses(S());list.replaceChildren();
  for(const p of PULSE_FORMS.filter(p=>p.family===pulseFamily)){const ok=unlocked.has(p.id),b=document.createElement('button');b.type='button';b.className='cube-option';b.textContent=(ok?'':'□ ')+p.name;b.dataset.pulseForm=p.id;b.dataset.earned=String(ok&&p.id!=='ring-0');b.setAttribute('aria-pressed',String(ok&&(s.pulse||'ring-0')===p.id));b.title=ok?p.name:pulseHint(p.id);b.disabled=current.version!==2;
   b.onclick=()=>{if(!ok){hint=pulseHint(p.id);drawPanel();}else choose('pulse',p.id);};list.append(b);}
 }
 function open(next='wear'){document.querySelectorAll('.modal:not([hidden])').forEach(p=>p.hidden=true);settings();tab=next;pulseFamily=pulseForm(safe().pulse).family;hint='';drawPanel();$('mCube').hidden=false;}
 if($('cubePulseFamily'))$('cubePulseFamily').onchange=e=>{pulseFamily=e.target.value;drawPanel();};
 $('cubeWonder').onchange=e=>{const id=e.target.value;if(id&&!(runtime.wonderGifts||[]).some(d=>d.id===id))return;choose('wonder',id);};
 $('bCube').onclick=()=>open('wear');$('cubeClose').onclick=close;
 $('cubeRestore').onclick=()=>{if(settings().version!==2)return;const previous={...settings()},color=S().color;S().cube=normalizeCube({...previous,...CUBE_DEFAULTS,pulse:'ring-0',wonder:''},S().ach,S().rewards);S().color=S().cube.color;
  if(!runtime.save()){S().cube=previous;S().color=color;hint='No se guardó. Intenta otra vez.';}else{runtime.equipSparkStyle?.('');hint='Cubo blanco. Lo que tienes sigue aquí.';}drawPanel();};
 $('cubeTabs').onclick=e=>{const b=e.target.closest('[data-cube-tab]');if(b){tab=b.dataset.cubeTab;hint='';drawPanel();}};
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
 function previewDraw(t,beat){if($('mCube').hidden)return;const s=safe(),cv=$('cubePreviewCanvas'),w=Math.max(100,$('cubePreview').clientWidth),h=96,dpr=Math.min(devicePixelRatio||1,2),reduced=still();if(reduced){t=0;beat=0;}if(cv.width!==Math.round(w*dpr)||cv.height!==h*dpr){cv.width=Math.round(w*dpr);cv.height=h*dpr;}const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#000';c.fillRect(0,0,w,h);
  // A small stage wears the same bought pieces as the real cube; the cube walks a little so trails and motion show.
  if(!stage||stage.S.reducedMotion!==reduced){stage=makeStage({W:w,H:h});stage.S.reducedMotion=reduced;}const q=shop();stage.rt.sparkEconomy={version:1,purchases:q.purchases||{},wear:q.wear||{},on:q.on||{},stats:q.stats||{broken:0}};stage.rt.musicInk=(_,part)=>part==='perc'?'#f0d27a':runtime.musicInk?.(null,'lead')||'#fff';stage.rt.cubeColor=()=>s.color;
  const walk=reduced?0:Math.sin(t/1600)*Math.min(60,w*.18),x=w*.5+walk,y=h/2+6,size=22;stage.S.wx=walk;stage.S.wy=0;stage.clock.t=t;stage.clock.beat=beat;
  cubeTrailPreview(c,s,x,y,t);cubeHalo(c,s,x,y,size,t,beat);cubeAura(c,s,x,y,t,beat);c.save();c.strokeStyle=s.color;c.lineWidth=1;c.globalAlpha=.55;drawPulse(c,pulseForm(s.pulse),x,y,reduced?30:12+(t%2200)/2200*24,reduced);c.restore();c.globalAlpha=1;
  c.save();c.translate(x-walk,0);drawStage(stage,c,walk,y,size,s.color);c.restore();cubeSurface(c,s,x,y,size,t,beat);runtime.drawWonderGift?.(c,x,y,size,t,s.wonder||'');
 }
 function surface(t,beat,size){if(!runtime.inWorld())return;const c=runtime.cx,s=safe();c.save();runtime.cubeVisualTransform?.(c,runtime.W/2,runtime.H/2);if(runtime.quietState?.stage>=6||runtime.hasPower?.('cometa')){c.translate(runtime.W/2,runtime.H/2);c.rotate(Math.sin(t/600)*.12);cubeSurface(c,s,0,0,size,t,beat);}else cubeSurface(c,s,runtime.W/2,runtime.H/2,size,t,beat);c.restore();}
 Object.defineProperties(runtime,{cubeColor:{get:()=>()=>safe().color},cubeSettings:{get:()=>settings},chooseCubeStyle:{get:()=>choose},drawCubeStyle:{get:()=>draw},drawCubePreview:{get:()=>previewDraw},openCube:{get:()=>open},renderCube:{get:()=>()=>{if(!$('mCube').hidden)drawPanel();}},drawCubeSurface:{get:()=>surface}});
}
