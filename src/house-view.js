import {realNight} from './world-light-model.js';
// The Refugio: four chambers of light the cube unfolds around itself. House units (HU) are fixed; the camera turns them into pixels.
// Each chamber is a score: across it is the bar (16 steps) and the height in it is the note.
export const HOUSE_W=1000,ROOF=40,WALL=14,SLAB=12;
export const FLOORS=Object.freeze([
 {id:0,top:0,bottom:240},
 {id:1,top:252,bottom:540},
 {id:2,top:552,bottom:780}
].map(Object.freeze));
export const HOUSE_H=FLOORS[2].bottom+WALL;
// Room around the chambers kept in view: a little above the Cielo and below the Raíz.
export const EDGE=Object.freeze({top:-30,bottom:FLOORS[2].bottom+WALL+12});
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
export function viewScale(W,H,overview){return overview?Math.min((W-24)/HOUSE_W,(H-24)/(EDGE.bottom-EDGE.top)):Math.min((W-16)/600,(H-24)/330,1.6);}
// Night from the real hour: 0 day, 1 night.
export const houseNight=(date=new Date())=>realNight(date.getHours()+date.getMinutes()/60);
// Threads of light between chambers, where the old stairs were.
export const THREADS=Object.freeze([{x:480,y0:FLOORS[0].bottom,y1:FLOORS[1].bottom,rooms:['azotea','sala']},{x:90,y0:FLOORS[1].bottom,y1:FLOORS[2].bottom,rooms:['sala','sotano']}].map(Object.freeze));
// Everything that does not move, drawn once per scale and set of open chambers: corner brackets, the floor,
// a faint five-line staff and the threads. Closed chambers keep only dim, broken brackets.
export function paintShell(c,k,{unlocked=['sala'],ink='#f0d27a'}={}){
 c.save();c.scale(k,k);c.lineWidth=1/k;const line=(x0,y0,x1,y1)=>{c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();};
 for(const id of Object.keys(ROOM_BOXES)){const b=roomBox(id),open=unlocked.includes(id),L=18,x1=b.x+b.w,y1=b.y+b.h;
  c.strokeStyle='#ffffff';c.globalAlpha=open?.85:.25;if(!open)c.setLineDash?.([3/k,4/k]);
  for(const [x,y,dx,dy] of [[b.x,b.y,1,1],[x1,b.y,-1,1],[b.x,y1,1,-1],[x1,y1,-1,-1]]){line(x,y,x+dx*L,y);line(x,y,x,y+dy*L);}
  c.setLineDash?.([]);if(!open)continue;
  c.globalAlpha=.6;line(b.x,y1,x1,y1);
  c.globalAlpha=.09;for(let i=0;i<5;i++){const y=b.y+40+i*(b.h-80)/4;line(b.x+18,y,x1-18,y);}}
 c.globalAlpha=.45;for(const t of THREADS)if(t.rooms.every(r=>unlocked.includes(r))){line(t.x,t.y0,t.x,t.y1);c.globalAlpha=.6;for(const [y,d] of [[t.y0+8,-1],[t.y1-8,1]]){line(t.x-4,y-d*2,t.x,y+d*2);line(t.x+4,y-d*2,t.x,y+d*2);}c.globalAlpha=.45;}
 c.restore();
}
export function createShellCache(){let key='',canvas=null;
 return function shell(k,dpr,state){const want=[k.toFixed(3),dpr,state.unlocked.join(','),state.ink].join('|');
  if(want!==key||!canvas){key=want;canvas=globalThis.document?.createElement('canvas');if(!canvas)return null;const pad=60;canvas.width=Math.ceil((HOUSE_W+2*pad)*k*dpr);canvas.height=Math.ceil((HOUSE_H+ROOF+2*pad)*k*dpr);const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.translate(pad*k,(ROOF+pad)*k);paintShell(c,k,state);canvas.pad=pad;}
  return canvas;};
}
// The light of the biome where the Refugio opened, over black with drifting dust, every frame.
export const LANDSCAPES=Object.freeze({llanura:'#a6f08a',bosque:'#7fbf6a',lago:'#8ad1ff',ruinas:'#d8c39a',jardin:'#f0a6c8',dunas:'#f0c27a',cristales:'#8ad1ff',faros:'#f0d27a',tormenta:'#b8b8ff',cueva:'#c9a27a',vacio:'#ffffff'});
const rgba=(hex,a)=>{const n=parseInt(hex.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;};
export function paintBackdrop(c,W,H,night,t,calm,{biome='llanura'}={}){const ink=LANDSCAPES[biome]||LANDSCAPES.llanura;
 c.fillStyle='#000';c.fillRect(0,0,W,H);const g=c.createRadialGradient(W*.72,H*.3,0,W*.72,H*.3,Math.max(W,H)*.75);g.addColorStop(0,rgba(ink,.11-.04*night));g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
 const drift=calm?0:t/9000;for(let i=0;i<Math.round(W*H/2600);i++){const x=((i*137.5+drift*(i%7)*40)%W+W)%W,y=((i*97.13+i*i*.37-drift*(i%5)*25)%H+H)%H;c.globalAlpha=(.12+(i%5)*.1)*(calm?1:.75+.25*Math.sin(t/1100+i));c.fillStyle=i%9?'#fff':ink;c.fillRect(Math.round(x),Math.round(y),i%11?1:2,i%11?1:2);}c.globalAlpha=1;}
