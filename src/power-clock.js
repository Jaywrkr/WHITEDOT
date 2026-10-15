// Deadlines run on active play time, independent of wall time and visibility.
export function createPowerClock(definitions){
 let clock=0;const powers=Object.create(null);
 return {powers,now:()=>clock,
  tick(dt,active){if(active&&Number.isFinite(dt))clock+=Math.max(0,Math.min(dt,1))*1000;},
  give(id){const p=Object.hasOwn(definitions,id)&&definitions[id];if(!p)return false;powers[id]=clock+Math.min(Math.max(0,(powers[id]||clock)-clock)+p.seconds*1000,p.seconds*2000);return true;},
  snapshot(){return {version:1,remaining:Object.fromEntries(Object.keys(definitions).map(id=>[id,Math.max(0,(powers[id]||clock)-clock)]))};},
  restore(raw){clock=0;for(const id of Object.keys(powers))delete powers[id];if(raw?.version!==1)return false;for(const [id,p]of Object.entries(definitions)){const ms=raw.remaining?.[id];if(Number.isFinite(ms)&&ms>0)powers[id]=Math.min(ms,p.seconds*2000);}return true;},
  clear(){clock=0;for(const key of Object.keys(powers))delete powers[key];}
 };
}
