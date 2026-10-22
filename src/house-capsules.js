import {HOUSE_OBJECTS} from './house-model.js';
import {roomBox,wallPoint} from './house-view.js';
import {debitSparks} from './sparks-model.js';
import {prefersReducedMotion} from './frame-state.js';
// House phase C4: a capsule machine in the Sala. Each capsule costs sparks and gives one surprise: a decoration,
// a sounding piece or a colour for a placed object. Pieces never repeat; the draw comes from a hash of the capsule
// count, so it never touches the game's random sequence.
export const CAPSULE_PRICE=60;
const piece=(id,name,room,x,y,shape,sound)=>Object.freeze({id,name,room,x,y,shape,...sound});
export const CAPSULE_DECOR=Object.freeze([
 piece('decor:reloj','Reloj de pared','sala',.06,.12,'clock'),
 piece('decor:planta','Planta grande','jardin',.97,.92,'plant'),
 piece('decor:globo','Globo terráqueo','sala',.22,.92,'globe'),
 piece('decor:regadera','Regadera','jardin',.04,.6,'can'),
 piece('decor:mariposas','Mariposas','jardin',.42,.22,'butterflies'),
 piece('decor:farolillo','Farolillo','jardin',.62,.08,'lantern'),
 piece('decor:cometa','Cometa','azotea',.28,.12,'kite'),
 piece('decor:veleta','Veleta','azotea',.1,.3,'vane'),
 piece('decor:hamaca','Hamaca','azotea',.5,.9,'hammock'),
 piece('decor:luna','Luna de papel','azotea',.68,.08,'moon'),
 piece('decor:baul','Baúl','sotano',.74,.95,'chest'),
 piece('decor:poster','Póster de gira','sotano',.16,.38,'poster')
]);
export const CAPSULE_SOUNDS=Object.freeze([
 piece('sound:campanas','Campanas de viento','jardin',.3,.12,'branch',{role:'lead',instrument:'metalkeys'}),
 piece('sound:cajita','Caja de música','sala',.62,.8,'box',{role:'lead',instrument:'kalimba'}),
 piece('sound:gong','Gong','sotano',.26,.62,'pod',{role:'perc',instrument:'tom'}),
 piece('sound:xilofono','Xilófono','azotea',.22,.82,'square',{role:'lead',instrument:'rhodes'}),
 piece('sound:organillo','Organillo','sotano',.2,.85,'box',{role:'lead',instrument:'reed'}),
 piece('sound:theremin','Theremín','azotea',.42,.4,'wave',{role:'lead',instrument:'bowed'})
]);
export const CAPSULE_TINTS=Object.freeze(['#ff8a8a','#8ad1ff','#a6f08a','#d4a6ff','#ffd27a','#7af0d8','#ffffff','#f0a6c8']);
export const CAPSULE_PIECES=Object.freeze([...CAPSULE_DECOR,...CAPSULE_SOUNDS]);
// The machine stands on the Sala floor under the window; the Taller is the Sala workbench.
export const MACHINE=Object.freeze({x:204,floor:540,w:44,h:70});
export const WORKBENCH=Object.freeze({x0:264,x1:414,top:410,bottom:540});
// The engine in the hold (Bodega) is what lets the house travel.
export const ENGINE=Object.freeze({x0:796,x1:936,top:610,bottom:780});
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
export const capsuleObjects=house=>(house?.decor||[]).filter(d=>CAPSULE_SOUNDS.some(p=>p.id===d.id)).map(d=>({kind:d.id,room:d.room,x:d.x,y:d.y,capsule:true}));
// House achievements: earned in the house itself.
const rule=(id,name,description,metric,threshold)=>Object.freeze({id:'house:'+id,name,description,metric,threshold,category:'Casa',hidden:false,tier:threshold>=10?'oro':threshold>=3?'plata':'bronce',adventure:true});
export const HOUSE_ACHIEVEMENTS=Object.freeze([
 rule('capsule:1','Moneda en la ranura','Abre tu primera cápsula.','house:capsules',1),
 rule('capsule:10','Coleccionista de plástico','Abre diez cápsulas.','house:capsules',10),
 rule('decor:all','Casa amueblada','Consigue todos los adornos de la máquina.','house:decor',CAPSULE_DECOR.length),
 rule('sound:all','Casa que suena','Consigue todos los sonidos de la máquina.','house:sounds',CAPSULE_SOUNDS.length),
 rule('tint:3','Pintor de interiores','Saca tres colores de la máquina.','house:tints',3),
 rule('workbench','Mesa de trabajo','Abre el Taller desde su mesa.','house:workbench',1)
]);
export function houseValue(metric,s){const h=s?.house||{},ids=new Set((h.decor||[]).map(d=>d.id));
 if(metric==='house:capsules')return Number.isSafeInteger(h.capsules?.count)?h.capsules.count:0;
 if(metric==='house:decor')return CAPSULE_DECOR.filter(p=>ids.has(p.id)).length;
 if(metric==='house:sounds')return CAPSULE_SOUNDS.filter(p=>ids.has(p.id)).length;
 if(metric==='house:tints')return Number.isSafeInteger(h.capsules?.paints)?h.capsules.paints:0;
 if(metric==='house:workbench')return h.workbench===true?1:0;
 return 0;}
