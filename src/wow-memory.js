// Visual signatures use saved addresses only; never sample another world's generator.
function hash(text){let h=2166136261;for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619);return h>>>0;}
export function favoriteSignature(point={}){
 point=point&&typeof point==='object'?point:{};
 const a=point.address||point,text=v=>String(v??'').slice(0,100),number=v=>Number.isFinite(v)?v:0;
 let h=hash(JSON.stringify([text(a.seed),text(a.layout),number(a.generatorVersion),number(a.x??point.x),number(a.y??point.y),text(a.layer??point.layer),text(point.genre),text(point.material),text(point.character)]));
 const next=()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return (h>>>0)/4294967296;};
 const hue=[180,205,245,280,330][h%5],nodes=Array.from({length:6+h%3},()=>({x:(next()-.5)*1.7,y:(next()-.5)*1.6}));
 const edges=nodes.slice(1).map((_,i)=>[i,i+1]);if(nodes.length>6)edges.push([0,3]);
 return {nodes,edges,hue};
}
export function favoriteSignatureSVG(point){
 const s=favoriteSignature(point),x=p=>(32+p.x*30).toFixed(2),y=p=>(21+p.y*22).toFixed(2);
 return '<svg viewBox="0 0 64 42" aria-hidden="true" focusable="false"><g fill="none" stroke="hsl('+s.hue+' 45% 72%)" stroke-width=".7" opacity=".55">'+s.edges.map(([a,b])=>'<path d="M'+x(s.nodes[a])+' '+y(s.nodes[a])+'L'+x(s.nodes[b])+' '+y(s.nodes[b])+'"/>').join('')+'</g><g fill="#fff">'+s.nodes.map(p=>'<circle cx="'+x(p)+'" cy="'+y(p)+'" r="1.15"/>').join('')+'</g></svg>';
}

import {sameWorld} from './world-identity.js';
const RETURN_KEY='whitedot:wow:return:v1';
export function initialize(runtime){
 let pending=null,age=0,visible=false;
 const reduced=()=>!!(runtime.S.reducedMotion||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
 function clear(){try{globalThis.sessionStorage?.removeItem(RETURN_KEY);}catch(_){}pending=null;visible=false;}
 function remember(point){
  clear();if(!point?.address||!sameWorld(point.address,point.address)||!Number.isFinite(point.address.x)||!Number.isFinite(point.address.y))return;
  const small=v=>String(v||'').slice(0,100);
  const marker={version:1,at:Date.now(),point:{address:{...point.address},genre:small(point.genre),material:small(point.material),character:small(point.character)}};
  try{globalThis.sessionStorage?.setItem(RETURN_KEY,JSON.stringify(marker));}catch(_){}
 }
 try{
  const raw=globalThis.sessionStorage?.getItem(RETURN_KEY);globalThis.sessionStorage?.removeItem(RETURN_KEY);
  const marker=raw?JSON.parse(raw):null,a=marker?.point?.address,elapsed=Date.now()-marker?.at;
  if(marker?.version===1&&runtime.arrivedByAddress&&elapsed>=0&&elapsed<=120000&&sameWorld(a,runtime.worldIdentity)&&Number.isFinite(a.x)&&Number.isFinite(a.y)&&a.layer===(runtime.S.layer||'superficie')&&Math.hypot(a.x-runtime.S.wx,a.y-runtime.S.wy)<4)pending={address:a,signature:favoriteSignature(marker.point),owner:runtime.S};
 }catch(_){}
 function tick(dt,paused=false){
  visible=false;if(!pending)return;
  if(pending.owner!==runtime.S||(runtime.S.layer||'superficie')!==pending.address.layer||Math.hypot(runtime.S.wx-pending.address.x,runtime.S.wy-pending.address.y)>150){pending=null;return;}
  if(paused||!runtime.inWorld())return;
  age+=Math.max(0,Math.min(.05,Number.isFinite(dt)?dt:0));if(age>=2.2){pending=null;return;}visible=true;
 }
 function draw(){
  if(!visible||!pending)return;const c=runtime.cx,s=pending.signature,scale=reduced()?1:.9+.1*(1-Math.exp(-age*5));
  c.save();c.translate(runtime.W/2,runtime.H/2);c.scale(scale,scale);c.globalAlpha=(1-age/2.2)*.5;c.strokeStyle='hsl('+s.hue+' 45% 72%)';c.lineWidth=.8;c.beginPath();
  for(const [a,b]of s.edges){c.moveTo(s.nodes[a].x*48,s.nodes[a].y*48);c.lineTo(s.nodes[b].x*48,s.nodes[b].y*48);}c.stroke();c.fillStyle='#fff';
  for(const p of s.nodes)c.fillRect(p.x*48-1,p.y*48-1,2,2);c.restore();
 }
 Object.defineProperties(runtime,{rememberFavoriteReturn:{get:()=>remember},clearFavoriteReturn:{get:()=>clear},favoriteReturnTick:{get:()=>tick},drawFavoriteReturn:{get:()=>draw},favoriteReturnState:{get:()=>({pending:!!pending,visible,age})}});
}
