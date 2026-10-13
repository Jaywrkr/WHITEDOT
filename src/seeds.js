import {createSoundTrail} from './sound-trail-model.js';
import {FAMILIES} from './encounter-families.js';
export function normalizeSeed(value){return String(value??'original').trim().replace(/[^\p{L}\p{N}_ -]/gu,'').slice(0,40)||'original';}
export function previewKey(seed,layout='classic'){return `pixel-blanco-v4:${layout==='wide'?'preview-wide':'preview'}:${encodeURIComponent(normalizeSeed(seed))}`;}
export function initialize(runtime){
 const $=runtime.$;
 const select=document.createElement('select');select.id='seedEncounter';select.setAttribute('aria-label','Encuentro para probar');
 const label=document.createElement('label');label.textContent='Encuentro de prueba';label.htmlFor=select.id;
 select.add(new Option('Distribución natural',''));select.add(new Option('Instalaciones conectadas · jardín modular','installation'));select.add(new Option('Rastro musical · instrumento dormido','trail'));for(const [id,f]of Object.entries(FAMILIES))select.add(new Option(f.name,id));
 const submit=$('seedForm').querySelector('button[type="submit"]');$('seedForm').insertBefore(label,submit);$('seedForm').insertBefore(select,submit);

 function open(){
  select.value=new URLSearchParams(location.search).get('encounter')||'';$('seedValue').value=runtime.S.previewSeed||'original';$('seedLayout').value=runtime.S.previewLayout||'wide';
  const d=runtime.regionOfPos(runtime.S.wx,runtime.S.wy);
  $('seedInfo').textContent=`${runtime.S.previewSeed?'Prueba: '+runtime.S.previewSeed:'Partida habitual'} · ${runtime.BIOMES[d.z].name} · ${runtime.GEN[d.genre].name} · ${d.bpm} BPM · Biomas de ${runtime.REG*runtime.WCH} unidades`;
  $('mSeeds').hidden=false;
 }
 function visit(value){const url=new URL(location.href);url.searchParams.set('testSeed',normalizeSeed(value));url.searchParams.set('layout',$('seedLayout').value);if(select.value)url.searchParams.set('encounter',select.value);else url.searchParams.delete('encounter');location.assign(url.href);}
 $('dSeeds').onclick=open;$('seedClose').onclick=()=>$('mSeeds').hidden=true;
 $('seedForm').onsubmit=e=>{e.preventDefault();visit($('seedValue').value);};
 $('seedNext').onclick=()=>visit('mundo-'+Date.now().toString(36));
 $('seedCenter').onclick=()=>visit(runtime.S.previewSeed||'original');
 $('seedOriginal').onclick=()=>{const url=new URL(location.href);url.searchParams.delete('testSeed');url.searchParams.delete('layout');url.searchParams.delete('encounter');location.assign(url.href);};
 $('seedPresets').onclick=e=>{const button=e.target.closest('[data-seed]');if(button)visit(button.dataset.seed);};
 if(runtime.S.previewSeed){
  const s=runtime.S;s.todayKey=runtime.dayKey();s.todayLight=runtime.CAP;s.capShown=true;s.lampDay=s.todayKey;s.lampUsed=0;s.lastWorldDay=s.todayKey;
  s.layer='superficie';s.wx=s.wy=runtime.REG*runtime.WCH/2;if(select.value==='installation'||new URLSearchParams(location.search).get('encounter')==='installation'){s.wx=2050;s.wy=900;}if(new URLSearchParams(location.search).get('encounter')==='trail'){const size=runtime.REG*runtime.WCH,t=createSoundTrail(runtime.regionOfPos(size/2,size/2),size,runtime.seedOf,runtime.rng,true);if(t){const node=t.nodes[Math.min(2,s.soundTrails?.[t.id]?.stage||0)];s.wx=node.x;s.wy=node.y;}}s.help.camino=true;s.help.mundo=true;s.helpV2=true;
  s.ach.mundo??=s.todayKey;s.mode='camino';runtime.enterWorld();runtime.save();
 }
 Object.defineProperties(runtime,{openSeedLab:{get:()=>open}});
}
