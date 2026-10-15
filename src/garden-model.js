import {cardAbility,cardSerial} from './rare-card-model.js';
export function normalizeGarden(raw){
 if(Number.isInteger(raw?.version)&&raw.version>1)return {...raw,readOnly:true,cards:Array.isArray(raw.cards)?raw.cards:[],positions:raw.positions||{},sets:Array.isArray(raw.sets)?raw.sets:[]};
 return {...raw,version:1,cards:[...new Set((Array.isArray(raw?.cards)?raw.cards:[]).filter(id=>typeof id==='string'))],positions:raw?.positions&&typeof raw.positions==='object'?{...raw.positions}:{},sets:Array.isArray(raw?.sets)?raw.sets:[]};
}
export function addGardenCard(garden,card){if(garden.readOnly||!card?.id||garden.cards.includes(card.id)||garden.cards.length>=4)return false;garden.cards.push(card.id);return true;}
export function gardenScore(card,index,position={}){
 const a=cardAbility(card),role=['bajo','perc','acorde','lead'].includes(a.role)?a.role:'lead',seed=parseInt(cardSerial(card.id),16),p=position||{};
 return {kind:'garden:'+card.id,cardId:card.id,room:['sala','jardin','azotea','sotano'].includes(p.room)?p.room:'sala',x:Number.isFinite(p.x)?Math.max(.05,Math.min(.95,p.x)):.22+(index%2)*.56,y:Number.isFinite(p.y)?Math.max(.1,Math.min(.9,p.y)):.3+Math.floor(index/2)*.4,role,seed,step:[0,6,10,14][index%4]};
}
export function saveGardenSet(garden){if(garden.readOnly||!garden.cards.length||garden.sets.length>=8)return false;garden.sets.push({name:'Jardín '+(garden.sets.length+1),cards:[...garden.cards],positions:structuredClone(garden.positions)});return true;}

export function gardenBirth(garden,cards){return !garden.readOnly&&garden.sets.length>0&&cards.length>=3&&new Set(cards.map(c=>gardenScore(c,0).role)).size>=3;}