// Small pictures for each decoration, centred on the origin, about s pixels wide.
export function drawDecor(c,shape,s,t,{ink='#f0d27a',night=0,calm=false,date=new Date()}={}){
 const L=(a,b,x,y)=>{c.beginPath();c.moveTo(a,b);c.lineTo(x,y);c.stroke();},sway=calm?0:Math.sin(t/700);c.lineWidth=1;c.strokeStyle='#ffffffcc';c.fillStyle='#1a1b22';
 if(shape==='clock'){c.beginPath();c.arc(0,0,s*.45,0,6.283);c.fill();c.stroke();const hr=(date.getHours()%12+date.getMinutes()/60)/12*6.283,mn=date.getMinutes()/60*6.283;c.strokeStyle=ink;L(0,0,Math.sin(hr)*s*.22,-Math.cos(hr)*s*.22);c.strokeStyle='#fff';L(0,0,Math.sin(mn)*s*.34,-Math.cos(mn)*s*.34);}
 else if(shape==='plant'){c.fillStyle='#2a1d14';c.fillRect(-s*.25,s*.1,s*.5,s*.4);c.strokeRect(-s*.25,s*.1,s*.5,s*.4);c.strokeStyle='#7fbf6a';for(let i=-2;i<=2;i++)L(0,s*.1,i*s*.2+sway*2,-s*.5+Math.abs(i)*s*.12);}
 else if(shape==='globe'){c.strokeStyle='#8ad1ff';c.beginPath();c.arc(0,-s*.15,s*.3,0,6.283);c.stroke();c.beginPath();c.ellipse(0,-s*.15,s*.12,s*.3,0,0,6.283);c.stroke();c.strokeStyle='#ffffffaa';L(0,s*.15,0,s*.45);L(-s*.2,s*.45,s*.2,s*.45);}
 else if(shape==='can'){c.fillStyle='#3b5f8a';c.fillRect(-s*.3,-s*.15,s*.45,s*.4);c.strokeRect(-s*.3,-s*.15,s*.45,s*.4);L(s*.15,-s*.05,s*.42,-s*.3);}
 else if(shape==='butterflies'){c.strokeStyle=ink;for(let i=0;i<3;i++){const x=(i-1)*s*.4,y=(calm?0:Math.sin(t/300+i*2))*s*.15,w=calm?.3:.2+.15*Math.abs(Math.sin(t/90+i));c.beginPath();c.moveTo(x-s*w,y-s*.1);c.lineTo(x,y);c.lineTo(x+s*w,y-s*.1);c.stroke();}}
 else if(shape==='lantern'){c.strokeStyle='#ffffff66';L(0,-s*.6,0,-s*.25);c.fillStyle='#c4502e';c.globalAlpha=.6+.4*night;c.fillRect(-s*.18,-s*.25,s*.36,s*.45);c.globalAlpha=1;c.strokeRect(-s*.18,-s*.25,s*.36,s*.45);if(night>.3){c.fillStyle=ink;c.globalAlpha=.25*night;c.beginPath();c.arc(0,0,s*.6,0,6.283);c.fill();c.globalAlpha=1;}}
 else if(shape==='kite'){c.save();c.rotate(sway*.15);c.fillStyle='#d4505a';c.beginPath();c.moveTo(0,-s*.45);c.lineTo(s*.28,0);c.lineTo(0,s*.4);c.lineTo(-s*.28,0);c.closePath();c.fill();c.stroke();c.strokeStyle='#ffffff88';c.beginPath();c.moveTo(0,s*.4);c.quadraticCurveTo(s*.3,s*.7,-s*.1,s*.95);c.stroke();c.restore();}
 else if(shape==='vane'){c.strokeStyle='#ffffffaa';L(0,-s*.1,0,s*.5);c.save();c.translate(0,-s*.1);c.rotate(calm?0:Math.sin(t/1500)*.6);c.strokeStyle=ink;L(-s*.4,0,s*.4,0);L(s*.4,0,s*.28,-s*.08);L(s*.4,0,s*.28,s*.08);c.restore();}
 else if(shape==='hammock'){c.strokeStyle='#ffffffaa';L(-s*.7,-s*.3,-s*.7,s*.3);L(s*.7,-s*.3,s*.7,s*.3);c.strokeStyle=ink;c.beginPath();c.moveTo(-s*.7,-s*.2);c.quadraticCurveTo(0,s*.3+sway,s*.7,-s*.2);c.stroke();}
 else if(shape==='moon'){c.fillStyle='#f3eccf';c.beginPath();c.arc(0,0,s*.35,0,6.283);c.fill();c.fillStyle='#000';c.globalAlpha=.85;c.beginPath();c.arc(s*.14,-s*.08,s*.3,0,6.283);c.fill();c.globalAlpha=1;c.strokeStyle='#ffffff55';L(0,-s*.35,0,-s*.7);}
 else if(shape==='chest'){c.fillStyle='#3a2716';c.fillRect(-s*.4,-s*.2,s*.8,s*.4);c.strokeRect(-s*.4,-s*.2,s*.8,s*.4);L(-s*.4,-s*.05,s*.4,-s*.05);c.fillStyle=ink;c.fillRect(-2,-s*.08,4,5);}
 else if(shape==='poster'){c.fillStyle='#14151c';c.fillRect(-s*.3,-s*.42,s*.6,s*.84);c.strokeRect(-s*.3,-s*.42,s*.6,s*.84);c.fillStyle=ink;c.fillRect(-s*.2,-s*.3,s*.4,s*.3);c.fillStyle='#ffffff88';for(let i=0;i<3;i++)c.fillRect(-s*.2,s*.08+i*s*.1,s*(.4-i*.1),1);}
}
export function initialize(runtime){
 let spinAt=-1e9,armedAt=-1e9,last=null,opened=0;
 const kindsOf=h=>h.objects.filter(o=>o&&HOUSE_OBJECTS.some(d=>d.id===o.kind)).map(o=>o.kind);
 function jingle(){const ac=runtime.ac;if(!runtime.S.sound||ac?.state!=='running'||!runtime.bus)return;[0,4,7,12].forEach((n,i)=>{const t=ac.currentTime+.05+i*.08,o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(660*2**(n/12),t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.03,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.22);o.connect(g).connect(runtime.bus);o.start(t);o.stop(t+.25);});}
 // One capsule: sparks are taken only if the house could be saved with the prize in it.
 function open(){const S=runtime.S,h=runtime.currentHouse?.();if(!h||h.readOnly||runtime.houseVisiting?.())return null;const prize=capsulePrize(h,kindsOf(h));
  if(!prize){runtime.toast('Ya tienes todo lo de la máquina.');return null;}
  if(!(S.sparks>=CAPSULE_PRICE)){runtime.toast('La cápsula cuesta '+CAPSULE_PRICE+' ✦.');return null;}
  const before={sparks:S.sparks,economy:structuredClone(S.sparkEconomy),decor:h.decor,tints:h.tints,capsules:h.capsules};
  if(!debitSparks(S,CAPSULE_PRICE))return null;applyPrize(h,prize);
  if(runtime.save()===false){S.sparks=before.sparks;S.sparkEconomy=before.economy;h.decor=before.decor;h.tints=before.tints;h.capsules=before.capsules;runtime.toast('No se guardó. Conservas tus chispas.');return null;}
  spinAt=performance.now();last=prize;opened++;jingle();runtime.hud?.();
  const name=prize.type==='tint'?'Color nuevo para '+(HOUSE_OBJECTS.find(d=>d.id===prize.kind)?.name||'un objeto'):prize.piece.name+' · '+({sala:'Sala',jardin:'Jardín',azotea:'Azotea',sotano:'Bodega'})[prize.piece.room];
  runtime.toast('<em>Cápsula</em> · '+name);return prize;}
 // A tap on the machine asks first; a second tap within four seconds turns the knob.
 function tap(hx,hy){const h=runtime.currentHouse?.();if(!h)return false;
  if(Math.abs(hx-MACHINE.x)<=MACHINE.w/2+4&&hy<=MACHINE.floor&&hy>=MACHINE.floor-MACHINE.h-6){if(h.readOnly||runtime.houseVisiting?.()){runtime.toast('De visita, la máquina no gira.');return true;}
   const now=performance.now();if(now-armedAt<4000){armedAt=-1e9;open();}else{armedAt=now;runtime.toast('Cápsula · '+CAPSULE_PRICE+' ✦. Toca otra vez para girar.');}return true;}
  if((h.unlocked||[]).includes('sotano')&&hx>=ENGINE.x0&&hx<=ENGINE.x1&&hy>=ENGINE.top&&hy<=ENGINE.bottom){runtime.toast('Motor de la casa · la lleva contigo.');return true;}
  if(hx>=WORKBENCH.x0&&hx<=WORKBENCH.x1&&hy>=WORKBENCH.top&&hy<=WORKBENCH.bottom){if(h.readOnly||runtime.houseVisiting?.())return false;
   if(h.workbench!==true){h.workbench=true;runtime.save();}runtime.houseOpenWorkshop?.();return true;}
  return false;}
 function draw(c,{toScreen,k,t,calm:still,house,cube,night=0}){
  c.save();c.globalAlpha=1;
  for(const d of house.decor||[]){const p=CAPSULE_DECOR.find(q=>q.id===d.id),b=roomBox(d.room);if(!p||!b||!(house.unlocked||[]).includes(d.room))continue;const w=wallPoint(b,d.x,d.y),s=toScreen(w.x,w.y);c.save();c.translate(Math.round(s.x),Math.round(s.y));drawDecor(c,p.shape,Math.max(10,26*k),t,{night,calm:still});c.restore();}
  // The machine: a glass dome full of capsules on a red stand, with a coin slot and a knob.
  const base=toScreen(MACHINE.x,MACHINE.floor),w=MACHINE.w*k,hh=MACHINE.h*k,spin=Math.max(0,1-(performance.now()-spinAt)/900),armed=performance.now()-armedAt<4000;
  c.fillStyle='#8f2a2a';c.strokeStyle='#ffffffaa';c.lineWidth=1;c.fillRect(base.x-w/2,base.y-hh*.45,w,hh*.45);c.strokeRect(Math.round(base.x-w/2)+.5,Math.round(base.y-hh*.45)+.5,Math.round(w),Math.round(hh*.45));
  c.fillStyle='#000';c.fillRect(base.x-w*.12,base.y-hh*.36,w*.24,2);c.save();c.translate(base.x,base.y-hh*.2);c.rotate(still?0:spin*6.283*2);c.strokeStyle=armed?'#f0d27a':'#fff';c.beginPath();c.arc(0,0,Math.max(2,w*.12),0,6.283);c.stroke();c.beginPath();c.moveTo(-w*.12,0);c.lineTo(w*.12,0);c.stroke();c.restore();
  const cy=base.y-hh*.45-w*.42;c.fillStyle='#ffffff10';c.beginPath();c.arc(base.x,cy,w*.46,0,6.283);c.fill();c.strokeStyle='#ffffffcc';c.stroke();
  for(let i=0;i<9;i++){const a=i*2.4+(still?0:spin*8),r=w*(.12+.22*((i*37)%10)/10);c.fillStyle=CAPSULE_TINTS[i%CAPSULE_TINTS.length];c.beginPath();c.arc(base.x+Math.cos(a)*r,cy+w*.12+Math.sin(a)*r*.6,Math.max(1.5,w*.08),0,6.283);c.fill();}
  if(spin>0&&last&&!still){c.fillStyle=last.type==='tint'?last.color:'#f0d27a';c.globalAlpha=spin;c.beginPath();c.arc(base.x+w*.6,base.y-hh*.1-(1-spin)*hh*.6,Math.max(3,w*.14),0,6.283);c.fill();c.globalAlpha=1;}
  // Near the workbench, a quiet label says what it is.
  if(cube?.floor===1&&cube.x>=WORKBENCH.x0-10&&cube.x<=WORKBENCH.x1+10){const p=toScreen((WORKBENCH.x0+WORKBENCH.x1)/2,WORKBENCH.top-8);c.font='11px "Geist Mono", monospace';c.textAlign='center';c.fillStyle='#f0d27a';c.fillText('Taller · toca la mesa',p.x,p.y);c.textAlign='start';}
  c.restore();}
 Object.defineProperties(runtime,{drawHouseCapsules:{get:()=>draw},houseCapsuleTap:{get:()=>tap},openHouseCapsule:{get:()=>open},capsuleObjects:{get:()=>capsuleObjects},capsuleDefinition:{get:()=>capsuleDefinition},
  houseCapsuleState:{get:()=>()=>({opened,last,price:CAPSULE_PRICE,next:runtime.currentHouse?capsulePrize(runtime.currentHouse(),kindsOf(runtime.currentHouse())):null})}});
}
