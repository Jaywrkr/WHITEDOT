// Version 1 identifies the existing generator/catalog; it does not reshuffle worlds.
export const WORLD_VERSIONS=Object.freeze({generatorVersion:1,catalogVersion:1,layoutVersion:1});
export const EXPANDED_WORLD_VERSIONS=Object.freeze({generatorVersion:2,catalogVersion:2,layoutVersion:2});
export const WORLD_PROFILES=Object.freeze([WORLD_VERSIONS,EXPANDED_WORLD_VERSIONS]);
export function worldIdentity(seed='',layout='classic',generation=1){if(![1,2].includes(generation))throw Error('Generación no compatible');return {seed:String(seed||''),layout:['wide','vasto'].includes(layout)?layout:'classic',...(generation===2?EXPANDED_WORLD_VERSIONS:WORLD_VERSIONS)};}
export function validWorldIdentity(value){return !!value&&typeof value.seed==='string'&&value.seed.length<=40&&['classic','wide','vasto'].includes(value.layout)&&Object.keys(WORLD_VERSIONS).every(k=>Number.isInteger(value[k])&&value[k]>0);}
export function supportedWorld(value){return validWorldIdentity(value)&&WORLD_PROFILES.some(profile=>Object.entries(profile).every(([key,version])=>value[key]===version));}
export function sameWorld(a,b){return supportedWorld(a)&&supportedWorld(b)&&a.seed===b.seed&&a.layout===b.layout&&Object.keys(WORLD_VERSIONS).every(k=>a[k]===b[k]);}
export function placeAddress(identity,x,y,layer='superficie'){
 if(!supportedWorld(identity)||!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x)>=1e12||Math.abs(y)>=1e12||!['superficie','bajo','cielo'].includes(layer))throw Error('Dirección de lugar inválida');
 return {...identity,x,y,layer};
}
