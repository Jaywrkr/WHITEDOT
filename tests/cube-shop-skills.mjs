import assert from 'node:assert/strict';
import {shopPiece,CUBE_SHOP} from '../src/cube-shop-model.js';
import {SHOP_SKILLS,MAGNET_SCALE,SPRINT,GLIDE,sprintBoost,initialize} from '../src/cube-shop-skills.js';
// Batch 7 and the economy review: skills at half the planned price, like every piece after the first three.
const skills=SHOP_SKILLS.map(shopPiece);assert(skills.every(p=>p?.slot==='skills'));assert.equal(skills.reduce((a,p)=>a+p.cost,0),1850);
assert.equal(CUBE_SHOP.length,81);assert.equal(CUBE_SHOP.reduce((a,p)=>a+p.cost,0),17030);
assert.deepEqual(['dust','facet','orbit'].map(id=>shopPiece(id).cost),[40,80,150],'the first three keep their price');
// Sprint: a burst that fades over one second.
assert.equal(sprintBoost(0),1+SPRINT.boost);assert.equal(sprintBoost(SPRINT.seconds),1);assert(Math.abs(sprintBoost(SPRINT.seconds/2)-(1+SPRINT.boost/2))<1e-9);assert.equal(sprintBoost(-1),1);
const calls=[];const r={S:{wx:0,wy:0,layer:'superficie'},inWorld:()=>true,sparkEconomy:{on:{}},toast:m=>calls.push(['toast',m]),surfaceLayer:(x,y,m)=>calls.push(['land',x,y,m]),regionOfPos:x=>({sea:x<0,name:x<0?'Mar':'Tierra'})};
initialize(r);assert.equal(r.cubeShopMagnet(),1);assert.equal(r.cubeShopBoost(1,false),1);assert.equal(r.cubeShopBoost(.016,true),1,'not worn, no burst');
r.sparkEconomy={on:{'skill:magnet':true,'skill:sprint':true,'skill:glide':true}};assert.equal(r.cubeShopMagnet(),MAGNET_SCALE);
for(let i=0;i<40;i++)r.cubeShopBoost(.016,false);
assert(r.cubeShopBoost(.016,true)>1.6,'starting after a pause bursts');let last=0;for(let i=0;i<70;i++)last=r.cubeShopBoost(.016,true);assert.equal(last,1,'the burst ends after a second');
for(let i=0;i<40;i++)r.cubeShopBoost(.016,false);assert.equal(r.cubeShopBoost(.016,true),1,'it needs to recharge');
for(let i=0;i<400;i++)r.cubeShopBoost(.016,false);assert(r.cubeShopBoost(.016,true)>1.6,'recharged');assert.equal(r.cubeShopSkills().sprints,2);
// Planeo: only in the Sky; lands over land after the glide, waits over the sea and gives up after six seconds.
const canvas=new Proxy({},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>{o[k]=v;return true;}});
assert.equal(r.cubeShopGlide(),false);r.S.layer='cielo';assert.equal(r.cubeShopGlide(),true);assert.equal(r.cubeShopGlide(),true);assert.equal(r.cubeShopSkills().glides,1);
let t=0;const run=s=>{for(let i=0;i<s*60;i++){t+=1000/60;r.drawCubeShopSkills(canvas,100,100,10,t);}};
r.S.wx=50;run(GLIDE.seconds-.2);assert.equal(r.cubeShopSkills().landed,0);run(.4);assert.equal(r.cubeShopSkills().landed,1);assert.equal(calls.at(-1)[0],'land');
r.cubeShopGlide();r.S.wx=-50;run(GLIDE.seconds+.5);assert.equal(r.cubeShopSkills().landed,1,'no landing on the sea');assert(r.cubeShopSkills().gliding>0);run(GLIDE.longest);assert.equal(r.cubeShopSkills().gliding,null);assert.equal(calls.at(-1)[0],'toast');
r.sparkEconomy={on:{}};assert.equal(r.cubeShopGlide(),false);assert.equal(r.cubeShopMagnet(),1);
console.log('PASS batch 7: three skills at 1850 sparks, catalog halved to 17030, magnet reach, sprint burst and recharge, glide that lands only over land');
