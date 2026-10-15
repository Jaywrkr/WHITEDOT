import assert from 'node:assert/strict';
import {habitatAt,habitatIntent,spatialNeighbors} from '../src/habitats.js';
import {createWorldFamily} from '../src/world-families.js';
import {updateMind,mindProfile} from '../src/living-mind.js';
const seedOf=s=>[...s].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261),rng=a=>()=>((a=Math.imul(a,1664525)+1013904223>>>0)/4294967296);
const region={key:'2,3',genre:'deep',hue:200};region.worldFamily=createWorldFamily(region,'bosque',seedOf,rng);
const niches=new Set(),guilds=new Set();for(let x=-1600;x<1600;x+=80)for(let y=-800;y<800;y+=80){const a=habitatAt(region,x,y,seedOf);assert.deepEqual(a,habitatAt(region,x,y,seedOf));niches.add(a.niche);guilds.add(a.guild);}
assert(niches.size>=3&&guilds.size===5);
const player={x:80,y:0,speed:0},plant={id:'plant',group:'flora',x:25,y:0},base={id:'actor',kind:'moth',group:'fauna',x:0,y:0,homeX:0,homeY:0,size:12,variant:5,energy:.1,awake:1};
base.mind={...mindProfile(base,seedOf,rng),musicInterest:1,curiosity:0,caution:.55,sociability:1};
const h={...habitatAt(region,0,0,seedOf),niche:'refuge',visitor:false,guild:'pollinator',phase:0};
assert.equal(habitatIntent({...base,habitat:h,ecology:{humidity:.4}},player,0,[plant]),'forage');
assert.equal(habitatIntent({...base,habitat:h,ecology:{humidity:.95}},player,0,[plant]),'shelter');
assert.equal(habitatIntent({...base,habitat:{...h,niche:'corridor'},ecology:{migration:true}},player,0,[]),'migrate');
assert.equal(habitatIntent({...base,habitat:{...h,guild:'shoal'},ecology:{}},player,0,[{...base,id:'peer',x:20}]),'cooperate');
assert.equal(habitatIntent({...base,habitat:{...h,guild:'sentinel'},ecology:{}},player,0,[]),'observe');
const o={...base,habitat:h,ecology:{humidity:.4}};for(let k=0;k<800;k++)updateMind(o,.05,k*.05,80,player,[plant]);assert(Math.hypot(o.x,o.y)<=o.mind.territory+.001);assert(o.x>2,'foraging must actually move toward a plant');
const points=Array.from({length:1000},(_,i)=>({x:i%30*10,y:Math.floor(i/30)*10})),near=spatialNeighbors(points)(points[0]);assert(near.length<=12&&near.every(p=>Math.hypot(p.x,p.y)<140));
console.log('PASS deterministic niches/guilds, real foraging/shelter/colony/migration choices, bounded motion and twelve-neighbor budgets');
