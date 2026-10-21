import {realNight} from './world-light-model.js';
// The dollhouse: the house cut open from the side. House units (HU) are fixed; the camera turns them into pixels.
// Each room keeps the sequencer: across a room is the bar (16 steps) and the height on its wall is the note.
export const HOUSE_W=1000,ROOF=170,WALL=14,SLAB=12;
export const FLOORS=Object.freeze([
 {id:0,top:0,bottom:240},
 {id:1,top:252,bottom:540},
 {id:2,top:552,bottom:780}
].map(Object.freeze));
export const HOUSE_H=FLOORS[2].bottom+WALL;
export const ROOM_BOXES=Object.freeze({
 azotea:Object.freeze({floor:0,x0:WALL,x1:HOUSE_W-WALL}),
 sala:Object.freeze({floor:1,x0:WALL,x1:556}),
 jardin:Object.freeze({floor:1,x0:570,x1:HOUSE_W-WALL}),
 sotano:Object.freeze({floor:2,x0:WALL,x1:HOUSE_W-WALL})
});
// Stairs: walk into the zone and go up or down.
export const STAIRS=Object.freeze([
 Object.freeze({from:1,to:0,x0:430,x1:530,room:'azotea'}),
 Object.freeze({from:0,to:1,x0:430,x1:530,room:'sala'}),
 Object.freeze({from:1,to:2,x0:40,x1:140,room:'sotano'}),
 Object.freeze({from:2,to:1,x0:40,x1:140,room:'sala'})
]);
export const DOOR=Object.freeze({floor:1,x0:556,x1:570});
// Interior rectangle of a room in HU.
export function roomBox(id){const r=ROOM_BOXES[id];if(!r)return null;const f=FLOORS[r.floor];return {id,floor:r.floor,x:r.x0,y:f.top,w:r.x1-r.x0,h:f.bottom-f.top};}
// A place on the wall: x along the bar, y from the ceiling (0) to the floor (1), kept off the edges.
export function wallPoint(box,x,y){return {x:box.x+18+x*(box.w-36),y:box.y+26+y*(box.h-52)};}
export function wallToNormal(box,px,py){return {x:Math.max(0,Math.min(1,(px-box.x-18)/(box.w-36))),y:Math.max(0,Math.min(1,(py-box.y-26)/(box.h-52)))};}
// Which room a floor position belongs to.
export function roomAt(floor,fx){for(const [id,r]of Object.entries(ROOM_BOXES))if(r.floor===floor&&fx>=r.x0&&fx<=r.x1)return id;return floor===1?(fx<563?'sala':'jardin'):floor===0?'azotea':'sotano';}
// Walking along a floor: walls stop the cube; the door to a locked room stays shut.
export function walk(floor,fx,dx,unlocked){
 let next=Math.max(WALL+12,Math.min(HOUSE_W-WALL-12,fx+dx));
 if(floor===1&&!unlocked.includes('jardin')&&next>DOOR.x0-12)next=Math.min(next,DOOR.x0-12);
 if(floor===1&&!unlocked.includes('sala')&&next<DOOR.x1+12)next=Math.max(next,DOOR.x1+12);
 return next;
}
export function stairFor(floor,fx,dir,unlocked){return STAIRS.find(s=>s.from===floor&&fx>=s.x0&&fx<=s.x1&&Math.sign(s.to-s.from)===dir&&unlocked.includes(s.room))||null;}
// Camera: a scale that fits a floor in the free part of the screen, or the whole house for the overview.
export function viewScale(W,H,overview){return overview?Math.min((W-24)/HOUSE_W,(H-24)/(HOUSE_H+ROOF)):Math.min((W-16)/600,(H-24)/330,1.6);}
const mix=(a,b,k)=>a+(b-a)*k;
function hexRgb(hex){const n=parseInt(hex.slice(1),16);return [n>>16&255,n>>8&255,n&255];}
function sky(night){const day=[[22,30,46],[34,44,64]],dark=[[2,3,8],[8,10,20]];return day.map((c,i)=>c.map((v,j)=>Math.round(mix(v,dark[i][j],night))));}
const rgb=c=>`rgb(${c[0]},${c[1]},${c[2]})`;
// Night from the real hour: 0 day, 1 night.
export const houseNight=(date=new Date())=>realNight(date.getHours()+date.getMinutes()/60);
// Everything that does not move, drawn once per scale, hour bucket and set of open rooms.
export function paintShell(c,k,{night=0,unlocked=['sala'],ink='#f0d27a'}={}){
 c.save();c.scale(k,k);c.lineWidth=1/k;const line=(x0,y0,x1,y1)=>{c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();};
 // Ground just around the house; the sky and the wide ground are painted live across the screen.
 c.fillStyle='#0d0a07';c.fillRect(-60,FLOORS[2].top-SLAB,HOUSE_W+120,HOUSE_H-FLOORS[2].top+SLAB+40);
 // Roof, tiles and chimney.
 c.fillStyle='#0b0b0d';c.beginPath();c.moveTo(-26,0);c.lineTo(HOUSE_W/2,-ROOF);c.lineTo(HOUSE_W+26,0);c.closePath();c.fill();
 c.strokeStyle='#ffffff33';for(let r=1;r<8;r++){const y=-ROOF+r*ROOF/8,half=(HOUSE_W/2+26)*r/8;line(HOUSE_W/2-half,y,HOUSE_W/2+half,y);for(let x=HOUSE_W/2-half+(r%2)*14;x<HOUSE_W/2+half;x+=28)line(x,y-ROOF/8,x,y);}
 c.strokeStyle='#ffffffaa';c.beginPath();c.moveTo(-26,0);c.lineTo(HOUSE_W/2,-ROOF);c.lineTo(HOUSE_W+26,0);c.stroke();
 c.fillStyle='#111';c.fillRect(760,-ROOF*.62,46,ROOF*.42);c.strokeStyle='#ffffff88';c.strokeRect(760,-ROOF*.62,46,ROOF*.42);c.fillStyle='#ffffff22';c.fillRect(754,-ROOF*.66,58,8);
 // Shell: outer walls and slabs.
 c.fillStyle='#16161a';c.fillRect(0,0,HOUSE_W,HOUSE_H);
 for(const id of Object.keys(ROOM_BOXES))paintRoom(c,roomBox(id),{night,open:unlocked.includes(id),ink});
 c.strokeStyle='#ffffffcc';c.lineWidth=1.5/k;c.strokeRect(0,0,HOUSE_W,HOUSE_H);c.lineWidth=1/k;
 // Stairs between floors: filled steps with a light nosing and a stringer underneath.
 const flight=(x0,x1,yBottom,yTop,steps,rising)=>{const w=(x1-x0)/steps,h=(yBottom-yTop)/steps;c.fillStyle='#22222a';c.beginPath();c.moveTo(rising?x0:x1,yBottom);for(let i=0;i<steps;i++){const x=rising?x0+i*w:x1-i*w,y=yBottom-(i+1)*h;c.lineTo(x,y);c.lineTo(rising?x+w:x-w,y);}c.lineTo(rising?x1:x0,yBottom);c.closePath();c.fill();
  c.strokeStyle='#ffffff88';for(let i=0;i<steps;i++){const x=rising?x0+i*w:x1-i*w,y=yBottom-(i+1)*h;line(x,y,rising?x+w:x-w,y);}c.strokeStyle='#ffffff40';line(rising?x0:x1,yBottom,rising?x1:x0,yTop);};
 const up=STAIRS.find(s=>s.from===1&&s.to===0),down=STAIRS.find(s=>s.from===2&&s.to===1);
 flight(up.x0,up.x1,FLOORS[1].bottom,FLOORS[0].bottom+SLAB,10,true);
 flight(down.x0,down.x1,FLOORS[2].bottom,FLOORS[1].bottom+SLAB,9,false);
 c.fillStyle='#000';c.fillRect(up.x0,FLOORS[0].bottom,up.x1-up.x0,SLAB);c.fillRect(down.x0,FLOORS[1].bottom,down.x1-down.x0,SLAB);
 // The door between Sala and Jardín.
 c.fillStyle='#16161a';c.fillRect(DOOR.x0,FLOORS[1].top,DOOR.x1-DOOR.x0,FLOORS[1].bottom-FLOORS[1].top-120);c.strokeStyle='#ffffff55';c.strokeRect(DOOR.x0,FLOORS[1].bottom-120,DOOR.x1-DOOR.x0,120);
 c.restore();
}
function planks(c,box,tone){const y=box.y+box.h;c.fillStyle=tone;c.fillRect(box.x,y,box.w,SLAB);c.strokeStyle='#00000066';for(let x=box.x+((box.x*7)%40);x<box.x+box.w;x+=40){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+SLAB);c.stroke();}c.strokeStyle='#ffffff22';c.beginPath();c.moveTo(box.x,y+.5);c.lineTo(box.x+box.w,y+.5);c.stroke();}
function windowAt(c,x,y,w,h,night){const [top,bottom]=sky(Math.min(1,night+.1)),g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgb(top));g.addColorStop(1,rgb(bottom));c.fillStyle=g;c.fillRect(x,y,w,h);if(night>.3){c.fillStyle='#fff';c.globalAlpha=.7;c.fillRect(x+w*.3,y+h*.3,1.5,1.5);c.fillRect(x+w*.7,y+h*.55,1.5,1.5);c.globalAlpha=1;}else{c.fillStyle='#ffffff22';c.beginPath();c.arc(x+w*.72,y+h*.3,Math.min(w,h)*.12,0,6.283);c.fill();}c.strokeStyle='#ffffffaa';c.strokeRect(x,y,w,h);c.beginPath();c.moveTo(x+w/2,y);c.lineTo(x+w/2,y+h);c.moveTo(x,y+h/2);c.lineTo(x+w,y+h/2);c.stroke();}
function lamp(c,x,y,night,ink){c.strokeStyle='#ffffff66';c.beginPath();c.moveTo(x,y-40);c.lineTo(x,y);c.stroke();c.fillStyle='#ffffffaa';c.beginPath();c.moveTo(x-12,y+10);c.lineTo(x+12,y+10);c.lineTo(x+6,y);c.lineTo(x-6,y);c.closePath();c.fill();if(night>.1){const [r,g,b]=hexRgb(ink),glow=c.createRadialGradient(x,y+12,0,x,y+12,150);glow.addColorStop(0,`rgba(${r},${g},${b},${.22*night})`);glow.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=glow;c.fillRect(x-150,y-138,300,300);}}
function paintRoom(c,box,{night,open,ink}){
 c.save();c.beginPath();c.rect(box.x,box.y,box.w,box.h+SLAB);c.clip();
 const line=(x0,y0,x1,y1)=>{c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();};
 if(box.id==='azotea'){
  // Open roof terrace: sky, railing, telescope and a string of lights.
  const [top,bottom]=sky(night),g=c.createLinearGradient(0,box.y,0,box.y+box.h);g.addColorStop(0,rgb(top));g.addColorStop(1,rgb(bottom));c.fillStyle=g;c.fillRect(box.x,box.y,box.w,box.h);
  if(night>.2){c.fillStyle='#fff';for(let i=0;i<40;i++){c.globalAlpha=night*(.3+(i%4)*.15);c.fillRect(box.x+(i*89)%box.w,box.y+8+(i*47)%(box.h*.6),1.4,1.4);}c.globalAlpha=1;}
  c.strokeStyle='#ffffff66';line(box.x,box.y+box.h-56,box.x+box.w,box.y+box.h-56);for(let x=box.x+8;x<box.x+box.w;x+=26)line(x,box.y+box.h-56,x,box.y+box.h);
  c.strokeStyle='#ffffffaa';line(box.x+box.w-150,box.y+box.h,box.x+box.w-130,box.y+box.h-70);line(box.x+box.w-110,box.y+box.h,box.x+box.w-130,box.y+box.h-70);c.save();c.translate(box.x+box.w-130,box.y+box.h-78);c.rotate(-.5);c.strokeRect(-34,-7,68,14);c.strokeRect(34,-5,10,10);c.restore();
  c.strokeStyle='#ffffff33';c.beginPath();c.moveTo(box.x,box.y+30);for(let x=box.x;x<=box.x+box.w;x+=60)c.quadraticCurveTo(x+30,box.y+48,x+60,box.y+30);c.stroke();
  for(let x=box.x+30;x<box.x+box.w;x+=60){c.fillStyle=ink;c.globalAlpha=.3+.7*night;c.fillRect(x-2,box.y+38,4,5);}c.globalAlpha=1;
 }else if(box.id==='sala'){
  c.fillStyle='#121318';c.fillRect(box.x,box.y,box.w,box.h);c.strokeStyle='#ffffff0a';for(let x=box.x;x<box.x+box.w;x+=18)line(x,box.y,x,box.y+box.h*.68);
  c.strokeStyle='#ffffff2a';line(box.x,box.y+box.h*.68,box.x+box.w,box.y+box.h*.68);c.fillStyle='#0d0e12';c.fillRect(box.x,box.y+box.h*.68,box.w,box.h*.32);
  windowAt(c,box.x+150,box.y+40,90,80,night);
  // Sofa, rug and a reading lamp.
  c.fillStyle='#1c1d24';c.strokeStyle='#ffffff77';const sx=box.x+250,sy=box.y+box.h-58;c.fillRect(sx,sy,150,40);c.strokeRect(sx,sy,150,40);c.strokeRect(sx-12,sy-14,18,54);c.strokeRect(sx+144,sy-14,18,54);c.strokeRect(sx+6,sy-26,138,26);
  c.strokeStyle=ink;c.globalAlpha=.6;c.strokeRect(box.x+170,box.y+box.h-6,240,5);for(let x=box.x+176;x<box.x+406;x+=12)line(x,box.y+box.h-5,x+6,box.y+box.h-2);c.globalAlpha=1;
  lamp(c,box.x+90,box.y+46,night,ink);
 }else if(box.id==='jardin'){
  // A greenhouse: glass panes, planters and a climbing vine.
  c.fillStyle='#0c1512';c.fillRect(box.x,box.y,box.w,box.h);c.strokeStyle='#9fd7c71c';for(let x=box.x;x<box.x+box.w;x+=46)line(x,box.y,x,box.y+box.h);for(let y=box.y;y<box.y+box.h;y+=46)line(box.x,y,box.x+box.w,y);
  windowAt(c,box.x+box.w-150,box.y+34,110,90,night);
  c.strokeStyle='#ffffff66';for(let i=0;i<4;i++){const px=box.x+40+i*92,py=box.y+box.h-34;c.fillStyle='#1d1610';c.beginPath();c.moveTo(px,py);c.lineTo(px+44,py);c.lineTo(px+38,py+34);c.lineTo(px+6,py+34);c.closePath();c.fill();c.stroke();c.strokeStyle='#5f8a4e';for(let j=0;j<4;j++)line(px+10+j*8,py,px+6+j*9,py-18-(j*7%13));c.strokeStyle='#ffffff66';}
  c.strokeStyle='#5f8a4e88';c.beginPath();c.moveTo(box.x+6,box.y+box.h);for(let y=box.y+box.h;y>box.y+10;y-=22)c.quadraticCurveTo(box.x+(y%44?22:2),y-11,box.x+6,y-22);c.stroke();
 }else{
  // Basement: bricks, pipes and the workbench.
  c.fillStyle='#120f0d';c.fillRect(box.x,box.y,box.w,box.h);c.strokeStyle='#ffffff10';for(let y=box.y,r=0;y<box.y+box.h;y+=16,r++){line(box.x,y,box.x+box.w,y);for(let x=box.x+(r%2)*20;x<box.x+box.w;x+=40)line(x,y,x,y+16);}
  c.strokeStyle='#ffffff55';line(box.x,box.y+18,box.x+box.w,box.y+18);line(box.x,box.y+26,box.x+box.w,box.y+26);for(let x=box.x+120;x<box.x+box.w;x+=200){c.strokeRect(x,box.y+14,10,16);}
  const bx=box.x+box.w-230,by=box.y+box.h-62;c.fillStyle='#1b1712';c.fillRect(bx,by,180,10);c.strokeStyle='#ffffffaa';c.strokeRect(bx,by,180,10);line(bx+12,by+10,bx+12,by+62);line(bx+168,by+10,bx+168,by+62);
  c.strokeStyle='#ffffff66';for(let i=0;i<5;i++)line(bx+30+i*12,by-30,bx+30+i*12,by-4);c.strokeRect(bx+110,by-22,40,22);
  lamp(c,box.x+box.w/2,box.y+50,Math.max(.4,night),ink);
 }
 planks(c,box,box.id==='azotea'?'#1d1d22':box.id==='sotano'?'#1a1510':'#241c14');
 if(!open){c.fillStyle='rgba(0,0,0,.72)';c.fillRect(box.x,box.y,box.w,box.h+SLAB);}
 c.restore();
}
// The offscreen cache, rebuilt only when the scale, the hour bucket or the open rooms change.
export function createShellCache(){let key='',canvas=null;
 return function shell(k,dpr,state){const night=Math.round(state.night*8)/8,want=[k.toFixed(3),dpr,night,state.unlocked.join(','),state.ink].join('|');
  if(want!==key||!canvas){key=want;canvas=globalThis.document?.createElement('canvas');if(!canvas)return null;const pad=60;canvas.width=Math.ceil((HOUSE_W+2*pad)*k*dpr);canvas.height=Math.ceil((HOUSE_H+ROOF+2*pad)*k*dpr);const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.translate(pad*k,(ROOF+pad)*k);paintShell(c,k,{...state,night});canvas.pad=pad;}
  return canvas;};
}

// The sky, stars and ground across the whole screen, every frame (a gradient and a few rectangles).
export function paintBackdrop(c,W,H,groundY,night,t,calm){const [top,bottom]=sky(night),g=c.createLinearGradient(0,0,0,Math.max(1,groundY));g.addColorStop(0,rgb(top));g.addColorStop(1,rgb(bottom));c.fillStyle=g;c.fillRect(0,0,W,Math.max(0,groundY));
 if(night>.15){c.fillStyle='#fff';for(let i=0;i<90;i++){const x=(i*137.5)%W,y=(i*71.3)%Math.max(1,groundY-10),tw=calm?1:.6+.4*Math.sin(t/900+i);c.globalAlpha=night*(.2+(i%5)*.12)*tw;c.fillRect(Math.round(x),Math.round(y),i%7?1:2,i%7?1:2);}c.globalAlpha=1;}
 c.fillStyle='#0d0a07';c.fillRect(0,groundY,W,Math.max(0,H-groundY));c.strokeStyle='#5f8a4e';c.globalAlpha=.7;c.beginPath();for(let x=0;x<W;x+=6){c.moveTo(x,groundY);c.lineTo(x+2,groundY-3-(x*13%4));}c.stroke();c.globalAlpha=1;}
