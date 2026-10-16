export const FIRST_JOURNEY_VERSION=1;
export const FIRST_JOURNEY_STEPS=[
 ['move','Arrastra para acercarte a una luz.'],
 ['light','Recoge una luz. Abre el Mundo de hoy.'],
 ['world','Entra al Mundo con el botón de abajo.'],
 ['voice','Descubre una voz. Acerca tu cubo a un elemento.'],
 ['pulse','Toca un espacio vacío para lanzar un pulso.'],
 ['save','Guarda este lugar: toca el marcador junto a su nombre.']
];
export function normalizeFirstJourney(raw,{experienced=false}={}){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))raw=null;
 if(raw&&Number.isInteger(raw.version)&&raw.version>FIRST_JOURNEY_VERSION)return {...raw,readOnly:true};
 const facts=raw?.facts&&typeof raw.facts==='object'&&!Array.isArray(raw.facts)?{...raw.facts}:{};for(const [id]of FIRST_JOURNEY_STEPS)facts[id]=raw?.facts?.[id]===true;
 return {...raw,version:1,facts,skipped:raw?.skipped===true||!raw&&experienced};
}
export function firstJourneyNext(state){if(state.readOnly||state.skipped)return null;return FIRST_JOURNEY_STEPS.find(([id])=>!state.facts[id])||null;}
export function advanceFirstJourney(state,id){if(state.readOnly||state.skipped||!FIRST_JOURNEY_STEPS.some(([key])=>key===id)||state.facts[id])return false;state.facts[id]=true;if(id==='light'||id==='world')state.facts.move=true;if(id==='world')state.facts.light=true;return true;}
