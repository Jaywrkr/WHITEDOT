import assert from 'node:assert/strict';
import {setFxCanvas,fxSpritesMade,FX_GOLD} from '../src/fx-kit.js';
import {STAR_LAYERS,starPoints,starGroups,drawStarfield,drawAuroraSky,drawCurtainCell,AURORA_PERIOD,CURTAIN_PERIOD,GROUND,groundVariant,sceneColors,createAmbient,ambientState,refugioRoomLight,stepLight} from '../src/ambient-art.js';
import {STYLES} from '../src/universe-layers.js';
// Visual 3 (alpha.255): the World's ambience from cached images. A context that records calls.
function recorder(){const calls=[];const c={globalAlpha:1,globalCompositeOperation:'source-over',lineWidth:1,fillStyle:'#000',strokeStyle:'#000',
 createRadialGradient(...a){const g={a,addColorStop(){}};calls.push({k:'createRadialGradient'});return g;},
 createLinearGradient(...a){const g={a,addColorStop(){}};calls.push({k:'createLinearGradient'});return g;}};
 for(const k of ['fillRect','drawImage','stroke','fill','beginPath','arc','ellipse','moveTo','lineTo','quadraticCurveTo','save','restore','scale','translate','rotate','clip','closePath','rect','setLineDash'])c[k]=function(...a){calls.push({k,a,alpha:this.globalAlpha,op:this.globalCompositeOperation});};
 return {c,calls};}
const count=(calls,k)=>calls.filter(q=>q.k===k).length;
// Positions come from hashKey, never Math.random: the same stars every time, inside each tile's margins.
{const random=Math.random;Math.random=()=>{throw Error('no random');};try{
 for(let L=0;L<STAR_LAYERS.length;L++){const a=starPoints(L),b=starPoints(L);assert.deepEqual(a,b);assert.equal(a.length,STAR_LAYERS[L].n);for(const p of a){assert(p.x>=6&&p.x<=STAR_LAYERS[L].tile-6&&p.y>=6&&p.y<=STAR_LAYERS[L].tile-6,'inside the tile');assert(p.a>0&&p.a<=1);}}
 for(let i=-5;i<5;i++)for(let j=-5;j<5;j++){const v=groundVariant(i,j);assert(Number.isInteger(v)&&v>=0&&v<GROUND.variants);assert.equal(v,groundVariant(i,j));}
}finally{Math.random=random;}}
// The strips are periodic with the old waves: sin(x/130) in the sky, sin(x/110) in the curtains.
assert(Math.abs(AURORA_PERIOD-2*Math.PI*130)<1,'the sky wave');assert(Math.abs(CURTAIN_PERIOD-2*Math.PI*110)<1,'the curtains wave');
// Scenes are never gold (gold is only for what is earned).
for(const s of ['almacen','patio'])for(const g of ['acid','ebm','detroit','minimal','deep','afro','techhouse','tropical',undefined]){const col=sceneColors(s,g);assert.notEqual(col.base.toLowerCase(),FX_GOLD.toLowerCase());assert.notEqual(col.accent.toLowerCase(),FX_GOLD.toLowerCase());}
// Without a canvas (Node) every piece says so, and the caller draws as before.
setFxCanvas(()=>null);
{const {c,calls}=recorder();assert.equal(drawStarfield(c,390,844,0,0,{alpha:1}),false);assert.equal(drawAuroraSky(c,390,0,150,.2),false);assert.equal(drawCurtainCell(c,0,0,120,0,0,'#7dffc8'),false);assert.equal(stepLight(c,0,0,4,40),false);assert.equal(refugioRoomLight(c,0,0,100,80,80),false);assert.equal(count(calls,'drawImage'),0);
 // The region's curtains keep their columns: 25 strokes in a cell of 120.
 const f={t:1000,beat:.5,still:false,ux:240,uy:0,cubeX:2000,cubeY:2000,ink:'#7dffc8',accent:'#ff7ad9'};let key=null;for(let i=0;i<200&&!key;i++){const k='aurora:mid:'+i+',0';const {c:q,calls:qc}=recorder();STYLES.aurora.mid.draw(q,0,0,120,k,f);if(qc.length)key=k;}
 assert(key,'a cell with curtains');{const {c:q,calls:qc}=recorder();STYLES.aurora.mid.draw(q,0,0,120,key,f);assert.equal(count(qc,'stroke'),25,'the old columns without a canvas');}
}
// With canvases: the stars repeat each layer's pattern; far and mid are a few paths (one per colour and alpha step), the
// near stars one small sprite each, painted once. Reduced motion keeps one depth and no glint; light quality draws two
// layers and adds nothing.
setFxCanvas((w,h)=>{const r=recorder();return {width:w,height:h,getContext:()=>r.c,ctx:r};});
{const {c,calls}=recorder();assert.equal(drawStarfield(c,390,844,1234,-567,{alpha:1,t:100}),true);const m=fxSpritesMade(),paths=starGroups(0).length+starGroups(1).length;
 assert.equal(count(calls,'fill'),paths,'one path per colour and step');assert(count(calls,'rect')>=60&&count(calls,'rect')<=200,count(calls,'rect'));assert(count(calls,'drawImage')>=4&&count(calls,'drawImage')<=20,'the near stars');
 assert.equal(count(calls,'fillRect'),0,'no point drawn one by one');
 calls.length=0;for(let i=0;i<5;i++)drawStarfield(c,390,844,1234+i*40,-567,{alpha:1,t:100+i*16});assert.equal(fxSpritesMade(),m,'painted once, reused');assert.equal(count(calls,'createRadialGradient')+count(calls,'createLinearGradient'),0,'no gradient per frame');
 calls.length=0;drawStarfield(c,390,844,1234,-567,{alpha:1,still:true,t:5000});assert(!calls.some(q=>q.op==='lighter'),'no glint with reduced motion');
 // Reduced motion: the three layers move as one (the old depth): a step that is whole tiles of every layer at that depth
 // draws the same stars; with motion the near layer has moved.
 const seen=(cam,still)=>{const {c:q,calls:qc}=recorder();drawStarfield(q,390,844,cam,0,{alpha:1,still,t:0});return qc.filter(z=>z.k==='rect'||z.k==='drawImage').map(z=>z.k+(z.k==='rect'?z.a.slice(0,2):z.a.slice(1,3))).sort().join('|');};
 assert.equal(seen(0,true),seen(704000,true),'one depth');assert.notEqual(seen(0,false),seen(704000,false),'three depths');
 calls.length=0;drawStarfield(c,390,844,0,0,{alpha:1,light:true,t:5000});assert(!calls.some(q=>q.op==='lighter'),'light adds nothing');assert.equal(count(calls,'drawImage'),0,'two layers in light quality');assert(count(calls,'fill')>0);
 calls.length=0;assert.equal(drawStarfield(c,390,844,0,0,{alpha:0}),true);assert.equal(calls.length,0,'no sky, nothing');}
