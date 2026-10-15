import {cardAbility} from './rare-card-model.js';
export const ATLAS_ROLES=['bajo','perc','acorde','lead'];
export const ATLAS_LABELS={bajo:'cuerpo',perc:'pulso',acorde:'aire',lead:'frase'};
export function normalizeAtlas(raw){
 if(Number.isInteger(raw?.version)&&raw.version>1)return {...raw,readOnly:true,completed:Array.isArray(raw.completed)?raw.completed:[]};
 const active=raw?.active&&typeof raw.active.cardId==='string'&&ATLAS_ROLES.includes(raw.active.role)?{...raw.active}:null;
 return {...raw,version:1,active,completed:Array.isArray(raw?.completed)?raw.completed.filter(c=>c&&typeof c.id==='string'):[]};
}
export function startAtlas(atlas,card){
 if(atlas.readOnly||atlas.completed.length>=64||!card?.id)return false;
 const role=cardAbility(card).role,index=ATLAS_ROLES.indexOf(role);
 atlas.active={cardId:card.id,fromSource:card.sourceId,fromName:card.name,role:ATLAS_ROLES[(Math.max(0,index)+1)%4],layer:card.address?.layer||'superficie'};return true;
}
export function resolveAtlas(atlas,source,role,layer){
 const a=atlas.active;if(atlas.readOnly||!a||role!==a.role||!source?.id||source.id===a.fromSource||layer!==a.layer)return null;
 const id=JSON.stringify([a.cardId,source.id]),record={id,from:a.cardId,to:source.id,fromName:a.fromName,toName:source.name||source.kind,role,x:source.x,y:source.y,layer};
 if(!atlas.completed.some(c=>c.id===id))atlas.completed.push(record);atlas.active=null;return record;
}
