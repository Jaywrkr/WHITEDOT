import {installNoticeLane} from './notice-lane.js';
import {hybridIdentity} from './musical-hybrids.js';
import { gravityOf } from './gravity.js';
import {soundingBpm} from './genre-tempo.js';

// Catálogo, retos y recompensas de exploración.
export function initialize(runtime) {
  const notices=installNoticeLane(runtime);
  function discover(sp){runtime.recordElement?.('forma:'+sp.id,runtime.regionOfPos(runtime.S.wx,runtime.S.wy));if(runtime.S.cat[sp.id])return;runtime.S.cat[sp.id]=1;runtime.S.catN=(runtime.S.catN||0)+1;runtime.S.catRecent=[{n:sp.name,r:sp.region,d:runtime.S.todayKey}].concat(runtime.S.catRecent||[]).slice(0,40);
    runtime.toast("<em>Forma nueva</em> · "+sp.name+" · "+runtime.S.catN);runtime.unlock("forma1");if(runtime.S.catN>=25)runtime.unlock("cat25");if(runtime.S.catN>=100)runtime.unlock("cat100");if(runtime.S.catN>=500)runtime.unlock("cat500");runtime.save();}
  function showRegion(d,first){
    const el=document.getElementById("zone");const render=()=>{
    const hybrid=hybridIdentity(d,runtime.seedOf,runtime.rng);const se=!d.sea&&d.continent?runtime.seasonOf?.(d.continent.id):null;const sb=runtime.superbiomeOf?.(d,runtime.S.wx,runtime.S.wy);document.getElementById("zMood").textContent=(sb?sb.name+(sb.rarity==="raro"||sb.rarity==="muy-raro"?" ("+(sb.rarity==="raro"?"raro":"muy raro")+")":"")+" — ":"")+runtime.GEN[d.genre].name+(hybrid?" × "+hybrid.name:"")+" · "+soundingBpm(d,runtime.GEN)+" BPM"+(se?" · "+se.name:"");
    document.getElementById("zName").textContent=d.worldFamily?.name||d.ecology?.name||d.name;
    document.getElementById("zDo").textContent=(d.sea?(runtime.newRegionAt?.(runtime.S.wx,runtime.S.wy)?.name||"Abismo de silencio"):d.continent?d.continent.name:"")+(d.sea||d.continent?" · ":"")+gravityOf(d,runtime.seedOf).name+" · "+gravityOf(d,runtime.seedOf).movement;
    };render();notices.enqueue('zone',el,()=>{},first?3.2:2.2,'region:'+d.key,()=>runtime.inWorld()&&runtime.MU.dnaT?.key===d.key,{level:1,category:'territorio',coalesce:true});
  }

  let curRegion=null,RP=null;
  function retoUI(){const el=document.getElementById("reto");if(!RP||!runtime.inWorld()||runtime.S.retos[RP.key]){el.hidden=true;return;}el.hidden=false;
    el.textContent="Reto · "+runtime.RETOTXT[RP.type](RP.goal)+" · "+Math.min(RP.goal,Math.floor(RP.val))+" / "+RP.goal;}
  function retoSet(type,v){if(!RP||RP.type!==type||runtime.S.retos[RP.key])return;RP.val=v;retoUI();if(RP.val>=RP.goal)retoDone();}
  function retoDone(){runtime.S.retos[RP.key]=1;runtime.S.retosN=(runtime.S.retosN||0)+1;const ks=Object.keys(runtime.SAMPLES).slice(0,8),k=ks[Math.floor(Math.random()*ks.length)];
    runtime.flash=.8;runtime.pulse=1;burst(runtime.S.wx,runtime.S.wy,30,true);runtime.soon(q=>runtime.chordTones().forEach((n,i)=>runtime.pluck(n+12,q+i*runtime.SIX,runtime.vel(.08),4)));
    runtime.say(runtime.VOZ.reto,"Reto cumplido");runtime.gain(k);runtime.unlock("reto1");if(runtime.S.retosN>=10)runtime.unlock("reto10");if(runtime.S.retosN>=50)runtime.unlock("reto50");retoUI();runtime.save();}
  function touched(){runtime.visualGesture?.();runtime.sessionAction?.("touch");runtime.markInput?.();if(!RP||RP.type!=="compas")return;const n=performance.now();RP.touches=RP.touches.filter(x=>n-x<runtime.SIX*16*1000);RP.touches.push(n);retoSet("compas",RP.touches.length);}
  function enterRegion(d,z){
    if(d.ecology){runtime.S.journal.ecologies||={};runtime.S.journal.ecologies[d.ecology.id]=1;}
    runtime.sessionVisit?.(d);
    runtime.MU.dnaT=d;runtime.MU.timbre=runtime.GEN[d.genre].pt;const newPlace=!runtime.S.places[d.key];
    RP=runtime.S.retos[d.key]?null:{key:d.key,type:d.reto.type,goal:d.reto.goal,val:0,set:new Set(),touches:[],pst:0};retoUI();
    if(d.mix!=null)runtime.unlock("frontera");
    const ev=runtime.eventOf(d);if(ev&&!runtime.S.events[ev[0]+":"+d.key+runtime.S.todayKey]){runtime.S.events[ev[0]+":"+d.key+runtime.S.todayKey]=1;runtime.S.events[ev[0]]=1;runtime.unlock("evento1");if(runtime.EVENTS.every(e=>runtime.S.events[e[0]]))runtime.unlock("eventos4");runtime.say(runtime.VOZ[ev[0]],"Evento · "+ev[1]);}
    if(newPlace){runtime.S.places[d.key]=1;runtime.S.placesN=(runtime.S.placesN||0)+1;if(runtime.S.placesN>=10)runtime.unlock("lugar10");if(runtime.S.placesN>=50)runtime.unlock("lugar50");if(runtime.S.placesN>=200)runtime.unlock("lugar200");}
    if(z!==runtime.curZone){runtime.curZone=z;enterZone(z);}
    runtime.recordSuperbiome?.(runtime.superbiomeOf?.(d,runtime.S.wx,runtime.S.wy));   // superbiomes.js
    showRegion(d,newPlace);continentChange(d);farLands(d);runtime.enterAnomaly?.(d);
    if(newPlace&&runtime.S.placesN%15===0)setTimeout(()=>runtime.rumor?.(),6000);
    runtime.save();
  }
  // Escala grande: aviso al cambiar de continente o entrar a un mar de silencio.
  let lastLand=null,wasSea=false,lastNew=null;
  // El aviso grande espera a que no haya tarjeta, toast ni Voz en pantalla (si no, la interfaz lo oculta).
  function announce(text,big){runtime.showPhrase(text,big);}
  function continentChange(d){
    const S=runtime.S;S.continents||={};
    if(d.sea){const nueva=runtime.newRegionAt?.(runtime.S.wx,runtime.S.wy);if(nueva&&nueva.id!==lastNew){lastNew=nueva.id;announce(nueva.name,false);}else if(!nueva)lastNew=null;if(!wasSea){wasSea=true;if(!nueva)announce("Abismo de silencio",false);if(!S.help.mar){S.help.mar=true;runtime.say(runtime.VOZ.mar);}}return;}
    const crossed=wasSea&&lastLand!==null&&d.continent&&d.continent.id!==lastLand;if(crossed)runtime.unlock('mar1');
    wasSea=false;const k=d.continent;if(!k||k.id===lastLand)return;
    const first=lastLand!==null;lastLand=k.id;
    const isNew=!S.continents[k.id];if(isNew){S.continents[k.id]=S.todayKey;S.continentsN=(S.continentsN||0)+1;}
    announce(`${k.name} · ${k.size} · ${k.familyName} · tono de ${k.tonic}`,true);
    if(first&&isNew&&S.continentsN===2)runtime.say(runtime.VOZ.continente);
    if(first&&isNew)setTimeout(()=>runtime.rumor?.(),9000);
    if(S.continentsN>=3)runtime.unlock('continente3');
  }
  // Distancia: récord, afinación torcida y aviso al entrar a las tierras raras.
  function farLands(d){
    const S=runtime.S,[rx,ry]=d.key.split(',').map(Number),ring=Math.max(Math.abs(rx),Math.abs(ry));
    runtime.MU.tune=d.tuneCents||0;
    if(ring>(S.maxRing||0)){S.maxRing=ring;S.maxRingDay=S.todayKey;
      if(ring>=10)runtime.unlock('lejos10');if(ring>=30)runtime.unlock('lejos30');if(ring>=60)runtime.unlock('lejos60');
      if(ring>=5&&ring%5===0)runtime.toast(`<em>Récord</em> · ${ring} regiones del Origen`);}
    if((d.strange||0)>.35&&!S.help.raro){S.help.raro=true;runtime.say(runtime.VOZ.raro,'Tierras raras');}
  }
  const resetContinent=()=>{lastLand=null;wasSea=false;runtime.MU.tune=0;};
  function showZone(z,first){
    const B=runtime.BIOMES[z],Z=runtime.ZINFO[B.id],el=document.getElementById("zone");notices.enqueue('zone',el,()=>{
    document.getElementById("zMood").textContent=Z[0]+" · "+Z[1]+" · "+Math.round(92+runtime.style()*30+B.bpm)+" BPM";
    document.getElementById("zName").textContent=B.name;
    document.getElementById("zDo").textContent=Z[2].join(" · ");
    },first?4:3,'biome:'+z,()=>!runtime.inWorld());
  }
  function burst(x,y,n,gold){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=40+Math.random()*120;runtime.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,g:gold});}}
  function seen(id){if(runtime.S.species[id])return;runtime.S.species[id]=runtime.S.todayKey;const n=Object.keys(runtime.S.species).length;runtime.toast("<em>Vida</em> · "+runtime.SPECIES.find(s=>s[0]===id)[1]+" · "+n+" / "+runtime.SPECIES.length);if(n>=runtime.SPECIES.length)runtime.unlock("vida");runtime.save();}

  function collect(m){
    runtime.collected.add(m.id);runtime.S.collected.push(m.id);
    const c=runtime.chunks.get(m.id.split(",").slice(0,2).join(","));if(c){const i=c.indexOf(m);if(i>=0)c.splice(i,1);}
    if(runtime.isFree()){runtime.playerNote(.06);burst(m.x,m.y,4,false);if(runtime.S.capPlusDay!==runtime.S.todayKey){runtime.S.capPlusDay=runtime.S.todayKey;runtime.say(runtime.VOZ.capPlus);}return;}
    runtime.S.luzN=(runtime.S.luzN||0)+1;if(runtime.S.luzN%20===0)runtime.gain("luz");
    if(runtime.S.lastDay!==runtime.S.todayKey) runtime.onFirstLight();
    const r=Math.random(), gold=r<(m.off?.25:.05), big=!gold&&r<(m.off?.6:.25);
    const val=gold?10:big?3:1, before=runtime.level();
    const first=runtime.S.todayLight===0,added=Math.min(val,runtime.CAP-runtime.S.todayLight);runtime.S.todayLight+=added;runtime.S.totalLight+=added;
    if(first)runtime.toast?.('Sigue el Camino. Abre el Mundo con diez cristales.');
    runtime.playerNote(big?.17:.14,gold);
    if(gold){runtime.flash=1;runtime.unlock("dorada");}
    burst(m.x,m.y,gold?18:6,gold||runtime.grooveFx>.9);
    const L=runtime.level();
    if(L>before){runtime.pulse=1;runtime.showPhrase(runtime.PHRASES[(L-1)%runtime.PHRASES.length]);if(L>=10)runtime.unlock("s10");}
    if(runtime.isFree()&&!runtime.S.capShown){runtime.S.capShown=true;runtime.unlock("tope");setTimeout(runtime.openCap,700);}
    runtime.hud();
  }

  function takeRelic(rl){runtime.recordElement?.('relic',runtime.regionOfPos(rl.x,rl.y));
    if(rl.got||rl.id&&runtime.S.relicSites?.[rl.id])return;
    if(rl.id&&runtime.collectRareCard){const voice=runtime.getVoice('reliquia',runtime.regionOfPos(rl.x,rl.y),rl);runtime.collectRareCard?.(rl.magical?'relic:magical':'relic:ordinary',rl,{context:{role:voice.role,instrument:voice.instrument}});}
    rl.got=true;runtime.rareCreativeFind?.(rl);
    if(rl.id){runtime.S.relicSites||={};runtime.S.relicSites[rl.id]={day:runtime.S.todayKey,name:rl.name};}
    const idx=runtime.S.stars.length;runtime.S.stars.push({d:runtime.S.todayKey,s:rl.s,name:rl.name,id:rl.id,magical:!!rl.magical,p:idx%runtime.ECOS.length,region:runtime.regionOfPos(rl.x,rl.y).key});
    runtime.flash=Math.max(runtime.flash,.15);runtime.pulse=.35;burst(rl.x,rl.y,12,true);
    const region=runtime.regionOfPos(rl.x,rl.y);runtime.soon(t=>runtime.playVoice('reliquia',0,t,region,true,.6,rl,'player'));
    const n=runtime.relicsGot();
    runtime.showPhrase(runtime.ECOS[idx%runtime.ECOS.length],true);
    runtime.toast("<em>Estrella "+runtime.S.stars.length+"</em> · "+(rl.name||"Reliquia"));
    runtime.unlock("estrella1");if(n>=3){runtime.unlock("dia3");setTimeout(()=>runtime.showPhrase("Tres hallazgos en un día. El mundo todavía guarda secretos."),5200);}
    if(runtime.S.stars.length>=30)runtime.unlock("e30");if(runtime.S.stars.length>=100)runtime.unlock("e100");
    runtime.save();runtime.hud();
  }

  function enterZone(z){
    const B=runtime.BIOMES[z];runtime.setBiome(z);runtime.zoneHops++;if(runtime.zoneHops>=10)runtime.unlock("turista");
    const isNew=!runtime.S.zones[B.id];
    if(isNew){runtime.S.zones[B.id]=runtime.S.todayKey;const n=Object.keys(runtime.S.zones).length;
      if(n>1)runtime.toast("<em>Familia nueva</em> · "+B.name+" · "+n+" / "+runtime.BIOMES.length);
      if(n>=5)runtime.unlock("zona5");if(n>=runtime.BIOMES.length)runtime.unlock("atlas");runtime.save();}
  }


  Object.defineProperties(runtime, {
    discover: { get: () => discover },
    showRegion: { get: () => showRegion },
    curRegion: { get: () => curRegion, set: value => { curRegion = value; } },
    RP: { get: () => RP, set: value => { RP = value; } },
    retoUI: { get: () => retoUI },
    retoSet: { get: () => retoSet },
    touched: { get: () => touched },
    enterRegion: { get: () => enterRegion },
    resetContinent: { get: () => resetContinent },
    burst: { get: () => burst },
    seen: { get: () => seen },
    collect: { get: () => collect },
    takeRelic: { get: () => takeRelic },
  });
}
