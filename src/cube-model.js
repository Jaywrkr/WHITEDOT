import {CUBE_TRAILS,CUBE_HALOS,CUBE_DEFAULTS,cubeStyleUnlocked} from './wardrobe-model.js';
export {CUBE_COLORS,CUBE_TRAILS,CUBE_HALOS} from './wardrobe-model.js';
export function cosmeticUnlocked(item,ach,rewards){return cubeStyleUnlocked(CUBE_TRAILS.includes(item)?'trail':'halo',item.id,ach,rewards);}
export function normalizeCube(raw,ach={},rewards){const result={version:2};for(const [type,value]of Object.entries(CUBE_DEFAULTS))result[type]=cubeStyleUnlocked(type,raw?.[type],ach,rewards)?raw[type]:value;return result;}
