import {hashKey} from './universe-regions.js';
import {calmMotion} from './frame-state.js';
import {beatGlow,worldCamera,sayOnce,chapterToast} from './journey-games.js';
// «Encadena» (the Lago, chapter 2 of the Journey's games, Jay's decision of 23 October): flowers float on the water and
// breathe with the beat. A pulse on time sends a ripple from the cube; every flower it reaches lights up, sounds a note
// a step higher, and sends its own ripple to the flowers beside it. Longer chains fill the bar faster. Off time nothing
// happens. With the bar full a gold flower comes beside the cube and one pulse on time opens it.
// Places come from hashes of the map cell, never from the old random sequence.
export const CHAIN_GOAL=340,CHAIN_CELL=320,CHAIN_FIRST=110,CHAIN_NEXT=80,CHAIN_STEPS=8,CHAIN_WAVE_MS=420,CHAIN_LIT_LIMIT=800,CHAIN_FLOWER_GAP=70;
// Flowers grow in clusters, one in six cells of ten: three to seven flowers in a winding line, each 45–60 px from the
// one before, so a ripple on the first one runs through the whole cluster as an arpeggio.
export function cellFlowers(cx,cy,seed='chain:v1'){const key=seed+':'+cx+','+cy;if(hashKey(key)>.6)return [];const n=3+Math.floor(5*hashKey(key+':n'));
 let x=(cx+.3+.4*hashKey(key+':x'))*CHAIN_CELL,y=(cy+.3+.4*hashKey(key+':y'))*CHAIN_CELL,a=hashKey(key+':a')*6.283;const out=[];
 for(let k=0;k<n;k++){if(k){a+=(hashKey(key+':t'+k)-.5)*1.6;const d=45+15*hashKey(key+':d'+k);x+=Math.cos(a)*d;y+=Math.sin(a)*d;}out.push({id:cx+','+cy+','+k,x:Math.round(x),y:Math.round(y),r:4+Math.round(3*hashKey(key+':r'+k))});}
 return out;}
// The nth flower of a chain is worth n, up to five: one flower alone is worth little, a long chain a lot.
export const chainValue=step=>Math.max(1,Math.min(5,step));
export const chainProgress=points=>Math.max(0,Math.min(1,points/CHAIN_GOAL));
export function normalizeChain(raw){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const flower=q.flower&&Number.isFinite(q.flower.x)&&Number.isFinite(q.flower.y)?{x:Math.round(q.flower.x),y:Math.round(q.flower.y)}:null;
 return {points:Number.isFinite(q.points)?Math.max(0,Math.min(CHAIN_GOAL,q.points)):0,lit:Array.isArray(q.lit)?q.lit.filter(id=>typeof id==='string'&&/^-?\d+,-?\d+,\d$/.test(id)).slice(-CHAIN_LIT_LIMIT):[],
  flower,opened:q.opened===true,hinted:q.hinted===true,best:Number.isInteger(q.best)?Math.max(0,Math.min(999,q.best)):0};}
