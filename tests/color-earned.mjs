import assert from 'node:assert/strict';
import {SAFE_COLORS,earnedColor,placeColor} from '../src/color-safe.js';
import {LANDSCAPES} from '../src/house-view.js';
import {initialize,recoverMs,ease,PIGMENT,textureWeight} from '../src/world-sheet.js';
import {ECHO_SOCKET} from '../src/journey-echo.js';
import {readFileSync} from 'node:fs';
// Panel 10, P7 (D4, Roset): the colour is earned and seen.

// Colour blindness: no two places share a colour, and the three that did stay apart in simulated colour blindness
// (Machado et al. 2009, severity 1, CIE76 on the simulated colours).
const ids=Object.keys(SAFE_COLORS);assert.equal(new Set(ids.map(id=>SAFE_COLORS[id])).size,ids.length,'no two places with the same hex');
const M={deut:[[.367322,.860646,-.227968],[.280085,.672501,.047413],[-.01182,.04294,.968881]],prot:[[.152286,1.052583,-.204868],[.114503,.786281,.099216],[-.003882,-.048116,1.051998]],trit:[[1.255528,-.076749,-.178779],[-.078411,.930809,.147602],[.004733,.691367,.3039]],none:[[1,0,0],[0,1,0],[0,0,1]]};
const lin=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;},f=t=>t>.008856?Math.cbrt(t):7.787*t+16/116;
function lab(hex,m){const c=[1,3,5].map(i=>lin(parseInt(hex.slice(i,i+2),16))),o=m.map(r=>Math.max(0,Math.min(1,r[0]*c[0]+r[1]*c[1]+r[2]*c[2])));
 const X=.4124*o[0]+.3576*o[1]+.1805*o[2],Y=.2126*o[0]+.7152*o[1]+.0722*o[2],Z=.0193*o[0]+.1192*o[1]+.9505*o[2],fx=f(X/.95047),fy=f(Y),fz=f(Z/1.08883);return [116*fy-16,500*(fx-fy),200*(fy-fz)];}
for(const id of ['dunas','cristales','ruinas'])for(const [kind,m]of Object.entries(M))for(const other of ids){if(other===id)continue;const a=lab(SAFE_COLORS[id],m),b=lab(SAFE_COLORS[other],m),d=Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);assert(d>=20,`${id} and ${other} apart in ${kind}: ${d.toFixed(1)}`);}
for(const id of ids)assert(lab(SAFE_COLORS[id],M.none)[0]>=50,id+' readable on black');
// The colour of a complete place: its landscape, or its safe colour; white for anything else; never the generic gold.
for(const id of Object.keys(LANDSCAPES)){assert.equal(earnedColor(id,false),LANDSCAPES[id]);assert.equal(earnedColor(id,true),placeColor(id,LANDSCAPES[id],true));}
assert.equal(earnedColor('otro',false),'#ffffff');assert(!Object.values(LANDSCAPES).includes('#f0d27a'),'no place is the gold of the stars');

// The moment the colour comes back lasts one bar, between 2,4 and 3 s, with an ease that starts and ends slowly.
assert.equal(recoverMs(60/96/4),2500,'one bar at 96 bpm');assert.equal(recoverMs(.05),2400);assert.equal(recoverMs(.5),3000);assert.equal(recoverMs(undefined),2500);
assert.equal(ease(0),0);assert.equal(ease(1),1);assert(ease(.1)<.1&&ease(.9)>.9);
let now=1000;const realNow=performance.now.bind(performance);performance.now=()=>now;
const calls=[];const c=new Proxy({canvas:{width:390,height:844}},{get:(o,k)=>k in o?o[k]:k==='createRadialGradient'?()=>({addColorStop(){}}):(...a)=>calls.push([k,o.globalCompositeOperation,o.globalAlpha,...a]),set:(o,k,v)=>{o[k]=v;return true;}});
globalThis.document={querySelectorAll:()=>[]};
const r={S:{journey:{version:1,mode:'viaje',colors:{}},layer:'superficie'},SIX:60/96/4,BIOMES:[{id:'llanura'},{id:'lago'}],curZone:1,W:390,H:844,cx:c,$:()=>({style:{}}),inWorld:()=>true,journeyQuiet:()=>true,save:()=>true,enterFx:0,placeColor:(id,base)=>base};
initialize(r);for(let k=0;k<40;k++){now+=16;r.drawWorldSheet(now,.5);}assert(r.worldSheetState().grey>.9,'pale');
// Pale: the old grey (saturation blend and a little darker), no pigment.
calls.length=0;r.drawWorldSheetGrey();assert.deepEqual(calls.filter(x=>x[0]==='fillRect').map(x=>x[1]),['saturation','source-over']);
assert.equal(r.recoverJourneyColor(),true);const start=now;let reached=null,last=1;
for(;now<start+3200;now+=16){r.drawWorldSheet(now,.5);const st=r.worldSheetState();assert(st.grey<=last+1e-9,'the grey only goes');last=st.grey;if(reached===null&&st.grey<=.05)reached=now-start;
 if(now-start>400&&now-start<2000){calls.length=0;r.drawWorldSheetGrey();assert(calls.some(x=>x[0]==='clip'),'the grey stays outside a circle');assert(calls.some(x=>x[0]==='arc'&&x[1]==='source-over'),'the front of colour');const fr=r.worldSheetState().front;assert(fr.r>0&&fr.r<fr.reach,'opening from the cube');}}
