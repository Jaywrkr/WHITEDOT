import {CULTURES,ARTIFACTS,createSanctuary,normalizeCultureBook,captureStone,cultureNotes} from './culture-model.js';
import {musicalCharacter,hookPitch} from './musical-character.js';
import {segmentDistance} from './body.js';
import {elementInk} from './visual.js';
const TAU=Math.PI*2;
export function initialize(runtime){
 const S=()=>runtime.S,cache=new Map();let owner=S(),lesson=null,sequence=[],door=null,contacts=new Set(),clock=0,lastReplay=-Infinity;
 S().cultures=normalizeCultureBook(S().cultures);
 const active=()=>runtime.inWorld()&&(S().layer||'superficie')==='superficie'&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])');
 const audible=()=>active()&&S().sound&&runtime.ac?.state==='running';
 const dist=p=>Math.hypot(p.x-S().wx,p.y-S().wy);
 function ensureOwner(){if(owner!==S()){owner=S();S().cultures=normalizeCultureBook(S().cultures);reset();}}
 function siteIn(rx,ry){
  const key=`${rx},${ry}`,size=runtime.REG*runtime.WCH;
  if(!cache.has(key)){const d=runtime.regionOfPos((rx+.5)*size,(ry+.5)*size);
   cache.set(key,createSanctuary(d,size,runtime.regionOfPos,runtime.seedOf,runtime.rng,key==='0,0'?runtime.labCulture:null));
   while(cache.size>128)cache.delete(cache.keys().next().value);
  }return cache.get(key);
 }
 function nearby(radius=700){
  ensureOwner();
  if(!runtime.inWorld()||(S().layer||'superficie')!=='superficie')return [];
  const size=runtime.REG*runtime.WCH,rx=Math.floor(S().wx/size),ry=Math.floor(S().wy/size),out=[];
  for(let x=rx-1;x<=rx+1;x++)for(let y=ry-1;y<=ry+1;y++){const site=siteIn(x,y);if(site&&dist(site)<radius)out.push(site);}
  // Learned sites stay available when their door is several regions away, after reload/eviction.
  for(const id of Object.keys(S().cultures.sites)){const [x,y]=id.slice(10).split(',').map(Number),site=Math.max(Math.abs(x-rx),Math.abs(y-ry))<=4?siteIn(x,y):null;
   if(site&&!out.includes(site)&&site.routes.some(r=>dist(r)<radius||segmentDistance({x:S().wx,y:S().wy},r.clues[0],r.clues[1])<180))out.push(site);
  }return out;
 }
 function entry(site){
  const chapter=S().cultures.collections[site.culture]||0,book=S().cultures.sites;
  if(!book[site.id]||book[site.id].chapter!==chapter){
   if(!book[site.id]&&Object.keys(book).length>=96)delete book[Object.keys(book)[0]];
   book[site.id]={chapter,heard:false,clues:0,open:false};
  }return book[site.id];
 }
 function sound(site,interval,time,volume=.035){
  if(!audible())return;
  const c=CULTURES[site.culture],d=runtime.regionOfPos(S().wx,S().wy),profile=musicalCharacter(d.genre);
  // Shared root and quiet accompaniment; cultural phrase uses its own interval palette.
  const note=runtime.chordTones()[0]+interval;
  runtime.hookInst(c.instrument,hookPitch(c.instrument,note,profile),time,volume,d);
 }
 function playLesson(site,chapter,time){cultureNotes(site,chapter).forEach(n=>sound(site,n.interval,time+n.step*runtime.SIX,.032));}
 function reset(){cache.clear();lesson=null;sequence=[];door=null;contacts.clear();}
 function tick(dt){
  ensureOwner();
  if(!audible()){lesson=null;sequence=[];contacts.clear();return;}
  clock+=Math.max(0,Math.min(.1,dt));const b=runtime.body;if(!b?.ready||b.jump){lesson=null;contacts.clear();return;}
  const touching=new Set();
  for(const site of nearby(650)){
   const progress=S().cultures.collections[site.culture]||0,c=CULTURES[site.culture];
   if(dist(site)<55){
    if(progress===3){if(clock-lastReplay>12){lastReplay=clock;runtime.beatSoon(t=>playLesson(site,2,t),null,'player');}continue;}
    const e=entry(site);
    if(!e.heard&&b.speed<25){
     if(!lesson||lesson.site!==site){lesson={site,elapsed:0,end:Infinity,started:false};}
     lesson.elapsed+=dt;
     if(lesson.elapsed>=1&&!lesson.started){lesson.started=true;const learning=lesson;
      runtime.beatSoon(t=>{if(lesson!==learning||!audible()||dist(site)>55)return;playLesson(site,progress,t);learning.onsets=cultureNotes(site,progress).map(n=>({...n,time:t+n.step*runtime.SIX}));learning.end=t+runtime.SIX*16;},null,'player');}
     if(lesson.started&&runtime.ac.currentTime>=lesson.end){e.heard=true;lesson=null;runtime.unlock('guardian1');runtime.toast(`<em>${c.name}</em> · Sigue las dos huellas; sus notas son la llave.`);runtime.save();}
    }
   }else if(lesson?.site===site)lesson=null;
   const e=S().cultures.sites[site.id];if(!e||!e.heard||e.chapter!==progress||progress===3)continue;
   const route=site.routes[progress];
   if(e.clues<2&&dist(route.clues[e.clues])<23){e.clues++;sound(site,0,runtime.ac.currentTime+.04);runtime.save();runtime.toast(e.clues===1?'La huella apunta a otra región.':'La puerta escucha: recorre las piedras en el orden de la llamada.');}
   if(e.clues===2&&!e.open){
    route.stones.forEach((stone,index)=>{
     if(dist(stone)>=18)return;const key=site.id+':'+index;touching.add(key);
     if(contacts.has(key))return;
     if(door!==site.id){sequence=[];door=site.id;}
     sequence=captureStone(sequence,index,route.order);runtime.beatSoon(t=>sound(site,c.scale[index%c.scale.length],t,.04),null,'player');
     if(sequence.length===4){e.open=true;sequence=[];runtime.unlock('puertaMusical');runtime.save();}
    });
   }
   if(e.open&&dist(route.relic)<23){
    S().cultures.collections[site.culture]=progress+1;lesson=null;door=null;sequence=[];
    runtime.beatSoon(t=>playLesson(site,progress,t),null,'player');runtime.unlock('reliquiaCultural');
    if(progress===2)runtime.unlock('culturaCompleta');runtime.save();
    runtime.toast(`<em>${ARTIFACTS[progress]}</em> · ${c.name} · ${progress+1}/3. Vuelve al guardián para la próxima llamada.`);
   }
  }
  contacts=touching;
  if(door){const site=nearby(650).find(s=>s.id===door),e=site&&S().cultures.sites[site.id];if(!site||!e||dist(site.routes[e.chapter])>160){door=null;sequence=[];}}
 }
 function targets(){
  const out=[];
  for(const site of nearby(runtime.REG*runtime.WCH*2)){
   const e=S().cultures.sites[site.id],chapter=S().cultures.collections[site.culture]||0;
   if(chapter===3)continue;
   if(!e?.heard||e.chapter!==chapter)out.push({...site,name:CULTURES[site.culture].name});
   else {const r=site.routes[chapter],p=e.clues<2?r.clues[e.clues]:e.open?r.relic:r;out.push({...p,name:e.open?ARTIFACTS[chapter]:e.clues<2?'Huella del guardián':'Puerta musical'});}
  }return out;
 }
 function draw(){
  if(!active())return;const ctx=runtime.cx,ox=runtime.W/2-S().wx,oy=runtime.H/2-S().wy;
  const mark=(p,size,col,kind=0)=>{if(dist(p)>450)return;ctx.save();ctx.translate(p.x+ox,p.y+oy);ctx.strokeStyle=ctx.fillStyle=col;ctx.lineWidth=1.2;ctx.globalAlpha=Math.max(.15,1-dist(p)/600);
   ctx.beginPath();if(kind===0){ctx.ellipse(0,0,size,size*.6,0,0,TAU);ctx.moveTo(-size*.4,0);ctx.quadraticCurveTo(0,-size*1.8,size*.4,0);}else if(kind===1){ctx.moveTo(-size,0);ctx.quadraticCurveTo(0,-size,size,0);}else {ctx.moveTo(0,-size);ctx.lineTo(size,0);ctx.lineTo(0,size);ctx.lineTo(-size,0);ctx.closePath();}ctx.stroke();ctx.restore();};
  const label=(p,text)=>{if(dist(p)>100)return;ctx.save();ctx.font='10px monospace';ctx.textAlign='center';ctx.fillStyle='#e2ded1';ctx.globalAlpha=.85;ctx.fillText(text,p.x+ox,p.y+oy+40,Math.min(280,runtime.W-28));ctx.restore();};
  for(const site of nearby(650)){
   const c=CULTURES[site.culture],col=elementInk('glass',c.hue),chapter=S().cultures.collections[site.culture]||0,e=S().cultures.sites[site.id];
   mark(site,18,col); // Original compact guardian; glyph details distinguish the eight studies.
   if(dist(site)<450){ctx.save();ctx.strokeStyle=col;ctx.globalAlpha=.5;ctx.beginPath();for(let i=0;i<3+c.glyph%4;i++){const a=i/(3+c.glyph%4)*TAU;ctx.moveTo(site.x+ox+Math.cos(a)*24,site.y+oy+Math.sin(a)*24);ctx.lineTo(site.x+ox+Math.cos(a)*29,site.y+oy+Math.sin(a)*29);}ctx.stroke();ctx.restore();}
   if(lesson?.site===site&&lesson.onsets){ctx.save();ctx.fillStyle=col;for(let i=0;i<4;i++){const on=lesson.onsets.find(n=>n.stone===i),lit=on&&Math.abs(runtime.ac.currentTime-on.time)<.22;ctx.globalAlpha=lit?1:.25;ctx.beginPath();ctx.arc(site.x+ox+(i-1.5)*10,site.y+oy+19,lit?3:1.5,0,TAU);ctx.fill();}ctx.restore();}
   label(site,chapter===3?`${c.name} · Tres recuerdos recuperados`:e?.heard?'Sigue la huella · vuelve para escuchar':`Quédate y escucha · ${c.name}`);
   if(!e?.heard||chapter===3||e.chapter!==chapter)continue;const r=site.routes[chapter];
   if(e.clues===1){const a=r.clues[0],b=r.clues[1],length=Math.hypot(b.x-a.x,b.y-a.y);ctx.save();ctx.fillStyle=col;ctx.globalAlpha=.3;const dx=(b.x-a.x)/length,dy=(b.y-a.y)/length,along=(S().wx-a.x)*dx+(S().wy-a.y)*dy;for(let n=Math.max(0,Math.floor((along-200)/300));n*300<Math.min(length,along+200);n++){const p={x:a.x+dx*n*300,y:a.y+dy*n*300};if(dist(p)>220)continue;for(let j=0;j<3;j++)ctx.fillRect(p.x+ox+dx*j*5,p.y+oy+dy*j*5,1.5,1.5);}ctx.restore();}
   if(e.clues<2){mark(r.clues[e.clues],12,col,1);label(r.clues[e.clues],'Cruza la huella con el cubo');}
   if(e.clues===2){mark(r,25,col,1);r.stones.forEach((p,i)=>{mark(p,8,col,2);if(dist(p)<400){ctx.save();ctx.fillStyle=col;ctx.globalAlpha=.6;for(let j=0;j<=i;j++)ctx.fillRect(p.x+ox-5+j*3,p.y+oy+13,1.5,1.5);ctx.restore();}});label(r,e.open?'El instrumento despertó':`Recorre la llamada · ${door===site.id?sequence.length:0}/4`);}
   if(e.open){mark(r.relic,12,runtime.GOLD,2);label(r.relic,ARTIFACTS[chapter]);}
  }
 }
 function card(){ensureOwner();const entries=Object.entries(S().cultures.collections);const heard=Object.values(S().cultures.sites).filter(e=>e.heard).length;
  if(!entries.length&&!heard)return '';
  return `<article class="journal-card"><h3>Guardianes y recuerdos</h3><p>${heard} llamadas escuchadas. ${entries.map(([id,n])=>`${CULTURES[id].name}: ${n}/3`).join(' · ')}</p><p>Escucha al guardián, cruza dos huellas, recorre las cuatro piedras en el orden de su llamada y alcanza el instrumento. Los recuerdos quedan; puedes regresar para escucharlos.</p></article>`;
 }
 runtime.ACH.push(['guardian1','Otra voz del mundo','Escucha una llamada completa de un guardián.'],['puertaMusical','Una llamada es una llave','Abre una puerta recorriendo sus piedras.'],['reliquiaCultural','Un recuerdo despierto','Recupera un instrumento del santuario.'],['culturaCompleta','Tres recuerdos','Recupera los tres recuerdos de un estudio cultural.']);
 Object.defineProperties(runtime,{cultureTick:{get:()=>tick},drawCultures:{get:()=>draw},cultureTargets:{get:()=>targets},cultureCard:{get:()=>card},cultureHome:{get:()=>()=>siteIn(0,0)},nearbyCultures:{get:()=>nearby},cultureReset:{get:()=>reset},cultureListening:{get:()=>!!lesson}});
}
