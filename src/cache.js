export const CACHE_LIMITS=Object.freeze({pathChunks:128,worldChunks:128,biomes:256,regions:128,continentSeeds:128,continentRegions:256});
export class BoundedMap extends Map{
 constructor(limit){super();if(!Number.isInteger(limit)||limit<1)throw Error('Invalid cache limit');this.limit=limit;this.evictions=0;}
 get(key){if(!super.has(key))return undefined;const value=super.get(key);super.delete(key);super.set(key,value);return value;}
 set(key,value){super.delete(key);super.set(key,value);while(this.size>this.limit){super.delete(this.keys().next().value);this.evictions++;}return this;}
 stats(){return {size:this.size,limit:this.limit,evictions:this.evictions};}
}
