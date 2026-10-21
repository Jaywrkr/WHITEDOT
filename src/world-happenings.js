import {prefersReducedMotion} from './frame-state.js';
// V6: small happenings that arrive on their own. At most one at a time, 90 to 180 s apart, surface only:
// shooting stars at night, a festival of rising lights, a breeze of light across the field by day.
// Decorative: no rewards, sounds or text, and none under reduced motion.
export function initialize(runtime){
 let current=null,nextAt=null,motes=[],stars=[],count=0;
 const calm=()=>!!runtime.S.reducedMotion||prefersReducedMotion();
 const surface=()=>runtime.inWorld()&&(!runtime.S.layer||runtime.S.layer==='superficie')&&!runtime.activityActive;
 function pick(night){return night>.6?(Math.random()<.65?'stars':'festival'):(Math.random()<.5?'breeze':'festival');}
 function start(kind,t){const W=runtime.W,H=runtime.H;current={kind,at:t,len:kind==='stars'?6000:kind==='festival'?12000:5000};count++;
  if(kind==='stars')stars=Array.from({length:3},(_,i)=>({x:Math.random()*W*.8,y:Math.random()*H*.35,at:t+i*1500+Math.random()*800,vx:180+Math.random()*120,vy:60+Math.random()*50}));
  if(kind==='festival')motes=[];}
 function draw(t,dt){
  if(!surface()||calm()){current=null;motes=[];stars=[];return;}
  if(nextAt===null)nextAt=t+40000+Math.random()*40000;
  if(!current&&t>=nextAt){start(pick(runtime.worldLight?.()?.night||0),t);nextAt=t+90000+Math.random()*90000;}
  if(!current)return;const c=runtime.cx,W=runtime.W,H=runtime.H,age=t-current.at,k=age/current.len;if(k>=1){current=null;return;}
  c.save();
  if(current.kind==='stars')for(const s of stars){const a=(t-s.at)/700;if(a<0||a>1)continue;const x=s.x+s.vx*a,y=s.y+s.vy*a;const g=c.createLinearGradient(x,y,x-s.vx*.18,y-s.vy*.18);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');c.strokeStyle=g;c.lineWidth=1.5;c.globalAlpha=1-a;c.beginPath();c.moveTo(x,y);c.lineTo(x-s.vx*.18,y-s.vy*.18);c.stroke();}
  if(current.kind==='festival'){if(k<.8&&motes.length<70&&Math.random()<dt*14)motes.push({x:W/2+(Math.random()-.5)*W*.9,y:H*.55+Math.random()*H*.4,vy:-(18+Math.random()*30),ph:Math.random()*6.28,col:Math.floor(Math.random()*3),life:0});
   const cols=[runtime.musicInk?.(null,'lead')||'#fff',runtime.musicInk?.(null,'acorde')||'#f0d27a','#f0d27a'];for(const m of motes){m.life+=dt;m.y+=m.vy*dt;c.globalAlpha=Math.max(0,.8-m.life/4)*(.6+.4*Math.sin(t/200+m.ph));c.fillStyle=cols[m.col];const mx=Math.round(m.x+Math.sin(t/600+m.ph)*4),my=Math.round(m.y);c.fillRect(mx-1,my-1,3,3);c.globalAlpha*=.3;c.fillRect(mx-3,my-3,7,7);}motes=motes.filter(m=>m.life<4);}
  if(current.kind==='breeze'){const x=-W*.3+k*W*1.6,g=c.createLinearGradient(x-80,0,x+80,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,248,220,.13)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.globalAlpha=Math.sin(k*Math.PI);c.fillRect(x-80,0,160,H);}
  c.restore();
 }
 Object.defineProperties(runtime,{drawHappenings:{get:()=>draw},happenings:{get:()=>()=>({kind:current?.kind||'',count,nextIn:nextAt===null?null:nextAt-performance.now(),start:kind=>start(kind,performance.now())})}});
}
