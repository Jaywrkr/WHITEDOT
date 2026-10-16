import {nativeVisualFamily} from './native-visual.js';
import {ecosystemAt} from './ecosystem-field.js';
const styles={pixel:'pixelada',membrane:'de membranas',filament:'de filamentos',facets:'de cristal',anatomy:'de raíces'},niches={clearing:'Claro',corridor:'Corredor',colony:'Colonia',refuge:'Refugio'};
export function explorationContext(region,x,y,seedOf){const style=nativeVisualFamily(region,seedOf),place=ecosystemAt(region.worldFamily,x,y,seedOf);return {style,niche:place.niche,label:(niches[place.niche]||'Territorio')+' '+styles[style],signature:style+':'+(region.worldFamily?.id||'native')+':'+place.niche};}
export function explorationContrast(current,candidate,seen=[]){return (candidate.style!==current.style?7:0)+(candidate.niche!==current.niche?2:0)+(seen.some(s=>s.startsWith(candidate.style+':'))?-7:9);}
