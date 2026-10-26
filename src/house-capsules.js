import {HOUSE_OBJECTS,HOUSE_ROOMS} from './house-model.js';
import {roomBox,wallPoint} from './house-view.js';
import {debitSparks} from './sparks-model.js';
import {prefersReducedMotion} from './frame-state.js';
// The Prism in Eco: each capsule costs sparks and gives one surprise: an ornament, a sounding piece or a colour
// for a placed object (ids kept from the first house, so nothing earned changes). Pieces never repeat; the draw comes from a hash of the capsule
// count, so it never touches the game's random sequence.
export const CAPSULE_PRICE=60;
const piece=(id,name,room,x,y,shape,sound)=>Object.freeze({id,name,room,x,y,shape,...sound});
export const CAPSULE_DECOR=Object.freeze([
 piece('decor:reloj','Órbita','sala',.06,.12,'orbit'),
 piece('decor:planta','Brote de luz','jardin',.97,.92,'sprout'),
 piece('decor:globo','Esfera','sala',.22,.92,'sphere'),
 piece('decor:regadera','Lluvia lenta','jardin',.04,.6,'rain'),
 piece('decor:mariposas','Destellos','jardin',.42,.22,'sparks'),
 piece('decor:farolillo','Lámpara','jardin',.62,.08,'lamp'),
 piece('decor:cometa','Vela','azotea',.28,.12,'sail'),
 piece('decor:veleta','Brújula','azotea',.1,.3,'compass'),
 piece('decor:hamaca','Arco','azotea',.5,.9,'arc'),
 piece('decor:luna','Media luna','azotea',.68,.08,'moon'),
 piece('decor:baul','Monolito','sotano',.74,.9,'monolith'),
 piece('decor:poster','Partitura','sotano',.16,.38,'score')
]);
export const CAPSULE_SOUNDS=Object.freeze([
 piece('sound:campanas','Campanas de viento','jardin',.3,.12,'branch',{role:'lead',instrument:'metalkeys'}),
 piece('sound:cajita','Caja sonora','sala',.62,.3,'box',{role:'lead',instrument:'kalimba'}),
 piece('sound:gong','Gong','sotano',.26,.62,'pod',{role:'perc',instrument:'tom'}),
 piece('sound:xilofono','Xilófono','azotea',.22,.82,'square',{role:'lead',instrument:'rhodes'}),
 piece('sound:organillo','Fuelle','sotano',.2,.85,'box',{role:'lead',instrument:'reed'}),
 piece('sound:theremin','Theremín','azotea',.42,.4,'wave',{role:'lead',instrument:'bowed'})
]);
export const CAPSULE_TINTS=Object.freeze(['#ff8a8a','#8ad1ff','#a6f08a','#d4a6ff','#ffd27a','#7af0d8','#ffffff','#f0a6c8']);
export const CAPSULE_PIECES=Object.freeze([...CAPSULE_DECOR,...CAPSULE_SOUNDS]);
// The Prism stands on the Eco floor; the Taller is its radial disc floating beside it.
export const MACHINE=Object.freeze({x:204,floor:540,w:44,h:70});
export const WORKBENCH=Object.freeze({x0:295,x1:385,top:426,bottom:540});
// The Core in the Raíz beats with the music; it is what carries the Refugio.
export const ENGINE=Object.freeze({x0:830,x1:902,top:660,bottom:740});
export function hash(text){let h=2166136261;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
// What the next capsule gives. New pieces for open rooms come first; every third capsule paints a placed object.
export function capsulePrize(house,kinds=[]){
 const owned=new Set((house.decor||[]).map(d=>d.id)),left=CAPSULE_PIECES.filter(p=>!owned.has(p.id)),open=left.filter(p=>(house.unlocked||['sala']).includes(p.room)),n=house.capsules?.count||0,h=hash('capsule:'+n);
 if(kinds.length&&(!left.length||n%3===2)){const kind=kinds[h%kinds.length],colors=CAPSULE_TINTS.filter(c=>c!==house.tints?.[kind]);return {type:'tint',kind,color:colors[(h>>>8)%colors.length]};}
 const pool=open.length?open:left;if(!pool.length)return null;const p=pool[h%pool.length];return {type:p.role?'sound':'decor',piece:p};
}
export function applyPrize(house,prize){
 if(!prize)return false;house.capsules={...(house.capsules||{}),count:(house.capsules?.count||0)+1,items:{...(house.capsules?.items||{})}};
 if(prize.type==='tint'){house.capsules.paints=(Number.isSafeInteger(house.capsules.paints)?house.capsules.paints:0)+1;house.tints={...(house.tints||{}),[prize.kind]:prize.color};return true;}
 const p=prize.piece;house.decor=[...(house.decor||[]),{id:p.id,room:p.room,x:p.x,y:p.y}];house.capsules.items[p.id]=true;return true;
}
// Sounding pieces join the house like any placed object: same sequencer, same walls.
export const capsuleDefinition=o=>CAPSULE_SOUNDS.find(p=>p.id===o?.kind)||null;
export const capsuleObjects=house=>(house?.decor||[]).filter(d=>CAPSULE_SOUNDS.some(p=>p.id===d.id)&&(house.unlocked||['sala']).includes(d.room)&&HOUSE_ROOMS.some(r=>r.id===d.room)).map(d=>({kind:d.id,room:d.room,x:d.x,y:d.y,capsule:true}));
// House achievements: earned in the house itself.
const rule=(id,name,description,metric,threshold)=>Object.freeze({id:'house:'+id,name,description,metric,threshold,category:'Casa',hidden:false,tier:threshold>=10?'oro':threshold>=3?'plata':'bronce',adventure:true});
export const HOUSE_ACHIEVEMENTS=Object.freeze([
 rule('capsule:1','Primer destello','Gira el Prisma por primera vez.','house:capsules',1),
 rule('capsule:10','Diez destellos','Gira el Prisma diez veces.','house:capsules',10),
 rule('decor:all','Refugio completo','Consigue todos los ornamentos del Prisma.','house:decor',CAPSULE_DECOR.length),
 rule('sound:all','Refugio que suena','Consigue todos los sonidos del Prisma.','house:sounds',CAPSULE_SOUNDS.length),
 rule('tint:3','Pintor de interiores','Saca tres colores del Prisma.','house:tints',3),
 rule('workbench','Disco del Taller','Abre el Taller desde su disco.','house:workbench',1)
]);
export function houseValue(metric,s){const h=s?.house||{},ids=new Set((h.decor||[]).map(d=>d.id));
 if(metric==='house:capsules')return Number.isSafeInteger(h.capsules?.count)?h.capsules.count:0;
 if(metric==='house:decor')return CAPSULE_DECOR.filter(p=>ids.has(p.id)).length;
 if(metric==='house:sounds')return CAPSULE_SOUNDS.filter(p=>ids.has(p.id)).length;
 if(metric==='house:tints')return Number.isSafeInteger(h.capsules?.paints)?h.capsules.paints:0;
 if(metric==='house:workbench')return h.workbench===true?1:0;
 return 0;}
// Ornaments: thin abstract forms, centred on the origin, about s pixels wide.
export function drawDecor(c,shape,s,t,{ink='#f0d27a',night=0,calm=false,date=new Date()}={}){
 const L=(a,b,x,y)=>{c.beginPath();c.moveTo(a,b);c.lineTo(x,y);c.stroke();},A=(x,y,r,a0=0,a1=6.283)=>{c.beginPath();c.arc(x,y,r,a0,a1);c.stroke();},dot=(x,y,r=1.5)=>c.fillRect(Math.round(x-r),Math.round(y-r),r*2,r*2),slow=calm?0:t/1000;
 c.lineWidth=1;c.strokeStyle='#ffffffcc';c.fillStyle=ink;
 if(shape==='orbit'){A(0,0,s*.45);const h=(date.getHours()%12+date.getMinutes()/60)/12*6.283;dot(Math.sin(h)*s*.45,-Math.cos(h)*s*.45,2);}
 else if(shape==='sprout'){for(let i=-1;i<=1;i++){const x=i*s*.2,y=-s*(.35+(i===0?.15:0))+(calm?0:Math.sin(slow*2+i)*2);L(x,s*.4,x,y);dot(x,y);}}
 else if(shape==='sphere'){A(0,0,s*.38);c.beginPath();c.ellipse(0,0,s*.14,s*.38,calm?0:slow*.3,0,6.283);c.stroke();}
 else if(shape==='rain'){c.fillStyle='#cfe6ff';for(let i=0;i<3;i++)for(let j=0;j<3;j++){const y=((j/3+(calm?0:slow*.4)+i*.17)%1)*s-s/2;c.globalAlpha=.3+.5*(1-Math.abs(y)/(s/2));dot((i-1)*s*.25,y,1);}c.globalAlpha=1;}
 else if(shape==='sparks'){for(let i=0;i<3;i++){const a=calm?.7:.4+.6*Math.abs(Math.sin(slow*3+i*2));c.globalAlpha=a;dot((i-1)*s*.35,Math.sin(i*2.1)*s*.2,1.5);}c.globalAlpha=1;}
 else if(shape==='lamp'){L(0,-s*.6,0,-s*.15);c.globalAlpha=.18+.25*night;c.beginPath();c.arc(0,0,s*.5,0,6.283);c.fill();c.globalAlpha=1;dot(0,0,2.5);}
 else if(shape==='sail'){c.beginPath();c.moveTo(0,-s*.5);c.lineTo(s*.35,s*.35);c.lineTo(-s*.3,s*.35);c.closePath();c.stroke();}
 else if(shape==='compass'){A(0,0,s*.3);c.save();c.rotate(calm?0:Math.sin(slow*.4)*.8);L(0,s*.4,0,-s*.4);c.restore();c.save();c.rotate(calm?0:Math.sin(slow*.4)*.8);dot(0,-s*.4,1.5);c.restore();}
 else if(shape==='arc'){c.strokeStyle=ink;A(0,s*.5,s,3.5,5.92);}
 else if(shape==='moon'){c.strokeStyle='#f3eccf';A(0,0,s*.35,.9,4.4);}
 else if(shape==='monolith'){c.strokeRect(Math.round(-s*.15)+.5,Math.round(-s*.9)+.5,Math.round(s*.3),Math.round(s*1.3));dot(0,-s*.6,1);}
 else if(shape==='score'){c.strokeStyle='#ffffff66';for(let i=0;i<5;i++)L(-s*.4,(i-2)*s*.12,s*.4,(i-2)*s*.12);dot(-s*.15,-s*.06,2);dot(s*.15,s*.12,2);}
}
export function initialize(runtime){
 let spinAt=-1e9,armedAt=-1e9,last=null,opened=0;
 const kindsOf=h=>h.objects.filter(o=>o&&HOUSE_OBJECTS.some(d=>d.id===o.kind)).map(o=>o.kind);
 function jingle(){const ac=runtime.ac;if(!runtime.S.sound||ac?.state!=='running'||!runtime.bus)return;[0,4,7,12].forEach((n,i)=>{const t=ac.currentTime+.05+i*.08,o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(660*2**(n/12),t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.03,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.22);o.connect(g).connect(runtime.bus);o.start(t);o.stop(t+.25);});}
 // One capsule: sparks are taken only if the house could be saved with the prize in it.
 function open(){const S=runtime.S,h=runtime.currentHouse?.();if(!h||h.readOnly||runtime.houseVisiting?.())return null;const prize=capsulePrize(h,kindsOf(h));
  if(!prize){runtime.toast('Ya tienes todo lo del Prisma.');return null;}
  if(!(S.sparks>=CAPSULE_PRICE)){runtime.toast('La cápsula cuesta '+CAPSULE_PRICE+' ✦.');return null;}
  const before={sparks:S.sparks,economy:structuredClone(S.sparkEconomy),decor:h.decor,tints:h.tints,capsules:h.capsules};
  if(!debitSparks(S,CAPSULE_PRICE))return null;applyPrize(h,prize);
  if(runtime.save()===false){S.sparks=before.sparks;S.sparkEconomy=before.economy;h.decor=before.decor;h.tints=before.tints;h.capsules=before.capsules;runtime.toast('No se guardó. Conservas tus chispas.');return null;}
  spinAt=performance.now();last=prize;opened++;jingle();runtime.hud?.();
  const name=prize.type==='tint'?'Color nuevo para '+(HOUSE_OBJECTS.find(d=>d.id===prize.kind)?.name||'un objeto'):prize.piece.name+' · '+(HOUSE_ROOMS.find(r=>r.id===prize.piece.room)?.name||'');
  runtime.toast('<em>Prisma</em> · '+name);return prize;}
 // A tap on the machine asks first; a second tap within four seconds turns the knob.
 function tap(hx,hy){const h=runtime.currentHouse?.();if(!h)return false;const st=runtime.houseStand?.(),at=(x0,x1)=>!st||st.floor===1&&st.fx>=x0&&st.fx<=x1;
  if(Math.abs(hx-MACHINE.x)<=MACHINE.w/2+4&&hy<=MACHINE.floor&&hy>=MACHINE.floor-MACHINE.h-6&&at(MACHINE.x-40,MACHINE.x+40)){if(h.readOnly||runtime.houseVisiting?.()){runtime.toast('De visita, el Prisma no gira.');return true;}
   const now=performance.now();if(now-armedAt<4000){armedAt=-1e9;open();}else{armedAt=now;runtime.toast('Prisma · '+CAPSULE_PRICE+' ✦. Toca otra vez para girarlo.');}return true;}
  if((h.unlocked||[]).includes('sotano')&&hx>=ENGINE.x0&&hx<=ENGINE.x1&&hy>=ENGINE.top&&hy<=ENGINE.bottom&&(!st||st.floor===2&&st.fx>=ENGINE.x0-40&&st.fx<=ENGINE.x1+40)){runtime.toast('Núcleo · lleva el Refugio contigo.');return true;}
  if(hx>=WORKBENCH.x0&&hx<=WORKBENCH.x1&&hy>=WORKBENCH.top&&hy<=WORKBENCH.bottom&&at(WORKBENCH.x0-40,WORKBENCH.x1+40)){if(h.readOnly||runtime.houseVisiting?.())return false;
   if(h.workbench!==true){h.workbench=true;runtime.save();}runtime.houseOpenWorkshop?.();return true;}
  return false;}
 function draw(c,{toScreen,k,t,calm:still,house,cube,night=0}){
  c.save();c.globalAlpha=1;
  for(const d of house.decor||[]){const p=CAPSULE_DECOR.find(q=>q.id===d.id),b=roomBox(d.room);if(!p||!b||!(house.unlocked||[]).includes(d.room))continue;const w=wallPoint(b,d.x,d.y),s=toScreen(w.x,w.y);c.save();c.translate(Math.round(s.x),Math.round(s.y));drawDecor(c,p.shape,Math.max(10,26*k),t,{night,calm:still});c.restore();}
  const now=performance.now(),spin=Math.max(0,1-(now-spinAt)/900),armed=now-armedAt<4000,label=(text,x,y,on)=>{c.font='11px "Geist Mono", monospace';c.letterSpacing='2px';c.textAlign='center';c.fillStyle=on?'#ffffff':'#ffffff73';c.fillText(text,x,y);c.textAlign='start';c.letterSpacing='0px';};
  // The Prism: a slowly turning triangular prism with sparks inside; it spins when it gives something.
  {const p=toScreen(MACHINE.x,MACHINE.floor-36),sz=24*k,a=(still?0:t/2400)+spin*9,near=cube?.floor===1&&Math.abs(cube.x-MACHINE.x)<40,pts=[0,1,2].map(i=>[Math.cos(a+i*2.094)*sz,Math.sin(a+i*2.094)*sz*.35]);
   c.strokeStyle='#ffffff';c.globalAlpha=armed?1:.75;for(const yy of [-sz,sz*.6]){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(p.x+x,p.y+yy+y):c.moveTo(p.x+x,p.y+yy+y));c.closePath();c.stroke();}pts.forEach(([x,y])=>{c.beginPath();c.moveTo(p.x+x,p.y-sz+y);c.lineTo(p.x+x,p.y+sz*.6+y);c.stroke();});
   CAPSULE_TINTS.slice(0,5).forEach((col,i)=>{c.fillStyle=col;c.fillRect(Math.round(p.x+Math.cos(a*2+i*1.3)*sz*.4-1.5),Math.round(p.y-sz*.2+Math.sin(a*3+i)*sz*.4-1.5),3,3);});
   if(spin>0&&last&&!still){c.fillStyle=last.type==='tint'?last.color:'#f0d27a';c.globalAlpha=spin;c.fillRect(Math.round(p.x-2),Math.round(p.y-sz-(1-spin)*60*k),4,4);}
   c.globalAlpha=1;label(near?'PRISMA · '+CAPSULE_PRICE+' ✦':'PRISMA',p.x,p.y+sz*1.4,near||armed);}
  // The Taller: its own radial disc, floating in Eco, with the current step lit in white (panel 10, P7: gold only for
  // what is earned; «near» and «armed» are states, in white).
  {const p=toScreen((WORKBENCH.x0+WORKBENCH.x1)/2,474),r=34*k,near=cube?.floor===1&&cube.x>=WORKBENCH.x0-40&&cube.x<=WORKBENCH.x1+40,step=Math.floor((runtime.MU?.step??t/125))%16;c.strokeStyle='#ffffff';
   for(const [f,al] of [[1,.7],[.68,.35],[.38,.35]]){c.globalAlpha=al;c.beginPath();c.arc(p.x,p.y,r*f,0,6.283);c.stroke();}
   for(let i=0;i<16;i++){const an=-1.571+i/16*6.283;c.globalAlpha=i%4?.35:.8;c.fillStyle='#fff';const z=i===step?4:2;if(i===step)c.globalAlpha=1;c.fillRect(Math.round(p.x+Math.cos(an)*r-z/2),Math.round(p.y+Math.sin(an)*r-z/2),z,z);}
   c.globalAlpha=1;label(near?'TALLER · TOCA EL DISCO':'TALLER',p.x,p.y-r-8,near);}
  // The Core in the Raíz: concentric squares beating with the music.
  if((house.unlocked||[]).includes('sotano')){const p=toScreen((ENGINE.x0+ENGINE.x1)/2,(ENGINE.top+ENGINE.bottom)/2),b=still?0:Math.max(0,Math.cos(t/250)),near=cube?.floor===2&&cube.x>=ENGINE.x0-40&&cube.x<=ENGINE.x1+40;
   for(let i=0;i<3;i++){const sz=(14+i*12+b*4)*k;c.globalAlpha=.7-i*.2;c.strokeStyle=i?'#ffffff':'#f0d27a';c.strokeRect(Math.round(p.x-sz/2)+.5,Math.round(p.y-sz/2)+.5,Math.round(sz),Math.round(sz));}
   c.globalAlpha=1;c.fillStyle='#f0d27a';c.fillRect(Math.round(p.x-3),Math.round(p.y-3),6,6);label('NÚCLEO',p.x,p.y+46*k,near);}
  c.restore();}
 Object.defineProperties(runtime,{drawHouseCapsules:{get:()=>draw},houseCapsuleTap:{get:()=>tap},openHouseCapsule:{get:()=>open},capsuleObjects:{get:()=>capsuleObjects},capsuleDefinition:{get:()=>capsuleDefinition},
  houseCapsuleState:{get:()=>()=>({opened,last,price:CAPSULE_PRICE,next:runtime.currentHouse?capsulePrize(runtime.currentHouse(),kindsOf(runtime.currentHouse())):null})}});
}