// The aurora band: one baked strip, added and sliding with the time; light quality keeps the old lines (false).
{const {c,calls}=recorder();assert.equal(drawAuroraSky(c,390,0,150,.2,{light:true}),false);assert.equal(drawAuroraSky(c,390,0,150,.2),true);const d=calls.filter(q=>q.k==='drawImage');assert(d.length>=1&&d.every(q=>q.op==='lighter'));assert.equal(c.globalCompositeOperation,'source-over');
 const at=t=>{const {c:q,calls:qc}=recorder();drawAuroraSky(q,390,t,150,.2);return qc.find(z=>z.k==='drawImage').a[1];};assert.notEqual(at(0),at(500),'it slides');assert(Math.abs(at(0)-at(AURORA_PERIOD/130*1500))<1e-6,'periodic');
 const still=t=>{const {c:q,calls:qc}=recorder();drawAuroraSky(q,390,t,150,.2,{still:true});return qc.find(z=>z.k==='drawImage').a[1];};assert.equal(still(0),still(900),'still with reduced motion');}
// The curtains: a cell takes one or two slices of the strip; near the cube it keeps the columns (they part for it).
{const {c,calls}=recorder();assert.equal(drawCurtainCell(c,10,50,120,0,0,'#7dffc8'),true);assert.equal(count(calls,'drawImage'),1);calls.length=0;drawCurtainCell(c,10,50,120,CURTAIN_PERIOD-30,0,'#7dffc8');assert.equal(count(calls,'drawImage'),2,'wraps round the strip');
 const f={t:1000,beat:.5,still:false,ux:240,uy:0,cubeX:2000,cubeY:2000,ink:'#7dffc8',accent:'#ff7ad9'};let key=null;for(let i=0;i<200&&!key;i++){const k='aurora:mid:'+i+',0';const {c:q,calls:qc}=recorder();STYLES.aurora.mid.draw(q,0,0,120,k,f);if(qc.length)key=k;}
 const far=recorder();STYLES.aurora.mid.draw(far.c,0,0,120,key,f);assert.equal(count(far.calls,'stroke'),0,'away from the cube: the strip');assert(count(far.calls,'drawImage')>=1);
 const near=recorder();STYLES.aurora.mid.draw(near.c,0,0,120,key,{...f,cubeX:60,cubeY:60});assert.equal(count(near.calls,'stroke'),25,'near the cube: the columns that part');}
