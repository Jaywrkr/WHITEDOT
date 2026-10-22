// The Journey, phase 2: in the Journey the screen stays quiet (no counters, no shop, no extra menus); the free
// World shows everything as before. New players start in the Journey; players who already reached the World keep
// the free World, and either can switch from the menu. Nothing is removed: it is only hidden (see docs/VIAJE.md).
export const JOURNEY_VERSION=1;
// Automated browsers (the test suite) start new saves in the free World so existing flows keep their controls;
// the Journey is tested on purpose.
export function journeyDefault(s,automated=false){const reached=(s?.pathCrystals?.length||0)>=10||!!s?.lastWorldDay||s?.mode==='world';return reached||automated?'libre':'viaje';}
export function normalizeJourney(raw,s,automated=false){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};if(Number.isInteger(q.version)&&q.version>JOURNEY_VERSION)return q;// Colours already explored when the Journey first loads are yours; a new player starts with none.
 const colors=q.colors&&typeof q.colors==='object'&&!Array.isArray(q.colors)?q.colors:Object.fromEntries(Object.keys(s?.zones||{}).map(k=>[k,true]));
 return {...q,version:JOURNEY_VERSION,mode:q.mode==='viaje'||q.mode==='libre'?q.mode:journeyDefault(s,automated),colors};}
const automated=()=>{try{return !!globalThis.navigator?.webdriver;}catch(_){return false;}};
export function initialize(runtime){
 const $=runtime.$;let owner=null;
 function own(){if(owner!==runtime.S){owner=runtime.S;owner.journey=normalizeJourney(owner.journey,owner,!runtime.festival&&automated());}return owner.journey;}
 const quiet=()=>own().mode==='viaje';
 function apply(){const j=own(),b=$('bJourneyMode');document.body.classList.toggle('journey-quiet',j.mode==='viaje');if(b){const free=j.mode==='libre',label=b.querySelector('span');if(label)label.firstChild.textContent=free?'Viaje':'Mundo libre';b.querySelector('small').textContent=free?'Pantalla tranquila':'Todo a la vista';b.setAttribute('aria-pressed',String(free));}}
 function set(mode){const j=own();if(j.version>JOURNEY_VERSION||(mode!=='viaje'&&mode!=='libre')||j.mode===mode)return false;const before=j.mode,seen=runtime.S.help?.camino;j.mode=mode;if(mode==='libre'&&runtime.S.help)runtime.S.help.camino=true;if(runtime.save()===false){j.mode=before;if(runtime.S.help)runtime.S.help.camino=seen;return false;}apply();runtime.hud?.();return true;}
 // Playing without an account: once in the World, the cloud is offered once, quietly.
 function offerCloud(){const S=runtime.S;if(S.cloudOffered||!runtime.accountClient||runtime.accountClient.user?.()||!runtime.inWorld?.())return;S.cloudOffered=true;runtime.save();runtime.toast?.('Guarda tu avance en la nube: Menú → Cuenta.');}
 $('bJourneyMode').onclick=()=>{set(quiet()?'libre':'viaje');$('mMenu').hidden=true;};
 apply();
 // A save restored from the cloud or another scope may bring its own mode.
 Object.defineProperties(runtime,{journeyModeTick:{get:()=>()=>{if(owner!==runtime.S){own();apply();}offerCloud();}},journeyMode:{get:()=>()=>own().mode},setJourneyMode:{get:()=>set},journeyQuiet:{get:()=>quiet},applyJourneyMode:{get:()=>apply}});
}
