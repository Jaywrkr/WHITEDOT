export const FIRST_JOURNEY_VERSION=1;
export const FIRST_JOURNEY_STEPS=[
 ['move','Arrastra para acercarte a un cristal.'],
 ['light','Toca a tiempo junto a diez cristales para abrir el Mundo.'],
 ['world','El décimo cristal abre el Mundo automáticamente.'],
 ['voice','Descubre una voz. Acerca tu cubo a un elemento.'],
 ['pulse','Toca un espacio vacío para lanzar un pulso.'],
 ['save','Guarda con el marcador junto al nombre.']
];
export function normalizeFirstJourney(raw,{experienced=false}={}){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))raw=null;
 if(raw&&Number.isInteger(raw.version)&&raw.version>FIRST_JOURNEY_VERSION)return {...raw,readOnly:true};
 const facts=raw?.facts&&typeof raw.facts==='object'&&!Array.isArray(raw.facts)?{...raw.facts}:{};for(const [id]of FIRST_JOURNEY_STEPS)facts[id]=raw?.facts?.[id]===true;
 return {...raw,version:1,facts,skipped:raw?.skipped===true||!raw&&experienced};
}
export function firstJourneyNext(state){if(state.readOnly||state.skipped)return null;return FIRST_JOURNEY_STEPS.find(([id])=>!state.facts[id])||null;}
export function advanceFirstJourney(state,id){if(state.readOnly||state.skipped||!FIRST_JOURNEY_STEPS.some(([key])=>key===id)||state.facts[id])return false;state.facts[id]=true;if(id==='light'||id==='world')state.facts.move=true;if(id==='world')state.facts.light=true;return true;}

// A completed campaign replaces the automatic starter lesson; practicing is explicit.
export const lessonAvailable=(journey,practicing=false)=>journey?.finished!==true||practicing;