// The ambience of the frame on a small runtime: the ground only in the Bosque and the Jardín, nothing in light quality;
// the print of a scene only while «Escenas» is on and a stage sounds.
function world(over={}){const {c,calls}=recorder();const r={cx:c,W:390,H:844,camX:0,camY:0,S:{wx:0,wy:0,layer:'superficie'},BIOMES:[{id:'bosque'},{id:'jardin'},{id:'vacio'}],biome:0,biomeOfPos(){return this.biome;},inWorld:()=>true,lightQuality:()=>false,beat:()=>.8,placeColor:(id,b)=>b,sceneState:()=>({on:false,stage:null,prox:0}),...over};return {r,calls,a:createAmbient(r)};}
{const {r,calls,a}=world();a.ground(0,.5);const n=ambientState().ground.cells;assert(n>=3&&n<=12,n);assert.equal(count(calls,'drawImage'),n);
 r.biome=2;calls.length=0;a.ground(0,.5);assert.equal(ambientState().ground.cells,0,'not in the Void');assert.equal(calls.length,0);
 r.biome=1;r.lightQuality=()=>true;a.ground(0,.5);assert.equal(ambientState().ground.cells,0,'not in light quality');}
{const stage={scene:'almacen',genre:'acid',key:'scene:v1:w:1,1',x:30,y:40,hand:{clave:'son'}};
 const off=world({sceneState:()=>({on:false,stage,prox:1,section:'drop'})});off.a.scene(0);assert.equal(ambientState().scene,null,'setting off: no print');assert.equal(off.calls.length,0);
 const quiet=world({sceneState:()=>({on:true,stage:null,prox:0})});quiet.a.scene(0);assert.equal(ambientState().scene,null,'no stage heard: no print');assert.equal(quiet.calls.length,0);
 const on=world({sceneState:()=>({on:true,stage,prox:1,section:'drop'})});on.a.scene(1000);const s=ambientState().scene;assert.equal(s.beams,3);assert.equal(s.floor,true);assert(on.calls.some(q=>q.k==='drawImage'&&q.op==='lighter'),'beams of light');
 const patio=world({sceneState:()=>({on:true,stage:{...stage,scene:'patio',genre:'afro'},prox:1,section:'drop'})});patio.a.scene(1000);assert.equal(ambientState().scene.beams,2);assert.equal(ambientState().scene.bulbs,16);
 const lite=world({lightQuality:()=>true,sceneState:()=>({on:true,stage,prox:1,section:'drop'})});lite.a.scene(1000);assert.equal(ambientState().scene.beams,0,'no beams in light quality');assert(!lite.calls.some(q=>q.op==='lighter'));
 const calm=world({S:{wx:0,wy:0,layer:'superficie',reducedMotion:true},sceneState:()=>({on:true,stage,prox:1,section:'drop'})});const at=t=>{calm.calls.length=0;calm.r.cx.globalAlpha=1;calm.a.scene(t);return JSON.stringify(calm.calls.map(q=>[q.k,q.a,q.alpha]));};assert.equal(at(1000),at(4000),'reduced motion: the print does not move');}
// The Refugio: the step's light is one image (it was a gradient); the warm light of a room is two added images.
{const {c,calls}=recorder();assert.equal(stepLight(c,0,0,4,40),true);assert.equal(count(calls,'createLinearGradient'),0);calls.length=0;assert.equal(refugioRoomLight(c,0,0,100,80,80,.5),true);const d=calls.filter(q=>q.k==='drawImage');assert.equal(d.length,2);assert(d.every(q=>q.op==='lighter'));assert.equal(c.globalCompositeOperation,'source-over');}
console.log('PASS visual 3: stars, aurora and curtains from cached strips, the ground of the Bosque and the Jardín, the print of a scene only while it sounds, the Refugio light; no random, never gold, old drawing without a canvas');
