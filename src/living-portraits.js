import {livingDefinition} from './living-catalog.js';
import {anatomyOf,normalizeAnatomy,anatomyPath} from './anatomy.js';
// Cards use the specimen descriptor when available; old cards retain a deterministic fallback.
export function livingPortrait(type,appearance=null,variant=0){
 const kind=type.slice(7),definition=livingDefinition(kind)||{shape:'blob',group:'fauna',role:'acorde'};
 const a=normalizeAnatomy(appearance)||anatomyOf({...definition,kind,id:type+':'+variant,variant});
 return anatomyPath(a).replace(/-?\d*\.?\d+/g,n=>String(Number((Number(n)*28).toFixed(3))));
}
