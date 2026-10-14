// Deadlines run on active play time, independent of wall time and visibility.
export function createPowerClock(definitions){
 let clock=0;const powers=Object.create(null);
 return {powers,now:()=>clock,
  tick(dt,active){if(active&&Number.isFinite(dt))clock+=Math.max(0,Math.min(dt,1))*1000;},
  give(id){const p=definitions[id];if(!p)return false;powers[id]=clock+Math.min(Math.max(0,(powers[id]||clock)-clock)+p.seconds*1000,p.seconds*2000);return true;},
  clear(){clock=0;for(const key of Object.keys(powers))delete powers[key];}
 };
}
