export const releaseVersion=value=>typeof value==='string'&&/^\d+\.\d+\.\d+(?:-(?:rc|alpha)\.\d+)?$/.test(value);
export function deploymentTime(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value))return null;
 const n=Date.parse(value);if(!Number.isFinite(n))return null;
 const canonical=value.includes('.')?value:value.replace('Z','.000Z');
 return new Date(n).toISOString()===canonical?canonical:null;
}
export function normalizeRelease(value){
 return {version:releaseVersion(value?.version)?value.version:'desconocida',deployedAt:deploymentTime(value?.deployedAt),revision:typeof value?.revision==='string'&&/^[a-f0-9]{7,40}$/.test(value.revision)?value.revision:null};
}
export function releaseLabels(value,{locale='es-EC',timeZone}={}){
 const r=normalizeRelease(value),date=r.deployedAt?new Intl.DateTimeFormat(locale,{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23',...(timeZone?{timeZone}:{})}).format(new Date(r.deployedAt)):null;
 return {version:'v'+r.version,date:date?'deploy '+date:'deploy sin registrar',title:date?`Publicación ${r.deployedAt} · hora local${r.revision?' · '+r.revision.slice(0,7):''}`:'No hay fecha de publicación registrada para esta versión.'};
}
