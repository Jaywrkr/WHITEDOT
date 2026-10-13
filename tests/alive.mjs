import assert from 'node:assert/strict';
import {stormsNear,stormAt,windOf,seasonOf,SEASONS} from '../src/alive.js';
import {riverAt} from '../src/wonders.js';
const T0=Date.UTC(2026,9,12,20,0);
// Tormentas: deterministas, se desplazan con el viento del día y cubren una parte pequeña del mundo.
assert.deepEqual(stormsNear(5,5,T0),stormsNear(5,5,T0));
let inside=0,N=0;for(let u=-60;u<60;u+=1.5)for(let v=-60;v<60;v+=1.5){N++;if(stormAt(u,v,T0).i>0)inside++;}
assert(inside/N>.01&&inside/N<.2,`storm coverage ${inside/N}`);
const s0=stormsNear(0,0,T0)[0],s1=stormsNear(0,0,T0+10*60e3).find(s=>s.id===s0.id);assert(s1,'storm persists');
const [wx,wy]=windOf(T0),moved=[s1.x-s0.x,s1.y-s0.y],len=Math.hypot(...moved);
assert(len>1&&len<6,`storms travel ${len} regions in 10 min`);assert((moved[0]*wx+moved[1]*wy)/len>.99,'storms follow the wind');
// Se pueden perseguir: el jugador (190 px/s ≈ 3 regiones/min) es más rápido que una tormenta.
assert(len/10<3);
// Estaciones: cambian cada semana y no todos los continentes están en la misma.
const week=7*864e5,a=seasonOf('3,1',T0),b=seasonOf('3,1',T0+week);assert.notEqual(a.id,b.id);assert.equal(seasonOf('3,1',T0).id,seasonOf('3,1',T0+60e3).id);
const set=new Set(['0,0','1,0','2,1','-1,3','4,-2','5,5','-3,-3','7,0'].map(id=>seasonOf(id,T0).id));assert(set.size>=3,'continents are out of phase');
assert.equal(SEASONS.length,4);
// Confluencias: las dos familias de ríos se cruzan en algún lugar.
let conf=null;for(let i=0;i<300000&&!conf;i++){const x=Math.sin(i*12.9898)*43758%1*60*3600,y=Math.sin(i*78.233)*12345%1*60*3600;const q=riverAt(x,y,3600,null);if(q?.conf)conf=[x,y,q];}
assert(conf,'rivers meet somewhere');assert(conf[2].other.length===2);
console.log(`PASS: moving storms (${(inside/N*100).toFixed(1)} % of the world, ${len.toFixed(1)} regions per 10 min with the wind), weekly seasons out of phase, river confluences`);
