import {PET_SPECIES} from './pet-model.js';
import {createPowerClock} from './power-clock.js';
import {musicalCharacter,hookPitch,hookInstruments} from './musical-character.js';
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

export function normalizeGiftBoxes(items){const seen=new Set();return (Array.isArray(items)?items:[]).filter(b=>b&&typeof b.id==='string'&&b.id.startsWith('regalo:')&&!seen.has(b.id)&&Number.isFinite(b.x)&&Number.isFinite(b.y)&&Math.abs(b.x)<1e12&&Math.abs(b.y)<1e12&&Object.hasOwn(POWERS,b.power)&&seen.add(b.id)).map(b=>({...b,gift:true,hue:Number.isFinite(b.hue)?b.hue:0,spin:0}));}
export function initialize(runtime){
 const clock=createPowerClock(POWERS),S=()=>runtime.S,powers=clock.powers,spawned=[],trail=[],marks=[],companion={id:'power:companero',x:0,y:0,on:false,lit:0,heard:[],species:null};let previous=S(),lastMark=null;
 S().boxes=typeof S().boxes==='object'&&S().boxes?S().boxes:{};
 const surface=()=>runtime.inWorld()&&(S().layer||'superficie')==='superficie';
 const now=clock.now;
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
 function spawnBox(x,y,power=POWER_IDS[Math.floor(Math.random()*POWER_IDS.length)]){ensureOwner();if(!Number.isFinite(x)||!Number.isFinite(y)||!Object.hasOwn(POWERS,power))return null;const stem=`regalo:${Math.round(x)},${Math.round(y)}:${Date.now()}`;let id=stem,n=0;while(spawned.some(b=>b.id===id))id=stem+':'+(++n);const b={id,x,y,power,hue:Math.floor(Math.random()*360),spin:0,gift:true};spawned.push(b);S().giftBoxes=[...(Array.isArray(S().giftBoxes)?S().giftBoxes:[]),{...b}];return b;}

 function open(b){if(!b.gift)runtime.collectRareCard?.('box:'+b.power,b);runtime.recordElement?.('box',runtime.regionOfPos(b.x,b.y));
  const book=S().boxes;if(!b.gift)book[b.id]=1;else{const i=spawned.indexOf(b);if(i>=0)spawned.splice(i,1);S().giftBoxes=(Array.isArray(S().giftBoxes)?S().giftBoxes:[]).filter(item=>item?.id!==b.id);}
  S().boxesOpened=(S().boxesOpened||0)+1;runtime.petBox?.(b);give(b.power);runtime.colorPulse?.(b.hue,1);runtime.burst?.(b.x,b.y,14,true);
  if(runtime.celebrateBox)runtime.celebrateBox(b);else runtime.beatSoon(t=>{const ct=runtime.chordTones?.()||[60,64,67];ct.slice(0,3).forEach((n,i)=>melody(n,t+i*runtime.SIX*2,.025));},null,'player');
  runtime.unlock('caja1');if(S().boxesOpened>=5)runtime.unlock('caja5');runtime.unlock('poder_'+b.power);runtime.save();
 }
 function give(id,visitor=null){
  ensureOwner();const p=Object.hasOwn(POWERS,id)&&POWERS[id];if(!p)return;clock.give(id);if(!runtime.celebrateBox)runtime.toast(`<em>${p.name}</em> · ${p.text}`);
  if(!runtime.celebrateBox&&!S().help['poder_'+id]){S().help['poder_'+id]=true;runtime.say(p.text,p.name);}
  if(id==='cometa')runtime.speedBoost=2.2;if(id==='campo')runtime.fieldSolo=true;
  if(id==='companero'){if(PET_SPECIES[visitor])companion.species=visitor;companion.on=true;companion.x=S().wx+30;companion.y=S().wy+30;}
  if(id==='pincel')marks.length=0;
 }
 // ---------- cada cuadro ----------
 function tick(dt){
  ensureOwner();
  clock.tick(runtime.activeFrameSeconds??dt,surface()&&!document.hidden&&!runtime.scanning&&!document.querySelector('.modal:not([hidden])'));
  runtime.speedBoost=has('cometa')?2.2:1;runtime.fieldSolo=has('campo');
  if(!surface()||document.hidden||document.querySelector('.modal:not([hidden])'))return;const b=runtime.body;
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
  const list=(runtime.MU.near||[]).filter(o=>typeof o.snd==='function'&&o.x!=null).map(o=>({x:o.x,y:o.y,o,play:t=>{if(runtime.withVoiceOrigin)runtime.withVoiceOrigin('field',()=>o.snd(t));else o.snd(t);o.hit=1;}}));
  for(const fn of ['materiaSources','vidaSources','glassSources','mirrorSources','encounterSources'])for(const s of runtime[fn]?.()||[]){const ob=s.object;if(ob?.x==null)continue;list.push({x:ob.x,y:ob.y,o:ob,play:t=>{runtime.playVoice(s.kind,Math.floor(Math.hypot(ob.x-S().wx,ob.y-S().wy)/30)%7,t,runtime.regionOfPos(ob.x,ob.y),false,.35,ob,'field');ob.lit=1;}});}
  return list;
 }
 function melody(n,t,v,source=null,front=false){const d=runtime.MU.dnaA||runtime.MU.dnaT;if(!d)return;const inst=runtime.MU.radio?.hookI||hookInstruments(d.genre,runtime.GEN[d.genre])[0],cue=source?{...source,id:source.id||'power:pincel:'+Math.round(source.x)+','+Math.round(source.y)}:{id:'power:cometa',x:S().wx,y:S().wy},voice={instrument:inst,role:'lead'},emit=()=>runtime.hookInst(inst,hookPitch(inst,n,musicalCharacter(d.genre)),t,v,d);if(runtime.withInstrumentPatch)runtime.withInstrumentPatch(front?'power:pincel':'power:voice',d,voice,cue,t,emit);else emit();if(front)runtime.focusGesture?.(t,cue,'lead');runtime.soundCue?.(cue,'lead',t);}

 function step(s,bar,time){
  if(!surface()||document.hidden||document.querySelector('.modal:not([hidden])')||!S().sound||runtime.ac?.state!=='running')return;
  // Campo: el brazo gira una vuelta por compás y toca lo que cruza dentro del círculo.
  if(has('campo')){const R=fieldRadius(left('campo'),POWERS.campo.seconds);let n=0;
   for(const src of sources()){const dx=src.x-S().wx,dy=src.y-S().wy;if(Math.hypot(dx,dy)>R||n>=3)continue;const a=((Math.atan2(dy,dx)+Math.PI/2)%TAU+TAU)%TAU;if(Math.floor(a/TAU*16)===s){src.play(time);n++;}}}
  // Cometa: la estela suena en corcheas mientras corres.
  if(has('cometa')&&s%2===0&&(runtime.body?.speed||0)>80){const ct=runtime.chordTones?.()||[60,64,67];melody(ct[(s/2)%ct.length],time,.02,trail.at(-1));}
  // Pincel: tus marcas suenan cada dos compases, en el orden en que las dejaste.
  if(has('pincel')&&bar%2===0)for(const m of marks)if(m.step===s){const ct=runtime.chordTones?.()||[60,64,67];melody(ct[m.degree%ct.length],time,.025,m,true);setTimeout(()=>{m.lit=1;},Math.max(0,(time-runtime.ac.currentTime)*1000));}
  // Imán: los que te siguen tocan cada uno su parte.
  if(has('iman')&&s%4===0){const small=(runtime.MU.near||[]).filter(o=>typeof o.snd==='function'),o=small[(bar*4+s/4)%Math.max(1,small.length)];if(o){if(runtime.withVoiceOrigin)runtime.withVoiceOrigin('field',()=>o.snd(time));else o.snd(time);o.hit=1;}}
  // Compañero: contesta lo último que tocaste una tercera arriba.
  if(companion.on&&companion.heard.length&&s%4===2){const h=companion.heard.shift(),ct=runtime.chordTones?.()||[60,64,67];const n=ct[(h+2)%ct.length],spec=PET_SPECIES[companion.species];if(spec?.role==='bass'){let pitch=n;while(pitch>52)pitch-=12;while(pitch<36)pitch+=12;runtime.bassInst(spec.pool[0],pitch,time,.025);}else if(spec?.role==='groove')runtime.wood(time,.025);else melody(n,time,.025,companion);if(spec?.role==='bass'||spec?.role==='groove')runtime.soundCue?.(companion,spec.role==='bass'?'bajo':'perc',time);setTimeout(()=>{companion.lit=1;},Math.max(0,(time-runtime.ac.currentTime)*1000));}
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
  for(const b of boxesNear(700)){const fade=runtime.worldOpacity?.(Math.hypot(b.x-S().wx,b.y-S().wy),700)??1;const [H,Sat,L]=swatchOf(b.hue),x=b.x+ox,y=b.y+oy+Math.sin(t/500+b.spin)*5,col=`hsl(${H},${Sat}%,${L}%)`,rot=t/900+b.spin;
   const g=c.createRadialGradient(x,y,0,x,y,46);g.addColorStop(0,`hsla(${H},${Sat}%,${L}%,.35)`);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=(1)*fade;c.fillStyle=g;c.fillRect(x-46,y-46,92,92);
   c.translate(x,y);for(const [k,s] of [[0,10],[Math.PI/4,10]]){c.save();c.rotate(rot+k);c.globalAlpha=(.9)*fade;c.strokeStyle=col;c.lineWidth=1.6;c.strokeRect(-s,-s,s*2,s*2);c.restore();}
   c.globalAlpha=(.9)*fade;c.fillStyle=WORLD_VISUAL.gold;c.beginPath();c.arc(0,0,2.5+Math.sin(t/200)*1,0,TAU);c.fill();
   for(let i=0;i<3;i++){const a=t/600+i*TAU/3;c.globalAlpha=(.7)*fade;c.fillRect(Math.cos(a)*18-1,Math.sin(a)*18-1,2,2);}
   c.translate(-x,-y);if(Math.hypot(b.x-S().wx,b.y-S().wy)<160){c.globalAlpha=(.8)*fade;c.fillStyle=WORLD_VISUAL.gold;c.font='10px "Geist Mono", monospace';c.textAlign='center';c.fillText('Caja misteriosa · tócala con el cubo',x,y+34);}}
  if(has('campo')){const R=fieldRadius(left('campo'),POWERS.campo.seconds),arm=((runtime.MU.step%16)+((runtime.ac?.currentTime||0)%runtime.SIX)/runtime.SIX)/16*TAU-Math.PI/2,hue=runtime.MU.dnaT?.hue||0,[H]=swatchOf(hue);
   c.globalAlpha=.08;c.fillStyle=`hsl(${H},80%,60%)`;c.beginPath();c.arc(cx,cy,R,0,TAU);c.fill();c.globalAlpha=.5;c.strokeStyle=`hsl(${H},80%,64%)`;c.lineWidth=1.4;c.stroke();
   c.globalAlpha=.6;c.strokeStyle=runtime.cubeColor?.()||WORLD_VISUAL.gold;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(arm)*R,cy+Math.sin(arm)*R);c.stroke();}
  if(trail.length){for(const p of trail){const [H]=swatchOf((p.x+p.y)/7);c.globalAlpha=p.a*.6;c.fillStyle=`hsl(${H},85%,62%)`;c.fillRect(p.x+ox-2,p.y+oy-2,4,4);}}
  for(const m of marks){m.lit=Math.max(0,m.lit-dt*1.5);const [H]=swatchOf(m.degree*51);c.globalAlpha=.5+m.lit*.5;c.fillStyle=m.lit>.3?WORLD_VISUAL.gold:`hsl(${H},80%,64%)`;c.beginPath();c.arc(m.x+ox,m.y+oy,3+m.lit*4,0,TAU);c.fill();}
  if(companion.on){const x=companion.x+ox,y=companion.y+oy,g=c.createRadialGradient(x,y,0,x,y,22);g.addColorStop(0,`rgba(255,255,255,${.5+companion.lit*.4})`);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=1;c.fillStyle=g;c.fillRect(x-22,y-22,44,44);}
  if(has('brujula')||companion.on)for(const tg of rareTargets().slice(0,has('brujula')?4:1)){const a=Math.atan2(tg.y-S().wy,tg.x-S().wx),r=Math.min(cx,cy)-46,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;
   c.save();c.translate(x,y);c.rotate(a);c.globalAlpha=.85;c.fillStyle=WORLD_VISUAL.gold;c.beginPath();c.moveTo(10,0);c.lineTo(-6,-6);c.lineTo(-6,6);c.closePath();c.fill();c.restore();
   c.globalAlpha=.75;c.fillStyle=WORLD_VISUAL.gold;c.font='9px "Geist Mono", monospace';c.textAlign='center';c.fillText(`${tg.name} · ${Math.round(tg.d/10)} m`,x-Math.cos(a)*22,y-Math.sin(a)*22+3);}
  // Poderes activos: un renglón discreto arriba.
  const active=activePowers(powers,now());if(active.length){c.globalAlpha=.75;c.fillStyle=WORLD_VISUAL.gold;c.font='10px "Geist Mono", monospace';c.textAlign='center';c.fillText(active.map(p=>`${POWERS[p.id].name} ${Math.ceil(p.left)} s`).join(' · '),cx,Math.min(runtime.H-60,180));}
  c.restore();
 }
 function clear(){clock.clear();spawned.length=0;trail.length=0;marks.length=0;companion.on=false;companion.heard=[];companion.species=null;lastMark=null;runtime.fieldSolo=false;runtime.speedBoost=1;}
 function restore(){clock.restore(S().boxPowers);spawned.push(...normalizeGiftBoxes(S().giftBoxes));if(has('companero')){companion.on=true;companion.x=S().wx+30;companion.y=S().wy+30;const saved=S().boxPowers?.companion;companion.species=PET_SPECIES[saved?.species]?saved.species:null;companion.heard=Array.isArray(saved?.heard)?saved.heard.filter(Number.isFinite).slice(-4):[];}if(has('pincel')&&Array.isArray(S().boxPowers?.marks))for(const m of S().boxPowers.marks.slice(-16))if(Number.isFinite(m.x)&&Number.isFinite(m.y)&&Number.isInteger(m.degree)&&m.degree>=0&&m.degree<7&&Number.isInteger(m.step)&&m.step>=0&&m.step<16)marks.push({...m,lit:0});lastMark=marks.at(-1)||null;runtime.speedBoost=has('cometa')?2.2:1;runtime.fieldSolo=has('campo');}
 function ensureOwner(){if(previous!==S()){previous=S();clear();S().boxes=typeof S().boxes==='object'&&S().boxes?S().boxes:{};restore();}}
 function snapshot(){ensureOwner();const raw=S().boxPowers;if(raw?.version>1)return raw;const data=clock.snapshot();return {...raw,...data,remaining:{...raw?.remaining,...data.remaining},companion:{...raw?.companion,species:companion.species,heard:[...companion.heard]},marks:marks.map(m=>({x:m.x,y:m.y,degree:m.degree,step:m.step}))};}
 restore();
 Object.defineProperties(runtime,{snapshotPowers:{get:()=>snapshot},powerSecondsLeft:{get:()=>left},clearPowers:{get:()=>clear},boxesNear:{get:()=>boxesNear},spawnBox:{get:()=>spawnBox},givePower:{get:()=>give},powers:{get:()=>powers},cajasTick:{get:()=>tick},cajasStep:{get:()=>step},drawCajas:{get:()=>draw},powerHear:{get:()=>hear},rareTargets:{get:()=>rareTargets},hasPower:{get:()=>has}});
}
