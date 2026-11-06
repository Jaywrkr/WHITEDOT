export const FIRST_JOURNEY_VERSION=1;
export const FIRST_JOURNEY_STEPS=[
 ['move','Arrastra para acercarte a un cristal.'],
 ['light','Toca a tiempo junto a diez cristales para abrir el Mundo.'],
 ['world','El décimo cristal abre el Mundo automáticamente.'],
 ['voice','Descubre una voz. Acerca tu cubo a un elemento.'],
 ['pulse','Toca al ritmo. Arrastra para moverte.'],
 ['save','Guarda con el marcador junto al nombre.']
];
// Listo 1 (Jay, 6 Nov 2026, alpha.273): a save that starts in the open World (journey-mode.js, `open`) has no Camino, so
// its guide is the way to the first place and its round. Each step is a real event of the game (onboarding.js reads it
// from the save): moving, the portal found, the round started, the round won, a walk after the card, and the next walk.
// While it shows, the line under the HUD (#ringRoute) stays in view with the first place's distance; `explore` names
// the scanner. Same save field and version: the Journey's facts stay where they were, and older builds read the new
// ones as unknown facts they keep.
export const OPEN_WORLD_STEPS=[
 ['move','Arrastra para moverte.'],
 ['find','Camina recto hacia Llanura. Su portal aparece delante.'],
 ['portal','Sigue la flecha hasta el portal.'],
 ['round','Toca a tiempo con la música.'],
 ['result','Ganaste tu primera ★. Cada lugar da tres.'],
 ['explore','Mantén pulsado para escanear. Hay once lugares.']
];
const STEP_IDS=[...new Set([...FIRST_JOURNEY_STEPS,...OPEN_WORLD_STEPS].map(([id])=>id))];
export function normalizeFirstJourney(raw,{experienced=false}={}){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))raw=null;
 if(raw&&Number.isInteger(raw.version)&&raw.version>FIRST_JOURNEY_VERSION)return {...raw,readOnly:true};
 const facts=raw?.facts&&typeof raw.facts==='object'&&!Array.isArray(raw.facts)?{...raw.facts}:{};for(const id of STEP_IDS)facts[id]=raw?.facts?.[id]===true;
 return {...raw,version:1,facts,skipped:raw?.skipped===true||!raw&&experienced};
}
// A guide of the Camino already finished on this save counts as finished in the open World too.
const camino=state=>FIRST_JOURNEY_STEPS.every(([id])=>state.facts[id]===true);
export function firstJourneyNext(state,steps=FIRST_JOURNEY_STEPS){if(state.readOnly||state.skipped)return null;if(steps===OPEN_WORLD_STEPS&&camino(state))return null;return steps.find(([id])=>!state.facts[id])||null;}
export function advanceFirstJourney(state,id,steps=FIRST_JOURNEY_STEPS){if(state.readOnly||state.skipped||!steps.some(([key])=>key===id)||state.facts[id])return false;state.facts[id]=true;
 // In the open World a later event proves the earlier ones (the portal found means you walked).
 if(steps===OPEN_WORLD_STEPS){for(const [key] of steps){if(key===id)break;state.facts[key]=true;}return true;}
 if(id==='light'||id==='world')state.facts.move=true;if(id==='world')state.facts.light=true;return true;}

// A completed campaign replaces the automatic starter lesson; practicing is explicit.
export const lessonAvailable=(journey,practicing=false)=>journey?.finished!==true||practicing;
