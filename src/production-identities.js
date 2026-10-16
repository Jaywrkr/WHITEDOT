import {GENRE_CHARACTERS} from './musical-character.js';
// Original compositional roles, not artist presets. Tempo and maps belong to the region.
const identity=(id,name,leads,bass,comp,answer,gesture,accent)=>Object.freeze({id,name,leads:Object.freeze(leads.split(' ')),bass:Object.freeze(bass.split(' ')),comp,answer,gesture,accent});
export const PRODUCTION_IDENTITIES=Object.freeze({
 minimal:identity('minimal','Pulso y detalle','p_barkkeys p_feltmallet resonantpluck','sub p_foldbass','p_tinepiano','p_fmharp','muted','rim'),
 machine:identity('machine','Máquina articulada','phasekeys p_barkkeys p_fmharp','p_foldbass p_softreese','p_cellobody','resonantpluck','muted','snare'),
 warm:identity('warm','Teclas con cuerpo','p_tinepiano p_tapepiano rhodes','p_roundbass velvetbass','p_gutguitar','p_softhorn','normal','clap'),
 organic:identity('organic','Madera y cuerda','p_gutguitar p_panreed kalimba','p_woodybass reedbass','p_cellobody','p_wireharp','normal','conga'),
 afro:identity('afro','Piel y contratiempo','p_wireharp p_panreed p_gutguitar','p_woodybass sub','p_tinepiano','kalimba','normal','conga'),
 disco:identity('disco','Bajo, cuerda y brillo','clav p_tinepiano p_gutguitar','pluck p_roundbass','rhodes','p_softhorn','muted','clap'),
 broken:identity('broken','Teclas a contratiempo','p_tinepiano phasekeys p_feltmallet','sub p_roundbass','rhodes','p_bassclarinet','muted','snare'),
 bass:identity('bass','Grave y respuesta','p_barkkeys p_bassclarinet resonantpluck','p_softreese p_foldbass','p_tinepiano','p_cellobody','muted','snare'),
 melodic:identity('melodic','Arco y secuencia','p_cellobody p_fmharp phasekeys','sub p_roundbass','p_tinepiano','p_panreed','normal','clap'),
 dub:identity('dub','Acorde entre ecos','p_barkkeys p_gutguitar hollow','sub p_woodybass','p_tapepiano','p_bassclarinet','muted','rim'),
 ambient:identity('ambient','Aire y respiración','p_cellobody p_tapepiano p_duskwind','sub p_woodybass','p_violaswell','p_bassclarinet','breathy','wood'),
 blues:identity('blues','Guitarra y electrónica','p_gutguitar rhodes p_softhorn','p_woodybass p_roundbass','p_tinepiano','p_cellobody','slide','rim')
});
export function productionIdentity(region,seedOf,hybrid=null){
 const kind=hybrid?.id==='blues-machine'?'blues':['ambient','heart'].includes(region.genre)?'ambient':region.genre==='dub'?'dub':['afro','tribal'].includes(region.genre)?'afro':GENRE_CHARACTERS[region.genre]==='floor'?'minimal':GENRE_CHARACTERS[region.genre]||'warm',
  base=PRODUCTION_IDENTITIES[kind]||PRODUCTION_IDENTITIES.warm,h=seedOf('production:identity:v1:'+region.key+':'+region.genre)>>>0,offset=h%base.leads.length,
  leads=base.leads.slice(offset).concat(base.leads.slice(0,offset));
 return Object.freeze({...base,version:1,leads:Object.freeze(leads),bassI:base.bass[(h>>>5)%base.bass.length],variant:(h>>>10)%16});
}