export function initialize(runtime){
 let owner=null,state=null,lit=new Set(),misses=0,shiver=0,flowerPulse=0,chains=0;const waves=[],glows=[],toBar=[],tells={};
 const calm=()=>calmMotion(runtime.S);
 function own(){const j=runtime.S.journey||{};if(owner!==runtime.S||j.chain!==state){owner=runtime.S;j.chain=normalizeChain(j.chain);state=j.chain;lit=new Set(state.lit);waves.length=0;glows.length=0;toBar.length=0;}return state;}
 const inLago=(x,y)=>runtime.BIOMES[runtime.biomeOfPos(x,y)]?.id==='lago';
 const active=()=>!!runtime.journeyGamePlaying?.('lago');
 const audible=()=>runtime.S.sound&&runtime.ac&&runtime.bus;
 const full=()=>own().points>=CHAIN_GOAL;
 function flowers(x,y,radius){const out=[],x0=Math.floor((x-radius)/CHAIN_CELL),x1=Math.floor((x+radius)/CHAIN_CELL),y0=Math.floor((y-radius)/CHAIN_CELL),y1=Math.floor((y+radius)/CHAIN_CELL);
  for(let i=x0-1;i<=x1+1;i++)for(let j=y0-1;j<=y1+1;j++)for(const f of cellFlowers(i,j)){if(!inLago(f.x,f.y))continue;f.d=Math.hypot(f.x-x,f.y-y);if(f.d<=radius)out.push(f);}return out;}
 // Each flower of a chain sounds the next tone of the chord, an octave up every three: the chain is an arpeggio.
 function note(step){if(!audible())return;const ct=runtime.chordTones?.()||[60,64,67];runtime.soon?.(t=>{let m=ct[(step-1)%ct.length]+12*Math.floor((step-1)/ct.length)+12;while(m>88)m-=12;runtime.pluck?.(m,t,runtime.vel?.(.08)??.08,2);},'player');}
 function light(f,step){lit.add(f.id);state.lit.push(f.id);if(state.lit.length>CHAIN_LIT_LIMIT)state.lit.splice(0,state.lit.length-CHAIN_LIT_LIMIT);const before=state.points,value=chainValue(step);state.points=Math.min(CHAIN_GOAL,state.points+value);
  glows.push({x:f.x,y:f.y,at:performance.now()});if(glows.length>60)glows.shift();toBar.push({value,from:before,at:performance.now()+200});if(step>state.best)state.best=step;note(step);
  if(step<CHAIN_STEPS&&waves.length<40)waves.push({x:f.x,y:f.y,r:CHAIN_NEXT,step:step+1,at:performance.now()+CHAIN_WAVE_MS*.6});
  if(before<CHAIN_GOAL&&state.points>=CHAIN_GOAL)arrive();}
 function arrive(){const s=own();if(s.flower)return;s.flower={x:Math.round(runtime.S.wx+CHAIN_FLOWER_GAP),y:Math.round(runtime.S.wy-CHAIN_FLOWER_GAP*.5)};flowerPulse=1;runtime.save?.();
  chapterToast(runtime,'lago','La flor dorada llegó: tócala a tiempo.');}
 function open(){const s=own();if(s.opened)return 'done';s.opened=true;if(runtime.save?.()===false){s.opened=false;return null;}runtime.enterFx=1;runtime.flash=1;for(let i=1;i<=6;i++)note(i);runtime.journeyComplete?.('lago');return 'open';}
 // Only on time: a ripple from the cube. Off time the cube shivers and nothing else moves.
 function pulse(on){if(!active())return null;own();if(!on){misses++;shiver=1;return 'miss';}
  if(full()){if(!state.flower)arrive();return open();}
  waves.push({x:runtime.S.wx,y:runtime.S.wy,r:CHAIN_FIRST,step:1,at:performance.now()});chains++;return 'ripple';}
 // Ripples grow; whatever unlit flower one reaches lights and passes it on.
 function tick(){const s=own(),now=performance.now();let changed=false;
  for(let i=waves.length-1;i>=0;i--){const w=waves[i],k=(now-w.at)/CHAIN_WAVE_MS;if(k<0)continue;const reach=w.r*Math.min(1,k);
   for(const f of flowers(w.x,w.y,reach))if(!lit.has(f.id)){light(f,w.step);changed=true;}
   if(k>=1.4)waves.splice(i,1);}
  if(changed)runtime.save?.();
  if(full()&&!s.flower)arrive();
  if(s.flower){const dx=runtime.S.wx+CHAIN_FLOWER_GAP-s.flower.x,dy=runtime.S.wy-CHAIN_FLOWER_GAP*.5-s.flower.y;if(Math.hypot(dx,dy)>4){s.flower.x+=dx*.08;s.flower.y+=dy*.08;}}
  const MU=runtime.MU,p=chainProgress(s.points);if(MU&&p>0){MU.journeyFloor=Math.max(MU.journeyFloor||0,.2+.6*p);if(MU.journeyCap!=null)MU.journeyCap=Math.max(MU.journeyCap,.4+.6*p);}}
 // Under the cube: the water dims, flowers breathe with the beat, lit ones glow gold, ripples spread.
 function under(c,W,H,t){if(!active())return;const s=own();sayOnce(runtime,s,'hinted','Toca a tiempo junto a una flor: la onda las enciende.','lago');tick();
  const still=calm(),cam=worldCamera(runtime),sx=x=>W/2+(x-cam.x),sy=y=>H/2+(y-cam.y),glow=beatGlow(runtime),gold=runtime.GOLD||'#f0d27a',now=performance.now();
  c.save();c.globalAlpha=.4;c.fillStyle='#000';c.fillRect(0,0,W,H);
  for(const f of flowers(cam.x,cam.y,Math.max(W,H)*.75)){const x=sx(f.x),y=sy(f.y),on=lit.has(f.id),near=!on&&Math.hypot(f.x-runtime.S.wx,f.y-runtime.S.wy)<=CHAIN_FIRST,z=f.r*(1+(on?0:.25*glow));
   if(on){c.globalAlpha=.55;c.strokeStyle=gold;c.lineWidth=1.5;c.beginPath();c.arc(x,y,z+2,0,6.283);c.stroke();c.globalAlpha=.9;c.fillStyle=gold;c.fillRect(Math.round(x)-1,Math.round(y)-1,3,3);continue;}
   c.globalAlpha=(near?.3:.14)*(.4+glow);c.fillStyle='#ffffff';c.beginPath();c.arc(x,y,z*2.2+4,0,6.283);c.fill();
   // Five petals around a bright centre, opening a little on every beat.
   c.globalAlpha=near?1:.6+.4*glow;c.fillStyle='#ffffff';const open=z*.9+(still?0:glow*2),spin=still?0:t/5000;
   for(let k=0;k<5;k++){const a=spin+k*1.2566;c.beginPath();c.ellipse(x+Math.cos(a)*open,y+Math.sin(a)*open,z*.55,z*.35,a,0,6.283);c.fill();}
   c.fillRect(Math.round(x)-1,Math.round(y)-1,3,3);}
  for(const g of glows){const k=(now-g.at)/700;if(k>1)continue;c.globalAlpha=.8*(1-k);c.strokeStyle=gold;c.lineWidth=2;c.beginPath();c.arc(sx(g.x),sy(g.y),6+k*22,0,6.283);c.stroke();}
  for(const w of waves){const k=(now-w.at)/CHAIN_WAVE_MS;if(k<0||k>1.4)continue;c.globalAlpha=Math.max(0,.6*(1-k/1.4));c.strokeStyle=w.step===1?'#ffffff':gold;c.lineWidth=w.step===1?2:1.2;c.beginPath();c.arc(sx(w.x),sy(w.y),w.r*Math.min(1,k),0,6.283);c.stroke();}
  if(s.flower&&!s.opened){const gx=sx(s.flower.x),gy=sy(s.flower.y),breath=still?0:Math.sin(t/700)*3+flowerPulse*Math.sin(t/40)*5;flowerPulse=Math.max(0,flowerPulse-.02);
   c.globalAlpha=.25+.35*glow;c.fillStyle=gold;c.beginPath();c.arc(gx,gy,30+breath+6*glow,0,6.283);c.fill();
   c.globalAlpha=.95;c.strokeStyle=gold;c.lineWidth=2;c.beginPath();for(let k=0;k<8;k++){const a=k*.785+(still?0:t/4000),r1=10,r2=26+breath;c.moveTo(gx+Math.cos(a)*r1,gy+Math.sin(a)*r1);c.quadraticCurveTo(gx+Math.cos(a+.39)*r2,gy+Math.sin(a+.39)*r2,gx+Math.cos(a+.785)*r1,gy+Math.sin(a+.785)*r1);}c.stroke();
   c.fillStyle=gold;c.fillRect(Math.round(gx)-3,Math.round(gy)-3,6,6);}
  c.restore();}
 // Over the cube: a shiver when off time, and gold drops flying to the bar.
 function over(c,W,H){if(!active())return;const now=performance.now(),gold=runtime.GOLD||'#f0d27a',cam=worldCamera(runtime),cx=W/2+(runtime.S.wx-cam.x),cy=H/2+(runtime.S.wy-cam.y);c.save();
  if(shiver>0&&!calm()){c.globalAlpha=.5*shiver;c.strokeStyle='#ffffff';c.lineWidth=1;c.beginPath();c.arc(cx+Math.sin(now/25)*2,cy,16,0,6.283);c.stroke();shiver=Math.max(0,shiver-.05);}
  const left=16,right=W-16,barY=42;
  for(let i=toBar.length-1;i>=0;i--){const d=toBar[i],k=(now-d.at)/450;if(k<0)continue;if(k>=1){toBar.splice(i,1);continue;}const tx=left+(right-left)*chainProgress(d.from+d.value),e=1-(1-k)*(1-k),z=2+d.value;
   c.globalAlpha=1-k*.3;c.fillStyle=gold;c.fillRect(Math.round(cx+(tx-cx)*e-z/2),Math.round(cy+(barY-cy)*e-z/2),Math.round(z),Math.round(z));}
  c.restore();}
 runtime.registerJourneyGame?.('lago',{pulse,under,over,progress:()=>chainProgress(own().points)});
 Object.defineProperties(runtime,{journeyChain:{get:()=>()=>{const s=own();return {active:active(),points:s.points,progress:chainProgress(s.points),lit:s.lit.length,best:s.best,chains,misses,waves:waves.length,flower:s.flower?{...s.flower}:null,opened:s.opened,
  near:flowers(runtime.S.wx,runtime.S.wy,CHAIN_FIRST).filter(f=>!lit.has(f.id)).map(f=>f.id)};}}});
}
