import {calmMotion} from './frame-state.js';
import {hashKey} from './universe-regions.js';
// The rare moments of the universe (docs/UNIVERSO.md, phase 6): one per region, something that happens seldom and is
// remembered. Whether a bar brings one comes from a hash of the region and the bar, never the old random sequence;
// on average about once every 48 bars spent in the same region. Each moment seen is counted in S.universe.rare for
// the collection. The Void has none: that is its signature.
export const RARE_CHANCE=1/48;
export const RARE_SECONDS=4.5;
export const RARE=Object.freeze({
 llanura:'Remolino',bosque:'Racimo que te sigue',lago:'Todas las fuentes',ruinas:'La órbita se cierra',jardin:'Floración en cadena',
 dunas:'Sombra de un planeta',cristales:'Arcoíris',faros:'Haces cruzados',tormenta:'Eyección',cueva:'El espacio se dobla',
 aurora:'Cambio de color',cometas:'Lluvia de cometas',constelaciones:'Figura nocturna',nebulosa:'Una estrella nace'
});
// Each moment sounds (phase 3 of the plan): two soft notes of the chord that is playing, a beat apart, high up and under
// the music. Which chord tones comes from the moment's name, never the random sequence.
export const RARE_NOTES=2,RARE_VOLUME=.03;
export function rareChime(id,root,tones){const ct=Array.isArray(tones)&&tones.length?tones:[0,4,7],base=Number.isFinite(root)?root:57,h=hashKey('rare:chime:'+id),fold=n=>{while(n<67)n+=12;while(n>79)n-=12;return n;};
 const a=ct[Math.floor(h*ct.length)%ct.length]-ct[0],b=ct[(Math.floor(h*ct.length)+1)%ct.length]-ct[0];return [fold(base+a),fold(base+b)];}
// The moments in the Journal: seen ones by name, in gold, with how many times; the rest only by their place.
const escapeHtml=v=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]);
export function rareSection(S,regionName=id=>id){const kept=S?.universe?.rare&&typeof S.universe.rare==='object'?S.universe.rare:{},ids=Object.keys(RARE),seen=ids.filter(id=>Number(kept[id])>0);
 const items=ids.map(id=>{const n=Math.floor(Number(kept[id])||0),place=escapeHtml(regionName(id)||id);return n>0?`<li class="got" data-rare="${id}">${escapeHtml(RARE[id])} · ${place}${n>1?' · '+n:''}</li>`:`<li data-rare="${id}">${place} · por ver</li>`;}).join('');
 return `<section class="super-map rare-list" aria-label="Momentos raros"><h3>Momentos raros · ${seen.length}/${ids.length}</h3><ul>${items}</ul></section>`;}
