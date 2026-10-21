import assert from 'node:assert/strict';
import {shopPiece} from '../src/cube-shop-model.js';
import {SHOP_WORLD,SHOP_WILD,COSTUMES,initialOf,letterStars,morseUnits,puddleIn,hash,recentCards,rarestCard,drawCostume,drawSkin,drawWildGlyph,initialize} from '../src/cube-shop-wild.js';
// Batch 6 pieces, as listed in docs/TIENDA_DEL_CUBO.md.
const pieces=[...SHOP_WORLD,...SHOP_WILD].map(shopPiece);
assert(pieces.every(Boolean));assert.equal(pieces.length,11);assert.equal(pieces.reduce((a,p)=>a+p.cost,0),7350);
assert(SHOP_WORLD.every(id=>shopPiece(id).slot==='world'));assert(SHOP_WILD.every(id=>shopPiece(id).slot==='wild'));
// Constellation and morse come from the player's name.
assert.equal(initialOf('Ñandú'),'N');assert.equal(initialOf('élan'),'E');assert.equal(initialOf(''),'K');assert.equal(initialOf('123 jay'),'J');
assert.equal(letterStars('L').length,7);assert.deepEqual(letterStars('T')[0],[0,0]);
const sos=morseUnits('SOS').join('');assert(sos.startsWith('10101000111011101110001010100'),sos);assert(morseUnits('').includes(1),'an empty name still blinks');
// Puddles are fixed by place and world, about one cell in five.
assert.deepEqual(puddleIn(3,4,'a'),puddleIn(3,4,'a'));let n=0;for(let i=0;i<40;i++)for(let j=0;j<40;j++){const p=puddleIn(i,j,'w');if(p){n++;assert(p.x>=i*150&&p.x<(i+1)*150&&p.y>=j*150&&p.y<(j+1)*150);}}assert(n>200&&n<440,n);
assert.equal(hash('x'),hash('x'));assert.notEqual(hash('x'),hash('y'));
const book={items:[{id:1,odds:{tier:'raro'}},{id:2,odds:{tier:'mitico'}},{id:3,odds:{tier:'singular'}},{id:4,odds:{tier:'raro'}}]};
assert.deepEqual(recentCards(book).map(c=>c.id),[2,3,4]);assert.equal(rarestCard(book).id,2);assert.equal(rarestCard({items:[]}),null);assert.deepEqual(recentCards(null),[]);
// Drawing never throws on an inert canvas.
const canvas=new Proxy({},{get:(o,k)=>k in o?o[k]:k==='measureText'?()=>({width:20}):k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{},set:(o,k,v)=>{o[k]=v;return true;}});
for(const shape of COSTUMES){drawCostume(canvas,shape,50,50,20,1000);drawSkin(canvas,50,50,20,1000,{shape});}
for(const id of ['world:puddles','world:grass','world:retinue','world:constellation'])drawWildGlyph(canvas,id,50,50,20,1000);
// Runtime: three pulses put on a costume for a minute, in turn; Hierba only on the surface.
const r={S:{wx:0,wy:0,layer:'superficie',rareBook:book,playerProfile:{name:'Jay'}},W:400,H:400,MU:{},inWorld:()=>true,sparkEconomy:{wear:{},on:{}}};
initialize(r);assert.equal(r.cubeShopGrassWide(),false);
r.sparkEconomy={on:{'world:grass':true,'wild:costume':true,'wild:vjskin':true,'world:puddles':true,'world:retinue':true,'world:lantern':true,'world:constellation':true,'wild:morse':true,'wild:backpack':true,'wild:screen':true,'wild:hologram':true}};
assert.equal(r.cubeShopGrassWide(),true);r.S.layer='bajo';assert.equal(r.cubeShopGrassWide(),false);r.S.layer='superficie';
r.cubeShopWildTap(1000);r.cubeShopWildTap(1400);assert.equal(r.cubeShopWild().costumes,0);r.cubeShopWildTap(1800);assert.equal(r.cubeShopWild().costumes,1);
for(let i=0;i<3;i++)r.cubeShopWildTap(5000+i*100);assert.equal(r.cubeShopWild().costumes,2);
assert(r.drawCubeShopCostume(canvas,200,200,12,1000,'#fff'),'a costume replaces the body');
for(let t=0;t<40;t++){r.S.wx+=8;r.drawCubeShopWildUnder(canvas,200,200,12,1000+t*16);r.drawCubeShopWildOver(canvas,200,200,12,1000+t*16);}
assert(r.cubeShopWild().trail>5,'the retinue follows the path');
r.sparkEconomy={on:{}};assert.equal(r.drawCubeShopCostume(canvas,200,200,12,1000,'#fff'),false,'taking it off ends the costume');
console.log('PASS batch 6: 11 pieces and 7350 sparks, initial and morse from the name, fixed puddles, recent and rarest cards, costumes by three pulses, grass only on the surface');
