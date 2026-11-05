// The Journey, phase 2: in the Journey the screen stays quiet (no counters, no shop, no extra menus); the free
// World shows everything as before. Players who already reached the World keep the free World, and either can switch
// from the menu. Nothing is removed: it is only hidden (see docs/VIAJE.md).
// «Directo mundo abierto» (Jay, 5 Nov 2026, alpha.269, docs/VIAJE.md): no Journey to open the World. A new player and
// a save in the middle of the Journey get the free World at once (`free` and the full view; `freeGiven` says it was
// given, not earned by a Journey, so the radar starts at its weakest level: scanner-model.js). Every save loaded so is
// marked `open`: it has no Journey any more (no chapters, even in the quiet view). Everything a Journey save kept
// (chapters, notes, colours) stays. The format does not change (version 1), so older builds still read it.
// The Journey's code stays for the festival (?festival=1), «?capitulo=» and «?viaje=1» (a load that keeps the Journey,
// for its tests), and automated browsers keep their old start unless «?abierto=1» asks for this one.
export const JOURNEY_VERSION=1;
// Whether this load gives the open World: every load of the game, except the festival, a Journey test («?capitulo=»,
// «?viaje=1»), a preview or laboratory load («?testSeed=», «?lab=1», saves of their own) and automation without
// «?abierto=1».
export function openLoad({search=globalThis.location?.search,automated=false,festival=false}={}){let q;try{q=new URLSearchParams(search||'');}catch(_){q=new URLSearchParams();}
 if(festival||q.get('festival')==='1'||q.has('capitulo')||q.get('viaje')==='1'||q.has('testSeed')||q.get('lab')==='1')return false;return !automated||q.get('abierto')==='1';}
// Automated browsers (the test suite) start new saves in the free World so existing flows keep their controls;
// the Journey is tested on purpose.
export function journeyDefault(s,automated=false){const reached=(s?.pathCrystals?.length||0)>=10||!!s?.lastWorldDay||s?.mode==='world';return reached||automated?'libre':'viaje';}
export function normalizeJourney(raw,s,automated=false,{open=false}={}){const q=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};if(Number.isInteger(q.version)&&q.version>JOURNEY_VERSION)return q;
 // The open World (alpha.269): a Journey not finished is set free, in the full view; a save already free keeps its view.
 if(open){const kept=normalizeJourney(q,s,false);return freeOpen(kept)?{...kept,open:true}:{...kept,mode:'libre',free:true,open:true,freeGiven:true};}// Colours already explored when the Journey first loads are yours; a new player starts with none.
 const colors=q.colors&&typeof q.colors==='object'&&!Array.isArray(q.colors)?q.colors:Object.fromEntries(Object.keys(s?.zones||{}).map(k=>[k,true]));
 const mode=q.mode==='viaje'||q.mode==='libre'?q.mode:journeyDefault(s,automated);
 // The free World opens at the end of the Journey (decision 6A); a save that already reached it keeps it.
 return {...q,version:JOURNEY_VERSION,mode,colors,free:q.free===true||q.finished===true||mode==='libre'};}
// Whether the free World can be chosen from the menu.
export const freeOpen=j=>!!(j&&(j.free===true||j.finished===true));
// A save with no Journey any more (alpha.269): its quiet view is only a view, never a chapter.
export const noJourney=j=>!!(j&&j.open===true);
const automated=()=>{try{return !!globalThis.navigator?.webdriver;}catch(_){return false;}};
export function initialize(runtime){
 const $=runtime.$;let owner=null;
 const open=()=>openLoad({automated:automated(),festival:!!runtime.festival});
 function own(){if(owner!==runtime.S){owner=runtime.S;owner.journey=normalizeJourney(owner.journey,owner,!runtime.festival&&automated(),{open:open()});}return owner.journey;}
 // «Directo mundo abierto» (alpha.269): a player who never entered the World starts in it, not in the Camino, with no
 // window first (as the Journey did): the line under the HUD names the first place. Called once at load (main.js).
 function openStart(){const S=runtime.S;if(!open())return false;own();if(S.mode!=='camino'||S.lastWorldDay||S.ach?.mundo||!runtime.enterWorld)return false;S.help||={};S.help.camino=true;runtime.enterWorld({automatic:true});return runtime.inWorld?.()===true;}
 const quiet=()=>own().mode==='viaje';
 // Panel 11 (Q1): title and subtitle both say the current state, and the subtitle names what the quiet view hides.
 // Menús (alpha.257): «Mostrar todo: sí / no», so it is not confused with «Modo niños»; same modes and saves.
 function apply(){const j=own(),b=$('bJourneyMode');document.body.classList.toggle('journey-quiet',j.mode==='viaje');if(b){b.hidden=!freeOpen(j);const free=j.mode==='libre',label=b.querySelector('span');if(label)label.firstChild.textContent=free?'Mostrar todo: sí':'Mostrar todo: no';b.querySelector('small').textContent=free?'Tu cubo, cifras y herramientas a la vista':'Sin Tu cubo, cifras ni herramientas';b.setAttribute('aria-pressed',String(free));}}
 function set(mode){const j=own();if(j.version>JOURNEY_VERSION||(mode!=='viaje'&&mode!=='libre')||j.mode===mode||(mode==='libre'&&!freeOpen(j)))return false;const before=j.mode,free=j.free,seen=runtime.S.help?.camino;j.mode=mode;if(mode==='libre'){j.free=true;if(runtime.S.help)runtime.S.help.camino=true;}if(runtime.save()===false){j.mode=before;j.free=free;if(runtime.S.help)runtime.S.help.camino=seen;return false;}apply();runtime.hud?.();return true;}
 // Playing without an account: once in the free World, the cloud is offered once, quietly; never during the Journey.
 function offerCloud(){const S=runtime.S;if(S.cloudOffered||runtime.cloudPaused?.()||quiet()||!runtime.accountClient||runtime.accountClient.user?.()||!runtime.inWorld?.())return;S.cloudOffered=true;runtime.save();runtime.toast?.('Guarda tu avance en la nube: Menú → Más → Cuenta.');}
 // The Journey has no words in the World: hints and labels on the World's canvas are not drawn (docs/VIAJE.md).
 function silenceCanvas(){const c=runtime.cx;if(!c||c.__journeyQuiet)return;c.__journeyQuiet=true;for(const k of ['fillText','strokeText']){const draw=c[k];c[k]=function(...a){if(quiet()&&runtime.inWorld?.())return;return draw.apply(this,a);};}}
 silenceCanvas();
 $('bJourneyMode').onclick=()=>{set(quiet()?'libre':'viaje');$('mMenu').hidden=true;};
 apply();
 // A save restored from the cloud or another scope may bring its own mode.
 Object.defineProperties(runtime,{openWorldStart:{get:()=>openStart},openWorldLoad:{get:()=>open},journeyModeTick:{get:()=>()=>{if(owner!==runtime.S){own();apply();}offerCloud();}},journeyMode:{get:()=>()=>own().mode},setJourneyMode:{get:()=>set},journeyQuiet:{get:()=>quiet},applyJourneyMode:{get:()=>apply}});
}
