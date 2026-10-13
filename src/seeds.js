export function normalizeSeed(value){return String(value??'original').trim().replace(/[^\p{L}\p{N}_ -]/gu,'').slice(0,40)||'original';}
export function previewKey(seed,layout='classic'){return `pixel-blanco-v4:${layout==='wide'?'preview-wide':'preview'}:${encodeURIComponent(normalizeSeed(seed))}`;}
export function initialize(runtime){
 const $=runtime.$;
 function open(){
  $('seedValue').value=runtime.S.previewSeed||'original';$('seedLayout').value=runtime.S.previewLayout||'wide';
  const d=runtime.regionOfPos(runtime.S.wx,runtime.S.wy);
  $('seedInfo').textContent=`${runtime.S.previewSeed?'Prueba: '+runtime.S.previewSeed:'Partida habitual'} · ${runtime.BIOMES[d.z].name} · ${runtime.GEN[d.genre].name} · ${d.bpm} BPM · Biomas de ${runtime.REG*runtime.WCH} unidades`;
  $('mSeeds').hidden=false;
 }
 function visit(value){const url=new URL(location.href);url.searchParams.set('testSeed',normalizeSeed(value));url.searchParams.set('layout',$('seedLayout').value);location.assign(url.href);}
 $('dSeeds').onclick=open;$('seedClose').onclick=()=>$('mSeeds').hidden=true;
 $('seedForm').onsubmit=e=>{e.preventDefault();visit($('seedValue').value);};
 $('seedNext').onclick=()=>visit('mundo-'+Date.now().toString(36));
 $('seedCenter').onclick=()=>visit(runtime.S.previewSeed||'original');
 $('seedOriginal').onclick=()=>{const url=new URL(location.href);url.searchParams.delete('testSeed');url.searchParams.delete('layout');location.assign(url.href);};
 $('seedPresets').onclick=e=>{const button=e.target.closest('[data-seed]');if(button)visit(button.dataset.seed);};
 if(runtime.S.previewSeed){
  const s=runtime.S;s.todayKey=runtime.dayKey();s.todayLight=runtime.CAP;s.capShown=true;s.lampDay=s.todayKey;s.lampUsed=0;s.lastWorldDay=s.todayKey;
  s.layer='superficie';s.wx=s.wy=runtime.REG*runtime.WCH/2;s.help.camino=true;s.help.mundo=true;s.helpV2=true;
  s.ach.mundo??=s.todayKey;s.mode='camino';runtime.enterWorld();runtime.save();
 }
 Object.defineProperties(runtime,{openSeedLab:{get:()=>open}});
}
