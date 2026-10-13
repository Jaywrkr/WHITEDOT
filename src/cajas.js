// Cajas misteriosas: raras, flotan y brillan; el cubo las abre al tocarlas y te dan un poder por un rato.
// - Campo de escucha: un círculo te sigue; la música del lugar calla y un brazo gira en el campo tocando
//   a tempo solo lo que está dentro. Moverte = cambiar la canción.
// - Cometa: más velocidad y una estela que suena.
// - Brújula: flechas hacia lo raro (materia, aves lira, santuarios, puertas, otras cajas).
// - Imán: los objetos pequeños te siguen y suenan a tu alrededor.
// - Pincel sonoro: tu camino deja notas que se repiten mientras dure.
// - Compañero: una luz te sigue, contesta lo que tocas y te lleva hacia algo raro.
import {boxAt,POWERS,POWER_IDS,activePowers,fieldRadius} from './expansion-music.js';
import {swatchOf,WORLD_VISUAL} from './visual.js';
const TAU=Math.PI*2;

export function initialize(runtime){
 const S=()=>runtime.S,powers={},spawned=[],trail=[],marks=[],companion={x:0,y:0,on:false,lit:0,heard:[]};let previous=S(),lastMark=null;
 S().boxes=typeof S().boxes==='object'&&S().boxes?S().boxes:{};
 const surface=()=>runtime.inWorld()&&(S().layer||'superficie')==='superficie';
 const now=()=>performance.now();
 const has=id=>(powers[id]||0)>now();
 const left=id=>Math.max(0,((powers[id]||0)-now())/1000);
 // ---------- cajas ----------
 function boxesNear(radius=700){
  if(!surface())return [];const W=runtime.WCH,cx=Math.floor(S().wx/W),cy=Math.floor(S().wy/W),out=[];
  for(let x=cx-1;x<=cx+1;x++)for(let y=cy-1;y<=cy+1;y++){const b=boxAt(x,y,W,runtime.seedOf,runtime.rng);if(b&&!S().boxes[b.id]&&!runtime.regionOfPos(b.x,b.y).sea)out.push(b);}
  for(const b of spawned)if(!S().boxes[b.id])out.push(b);
  return out.filter(b=>Math.hypot(b.x-S().wx,b.y-S().wy)<radius);
 }
 function findBoxes(range=6){const W=runtime.WCH,cx=Math.floor(S().wx/W),cy=Math.floor(S().wy/W),out=[];for(let x=cx-range;x<=cx+range;x++)for(let y=cy-range;y<=cy+range;y++){const b=boxAt(x,y,W,runtime.seedOf,runtime.rng);if(b&&!S().boxes[b.id])out.push(b);}return out;}
 function spawnBox(x,y,power=POWER_IDS[Math.floor(Math.random()*POWER_IDS.length)]){const b={id:`regalo:${Math.round(x)},${Math.round(y)}:${Date.now()}`,x,y,power,hue:Math.floor(Math.random()*360),spin:0,gift:true};spawned.push(b);if(spawned.length>6)spawned.shift();return b;}
 function open(b){
  const book=S().boxes;if(!b.gift){if(Object.keys(book).length>=400)delete book[Object.keys(book)[0]];book[b.id]=1;}else spawned.splice(spawned.indexOf(b),1);
  S().boxesOpened=(S().boxesOpened||0)+1;give(b.power);runtime.colorPulse?.(b.hue,1);runtime.burst?.(b.x,b.y,14,true);
  runtime.beatSoon(t=>{const ct=runtime.chordTones?.()||[60,64,67];ct.concat(ct.map(n=>n+12)).forEach((n,i)=>runtime.pluck?.(n+12,t+i*runtime.SIX*.5,.05,2));},null,'player');
  runtime.unlock('caja1');if(S().boxesOpened>=5)runtime.unlock('caja5');runtime.unlock('poder_'+b.power);runtime.save();
 }
 function give(id){
  const p=POWERS[id];if(!p)return;powers[id]=Math.max(powers[id]||0,now())+p.seconds*1000;runtime.toast(`<em>${p.name}</em> · ${p.text}`);
  if(!S().help['poder_'+id]){S().help['poder_'+id]=true;runtime.say(p.text,p.name);}
  if(id==='companero'){companion.on=true;companion.x=S().wx+30;companion.y=S().wy+30;}
  if(id==='pincel')marks.length=0;
 }
 // ---------- cada cuadro ----------
 function tick(dt){
  if(previous!==S()){previous=S();S().boxes=typeof S().boxes==='object'&&S().boxes?S().boxes:{};spawned.length=0;}
  runtime.speedBoost=has('cometa')?2.2:1;runtime.fieldSolo=has('campo');
  if(!surface())return;const b=runtime.body;
  for(const box of boxesNear(400))if(Math.hypot(box.x-S().wx,box.y-S().wy)<22)open(box);
  if(has('cometa')&&b?.speed>40){trail.push({x:S().wx,y:S().wy,a:1});if(trail.length>60)trail.shift();}
  for(const p of trail)p.a-=dt*.8;while(trail.length&&trail[0].a<=0)trail.shift();
  if(has('pincel')&&b?.speed>20&&(!lastMark||Math.hypot(S().wx-lastMark.x,S().wy-lastMark.y)>70)){lastMark={x:S().wx,y:S().wy};marks.push({x:S().wx,y:S().wy,degree:Math.abs(Math.round(S().wy/60))%7,lit:1,step:marks.length%16});if(marks.length>16)marks.shift();}
  if(!has('pincel')&&marks.length)marks.length=0;
  // Imán: lo pequeño cercano te sigue en órbita.
  if(has('iman'))(runtime.MU.near||[]).slice(0,8).forEach((o,i)=>{if(o.x==null||o.pond)return;const a=i/8*TAU+performance.now()/2400,tx=S().wx+Math.cos(a)*60,ty=S().wy+Math.sin(a)*48;o.x+=(tx-o.x)*Math.min(1,dt*1.8);o.y+=(ty-o.y)*Math.min(1,dt*1.8);if(o.hx!=null){o.hx=o.x;o.hy=o.y;}});
  if(companion.on){if(!has('companero'))companion.on=false;else{const tx=S().wx+40*Math.cos(performance.now()/1700),ty=S().wy-36+20*Math.sin(performance.now()/1300);companion.x+=(tx-companion.x)*Math.min(1,dt*1.6);companion.y+=(ty-companion.y)*Math.min(1,dt*1.6);companion.lit=Math.max(0,companion.lit-dt*1.5);}}
 }
 // ---------- reloj musical ----------
 function sources(){
  // Todo lo que suena cerca: objetos del mundo (snd) y fuentes de módulos (materia, vida, vidrios, espejos, encuentros).
  const list=(runtime.MU.near||[]).filter(o=>typeof o.snd==='function'&&o.x!=null).map(o=>({x:o.x,y:o.y,o,play:t=>{o.snd(t);o.hit=1;}}));
  for(const fn of ['materiaSources','vidaSources','glassSources','mirrorSources','encounterSources'])for(const s of runtime[fn]?.()||[]){const ob=s.object;if(ob?.x==null)continue;list.push({x:ob.x,y:ob.y,o:ob,play:t=>{runtime.playVoice(s.kind,Math.floor(Math.hypot(ob.x-S().wx,ob.y-S().wy)/30)%7,t,runtime.regionOfPos(ob.x,ob.y),false,.35,ob,'player');ob.lit=1;}});}
  return list;
 }
 function step(s,bar,time){
  if(!surface()||!S().sound||runtime.ac?.state!=='running')return;
  // Campo: el brazo gira una vuelta por compás y toca lo que cruza dentro del círculo.
  if(has('campo')){const R=fieldRadius(left('campo'),POWERS.campo.seconds);let n=0;
   for(const src of sources()){const dx=src.x-S().wx,dy=src.y-S().wy;if(Math.hypot(dx,dy)>R||n>=3)continue;const a=((Math.atan2(dy,dx)+Math.PI/2)%TAU+TAU)%TAU;if(Math.floor(a/TAU*16)===s){src.play(time);n++;}}}
  // Cometa: la estela suena en corcheas mientras corres.
  if(has('cometa')&&s%2===0&&(runtime.body?.speed||0)>80){const ct=runtime.chordTones?.()||[60,64,67];runtime.pluck?.(ct[(s/2)%ct.length]+24,time,.025,4);}
  // Pincel: tus marcas suenan cada dos compases, en el orden en que las dejaste.
  if(has('pincel')&&bar%2===0)for(const m of marks)if(m.step===s){const ct=runtime.chordTones?.()||[60,64,67];runtime.hookInst?.(runtime.MU.dnaA?.track?.hookI||'keys',ct[m.degree%ct.length]+12+(m.degree>=3?12:0),time,runtime.vel?.(.05)||.05,runtime.MU.dnaA);setTimeout(()=>{m.lit=1;},Math.max(0,(time-runtime.ac.currentTime)*1000));}
  // Imán: los que te siguen tocan cada uno su parte.
  if(has('iman')&&s%4===0){const o=(runtime.MU.near||[]).filter(o=>typeof o.snd==='function')[(bar*4+s/4)%Math.max(1,(runtime.MU.near||[]).length)];if(o&&typeof o.snd==='function'){o.snd(time);o.hit=1;}}
  // Compañero: contesta lo último que tocaste una tercera arriba.
  if(companion.on&&companion.heard.length&&s%4===2){const h=companion.heard.shift(),ct=runtime.chordTones?.()||[60,64,67];runtime.pluck?.(ct[(h+2)%ct.length]+24,time,.035,2);setTimeout(()=>{companion.lit=1;},Math.max(0,(time-runtime.ac.currentTime)*1000));}
 }
 function hear(index){if(companion.on){companion.heard.push(index||0);if(companion.heard.length>4)companion.heard.shift();}}
 // Brújula y compañero: lo raro cerca (dirección y nombre).
 function rareTargets(){
  const out=[];const add=(x,y,name)=>out.push({x,y,name,d:Math.hypot(x-S().wx,y-S().wy)});
  for(const b of findBoxes(5))add(b.x,b.y,'Caja');
  for(const m of runtime.nearbyMateria?.(9000)||[])add(m.x,m.y,{strings:'Cuerdas',prism:'Prisma',membrane:'Membrana'}[m.kind]);
  for(const f of runtime.nearbyFlocks?.(9000)||[])if(f.species==='lira')add(f.x,f.y,'Ave lira');
  for(const c of runtime.cultureTargets?.()||[])add(c.x,c.y,c.name);
  return out.filter(t=>t.d>120).sort((a,b)=>a.d-b.d).slice(0,4);
 }
 // ---------- dibujo ----------
 function draw(t,dt,ox,oy){
  if(!surface())return;const c=runtime.cx,cx=runtime.W/2,cy=runtime.H/2;c.save();
  for(const b of boxesNear(700)){const [H,Sat,L]=swatchOf(b.hue),x=b.x+ox,y=b.y+oy+Math.sin(t/500+b.spin)*5,col=`hsl(${H},${Sat}%,${L}%)`,rot=t/900+b.spin;
   const g=c.createRadialGradient(x,y,0,x,y,46);g.addColorStop(0,`hsla(${H},${Sat}%,${L}%,.35)`);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=1;c.fillStyle=g;c.fillRect(x-46,y-46,92,92);
   c.translate(x,y);for(const [k,s] of [[0,10],[Math.PI/4,10]]){c.save();c.rotate(rot+k);c.globalAlpha=.9;c.strokeStyle=col;c.lineWidth=1.6;c.strokeRect(-s,-s,s*2,s*2);c.restore();}
   c.globalAlpha=.9;c.fillStyle=WORLD_VISUAL.gold;c.beginPath();c.arc(0,0,2.5+Math.sin(t/200)*1,0,TAU);c.fill();
   for(let i=0;i<3;i++){const a=t/600+i*TAU/3;c.globalAlpha=.7;c.fillRect(Math.cos(a)*18-1,Math.sin(a)*18-1,2,2);}
   c.translate(-x,-y);if(Math.hypot(b.x-S().wx,b.y-S().wy)<160){c.globalAlpha=.8;c.fillStyle=WORLD_VISUAL.gold;c.font='10px monospace';c.textAlign='center';c.fillText('Caja misteriosa · tócala con el cubo',x,y+34);}}
  if(has('campo')){const R=fieldRadius(left('campo'),POWERS.campo.seconds),arm=((runtime.MU.step%16)+((runtime.ac?.currentTime||0)%runtime.SIX)/runtime.SIX)/16*TAU-Math.PI/2,hue=runtime.MU.dnaT?.hue||0,[H]=swatchOf(hue);
   c.globalAlpha=.08;c.fillStyle=`hsl(${H},80%,60%)`;c.beginPath();c.arc(cx,cy,R,0,TAU);c.fill();c.globalAlpha=.5;c.strokeStyle=`hsl(${H},80%,64%)`;c.lineWidth=1.4;c.stroke();
   c.globalAlpha=.6;c.strokeStyle=WORLD_VISUAL.gold;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(arm)*R,cy+Math.sin(arm)*R);c.stroke();}
  if(trail.length){for(const p of trail){const [H]=swatchOf((p.x+p.y)/7);c.globalAlpha=p.a*.6;c.fillStyle=`hsl(${H},85%,62%)`;c.fillRect(p.x+ox-2,p.y+oy-2,4,4);}}
  for(const m of marks){m.lit=Math.max(0,m.lit-dt*1.5);const [H]=swatchOf(m.degree*51);c.globalAlpha=.5+m.lit*.5;c.fillStyle=m.lit>.3?WORLD_VISUAL.gold:`hsl(${H},80%,64%)`;c.beginPath();c.arc(m.x+ox,m.y+oy,3+m.lit*4,0,TAU);c.fill();}
  if(companion.on){const x=companion.x+ox,y=companion.y+oy,g=c.createRadialGradient(x,y,0,x,y,22);g.addColorStop(0,`rgba(255,255,255,${.5+companion.lit*.4})`);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=1;c.fillStyle=g;c.fillRect(x-22,y-22,44,44);}
  if(has('brujula')||companion.on)for(const tg of rareTargets().slice(0,has('brujula')?4:1)){const a=Math.atan2(tg.y-S().wy,tg.x-S().wx),r=Math.min(cx,cy)-46,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;
   c.save();c.translate(x,y);c.rotate(a);c.globalAlpha=.85;c.fillStyle=WORLD_VISUAL.gold;c.beginPath();c.moveTo(10,0);c.lineTo(-6,-6);c.lineTo(-6,6);c.closePath();c.fill();c.restore();
   c.globalAlpha=.75;c.fillStyle=WORLD_VISUAL.gold;c.font='9px monospace';c.textAlign='center';c.fillText(`${tg.name} · ${Math.round(tg.d/10)} m`,x-Math.cos(a)*22,y-Math.sin(a)*22+3);}
  // Poderes activos: un renglón discreto arriba.
  const active=activePowers(powers,now());if(active.length){c.globalAlpha=.75;c.fillStyle=WORLD_VISUAL.gold;c.font='10px monospace';c.textAlign='center';c.fillText(active.map(p=>`${POWERS[p.id].name} ${Math.ceil(p.left)} s`).join(' · '),cx,140);}
  c.restore();
 }
 Object.defineProperties(runtime,{boxesNear:{get:()=>boxesNear},spawnBox:{get:()=>spawnBox},givePower:{get:()=>give},powers:{get:()=>powers},cajasTick:{get:()=>tick},cajasStep:{get:()=>step},drawCajas:{get:()=>draw},powerHear:{get:()=>hear},rareTargets:{get:()=>rareTargets},hasPower:{get:()=>has}});
}
