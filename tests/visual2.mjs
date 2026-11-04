import assert from 'node:assert/strict';
import {bake,streak,streakSprite,radial,setFxCanvas,fxSpritesMade,fxBakedCount,FX_BAKED,FX_SPRITES} from '../src/fx-kit.js';
import {drawTotem} from '../src/sculpture-totems-art.js';
import {TOTEMS,TOTEM_KINDS} from '../src/sculpture-totems-model.js';
// Visual 2 (alpha.254): the kit's new pieces and the totems drawn from cached pieces. A context that records calls.
function recorder(){const calls=[];const c={globalAlpha:1,globalCompositeOperation:'source-over',lineWidth:1,fillStyle:'#000',strokeStyle:'#000',
 createRadialGradient(...a){const g={a,stops:[],addColorStop(o,col){g.stops.push([o,col]);}};calls.push({k:'createRadialGradient',g});return g;},
 createLinearGradient(...a){const g={a,stops:[],addColorStop(o,col){g.stops.push([o,col]);}};calls.push({k:'createLinearGradient',g});return g;}};
 for(const k of ['fillRect','drawImage','stroke','fill','beginPath','arc','moveTo','lineTo','save','restore','scale','translate','rotate','clip','closePath','rect'])c[k]=function(...a){calls.push({k,a,alpha:this.globalAlpha,op:this.globalCompositeOperation});};
 return {c,calls};}
globalThis.Path2D??=class{constructor(d){this.d=d;}};
// Without a canvas (Node): a streak is a plain line, a baked drawing is null and the totem paints its two gradients per
// piece as before.
setFxCanvas(()=>null);
{const {c,calls}=recorder();streak(c,10,10,0,40,4,'#ffffff',.5);assert(calls.some(q=>q.k==='stroke'),'a plain line');assert.equal(bake('x',10,10,()=>{}),null);
 calls.length=0;drawTotem(c,{kind:'stack'},{still:true});assert.equal(calls.filter(q=>q.k==='createLinearGradient').length,TOTEMS.stack.pieces.length*2,'the old painting without a canvas');assert(!calls.some(q=>q.k==='drawImage'));}
// With canvases: each totem piece is painted once (its two gradients, a lit rim and less saturation) and then drawn as one
// image over the same box; a streak is one rotated image added with 'lighter'; bake has its own bounded cache.
const made=[];setFxCanvas((w,h)=>{const ctx=recorder();const cv={width:w,height:h,getContext:()=>ctx.c,ctx};made.push(cv);return cv;});
{const {c,calls}=recorder();const m0=fxSpritesMade();drawTotem(c,{kind:'stack'},{still:true});const images=calls.filter(q=>q.k==='drawImage');
 assert.equal(images.length,TOTEMS.stack.pieces.length,'one image per piece');assert(!calls.some(q=>q.k==='createLinearGradient'),'no gradient on the World canvas');assert.deepEqual(images[0].a.slice(1),[-26,-112,52,124]);
 const piece=images[0].a[0];assert.equal(piece.width,104,'twice as sharp');const inner=piece.ctx.calls;assert.equal(inner.filter(q=>q.k==='createLinearGradient').length,2,'its gradient and side shade');assert(inner.some(q=>q.k==='stroke'),'a lit rim');assert(inner.some(q=>q.op==='saturation'),'a little less saturation');
 const after=fxSpritesMade();assert.equal(after-m0,TOTEMS.stack.pieces.length,'each piece painted once');calls.length=0;for(let i=0;i<5;i++)drawTotem(c,{kind:'stack'},{still:true});assert.equal(fxSpritesMade(),after,'painted once, reused');
 for(const kind of TOTEM_KINDS)drawTotem(c,{kind},{light:1,progress:2,ball:20,lean:.1,dance:1});assert(fxBakedCount()<=FX_BAKED);}
{const {c,calls}=recorder();streak(c,50,60,Math.PI/4,90,5,'#dfe9ff',.8);const d=calls.find(q=>q.k==='drawImage');assert(d,'one image');assert.equal(d.op,'lighter');assert.deepEqual(d.a.slice(5),[-90,-2.5,90,5]);assert.equal(c.globalCompositeOperation,'source-over','composite restored');
 const s=streakSprite('#dfe9ff');assert.equal(s,d.a[0],'the same sprite per colour');
 for(let i=0;i<200;i++)bake('k'+i,8,8,()=>{});assert(fxBakedCount()<=FX_BAKED,'a bounded cache');assert(FX_SPRITES>=96);}
// radial gives back nothing it was not asked: drawn over its square at the current alpha times its own.
{const {c,calls}=recorder();c.globalAlpha=.5;radial(c,0,0,20,'t',[[0,'rgba(255,255,255,1)'],[1,'rgba(0,0,0,0)']],.4);const d=calls.find(q=>q.k==='drawImage');assert.equal(d.alpha,.2);assert.equal(c.globalAlpha,.5);}
console.log('PASS visual 2: totems painted once per piece (the old two gradients without a canvas) and drawn as one image each, sharp; a streak of light is one rotated added image; baked drawings have their own bounded cache; the sprite cache has room for the sky and the big objects');
