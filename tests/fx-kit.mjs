import assert from 'node:assert/strict';
import {glow,glowSprite,sparkSprite,shadePuff,contactShadow,halo,breath,biomeTone,createAppear,appearAlpha,appearScale,createFxLayer,setFxCanvas,fxSpriteCount,easeOutCubic,easeOutBack,easeInOut,FX_GOLD,FX_POOL,FX_POPS,FX_SPRITES} from '../src/fx-kit.js';
import {vividColor,vividColorPlain,WORLD_VISUAL} from '../src/visual.js';
import {STYLES,rand,rk} from '../src/universe-layers.js';
import {LIVE_COLORS} from '../src/live-encounters-model.js';
// A context that records what is drawn and the state each call saw.
function recorder(){const calls=[];const c={globalAlpha:1,globalCompositeOperation:'source-over',lineWidth:1,fillStyle:'#000',strokeStyle:'#000',
 createRadialGradient(...a){const g={a,stops:[],addColorStop(o,col){g.stops.push([o,col]);}};calls.push({k:'createRadialGradient',g});return g;}};
 for(const k of ['fillRect','drawImage','stroke','fill','beginPath','arc','ellipse','rect','moveTo','lineTo','save','restore','scale','translate'])c[k]=function(...a){calls.push({k,a,alpha:this.globalAlpha,op:this.globalCompositeOperation,width:this.lineWidth,fill:this.fillStyle,stroke:this.strokeStyle});};
 return {c,calls};}
// Easing: from 0 to 1, the back overshoots a little.
for(const f of [easeOutCubic,easeOutBack,easeInOut]){assert(Math.abs(f(0))<1e-9);assert(Math.abs(f(1)-1)<1e-9);}assert(easeOutBack(.6)>1,'a small overshoot');assert(easeOutCubic(.5)>.5);
// Without a canvas (Node) every light falls back to the gradient it replaced: same centre, radius and colours.
setFxCanvas(()=>null);
{const {c,calls}=recorder();glow(c,10,20,30,'#eb9a3c',.4);const g=calls.find(q=>q.k==='createRadialGradient').g;assert.deepEqual(g.a,[10,20,0,10,20,30]);assert.deepEqual(g.stops,[[0,'#eb9a3c'],[1,'rgba(0,0,0,0)']]);
 const r=calls.find(q=>q.k==='fillRect');assert.deepEqual(r.a,[-20,-10,60,60]);assert.equal(r.alpha,.4);
 calls.length=0;glow(c,0,0,0,'#fff',1);glow(c,0,0,10,'#fff',0);assert.equal(calls.length,0,'nothing for no radius or no light');
 calls.length=0;shadePuff(c,5,5,10,.2);assert.equal(calls.find(q=>q.k==='createRadialGradient').g.stops[0][1],'rgba(0,0,0,1)');
 calls.length=0;contactShadow(c,5,5,10,3,.3);assert(calls.some(q=>q.k==='ellipse'),'a plain ellipse without sprites');}
// With canvases: one sprite per colour, drawn with drawImage over the same square; `add` paints with 'lighter' and puts
// the composite back. hsl colours take the living palette, as the World's canvas does.
const made=[];setFxCanvas((w,h)=>{const ctx=recorder();const cv={width:w,height:h,getContext:()=>ctx.c,ctx};made.push(cv);return cv;});
{const {c,calls}=recorder();glow(c,10,20,30,'#eb9a3c',.4,true);const d=calls.find(q=>q.k==='drawImage');assert(d,'a sprite');assert.deepEqual(d.a.slice(1),[-20,-10,60,60]);assert.equal(d.op,'lighter');assert.equal(c.globalCompositeOperation,'source-over','composite restored');
 assert(!calls.some(q=>q.k==='createRadialGradient'),'no gradient on the World canvas');
 const sprite=d.a[0],stops=sprite.ctx.calls.find(q=>q.k==='createRadialGradient').g.stops;assert.deepEqual(stops,[[0,'#eb9a3c'],[1,'rgba(0,0,0,0)']]);
 const before=made.length;for(let i=0;i<5;i++)glow(c,0,0,10,'#eb9a3c',.5);assert.equal(made.length,before,'drawn once, reused');
 glow(c,0,0,10,'#ffffff',.22,false,'rgba(255,255,255,0)');assert.deepEqual(made.at(-1).ctx.calls.find(q=>q.k==='createRadialGradient').g.stops,[[0,'#ffffff'],[1,'rgba(255,255,255,0)']],'white to clear white for the pools of light');
 glowSprite('hsl(200,50%,60%)');assert.equal(made.at(-1).ctx.calls.find(q=>q.k==='createRadialGradient').g.stops[0][1],vividColor('hsl(200,50%,60%)'),'the living palette');
 for(let i=0;i<120;i++)sparkSprite('#'+(100000+i));assert(fxSpriteCount()<=FX_SPRITES,'a bounded cache');}
