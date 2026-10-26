import {openSurface} from './frame-state.js';
import {mapData} from './map.js';
import {normalizeProfile,createProfileTracker,profileSummary,formatPlayTime,formatDistance} from './player-profile-model.js';
export function initialize(runtime){
 const $=runtime.$,tracker=createProfileTracker();let owner=null,refresh=0,walked=0;
 function ensure(){if(owner!==runtime.S){owner=runtime.S;owner.playerProfile=normalizeProfile(owner.playerProfile);tracker.reset();walked=0;}return owner.playerProfile;}
 function render(){const p=ensure(),sum=profileSummary(runtime.S),future=p.version!==1;const values={profileTime:formatPlayTime(p.activeSeconds),profileDistance:formatDistance(p.distanceUnits),profileSessions:String(p.sessions||0),profileWorldTime:formatPlayTime(p.worldSeconds),profileCaminoTime:formatPlayTime(p.caminoSeconds),profileHouseTime:formatPlayTime(p.houseSeconds),profileDays:String(sum.days),profilePlaces:String(sum.places),profileGenres:sum.genres+' / '+Object.keys(runtime.GEN).length,profileInstruments:String(sum.instruments),profileElements:String(sum.elements),profileCards:String(runtime.rareCards?.length??sum.cards),profileBoxes:String(sum.boxes),profileAchievements:String(sum.achievements)};
  for(const [id,value]of Object.entries(values))$(id).textContent=future?'—':value;
  // Panel 10 (P8, D3-A): regions, continents and record moved here from the map.
  try{const m=mapData(runtime);$('mRegions').textContent=m.cells.length;$('mConts').textContent=m.continents;$('mRecord').textContent=m.record;}catch(_){}
  $('profileSince').textContent=future?'Actualiza para ver este perfil.':'Tiempo y distancia medidos desde '+new Date(p.since).toLocaleDateString('es-EC');
  $('profileName').value=p.name||'';$('profileName').disabled=future;$('profileNameSave').disabled=future;$('profileSaveStatus').textContent='';$('profileAvatar').style.setProperty('--profile-ink',runtime.cubeColor?.()||'#fff');
 }
 function open(){$('mMenu').hidden=true;runtime.openJournal?.('you');render();}
 function tick(dt,paused=false){const p=ensure();tracker.tick(p,runtime.S,{dt,active:!paused&&!document.hidden&&!runtime.scanning&&!openSurface('.modal:not([hidden])'),maxSpeed:runtime.SPEED||800,worldKey:JSON.stringify(runtime.worldIdentity||{}),walkedUnits:walked});walked=0;const label='Caminado · '+(p.version===1?formatDistance(p.distanceUnits):'—');if($('walkDistance').textContent!==label)$('walkDistance').textContent=label;refresh+=Math.min(1,Math.max(0,dt||0));if(!$('mJournal').hidden&&$('journalYouPart')?.closest('#journalBody')&&refresh>1){refresh=0;for(const [id,value]of [['profileTime',formatPlayTime(p.activeSeconds)],['profileDistance',formatDistance(p.distanceUnits)]])$(id).textContent=p.version===1?value:'—';}}
 $('profileClose').onclick=()=>{$('mJournal').hidden=true;runtime.save();};
 $('profileNameSave').onclick=()=>{const p=ensure();if(p.version!==1)return;const before=p.name;p.name=$('profileName').value.trim().slice(0,24);if(!runtime.save()){p.name=before;$('profileSaveStatus').textContent='No se guardó. Intenta otra vez.';}else{$('profileName').value=p.name;$('profileSaveStatus').textContent='Nombre guardado en este dispositivo.';}};
 $('profileCollection').onclick=()=>{runtime.openJournal('collection');};$('profilePlacesLink').onclick=()=>{runtime.openFavorites();};
 Object.defineProperties(runtime,{recordWalk:{get:()=>distance=>{ensure();if(Number.isFinite(distance)&&distance>0)walked+=distance;}},profileTick:{get:()=>tick},openProfile:{get:()=>open},renderProfile:{get:()=>render},playerProfile:{get:()=>ensure()}});ensure();
}
