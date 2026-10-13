// Version 1 identifies the existing generator/catalog; it does not reshuffle worlds.
export const WORLD_VERSIONS=Object.freeze({generatorVersion:1,catalogVersion:1,layoutVersion:1});
export function worldIdentity(seed='',layout='classic'){return {seed:String(seed||''),layout:layout==='wide'?'wide':'classic',...WORLD_VERSIONS};}
export function validWorldIdentity(value){return !!value&&typeof value.seed==='string'&&value.seed.length<=40&&['classic','wide'].includes(value.layout)&&Object.keys(WORLD_VERSIONS).every(k=>Number.isInteger(value[k])&&value[k]>0);}
export function supportedWorld(value){return validWorldIdentity(value)&&Object.entries(WORLD_VERSIONS).every(([key,version])=>value[key]===version);}
export function sameWorld(a,b){return supportedWorld(a)&&supportedWorld(b)&&a.seed===b.seed&&a.layout===b.layout;}
export function placeAddress(identity,x,y,layer='superficie'){
 if(!supportedWorld(identity)||!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x)>=1e12||Math.abs(y)>=1e12||!['superficie','bajo','cielo'].includes(layer))throw Error('Dirección de lugar inválida');
 return {...identity,x,y,layer};
}
