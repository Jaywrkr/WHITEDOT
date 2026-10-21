import {initialize as cubeShopArt} from './cube-shop-art.js';
import {initialize as cubeShopWorld} from './cube-shop-world.js';
import {initialize as cubeShopMoves} from './cube-shop-moves.js';
import {initialize as cubeShopSound,drawSoundGlyph,SHOP_VOICES} from './cube-shop-sound.js';
import {drawShopPulse,SHOP_PULSES} from './cube-shop-pulse.js';
import {shopPiece,shopSlot} from './cube-shop-model.js';
// Pictures of cube shop pieces drawn by the game's own art code on a small stage, never by hand.
// A stage is a pretend world: one cube, its own clock and position, and only the pieces it is told to wear.
const blank=()=>({version:1,purchases:{},wear:{},on:{},stats:{broken:0}});
export function makeStage({ink='#fff',color='#fff',W=120,H=80}={}){
 const S={wx:0,wy:0,reducedMotion:false,rareBook:{items:[]},ach:{},activities:{done:{}},layer:'superficie',todayKey:'2026-01-02',worldSeed:'stage'},clock={t:1000,beat:0};
 const rt={S,MU:{near:[],dnaT:{air:'claro'}},W,H,camX:0,camY:0,pulse:0,parts:[],sparkEconomy:blank(),inWorld:()=>true,musicInk:(_,part)=>part==='perc'?'#f0d27a':ink,cubeColor:()=>color,beat:()=>clock.beat};
 cubeShopArt(rt);cubeShopWorld(rt);cubeShopMoves(rt);cubeShopSound(rt);
 return {rt,S,clock};
}
export function wearOnStage(stage,ids){const q=blank();for(const id of ids){const p=shopPiece(id);if(!p)continue;q.purchases[id]=true;if(shopSlot(p.slot)?.many)q.on[id]=true;else q.wear[p.slot]=id;}q.stats=stage.rt.sparkEconomy.stats||q.stats;stage.rt.sparkEconomy=q;}
// One frame: the same order the game uses (trail, under, body, face, companion) plus the three first pieces, which the game draws elsewhere.
export function drawStage(stage,c,x,y,s,color='#fff'){
 const {rt,S,clock}=stage,t=clock.t,q=rt.sparkEconomy,wear=id=>q.wear?.[shopPiece(id)?.slot]===id;rt.camX=S.wx;rt.camY=S.wy;
 rt.drawCubeShopTrails(c,x,y,s,t);rt.drawCubeShopSoundUnder(c,x,y,s,t);
 if(wear('dust')){c.save();c.fillStyle='#fff';for(let i=0;i<7;i++){c.globalAlpha=.55-i*.06;c.fillRect(Math.round(x-s-4-i*5),Math.round(y+s*.3+Math.sin(i*1.7)*3),1,1);}c.restore();}
 const look=SHOP_PULSES.find(id=>wear(id));if(look)drawShopPulse(c,look,x,y,stage.pulseRadius||s*1.9,{alpha:.7,color,charge:1,gap:s*.7,reduced:S.reducedMotion});
 rt.drawCubeShopUnder(c,x,y,s,t);
 c.save();rt.cubeShopTransform(c,x,y,s,t);rt.cubeShopGestureTransform(c,x,y,s,t);c.globalAlpha=1;c.fillStyle=color;if(!rt.drawCubeShopBody(c,x,y,s,t,color))c.fillRect(Math.round(x-s/2),Math.round(y-s/2),Math.round(s),Math.round(s));rt.drawCubeShopOver(c,x,y,s,t);c.restore();
 rt.drawCubeShopCompanion(c,x,y,s,t);rt.drawCubeShopGestures(c,x,y,s,t);rt.drawCubeShopSoundOver(c,x,y,s,t);
 // A stage is silent, so a sound piece shows the mark it makes when it sounds.
 for(const id of [...SHOP_VOICES,'sound:hat','sound:filter','sound:hum','sound:dj','trail:notes'])if(wear(id)||q.on?.[id]){const k=1.6;c.save();c.translate(x,y);c.scale(k,k);drawSoundGlyph(c,id,0,0,s/k,t,{color,ink:rt.musicInk(null,'lead'),calm:S.reducedMotion});c.restore();}
 if(SHOP_VOICES.some(id=>wear(id))){c.save();c.strokeStyle=color;c.globalAlpha=.5;c.beginPath();c.arc(x,y,s*1.3,0,Math.PI*2);c.stroke();c.restore();}
 if(wear('orbit')){c.save();c.fillStyle='#fff';c.globalAlpha=.7;for(let i=0;i<3;i++){const a=i*Math.PI*2/3+t/1300;c.fillRect(x+Math.cos(a)*(s+8)-1,y+Math.sin(a)*(s+8)-1,2,2);}c.restore();}
 if(wear('facet')){c.save();c.strokeStyle=color;c.globalAlpha=.6;c.lineWidth=1;const r=s*1.6;c.beginPath();c.moveTo(x,y-r);c.lineTo(x+r,y);c.lineTo(x,y+r);c.lineTo(x-r,y);c.closePath();c.moveTo(x-r,y);c.lineTo(x+r,y);c.stroke();c.restore();}
 c.save();c.fillStyle='#f0d27a';for(const p of rt.parts){c.globalAlpha=Math.max(0,p.l);c.fillRect(p.x-S.wx+x-1,p.y-S.wy+y-1,2,2);}c.restore();
}
// What each piece needs to show itself: walking, stopping, circling, a creature nearby, spores in the air.
const SCENES={
 'habit:yawn':{still:6.9},'habit:dizzy':{circle:3},'habit:sneeze':{still:6.55,air:'esporas'},'habit:greet':{walk:.6,still:.35,near:true},
 'eyes:blush':{walk:.5,still:.4,rare:true},'eyes:sleepy':{walk:.3,still:3.6},'eyes:curious':{walk:.4,still:.3,near:true},'pet:bird':{walk:.8,still:2},
 'trail:garden':{walk:1.4,still:1.4},'trail:rainbow':{walk:1.1,breaks:3},'trail:steps':{walk:1.8},'trail:comet':{walk:1.2},'trail:graffiti':{walk:1.6},'dust':{walk:1},
 'pet:ghost':{walk:.3,ghost:true},'pet:mimic':{walk:1.4},'pet:dj':{walk:.3,still:.6},'pet:cloud':{walk:.4,still:.6},'orbit':{still:.5},'facet':{still:.2},
 'body:beat':{still:.3,calm:true},'body:origami':{walk:.4,still:.3,pulse:.8},'body:dice':{still:.2,breaks:4},'body:streak':{walk:.6,breaks:5},'body:assembly':{walk:.4,still:1.2},'body:swarm':{walk:.9},
 'gesture:pose':{still:5.6},'gesture:flip':{walk:.3,still:.5,taps:true},'gesture:confetti':{still:.5,award:true},'gesture:dance':{circle:1.6},'gesture:victory':{still:.8,win:true},
 'trail:notes':{walk:2.2},'sound:antenna':{still:.3},'sound:hat':{walk:.6},'sound:filter':{walk:.6},'sound:dj':{walk:.6},'sound:hum':{still:.3},
 'motion:blink':{walk:.7,beat:true},'motion:roll':{walk:.9},'motion:legs':{walk:.55},'motion:pogo':{walk:.62},'motion:jelly':{walk:.6,still:.08},'motion:worm':{walk:.66},'motion:skate':{walk:.8},'motion:float':{walk:.3,still:.4}
};
const defaultScene=id=>id.startsWith('eyes:')||id.startsWith('acc:')?{walk:.4,still:.4}:id.startsWith('body:')?{walk:.3,still:.3}:{walk:.8};
// Runs the scene on a stage, drawing every frame so pieces that remember (trails, flowers) build up, and leaves the last frame on the canvas.
export function playScene(stage,c,id,{x,y,s,W,H,color='#fff',scene=SCENES[id]||defaultScene(id)}){
 const {rt,S,clock}=stage,step=16,speed=110;
 if(scene.air)rt.MU.dnaT={air:scene.air};if(scene.ghost)S.cubeRoute={version:1,day:S.todayKey,today:[],yday:'2026-01-01',yesterday:[[0,0],[60,-20],[120,10],[150,70],[90,110],[20,80],[-10,30]]};
 let frames=[];const walk=Math.round((scene.walk||0)*1000/step),stop=Math.round((scene.still||0)*1000/step),circle=Math.round((scene.circle||0)*1000/step);
 for(let i=0;i<walk;i++)frames.push('walk');for(let i=0;i<circle;i++)frames.push('circle');for(let i=0;i<stop;i++)frames.push('still');if(!frames.length)frames=['still'];
 frames.forEach((kind,i)=>{
  clock.t+=step;clock.beat=scene.beat&&i===frames.length-4?1:0;rt.pulse=scene.pulse&&i>frames.length-4?scene.pulse:0;
  if(kind==='walk'){S.wx+=speed*step/1000;S.wy=Math.sin(S.wx/40)*6;}
  if(kind==='circle'){const a=i*.16;S.wx+=Math.cos(a)*4;S.wy+=Math.sin(a)*4;}
  if(i===2&&scene.breaks)rt.sparkEconomy.stats={...rt.sparkEconomy.stats,broken:(rt.sparkEconomy.stats?.broken||0)+scene.breaks};
  if(i===2&&scene.rare)S.rareBook={items:[{id:'stage'}]};
  if(scene.award&&i===frames.length-14)S.ach={...S.ach,stage:true};
  if(scene.win&&i===frames.length-30)S.activities={done:{...S.activities.done,stage:true}};
  if(scene.taps&&(i===frames.length-20||i===frames.length-17))rt.cubeShopTap(clock.t);
  if(scene.near&&i===frames.length-Math.min(frames.length-1,20))rt.MU.near=[{x:S.wx+40,y:S.wy-6}];
  rt.parts=rt.parts.filter(p=>(p.l-=step/1000*1.6)>0);for(const p of rt.parts){p.x+=p.vx*step/1000;p.y+=p.vy*step/1000;}
  c.save();c.fillStyle='#000';c.fillRect(0,0,W,H);drawStage(stage,c,x,y,s,color);c.restore();
 });
 if(scene.near){c.save();c.fillStyle='#9fd7c7';c.fillRect(Math.round(x+40-2),Math.round(y-6-2),4,4);c.restore();}
}
const cache=new Map();
// A still picture of one piece, as a data URL, kept per piece and colours.
export function pieceImage(id,{color='#fff',ink='#fff',reduced=false}={}){
 const key=id+'|'+color+'|'+ink+'|'+reduced;if(cache.has(key))return cache.get(key);
 if(typeof document?.createElement!=='function')return '';
 const W=102,H=68,dpr=2,cv=document.createElement('canvas');cv.width=W*dpr;cv.height=H*dpr;const c=cv.getContext('2d');if(!c)return '';c.setTransform(dpr,0,0,dpr,0,0);c.imageSmoothingEnabled=false;
 const stage=makeStage({ink,color,W,H});stage.pulseRadius=26;stage.S.reducedMotion=reduced||!!SCENES[id]?.calm;wearOnStage(stage,[id]);
 const trail=shopPiece(id)?.slot==='trail'||id==='pet:mimic';const sound=/^(voice|sound):/.test(id)&&id!=='sound:antenna';playScene(stage,c,id,{x:trail?W*.68:sound?W*.36:W/2,y:H/2+(id.startsWith('acc:hat')||id.startsWith('habit:dizzy')||id==='pet:cloud'||id==='sound:antenna'?8:0),s:20,W,H,color});
 const url=cv.toDataURL();cache.set(key,url);return url;
}
