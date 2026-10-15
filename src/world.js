import {foundationContent} from './content-contracts.js';
import {ECOLOGY_CONTENT,homeEcologyBiome,chooseEcologyBiome,applyEcology,ecologyRecipe,createEcologyObjects} from './ecology-model.js';
import {BoundedMap,CACHE_LIMITS} from './cache.js';
import {createElementCatalog,createRegionalRecipe} from './catalog.js';
import {applyNeighborhood} from './neighborhoods.js';
import {applyPalette} from './palettes.js';
import { createPockets, distributePlaythings } from './pockets.js';

import { attachPersonalities } from './personality.js';

import { createPlaythings } from './playthings.js';
import { createContinents, strangeness } from './continents.js';
import { anomalyAt, applyAnomaly } from './wonders.js';
import {createWorldFamily} from './world-families.js';

// Generación procedural del camino, regiones y reliquias.
export function initialize(runtime) {
  const expanded=runtime.worldIdentity.generatorVersion===2,elementCatalog=createElementCatalog(),contentDirectory=foundationContent(runtime.BIOMES);
  if(expanded)ECOLOGY_CONTENT.forEach(contentDirectory.register);
  const recipeFor=region=>{const biome=runtime.BIOMES[region.z].id,base=createRegionalRecipe(region,biome,runtime.seedOf,runtime.rng,elementCatalog);return expanded&&region.ecology?ecologyRecipe(base,region,contentDirectory,biome,runtime.seedOf,runtime.rng):base;};
  const continents=createContinents(runtime.seedOf,runtime.rng,runtime.GEN,{variant:!!runtime.S.worldSeed}),VACIO=runtime.BIOMES.findIndex(b=>b.id==='vacio');
  const regionPx=()=>runtime.REG*runtime.WCH;
  const fillOf=vit=>{const m=continents.densityOf(vit),L=runtime.FILL;return [m,(m<.3?L[0]:m<.7?L[1]:m<1.4?L[2]:m<2.1?L[3]:L[4])[1]];};
  /* ---------- camino ---------- */
  function getChunk(cx,cy){
    const id=cx+","+cy; let c=runtime.chunks.get(id); if(c) return c;
    const r=runtime.rng(runtime.seedOfBase(id+"|"+runtime.S.todayKey)); c=[];
    for(let i=0;i<16;i++){
      const x=cx*runtime.CHUNK+r()*runtime.CHUNK, y=cy*runtime.CHUNK+r()*runtime.CHUNK, d=Math.abs(y-runtime.pathY(x));
      const on=d<46, off=!on && r()<0.035;
      if((on&&r()<0.85)||off){const mid=id+","+i; if(!runtime.collected.has(mid)) c.push({x,y,id:mid,off,ph:r()*6.28});}
    }
    runtime.chunks.set(id,c); return c;
  }

  /* ---------- mundo: regiones de zonas (semilla fija, igual para todos) ---------- */
  function biomeAt(cx,cy){
    const rx=Math.floor(cx/runtime.REG),ry=Math.floor(cy/runtime.REG),d=Math.max(Math.abs(rx),Math.abs(ry))*2;
    if(d===0){if(!runtime.S.worldSeed)return 0;const home=expanded&&homeEcologyBiome(runtime.S.worldSeed);if(home)return runtime.BIOMES.findIndex(b=>b.id===home);const candidates=runtime.BIOMES.map((b,i)=>i).filter(i=>runtime.BIOMES[i].id!=='vacio');return candidates[runtime.seedOf('seed-home-biome')%candidates.length];}
    const key=rx+","+ry;if(runtime.bcache.has(key))return runtime.bcache.get(key);
    if(continents.at(rx,ry).sea){runtime.bcache.set(key,VACIO);return VACIO;}   // mar de silencio
    const r=runtime.rng(runtime.seedOf("zona:"+key));r();
    const el=runtime.BIOMES.map((b,i)=>[i,b]).filter(([,b])=>b.minD<=d);
    if(expanded){const res=chooseEcologyBiome(rx,ry,el,runtime.seedOf,runtime.rng);runtime.bcache.set(key,res);return res;}
    let x=r()*el.reduce((s,[,b])=>s+b.w,0),res=0;for(const[i,b]of el){x-=b.w;if(x<=0){res=i;break;}}
    runtime.bcache.set(key,res);return res;
  }
  // ADN musical por región: cada lugar del mapa es único y es igual para todos
  const MODES=[[0,2,3,5,7,8,10],[0,2,3,5,7,9,10],[0,1,3,5,7,8,10],[0,2,4,6,7,9,11],[0,2,4,5,7,9,10],[0,2,4,5,7,9,11],[0,2,3,5,7,8,11],[0,1,4,5,7,8,10]];
  const TRAITS=["de niebla","de cristal","de eco","de ceniza","de sal","de humo","del norte","del sur","de vidrio","de arena","de hierro","de agua","de seda","de polvo","de luz baja","de medianoche","de cobre","de lluvia","de ámbar","de hielo"];
  const SYL=["ka","lu","mi","sor","vel","tan","ri","zo","ne","dra","om","is","ur","fe","lia","qua","bel","no","ash","ti","mar","en","yo","sil","ro","ve","xu","len","ai","dun"];
  const ROLES=["campana","bajo","perc","lead","acorde","voz"],MOBS=["orbita","salta","timida","deriva"];
  const rcache=new BoundedMap(CACHE_LIMITS.regions);
  function pname(r){const n=2+(r()<.4?1:0);let w="",prev=-1;for(let i=0;i<n;i++){let j=Math.floor(r()*SYL.length);if(j===prev)j=(j+7)%SYL.length;prev=j;w+=SYL[j];}return w.charAt(0).toUpperCase()+w.slice(1);}
  function euclid(k,n,rot){const p=[];for(let i=0;i<n;i++)p.push(((i+rot)*k)%n<k?1:0);return p;}
  function regionAt(cx,cy){
    const rx=Math.floor(cx/runtime.REG),ry=Math.floor(cy/runtime.REG),key=rx+","+ry;let d=rcache.get(key);if(d)return d;
    const z=biomeAt(cx,cy),B=runtime.BIOMES[z],r=runtime.rng(runtime.seedOf("adn:"+key)),origin=rx===0&&ry===0&&!runtime.S.worldSeed;
    const ct=continents.at(rx,ry),cont=ct.continent,rawHue=Math.floor(r()*360);
    // El color del lugar se acerca al del continente: identidad visual a gran escala.
    const hue=cont&&!ct.sea?Math.round((cont.hue+(rawHue-180)*.22+360)%360):rawHue,name=origin?"Origen":pname(r),trait=TRAITS[Math.floor(r()*TRAITS.length)];
    d={key,z,name,trait,hue,scale:origin||r()<.5?B.scale:MODES[Math.floor(r()*MODES.length)],bpmOff:origin?0:Math.round((r()-.5)*16),trOff:origin?0:Math.floor(r()*7)-3,
      pat:euclid(3+Math.floor(r()*5),16,Math.floor(r()*16)),ptype:r()<.5?"tom":"noise",pf:60+r()*120,species:[]};
    const ns=origin?2:2+Math.floor(r()*3);
    for(let i=0;i<ns;i++){let bits=0,guard=0;const pc=v=>{let c=0;while(v){c+=v&1;v>>=1;}return c;};do{bits=Math.floor(r()*32768);}while(pc(bits)<5&&++guard<20);
      d.species.push({id:key+":"+i,name:pname(r),region:name,bits,mob:r()<.4?MOBS[Math.floor(r()*4)]:null,spd:.5+r(),role:ROLES[Math.floor(r()*6)],tim:Math.floor(r()*6),deg:Math.floor(r()*4),f:55+r()*110,
        motif:Array.from({length:3+Math.floor(r()*2)},()=>Math.floor(r()*12)),cell:1.6+r()*1.2,col:`hsl(${(hue+i*20-20+360)%360},70%,${62+Math.floor(r()*14)}%)`});}
    const RT=["cantar","pulsos","tiempo","quieto","compas","pulsoGrande"],rt=RT[Math.floor(r()*RT.length)];
    d.reto={type:rt,goal:{cantar:d.species.length,pulsos:3,tiempo:8,quieto:20,compas:5,pulsoGrande:8}[rt]};
    const dist=Math.max(Math.abs(rx),Math.abs(ry))*2;d.mix=null;
    if(!origin&&dist>=2&&r()<.3){const el=runtime.BIOMES.map((b,i)=>i).filter(i=>i!==z&&runtime.BIOMES[i].minD<=dist);d.mix=el[Math.floor(r()*el.length)];}
    if(ct.sea)d.mix=null;
    d.kOff=origin?0:(r()-.5)*.24;
    {const TP=runtime.TRACKP[runtime.BIOMES[z].id],pick=a=>a.length?a[Math.floor(r()*a.length)]:null,bass=[],hook=[];let deg=Math.floor(r()*5);
     for(let i=0;i<16;i++){bass.push(i===0?0:r()<TP[2]*(i%4===2?1.6:i%2?.5:1)?[0,0,4,0,3,5,7][Math.floor(r()*7)]:-1);
       if(r()<TP[3]*(i%2?.6:1.3)){deg=Math.max(0,Math.min(9,deg+[-2,-1,1,2,0][Math.floor(r()*5)]));hook.push(deg);}else hook.push(-1);}
     d.track={bassI:pick(TP[0]),hookI:pick(TP[1]),bass,hook,shift:[0,2,-1,4,1][Math.floor(r()*5)]};}
    {const id=runtime.BIOMES[z].id,pk=a=>a[Math.floor(r()*a.length)];
     d.hab=origin?runtime.HAB[0]:pk(runtime.HAB);d.ground=origin?"musgo":pk(runtime.GROUNDP[id]);d.air=origin?"claro":pk(runtime.AIRP[id]);
     const pool=runtime.PLANTP[id].slice(),np=Math.min(pool.length,2+(r()<.4?1:0));d.plants=[];
     for(let i=0;i<np;i++){const t=pool.splice(Math.floor(r()*pool.length),1)[0];d.plants.push({t,h:8+r()*22,pet:4+Math.floor(r()*4),hue:(hue+(i*22)-11+360)%360});}
     d.pal={main:`hsl(${hue},32%,74%)`,soft:`hsl(${hue},22%,50%)`,acc:`hsl(${(hue+28)%360},72%,70%)`,sand:`hsl(${(hue+40)%360},35%,68%)`};}
    {const id=runtime.BIOMES[z].id,pool=runtime.GPOOL[id];d.genre=origin?"minimal":pool[Math.floor(r()*pool.length)];const extra=runtime.EXTRA_GPOOL[id],er=runtime.rng(runtime.seedOf("extra-genres:v1:"+key));
     if(!origin&&extra.length&&er()<.45)d.genre=extra[Math.floor(er()*extra.length)];
     const G=runtime.GEN[d.genre];
     d.bpm=Math.round(G.bpm[0]+r()*(G.bpm[1]-G.bpm[0]));const fr=r();d.fill=origin?runtime.FILL[2]:fr<.15?runtime.FILL[0]:fr<.35?runtime.FILL[1]:fr<.65?runtime.FILL[2]:fr<.85?runtime.FILL[3]:runtime.FILL[4];
     d.track.bassI=G.bassI;d.track.hookI=G.hookP[Math.floor(r()*G.hookP.length)];}
    applyPalette(d,runtime.BIOMES[z].id,origin,runtime.seedOf,runtime.rng);
    d.continent=cont?{id:cont.id,name:cont.name,family:cont.family,familyName:cont.familyName,tonic:cont.tonic,size:cont.size,hue:cont.hue}:null;
    // Más lejos, más raro: criaturas más grandes, colores imposibles y afinación torcida (semilla aparte).
    {const st=strangeness(rx,ry),sr=runtime.rng(runtime.seedOf("strange:v1:"+key));d.strange=st;d.tuneCents=st>.05?Math.round((sr()-.5)*2*55*st):0;
     if(st>0){d.species.forEach(sp=>{sp.cell*=1+1.4*st;});
      const sat=Math.round(32+60*st),acc=(hue+28+Math.round(150*st*sr()))%360;
      d.pal={main:`hsl(${hue},${sat}%,${Math.round(74-14*st)}%)`,soft:`hsl(${(hue+Math.round(60*st))%360},${Math.round(22+50*st)}%,50%)`,acc:`hsl(${acc},${Math.round(72+25*st)}%,${Math.round(70-10*st)}%)`,sand:`hsl(${(hue+40)%360},${Math.round(35+50*st)}%,68%)`};}}d.sea=ct.sea;d.coast=ct.coast;
    d.fill=origin?runtime.FILL[2]:fillOf(continents.vitality((rx+.5)*regionPx(),(ry+.5)*regionPx(),regionPx()));
    applyNeighborhood(d,runtime.BIOMES,runtime.GEN,runtime.seedOf,runtime.rng,continents.at,expanded?`v2:${runtime.S.worldSeed}`:'');
    d.anomaly=anomalyAt(rx,ry,(a,b)=>continents.at(a,b).sea,runtime.seedOf,runtime.rng);
    if(d.anomaly)applyAnomaly(d,d.anomaly.type==='espejo'?regionAt(0,0):null);
    if(expanded){applyEcology(d,B.id,runtime.seedOf,runtime.rng,runtime.S.worldSeed);d.tuneCents=Math.max(-12,Math.min(12,d.tuneCents));}
    d.worldFamily=createWorldFamily(d,B.id,runtime.seedOf,runtime.rng);
    d.recipe=recipeFor(d);
    rcache.set(key,d);return d;
  }
  const EVENTS=[["lluvia","Lluvia de notas","Caen notas del cielo. Atrápalas."],["eclipse","Eclipse","La luz se achica. Todo se escucha más hondo."],["migracion","Migración","Las formas de aquí están viajando."],["aurora","Aurora","El cielo canta en otro color."]];
  function eventOf(d){if(d.evDay!==runtime.S.todayKey){const r=runtime.rng(runtime.seedOf("ev:"+d.key+runtime.S.todayKey));d.ev=d.name!=="Origen"&&r()<.15?EVENTS[Math.floor(r()*4)]:null;
      if(expanded){const er=runtime.rng(runtime.seedOf('ecology:v2:weather:'+d.key+runtime.S.todayKey)),weather=d.ecology.weather;d.ev=d.sea?null:er()<(weather==='rain'?.28:.08)?EVENTS[weather==='rain'?0:weather==='mist'?3:Math.floor(er()*4)]:null;}d.evDay=runtime.S.todayKey;}return d.ev;}
  const RETOTXT={cantar:g=>"Haz cantar las "+g+" formas de aquí",pulsos:()=>"3 pulsos seguidos en el beat",tiempo:()=>"8 luces en tiempo",quieto:()=>"Quieto 20 s, escucha",compas:()=>"5 toques en un compás",pulsoGrande:()=>"8 sonidos con un pulso"};
  const regionOfPos=(x,y)=>regionAt(Math.floor(x/runtime.WCH),Math.floor(y/runtime.WCH));
  function wchunk(cx,cy){
    const id=cx+","+cy;let c=runtime.wchunks.get(id);if(c)return c;
    const dna0=regionAt(cx,cy),r=runtime.rng(runtime.seedOf("mundo:"+id)),z=dna0.mix!=null&&r()<.5?dna0.mix:biomeAt(cx,cy),B=runtime.BIOMES[z],ox=cx*runtime.WCH,oy=cy*runtime.WCH;
    const vr=runtime.rng(runtime.seedOf("var:"+id)),vi=Math.floor(vr()*runtime.VARS.length),vit=continents.vitality(ox+runtime.WCH/2,oy+runtime.WCH/2,regionPx()),dens=(vi===1?1.8:vi===0?.5:1)*continents.densityOf(vit)*(expanded?.25+(dna0.ecology?.density||0)*.55:1);
    const H=dna0.hab||runtime.HAB[0];
    const localRecipe=dna0.recipe.biome===B.id?dna0.recipe:{...recipeFor({...dna0,z}),budgets:dna0.recipe.budgets};
    c={var:vi,dens,vit,pal:dna0.pal,ground:vi===2?"agua":dna0.ground,plants:[],id,z,grass:[],flies:[],walkers:[],ponds:[],pillars:[],motes:[],crystals:[],beacons:[],lotus:[],flowers:[],stal:[],props:[],dunes:B.id==="dunas"};
    const P=()=>[ox+r()*runtime.WCH,oy+r()*runtime.WCH];
    const grass=(groups,tallP)=>{groups=Math.round(groups*dens);for(let g=0;g<groups;g++){const[gx,gy]=P(),n=10+Math.floor(r()*14),tall=r()<tallP;
      for(let i=0;i<n;i++){const a=r()*6.28,d=Math.sqrt(r())*(tall?50:70);c.grass.push({x:gx+Math.cos(a)*d,y:gy+Math.sin(a)*d,h:tall?10+r()*26:3+r()*9,tall,ph:r()*6.28,lit:0});}}};
    const flies=n=>{n=Math.round(n*dens*H[3]*(vi===4?1.6:1));for(let i=0;i<n;i++){const[hx,hy]=P();c.flies.push({hx,hy,x:hx,y:hy,ph:r()*6.28,a:.3+r()*.5,fx:0,fy:0,cd:0});}};
    const walker=p=>{if(r()<p){const[x,y]=P();c.walkers.push({x,y,hx:x,hy:y,a:r()*6.28,near:0,follow:0,done:false,trail:[],lt:null});}};
    switch(B.id){
      case "llanura":grass(9,0);flies(6);if(r()<.35)c.ponds.push({x:ox+150+r()*600,y:oy+150+r()*600,r:70+r()*60});walker(.2);break;
      case "bosque":grass(14,.7);flies(12);walker(.5);break;
      case "lago":{const p={x:ox+runtime.WCH/2+(r()-.5)*200,y:oy+runtime.WCH/2+(r()-.5)*200,r:260+r()*120};c.ponds.push(p);
        for(let i=0;i<16;i++){const a=r()*6.28,d=Math.sqrt(r())*(p.r-30);c.lotus.push({x:p.x+Math.cos(a)*d,y:p.y+Math.sin(a)*d,deg:i%5,lit:0,cd:0,pond:p});}flies(3);grass(3,0);break;}
      case "ruinas":for(let i=0;i<16;i++){const[x,y]=P();c.pillars.push({x,y,w:8+r()*12,h:30+r()*80,hit:0,cd:0});}grass(3,0);walker(.6);break;
      case "jardin":grass(7,0);flies(5);break;
      case "dunas":walker(.3);break;
      case "cristales":for(let i=0;i<Math.round(36*H[4]);i++){const[x,y]=P();c.crystals.push({x,y,s:6+r()*10,rot:r()*6.28,lit:0,cd:0});}flies(2);break;
      case "faros":{const n=1+(r()<.4?1:0);for(let i=0;i<n;i++){const[x,y]=P();c.beacons.push({x,y,layer:Math.floor(r()*3),on:false});}grass(4,0);break;}
      case "tormenta":grass(2,0);break;
      case "cueva":for(let i=0;i<34;i++){const[x,y]=P();c.stal.push({x,y,h:6+r()*22,ph:r()*6.28});}flies(2);break;
      case "vacio":break;
    }
    const dna=regionAt(cx,cy);c.sp=[];dna.species.forEach(sp=>{const n=Math.round((sp.mob?3*H[3]:8*(H[2]+H[4])/2)*dens*(vi===4?1.4:1));for(let i=0;i<n;i++){const[x,y]=P();c.sp.push({x,y,hx:x,hy:y,s:sp,ph:r()*6.28,lit:0,cd:0});}});
    if(vi===2&&!c.ponds.length)c.ponds.push({x:ox+200+r()*500,y:oy+200+r()*500,r:60+r()*50});
    const lxr=((cx%runtime.REG)+runtime.REG)%runtime.REG,lyr=((cy%runtime.REG)+runtime.REG)%runtime.REG,nbs=[];if(lxr===0)nbs.push(regionAt(cx-1,cy));if(lxr===runtime.REG-1)nbs.push(regionAt(cx+1,cy));if(lyr===0)nbs.push(regionAt(cx,cy-1));if(lyr===runtime.REG-1)nbs.push(regionAt(cx,cy+1));
    (dna.plants||[]).forEach(pt0=>{const n=Math.round(14*H[2]*dens);for(let i=0;i<n;i++){const[x,y]=P();const k=1+Math.floor(r()*4);let pt=pt0;if(nbs.length&&r()<.4){const nb=nbs[Math.floor(r()*nbs.length)];if(nb.plants&&nb.plants.length)pt=nb.plants[Math.floor(r()*nb.plants.length)];}for(let j=0;j<k;j++)c.plants.push({x:x+(r()-.5)*40,y:y+(r()-.5)*40,pt,h:pt.h*(.6+r()*.7),ph:r()*6.28,lit:0,cd:0,sw:0});}});
    if(runtime.PROPK[B.id])for(let i=0;i<Math.round(16*dens*H[4]);i++){const[x,y]=P();c.props.push({x,y,k:runtime.PROPK[B.id],i,cd:0,lit:0});}
    const voice=(kind,index,o,q,full=false)=>runtime.playVoice(kind,index+(o.personality?.degree||0),q,runtime.regionOfPos(o.x,o.y),full,o.personality?.volume||1,o);
    c.props.forEach(o=>o.snd=q=>voice(o.k,o.i,o,q));
    c.lotus.forEach(o=>o.snd=q=>voice('loto',o.deg,o,q));
    c.crystals.forEach(o=>o.snd=(q,dep=0)=>voice('cristal',dep,o,q));
    c.pillars.forEach(o=>o.snd=q=>voice('pilar',Math.floor(o.h/10),o,q));
    c.sp.forEach(o=>o.snd=q=>runtime.speciesSound(o.s,q,false,o.personality,o));
    const rd=runtime.rng(runtime.seedOf("notas:"+id+runtime.S.todayKey));
    for(let i=0;i<(B.id==="vacio"?6:18);i++)c.motes.push({x:ox+rd()*runtime.WCH,y:oy+rd()*runtime.WCH,ph:rd()*6});
    c.playthings=createPlaythings(cx,cy,runtime.WCH,dens,B.id,runtime.seedOf,runtime.rng,{recipe:localRecipe,catalog:elementCatalog});
    c.pockets=createPockets(cx,cy,runtime.WCH,runtime.seedOf,runtime.rng);
    distributePlaythings(c.playthings,c.pockets,runtime.seedOf,runtime.rng,localRecipe,runtime.WCH);
    if(expanded){c.ecology=dna0.ecology;c.ecologyObjects=createEcologyObjects(cx,cy,runtime.WCH,dna0,B.id,contentDirectory,runtime.seedOf,runtime.rng,c.pockets,!!runtime.S.previewSeed&&cx===runtime.REG/2&&cy===runtime.REG/2);}
    if(expanded&&dna0.ecology.density===0)for(const field of ['grass','flies','plants','sp','props','playthings'])c[field]=[];
    c.playthings.forEach((o,i)=>{o.snd=q=>runtime.playVoice('toy:'+o.kind,i+(o.personality?.degree||0),q,runtime.regionOfPos(o.x,o.y),false,o.personality?.volume||1,o);});
    attachPersonalities(c,runtime.seedOf,runtime.rng);
    // A few seeded inhabitants near the testing center make a blob preview playable immediately.
    if(/^blobs/i.test(runtime.S.worldSeed||'')&&runtime.S.previewSeed&&cx===runtime.REG/2&&cy===runtime.REG/2){
      const center=regionPx()/2,nr=runtime.rng(runtime.seedOf('blob-nursery:v1'));
      const nursery=dna.species.slice(0,3).map((sp,i)=>{const angle=i*Math.PI*2/3+nr()*.3,distance=65+nr()*35,o={id:`nursery:${dna.key}:${i}`,x:center+Math.cos(angle)*distance,y:center+Math.sin(angle)*distance,s:sp,ph:nr()*6.28,lit:0,cd:0};o.hx=o.x;o.hy=o.y;o.snd=q=>runtime.speciesSound(sp,q,false,o.personality,o);return o;});
      attachPersonalities({id:'nursery:'+id,sp:nursery},runtime.seedOf,runtime.rng);c.sp.unshift(...nursery);
    }
    runtime.wchunks.set(id,c);return c;
  }
  const biomeOfPos=(x,y)=>biomeAt(Math.floor(x/runtime.WCH),Math.floor(y/runtime.WCH));
  // Kept as a runtime alias for existing consumers; sites are no longer daily spawns.
  const todayRelics=()=>runtime.nearbyRelics();
  const relicsGot=()=>runtime.S.stars.filter(star=>star.d===runtime.S.todayKey).length;



  Object.defineProperties(runtime, {
    getChunk: { get: () => getChunk },
    EVENTS: { get: () => EVENTS },
    eventOf: { get: () => eventOf },
    RETOTXT: { get: () => RETOTXT },
    elementCatalog: {get:()=>elementCatalog},recipeFor:{get:()=>recipeFor},
    contentDirectory:{get:()=>contentDirectory},
    worldCacheStats:{get:()=>()=>({regions:rcache.stats(),biomes:runtime.bcache.stats(),worldChunks:runtime.wchunks.stats(),pathChunks:runtime.chunks.stats(),continents:continents.stats()})},
    regionOfPos: { get: () => regionOfPos },
    continents: { get: () => continents },
    vitalityAt: { get: () => (x,y)=>continents.vitality(x,y,regionPx()) },
    wchunk: { get: () => wchunk },
    biomeOfPos: { get: () => biomeOfPos },
    todayRelics: { get: () => todayRelics },
    relicsGot: { get: () => relicsGot },
  });
}