// The double contour: the same path, three times as wide, faint and added, then the state is as it was.
{const {c,calls}=recorder();c.globalAlpha=.8;c.lineWidth=1.4;halo(c);const s=calls.find(q=>q.k==='stroke');assert.equal(s.op,'lighter');assert(Math.abs(s.width-4.2)<1e-9);assert(Math.abs(s.alpha-.12)<1e-9);
 assert.equal(c.globalAlpha,.8);assert.equal(c.lineWidth,1.4);assert.equal(c.globalCompositeOperation,'source-over');}
// Breath never moves with reduced motion; the biome's tone is the living encounters' colour.
assert.deepEqual(breath(1,true),{scale:1,glow:.45});assert(breath(1).scale>1&&breath(1).scale<1.04,'small');
const fakeRuntime={BIOMES:[{id:'lago'},{id:'vacio'}],biomeOfPos:x=>x<0?0:1};assert.equal(biomeTone(fakeRuntime,-1,0),LIVE_COLORS.lago);assert.equal(biomeTone(fakeRuntime,1,0),'#ffffff');assert.equal(biomeTone(null,0,0),'#ffffff');
// Growing in: 0 to 1 in 280 ms, from 0.85 with an overshoot to exactly 1; with reduced motion, there at once; seen
// again after half a second away, it grows in again.
{const a=createAppear();assert.equal(a.k('o',1000),0);assert(Math.abs(a.k('o',1140)-.5)<1e-9);assert.equal(a.k('o',1400),1);assert.equal(a.k('o',2500),0,'away and back');assert.equal(a.k('p',0,true),1);
 assert.equal(appearScale(0),.85);assert.equal(appearScale(1),1);assert.equal(appearAlpha(0),0);assert.equal(appearAlpha(1),1);for(let i=0;i<400;i++)a.k('x'+i,0);assert(a.size()<=256,'bounded');}
// The layer: a pop is a ring and sparks; gold only when asked; none with reduced motion; half the sparks in light quality,
// a smaller pool there; the sparks age out and the pool compacts in place.
{let light=false,still=false;const fx=createFxLayer({light:()=>light,reduced:()=>still});assert.equal(fx.capacity,FX_POOL.full);
 assert(fx.pop(0,0,'#88ccee',{sparks:8}));assert.equal(fx.count(),8);assert.equal(fx.pops(),1);
 assert(fx.pop(5,5,'#88ccee',{gold:true,sparks:6}));const {c,calls}=recorder();fx.draw(c,100,100);assert(calls.some(q=>q.k==='stroke'&&q.stroke===FX_GOLD),'gold for what is earned');assert(calls.some(q=>q.k==='stroke'&&q.stroke==='#88ccee'),'its colour otherwise');
 assert(calls.filter(q=>q.k==='drawImage').length>=14,'sparks as added sprites');assert(calls.some(q=>q.k==='drawImage'&&q.op==='lighter'));
 for(let i=0;i<40;i++)fx.update(.05);assert.equal(fx.count(),0,'they age out');assert.equal(fx.pops(),0);
 still=true;assert.equal(fx.pop(0,0,'#fff'),false,'reduced motion: nothing new moves');assert.equal(fx.count(),0);assert.equal(fx.vanish(0,0,'#fff'),false);still=false;
 light=true;fx.pop(0,0,'#fff',{sparks:8});assert.equal(fx.count(),4,'half the sparks in light quality');calls.length=0;fx.draw(c,0,0);assert(!calls.some(q=>q.k==='drawImage'),'plain squares, no added light in light quality');assert(calls.some(q=>q.k==='fillRect'));
 for(let i=0;i<500;i++)fx.spark(i,0,0,0,1,'#fff');assert.equal(fx.count(),FX_POOL.light,'the light pool');light=false;for(let i=0;i<900;i++)fx.spark(i,0,0,0,1,'#fff');assert.equal(fx.count(),FX_POOL.full,'never past the pool');
 fx.clear();assert.equal(fx.count(),0);for(let i=0;i<FX_POPS*2;i++)fx.pop(i,0,'#fff',{sparks:0});assert.equal(fx.pops(),FX_POPS,'a fixed ring of pop slots');
 assert.equal(fx.pop(NaN,0,'#fff'),false,'no pop at an unknown place');}