export const rareStarts=(regionKey,id,bar)=>!!RARE[id]&&hashKey('rare:v1:'+regionKey+':'+bar)<RARE_CHANCE;
const rgba=(hex,a)=>{const n=parseInt(hex.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${Math.max(0,Math.min(1,a))})`;};
const SPECTRUM=['#ff6a6a','#ffb35a','#fff36a','#7fe08a','#5cc8ff','#b48cff'];
// How each moment looks, seen from above: p goes from 0 to 1 over the moment; (x,y) is the cube on screen.
const DRAW={
 llanura(c,W,H,x,y,p,ink,t){c.fillStyle=rgba(ink,.8*(1-p));for(let i=0;i<70;i++){const a=i*.35+t/300,r=(1-p)*(20+i*1.6);c.fillRect(Math.round(x+60+Math.cos(a)*r),Math.round(y-40+Math.sin(a)*r),2,2);}},
 bosque(c,W,H,x,y,p,ink,t){c.fillStyle=rgba('#ffffff',.9*Math.sin(p*Math.PI));for(let i=0;i<7;i++){const a=i/7*6.283+t/600;c.fillRect(Math.round(x+Math.cos(a)*28)-1,Math.round(y+Math.sin(a)*18)-1,2,2);}},
 lago(c,W,H,x,y,p,ink){c.lineWidth=1;for(let i=0;i<9;i++){const cx=(i%3+.5)*W/3,cy=(Math.floor(i/3)+.5)*H/3;c.strokeStyle=rgba(ink,.6*(1-p));c.beginPath();c.arc(cx,cy,10+p*140,0,6.283);c.stroke();}},
 ruinas(c,W,H,x,y,p,ink){c.strokeStyle=rgba(ink,.8*Math.sin(p*Math.PI));c.lineWidth=1.5;c.beginPath();c.ellipse(x,y,90,40,.3,0,Math.min(1,p*1.6)*6.283);c.stroke();},
 jardin(c,W,H,x,y,p,ink){for(let i=0;i<40;i++){const d=(i/40)*Math.hypot(W,H)*.6,a=i*2.4,px=x+Math.cos(a)*d,py=y+Math.sin(a)*d,on=Math.max(0,1-Math.abs(p*1.2-i/40)*6),r=1+on*5;if(on<=0)continue;c.strokeStyle=rgba(ink,on);c.lineWidth=1;c.beginPath();c.moveTo(px-r,py);c.lineTo(px+r,py);c.moveTo(px,py-r);c.lineTo(px,py+r);c.stroke();}},
 dunas(c,W,H,x,y,p){const r=Math.max(W,H)*.7;c.fillStyle='rgba(0,0,0,.45)';c.beginPath();c.arc(-r+p*(W+2*r),H*.4,r,0,6.283);c.fill();},
 cristales(c,W,H,x,y,p){SPECTRUM.forEach((col,i)=>{c.strokeStyle=rgba(col,.6*Math.sin(p*Math.PI));c.lineWidth=2;c.beginPath();c.moveTo(x,y);const a=-.9+i*.12;c.lineTo(x+Math.cos(a)*W,y+Math.sin(a)*W);c.stroke();});},
 faros(c,W,H,x,y,p,ink){const a=p*3,cross=Math.max(0,1-Math.abs(p-.5)*8);c.fillStyle=rgba(ink,.12);for(const [ox,dir] of [[0,1],[W,-1]]){c.beginPath();c.moveTo(ox,H*.5);c.lineTo(ox+dir*W*1.2,H*.5+Math.tan(a-1.5)*W*.3-30);c.lineTo(ox+dir*W*1.2,H*.5+Math.tan(a-1.5)*W*.3+30);c.closePath();c.fill();}if(cross){c.fillStyle=rgba('#ffffff',.5*cross);c.fillRect(0,0,W,H);}},
 tormenta(c,W,H,x,y,p,ink){c.strokeStyle=rgba('#ff6a6a',.8*Math.sin(p*Math.PI));c.lineWidth=3;c.beginPath();for(let k=0;k<=40;k++){const u=k/40,px=-40+u*(W+80)*Math.min(1,p*1.4),py=H*.3+Math.sin(u*9)*30+u*H*.3;k?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();},
 cueva(c,W,H,x,y,p,ink,t){c.lineWidth=1;for(let i=1;i<8;i++){c.strokeStyle=rgba(ink,.35*Math.sin(p*Math.PI));c.beginPath();c.ellipse(x,y,i*30,i*30*(.4+.6*Math.abs(Math.cos(t/400+i))),t/900+i*.2,0,6.283);c.stroke();}},
 aurora(c,W,H,x,y,p,ink,t,accent){c.fillStyle=rgba(accent,.18*Math.sin(p*Math.PI));c.fillRect(0,0,W,H);},
 cometas(c,W,H,x,y,p,ink){for(let i=0;i<14;i++){const q=(p*1.5+i/14)%1,px=-60+q*(W+120),py=(i*97%H)+q*H*.3;for(let k=0;k<10;k++){c.fillStyle=rgba(ink,.9*(1-k/10));c.fillRect(Math.round(px-k*5),Math.round(py-k*1.6),k?1:2,k?1:2);}}},
 constelaciones(c,W,H,x,y,p,ink,t,accent){const pts=[[.2,.25],[.35,.18],[.5,.3],[.62,.22],[.78,.35],[.66,.5],[.45,.46]].map(([u,v])=>[u*W,v*H]),k=Math.min(pts.length,Math.ceil(p*pts.length*1.4));c.strokeStyle=rgba(accent,.8*Math.sin(p*Math.PI));c.lineWidth=1;c.beginPath();pts.slice(0,k).forEach(([px,py],i)=>i?c.lineTo(px,py):c.moveTo(px,py));c.stroke();c.fillStyle=rgba(accent,.9);pts.slice(0,k).forEach(([px,py])=>c.fillRect(Math.round(px)-1,Math.round(py)-1,3,3));},
 nebulosa(c,W,H,x,y,p){const px=x+80,py=y-60,r=2+p*10;c.fillStyle=rgba('#ffffff',Math.sin(p*Math.PI));c.fillRect(Math.round(px-r/2),Math.round(py-r/2),Math.round(r),Math.round(r));c.strokeStyle=rgba('#ff5a5a',.6*Math.sin(p*Math.PI));c.lineWidth=1;for(let i=0;i<8;i++){const a=i/8*6.283;c.beginPath();c.moveTo(px+Math.cos(a)*r,py+Math.sin(a)*r);c.lineTo(px+Math.cos(a)*(r+p*40),py+Math.sin(a)*(r+p*40));c.stroke();}}
};
export function initialize(runtime){
 let active=null,lastBar=null;const seen={};
 const calm=()=>calmMotion(runtime.S);
 function record(id){const u=(runtime.S.universe||={});u.rare||={};const before=u.rare[id];u.rare[id]=(before||0)+1;seen[id]=(seen[id]||0)+1;if(runtime.save()===false){if(before)u.rare[id]=before;else delete u.rare[id];}}
 let chimes=0;
 function chime(id){const ac=runtime.ac;if(!runtime.S.sound||!ac||ac.state!=='running'||!runtime.bus||!runtime.soon)return;const notes=rareChime(id,runtime.root?.(),runtime.chordTones?.()),beat=(runtime.SIX||.15)*4;chimes++;
  runtime.soon(t=>notes.forEach((m,i)=>{const at=t+i*beat,o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(440*2**((m-69)/12),at);g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(RARE_VOLUME,at+.02);g.gain.exponentialRampToValueAtTime(.0001,at+1.6);o.connect(g);g.connect(runtime.bus);o.start(at);o.stop(at+1.7);}),'ambient');}
 function start(id,now){if(!DRAW[id])return false;active={id,at:now};record(id);chime(id);return true;}
 // Called by the layers each frame with the region here, its key and the bar count.
 function tick(c,W,H,{here,key,bar,ink,accent,cubeX,cubeY,t}){const now=performance.now();
  if(!active&&bar!==lastBar&&lastBar!==null&&rareStarts(key,here,bar))start(here,now);lastBar=bar;
  if(!active)return;const p=(now-active.at)/1000/RARE_SECONDS;if(p>=1||(active.id!==here&&p>.2)){active=null;return;}
  if(calm())return;c.save();c.globalAlpha=1;DRAW[active.id](c,W,H,cubeX,cubeY,p,ink,t,accent||'#ffffff');c.restore();}
 Object.defineProperties(runtime,{universeRareTick:{get:()=>tick},universeRare:{get:()=>id=>start(id,performance.now())},universeRareState:{get:()=>()=>({active:active?.id||null,chimes,seen:{...seen},kept:{...(runtime.S.universe?.rare||{})}})}});
}
