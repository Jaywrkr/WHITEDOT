import {createRewardsCatalog,migrateRewards} from './rewards-model.js';
import {normalizeLivingState} from './living-state.js';
import {worldIdentity} from './world-identity.js';
import {createSaveStore,SAVE_VERSION} from './save-store.js';
import {BoundedMap,CACHE_LIMITS} from './cache.js';
import {normalizeSeed,previewKey} from './seeds.js';
// Partida v4, progreso diario y utilidades deterministas.
export function initialize(runtime) {
  /* ---------- estado ---------- */
  const requested=new URLSearchParams(globalThis.location?.search||'').get('testSeed'),preview=requested===null?null:normalizeSeed(requested);
  const layout=preview?(['classic','vasto','grand','immense'].includes(new URLSearchParams(globalThis.location?.search||'').get('layout'))?new URLSearchParams(globalThis.location?.search||'').get('layout'):'wide'):null;
  const generation=preview&&new URLSearchParams(globalThis.location?.search||'').get('generation')==='2'?2:1;
  const KEY=preview?previewKey(preview,layout,generation):'pixel-blanco-v4';
  const identity=worldIdentity(preview&&preview!=='original'?preview:'',layout||'classic',generation),scope={kind:preview?'preview':'main',seed:preview||'',layout:layout||'classic'};
  const fresh=()=>({pathCrystals:[],sparks:0,saveVersion:SAVE_VERSION,worldIdentity:{...identity},offset:0,lastDay:null,streak:0,best:0,totalDays:0,totalLight:0,todayKey:null,todayLight:0,capShown:false,collected:[],trail:[],px:0,py:0,ach:{},sound:true,softMusic:false,style:.3,
    worldSeed:"",previewSeed:null,previewLayout:null,session:null,lastSession:null,favorites:{version:1,items:[]},destination:null,glassSites:{},mirrorSites:{},autoPins:false,patchSites:{},worldDetails:false,mode:"camino",wx:900,wy:900,lampDay:null,lampUsed:0,species:{},rel:null,relicSites:{},stars:[],help:{},zones:{},drums:0,bag:{luz:8},studio:{x:null,y:null,biome:0,slots:{}},color:"#ffffff",lastWorldDay:null,prevMode:null,capPlusDay:null,voiceStart:false,luzN:0,cat:{},catN:0,catRecent:[],places:{},placesN:0,retos:{},retosN:0,events:{},journal:{events:{},relics:{},music:{genres:{},instruments:{},scales:{}}}});
  const storage=(()=>{try{return globalThis.localStorage;}catch(_){return {getItem(){throw Error('Unavailable');},setItem(){throw Error('Unavailable');}};}})();
  const store=createSaveStore(storage,KEY,fresh(),identity);let S=store.load();const scopeHadSave=store.original()!==null;
  const fallbackCatalog=createRewardsCatalog(runtime.ACH),hiddenAchievements=(runtime.ACH||[]).filter(a=>a[3]).map(a=>a[0]);
  const applyScope=state=>{state.rewards=migrateRewards(state,runtime.rewardCatalog||fallbackCatalog,{hiddenAchievements});return Object.assign(normalizeLivingState(state),{previewSeed:preview,previewLayout:layout,worldSeed:identity.seed,worldIdentity:{...identity},saveVersion:SAVE_VERSION});};
  applyScope(S);
  let saveFailure=null;
  const save=()=>{if(runtime.snapshotBoxSurprises)S.boxSurprises=runtime.snapshotBoxSurprises();if(runtime.snapshotPowers)S.boxPowers=runtime.snapshotPowers();const before=new Set(Object.keys(S.rewards?.items||{}));S.rewards=migrateRewards(S,runtime.rewardCatalog||fallbackCatalog,{at:S.todayKey,legacy:false,hiddenAchievements});const saved=store.save(S);if(saved){saveFailure=null;for(const id of Object.keys(S.rewards.items))if(!before.has(id))runtime.rewardEarned?.((runtime.rewardCatalog||fallbackCatalog).find(p=>p.id===id));}
    else if(saveFailure!==store.status.kind){saveFailure=store.status.kind;runtime.toast?.(saveFailure==='conflict'?'Otra pestaña cambió la partida. Guarda una copia antes de recargar.':'No pudimos guardar. Menú → Guardar copia.');}return saved;};

  const pad2=n=>String(n).padStart(2,"0");
  function dayKey(){const d=new Date();d.setDate(d.getDate()+S.offset);return d.getFullYear()+"-"+pad2(d.getMonth()+1)+"-"+pad2(d.getDate());}
  function diffDays(a,b){const p=s=>{const[y,m,d]=s.split("-").map(Number);return Date.UTC(y,m-1,d);};return Math.round((p(b)-p(a))/864e5);}
  const pathY=x=>110*Math.sin(x/300)+55*Math.sin(x/97+1.3)+220*Math.sin(x/1150);
  if(!S.trail.length){S.px=0;S.py=pathY(0);}

  let collected=new Set(S.collected);
  const chunks=new BoundedMap(CACHE_LIMITS.pathChunks), wchunks=new BoundedMap(CACHE_LIMITS.worldChunks), bcache=new BoundedMap(CACHE_LIMITS.biomes);
  function seedOfBase(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
  function seedOf(s){return seedOfBase(S.worldSeed?`world:${S.worldSeed}|${s}`:s);}
  function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  const isFree=()=>S.todayLight>=runtime.CAP;
  // Break ten Camino crystals to open today's world.
  const worldReady=()=>(S.pathCrystals?.length||0)>=10;
  const inWorld=()=>S.mode==="world";
  function shownStreak(){if(!S.lastDay)return 0;const d=diffDays(S.lastDay,S.todayKey);return d<=1?S.streak:0;}
  function displayDay(){return S.lastDay===S.todayKey?S.totalDays:S.totalDays+1;}
  function level(){return Math.floor(S.totalLight/runtime.PER_LEVEL)+1;}
  function pxSize(){return Math.min(6+(level()-1)*1.6,64);}
  function lightR(){return 90+pxSize()*6;}
  function lampMax(){return Math.min(60,10+shownStreak())*60;}
  // Keep the finite legacy API and saved history; exploration no longer expires.
  function lampLeft(){return lampMax();}

  function checkDay(startup=false){
    const k=dayKey();
    if(S.todayKey!==k){S.todayKey=k;S.pathCrystals=[];S.todayLight=0;S.capShown=false;S.collected=[];collected=new Set();chunks.clear();wchunks.clear();
      if(inWorld()&&startup)runtime.exitWorld(false);
      else if(inWorld()){ /* Never interrupt an ongoing musical session at midnight. */ }
      else if(S.mode==="studio")S.prevMode="camino";
      else runtime.setBiome(0);
      document.getElementById("mCap").hidden=true;document.getElementById("mOut").hidden=true;document.getElementById("mHelpW").hidden=true;
      save();}
  }
  function onFirstLight(){
    const k=S.todayKey;
    if(S.lastDay===k) return;
    if(S.lastDay && diffDays(S.lastDay,k)===1) S.streak++;
    else { if(S.lastDay){runtime.unlock("regreso");} S.streak=1; }
    S.lastDay=k; S.totalDays++; S.best=Math.max(S.best,S.streak);
    runtime.unlock("dia1");
    [[3,"r3"],[7,"r7"],[30,"r30"],[100,"r100"],[365,"r365"]].forEach(([n,id])=>{if(S.streak>=n)runtime.unlock(id);});
    [[10,"t10"],[30,"t30"],[100,"t100"]].forEach(([n,id])=>{if(S.totalDays>=n)runtime.unlock(id);});
    runtime.showPhrase(S.streak>1?"Racha de "+S.streak+". Sigue.":runtime.PHRASES[0]);
  }


  Object.defineProperties(runtime, {
    realTravel:{get:()=>new URLSearchParams(globalThis.location?.search||'').get('travel')==='1'},scopeHadSave:{get:()=>scopeHadSave},worldIdentity:{get:()=>identity},saveScope:{get:()=>scope},saveStore:{get:()=>store},storageStatus:{get:()=>store.status},
    fresh: { get: () => fresh },
    S: { get: () => S, set: value => { S = applyScope(value); } },
    save: { get: () => save },
    pad2: { get: () => pad2 },
    pathY: { get: () => pathY },
    collected: { get: () => collected, set: value => { collected = value; } },
    chunks: { get: () => chunks },
    wchunks: { get: () => wchunks },
    bcache: { get: () => bcache },
    seedOfBase: {get:()=>seedOfBase},
    dayKey: {get:()=>dayKey},
    seedOf: { get: () => seedOf },
    rng: { get: () => rng },
    clamp: { get: () => clamp },
    isFree: { get: () => isFree },
    worldReady: { get: () => worldReady },
    inWorld: { get: () => inWorld },
    shownStreak: { get: () => shownStreak },
    displayDay: { get: () => displayDay },
    level: { get: () => level },
    pxSize: { get: () => pxSize },
    lightR: { get: () => lightR },
    lampMax: { get: () => lampMax },
    lampLeft: { get: () => lampLeft },
    checkDay: { get: () => checkDay },
    onFirstLight: { get: () => onFirstLight },
  });
}
