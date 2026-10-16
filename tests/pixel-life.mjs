import assert from 'node:assert/strict';
import {pixelGenome,pixelGeometry,pixelColony,PIXEL_CELL,PIXEL_ACTIVITIES,inhabitantTarget,moveInhabitant,migratingBeings,inhabitantVoice,inhabitantPractice} from '../src/pixel-life-model.js';
import {nativeVisualDescriptor} from '../src/native-visual.js';
import {initialize as data} from '../src/data.js';import {initialize as progress} from '../src/progress.js';import {initialize as world} from '../src/world.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};const r={};data(r);progress(r);world(r);
const silhouettes=new Set(),activities=new Set(),roles=new Set(),instruments=new Set(),shapes=new Set();let pixelCohort=0,quiet=0,populated=0,total=0;
for(let i=0;i<3000;i++){
 const g=pixelGenome('specimen:'+i,r.seedOf);assert.deepEqual(g,pixelGenome('specimen:'+i,r.seedOf));const points=pixelGeometry(g);assert(points.length>8&&points.length<65);assert.equal(new Set(points.map(p=>p.join(','))).size,points.length);
 silhouettes.add(JSON.stringify(points));activities.add(g.activity);roles.add(g.role);
 const d=r.regionOfPos(i%60*900,Math.floor(i/60)*900),snapshot=JSON.stringify(d),voice=inhabitantVoice({genome:g},d,r.GEN);instruments.add(voice.instrument);assert(voice.low>=36&&voice.high<=69&&voice.low<voice.high);assert.equal(JSON.stringify(d),snapshot);
 const desc=nativeVisualDescriptor({id:'native:'+i,mob:true},d,r.seedOf);if(desc.style==='pixel')pixelCohort++;
}
assert(silhouettes.size>=700,'hundreds of actual distinct silhouettes, not just nominal seed combinations');assert.equal(activities.size,12);assert.equal(roles.size,4);assert(instruments.size>=20);assert(pixelCohort>1200&&pixelCohort<2400);
for(let a=-20;a<=20;a++)for(let b=-8;b<=8;b++){
 const d=r.regionOfPos((a+.5)*PIXEL_CELL,(b+.5)*PIXEL_CELL),snapshot=JSON.stringify(d),colony=pixelColony(a,b,d,r.seedOf);assert.deepEqual(colony,pixelColony(a,b,d,r.seedOf));assert(colony.length<=3);assert.equal(JSON.stringify(d),snapshot);
 if(!colony.length)quiet++;else populated++;total+=colony.length;
 for(const o of colony){assert(o.x>=a*PIXEL_CELL&&o.x<(a+1)*PIXEL_CELL);assert(o.y>=b*PIXEL_CELL&&o.y<(b+1)*PIXEL_CELL);shapes.add(o.genome.body);}
}
assert(quiet>20&&populated>150&&total>300);assert(shapes.size>=5);
const paths=new Set();for(const activity of PIXEL_ACTIVITIES){const o={id:activity,x:0,y:0,hx:0,hy:0,genome:{...pixelGenome(activity,r.seedOf),activity}};
 paths.add(JSON.stringify(Array.from({length:12},(_,i)=>inhabitantTarget(o,{x:80,y:0},i*1.1))));for(let i=0;i<600;i++)moveInhabitant(o,{x:80,y:0},i/20,.05);assert(Math.hypot(o.x,o.y)<150);const before=JSON.stringify(o);moveInhabitant(o,{x:0,y:100},800,1,true);assert.equal(JSON.stringify(o),before);
}assert.equal(paths.size,12,'each activity needs a different spatial/pose trajectory');
const destination=inhabitantPractice(r,'traveller'),migrants=migratingBeings(destination.x,destination.y,0,r.seedOf,700);assert(migrants.length>0&&migrants.length<=6);let journeys=0;
for(const o of migrants){const later=migratingBeings(o.x+o.vx*120,o.y+o.vy*120,120,r.seedOf,700).find(v=>v.id===o.id);assert(later,'inverse lookup retains the same traveller across cells');assert(Math.hypot(later.x-o.x,later.y-o.y)>1500);assert(Math.abs(later.x-o.x-o.vx*120)<1e-8);journeys++;}
assert(journeys>0);assert.deepEqual(migratingBeings(0,0,0,r.seedOf,700,true),migratingBeings(0,0,10000,r.seedOf,700,true));
for(const kind of ['colony','traveller']){const p=inhabitantPractice(r,kind);assert(p);assert(!r.regionOfPos(p.x,p.y).sea);if(kind==='colony'){const a=Math.floor(p.x/PIXEL_CELL),b=Math.floor(p.y/PIXEL_CELL),d=r.regionOfPos((a+.5)*PIXEL_CELL,(b+.5)*PIXEL_CELL);assert(pixelColony(a,b,d,r.seedOf).some(o=>o.id===p.id&&o.x===p.x&&o.y===p.y));}}
console.log(`PASS ${silhouettes.size} distinct pixel silhouettes, 12 activities, ${instruments.size} regional instruments, ${total} inhabitants across ${populated} cells and ${quiet} clear cells, autonomous long-distance migration and real practices`);
