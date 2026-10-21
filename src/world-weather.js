import {prefersReducedMotion} from './frame-state.js';
// V2: wind that travels, grass that parts for the cube, rain that lands, and quiet sound beds (rain, night insects).
// Drawing is a handful of splashes; sound is two gain nodes that stay silent unless it rains or it is night.
const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export function initialize(runtime){
 let dirKey='',dx=1,dy=0,splashes=[],rain=null,insectsAt=0,bedsReady=false;
 const calm=()=>!!runtime.S.reducedMotion||prefersReducedMotion();
 function direction(){const k=runtime.S.todayKey||'';if(k!==dirKey){dirKey=k;const a=hash('wind:'+k)%628/100;dx=Math.cos(a);dy=Math.sin(a);}}
 // Extra sway for a blade at x,y: a gust band moving along the day's wind, plus the cube's wake.
 function sway(x,y,t,h,distance,px,py){
  if(calm())return 0;direction();const phase=(x*dx+y*dy)/240-t/650,gust=Math.max(0,Math.sin(phase))**6*(.55+.45*Math.sin(t/9000));
  // Hierba (cube shop) opens the grass wider and further.
  let s=gust*h*.45*(dx>=0?1:-1);const wide=runtime.cubeShopGrassWide?.(),reach=wide?90:44;if(distance<reach){const k=1-distance/reach;s+=Math.sign(x-px||1)*k*k*h*(wide?1.2:.6);}return s;
 }
 function raining(){return !!runtime.rainingNow&&runtime.inWorld()&&(!runtime.S.layer||runtime.S.layer==='superficie');}
 function draw(t,dt){
  if(!raining()||calm()){splashes.length=0;return;}const c=runtime.cx,W=runtime.W,H=runtime.H,n=Math.min(3,Math.floor(dt*60*(1+(runtime.MU?.storm||0)*2))+(Math.random()<.5?1:0));
  for(let i=0;i<n&&splashes.length<36;i++)splashes.push({x:Math.random()*W,y:H*.25+Math.random()*H*.75,a:0});
  c.save();c.strokeStyle='#cfe3ff';c.lineWidth=1;
  for(const s of splashes){s.a+=dt/.45;const r=1+s.a*6;c.globalAlpha=.32*(1-s.a);c.beginPath();c.ellipse(s.x,s.y,r,r*.35,0,0,6.283);c.stroke();}
  splashes=splashes.filter(s=>s.a<1);c.restore();
 }
 // Sound beds share the game's bus, stay at zero with sound off, and fade rather than switch.
 function beds(){
  const ac=runtime.ac,bus=runtime.bus;if(!ac||!bus||!runtime.noiseBuffer)return;
  if(!bedsReady){bedsReady=true;const src=ac.createBufferSource();src.buffer=runtime.noiseBuffer;src.loop=true;const hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.value=1400;const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=7000;const g=ac.createGain();g.gain.value=0;src.connect(hp).connect(lp).connect(g).connect(bus);src.start();rain={g};}
  const on=runtime.S.sound&&runtime.inWorld(),target=on&&raining()?.012+.02*Math.min(1,runtime.MU?.storm||0):0;rain.g.gain.setTargetAtTime(target,ac.currentTime,.8);
  const night=runtime.worldLight?.()?.night||0,biome=runtime.BI?.()?.id||'';
  if(on&&!raining()&&night>.6&&!['mar','cueva','vacio','dunas'].includes(biome)&&(!runtime.S.layer||runtime.S.layer==='superficie')&&ac.currentTime>insectsAt){insectsAt=ac.currentTime+1.4+Math.random()*2.2;chirp(ac,bus,ac.currentTime+.05,night);}
 }
 function chirp(ac,bus,t,night){const pan=ac.createStereoPanner?.();const f=4200+Math.random()*900,v=.0045*night;for(let i=0;i<3;i++){const o=ac.createOscillator(),g=ac.createGain(),at=t+i*.07;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(v,at+.008);g.gain.exponentialRampToValueAtTime(.0001,at+.05);o.connect(g);if(pan){pan.pan.value=Math.random()*1.6-.8;g.connect(pan);}else g.connect(bus);o.start(at);o.stop(at+.06);}if(pan)pan.connect(bus);}
 Object.defineProperties(runtime,{windSway:{get:()=>sway},drawWeather:{get:()=>draw},weatherBeds:{get:()=>beds},weatherSplashes:{get:()=>()=>splashes.length}});
}