// The living palette's cache gives exactly the old conversion, alpha and spaces included.
{const rnd=(()=>{let s=7;return ()=>(s=Math.imul(s^s>>>15,2246822519)>>>0)/4294967296;})();
 for(let i=0;i<30000;i++){const h=(rnd()*720-360).toFixed(i%2?0:2),sat=(rnd()*100).toFixed(1),l=(rnd()*100).toFixed(0),a=rnd().toFixed(3),sp=i%3?'':' ';
  for(const v of [`hsl(${h},${sat}%,${l}%)`,`hsla(${sp}${h}${sp},${sat}%,${l}%${sp},${sp}${a}${sp})`,`hsla(${h},${sat}%,${l}%)`,`hsl(${h},${sat}%,${l}%,${a})`,'hsla(1,2%,3%,x)','#fff','hsla(1,2,3,.4)'])assert.equal(vividColor(v),vividColorPlain(v),v);}}
// The layers' cached hash is the same number as rand.
for(let i=0;i<5000;i++){assert.equal(rk('cell'+i,'x',i%24),rand('cell'+i+':x'+(i%24)));assert.equal(rk('cell'+i,'on'),rand('cell'+i+':on'));}
// The crystal lattice in one path per colour draws the same edges in the same colours as one stroke per node did.
{const segments=(draw)=>{const out=[];let ss='',last=null;const c=new Proxy({},{get:(o,k)=>k==='strokeStyle'?ss:k in o?o[k]:(...a)=>{if(k==='moveTo')last=a;if(k==='lineTo'){out.push(ss+'|'+last.map(v=>v.toFixed(3))+'>'+a.map(v=>v.toFixed(3)));}if(k==='fillRect'||k==='rect')out.push('dot|'+a.join(','));},set:(o,k,v)=>{if(k==='strokeStyle')ss=v;else o[k]=v;return true;}});draw(c);return out.sort();};
 const f={t:500,beat:.4,still:false,bar:.3,beatIndex:5,ux:240,uy:120,pulseAge:.4,cubeX:200,cubeY:400,ink:'#9ef0e6',part:()=>[0,0]};
 // The drawing before alpha.250, kept here as the reference.
 const old=(c,x,y,s,gap,style)=>{const h=gap*.866,j0=Math.floor(f.uy/h),j1=Math.ceil((f.uy+s)/h);let k=0;for(let j=j0;j<=j1;j++){const off=(j&1)*gap/2,i0=Math.floor((f.ux-off)/gap),i1=Math.ceil((f.ux+s-off)/gap);for(let i=i0;i<=i1;i++){const wx=i*gap+off,wy=j*h;if(wx<f.ux||wx>f.ux+s||wy<f.uy||wy>f.uy+s)continue;const px=x+(wx-f.ux),py=y+(wy-f.uy);style(c,px,py,k++);c.beginPath();c.moveTo(px,py);c.lineTo(px+gap,py);c.moveTo(px,py);c.lineTo(px+gap/2,py+h);c.moveTo(px,py);c.lineTo(px-gap/2,py+h);c.stroke();c.fillRect(Math.round(px),Math.round(py),1,1);}}};
 const key='cristales:mid:3,4',rgba=(a)=>`rgba(158,240,230,${Math.max(0,Math.min(1,a))})`,white=(a)=>`rgba(255,255,255,${Math.max(0,Math.min(1,a))})`;
 const midStyle=(c,px,py,k)=>{const lit=Math.floor(rand(key+':n'+k)*16)===f.beatIndex%16,wave=f.pulseAge<1.6?Math.max(0,1-Math.abs(Math.hypot(px-f.cubeX,py-f.cubeY)-f.pulseAge*260)/40):0;c.strokeStyle=(wave>.05?white:rgba)(.22+.7*wave+(lit?.4:0));};
 assert.deepEqual(segments(c=>STYLES.cristales.mid.draw(c,10,20,120,key,f)),segments(c=>old(c,10,20,120,36,midStyle)),'mid lattice');
 assert.deepEqual(segments(c=>STYLES.cristales.far.draw(c,10,20,150,key,f)),segments(c=>old(c,10,20,150,60,c=>{c.strokeStyle=rgba(.07);})),'far lattice');}
console.log('PASS fx kit: lights from cached sprites (the old gradient without a canvas), added light restores the composite, a bounded sprite cache, a fine double contour, breath and growing in still with reduced motion, pops in gold only for what is earned, none with reduced motion, half the sparks and plain squares in light quality, a fixed pool; the living palette cache and the layers\' hash give the same values; the crystal lattice in one path per colour draws the same edges');
