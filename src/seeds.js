import {decodePlace,encodePlace} from './share-tools.js';
import {sameWorld,supportedWorld} from './world-identity.js';
import {FAMILIES} from './encounter-families.js';
export function normalizeSeed(value){return String(value??'original').trim().replace(/[^\p{L}\p{N}_ -]/gu,'').slice(0,40)||'original';}
export function previewKey(seed,layout='classic',generation=1){return `pixel-blanco-v4:${layout==='immense'?'preview-immense':layout==='grand'?'preview-grand':layout==='vasto'?'preview-vasto':layout==='wide'?'preview-wide':'preview'}:${generation===2?'v2:':''}${encodeURIComponent(normalizeSeed(seed))}`;}
export function initialize(runtime){
 const $=runtime.$;
 const select=document.createElement('select');select.id='seedEncounter';select.setAttribute('aria-label','Encuentro para probar');
 const label=document.createElement('label');label.textContent='Encuentro de prueba';label.htmlFor=select.id;
 select.add(new Option('Distribución natural',''));select.add(new Option('Vidrios · movimiento y música','glass'));select.add(new Option('Materia · cuerdas, prisma y membrana','materia'));for(const [id,f]of Object.entries(FAMILIES))select.add(new Option(f.name,id));
 const submit=$('seedForm').querySelector('button[type="submit"]');$('seedForm').insertBefore(label,submit);$('seedForm').insertBefore(select,submit);

 function open(){
  select.value=new URLSearchParams(location.search).get('encounter')||'';$('seedValue').value=runtime.S.previewSeed||'original';$('seedLayout').value=runtime.S.previewLayout||'wide';$('seedGeneration').value=runtime.S.previewSeed?String(runtime.worldIdentity.generatorVersion):'2';
  const d=runtime.regionOfPos(runtime.S.wx,runtime.S.wy);
  $('seedInfo').textContent=`${runtime.S.previewSeed?'Prueba: '+runtime.S.previewSeed:'Partida habitual'} · ${d.ecology?.name||runtime.BIOMES[d.z].name} · ${runtime.GEN[d.genre].name} · ${d.bpm} BPM · Biomas de ${runtime.REG*runtime.WCH} unidades`;
  $('mSeeds').hidden=false;
 }
 function saveBeforeLeaving(){runtime.S.collected=[...runtime.collected];if(runtime.save())return true;runtime.toast('No se pudo guardar. Menú → Guardar copia antes de cambiar.');return false;}
 function visit(value){if(!saveBeforeLeaving())return;const url=new URL(location.href);url.searchParams.set('testSeed',normalizeSeed(value));url.searchParams.set('layout',$('seedLayout').value);url.searchParams.set('generation',$('seedGeneration').value);if(select.value)url.searchParams.set('encounter',select.value);else url.searchParams.delete('encounter');location.assign(url.href);}
 $('dSeeds').onclick=open;$('seedClose').onclick=()=>$('mSeeds').hidden=true;
 $('bWorlds').onclick=()=>{open();$('seedGeneration').value='2';};
 $('seedForm').onsubmit=e=>{e.preventDefault();visit($('seedValue').value);};
 $('seedNext').onclick=()=>{$('seedLayout').value='vasto';visit('mundo-'+Date.now().toString(36));};
 $('seedCenter').onclick=()=>visit(runtime.S.previewSeed||'original');
 $('seedOriginal').onclick=()=>{if(!saveBeforeLeaving())return;const url=new URL(location.href);for(const key of ['testSeed','layout','encounter','generation','lab','addr'])url.searchParams.delete(key);location.assign(url.href);};
 $('seedPresets').onclick=e=>{const button=e.target.closest('[data-seed]');if(button)visit(button.dataset.seed);};
 if(runtime.S.previewSeed){
  const s=runtime.S;s.todayKey=runtime.dayKey();s.todayLight=runtime.CAP;s.capShown=true;s.lampDay=s.todayKey;s.lampUsed=0;s.lastWorldDay=s.todayKey;
  s.layer='superficie';s.wx=s.wy=runtime.REG*runtime.WCH/2;if(select.value==='installation'||new URLSearchParams(location.search).get('encounter')==='installation'){s.wx=2050;s.wy=900;}if(new URLSearchParams(location.search).get('encounter')==='glass'){s.wx=1080;s.wy=900;}if(select.value==='materia'||new URLSearchParams(location.search).get('encounter')==='materia'){s.wx=1800;s.wy=2450;}s.help.camino=true;s.help.mundo=true;s.helpV2=true;
  s.ach.mundo??=s.todayKey;s.mode='camino';runtime.enterWorld();runtime.save();
 }
 function visitAddress(address){if(!supportedWorld(address)||address.seed&&normalizeSeed(address.seed)!==address.seed)return false;if(!saveBeforeLeaving())return false;const url=new URL(location.href);for(const key of ['lab','encounter'])url.searchParams.delete(key);if(!address.seed&&address.layout==='classic'&&address.generatorVersion===1)url.searchParams.delete('testSeed');else url.searchParams.set('testSeed',address.seed||'original');url.searchParams.set('layout',address.layout);url.searchParams.set('generation',String(address.generatorVersion));url.searchParams.set('addr',encodePlace(address));location.assign(url.href);return true;}
 const code=new URLSearchParams(location.search).get('addr');if(code)try{const {address}=decodePlace(code);if(sameWorld(address,runtime.worldIdentity)){runtime.S.wx=address.x;runtime.S.wy=address.y;runtime.S.layer=address.layer;runtime.ptr=null;runtime.save();}else runtime.toast('El código necesita su semilla y versión originales.');}catch(_){runtime.toast('No se pudo abrir el código de regreso.');}
 Object.defineProperties(runtime,{openSeedLab:{get:()=>open},visitWorldAddress:{get:()=>visitAddress}});
}
