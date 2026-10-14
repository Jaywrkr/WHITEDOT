import {CUBE_TRAILS,CUBE_HALOS,normalizeCube,cosmeticUnlocked} from './cube-model.js';
export function initialize(runtime){
 const S=()=>runtime.S,$=runtime.$;let owner=null,path=[],last=null;
 function settings(){if(owner!==S()){owner=S();S().cube=normalizeCube(S().cube||{color:S().color},S().ach,S().rewards);path=[];last=null;}
  const item=runtime.COLORS.find(c=>c[0]===S().cube.color);if(!item||!runtime.colorOk(item))S().cube.color='#ffffff';
  return S().cube;
 }
 function color(){return settings().color;}
 function choose(type,id){const s=settings();if(type==='color'){const c=runtime.COLORS.find(c=>c[0]===id);if(!c||!runtime.colorOk(c))return;s.color=c[0];S().color=c[0];}
  else {const pool=type==='trail'?CUBE_TRAILS:type==='halo'?CUBE_HALOS:[];if(!pool.some(p=>p.id===id&&cosmeticUnlocked(p,S().ach,S().rewards)))return;s[type]=id;}
  runtime.save();drawPanel();
 }
 function drawPanel(){const s=settings();$('cubeColors').replaceChildren();
  for(const [hex,name,ach]of runtime.COLORS){const b=document.createElement('button');b.className='cube-swatch';b.style.background=hex;b.setAttribute('aria-label',name);b.setAttribute('aria-pressed',String(s.color===hex));b.title=name;b.disabled=!runtime.colorOk([hex,name,ach]);b.onclick=()=>choose('color',hex);$('cubeColors').append(b);}
  for(const [id,pool,type]of [['cubeTrails',CUBE_TRAILS,'trail'],['cubeHalos',CUBE_HALOS,'halo']]){$(id).replaceChildren();for(const p of pool){const b=document.createElement('button');b.textContent=p.name;b.disabled=!cosmeticUnlocked(p,S().ach,S().rewards);b.setAttribute('aria-pressed',String(s[type]===p.id));b.title=b.disabled?`Se descubre con: ${runtime.ACH.find(a=>a[0]===p.ach)?.[1]||p.ach}`:p.name;b.onclick=()=>choose(type,p.id);$(id).append(b);}}
  const preview=$('cubePreview');preview.style.setProperty('--cube-ink',s.color);preview.dataset.trail=s.trail;preview.dataset.halo=s.halo;
 }
 $('bCube').onclick=()=>{$('mMenu').hidden=true;drawPanel();$('mCube').hidden=false;};$('cubeClose').onclick=()=>$('mCube').hidden=true;
 addEventListener('keydown',e=>{if(e.key==='Escape')$('mCube').hidden=true;});
 function draw(t,dt,beat,size){if(!runtime.inWorld()){path=[];last=null;return;}const s=settings(),c=runtime.cx,x=S().wx,y=S().wy;
  if(!last||Math.hypot(x-last.x,y-last.y)>400){path=[];last={x,y};}
  const moved=Math.hypot(x-last.x,y-last.y);if(moved>7){path.push({x,y,a:1});if(path.length>28)path.shift();last={x,y};}
  c.save();c.fillStyle=c.strokeStyle=s.color;c.lineWidth=1;
  for(const q of path)q.a-=dt*.8;path=path.filter(q=>q.a>0);
  if(s.trail==='line'&&path.length>1){c.globalAlpha=.25;c.beginPath();path.forEach((q,i)=>{const px=q.x+runtime.W/2-x,py=q.y+runtime.H/2-y;i?c.lineTo(px,py):c.moveTo(px,py);});c.stroke();}
  else if(s.trail!=='none')path.forEach((q,i)=>{if(s.trail==='notes'&&i%3)return;c.globalAlpha=q.a*.35;const px=q.x+runtime.W/2-x,py=q.y+runtime.H/2-y;c.fillRect(px,py,2,2);if(s.trail==='notes'){c.beginPath();c.moveTo(px+2,py);c.lineTo(px+2,py-5);c.stroke();}});
  if(s.halo!=='soft'){c.globalAlpha=.1+beat*.15;const r=Math.min(25,size*(s.halo==='pulse'?2+beat:1.4));c.beginPath();c.arc(runtime.W/2,runtime.H/2,r,0,Math.PI*2);c.stroke();}c.restore();
 }
 Object.defineProperties(runtime,{cubeColor:{get:()=>color},cubeSettings:{get:()=>settings},drawCubeStyle:{get:()=>draw}});
}