assert(reached>=2000,`grey from 1 to 0,05 in ≥ 2 s (${reached} ms)`);assert(reached<=3000);assert(r.worldSheetState().grey<.001);assert.equal(r.worldSheetState().opening,null);
// Recovered: no flat veil over the screen; the colour goes into the shapes as a «color» blend (black stays black).
calls.length=0;r.drawWorldSheet(now,.5);assert.deepEqual(calls.map(x=>x[0]).filter(k=>k!=='save'&&k!=='restore'),['fillRect'],'only the small pool of light');
calls.length=0;r.drawWorldSheetGrey();const fills=calls.filter(x=>x[0]==='fillRect');assert.equal(fills.length,1);assert.equal(fills[0][1],'color');assert(Math.abs(fills[0][2]-PIGMENT)<1e-9);
// Reduced motion: the same bar, as a plain fade with no moving front.
r.BIOMES.push({id:'bosque'});r.curZone=2;r.S.reducedMotion=true;now+=5000;r.drawWorldSheet(now,.5);assert.equal(r.recoverJourneyColor(),true);now+=1250;r.drawWorldSheet(now,.5);
assert(r.worldSheetState().grey>.3&&r.worldSheetState().grey<.7,'half way at half the bar');calls.length=0;r.drawWorldSheetGrey();assert(!calls.some(x=>x[0]==='clip'));
performance.now=realNow;

// Less texture in Lago, Dunas and Ruinas; the rest as before.
for(const id of ['lago','dunas','ruinas'])assert(textureWeight(id)<=.5,id);for(const id of ['llanura','bosque','cueva'])assert.equal(textureWeight(id),1,id);
// The cave's sockets are one size, white and gold; its flame keeps the red.
assert.equal(ECHO_SOCKET,7);const echo=readFileSync(new URL('../src/journey-echo.js',import.meta.url),'utf8'),under=echo.slice(echo.indexOf('function under('),echo.indexOf('function over('));
assert.equal((under.match(/=red|\?red|fillStyle=red|strokeStyle=red/g)||[]).length,2,'red only for the flame and its rings');
// No word on the Journey's Path: «Pulso» is not written.
const sparks=readFileSync(new URL('../src/crystal-sparks.js',import.meta.url),'utf8');assert(!sparks.includes("'Pulso'"),'Pulso is not written');
// The recording pill is white with a blinking dot.
const css=readFileSync(new URL('../styles/game.css',import.meta.url),'utf8');assert(!/rec-badge\{[^}]*ff6b6b/.test(css)&&/\.rec-dot\{[^}]*animation:recblink/.test(css));
console.log('PASS colour earned (P7): no repeated colour-blind hues and apart in simulated deuteranopia, protanopia and tritanopia; the colour of a place once complete; the colour comes back over one bar from the cube (grey 1 → 0,05 in ≥ 2 s), as pigment, never a veil; plain fade with reduced motion; less texture in Lago, Dunas, Ruinas; the cave in white and gold; no «Pulso»; a white recording pill');
