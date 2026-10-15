import {CUBE_TRAILS,CUBE_HALOS,CUBE_DEFAULTS,cubeStyleUnlocked,wardrobeByType} from './wardrobe-model.js';
export {CUBE_COLORS,CUBE_TRAILS,CUBE_HALOS} from './wardrobe-model.js';
export function cosmeticUnlocked(item,ach,rewards){return cubeStyleUnlocked(CUBE_TRAILS.includes(item)?'trail':'halo',item.id,ach,rewards);}
export function normalizeCube(raw,ach={},rewards){
 if(raw&&typeof raw==='object'&&!Array.isArray(raw)&&Number.isFinite(raw.version)&&raw.version>2)return raw;
 const result={...(raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{}),version:2},unknown={...(raw?.unrecognizedStyles&&typeof raw.unrecognizedStyles==='object'&&!Array.isArray(raw.unrecognizedStyles)?raw.unrecognizedStyles:{})};
 for(const [type,value]of Object.entries(CUBE_DEFAULTS)){
  const candidate=unknown[type]??raw?.[type];
  result[type]=cubeStyleUnlocked(type,candidate,ach,rewards)?candidate:cubeStyleUnlocked(type,raw?.[type],ach,rewards)?raw[type]:value;
  if(candidate!==undefined&&!wardrobeValue(type,candidate))unknown[type]=candidate;else delete unknown[type];
 }
 if(Object.keys(unknown).length)result.unrecognizedStyles=unknown;else if(result.unrecognizedStyles&&typeof result.unrecognizedStyles==='object'&&!Array.isArray(result.unrecognizedStyles))delete result.unrecognizedStyles;
 return result;
}
const wardrobeValue=(type,value)=>wardrobeByType(type).some(p=>p.value===value);
