import {prefersReducedMotion} from './frame-state.js';
// V3: fauna that lives together. Drawing only: creatures keep their movement, sounds and catch rules.
// Each species creature bobs to the beat, some sleep at night until the cube comes close, pairs of the same kind
// greet each other, and flocks cross the sky (birds by day, bats by night).
export function initialize(runtime){
 const ids=new WeakMap();let next=1,seenNow=[],hearts=[],crossing=null,crossAt=0,shown=0,sleeping=0,lastShown=0,lastSleeping=0;
 const calm=()=>!!runtime.S.reducedMotion||prefersReducedMotion();
 const idOf=o=>{let v=ids.get(o);if(!v){v=(next++*2654435761)>>>0;ids.set(o,v);}return v;};
 const night=()=>runtime.worldLight?.()?.night||0;
 // Asleep: creatures of the living layer follow their own rest; the rest doze two in three at night. Never near the cube.
 const asleep=(o,d)=>d>90&&(o.awake!=null?o.awake<.5:night()>.7&&idOf(o)%3!==0);
 // Vertical offset for a creature's drawing, in pixels.
 function bob(o,b,d){if(calm()||asleep(o,d))return 0;const k=.6+(idOf(o)%5)*.2;return b*1.6*k;}
 // Called after each visible creature is drawn: dims sleepers with a small z, and remembers it for greetings.
 function after(o,x,y,d,t,kind=o.s){
  if(seenNow.length<40)seenNow.push({o,x,y,s:kind});shown++;
  if(!asleep(o,d))return;sleeping++;const c=runtime.cx,a=c.globalAlpha;c.save();c.globalAlpha=Math.min(.7,a);c.fillStyle='#cfd8ff';const rise=calm()?0:((t/900+idOf(o)%7)%3),zx=Math.round(x+5+rise),zy=Math.round(y-8-rise*2);c.fillRect(zx,zy,3,1);c.fillRect(zx+1,zy+1,1,1);c.fillRect(zx,zy+2,3,1);c.restore();
 }
 // Once per frame, after the world: greetings between neighbours of the same kind, and the sky crossing.
 function draw(t,dt){
  const c=runtime.cx,W=runtime.W,H=runtime.H,quiet=calm();
  if(!quiet&&night()<.7)for(let i=0;i<seenNow.length;i++)for(let j=i+1;j<seenNow.length;j++){const a=seenNow[i],b=seenNow[j];if(a.s!==b.s)continue;const dd=Math.hypot(a.x-b.x,a.y-b.y);if(dd<36&&dd>4&&(idOf(a.o)+idOf(b.o)+Math.floor(t/2600))%11===0&&hearts.length<6&&!hearts.some(h=>h.k===idOf(a.o)+':'+idOf(b.o)))hearts.push({k:idOf(a.o)+':'+idOf(b.o),x:(a.x+b.x)/2,y:(a.y+b.y)/2-6,age:0,cx:runtime.camX,cy:runtime.camY});}
  seenNow=[];lastShown=shown;lastSleeping=sleeping;shown=sleeping=0;c.save();
  for(const h of hearts){h.age+=dt;const x=h.x-(runtime.camX-h.cx),y=h.y-(runtime.camY-h.cy)-h.age*14;c.globalAlpha=Math.max(0,1-h.age/1.4)*.9;c.fillStyle='#ff8fb5';c.fillRect(Math.round(x)-2,Math.round(y),2,2);c.fillRect(Math.round(x)+1,Math.round(y),2,2);c.fillRect(Math.round(x)-1,Math.round(y)+2,3,1);c.fillRect(Math.round(x),Math.round(y)+3,1,1);}
  hearts=hearts.filter(h=>h.age<1.4);
  const surface=runtime.inWorld()&&(!runtime.S.layer||runtime.S.layer==='superficie');
  if(surface&&!quiet){
   if(!crossing&&t>crossAt){const bats=night()>.6,left=Math.random()<.5;crossing={bats,left,y:H*(.12+Math.random()*.25),x:left?-60:W+60,v:(bats?70:45)*(left?1:-1),n:bats?5+Math.floor(Math.random()*4):6+Math.floor(Math.random()*5),seed:Math.random()*10};crossAt=t+45000+Math.random()*55000;}
   if(crossing){crossing.x+=crossing.v*dt;c.strokeStyle=crossing.bats?'#9aa3c7':'#e8e8e8';c.lineWidth=1;c.globalAlpha=.55;for(let i=0;i<crossing.n;i++){const fx=crossing.x-Math.sign(crossing.v)*(i%3)*14-Math.sign(crossing.v)*Math.floor(i/3)*22,fy=crossing.y+((i%3)-1)*10+Math.sin(t/(crossing.bats?120:260)+i+crossing.seed)*(crossing.bats?3:2),flap=Math.sin(t/(crossing.bats?70:160)+i)>0?-3:1;c.beginPath();c.moveTo(fx-4,fy+flap);c.lineTo(fx,fy);c.lineTo(fx+4,fy+flap);c.stroke();}if(crossing.x<-200||crossing.x>W+200)crossing=null;}
  }else crossing=null;
  c.restore();
 }
 Object.defineProperties(runtime,{faunaBob:{get:()=>bob},faunaAfter:{get:()=>after},drawFauna:{get:()=>draw},faunaState:{get:()=>()=>({shown:lastShown,sleeping:lastSleeping,hearts:hearts.length,crossing:!!crossing,bats:!!crossing?.bats,startCrossing:()=>{crossing=null;crossAt=0;}})}});
}
